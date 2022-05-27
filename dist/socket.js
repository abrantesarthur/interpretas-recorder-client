"use strict";
// ====================== IMPORTS ============================ //
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketConnect = void 0;
const socket_io_client_1 = require("socket.io-client");
const api_1 = require("./api");
const http_1 = require("./http");
const readline_1 = require("./readline");
// ================= CONFIGURE SOCKET CLIENT ======================== //
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const connect = (baseURL, channelId, cookie) => {
    return (0, socket_io_client_1.io)(baseURL, {
        path: "/channels",
        query: {
            "channel_id": channelId
        },
        extraHeaders: {
            cookie: cookie
        }
    });
};
// socketConnect()
//  connect to the server via socket.io and return the socket connection  
const socketConnect = (email, password, channelName) => __awaiter(void 0, void 0, void 0, function* () {
    // authenticate to the server and get session cookie
    const res = yield (0, api_1.signin)(email, password);
    // get this user's channels
    let chs = yield (0, api_1.getChannels)(res.radioHost.id);
    // get id of channelname
    let chId = "";
    chs.forEach((ch) => {
        if (ch.name == channelName) {
            chId = ch.id;
        }
    });
    // abort if not found
    if (chId.length === 0) {
        (0, readline_1.printf)("Could not find channel '" + channelName + "'...");
        return null;
    }
    // connect to the channel through socket, using the authentication credentials
    let socket = connect(http_1.baseURL, chId, res.cookie);
    // wait up to 1s for socket to connect
    let ms = 0;
    while (socket.disconnected) {
        yield delay(1);
        // give up at 1000ms
        if (ms === 1000) {
            (0, readline_1.printf)("Failed to connect to the server. Try again.");
            socket.disconnect();
            return null;
        }
    }
    // by now, the socket is connected. However, the caller should only consider
    // it ready to receive requests when we receive the custom 'connected' event.
    return socket;
});
exports.socketConnect = socketConnect;
