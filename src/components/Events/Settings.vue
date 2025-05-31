<template>
  <div class="settings-wrapper">
    <div class="settings-panel">
      <h2>⚙️ Settings</h2>

      <button @click="saveGame">💾 Save</button>
      <button @click="exportGame">📤 Export</button>
      <button @click="triggerFileInput">📥 Import</button>
      <input type="file" ref="fileInput" accept=".json, .enc" style="display: none" />
      <button @click="resetGame">🧹 Reset</button>
      <button v-if="hero.infTier > 0" @click="resetInf">
        <span class="infinity-glow">∞</span> Reset Infinity
      </button>

      <div class="settings-panel-popup">
        <div class="setting-item toggle">
          <label class="switch-label">
            <span>Popup AFK</span>
            <ToggleSwitch v-model="hero.showAfkPopupRule" />
          </label>
        </div>
      </div>
      <div class="settings-panel-gcnp">
        <div class="setting-item toggle">
          <label class="switch-label">
            <span>Off/On GCNP after Ascension/Rebirth/Infinity</span>
            <ToggleSwitch v-model="hero.gcnpSetting" />
          </label>
        </div>
      </div>
      <div class="settings-panel-gcnp" v-if="hero.ascensionAutoUnlock">
        <div class="setting-item toggle">
          <label class="switch-label">
            <span>Ascension Auto-Buyer</span>
            <ToggleSwitch v-model="hero.ascensionAuto" />
          </label>
        </div>
      </div>
    </div>
    <div class="auto-panel-wrapper">
      <div class="auto-panel" if="hero.mainInfTier >= 2">
        <h3>🌌 Auto Ascension</h3>
        <label>
          Min Shards:
          <input type="number" v-model.number="auto.ascension.minShards" />
        </label>
        <label>
          Min Stage:
          <input type="number" v-model.number="auto.ascension.minStage" />
        </label>
      </div>

      <div class="auto-panel" if="hero.mainInfTier >= 3">
        <h3>♻️ Auto Rebirth</h3>
        <label>
          Min Rebirth Pts:
          <input type="number" v-model.number="auto.rebirth.minPts" />
        </label>
        <label>
          Min Level:
          <input type="number" v-model.number="auto.rebirth.minLevel" />
        </label>
        <label>
          Level +:
          <input type="number" v-model.number="auto.rebirth.minLevelNext" />
        </label>
      </div>

      <div class="auto-panel" if="hero.mainInfTier >= 1">
        <h3>⚔️ Stop at Stage</h3>
        <label>
          Stage to Stop:
          <input type="number" v-model.number="auto.stop.stage" />
        </label>
        <label>
          Stage +:
          <input type="number" v-model.number="auto.stop.stageNext" />
        </label>
        <label>
          Stop Until Kills:
          <input type="number" v-model.number="auto.stop.untilKills" />
        </label>
      </div>
    </div>
  </div>
  <div class="settings-wrapper">
    <div class="afk-wrapper" v-if="dimensions[7].infTier == dimensions[7].maxInfTier">
        <h3>🕒 AFK Reward</h3>

        <div class="afk-bar-container">
          <div class="afk-bar" :style="{ width: `${afkPercent}%` }"></div>
          <span class="afk-time">{{ formatTime(Math.floor(hero.afkTimer)) }}</span>
        </div>

        <div class="afk-controls">
          <label for="afkPercentInput">Use %:</label>
          <input
            id="afkPercentInput"
            type="number"
            v-model.number="hero.afkSpendPercent"
            min="1"
            max="100"
          />
          <button @click="useAfkTime">Use</button>
        </div>
    </div>
    <div class="stage-wrapper" v-if="dimensions[3].infTier == dimensions[3].maxInfTier">
        <h2>🌍 Stage Travel</h2>
        <div class="stage-input-group">
          <input
            type="number"
            v-model.number="targetStage"
            :max="hero.maxStage"
          />
          <button @click="travelToStage">Travel</button>
        </div>
    </div>
  </div>
  
</template>

<script setup>
import { computed } from 'vue';
import { useHero } from "../../composables/useHero.js";
import { useEnemy } from "../../composables/useEnemy.js";
import { perks } from "../../data/perks.js";
import { perks as ascension } from "../../data/ascension.js";
import { useBuff } from "../../data/buffs.js";
import { amulets } from "../../data/amulets.js";
import { cursed } from "../../data/cursed.js";
import { perks as radPerks } from "../../data/radPerks.js";
import { spEnemy as space } from "../../data/spaceEnemy.js";
import { goals } from "../../data/infGoals.js";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { auto } from "../../composables/autoProgression.js";
import { dimensions } from "../../data/dimensions.js";
import CryptoJS from "crypto-js";
import ToggleSwitch from '../ToggleSwitch.vue';

const D_RULE = "Only one must exist";

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const isDarkTheme = ref(localStorage.getItem("theme") === "dark");

