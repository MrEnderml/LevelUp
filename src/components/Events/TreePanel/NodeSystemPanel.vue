<template>
  <div class="modal-backdrop" @click="closeModal">
    <div class="modal-window">
    <h2 class="title">⚙️ AUTO Settings</h2>

    <!-- PRIORITY -->
    <div class="setting-card">
      <Tooltip :text="() => systemHits(0)">
        <div class="setting-title">
          PRIORITY
        </div>
      </Tooltip>

      <div class="setting-body">
        <button class="priority-btn" @click="nextPriority">
          {{ system.prioritize }}
        </button>
      </div>
    </div>

    <!-- LEVEL CAP -->
    <div class="setting-card">
      <Tooltip :text="() => systemHits(1)">
        <div class="setting-title">
          LEVEL CAP
        </div>
      </Tooltip>

      <div class="setting-body">
        <div
          class="level-input"
          tabindex="0"
          @keydown="onLevelKey"
        >
          {{ system.levelCondition || 0 }}
        </div>
      </div>
    </div>

    <!-- BLOCK -->
    <div class="setting-card center">
      <Tooltip :text="() => systemHits(2, system.block)">
        <div class="setting-title">
          BLOCK
        </div>
      </Tooltip>

      <div class="setting-body">
        <button
          v-if="canBlock"
          class="btnBlock"
          :class="{ active: system.block }"
          @click="system.block = !system.block"
        >
            <span>🔒</span>
        </button>
      </div>
    </div>

    <div class="footer">
      <button class="btn close" @click="emit('close')">Close</button>
    </div>
  </div>


  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  perk: Object,
  hero: Object,
});

const system = computed(() => props.perk.system);

const emit = defineEmits(['close']);

const closeModal = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};

const nextPriority = () => {
  let p = system.value.prioritize || 0;
  p = (p - 1 + 10) % 10;                  
  system.value.prioritize = p;
};

const canBlock = computed(() =>
  props.hero.infExpansions.tree || props.hero.singularity >= 3
);

function onLevelKey(e) {
  const LEVEL_CAP = 9999;
  if (e.key >= '0' && e.key <= '9' && system.value.levelCondition < LEVEL_CAP) {
    system.value.levelCondition =
      (system.value.levelCondition || 0) * 10 + Number(e.key);

    system.value.levelCondition = Math.min(system.value.levelCondition, LEVEL_CAP);
  }

  if (e.key === 'Backspace') {
    system.value.levelCondition = Math.floor(
      (system.value.levelCondition || 0) / 10
    );
  }

  if (e.key === 'Delete') {
    system.value.levelCondition = 0;
  }
}


function systemHits(id, status) {
  switch (id) {
    case 0:
      return '<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Click the button to change the priority.<br>' +
             'All nodes have a default priority of 9.<br>' +
             'Nodes with a lower priority will be upgraded first by AUTO.</span><br>';
             
    case 1:
      return '<span style="color: #bfbfbf; font-style:italic; font-size:0.95em;">The Level Cap limits AUTO upgrades once a node reaches a certain level.<br>' +
             'Level cap has a default value of 0, which means that the level cap is off.<br>' + 
             '<span style="color: #bd9c9c">Click in the input field to enter a number. Use the Backspace key to clear the number. Use the Delete key to clear the entire input field.</span> </span>';
    case 2: 
      return status? '<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Node is blocked.</span>': 
      '<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Activate to block this node for AUTO.</span>';
  }
}


</script>

<style scoped>
/* BACKDROP */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}


/* WINDOW */
.modal-window {
  background: linear-gradient(180deg, #111, #0a0a0a);
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 255, 0.25);
}

.setting-card {
  background: rgba(20, 30, 20, 0.65);
  border: 1px solid rgba(119, 255, 0, 0.18);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.setting-card.center {
  align-items: center;
}


.setting-title {
  background: rgba(119, 255, 0, 0.12);
  border: 1px solid rgba(119, 255, 0, 0.25);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #b7ff7a;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.setting-title sup {
  font-size: 0.6rem;
  opacity: 0.7;
}


.setting-body {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  justify-content: center;
}


.priority-btn {
  min-width: 46px;
  background: #0e1a1a;
  border: 1px solid rgba(119, 255, 0, 0.65);
  border-radius: 8px;
  padding: 6px 12px;
  color: #77ff00;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.priority-btn:hover {
  background: rgba(119, 255, 0, 0.15);
  box-shadow: 0 0 6px rgba(119, 255, 0, 0.5);
}


.level-input {
  width: 42px;
  height: 26px;
  background: #0e1a1a;
  border: 1px dashed rgba(119, 255, 0, 0.6);
  border-radius: 6px;
  text-align: center;
  font-size: 0.95rem;
  color: #77ff00;
  cursor: text;
}

.level-input:focus {
  outline: none;
  box-shadow: 0 0 6px rgba(119, 255, 0, 0.5);
}


.btnBlock {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  border: 1px solid #555;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  transition: 0.2s;
  color: #aaa;
}

.btnBlock.active {
  background: #7f1919;
  border-color: #ff4444;
  color: #ff7777;
  box-shadow: 0 0 12px rgba(255, 0, 0, 0.4);
}

.btnBlock:hover {
  filter: brightness(1.15);
}

.btnBlock span {
  font-size: 1.1rem;
}


.btn.close {
  background: transparent;
  border: 1px solid rgba(119, 255, 0, 0.4);
  color: #77ff00;
  padding: 6px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.close:hover {
  background: #00fff011;
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}



</style>
