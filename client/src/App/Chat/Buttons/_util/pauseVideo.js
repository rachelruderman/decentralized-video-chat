export const pauseVideo = (props) => {
    const {
        findSenderByKind,
        updateState,
        state
    } = props;

    const { isPaused } = state;

    const sender = findSenderByKind(video);
    if (sender) {
        updateState({ isPaused: !sender.track.enabled })
        sender.track.enabled = isPaused;
        updateState({ isPaused: !isPaused })
        // update pause button icon and text
        if (isPaused) {
            // localVideoText.show();
        } else {
            // setTimeout(() => localVideoText.fadeOut(), 2000);
        }
    }
}