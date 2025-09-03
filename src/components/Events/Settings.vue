<template>
  <div class="settings-wrapper">
    <div class="settings-panel">
      <h2>⚙️ Settings</h2>

      <div class="actions">
        <button class="btn" @click="saveGame">💾 Save</button>
        <button class="btn" @click="exportGame">📤 Export</button>
        <button class="btn" @click="triggerFileInput">📥 Import</button>
        <input type="file" ref="fileInput" accept=".json, .enc" style="display: none" />
        <button class="btn danger" @click="resetGame">🧹 Reset</button>
        <button v-if="hero.mainInfTier >= 6" class="btn infinity" @click="resetInf">
          <span class="infinity-glow">∞</span> Reset Infinity
        </button>
      </div>

      <div class="toggles">
        <div class="setting-item">
          <span>AFK Reminder</span>
          <div 
            class="chip" 
            :class="{ active: hero.showAfkPopupRule }" 
            @click="hero.showAfkPopupRule = !hero.showAfkPopupRule"
          >
            {{ hero.showAfkPopupRule ? 'ON' : 'OFF' }}
          </div>
        </div>

        <div class="setting-item">
          <span>Idle System (On after Reset)</span>
          <div 
            class="chip" 
            :class="{ active: hero.gcnpSetting }" 
            @click="hero.gcnpSetting = !hero.gcnpSetting"
          >
            {{ hero.gcnpSetting ? 'Enabled' : 'Disabled' }}
          </div>
        </div>

        <div class="setting-item" v-if="hero.ascensionAutoUnlock">
          <span>Auto-Perk Buyer [Ascension]</span>
          <div 
            class="chip" 
            :class="{ active: hero.ascensionAuto }" 
            @click="hero.ascensionAuto = !hero.ascensionAuto"
          >
            {{ hero.ascensionAuto ? 'ON' : 'OFF' }}
          </div>
        </div>

        <div class="setting-item">
          <span>Safety Check </span>
          <div 
            class="chip" 
            :class="{ active: hero.eventDoubleClick }" 
            @click="hero.eventDoubleClick = !hero.eventDoubleClick"
          >
            {{ hero.eventDoubleClick ? 'ON' : 'OFF' }}
          </div>
        </div>

        <div class="setting-item">
          <span>Attack Display</span>
          <div class="chip-group">
            <div 
              class="chip" 
              :class="{ active: hero.averageAttack.status === 0 }" 
              @click="hero.averageAttack.status = 0"
            >
              🎯 Avg
            </div>
            <div 
              class="chip" 
              :class="{ active: hero.averageAttack.status === 1 }" 
              @click="hero.averageAttack.status = 1"
            >
              ⚔️ Current
            </div>
          </div>
        </div>

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
import { killHistory } from "../../composables/afkHandle.js";
import { spaceShop } from "../../data/spaceShop.js";
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
    dimensions: dimensions.value,
    hKill: killHistory,
    spaceShop: spaceShop.value,
  };
  localStorage.setItem("gameSave", JSON.stringify(saveData));
  localStorage.setItem('lastOnline', Date.now().toString());
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
    infGoals: goals.value,
    auto: auto.value,
    dimensions: dimensions.value,
    hKill: killHistory,
    spaceShop: spaceShop.value,
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

const triggerFileInputOld = () => {
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

      
    };

    reader.readAsText(file);
  };

  input.click();
};

const triggerFileInput = () => {
  const input = fileInput.value;
  if (!input) return;

  input.value = "";

  const handleChange = (event) => {
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
          perks.value[idx].block = data.perks[idx].block;
          const perkData = data.perks[idx];
          const targetPerk = perks.value[idx];

          if (!perkData || !targetPerk) continue;
          targetPerk.level = perkData.level;
          if ("status" in perkData) targetPerk.status = perkData.status;

          if (targetPerk.infStatus != undefined) {
            targetPerk.infStatus = perkData.infStatus;
        }
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
          if (ascension[idx].infStatus !== undefined)
            ascension[idx].infStatus = data.ascension[idx].infStatus
        }
      }
      if (data.space) {
        for (let idx in data.space) {
          if(idx%6 == 5)
            space[idx].status = data.space[idx].status;
          else 
            space[idx].status = true;
        }
      }
      if (data.buffs) {
        for (let idx in data.buffs) {
          buffs.value[idx].exp = data.buffs[idx].exp;
          buffs.value[idx].tier = data.buffs[idx].tier;
          buffs.value[idx].maxTier = data.buffs[idx].maxTier;
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
          if(idx > 41) break;
          
          if(idx > 23 && !hero.value.newUpdateChanges.dimensions){
            hero.value.newUpdateChanges.dimensions = true;
            break;
          }

          dimensions.value[idx].infTier = data.dimensions[idx].infTier;
          if(idx == 1)
            dimensions.value[idx].ascension = data.dimensions[idx].ascension;
        }
      }

      if (data.hKill?.length) {
        killHistory.splice(0, killHistory.length, ...data.hKill);
      }

      if (data.spaceShop)
        for(let idx in data.spaceShop)
          spaceShop.value[idx].status = data.spaceShop[idx].status;
    };

    reader.readAsText(file);

    input.removeEventListener("change", handleChange);
  };

  input.addEventListener("change", handleChange);
  input.click();
};



const resetGame = () => {
  if (confirm("Are you sure you want to reset all progress?")) {
    localStorage.removeItem("gameSave");
    location.reload();
  }
};

const resetInf = () => {
  if (hero.value.infProgress == false && hero.value.dId == 'main') {
    hero.value.infProgress = true;
  }
};

</script>

<style scoped>

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

.settings-panel {
  padding: 16px;
  background: var(--panel-bg, #1e1e2e);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Кнопки действий */
.btn {
  background: #2a2a3d;
  color: #fff;
  padding: 6px 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}
.btn:hover {
  background: #3a3a4f;
  transform: scale(1.05);
}
.btn:active {
  transform: scale(0.95);
}
.btn.danger {
  background: #7a1f1f;
}
.btn.danger:hover {
  background: #9e2a2a;
}
.btn.infinity {
  background: #2d1f7a;
}
.infinity-glow {
  color: #ffd700;
  text-shadow: 0 0 6px #ffea70;
}

/* Переключатели-чипы */
.toggles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chip {
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid #666;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  min-width: 70px;
  text-align: center;
}
.chip.active {
  background: linear-gradient(90deg, #6a5acd, #00c6ff);
  border: none;
  color: white;
  font-weight: 600;
}

.chip-group {
  display: flex;
  gap: 8px;
}

.chip-group .chip {
  min-width: 60px;
}


</style>
