import { logIt } from "../../error/logIt";
import { VideoChat } from "..";

let roomHash;

// When the peerConnection generates an ice candidate, send it over the socket to the peer.
export const onIceCandidate = (event) => {
    logIt("onIceCandidate");
    if (event.candidate) {
        logIt(
            `<<< Received local ICE candidate from STUN/TURN server (${event.candidate.address})`
        );
        if (VideoChat.connected) {
            logIt(`>>> Sending local ICE candidate (${event.candidate.address})`);
            VideoChat.socket.emit(
                "candidate",
                JSON.stringify(event.candidate),
                roomHash
            );
        } else {
            // If we are not 'connected' to the other peer, we are buffering the local ICE candidates.
            // This most likely is happening on the "caller" side.
            // The peer may not have created the RTCPeerConnection yet, so we are waiting for the 'answer'
            // to arrive. This will signal that the peer is ready to receive signaling.
            VideoChat.localICECandidates.push(event.candidate);
        }
    }
};