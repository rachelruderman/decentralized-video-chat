import React, { useRef, useState, useEffect } from 'react';
import DetectRTC from 'detectrtc';
import Snackbar from 'node-snackbar';
import io from 'socket.io-client';
import { Header } from './Header';
import { isWebRTCSupported } from './_util/isWebRtcSupported';
import { Buttons } from './Buttons';
import { logIt } from './_util/logIt';
import { isMobileOrTablet } from './_util/isMobileOrTablet';
import { RemoteVideo } from './RemoteVideo';
import { LocalVideo } from './LocalVideo';

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
        chatInput,
        captionText: '',
    }

    const [{
        isMuted,
        isPaused,
        isReceivingCaptions,
        isSendingCaptions,
        showChat,
        // isFullscreen,
        dataChannel,
        mode,
        chatInput,
        captionText,
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
        socket: io(),
        remoteVideo,
        recognition: undefined,
    }

    const rePositionLocalVideo = () => {
        // Get position of remote video
        if (!remoteVideo) return;

        let bounds = remoteVideo.getBoundingClientRect();

        if (isMobileOrTablet) {
            bounds.top = window.innerHeight * 0.7;
            bounds.left += 10;
        } else {
            bounds.top += 10;
            bounds.left += 10;
        }
        // Set position of local video
        moveable.style = { ...moveable.style, ...bounds };
    }

    // Text Chat
    // Add text message to chat screen on page
    const addMessageToScreen = ({ message, isOwnMessage }) => {
        const user = (isOwnMessage) ? 'customer' : 'moderator';

        $(".chat-messages").append(
            `<div class="message-item ${user} cssanimation fadeInBottom"><div class="message-bloc"><div class="message">${message}</div></div></div>`
        );
    }

    // Called when a message is received over the dataChannel
    const handleReceiveMessage = (message) => {
        // Add message to screen
        addMessageToScreen({ message, isOwnMessage: false });
        // Auto scroll chat down
        chatZone.scrollTop(chatZone[0].scrollHeight);
        // Show chat if hidden
        if (!showChat) {
            toggleChat();
        }
    }

    // Start speech recognition
    const startSpeech = () => {
        try {
            var SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            VideoChat.recognition = new SpeechRecognition();
            // VideoChat.recognition.lang = "en";
        } catch (e) {
            sendingCaptions = false;
            logIt(e);
            logIt("error importing speech library");
            // Alert other user that they cannon use live caption
            dataChannel.send("cap:notusingchrome");
            return;
        }
        // recognition.maxAlternatives = 3;
        VideoChat.recognition.continuous = true;
        // Show results that aren't final
        VideoChat.recognition.interimResults = true;
        var finalTranscript;
        VideoChat.recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
                var transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                    var charsToKeep = interimTranscript.length % 100;
                    // Send captions over data chanel,
                    // subtracting as many complete 100 char slices from start
                    dataChannel.send(
                        "cap:" +
                        interimTranscript.substring(interimTranscript.length - charsToKeep)
                    );
                }
            }
        };
        VideoChat.recognition.onend = function () {
            logIt("on speech recording end");
            // Restart speech recognition if user has not stopped it
            if (sendingCaptions) {
                startSpeech();
            } else {
                VideoChat.recognition.stop();
            }
        };
        VideoChat.recognition.start();
    }
    // Get name of browser session using user agent
    const getBrowserName = () => {
        const { userAgent } = window.navigator;

        if (userAgent.includes('MSIE')) {
            return 'Unknown';
        }

        const browsers = [
            'Firefox',
            'Opera',
            'Chrome',
            'Safari'
        ];

        const browser = browsers.find(browser => userAgent.includes(browser));

        return (browser || 'Unknown');
    }

    // Element vars
    const remoteVideoVanilla = document.getElementById("remote-video");
    const localVideoText = $("#local-video-text");
    const entireChat = $("#entire-chat");
    const chatZone = $("#chat-zone");

    const browserName = getBrowserName();
    const url = window.location.href;
    const roomHash = url.substring(url.lastIndexOf("/") + 1).toLowerCase();

    // Called when window is resized
    const windowResized = () => {
        rePositionLocalVideo();
        rePositionCaptions();
    }

    const receiveCaptions = (captions) => {
        updateState({ captionText: '' });
        // Other user is not using chrome
        if (captions === "notusingchrome") {
            alert(
                "Other caller must be using chrome for this feature to work. Live Caption turned off."
            );
            updateState({ isReceivingCaptions: false });
            return;
        }
        updateState({ captionText: captions });
        rePositionCaptions();
    }

    // Called when socket receives message that room is full
    const chatRoomFull = () => {
        alert(
            "Chat room is full. Check to make sure you don't have multiple open tabs, or try with a new room link"
        );
        // Exit room and redirect
        startNewCall();
    }

    const startNewCall = () => history.push('/newcall');

    const updateState = (data) => setState(prevState => ({ ...prevState, ...data }));

    const findSenderByKind = (kind) => {
        const senders = VideoChat.peerConnection.getSenders();
        return senders.find(sender => (sender.track.kind === kind));
    }

    const renderHeader = () => <Header />;
    const renderRemoteVideo = () => <RemoteVideo remoteVideoRef={remoteVideoRef} />

    const renderLocalVideo = () => {
        const childProps = { localVideoRef, isPaused, moveableRef };
        return <LocalVideo {...childProps} />
    }

    // When a browser receives an offer, set up a callback to be run when the
    // ephemeral token is returned from Twilio.
    const onOffer = (offer) => {
        logIt("onOffer <<< Received offer");
        VideoChat.socket.on(
            "token",
            VideoChat.onToken(VideoChat.createAnswer(offer))
        );
        VideoChat.socket.emit("token", roomHash);
    }

    // When an answer is received, add it to the peerConnection as the remote description.
    const onAnswer = (answer) => {
        logIt("onAnswer <<< Received answer");
        const rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
        // Set remote description of RTCSession
        VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
        // The caller now knows that the callee is ready to accept new ICE candidates, so sending the buffer over
        VideoChat.localICECandidates.forEach((candidate) => {
            logIt(`>>> Sending local ICE candidate (${candidate.address})`);
            // Send ice candidate over websocket
            VideoChat.socket.emit("candidate", JSON.stringify(candidate), roomHash);
        });
        // Reset the buffer of local ICE candidates. This is not really needed, but it's good practice
        VideoChat.localICECandidates = [];
    }

    // When we are ready to call, enable the Call button.
    const readyToCall = () => {
        logIt("readyToCall");
        // First to join call will most likely initiate call
        if (VideoChat.willInitiateCall) {
            logIt("Initiating call");
            VideoChat.startCall();
        }
    }

    const toggleSendCaptions = () => {
        (isSendingCaptions)
            ? VideoChat.recognition.stop()
            : startSpeech();

        updateState({ isSendingCaptions: !isSendingCaptions });
    }

    const startUp = () => {
        //  Try and detect in-app browsers and redirect
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isInAppBrowser = DetectRTC.isMobileDevice && ['FBAN', 'FBAV', 'Instagram'].includes(ua);
        const isIos = DetectRTC.osName === "iOS";

        if (isInAppBrowser) {
            window.location.href = `/notsupported${isIos ? 'ios' : ''}`;
        }

        // Redirect all iOS browsers that are not Safari
        if (DetectRTC.isMobileDevice) {
            if (isIos && !DetectRTC.browser.isSafari) {
                window.location.href = "/notsupportedios";
            }
        }

        if (!isWebRTCSupported || browserName === "MSIE") {
            window.location.href = "/notsupported";
        }

        // Set tab title
        document.title = "Zipcall - " + url.substring(url.lastIndexOf("/") + 1);

        // get webcam on load
        VideoChat.requestMediaStream();

        // Make local video draggable
        if (moveable && moveable.draggable) {
            moveable.draggable({ containment: "window" });
        }

        // Show accept webcam snackbar
        Snackbar.show({
            text: "Please allow microphone and webcam access",
            actionText: "Show Me How",
            width: "455px",
            pos: "top-right",
            actionTextColor: "#616161",
            duration: 50000,
            onActionClick: function (element) {
                window.open(
                    "https://getacclaim.zendesk.com/hc/en-us/articles/360001547832-Setting-the-default-camera-on-your-browser",
                    "_blank"
                );
            },
        });

        // Set caption text on start
        updateState({ captionText: "Waiting for other user to join..." });

        // Reposition captions on start
        rePositionCaptions();

        // On change media devices refresh page and switch to system default
        navigator.mediaDevices.ondevicechange = () => window.location.reload();
    }

    // Fade out / show UI on mouse move
    let timedelay = 1;
    const delayCheck = () => {
        if (timedelay === 5) {
            // $(".multi-button").fadeOut();
            $("#header").fadeOut();
            timedelay = 1;
        }
        timedelay = timedelay + 1;
    }
    _delay = setInterval(delayCheck, 500);

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
        $(".multi-button").fadeIn();
        $("#header").fadeIn();
        $(".multi-button").style = "";
        timedelay = 1;
        clearInterval(_delay);
        _delay = setInterval(delayCheck, 500);
    }

    const renderButtons = () => <Buttons />;

    return (
        <div onMouseMove={onMouseMove}>
            {renderHeader()}
            {renderRemoteVideo()}
            {renderLocalVideo()}
            {renderChat()}
            {renderButtons()}
        </div>
    )
}