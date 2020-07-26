import React from 'react';

export const Button = ({ button }) => {
    const {
        isEnabled,
        onClick,
        baseId,
    } = button;

    const prefix = (isEnabled) ? 'disable' : 'enable';
    const text = button[`${prefix}Text`];
    const icon = button[`${prefix}Icon`];

    return (
        <div className="button-container">
            <button onClick={onClick}>
                <i id={`${baseId}-icon`} className={`fas fa-${icon} fa-xs`}></i>
            </button>
            <label id={`${baseId}-text`}>{text}</label>
        </div>
    )
}