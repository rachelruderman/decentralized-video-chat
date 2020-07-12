// Create an answer with the media capabilities that both browsers share.
// This function is called with the offer from the originating browser, which
// needs to be parsed into an RTCSessionDescription and added as the remote
// description to the peerConnection object. Then the answer is created in the

import { logIt } from "../error/logIt";

// same manner as the offer and sent over the socket.
export const createAnswer = (offer) => {
    logIt("createAnswer");
    return () => {
        logIt(">>> Creating answer...");
        rtcOffer = new RTCSessionDescription(JSON.parse(offer));
        VideoChat.peerConnection.setRemoteDescription(rtcOffer);

        const onSuccess = (response) => {
            VideoChat.peerConnection.setLocalDescription(response);
            VideoChat.socket.emit("answer", JSON.stringify(response), roomHash);
        }

        const onError = (error) => {
            logIt("Failed answer creation.");
            logIt(error, true);
        }

        VideoChat.peerConnection.createAnswer(onSuccess, onError);
    };
};