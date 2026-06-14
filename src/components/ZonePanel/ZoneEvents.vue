<template>
<h3 class="progress-header">
      <div class="ascend-wrapper" :class="{ hidden: !canShowAscension(hero) }">
        <button class="btnAscend" @click="performAscension">
        <img :src="ascensionIcon" width="24px" height="24px" style="vertical-align: -2px;"/>
          <div class="ascend-tooltip" v-html="ascensionContent()"></div>
        </button>
      </div>
      <div class="rebirth-wrapper" :class="{ hidden: !canShowRebirth(hero) }">
        <button class="btnRebirth" @click="performRebirth">
        ♻️
          <div class="rebirth-tooltip" v-html="rebirthContent()">
          </div>
        </button>
      </div>
      <div class="abyss-wrapper" :class="{ hidden: !canShowAbyss(hero) }">
        <button class="btnAbyss" @click="performAbyss">
        🧿
          <div class="abyss-tooltip abyss-shadow" v-html="abyssContent()">
          </div>
        </button>
      </div>
      <div class="inf-wrapper" :class="{ hidden: !canShowInfinity(hero) }">
        <button class="btnInf" @click="performInf" >
          <span class="infinity-glow">∞</span>
          <div class="inf-tooltip inf-shadow" v-html="infinityContent()">
              
          </div>
        </button>
      </div>
      <div class="soul-wrapper" :class="{ hidden: !canShowSoul(hero) }">
        <button class="btnSoul" @click="performSoulD" >
          <img :src="redSkull" width="24px" height="24px" v-if="hero.soulD" />
          <span v-if="!hero.soulD">💀</span>
          <div class="soul-tooltip" v-html="souldContent()">
          </div>
        </button>
      </div>
      <div class="singularity-wrapper" :class="{ hidden: !canShowSingularity(hero) }">
        <button class="btnSingularity" @click="performSingularity" >
          <SvgIcon name="singularity" size="1.4em" />
          <div class="singularity-tooltip singularity-shadow" v-html="singularityContent()">
          </div>
        </button>
      </div>
      <div class="singularity-wrapper" :class="{ hidden: !canShowSingShards(hero) }">
        <button class="btnSingularity" @click="performSingShards" >
          <SvgIcon name="singularity" size="1.4em" />
          <div class="singularity-tooltip singularity-shadow" v-html="singShardsContent()">
          </div>
        </button>
      </div>
</h3>
</template>

<script setup>
import { computed, reactive, ref, watch} from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { dimensions } from '../../data/dimensions.js';
import redSkull from '../../assets/red-skull.png';
import ascensionIcon from '../../assets/ascension.png';

import { useAbysses } from '../../composables/battleUtils/useAbyss.js';
import { useSingularity } from '../../composables/battleUtils/useSingularity.js';
import { useResets } from '../../composables/battleUtils/useResets.js';

import SvgIcon from '../svgIcon.vue';
import { getSvgIconHTML } from "../../composables/svgIcon.js"
import { fn } from '../../composables/utils/global.js';



import {
  infinityMilestones,
  singularityMilestones,
  abyssMilestones,
} from "../../data/infinityMilestones.js";
import { useRebirths } from '../../composables/battleUtils/useRebirth.js';
import { useProgressions } from '../../composables/battleUtils/useProgression.js';
import { useAscensions } from '../../composables/battleUtils/useAscension.js';
import { useDimensions } from '../../composables/battleUtils/useDimensions.js';

const {
  abyssRewardList
} = useAbysses();

const {
  getTotalSp,
  singStageReq,
  enemyShardsMult
} = useSingularity();

const {
  performAscension,
  performRebirth,
  performAbyss,
  performInf,
  performSoulD,
  performSingularity,
  dsGain
} = useResets()

const {
  calculateRebirthTier
} = useRebirths();

const {
  singPower
} = useSingularity();

const {
  refreshKillsPerZone
} = useProgressions();

const {
  perksHandler
} = useAscensions();

const {
  getDimSpecialReward
} = useDimensions()


const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();




function performSingShards() {
  hero.value.gravity.isTrial = !hero.value.gravity.isTrial;
  hero.value.kills = 0;
  hero.value.killsPerZone = 1e7;
  hero.value.stages.current = 300;
}

function canShowAscension(h) {
  return h.stages.current >= 10 && 
  h.dId !== 'bh' &&
  h.dId !== 'dimMerge'
}

function canShowRebirth(h) {
  return (
    h.level >= 100 &&
    !h.isSingularity &&
    h.dId !== 'bh' &&
    h.dId !== 'dimMerge'
  );
}

function canShowAbyss(h) {
  if (h.dId === 'bh') return false;
  if (h.isSingularity) return false;
  if (h.dId === 'hard') return false;
  if (h.dId === 'dimMerge') return false;

  return (
    (h.abyssTier < 3 && h.soulsMax >= 20 + 10 * h.abyssTier) ||
    h.spCount >= 15
  );
}

