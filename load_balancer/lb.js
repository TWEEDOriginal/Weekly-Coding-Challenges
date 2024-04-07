#! /usr/bin/env node

const Server = require("./server");
const { roundRobin, performHealthCheck } = require("./utils");

class LoadBalancer extends Server {
  constructor(port) {
    super(port);
    this.backendServerPorts = [8080, 8081, 8082];
    this.healthyServerPorts = [];
    this.performHealthCheck();
    this.choice;
    this.handleRequest();
  }

  handleRequest() {
    this.server.on("request", async (req, res) => {
      // choose backend server
      this.choice = roundRobin(this.healthyServerPorts.length, this.choice);

      /** forward request to backend server */
      await this.forwardRequest(this.healthyServerPorts[this.choice], req, res);
    });
  }

  async forwardRequest(port, req, res) {
    // make request to backend server using the
    // same request made to loadBalancer
    const response = await fetch(
      `http://${this.hostname}:${port}${req.url}`,
      req
    );
    console.log(
      `\nResponse from server: HTTP/${req.httpVersion} ${response.status} ${response.statusText}`
    );

    const serverRes = await response.text();
    console.log(`\n${serverRes}`);

    res
      .writeHead(response.status, {
        "Content-Type": "text/plain",
      })
      .end(serverRes);
  }

  performHealthCheck() {
    performHealthCheck(
      this.backendServerPorts,
      this.healthyServerPorts,
      this.hostname
    );
    // seconds
    const healthCheckPeriod = +process.argv[process.argv.length - 1] || 10;
    //periodic health checks
    setInterval(
      performHealthCheck,
      1000 * healthCheckPeriod,
      this.backendServerPorts,
      this.healthyServerPorts,
      this.hostname
    );
  }
}

new LoadBalancer(3000);
