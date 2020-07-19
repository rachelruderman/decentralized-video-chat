import { logIt } from "../../_util/error/logIt";
import { VideoChat } from "..";
import Snackbar from 'node-snackbar';
import copy from 'copy-to-clipboard';

// Called when a video stream is added to VideoChat
export const onMediaStream = (stream) => {
    logIt("onMediaStream");
    console.log('hi')
    VideoChat.localStream = stream;
    console.log({ VideoChat })
    // Add the stream as video's srcObject.
    // Now that we have webcam video sorted, prompt user to share URL
    const { href } = window.location;
    console.log('hit htis spot')
    Snackbar.show({
        text: `Here is the join link for your call: ${href}`,
        actionText: "Copy Link",
        width: "750px",
        pos: "top-center",
        actionTextColor: "#616161",
        duration: 500000,
        backgroundColor: "#16171a",
        onActionClick: () => {
            copy(href);
            Snackbar.close();
        },
    });
    console.log({ VideoChat })
    if (!VideoChat.localVideo) return;
    VideoChat.localVideo.srcObject = stream;
    // Now we're ready to join the chat room.
    VideoChat.socket.emit("join", VideoChat.roomHash);
    // Add listeners to the websocket
    VideoChat.socket.on("full", VideoChat.onChatRoomFull);
    VideoChat.socket.on("offer", VideoChat.onOffer);
    VideoChat.socket.on("ready", VideoChat.readyToCall);
    VideoChat.socket.on(
        "willInitiateCall",
        () => (VideoChat.willInitiateCall = true)
    );
};