<template>
  <div class="zone-progress">
    <h3 class="progress-header">
      <div v-if="hero.stage >= 10" class="ascend-wrapper">
        <button class="btnAscend" @click="performAscension">
        🌌
          <div class="ascend-tooltip">
            <p><strong>Ascension</strong></p>
            <p>Reset to stage 1, but you will lose level, tree and equipment.</p>
            <p>Total shards: {{ format(hero.totalAscensionShards) }} <span v-if="hero.ascendShardPerform > 0">(+{{format(hero.ascendShardPerform)}} after Ascension)</span> 💠</p>
          </div>
        </button>
      </div>
      <div v-if="hero.level >= 100" class="rebirth-wrapper">
        <button class="btnRebirth" @click="performRebirth">
        ♻️
          <div class="rebirth-tooltip">
            <p><strong>Rebirth</strong></p>
            <p>
            You reached the Limit of Max Level. Rebirth to break this Limit<br>
            Rebirth to stage 1, but you will lose level, tree, equipment, souls.<br>
            Every tier provides stonger enemies and high rewards
            </p>
            <p>Next rebirth Tier: {{Math.min(100 + (10 * hero.rebirthTier), 300)}} Level</p>
            <p v-if="(hero.rebirthTier + 1)%5 == 0 && hero.rebirthTier < 21">Unlock new Rebirth Affect</p>
            <p>You gained: {{format(hero.totalRebirthPts)}} Pts</p>
          </div>
        </button>
      </div>
      <div v-if="hero.soulsMax == 20 + 10 * hero.abyssTier" class="abyss-wrapper">
        <button class="btnAbyss" @click="performAbyss">
        🧿
          <div class="abyss-tooltip abyss-shadow">
            <p><strong>Abyss[T{{hero.abyssTier}}]</strong></p>
            <p> 
            {{abyssDescription[hero.abyssTier]}}
            </p>
            <p>
            {{abyssRewards[hero.abyssTier]}}
            </p>
            <p v-if="hero.isAbyss">Click to leave or complete Abyss</p>
          </div>
        </button>
      </div>
    <span class="progress-text">🌍 Progress</span>
    <span style="opacity: 0">0</span>
    </h3>
     <button
      class="lock-stage-button"
      @click="toggleLockStage"
      >
    <template v-if="hero.isLocked">
        <span class="spinner" :class="{ paused: !hero.isLocked }"></span>
    </template>
    <template v-else>
        <span class="spinner fspinner" :class="{ paused: !hero.isLocked }"></span>
    </template>  
    </button>
    <div class="progress-bar-container">
      <div class="progress-bar-fill" :style="{ width: `${(kills / Math.floor(killsPerZone)) * 100}%` }"></div>
      <div class="progress-bar-text">
        {{ kills }} / {{ Math.floor(killsPerZone) }} kills (Zone {{ zone }} /  5 , Stage {{ stage }})
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ref, watch } from 'vue';
import { useHero } from '../composables/useHero.js';
import { perks } from '../data/ascension.js';
import { perks as tperks } from '../data/perks.js';
import { amulets } from '../data/amulets.js';
import { cursed } from '../data/cursed.js';

const { hero } = useHero();

const kills = computed(() => hero.value.kills);
const killsPerZone = computed(() => hero.value.killsPerZone);
const zone = computed(() => hero.value.zone);
const stage = computed(() => hero.value.stage);



const isLocking = ref(false);
const isLocked = ref(false);

const abyssDescription = [
  `You reached MAX Souls. Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared. 
  Reach ${20 + 10 * hero.value.abyssTier} stage when you affected first 7 curses [T1]`,
  `You reached MAX Souls. Abyss feels inexplicable essence through the darkness and directs its power to this dimension. 
  Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared.
  Reach ${20 + 10 * hero.value.abyssTier} stage when you affected first 10 curses [T2]`,
   `You reached MAX Souls. Abyss now directs to enemies mind force them to evo faster. Corruption forces to affect the World Rule. 
  Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared. 
  Reach ${20 + 10 * hero.value.abyssTier} stage when you affected first 13 curses [T3]. Unlock First Space Fragment to complete this Abyss.`
]

const abyssRewards = [
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. x1.2 MULT Rebirth Pts per Abyss Tier. +50% souls appear for each curse`,
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. There are new enemies after 20 stages that drops Ascension Shards.
  Ascension Shards now affect to enemies make them weaker. `,
  "After complete you will be cursed by 4 new curses. Break Rebirth Limits. Open Corruption. Unlock the Second Space Fragment."
]

const toggleLockStage = () => {
    if (!hero.value.isLocked){
        hero.value.isLocked = true;
        hero.value.isStage = false;
    }
    else{
        hero.value.isLocked = false;
        hero.value.isStage = true;
    }
};

const performAscension = () => {
  hero.value.perform = true;
  hero.value.isAscend = true;
  hero.value.ascensionShards += hero.value.ascendShardPerform;
  perform();  

};

