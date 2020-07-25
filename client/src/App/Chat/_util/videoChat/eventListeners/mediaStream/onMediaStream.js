import { showJoinLink } from "../../_util/showJoinLink";
import { logIt } from "../../../error/logIt";

export function onMediaStream(stream) {
    logIt("onMediaStream");
    this.localStream = stream;

    // Now that we have webcam video sorted, prompt user to share URL
    showJoinLink();

    // Add the stream as video's srcObject.
    this.props.localVideoRef.current.srcObject = stream;

    // Now we're ready to join the chat room.
    this.socket.emit("join", this.roomHash);

    // Add socket listeners;
    this.addSocketListeners();
}