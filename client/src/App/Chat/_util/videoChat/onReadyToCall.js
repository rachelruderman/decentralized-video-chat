import { logIt } from "../error/logIt";

// When we are ready to call, enable the Call button.
export const onReadyToCall = () => {
    logIt("readyToCall");
    // First to join call will most likely initiate call
    if (VideoChat.willInitiateCall) {
        logIt("Initiating call");
        VideoChat.startCall();
    }
}