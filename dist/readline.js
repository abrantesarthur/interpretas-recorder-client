"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.printf = exports.ask = void 0;
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function ask(query) {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }));
}
exports.ask = ask;
function printf(query) {
    return rl.write(query);
}
exports.printf = printf;
function close() {
    rl.close();
}
exports.close = close;
