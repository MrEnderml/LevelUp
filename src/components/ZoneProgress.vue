<template>
  <div class="zone-progress">
    <h3 class="progress-header">
      <div v-if="hero.stage >= 10" class="ascend-wrapper">
        <button class="btnAscend" @click="performAscension">
        <img :src="ascensionIcon" width="24px" height="24px" style="vertical-align: -2px;"/>
          <div class="ascend-tooltip">
            <p><strong>Ascension</strong></p>
            <p>Reset to stage 1, but you will lose level, tree and equipment.</p>
            <p>Total shards: {{ formatNumber(hero.totalAscensionShards) }} <span v-if="hero.ascendShardPerform > 0">(+{{formatNumber(hero.ascendShardPerform)}} after Ascension)</span> 💠</p>
            <p v-if="dimensions[9].infTier == dimensions[9].maxInfTier && hero.dId == 'main'">Now you are available to get Dimension Shard(DS). Reach Stage {{hero.dsStage + 10 * hero.ds}} and Ascend to gain 1 DS</p>
          </div>
        </button>
      </div>
      <div v-if="hero.level >= 100 && !hero.isSingularity" class="rebirth-wrapper">
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
            <p v-if="hero.rebirthPts <= 1e5">You gained: {{format(hero.totalRebirthPts)}} Pts</p>
          </div>
        </button>
      </div>
      <div v-if="(hero.soulsMax >= 20 + 10 * hero.abyssTier || (hero.spCount >= 15)) && !hero.isSingularity && hero.dId != 'hard'" class="abyss-wrapper">
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
      <div class="inf-wrapper" v-if="hero.infProgress && hero.dId == 'main' && !hero.isSingularity">
        <button class="btnInf" @click="performInf" >
          <span class="infinity-glow">∞</span>
          <div class="inf-tooltip inf-shadow">
              <p><strong>Infinity [T{{hero.mainInfTier + 1}}]</strong></p>
              <p>You become The Omnipotent , but The Dimension tries to keep you from breaking the D-Rule.</p>
              <p>{{infRewards[hero.infTier]}}</p>
              <p>The Dimension is trying to destroy you. Reach Total Level 700 while your EXP Gain & Max Level ^{{(1 - 0.02 * (hero.infTier + 1) + hero.infPenalty).toFixed(2)}}. 
              The Celestials succumb to D's will, becoming stronger. Corruption spreads its influence among all entities of this dimension, making them wild.</p> 
              <p style="color: red" v-if="hero.infTier >= 20">The D-Rule tears the tissue of the universe, worsening the drop of stardust </p>
              <p style="color: red" v-if="hero.infTier >= 25">The D-Rule destroys all Celestial making them insignificant, worsening the drop of mutagen </p>
              <p style="color: red" v-if="hero.infTier >= 30">Dimensions are being consumed by the power of the multiverse. Curses are getting stronger</p>
              <p style="color: red" v-if="hero.infTier >= 40">You feel the touch of the unknown, but you do not know how to get to it.</p>
              <p>You will need {{trueLevelReq()}} True Max Level to reach 700 Max Level</p>
          </div>
        </button>
      </div>
      <div class="soul-wrapper" v-if="hero.infTier >= 6 && !hero.isSingularity && hero.dId != 'soulD'">
        <button class="btnSoul" @click="performSoulD" >
          <img :src="redSkull" width="24px" height="24px" v-if="hero.soulD" />
          <span v-if="!hero.soulD">💀</span>
          <div class="soul-tooltip abyss-shadow">
              <p><strong>D-Soul</strong></p>
              <p>Enter the Dimension where souls have 100% appearence, but they are stronger than usual souls. Soul Loot scales better.</p>
              <p>Click to <span v-if="!hero.soulD">Enter</span><span  v-if="hero.soulD">Leave</span> The Dimension</p>
          </div>
        </button>
      </div>
      <div class="singularity-wrapper" v-if="hero.dId == 'main' && !hero.isAbyss && hero.infTier >= 7 + hero.singularity">
      <button class="btnSingularity" @click="performSingularity" >
          <SvgIcon name="singularity" size="1.4em" />
          <div class="singularity-tooltip singularity-shadow">
              <p v-if="hero.singularity < 8"><strong>Singularity [T{{hero.singularity}}]</strong></p>
              <p v-else><strong>Singularity-BH</strong></p>
              <p>Face the hardest challenge of the universe to recreate the D-Rule</p>
              <p>{{singularityD[hero.singularity]}}</p>
              <p>{{singularityR[hero.singularity]}}</p>
              <span v-if="hero.singularity >= 8 && hero.isSingularity">Total SP: {{totalSp()}}<br></span>
              <span v-if="hero.singularity >= 8">Max kills: {{hero.singularityKills}}</span>
              <p>Reach Level 700 to Enter the singularity</p>
              <p v-if="hero.isSingularity">Click to leave the Singularity</p>
          </div>
        </button>
      </div>
  
    <div>
      <span class="progress-text">🌍 Progress</span>
    </div>
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
      <div class="progress-bar-text" v-if="!hero.isSingularity">
        {{ formatNumber(kills) }} / {{ Math.floor(killsPerZone) }} kills (Zone {{ zone }} /  5 , Stage {{ stage }})
      </div>
      <div class="progress-bar-text" v-if="hero.isSingularity">
        {{ kills }} / {{ Math.floor(killsPerZone) }} kills
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
import { dimensions } from '../data/dimensions.js';
import { killHistory } from '../composables/afkHandle.js';
import redSkull from '../assets/red-skull.png';
import ascensionIcon from '../assets/ascension.png';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const kills = computed(() => hero.value.kills);
const killsPerZone = computed(() => hero.value.killsPerZone);
const zone = computed(() => hero.value.zone);
const stage = computed(() => hero.value.stage);


