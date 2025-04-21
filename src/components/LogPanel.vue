<template>
  <div class="log-panel">
    <h2>📝 Logs</h2>
    <div v-for="(log, index) in logs" :key="index" class="log-entry">
      <span class="message">{{ log.message }}</span><br>
      <small class="timestamp">  {{ log.timestamp }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, nextTick } from 'vue';
import { addLog, getLogs } from '../composables/logService.js';



const logs = ref(getLogs());
const logContainer = ref(null);



watchEffect(() => {
  logs.value = getLogs();

  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
});

</script>

<style scoped>
.log-panel {
  max-width: 200px;
  position: fixed;
  right: 0%;
  top: 15%;  
  background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 16px;
  color: #e0e0e0;
  box-shadow: 0 0 10px #000;
  font-family: 'Courier New', monospace;
  max-height: 500px;
  overflow-y: auto;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #ffd700;
  text-shadow: 0 0 6px #facc15;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-entry {
  padding: 4px 8px;
  border-left: 3px solid #888;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.log-entry:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.timestamp {
  color: #a0a0a0;
  margin-right: 8px;
  font-size: 0.85em;
}

.message {
  color: #f3f3f3;
}
</style>
