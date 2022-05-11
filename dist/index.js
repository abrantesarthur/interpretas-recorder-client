"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Allow user input from terminal
const readline = require("readline");
// Node-Record-lpcm16
const recorder = require('node-record-lpcm16');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function doTranslationLoop() {
    rl.question("Press any key to translate or 'q' to quit: ", answer => {
        if (answer.toLowerCase() === 'q') {
            rl.close();
            recordFromMicrophone();
        }
        else {
            recordFromMicrophone();
        }
    });
}
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
        console.log(chunk.toString('base64'));
    })
        .on('close', () => {
        doTranslationLoop();
    });
    // stop recording after 3 seconds
    setTimeout(() => {
        recording.stop();
    }, 3000);
}
doTranslationLoop();
