import { logIt } from "../../_util/error/logIt";

//Picture in picture
export const togglePictureInPicture = (remoteVideoVanilla) => {

    const isPipSupported = (
        "pictureInPictureEnabled" in document ||
        remoteVideoVanilla.webkitSetPresentationMode
    )

    if (isPipSupported) {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch((error) => {
                logIt("Error exiting pip.");
                logIt(error);
            });
        } else if (remoteVideoVanilla.webkitPresentationMode === "inline") {
            remoteVideoVanilla.webkitSetPresentationMode("picture-in-picture");
        } else if (
            remoteVideoVanilla.webkitPresentationMode === "picture-in-picture"
        ) {
            remoteVideoVanilla.webkitSetPresentationMode("inline");
        } else {
            remoteVideoVanilla.requestPictureInPicture().catch(() => {
                alert(
                    "You must be connected to another person to enter picture in picture."
                );
            });
        }
    } else {
        alert(
            "Picture in picture is not supported in your browser. Consider using Chrome or Safari."
        );
    }
}