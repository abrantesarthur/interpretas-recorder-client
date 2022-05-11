// Allow user input from terminal
import readline = require('readline');
// Node-Record-lpcm16
const recorder = require('node-record-lpcm16');

function recordFromMicrophone() {
  const sampleRateHertz = 16000;
  console.log("Begin speaking...");

  // start recording
  const recording = recorder.record({
    sampleRateHertz: 16000,
    threshold: 0,
    recorder: 'sox',
    silence: '3600.0',          // seconds of silence before ending (1hr)
    endOnSilence: true,
  });

  recording
    .stream()
    .on('data', (chunk: any) => {
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

function doTranslationLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Press any key to translate or 'q' to quit: ", answer => {
    if (answer.toLowerCase() === 'q') {
      rl.close();
    } else {
      recordFromMicrophone();
    }
  });
}

doTranslationLoop();