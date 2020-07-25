import { logIt } from "../../../error/logIt";

// When we receive the ephemeral token back from the server.
export function onToken(callback) {
    logIt("onToken");
    return function (token) {
        logIt("<<< Received token");
        // Set up a new RTCPeerConnection using the token's iceServers.
        this.peerConnection = new RTCPeerConnection({
            iceServers: token.iceServers,
        });
        // Add the local video stream to the peerConnection.
        this.localStream.getTracks().forEach(function (track) {
            this.peerConnection.addTrack(track, this.localStream);
        });
        // Add general purpose data channel to peer connection,
        // used for text chats, captions, and toggling sending captions
        const dataChannel = this.peerConnection.createDataChannel("chat", {
            negotiated: true,
            // both peers must have same id
            id: 0,
        });
        // Called when dataChannel is successfully opened
        dataChannel.onopen = function (event) {
            logIt("dataChannel opened");
        };
        // Handle different dataChannel types
        dataChannel.onmessage = function (event) {
            const receivedData = event.data;
            // First 4 chars represent data type
            const dataType = receivedData.substring(0, 4);
            const cleanedMessage = receivedData.slice(4);
            if (dataType === "mes:") {
                this.handleReceiveMessage(cleanedMessage);
            } else if (dataType === "cap:") {
                this.receiveCaptions({ captions: cleanedMessage });
            } else if (dataType === "tog:") {
                this.toggleSendCaptions();
            }
        };
        // Set up callbacks for the connection generating iceCandidates or
        // receiving the remote media stream.
        this.peerConnection.onicecandidate = this.onIceCandidate;
        this.peerConnection.onaddstream = this.onAddStream;
        // Set up listeners on the socket
        this.socket.on("candidate", this.onCandidate);
        this.socket.on("answer", this.onAnswer);
        this.socket.on("requestToggleCaptions", this.toggleSendCaptions);
        this.socket.on("receiveCaptions", this.receiveCaptions);
        // Called when there is a change in connection state
        this.peerConnection.oniceconnectionstatechange = () => {
            const { iceConnectionState } = this.peerConnection;
            logIt(iceConnectionState);
            switch (iceConnectionState) {
                case "connected":
                    // Once connected we no longer have a need for the signaling server, so disconnect
                    this.socket.disconnect();
                    break;
                case "failed":
                    // this.socket.connect
                    // this.createOffer();
                    // Refresh page if connection has failed
                    window.location.reload();
                    break;
                case "disconnected":
                case "closed":
                default:
                    break;
            }
        };
        callback();
    };
};