function canShowSoul(h) {
  return (
    (h.infExpansions.soul) &&
    !h.isSingularity &&
    h.dId !== 'soulD' &&
    h.dId !== 'bh' && 
    h.dId !== 'c-soulD' &&
    h.dId !== 'dimMerge'
  );
}

function canShowInfinity(h) {
  return (
    !h.infProgress &&
    h.dId === 'main' &&
    !h.isSingularity &&
    h.mainInfTier < h.mainInfTierCap &&
    h.dId !== 'dimMerge' &&
    h.infUnlocked
  );
}

function canShowSingularity(h) {
  return (
    h.dId === 'main' &&
    !h.isAbyss &&
    h.mainInfTier >= 7 + 2 * Math.min(h.singularity, 7) &&
    h.singularityKills < 100 &&
    h.dId !== 'dimMerge'
  );
}

function canShowSingShards(h) {
  return (
    h.dId === 'main' &&
    !h.isAbyss &&
    h.stages.current >= 300 &&
    h.dId !== 'dimMerge' &&
    h.bhTier >= 5
  );
}

function ascensionContent () {
  let text = `<p style="color: #0011ff; font-weight: bold">Ascension</p>
  <p>Reset to stage 1, but you will lose Level, Tree and Equipment progression.</p>`;

  text += `<p>Total shards: ${ fn(hero.value.totalAscensionShards) } `;
  if(hero.value.ascendShardPerform > 0)
    text += `<span>[+${fn(hero.value.ascendShardPerform)} after Ascension]</span> 💠</p> `;
  else text += `💠</p>`;

  if(getDimSpecialReward(9) && hero.value.dId == 'main')
    text += `<p>Now you are available to get <span style="color: #fe41fe">Dimension Shards <strong>[DS]</strong></span>. 
  Reach Stage ${dsGain()} and Ascend to gain <span style="color: #fe41fe">1 DS</span></p>`;

  return text;
}

function rebirthContent () {
  let text = `<p style="color: #00ff80; font-weight: bold">Rebirth</p>`;

  if(!hero.value.infExpansions.rebirth)
    text += `<span>You are affected by <span style="color: red">Rebirth Suppression</span><br>
    <span>You reached the Limit of Max Level. Rebirth to break this Limit</span><br><br>`;

  text += `<span>Reset to stage 1, but you will reset Levels, Tree, Equipment and Soul progression</span><br><br>`;


  let rebirth = calculateRebirthTier(hero.value.level, hero.value.rebirthTier);

  if(rebirth > 0)
    text += `<span>+${rebirth} Rebirth Tier after Reset</span><br><br>`;
    

  if(hero.value.rebirthPts < 1e5)
    text += `Gain ${fn(hero.value.totalRebirthPts)} Rebirth Pts after Reset`;

  return text;
}

function abyssContent () {
  let text = '';

  if(hero.value.abyssTier < 3)
    text += `<p style="color: #f942f9; font-weight: bold">Abyss [T${hero.value.abyssTier}]</p>`;
  else text += `<p style="color: #f942f9; font-weight: bold">Abyss-D</p>`;

  text += `<p>${abyssMilestones[hero.value.abyssTier].description}`;
  if (hero.value.abyssTier >= 3) text += `. Reduced Essense gain by [^${fn(0.25 + perksHandler(46))}]`;
  text += '</p>';
  text += `<p>${abyssMilestones[hero.value.abyssTier].reward}</p>`;

  if(hero.value.abyssDStages >= 100 && hero.value.dId != 'abyss-d') 
    text += `<span style="color: #f942f9; font-weight: bold">You've reached max Stage in D-Abyss. Find another way to progress.</span><br><br>`

  if(hero.value.abyssTier >= 3)
    text += `<span>Max Stage: ${hero.value.abyssDStages}</span>
    <p>${abyssRewardList()}</p>`;
  
  if(hero.value.isAbyss)
    text += `Click to leave or Complete The Abyss when you reach a certain Stage.`;
  
  return text;
}

function infinityContent () {
  let t = hero.value.mainInfTier;
  let color = t < 60? 'gold': '#cc66ff';
  let level = hero.value.infTierLevelReq;


  let text = `<span style="color: ${color}"><strong>Infinity [T${hero.value.mainInfTier}]</strong></span>`;

  if(t < 60)
    text += `<p>You have become The Omnipotent ,but <span style="color: gold">[D-Infinity]</span> seeks to prevent you from shattering a fragment of its creation.</p>`;
  else text += `<p><span style="color: ${color}; font-weight: bold">[D-Corruption]</span> interfere with the structure of the <span style="color: gold">[D-Infinity]</span> by altering behavior.`

  
  if(t < 23)
    text += `<p>${ infinityMilestones[t].description }</p>`;
  
  text += `<p>Press the button, your progress will reset and you will face a Trial with [EXP Gain] and [Max Level] reduced by <span style='color: red'>^${(hero.value.infPower).toFixed(2)}</span>.
  Once you reach Level <span style="color: ${color}">${level}</span> you will receive <span style='color: ${color}'>Infinity [T${hero.value.mainInfTier + 1}]</span>.`;

  if(t >= 20)
    text += `<p>The <span style="color: gold">[D-Infinity]</span> gathers its forces and will cast <span style="color: red">[Prediction]</span> on you every 5 Infinity Tiers</p>`;

  return text;
}

