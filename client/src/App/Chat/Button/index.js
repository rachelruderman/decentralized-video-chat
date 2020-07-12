import React from 'react';

export const Button = ({ button }) => {
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