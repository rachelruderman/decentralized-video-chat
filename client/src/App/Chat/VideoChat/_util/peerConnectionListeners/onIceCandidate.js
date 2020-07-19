import { logIt } from "../../_util/error/logIt";

let roomHash;

// When the peerConnection generates an ice candidate, send it over the socket to the peer.
export function onIceCandidate(event) {
    logIt("onIceCandidate");
    if (event.candidate) {
        logIt(
            `<<< Received local ICE candidate from STUN/TURN server (${event.candidate.address})`
        );
        if (this.connected) {
            logIt(`>>> Sending local ICE candidate (${event.candidate.address})`);
            this.socket.emit(
                "candidate",
                JSON.stringify(event.candidate),
                roomHash
            );
        } else {
            // If we are not 'connected' to the other peer, we are buffering the local ICE candidates.
            // This most likely is happening on the "caller" side.
            // The peer may not have created the RTCPeerConnection yet, so we are waiting for the 'answer'
            // to arrive. This will signal that the peer is ready to receive signaling.
            this.localICECandidates.push(event.candidate);
        }
    }
};