import { VideoChat } from "..";
import { logIt } from "../../error/logIt";

// When we receive the ephemeral token back from the server.
export const onToken = (callback) => {
    logIt("onToken");
    return function (token) {
        logIt("<<< Received token");
        // Set up a new RTCPeerConnection using the token's iceServers.
        VideoChat.peerConnection = new RTCPeerConnection({
            iceServers: token.iceServers,
        });
        // Add the local video stream to the peerConnection.
        VideoChat.localStream.getTracks().forEach(function (track) {
            VideoChat.peerConnection.addTrack(track, VideoChat.localStream);
        });
        // Add general purpose data channel to peer connection,
        // used for text chats, captions, and toggling sending captions
        dataChannel = VideoChat.peerConnection.createDataChannel("chat", {
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
                handleReceiveMessage(cleanedMessage);
            } else if (dataType === "cap:") {
                receiveCaptions(cleanedMessage);
            } else if (dataType === "tog:") {
                toggleSendCaptions();
            }
        };
        // Set up callbacks for the connection generating iceCandidates or
        // receiving the remote media stream.
        VideoChat.peerConnection.onicecandidate = VideoChat.onIceCandidate;
        VideoChat.peerConnection.onaddstream = VideoChat.onAddStream;
        // Set up listeners on the socket
        VideoChat.socket.on("candidate", VideoChat.onCandidate);
        VideoChat.socket.on("answer", VideoChat.onAnswer);
        VideoChat.socket.on("requestToggleCaptions", () => toggleSendCaptions());
        VideoChat.socket.on("receiveCaptions", (captions) =>
            receiveCaptions(captions)
        );
        // Called when there is a change in connection state
        VideoChat.peerConnection.oniceconnectionstatechange = function (event) {
            switch (VideoChat.peerConnection.iceConnectionState) {
                case "connected":
                    logIt("connected");
                    // Once connected we no longer have a need for the signaling server, so disconnect
                    VideoChat.socket.disconnect();
                    break;
                case "disconnected":
                    logIt("disconnected");
                case "failed":
                    logIt("failed");
                    // VideoChat.socket.connect
                    // VideoChat.createOffer();
                    // Refresh page if connection has failed
                    location.reload();
                    break;
                case "closed":
                    logIt("closed");
                    break;
            }
        };
        callback();
    };
};