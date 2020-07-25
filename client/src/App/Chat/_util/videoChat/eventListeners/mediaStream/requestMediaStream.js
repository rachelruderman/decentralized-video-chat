import { logIt } from "../../../error/logIt";

export async function requestMediaStream() {
    try {
        logIt("requestMediaStream");
        const options = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(options);
        this.onMediaStream(stream);
    }
    catch (error) {
        logIt(error);
        logIt("Failed to get local webcam video, check webcam privacy settings");
        // Keep trying to get user media
        setTimeout(this.requestMediaStream, 1000);
    }
}