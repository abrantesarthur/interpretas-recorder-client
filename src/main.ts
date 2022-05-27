'use strict';

// load configuration variables from .env file
require('dotenv').config();

// ====================== IMPORTS ============================ //

// terminal io
import readline = require('readline');
import { ask, printf, close } from './readline';
// socket
import { socketConnect } from './socket';
// microphone recorder
import { recordFromMicrophone } from './record';
import { write } from 'fs';

// ================== MAIN ===================== //

async function main() {

  printf("Welcome to Interpretas Recording Client...\n");
  printf("To begin broadcasting your events, you must log into your account...\n");
  
  const email = await ask("Enter your email address: ");
  const password = await ask("Enter your password: ");
  const channel = await ask("Enter your channel name: ");

  printf("Wait while we connect you...\n");


  // establish a socket connection with the server, using the credentials
  let socket = await socketConnect(email, password, channel);

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
  socket?.on("connected", async (_) => {
    const answer = await ask("Press any key to translate or 'q' to quit: ");

      if (!socket || answer.toLowerCase() === 'q') {
        close();
      } else {
        // start recording
        const recordingStream = recordFromMicrophone();

        let requestsSent = 0;

        // transmit audio data to server
        recordingStream.on('data', (chunk: any) => {
          if(socket != null && socket.connected) {
            requestsSent++;
            if(requestsSent % 10 === 0) {
              console.log(requestsSent +  " requests sent...");
            }
            socket.emit("audioContent", chunk.toString('base64'));
          }
        })

        // on error, try again
        recordingStream.on('error', (e) => {
          console.log("error");
        })
      }
  })
}

main();
