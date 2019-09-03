export const CONNECT_SOCKET = "CONNECT_SOCKET";
export const DISCONNECT_SOCKET = "DISCONNECT_SOCKET";
export const GET_INFO_USER_SUCCESS = "GET_INFO_USER_SUCCESS";

export const CONNECT_SUCCESS = "CONNECT_SUCCESS";

export function ConnectSocket(username) {
    return {
        type: CONNECT_SOCKET,
        username: username
    }
}

export function DisconnectSocket() {
    return {
        type: DISCONNECT_SOCKET
    }
}

export default function auth(state = { isAuth: false, current_user: {} }, action) {
    switch (action.type) {
        case CONNECT_SUCCESS:

            return { ...state, isAuth: true }

        case GET_INFO_USER_SUCCESS:

            return { ...state, current_user: action.user }
        default:
            return state
    }
}
