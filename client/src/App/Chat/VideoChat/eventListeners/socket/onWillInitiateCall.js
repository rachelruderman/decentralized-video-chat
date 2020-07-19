import { logIt } from "../../../_util/error/logIt";

export function onWillInitiateCall() {
    logIt('will inititiate!')
    this.willInitiateCall = true;
}