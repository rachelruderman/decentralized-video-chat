// When a browser receives an offer, set up a callback to be run when the
// ephemeral token is returned from Twilio.
export const onOffer = (offer) => {
    logIt("onOffer <<< Received offer");
    VideoChat.socket.on(
        "token",
        VideoChat.onToken(VideoChat.createAnswer(offer))
    );
    VideoChat.socket.emit("token", roomHash);
}