<template>
  <div class="radiation-panel">
    <div class="mutation-chances">
      <h2>
        <span @click="hero.eLink = { set: 'Info', info: 'Radiation' }"><sup style="font-size: 12px">ℹ️</sup>Mutagen:</span>
        <span @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Mutagen' }"><sup style="font-size: 12px">ℹ️</sup>{{formatNumber(hero.mutagen)}}</span>
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
        <button style="font-size: 14px;" v-if="hero.mainInfTier >= 4 || hero.infEvents >= 4" @click="upAll">
        Upgrade All (Except Danger)
        </button>
        <Tooltip :text="() => `Reset Danger. You won't get mutagens back`">
          <button style="font-size: 14px; margin-left: 6px;" @click="dReset">
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
            <Tooltip :text="quasarCoreDangerHandle(perk)" boxShadow="0 0 10px #00ffea">
              <button
                class="btn-up"
                :disabled="perk.level >= perk.max"
                @click="upgradePerk(perk)"
                @mousedown="startAutoUpgrade(perk, $event)"
                @mouseup="stopAutoUpgrade"
                @mouseleave="stopAutoUpgrade"
                @mouseenter="isHovering = true"
              >
                {{ getCostShow(perk) }}
              </button>
            </Tooltip>
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

      <p style="color: gold" class="section-title" v-if="hero.infTier >= 4">Infinity Creatures</p>

      <div class="row" v-if="hero.mainInfTier >= 4">
        <Tooltip :text="creaturesHandle('Ω-Infinity')" position="right" boxShadow="0 0 10px gold">
          <span class="label">Ω-Infinity [{{enemy.dangerEnemyLoot[0]}} / 60]</span>
        </Tooltip>
        <span class="value">
          <template v-if="enemy.danger < 100">Reach Danger 100</template>
          <template v-else>{{ Math.min(enemy.dangerEnemyChance[1], 100).toFixed(2) }}%</template>
        </span>
      </div>

      <div class="row" v-if="hero.infTier >= 4 || hero.infEvents >= 4">
        <Tooltip :text="creaturesHandle('Mirror of the Infinity')" position="right" boxShadow="0 0 10px gold">
          <span class="label">Mirror of the Infinity [{{enemy.dangerEnemyLoot[1]}} / 1000]</span>
        </Tooltip>
        <span class="value">
          <template v-if="enemy.danger < 150">Reach Danger 150</template>
          <template v-else>{{ Math.min(enemy.dangerEnemyChance[2], 100).toFixed(2) }}%</template>
        </span>
      </div>

      <div class="row" v-if="hero.infTier >= 4">
        <Tooltip :text="creaturesHandle('The Infinite One')" position="right" boxShadow="0 0 10px gold">
          <span class="label">The Infinite One [{{enemy.dangerEnemyLoot[2]}} / 5]</span>
        </Tooltip>
        <span class="value">
          <template v-if="enemy.danger < 200">Reach Danger 200</template>
          <template v-else>{{ Math.min(enemy.dangerEnemyChance[3], 100).toFixed(2) }}%</template>
        </span>
      </div>

      <p class="section-title" v-if="dimensions[15].infTier == dimensions[15].maxInfTier">Dimension Creatures</p>

      <template v-if="dimensions[15].infTier == dimensions[15].maxInfTier">

        <div class="row">
          <Tooltip :text="creaturesHandle('Twisted Rootspawn')" position="right" boxShadow="0 0 10px #ff99ff">
            <span class="label">Twisted Rootspawn [{{enemy.dEnemyLoot[0]}} / 200]</span>
          </Tooltip>
          <span class="value">
            <template v-if="enemy.danger < 400">Reach Danger 400</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[0], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <Tooltip :text="creaturesHandle('Voidpulse Entity')" position="right" boxShadow="0 0 10px #ff99ff">
            <span class="label">Voidpulse Entity [{{enemy.dEnemyLoot[1]}} / 50]</span>
          </Tooltip>
          <span class="value">
            <template v-if="enemy.danger < 550">Reach Danger 550</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[1], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <Tooltip :text="creaturesHandle('Fracture Beast')" position="right" boxShadow="0 0 10px #ff99ff">
            <span class="label">Fracture Beast [{{enemy.dEnemyLoot[2]}} / 5]</span>
          </Tooltip>
          <span class="value">
            <template v-if="enemy.danger < 600">Reach Danger 600</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[2], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <Tooltip :text="creaturesHandle('Clot of Dark Energy')" position="right" boxShadow="0 0 10px #ff99ff">
            <span class="label">Clot of Dark Energy [{{enemy.dEnemyLoot[3]}} / 90]</span>
          </Tooltip>
          <span class="value">
            <template v-if="enemy.danger < 400">Reach Danger 400</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[3], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <Tooltip :text="creaturesHandle('Infinitron Prime')" position="right" boxShadow="0 0 10px #ff99ff">
            <span class="label">Infinitron Prime [{{enemy.dEnemyLoot[4]}} / 25]</span>
          </Tooltip>
          <span class="value">
            <template v-if="enemy.danger < 600">Reach Danger 600</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[4], 100).toFixed(2) }}%</template>
          </span>
        </div>

        <div class="row">
          <Tooltip :text="creaturesHandle('Entropy Reaver')" position="right" boxShadow="0 0 10px #ff99ff">
            <span class="label">Entropy Reaver [{{enemy.dEnemyLoot[5]}} / 5]</span>
          </Tooltip>
          <span class="value">
            <template v-if="enemy.danger < 700">Reach Danger 700</template>
            <template v-else>{{ Math.min(enemy.dEnemyChance[5], 100).toFixed(2) }}%</template>
          </span>
        </div>

      </template>

      <p style="color: #f36e6e" class="section-title" v-if="dimensions[31].infTier > 0">Creatures from Dark Dimensions</p>

      <div class="row" v-if="enemy.darkEnemyReq[0]">
        <Tooltip :text="creaturesHandle('Dreadfang')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Dreadfang [{{enemy.darkEnemyLoot[0]}} / {{enemy.darkEnemyCap[0]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[0], 100).toFixed(2) }}%
        </span>
      </div>

      <div class="row" v-if="enemy.darkEnemyReq[1]">
        <Tooltip :text="creaturesHandle('Voidborn Might')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Voidborn Might [{{enemy.darkEnemyLoot[1]}} / {{enemy.darkEnemyCap[1]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[1], 100).toFixed(2) }}%
        </span>
      </div>

      <div class="row" v-if="enemy.darkEnemyReq[2]">
        <Tooltip :text="creaturesHandle('Overseer Prime')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Overseer Prime [{{enemy.darkEnemyLoot[2]}} / {{enemy.darkEnemyCap[2]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[2], 100).toFixed(2) }}%
        </span>
      </div>

      <div class="row" v-if="enemy.darkEnemyReq[3]">
        <Tooltip :text="creaturesHandle('Baselurker')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Baselurker [{{enemy.darkEnemyLoot[3]}} / {{enemy.darkEnemyCap[3]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[3], 100).toFixed(2) }}%
        </span>
      </div>

      <div class="row" v-if="enemy.darkEnemyReq[4]">
        <Tooltip :text="creaturesHandle('Infinity Bane')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Infinity Bane [{{enemy.darkEnemyLoot[4]}} / {{enemy.darkEnemyCap[4]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[4], 100).toFixed(2) }}%
        </span>
      </div>

      <div class="row" v-if="enemy.darkEnemyReq[5]">
        <Tooltip :text="creaturesHandle('Crushdepth')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Crushdepth [{{enemy.darkEnemyLoot[5]}} / {{enemy.darkEnemyCap[5]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[5], 100).toFixed(2) }}%
        </span>
      </div>

      <div class="row" v-if="enemy.darkEnemyReq[6]">
        <Tooltip :text="creaturesHandle('Entropy Leech')" position="right" boxShadow="0 0 10px #f36e6e">
          <span class="label">Entropy Leech [{{enemy.darkEnemyLoot[6]}} / {{enemy.darkEnemyCap[6]}}]</span>
        </Tooltip>
        <span class="value">
          {{ Math.min(enemy.darkEnemyChance[6], 100).toFixed(2) }}%
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { perks as rawPerks } from '../../data/radPerks.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { dimensions } from '../../data/dimensions.js';
import { divineSkills } from '../../data/quasarCore.js';

