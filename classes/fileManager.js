const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

class FileManager {
  constructor(directory = 'server-files') {
    this.dir = directory;

    if (!fsSync.existsSync(this.dir)) {
      fsSync.mkdirSync(this.dir);
    }
  }
  async processCommand(text, role, serverManager, rinfo) {
    const parts = text.split(' ');
    const command = parts[0];
    const argument = parts.slice(1).join(' ');

    const send = (msg) => serverManager.send(msg, rinfo.port, rinfo.address);
  }
}