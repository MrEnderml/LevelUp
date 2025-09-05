<template>
 
  <div class="equipment-wrapper">
    <div class="equipment-panel">
       <h2 @click="hero.eLink = { set: 'Info', info: 'Equipment' }"><sup style="font-size: 12px">ℹ️</sup>EQUIPMENT
        <span class="tooltip-container">ℹ️
          <span class="tooltip-text" v-if="heroComputed">
              Chance to drop the equipment:<br>
              <span>Sword[T{{heroComputed.equipmentTiers['sword'] + 1}}]: {{ heroComputed.dropChance['sword'].toFixed(2) }}% <span v-if="hero.spCount/6 < 4"> | [MAX: {{heroComputed.eqTierReq['sword']}}]</span></span><br>
              <span>Body[T{{heroComputed.equipmentTiers['armor'] + 1}}]: {{ heroComputed.dropChance['armor'].toFixed(2) }}% | [MAX: {{heroComputed.eqTierReq['armor']}}]</span><br>
              <span>Boots[T{{heroComputed.equipmentTiers['boots'] + 1}}]: {{ heroComputed.dropChance['boots'].toFixed(2) }}% | [MAX: {{heroComputed.eqTierReq['boots']}}]</span><br>
              <span v-if="heroComputed.eqTierReq['ring'] > 0">Ring[T{{heroComputed.equipmentTiers['ring'] + 1}}]: 
              {{ heroComputed.dropChance['ring'].toFixed(2) }}% | [MAX: {{heroComputed.eqTierReq['ring']}}]</span><br>
              <span>Collect the set to get a bonus: </span><br>
              <span v-if="hero.rebirthPts < 25">Reach 25 Rebirth Pts<br></span>
              <span v-else>(T3, T3, T3): +3 Min Level, +3 Max Level<br></span>
              <span v-if="hero.rebirthPts < 200">Reach 200 Rebirth Pts<br></span>
              <span v-else>(T4, T4, T4, T4): +4 Min Level, +4 Max Level<br></span>
              <span v-if="hero.rebirthPts < 4000">Reach 4000 Rebirth Pts<br></span>
              <span v-else>(T5, T5, T5, T5): +5 Min Level, +5 Max Level<br></span>
          </span>        
        </span>
      </h2>
      
      <div
        class="equipment-slot"
        v-for="item in equippedItems"
        :key="item.type"
        @click="setSelectedType(item.type)"
        :class="{ selected: selectedType === item.type }"
      >
        <div class="icon">{{ icons[item.type] }}</div>
        <div class="info">
          <p class="item-name" v-if="item.type != 'spRing'">{{ item.name }}[T{{ item.tier }}] <span v-if="hero.eqUps[item.type] > 0">(+{{hero.eqUps[item.type]}})</span>
            <span v-if="hero.awakened[item.type] > 0" class="awakened-txt">[{{hero.awakened[item.type]}}]</span>
            <Tooltip 
              :text="'Increase the enhance power of this weapon. Your enhances will be reset.'"
              position="left"
              boxShadow="0 0 10px rgba(100,255,204)"
            >
              <button v-if="awakenedTierReq(item.type)" @click="awakened(item.type)" class="awakened-button">⚡</button>
            </Tooltip>
          </p>
          <p class="item-name" v-if="item.type == 'spRing'">{{ item.name }}[T{{ item.tier }}] <span v-if="hero.eqUps[item.type] > 0">(+{{hero.eqUps[item.type]}})</span></p>
          <span class="stat">BM:+{{ item.bonusDisplay + Math.floor(hero.eqUpsMult[item.type].cap) }} Max Level</span>
          <span class="stat">AM:+{{ (item.ownProperty + hero.eqUpsMult[item.type].bonus).toFixed(2) }} {{ item.stat }}</span>
          <span class="stat" v-if="hero.spCount/6 >= 3 && item.type == 'sword'">S: +{{(hero.eqUpsMult['sword'].crit).toFixed(2)}} CRIT</span>
          <span class="stat" v-if="hero.spCount/6 >= 3 && item.type == 'sword'">P: +{{(hero.eqUpsMult['sword'].critDmg).toFixed(2)}} CRIT DMG</span>
          <span class="stat" v-if="hero.spCount/6 >= 6 && item.type == 'armor'">S: +{{(hero.eqUpsMult['armor'].def).toFixed(2)}} DEF</span>
          <span class="stat" v-if="hero.spCount/6 >= 6 && item.type == 'armor'">P: +{{(hero.eqUpsMult['armor'].heal).toFixed(2)}}% HEALING EFFECT</span>
          <span class="stat" v-if="hero.spCount/6 >= 7 && item.type == 'boots'">S: -{{(hero.eqUpsMult['boots'].stage).toFixed(2)}} Base stage requirement</span>
          <span class="stat" v-if="hero.spCount/6 >= 7 && item.type == 'boots'">P: +{{(hero.eqUpsMult['boots'].overkill).toFixed(2)}} Overkill</span>
          <span class="stat" v-if="hero.spCount/6 >= 8 && item.type == 'ring'">S: *{{(hero.eqUpsMult['ring'].level).toFixed(2)}} Level requirement</span>
          <span class="stat" v-if="hero.spCount/6 >= 8 && item.type == 'ring'">P: *{{(1 + hero.eqUpsMult['ring'].multLevel).toFixed(2)}} MULT Max Level</span>
          <span class="stat" v-if="spaceShop[10].status && item.type == 'spRing'">S: +{{(hero.eqUpsMult['spRing'].potential)}} Potential</span>
          <span class="stat" v-if="spaceShop[10].status && item.type == 'spRing'">P: +{{(hero.eqUpsMult['spRing'].infPoints)}} IP</span>
        </div>
      </div>
    </div>

    <div class="starforge-panel" v-if="hero.spCount >= 1">
    
      <Tooltip :text="() => getForgeTooltipText()">
        <h3>⭐ <sup style="font-size: 8px">ℹ️</sup>Star Forge <span>[T{{hero.forgeTier}}]</span></h3>
        <div class="forge-progress-bar" style="width: 250px; height: 10px; border-radius: 8px; background: #333; cursor: help;">
          <div
            class="forge-progress-fill"
            :style="{ width: globalProgressPercent + '%', height: '100%', borderRadius: '8px 0 0 8px', background: 'linear-gradient(to right, #facc15, #f97316)', transition: 'width 0.3s ease' }"
          ></div>
        </div>
      </Tooltip>

      <p @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Stardust' }">✨ <sup style="font-size: 12px">ℹ️</sup>Stardust: {{ formatNumber(hero.stardust) }} </p>
      <p v-if="hero.bhTier >= 2" class="auto-forge-info">
        <button
          @click="hero.isAutoForge = !hero.isAutoForge"
          :class="{ active: hero.isAutoForge }"
        >
          {{ hero.isAutoForge ? 'Auto Forge: ON' : 'Auto Forge: OFF' }}
        </button>
      </p>
      <p>Select equipment to enhance its power.</p>
      <div>{{capitalizeFirst(selectedType)}}</div>
      <div v-if="selectedType && hero.spCount >= eqUpsReq[selectedType]" class="forge-info">
        <p>
          Lvl: {{ hero.eqUps[selectedType] }}{{ getMaxEquipmentSuffix(selectedType) }}
        </p>
        <p v-if="hero.multEnchance > 0">Extra enhance: {{formatNumber(hero.multEnchance)}}%</p>
        <div style="display: flex; gap: 55px">
          <button
            @mousedown="startForge"
            @mouseup="stopForge"
            @mouseleave="stopForge"
            @click="forgeUpgrade">
              Enhance ✨{{totalCostShow()}}
          </button>
          <Tooltip :text="'Spend all your Stardust on your chosen weapon to enhance it to the maximum.'">
            <button @click="autoEnchance()">Max</button>
          </Tooltip>
        </div>
      </div>
      <div v-else-if="selectedType">You need {{eqUpsReqSp[selectedType]}} SP</div>
    </div>
  </div>

