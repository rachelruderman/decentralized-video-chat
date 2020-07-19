import React, { useRef, Fragment } from 'react';
import { useInitializeVideoChat } from './_hooks/useInitializeVideoChat';
import { RemoteVideo } from './RemoteVideo';
import { LocalVideo } from './LocalVideo';
// video chat is a use case for a class component
export const VideoChat = (props) => {



    const { remoteVideoRef, localVideoRef, remoteVideo, localVideo } = props;

    useInitializeVideoChat({ remoteVideoRef, localVideoRef });

    const renderRemoteVideo = () => <RemoteVideo {...props} />

    const renderLocalVideo = () => <LocalVideo {...props} />

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
        <Fragment>
            {renderRemoteVideo()}
            {renderLocalVideo()}
        </Fragment>
    )
}