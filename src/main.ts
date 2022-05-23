'use strict';

// load configuration variables from .env file
require('dotenv').config();

// ====================== IMPORTS ============================ //

// terminal io
import readline = require('readline');
import { socketConnect } from './socket';
import { recordFromMicrophone } from './record';

// ================== MAIN ===================== //

async function main() {
  //  read/write to/from terminal
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let socket = await socketConnect("test@test.com", "password", "Commencement");

  rl.question("Press any key to translate or 'q' to quit: ", answer => {

    if (!socket || answer.toLowerCase() === 'q') {
      rl.close();
    } else {

      // start recording
      const recordingStream = recordFromMicrophone();

      // transmit audio data to server
      recordingStream.on('data', (chunk: any) => {
        let str: string = chunk.toString('base64');
        // if(socket.connected) {
        //   socket.emit("audioContent", {
        //     audio_content: chunk.toString('base64')
        //   });
        // }
      })

      // on error, try again
      recordingStream.on('error', (e) => {
        console.log("error");
      })


      // try to reconnedt if the server disconnected explicitly
      socket.on("disconnect", async (reason) => {
        if(reason === "io server disconnect") {
          socket = await socketConnect("test@test.com", "password", "ch");
        }
      })

    }
  });
}

main();