</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { equipment } from '../../data/equipment.js';
import { perks } from '../../data/ascension.js';
import { dimensions } from '../../data/dimensions.js';
import { spaceShop } from '../../data/spaceShop.js';

const { hero } = useHero();
const upgradeResult = ref('');
const heroComputed = computed(() => hero.value);
const selectedType = ref('');


function getForgeTooltipText() {
  const total = hero.value.totalEnhances || 0;
  const tier = (hero.value.forgeTier || 0) + 1;
  const req = hero.value.forgeTierReq || 50;
  const target = tier * req;
  const forgeBonusPercent = (selectedType.value == 'spRing' ? 0 : (tier - 1) * 1);
  let awakenedBonus = 0;

  let text = `Enhances: ${total}/${target}
  Enhancement Power [Forge Tier]: <span style="color: gold">${forgeBonusPercent.toFixed(2)}%</span>`;

  if (selectedType.value) {
    const awakenedTier = (hero.value.awakened[selectedType.value] || 0) + 1;
    const minVal = 0.0035;
    const maxVal = 0.1;
    const current = minVal * awakenedTier;

    awakenedBonus = Math.max(0, Math.min(100, ((current - minVal) / (maxVal - minVal)) * 100));

    text += `\nEnhancement Power [Awaken]: <span style="color: gold">${awakenedBonus.toFixed(2)}%</span>`;
  }

  const totalBonus = awakenedBonus + forgeBonusPercent;

  text += `
Total Enhancement Bonus: <span style="color: gold">[${totalBonus.toFixed(2)}%]</span><br>
- Base Modifier (BM): Each Enhance increases this modifier’s power by <span style="color: gold">[${10 + 10 * (totalBonus * 0.01).toFixed(2)}%]</span>.<br>
- Additional Modifier (AM):Each Enhance increases this modifier’s power by <span style="color: gold">[${5 + 5 * (totalBonus * 0.01).toFixed(2)}%]</span><br>
- Suffix and Prefix (S&P): Each Enhance increases these modifier’s power by <span style="color: gold">[${10 + 10 * (totalBonus * 0.01).toFixed(2)}%]</span>`;

  return text;
}


