<template>
  <div class="log-panel">
    <h2>📝 Logs</h2>
    
    <div class="filter-buttons">
      <button
        v-for="type in logTypes"
        :key="type"
        :class="{ active: currentFilter === type }"
        @click="currentFilter = type"
      >
        {{ type }}
      </button>
    </div>

    <div ref="logContainer" class="log-entries">
      <div
        v-for="(log, index) in filteredLogs"
        :key="index"
        class="log-entry"
      >
        <span class="message">{{ log.message }}</span><br>
        <small class="timestamp">{{ log.timestamp }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { addLog, getLogs } from '../composables/logService.js';

const logs = ref(getLogs());
const logContainer = ref(null);
const logTypes = ['All', 'EXP', 'Weapon', 'Ascend && Rebirth', 'Curses', 'Radiation', 'Stardust'];
const currentFilter = ref('All');

const filteredLogs = computed(() => {
  return currentFilter.value === 'All'
    ? logs.value
    : logs.value.filter(log => log.type === currentFilter.value);
});

watch(logs, async () => {
  await nextTick();
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight;
  }
}, { deep: true });
</script>

<style scoped>
.log-panel {
  max-width: 250px;
  position: fixed;
  right: 0;
  top: 15%;
  background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 12px;
  color: #e0e0e0;
  box-shadow: 0 0 10px #000;
  font-family: 'Courier New', monospace;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 20px;
  color: #ffd700;
  text-shadow: 0 0 6px #facc15;
  margin-bottom: 0.5rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.filter-buttons button {
  flex: 1;
  padding: 4px 6px;
  font-size: 0.75rem;
  background: #333;
  color: #fff;
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-buttons button.active {
  background: #ffd700;
  color: black;
}

.log-entries {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-entry {
  padding: 4px 8px;
  border-left: 3px solid #888;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}

.timestamp {
  color: #a0a0a0;
  font-size: 0.75em;
}

.message {
  color: #f3f3f3;
}
</style>
