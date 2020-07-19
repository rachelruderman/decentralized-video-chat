import React from 'react';
import { Button } from './Button'
import { requestToggleCaptions } from './_util/requestToggleCaptions';
import { pauseVideo, } from './_util/pauseVideo';
import { swap } from './_util/swap';
import { togglePictureInPicture } from './_util/togglePictureInPicture';
import { toggleChat } from './_util/toggleChat';
import { muteMicrophone, } from './_util/muteMicrophone';
import { redirectToNewCall } from '../VideoChat/_util/redirectToNewCall';

export const Buttons = (props) => {

    const { mode, } = props.state;

    const buttons = [
        {
            onClick: () => muteMicrophone(props),
            baseId: 'mic',
            enableText: 'Mute',
            enableIcon: 'microphone',
            disableText: 'Unmute',
            disableIcon: 'microphone-slash',
        },
        // {
        //     onClick: openFullScreen,
        //     baseId: '',
        //     enableIcon: 'compress',
        //     enableText: 'Fullscreen'
        // },
        {
            onClick: () => pauseVideo(props),
            baseId: 'video',
            enableText: 'Pause Video',
            enableIcon: 'video',
            disableText: 'Unpause Video',
            disableIcon: 'video-slash',
        },
        {
            onClick: () => swap(props),
            baseId: 'swap',
            enableText: (mode === 'camera') ? 'Share Webcam' : 'Share Screen',
            enableIcon: (mode === 'camera') ? 'desktop' : 'camera',
        },
        {
            onClick: () => toggleChat(props),
            baseId: 'chat',
            enableText: 'Show Chat',
            enableIcon: 'comment',
            disableText: 'Hide Chat',
            disableIcon: 'comment-slash',
        },
        {
            onClick: togglePictureInPicture,
            baseId: 'pip',
            enableText: 'Toggle Picture in Picture',
            enableIcon: 'external-link-alt',
        },
        {
            onClick: () => requestToggleCaptions(props),
            baseId: 'caption',
            enableText: 'Start Live Caption',
            enableIcon: 'closed-captioning',
            disableText: 'End Live Caption',
            disableIcon: 'closed-captioning-slash',
        },
        {
            onClick: redirectToNewCall,
            baseId: 'end-call',
            enableText: 'End Call',
            enableIcon: 'phone-slash',
        },
    ]

    return (
        <div className='multi-button'>
            {buttons.map(button => <Button key={button.baseId} button={button} />)}
        </div>
    )
}