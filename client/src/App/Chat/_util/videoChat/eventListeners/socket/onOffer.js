// When a browser receives an offer, set up a callback to be run when the

import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

// ephemeral token is returned from Twilio.
export function onOffer(offer) {
    logIt("onOffer <<< Received offer");
    videoChat.socket.on(
        "token",
        videoChat.onToken(videoChat.createAnswer(offer))
    );
    videoChat.socket.emit("token", videoChat.Chat.roomHash);
}