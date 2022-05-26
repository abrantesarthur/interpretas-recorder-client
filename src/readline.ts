import readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function ask(query: string) : Promise<string> {  
    return  new Promise(resolve => rl.question(query, ans => {
    resolve(ans);
  }))
}

export function printf(query: string) {
    return rl.write(query);
}

export function close() {
    rl.close();
}
   
