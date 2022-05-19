// ====================== IMPORTS ============================ //

// http client
import axios = require('axios');
import { symlinkSync } from 'fs';
const defaultAxios = axios.default;

// socket io
import { io, Socket } from 'socket.io-client';
import { getChannels, signin } from './api';

// ================= CONFIGURE HTTP CLIENT ======================== //

// define server base url
const baseURL = `http://${process.env.HOSTNAME}:${process.env.PORT}`

// initialize http client
const httpClient = defaultAxios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
});

// ================= CONFIGURE SOCKET CLIENT ======================== //


function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

// socketConnect()
//  connect to the server via socket.io and return the socket connection  
const socketConnect :
  (email: string, password: string, channel: string) => Promise<Socket | null> = 
  async (email, password, channelName) => {

    // authenticate to the server and get session cookie
    const res = await signin(email, password);

    console.log("authenticated...");

    // get this user's channels
    let chs = await getChannels(res.radioHost.id);
    
    // get id of channelname
    let chId = "";
    chs.forEach((ch) => {
      if(ch.name == channelName) {
        chId = ch.id;
      }
    })

    // abort if not found
    if(chId.length === 0 ) {
      return null;
    }


    // connect with socket
    let socket = io(
      baseURL + "channels/",
      {
        extraHeaders: {
          cookie: res.cookie
        }
      }
    );

    socket.on("connect", () => {
      console.log("connected to socket.. ");
    })

    // wait until socket is connected
    while(socket.disconnected) {
      await delay(1);
    }

    return socket;
}

// ================= EXPORTS ======================== //

export {socketConnect, httpClient};