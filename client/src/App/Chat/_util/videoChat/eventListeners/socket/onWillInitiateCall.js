import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

export function onWillInitiateCall() {
    logIt('will inititiate!')
    videoChat.willInitiateCall = true;
}