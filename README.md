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

The system uses a simple role-based authentication mechanism to distinguish between administrators and regular users.

- **Admin users**: Start the client with `ADMIN:` prefix. They have full access to all commands including file upload, download, and deletion.
- **Regular users**: Start the client with `USER:` prefix. They have limited access, mainly read-only operations.

### How it works:
When a client connects to the server, their role is determined based on the initial message:
- If the message starts with `ADMIN:` the user is assigned admin privileges
- Otherwise the user is treated as a regular user

This role is stored on the server and used to control access to all commands.

# Available Commands

The system supports different commands depending on the user role.

### User Commands
- `ping` - Sends heartbeat to keep connection active  
- Any message - Treated as a normal message and logged by the server  
- `/read <file>` - Reads a file from the server (restricted access applies)

### Admin Commands
- `/list` - Lists all files in the server directory  
- `/read <file>` - Reads a file from the server  
- `/upload <filename>|<content>` - Uploads a new file to the server  
- `/download <file>` - Downloads a file from the server (sent as `DOWNLOAD:`)  
- `/delete <file>` - Deletes a file from the server
- `/search <keyword>` - Searches for files by name  
- `/info <file>` - Displays file details (size, creation date, modification date)  

### System Commands (Internal)
- `ping` - Used by client to keep heartbeat alive  
- `ADMIN:` - Identifies admin role during connection  
- `USER:` - Identifies regular user during connection  

### Notes
- Admin commands are processed instantly  
- User commands may have a delay 
- Inactive clients are automatically removed via heartbeat timeout  
- File paths are sanitized using `path.basename()` for security  
