import { logIt } from "../../error/logIt";

// Create an offer that contains the media capabilities of the browser.
export function createOffer({ roomHash }) {
    logIt("createOffer >>> Creating offer...");

    const onSuccess = (offer) => {
        // If the offer is created successfully, set it as the local description
        // and send it over the socket connection to initiate the peerConnection
        // on the other side.
        this.peerConnection.setLocalDescription(offer);
        this.socket.emit("offer", JSON.stringify(offer), roomHash);
    }

    const onError = (error) => {
        logIt("failed offer creation");
        logIt(error, true);
    }

    this.peerConnection.createOffer(onSuccess, onError)
};