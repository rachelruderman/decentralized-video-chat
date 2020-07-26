// fadeOut this text when live caption ends
import React, { useState } from 'react';

export const RemoteVideo = ({ remoteVideoRef }) => {

    // todo: fade in the caption
    const [caption, setCaption] = useState('Waiting for other user to join');

    return (
        <>
            <p id="remote-video-text">{caption}</p>
            <video id="remote-video" autoPlay playsInline ref={remoteVideoRef} />
        </>
    )
}