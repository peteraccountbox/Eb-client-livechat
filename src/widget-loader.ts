import { createElement } from 'react';
import loadChat, { createEle } from './frame';
import axios from "axios";

function initializeChatWidget(container: Element, channelId: string | null) {

    if (!container || !channelId)
        return;

    // Get prefs and validate it
    axios.get("https://reacho-chat-worker.peter-13d.workers.dev/?channel_id=" +
        channelId +
        "&tenant_id=" +
        (window as any).reachoModulesObject.companyId).then((response) => {
            if (!response)
                return;
            loadChat(container, response.data);
        }).catch(() => {

        });

}

(() => {

    let channelId;
    try {
        const elements = document.querySelectorAll('[class^="reacho-chat-widget"]');
        let widgetContainer = elements[0];
        channelId = widgetContainer.getAttribute("data-id");
        initializeChatWidget(widgetContainer, channelId);
    } catch (error) {

    }

    // Check for installations
    if (!channelId) {
        // Get prefs and validate it
        axios.get("https://files.reacho.com/app/" + (window as any).reachoModulesObject.companyId + "/installed-chat-widgets.json").then((response) => {

            if (!response || !response.data)
                return;

            let data = response.data as {
                [key: string]: string
            };

            for (let key in data) {
                if (window.location.href.indexOf(data[key]) > -1) {

                    channelId = key;

                    console.log("channelId1", channelId)

                    // create container
                    const widgetContainer: HTMLIFrameElement = createEle("div", {
                        "class": "reacho-chat-widget",
                        "data-id": channelId
                    }) as HTMLIFrameElement;

                    document.body.appendChild(widgetContainer);

                    initializeChatWidget(widgetContainer, channelId);
                    return;
                }
            }


        }).catch(() => {

        });
    }

})();
