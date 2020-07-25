// When a browser receives an offer, set up a callback to be run when the

import { logIt } from "../../../error/logIt";

// ephemeral token is returned from Twilio.
export function onOffer(offer) {
    logIt("onOffer <<< Received offer");
    this.socket.on(
        "token",
        this.onToken(this.createAnswer(offer))
    );
    this.socket.emit("token", this.roomHash);
}