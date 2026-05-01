import { EngagebayChatWidgetManager } from "./EngagebayChatWidgetManager";

export function loadLivechatWidget(prefs: any, type: string) {
    var selectedChannel: any, channelId: any;
    if (type === "legacy-chat" && (window as any).EhAccount.isLivechatDisabled()) {
        (window as any).EhLog.log("Livechat is disabled on this");
        return;
    }

                if (prefs && type === "unified-inbox") {
                    Array.prototype.forEach.call(prefs, function (channel) {
                        var widgetContainer = document.querySelector(
                            '[class^="engagebay-chat-widget"][data-id="' + channel.id + '"]'
                        );

                        if (channel.systemCreated && !channel.meta.deactivated) {
                            selectedChannel = channel;
                            if (widgetContainer) {
                                channelId = channel.id;
                                loadChat(widgetContainer, channel, type);
                            }
                        } else if (
                            !channel.meta.deactivated &&
                            widgetContainer &&
                            (!selectedChannel || selectedChannel.systemCreated)
                        ) {
                            selectedChannel = channel;
                            channelId = channel.id;
                            loadChat(widgetContainer, channel, type);
                        }
                    });
                }

                if ((!channelId && selectedChannel) || type === "legacy-chat") {
                    var widgetContainer = createEle("div", {
                        id: "engagebay-container",
                        "data-id": selectedChannel ? selectedChannel.id : prefs.id,
                        "class": "engagebay-namespace engagebay-chat-widget"
                    });
                    document.body.appendChild(widgetContainer);

                    if (widgetContainer) {
                        loadChat(widgetContainer, selectedChannel || prefs, type);
                    }
                }
};

