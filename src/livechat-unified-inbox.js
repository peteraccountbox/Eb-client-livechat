var EhLiveChat = {
	get_iframe_id: 'engagebayMessenger__' + new Date().getTime()
		+ Math.ceil(Math.random() * 100000),
	open_chat: function () {
		try {
			var iframe = document.getElementById(EhLiveChat.get_iframe_id);
			var content = (iframe.contentWindow.document || iframe.contentDocument);
			if (!content)
				return;

			content.getElementsByClassName('chat__trigger-message')[0].click()

		} catch (e) {
		}
	}
};

function EngageBay_Migration_LiveChat() {
	this.lcReactVersion = "1-0";

	this.init = function () {
		var channelIds = [];
		try {
			var widgetContainers = document.querySelectorAll('[class^="engagebay-chat-widget"]');
			console.log("widgetContainers ", widgetContainers);

			var self = this;
			Array.prototype.forEach.call(widgetContainers, function (element) {
				channelIds.push(element.getAttribute("data-id"));
			});

			EhAsync.get(
				"https://eb-webhooks.engagebay.com/channel/get-active-channel-by-ids?apiKey=" +
				EhAccount.getKey() +
				"&channelIds=" +
				channelIds.join(","),
				{},
				function (response) {
					var selectedChannel, channelId;

					if (response) {
						Array.prototype.forEach.call(response, function (channel) {
							var widgetContainer = document.querySelector(
								'[class^="engagebay-chat-widget"][data-id="' + channel.id + '"]'
							);

							if (channel.systemCreated) {
								selectedChannel = channel;
							} else if (
								!channel.meta.deactivated &&
								widgetContainer &&
								(!selectedChannel || selectedChannel.systemCreated)
							) {
								selectedChannel = channel;
								channelId = channel.id;
								self.loadChat(widgetContainer, channel);
							}
						});
					}

					if (!channelId && selectedChannel) {
						var widgetContainer = self.createEle("div", {
							"class": "engagebay-chat-widget",
							"data-id": selectedChannel.id
						});
						document.body.appendChild(widgetContainer);

						if (!selectedChannel.meta.deactivated && widgetContainer) {
							self.loadChat(widgetContainer, selectedChannel);
						}
					}
				},
				function (error) {
					EhLog.log(error);
				}
			);
		} catch (error) {
			console.log("error: ", error);
		}
	};
    this.loadLivechatWidget = function (response) {
        var selectedChannel, channelId;

                    if (response) {
                        Array.prototype.forEach.call(response, function (channel) {
                            var widgetContainer = document.querySelector(
                                '[class^="engagebay-chat-widget"][data-id="' + channel.id + '"]'
                            );

                            if (channel.systemCreated) {
                                selectedChannel = channel;
                            } else if (
                                !channel.meta.deactivated &&
                                widgetContainer &&
                                (!selectedChannel || selectedChannel.systemCreated)
                            ) {
                                selectedChannel = channel;
                                channelId = channel.id;
                                self.loadChat(widgetContainer, channel);
                            }
                        });
                    }

                    if (!channelId && selectedChannel) {
                        var widgetContainer = self.createEle("div", {
                            "class": "engagebay-chat-widget",
                            "data-id": selectedChannel.id
                        });
                        document.body.appendChild(widgetContainer);

                        if (!selectedChannel.meta.deactivated && widgetContainer) {
                            self.loadChat(widgetContainer, selectedChannel);
                        }
                    }
    };
	this.getVisitorKey = function () {
		var name = EngHub_Storage.id_pref_name;
		return EhGrabberVisitor.getVisitorPref("", name);
	};
	this.loadChat = function (container, prefs) {
		var filePrefix = EhAccount.getAppURL() + "/livechat-react-unified/",
			suffix = "",
			jsFiles = ["main/main.min.js"];

		if (!EhAccount.version || (EhAccount.version && EhAccount.version != "localhost")) {
			filePrefix = EhAccount.cloudPathURl + "livechat-react-unified/"
				+ (EhAccount.version || this.lcReactVersion) + "/";
			fileSuffix = "?" + new Date().getTime();
		}

		if (!prefs || prefs.meta.deactivated || (prefs.meta.hideOnMobile && this.isMobileDevice())) return;

		var renderedFrame = container.getElementsByTagName("iframe");
		if (renderedFrame && renderedFrame.length > 0) return;

		if (prefs.botPrefs) {
			try {
				console.log("botPrefs:::", prefs.botPrefs);
				eh_validate_rules(prefs.botPrefs);
			} catch (e) {
				prefs.botPrefs = null;
				EhLog.log(e);
			}
		}

		var frameId = eh_generate_uuidv4();
		container.appendChild(this.loadGlobalCSS("450", prefs));

		var iframeEle = this.createEle("iframe", {
			"class": "engagebay-messenger-frame " + prefs.meta.decoration.widgetAlignment + " " + prefs.id,
			"name": "engagebay-messenger-frame",
			"id": frameId
		});
		container.appendChild(iframeEle);

		var html = '<head><meta charset="UTF-8"><meta name="color-scheme" content="no-scheme">' +
			'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
			'<title>EngageBay Live Chat</title><base target="_parent"></head><body><div id="root"></div>';

		html += '<script type="text/javascript">' +
			'window.TENANT_ID="' + prefs.tenantId + '";' +
			'window.CHANNEL_PREFS=' + JSON.stringify(prefs) + ';' +
			'window.CHANNEL_ID="' + prefs.id + '";' +
			'window.FRAME_REF_ID="' + frameId + '";' +
			'window.VISITOR_UUID="' + this.getVisitorKey() + '";' +
			'window.API_KEY="' + EhAccount.getKey() + '";' +
			'window.SERVER_HOST_DOMAIN_URL="https://qa.engagebay.com/";' +
			'</script>';

		for (var i = 0; i < jsFiles.length; i++) {
			html += '<script src="' + filePrefix + jsFiles[i] + suffix + '" type="text/javascript"></script>';
		}
		html += "</body>";

		var frame = container.getElementsByTagName("iframe")[0];
		if (frame && frame.contentDocument) {
			var frameDoc = frame.contentDocument;
			frameDoc.open();
			frameDoc.write(html);
			frameDoc.close();
		}
	};

	this.loadGlobalCSS = function (widgetWidth, prefs) {
		var position = prefs.meta.decoration.widgetAlignment.split(" ")[1];
		var css =
			'.engagebay-chat-widget[data-id="' + prefs.id + '"] {bottom: 0px; ' +
			position + ': 0px; height: 100%; z-index: 2147483000 !important; position: fixed !important;' +
			'max-width: 100%;width: ' + (widgetWidth ? widgetWidth : '450') +
			'px !important; min-height: 100px; max-height: 710px; opacity: 1 !important;' +
			'border-radius: 0px !important; overflow: hidden !important;}';

		css += '.engagebay-messenger-frame { position: absolute; width: 100% !important; height: 100% !important; background-color: transparent; border: none; }';
		css += '.engagebay-messenger-frame.bottom.right { right: 0; }';
		css += '.engagebay-messenger-frame.bottom.left { left: 0; }';
		return this.createStyle(css);
	};

	this.createEle = function (tag, attrs) {
		var el = document.createElement(tag);
		if (typeof attrs === "object") {
			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) el.setAttribute(key, attrs[key]);
			}
		}
		return el;
	};

	this.isMobileDevice = function () {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	};

	this.createStyle = function (cssText) {
		var style = this.createEle("style", { id: "engagebay-styles", type: "text/css" });
		if (style.styleSheet) style.styleSheet.cssText = cssText;
		else style.appendChild(document.createTextNode(cssText));
		return style;
	};
}