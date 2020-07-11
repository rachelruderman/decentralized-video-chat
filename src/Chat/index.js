import React from 'react';
import { Button } from './Button';

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
            <video id="remote-video" autoplay playsinline />
        )
    }

    const renderLocalVideo = () => {
        return (
            <div id="moveable">
                <p id="local-video-text">No webcam input</p>
                <video id="local-video" autoplay muted playsinline></video>
            </div>
        )
    }

    const renderChat = () => {
        return (
            <div id="entire-chat">
                <div id="chat-zone">
                    <div class="chat-messages"></div>
                </div>
                <form class="compose">
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
                {buttons.map(button => <Button button={button} />)}
            </div>
        )
    }

    return (
        <div>
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