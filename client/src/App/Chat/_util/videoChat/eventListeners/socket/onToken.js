import { logIt } from "../../../error/logIt";
import { videoChat } from "../..";

// When we receive the ephemeral token back from the server.
export function onToken(callback) {
    logIt("onToken");
    return function (token) {
        logIt("<<< Received token");
        // Set up a new RTCPeerConnection using the token's iceServers.
        videoChat.peerConnection = new RTCPeerConnection({
            iceServers: token.iceServers,
        });
        // Add the local video stream to the peerConnection.
        videoChat.localStream.getTracks().forEach(function (track) {
            videoChat.peerConnection.addTrack(track, videoChat.localStream);
        });
        // Add general purpose data channel to peer connection,
        // used for text chats, captions, and toggling sending captions
        const dataChannel = videoChat.peerConnection.createDataChannel("chat", {
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
                videoChat.handleReceiveMessage(cleanedMessage);
            } else if (dataType === "cap:") {
                videoChat.receiveCaptions({ captions: cleanedMessage });
            } else if (dataType === "tog:") {
                videoChat.toggleSendCaptions();
            }
        };
        // Set up callbacks for the connection generating iceCandidates or
        // receiving the remote media stream.
        videoChat.peerConnection.onicecandidate = videoChat.onIceCandidate;
        videoChat.peerConnection.onaddstream = videoChat.onAddStream;
        // Set up listeners on the socket
        videoChat.socket.on("candidate", videoChat.onCandidate);
        videoChat.socket.on("answer", videoChat.onAnswer);
        videoChat.socket.on("requestToggleCaptions", videoChat.toggleSendCaptions);
        videoChat.socket.on("receiveCaptions", videoChat.receiveCaptions);
        // Called when there is a change in connection state
        videoChat.peerConnection.oniceconnectionstatechange = () => {
            const { iceConnectionState } = videoChat.peerConnection;
            logIt(iceConnectionState);
            switch (iceConnectionState) {
                case "connected":
                    // Once connected we no longer have a need for the signaling server, so disconnect
                    videoChat.socket.disconnect();
                    break;
                case "failed":
                    // videoChat.socket.connect
                    // videoChat.createOffer();
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