const http = require("node:http");

class Server {
  constructor(port) {
    this.port = port;
    this.hostname = "127.0.0.1";
    this.server = http.createServer(async (req, res) => {
      console.log(`Received request from ${this.hostname}`);
      console.log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
      console.log(`Host: ${req.headers.host}`);
      console.log(`User-Agent: ${req.headers["user-agent"]}`);
      console.log(`Accept:  ${req.headers.accept}`);
    });

    this.server.listen(port, this.hostname, () => {
      console.log(`Server running at http://${this.hostname}:${port}/`);
    });
  }
}

module.exports = Server;
