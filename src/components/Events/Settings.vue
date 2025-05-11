<template>
  <div class="settings-panel">
    <h2>⚙️ Settings</h2>

    <button @click="saveGame">💾 Save</button>
    <button @click="exportGame">📤 Export</button>
    <button @click="triggerFileInput">📥 Import</button>
    <input type="file" ref="fileInput" accept=".json" style="display: none" />
    <button @click="resetGame">🧹 Reset</button>
    <button v-if="hero.infTier  > 0" @click="resetInf"><span class="infinity-glow">∞</span> Reset Infinity</button>
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
import { perks as radPerks } from '../../data/radPerks.js'; 
import { spEnemy as space } from '../../data/spaceEnemy.js';
import { goals } from '../../data/infGoals.js';
import { ref, onMounted, onUnmounted  } from 'vue';
import CryptoJS from 'crypto-js';

const D_RULE = 'Only one must exist';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const isDarkTheme = ref(localStorage.getItem('theme') === 'dark');

function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const saveGame = () => {
  const saveData = {
    hero: hero.value,
    enemy: enemy.value,
    perks: perks.value,
    ascension: ascension,
    buffs: buffs.value,
    amulets: amulets,
    cursed: cursed,
    radPerks: radPerks,
    space: space,
    infGoals: goals.value
  };
  localStorage.setItem('gameSave', JSON.stringify(saveData));
};

const exportGame = () => {
  const data = {
    hero: hero.value,
    enemy: enemy.value,
    perks: perks.value,
    ascension: ascension,
    buffs: buffs.value,
    amulets: amulets,
    cursed: cursed,
    radPerks: radPerks,
    space: space,
    goals: goals.value
  };
  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(json, D_RULE).toString();

  const blob = new Blob([encrypted], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'savegame.enc';
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
      let raw = e.target.result;
      let data;

      try {
        const decrypted = CryptoJS.AES.decrypt(raw, D_RULE).toString(CryptoJS.enc.Utf8);
        data = JSON.parse(decrypted);
      } catch (err) {
        try {
          data = JSON.parse(raw);
        } catch (jsonErr) {
          alert('Unable to load file: corrupted or invalid format');
          return;
        }
      }

      if (data.hero) deepMerge(hero.value, data.hero);
      if (data.enemy) deepMerge(enemy.value, data.enemy);
      if (data.perks) {
        for (let idx in data.perks) {
          const perkData = data.perks[idx];
          const targetPerk = perks.value[idx];
          if (!perkData || !targetPerk) continue;
          targetPerk.level = perkData.level;
          if ('status' in perkData) targetPerk.status = perkData.status;
          if ('infStatus' in perkData) targetPerk.infStatus = perkData.infStatus;
        }
        if (data.perks[0]?.kills !== undefined) {
          perks.value[0].kills = data.perks[0].kills;
        }
        if (data.perks[1]?.buff !== undefined) {
          perks.value[1].buff = data.perks[1].buff;
        }
      }
      if (data.ascension) {
        for (let idx in data.ascension) {
          ascension[idx].level = data.ascension[idx].level;
          if (ascension[idx].status !== undefined)
            ascension[idx].status = data.ascension[idx].status;
        }
      }
      if (data.space) {
        for (let idx in data.space) {
          space[idx].status = data.space[idx].status;
        }
      }
      if (data.buffs) {
        for (let idx in data.buffs) {
          buffs.value[idx].exp = data.buffs[idx].exp;
          buffs.value[idx].tier = data.buffs[idx].tier;
          buffs.value[idx].active = data.buffs[idx].active;
        }
      }
      if (data.cursed) {
        for (let idx in data.cursed) {
          if (cursed[idx].status !== 'undefined')
            cursed[idx].status = data.cursed[idx].status;
        }
      }
      if (data.radPerks) {
        for (let idx in data.radPerks) {
          radPerks[idx].level = data.radPerks[idx].level;
          if (idx == 6) {
            radPerks[idx].max = data.radPerks[idx].max;
            radPerks[idx].status = data.radPerks[idx].status;
            radPerks[idx].baseCost = data.radPerks[idx].baseCost;
          }
          if (idx == 7) {
            radPerks[idx].max = data.radPerks[idx].max;
            radPerks[idx].perkStatus = data.radPerks[idx].perkStatus;
          }
          if (idx == 10) {
            radPerks[idx].max = data.radPerks[idx].max;
            radPerks[idx].status = data.radPerks[idx].status;
          }
        }
      }
      if (data.infGoals) {
        for (let idx in data.infGoals) {
          goals.value[idx].tier = data.infGoals[idx].tier;
        }
      }
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

const resetInf = () => {
  if(hero.value.infProgress == false){
    hero.value.infProgress = true;
    hero.value.infTier -= 1;
  }
  
}

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

.infinity-glow {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  line-height: 20px;
}

</style>
