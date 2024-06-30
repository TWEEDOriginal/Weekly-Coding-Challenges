const roundRobin = (numberOfServers, previousChoice) => {
  if (previousChoice + 1 < numberOfServers) return previousChoice + 1;

  return 0;
};

async function performHealthCheck(
  backendServerPorts,
  healthyServerPorts,
  hostname
) {
  const promiseArr = [];

  for (let port of backendServerPorts) {
    promiseArr.push(
      fetch(`http://${hostname}:${port}/health`, {
        method: "GET",
        headers: {
          "user-agent": "load-balancer",
        },
      })
    );
  }
  const responses = await Promise.allSettled(promiseArr);
  for (let i = 0; i <= responses.length; i++) {
    const res = responses[i];
    const port = backendServerPorts[i];
    const portIndex = healthyServerPorts.indexOf(port);

    if (res?.status === "fulfilled" && res?.value?.status === 200) {
      //add to healthy server array
      portIndex === -1 ? healthyServerPorts.push(port) : null;
    } else {
      //remove from healthy server array
      portIndex > -1 ? healthyServerPorts.splice(portIndex, 1) : null;
    }
  }
}

module.exports = {
  roundRobin,
  performHealthCheck,
};
