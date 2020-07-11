import React from 'react';
import { Button } from './Button';

var Chat = function Chat() {

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
        return React.createElement('p', { id: 'remote-video-text' });
    };

    var renderRemoteVideo = function renderRemoteVideo() {
        return React.createElement('video', { id: 'remote-video', autoplay: true, playsinline: true });
    };

    var renderLocalVideo = function renderLocalVideo() {
        return React.createElement(
            'div',
            { id: 'moveable' },
            React.createElement(
                'p',
                { id: 'local-video-text' },
                'No webcam input'
            ),
            React.createElement('video', { id: 'local-video', autoplay: true, muted: true, playsinline: true })
        );
    };

    var renderChat = function renderChat() {
        return React.createElement(
            'div',
            { id: 'entire-chat' },
            React.createElement(
                'div',
                { id: 'chat-zone' },
                React.createElement('div', { 'class': 'chat-messages' })
            ),
            React.createElement(
                'form',
                { 'class': 'compose' },
                React.createElement('input', { type: 'text', placeholder: 'Type a message' })
            )
        );
    };

    var renderButtons = function renderButtons() {
        var buttons = [{
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
            text: 'Pause Video'
        }, {
            onClick: swap,
            baseId: 'swap',
            icon: 'desktop',
            text: 'Share Screen'
        }, {
            onClick: toggleChat,
            baseId: 'chat',
            icon: 'comment',
            text: 'Show Chat'
        }, {
            onClick: togglePictureInPicture,
            baseId: 'pip',
            icon: 'external-link-alt',
            text: 'Toggle Picture in Picture'
        }, {
            onClick: requestToggleCaptions,
            baseId: 'caption',
            icon: 'closed-captioning',
            text: 'Start Live Caption'
        }, {
            onClick: function onClick() {
                return history.push('/newcall');
            },
            baseId: 'end-call',
            icon: 'phone-slash',
            text: 'End Call'
        }];

        return React.createElement(
            'div',
            { className: 'multi-button' },
            buttons.map(function (button) {
                return React.createElement(Button, { button: button });
            })
        );
    };

    return React.createElement(
        'div',
        null,
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