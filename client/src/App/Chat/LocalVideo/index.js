import React from 'react';
import Draggable from 'react-draggable';

export const LocalVideo = ({ moveableRef, localVideoRef, isPaused }) => {

    const renderText = () => {
        let text = 'No webcam input';

        switch (true) {
            case (isPaused):
                text = 'Video is paused';
                break;
            default:
                break;
        }
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