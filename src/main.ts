'use strict';

// load configuration variables from .env file
require('dotenv').config();

// ====================== IMPORTS ============================ //

// terminal io
import readline = require('readline');
// socket
import { socketConnect } from './socket';
// microphone recorder
import { recordFromMicrophone } from './record';

// ================== MAIN ===================== //

async function main() {
  //  read/write to/from terminal
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // establish a socket connection with the server, using the credentials
  let socket = await socketConnect("test@test.com", "password", "Commencement");

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

  // socket is succesfully connected for the purposes of this application]
  // only after the server sends the custom 'connected' event
  socket?.on("connected", (_) => {
    rl.question("Press any key to translate or 'q' to quit: ", answer => {

      if (!socket || answer.toLowerCase() === 'q') {
        rl.close();
      } else {
        
  
        // start recording
        const recordingStream = recordFromMicrophone();
  
  
        // transmit audio data to server
        recordingStream.on('data', (chunk: any) => {
          if(socket != null && socket.connected) {
            socket.emit("audioContent", chunk.toString('base64'));
          }
        })
  
        // on error, try again
        recordingStream.on('error', (e) => {
          console.log("error");
        })
  
      }
    });
  })
  

  
}

main();