const singularityD = [
  `Enter the singularity, where gravity devours space, opponents under the influence of gravity destroy galaxies and your level is on the verge of destruction.`,
  `Enter the singularity, where the opponents have learned to recognize the essence of curses.`,
  `Enter the singularity, where The Tree is locked`,
  `Enter the singularity, where Ascension is locked`,
  `Enter the singularity, where Space is locked`,
  `Enter the singularity, where Buff is locked`,
  `Enter the singularity, where Equipment is locked`,
  `Enter the singularity, where Rebirth is locked`,
  `Enter the singularity, where enemies under curse of D-Rule. All enemies have curse [T5]`
]

const singularityR = [
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels, 
  Overkill [T4], +2% to skip stage per Singularity Tier (S), level up while your level is below 2% of Max Level per Singularity Tier (S)`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Each curse gets a bonus from the next Tier.`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. +1 Tree Tier. New Tree Perks on [T6]. Auto is always opened`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Ascension no longer resets during Infinity. Open Tier-S. Unlock a Perk in Tier-S for each Singularity Tier`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. +1 Space Tier. Celestials from available dimensions see you. Auto is always opened`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Buffs no longer reset during Infinity; +1 Max Buff`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. + Enhance Level per each Singularity Tier. Unlock Awakened Equipment`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Rebirth starts with 1e5 Pts. Unlock Singularity BH`,
  `Reach as max as possible to get Singularity Pts`
]

const abyssDescription = [
  `You reached MAX Souls. Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared. 
  Reach Stage ${20 + 10 * hero.value.abyssTier} when you affected first 7 curses [T1]`,
  `You reached MAX Souls. Abyss feels inexplicable essence through the darkness and directs its power to this dimension. 
  Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared.
  Reach Stage ${20 + 10 * hero.value.abyssTier} when you affected first 10 curses [T2]`,
   `You reached MAX Souls. Abyss now directs to enemies mind force them to evo faster. Corruption forces to affect the World Rule. 
  Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared. 
  Reach Stage ${20 + 10 * hero.value.abyssTier} when you affected first 13 curses [T3].`,
  `Dive into the Endless darkness to open new possibilities to escape from this Dimension. Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared.
  Reach as max as possible when you affected first 13 curses [T4]`
]

const abyssRewards = [
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. x1.3 MULT Rebirth Pts per Abyss Tier. +50% souls appear for each curse`,
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. There is a new enemie(Ascension Soul) after Stage 20 that drops Ascension Shards.
  Ascension Shards now affect to enemies make them weaker. `,
  "Break Rebirth Limits. Open Corruption. Unlock the Second Space Fragment.",
]

