import osUtils from 'os-utils';
const POLLING_INTERVAL = 500;

function getCpuUsage() {
  osUtils.cpuUsage(p => console.log(p));
}

export function pollResources() {
  setInterval(() => {
    getCpuUsage();
  }, POLLING_INTERVAL);
}
