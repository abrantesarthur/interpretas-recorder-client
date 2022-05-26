// ====================== IMPORTS ============================ //

import { io, Socket } from 'socket.io-client';
import { getChannels, signin } from './api';
import {baseURL} from "./http";
import { printf } from './readline';

// ================= CONFIGURE SOCKET CLIENT ======================== //

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const connect = (baseURL: string, channelId: string, cookie: string) => {
  return io(
    baseURL,
    {
      path: "/channels",
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
  (email: string, password: string, channelName: string) => Promise<Socket | null> = 
  async (email, password, channelName) => {

    // authenticate to the server and get session cookie
    const res = await signin(email, password);

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
      printf("Could not find channel '" + channelName + "'...")
      return null;
    }

    // connect to the channel through socket, using the authentication credentials
    let socket = connect(baseURL, chId, res.cookie);

    // wait up to 1s for socket to connect
    let ms = 0;
    while(socket.disconnected) {
      await delay(1);
      // give up at 1000ms
      if(ms === 1000) {
        printf("Failed to connect to the server. Try again.")
        socket.disconnect()
        return null;
      }
    }

    // by now, the socket is connected. However, the caller should only consider
    // it ready to receive requests when we receive the custom 'connected' event.
    return socket;
}

// ================= EXPORTS ======================== //

export {socketConnect};