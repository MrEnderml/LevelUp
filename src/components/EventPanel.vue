<template>
  <div class="sidebar">
    <div class="level-bar">
      <Tooltip :text="() => lvlInfo()" position="bottom">
        <p @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Level' }"
          class="level-text">
          <span 
            :class="{
              'singularity-text-lvl': hero.eLevel > 700,
              'corruption-text-lvl': hero.eLevel >= 300,
              'exp-text': hero.eLevel < 300
            }"
          >
            Lvl: {{ hero.eLevel }}
            <span v-if="hero.minLevel > 0">(+{{hero.minLevel}})</span>/{{ fn(hero.maxLevel, false) }}
            <span v-if="hero.trueLevel >= 70000 && (hero.dId == 'main' || hero.tr.spread > 0)" style="color: cyan">
              [{{ fn(hero.tr.count) }}]
            </span>
            <span v-else-if="hero.trueLevel > 300 && (hero.dId != 'unlimitted' || hero.dId != 'c-unlimitted' )">
              [{{fn(hero.trueLevel, false)}}]
            </span>
          </span>
        </p>
      </Tooltip>
      
      <div class="exp-bar-container">
        <div
          :class="{ 'exp-bar-singularity': hero.eLevel > 700, 'exp-bar-corrupted': hero.eLevel >= 300 }"
          class="exp-bar"
          :style="{ width: `${Math.min(100, (hero.exp / hero.nextLevelExp) * 100)}%` }"
        ></div>
      </div>
      <p @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'EXP' }"><sup style="font-size: 8px">ℹ️</sup><span :class="{ 'singularity-text-lvl': hero.eLevel > 700, 'corruption-text-lvl': hero.eLevel >= 300, 'exp-text': hero.eLevel < 300 }"> 
        {{ fn(hero.exp) }} / {{ fn(hero.nextLevelExp) }} EXP</span></p>
    </div>

    <div class="icons-wrapper">
      <div class="minIcons">
        <Tooltip :text="() => minIconsHandler(4)" position="right" maxWidth="180px">
          <span v-if="hero.infUnlocked">R</span>
        </Tooltip>
        <Tooltip :text="() => minIconsHandler(0)" position="right" maxWidth="150px">
          <span>L</span>
        </Tooltip>
        <Tooltip :text="() => minIconsHandler(1)" position="right" maxWidth="140px">
          <span>R</span>
        </Tooltip>
        <Tooltip :text="() => minIconsHandler(2)" position="right" maxWidth="150px">
          <span>S</span>
        </Tooltip>
        <Tooltip :text="() => minIconsHandler(3)" position="right" maxWidth="150px">
          <span>E</span>
        </Tooltip>
      </div>

      <div v-if="hero.notes.msg.length > 0" class="notification-toggle-btn" @click="togglePanel">
        <span :class="{ 'has-notifications': hero.notes.msg.length > 0 }">
          {{ hero.notes.msg.length > 99 ? '99+' : 'N' + hero.notes.msg.length }}
        </span>
      </div>
    </div>
    
    <div class="wrapper-events">
      <div
        v-for="event in events"
        :key="event.name"
        class="event-wrapper"
      >
        <button
          :class="{ active: modelValue === event.name, locked: eventReq(event.name) }"
          :disabled="eventReq(event.name)"
          @click="emit('update:modelValue', event.name)"
        >
          <span v-if="event.name == 'Infinity'" class="icon infinity-glow">{{ icons[event.name] }}</span>
          <span v-else-if="event.name == 'Ascension'" class="icon"><img :src="ascensionIcon" width="18px" height="18px" style="vertical-align: -2px"/></span>
          <span v-else class="icon" v-html="icons[event.name]"></span>
          {{ event.name }}
        </button>

        <div
          v-if="eventReq(event.name)"
          class="tooltip"
        >
          🔒 <span>{{eventReqD(event.name)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, watchEffect, watch } from 'vue';
import { useHero } from '../composables/useHero.js';
import { useEnemy } from '../composables/useEnemy.js';
import { perks as rawPerks } from '../data/radPerks.js';
import ascensionIcon from '../assets/ascension.png';
import { dimensions } from '../data/dimensions.js'

import { fn } from '../composables/utils/global.js';
import { useNotificationHandler } from '../composables/UI/useNotificationHandler.js';

import { useSpaces } from '../composables/battleUtils/useSpace.js';
import { useBaseEnemy } from '../composables/utils/enemySetup.js';
import { usePlayer } from '../composables/utils/playerSetup.js';
import { useDimensions } from '../composables/battleUtils/useDimensions.js';

import { newicons } from '../composables/icons.js';

const {
  getDimSpecialReward
} = useDimensions();

const props = defineProps({
  hero: Object,
  events: Array, 
  modelValue: String,
});
const { enemy } = useEnemy();
const { hero } = useHero();
const { player } = usePlayer();

const { villian } = useBaseEnemy("space");

const { togglePanel } = useNotificationHandler();

const emit = defineEmits(['update:modelValue']);


const icons = {
  'Combat': '⚔️',
  'Equipment': '🗡️',
  'Skills': newicons.skillExp,
  'Tree': '🌿',
  'Ascension': '🌌',
  'Soul': '💀',
  'Amulet': '🔮',
  'Rebirth': '♻️',
  'Space': '✨',
  'Radiation': newicons.radiation,
  'Infinity': '∞',
  'D-Atlas': '🌐',
  'Void': newicons.voidShard,
  'Settings': '⚙️',
  'Info': '📖'
}


watchEffect(() => {
  if(hero.value.windowUpdate){
    emit('update:modelValue', 'Combat')
    hero.value.windowUpdate = false;
  }
  if(hero.value.eLink.set != ''){
    hero.value.eLink.set = '';
    emit('update:modelValue', 'Info')
  }
  if(hero.value.spaceWindowChange) {
    emit('update:modelValue', 'Combat');
    hero.value.battleId = "space";
    hero.value.spaceWindowChange = false;
  }

})

watch(
  () => [
    hero.value.noBattleWindowChanges,
    villian.value.space.spaceCooldown,
    villian.value.space.isSpaceFight
  ],
  ([noChange, cd, fight]) => {
    if (noChange && cd > 0 && fight) {
      emit('update:modelValue', 'Combat');
      hero.value.battleId = "space";
    }
  }
);

const stageReq = {
  Combat: 1,
  Equipment: 2,
  Skills: 5,
  Tree: 1,
  Ascension: 10,
  Soul: 15,
  Amulet: 20,
};

const corruptionLocks = {
  'c-noTree': ['Equipment','Skills','Ascension','Space','Radiation','Rebirth'],
  'c-noEq': ['Tree','Skills','Ascension','Space','Radiation','Rebirth'],
  'c-noSpace': ['Tree','Equipment','Skills','Ascension','Radiation','Rebirth'],
  'c-noBuffs': ['Tree','Equipment','Space','Ascension','Radiation','Rebirth'],
  'c-ascension': ['Tree','Equipment','Space','Skills','Radiation','Rebirth'],
  'c-radiation': ['Tree','Equipment','Space','Ascension','Skills','Rebirth'],
};

const dimensionLocks = {
  noTree: ['Tree'],
  ascension: ['Ascension'],
  'ascension-2': ['Ascension'],
  noEq: ['Equipment'],
  noBuffs: ['Skills'],
  noSpace: ['Space'],
  radiation: ['Radiation'],
};

const singularityReq = {
  Tree: 2,
  Ascension: 3,
  Space: 4,
  Skills: 5,
  Equipment: 6
};

function eventReq(e) {
  const heroData = hero.value;

  if (heroData.isSingularity) {
    const req = singularityReq[e];
    if (req && heroData.singularity >= req) return true;
  }

  if (dimensionLocks[heroData.dId]?.includes(e)) return true;

  if (corruptionLocks[heroData.dId]?.includes(e)) return true;

  if (e === 'Soul' && heroData.dId === 'soulD') return false;

  if (stageReq[e]) return heroData.maxStage < stageReq[e];

  if (e === 'Rebirth') return heroData.level < 100 && heroData.rebirthPts <= 0;
  if (e === 'Space') return heroData.abyssTier < 3 || heroData.rebirthPts < 100000;
  if (e === 'Radiation') return heroData.spCount < 5;
  if (e === 'Infinity') return !heroData.infUnlocked;
  if (e === 'D-Atlas') return heroData.mainInfTier < 10;
  if (e === 'Void') return heroData.mainInfTier < 100;
  if (e === 'Info' || e === 'Settings') return heroData.maxStage < 1;
}

function eventReqD(e) {
  const heroData = hero.value;

  if (heroData.isSingularity) {
    const req = singularityReq[e];
    if (req && heroData.singularity >= req) return 'Singularity Conflict';
  }

  if (dimensionLocks[heroData.dId]?.includes(e)) return 'The Unknown';

  if (corruptionLocks[heroData.dId]?.includes(e)) return 'Corruption Conflict';

  const stageText = {
    Equipment: 'Stage 2',
    Skills: 'Stage 5',
    Ascension: 'Stage 10',
    Soul: 'Stage 15',
    Amulet: 'Stage 20',
  };

  if (stageText[e]) return stageText[e];

  if (e === 'Rebirth') return 'Level 100';
  if (e === 'Space') return '2 Space Fragments';
  if (e === 'Radiation') return '5 Space Power';
  if (e === 'Infinity') return 'Total Level 700';
  if (e === 'D-Atlas') return 'Infinity [T10]';
  if (e === 'Void') return 'Infinity [T100]';
}


function minIconsHandler(id){
  switch(id){
    case 0: {
      let d = (hero.value.eLevel > 700? 2: 1)
      let text = `<b style="color: lightgreen">Every level gives you:</b>
      <b style='color: lightgreen'>${(2 + 0.5 * Math.floor(hero.value.potential/10) * d).toFixed(1)} HP</b>
      <b style='color: red'>${(1 + 0.2 * Math.floor(hero.value.potential/20) * d).toFixed(1)} DMG</b>
      <b style='color: yellow'>${(0.5 + 0.1 * Math.floor(hero.value.potential/30) * d).toFixed(1)} DEF</b>`;

      if(getDimSpecialReward(52))
        text += `<br><b style='color: orange'>${0.001 * d} CRIT DMG</b>`;

      if(hero.value.eLevel > 700)
        text += `<br><br><b style="color: #6adfdf">Stats after Level 700 are doubled</b>`;

      return text;
    }
    case 1: {
      return `<b style="color: lightgreen">Level Rush</b> - Level increases automatically while below <span style='color: gold'>${Math.floor(hero.value.levelRush.c * 100)}%</span> of Max Level
      <b style="color: #007bff">Stage Rush</b> - Defeat enemy to clear the stage up to <span style='color: gold'>${Math.floor(hero.value.stageRush.c * 100)}%</span> of your Max Stage`;
    }
    case 2: {
      return `Max Stage: <b style="color: gold">${hero.value.maxStage}</b>`;
    }
    case 3: {
      return `<div style="display:flex;flex-direction:column;gap:4px;width:70px">

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1k</b>
          <b>1e3</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1m</b>
          <b>1e6</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1b</b>
          <b>1e9</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1t</b>
          <b>1e12</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1qa</b>
          <b>1e15</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1qi</b>
          <b>1e18</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1sx</b>
          <b>1e21</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1sp</b>
          <b>1e24</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1o</b>
          <b>1e27</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1n</b>
          <b>1e30</b>
        </div>

        <div style="display:flex;justify-content:space-between">
          <b style="color:#ffd700">1d</b>
          <b>1e33</b>
        </div>

      </div>`.replace(/\n\s*/g, '');
    }
    case 4: {

      let text = `<div style="display:flex;flex-direction:column;gap:4px;width:170px"><b>All Resources</b>`;

        const row = (label, value, color) =>
        `<div style="display:flex;justify-content:space-between;align-items:center">
          <span style="color:${color}">${label}</span>
          <span style="font-family:monospace; color:${color}"><b>${fn(value)}</b></span>
        </div>`;

      text += row('Ascension Shards', hero.value.ascensionShards, '#4f7cff');
      text += row('Stardust', hero.value.stardust, 'orange');
      text += row('Mutagen', hero.value.mutagen, '#bddd1c');
      text += row('IP', hero.value.infPoints, 'gold');

      if (hero.value.mainInfTier > 25)
        text += row('Dimension Shards', hero.value.ds, '#fe41fe');

      if (hero.value.bhTier >= 4)
        text += row('Ancient Shards', hero.value.ancientShards, '#6fc');

      if (hero.value.mainInfTier >= 60)
        text += row('Corruption Shards', hero.value.dims.corrShards, '#b200ff');

      if (hero.value.bhTier >= 5)
        text += row('Singularity Shards', hero.value.gravity.shards, 'cyan');

      if (hero.value.mainInfTier >= 100)
        text += row('Void Shards', hero.value.void.totalShards, '#b6ff00');

      return text + `</div>`;
    }
    
    default: return ''; 
  }
}

function lvlInfo() {

  let text =  `Current Level: <b style="color: lightgreen">${fn(hero.value.eLevel)}</b><br>`;

  if (hero.value.minLevel > 0)
    text += `Min Level: <b style="color: lightgreen">${fn(hero.value.minLevel)}</b>
    Total Lelel: <b style="color: lightgreen">${fn(hero.value.minLevel + hero.value.eLevel)}</b><br>`;

  text += `Max Level: <b style="color: lightgreen">${fn(hero.value.maxLevel)}</b><br>`

  if(hero.value.spaceUnlocked)
    text += `True Level: <b style="color: lightgreen">${fn(hero.value.trueLevel)}</b>`;

  return text;
}

</script>

<style scoped>
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  border-radius: 0 16px 16px 0;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.level-text {
  display: inline-flex;
  white-space: nowrap;      
  max-width: 100%;         
  font-size: clamp(10px, 1.5vw, 16px); 
}

.level-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-bar p {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}

.exp-bar-container {
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.exp-bar {
  height: 100%;
  background-color: #2196f3;
  border-radius: 5px;
  transition: width 0.2s;
}

.exp-text {
  color: #fff;
  font-size: 0.9rem;
}

.sidebar h3 {
  margin-bottom: 1rem;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 2px #000;
}

.sidebar button {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #eee;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.sidebar button .icon {
  margin-right: 0.5rem;
}

.sidebar button:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: scale(1.02);
}

.sidebar button.active {
  background-color: #2196f3;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 5px #2196f3;
}

.event-wrapper {
  position: relative;
}

.sidebar button.locked {
  opacity: 0.5;
  pointer-events: none;
}

.tooltip {
  position: absolute;
  left: 10%;
  top: 120%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background-color: #000000cc;
  color: #fff;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.event-wrapper:hover .tooltip {
  opacity: 1;
}


.tooltip-wrapper-lvl {
  position: relative;
  display: inline-block;
}

.info-button-lvl {
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 50%;
  color: #fee2e2;
  transition: transform 0.2s;
}

.info-button-lvl:hover {
  transform: scale(1.2);
}

.wrapper-events {
  overflow-y: auto;
  overflow-x: hidden;
}

.corruption-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  letter-spacing: 0.15em;

 
  background: linear-gradient(90deg, #d76cfd, #bc82ff, #d768ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow:
    0 0 4px #7e22ce,
    0 0 8px #a855f7,
    0 0 12px #c084fc;

  animation: corruptionGlow 3.5s ease-in-out infinite;
}

@keyframes corruptionGlow {
  0%, 100% {
    text-shadow:
      0 0 4px #7e22ce,
      0 0 8px #a855f7,
      0 0 12px #c084fc;
  }
  50% {
    text-shadow:
      0 0 8px #d946ef,
      0 0 14px #c084fc,
      0 0 20px #9333ea;
  }
}

.exp-bar-corrupted {
  background: linear-gradient(270deg, #c084fc, #a855f7, #7e22ce, #9333ea);
  background-size: 400% 400%;
  animation: corruptionShift 6s ease infinite;
}

.exp-bar-singularity {
  background: linear-gradient(270deg,rgb(128, 250, 209),rgb(80, 236, 184),rgb(62, 224, 170),rgb(39, 248, 178));
}

@keyframes corruptionShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.corruption-text-lvl {
  font-weight: bold;
  font-size: 14px;
  background: linear-gradient(90deg, #d76cfd, #bc82ff, #d768ff);
  background-size: 200% auto;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: corruption-glow 3s linear infinite;
  text-align: center;
}

.singularity-text-lvl {
  color: #66ffcc
}

@keyframes corruption-glow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.infinity-glow {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  line-height: 20px;
}


.icons-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0.25rem;
}

.minIcons span {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.minIcons:hover {
  background: #444;
}

.number-abbr-tooltip ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.number-abbr-tooltip li {
  white-space: nowrap;
}

/* Notifications */
.notification-toggle-btn {
  display:flex;
  align-items:center;
  justify-content:center;

  padding:0 8px;

  background:linear-gradient(135deg,#1a1f2b,#0f131c);
  color:#cfd6e6;

  font-weight:700;
  font-size:13px;

  border-radius:8px;
  border:1px solid #2a3142;

  cursor:pointer;
  transition:all .2s ease;

  box-shadow:0 0 8px rgba(0,0,0,0.25);
}

.notification-toggle-btn:hover {
  color:#fff;
  border-color:#3a82ff;
  box-shadow:0 0 10px rgba(58,130,255,0.25);
}


.notification-toggle-btn .has-notifications {
  color:#ff4d4d;
  text-shadow:0 0 6px rgba(255,77,77,0.6);
}

.icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: middle;
}

</style>
