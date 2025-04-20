

import { reactive } from 'vue';


const logEntries = reactive([]);


export const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  logEntries.push({ message, timestamp });

 
  if (logEntries.length > 20) {
    logEntries.shift();
  }
};


export const getLogs = () => logEntries;
