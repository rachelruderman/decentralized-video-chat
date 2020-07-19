export function findSenderByKind(kind) {
    const senders = this.peerConnection.getSenders();
    return senders.find(sender => (sender.track.kind === kind));
}