import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

export const LocalVideo = ({ localVideoRef, isPaused, isInitialized }) => {

    const [text, setText] = useState('No webcam input');

    useEffect(() => {
        switch (true) {
            case (isPaused):
                setText('Video is paused');
                break;
            case (isInitialized):
                setText('Drag me');
                // localVideoText.fadeOut(), 5000);
                break;
            default:
                break;
        }
    }, [isInitialized, isPaused])


    const renderText = () => {
        return <p id="local-video-text">{text}</p>
    }

    const renderVideo = () => (
        <Draggable nodeRef={localVideoRef}>
            <video
                id="local-video"
                autoPlay
                muted
                playsInline
                ref={localVideoRef} />
        </Draggable>

    )

    return (
        <>
            {renderText()}
            {renderVideo()}
        </>
    )
}