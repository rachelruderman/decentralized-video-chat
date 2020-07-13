
export const toggleSendCaptions = () => {
    (isSendingCaptions)
        ? VideoChat.recognition.stop()
        : startSpeech();

    updateState({ isSendingCaptions: !isSendingCaptions });
}