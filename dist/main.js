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
// terminal io
const readline = require("readline");
const http_1 = require("./http");
const record_1 = require("./record");
// ================== MAIN ===================== //
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //  read/write to/from terminal
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        let socket = yield (0, http_1.socketConnect)("test@test.com", "password", "Commencement");
        rl.question("Press any key to translate or 'q' to quit: ", answer => {
            if (!socket || answer.toLowerCase() === 'q') {
                rl.close();
            }
            else {
                // start recording
                const recordingStream = (0, record_1.recordFromMicrophone)();
                // transmit audio data to server
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
                        socket = yield (0, http_1.socketConnect)("test@test.com", "password", "ch");
                    }
                }));
            }
        });
    });
}
main();
