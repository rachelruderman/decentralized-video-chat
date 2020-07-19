import React, { useState, useRef } from 'react';
import { Buttons } from './Buttons';
import { VideoChat } from './VideoChat';
import { EntireChat } from './EntireChat';

export const Chat = () => {

    const initialState = {
        isInitialized: false,
        isMuted: false,
        isPaused: false,
        isReceivingCaptions: false,
        isSendingCaptions: false,
        showChat: false,
        // isFullscreen: false,
        dataChannel: null,
        mode: 'camera',
        chatInput: '',
        captionText: '',
        peerConnection: null,
    }

    const [state, setState] = useState(initialState);

    // // Called when window is resized
    // const windowResized = () => {
    //     rePositionLocalVideo();
    //     rePositionCaptions();
    // }

    const remoteVideoRef = useRef();
    const localVideoRef = useRef();

    const remoteVideo = remoteVideoRef.current;
    const localVideo = localVideoRef.current;

    const updateState = (data) => setState(prevState => ({ ...prevState, ...data }));

    // Reposition captions to bottom of video
    const rePositionCaptions = () => {
        // let bounds = remoteVideo.getBoundingClientRect();
        // bounds.top -= 10;
        // bounds.top = bounds.top + remoteVideo.getAttribute('height') - 1 * captionText.height();
        // // Reposition captions
        // captionText.css(bounds);
    }

    const onMouseMove = () => {
        // $(".multi-button").fadeIn();
        // $("#header").fadeIn();
        // $(".multi-button").style = "";
        // timedelay = 1;
        // clearInterval(_delay);
        // _delay = setInterval(delayCheck, 500);
    }

    const childProps = {
        state,
        updateState,
        remoteVideoRef,
        localVideoRef,
        remoteVideo,
        localVideo
    };

    const renderButtons = () => <Buttons {...childProps} />;

    const renderEntireChat = () => <EntireChat {...childProps} />;

    const renderVideoChat = () => <VideoChat {...childProps} />;

    return (
        <div onMouseMove={onMouseMove}>
            {renderVideoChat()}
            {renderEntireChat()}
            {renderButtons()}
        </div>
    )
}