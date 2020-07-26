import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

// When we are ready to call, enable the Call button.
export function onReady() {
    logIt("websocket/onReady");
    // First to join call will most likely initiate call
    if (videoChat.willInitiateCall) {
        console.log('on ready', this);
        logIt("Initiating call");
        videoChat.startCall();
    }
}