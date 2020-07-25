import { logIt } from "../../error/logIt";

// Set up a callback to run when we have the ephemeral token to use Twilio's TURN server.
export function startCall() {
    logIt("startCall >>> Sending token request...");
    this.socket.on("token", this.onToken(this.createOffer));
    this.socket.emit("token", this.roomHash);
};