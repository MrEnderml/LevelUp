<template>
  <div class="settings-panel">
    <h2>⚙️ Settings</h2>

    <button @click="saveGame">💾 Save</button>
    <button @click="exportGame">📤 Export</button>
    <button @click="triggerFileInput">📥 Import</button>
    <input type="file" ref="fileInput" accept=".json" style="display: none" />
    <button @click="resetGame">🧹 Reset</button>
      <div class="settings-panel-popup">
        <div class="setting-item toggle">
          <label class="switch-label">
            <span>Popup AFK</span>
            <label class="switch">
              <input type="checkbox" v-model="hero.showAfkPopupRule" />
              <span class="slider"></span>
            </label>
          </label>
        </div>
    </div>
    
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { perks } from '../../data/perks.js';
import { perks as ascension } from '../../data/ascension.js';
import { useBuff } from '../../data/buffs.js';
import { amulets } from '../../data/amulets.js';
import { cursed } from '../../data/cursed.js'; 
import { ref, onMounted, onUnmounted  } from 'vue';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const isDarkTheme = ref(localStorage.getItem('theme') === 'dark');

const saveGame = () => {
  const saveData = {
    hero: hero.value,
    enemy: enemy.value,
    perks: perks,
    ascension: ascension,
    buffs: buffs.value,
    amulets: amulets,
    cursed: cursed,
  };
  localStorage.setItem('gameSave', JSON.stringify(saveData));
};

const exportGame = () => {
  const data = {
    hero: hero.value,
    enemy: enemy.value,
    perks: perks,
    ascension: ascension,
    buffs: buffs.value,
    amulets: amulets,
    cursed: cursed,
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'savegame.json';
  link.click();
};

const fileInput = ref(null);

const triggerFileInput = () => {
  const input = fileInput.value;
  if (!input) return;

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      hero.value = data.hero;
      buffs.value = data.buffs;
      enemy.value = data.enemy;

      for (const key in data.perks) {
        if (perks[key]) {
          perks[key].level = data.perks[key].level;
        }
      }

      for (const key in data.ascension) {
        if (ascension[key]) {
          ascension[key].level = data.ascension[key].level;
          }
      }
      Object.assign(amulets, data.amulets);
      Object.assign(cursed, data.cursed);
    };


    reader.readAsText(file);
  };

  input.click();
};

const resetGame = () => {
  if (confirm('Are you sure you want to reset all progress?')) {
    localStorage.removeItem('gameSave');
    location.reload();
  }
};

const toggleTheme = () => {
  const newTheme = isDarkTheme.value ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
};
</script>

<style scoped>
.settings-panel {
  background-color: #1e293b;
  color: #fff;
  padding: 1rem;
  border-radius: 1rem;
  width: 400px;
  box-shadow: 0 0 10px #64748b;
  font-family: 'Segoe UI', sans-serif;
}

.settings-panel button {
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #334155;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.settings-panel button:hover {
  background-color: #475569;
}

input[type="file"] {
  margin: 0.5rem 0;
  color: white;
}

.theme-toggle {
  margin-top: 1rem;
  font-size: 0.95rem;
}

.setting-item {
  margin-bottom: 1rem;
  color: white;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin-left: 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999;
  transition: 0.3s;
  border-radius: 24px;
}

.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #4caf50;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.settings-panel-popup {
  background-color: #1e293b;
  color: #fff;
  padding: 1rem;
  border-radius: 1rem;
  width: 200px;
  box-shadow: 0 0 10px #64748b;
  font-family: 'Segoe UI', sans-serif;
}
</style>
