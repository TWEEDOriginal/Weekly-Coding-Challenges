#! /usr/bin/env node
const { createServer } = require("node:net");
const Deserializer = require("./deserialize");
const Serializer = require("./serialize");
const handleCommand = require("./commands");
const { loadOnStartup } = require("./commands/save");

class RedisServer {
  constructor(port) {
    this.port = port;
    this.server = this.createTCPServer();
    this.serverListen();
  }

  createTCPServer() {
    loadOnStartup();
    return createServer((socket) => {
      socket.on("data", (chunk) => {
        try {
          // data is in RESP
          const data = chunk.toString("utf-8");
          this.analyseData(data, socket);
        } catch (e) {
          this.handleError(e, socket);
        }
      });

      socket.on("end", () => {
        console.log(
          `Connection to socket ${socket.remoteAddress} on port ${socket.remotePort} has been terminated`
        );
      });

      socket.on("error", (err) => {
        console.error(err.message);
        socket.end();
      });
    });
  }

  serverListen() {
    this.server.listen(this.port, () => {
      console.log(`TCP server listening on ${this.port}`);
    });
  }

  analyseData(request, socket) {
    const data = new Deserializer(request).deserialize();
    socket.write(handleCommand(data, socket));
  }

  handleError(error, socket) {
    console.error(error.message);
    socket.write(new Serializer(new Error(error.message)).serialize());
  }
}

new RedisServer(6379);
