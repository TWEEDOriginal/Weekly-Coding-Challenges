#! /usr/bin/env node
const Server = require("./server");

class BackendServer extends Server {
  constructor(port) {
    super(port);
    this.handleRequest();
  }

  handleRequest() {
    this.server.on("request", async (req, res) => {
      if (req.url === "/") {
        this.generateResponse(
          res,
          200,
          "text/plain",
          `Hello From Backend Server ${this.port}\n`
        );

        console.log(`\nReplied with a hello message`);
      } else if (req.url === "/health") {
        req.method === "GET"
          ? this.generateResponse(
              res,
              200,
              "application/json",
              JSON.stringify({
                statusMessage: "ok",
              })
            )
          : res.writeHead(405).end();
      } else {
        res.writeHead(404).end(`Page not found\n`);
      }
    });
  }

  generateResponse(res, statusCode, contentType, message) {
    res
      .writeHead(statusCode, {
        "Content-Type": contentType,
      })
      .end(message);
  }
}

new BackendServer(process.argv[process.argv.length - 1]);
