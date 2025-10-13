import Pusher, { Channel } from "pusher-js";
import { useEffect } from "react";
import eventBus from "../eventBus";
import { TENANT_ID, VISITOR_UUID } from "../globals";

/**
 * Provider that creates your channels instances and provides it to child hooks throughout your app.
 */

export const initalizeSocket = () => {

    try {

        // Get user sessions from visitorId
        let channelName = TENANT_ID + "-" + VISITOR_UUID;
            const pusher = new Pusher("1bd6d84d7a6d517eeee5", {
                cluster: "ap2",
                forceTLS: true,
              });
        var channel: Channel = pusher.subscribe(channelName);


        channel.bind('pusher:subscription_succeeded', function () {

        



        });

        // unbind to event for messages
        // channel.unbind("engagebay-channel-client-event");

        // Subscribe to event for messages
        channel.bind(
            "engagebay-event",
            function (message: string, channel: any, ortc: any) {

                // alert("innnn");
                if (JSON.parse(message).event_type == "new_ticket_message") {
                    eventBus.emit("new_ticket_message", JSON.parse(message).message)
                }

            }
        );



    } catch (error) {
        console.error("error", error);
    }


};

