import { logIt } from "../../../error/logIt";
import Snackbar from 'node-snackbar';
import { videoChat } from "../..";
// Called when a stream is added to the peer connection
export function onAddStream(event) {
    logIt("onAddStream <<< Received new stream from remote. Adding it...");
    // Update remote video source
    document.getElementById('remote-video').srcObject = event.stream;

    // Close the initial share url snackbar
    Snackbar.close();
    // Remove the loading gif from video
    document.getElementById('remote-video').style.background = "none";
    // Update connection status
    videoChat.isConnected = true;
    // Hide caption status text
    // captionText.fadeOut();
    // Reposition local video after a second, as there is often a delay
    // between adding a stream and the height of the video div changing
    // setTimeout(rePositionLocalVideo, 500);
    // var timesRun = 0;
    // var interval = setInterval(function () {
    //   timesRun += 1;
    //   if (timesRun === 10) {
    //     clearInterval(interval);
    //   }
    //   rePositionLocalVideo();
    // }, 300);
};