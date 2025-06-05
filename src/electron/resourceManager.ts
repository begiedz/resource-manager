import osUtils from 'os-utils';
import fs from 'fs';

const POLLING_INTERVAL = 500;

function getCpuUsage() {
  return new Promise(res => {
    osUtils.cpuUsage(res);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    console.log(`
[CPU] ${cpuUsage}
[RAM] ${ramUsage}
[Storage] ${storageData.usage} / ${storageData.total}
`);
  }, POLLING_INTERVAL);
}
