import Snackbar from 'node-snackbar'
import { videoChat } from '../../_util/videoChat';

export const requestToggleCaptions = (props) => {

    const {
        state,
        updateState,
    } = props;

    // Handle requesting captions before connected
    if (!videoChat.isConnected) {
        alert("You must be connected to a peer to use Live Caption");
        return;
    }
    if (!state.isReceivingCaptions) {
        Snackbar.show({
            text:
                "This is an experimental feature. Live caption requires the other user to be using Chrome",
            width: "400px",
            pos: "bottom-center",
            actionTextColor: "#616161",
            duration: 10000,
        });
    }

    // Send request to get captions over data channel
    state.dataChannel.send("tog:");
    updateState({ isReceivingCaptions: !state.isReceivingCaptions });
}