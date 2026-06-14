<template>
  <div class="zone-progress-header">
    <div class="left-icons">
      <div class="tooltip-wrapper-corr" v-if="hero.spaceUnlocked">
        <span
          class="tooltip-icon-corr"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('CorrInfluence', '1.25em')"
        ></span>
        <div class="corruption-tooltip-corr">
          <div
            class="corruption-tooltip-content-corr"
            v-html="corruptionInfluence()"
          ></div>
        </div>
      </div>

      <Tooltip v-if="hero.tr.count >= 1 || hero.bhTier > 0" :text="() => transcendenceEffects()" boxShadow="0 0 10px cyan" position="right-top">
        <span>🌀</span>
      </Tooltip>

      <Tooltip :text="() => timePenaltyEffect()" boxShadow="0 0 10px gold" position="right-top">
        <span v-if="hero.timePenalty">🕐</span>
      </Tooltip>
    </div>

    <div class="progress-center" v-if="!hero.dId.startsWith('d-')">
      <span class="progress-text">Progress</span>
    </div>

    <div class="right-icons tooltip-content">
      <Tooltip :text="() => darkSpaceHandle()" boxShadow="0 0 10px gold">
        <span
          v-if="hero.dId == 'd-noSpace'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('celestials', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => unlimitedDimHandle()" boxShadow="0 0 10px red">
        <span
          v-if="hero.dId == 'd-unlimitted'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('maxLevelReduction', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => noEqDimHandle()" boxShadow="0 0 10px orange">
        <span
          v-if="hero.dId == 'd-noEq' || hero.darkId.includes('d-noEq')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('forge', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => apsHandle()" boxShadow="0 0 10px red">
        <span
          v-if="hero.dId == 'd-noAps'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('apsPenalty', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => dInfTreeHandle()" boxShadow="0 0 10px lightgreen">
        <span
          v-if="hero.dId == 'd-noTree' || hero.darkId.includes('d-noTree')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('infTree', '1.25em')"
        ></span>
      </Tooltip>
      
      
      <Tooltip :text="() => bleedingVeilHandle()" boxShadow="0 0 10px red">
        <span
          v-if="hero.dId == 'd-survival-2'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('bleedingVeil', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => nextDimHandle()" boxShadow="0 0 10px blue">
        <span
          v-if="hero.dId == 'd-next' || hero.darkId.includes('d-next')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('nextDim2', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => dBuffsHandle()" boxShadow="0 0 10px yellow">
        <span
          v-if="hero.darkId.includes('d-noBuffs')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('dBuffs', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => darkEnergyHandle()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId == 'd-overstage'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('darkEnergy', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => darkEnemyHandle()" boxShadow="0 0 10px orange">
        <span
          v-if="hero.dId == 'd-danger'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('darkDangerEnemy', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => doomHandle()" boxShadow="0 0 10px #af1b0b">
        <span
          v-if="hero.dId == 'd-damage' || hero.darkId.includes('d-damage')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('doom', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => dHardHandle()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId == 'd-hard' || hero.darkId.includes('d-hard')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('cursePower', '1.25em')"
        ></span>
      </Tooltip>
      
      <Tooltip :text="() => corruptionHandle()" boxShadow="0 0 10px purple">
        <span
          v-if="
            hero.dId == 'd-corruption' || hero.darkId.includes('d-corruption')
          "
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('corruptionDim', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => firstHelp()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId == 'main' && hero.mainInfTier < 10"
          >
          🌐
          </span
        >
      </Tooltip>

      <Tooltip :text="() => deathRecovery()" boxShadow="0 0 10px blue">
        <span v-if="hero.stages.current > 100">☠️</span>
      </Tooltip>

      <Tooltip :text="() => infHandle()" boxShadow="0 0 10px gold">
        <span
          v-if="hero.infProgress"
          class="infinity-glow"
          >
          ∞
          </span
        >
      </Tooltip>

      <Tooltip :text="() => dimsEffect()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId != 'main' && dimsEffect()"
          >
          🌐
          </span
        >
      </Tooltip>

      <Tooltip :text="() => timelineHandle()" boxShadow="0 0 10px yellow">
        <span
          v-if="hero.dId == 'advanceBH'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('advanceBH', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => stageHardCap()" boxShadow="0 0 10px rgb(0, 247, 255)">
        <span
          v-if="hero.stages.current >= hero.stages.max"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('singularity', '1.25em')"
        ></span>
      </Tooltip>


      <Tooltip :text="() => travellHandle()" boxShadow="0 0 10px blue">
        <span
          v-if="hero.isTravell && hero.travellPenalty > 1"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('traveller', '1.25em')"
        ></span>
      </Tooltip>

    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import { useHero } from "../../composables/useHero.js";
import { useEnemy } from "../../composables/useEnemy.js";
import { usePlayer } from "../../composables/utils/playerSetup.js";

import { dimensions } from "../../data/dimensions.js";

import SvgIcon from "../svgIcon.vue";
import { getSvgIconHTML } from "../../composables/svgIcon.js";
import { fn, timeFormat } from "../../composables/utils/global.js";

import { useInfinity } from '../../composables/battleUtils/useInfinity.js';
import { useSpecialStats } from '../../composables/battleUtils/useSpecialStats.js'
import { useDimensions } from "../../composables/battleUtils/useDimensions.js";
import { useBaseEnemy } from "../../composables/utils/enemySetup.js";
import { useAbysses } from "../../composables/battleUtils/useAbyss.js";
import { useTimeline } from "../../composables/battleUtils/dims/useTimeline.js";
import { useVoid } from "../../composables/battleUtils/dims/useVoid.js";
import { newicons } from "../../composables/icons.js";


const { hero } = useHero();
const { enemy } = useEnemy();
const { player } = usePlayer();
const { villian } = useBaseEnemy();

const {
  voidEffects
} = useVoid();

const {
  infPenalties
} = useInfinity();

const { 
  getDimEffect
} = useDimensions();

const {
  getCorruptionSourses
} = useSpecialStats();

const {
  corrInflueceHandle
} = useAbysses();

const {
  timelineReq
} = useTimeline();

function deathRecovery() {
  let text = `At this stage, the world suppresses your excessive power, making recovery 
  after death take longer by <span style="color: red">[${fn(1 + 0.01 * Math.max(hero.value.stages.current - 100, 0))}]</span> times`;

  return text;
}

function infHandle() {
  const h = hero.value;

  let penalty = Math.max(Math.min(h.infPower, 1), 0);
  let t = h.infTier;
  let color = t < 60? 'gold': '#cc66ff';

  let req = (h.dId.startsWith('d-')? 1400: h.infTierLevelReq);
  let text = ``;

  if (h.dId != 'advanceBH' && h.dId != 'dimMerge')
    text = `<span style="color: #feed8a">Reach Total Level <b style="color: ${color}">${req}</b> to complete the Infinity Trial</span><br>`

  text += `<span style="color: #feed8a">Penalty for this trial: 
  Max Level: <span style='color: red'>[^${penalty.toFixed(2)}]</span>
  EXP Gain: <span style='color: red'>[^${penalty.toFixed(2)}]</span></span><br>`
  
  if(t >= 20)
    text += `<span style="color: #ff6666; font-weight: bold">[Predictions]</span>
    <span style="color: gold">Reduce Starudust Drop by </span> <span style="color: #ff6666; font-weight: bold">${fn(infPenalties().stardust)}</span><br>`;
  if(t >= 25)
    text += `<span style="color: #b6ff00">Reduce Mutagen Drop by</span> <span style="color: #ff6666; font-weight: bold">${fn(infPenalties().mutagen)}</span><br>`;
  if(t >= 30)
    text += `<span style="color: #f9453f">Resonanse [Curses]: <span style="color: #ff6666; font-weight: bold">${fn(infPenalties().curseMult)}</span><br>`;

  text += `<span style="color:#bfbfbf; font-style:italic; font-size:0.85em;">These effects apply only during Infinity Trials.</span><br><br>`;
  
  if(h.infPenalty > 0)
    text += `<span style="color: #feed8a">Infinity Resistance: <b style="color: gold">[${fn(h.infPenalty)}]</b></span>`;
  
  return text;
}

function darkEnergyHandle() {
  let text = `Kill all <b style="color: cyan">[Obscurants]</b> to advance to the next <span style='color: gold'>Infinity Tier</span><br><br>`;
  text += `<b style="color: cyan">[Obscurants]</b>: ${enemy.value.darkEnergy.totalBosses} / ${enemy.value.darkEnergy.maxBosses}<br>`;

  if (enemy.value.darkEnergy.totalBosses < enemy.value.darkEnergy.maxBosses)
    text += `Stage: <span style='color: gold'>${
      100 + 5 * enemy.value.darkEnergy.totalBosses
    }</span>`;
  else
    text += `All <span style="color: cyan">[Obscurants]</span> are found`;

  return text;
}

function doomHandle() {
  let text = `When you kill an enemy, you gain a stack of <span style="color: red">[Doom]</span>. Each stack reduces your stats.

    Current stacks: <span style="color: red; font-weight: bond">${villian.value.status.dims.ddamage.kills}</span>

    <span style="color: red">DMG [Penalty]: ${fn(getDimEffect(28).dmg)}</span>
    <span style="color: lightgreen">HP [Penalty]: ${fn(getDimEffect(28).stats)}</span>
    <span style="color: yellow">DEF [Penalty]: ${fn(getDimEffect(28).stats)}</span>
  `;

  if (dimensions.value[28].infTier >= 20)
    text += `<br>You have a 50% chance not to receive a stack of <span style="color: red">*Doom*</span> when you kill.`;
  else if (dimensions.value[28].infTier >= 10)
    text += `<br>You have a 25% chance not to receive a stack of <span style="color: red">*Doom*</span> when you kill.`;

  return text;
}

function darkEnemyHandle() {
  let tier = dimensions.value[31].infTier;
  let danger = 1000 + 500 * tier;
  let stage = 100 + 10 * tier;

  
  let text = `Find <span style="color: orange">Dimension Colossuses</span> to advance to the next <span style="color: gold">Infinity Tier</span><br><br>`;
  if (enemy.value.specialCreatures['ddim' + (tier + 1)]?.req === undefined)
    text += `<b style="color: orange">All creatures from the Dark Dimension was found</b>`;
  else if (enemy.value.specialCreatures['ddim' + (tier + 1)].req)
    text += `<b style="color: orange">A being from the Dark Dimension was found</b>`;
  else 
    text += `Requirement: 
  Danger: <span style="color: gold">[${danger}+]</span>
  Stage: <span style="color: gold">[${stage}+]</span>
  `;


  return text;
}

function nextDimHandle() {
  let stage = Math.max(30 - dimensions.value[34].infTier, 1);
  let maxStage = 30 + 5 * dimensions.value[34].infTier;
  if (hero.value.dId == "d-next")
    return `This world has been shattered by gravity. Your maximum possible stage is <span style="color: red">${stage}</span>.`;
  if (hero.value.darkId.includes("d-next"))
    return `You Max possible Stage is <span style="color: gold">${maxStage}</span>`;

  return "";
}

function bleedingVeilHandle() {
  return `<span style='color: #c31414'>[Bleeding Veil]</span>

    You are affected by the <span style="color: #F8686A">[Bleeding Veil]</span> effect and take <span style="color: #F8686A">${fn(player.value.status.dims.veil.damage)}</span> DMG per second
    The power of <span style='color: #c31414'>[Bleeding Veil]</span> increases with each stage passed.
  `;
}

function corruptionHandle() {
  let text = `<span style="color: violet">While you are affected by corruption:</span><br>`;

  text += `<span style="color: red">Enemy DMG: </span> <b style="color: gold">${fn(getDimEffect(26).dmg)}</b><br>`;
  text += `<span style="color: lightgreen">Enemy HP: </span> <b style="color: gold">${fn(getDimEffect(26).hp)}</b><br>`;
  if (getDimEffect(26).corr > 1)
    text += `<span style="color: #d537d5">Increase Max Level Penalty by</span> <b style="color: gold">${fn(getDimEffect(26).corr)}</b><br>`;
  text += "<span style='font-size: 11px; color: #ffb3b3;'>Tip: The corruption weakness will lead to a reduction in these indicators.</span>"

  return text;
}

function dHardHandle() {
  let resonance = getDimEffect(27);
  let text = `<span style="color: #ff4d4d">Curse [Resonance]</span>: <span style="color: red">x${fn(resonance)}</span>`;

  return text;
}

function dBuffsHandle() {
  let descrease = Math.min(Math.log(1 + dimensions.value[32].infTier) ** 4, 80);

  let text = `Skills appearance chance: <span style='color: yellow'>${(
    100 - descrease
  ).toFixed(2)}</span>`;

  return text;
}

function dInfTreeHandle() {
  let mult = 1;

  if (hero.value.dId == "d-noTree")
    mult = getDimEffect(35).dId;
  else if (hero.value.darkId.includes("d-noTree"))
    mult = getDimEffect(35).darkId;

  let text = `Infinity Nodes Cost: <span style="color: gold">${fn(mult)}<span>`;

  return text;
}

function apsHandle() {
  let text = `AS Penalty: <span style="color: red">-${fn(getDimEffect(39).aps)}</span>
  Enemy AS: <span style="color: yellow">+${fn(getDimEffect(39).vaps)}</span>`;

  return text;
}

function noEqDimHandle() {
  let dark_d_penalty =
    hero.value.dId == "d-noEq"
      ? (Math.E * (dimensions.value[36].infTier + 1)) ** 1.3
      : 1;
  dark_d_penalty = hero.value.darkId.includes("d-noEq")
    ? Math.max(Math.E ** (1.3 - 0.015 * dimensions.value[36].infTier), 1)
    : dark_d_penalty;

  let text = `Enhances Cost: <span style="color: gold">*${fn(
    dark_d_penalty
  )}</span>`;
  if (hero.value.darkId.includes("d-noEq"))
    text += `<br>Your possible Max Equipment Tier is <span style="color: rgb(0, 255, 255)">${
      dimensions.value[36].infTier + 1
    }</span>`;

  return text;
}

function unlimitedDimHandle() {
  let text = `Max Level Reduction: <span style="color: red">${fn(getDimEffect(38))}</span>`;

  return text;
}

function stageHardCap() {
  return `<span style="color: rgb(0, 255, 255)">Your knowledge of this world is too small, perhaps [D-Gravity] will give you a hint</span>`;
}

function darkSpaceHandle() {
  let power = (Math.E * (1 + dimensions.value[37].infTier)) ** 1.75;
  let count = 6 * (dimensions.value[37].infTier + 1);
  let text = `Celestials are <span style="color: gold">${fn(
    power
  )}</span> times stronger<br>`;
  text += `Beat <span style="color: gold">${
    hero.value.spCount + hero.value.spsCount
  } / ${count}</span> celestials to advance to the next Infinity Tier`;

  return text;
}

function travellHandle() {
  let text = `<span style="color: lightblue">Travel Effect</span>
  
  Enemies are stronger by <span style="color: red">${hero.value.travellPenalty.toFixed(
    2
  )}</span>.
  `;
  if (hero.value.dId.startsWith("d-"))
    text += `<br>While you are in the Dark Dimension, the effect of the travell is worse and extends to other effects:
    - The effect of Corruption is doubled
    - The effect of Curse is doubled
    - Increase the effect of Doom`;

  return text;
}


function corruptionEffect() {
  let corruption =
    (hero.value.dId.startsWith('d-')
      ? Math.min(hero.value.corruption.total, hero.value.corruption.dcap)
      : Math.min(hero.value.corruption.total, hero.value.corruption.cap));

  let text = `
  <div style="font-size: 14px; line-height: 1.35;">
    
    <div style="margin-bottom: 6px;">
      <span style="color:#ee29ff; font-weight: 600;">Corruption</span> — 
      a subtle influence of <span style="color:#ee29ff;">[D-Corruption]</span> that affects you.
    </div>

    <div style="margin-bottom: 10px;">
      <span style="color:#ee29ff; font-weight: 600;">Corruption</span> reduces your <span style="color:rgb(159, 255, 127);">Max Level</span> by
      <span style="color:#ff6b6b; font-weight: 600;">×${(
        getCorruptionEffect()
      ).toFixed(2)}</span> after level 300.<br>
      <span>If you die, you lose <b style="color: red">${fn(hero.value.corruption.killsLose * 100)}%</b> of stage kills</span>
    </div>

    <div style="margin-bottom: 8px;">
      <span style="color:#ee29ff; font-weight: 900;">Corruption:</span>
      <span style="color:#ee29ff;">${fn(corruption)}</span>
    </div>

    <div style="margin-top: 10px; font-weight: 600; color:#bbbbbb;">Sources:</div>

    <div style="margin-top: 4px;">
      <div>Base — <span style="color:#fff;">0.1</span></div>

      <div><span style="color: lightgreen;">Rebirth</span> — 
        <span style="color: lightgreen;">${fn(getCorruptionSourses("rebirth"))}</span>
      </div>

      <div><span style="color: #d88bff;">Abyss</span> — 
        <span style="color: #d88bff;">${fn(getCorruptionSourses("abyss"))}</span>
      </div>

      <div><span style="color: #b6ff00;">Radiation</span> — 
        <span style="color: #b6ff00;">${fn(getCorruptionSourses("rad"))}</span>
      </div>

      <div><span style="color: orange;">Space</span> — 
        <span style="color: orange;">${fn(getCorruptionSourses("space"))}</span>
      </div>`;

      if(hero.value.mainInfTier >= 5) {
        text += `<div><span style="color: gold;">Infinity</span> — 
          <span style="color: gold;">${fn(getCorruptionSourses("inf"))}</span>
        </div>`
      }
      if(dimensions.value[22].infTier > 25) {
        text += `<div><span style="color: #ad7bff;">Dimensions</span> — 
          <span style="color: #ad7bff;">${fn(getCorruptionSourses("dim"))}</span>
        </div>`
      }
      
        text += `<div><span style="color:#eeff04;">Total</span> — 
        <span style="color: #eeff04;">${fn(hero.value.corruption.total)}</span>
      </div>
    </div>

  </div>
  `;

  return text;
}

function getCorruptionEffect() {
  if(hero.value.dId.startsWith('d-')){
    let mult = getDimEffect(26).corr;
    let dCorruption = Math.min(hero.value.corruption.total, hero.value.corruption.dcap) * 0.1;

    return dCorruption / mult;
  } else {
    let corruption = Math.min(hero.value.corruption.total, hero.value.corruption.cap)
    return Math.max(1 - corruption, 0);
  }
}

function corruptionInfluence() {
  let corrInfDims = ['advanceBH', 'dimMerge'];

  if (!hero.value.dId.startsWith('c-') && 
  !corrInfDims.includes(hero.value.dId)) return corruptionEffect();

  let text = `<span style="color: #d8b4fe"><span style='color:#ee29ff'>Corruption Influence</span> – the overwhelming impact of 
    <span style='color:#ee29ff'>[D-Corruption]</span> that distorts aspects of reality.</span><br><br>
    <span style='color:#ee29ff'>Corruption Influence: </span><span style='color:red'>${hero.value.corrInfluence}%</span><br><br>`;

  const corr = hero.value.corrInfluence;

  const effects = [
    {
      t: 5,
      d: "+1% Enemy HP and DMG per completed Stage per Corruption Influence",
      v: () => `(${fn(corrInflueceHandle(0).hp)}) (${fn(corrInflueceHandle(0).dmg)})`,
    },
    {
      t: 10,
      d: "+0.0025 Base stage requirement per Corruption Influence",
      v: () => `${fn(corrInflueceHandle(1))}`,
    },
    {
      t: 15,
      d: "Increse the Level Requirement per Corruption Influence",
      v: () => `${fn(corrInflueceHandle(2))}`,
    },
    {
      t: 20,
      d: "Stats weaken based on your total deaths this trial per Corruption Influence",
      v: () => `${fn(corrInflueceHandle(3))}`,
    },
    {
      t: 25,
      d: "IP scales worse per used Skill",
      v: () => `${fn(corrInflueceHandle(4))}`,
    },
    {
      t: 30,
      d: "-1% CRIT and 0.1 CRIT DMG per Corruption Influence",
      v: () => `(${fn(corrInflueceHandle(5).crit)}) (${fn(corrInflueceHandle(5).critDmg)})`,
    },
    { t: 35, d: "You cannot receive Tiers from Rebirth", v: null },
    {
      t: 40,
      d: "Enhancements decrease per Corruption Influence",
      v: () => `${fn(corrInflueceHandle(7))}`,
    },
    {
      t: 45,
      d: "Increase stage kill loss per Corruption Inluence.",
      v: () => `${fn(corrInflueceHandle(8))}`,
    },
    { t: 50, d: "Quasar Powers are becoming weaker per Corruption Influence", 
      v: () => `${fn(corrInflueceHandle(9))}` },
    { t: 55, d: "Celestials grant no SP", v: null },
    { t: 60, d: "Max Level Reduction depends on the difference between the Max Level and the Current One.", 
      v: () => `${fn(corrInflueceHandle(11))}` },
    { t: 65, d: "Equipment Drop Chance is lower per Corruption Influence", 
      v: () => `${fn(corrInflueceHandle(12))}` },
    {
      t: 70,
      d: "You gain less EXP",
      v: () => `^${fn(corrInflueceHandle(13))}`,
    },
    { t: 75, d: "On death: Reset the 10% of stage kills", v: null },
    { t: 80, d: "On death: You lose 10 Levels", v: null },
    { t: 85, d: "Healing is disabled", v: null },
    { t: 90, d: "DEF is disabled", v: null },
    { t: 95, d: "Your Attack becomes 0", v: null },
    { t: 100, d: "Your Attack Speed becomes 0", v: null },
  ];

  effects.forEach((e) => {
    if (corr >= e.t) {
      const val = e.v ? e.v() : null;
      text += `<span style='color:#ee29ff'>${e.t}%</span>: <span style="color: #b8a9ff">${e.d}</span>`;
      if (val !== null) {
        text += ` <span style='color:red'>[${val}]</span>`;
      }
      text += "<br>";
    }
  });

  return text;
}

function transcendenceEffects() {
  const c = {
    title: '#67e8f9',
    text: '#c7f7ff',
  };

  let text = `
    <span style="color:${c.title}">Transcendence [Tr] </span>
    <span style="color:${c.text}">
      is the first path to overcome gravity and gain powers beyond ordinary existence.
      For every 70,000 True Levels, you gain 1
    </span>
    <span style="color:${c.title}"> [Tr]</span>.
    <br><br>

    <span style="color:${c.text}">
      Pass the
    </span>
    <span style="color:${c.title}"> [D-Gravity] </span>
    <span style="color:${c.text}"> 
      Trials to unlock new effects of 
    </span>
    <span style="color:${c.title}"> [Tr] </span>.
    <br><br>

    <span style="color:${c.text}"> 
      The power of these effects depends on the number of 
    </span>
    <span style="color:${c.title}"> [Tr] </span>.
    <br><br>

    <span style="color:${c.title}"> [Tr] </span>
    <span style="color:${c.text}">
      only exists in the Main Dimension and
    </span>
    <span style="color:${c.title}"> [Black Hole] </span>.
    <br><br>

    <span style="color:${c.text}">
      By entering the
    </span>
    <span style="color:${c.title}"> [Black Hole] </span>,
    <span style="color:${c.text}">
      you destroy your body and leave behind only your 
    </span>
    <span style="color:${c.title}"> [Tr] </span>
    <span style="color:${c.text}">
      energy.
    </span>
  `;

  if (hero.value.tr.spread > 0) {
    text += `
      <br><br>
      <span style="color:${c.title}"> [Tr] Spread</span>
      <span style="color:${c.text}">
        — allows
      </span>
      <span style="color:${c.title}"> [Tr] </span>
      <span style="color:${c.text}">
        to exist in all dimensions. 
      </span>
    `;
  }

  return text.replace(/\n\s*/g, '');
}

function dimsEffect() {
  let id = hero.value.dId;

  let text = `<span style="color: #f942f9; font-weight: bold">Dimensions Effect Statuses</span><br><br>`;

  switch(id) {
    case "gravity": {
      text += `Hero DMG: <span style="color: red">${fn(getDimEffect(2).dmg)}</span>
      Enemy HP: <span style="color: lightgreen">${fn(getDimEffect(2).hp)}</span>`;
      break;
    }
    case "overkill": {
      text += `Enemy DMG: <span style="color: red">${fn(getDimEffect(3).dmg)}</span>
      Enemy HP: <span style="color: lightgreen">${fn(getDimEffect(3).hp)}</span>`;
      break;
    }
    case "damage": {
      text += `Enemy DMG: <span style="color: red">${fn(getDimEffect(20).dmg)}</span>
      Enemy HP: <span style="color: lightgreen">${fn(getDimEffect(20).hp)}</span>
      The effect can be reset by Ascension or Rebirth.`
      break;
    }
    case "unlimitted": {
      text += `<span style="color: red">Level Rush is locked</span>
      <span style="color: red">Infinity Nodes cost twice as much.</span>`
      break;
    }
    case "dimMerge": {
      text += dimMergeEffect();
      break;
    }

    default: return "";
  }

  return text;
}

function firstHelp () {
  let text = `<span style="color: #f942f9; font-weight: bold">Dimensions Effect</span><br><br>`;

  text += `<p style="color:#f87171; text-align: justify; text-justify: inter-word; word-break: break-word;">Before unlocking the D-Atlas, you have:</p>
  <span style="color: lightgreen">x2 EXP MULT</span>
  <span style="color: orange">x2 SKILL EXP MULT</span>
  <span style="color: lightblue">x2 ASCENSION SHARDS MULT</span>
  <span style="color: lightgreen">x2 REBIRTHS PTS MULT</span>
  <span style="color: yellow">x2 STARDUST MULT</span>
  <span style="color: #b6ff00">x2 MUTAGEN MULT</span>`

  return text;
}

function dimMergeEffect () {

let labelColor = '#c95ec9';
let labelEffect = 'gold';
return (`
  <span style="color:#a78bfa;">
  Every passed stage strengthens the Void influence.
  </span><br><br>

  <span style="color: ${labelColor};">Stage Requirement: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(0))}</b><br>

  <span style="color:${labelColor};">Equipment Drop Chance Reduction: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(1))}</b><br>

  <span style="color:${labelColor};">Enhance Cost Reduction: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(2))}</b><br>

  <span style="color:${labelColor};">Level Requirement: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(3))}</b><br>

  <span style="color:${labelColor};">Min Level Decrease: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(4))}</b><br>

  <span style="color:${labelColor};">Enemy Power: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(5))}</b><br>

  <span style="color:${labelColor};">Soul Appearance Reduction: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(6))}</b><br>

  <span style="color:${labelColor};">Resonance Power: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(7))}</b><br>

  <span style="color:${labelColor};">Skill EXP Gain Reduction: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(8))}</b><br>

  <span style="color:${labelColor};">Corruption Influence: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(9))}</b><br>

  <span style="color:${labelColor};">Infinity Tier: </span>
  <b style="color:${labelEffect};">${fn(voidEffects(10))}</b><br><br>

  <span style="color:#f87171;"><b>Space Fights is locked</b></span><br>

  <span style="color:#f87171;"><b>Soul-D is locked</b></span><br>

  <span style="color:#f87171;"><b>Stage Travel is locked</b></span><br>

  <span style="color:#f87171;"><b>Stage Rush is locked</b></span><br>

  <span style="color:#f87171;"><b>Ascension Reset is locked</b></span><br>

  <span style="color:#f87171;"><b>Rebirth Reset is locked</b></span><br>
  `).replace(/\n\s*/g, '');
}

function timelineHandle () {
  let text = ``;
  let req = timelineReq();

  text += `<span style="color: #66ffcc; font-weight: bold;">Completion Conditions:</span><br>`;
  text += `<span style="color: #ffff66;">Stage</span>: <span style="color: white; font-weight: bold;">${req.stage}</span><br>`;
  text += `<span style="color: #ffff66;">Total Level</span>: <span style="color: white; font-weight: bold;">${req.level}</span>`;

  return text;
}

function timePenaltyEffect() {
  const remaining = Math.max(
    0,
    hero.value.maxTime - Date.now()
  );

  const endDate = new Date(hero.value.maxTime);

  return `<span style="color:#ff5555">You've entered a space-time anomaly. You can't obtain resources inside the anomaly. 
    You'll be able to exit the anomaly in</span><br><span style="color:gold">${timeFormat(remaining / 1000)}</span>
    Expires:<span style="color:#87cefa">${endDate.toLocaleString()}</span>`;
}


</script>

<style scoped>
.zone-progress-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  min-height: 3vh;
}

