import { videoChat } from "../../_util/videoChat";
import { findSenderByKind } from "../../_util/videoChat/eventListeners/peerConnection/findSenderByKind";

// Swap current video track with passed in stream
export const switchStreamHelper = ({ stream, localVideo, isPaused, pauseVideo }) => {
    // Get current video track
    const [videoTrack] = stream.getVideoTracks();
    // Add listen for if the current track swaps, swap back
    videoTrack.onended = function () {
        videoChat.swap();
    };
    if (videoChat.connected) {
        // Find sender
        const sender = findSenderByKind(videoTrack.kind);
        // Replace sender track
        sender.replaceTrack(videoTrack);
    }
    // Update local video stream
    videoChat.localStream = videoTrack;
    // Update local video object
    localVideo.srcObject = stream;
    // Unpause video on swap
    if (isPaused) {
        pauseVideo();
    }
}
