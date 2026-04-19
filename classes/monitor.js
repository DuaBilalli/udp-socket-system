const http = require('http');
const fsSync = require('fs');
const path = require('path');
const config = require('../config/config');

class HttpMonitor {
    constructor() {
        this.logFile = 'logs/messages.log';
        this.logLimitBytes = 500 * 1024; // 500 KB limit per Log Rotation
        this.recentLogs = []; // Array ne RAM (Optimizim i memories)

        if (!fsSync.existsSync('logs')) fsSync.mkdirSync('logs');
        
        // Ngarko 20 loget e fundit nese serveri ristartohet
        if (fsSync.existsSync(this.logFile)) {
            this.recentLogs = fsSync.readFileSync(this.logFile, 'utf8')
                .split('\n').filter(Boolean).slice(-20);
        }
    }

    log(text) {
        const line = `[${new Date().toLocaleTimeString()}] ${text}`;
        console.log(line);

        // 1. Optimizimi i Memories: Ruaj vetem 20 te fundit ne Array
        this.recentLogs.push(line);
        if (this.recentLogs.length > 20) {
            this.recentLogs.shift(); // Fshin elementin me te vjeter
        }

        // 2. Log Rotation: Kontrollo nese file eshte bere shume i madh
        if (fsSync.existsSync(this.logFile)) {
            const stats = fsSync.statSync(this.logFile);
            if (stats.size > this.logLimitBytes) {
                // Riemerto file-in e vjeter (Archiving/Rotation)
                const arkiva = `logs/messages_${Date.now()}.log`;
                fsSync.renameSync(this.logFile, arkiva);
                console.log(`[SYSTEM] Log Rotation u krye. U krijua arkiva: ${arkiva}`);
            }
        }

        // Shto logun e ri ne file
        fsSync.appendFileSync(this.logFile, line + '\n');
    }

    start() {
        const server = http.createServer((req, res) => {
            if (req.method === 'GET' && req.url === '/stats') {
                
                // Lexo vetem emrat e file-ve, jo permbajtjen
                const files = fsSync.existsSync('server-files') ? fsSync.readdirSync('server-files') : [];

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    udpPort: config.port,
                    httpPort: config.httpPort,
                    koha: new Date().toLocaleString(),
                    filesNeServer: files,
                    mesazhetEFundit: this.recentLogs // SUPER SHPEJTE (Lexohet nga RAM, jo nga disku)
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