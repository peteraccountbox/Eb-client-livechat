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
/**
 * Livechat from EngageBay
 */
function EngageBay_Livechat(settings) {

	// Global reference to call anywhere
	if (!EngageBay_Livechat.ref)
		EngageBay_Livechat.ref = this;

	// Set Version
	this.lcVersion = "8-0";
	this.lcReactVersion = "1-22";

	this.mobileClass = "livechat-sm";
	// Global settings
	// Global settings
	if (settings) {
		try {
			this.settings = JSON.parse(settings);
		} catch (e) {
			console.error(e);
		}
		try {
			// Validate AI bot rules if any
			// var botPrefs = this.settings.botPrefs.slice().sort(customSortBasedOnRule);
			var botPrefs = this.settings.botPrefs;
			var flowPrefs = this.settings.flowPrefs;
			if (botPrefs && botPrefs.length > 0) {
				// Send each `bot to the web rule validator
				for (var i = 0; i < botPrefs.length; i++) {
					try {
						// do not validate rules in preview
						eh_validate_rules(botPrefs[i]);
						// As valid rule, Setting matched pref as global to access in livechat
						this.settings.matchedBotPrefs = botPrefs[i];
						break;
					} catch (e) {
						EhLog.log(e);
					}
				}
			}
			if (flowPrefs && flowPrefs.length > 0) {
				// Send each `bot to the web rule validator
				for (var i = 0; i < flowPrefs.length; i++) {
					try {
						EhLog.log("flowPrefs:::", flowPrefs[i]);
						// do not validate rules in preview
						EhLog.log("flowPrefs which have rules:::", flowPrefs[i]);
						eh_validate_rules(flowPrefs[i]);
						// As valid rule, Setting matched pref as global to access in livechat
						this.settings.matchedFlowPrefs = flowPrefs[i];
						EhLog.log("this.settings.matchedFlowPrefs:::", this.settings.matchedFlowPrefs)
						break;
					} catch (e) {
						EhLog.log(e);
					}
				}
			}
		} catch (e) {
			EhLog.log(e);
		}
	}
	this.loadWidget = function () {

		if (EhAccount.isLivechatDisabled()) {
			EhLog.log("Livechat is disabled on this");
			return;
		}

		//      if (!this.settings.widget.chatEnabled
		//          || (this.settings.widget.hideOnMobile && EhGrabberVisitor.getBrowserInfo().mobile))
		//          return;

		// Check business Hour
		//		if (!this.settings.isDomainBusinessHour
		//			&& (!EngHub_Storage.get_local_pref("engagebay-window-open") || EngHub_Storage.get_local_pref("engagebay-window-open") == 'false'))
		//			return;

		// Create parent containers
		var el = this.createEle("div", {
			id: "engagebay-container",
			"data-id": this.settings.id,
			"class": "engagebay-namespace engagebay-chat-widget"
		});
		// el.appendChild(this.createEle("div", {
		// 	"id": "engagebay-app"
		// }));
		// App container

		// var reactWidget = (this.settings.widget.widgetVersion && this.settings.widget.widgetVersion == "V2") ||  this.settings.botPrefs && this.settings.botPrefs.length > 0;
		var reactWidget = true;

		el.appendChild(this.loadGlobalCSS(((reactWidget) ? "450" : "376")));
		// Global chat holder
		// el.appendChild(this.createEle("div", {
		// 	"class": "css-e37nxn2 engagebay-gradient-enter-done2",
		// }));
		// var css = "engagebay-messenger-frame css-iqgqqm engagebay-messenger-frame-enter-done " + ((reactWidget) ? "react-widget" : "vue-widget");
		// var $iframeHolder = this.createEle("div", {
		// 	"class": css
		// });
		el.appendChild(this.createEle("iframe", {
			"class": "engagebay-messenger-frame css-1k4m9tg e1oluflk1",
			"name": "engagebay-messenger-frame",
			"id": EhLiveChat.get_iframe_id,
			"title": "EngageBay Live Chat",
		}));
		// el.appendChild($iframeHolder);
		document.getElementsByTagName("body")[0].appendChild(el);
		// Load vue loader into frame
		if (reactWidget) {
			this.loadReactChat();
		} else
			this.loadVueChat();
		// Load chats
		EhLog.log("loadWidget loaded");
		// Init events after app initiated
		this.initEvents();
	}
	this.initEvents = function () {
		var el = document
			.getElementsByClassName("engagebay-chat-widget")[0], that = this;
		var frame = this.getFrameByName("engagebay-messenger-frame"), appEl;
		if (frame) {
			frame = frame.document || frame;
			appEl = frame.getElementsByClassName("engagebay-viewport");
		}
		if (!appEl || !appEl.length) {
			setTimeout(function () {
				that.initEvents();
			}, 50);
			return;
		}
		appEl = appEl[0];
		function resize() {
			try {
				// Get width and height of the window excluding scrollbars
				var w = document.documentElement.clientWidth, h = document.documentElement.clientHeight;
				// Make it mobile compatable
				if (w > 767) {
					el.classList.remove(that.mobileClass);
					if (appEl)
						appEl.classList.remove(that.mobileClass);
				} else {
					el.classList.add(that.mobileClass);
					if (appEl)
						appEl.classList.add(that.mobileClass);
				}
			} catch (e) {
				console.error(e);
			}
		}
		window.addEventListener("resize", resize);
		resize();
	},
	this.loadGlobalCSS = function (widgetWidth) {
		var position = this.settings.widget.position.toLowerCase();
		var css =
        '.engagebay-chat-widget[data-id="' + this.settings.id + '"] {bottom: 0px; ' +
        position + ': 0px; height: 100%; z-index: 2147483000 !important; position: fixed !important;' +
        'max-width: 100%;width: ' + (widgetWidth ? widgetWidth : '450') +
        'px !important; min-height: 100px; max-height: 710px; opacity: 1 !important;' +
        'border-radius: 0px !important; overflow: hidden !important;}';

    css += '.engagebay-messenger-frame { position: absolute; width: 100% !important; height: 100% !important; background-color: transparent; border: none; }';
    css += '.engagebay-messenger-frame.bottom.right { right: 0; }';
    css += '.engagebay-messenger-frame.bottom.left { left: 0; }';
    return this.createStyle(css);
		var css = '.engagebay-namespace .css-e37nxn {z-index: 2147482998;position: fixed;width: 500px;height: 500px;bottom: 0px;'
			+ position
			+ ': 0px; content: "";pointer-events: none;/*background: radial-gradient(at '
			+ position
			+ ' bottom, rgba(29, 39, 54, 0.16) 0%, rgba(29, 39, 54, 0) 72%);*/}';

		css += '.engagebay-namespace .css-iqgqqm {bottom: 0px; '
			+ position
			+ ': 0px; height: 100%; z-index: 2147483000 !important; position: fixed !important; max-width: 100%;width: ' + (widgetWidth ? widgetWidth : '376') + 'px !important; min-height: 100px; max-height: 710px;'
			+ 'opacity: 1 !important; border-radius: 0px !important; overflow: hidden !important;}';

		css += '.engagebay-namespace .css-iqgqqm > iframe {position: absolute; width: 100% !important;height: 100% !important;min-height:0 !important;background-color: transparent; box-shadow: none;box-sizing: content-box; border: none;left: 0px;margin-left: 0 !important;margin-right: 0 !important;color-scheme:none !important}';
		css += '.engagebay-namespace .frame-closed {width: 100px !important; height: 100px !important;}';
		css += '.engagebay-namespace > iframe > html, .engagebay-namespace > iframe > body {margin:0px; padding: 0px; border: none;}';
		// Mobile view CSS
		css += '.engagebay-namespace .' + this.mobileClass
			+ ' { width: 100%; min-height: auto; height: 100%;}';
		return this.createStyle(css);
	}
	this.createStyle = function (cssText) {
		var style = this.createEle("style", {
			id: "engagebay-styles",
			type: "text/css"
		});
		if (style.styleSheet) {
			style.styleSheet.cssText = cssText;
		} else {
			style.appendChild(document.createTextNode(cssText));
		}
		return style;
	}
	this.getFrameByName = function (name) {
		var frame = document.getElementsByName(name)[0];
		return frame.contentWindow || frame.contentDocument.document
			|| frame.contentDocument;
	}
	this.loadReactChat = function () {

		// Get list of vendor file path to load
		var filePrefix = EhAccount.getAppURL() + "/livechat-react/", suffix = "";
		var fileSuffix = "";
		var jsFiles = ["main/main.min.js"];
		// var cssFiles = ["css/main.css"];
		if (!EhAccount.version || (EhAccount.version && EhAccount.version != "localhost")) {
			filePrefix = EhAccount.cloudPathURl + "/livechat-react/"
				+ (EhAccount.version || this.lcReactVersion) + "/";
			fileSuffix = "?" + new Date().getTime();
		}
		var html = '<head><meta charset="UTF-8"><meta name="color-scheme" content="no-scheme"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>EngageBay Live Chat</title><base target="_parent">'
		// for (var i = 0; i < cssFiles.length; i++) {
		//  html += '<link href="' + filePrefix + cssFiles[i]
		//      + suffix + '" rel=stylesheet />';
		// }
		html += '</head><body><div id=root></div>';
		html += '<script type="text/javascript">window.DOMAIN_ID="' + EhAccount.getTenantId() + '";window.VISITOR_ID = "' + EngageBay_Livechat.ref.getVisitorKey() + '"; window.API_KEY = "' + EhAccount.getKey() + '";window.SERVER_HOST_DOMAIN_URL="' + EhAccount.getAppURL() + '/";</script>';
		// JS
		for (var i = 0; i < jsFiles.length; i++) {
			html += '<script src="' + filePrefix + jsFiles[i]
				+ suffix + '" type="text/javascript"></script>';
		}
		// End of Body
		html += '</body>';
		var frame = this.getFrameByName("engagebay-messenger-frame");
		frame.document.open();
		frame.document.write(html);
		frame.document.close();
	}
	this.loadVueChat = function () {
		// Get list of vendor file path to load
		var widgetFilesPath = EhAccount.getAppURL() + "/livechat-widget/", suffix = "";
		if (!EhAccount.version || EhAccount.version != "localhost") {
			widgetFilesPath = EhAccount.cloudPathURl + "/livechat/"
				+ (this.lcVersion) + "/";
			if (EhAccount.version)
				suffix = "?_=" + new Date().getTime();
		}
		var jsFiles = ["chunk-vendors.js", "app.js"], cssFiles = [];
		/*
		 * cssFiles.push("_theme_" +
		 * EngageBay_Livechat.ref.settings.widget.colorCode.replace("#",
		 * '').toUpperCase() + ".css");
		 */
		var html = '<head><meta charset="UTF-8"><meta name="color-scheme" content="no-scheme"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>EngageBay Live Chat</title><base target="_parent">'
		// Mootools fix
		if (typeof MooTools !== "object") {
			// CSS
			for (var i = 0; i < cssFiles.length; i++) {
				html += '<link href="' + widgetFilesPath + "css/"
					+ cssFiles[i] + suffix + '" rel=preload as=style />';
				html += '<link href="' + widgetFilesPath + "css/"
					+ cssFiles[i] + suffix + '" rel=stylesheet />';
			}
			// JS
			for (var i = 0; i < jsFiles.length; i++) {
				html += '<link href="' + widgetFilesPath + "js/" + jsFiles[i]
					+ suffix + '" rel=preload as=script>';
			}
		}
		html += '</head><body><div id=app></div>';
		// JS
		for (var i = 0; i < jsFiles.length; i++) {
			html += '<script src="' + widgetFilesPath + "js/" + jsFiles[i]
				+ suffix + '" type="text/javascript"></script>';
		}
		// End of Body
		html += '</body>';
		var frame = this.getFrameByName("engagebay-messenger-frame");
		frame.document.open();
		frame.document.write(html);
		frame.document.close();
	}
	this.createEle = function (tag, attrs) {
		var el = document.createElement(tag);
		if (typeof (attrs) === 'object') {
			for (var key in attrs) {
				el.setAttribute(key, attrs[key]);
			}
		}
		return el;
	}
	/**
	 * UI functions to reset heights
	 */
	this.UI = function () {
		var that = EngageBay_Livechat.ref;
		return {
			resize: function (type) {
				EhLog.log("resize", type);
				var el = document
					.getElementsByClassName("engagebay-chat-widget")[0];
				if (!el)
					return;
				// el.removeAttribute('style');
				// that.UI().toggleClass(el, "frame-closed", "REMOVE");
				// Get frame
				var iframe = el.getElementsByTagName("iframe")[0];
				var frameDocument = (iframe.contentWindow || iframe.contentDocument);
				frameDocument = frameDocument.document || frameDocument;
				// Set height on type
				if (type == "WINDOW_CLOSED") {
					// setTimeout(function () {
					// el.style.height = "120px";
					// el.style.width = "120px";
					el.style.setProperty("height", "100px", "important");
					el.style.setProperty("width", "100px", "important");
					/// that.UI().toggleClass(el, "frame-closed");
					// }, 100);
				} else if (type == "PROMPT_OPENED" || type == "WINDOW_OPENED_LARGE") {

					if (type == "WINDOW_OPENED_LARGE") {
						el.style.setProperty("width", "730px", "important");
					}

					setTimeout(
						function () {

							if (type == "WINDOW_OPENED_LARGE") {
								el.style.setProperty("width", "730px", "important");
							}

							var frameheight = frameDocument
								.getElementsByClassName("chat__prompt")[0].scrollHeight;
							el.style.height = frameheight + 180 + "px";
						}, 200);
					// el.style.height = "calc(100% - 30%)";

				} else if (type == "LIVECHAT_WRAPPER_CLOSED") {
					el.style.setProperty("height", "0px", "important");
					el.style.setProperty("width", "0px", "important");
				} else if (type == "WINDOW_OPENED") {
					el.style.setProperty("height", "100%");
					el.style.setProperty("width", "450px", "important");
				} else {
					el.style.setProperty("display", "none", "important");
				}

				if (eh_is_mobile_browser()) {
					frameDocument.getElementsByClassName("chat__main")[0].classList
						.add("chat__mobile")
				}
			},
			show: function () {
				EhLog.log("show", that.settings)
			},
			toggleClass: function (el, className, action) {
				if (action == "REMOVE")
					el.classList.remove(className);
				else
					el.classList.add(className);
			}
		}
	}
	this.getAPIKey = function () {
		return EhAccount.getKey();
	}
	this.getVisitorKey = function () {
		var name = EngHub_Storage.id_pref_name;
		return EhGrabberVisitor.getVisitorPref("", name);
	}
	this.getAppURL = function () {
		return EhAccount.getAppURL();
	}
	this.visibleFrame = function () {
		var frame = document.getElementsByName("engagebay-messenger-frame")[0];
		if (!frame)
			return;
	}
	this.getDomainId = function () {
		return EhAccount.getTenantId();
	}

	this.getChatBotStatus = function () {
		return EhAccount.getChatBotStatus();
	}

	this.playSound = function (soundUrl) {
		try {
			if (!soundUrl)
				return;

			const audio = new Audio(soundUrl);
			audio.play();
		} catch (error) {
			console.error("Error playing notification sound:", error);
		}
	};

	this.blinkTitle = function (message) {
		var that = EngageBay_Livechat.ref, originalTitle = "";
		var blink = function () {
			document.title = document.title == message ? originalTitle
				: message;
		}, /* function to BLINK browser tab */
			clear = function () { /* function to set title back to original */
				if (that.timeoutId)
					clearInterval(that.timeoutId);
				if (originalTitle)
					document.title = originalTitle;
				that.timeoutId = null;
			};
		clear();
		originalTitle = document.title;
		if (!that.timeoutId) {
			that.timeoutId = setInterval(blink, 1000);
		}
		// Add focus event
		window.onfocus = function () {
			clear();
		};
	}
}
