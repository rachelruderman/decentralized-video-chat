import { showJoinLink } from "../../_util/showJoinLink";
import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

export function onMediaStream(stream) {
    logIt("onMediaStream");
    videoChat.localStream = stream;

    // Now that we have webcam video sorted, prompt user to share URL
    showJoinLink();

    // Add the stream as video's srcObject.
    document.getElementById('local-video').srcObject = stream;

    // Now we're ready to join the chat room.
    videoChat.socket.emit("join", videoChat.roomHash);

    // Add socket listeners;
    videoChat.addSocketListeners();
}