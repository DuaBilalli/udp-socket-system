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
    try {
      if (command === '/list') {
        const files = await fs.readdir(this.dir);

        send(
          files.length === 0
            ? 'SERVER: Nuk ka asnje file.'
            : 'SERVER: Files:\n' + files.join('\n')
        );

      } else if (command === '/read') {
        const safePath = path.join(this.dir, path.basename(argument));
        const content = await fs.readFile(safePath, 'utf8');
        send('SERVER:\n' + content);

      } else if (command === '/upload' && role === 'admin') {
        const [filename, content] = argument.split('|');
        const safePath = path.join(this.dir, path.basename(filename.trim()));

        await fs.writeFile(safePath, content || '');
        send(`SERVER: File "${filename.trim()}" u ngarkua.`);

      } else if (command === '/download' && role === 'admin') {
        const safePath = path.join(this.dir, path.basename(argument));
        const content = await fs.readFile(safePath, 'utf8');

        send(`DOWNLOAD:${argument}|${content}`);

      } else if (command === '/delete' && role === 'admin') {
        const safePath = path.join(this.dir, path.basename(argument));

        await fs.unlink(safePath);
        send(`SERVER: File "${argument}" u fshi.`);

      } else {
        if (
          ['/upload', '/download', '/delete', '/info', '/search'].includes(command) &&
          role !== 'admin'
        ) {
          send('SERVER: Nuk ke leje (Vetem Admin).');
        } else {
          send(`SERVER: Komandë e panjohur ose mesazh i lirë: ${text}`);
        }
      }
    } catch (error) {
      send(
        error.code === 'ENOENT'
          ? 'SERVER: File nuk ekziston.'
          : `SERVER Gabim: ${error.message}`
      );
    }
  }
  }
  module.exports = FileManager; 