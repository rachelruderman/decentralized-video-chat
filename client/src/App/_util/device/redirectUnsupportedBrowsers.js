import { isWebRtcSupported } from "./isWebRtcSupported";
import { getBrowserName } from "./getBrowserName";
import DetectRTC from 'detectrtc';

export const redirectUnsupportedBrowsers = () => {
    //  Try and detect in-app browsers and redirect

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInAppBrowser = DetectRTC.isMobileDevice && ['FBAN', 'FBAV', 'Instagram'].includes(ua);
    const isIos = DetectRTC.osName === "iOS";

    if (isInAppBrowser) {
        window.location.href = `/notsupported${isIos ? 'ios' : ''}`;
    }

    // Redirect all iOS browsers that are not Safari
    if (DetectRTC.isMobileDevice) {
        if (isIos && !DetectRTC.browser.isSafari) {
            window.location.href = "/notsupportedios";
        }
    }

    const browserName = getBrowserName();

    if (!isWebRtcSupported || browserName === "MSIE") {
        window.location.href = "/notsupported";
    }
}