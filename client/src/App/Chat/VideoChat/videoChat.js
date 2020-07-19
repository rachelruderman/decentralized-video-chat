import { onMediaStream } from "./_util/onMediaStream";
import { startCall } from "./_util/startCall";
import { onToken } from "./_util/socketListeners/onToken";
import { onIceCandidate } from "./_util/onIceCandidate";
import { onCandidate } from "./_util/socketListeners/onCandidate";
import { createOffer } from "./_util/createOffer";
import { createAnswer } from "./_util/createAnswer";
import { onAddStream } from "./_util/peerConnectionListeners/onAddStream";
import io from 'socket.io-client';
import { redirectToNewCall } from "./_util/redirectToNewCall";
import { receiveCaptions } from "./_util/socketListeners/receiveCaptions";

export const VideoChat = {
    connected: false,
    willInitiateCall: false,
    localICECandidates: [],
    socket: io('ws://localhost:3001'),
    remoteVideo: {},
    recognition: undefined,
    roomHash: window.location.href.substring(window.location.href.lastIndexOf("/") + 1).toLowerCase(),

    onMediaStream,
    startCall,
    onToken,
    onIceCandidate,
    onCandidate,
    createOffer,
    createAnswer,
    onAddStream,
    onChatRoomFull,
    redirectToNewCall,
    receiveCaptions,
}