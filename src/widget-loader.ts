import loadChat from './frame';
import axios from "axios";

function initializeChatWidget(container: Element, channelId: string | null) {

    if (!container || !channelId)
        return;

    // Get prefs and validate it
    axios.get("https://files.reacho.com/app/" + (window as any).reachoModulesObject.companyId + "/channel/embed/" + channelId + ".json").then((response) => {
        if (!response)
            return;
        loadChat(container, response.data);
    }).catch(() => {

    });

}

(() => {

    try {
        const elements = document.querySelectorAll('[class^="reacho-chat-widget"]');
        let widgetContainer = elements[0];
        let channelId = widgetContainer.getAttribute("data-id");

        initializeChatWidget(widgetContainer, channelId);

    } catch (error) {

    }

})();
