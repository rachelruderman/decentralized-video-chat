var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// todo - put in own directory
var Button = function Button(_ref) {
    var button = _ref.button;
    var isEnabled = button.isEnabled,
        onClick = button.onClick,
        baseId = button.baseId;

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

    var prefix = isEnabled ? 'disable' : 'enable';
    var text = button[prefix + 'Text'];
    var icon = button[prefix + 'Icon'];

    return React.createElement(
        'div',
        { className: 'buttonContainer' },
        React.createElement(
            'button',
            { className: 'hoverButton', onClick: onClick },
            React.createElement('i', { id: baseId + '-icon', className: '$fas fa-' + icon + ' fa-xs' })
        ),
        React.createElement(
            'div',
            { id: baseId + '-text', className: 'HoverState' },
            text
        )
    );
};

var Chat = function Chat() {

    var initialState = {
        isMuted: false,
        isPaused: false,
        isReceivingCaptions: false,
        isSendingCaptions: false,
        showChat: false,
        // isFullscreen: false,
        dataChannel: null,
        mode: 'camera',
        chatInput: chatInput,
        captionText: ''
    };

    var _React$useState = React.useState(initialState),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        _React$useState2$ = _React$useState2[0],
        isMuted = _React$useState2$.isMuted,
        isPaused = _React$useState2$.isPaused,
        isReceivingCaptions = _React$useState2$.isReceivingCaptions,
        isSendingCaptions = _React$useState2$.isSendingCaptions,
        showChat = _React$useState2$.showChat,
        dataChannel = _React$useState2$.dataChannel,
        mode = _React$useState2$.mode,
        chatInput = _React$useState2$.chatInput,
        captionText = _React$useState2$.captionText,
        setState = _React$useState2[1];

    var remoteVideoRef = React.useRef();
    var localVideoRef = React.useRef();
    var moveableRef = React.useRef();

    var remoteVideo = remoteVideoRef.current;
    var localVideo = localVideoRef.current;
    var moveable = moveableRef.current;

    React.useEffect(function () {
        startUp();
    }, [remoteVideo, localVideo]);

    var VideoChat = {
        connected: false,
        willInitiateCall: false,
        localICECandidates: [],
        socket: io(),
        remoteVideo: remoteVideo,
        recognition: undefined,

        requestMediaStream: function requestMediaStream(event) {
            logIt("requestMediaStream");
            rePositionLocalVideo();
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(function (stream) {
                VideoChat.onMediaStream(stream);
                localVideoText.text("Drag Me");
                setTimeout(function () {
                    return localVideoText.fadeOut();
                }, 5000);
            }).catch(function (error) {
                logIt(error);
                logIt("Failed to get local webcam video, check webcam privacy settings");
                // Keep trying to get user media
                setTimeout(VideoChat.requestMediaStream, 1000);
            });
        },

        // Called when a video stream is added to VideoChat
        onMediaStream: function onMediaStream(stream) {
            logIt("onMediaStream");
            VideoChat.localStream = stream;
            // Add the stream as video's srcObject.
            // Now that we have webcam video sorted, prompt user to share URL
            Snackbar.show({
                text: "Here is the join link for your call: " + url,
                actionText: "Copy Link",
                width: "750px",
                pos: "top-center",
                actionTextColor: "#616161",
                duration: 500000,
                backgroundColor: "#16171a",
                onActionClick: function onActionClick(element) {
                    // Copy url to clipboard, this is achieved by creating a temporary element,
                    // adding the text we want to that element, selecting it, then deleting it
                    var copyContent = window.location.href;
                    $('<input id="some-element">').val(copyContent).appendTo("body").select();
                    document.execCommand("copy");
                    var toRemove = document.querySelector("#some-element");
                    toRemove.parentNode.removeChild(toRemove);
                    Snackbar.close();
                }
            });
            if (!localVideo) return;
            localVideo.srcObject = stream;
            // Now we're ready to join the chat room.
            VideoChat.socket.emit("join", roomHash);
            // Add listeners to the websocket
            VideoChat.socket.on("full", chatRoomFull);
            VideoChat.socket.on("offer", VideoChat.onOffer);
            VideoChat.socket.on("ready", VideoChat.readyToCall);
            VideoChat.socket.on("willInitiateCall", function () {
                return VideoChat.willInitiateCall = true;
            });
        },

        // Set up a callback to run when we have the ephemeral token to use Twilio's TURN server.
        startCall: function startCall(event) {
            logIt("startCall >>> Sending token request...");
            VideoChat.socket.on("token", VideoChat.onToken(VideoChat.createOffer));
            VideoChat.socket.emit("token", roomHash);
        },

        // When we receive the ephemeral token back from the server.
        onToken: function onToken(callback) {
            logIt("onToken");
            return function (token) {
                logIt("<<< Received token");
                // Set up a new RTCPeerConnection using the token's iceServers.
                VideoChat.peerConnection = new RTCPeerConnection({
                    iceServers: token.iceServers
                });
                // Add the local video stream to the peerConnection.
                VideoChat.localStream.getTracks().forEach(function (track) {
                    VideoChat.peerConnection.addTrack(track, VideoChat.localStream);
                });
                // Add general purpose data channel to peer connection,
                // used for text chats, captions, and toggling sending captions
                dataChanel = VideoChat.peerConnection.createDataChannel("chat", {
                    negotiated: true,
                    // both peers must have same id
                    id: 0
                });
                // Called when dataChannel is successfully opened
                dataChanel.onopen = function (event) {
                    logIt("dataChannel opened");
                };
                // Handle different dataChannel types
                dataChanel.onmessage = function (event) {
                    var receivedData = event.data;
                    // First 4 chars represent data type
                    var dataType = receivedData.substring(0, 4);
                    var cleanedMessage = receivedData.slice(4);
                    if (dataType === "mes:") {
                        handleReceiveMessage(cleanedMessage);
                    } else if (dataType === "cap:") {
                        receiveCaptions(cleanedMessage);
                    } else if (dataType === "tog:") {
                        toggleSendCaptions();
                    }
                };
                // Set up callbacks for the connection generating iceCandidates or
                // receiving the remote media stream.
                VideoChat.peerConnection.onicecandidate = VideoChat.onIceCandidate;
                VideoChat.peerConnection.onaddstream = VideoChat.onAddStream;
                // Set up listeners on the socket
                VideoChat.socket.on("candidate", VideoChat.onCandidate);
                VideoChat.socket.on("answer", VideoChat.onAnswer);
                VideoChat.socket.on("requestToggleCaptions", function () {
                    return toggleSendCaptions();
                });
                VideoChat.socket.on("receiveCaptions", function (captions) {
                    return receiveCaptions(captions);
                });
                // Called when there is a change in connection state
                VideoChat.peerConnection.oniceconnectionstatechange = function (event) {
                    switch (VideoChat.peerConnection.iceConnectionState) {
                        case "connected":
                            logIt("connected");
                            // Once connected we no longer have a need for the signaling server, so disconnect
                            VideoChat.socket.disconnect();
                            break;
                        case "disconnected":
                            logIt("disconnected");
                        case "failed":
                            logIt("failed");
                            // VideoChat.socket.connect
                            // VideoChat.createOffer();
                            // Refresh page if connection has failed
                            location.reload();
                            break;
                        case "closed":
                            logIt("closed");
                            break;
                    }
                };
                callback();
            };
        },

        // When the peerConnection generates an ice candidate, send it over the socket to the peer.
        onIceCandidate: function onIceCandidate(event) {
            logIt("onIceCandidate");
            if (event.candidate) {
                logIt('<<< Received local ICE candidate from STUN/TURN server (' + event.candidate.address + ')');
                if (VideoChat.connected) {
                    logIt('>>> Sending local ICE candidate (' + event.candidate.address + ')');
                    VideoChat.socket.emit("candidate", JSON.stringify(event.candidate), roomHash);
                } else {
                    // If we are not 'connected' to the other peer, we are buffering the local ICE candidates.
                    // This most likely is happening on the "caller" side.
                    // The peer may not have created the RTCPeerConnection yet, so we are waiting for the 'answer'
                    // to arrive. This will signal that the peer is ready to receive signaling.
                    VideoChat.localICECandidates.push(event.candidate);
                }
            }
        },

        // When receiving a candidate over the socket, turn it back into a real
        // RTCIceCandidate and add it to the peerConnection.
        onCandidate: function onCandidate(candidate) {
            // Update caption text
            updateState({ captionText: "Found other user... connecting" });
            rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
            logIt('onCandidate <<< Received remote ICE candidate (' + rtcCandidate.address + ' - ' + rtcCandidate.relatedAddress + ')');
            VideoChat.peerConnection.addIceCandidate(rtcCandidate);
        },

        // Create an offer that contains the media capabilities of the browser.
        createOffer: function createOffer() {
            logIt("createOffer >>> Creating offer...");
            VideoChat.peerConnection.createOffer(function (offer) {
                // If the offer is created successfully, set it as the local description
                // and send it over the socket connection to initiate the peerConnection
                // on the other side.
                VideoChat.peerConnection.setLocalDescription(offer);
                VideoChat.socket.emit("offer", JSON.stringify(offer), roomHash);
            }, function (err) {
                logIt("failed offer creation");
                logIt(err, true);
            });
        },

        // Create an answer with the media capabilities that both browsers share.
        // This function is called with the offer from the originating browser, which
        // needs to be parsed into an RTCSessionDescription and added as the remote
        // description to the peerConnection object. Then the answer is created in the
        // same manner as the offer and sent over the socket.
        createAnswer: function createAnswer(offer) {
            logIt("createAnswer");
            return function () {
                logIt(">>> Creating answer...");
                rtcOffer = new RTCSessionDescription(JSON.parse(offer));
                VideoChat.peerConnection.setRemoteDescription(rtcOffer);
                VideoChat.peerConnection.createAnswer(function (answer) {
                    VideoChat.peerConnection.setLocalDescription(answer);
                    VideoChat.socket.emit("answer", JSON.stringify(answer), roomHash);
                }, function (err) {
                    logIt("Failed answer creation.");
                    logIt(err, true);
                });
            };
        },

        // Called when a stream is added to the peer connection
        onAddStream: function onAddStream(event) {
            logIt("onAddStream <<< Received new stream from remote. Adding it...");
            // Update remote video source
            VideoChat.remoteVideo.srcObject = event.stream;
            // Close the initial share url snackbar
            Snackbar.close();
            // Remove the loading gif from video
            VideoChat.remoteVideo.style.background = "none";
            // Update connection status
            VideoChat.connected = true;
            // Hide caption status text
            captionText.fadeOut();
            // Reposition local video after a second, as there is often a delay
            // between adding a stream and the height of the video div changing
            setTimeout(function () {
                return rePositionLocalVideo();
            }, 500);
            // var timesRun = 0;
            // var interval = setInterval(function () {
            //   timesRun += 1;
            //   if (timesRun === 10) {
            //     clearInterval(interval);
            //   }
            //   rePositionLocalVideo();
            // }, 300);
        }

        // Swap camera / screen share
    };var swap = function swap() {
        // Handle swap video before video call is connected
        if (!VideoChat.connected) {
            alert("You must join a call before you can share your screen.");
            return;
        }
        // Store swap button icon and text
        var swapIcon = document.getElementById("swap-icon");
        var swapText = document.getElementById("swap-text");
        // If mode is camera then switch to screen share
        if (mode === "camera") {
            // Show accept screenshare snackbar
            Snackbar.show({
                text: "Please allow screen share. Click the middle of the picture above and then press share.",
                width: "400px",
                pos: "bottom-center",
                actionTextColor: "#616161",
                duration: 50000
            });
            // Request screen share, note we dont want to capture audio
            // as we already have the stream from the Webcam
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            }).then(function (stream) {
                // Close allow screenshare snackbar
                Snackbar.close();
                // Change display mode
                updateState({ mode: 'screen' });
                // Update swap button icon and text
                swapIcon.classList.remove("fa-desktop");
                swapIcon.classList.add("fa-camera");
                swapText.innerText = "Share Webcam";
                switchStreamHelper(stream);
            }).catch(function (err) {
                logIt(err);
                logIt("Error sharing screen");
                Snackbar.close();
            });
            // If mode is screenshare then switch to webcam
        } else {
            // Stop the screen share track
            localVideo.srcObject.getTracks().forEach(function (track) {
                return track.stop();
            });
            // Get webcam input
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(function (stream) {
                // Change display mode
                updateState({ mode: 'camera' });
                // Update swap button icon and text
                swapIcon.classList.remove("fa-camera");
                swapIcon.classList.add("fa-desktop");
                swapText.innerText = "Share Screen";
                switchStreamHelper(stream);
            });
        }
    };

    // Swap current video track with passed in stream
    var switchStreamHelper = function switchStreamHelper(stream) {
        // Get current video track
        var videoTrack = stream.getVideoTracks()[0];
        // Add listen for if the current track swaps, swap back
        videoTrack.onended = function () {
            swap();
        };
        if (VideoChat.connected) {
            // Find sender
            var sender = findSenderByKind(videoTrack.kind);
            // Replace sender track
            sender.replaceTrack(videoTrack);
        }
        // Update local video stream
        VideoChat.localStream = videoTrack;
        // Update local video object
        localVideo.srcObject = stream;
        // Unpause video on swap
        if (isPaused) {
            pauseVideo();
        }
    };

    var rePositionLocalVideo = function rePositionLocalVideo() {
        // Get position of remote video
        if (!remoteVideo) return;

        var isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        var bounds = remoteVideo.getBoundingClientRect();

        if (isMobileOrTablet) {
            bounds.top = window.innerHeight * 0.7;
            bounds.left += 10;
        } else {
            bounds.top += 10;
            bounds.left += 10;
        }
        // Set position of local video
        moveable.style = Object.assign({}, moveable.style, bounds);
    };

    // Text Chat
    // Add text message to chat screen on page
    var addMessageToScreen = function addMessageToScreen(_ref2) {
        var message = _ref2.message,
            isOwnMessage = _ref2.isOwnMessage;

        var user = isOwnMessage ? 'customer' : 'moderator';

        $(".chat-messages").append('<div class="message-item ' + user + ' cssanimation fadeInBottom"><div class="message-bloc"><div class="message">' + message + '</div></div></div>');
    };

    // Called when a message is received over the dataChannel
    var handleReceiveMessage = function handleReceiveMessage(message) {
        // Add message to screen
        addMessageToScreen({ message: message, isOwnMessage: false });
        // Auto scroll chat down
        chatZone.scrollTop(chatZone[0].scrollHeight);
        // Show chat if hidden
        if (!showChat) {
            toggleChat();
        }
    };

    //Picture in picture
    var togglePictureInPicture = function togglePictureInPicture() {
        var isPipSupported = "pictureInPictureEnabled" in document || remoteVideoVanilla.webkitSetPresentationMode;

        if (isPipSupported) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture().catch(function (error) {
                    logIt("Error exiting pip.");
                    logIt(error);
                });
            } else if (remoteVideoVanilla.webkitPresentationMode === "inline") {
                remoteVideoVanilla.webkitSetPresentationMode("picture-in-picture");
            } else if (remoteVideoVanilla.webkitPresentationMode === "picture-in-picture") {
                remoteVideoVanilla.webkitSetPresentationMode("inline");
            } else {
                remoteVideoVanilla.requestPictureInPicture().catch(function (error) {
                    alert("You must be connected to another person to enter picture in picture.");
                });
            }
        } else {
            alert("Picture in picture is not supported in your browser. Consider using Chrome or Safari.");
        }
    };

    // Start speech recognition
    var startSpeech = function startSpeech() {
        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
        VideoChat.recognition.onresult = function (event) {
            var interimTranscript = "";
            for (var i = event.resultIndex, len = event.results.length; i < len; i++) {
                var transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                    var charsToKeep = interimTranscript.length % 100;
                    // Send captions over data chanel,
                    // subtracting as many complete 100 char slices from start
                    dataChannel.send("cap:" + interimTranscript.substring(interimTranscript.length - charsToKeep));
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
    };
    // Get name of browser session using user agent
    var getBrowserName = function getBrowserName() {
        var userAgent = window.navigator.userAgent;


        if (userAgent.includes('MSIE')) {
            return 'Unknown';
        }

        var browsers = ['Firefox', 'Opera', 'Chrome', 'Safari'];

        var browser = browsers.find(function (browser) {
            return userAgent.includes(browser);
        });

        return browser || 'Unknown';
    };

    // Element vars
    var remoteVideoVanilla = document.getElementById("remote-video");
    var localVideoText = $("#local-video-text");
    var entireChat = $("#entire-chat");
    var chatZone = $("#chat-zone");

    var browserName = getBrowserName();
    var url = window.location.href;
    var roomHash = url.substring(url.lastIndexOf("/") + 1).toLowerCase();

    // Called when window is resized
    var windowResized = function windowResized() {
        rePositionLocalVideo();
        rePositionCaptions();
    };

    var isWebRTCSupported = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || window.RTCPeerConnection;

    var logIt = function logIt(message, error) {
        console.log(message);
    };

    var receiveCaptions = function receiveCaptions(captions) {
        updateState({ captionText: '' });
        // Other user is not using chrome
        if (captions === "notusingchrome") {
            alert("Other caller must be using chrome for this feature to work. Live Caption turned off.");
            updateState({ isReceivingCaptions: false });
            return;
        }
        updateState({ captionText: captions });
        rePositionCaptions();
    };

    // Called when socket receives message that room is full
    var chatRoomFull = function chatRoomFull() {
        alert("Chat room is full. Check to make sure you don't have multiple open tabs, or try with a new room link");
        // Exit room and redirect
        startNewCall();
    };

    var startNewCall = function startNewCall() {
        return history.push('/newcall');
    };

    var updateState = function updateState(data) {
        return setState(function (prevState) {
            return Object.assign({}, prevState, data);
        });
    };

    var findSenderByKind = function findSenderByKind(kind) {
        var senders = VideoChat.peerConnection.getSenders();
        return senders.find(function (sender) {
            return sender.track.kind === kind;
        });
    };

    // Show and hide chat
    var toggleChat = function toggleChat() {
        return updateState({ showChat: !showChat });
    };

    var pauseVideo = function pauseVideo() {
        var sender = findSenderByKind(video);
        if (sender) {
            updateState({ isPaused: !sender.track.enabled });
            sender.track.enabled = isPaused;
            updateState({ isPaused: !isPaused });
            // update pause button icon and text
            if (videoIsPaused) {
                // localVideoText.show();
            } else {
                    // setTimeout(() => localVideoText.fadeOut(), 2000);
                }
        }
    };

    var renderHeader = function renderHeader() {
        return React.createElement(
            'div',
            { id: 'header' },
            React.createElement(
                'a',
                { target: '_blank', href: '/' },
                React.createElement('img', { src: '/images/logo.svg', alt: 'Neon', width: '48', height: '48' }),
                React.createElement(
                    'p',
                    null,
                    'Zipcall'
                )
            )
        );
    };

    var renderRemoteVideoText = function renderRemoteVideoText() {
        // fadeOut this text when live caption ends
        return React.createElement('p', { id: 'remote-video-text' });
    };

    var renderRemoteVideo = function renderRemoteVideo() {
        return React.createElement('video', { id: 'remote-video', autoPlay: true, playsInline: true, ref: remoteVideoRef });
    };

    var renderLocalVideo = function renderLocalVideo() {
        var text = 'No webcam input';

        switch (true) {
            case isPaused:
                text = 'Video is paused';
                break;
            default:
                break;
        }
        return React.createElement(
            'div',
            { id: 'moveable', ref: moveableRef },
            React.createElement(
                'p',
                { id: 'local-video-text' },
                text
            ),
            React.createElement('video', { id: 'local-video', autoPlay: true, muted: true, playsInline: true, ref: localVideoRef })
        );
    };

    var renderChat = function renderChat() {
        if (!showChat) return null; // fade in and out

        var onKeyPress = function onKeyPress(event) {
            if (event.keyCode === 13) {
                // Prevent page refresh on enter
                event.preventDefault();
                var message = event.target.value;
                // Prevent cross site scripting
                message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                // Make links clickable
                message = message.autoLink();
                // Send message over data channel
                dataChannel.send('mes:' + message);
                // Add message to screen
                addMessageToScreen({ message: message, isOwnMessage: true });
                // Auto scroll chat down
                chatZone.scrollTop(chatZone[0].scrollHeight);
                // Clear chat input
                event.target.value = "";
            }
        };

        return React.createElement(
            'div',
            { id: 'entire-chat' },
            React.createElement(
                'div',
                { id: 'chat-zone' },
                React.createElement('div', { className: 'chat-messages' })
            ),
            React.createElement(
                'form',
                { className: 'compose' },
                React.createElement('input', { type: 'text', placeholder: 'Type a message', onKeyPress: onKeyPress })
            )
        );
    };

    var muteMicrophone = function muteMicrophone() {
        var sender = findSenderByKind('audio');
        if (sender) {
            updateState({ isMuted: !sender.track.enabled });
            sender.track.enabled = isMuted;
            updateState({ isMuted: !isMuted });
        }
    };

    var renderButtons = function renderButtons() {
        var buttons = [{
            onClick: muteMicrophone,
            baseId: 'mic',
            enableText: 'Mute',
            enableIcon: 'microphone',
            disableText: 'Unmute',
            disableIcon: 'microphone-slash'
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
            disableIcon: 'video-slash'
        }, {
            onClick: swap,
            baseId: 'swap',
            enableText: 'Share Screen',
            enableIcon: 'desktop'
        }, {
            onClick: toggleChat,
            baseId: 'chat',
            enableText: 'Show Chat',
            enableIcon: 'comment',
            disableText: 'Hide Chat',
            disableIcon: 'comment-slash'
        }, {
            onClick: togglePictureInPicture,
            baseId: 'pip',
            enableText: 'Toggle Picture in Picture',
            enableIcon: 'external-link-alt'
        }, {
            onClick: requestToggleCaptions,
            baseId: 'caption',
            enableText: 'Start Live Caption',
            enableIcon: 'closed-captioning',
            disableText: 'End Live Caption',
            disableIcon: 'closed-captioning-slash'
        }, {
            onClick: startNewCall,
            baseId: 'end-call',
            enableText: 'End Call',
            enableIcon: 'phone-slash'
        }];

        return React.createElement(
            'div',
            { className: 'multi-button' },
            buttons.map(function (button) {
                return React.createElement(Button, { key: button.baseId, button: button });
            })
        );
    };

    // When a browser receives an offer, set up a callback to be run when the
    // ephemeral token is returned from Twilio.
    var onOffer = function onOffer(offer) {
        logIt("onOffer <<< Received offer");
        VideoChat.socket.on("token", VideoChat.onToken(VideoChat.createAnswer(offer)));
        VideoChat.socket.emit("token", roomHash);
    };

    // When an answer is received, add it to the peerConnection as the remote description.
    var onAnswer = function onAnswer(answer) {
        logIt("onAnswer <<< Received answer");
        var rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
        // Set remote description of RTCSession
        VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
        // The caller now knows that the callee is ready to accept new ICE candidates, so sending the buffer over
        VideoChat.localICECandidates.forEach(function (candidate) {
            logIt('>>> Sending local ICE candidate (' + candidate.address + ')');
            // Send ice candidate over websocket
            VideoChat.socket.emit("candidate", JSON.stringify(candidate), roomHash);
        });
        // Reset the buffer of local ICE candidates. This is not really needed, but it's good practice
        VideoChat.localICECandidates = [];
    };

    // When we are ready to call, enable the Call button.
    var readyToCall = function readyToCall() {
        logIt("readyToCall");
        // First to join call will most likely initiate call
        if (VideoChat.willInitiateCall) {
            logIt("Initiating call");
            VideoChat.startCall();
        }
    };

    var requestToggleCaptions = function requestToggleCaptions() {
        // Handle requesting captions before connected
        if (!VideoChat.connected) {
            alert("You must be connected to a peer to use Live Caption");
            return;
        }
        if (!isReceivingCaptions) {
            Snackbar.show({
                text: "This is an experimental feature. Live caption requires the other user to be using Chrome",
                width: "400px",
                pos: "bottom-center",
                actionTextColor: "#616161",
                duration: 10000
            });
        }

        // Send request to get captions over data channel
        dataChannel.send("tog:");
        updateState({ isReceivingCaptions: !isReceivingCaptions });
    };

    var toggleSendCaptions = function toggleSendCaptions() {
        isSendingCaptions ? VideoChat.recognition.stop() : startSpeech();

        updateState({ isSendingCaptions: !isSendingCaptions });
    };

    var startUp = function startUp() {
        //  Try and detect in-app browsers and redirect
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        var isInAppBrowser = DetectRTC.isMobileDevice && ['FBAN', 'FBAV', 'Instagram'].includes(ua);
        var isIos = DetectRTC.osName === "iOS";

        if (isInAppBrowser) {
            window.location.href = '/notsupported' + (isIos ? 'ios' : '');
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
            onActionClick: function onActionClick(element) {
                window.open("https://getacclaim.zendesk.com/hc/en-us/articles/360001547832-Setting-the-default-camera-on-your-browser", "_blank");
            }
        });

        // Set caption text on start
        updateState({ captionText: "Waiting for other user to join..." });

        // Reposition captions on start
        rePositionCaptions();

        // On change media devices refresh page and switch to system default
        navigator.mediaDevices.ondevicechange = function () {
            return window.location.reload();
        };
    };

    // Fade out / show UI on mouse move
    var timedelay = 1;
    var delayCheck = function delayCheck() {
        if (timedelay === 5) {
            // $(".multi-button").fadeOut();
            $("#header").fadeOut();
            timedelay = 1;
        }
        timedelay = timedelay + 1;
    };
    _delay = setInterval(delayCheck, 500);

    // Reposition captions to bottom of video
    var rePositionCaptions = function rePositionCaptions() {
        // Get remote video position
        if (!remoteVideo) return;
        // let bounds = remoteVideo.getBoundingClientRect();
        // bounds.top -= 10;
        // bounds.top = bounds.top + remoteVideo.getAttribute('height') - 1 * captionText.height();
        // // Reposition captions
        // captionText.css(bounds);
    };

    var onMouseMove = function onMouseMove() {
        $(".multi-button").fadeIn();
        $("#header").fadeIn();
        $(".multi-button").style = "";
        timedelay = 1;
        clearInterval(_delay);
        _delay = setInterval(delayCheck, 500);
    };

    return React.createElement(
        'div',
        { onMouseMove: onMouseMove },
        renderHeader(),
        renderRemoteVideoText(),
        renderRemoteVideo(),
        renderLocalVideo(),
        renderChat(),
        renderButtons()
    );
};

var domContainer = document.getElementById("chat-container");
ReactDOM.render(React.createElement(Chat, null), domContainer);