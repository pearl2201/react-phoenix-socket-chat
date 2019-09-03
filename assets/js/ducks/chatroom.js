export const NEW_USER_JOIN_ROOM = "NEW_USER_JOIN_ROOM";
export const USER_EXISTS_ROOM = "USER_EXISTS_ROOM";

export const SEND_MESSAGE = "SEND_MESSAGE";
export const RECEIVE_MESSAGE = "SEND_MESSAGE";

export const CONNECT_CHATROOM = "CONNECT_CHATROOM";
export const CREATE_CHATROOM = "CREACT_CHATROOM";
export const CONNECT_CHATROOM_SUCCESS = "CONNECT_CHATROOM_SUCCESS";
export const DISCONNECT_CHATROOM = "DISCONNECT_CHATROOM";
export const DISCONNECT_CHATROOM_SUCCESS = "DISCONNECT_CHATROOM_SUCCESS";

export function ConnectChatroom(idx) {
    return {
        type: CONNECT_CHATROOM,
        idx: idx
    }
}


export function CreateChatroom(channel) {
    return {
        type: CREATE_CHATROOM,
        channel: channel
    }
}


export function DisconnectChatroom(channel) {
    return {
        type: DISCONNECT_CHATROOM,
        channel: channel
    }
}



export default function chatroom(state = { currentRoom: {}, messages: [] }, action) {
    switch (action.type) {
        default:
            return state
    }
}