const infRewards = [ 
  `Reset everyting you've got(except Abyss D), but you will get Inf-Tree. Force any perk to serve you forever, but everything has its own price. Auto-Tree. Double Points gaining. Auto-Stage`,
  `Reset everyting you've got(except Abyss D), but you will get Ascend Permission. You have 5 Infinity Ascension Perks to serve you forever even after Infinity Reset. Extra skip stages until +25% Max Stage (S). You can get Shards from Bosses. Auto-Ascension`,
  `Reset everyting you've got(except Abyss D), but you will get Integration of Rebirth. Your Rebirth Tier are unlimmited. Enemy Power equals to 1. Auto-Rebirth`,
  `Reset everyting you've got(except Abyss D), but you will get Gamma Learning. Gain mutagens as if you have mutagen [T5]. Increase MAX Levels. Danger System scalles better. Danger System opens new Inf-Enemy`,
  `Reset everyting you've got(except Abyss D), but you will get Expansion of Space. Unlock Space [T5]. x2 stardust. Auto-Fight`,
  `Reset everyting you've got(except Abyss D), but you will get Thirst for Souls . D-Soul gives you a 100% chance to meet a soul, but its power will be limitless. Every Soul Tier gives you +1 MIN Level. EXP CAP SOULS - +40`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T0]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T1]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T2]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T3]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T4]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T5]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T6]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T7]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T8]`,
]

function abyssRwrd(tier) {
  if (tier < 3) return abyssRewards[tier];

  let str = `<span>Reach Stage 20: High Tier Curses appear more often </span><br/>`;

  if (hero.value.abyssDStages >= 20)
    str += `<span>Reach Stage 30: Level scales based on Max Stage in Abyss D</span>`; 
  if (hero.value.abyssDStages >= 30){
    str += `<span>[*${Math.max(2 - (1.015 ** (hero.value.abyssDStages - 29)), 0.1).toFixed(2)}]</span><br/>`;
    str += `<span>Reach Stage 40: Corruption weakness is based on Max Stage in Abyss D</span>`;
  }
  if (hero.value.abyssDStages >= 40){
    str += `<span>[+${Math.max(1 - (1 / (Math.sqrt(hero.value.abyssDStages - 39) ** 0.15)), 0.1).toFixed(2)}]</span><br/>`;
    str += `<span>Reach Stage 50: Curse Bonus boost is based on Max Stage in Abyss D</span>`;  
  }
  if (hero.value.abyssDStages >= 50){
    str += `<span>[*${((1.0125 ** Math.min(hero.value.abyssDStages - 49, 100))).toFixed(2)}]</span><br/>`;
    str += `<span>Reach Stage 60: Stardust drop is better based on Max Stage in Abyss D</span>`; 
  }
  if (hero.value.abyssDStages >= 60){
    str += `<span >[*${((1.015 ** Math.min(hero.value.abyssDStages - 59, 120))).toFixed(2)}]</span><br/>`;
    str += `<span>Reach Stage 70: Stage requirement scales better based on Max Stage in Abyss D</span><br/>`;
  }
  if (hero.value.abyssDStages >= 70){
    str += `<span>Reach Stage 80: Open D-Atlas</span><br/>`;
  }
  if(hero.value.abyssDStages > 100){
    str += `<span>Reach Stage 100: MULT to convert Curse [T4] to [T5] - </span>`;
    if (hero.value.abyssDStages >= 100) {
      str += `<span>[*${(1.01 ** (hero.value.abyssDStages - 99)).toFixed(2)}]</span><br/>`;
      str += `<span>Reach Stage 120: Stage Requirement reduced for Dimension Shards</span>`;
    }
    if (hero.value.abyssDStages >= 120) {
      str += `<span>[-${Math.floor(Math.sqrt(hero.value.abyssDStages - 119))}]</span><br/>`;
      str += `<span>Reach Stage 140: The Danger Power is weaker</span><br>`;
    }
    if(hero.value.abyssDStages >= 140){
      str += `<span>Reach Stage 160: Celestials are weaker</span>`;
    }
    if(hero.value.abyssDStages >= 160){
      str += `<span>[*${Math.max(1 / (1.01 ** (hero.value.abyssDStages - 159)), 0.1).toFixed(2)}]</span><br>`;
      str += `<span>Reach Stage 180: Soul-D is weaker</span><br>`;
    }
    if(hero.value.abyssDStages >= 180){
      str += `<span>Reach Stage 200: Max Level MULT</span>`;
    }
    if(hero.value.abyssDStages >= 200){
     str += `<span>[*${(1.0125 ** (hero.value.abyssDStages - 199)).toFixed(2)}]</span><br>`;
     str += `<span>Reach Stage 1000: Unlock new Dimensions</span><br>`;
    }
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

function totalSp(){
  return formatNumber(Math.log(hero.value.kills + 3) ** 7.26 - Math.log(hero.value.singularityKills + 3) ** 7.26);
}

function trueLevelReq(){
  let l = Math.round(700 ** (1 / (1 - 0.02 * (hero.infTier + 1) + hero.infPenalty)));
  return (l < 1e5? l: `100k+`)
}

function dsGain() {
  let total = Math.floor(Math.max(hero.value.stage - hero.value.dsStage, 0) / 10);
  return hero.value.dsStage + 10 * total
}


const performSingularity = () => {
  if(!hero.value.isSingularity && hero.value.level < 700)
    return;
  
  hero.value.perform = true;
  enemy.value.soulBuff.active = false;
  enemy.value.boss.isBoss = false; 
  hero.value.soulD = false;
  hero.value.activeBuffs = [];
  killHistory.length = 0;

  if(hero.value.isSingularity && hero.value.singularity >= 8) {
      hero.value.singularityKills = hero.value.kills;
  }

  perform();

  if(hero.value.isSingularity){
    hero.value.isSingularity = false;

    if(hero.value.singularity >= 2) hero.value.treeAuto = true;
    if(hero.value.singularity >= 3){
      ascension.forEach((perk, index) => {
        perk.level = hero.value.singularityAscension[index] || 0;
      });
    }
    if(hero.value.singularity >= 4) {
      hero.value.sp = hero.value.singularitySpace.sp;
      hero.value.singularitySpace.sp = 0
      hero.value.st = hero.value.singularitySpace.st;
      hero.value.singularitySpace.st = 0;
      hero.value.spCount = hero.value.singularitySpace.spCount;
      hero.value.singularitySpace.spCount = 0;
      hero.value.isSpaceAuto = true;
    }
    if(hero.value.singularity >= 6) {
      hero.value.eqUps['spRing'] = hero.value.singularityRingUp;
      hero.value.singularityRingUp = 0;
    }
    if(hero.value.singularity >= 7) {
      hero.value.rebirthPts = 1e5;
      hero.value.rebirthTier = hero.value.singularityRebirthTier;
      hero.value.singularityRebirthTier = 0;
    }
    return;
  }
  hero.value.isSingularity = true;

  hero.value.killsPerZone = 10000;
  hero.value.stage = 1;

  if(hero.value.singularity >= 2){
    hero.value.treeAuto = false;
    radPerks[7].perkStatus = false;
    for (let perk of tperks.value){
      if(perk.status !== 'undefined')
        perk.status = false;
      if(perk.infStatus !== 'undefined')
        perk.infStatus = false;
    }
  }
  if(hero.value.singularity >= 3){
    ascension.forEach((perk, index) => {
      hero.value.singularityAscension[index] = perk.level;
      perk.level = 0;
    });
  }
  if(hero.value.singularity >= 5) hero.value.activeBuffs = [];
  if(hero.value.singularity >= 4) {
    hero.value.isSpaceAuto = false;
    hero.value.singularitySpace.sp = hero.value.sp;
    hero.value.sp = 0
    hero.value.singularitySpace.st = hero.value.st;
    hero.value.st = 0;
    hero.value.singularitySpace.spCount = hero.value.spCount;
    hero.value.spCount = 0;
  }
  if(hero.value.singularity >= 6) {
    hero.value.singularityRingUp = hero.value.eqUps['spRing'];
    hero.value.eqUps['spRing'] = 0;
  }
  if(hero.value.singularity >= 7) {
    hero.value.rebirthPts = 0;
    hero.value.singularityRebirthTier = hero.value.rebirthTier;
    hero.value.rebirthTier = 0;
  }
  if(hero.value.singularity >= 8) {
    hero.value.kills = hero.value.singularityKills;
    hero.value.rebirthPts = 1e5 + (Math.log(hero.value.singularityKills) ** 7.26);
  }
}

const performSoulD = () => {
  hero.value.soulD = hero.value.soulD? false: true;
  if(hero.value.soulD){
    hero.value.soulDStage = hero.value.stage;
    hero.value.stage = 15;
    hero.value.kills = 0;
  } else {
    hero.value.stage = hero.value.soulDStage;
    hero.value.kills = 0;
    hero.value.zone = 1;
  }
}

const performAscension = () => {
  hero.value.perform = true;
  hero.value.isAscend = true;
};

const performRebirth = () => {
  hero.value.perform = true;
  hero.value.isRebirth = true;
}

const performAbyss = () => {
  if(hero.value.dId == 'abyss-d') return;

  if(hero.value.isAbyss && hero.value.stage >= (20 + 10 * hero.value.abyssTier)){
    hero.value.abyssTier = Math.min(hero.value.abyssTier + 1, 3);
    if(hero.value.abyssTier == 1){
      hero.value.soulsCap += 10;
    }
    if(hero.value.abyssTier == 2){
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
  hero.value.perform = true;
  hero.value.dTimer = 0;
  hero.value.infTier = hero.value.mainInfTier;

  perform();
  hero.value.activeBuffs = [];
  hero.value.spActiveBuffs = [];
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
  hero.value.rebirthPts = (hero.value.singularity < 8? 0: 1e5 + Math.log(hero.value.singularityKills + 3) ** 7.26);
  hero.value.cursedBonusExp = 0;
  hero.value.cursedBonus = 0;
  hero.value.rebirthTier = 0;

  hero.value.activeCurse = [];
  hero.value.activeCuseTier = [];
  hero.value.curse = 0;
  hero.value.souls = 0;
  hero.value.soulTier = 0;
  hero.value.soulsCap = 20 + (hero.value.rebirthPts >= 2.5e5? 10: 0) + 
  (hero.value.rebirthPts >= 5.5e5? 10: 0);
  hero.value.soulsMax = 0;
  hero.value.maxBuffs = 1;
  hero.value.ascendShardPerform = 0;
  hero.value.ascensionShards = 0;
  hero.value.totalAscensionShards = 0;
  hero.value.abyssTier = (hero.value.rebirthPts >= 2.5e5? 1: 0) + 
  (hero.value.rebirthPts >= 5.5e5? 1: 0) + (hero.value.rebirthPts >= 1.5e6? 1: 0);
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

  for(let sp of spEnemy){
    if(sp.id%6 == 0){
      sp.status = false;
    }
  }  
  

  if(hero.value.singularity < 4){
    for(let perk of ascension){
      if(perk.tier != 6 && perk.tier != 7 && perk.tier != 8)
        perk.level = 0;
    }
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

  if(hero.value.singularity < 6){
    for(let buff of buffs.value){
        if(buff.id == 6) continue;
        buff.exp = 0;
        buff.tier = 1;
        buff.maxTier = 3;
        buff.active = false;
      }
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
  killHistory.length = 0;
  
}

const perform = () => {
  hero.value.eLevel = 1;
  hero.value.exp = 0;
  hero.value.stage = 1 + (hero.value.dId == 'overstage'? 100 + 2 * (dimensions.value[19].infTier - 15): 0);
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
  hero.value.perkPoints = 0 + hero.value.freeTreePoints;

  hero.value.eqDrop['sword'] = 0;
  hero.value.eqDrop['armor'] = 0;
  hero.value.eqDrop['boots'] = 0;
  hero.value.eqDrop['ring'] = 0;

  hero.value.afkSoulBoost = 1;
  hero.value.soulD = false;
  enemy.value.weakStack = 0;
  hero.value.shardsMult = 0;
  hero.value.shardsPerformMult = 0;
  hero.value.travellPenalty = 1;
  hero.value.isTravell = false;
  hero.value.dKills = 0;

  if(hero.value.gcnpSetting){
    hero.value.isLocked = true;
    hero.value.isStage = false;
  } else {
    hero.value.isLocked = false;
    hero.value.isStage = true;
  }
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

function formatNumber(num, f = false) {
  if(f && num < 100) return num.toFixed(2);
  if (num < 1000) return Math.floor(num);

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}

</script>

<style scoped>
.zone-progress {
  position: absolute;
  top: 20%;  
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
  gap: 8px; 
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
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.btnAscend:hover .ascend-tooltip {
  display: block;
}
/* rebirth */
.btnRebirth, .btnAbyss, .btnInf, .btnSoul, .btnSingularity {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.btnAbyss {
  scrollbar-color: rgb(217, 47, 243) transparent;
}

.rebirth-wrapper, .abyss-wrapper, .inf-wrapper, .soul-wrapper, .singularity-wrapper {
  position: relative;
  display: inline-block;
}


.btnRebirth:hover, .btnAbyss:hover, .btnInf:hover, .btnSoul:hover, .btnSingularity:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.rebirth-tooltip, .abyss-tooltip, .inf-tooltip, .soul-tooltip, .singularity-tooltip {
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

.btnRebirth:hover .rebirth-tooltip, .btnAbyss:hover .abyss-tooltip, .btnInf:hover .inf-tooltip, .btnSoul:hover .soul-tooltip, .btnSingularity:hover .singularity-tooltip {
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

.singularity-shadow {
  top: 180%;
  box-shadow: 0 0 12px 4px #66ffcc;
  max-height: 300px;
  overflow: auto;
}

.progress-text {
  position: absolute;
  left: 43%;
  top: 30%;
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



.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  color: white;
  max-height: 80vh;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stage-list-scrollable {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 6px;
  margin: 10px 0;
  width: 100%;
}

/* скроллбар */
.stage-list-scrollable::-webkit-scrollbar {
  width: 6px;
}
.stage-list-scrollable::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.stage-list-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.stage-list-scrollable button {
  background: #333;
  color: white;
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.stage-list-scrollable button:hover {
  background: #555;
}

.close-btn {
  background-color: #900;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}



</style>