function createEle (tag: string, attrs: any) {
    var el = document.createElement(tag);
    if (typeof (attrs) === 'object') {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    return el;
}

function loadChat(container: any, prefs: any, type: string) {
    var filePrefix = (window as any).EhAccount.getAppURL() + (type === "unified-inbox" ? "/livechat-react-unified/" : "/livechat-react/"),
        suffix = "",
        fileSuffix = "",
        jsFiles = ["main/main.min.js"];

    if (!(window as any).EhAccount.version || ((window as any).EhAccount.version && (window as any).EhAccount.version != "localhost")) {
        filePrefix = (window as any).EhAccount.cloudPathURl + (type === "unified-inbox" ? "livechat-react-unified/" : "livechat-react/")
            + ((window as any).EhAccount.version || (type === "unified-inbox" ? "1-0" : "1-22")) + "/";
        fileSuffix = "?" + new Date().getTime();
        
    }

    // if (!prefs || prefs.meta.deactivated || (prefs.meta.hideOnMobile && isMobileDevice())) return;

    var renderedFrame = container.getElementsByTagName("iframe");
    if (renderedFrame && renderedFrame.length > 0) return;

    // if (prefs.botPrefs) {        
    //     try {
    //         console.log("botPrefs:::", prefs.botPrefs);
    //         eh_validate_rules(prefs.botPrefs);
    //     } catch (e) {
    //         prefs.botPrefs = null;
    //         EhLog.log(e);
    //     }
    // }

    // var frameId = eh_generate_uuidv4();
    container.appendChild(loadGlobalCSS("450", type === "unified-inbox" ? prefs.meta.decoration.widgetAlignment.split(" ")[1] : prefs.widget.position.toLowerCase(), prefs.id));

    var iframeEle = createEle("iframe", {
        "class": "engagebay-messenger-frame " + (type === "unified-inbox" ? prefs.meta.decoration.widgetAlignment : prefs.widget.position.toLowerCase()) + " " + prefs.id,
        "name": "engagebay-messenger-frame",
        "id": 'engagebayMessenger__' + new Date().getTime()
        + Math.ceil(Math.random() * 100000),
        "title": "EngageBay Live Chat",
    });

    container.appendChild(iframeEle);

    var html = '<head><meta charset="UTF-8"><meta name="color-scheme" content="no-scheme"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>EngageBay Live Chat</title><base target="_parent"></head><body><div id="root"></div>';

    html += type === "unified-inbox" ? getNewPrefsScriptTag(prefs) : getOldPrefsScriptTag(prefs);

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
    if(type === "legacy-inbox")
        initEvents();
    (window as any).EngagebayChatWidget = new EngagebayChatWidgetManager(prefs);

}

function getOldPrefsScriptTag(prefs: any) {
    return '<script type="text/javascript">window.DOMAIN_ID="' + prefs.domainId + '";window.VISITOR_ID = "' + "9898323" + '"; window.API_KEY = "' + (window as any).EhAccount.getKey() + '";window.SERVER_HOST_DOMAIN_URL="' + (window as any).EhAccount.getAppURL() + '/";</script>';
    
}

function getNewPrefsScriptTag(prefs: any) {
    return '<script type="text/javascript">' +
    'window.TENANT_ID="' + prefs.tenantId + '";' +
    'window.CHANNEL_PREFS=' + JSON.stringify(prefs) + ';' +
    'window.CHANNEL_ID="' + prefs.id + '";' +
    // 'window.FRAME_REF_ID="' + frameId + '";' +
    'window.VISITOR_UUID="' + getVisitorKey() + '";' +
    'window.API_KEY="' + (window as any).EhAccount.getKey() + '";' +
    'window.SERVER_HOST_DOMAIN_URL="' + getUnifiedInboxURL() + '";' +
    '</script>';
    
}

function getVisitorKey () {
		var name = (window as any).EngHub_Storage.id_pref_name;
		return (window as any).EhGrabberVisitor.getVisitorPref("", name);
	}

function getUnifiedInboxURL () {
        var unifiedInboxURL = "https://backends.engagebay.com/";
    
            try {
                if ((window as any).EhAccount.getVersion()) {
                    unifiedInboxURL = "https://backends-" + (window as any).EhAccount.getVersion() + ".engagebay.com/";
                    if ((window as any).EhAccount.getVersion() == "localhost") {
                        unifiedInboxURL = "http://localhost:8091/";
                    }
                }
            } catch (error) {
            }
            return unifiedInboxURL;
};


function loadGlobalCSS(widgetWidth: any, position: any, id: any) {
    var css =
        '.engagebay-chat-widget[data-id="' + id + '"] {bottom: 0px; ' +
        position + ': 0px; height: 100%; z-index: 2147483000 !important; position: fixed !important;' +
        'max-width: 100%;width: ' + (widgetWidth ? widgetWidth : '450') +
        'px !important; min-height: 100px; max-height: 710px; opacity: 1 !important;' +
        'border-radius: 0px !important; overflow: hidden !important;}';

    css += '.engagebay-messenger-frame { position: absolute; width: 100% !important; height: 100% !important; background-color: transparent; border: none; }';
    css += '.engagebay-messenger-frame.bottom.right { right: 0; }';
    css += '.engagebay-messenger-frame.bottom.left { left: 0; }';
    return createStyle(css);
		// var css = '.engagebay-namespace .css-e37nxn {z-index: 2147482998;position: fixed;width: 500px;height: 500px;bottom: 0px;'
		// 	+ position
		// 	+ ': 0px; content: "";pointer-events: none;/*background: radial-gradient(at '
		// 	+ position
		// 	+ ' bottom, rgba(29, 39, 54, 0.16) 0%, rgba(29, 39, 54, 0) 72%);*/}';
        var css = '#engagebay-container.engagebay-namespace.engagebay-chat-widget[data-id="' + id + '"] {z-index: 9990 !important;display: initial !important;bottom: 0 !important;width: ' + (widgetWidth ? widgetWidth : '450') + 'px !important; min-height: 100px; max-height: 710px;'
		+   position
		+   ': 0px;position: fixed !important;}'
		// css += '.engagebay-namespace .css-iqgqqm {bottom: 0px; '
		// 	+ position
		// 	+ ': 0px; height: 100%; z-index: 2147483000 !important; position: fixed !important; max-width: 100%;width: ' + (widgetWidth ? widgetWidth : '376') + 'px !important; min-height: 100px; max-height: 710px;'
		// 	+ 'opacity: 1 !important; border-radius: 0px !important; overflow: hidden !important;}';

		css += 'iframe.engagebay-messenger-frame {position: absolute; width: 100% !important;height: 100% !important;min-height:0 !important;background-color: transparent; box-shadow: none;box-sizing: content-box; border: none;left: 0px;margin-left: 0 !important;margin-right: 0 !important;color-scheme:none !important}';





		css += '.engagebay-namespace .frame-closed {width: 100px !important; height: 100px !important;}';
		css += '.engagebay-namespace > iframe > html, .engagebay-namespace > iframe > body {margin:0px; padding: 0px; border: none;}';
		// Mobile view CSS
		css += '.engagebay-namespace .' + 'livechat-sm'
			+ ' { width: 100%; min-height: auto; height: 100%;}';
		return createStyle(css);
};

function createStyle(cssText: any) {
    var style : any = createEle("style", { id: "engagebay-styles", type: "text/css" });
    if (style.styleSheet) style.styleSheet.cssText = cssText;
    else style.appendChild(document.createTextNode(cssText));
    return style;
};
function eh_is_mobile_browser() {
	var b = !1;
	return function (a) {
		(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
			.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
				.test(a.substr(0, 4)))
			&& (b = !0)
	}(navigator.userAgent || navigator.vendor || (window as any).opera), b
};

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

function initEvents() {
    var el = document
        .getElementsByClassName("engagebay-chat-widget")[0];
    var frame = getFrameByName("engagebay-messenger-frame"), appEl: any;
    if (frame) {
        frame = frame.document || frame;
        appEl = frame.getElementsByClassName("engagebay-viewport");
    }
    if (!appEl || !appEl.length) {
        setTimeout(function () {
            initEvents();
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
                el.classList.remove("livechat-sm");
                if (appEl)
                    appEl.classList.remove("livechat-sm");
            } else {
                el.classList.add("livechat-sm");
                if (appEl)
                    appEl.classList.add("livechat-sm");
            }
        } catch (e) {
            console.error(e);
        }
    }
    window.addEventListener("resize", resize);
    resize();
};
function getFrameByName (name: string) {
    var frame: any = document.getElementsByName(name)[0];
    return frame.contentWindow || frame.contentDocument.document
        || frame.contentDocument;
}