const perks = reactive([...rawPerks]);
const { hero } = useHero();
const { enemy } = useEnemy();

const activeTab = ref('perks');


const getCostShow = (perk) => {
  if(perk.id == 13 && perk.level >= 200 && hero.value.selectedDivSkills.includes(4))
    return Math.floor(perk.baseCost + (perk.level * perk.costPerLevel * divineSkills.value[4].values[1]));

  if(hero.value.selectedDivSkills.includes(14)) return 'Locked';
  if(perk.id == 9 && hero.value.isSingularity && hero.value.singularity >= 3) return 'Locked'; 

  return `Upgrade (${perk.baseCost + (perk.level * perk.costPerLevel)} mut)`;
};

const getCost = (perk) => {
  if(perk.id == 13 && perk.level >= 200 && hero.value.selectedDivSkills.includes(4))
    return Math.floor(perk.baseCost + (perk.level * perk.costPerLevel * divineSkills.value[4].values[1]));

  return perk.baseCost + (perk.level * perk.costPerLevel);
};

function upAll(){
  if(hero.value.selectedDivSkills.includes(14)) return;

  for(let perk of perks){
    while(perk.level < perk.max && getCost(perk) <= hero.value.mutagen){
      if(perk.id == 11) break;
      if(perk.id == 9 && hero.value.isSingularity && hero.value.singularity >= 3) break;
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

function quasarCoreDangerHandle(perk) {
  if(perk.id != 11) return "";

  let str = ``;
  if(hero.value.selectedDivSkills.includes(7))
    str += `<span style='color: #00ffea'>Quasar Radiance</span>
    <span style='color: gold'>Stardust MULT</span>: ${(divineSkills.value[7].values[0]).toFixed(2)}
    
    `;
  
  str += `<span style='color: red'>Hero DMG: ${formatNumber(hero.value.attack)}</span>
  <span style='color: lightgreen'>Hero HP: ${formatNumber(hero.value.maxHp)}</span>

  <span style='color: lightgreen'>Enemy HP: ${formatNumber(enemy.value.maxHp)}</span>
  <span style='color: red'>Enemy DMG: ${formatNumber(enemy.value.attack)}</span>`

  return str;
}

function dReset(){
  if(hero.value.selectedDivSkills.includes(14)) return;

  rawPerks[10].level = 0;
}

function upgradePerk(perk) {
  if(hero.value.selectedDivSkills.includes(14)) return;
  if(perk.id == 9 && hero.value.isSingularity && hero.value.singularity >= 3) return;
  
  if (perk.level < perk.max && getCost(perk) <= hero.value.mutagen) {  
    
    let steps = 1 + Math.floor(perk.max/1000);

    for (let i = 0; i < steps; i++) {
      if (perk.level < perk.max && getCost(perk) <= hero.value.mutagen) {
        hero.value.mutagen -= getCost(perk);
        perk.level++;
      }
    }

    if (perk.id == 7 && !perk.status){
      perk.level = 0;
      perk.max = 30;
      perk.baseCost = 10;
      perk.status = true;
    }    
  }
}

let holdTimeout = null;
let intervalId = null;
const isHovering = ref(false);

function startAutoUpgrade(perk, event) {
  
  isHovering.value = true;

  holdTimeout = setTimeout(() => {
    intervalId = setInterval(() => {
      if (
          isHovering.value &&
          (hero.value.dId.startsWith('d-') && hero.value.level < 1400 ||
          hero.value.dId === "unlimitted" ||
          hero.value.dId === "d-danger" ||
          hero.value.dId === "main" ||
          (hero.value.dId !== "main" && hero.value.level < 700))
      ) {
        upgradePerk(perk);
      } else {
        stopAutoUpgrade();
      }
    }, 10);
  }, 250);
}

function stopAutoUpgrade() {
  clearTimeout(holdTimeout);
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  holdTimeout = null;
  isHovering.value = false;
}

function creaturesHandle(creature){
  switch(creature){
    case 'Ω-Infinity': 
          return `<span style="color:#9cedd2"> Requirement: Danger <span style="color:gold">100+</span>, Stage <span style="color:gold">60+</span>
          Dimension: main
          Reward: <span style="color:rgb(88, 255, 160)">+1 Potential</span></span>`
    case 'Mirror of the Infinity': 
          return `<span style="color:#9cedd2"> Requirement: Danger <span style="color:gold">100+</span>, Stage <span style="color:gold">65+</span>
          Dimension: main
          Reward: <span style="color:rgb(243, 218, 31)">+1 IP</span></span>`
    case 'The Infinite One': 
          return `<span style="color:#9cedd2"> Requirement: Danger <span style="color:gold">100+</span>, Stage <span style="color:gold">70+</span>
          Dimension: main
          Reward: <span style="color:rgb(255, 230, 88)">+1 STAR(ST)</span></span>`
    
    case 'Twisted Rootspawn': 
          return `<span style="color:#9cedd2"> Requirement: Danger <span style="color:gold">400+</span>, Stage <span style="color:gold">120+</span>
          Dimension: main
          Reward: <span style="color:rgb(88, 255, 107)">+1 Tree Point(TP)</span></span>`

    case 'Voidpulse Entity':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">400+</span>, Stage <span style="color:gold">140+</span>
          Dimension: main
          Reward: <span style="color:rgb(88,176,255)">+1 Space Power(SP)</span><br></span>`

    case 'Fracture Beast':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">600+</span>, Stage <span style="color:gold">135+</span>
          Dimension: main
          Reward: <span style="color:violet">+1 Dimension Shard(DS)</span><br></span>`

    case 'Clot of Dark Energy':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">400+</span>, Stage <span style="color:gold">120+</span>
          Dimension: main
          Reward: <span style="color:rgb(180,88,255)">Enemies are getting weaker by 1%</span><br></span>`

    case 'Infinitron Prime':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">600+</span>, Stage <span style="color:gold">145+</span>
          Dimension: main
          Reward: <span style="color:rgb(255,215,0)">+0.01 IP MULT</span><br></span>`

    case 'Entropy Reaver':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">700+</span>, Stage <span style="color:gold">150+</span>
          Dimension: main
          Reward: <span style="color:rgb(255, 200, 0)">+0.01 Inf Penalty Reduction</span><br></span>`
    
    case 'Dreadfang':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">1000+</span>, Stage <span style="color:gold">100+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:rgb(255, 200, 0)">+0.0075 Inf Penalty Reduction</span><br></span>`

    case 'Voidborn Might':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">1500+</span>, Stage <span style="color:gold">110+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:#ff69b4">+0.01 DMG MULT</span><br></span>`

    case 'Overseer Prime':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">2000+</span>, Stage <span style="color:gold">120+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:#00bfff">+0.01 Max Level MULT</span><br></span>`

    case 'Baselurker':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">2500+</span>, Stage <span style="color:gold">130+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:#7fff00">+1 Min Level</span><br></span>`

    case 'Infinity Bane':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">3000+</span>, Stage <span style="color:gold">140+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:#ff4500">+1 Potential</span><br></span>`

    case 'Crushdepth':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">3500+</span>, Stage <span style="color:gold">150+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:#ba55d3">+1 Dimension Shard (DS)</span><br></span>`

    case 'Entropy Leech':
          return `<span style="color:#9cedd2">Requirement: Danger <span style="color:gold">4000+</span>, Stage <span style="color:gold">160+</span>
          Dimension: [Ω VL-χtAR] [31]
          Reward: <span style="color:#1e90ff">+0.01 IP MULT</span><br></span>`


  }
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
  max-height: 550px;
  scrollbar-width: thin;
  scrollbar-color: rgb(29, 252, 0) transparent;
  overflow-x: hidden;
}

.radiation-wrapper .section-title, .d-section-title {
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
  height: 250px;
  min-width: 220px;
  min-height: 250px;
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

.tab-buttons > * {
  flex: 1;
}

.tab-buttons button {
  width: 100%;
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

.btn-up {
  width: 100%;
}

</style>
