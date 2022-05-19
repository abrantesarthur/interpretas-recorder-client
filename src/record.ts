// ====================== IMPORTS ============================ //

// microphone recorder
const recorder = require('node-record-lpcm16');
import { Stream } from 'stream';


// ====================== FUNCTIONS ============================ //

const recordFromMicrophone : () => Stream = () => {
    const recording = recorder.record({
      sampleRateHertz: 16000,
      recorder: 'sox',
      silence: '1800.0',          // seconds of silence before ending (30min)
      endOnSilence: true,
    });
  
    return recording.stream()
}

// ================= EXPORTS ======================== //

export {recordFromMicrophone};