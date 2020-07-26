import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

let roomHash;

// When the peerConnection generates an ice candidate, send it over the socket to the peer.
export function onIceCandidate({ candidate }) {
    logIt("onIceCandidate");
    if (candidate) {
        logIt(
            `<<< Received local ICE candidate from STUN/TURN server (${candidate.address})`
        );
        if (videoChat.isConnected) {
            logIt(`>>> Sending local ICE candidate (${candidate.address})`);
            videoChat.socket.emit(
                "candidate",
                JSON.stringify(candidate),
                roomHash
            );
        } else {
            // If we are not 'connected' to the other peer, we are buffering the local ICE candidates.
            // This most likely is happening on the "caller" side.
            // The peer may not have created the RTCPeerConnection yet, so we are waiting for the 'answer'
            // to arrive. This will signal that the peer is ready to receive signaling.
            videoChat.localICECandidates.push(candidate);
        }
    }
};