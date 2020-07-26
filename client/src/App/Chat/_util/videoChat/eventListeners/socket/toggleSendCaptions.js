import { videoChat } from "../..";

export function toggleSendCaptions() {
    (isSendingCaptions)
        ? videoChat.recognition.stop()
        : startSpeech();

    updateState({ isSendingCaptions: !isSendingCaptions });
}