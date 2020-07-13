import React, { useState } from 'react';

export const EntireChat = ({ showChat }) => {

    const messages = useState([]);

    if (!showChat) return null; // fade in and out

    const onKeyPress = (e) => {
        if (e.keyCode === 13) {
            // Prevent page refresh on enter
            e.preventDefault();
            let message = e.target.value;
            // Prevent cross site scripting
            message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            // Make links clickable
            message = message.autoLink();
            // Send message over data channel
            dataChannel.send(`mes:${message}`);
            // Add message to screen
            addMessageToScreen({ message, isOwnMessage: true });
            // Auto scroll chat down
            chatZone.scrollTop(chatZone[0].scrollHeight);
            // Clear chat input
            e.target.value = "";
        }
    }

    return (
        <div id="entire-chat">
            <div id="chat-zone">
                <div className="chat-messages">
                    {messages.map(({ message, source }) => {
                        return (
                            <div className={`message-item ${source} cssanimation fadeInBottom`}>
                                <div class="message-bloc">
                                    <div class="message">
                                        {message}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <form className="compose">
                <input type="text" placeholder="Type a message" onKeyPress={onKeyPress} />
            </form>
        </div>
    )
}