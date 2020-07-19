import { logIt } from "../../../_util/error/logIt";

// When we are ready to call, enable the Call button.
export function onReady() {
    logIt("readyToCall");
    // First to join call will most likely initiate call
    if (this.willInitiateCall) {
        logIt("Initiating call");
        this.startCall();
    }
}