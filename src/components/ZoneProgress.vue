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
            <p v-if="hero.infTier < 3">Next rebirth Tier: {{Math.min(100 + (10 * hero.rebirthTier), 300)}} Level</p>
            <p v-if="hero.infTier >= 3">+{{Math.floor((hero.level - 90) / 10 > hero.rebirthTier? (hero.level - (90 + 10 * hero.rebirthTier)) / 10: 0)}} Rebirth Tier</p>
            <p v-if="(hero.rebirthTier + 1)%5 == 0 && hero.rebirthTier < 21">Unlock new Rebirth Affect</p>
            <p v-if="(hero.rebirthTier + 1)%10 == 0 && hero.rebirthTier >= 21 && hero.rebirthTier < 71">Unlock new Rebirth Affect</p>
            <p>You gained: {{format(hero.totalRebirthPts)}} Pts</p>
          </div>
        </button>
      </div>
      <div v-if="hero.soulsMax == 20 + 10 * hero.abyssTier || (hero.sp >= 24)" class="abyss-wrapper">
        <button class="btnAbyss" @click="performAbyss">
        🧿
          <div class="abyss-tooltip abyss-shadow">
            <p v-if="hero.abyssTier < 3"><strong>Abyss[T{{hero.abyssTier}}]</strong></p>
            <p v-if="hero.abyssTier >= 3"><strong>Abyss D</strong></p>
            <p> 
            {{abyssDescription[hero.abyssTier]}}
            </p>
            <span v-if="hero.abyssTier >= 3">Max Stage: {{hero.abyssDStages}}</span>
            <p v-html="abyssRwrd(hero.abyssTier)"></p>
            <p v-if="hero.isAbyss">Click to leave or complete Abyss</p>
          </div>
        </button>
      </div>
      <div class="inf-wrapper" v-if="hero.infProgress">
        <button class="btnInf" @click="performInf" >
          <span class="infinity-glow">∞</span>
          <div class="inf-tooltip inf-shadow">
              <p><strong>Infinity [T{{hero.infTier}}]</strong></p>
              <p>You become The Omnipotent , but The Dimension tries to keep you from breaking the D-Rule.</p>
              <p>{{infRewards[hero.infTier]}}</p>
              <p>The Dimension is trying to destroy you. Reach 700 Level while your EXP Gain & Max Level ^{{(1 - 0.02 * (hero.infTier + 1)).toFixed(2)}}. 
              The Celestials succumb to D's will, becoming stronger. Corruption spreads its influence among all entities of this dimension, making them wild. </p>
          </div>
        </button>
      </div>
      <div class="soul-wrapper" v-if="hero.infTier >= 6">
        <button class="btnSoul" @click="performSoulD" >
          <span>💀</span>
          <div class="soul-tooltip abyss-shadow">
              <p><strong>D-Soul</strong></p>
              <p>Enter the Dimension where souls have 100% appearence, but they are stronger than usual souls. Soul Loot scalles better</p>
              <p>Available at Stage 15</p>
              <p>Click to <span v-if="!hero.soulD">Enter</span><span  v-if="hero.soulD">Leave</span> The Dimension</p>
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
import { useEnemy } from '../composables/useEnemy.js';
import { perks as radPerks } from '../data/radPerks.js';
import { perks as tperks } from '../data/perks.js';
import { perks as ascension } from '../data/ascension.js';
import { amulets } from '../data/amulets.js';
import { cursed } from '../data/cursed.js';
import { useBuff } from '../data/buffs.js';
import { spEnemy } from '../data/spaceEnemy.js';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

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
  Reach ${20 + 10 * hero.value.abyssTier} stage when you affected first 13 curses [T3].`,
  `Dive into the Endless darkness to open new possibilities to escape from this Dimension. Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared.
  Reach as max as possible when you affected first 13 curses [T4]`
]

const abyssRewards = [
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. x1.3 MULT Rebirth Pts per Abyss Tier. +50% souls appear for each curse`,
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. There are new enemies after 20 stages that drops Ascension Shards.
  Ascension Shards now affect to enemies make them weaker. `,
  "Break Rebirth Limits. Open Corruption. Unlock the Second Space Fragment.",
]

const infRewards = [ 
  `Reset everyting you've got(except Abyss D), but you will get Inf-Tree. Force any perk to serve you forever, but everything has its own price. Auto-Tree. Double Points gaining`,
  `Reset everyting you've got(except Abyss D), but you will get Ascend Permission. You have 5 Infinity Ascension Perks to serve you forever even after Infinity Reset. Extra skip stages until +25% Max Stage (S). You can get Shards from Bosses`,
  `Reset everyting you've got(except Abyss D), but you will get Integration of Rebirth. Your Rebirth Tier are unlimmited. Enemy Power equals to 1.`,
  `Reset everyting you've got(except Abyss D), but you will get Gamma Learning. Gain mutagens as if you have mutagen [T5]. Increase MAX Levels. Danger System scalles better. Danger System opens new Inf-Enemy`,
  `Reset everyting you've got(except Abyss D), but you will get Expansion of Space. Unlock Space [T5]. x2 stardust. Auto-Fight`,
  `Reset everyting you've got(except Abyss D), but you will get Thirst for Souls . D-Soul gives you a 100% chance to meet a soul, but its power will be limitless. Every Soul Tier gives you +1 MIN Level. EXP CAP SOULS - +40`,
  `Reset everyting you've got(except Abyss D). Try to find a way to escape from this Dimension`,
]

