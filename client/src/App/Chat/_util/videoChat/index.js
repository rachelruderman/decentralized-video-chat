import { requestMediaStream } from "./_util/requestMediaStream";
import { onMediaStream } from "./_util/onMediaStream";
import { startCall } from "./_util/startCall";
import { onToken } from "./_util/onToken";
import { onIceCandidate } from "./_util/onIceCandidate";
import { onCandidate } from "./_util/onCandidate";
import { createOffer } from "./_util/createOffer";
import { createAnswer } from "./_util/createAnswer";
import { onAddStream } from "./_util/onAddStream";
import io from 'socket.io-client';
import { onChatRoomFull } from "./_util/onChatRoomFull";
import { redirectToNewCall } from "./_util/redirectToNewCall";
import { receiveCaptions } from "./_util/receiveCaptions";

export const VideoChat = {
    connected: false,
    willInitiateCall: false,
    localICECandidates: [],
    socket: io('ws://localhost:3001'),
    remoteVideo: null,
    recognition: undefined,
    roomHash: window.location.href.substring(window.location.href.lastIndexOf("/") + 1).toLowerCase(),

    requestMediaStream,
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