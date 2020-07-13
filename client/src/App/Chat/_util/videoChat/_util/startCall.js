import { logIt } from "../../error/logIt";
import { VideoChat } from "..";

// Set up a callback to run when we have the ephemeral token to use Twilio's TURN server.
export const startCall = () => {
    logIt("startCall >>> Sending token request...");
    VideoChat.socket.on("token", VideoChat.onToken(VideoChat.createOffer));
    VideoChat.socket.emit("token", roomHash);
};