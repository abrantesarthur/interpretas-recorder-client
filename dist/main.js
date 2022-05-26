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
const readline_1 = require("./readline");
// socket
const socket_1 = require("./socket");
// microphone recorder
const record_1 = require("./record");
// ================== MAIN ===================== //
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, readline_1.printf)("Welcome to Interpretas Recording Client...\n");
        (0, readline_1.printf)("To begin broadcasting your events, you must log into your account...\n");
        const email = yield (0, readline_1.ask)("Enter your email address: ");
        const password = yield (0, readline_1.ask)("Enter your password: ");
        const channel = yield (0, readline_1.ask)("Enter your channel name: ");
        (0, readline_1.printf)("Wait while we connect you...\n");
        // establish a socket connection with the server, using the credentials
        let socket = yield (0, socket_1.socketConnect)(email, password, channel);
        // TODO: handle disconnection
        // // try to reconnedt if the server disconnected explicitly
        // socket.on("disconnect", async (reason) => {
        //   console.log("user disconnected. try again")
        //   if(reason === "io server disconnect") {
        //     let newSocket = connect(baseURL, chId, res.cookie);
        //     if(newSocket != null) {
        //       socket = newSocket;
        //     }
        //   }
        // })
        // socket is succesfully connected for the purposes of this application
        // only after the server sends the custom 'connected' event
        socket === null || socket === void 0 ? void 0 : socket.on("connected", (_) => __awaiter(this, void 0, void 0, function* () {
            const answer = yield (0, readline_1.ask)("Press any key to translate or 'q' to quit: ");
            if (!socket || answer.toLowerCase() === 'q') {
                (0, readline_1.close)();
            }
            else {
                // start recording
                const recordingStream = (0, record_1.recordFromMicrophone)();
                // transmit audio data to server
                recordingStream.on('data', (chunk) => {
                    if (socket != null && socket.connected) {
                        socket.emit("audioContent", chunk.toString('base64'));
                    }
                });
                // on error, try again
                recordingStream.on('error', (e) => {
                    console.log("error");
                });
            }
            socket === null || socket === void 0 ? void 0 : socket.on("translatedAudioContent", (data) => {
                console.log(data);
            });
        }));
    });
}
main();
