// When receiving a candidate over the socket, turn it back into a real

import { logIt } from "../../../error/logIt";

// RTCIceCandidate and add it to the peerConnection.
export function onCandidate({ candidate, updateState, rtcCandidate }) {
    // Update caption text
    updateState({ captionText: "Found other user... connecting" });
    rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
    logIt(
        `onCandidate <<< Received remote ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`
    );
    this.peerConnection.addIceCandidate(rtcCandidate);
};