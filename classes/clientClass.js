const dgram = require('dgram');
const readline = require('readline');
const config = require('../config/config');

class UDPClient {
  constructor(role = 'user') {
    this.client = dgram.createSocket('udp4');
    this.role = role;
    this.prefix = role === 'admin' ? 'ADMIN' : 'USER';

    this.allowedCommands = {
      user: ['/read'],
      admin: ['/list', '/read', '/upload', '/download', '/delete', '/search', '/info']
    };

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${this.prefix}> `
    });
  }

  start() {
    this.client.on('message', (msg) => {
      console.log('\nServer:', msg.toString());
      this.rl.prompt();
    });

    console.log(`U lidh me serverin ${config.host}:${config.port}`);
    this.send(`${this.prefix}: duke u lidhur`);

    this.rl.prompt();

    this.rl.on('line', (line) => {
      const input = line.trim();
      const command = input.split(' ')[0];

      if (!this.allowedCommands[this.role].includes(command)) {
        console.log('⛔ Nuk ke leje për këtë komandë');
        this.rl.prompt();
        return;
      }

      this.send(input);
      this.rl.prompt();
    });
  }

  send(text) {
    const message = Buffer.from(text);
    this.client.send(message, config.port, config.host);
  }
}

module.exports = UDPClient;