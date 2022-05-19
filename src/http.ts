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

const connect = (baseURL: string, channelId: string, cookie: string) => {
  return io(
    baseURL,
    {
      path: "/channels/",
      query: {
        "channel_id": channelId
      },
      extraHeaders: {
        cookie: cookie
      }
    }
  );
}

// socketConnect()
//  connect to the server via socket.io and return the socket connection  
const socketConnect :
  (email: string, password: string, channel: string) => Promise<Socket | null> = 
  async (email, password, channelName) => {

    console.log("socket connect");

    // authenticate to the server and get session cookie
    const res = await signin(email, password);

    console.log("authenticated...");

    // get this user's channels
    let chs = await getChannels(res.radioHost.id);

    // get id of channelname
    let chId = "";
    chs.forEach((ch) => {
      console.log(ch.name);
      if(ch.name == channelName) {
        chId = ch.id;
      }
    })

    // abort if not found
    if(chId.length === 0 ) {
      return null;
    }

    
    // connect to channel through socket
    let socket = connect(baseURL, chId, res.cookie);

    socket.on("connect", () => {
      console.log("connected to socket.. ");
    })

    // wait 1s for socket to connect and retry every 100ms
    let ms = 0;
    while(socket.disconnected) {
      await delay(1);
      // give up at 1000ms
      if(ms === 1000) {
        socket.disconnect()
        return null;
      }
    }

    return socket;
}

// ================= EXPORTS ======================== //

export {socketConnect, httpClient};