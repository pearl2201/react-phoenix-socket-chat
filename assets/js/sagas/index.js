import { Socket } from "phoenix"
import { all, call, select, take, takeEvery, put, spawn, cancel, cancelled, fork } from "redux-saga/effects";
import { SEND_MESSAGE, CONNECT_SOCKET, DISCONNECT_SOCKET, CONNECT_CHANNEL, DISCONNECT_CHANNEL, CONNECT_SUCCESS, GET_INFO_USER_SUCCESS } from '../actions'
import { eventChannel, END } from 'redux-saga'
import store from '../store/configureStore'
function createSocketChannel(channel) {
    // `eventChannel` takes a subscriber function
    // the subscriber function takes an `emit` argument to put messages onto the channel
    return eventChannel(emit => {
        channel.onError(() => console.log("channel error"));
        channel.on("msg", (payload) => {
            emit(payload);
        })
        console.log("create channel");
        // the subscriber must return an unsubscribe function
        // this will be invoked when the saga calls `channel.close` method
        const unsubscribe = () => {
            channel.leave();
        }

        return unsubscribe
    })
}

function* watchForMessage(channel) {
    var sagachannel = createSocketChannel(channel);
    yield takeEvery(sagachannel, function* eachmessage(payload) {
        console.log(payload);
    });
}
function* watchSendMessage(channel) {
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

function* runLoop(channel) {
    console.log("run loop")
    while (true) {
        yield all([watchForMessage(channel), watchSendMessage(channel)]);
    }
}

function* watchChannel(socket) {
    console.log("watchChannel")
    yield takeEvery(CONNECT_CHANNEL, function* handleSocket(action) {
        let channel = socket.channel(action.channel)
        channel.join()
            .receive("ok", ({ messages }) => console.log("catching up", messages))
            .receive("error", ({ reason }) => console.log("failed join", reason))
            .receive("timeout", () => console.log("Networking issue. Still waiting..."))
        channel.push("msg", { hello: "hello" }, 10000);
        const loopChannel = yield runLoop(channel);
        while (true) {
            var action_disconnect = yield take([DISCONNECT_CHANNEL, DISCONNECT_SOCKET]);
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

function* reqUserInfo(socket) {
    let channel = socket.channel("setting");
    channel.join()
        .receive("ok", ({ messages }) => console.log("catching up", messages))
        .receive("error", ({ reason }) => console.log("failed join", reason))
        .receive("timeout", () => console.log("Networking issue. Still waiting..."))
    channel.push("req_profile", null, 10000)
        .receive("ok", (msg) => {
            console.log(msg);
            store.dispatch({ type: GET_INFO_USER_SUCCESS, user: msg.user });
        })
        .receive("error", (reasons) => console.log("create failed", reasons))
        .receive("timeout", () => console.log("Networking issue..."))
    const loopChannel = yield call(runLoop, channel);
}

function* rootSocket() {
    var payload = yield take(CONNECT_SOCKET);
    let socket = new Socket("/socket", { params: { username: payload.username } });
    socket.connect()
    yield put({ type: CONNECT_SUCCESS });
    const loopWatchSocket = yield spawn(watchChannel, socket);
    const watchUserInfo = yield fork(reqUserInfo, socket);
    yield put({ type: CONNECT_CHANNEL, channel: "room:lobby" });
    yield take(DISCONNECT_SOCKET);
    yield cancel(loopWatchSocket);
    yield cancel(watchUserInfo);
    console.log("disconnect");
    socket.disconnect(() => {console.log("disconnect success")});
}

function* rootAPI() {



}

export default function* rootSaga() {
    yield spawn(rootSocket),
        yield fork(rootAPI)
}
