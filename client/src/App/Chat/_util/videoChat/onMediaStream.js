import { logIt } from "../error/logIt";

// Called when a video stream is added to VideoChat
export const onMediaStream = (stream) => {
    logIt("onMediaStream");
    VideoChat.localStream = stream;
    // Add the stream as video's srcObject.
    // Now that we have webcam video sorted, prompt user to share URL
    Snackbar.show({
        text: "Here is the join link for your call: " + url,
        actionText: "Copy Link",
        width: "750px",
        pos: "top-center",
        actionTextColor: "#616161",
        duration: 500000,
        backgroundColor: "#16171a",
        onActionClick: function (element) {
            // Copy url to clipboard, this is achieved by creating a temporary element,
            // adding the text we want to that element, selecting it, then deleting it
            var copyContent = window.location.href;
            $('<input id="some-element">')
                .val(copyContent)
                .appendTo("body")
                .select();
            document.execCommand("copy");
            var toRemove = document.querySelector("#some-element");
            toRemove.parentNode.removeChild(toRemove);
            Snackbar.close();
        },
    });
    if (!localVideo) return;
    localVideo.srcObject = stream;
    // Now we're ready to join the chat room.
    VideoChat.socket.emit("join", roomHash);
    // Add listeners to the websocket
    VideoChat.socket.on("full", chatRoomFull);
    VideoChat.socket.on("offer", VideoChat.onOffer);
    VideoChat.socket.on("ready", VideoChat.readyToCall);
    VideoChat.socket.on(
        "willInitiateCall",
        () => (VideoChat.willInitiateCall = true)
    );
},
