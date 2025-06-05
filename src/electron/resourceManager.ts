import osUtils from 'os-utils';
import fs from 'fs';
import os from 'os';

const POLLING_INTERVAL = 500;

function getCpuUsage(): Promise<number> {
  return new Promise(res => {
    osUtils.cpuUsage(res);
  });
}

function getRamUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;

  const usedGB = Math.floor(used / 1_000_000_000);
  const totalGB = Math.floor(total / 1_000_000_000);

  return {
    percent: used / total,
    usedGB,
    totalGB,
  };
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;
  const used = total - free;

  return {
    total: Math.floor(total / 1_000_000_000),
    used: Math.floor(used / 1_000_000_000),
    usage: 1 - free / total,
  };
}

function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalRAMGB = Math.floor(osUtils.totalmem() / 1024);
  return {
    totalStorage,
    cpuModel,
    totalRAMGB,
  };
}

const INDENT = '      ';

//prettier-ignore
function formatLine(label: string, value: string, extra: string = '') {
  return `${label.padEnd(10)}: ${value.padStart(6)} ${extra}`.trimEnd();
}

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    const staticData = getStaticData();

    // const usagePercent = Math.floor(storageData.usage * 100);

    // prettier-ignore
    console.log(`\n${INDENT}System Monitor
      ==============
      ${formatLine('CPU', `${Math.round(cpuUsage * 100)}%`, `(${staticData.cpuModel})`)}
      ${formatLine('RAM', `${Math.round(ramUsage.percent * 100)}%`, `(${ramUsage.usedGB} / ${ramUsage.totalGB} GB)`)}
      ${formatLine('Storage', `${Math.floor(storageData.usage * 100)}%`, `${storageData.used} / ${storageData.total} GB`)}
      `);
  }, POLLING_INTERVAL);
}