.left-icons,
.right-icons {
  display: flex;
  gap: 0.2rem;
  align-items: center;
}

.progress-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.progress-text {
  text-shadow: 0 0 4px #00ffea;
}

.tooltip-wrapper-corr {
  position: relative;
  display: inline-block;
  cursor: help;
}

.tooltip-icon-corr {
  display: inline-block;
  vertical-align: middle;
}

.corruption-tooltip-corr {
  position: absolute;
  top: 100%;
  left: 500%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 0 10px #ee29ff;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  min-width: 25vh;
}

.tooltip-wrapper-corr:hover .corruption-tooltip-corr {
  opacity: 1;
  pointer-events: auto;
}

.corruption-tooltip-content-corr {
  max-height: 25vh;
  max-width: 40vh;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.4;
  scrollbar-width: thin;
  scrollbar-color: #ee29ff rgba(0, 0, 0, 0.2);
}

.tr-card {
  width: 100%;
  max-width: 600px;
  background: linear-gradient(
    180deg,
    rgba(0, 20, 25, 0.6),
    rgba(2, 8, 12, 0.85)
  );
  border: 1px solid rgba(0, 255, 230, 0.08);
  border-left: 4px solid rgba(0, 255, 230, 0.16);
  padding: 14px;
  border-radius: 12px;
  color: #dffcff;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
}

.tr-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.tr-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(0, 255, 230, 0.03);
  color: #bffefe;
  border: 1px solid rgba(0, 255, 230, 0.06);
  font-weight: 600;
  font-size: 0.9rem;
}

.tr-badge--path {
  font-size: 1rem;
  letter-spacing: 0.4px;
  background: linear-gradient(
    90deg,
    rgba(0, 255, 230, 0.04),
    rgba(0, 150, 200, 0.02)
  );
  color: #d9ffff;
  border-left: 2px solid rgba(0, 255, 230, 0.2);
}

.tr-tag {
  margin-left: 6px;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(0, 255, 230, 0.08);
  color: #002b2a;
  font-weight: 700;
}

.tr-badges-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tr-body {
  margin-top: 6px;
}

.tr-line {
  margin: 0;
  color: #dffcff;
  font-size: 0.95rem;
}

.accent {
  color: #8ffdf0;
  font-weight: 700;
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
