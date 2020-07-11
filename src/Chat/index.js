// todo - put in own directory
const Button = (props) => {
    const {
        onClick,
        baseId,
        text,
        icon,
    } = props.button;

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
        return (
            <div id="moveable">
                <p id="local-video-text">No webcam input</p>
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
                icon: 'microphone',
                text: 'Mute'
            },
            // {
            //     onClick: openFullScreen,
            //     baseId: '',
            //     icon: 'compress',
            //     text: 'Fullscreen'
            // },
            {
                onClick: pauseVideo,
                baseId: 'video',
                icon: 'video',
                text: 'Pause Video',
            },
            {
                onClick: swap,
                baseId: 'swap',
                icon: 'desktop',
                text: 'Share Screen',
            },
            {
                onClick: toggleChat,
                baseId: 'chat',
                icon: 'comment',
                text: 'Show Chat',
            },
            {
                onClick: togglePictureInPicture,
                baseId: 'pip',
                icon: 'external-link-alt',
                text: 'Toggle Picture in Picture',
            },
            {
                onClick: requestToggleCaptions,
                baseId: 'caption',
                icon: 'closed-captioning',
                text: 'Start Live Caption',
            },
            {
                onClick: () => history.push('/newcall'),
                baseId: 'end-call',
                icon: 'phone-slash',
                text: 'End Call',
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