import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

export function addSocketListeners() {
    logIt('addSocketListeners');
    videoChat.socket.on("full", videoChat.onFull);
    videoChat.socket.on("offer", videoChat.onOffer);
    videoChat.socket.on("ready", videoChat.onReady);
    videoChat.socket.on("willInitiateCall", videoChat.onWillInitiateCall);
}
