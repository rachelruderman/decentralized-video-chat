import { logIt } from "../../error/logIt";
import { videoChat } from "..";

// Set up a callback to run when we have the ephemeral token to use Twilio's TURN server.
export function startCall() {
    logIt("startCall >>> Sending token request...");
    videoChat.socket.on("token", videoChat.onToken(videoChat.createOffer));
    videoChat.socket.emit("token", videoChat.roomHash);
};