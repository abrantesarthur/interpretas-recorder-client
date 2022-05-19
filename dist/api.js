"use strict";
// ====================== IMPORTS ============================ //
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannels = exports.signin = void 0;
const http_1 = require("./http");
// ====================== FUNCTIONS ============================ //
// signin()
//  authenticates to the server and returns the session cookie
const signin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: add email and password to environment varialbes
    let res = yield http_1.httpClient.post("/login", JSON.stringify({
        email: email,
        password: password,
    }));
    let cookie = "";
    if (res.headers['set-cookie'] !== undefined) {
        cookie = res.headers['set-cookie'][0];
    }
    let radioHost = res.data;
    return { "radioHost": radioHost, "cookie": cookie };
});
exports.signin = signin;
const getChannels = (radioHostId) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield http_1.httpClient.get("/accounts/" + radioHostId + "/channels");
    let radioChannels = res.data;
    return radioChannels;
});
exports.getChannels = getChannels;
