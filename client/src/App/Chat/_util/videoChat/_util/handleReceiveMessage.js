
// Called when a message is received over the dataChannel
export function handleReceiveMessage(message) {
    // Add message to screen
    addMessageToScreen({ message, isOwnMessage: false });
    // // Auto scroll chat down
    // chatZone.scrollTop(chatZone[0].scrollHeight);
    // Show chat if hidden
    if (!showChat) {
        toggleChat();
    }
}