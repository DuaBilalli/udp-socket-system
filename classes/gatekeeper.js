const dgram = require('dgram');
const config = require('./config/config');

class UDPServerManager {

    constructor(fileManager, monitor) {
        this.server = dgram.createSocket('udp4');
        this.activeClients = new Map();
        this.fileManager = fileManager; 
        this.monitor = monitor; 
    }

    start() {
    }

    //dergon mesazhin te klienti
    send(text, port, ip) {
        this.server.send(Buffer.from(text), port, ip);
    }

}