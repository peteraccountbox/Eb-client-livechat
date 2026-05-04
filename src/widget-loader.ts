import axios from "axios";
import { loadLivechatWidget } from "./widgetUtils";


(() => {

    var channelIds: string[] = [];
    try {        
        var widgetContainers = document.querySelectorAll('[class^="engagebay-chat-widget"]');

        console.log("widgetContainers ", widgetContainers);

        Array.prototype.forEach.call(widgetContainers, function (element) {
            channelIds.push(element.getAttribute("data-id"));
        });

        axios(
            "https://eb-webhooks.engagebay.com/channel/get-active-channel-by-ids?apiKey=" +
            (window as any).EhAccount.getKey() +
            "&channelIds=" +
            channelIds.join(","), {}
        )
        .then((response: any) => {
            const channelData = response.data;
            if (!channelData || (!Array.isArray(channelData) && channelData.widget && !channelData.widget.chatEnabled))
                return;
            loadLivechatWidget(channelData, !Array.isArray(channelData) && channelData.widget ? "legacy-chat" : "unified-inbox");
            
        })
        .catch((error) => {
            console.error("Error fetching channel prefs: ", error);
        });
    } catch (error) {
        console.error("Error initializing live chat widget: ", error);
    }

})();
