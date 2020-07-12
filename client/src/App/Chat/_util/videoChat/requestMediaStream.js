import { logIt } from "../error/logIt";

export const requestMediaStream = async () => {
    logIt("requestMediaStream");
    rePositionLocalVideo();

    try {
        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        VideoChat.onMediaStream(stream);
        localVideoText.text("Drag Me");
        setTimeout(() => localVideoText.fadeOut(), 5000);
    }
    catch (error) {
        logIt(error);
        logIt(
            "Failed to get local webcam video, check webcam privacy settings"
        );
        // Keep trying to get user media
        setTimeout(VideoChat.requestMediaStream, 1000);
    }
},