export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function truncate(str, len = 30) {
  return str.length > len ? str.slice(0, len) + '...' : str;
}
