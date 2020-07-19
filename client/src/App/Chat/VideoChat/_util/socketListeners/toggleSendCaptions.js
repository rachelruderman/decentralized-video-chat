
export function toggleSendCaptions() {
    (isSendingCaptions)
        ? this.recognition.stop()
        : startSpeech();

    updateState({ isSendingCaptions: !isSendingCaptions });
}