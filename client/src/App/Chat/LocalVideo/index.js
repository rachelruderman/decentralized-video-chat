export const LocalVideo = ({ moveableRef, localVideoRef, isPaused }) => {
    let text = 'No webcam input';

    switch (true) {
        case (isPaused):
            text = 'Video is paused';
            break;
        default:
            break;
    }
    return (
        <div id="moveable" ref={moveableRef}>
            <p id="local-video-text">{text}</p>
            <video id="local-video" autoPlay muted playsInline ref={localVideoRef} />
        </div>
    )
}