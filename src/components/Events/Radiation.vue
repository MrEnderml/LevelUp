<template>
  <div class="radiation-panel">
    <div class="mutation-chances">
      <h2>
        <span @click="hero.eLink = { set: 'Info', info: 'Radiation' }"><sup style="font-size: 12px">ℹ️</sup>Mutagen(M):</span>
        <span @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Mutagen' }"><sup style="font-size: 12px">ℹ️</sup>{{hero.mutagen > 1e5? 1e5: Math.floor(hero.mutagen)}}</span>
      </h2>  
      <ul>
        <li
          v-for="(mutation, idx) in hero.mutation"
          :key="mutation.type"
          class="mutation"
        >
          <span class="glow"> Mutation [T{{idx+1}}]</span> — {{ mutation.chance.toFixed(1) }}%
        </li>
      </ul>
      <div v-if="perks[10].level > 0" class="danger-wrapper">
        <div @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Danger' }">
          <sup style="font-size: 12px">ℹ️</sup>DANGER: [{{perks[10].level}}]
        </div> 
        <p>Enemy Power: [{{formatNumber(enemy.enemyPower, true)}}]</p>
      </div>
      <div class="tab-buttons">
        <button :class="{ active: activeTab === 'perks' }" @click="activeTab = 'perks'">🧬 Radiation Perks</button>
        <button :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'" :disabled="perks[10].level < 1">💀 Danger</button>
      </div>
    </div>

   

    <div v-if="activeTab === 'perks'" class="radiation-perks">
      <h2>🧬 Radiation Perks
        <button style="font-size: 14px;" v-if="hero.mainInfTier >= 4" @click="upAll">
        Upgrade All (Except Danger)
        </button>
        <Tooltip :text="() => `Reset Danger. You won't get mutagens back`">
          <button v-if="hero.mainInfTier >= 4" style="font-size: 14px; margin-left: 6px;" @click="dReset">
            R
          </button>
        </Tooltip>
        
      </h2>
      <div class="perks-scroll">
        <div class="perks-grid">
          <div
            v-for="perk in perks"
            :key="perk.id"
            class="perk"
            :style="{ animationDelay: `${perk.id * 0.1}s` }"
          >
            <h3>{{ perk.name }}</h3>
            <p class="perk-description">{{ perk.description }}</p>
            <small class="perk-level">Lvl: {{ perk.level }} / {{ perk.max }}</small>
            <button
              :disabled="perk.level >= perk.max"
              @click="upgradePerk(perk)"
              @mousedown="startAutoUpgrade(perk)"
              @mouseup="stopAutoUpgrade"
              @mouseleave="stopAutoUpgrade"
            >
              Upgrade ({{ getCost(perk) }}M)
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'info'" class="radiation-wrapper">
      <div class="row">
        <span style="color: orange" class="label">Space Boss [T{{Math.floor(hero.spCount / 6) + 1}}]</span>
        <span class="value">{{ (enemy.spaceBossChance).toFixed(2) }}%</span>
      </div>

      <div v-if="perks[10].level >= 10" class="row">
        <span class="label">Souls Chance</span>
        <span class="value">*{{ formatNumber(enemy.dangerEnemyChance[0]) }}</span>
      </div>

      <div v-if="perks[10].level >= 20" class="row">
        <span class="label">Ascension Souls (Shards MULT)</span>
        <span class="value">*{{ formatNumber(enemy.dangerEnemyChance[4], true) }}</span>
      </div>

      <p style="color: gold" class="section-title">Infinity Creatures</p>

      <div class="row" v-if="hero.infTier >= 4">
        <span class="label">Ω-Infinity [{{enemy.dangerEnemyLoot[0]}} / 60]</span>
        <span class="value">
          <template v-if="enemy.danger < 100">Reach Danger 100</template>
          <template v-else>{{ Math.min(enemy.dangerEnemyChance[1], 100).toFixed(2) }}%</template>
        </span>
      </div>

      <div class="row" v-if="hero.infTier >= 4">
        <span class="label">Mirror of the Infinity [{{enemy.dangerEnemyLoot[1]}} / 1000]</span>
        <span class="value">
          <template v-if="enemy.danger < 150">Reach Danger 150</template>
          <template v-else>{{ Math.min(enemy.dangerEnemyChance[2], 100).toFixed(2) }}%</template>
        </span>
      </div>

      <div class="row" v-if="hero.infTier >= 4">
        <span class="label">The Infinite One [{{enemy.dangerEnemyLoot[2]}} / 5]</span>
        <span class="value">
          <template v-if="enemy.danger < 200">Reach Danger 200</template>
          <template v-else>{{ Math.min(enemy.dangerEnemyChance[3], 100).toFixed(2) }}%</template>
        </span>
      </div>

      <p class="section-title" v-if="dimensions[15].infTier == dimensions[15].maxInfTier">Dimension Creatures</p>

      <template v-if="dimensions[15].infTier == dimensions[15].maxInfTier">
        <div class="row">
          <span class="label">Twisted Rootspawn [{{enemy.dEnemyLoot[0]}} / 200]</span>
          <span class="value">
            <template v-if="enemy.danger < 400">Reach Danger 400</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[0], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <span class="label">Voidpulse Entity [{{enemy.dEnemyLoot[1]}} / 50]</span>
          <span class="value">
            <template v-if="enemy.danger < 550">Reach Danger 550</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[1], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <span class="label">Fracture Beast [{{enemy.dEnemyLoot[2]}} / 5]</span>
          <span class="value">
            <template v-if="enemy.danger < 600">Reach Danger 600</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[2], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <span class="label">Clot of Dark Energy [{{enemy.dEnemyLoot[3]}} / 90]</span>
          <span class="value">
            <template v-if="enemy.danger < 400">Reach Danger 400</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[3], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <span class="label">Infinitron Prime [{{enemy.dEnemyLoot[4]}} / 25]</span>
          <span class="value">
            <template v-if="enemy.danger < 600">Reach Danger 600</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[4], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <span class="label">Entropy Reaver [{{enemy.dEnemyLoot[5]}} / 5]</span>
          <span class="value">
            <template v-if="enemy.danger < 700">Reach Danger 700</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[5], 100).toFixed(2) }}%</template>
          </span>
        </div>
      </template>

  
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { perks as rawPerks } from '../../data/radPerks.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { dimensions } from '../../data/dimensions.js';

