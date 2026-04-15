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

    handleMessage(msg, rinfo) {
        const clientId = `${rinfo.address}:${rinfo.port}`;
        const text = msg.toString().trim();

        //per connection
        if (!this.activeClients.has(clientId)){
            if (this.activeClients.size >= config.maxClients){
                return this.send('SERVER: Nuk ka vend, provo me vone.', rinfo.port, rinfo.address);
            }
            
            const role = text.startsWith('ADMIN:') ? 'admin' : 'user';
            this.activeClients.set(clientId, { ip: rinfo.address, port: rinfo.port, role, lastSeen: Date.now()});
            this.monitor.log(`U lidh: ${clientId} si ${role}`);

            return this.send(`SERVER: Mire se erdhe! Roli yt: ${role}`, rinfo.port, rinfo.address);
        }

        //kontollon aktivitetin e klientit (heartbeat)
        const clientData = this.activeClients.get(clientId);
        clientData.lastSeen = Date.now();
        if(text === 'ping') return; //ignore heartbeat pings
        this.monitor.log(`Mesazh nga ${clientId} (${clientData.role}): ${text}`);
        
        //per ekzekutim te komandave
        const execute = () => this.fileManager.processCommand(text, clientData.role, this, rinfo);
        if(clientData.role === 'admin'){
            execute(); //admin - menjehere
        }else{
            setTimeout(execute, 500); //client - me delay 0.5s
        }

    }

}