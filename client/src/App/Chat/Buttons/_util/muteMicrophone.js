export const muteMicrophone = (props) => {
    const {
        findSenderByKind,
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