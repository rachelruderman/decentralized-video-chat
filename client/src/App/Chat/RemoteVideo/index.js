// fadeOut this text when live caption ends
import React from 'react';

export const RemoteVideo = ({ remoteVideoRef }) => {
    return (
        <>
            <p id="remote-video-text" />
            <video id="remote-video" autoPlay playsInline ref={remoteVideoRef} />
        </>
    )
}