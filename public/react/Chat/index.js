// todo - put in own directory
var Button = function Button(props) {
    var _props$button = props.button,
        onClick = _props$button.onClick,
        baseId = _props$button.baseId,
        text = _props$button.text,
        icon = _props$button.icon;


    return React.createElement(
        "div",
        { className: "buttonContainer" },
        React.createElement(
            "button",
            { className: "hoverButton", onClick: onClick },
            React.createElement("i", { id: baseId + "-icon", className: "$fas fa-" + icon + " fa-xs" })
        ),
        React.createElement(
            "div",
            { id: baseId + "-text", className: "HoverState" },
            text
        )
    );
};

var Chat = function Chat() {

    var renderHeader = function renderHeader() {
        return React.createElement(
            "div",
            { id: "header" },
            React.createElement(
                "a",
                { target: "_blank", href: "/" },
                React.createElement("img", { src: "/images/logo.svg", alt: "Neon", width: "48", height: "48" }),
                React.createElement(
                    "p",
                    null,
                    "Zipcall"
                )
            )
        );
    };

    var renderRemoteVideoText = function renderRemoteVideoText() {
        return React.createElement("p", { id: "remote-video-text" });
    };

    var renderRemoteVideo = function renderRemoteVideo() {
        return React.createElement("video", { id: "remote-video", autoPlay: true, playsInline: true });
    };

    var renderLocalVideo = function renderLocalVideo() {
        return React.createElement(
            "div",
            { id: "moveable" },
            React.createElement(
                "p",
                { id: "local-video-text" },
                "No webcam input"
            ),
            React.createElement("video", { id: "local-video", autoPlay: true, muted: true, playsInline: true })
        );
    };

    var renderChat = function renderChat() {
        return React.createElement(
            "div",
            { id: "entire-chat" },
            React.createElement(
                "div",
                { id: "chat-zone" },
                React.createElement("div", { className: "chat-messages" })
            ),
            React.createElement(
                "form",
                { className: "compose" },
                React.createElement("input", { type: "text", placeholder: "Type a message" })
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
            "div",
            { className: "multi-button" },
            buttons.map(function (button) {
                return React.createElement(Button, { key: button.text, button: button });
            })
        );
    };

    return React.createElement(
        "div",
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