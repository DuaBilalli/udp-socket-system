const config = {
  port: 5000, //porta e serverit udp
  host: '0.0.0.0', //ip e serverit
  httpPort: 8080, //porta e http serverit
  maxClients: 10, //maksimumi i klienteve
  timeout: 10000, //10 sekonda timeout
  serverFiles: './server_files', //ku ruhn files
  logs: './logs' //ku ruhen logs
}

module.exports = config