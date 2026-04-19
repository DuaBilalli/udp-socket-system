// server.js (Main entry point)
const FileManager = require('./fileManager');
const HttpMonitor = require('./monitor');
const UDPServerManager = require('./gatekeeper');

const fileManager = new FileManager();
const monitor = new HttpMonitor();
const gatekeeper = new UDPServerManager(fileManager, monitor);

monitor.start();
gatekeeper.start();