import { logIt } from "../../../error/logIt";

export function addSocketListeners() {
    logIt('addSocketListeners');
    this.socket.on("full", this.onFull);
    this.socket.on("offer", this.onOffer);
    this.socket.on("ready", this.onReady);
    this.socket.on("willInitiateCall", this.onWillInitiateCall);
}
