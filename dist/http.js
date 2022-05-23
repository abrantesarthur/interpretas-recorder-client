"use strict";
// ====================== IMPORTS ============================ //
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseURL = exports.httpClient = void 0;
// http client
const axios = require("axios");
const defaultAxios = axios.default;
// ================= CONFIGURE HTTP CLIENT ======================== //
// define server base url
const baseURL = `http://${process.env.HOSTNAME}:${process.env.PORT}`;
exports.baseURL = baseURL;
// initialize http client
const httpClient = defaultAxios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
exports.httpClient = httpClient;
