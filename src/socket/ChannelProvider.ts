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
        console.log("channelName", channelName);
        // const pusher = new Pusher("9efc22b651b6b9401c10", {
        const pusher = new Pusher("1bd6d84d7a6d517eeee5", {
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
        // channel.unbind("reacho-channel-client-event");

        // Subscribe to event for messages
        channel.bind(
            "reacho-socket-event",
            function (message: string, channel: any, ortc: any) {

                // alert("innnn");
                if (JSON.parse(message).message_type == "new_ticket_message") {
                    eventBus.emit("new_ticket_message", JSON.parse(message).message)
                }

            }
        );



    } catch (error) {
        console.error("error", error);
    }


};