const globalProgressPercent = computed(() => {
  const total = hero.value.totalEnhances || 0;
  const req = hero.value.forgeTierReq || 50;
  return Math.min(100, (total % req) * 2);
});



const setSelectedType = (type) => {
  selectedType.value = type;
};

const icons = {
  sword: '⚔️',
  armor: '🧥',
  boots: '🥾',
  ring: '💍',
  spRing: '☄️'
};

const eqUpsReq = {
    sword: 1,
    armor: 7,
    boots: 11,
    ring: 21,
    spRing: 12
};

const eqUpsReqSp = {
  sword: 1,
  armor: 7,
  boots: 15,
  ring: 42,
  spRing: 1
}

const getStatName = (type) => {
  switch (type) {
    case 'sword': return 'MULT DMG';
    case 'armor': return 'HP';
    case 'boots': return 'ATTACK PER SECOND';
    case 'ring': return 'MULT EXP';
    case 'spRing': return 'Min Level';
    default: return '';
  }
};

const bonusType = (type) => {
    switch (type) {
        case 'sword': return 'multDmg';
        case 'armor': return 'hp';
        case 'boots': return 'speed';
        case 'ring': return 'expMult';
        case 'spRing': return 'minLevel';
        default: return '';
    }
}

const equippedItems = computed(() => {
  return Object.entries(hero.value.equipmentTiers).map(([type, tier]) => {
    if (tier <= 0) return null;
    const eqData = equipment.find(e => e.type === type);
    const tierData = eqData?.tiers?.find(t => t.tier === tier);

    return {
      type,
      tier,
      name: tierData?.name || '???',
      bonusDisplay: tierData?.bonus?.cap ?? '?',
      ownProperty: tierData?.bonus[bonusType(type)] ?? '?',
      stat: getStatName(type),
    };
  }).filter(Boolean);
});

function awakened(type){
  hero.value.awakened[type]++;
  hero.value.eqDrop[type] = 0;
  hero.value.eqUps[type] = 0;
}

function awakenedTierReq(type){
  let tier = 20 + 10 * hero.value.awakened[type] - (hero.value.spCount >= 35? 1: 0) - (hero.value.spCount >= 46? 2: 0) -
  (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0) - 
  (spaceShop.value[7].status? 1 * Math.floor(hero.value.spsCount / 5): 0);
  
  return hero.value.singularity >= 7 && Math.min(hero.value.equipmentTiers[type], 50) >= tier;
}

