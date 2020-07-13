import { logIt } from "../../error/logIt";
import { VideoChat } from "..";

export const requestMediaStream = async () => {
    logIt("requestMediaStream");
    // rePositionLocalVideo();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        VideoChat.onMediaStream(stream);
    }
    catch (error) {
        logIt(error);
        logIt(
            "Failed to get local webcam video, check webcam privacy settings"
        );
        // Keep trying to get user media
        setTimeout(requestMediaStream, 1000);
    }
};