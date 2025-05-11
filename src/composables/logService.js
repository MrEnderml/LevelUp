

import { reactive } from 'vue';


let logs = reactive([]);

export function addLog(message, type = 'All') {
  logs.push({
    message,
    timestamp: new Date().toLocaleTimeString(),
    type,
  });

  if (logs.length > 100) logs.shift(); 
}

export function getLogs() {
  return logs;
}