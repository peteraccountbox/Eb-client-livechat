import './assets/css/iframe.scss';

const createEle = function (tag: string, attrs: any) {
    var el = document.createElement(tag);
    if (typeof (attrs) === 'object') {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    return el;
}

export default function loadChat(container: Element, prefs: any) {

    const renderedFrame = container.getElementsByTagName("iframe");
    if (renderedFrame && renderedFrame.length > 0)
        return;

    const iframeEle: HTMLIFrameElement = createEle("iframe", {
        "class": "reacho-messenger-frame " + prefs.meta.decoration.widgetAlignment,
        "name": "reacho-messenger-frame",
        "id": prefs.id
    }) as HTMLIFrameElement;

    container.appendChild(iframeEle);

    const reachoModulesObject = (window as any).reachoModulesObject || {};
    let SERVER_HOST_DOMAIN_URL = "https://sandbox.reacho.com/";
    if (reachoModulesObject.mode && reachoModulesObject.mode == "local")
        SERVER_HOST_DOMAIN_URL = "http://localhost:8081/"

    let scirptURL = "clouflarurl/version/main.js";
    if (reachoModulesObject.mode && reachoModulesObject.mode == "local")
        scirptURL = "http://localhost:3031/main/main.min.js?v=311";

    let content = `
    <!DOCTYPE html>
    <html>
    <head>
        
    </head>
    <body>
        <div id="root"></p>
        <script>
            var TENANT_ID = "${reachoModulesObject.companyId}";
            var CHANNEL_ID = "${prefs.id}";
            var SERVER_HOST_DOMAIN_URL = "${SERVER_HOST_DOMAIN_URL}";
            var VISITOR_UUID = "62716143248343556";
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