// When an answer is received, add it to the peerConnection as the remote description.
export const onAnswer = (answer) => {
    logIt("onAnswer <<< Received answer");
    const rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    // Set remote description of RTCSession
    VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
    // The caller now knows that the callee is ready to accept new ICE candidates, so sending the buffer over
    VideoChat.localICECandidates.forEach((candidate) => {
        logIt(`>>> Sending local ICE candidate (${candidate.address})`);
        // Send ice candidate over websocket
        VideoChat.socket.emit("candidate", JSON.stringify(candidate), roomHash);
    });
    // Reset the buffer of local ICE candidates. This is not really needed, but it's good practice
    VideoChat.localICECandidates = [];
}