import React, { useState, useRef, useEffect } from 'react';
import { Buttons } from './Buttons';
import { EntireChat } from './EntireChat';
import { RemoteVideo } from './RemoteVideo';
import { LocalVideo } from './LocalVideo';
import { videoChat } from './_util/videoChat';
import { setDocumentTitle } from './_util/setDocumentTitle';
import { redirectUnsupportedBrowsers } from './_util/device/redirectUnsupportedBrowsers';
import { isMobileOrTablet } from './_util/device/isMobileOrTablet';

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

    useEffect(() => {
        redirectUnsupportedBrowsers();
        setDocumentTitle(window.location.pathname);
        rePositionLocalVideo();
        videoChat.requestMediaStream();
    }, [])

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
        const { top } = remoteVideoRef.current.getBoundingClientRect();
        // bounds.top -= 10;
        // bounds.top = bounds.top + remoteVideo.getAttribute('height') - 1 * captionText.height();
        // // Reposition captions
        // captionText.css(bounds);
    }

    // Reposition local video to top left of remote video
    const rePositionLocalVideo = () => {
        // Get position of remote video
        const { top, left } = remoteVideoRef.current.getBoundingClientRect();

        const x = (left + 10);
        const y = (isMobileOrTablet)
            ? (window.innerHeight * 0.7)
            : (top + 10);

        // Set position of local video
        localVideoRef.current.style.transform = `translate(${x}px, ${y}px)`;
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

    const renderRemoteVideo = () => <RemoteVideo {...childProps} />

    const renderLocalVideo = () => <LocalVideo {...childProps} />

    return (
        <div onMouseMove={onMouseMove} id='chat'>
            {renderRemoteVideo()}
            {renderLocalVideo()}
            {renderEntireChat()}
            {renderButtons()}
        </div>
    )
}