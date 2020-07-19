import { useEffect } from "react"
import { redirectUnsupportedBrowsers } from "../../_util/device/redirectUnsupportedBrowsers";
import { setDocumentTitle } from "../../_util/setDocumentTitle";
import { VideoChat } from "../videoChat";

let isReadyToRender = false;

export const useInitializeVideoChat = (props) => {

    const { remoteVideoRef, localVideoRef } = props;
    // const isReadyToRender = Boolean(remoteVideoRef.current && localVideoRef.current);
    console.log({ props, isReadyToRender }, remoteVideoRef.current, localVideoRef.current, props.remoteVideoRef.current, props.localVideoRef.current)
    useEffect(() => {
        isReadyToRender = true;
        const startUp = async () => {
            redirectUnsupportedBrowsers();
            setDocumentTitle(`${window.location.pathname}1`); // todo: what is this?
            VideoChat.remoteVideo = remoteVideoRef.current;
            await VideoChat.requestMediaStream();
        }

        if (isReadyToRender) {
            isReadyToRender = false;
            startUp();
        }
    }, [remoteVideoRef])
}