function abyssRwrd(tier) {
  if (tier < 3) return abyssRewards[tier];

  let str = `<span>Reach 20 stage: High Tier Curses appear more often </span><br/>`;

  if (hero.value.abyssDStages >= 20)
    str += `<span>Reach 30 stage: Level scales based on Max Stage in Abyss D</span>`; 
  if (hero.value.abyssDStages >= 30){
    str += `<span>[*${Math.max(2 - (1.015 ** (hero.value.abyssDStages - 29)), 0.02).toFixed(2)}]</span> </span><br/>`;
    str += `<span>Reach 40 stage: Corruption weakness is based on Max Stage in Abyss D</span>`;
  }
  if (hero.value.abyssDStages >= 40){
    str += `<span>[+${(1 - (1 / (Math.sqrt(Math.max(1, hero.value.abyssDStages - 39)) ** 0.1))).toFixed(2)}]</span></span><br/>`;
    str += `<span>Reach 50 stage: Curse Bonus boost is based on Max Stage in Abyss D</span>`;  
  }
  if (hero.value.abyssDStages >= 50){
    str += `<span>[*${((1.04 ** (hero.value.abyssDStages - 49))).toFixed(2)}]</span><br/>`;
    str += `<span>Reach 60 stage: Stardust drop is better based on Max Stage in Abyss D</span>`; 
  }
  if (hero.value.abyssDStages >= 60){
    str += `<span >[*${((1.02 ** (hero.value.abyssDStages - 59))).toFixed(2)}]</span></span><br/>`;
    str += `<span>Reach 70 stage: Stages scale better based on Max Stage in Abyss D</span><br/>`;
    
  }

  return str;
}

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

const performSoulD = () => {
  if(hero.value.stage >= 15)
    hero.value.soulD = hero.value.soulD? false: true;
}

const performAscension = () => {
  hero.value.perform = true;
  hero.value.isAscend = true;
  hero.value.ascensionShards += hero.value.ascendShardPerform;
  perform();  

};

const performRebirth = () => {
  hero.value.perform = true;
  hero.value.rebirthPts += hero.value.totalRebirthPts;
  if(hero.value.infTier < 3){
    if(hero.value.level >= 100 + 10 * hero.value.rebirthTier && hero.value.eLevel < 301 && hero.value.rebirthTier < 20){
        hero.value.rebirthTier++;
    }
  } else if((hero.value.level - 90) / 10 > hero.value.rebirthTier){
    hero.value.rebirthTier += Math.floor((hero.value.level - (90 + 10 * hero.value.rebirthTier)) / 10);
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
   
    hero.value.isAbyss = false;
    hero.value.perform = true;
    perform();
    hero.value.activeBuffs = [];
    hero.value.souls = 0;
    return;
  }

  if(hero.value.isAbyss && hero.value.stage < 20 + 10 * hero.value.abyssTier){
    hero.value.isAbyss = false;
    hero.value.perform = true;
    hero.value.activeBuffs = [];
    perform();
    hero.value.souls = 0;
    return;
  }
  
  hero.value.souls = 0;
  hero.value.isAbyss = true;
  hero.value.perform = true;

  perform();
}

