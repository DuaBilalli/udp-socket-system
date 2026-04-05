const dgram = require('dgram');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');

// Initialize the UDP Server
const server = dgram.createSocket('udp4');

// Configuration Variables
const PORT = 3000;
const HOST = '127.0.0.1';
const MAX_CONNECTIONS = 4;
const INACTIVITY_TIMEOUT = 30000;
const HTTP_PORT = 8080;

// State Tracking
const activeClients = new Map();
const messageLogs = []; 

const sendMessage = (text, rinfo) => {
    server.send(Buffer.from(text), rinfo.port, rinfo.address);
};

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Server is listening on ${address.address}:${address.port}`);
});

server.on('message', async (msg, rinfo) => {
    const clientId = `${rinfo.address}:${rinfo.port}`;
    const currentTime = Date.now();

    // Check if new connection exceeds threshold
    if (!activeClients.has(clientId)) {
        if (activeClients.size >= MAX_CONNECTIONS) {
            console.log(`Connection rejected for ${clientId} - Server Full`);
            sendMessage("Server Full / Queued. Please wait.", rinfo);
            return;
        }
        console.log(`New connection accepted from: ${clientId}`);
    }

    // Update last seen time for the client
    activeClients.set(clientId, currentTime);
    
    const messageStr = msg.toString().trim();
    
    // Log the message for the HTTP stats server
    messageLogs.push({
        client: clientId,
        command: messageStr,
        time: new Date().toISOString()
    });

    console.log(`Received command from ${clientId}: ${messageStr}`);

    const parts = messageStr.split(' ');
    const command = parts[0];
    const argument = parts.slice(1).join(' '); 

    await handleCommand(command, argument, rinfo);
});

async function handleCommand(command, argument, rinfo) {
    try {
        if (command === '/list') {
            const files = await fs.readdir(__dirname);
            sendMessage("Files in server: \n" + files.join('\n'), rinfo);

        } else if (command === '/read') {
            if (!argument) {
                return sendMessage("Error: Please specify a filename (e.g., /read test.txt)", rinfo);
            }
            const fileContent = await fs.readFile(path.join(__dirname, argument), 'utf8');
            sendMessage(fileContent, rinfo);

        } else if (command === '/search') {
            sendMessage("Search command received!", rinfo);
        } 
        // Add /info, /delete, /upload, /download here!
        else {
            sendMessage("Unknown command. Try /list or /read", rinfo);
        }

    } catch (error) {
        console.error(`Error executing command ${command}:`, error.message);
        sendMessage(`Error: ${error.message}`, rinfo);
    }
}

// Inactivity Timeout Loop
setInterval(() => {
    const currentTime = Date.now();
    for (const [clientId, lastSeen] of activeClients.entries()) {
        if (currentTime - lastSeen > INACTIVITY_TIMEOUT) {
            console.log(`Closing connection for ${clientId} due to inactivity.`);
            activeClients.delete(clientId);
        }
    }
}, 5000); 

// HTTP Monitoring Server
const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/stats') {
        const stats = {
            activeConnections: activeClients.size,
            activeIPs: Array.from(activeClients.keys()),
            totalMessages: messageLogs.length,
            messages: messageLogs
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats, null, 2));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found. Please visit /stats');
    }
});

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP Monitoring Server running at http://localhost:${HTTP_PORT}/stats`);
});

// Start the UDP server
server.bind(PORT, HOST);