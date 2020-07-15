import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

export const LocalVideo = ({ moveableRef, localVideoRef, isPaused, isInitialized }) => {

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
        <video id="local-video" autoPlay muted playsInline ref={localVideoRef} />
    )

    return (
        <Draggable
            ref={moveableRef}
            axis="x"
            defaultPosition={{ x: 0, y: 0 }}
            position={null}
            grid={[25, 25]}
            scale={1}
        >
            {renderText()}
            {renderVideo()}
        </Draggable>
    )
}