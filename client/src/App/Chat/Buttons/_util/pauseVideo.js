export const pauseVideo = (props) => {
    const {
        updateState,
        state,
        sender,
    } = props;

    const { isPaused } = state;

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