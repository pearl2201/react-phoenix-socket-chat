import { Socket } from "phoenix"
import { all, call, select, take, takeEvery, put, spawn } from "redux-saga/effects";
import { SEND_MESSAGE } from '../actions'
import { eventChannel, END } from 'redux-saga'

function createSocketChannel(channel) {
    // `eventChannel` takes a subscriber function
    // the subscriber function takes an `emit` argument to put messages onto the channel
    return eventChannel(emit => {
        channel.onError(() => console.log("channel error"));
        channel.on("msg", (payload) => {
            console.log("receive message");
            console.log(payload);
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

function* watchForMessage(socketchannel) {
    console.log("watch for message");
    var sagachannel = createSocketChannel(socketchannel);
    console.log(sagachannel);
  
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
        try {
            yield all([watchForMessage(channel), watchSendMessage(channel)]);
        } catch (e) {
            console.log("error: " + e);
        }

    }
}

function* mainSocket() {
    let socket = new Socket("/socket");
    socket.connect()
    let channel = socket.channel("room:lobby")
    console.log(socket);
    console.log(channel);
    channel.join()
        .receive("ok", ({ messages }) => console.log("catching up", messages))
        .receive("error", ({ reason }) => console.log("failed join", reason))
        .receive("timeout", () => console.log("Networking issue. Still waiting..."))
    channel.push("msg", { hello: "hello" }, 10000);
    console.log("before yield runloop");
    yield runLoop(channel);

}

export default function* rootSaga() {
    yield spawn(mainSocket);
}
