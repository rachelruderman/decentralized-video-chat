// fadeOut this text when live caption ends
import React, { useState } from 'react';

export const RemoteVideo = ({ remoteVideoRef, remoteVideoTextRef }) => {

    // todo: fade in the caption
    const [caption, setCaption] = useState('Waiting for other user to join');

    // when videoChat.isConnected in onAddStream, fade out the caption
    return (
        <div id='remote-video-container'>
            <video id="remote-video" autoPlay playsInline ref={remoteVideoRef} />
            <p id="remote-video-text" ref={remoteVideoTextRef}>{caption}</p>
        </div>
    )
}