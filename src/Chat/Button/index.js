import React from 'react';

export const Button = (props) => {
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