function autoEnchance(){
  let totalUps;

  if(selectedType.value == 'spRing') totalUps = 500;
  else if(selectedType.value == 'sword' && perks[63].level) totalUps = (hero.value.equipmentTiers[selectedType.value] + hero.value.freeEnchances) * 2;
  else totalUps = hero.value.equipmentTiers[selectedType.value] + hero.value.freeEnchances;


  while (true) {
    const currentUps = hero.value.eqUps[selectedType.value];
    const cost = totalCost(); 

    if (hero.value.stardust < cost) break;
    if (currentUps >= totalUps) break;

    hero.value.stardust -= cost;
    if(handleExtraEnhanceChance() == -1) break;
  }
}

function eqUpCost(){
  let dark_d_penalty = (hero.value.dId == 'd-noEq'? (Math.E * (dimensions.value[36].infTier + 1)) ** 1.3: 1);
  dark_d_penalty = (hero.value.darkId.includes('d-noEq')? Math.max(Math.E ** (1.3 - 0.015 * dimensions.value[36].infTier), 1): dark_d_penalty);

  let power = 1 + 0.2 * Math.floor(hero.value.eqUps[selectedType.value]/25) - (hero.value.spCount >= 37 ? 0.075 * (hero.value.spCount / 6) : 0) - 
  (spaceShop.value[2].status? 0.0125 * hero.value.spsCount: 0);

  power = (selectedType.value == 'sword' && perks[63].level? power * 1.5: power);
  power = Math.max(power, 1);

  let weaponPenalty = (selectedType.value !== 'spRing'? Math.E ** (hero.value.eqUps[selectedType.value]/6): 1);

  return Math.floor((hero.value.eqUps[selectedType.value]+1) * 20 * weaponPenalty * (1 + 10 * (hero.value.eqUps[selectedType.value]/10)) ** power * dark_d_penalty);
}

function totalCost(){
  return eqUpCost();
}

function totalCostShow(){
  return formatNumber(totalCost(), true);
}

function forgeUpgrade() {
  const totalUps = hero.value.equipmentTiers[selectedType.value] + hero.value.freeEnchances;
  if (totalCost() > hero.value.stardust) return;

  if ((hero.value.eqUps[selectedType.value] < totalUps || 
  selectedType.value == 'spRing' || 
  selectedType.value == 'sword' && perks[63].level)) {
    hero.value.stardust -= totalCost();
    handleExtraEnhanceChance();
  }
}

function handleExtraEnhanceChance() {
  hero.value.eqUps[selectedType.value] += 1 + Math.floor(hero.value.multEnchance/100) + (Math.random() * 100 + hero.value.multEnchance%100 >= 100? 1: 0); 

  if(selectedType.value == 'spRing'){
    let spRingMax = 500;
    hero.value.eqUps['spRing'] = Math.min(hero.value.eqUps['spRing'], spRingMax);

    if(hero.value.eqUps['spRing'] >= spRingMax) return -1;
  } else if(selectedType.value == 'sword' && perks[63].level){
    let swordMax = (hero.value.equipmentTiers[selectedType.value] + hero.value.freeEnchances) * 2;
    hero.value.eqUps['sword'] = Math.min(hero.value.eqUps['sword'], swordMax);

    if(hero.value.eqUps['sword'] >= swordMax) return -1;
  } else {
    let maxEnhances = hero.value.equipmentTiers[selectedType.value] + hero.value.freeEnchances;
    hero.value.eqUps[selectedType.value] = Math.min(hero.value.eqUps[selectedType.value], maxEnhances);
  }

  return 1;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getMaxEquipmentSuffix(type) {
    let max = 0;
    if (type === 'spRing') return '';

    if (type === 'sword' && perks[63].level) max = (this.hero.equipmentTiers[type] + this.hero.freeEnchances) * 2;
    else max = this.hero.equipmentTiers[type] + this.hero.freeEnchances;


    return max ? ` / ${max}` : '';
  }

function formatNumber(num) {
  if (num < 100) return num.toFixed(2);
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  if(tier >= units)
    return "999d";

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}

let forgeInterval = null;
let holdTimeout = null;

function startForge() {
  holdTimeout = setTimeout(() => { 
    forgeInterval = setInterval(() => {
      if(hero.value.dId === 'unlimitted' ||
        hero.value.dId.startsWith('d-') && hero.value.level < 1400 ||
        (hero.value.dId === 'main') ||
        (hero.value.dId !== 'main' && hero.value.level < 700))
        forgeUpgrade();
      else 
        clearInterval(forgeInterval)
    }, 50); 
  }, 500);
}

function stopForge() {
  clearInterval(holdTimeout);
  clearInterval(forgeInterval);
  forgeInterval = null;
  holdTimeout = null;
}

</script>

<style scoped>
.equipment-panel {
  background: #1e1e2f;
  color: #f0f0f0;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  max-width: 400px;
  margin: auto;
  overflow-y: auto;
  max-height: 530px;
  margin-left: 60px;
  scrollbar-width: thin;
  scrollbar-color: rgb(37, 254, 250) transparent;
  overflow-x: hidden;
}

.equipment-panel h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #66ffcc;
}

