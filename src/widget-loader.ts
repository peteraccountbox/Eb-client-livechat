import loadChat, { createEle } from './frame';
import axios, { AxiosResponse } from "axios";
import { API_KEY, CHANNEL_PREFS_FETCH_URL_PATH } from './globals';
import { ChatPrefsPayloadType } from './Models';


(async () => {

    let channelIds = []
    try {        
        const widgetContainers = document.querySelectorAll(`[class^="engagebay-chat-widget"]`);
        // if(widgetContainers.length == 0)
        //     return
        console.log("widgetContainers ", widgetContainers);
        for (let index = 0; index < widgetContainers.length; index++) {
            const element = widgetContainers[index];
            channelIds.push(element.getAttribute("data-id"))
        }
        const channels: any[] = (await axios(CHANNEL_PREFS_FETCH_URL_PATH + "?channelIds=" + channelIds.join() + "&apiKey=" + API_KEY, {})).data

        let selectedChannel:any,channelId;

            channels.map((channel) => {
                const widgetContainer = document.querySelector('[class^="engagebay-chat-widget"][data-id="' + channel.id +'"]');

                if(channel.systemCreated)
                    selectedChannel = channel
                else 
                if(!channel.meta.deactivated && widgetContainer && (!selectedChannel || selectedChannel.systemCreated)) {
                    selectedChannel = channel
                    channelId = channel.id
                   loadChat(widgetContainer, channel);  
                }
            })

            if(!channelId) {
                 // create container
                 const widgetContainer: HTMLIFrameElement = createEle("div", {
                    "class": "engagebay-chat-widget",
                    "data-id": selectedChannel.id
                }) as HTMLIFrameElement;

                document.body.appendChild(widgetContainer);

                loadChat(widgetContainer, selectedChannel);
            }

    } catch (error) {
      console.log("error: ", error)
    }

})();
