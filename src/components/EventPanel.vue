<template>
  <div class="sidebar">
    <div class="level-bar">
      <div class="tooltip-wrapper-lvl">
          <p>
            <span class="info-button-lvl"></span> 
            <span style="font-size: 12px" :class="{'singularity-text-lvl': eLevel > 700, 'corruption-text-lvl': eLevel >= 300, 'exp-text': eLevel < 300 }">*Lvl: {{ eLevel }}
            <span v-if="hero.minLevel > 0">(+{{hero.minLevel}})</span>/{{ formatNumber(maxLevel) }}<span v-if="hero.trueLevel > 300">[{{formatNumber(hero.trueLevel)}}]</span></span>
          </p>
          <div class="tooltip-lvl">
            Every level gives you {{(2 + 0.5 * Math.floor(hero.potential/10)).toFixed(1)}} HP, {{(1 + 0.2 * Math.floor(hero.potential/20)).toFixed(1)}} DMG, 
            {{(0.5 + 0.1 * Math.floor(hero.potential/30)).toFixed(1)}} DEF<br>
            <span v-if="hero.eLevel > 700">Getting Double Stats After Level 700</span>
          </div>
        </div>
      
      <div class="exp-bar-container">
        <div
          :class="{ 'exp-bar-singularity': eLevel > 700, 'exp-bar-corrupted': eLevel >= 300 }"
          class="exp-bar"
          :style="{ width: `${Math.min(100, (exp / nextLevelExp) * 100)}%` }"
        ></div>
      </div>
      <p><span :class="{ 'singularity-text-lvl': eLevel > 700, 'corruption-text-lvl': eLevel >= 300, 'exp-text': eLevel < 300 }"> {{ formatNumber(exp) }} / {{ formatNumber(nextLevelExp) }} EXP</span></p>
    </div>
    <Tooltip style="text-align: center" :text="() => corrList()">
      <span v-if="hero.abyssTier >= 3" class="corruption-text-lvl">*CORRUPTION [{{(hero.corruption.toFixed(2))}}]</span>
    </Tooltip>
    <h3>📜 Events</h3>
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
          <span v-else class="icon">{{ icons[event.name] || '❔' }}</span>
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
import { computed, watchEffect } from 'vue';
import { useHero } from '../composables/useHero.js';
import { useEnemy } from '../composables/useEnemy.js';
import { perks as rawPerks } from '../data/radPerks.js';

const props = defineProps({
  hero: Object,
  events: Array, 
  modelValue: String,
});
const { enemy } = useEnemy();
const { hero } = useHero();

const emit = defineEmits(['update:modelValue']);

const exp = computed(() => props.hero.exp);
const nextLevelExp = computed(() => props.hero.nextLevelExp);
const level = computed(() => props.hero.level);
const eLevel = computed(() => props.hero.eLevel);
const maxLevel = computed(() => props.hero.maxLevel);

let div = computed(() => level.value - eLevel.value);

const icons = {
  'Combat': '⚔️',
  'Equipment': '🔥',
  'Buff': '⚡',
  'Tree': '🌿',
  'Ascension': '🌌',
  'Soul': '💀',
  'Amulet': '🔮',
  'Rebirth': '♻️',
  'Space': '✨',
  'Radiation': '☢️',
  'Infinity': '∞',
  'D-Atlas': '🌐',
  'Settings': '⚙️',
  'Info': '📖'
}

const extraIcons = [
  '☄️', '👁️‍🗨️', '♊', '🧠', '🌑', '💥', '❄️', '💎', '🍀', '🌫️', '🔪', '🏹', '🩸', '⛓️', '🩹'
]

watchEffect(() => {
  if (enemy.value.isSpaceFight == 1) {
    emit('update:modelValue', 'Combat')
  }
  if(hero.value.windowUpdate){
    emit('update:modelValue', 'Combat')
    hero.value.windowUpdate = false;
  }

})

function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}

const corrListHandle = computed(() => {
  let space = (hero.value.sp >= 46? 1.002 ** hero.value.sp - 1: 0);
  let radiation = (rawPerks[11].level? 0.01 * Math.floor((hero.value.maxStage-5)/5): 0);
  let abyssD = (hero.value.sp >= 24 && hero.value.abyssDStages >= 40? 1 - (1 / (Math.sqrt(hero.value.abyssDStages - 39) ** 0.15)): 0);
  let rebirth = (hero.value.rebirthTier >= 70? (1.02 ** Math.sqrt(hero.value.rebirthTier) - 1): 0);
  let inf = (hero.value.mainInfTier >= 5? (1.01 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)) - 1): 0);

  return {
    space: space,
    radiation: radiation,
    abyssD: abyssD,
    rebirth: rebirth,
    inf: inf
  }
})

