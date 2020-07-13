import React, { useRef, useState, useEffect } from 'react';
import Snackbar from 'node-snackbar';
import io from 'socket.io-client';
import { Header } from './Header';
// import { Buttons } from './Buttons';
// import { isMobileOrTablet } from './_util/device/isMobileOrTablet';
// import { RemoteVideo } from './RemoteVideo';
// import { LocalVideo } from './LocalVideo';
import { setDocumentTitle } from './_util/setDocumentTitle';
import { redirectUnsupportedBrowsers } from './_util/device/redirectUnsupportedBrowsers';
// import { EntireChat } from './EntireChat';
// import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();

export const Chat = () => {

    const initialState = {
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

    const remoteVideoRef = useRef();
    const localVideoRef = useRef();
    const moveableRef = useRef();

    const remoteVideo = remoteVideoRef.current;
    const localVideo = localVideoRef.current;
    const moveable = moveableRef.current;

    useEffect(() => {
        startUp();
    }, [remoteVideo, localVideo]);

    const VideoChat = {
        connected: false,
        willInitiateCall: false,
        localICECandidates: [],
        socket: io('ws://localhost:3001'),
        remoteVideo,
        recognition: undefined,
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

    // // Text Chat
    // // Add text message to chat screen on page
    // const addMessageToScreen = ({ message, isOwnMessage }) => {
    //     const source = (isOwnMessage) ? 'customer' : 'moderator';
    //     // messages.push({source, message});
    // }

    // // Element vars
    // const remoteVideoVanilla = document.getElementById("remote-video");

    const url = window.location.href;
    // const roomHash = url.substring(url.lastIndexOf("/") + 1).toLowerCase();

    // // Called when window is resized
    // const windowResized = () => {
    //     rePositionLocalVideo();
    //     rePositionCaptions();
    // }

    // const receiveCaptions = (captions) => {
    //     updateState({ captionText: '' });
    //     // Other user is not using chrome
    //     if (captions === "notusingchrome") {
    //         alert(
    //             "Other caller must be using chrome for this feature to work. Live Caption turned off."
    //         );
    //         updateState({ isReceivingCaptions: false });
    //         return;
    //     }
    //     updateState({ captionText: captions });
    //     rePositionCaptions();
    // }

    // // Called when socket receives message that room is full
    // const chatRoomFull = () => {
    //     alert(
    //         "Chat room is full. Check to make sure you don't have multiple open tabs, or try with a new room link"
    //     );
    //     // Exit room and redirect
    //     startNewCall();
    // }

    // const startNewCall = () => history.push('/newcall');

    const updateState = (data) => setState(prevState => ({ ...prevState, ...data }));

    // const findSenderByKind = (kind) => {
    //     const senders = VideoChat.peerConnection.getSenders();
    //     return senders.find(sender => (sender.track.kind === kind));
    // }

    const renderHeader = () => <Header />;
    // const renderRemoteVideo = () => <RemoteVideo remoteVideoRef={remoteVideoRef} />

    // const renderLocalVideo = () => {
    //     const childProps = { localVideoRef, isPaused, moveableRef };
    //     return <LocalVideo {...childProps} />
    // }


    const startUp = () => {
        redirectUnsupportedBrowsers();

        setDocumentTitle(url.substring(url.lastIndexOf('/')) + 1); // todo: what is this?

        // // get webcam on load
        // VideoChat.requestMediaStream();

        // // Show accept webcam snackbar
        // Snackbar.show({
        //     text: "Please allow microphone and webcam access",
        //     actionText: "Show Me How",
        //     width: "455px",
        //     pos: "top-right",
        //     actionTextColor: "#616161",
        //     duration: 50000,
        //     onActionClick: function (element) {
        //         window.open(
        //             "https://getacclaim.zendesk.com/hc/en-us/articles/360001547832-Setting-the-default-camera-on-your-browser",
        //             "_blank"
        //         );
        //     },
        // });

        // // Set caption text on start
        // updateState({ captionText: "Waiting for other user to join..." });

        // // Reposition captions on start
        // rePositionCaptions();

        // // On change media devices refresh page and switch to system default
        // navigator.mediaDevices.ondevicechange = () => window.location.reload();
    }

    // Fade out / show UI on mouse move
    // let timedelay = 1;
    // const delayCheck = () => {
    //     if (timedelay === 5) {
    //         // $(".multi-button").fadeOut();
    //         $("#header").fadeOut();
    //         timedelay = 1;
    //     }
    //     timedelay = timedelay + 1;
    // }
    // _delay = setInterval(delayCheck, 500);

    // Reposition captions to bottom of video
    const rePositionCaptions = () => {
        // Get remote video position
        if (!remoteVideo) return;
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

    // const renderButtons = () => <Buttons />;

    // const renderEntireChat = () => <EntireChat />;
    return (
        <div onMouseMove={onMouseMove}>
            {renderHeader()}
            {/* {renderRemoteVideo()}
            {renderLocalVideo()}
            {renderEntireChat()}
            {renderButtons()} */}
        </div>
    )
}