function souldContent () {
  let text = `<p style="color: #e100ffcc; font-weight: bold">D-Soul</p>
  <p>Enter a sub-space where souls have 100% appearance, but are stronger than regular souls. <strong>Souls do not drop Loot</strong></p>`;

  if(hero.value.selectedDivSkills.includes(11))
    text += `<p>D-Soul is blocked due to <span style='color: #00ffea'>Soul Eclipse</span></p>`;
  
  if(hero.value.selectedDivSkills.includes(6))
    text += `<p>D-Soul is blocked due to <span style='color: #00ffea'>The basis of the Limit</p>`;

  if(hero.value.souls >= hero.value.soulsCap)
    text += `<p>D-Soul is blocked due to <span style='color: #f424fb'>Soul Cap</p>`;
  
  if(hero.value.stages.current < 15)
    text += `<p>D-Soul is blocked. You can enter from stage 15</p>`;




  return text;
}

function singularityContent () {
  let text = '';

  if(hero.value.singularity < 8)
    text += `<p style="color: cyan"><strong>Singularity [T${hero.value.singularity}]</strong></p>`;
  else text += `<p style="color: cyan"><strong>Singularity BH</strong></p>`

  text += `<p>Dive into the edge of the Black Hole ruled by <span style="color: cyan">[D-Gravity]</span>.</p>`;
  text += `<p>${ singularityMilestones[hero.value.singularity].challenge }</p>`;

  if(hero.value.isSingularity)
    text += `Singularity increases the [Enemy Power] depending on the number of enemies killed: <span style="color: cyan">${fn(singPower())}<br><br></span>`;
  
  if(hero.value.singularity < 8)
  text += `<p>Perform the singularity to obtain: ${singularityMilestones[hero.value.singularity].reward}</p>`;

  if(hero.value.singularity >= 8) {
    text += `<span>Max kills: ${hero.value.singularityKills}</span><br>`; 
  }
  if (hero.value.singularity >= 8 && hero.value.isSingularity) {
    text += `<span>Total SP: <b>${fn(getTotalSp())}</b></span><br><br>`
  }
    
  if(hero.value.eLevel < 700 && !hero.value.isSingularity)
    text += `<span>Reach Level 700 to Enter the Singularity</span><br>`;
  
  if(hero.value.isSingularity)
    text += `<span>Click to leave the Singularity</span>`;
  
  return text;
}

function singShardsContent () {
  let text = '';

  if (hero.value.stages.current < 300) return 'Reach Stage 300';

  text += `<p style="color: cyan"><strong>Singularity [D-S]</strong></p>`;

  text += `<p>You've realized the full weight of this world. Gravity itself is yours to command. 
    Enter the critical point of the singularity itself. 
    By harnessing this point, you'll obtain a <b style="color: cyan">Singularity Shard</b>. 
    Each <b style="color: cyan">Singularity Shard</b> increases the strength of your enemies and the kill requirements.</p>
    
    <p style="color: cyan"><b>Objective: To find out what is beyond this world.</b></p>`;

  text += `<p>Base Stage Requirement: +${fn(singStageReq(false))}</p>
  <p>Enemy HP: ${fn(enemyShardsMult(false).hp)} | Enemy DMG: ${fn(enemyShardsMult(false).dmg)}</p>`

  return text;
}


</script>

<style scoped>
.progress-header {
  display: flex;
  align-items: center;
  gap: 8px; 
}

.hidden {
  visibility: hidden; 
  opacity: 0;          
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

.btnRebirth:hover .rebirth-tooltip, .btnAbyss:hover .abyss-tooltip, .btnInf:hover .inf-tooltip, .btnSoul:hover .soul-tooltip, .btnSingularity:hover .singularity-tooltip {
  display: block;
}

.ascend-tooltip, .rebirth-tooltip, .abyss-tooltip, .inf-tooltip, .soul-tooltip, .singularity-tooltip {
  display: none;
  position: absolute;
  
  top: 500%;
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

  overflow-y: auto;
  max-height: 300px;
}

.ascend-tooltip {
  box-shadow: 0 0 10px #0011ffcc;
}

.rebirth-tooltip {
  box-shadow: 0 0 10px rgba(21, 255, 0, 0.8); 
}

.abyss-tooltip {
  box-shadow: 0 0 10px rgba(225, 0, 255, 0.8);
  top: 650%;
}

.soul-tooltip {
  box-shadow: 0 0 10px #e100ffcc;
}

.inf-tooltip {
  box-shadow: 0 0 10px rgb(238, 255, 0);
  top: 550%;
}

.singularity-shadow {
  box-shadow: 0 0 12px 4px #66ffcc;
  top: 600%;
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