.equipment-slot {
  display: flex;
  align-items: center;
  background: #2a2a3d;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
}

.equipment-slot:hover {
  transform: scale(1.02);
  border-color: #66ffcc;
}

.icon {
  font-size: 2rem;
  margin-right: 1rem;
  text-shadow: 0 0 6px #66ffcc;
}

.info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.stat, .tier {
  font-size: 0.9rem;
  color: #aaa;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 6px;
  font-size: 0.9em;
  color: #ccc;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  font-size: 14px;
  width: max-content;
  background-color: #222;
  color: #fff;
  text-align: left;
  padding: 6px 10px;
  border-radius: 4px;
  position: absolute;
  z-index: 10;
  top: 80%;
  left: 0%;
  transform: translateX(-50%);
  white-space: nowrap;
  transition: opacity 0.2s ease-in-out, visibility 0.2s;
  pointer-events: none;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.equipment-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.equipment-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: nowrap; /* запрет на перенос */
  margin: 2rem auto;
  max-width: 1000px;
}

.equipment-panel {
  background: #1e1e2f;
  color: #f0f0f0;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  width: 400px;
}

.starforge-panel {
  background: #292940;
  border: 2px solid #66ffcc;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  color: #66ffcc;
  font-family: 'Orbitron', sans-serif;
  width: 300px;
  box-shadow: 0 0 12px rgba(255, 255, 0, 0.25);
  flex-shrink: 0;
}


.starforge-panel h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.starforge-panel select {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.4rem;
  border-radius: 6px;
  background: #1e1e2f;
  color: #66ffcc;
  border: 1px solid #66ffcc;
}

.forge-info {
  margin-top: 0.5rem;
}

.forge-info button {
  background: #ffeb3b;
  color: #000;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  margin-top: 0.5rem;
  cursor: pointer;
  box-shadow: 0 0 10px #ffeb3b, 0 0 20px #ffeb3b70;
}

.auto-forge-info button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #666;
  background: #222;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auto-forge-info button:hover {
  background: #333;
}

.auto-forge-info button.active {
  border-color: gold;
  background: linear-gradient(90deg, #ffd700, #ffae00);
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

.upgrade-message {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  animation: fadePop 1s ease forwards;
}

.upgrade-message.success {
  color: #66ff66;
  text-shadow: 0 0 6px #66ff66;
}

.upgrade-message.fail {
  color: #ff4444;
  text-shadow: 0 0 6px #ff4444;
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1.1);
  }
  60% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.awakened-button {
  background: linear-gradient(145deg, #66ffcc, #33ccaa);
  color: #000;
  font-weight: bold;
  padding: 3px;
  border: none;
  box-shadow: 0 0 8px #66ffcc88, 0 0 2px #000;
  transition: all 0.3s ease;
  font-size: 1rem;
  cursor: pointer;
  text-shadow: 0 0 2px #fff;
}

.awakened-button:hover {
  background: linear-gradient(145deg, #33ccaa, #66ffcc);
  box-shadow: 0 0 12px #66ffccaa, 0 0 4px #000;
  transform: scale(1.05);
}

.awakened-txt{
  color: #66ffcc;
}



</style>
