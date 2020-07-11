// todo - put in own directory
const Button = ({ button }) => {
    const {
        isEnabled,
        onClick,
        baseId,
    } = button;

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
    }

    const [{
        isMuted,
        isPaused,
    }, setState] = useState(initialState);

    const updateState = (data) => setState(prevState => ({ ...prevState, ...data }));

    const getSenderByKind = (kind) => {
        const senders = VideoChat.peerConnection.getSenders();
        return senders.find(sender => (sender.track.kind === kind));
    }

    const muteMicrophone = () => {
        const sender = getSenderByKind('audio');
        if (sender) {
            updateState({ isMuted: !sender.track.enabled })
            sender.track.enabled = isMuted;
            updateState({ isMuted: !isMuted })
        }
    }

    const pauseVideo = () => {
        const sender = getSenderByKind(video);
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
        return (
            <p id="remote-video-text" />
        )
    }

    const renderRemoteVideo = () => {
        return (
            <video id="remote-video" autoPlay playsInline />
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
            <div id="moveable">
                <p id="local-video-text">{text}</p>
                <video id="local-video" autoPlay muted playsInline />
            </div>
        )
    }

    const renderChat = () => {
        return (
            <div id="entire-chat">
                <div id="chat-zone">
                    <div className="chat-messages"></div>
                </div>
                <form className="compose">
                    <input type="text" placeholder="Type a message" />
                </form>
            </div>
        )
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
            },
            {
                onClick: () => history.push('/newcall'),
                baseId: 'end-call',
                enableText: 'End Call',
                enableIcon: 'phone-slash',
            },
        ]

        return (
            <div className='multi-button'>
                {buttons.map(button => <Button key={button.text} button={button} />)}
            </div>
        )
    }

    return (
        <>
            {renderHeader()}
            {renderRemoteVideoText()}
            {renderRemoteVideo()}
            {renderLocalVideo()}
            {renderChat()}
            {renderButtons()}
        </>
    )
}

const domContainer = document.getElementById("chat-container");
ReactDOM.render(<Chat />, domContainer);