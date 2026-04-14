const http = require('http');
const fsSync = require('fs');
const path = require('path');
const config = require('./config/config');

class HttpMonitor {
    constructor() {
        this.logFile = 'logs/messages.log';
        if (!fsSync.existsSync('logs')) fsSync.mkdirSync('logs');
    }

    log(text) {
        const line = `[${new Date().toLocaleTimeString()}] ${text}`;
        console.log(line);
        fsSync.appendFileSync(this.logFile, line + '\n');
    }

    start() {
        const server = http.createServer((req, res) => {
            if (req.method === 'GET' && req.url === '/stats') {
                let mesazhet = [];
                if (fsSync.existsSync(this.logFile)) {
                    // Phase 2: Read and keep only the last 20 logs for the HTTP output
                    mesazhet = fsSync.readFileSync(this.logFile, 'utf8')
                        .split('\n').filter(Boolean).slice(-20); 
                }

                const files = fsSync.existsSync('server-files') ? fsSync.readdirSync('server-files') : [];

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    udpPort: config.port,
                    httpPort: config.httpPort,
                    koha: new Date().toLocaleString(),
                    filesNeServer: files,
                    mesazhetEFundit: mesazhet
                }, null, 2));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - Provo: GET /stats');
            }
        });

        server.listen(config.httpPort, () => {
            console.log(`[HTTP] Server në http://localhost:${config.httpPort}/stats`);
        });
    }
}

module.exports = HttpMonitor;