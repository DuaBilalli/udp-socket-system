# Overview
A Node.js-based client-server system that uses UDP sockets for real-time communication between clients and the server. The project demonstrates how socket programming can be used to build lightweight network applications, where messages are sent and received without establishing a persistent connection.

It includes role-based access control (admin and user), file management operations, and a monitoring system that tracks server activity in real time. The system is designed to show how UDP sockets can be used for fast, connectionless communication while maintaining structure and security through modular architecture.

# Project Stucture
```
udp-socket-system/
├── config/
│   └── config.js
│
├── logs/
│   └── messages.log
│
├── server-files/
│   └── ...
│
├── classes/
│   ├── gatekeeper.js
│   ├── fileManager.js
│   ├── monitor.js
│   └── clientClass.js
│
├── server.js
├── client.js
├── client-admin.js
│
├── .gitignore
└── README.md

```

# System Roles

## Gatekeeper (UDP Server)

Responsible for managing the UDP socket server, handling client connections, authentication (admin/user roles), message processing, and enforcing access rules and delays. It also keeps track of active clients and manages heartbeats.

## File Manager

Handles all file-related operations on the server such as listing, reading, uploading, downloading, and deleting files. It also ensures security by preventing unauthorized access and directory traversal attacks.

## Monitor (HTTP Server)

Provides real-time monitoring of the system through an HTTP endpoint. It logs all server activity, displays recent messages, and shows the current server status and stored files.

## Client Application

Represents the user-side application that connects to the UDP server. It allows users (admin or regular user) to send commands, receive responses, and interact with the file system based on their assigned role.

# Setup & Installation

1. Clone the repository  
```bash
git clone https://github.com/your-username/udp-socket-system.git
```

2. Navigate into the project folder  
```bash
cd udp-socket-system
```

3. Install dependencies  
```bash
npm install
```

4. Start the server  
```bash
node server.js
```

5. Start a user client  
```bash
node client.js
```

6. Start an admin client  
```bash
node client-admin.js
```

# Authentication

# Available Commands
