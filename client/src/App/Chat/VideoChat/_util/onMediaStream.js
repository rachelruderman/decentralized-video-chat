import { logIt } from "../../_util/error/logIt";
import { VideoChat } from "../videoChat";
import { showJoinLink } from "./showJoinLink";

// Called when a video stream is added to VideoChat
export const onMediaStream = (stream) => {
    logIt("onMediaStream");
    VideoChat.localStream = stream;

    // Now that we have webcam video sorted, prompt user to share URL
    showJoinLink();

    // Add the stream as video's srcObject.
    VideoChat.localVideo = document.getElementById('local-video');
    if (!VideoChat.localVideo) {
        console.log('no local video')
        return;
    };
    VideoChat.localVideo.srcObject = stream;
    // Now we're ready to join the chat room.
    console.log({ VideoChat })

    VideoChat.socket.emit("join", VideoChat.roomHash);
    // Add listeners to the websocket
    VideoChat.socket.on("full", VideoChat.onChatRoomFull);
    VideoChat.socket.on("offer", VideoChat.onOffer);
    VideoChat.socket.on("ready", VideoChat.readyToCall);
    VideoChat.socket.on(
        "willInitiateCall",
        () => {
            VideoChat.willInitiateCall = true;
            console.log('will iniitate!')
        }
    );
};