import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

export async function requestMediaStream() {
    try {
        logIt("requestMediaStream");
        const options = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(options);
        videoChat.onMediaStream(stream);
    }
    catch (error) {
        logIt(error);
        logIt("Failed to get local webcam video, check webcam privacy settings");
        // Keep trying to get user media
        setTimeout(videoChat.requestMediaStream, 1000);
    }
}