import React from 'react';

export var Button = function Button(props) {
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