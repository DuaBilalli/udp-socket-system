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
  }