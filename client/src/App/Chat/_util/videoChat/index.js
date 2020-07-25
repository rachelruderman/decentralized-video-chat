import { createAnswer } from './_util/createAnswer';
import { createOffer } from './_util/createOffer';
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

export const videoChat = {
    // todo: organize these into subobjects

    // websocket
    socket: io(),
    isConnected: false,
    willInitiateCall: false,
    onFull,
    onOffer,
    onReady,
    addSocketListeners,

    // media stream
    requestMediaStream,
    onMediaStream,

    // unknown
    localStream: null,
    roomHash: window.location.href.substring(window.location.href.lastIndexOf("/") + 1).toLowerCase(),
    localICECandidates: [],
    remoteVideo: document.getElementById("remote-video"),
    localVideo: document.getElementById("local-video"),
    recognition: undefined,

    startCall,
    onToken,
    onIceCandidate,
    onCandidate,
    createOffer,
    createAnswer,
    onAddStream,
    receiveCaptions,
    findSenderByKind,
    onWillInitiateCall,
}