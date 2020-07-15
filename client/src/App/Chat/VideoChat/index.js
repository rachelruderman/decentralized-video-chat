import React from 'react';
import { useInitializeVideoChat } from './_hooks/useInitializeVideoChat';

export const VideoChat = ({ isPaused }) => {

    const remoteVideoRef = useRef();
    const localVideoRef = useRef();

    const remoteVideo = remoteVideoRef.current;
    const localVideo = localVideoRef.current;

    useInitializeVideoChat({ remoteVideo, localVideo });
    const renderRemoteVideo = () => <RemoteVideo remoteVideoRef={remoteVideoRef} />

    const renderLocalVideo = () => {
        const childProps = { localVideoRef, isPaused };
        return <LocalVideo {...childProps} />
    }

    // const rePositionLocalVideo = () => {
    //     // Get position of remote video
    //     if (!remoteVideo) return;

    //     let bounds = remoteVideo.getBoundingClientRect();

    //     if (isMobileOrTablet) {
    //         bounds.top = window.innerHeight * 0.7;
    //         bounds.left += 10;
    //     } else {
    //         bounds.top += 10;
    //         bounds.left += 10;
    //     }
    //     // Set position of local video
    //     moveable.style = { ...moveable.style, ...bounds };
    // }

    return (
        <div>
            {renderRemoteVideo()}
            {renerLocalVideo()}
        </div>
    )
}