// ====================== IMPORTS ============================ //

import { httpClient } from "./http";
import { RadioChannel, RadioHost } from "./models";



// ====================== FUNCTIONS ============================ //

// signin()
//  authenticates to the server and returns the session cookie
const signin :
  (email: string, password: string) => Promise<{"radioHost": RadioHost, "cookie": string}> =
  async (email, password) => {
  // TODO: add email and password to environment varialbes
  let res = await httpClient.post(
    "/login",
    JSON.stringify({
      email: "test@test.com",
      password: "password",
    })
  );

  let cookie = "";
  if(res.headers['set-cookie'] !== undefined) {
    cookie =  res.headers['set-cookie'][0];
  }

  let radioHost : RadioHost = res.data;
  return {"radioHost": radioHost, "cookie": cookie};
}


const getChannels : (radioHostId: string) => Promise<RadioChannel[]> = async (radioHostId) => {
    let res = await httpClient.get("/accounts/" + radioHostId + "/channels");

    let radioChannels : RadioChannel[] = res.data;
    return radioChannels;
}

// ================= EXPORTS ======================== //
export {signin, getChannels}