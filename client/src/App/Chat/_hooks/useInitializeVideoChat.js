import { useEffect } from "react"
import { redirectUnsupportedBrowsers } from "../_util/device/redirectUnsupportedBrowsers";
import { setDocumentTitle } from "../_util/setDocumentTitle";

export const useInitializeVideoChat = ({ remoteVideo, localVideo }) => {

    const isReadyToRender = Boolean(remoteVideo && localVideo);

    useEffect(() => {
        if (isReadyToRender) {
            redirectUnsupportedBrowsers();
            setDocumentTitle(`${window.location.pathname}1`); // todo: what is this?

        }
    }, [isReadyToRender])
}