import { VideoChat } from "../videoChat";

export const onChatRoomFull = () => {
    alert(
        "Chat room is full. Check to make sure you don't have multiple open tabs, or try with a new room link"
    );
    // Exit room and redirect
    VideoChat.startNewCall();
}