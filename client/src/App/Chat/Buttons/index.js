import React from 'react';
import { Button } from './Button'
import { requestToggleCaptions } from './_util/requestToggleCaptions';
import { pauseVideo, } from './_util/pauseVideo';
import { swap } from './_util/swap';
import { togglePictureInPicture } from './_util/togglePictureInPicture';
import { toggleChat } from './_util/toggleChat';
import { muteMicrophone, } from './_util/muteMicrophone';
import { redirectToNewCall } from '../_util/videoChat/_util/redirectToNewCall';

export const Buttons = (props) => {

    const {
        VideoChat,
        updateState,
    } = props;

    const buttons = [
        {
            onClick: muteMicrophone,
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
            onClick: pauseVideo,
            baseId: 'video',
            enableText: 'Pause Video',
            enableIcon: 'video',
            disableText: 'Unpause Video',
            disableIcon: 'video-slash',
        },
        {
            onClick: swap,
            baseId: 'swap',
            enableText: 'Share Screen',
            enableIcon: 'desktop',
        },
        {
            onClick: toggleChat,
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
            onClick: requestToggleCaptions,
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