const performInf = () => {
  hero.value.infTier = Math.min(hero.value.infTier + 1, 7);

  perform();
  hero.value.activeBuffs = [];
  hero.value.spActiveBuffs = [];
  hero.value.spBossPerk = 0;
  hero.value.stardust = 0;
  hero.value.spCount = 0;
  hero.value.sp = 0;
  hero.value.st = 0;

  hero.value.formationTypes[0].status = false;
  hero.value.formationTypes[1].status = false;
  hero.value.formationTypes[2].status = false;
  hero.value.formationTypes[3].status = false;
  hero.value.activeFormation = null;

  hero.value.totalRebirthPts = 0;
  hero.value.rebirthPts = 0;
  hero.value.cursedBonusExp = 0;
  hero.value.cursedBonus = 0;
  hero.value.rebirthTier = 0;

  hero.value.activeCurse = [];
  hero.value.activeCuseTier = [];
  hero.value.curse = 0;
  hero.value.souls = 0;
  hero.value.soulTier = 0;
  hero.value.soulsCap = 20;
  hero.value.soulsMax = 0;
  hero.value.maxBuffs = 1;
  hero.value.ascendShardPerform = 0;
  hero.value.ascensionShards = 0;
  hero.value.totalAscensionShards = 0;
  hero.value.abyssTier = 0;
  hero.value.isAbyss = false;

  hero.value.isSpaceAuto = false;
  hero.value.soulD = false;
  hero.value.spaceFight = false;
  hero.value.isSpaceBuff = false;

  
  hero.value.equipmentTiers['spRing'] = 0;
  hero.value.eqTierReq['spRing'] = 0;

  hero.value.eqUps['sword'] = 0;
  hero.value.eqUps['armor'] = 0;
  hero.value.eqUps['boots'] = 0;
  hero.value.eqUps['ring'] = 0;
  hero.value.eqUps['spRing'] = 0;

  for(let idx in radPerks){
    radPerks[idx].level = 0;
  }
  radPerks[6].status = false;
  radPerks[6].baseCost = 2500;
  radPerks[6].description = 'REBUILD REBIRTH SYSTEM THAT ALLOWS YOU TO SPEND MUTAGEN TO UP YOUR POTENTIAL';
  radPerks[6].max = 1;

  radPerks[7].perkStatus = false;
  radPerks[10].status = false;
  radPerks[10].max = 1;

  for(let sp of spEnemy){
    if(sp.id%6 == 0 || sp.id >= 25){
      sp.status = false;
    }
  }  


  for(let perk of ascension){
    if(perk.tier != 6)
      perk.level = 0;
  }


  amulets[0].status = false;
  amulets[1].status = false;
  amulets[2].status = false;
  amulets[3].status = false;

  amulets[0].suffix.status = false
  amulets[1].suffix.status = false
  amulets[2].suffix.status = false
  amulets[3].suffix.status = false

  amulets[0].prefix.status = false
  amulets[1].prefix.status = false
  amulets[2].prefix.status = false
  amulets[3].prefix.status = false


  cursed[7].status = false;
  cursed[8].status = false;
  cursed[9].status = false;
  cursed[10].status = false;
  cursed[11].status = false;
  cursed[12].status = false; 


  for(let buff of buffs.value){
    buff.exp = 0;
    buff.tier = 1;
    buff.maxTier = 3;
    buff.active = false;
  }

  for (let perk of tperks.value){
    perk.level = 0;
    if(perk.status !== 'undefined')
      perk.status = false;
    if(perk.infStatus !== 'undefined')
      perk.infStatus = false;
  }

  buffs.value[0].ptr = 0;
  buffs.value[0].def = 1;

  buffs.value[1].used = false;
  buffs.value[1].usedSkill = false;
  buffs.value[1].stun = 0;

  buffs.value[2].combo = 0;

  buffs.value[4].time = 0;

  buffs.value[5].debuff = 0;
  buffs.value[5].stuck = 0;

  buffs.value[8].time = 0;

  buffs.value[10].rise = 1;
  buffs.value[10].buffT2 = 0
  buffs.value[10].buffT3 = 0;
  buffs.value[10].buffT3HP = 0;

  buffs.value[12].dmg = 1;
  buffs.value[12].crit = 0;
  buffs.value[12].critDmg = 0;


  enemy.value.rebirthEnemy.dmg = 1;
  enemy.value.rebirthEnemy.hp = 1;
  enemy.value.rebirthEnemy.drop = 1;

  enemy.value.ascensionSoul.stats = 1;
  enemy.value.ascensionSoul.active = false;

  enemy.value.rebirthSoul = false;
  enemy.value.danger = 0;
  enemy.value.enemyPower = 1;
  enemy.value.spaceBossChance = 0;
  enemy.value.isSpaceFight = 0;
  enemy.value.dangerEnemyChance = [0, 0, 0, 0, 0, 0];
  enemy.value.spawnType = 'none';

  hero.value.maxStage = 1;
  hero.value.souls = 0;
  hero.value.mutagen = 0;
  hero.value.mutations = 0;
  hero.value.infProgress = false; 
  
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

  enemy.value.soulBuff.chance = 0;

  for (let perk of tperks.value){
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

  ascension[10].status = true;
  ascension[11].status = true;
  ascension[12].status = true;
  ascension[13].status = true;

  hero.value.lacrimose = 0;

  hero.value.afkSoulBoost = 1;
  hero.value.soulD = false;
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
.btnRebirth, .btnAbyss, .btnInf, .btnSoul {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
}

.rebirth-wrapper, .abyss-wrapper, .inf-wrapper, .soul-wrapper {
  position: relative;
  display: inline-block;
}


.btnRebirth:hover, .btnAbyss:hover, .btnInf:hover, .btnSoul:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.rebirth-tooltip, .abyss-tooltip, .inf-tooltip, .soul-tooltip {
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

.btnRebirth:hover .rebirth-tooltip, .btnAbyss:hover .abyss-tooltip, .btnInf:hover .inf-tooltip, .btnSoul:hover .soul-tooltip {
  display: block;
}

.abyss-shadow {
  top: 180%;
  box-shadow: 0 0 10px rgba(225, 0, 255, 0.8);
  overflow-y: auto;
  max-height: 300px;
}

.inf-shadow {
  top: 180%;
  box-shadow: 0 0 10px rgb(238, 255, 0);
  max-height: 300px;
  overflow: auto;
}


.progress-text {
  position: absolute;
  left: 43%;
}

.infinity-glow {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s linear infinite;
  display: inline-block;
  line-height: 25px;
}

@keyframes shine {
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

</style>
