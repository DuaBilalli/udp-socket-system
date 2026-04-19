// server.js (Main entry point)
const FileManager = require('./classes/fileManager');
const HttpMonitor = require('./classes/monitor');
const UDPServerManager = require('./classes/gatekeeper');

const fileManager = new FileManager();
const monitor = new HttpMonitor();
const gatekeeper = new UDPServerManager(fileManager, monitor);

monitor.start();
gatekeeper.start();