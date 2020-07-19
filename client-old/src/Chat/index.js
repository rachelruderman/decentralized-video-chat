// todo - put in own directory
const Button = ({ button }) => {
    const {
        isEnabled,
        onClick,
        baseId,
    } = button;

    // // Hide button labels on load
    // $(".HoverState").hide();

    // // Show hide button labels on hover
    // $(".hoverButton").mouseover(function () {
    //     $(".HoverState").hide();
    //     $(this).next().show();
    // });
    // $(".hoverButton").mouseout(function () {
    //     $(".HoverState").hide();
    // });

    const prefix = (isEnabled) ? 'disable' : 'enable';
    const text = button[`${prefix}Text`];
    const icon = button[`${prefix}Icon`];

    return (
        <div className="buttonContainer">
            <button className="hoverButton" onClick={onClick}>
                <i id={`${baseId}-icon`} className={`$fas fa-${icon} fa-xs`}></i>
            </button>
            <div id={`${baseId}-text`} className="HoverState">{text}</div>
        </div>
    )
}

const Chat = () => {

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
    }, setState] = React.useState(initialState);

    const remoteVideoRef = React.useRef();
    const localVideoRef = React.useRef();
    const moveableRef = React.useRef();

    const remoteVideo = remoteVideoRef.current;
    const localVideo = localVideoRef.current;
    const moveable = moveableRef.current;

    React.useEffect(() => {
        startUp();
    }, [remoteVideo, localVideo]);

    const VideoChat = {
        connected: false,
        willInitiateCall: false,
        localICECandidates: [],
        socket: io(),
        remoteVideo,
        recognition: undefined,

        // Set up a callback to run when we have the ephemeral token to use Twilio's TURN server.
        startCall: function (event) {
            logIt("startCall >>> Sending token request...");
            this.socket.on("token", this.onToken(this.createOffer));
            this.socket.emit("token", roomHash);
        },

        // When the peerConnection generates an ice candidate, send it over the socket to the peer.
        onIceCandidate: function (event) {
            logIt("onIceCandidate");
            if (event.candidate) {
                logIt(
                    `<<< Received local ICE candidate from STUN/TURN server (${event.candidate.address})`
                );
                if (this.connected) {
                    logIt(`>>> Sending local ICE candidate (${event.candidate.address})`);
                    this.socket.emit(
                        "candidate",
                        JSON.stringify(event.candidate),
                        roomHash
                    );
                } else {
                    // If we are not 'connected' to the other peer, we are buffering the local ICE candidates.
                    // This most likely is happening on the "caller" side.
                    // The peer may not have created the RTCPeerConnection yet, so we are waiting for the 'answer'
                    // to arrive. This will signal that the peer is ready to receive signaling.
                    this.localICECandidates.push(event.candidate);
                }
            }
        },

        // When receiving a candidate over the socket, turn it back into a real
        // RTCIceCandidate and add it to the peerConnection.
        onCandidate: function (candidate) {
            // Update caption text
            updateState({ captionText: "Found other user... connecting" });
            rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
            logIt(
                `onCandidate <<< Received remote ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`
            );
            this.peerConnection.addIceCandidate(rtcCandidate);
        },

        // Create an offer that contains the media capabilities of the browser.
        createOffer: function () {
            logIt("createOffer >>> Creating offer...");
            this.peerConnection.createOffer(
                function (offer) {
                    // If the offer is created successfully, set it as the local description
                    // and send it over the socket connection to initiate the peerConnection
                    // on the other side.
                    this.peerConnection.setLocalDescription(offer);
                    this.socket.emit("offer", JSON.stringify(offer), roomHash);
                },
                function (err) {
                    logIt("failed offer creation");
                    logIt(err, true);
                }
            );
        },

        // Create an answer with the media capabilities that both browsers share.
        // This function is called with the offer from the originating browser, which
        // needs to be parsed into an RTCSessionDescription and added as the remote
        // description to the peerConnection object. Then the answer is created in the
        // same manner as the offer and sent over the socket.
        createAnswer: function (offer) {
            logIt("createAnswer");
            return function () {
                logIt(">>> Creating answer...");
                rtcOffer = new RTCSessionDescription(JSON.parse(offer));
                this.peerConnection.setRemoteDescription(rtcOffer);
                this.peerConnection.createAnswer(
                    function (answer) {
                        this.peerConnection.setLocalDescription(answer);
                        this.socket.emit("answer", JSON.stringify(answer), roomHash);
                    },
                    function (err) {
                        logIt("Failed answer creation.");
                        logIt(err, true);
                    }
                );
            };
        },


        // Called when a stream is added to the peer connection
        onAddStream: function (event) {
            logIt("onAddStream <<< Received new stream from remote. Adding it...");
            // Update remote video source
            this.remoteVideo.srcObject = event.stream;
            // Close the initial share url snackbar
            Snackbar.close();
            // Remove the loading gif from video
            this.remoteVideo.style.background = "none";
            // Update connection status
            this.connected = true;
            // Hide caption status text
            captionText.fadeOut();
            // Reposition local video after a second, as there is often a delay
            // between adding a stream and the height of the video div changing
            setTimeout(() => rePositionLocalVideo(), 500);
            // var timesRun = 0;
            // var interval = setInterval(function () {
            //   timesRun += 1;
            //   if (timesRun === 10) {
            //     clearInterval(interval);
            //   }
            //   rePositionLocalVideo();
            // }, 300);
        },
    }

    // Swap camera / screen share
    const swap = () => {
        // Handle swap video before video call is connected
        if (!this.connected) {
            alert("You must join a call before you can share your screen.");
            return;
        }
        // Store swap button icon and text
        const swapIcon = document.getElementById("swap-icon");
        const swapText = document.getElementById("swap-text");
        // If mode is camera then switch to screen share
        if (mode === "camera") {
            // Show accept screenshare snackbar
            Snackbar.show({
                text:
                    "Please allow screen share. Click the middle of the picture above and then press share.",
                width: "400px",
                pos: "bottom-center",
                actionTextColor: "#616161",
                duration: 50000,
            });
            // Request screen share, note we dont want to capture audio
            // as we already have the stream from the Webcam
            navigator.mediaDevices
                .getDisplayMedia({
                    video: true,
                    audio: false,
                })
                .then(function (stream) {
                    // Close allow screenshare snackbar
                    Snackbar.close();
                    // Change display mode
                    updateState({ mode: 'screen' });
                    // Update swap button icon and text
                    swapIcon.classList.remove("fa-desktop");
                    swapIcon.classList.add("fa-camera");
                    swapText.innerText = "Share Webcam";
                    switchStreamHelper(stream);
                })
                .catch(function (err) {
                    logIt(err);
                    logIt("Error sharing screen");
                    Snackbar.close();
                });
            // If mode is screenshare then switch to webcam
        } else {
            // Stop the screen share track
            localVideo.srcObject.getTracks().forEach((track) => track.stop());
            // Get webcam input
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: true,
                })
                .then(function (stream) {
                    // Change display mode
                    updateState({ mode: 'camera' });
                    // Update swap button icon and text
                    swapIcon.classList.remove("fa-camera");
                    swapIcon.classList.add("fa-desktop");
                    swapText.innerText = "Share Screen";
                    switchStreamHelper(stream);
                });
        }
    }

    // Swap current video track with passed in stream
    const switchStreamHelper = (stream) => {
        // Get current video track
        let videoTrack = stream.getVideoTracks()[0];
        // Add listen for if the current track swaps, swap back
        videoTrack.onended = function () {
            swap();
        };
        if (this.connected) {
            // Find sender
            const sender = findSenderByKind(videoTrack.kind);
            // Replace sender track
            sender.replaceTrack(videoTrack);
        }
        // Update local video stream
        this.localStream = videoTrack;
        // Update local video object
        localVideo.srcObject = stream;
        // Unpause video on swap
        if (isPaused) {
            pauseVideo();
        }
    }

    const rePositionLocalVideo = () => {
        // Get position of remote video
        if (!remoteVideo) return;

        const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )

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

    //Picture in picture
    const togglePictureInPicture = () => {
        const isPipSupported = (
            "pictureInPictureEnabled" in document ||
            remoteVideoVanilla.webkitSetPresentationMode
        )

        if (isPipSupported) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture().catch((error) => {
                    logIt("Error exiting pip.");
                    logIt(error);
                });
            } else if (remoteVideoVanilla.webkitPresentationMode === "inline") {
                remoteVideoVanilla.webkitSetPresentationMode("picture-in-picture");
            } else if (
                remoteVideoVanilla.webkitPresentationMode === "picture-in-picture"
            ) {
                remoteVideoVanilla.webkitSetPresentationMode("inline");
            } else {
                remoteVideoVanilla.requestPictureInPicture().catch((error) => {
                    alert(
                        "You must be connected to another person to enter picture in picture."
                    );
                });
            }
        } else {
            alert(
                "Picture in picture is not supported in your browser. Consider using Chrome or Safari."
            );
        }
    }

    // Start speech recognition
    const startSpeech = () => {
        try {
            var SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            // this.recognition.lang = "en";
        } catch (e) {
            sendingCaptions = false;
            logIt(e);
            logIt("error importing speech library");
            // Alert other user that they cannon use live caption
            dataChannel.send("cap:notusingchrome");
            return;
        }
        // recognition.maxAlternatives = 3;
        this.recognition.continuous = true;
        // Show results that aren't final
        this.recognition.interimResults = true;
        var finalTranscript;
        this.recognition.onresult = (event) => {
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
        this.recognition.onend = function () {
            logIt("on speech recording end");
            // Restart speech recognition if user has not stopped it
            if (sendingCaptions) {
                startSpeech();
            } else {
                this.recognition.stop();
            }
        };
        this.recognition.start();
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

    const isWebRTCSupported =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        window.RTCPeerConnection;

    const logIt = (message, error) => {
        console.log(message);
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
        const senders = this.peerConnection.getSenders();
        return senders.find(sender => (sender.track.kind === kind));
    }

    // Show and hide chat
    const toggleChat = () => updateState({ showChat: !showChat });

    const pauseVideo = () => {
        const sender = findSenderByKind(video);
        if (sender) {
            updateState({ isPaused: !sender.track.enabled })
            sender.track.enabled = isPaused;
            updateState({ isPaused: !isPaused })
            // update pause button icon and text
            if (videoIsPaused) {
                // localVideoText.show();
            } else {
                // setTimeout(() => localVideoText.fadeOut(), 2000);
            }
        }
    }

    const renderHeader = () => (
        <div id="header">
            <a target="_blank" href="/">
                <img src="/images/logo.svg" alt="Neon" width="48" height="48" />
                <p>Zipcall</p>
            </a>
        </div>
    )

    const renderRemoteVideoText = () => {
        // fadeOut this text when live caption ends
        return (
            <p id="remote-video-text" />
        )
    }

    const renderRemoteVideo = () => {
        return (
            <video id="remote-video" autoPlay playsInline ref={remoteVideoRef} />
        )
    }

    const renderLocalVideo = () => {
        let text = 'No webcam input';

        switch (true) {
            case (isPaused):
                text = 'Video is paused';
                break;
            default:
                break;
        }
        return (
            <div id="moveable" ref={moveableRef}>
                <p id="local-video-text">{text}</p>
                <video id="local-video" autoPlay muted playsInline ref={localVideoRef} />
            </div>
        )
    }

    const renderChat = () => {
        if (!showChat) return null; // fade in and out

        const onKeyPress = (event) => {
            if (event.keyCode === 13) {
                // Prevent page refresh on enter
                event.preventDefault();
                let message = event.target.value;
                // Prevent cross site scripting
                message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                // Make links clickable
                message = message.autoLink();
                // Send message over data channel
                dataChannel.send(`mes:${message}`);
                // Add message to screen
                addMessageToScreen({ message, isOwnMessage: true });
                // Auto scroll chat down
                chatZone.scrollTop(chatZone[0].scrollHeight);
                // Clear chat input
                event.target.value = "";
            }
        }

        return (
            <div id="entire-chat">
                <div id="chat-zone">
                    <div className="chat-messages"></div>
                </div>
                <form className="compose">
                    <input type="text" placeholder="Type a message" onKeyPress={onKeyPress} />
                </form>
            </div>
        )
    }

    const muteMicrophone = () => {
        const sender = findSenderByKind('audio');
        if (sender) {
            updateState({ isMuted: !sender.track.enabled })
            sender.track.enabled = isMuted;
            updateState({ isMuted: !isMuted })
        }
    }

    const renderButtons = () => {
        const buttons = [
            {
                onClick: muteMicrophone,
                baseId: 'mic',
                enableText: 'Mute',
                enableIcon: 'microphone',
                disableText: 'Unmute',
                disableIcon: 'microphone-slash',
            },
            // {
            //     onClick: openFullScreen,
            //     baseId: '',
            //     enableIcon: 'compress',
            //     enableText: 'Fullscreen'
            // },
            {
                onClick: pauseVideo,
                baseId: 'video',
                enableText: 'Pause Video',
                enableIcon: 'video',
                disableText: 'Unpause Video',
                disableIcon: 'video-slash',
            },
            {
                onClick: swap,
                baseId: 'swap',
                enableText: 'Share Screen',
                enableIcon: 'desktop',
            },
            {
                onClick: toggleChat,
                baseId: 'chat',
                enableText: 'Show Chat',
                enableIcon: 'comment',
                disableText: 'Hide Chat',
                disableIcon: 'comment-slash',
            },
            {
                onClick: togglePictureInPicture,
                baseId: 'pip',
                enableText: 'Toggle Picture in Picture',
                enableIcon: 'external-link-alt',
            },
            {
                onClick: requestToggleCaptions,
                baseId: 'caption',
                enableText: 'Start Live Caption',
                enableIcon: 'closed-captioning',
                disableText: 'End Live Caption',
                disableIcon: 'closed-captioning-slash',
            },
            {
                onClick: startNewCall,
                baseId: 'end-call',
                enableText: 'End Call',
                enableIcon: 'phone-slash',
            },
        ]

        return (
            <div className='multi-button'>
                {buttons.map(button => <Button key={button.baseId} button={button} />)}
            </div>
        )
    }


    // When a browser receives an offer, set up a callback to be run when the
    // ephemeral token is returned from Twilio.
    const onOffer = (offer) => {
        logIt("onOffer <<< Received offer");
        this.socket.on(
            "token",
            this.onToken(this.createAnswer(offer))
        );
        this.socket.emit("token", roomHash);
    }

    // When an answer is received, add it to the peerConnection as the remote description.
    const onAnswer = (answer) => {
        logIt("onAnswer <<< Received answer");
        const rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
        // Set remote description of RTCSession
        this.peerConnection.setRemoteDescription(rtcAnswer);
        // The caller now knows that the callee is ready to accept new ICE candidates, so sending the buffer over
        this.localICECandidates.forEach((candidate) => {
            logIt(`>>> Sending local ICE candidate (${candidate.address})`);
            // Send ice candidate over websocket
            this.socket.emit("candidate", JSON.stringify(candidate), roomHash);
        });
        // Reset the buffer of local ICE candidates. This is not really needed, but it's good practice
        this.localICECandidates = [];
    }

    // When we are ready to call, enable the Call button.
    const readyToCall = () => {
        logIt("readyToCall");
        // First to join call will most likely initiate call
        if (this.willInitiateCall) {
            logIt("Initiating call");
            this.startCall();
        }
    }

    const requestToggleCaptions = () => {
        // Handle requesting captions before connected
        if (!this.connected) {
            alert("You must be connected to a peer to use Live Caption");
            return;
        }
        if (!isReceivingCaptions) {
            Snackbar.show({
                text:
                    "This is an experimental feature. Live caption requires the other user to be using Chrome",
                width: "400px",
                pos: "bottom-center",
                actionTextColor: "#616161",
                duration: 10000,
            });
        }

        // Send request to get captions over data channel
        dataChannel.send("tog:");
        updateState({ isReceivingCaptions: !isReceivingCaptions });
    }

    const toggleSendCaptions = () => {
        (isSendingCaptions)
            ? this.recognition.stop()
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
        this.requestMediaStream();

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

    return (
        <div onMouseMove={onMouseMove}>
            {renderHeader()}
            {renderRemoteVideoText()}
            {renderRemoteVideo()}
            {renderLocalVideo()}
            {renderChat()}
            {renderButtons()}
        </div>
    )
}

const domContainer = document.getElementById("chat-container");
ReactDOM.render(<Chat />, domContainer);