'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// load configuration variables from .env file
require('dotenv').config();
const axios_ = require("axios");
const axios = axios_.default;
// Allow user input from terminal
const readline = require("readline");
// Node-Record-lpcm16
const recorder = require('node-record-lpcm16');
// initiate http client
const port = Number(process.env.PORT);
const hostname = process.env.HOSTNAME;
const httpClient = axios.create({
    baseURL: `http://${hostname}:${port}`,
    headers: {
        "Content-Type": "application/json",
    }
});
function recordFromMicrophone() {
    const sampleRateHertz = 16000;
    console.log("Begin speaking...");
    // start recording
    const recording = recorder.record({
        sampleRateHertz: 16000,
        threshold: 0,
        recorder: 'sox',
        silence: '3600.0',
        endOnSilence: true,
    });
    recording
        .stream()
        .on('data', (chunk) => {
        // send recording to server
        httpClient.post("/channel", JSON.stringify({ recording: chunk.toString('base64') })).then(response => {
            console.log(response.data);
        });
    })
        .on('close', () => {
        doTranslationLoop();
    });
}
function doTranslationLoop() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question("Press any key to translate or 'q' to quit: ", answer => {
        if (answer.toLowerCase() === 'q') {
            rl.close();
        }
        else {
            recordFromMicrophone();
        }
    });
}
doTranslationLoop();
