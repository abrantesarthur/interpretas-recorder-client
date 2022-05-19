'use strict';
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
// load configuration variables from .env file
require('dotenv').config();
// ====================== IMPORTS ============================ //
// http client
const axios = require("axios");
const defaultAxios = axios.default;
// terminal io
const readline = require("readline");
// microphone recorder
const recorder = require('node-record-lpcm16');
// socket io
const socket_io_client_1 = require("socket.io-client");
// ================= CONFIGURE CLIENT ======================== //
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
// ================= CONNECT TO SOCKET.IO SERVER ======================== //
// signin()
//  authenticates to the server and returns the session cookie
const signin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: add email and password to environment varialbes
    let res = yield httpClient.post("/login", JSON.stringify({
        email: "test@test.com",
        password: "password",
    }));
    let cookie = "";
    if (res.headers['set-cookie'] !== undefined) {
        cookie = res.headers['set-cookie'][0];
    }
    let radioHost = res.data;
    return { "radioHost": radioHost, "cookie": cookie };
});
const getChannels = (radioHostId) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield httpClient.get("/accounts/" + radioHostId + "/channels");
    console.log(res.data);
    return res.data;
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// socketConnect()
//  connect to the server via socket.io and return the socket connection  
const socketConnect = (email, password, channel) => __awaiter(void 0, void 0, void 0, function* () {
    // authenticate to the server and get session cookie
    const res = yield signin(email, password);
    console.log("authenticated...");
    // get this user's channels
    getChannels(res.radioHost.id);
    // connect with socket
    let socket = (0, socket_io_client_1.io)(baseURL + "channels/", {
        extraHeaders: {
            cookie: res.cookie
        }
    });
    socket.on("connect", () => {
        console.log("connected to socket.. ");
    });
    // wait until socket is connected
    while (socket.disconnected) {
        yield delay(1);
    }
    return socket;
});
const recordFromMicrophone = () => {
    const recording = recorder.record({
        sampleRateHertz: 16000,
        recorder: 'sox',
        silence: '1800.0',
        endOnSilence: true,
    });
    return recording.stream();
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // start recording
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        let socket = yield socketConnect("test@test.com", "password", "ch");
        rl.question("Press any key to translate or 'q' to quit: ", answer => {
            if (answer.toLowerCase() === 'q') {
                socket.disconnect();
                rl.close();
            }
            else {
                // start recording
                const recordingStream = recordFromMicrophone();
                // listen for audio and send it to server
                recordingStream.on('data', (chunk) => {
                    let str = chunk.toString('base64');
                    // if(socket.connected) {
                    //   socket.emit("audioContent", {
                    //     audio_content: chunk.toString('base64')
                    //   });
                    // }
                });
                // on error, try again
                recordingStream.on('error', (e) => {
                    console.log("error");
                });
                // try to reconnedt if the server disconnected explicitly
                socket.on("disconnect", (reason) => __awaiter(this, void 0, void 0, function* () {
                    if (reason === "io server disconnect") {
                        socket = yield socketConnect("test@test.com", "password", "ch");
                    }
                }));
            }
        });
    });
}
main();
