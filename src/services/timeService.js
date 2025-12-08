function getCurrentPKT() {
  const now = new Date();
  const pktOffset = 5 * 60;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (pktOffset * 60000));
}

function getCurrentPKTTime() {
  const pktTime = getCurrentPKT();
  return {
    hour: pktTime.getHours(),
    minute: pktTime.getMinutes(),
    time: pktTime.getTime()
  };
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function isPreMarketWindow() {
  const { hour, minute } = getCurrentPKTTime();
  const currentMinutes = hour * 60 + minute;
  return currentMinutes >= 870 && currentMinutes < 1170;
}

function isCurrentMarketWindow() {
  const { hour, minute } = getCurrentPKTTime();
  const currentMinutes = hour * 60 + minute;
  return currentMinutes >= 1170 || currentMinutes < 120;
}

function isAfterMarketWindow() {
  const { hour, minute } = getCurrentPKTTime();
  const currentMinutes = hour * 60 + minute;
  return currentMinutes >= 120 && currentMinutes < 360;
}

function getCurrentWindow() {
  if (isPreMarketWindow()) return 'premarket';
  if (isCurrentMarketWindow()) return 'current';
  if (isAfterMarketWindow()) return 'aftermarket';
  return null;
}

function isAnyMarketWindowActive() {
  return getCurrentWindow() !== null;
}

function getFormattedPKTTime() {
  const pktTime = getCurrentPKT();
  return pktTime.toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

module.exports = {
  getCurrentPKT,
  getCurrentPKTTime,
  isPreMarketWindow,
  isCurrentMarketWindow,
  isAfterMarketWindow,
  getCurrentWindow,
  isAnyMarketWindowActive,
  getFormattedPKTTime
};

