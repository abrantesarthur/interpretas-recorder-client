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
exports.httpClient = exports.socketConnect = void 0;
// http client
const axios = require("axios");
const defaultAxios = axios.default;
// socket io
const socket_io_client_1 = require("socket.io-client");
const api_1 = require("./api");
// ================= CONFIGURE HTTP CLIENT ======================== //
// define server base url
const baseURL = `http://${process.env.HOSTNAME}:${process.env.PORT}`;
// initialize http client
const httpClient = defaultAxios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
exports.httpClient = httpClient;
// ================= CONFIGURE SOCKET CLIENT ======================== //
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const connect = (baseURL, channelId, cookie) => {
    return (0, socket_io_client_1.io)(baseURL, {
        path: "/channels/",
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
    console.log("socket connect");
    // authenticate to the server and get session cookie
    const res = yield (0, api_1.signin)(email, password);
    console.log("authenticated...");
    // get this user's channels
    let chs = yield (0, api_1.getChannels)(res.radioHost.id);
    // get id of channelname
    let chId = "";
    chs.forEach((ch) => {
        console.log(ch.name);
        if (ch.name == channelName) {
            chId = ch.id;
        }
    });
    // abort if not found
    if (chId.length === 0) {
        return null;
    }
    // connect to channel through socket
    let socket = connect(baseURL, chId, res.cookie);
    socket.on("connect", () => {
        console.log("connected to socket.. ");
    });
    // wait 1s for socket to connect and retry every 100ms
    let ms = 0;
    while (socket.disconnected) {
        yield delay(1);
        // give up at 1000ms
        if (ms === 1000) {
            socket.disconnect();
            return null;
        }
    }
    return socket;
});
exports.socketConnect = socketConnect;
