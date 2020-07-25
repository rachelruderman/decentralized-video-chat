export function receiveCaptions({ captions, updateState }) {
    updateState({ captionText: '' });
    // Other user is not using chrome
    if (captions === "notusingchrome") {
        alert(
            "Other caller must be using chrome for this feature to work. Live Caption turned off."
        );
        updateState({ isReceivingCaptions: false });
        return;
    }
    updateState({ captionText: captions });
    // rePositionCaptions();
}