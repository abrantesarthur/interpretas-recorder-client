"use strict";
// ====================== IMPORTS ============================ //
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordFromMicrophone = void 0;
// microphone recorder
const recorder = require('node-record-lpcm16');
// ====================== FUNCTIONS ============================ //
const recordFromMicrophone = () => {
    const recording = recorder.record({
        sampleRateHertz: 16000,
        recorder: 'sox',
        silence: '1800.0',
        endOnSilence: true,
    });
    return recording.stream();
};
exports.recordFromMicrophone = recordFromMicrophone;
