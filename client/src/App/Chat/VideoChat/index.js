import React, { Component, Fragment } from 'react';
import { RemoteVideo } from './RemoteVideo';
import { LocalVideo } from './LocalVideo';
import { createAnswer } from './_util/videoChat/_util/createAnswer';
import { createOffer } from './_util/videoChat/_util/createOffer';
import { requestMediaStream } from './_util/videoChat/_util/requestMediaStream';
import { onMediaStream } from './_util/onMediaStream';
import { redirectUnsupportedBrowsers } from '../../_util/device/redirectUnsupportedBrowsers';
import { setDocumentTitle } from '../../_util/setDocumentTitle';

// video chat is a use case for a class component
export class VideoChat extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.createAnswer = createAnswer;
        this.createOffer = createOffer;
        // this.handleReceiveMessage = handleReceiveMessage;
        this.requestMediaStream = requestMediaStream;
        this.onMediaStream = onMediaStream;
    }

    componentDidMount = () => {
        console.log(this.props)
        redirectUnsupportedBrowsers();
        setDocumentTitle(`${window.location.pathname}1`); // todo: what is this?
        // VideoChat.remoteVideo = remoteVideoRef.current;
        // await VideoChat.requestMediaStream();
    }

    // useInitializeVideoChat = ({ remoteVideoRef, localVideoRef });

    renderRemoteVideo = () => <RemoteVideo {...this.props} />

    renderLocalVideo = () => <LocalVideo {...this.props} />

    // const rePositionLocalVideo = () => {
    //     // Get position of remote video
    //     if (!remoteVideo) return;

    //     let bounds = remoteVideo.getBoundingClientRect();

    //     if (isMobileOrTablet) {
    //         bounds.top = window.innerHeight * 0.7;
    //         bounds.left += 10;
    //     } else {
    //         bounds.top += 10;
    //         bounds.left += 10;
    //     }
    //     // Set position of local video
    //     moveable.style = { ...moveable.style, ...bounds };
    // }

    render() {
        return (
            <Fragment>
                {this.renderRemoteVideo()}
                {this.renderLocalVideo()}
            </Fragment>
        )
    }
}