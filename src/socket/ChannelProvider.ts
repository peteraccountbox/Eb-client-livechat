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
        alert(channelName);
        console.log("channelName", channelName);
        const pusher = new Pusher("1bd6d84d7a6d517eeee5q", {
            cluster: "ap2",
            forceTLS: true,
        });
        var channel: Channel = pusher.subscribe(channelName);


        channel.bind('pusher:subscription_succeeded', function () {

            console.log("On pusher channel subscribe", channelName);
            // Binding to event emit to receive trigger commands
            // onEventReceived("send-reacho-channel-message", (data) => {
            // let wasTriggered = pusher.trigger('client-event', data);
            // console.log(wasTriggered);
            // });

        });

        // unbind to event for messages
        channel.unbind("reacho-channel-client-event");

        // Subscribe to event for messages
        channel.bind(
            "reacho-channel-message-received",
            function (message: string, channel: any, ortc: any) {
                try {
                    eventBus.on("reacho-channel-message-received", JSON.parse(message));
                } catch (e) {
                    console.error(e);
                }
            }
        );

    } catch (error) {
        console.error("error", error);
    }


};

