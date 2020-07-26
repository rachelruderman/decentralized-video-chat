import { videoChat } from "../..";

export function findSenderByKind(kind) {
    const senders = videoChat.peerConnection.getSenders();
    return senders.find(sender => (sender.track.kind === kind));
}