import { videoChat } from "..";

// When an answer is received, add it to the peerConnection as the remote description.
export function onAnswer(answer) {
    logIt("onAnswer <<< Received answer");
    const rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    // Set remote description of RTCSession
    videoChat.peerConnection.setRemoteDescription(rtcAnswer);
    // The caller now knows that the callee is ready to accept new ICE candidates, so sending the buffer over
    videoChat.localICECandidates.forEach(candidate => {
        logIt(`>>> Sending local ICE candidate (${candidate.address})`);
        // Send ice candidate over websocket
        videoChat.socket.emit("candidate", JSON.stringify(candidate), videoChat.roomHash);
    });
    // Reset the buffer of local ICE candidates. This is not really needed, but it's good practice
    videoChat.localICECandidates = [];
}