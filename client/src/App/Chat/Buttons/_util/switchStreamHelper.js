import { VideoChat } from "../../VideoChat";

// Swap current video track with passed in stream
export const switchStreamHelper = ({ stream, findSenderByKind, localVideo, isPaused, pauseVideo }) => {
    // Get current video track
    const [videoTrack] = stream.getVideoTracks();
    // Add listen for if the current track swaps, swap back
    videoTrack.onended = function () {
        this.swap();
    };
    if (this.connected) {
        // Find sender
        const sender = findSenderByKind(videoTrack.kind);
        // Replace sender track
        sender.replaceTrack(videoTrack);
    }
    // Update local video stream
    this.localStream = videoTrack;
    // Update local video object
    localVideo.srcObject = stream;
    // Unpause video on swap
    if (isPaused) {
        pauseVideo();
    }
}
