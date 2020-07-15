import React, { useState } from 'react';
import { Header } from './Header';
import { Buttons } from './Buttons';
import { VideoChat } from './VideoChat';
import { EntireChat } from './EntireChat';

export const App = () => {

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
    }

    const [{
        // isMuted,
        // isPaused,
        // isReceivingCaptions,
        // isSendingCaptions,
        // showChat,
        // isFullscreen,
        // dataChannel,
        // mode,
        // chatInput,
        // captionText,
    }, setState] = useState(initialState);

    // // Called when window is resized
    // const windowResized = () => {
    //     rePositionLocalVideo();
    //     rePositionCaptions();
    // }

    const updateState = (data) => setState(prevState => ({ ...prevState, ...data }));

    // const findSenderByKind = (kind) => {
    //     const senders = VideoChat.peerConnection.getSenders();
    //     return senders.find(sender => (sender.track.kind === kind));
    // }

    const renderHeader = () => <Header />;

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

    const renderButtons = () => <Buttons />;

    const renderEntireChat = () => <EntireChat />;

    const renderVideoChat = () => <VideoChat />;

    return (
        <div onMouseMove={onMouseMove}>
            {renderHeader()}
            {renderVideoChat()}
            {/* {renderEntireChat()} */}
            {renderButtons()}
        </div>
    )
}