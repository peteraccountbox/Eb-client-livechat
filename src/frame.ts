import './assets/css/iframe.scss';
import { VISITOR_UUID } from './globals';
import { ChatPrefsPayloadType } from './Models';
import { uuidv4 } from './Utils';

export const createEle = function (tag: string, attrs: any) {
    var el = document.createElement(tag);
    if (typeof (attrs) === 'object') {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    return el;
}

const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default function loadChat(container: Element, prefs: ChatPrefsPayloadType) {

    // if(!(window as any).reachoJSClient){
    //     console.log("waiting for reachoJSClient");
    //     setTimeout(() => {
    //         loadChat(container, prefs);
    //     }, 20);
    //     return;
    // }
    
    // Validate contitions
    if (!prefs || prefs.meta.deactivated || (prefs.meta.hideOnMobile && isMobileDevice()))
        return;

    const renderedFrame = container.getElementsByTagName("iframe");
    if (renderedFrame && renderedFrame.length > 0)
        return;

    const frameId = uuidv4();
    const iframeEle: HTMLIFrameElement = createEle("iframe", {
        "class": "engagebay-messenger-frame " + prefs.meta.decoration.widgetAlignment + " " + prefs.id,
        "name": "engagebay-messenger-frame",
        "id": frameId
    }) as HTMLIFrameElement;

    container.appendChild(iframeEle);

    const reachoModulesObject = (window as any).reachoModulesObject || {};
    let SERVER_HOST_DOMAIN_URL = "https://" + ((reachoModulesObject && reachoModulesObject.mode) ? reachoModulesObject.mode : "live") + ".reacho.com/";
    // if (reachoModulesObject.mode && reachoModulesObject.mode == "local")
        SERVER_HOST_DOMAIN_URL = "http://localhost:8091/"

    // let scirptURL = "https://static.reacho.com/onsite/js/chat/main/main.min.js?v=751";
    // if (reachoModulesObject.mode && reachoModulesObject.mode == "local")
    let scirptURL = "http://localhost:3031/build/main/main.min.js";

    // reachoModulesObject.ChatPrefs = {};
    // reachoModulesObject.ChatPrefs[prefs.id] = prefs;

    // Object.defineProperty(window, "reachoModulesObject", {
    //     value: reachoModulesObject,
    //     enumerable: false
    // });


    const vId = VISITOR_UUID;

    let content = `
    <!DOCTYPE html>
    <html>
    <head>
        
    </head>
    <body>
        <div id="root"></p>
        <script >
            var TENANT_ID = "${prefs.tenantId}";
            var CHANNEL_PREFS = '${JSON.stringify(prefs)}';
            var CHANNEL_ID = "${prefs.id}";
            var FRAME_REF_ID = "${frameId}";
            var SERVER_HOST_DOMAIN_URL = "${SERVER_HOST_DOMAIN_URL}";
            var VISITOR_UUID = "${vId}";
        </script>
        <script src="${scirptURL}"></script>
    </body>
    </html>
    `;

    const frame: HTMLIFrameElement | null = container.getElementsByTagName("iframe")[0] as HTMLIFrameElement;
    if (frame && frame.contentDocument) {
        const frameDoc = frame.contentDocument;
        frameDoc.open();
        frameDoc.write(content);
        frameDoc.close();
    }

}