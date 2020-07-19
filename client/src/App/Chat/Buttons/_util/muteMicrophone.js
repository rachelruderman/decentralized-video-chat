export const muteMicrophone = (props) => {
    const {
        updateState,
        state,
    } = props;
    updateState({ isMuted: !state.isMuted });
}