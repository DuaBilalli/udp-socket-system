const dgram = require('dgram');
const readline = require('readline');
const fs = require('fs');
const config = require('../config/config');

class UDPClient {
    constructor(role = 'user') {
        this.client = dgram.createSocket('udp4');
        this.role = role;
        this.prefix = role === 'admin' ? 'ADMIN' : 'USER';

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `${this.prefix}> `
        });
    }

    start() {
        this.client.on('message', (msg) => this.handleResponse(msg.toString()));

        this.send(`${this.prefix}: duke u lidhur`);

        console.log(`U lidh me serverin ${config.host}:${config.port}`);
        console.log(
            this.role === 'admin'
                ? 'Komandat: /list | /read | /upload | /download | /delete | /search | /info'
                : 'Ke vetem READ permission. Komanda e lejuar: /read <file>'
        );

        this.rl.prompt();

        this.rl.on('line', (line) => {
            const input = line.trim();
            if (input) this.send(input);
            this.rl.prompt();
        });

        this.rl.on('close', () => {
            console.log('\nU shkëput.');
            this.client.close();
            process.exit(0);
        });

        setInterval(() => this.send('ping'), 4000);
    }

    send(text) {
        this.client.send(Buffer.from(text), config.port, config.host);
    }

    handleResponse(text) {
        if (text.startsWith('DOWNLOAD:') && this.role === 'admin') {
            const parts = text.slice(9).split('|');
            const emri = parts[0];
            const permbajtja = parts[1] || '';

            fs.writeFileSync(emri, permbajtja);
            console.log(`\n[U SHKARKUA] File "${emri}" u ruajt.`);
        } else {
            console.log('\n' + text);
        }

        this.rl.prompt();
    }
}

module.exports = UDPClient;