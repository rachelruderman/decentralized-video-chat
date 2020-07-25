import { logIt } from "../../../error/logIt";

// When we are ready to call, enable the Call button.
export function onReady() {
    logIt("websocket/onReady");
    // First to join call will most likely initiate call
    if (this.willInitiateCall) {
        console.log('on ready', this);
        logIt("Initiating call");
        this.startCall();
    }
}