const performRebirth = () => {
  hero.value.perform = true;
  hero.value.rebirthPts += hero.value.totalRebirthPts;
  if(hero.value.level == 100 + 10 * hero.value.rebirthTier && hero.value.level < 301){
    hero.value.rebirthTier++;
  }
  
  perform();
  hero.value.souls = 0;
}

const performAbyss = () => {
  if(hero.value.isAbyss && hero.value.stage >= (20 + 10 * hero.value.abyssTier)){
    hero.value.abyssTier++;
    if(hero.value.abyssTier == 1){
      cursed[7].status = true;
      cursed[8].status = true;
      cursed[9].status = true;
      hero.value.soulsCap += 10;
    }
    if(hero.value.abyssTier == 2){
      cursed[10].status = true;
      cursed[11].status = true;
      cursed[12].status = true;
      hero.value.soulsCap += 10;
    }
    if(hero.value.abyssTier >= 3){
      alert("Congrats. I think you wanna the corruption spread, but the space wants to reset for a while from you.");
    }
   
    hero.value.isAbyss = false;
    hero.value.perform = true;
    perform();
    hero.value.activeBuffs = [];
    return;
  }

  if(hero.value.isAbyss && hero.value.stage < 20 + 10 * hero.value.abyssTier){
    hero.value.isAbyss = false;
    hero.value.perform = true;
    hero.value.activeBuffs = [];
    perform();
    return;
  }
  
  hero.value.souls = 0;
  hero.value.isAbyss = true;
  hero.value.perform = true;

  perform();
}

const perform = () => {
  hero.value.eLevel = 1;
  hero.value.exp = 0;
  hero.value.stage = 1;
  hero.value.zone = 1;
  hero.value.kills = 0;
  hero.value.killsPerZone = 5;
  hero.value.nextLevelExp = 100;
  hero.value.activeCurse = [];
  hero.value.totalAscensionShards = 0;
  hero.value.ascendShardPerform = 0;
  hero.value.totalRebirthPts = 0;

  for (let perk of tperks){
    if(perk.name == "Invisible" || perk.name == "Traveller")
      perk.level = perk.level;
    else
      perk.level = 0;
  }
  hero.value.treeTier = 0;
  hero.value.perkPoints = 0;

  hero.value.equipmentTiers['sword'] = 0;
  hero.value.equipmentTiers['armor'] = 0;
  hero.value.equipmentTiers['boots'] = 0;
  hero.value.equipmentTiers['ring'] = 0;

  perks[10].status = true;
  perks[11].status = true;
  perks[12].status = true;
  perks[13].status = true;
}

function format(value) {
  if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
}

</script>

<style scoped>
.zone-progress {
  position: absolute;
  top: 15%;  
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.zone-progress h3 {
  color: #fff;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.progress-bar-container {
  position: relative;
  background-color: #333;
  height: 26px;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  transition: width 0.4s ease;
}

.progress-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 0 0 2px #000;
  white-space: nowrap;
  pointer-events: none;
}

.lock-stage-button {
  position: absolute;
  right: 0%;
  top: 10%;
  margin-top: 1rem;
  background-color: #2f2f2f;
  border-radius: 8px;
  border: 1px solid #2f2f2f;
  padding: 0rem 0rem;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  height: 42px;
  width: 70px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}


.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid transparent;
  border-top: 3px solid #4caf50;
  border-left: 3px solid #4caf50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 0 6px #4caf50, 0 0 12px #4caf50, 0 0 18px #4caf50;
}

.fspinner {
    border-left: 3px solid #4caf50;
    border-right: 3px solid #4caf50;
    border-bottom: 3px solid #4caf50;
}

.spinner.paused {
  animation-play-state: paused;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.progress-header {
  display: flex;
  align-items: center;
  gap: 8px; /* Отступ между кнопкой и текстом */
}

.btnAscend {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
}

.ascend-wrapper {
  position: relative;
  display: inline-block;
}


.btnAscend:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.ascend-tooltip {
  display: none;
  position: absolute;
  top: -100%;
  left: 100%;
  transform: translateY(-50%);
  width: 230px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  white-space: normal;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 17, 255, 0.8);
}

.btnAscend:hover .ascend-tooltip {
  display: block;
}
/* rebirth */
.btnRebirth, .btnAbyss {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
}

.rebirth-wrapper, .abyss-wrapper {
  position: relative;
  display: inline-block;
}


.btnRebirth:hover, .btnAbyss:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.rebirth-tooltip, .abyss-tooltip {
  display: none;
  position: absolute;
  
  left: 100%;
  transform: translateY(-50%);
  width: 230px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  white-space: normal;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(21, 255, 0, 0.8);
}

.btnRebirth:hover .rebirth-tooltip, .btnAbyss:hover .abyss-tooltip {
  display: block;
}

.abyss-shadow {
  top: 180%;
  box-shadow: 0 0 10px rgba(225, 0, 255, 0.8);
}


.progress-text {
  position: absolute;
  left: 43%;
}
</style>
