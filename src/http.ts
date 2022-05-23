// ====================== IMPORTS ============================ //

// http client
import axios = require('axios');
const defaultAxios = axios.default;

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

// ================= EXPORTS ======================== //

export {httpClient, baseURL};