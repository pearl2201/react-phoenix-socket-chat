export const CREATE_CHANNEL = "CREATE_CHANNEL";
export const GET_CHANNEL_LIST = "GET_CHANNEL_LIST";
export const RECEIVE_NEW_ROOM = "RECEIVE_NEW_ROOM";
export const RECEIVE_ROOMS = "RECEIVE_ROOMS";

export default function room(state = { rooms : [] }, action) {
    switch (action.type) {
        case RECEIVE_ROOMS:
            return { rooms: rooms }
        case RECEIVE_NEW_ROOM:
            var rooms = state.rooms;
            rooms.push(action.room);
            return { rooms: rooms }
        default:
            return state
    }
}
