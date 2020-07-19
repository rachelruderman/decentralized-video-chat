import { findSenderByKind } from "../../VideoChat/eventListeners/peerConnection/findSenderByKind";

export const muteMicrophone = (props) => {
    const {
        updateState,
        state,
    } = props;

    const { isMuted } = state;

    const sender = findSenderByKind('audio');
    if (sender) {
        updateState({ isMuted: !sender.track.enabled })
        sender.track.enabled = isMuted;
        updateState({ isMuted: !isMuted })
    }
}