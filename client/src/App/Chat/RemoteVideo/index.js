// fadeOut this text when live caption ends
import React from 'react';

export const RemoteVideo = ({ remoteVideoRef }) => {
    console.log('rendering remote vid')
    return (
        <>
            <p id="remote-video-text" />
            <video id="remote-video" autoPlay playsInline ref={remoteVideoRef} />
        </>
    )
}