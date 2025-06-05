import osUtils from 'os-utils';
const POLLING_INTERVAL = 500;

function getCpuUsage() {
  return new Promise(res => {
    osUtils.cpuUsage(res);
  });
}

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    console.log(cpuUsage);
  }, POLLING_INTERVAL);
}
