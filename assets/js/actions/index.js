export const UPDATE_LAYOUT_NAV = "UPDATE_LAYOUT_NAV";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const CONNECT_SOCKET = "CONNECT_SOCKET";
export const DISCONNECT_SOCKET = "DISCONNECT_SOCKET";
export const GET_CHANNEL_LIST = "GET_CHANNEL_LIST";
export const CREATE_CHANNEL = "CREATE_CHANNEL";
export const CONNECT_CHANNEL = "CONNECT_CHANNEL";
export const CONNECT_SUCCESS = "CONNECT_SUCCESS";
export const GET_INFO_USER_SUCCESS = "GET_INFO_USER_SUCCESS";
export const DISCONNECT_CHANNEL = "CONNECT_CHANNEL";

export function ConnectSocket(username)
{
    return {
        type: CONNECT_SOCKET,
        username: username
    }
}

export function DisconnectSocket()
{
    return {
        type: DISCONNECT_SOCKET
    }
}