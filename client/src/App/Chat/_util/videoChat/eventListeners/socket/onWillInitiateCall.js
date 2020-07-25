import { logIt } from "../../../error/logIt";

export function onWillInitiateCall() {
    logIt('will inititiate!')
    this.willInitiateCall = true;
}