const perks = reactive([...rawPerks]);
const { hero } = useHero();
const { enemy } = useEnemy();

const activeTab = ref('perks');


const getCost = (perk) => {
  return perk.baseCost + (perk.level * perk.costPerLevel);
};

function upAll(){
  for(let perk of perks){
    while(perk.level < perk.max && getCost(perk) <= hero.value.mutagen){
      if(perk.id == 11) break;
      hero.value.mutagen -= getCost(perk);
      perk.level++;

      if (perk.id == 7 && !perk.status){
          perk.level = 0;
          perk.max = 30 + (hero.value.infTier >= 4? 30: 0);
          perk.baseCost = 10;
          perk.status = true;
      }    
    }
  }
}

function dReset(){
  rawPerks[10].level = 0;
}

function upgradePerk(perk) {
  if (perk.level < perk.max && getCost(perk) <= hero.value.mutagen) {  
    
    hero.value.mutagen -= getCost(perk);
    perk.level++;

    if (perk.id == 7 && !perk.status){
      perk.level = 0;
      perk.max = 30;
      perk.baseCost = 10;
      perk.status = true;
    }    
  }
}

let intervalId = null;
let holdTimeout = null;

function startAutoUpgrade(perk) {
  
  holdTimeout = setTimeout(() => {
    intervalId = setInterval(() => {
      if (hero.value.dId == 'main' || hero.value.dId !== 'main' && hero.value.level < 700) {
        upgradePerk(perk);
      } else {
        clearInterval(intervalId);
      }
    }, 10);
  }, 500);
}

function stopAutoUpgrade() {
  clearTimeout(holdTimeout);
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  holdTimeout = null;
}

const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.radiation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 900px;
  gap: 1rem;
  font-family: 'Share Tech Mono', monospace;
  background: radial-gradient(circle at center, #0a0f0a, #0b0b12);
  padding: 1rem;
  color: #d4ff00;
  box-sizing: border-box;
  overflow: hidden;
  margin-left: 120px;
}

@media (min-width: 768px) {
  .radiation-panel {
    flex-direction: row;
  }

  .mutation-chances {
    flex: 3;
  }

  .radiation-perks, .radiation-wrapper {
    flex: 7;
  }
}

.mutation-chances,
.radiation-perks {
  background: rgba(0, 255, 0, 0.05);
  border: 2px solid #66ff66;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.radiation-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid #66ff66;
  border-radius: 12px;
  padding: 1rem;
  color: #e0e0ff;
  flex: 7;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  overflow-y: auto;
}

.radiation-wrapper .section-title {
  font-size: 1.1rem;
  color: #ff99ff;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 6px #aa00aa;
}

.radiation-wrapper .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #9992;
  padding: 4px 0;
}

.radiation-wrapper .label {
  color: #ccccff;
  font-size: 0.95rem;
}

.radiation-wrapper .value {
  color: #d4ff00;
  font-weight: bold;
  font-size: 0.95rem;
  text-shadow: 0 0 4px #88ff88;
}


.mutation {
  padding: 0.25rem 0;
  font-size: 1rem;
  list-style: none;
}

.glow {
  color: #b6ff00;
  text-shadow: 0 0 4px #b6ff00, 0 0 8px #88ff88;
}

.perk-description {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.perks-scroll {
  max-height: 66vh;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgb(29, 252, 0) transparent;
}

.perks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.perks {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: flex-start;
}

.perk-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 170px; /* ширина одной "колонки" из двух перков */
  flex-shrink: 0;
}

.perk {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid #aaffaa;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.85rem;
  animation: fadeInUp 0.4s ease-out both;
  width: 220px;
  height: 200px;
  min-width: 220px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  background: #b6ff00;
  color: black;
  font-weight: bold;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
button:hover {
  background: #dfff00;
}

/* Анимация появления */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .perks {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .perk {
    font-size: 0.8rem;
  }
}

.perk-level {
  font-size: 0.75rem;
  color: #99ff99;
  display: block;
  margin-top: 0.25rem;
}


.tooltip {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1c1917;
  color: #fef2f2;
  padding: 0.8rem;
  border-radius: 0.5rem;
  width: 220px;
  font-size: 0.85rem;
  text-align: left;
  z-index: 10000000;
  box-shadow: 0 0 10px #66ff66;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
}


.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.info-button {
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  color: #fee2e2;
  transition: transform 0.2s;
}

.info-button:hover {
  transform: scale(1.2);
}

.danger-wrapper {
  max-width: 250px;
  overflow: auto;
  max-height: 400px;
  overflow-x: hidden;
  font-size: 14px;
}


.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

.tab-buttons button {
  flex: 1;
  padding: 6px 12px;
  font-family: 'Share Tech Mono', monospace;
  background: #111;
  color: #b6ff00;
  border: 1px solid #66ff66;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.tab-buttons button.active {
  background: #b6ff00;
  color: #111;
  font-weight: bold;
}


</style>
