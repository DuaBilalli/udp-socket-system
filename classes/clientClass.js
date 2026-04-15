const dgram = require('dgram');
const config = require('../config/config');

class UDPClient {
  constructor(role = 'user') {
    this.client = dgram.createSocket('udp4');
    this.role = role;
  }

  send(text) {
    const message = Buffer.from(text);
    this.client.send(message, config.port, config.host);
  }
}

module.exports = UDPClient;