function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
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
    infGoals: goals.value,
    auto: auto.value,
    dimensions: dimensions.value
  };
  localStorage.setItem("gameSave", JSON.stringify(saveData));
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
    goals: goals.value,
    auto: auto.value,
    dimensions: dimensions.value
  };
  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(json, D_RULE).toString();

  const blob = new Blob([encrypted], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "savegame.enc";
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
        const decrypted = CryptoJS.AES.decrypt(raw, D_RULE).toString(
          CryptoJS.enc.Utf8
        );
        data = JSON.parse(decrypted);
      } catch (err) {
        try {
          data = JSON.parse(raw);
        } catch (jsonErr) {
          alert("Unable to load file: corrupted or invalid format");
          return;
        }
      }

      if (data.hero) deepMerge(hero.value, data.hero);

      if(hero.value.mainInfTier == 0)
        hero.value.mainInfTier = hero.value.infTier

      if (data.enemy) deepMerge(enemy.value, data.enemy);
      if (data.perks) {
        for (let idx in data.perks) {
          const perkData = data.perks[idx];
          const targetPerk = perks.value[idx];
          if (!perkData || !targetPerk) continue;
          targetPerk.level = perkData.level;
          if ("status" in perkData) targetPerk.status = perkData.status;
          if ("infStatus" in perkData)
            targetPerk.infStatus = perkData.infStatus;
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
          if (cursed[idx].status !== "undefined")
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
          goals.value[idx].tier = Math.min(data.infGoals[idx].tier, data.infGoals[idx].maxTier);
        }
      }

      if(data.auto) deepMerge(auto.value, data.auto);

      if(data.dimensions) {
        for (let idx in data.dimensions){
          dimensions.value[idx].infTier = data.dimensions[idx].infTier;
          if(idx == 1)
            dimensions.value[idx].ascension = data.dimensions[idx].ascension;
        }
      }
    };

    reader.readAsText(file);
  };

  input.click();
};

const resetGame = () => {
  if (confirm("Are you sure you want to reset all progress?")) {
    localStorage.removeItem("gameSave");
    location.reload();
  }
};

const resetInf = () => {
  if (hero.value.infProgress == false) {
    hero.value.infProgress = true;
    hero.value.infTier -= 1;
  }
};


const afkPercent = computed(() => (hero.value.afkTimer / hero.value.afkMaxTimer) * 100);

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s - (${Math.floor((seconds / hero.value.afkMaxTimer)*100)}%)`;
}

function useAfkTime() {
  const percent = Math.min(Math.max(hero.value.afkSpendPercent, 0), 100);
  const usedTime = Math.floor((hero.value.afkMaxTimer * Math.min(percent, (hero.value.afkTimer / hero.value.afkMaxTimer) * 100)) / 100);
  hero.value.afkTimer -= usedTime;
  
  let maxKill = hero.value.maxStage * 75;

  let div = hero.value.enemyAfkHp * (usedTime ** 0.1) - hero.value.attack;
  hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (hero.value.enemyAfkHp * (usedTime ** 0.1))) * usedTime: usedTime, maxKill);
  hero.value.afkTime = usedTime;
  hero.value.afkLocked = true;
}

const targetStage = ref(1)
function travelToStage() {
  targetStage.value = Math.max(Math.min(targetStage.value, hero.value.maxStage), 1);

  hero.value.stage = targetStage.value;
  hero.value.travellPenalty = 4;
  hero.value.isTravell = true;
}

</script>

<style scoped>
.settings-wrapper {
  display: flex;
}

.settings-panel {
  background-color: #1e293b;
  color: #fff;
  padding: 1rem;
  width: 400px;
  font-family: "Segoe UI", sans-serif;
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

.settings-panel-popup {
  background-color: #1e293b;
  color: #fff;
  padding: 1px;
  font-family: "Segoe UI", sans-serif;
}

.settings-panel-gcnp {
  background-color: #1e293b;
  color: #fff;
  padding: 1px;
  font-family: "Segoe UI", sans-serif;
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

.settings-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.settings-card {
  background-color: var(--bg-panel, #1e1e2f);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: var(--accent, #0ff);
}

.switch-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
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
  background-color: #ccc;
  border-radius: 22px;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #00ffff;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group input {
  width: 80px;
  padding: 4px;
  background: #111827;
  color: #fff;
  border: 1px solid #444;
  border-radius: 6px;
}

.stop-stage-card {
  border: 1px solid #ff5e5e;
  box-shadow: 0 0 8px rgba(255, 50, 50, 0.4);
}

.auto-panel-wrapper {
  flex-direction: column;
  background-color: #1e293b;
  padding: 8px;
}

.auto-panel {
  background: rgba(30, 30, 50, 0.95);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #444;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 14px;
}

.auto-panel h3 {
  font-size: 15px;
  margin-bottom: 8px;
  color: #ffd700;
}

.auto-panel label {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

.auto-panel input {
  width: 80px;
  background: #222;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  padding: 2px 6px;
}



.afk-wrapper {
  background: #1e293b;
  padding: 16px;
  color: #eee;
  width: 400px;
  font-family: "Consolas", monospace;
}

.afk-bar-container {
  background: #333;
  border-radius: 8px;
  height: 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
}

.afk-bar {
  height: 100%;
  background: linear-gradient(to right, #00ffcc, #0099ff);
  transition: width 0.4s ease;
}

.afk-time {
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
  text-shadow: 0 0 4px #000;
}

.afk-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.afk-controls input {
  width: 60px;
  padding: 4px;
  border: 1px solid #666;
  border-radius: 4px;
  background: #222;
  color: #fff;
}

.afk-controls button {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

.afk-controls button:hover {
  background: #218838;
}



.stage-wrapper {
  background: #1e293b;
  padding: 16px;
  max-width: 400px;
  color: #eee;
  text-align: center;
}

.stage-input-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}

.stage-input-group input {
  padding: 8px;
  border: none;
  border-radius: 6px;
  width: 100px;
  background: #333;
  color: #fff;
}

.stage-input-group button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.stage-input-group button:hover {
  background: #66bb6a;
}

</style>
