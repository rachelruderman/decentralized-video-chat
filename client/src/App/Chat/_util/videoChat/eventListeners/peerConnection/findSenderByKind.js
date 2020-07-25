export function findSenderByKind(kind) {
    console.log(this, 'findsenderbykind');
    const senders = this.peerConnection.getSenders();
    return senders.find(sender => (sender.track.kind === kind));
}