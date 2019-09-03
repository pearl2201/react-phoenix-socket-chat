import { Socket } from "phoenix"
import { all, call, select, take, takeEvery, put, spawn, cancel, cancelled, fork } from "redux-saga/effects";

import { CONNECT_SOCKET, DISCONNECT_SOCKET, CONNECT_SUCCESS, GET_INFO_USER_SUCCESS } from '../ducks/auth'
import { NEW_USER_JOIN_ROOM, CREATE_CHATROOM, CONNECT_CHATROOM, DISCONNECT_CHATROOM, SEND_MESSAGE, RECEIVE_MESSAGE, CONNECT_CHATROOM_SUCCESS, DISCONNECT_CHATROOM_SUCCESS, USER_EXISTS_ROOM } from '../ducks/chatroom'
import { eventChannel, END } from 'redux-saga'
import store from '../store/configureStore'
function createSocketChannel(channel, events, onExit) {
    // `eventChannel` takes a subscriber function
    // the subscriber function takes an `emit` argument to put messages onto the channel
    return eventChannel(emit => {
        channel.onError(() => console.log("channel error"));
        for (const eventName of Object.keys(events)) {
            channel.on(eventName, (payload) => {

                events[eventName](emit, payload);
            })
        }

        console.log("create channel");
        // the subscriber must return an unsubscribe function
        // this will be invoked when the saga calls `channel.close` method
        const unsubscribe = () => {
            channel.leave().receive("ok", (msg) => onExit());

        }

        return unsubscribe
    })
}

function* watchForChatMessage(channel) {
    var sagachannel = createSocketChannel(channel, {
        'new_user': (emit, payload) => {
            payload.type = NEW_USER_JOIN_ROOM;
            emit(payload);
        },
        'chat_message': (emit, payload) => {
            payload.type = RECEIVE_MESSAGE;
            emit(payload)
        },
        'remove_user': (emit, payload) => (emit, payload) => {
            payload.type = USER_EXISTS_ROOM;
            emit(payload)
        }

    }
        , () => {
            store.dispatch({ type: DISCONNECT_CHATROOM_SUCCESS })
        });
    yield takeEvery(sagachannel, function* eachmessage(payload) {
        yield put(payload)

    });
}
function* watchSendChatMessage(channel) {
    while (true) {
        var payload = yield take(SEND_MESSAGE);
        try {
            yield call((args) => {
                channel.push(payload.event, payload.message, 10000)
                    .receive("ok", (msg) => console.log("created message", msg))
                    .receive("error", (reasons) => console.log("create failed", reasons))
                    .receive("timeout", () => console.log("Networking issue..."))
            }, payload);
        } catch (e) {
            console.log("cannot send message", e);
        }
    }
}

function* runLoopChatChannel(channel) {

    while (true) {
        yield all([watchForChatMessage(channel), watchSendChatMessage(channel)]);
    }
}

function* watchChatChannel(socket) {

    yield takeEvery([CONNECT_CHATROOM], function* handleSocket(action) {
        let channel = socket.channel(action.channel)
        yield channel.join()
        const loopChannel = yield runLoopChatChannel(channel);
        while (true) {
            var action_disconnect = yield take([DISCONNECT_CHATROOM, DISCONNECT_SOCKET]);
            if (action.type == DISCONNECT_SOCKET) {
                cancel(loopChannel);
                break;
            } else if (action.channel == action_disconnect.channel) {
                cancel(loopChannel);
                break;
            }

        }

    });
}

function* watchForSendInfoQuery(channel) {
    var sagachannel = createSocketChannel(channel, {
        'create_room_success': (emit, payload) => {
            console.log(payload);
            emit({ type: CONNECT_CHATROOM, channel: `room:${payload.channel.idx}` });
        },
        'req_profile_success': (emit, payload) => {
            console.log(payload);

            emit({ type: GET_INFO_USER_SUCCESS, user: payload.user })
        }

    }
        , () => {

        });
    console.log("watchForSendInfoQuery");
    yield takeEvery(sagachannel, function* eachmessage(payload) {
        yield put(payload)

    });
}

function* watchForReceiveInfoQuery(channel) {
    while (true) {
        var payload = yield take([CREATE_CHATROOM, "req_profile"]);
        try {
            yield call((args) => {
                if (payload.type == 'req_profile') {

                    channel.push("req_profile", null, 10000)
                        .receive("ok", (payload) => store.dispatch({ type: GET_INFO_USER_SUCCESS, user: payload.user }))
                }
                else if (payload.type == CREATE_CHATROOM) {
                    channel.push("create_chatroom", { channel: payload.channel }, 10000)
                        .receive("ok", (payload) => store.dispatch({ type: CONNECT_CHATROOM, channel: `room:${payload.channel.idx}` }))
                }
                else {
                    channel.push(payload.event, payload.message, 10000)
                }

            }, payload);
        } catch (e) {
            console.log("cannot send message", e);
        }
    }
}

function* runLoopwatchInfoQuery(channel) {

    while (true) {
        yield all([watchForSendInfoQuery(channel), watchForReceiveInfoQuery(channel)]);
    }
}

function* watchInfoQuery(socket) {
    let channel = socket.channel("setting");
    var joined = yield channel.join()
    console.log(joined);
    yield fork(runLoopwatchInfoQuery, channel);
    yield put({ type: 'req_profile' })
}

function* rootSocket() {
    var payload = yield take(CONNECT_SOCKET);
    let socket = new Socket("/socket", { params: { username: payload.username } });
    socket.connect()
    yield put({ type: CONNECT_SUCCESS });
    const loopWatchSocket = yield spawn(watchChatChannel, socket);
    const watchUserInfo = yield fork(watchInfoQuery, socket);
    yield take(DISCONNECT_SOCKET);
    yield cancel(loopWatchSocket);
    yield cancel(watchUserInfo);
    console.log("disconnect");
    socket.disconnect(() => { console.log("disconnect success") });
}

function* rootAPI() {



}

export default function* rootSaga() {
    yield spawn(rootSocket),
        yield fork(rootAPI)
}
