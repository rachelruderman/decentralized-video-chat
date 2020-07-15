import Snackbar from 'node-snackbar'
import { switchStreamHelper } from './switchStreamHelper';
import { logIt } from '../../_util/error/logIt';

// Swap camera / screen share
export const swap = (props) => {

    const {
        VideoChat,
        localVideo,
        updateState,
        chatZone,
        state,
    } = props;

    // Handle swap video before video call is connected
    if (!VideoChat.connected) {
        alert("You must join a call before you can share your screen.");
        return;
    }
    // Store swap button icon and text
    const swapIcon = document.getElementById("swap-icon");
    const swapText = document.getElementById("swap-text");
    // If mode is camera then switch to screen share
    if (state.mode === "camera") {
        // Show accept screenshare snackbar
        Snackbar.show({
            text:
                "Please allow screen share. Click the middle of the picture above and then press share.",
            width: "400px",
            pos: "bottom-center",
            actionTextColor: "#616161",
            duration: 50000,
        });
        // Request screen share, note we dont want to capture audio
        // as we already have the stream from the Webcam
        navigator.mediaDevices
            .getDisplayMedia({
                video: true,
                audio: false,
            })
            .then((stream) => {
                // Close allow screenshare snackbar
                Snackbar.close();
                // Change display mode
                updateState({ mode: 'screen' });
                switchStreamHelper(stream);
            })
            .catch((error) => {
                logIt(error);
                logIt("Error sharing screen");
                Snackbar.close();
            });
        // If mode is screenshare then switch to webcam
    } else {
        // Stop the screen share track
        localVideo.srcObject.getTracks().forEach((track) => track.stop());
        // Get webcam input
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then(function (stream) {
                // Change display mode
                updateState({ mode: 'camera' });
                switchStreamHelper(stream);
            });
    }
}