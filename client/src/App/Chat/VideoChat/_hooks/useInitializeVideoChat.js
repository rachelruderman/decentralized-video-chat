import { useEffect } from "react"
import { redirectUnsupportedBrowsers } from "../../_util/device/redirectUnsupportedBrowsers";
import { setDocumentTitle } from "../../_util/setDocumentTitle";
import { VideoChat } from "../../_util/videoChat";

export const useInitializeVideoChat = ({ remoteVideo, localVideo }) => {

    const isReadyToRender = true //Boolean(remoteVideo && localVideo);

    useEffect(() => {
        const startUp = async () => {
            redirectUnsupportedBrowsers();
            setDocumentTitle(`${window.location.pathname}1`); // todo: what is this?
            VideoChat.remoteVideo = remoteVideo;
            await VideoChat.requestMediaStream();
        }

        if (isReadyToRender) {
            startUp();
        }
    }, [isReadyToRender])
}