function corrList() {
  let e = corrListHandle.value;
  
  let str = ``;

  str += `<span>Space: [${e.space.toFixed(3)}]</span><br>`;
  str += `<span>Radiation: [${e.radiation.toFixed(3)}]</span><br>`;
  str += `<span>Abyss D: [${e.abyssD.toFixed(3)}]</span><br>`;
  str += `<span>Rebirth: [${e.rebirth.toFixed(3)}]</span><br>`;
  str += `<span>Infinity: [${e.inf.toFixed(3)}]</span><br>`;
  str += `<span>Total: [${(e.space + e.radiation + e.abyssD + e.rebirth + e.inf + 0.1).toFixed(3)}]</span><br>`

  return str;
}

function eventReq (e){
  if(hero.value.isSingularity){
    if(hero.value.singularity >= 2 && e == 'Tree') return true;
    if(hero.value.singularity >= 3 && e == 'Ascension') return true;
    if(hero.value.singularity >= 4 && e == 'Space') return true;
    if(hero.value.singularity >= 5 && e == 'Buff') return true;
    if(hero.value.singularity >= 6 && e == 'Equipment') return true;
    if(hero.value.singularity == 7 && e == 'Rebirth') return true;
  }
  if(hero.value.dId == 'noTree' && e == 'Tree') return true;
  if(hero.value.dId == 'ascension' && e == 'Ascension')  return true;
  if(hero.value.dId == 'noEq' && e == 'Equipment') return true;
  

  if(e == 'Combat') return hero.value.maxStage < 1;
  if(e == 'Equipment') return hero.value.maxStage < 2;
  if(e == 'Buff') return hero.value.maxStage < 5;
  if(e == 'Tree') return hero.value.maxStage < 1;
  if(e == 'Ascension') return hero.value.maxStage < 10;
  if(e == 'Soul') return hero.value.maxStage < 15;
  if(e == 'Amulet') return hero.value.maxStage < 20;
  if(e == 'Rebirth') return (hero.value.level < 100 && hero.value.rebirthPts <= 0);
  if(e == 'Space') return (hero.value.abyssTier < 3 || hero.value.rebirthPts < 100000);
  if(e == 'Radiation') return hero.value.sp < 5;
  if(e == 'Infinity') return (hero.value.dId == 'main' && hero.value.infTier < 1 && hero.value.level < 700);
  if(e == 'D-Atlas') return hero.value.abyssDStages < 80;
  if(e == 'Info') return hero.value.maxStage < 1;
  if(e == 'Settings') return hero.value.maxStage < 1;
}

function eventReqD (e){
  if(hero.value.isSingularity){
    if(hero.value.singularity >= 2 && e == 'Tree') return 'Singularity Conflict';
    if(hero.value.singularity >= 3 && e == 'Ascension') return 'Singularity Conflict';
    if(hero.value.singularity >= 4 && e == 'Space') return 'Singularity Conflict';
    if(hero.value.singularity >= 5 && e == 'Buff') return 'Singularity Conflict';
    if(hero.value.singularity >= 6 && e == 'Equipment') return 'Singularity Conflict';
    if(hero.value.singularity == 7 && e == 'Rebirth') return 'Singularity Conflict';
  }
  if(hero.value.dId == 'noTree' && e == 'Tree'){
    return 'The Unknown';
  }
  if(hero.value.dId == 'ascension' && e == 'Ascension'){
   return 'The Unknown';
  }
  if(hero.value.dId == 'noEq' && e == 'Equipment'){
   return 'The Unknown';
  }

  if(e == 'Equipment') return 'Stage 2';
  if(e == 'Buff') return 'Stage 5';
  if(e == 'Ascension') return 'Stage 10';
  if(e == 'Soul') return 'Stage 15';
  if(e == 'Amulet') return 'Stage 20';
  if(e == 'Rebirth') return 'Level 100';
  if(e == 'Space') return '2 Space Fragments';
  if(e == 'Radiation') return '5 Space Power';
  if(e == 'Infinity') return 'Total Level 700';
  if(e == 'D-Atlas') return 'AbyssD Stage 80';
}

</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 200px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  border-radius: 0 16px 16px 0;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 1000;
}

.level-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
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

.tooltip-lvl {
  position: absolute;
  top: 80%;
  left: 100%;
  transform: translateX(-50%);
  background-color: #1c1917;
  color: #fef2f2;
  padding: 0.8rem;
  border-radius: 0.5rem;
  width: 220px;
  font-size: 0.85rem;
  text-align: left;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper-lvl:hover .tooltip-lvl {
  opacity: 1;
  pointer-events: auto;
}

.tooltip-wrapper-lvl {
  position: relative;
  display: inline-block;
}

.info-button-lvl {
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
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

 
  background: linear-gradient(90deg, #c084fc, #a855f7, #7e22ce);
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
  background: linear-gradient(90deg, #bb00ff, #7700ff, #bb00ff);
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

</style>
