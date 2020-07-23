import { Component } from 'react';
import { createAnswer } from './_util/createAnswer';
import { createOffer } from './_util/createOffer';
import { setDocumentTitle } from '../_util/setDocumentTitle';
import { redirectUnsupportedBrowsers } from '../_util/device/redirectUnsupportedBrowsers';
import io from 'socket.io-client';
import { onFull } from './eventListeners/socket/onFull';
import { onOffer } from './eventListeners/socket/onOffer';
import { onReady } from './eventListeners/socket/onReady';
import { onAddStream } from './eventListeners/peerConnection/onAddStream';
import { receiveCaptions } from './eventListeners/socket/receiveCaptions';
import { onCandidate } from './eventListeners/socket/onCandidate';
import { onIceCandidate } from './eventListeners/peerConnection/onIceCandidate';
import { onToken } from './eventListeners/socket/onToken';
import { startCall } from './_util/startCall';
import { findSenderByKind } from './eventListeners/peerConnection/findSenderByKind';
import { onWillInitiateCall } from './eventListeners/socket/onWillInitiateCall';
import { requestMediaStream } from './eventListeners/mediaStream/requestMediaStream';
import { onMediaStream } from './eventListeners/mediaStream/onMediaStream';
import { addSocketListeners } from './eventListeners/socket/addSocketListeners';

// video chat is a use case for a class component
export class VideoChat extends Component {
    constructor(props) {
        super(props);

        this.isConnected = false;
        this.willInitiateCall = false;
        this.localICECandidates = [];
        this.recognition = undefined;

        this.roomHash = window.location.href.substring(window.location.href.lastIndexOf("/") + 1).toLowerCase();
        this.localStream = null;

        // websocket
        this.socket = io('ws://localhost:3001');
        this.onFull = onFull;
        this.onOffer = onOffer;
        this.onReady = onReady;
        this.addSocketListeners = addSocketListeners;

        // media stream
        this.requestMediaStream = requestMediaStream;
        this.onMediaStream = onMediaStream;

        // this.handleReceiveMessage = handleReceiveMessage;
        this.startCall = startCall;
        this.onToken = onToken;
        this.onIceCandidate = onIceCandidate
        this.onCandidate = onCandidate
        this.createOffer = createOffer;
        this.createAnswer = createAnswer;
        this.onAddStream = onAddStream;
        this.receiveCaptions = receiveCaptions;
        this.findSenderByKind = findSenderByKind;
        this.onWillInitiateCall = onWillInitiateCall;
    }

    componentDidMount = async () => {
        redirectUnsupportedBrowsers();
        setDocumentTitle(`${window.location.pathname}1`); // todo: what is this?
        // rePositionLocalVideo();
        await this.requestMediaStream();
    }

    componentDidUpdate = (prevProps, prevState) => {
        const didToggleMute = (prevProps.state.isMuted !== this.props.state.isMuted);
        if (didToggleMute) {
            const sender = this.findSenderByKind('audio');
            sender.track.enabled = this.props.state.isMuted;
        }
    }

    // useInitializeVideoChat = ({ remoteVideoRef, localVideoRef });


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

    render() {
        return null;
    }
}