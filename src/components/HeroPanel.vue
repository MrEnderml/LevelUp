<template>
  <div class="hero-wrapper">
    <div class="hero">
      <div class="hero-header">
        <Tooltip :text="() => stats()">
          <h3 style="color: white">🧝 *Hero</h3>
        </Tooltip>
        <div class="formations">
            <button
              v-for="(formation, index) in filterFormation"
              :key="formation.name"
              :class="[
                'formation-btn',
                { active: hero.activeFormation === formation.id },
              ]"
              @click="toggleFormation(formation.id)"
            >
              <Tooltip :text="formationD(formation)">
                {{ formation.icon }}
              </Tooltip>
            </button>
          </div>
      </div>
      <Tooltip :text="averageAttackHandle">
        <span
          :style="{ color: getAttackColor() }"
          @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Damage' }"
        >
          <sup style="font-size: 6px">ℹ️</sup>
          ⚔️ {{ formatNumber(getDisplayedAttack()) }}
        </span>
      </Tooltip>
      <span style="color: white" @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'DEF' }"> <sup style="font-size: 6px">ℹ️</sup>🛡️{{ formatNumber(def) }}</span>
      <div class="hp-bar" @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'HP' }">
        <div class="hp-progress" :style="{ width: `${(hp / maxHp) * 100}%` }">
          <span class="hp-text"
            ><sup style="font-size: 6px">ℹ️</sup>{{ formatNumber(hp) }} / {{ formatNumber(maxHp) }}</span
          >
        </div>
      </div>
      <!-- Attack speed bar -->
      <div class="attack-bar">
        <div
          class="attack-progress"
          :style="{ width: `${attackBarProgress * 100}%` }"
        ></div>
      </div>
      <div class="buff-header">
        <div>
          <span :class="[buffs[6].charges.power > 0? 'chargePower': 'charge']">
            [
              <Tooltip :text="'+5% DMG and +0.1 APS per charge'" boxShadow="0 0 10px red">
                <span class="svgCenter" v-html="getSvgIconHTML('redCharge', '1.5em')"></span>
              </Tooltip>
            {{buffs[6].charges.power}}]
          </span>
          <span :class="[buffs[6].charges.energy > 0? 'chargeEnergy': 'charge']">
            [
            <Tooltip :text="'+1 CRIT and +5 CRIT DMG per charge'" boxShadow="0 0 10px blue">
                <span class="svgCenter" v-html="getSvgIconHTML('blueCharge', '1.5em')"></span>
              </Tooltip>
            {{buffs[6].charges.energy}}]
          </span>
          <span :class="[buffs[6].charges.life > 0? 'chargeLife': 'charge']">
            [
            <Tooltip :text="'+5% HP and +5% DEF per charge'" boxShadow="0 0 10px green">
                <span class="svgCenter" v-html="getSvgIconHTML('greenCharge', '1.5em')"></span>
              </Tooltip>
            {{buffs[6].charges.life}}]
          </span>
        </div>

        <Tooltip :text="conquerHandle" boxShadow="0 0 10px gold">
          <div
            :class="[hero.activeBuffs.includes(8) ? 'conquerActive' : 'conquer']"
          >
            <span>🕐[{{ buffs[8].time.toFixed(0) }}]</span>
          </div>
        </Tooltip>

        <div
          :class="[
            hero.activeBuffs.includes(10) ? 'extraLifeActive' : 'extraLife',
          ]"
        >
          <span>❤️[{{ buffs[10].rise }}]</span>
        </div>

        <div
          :class="[
            buffs[10].buffT3 > 0
              ? 'extraLifeImmuneActive'
              : 'extraLifeImmune',
          ]"
        >
          <span>🧘[{{ buffs[10].buffT3.toFixed(0) }}]</span>
        </div>

        <div
          :class="[
            hero.activeBuffs.includes(12) && buffs[12].tier >= 4
              ? 'rageActive'
              : 'rage',
          ]"
        >
        <Tooltip :text="rageHandle" boxShadow="0 0 10px red" position="right">
          <span v-html="getSvgIconHTML('rage', '1.5em')"></span>
        </Tooltip>
        </div>

        <div
          :class="[
            hero.activeBuffs.includes(14) && buffs[14].tier >= 4
              ? 'extraHitActive'
              : 'extraHit',
          ]"
        >
        <Tooltip :text="`Extra hit(s) chance: ${Math.floor(buffs[14].extraHit)}%`" boxShadow="0 0 10px yellow">
          <span class="svgCenter" v-html="getSvgIconHTML('extraHit', '1.5em')"></span>
        </Tooltip>
        </div>
 
        <div
          :class="[
            hero.survivalLife > 0
              ? 'survivalLifeActive'
              : 'survivalLife',
          ]"
        >
        <Tooltip :text="survivalLevelHandle" boxShadow="0 0 10px lightgreen">
          <span class="svgCenter" v-html="getSvgIconHTML('survivalLife', '1.5em')"></span>
        </Tooltip>
        </div>

        <div
          :class="[
            hero.activeBuffs.includes(16) && buffs[16].tier >= 3
              ? 'irradiationActive'
              : 'irradiation',
          ]"
        >
        <Tooltip :text="irradiationHandle" boxShadow="0 0 10px #d4ff00">
          <span class="svgCenter" v-html="getSvgIconHTML('irradiation', '1.5em')"></span>
        </Tooltip>
        </div>

        <div
          :class="[
            hero.transcendenceBH > 0 && hero.dId == 'bh'
              ? 'transcendenceActive'
              : 'transcendence',
          ]"
        >
        <Tooltip :text="transcendenceHandle" boxShadow="0 0 10px rgb(0, 255, 242)">
          <span class="svgCenter">🌀</span>
        </Tooltip>
        </div>

        <Tooltip :text="comboHandle" boxShadow="0 0 10px orange">
          <div :class="[buffs[3].combo > 0 ? 'comboActive' : 'combo']">
            <span>⚡[{{ buffs[3].combo.toFixed(0) }}]</span>
          </div>
        </Tooltip>


      </div>
    </div>
    <div class="difficulty-box" v-if="hero.dId == 'survival'">
      <div class="controls">
        <button @click="decrease">➖</button>
        <span>Lv {{ hero.survivalLevel }}</span>
        <button @click="increase">➕</button>
      </div>
      <div class="effects">
        <p>
          🗡️ Hero DMG: <strong>-{{ damageReduction }}%</strong>
        </p>
        <p>
          ⏱️ Enemy APS: <strong>-{{ speedReduction }}%</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useHero } from "../composables/useHero.js";
import { useEnemy } from "../composables/useEnemy.js";
import { useBuff } from "../data/buffs.js";
import { dimensions } from "../data/dimensions.js";
import { getSvgIconHTML } from '../composables/SvgIcon.js';
import { perks } from '../data/ascension.js';

const { hero } = useHero();
const { enemy } = useEnemy();
const { buffs } = useBuff();

const props = defineProps({
  attackBarProgress: Number,
  attacksPerSecond: Number,
});

const hp = computed(() => hero.value.hp);
const maxHp = computed(() => hero.value.maxHp);
const attack = computed(() => hero.value.attack);
const def = computed(() => hero.value.def);


function formationD(f) {
  if(f.id == 0)
    return `<span style='color: lightgreen'>HP - x2</span> | <span style='color: red'>ATK - x0.5</span> | <span style='color: orange'>DEF - x0.5</span>`

  if(f.id == 2)
    return `<span style='color: orange'>DEF - x2</span> | <span style='color: lightgreen'>HP - x0.5</span> | <span style='color: red'>ATK - x0.5</span>`


  if(f.id == 1 && perks[62].level)
    return `<span style='color: red'>ATK - x4</span> | <span style='color: orange'>DEF - x0.25</span> | <span style='color: lightgreen'>HP - x0.25</span>`;
  else if(f.id == 1)
    return `<span style='color: red'>ATK - x2</span> | <span style='color: orange'>DEF - x0.5</span> | <span style='color: lightgreen'>HP - x0.5</span>`;

  const colors = {
    EXP: "#4ade80",              
    "BUFF EXP": "#facc15",       
    "Equipment Chance": "#38bdf8", 
    "Ascension Soul Shards": "blue", 
    "Stardust": "gold"        
  };

  const loot = [
    "EXP",
    "BUFF EXP",
    "Equipment Chance",
    "Ascension Soul Shards"
  ];

  if (hero.value.spCount >= 45) {
    loot.push("Stardust");
  }

  const coloredLoot = loot
    .map(item => `<span style="color:${colors[item]}">${item}</span>`)
    .join(", ");

  if (perks[59].level) {
    return `<span style='color: gold'>LOOT: x2</span> - ${coloredLoot}`;
  } else {
    return `<span style='color: orange'>DEF - x0.5</span> | <span style='color: lightgreen'>HP - x0.5</span> | <span style='color: red'>ATK - x0.5</span> | 
    <span style='color: gold'>LOOT: x2</span> - ${coloredLoot}`;
  }
}


function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, "") + suffix;
}

const filterFormation = computed(() =>
  hero.value.formationTypes.filter((f) => f.status === true)
);

function toggleFormation(index) {
  hero.value.activeFormation =
    hero.value.activeFormation === index ? null : index;
}

function stats() {
  let str = "";

  str += `💢<span>BASE CRIT: ${hero.value.crit.toFixed(1)}</span><br>`;
  str += `🔪<span>BASE CRIT DAMAGE: ${(hero.value.critAttack / 100).toFixed(1)}</span><br>`;
  str += `🤺<span>DODGE: ${Math.floor(hero.value.totalAvoid)}%</span><br>`;
  str += `💀<span>Overkill: ${Math.floor(hero.value.overkill - 1)}</span><br>`;
  str += `🥾<span>APS: ${hero.value.attacksPerSecond.toFixed(1)}</span><br>`;

  return str;
}


const maxLevel = 25;
const minLevel = 0;

const increase = () => {
  if (hero.value.survivalLevel < maxLevel) hero.value.survivalLevel++;
};

const decrease = () => {
  if (hero.value.survivalLevel > minLevel) hero.value.survivalLevel--;
};

const damageReduction = computed(() => (hero.value.survivalLevel * 4).toFixed(1));
const speedReduction = computed(() => (hero.value.survivalLevel * 2).toFixed(1));

function rageHandle() {
  return `
    Rage Mechanics:
    - Rage is accumulated through combat actions. Once Rage reaches 100, it starts to decay and cannot be accumulated again until it drops back to 0.

    Total Rage: ${Math.floor(buffs.value[12].rage)}

    Rage Gain:
    • +1 Rage on hit.
    • +3 Rage on critical hit.
    • +5 Rage when you are hit.
    • +5 Rage when you kill an enemy.
    • +10 Rage when you kill a boss.

    Rage Loss & Effects:
    • Lose 1 Rage on hit — Gain bonus damage multiplier by 1.01.
    • Lose 3 Rage when you are hit — Reduce incoming damage by 25%.
    • Lose 5 Rage per second when HP is below 30% — Increase healing effect by 25%.
    • Lose 100 Rage when you die.
  `;
}


function survivalLevelHandle() {
  return ` You will gain double stats while you have remaining attempts. You lose an attempt whenever you die.<br>
  Total attempts: ${hero.value.survivalLife}`
}

function irradiationHandle() {
  return `<span style="color:#d4ff00; font-weight:bold;">☢ Irradiation</span>
    Gain <span style="color:#d4ff00">+1 Radiation stack</span> on <span style="color:#ff5555">Hit</span>.<br>
    Current stacks: <span style="color:#d4ff00; font-weight:bold;"> ${buffs.value[16].stack}</span>
  `;
}

function transcendenceHandle() {
  let text = `Your current <span style="color: #00ffae">transcendence</span> is <span style="color: cyan">${hero.value.transcendenceBH}</span><br>
  Bonuses from <span style="color: #00ffae">transcendence:</span>`;

  if (hero.value.bhTier > 0) {
    text += `<br><span style="color: #00ffae">Max Level Mult: +${(0.1 * hero.value.transcendenceBH).toFixed(2)}</span>`;
  }
  if (hero.value.bhTier > 1) {
    text += `<br><span style="color: #ff5050">Increased DMG by ${(1 + 0.05 * hero.value.transcendenceBH).toFixed(2)}</span>`;
  }
  if (hero.value.bhTier > 2) {
    text += `<br><span style="color: lightgreen">Min Level: +${1 * hero.value.transcendenceBH} </span>`;
  }
  if (hero.value.bhTier > 3) {
    text += `<br><span style="color: #ffd700">IP MULT: +${(1 + 0.005 * hero.value.transcendenceBH).toFixed(2)} </span>`;
  }

  return text;
}

function comboHandle() {
  let text = ``;
  if (buffs.value[3].tier == 1)
    text = `<span style="color:rgb(241, 83, 83)">+1% DMG</span> per COMBO [<span style="color:rgb(243, 187, 33)">MAX- 30</span>]<br><span style="color: #FF9800">+1 COMBO</span> per hit<br>`;
  
  if (buffs.value[3].tier == 2)
    text = `<span style="color:rgb(241, 83, 83)">+1.25% DMG</span> per COMBO [<span style="color:rgb(243, 163, 33)">MAX- 40</span>]<br><span style="color: #FF9800">+1 COMBO</span> per hit [<span style="color: #9C27B0">50% chance</span> to get additional COMBO]<br>`;
  
  if (buffs.value[3].tier == 3)
    text = `<span style="color:rgb(241, 83, 83)">+1.5% DMG</span> per COMBO [<span style="color:rgb(243, 166, 33)">MAX- 50</span>]<br><span style="color: #FF9800">+1.5 COMBO</span> per hit<br>`;
  
  if (buffs.value[3].tier == 4)  
    text = `<span style="color:rgb(241, 83, 83)">+1.75% DMG</span> per COMBO [<span style="color:rgb(243, 173, 33)">MAX- 100</span>]<br><span style="color: #FF9800">+2 COMBO</span> per hit<br><span style="color:rgb(233, 30, 223)">+0.3 Attack per Second</span> when COMBO is MAX<br>`;  

  return text;
}

function conquerHandle() {
  let text = `Gain increased stats per second<br><br>`; 

  const b = buffs.value[8]; 

  if (b.tier >= 1)
    text += `Max HP: <span style="color: #4CAF50">${(0.1 * b.time).toFixed(1)}%</span><br>`;

  if (b.tier >= 2)
    text += `DMG: <span style="color: #F44336">${(0.1 * b.time).toFixed(1)}%</span><br>`;

  if (b.tier >= 3)
    text += `APS: <span style="color: #2196F3">${(0.1 * Math.floor(b.time / 250)).toFixed(1)}</span><br>`;

  if (b.tier >= 4) {
    text += `<br>Decreases enemy stats every 50 seconds<br>`;
    text += `Enemy weakness: <span style="color: #FF9800">${100 - Math.floor(b.time / 50)}%</span><br>`;
  }

  return text;
}

function averageAttackHandle() {
  return `
⚔️ Attack Stats
───────────────
🎯 Avg:     [${formatNumber(hero.value.averageAttack.avg)}]
🎯 Current: [${formatNumber(hero.value.averageAttack.currentAttack)}]

🔴 <span style="color: red">Red   - [CRIT] Critical Hit</span>
🟢 <span style="color: green">Green - [MISS] Attack Dodged/
    Attack Failed</span>
`;
}

function getDisplayedAttack() {
  let attackValue = 0;

  switch (hero.value.averageAttack.status) {
    case 0:
      attackValue = hero.value.averageAttack.avg;
      break;
    case 1: 
      attackValue = hero.value.averageAttack.currentAttack;
      break;
    default:
      attackValue = hero.value.averageAttack.avg;
  }

  return attackValue;
}

function getAttackColor() {
  if (hero.value.averageAttack.curseCrit) {
    return "limegreen"; 
  }
  if (hero.value.averageAttack.dodgeStatus) {
    return "limegreen"; 
  }
  if (hero.value.averageAttack.critStatus) {
    return "red"; 
  }
  return "white"; 
}





</script>

<style scoped>

.hero {
  width: 250px;
  border: 2px solid #4caf50;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
}

.hp-bar {
  width: 100%;
  height: 24px;
  background-color: #eee;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.hp-progress {
  height: 100%;
  background-color: #4caf50; /* или #f44336 для врага */
  border-radius: 5px;
  transition: width 0.3s ease;
}

.hp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #fff;
  font-size: 0.9rem;
  pointer-events: none;
  text-shadow: 0 0 1px #000, 0 0 2px #000, 0 0 3px #000, 1px 1px 0 #000,
    -1px -1px 0 #000;
}

.attack-bar {
  width: 100%;
  height: 10px;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.attack-progress {
  height: 100%;
  background-color: #ff9800;
  border-radius: 5px;
  transition: width 0.1s linear;
}

.comboActive,
.conquerActive {
  display: content;
  color: #fbbf24;
}

.chargePower {
  display: content;
  font-size: 14px;
  color:rgb(251, 57, 36);
}
.chargeEnergy {
  display: content;
  font-size: 14px;
  color:rgb(36, 208, 251);
}
.chargeLife {
  display: content;
  font-size: 14px;
  color:rgb(47, 251, 36);
}

.rageActive,
.extraHitActive,
.doomActive,
.survivalLifeActive,
.bleedingVeilActive,
.irradiationActive,
.transcendenceActive {
  display: content;
}

.combo,
.conquer,
.extraLife,
.extraLifeImmune,
.charge,
.rage,
.extraHit,
.doom,
.bleedingVeil,
.survivalLife,
.irradiation,
.transcendence {
  display: none;
}

.extraLifeActive,
.extraLifeImmuneActive {
  display: content;
  color: rgb(251, 61, 36);
}

.formations {
  display: flex;
  gap: 0.5rem;
}

.formation-btn {
  font-size: 14px;
  padding: 0.1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: 0.3s;
  box-shadow: none;
}

.formation-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.formation-btn.active {
  background: #66bb6a;
  color: white;
  border-color: #43a047;
  box-shadow: 0 0 10px #81c784;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.buff-header {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.difficulty-box {
  position: absolute;
  border: 2px solid #aaa;
  border-radius: 12px;
  padding: 12px;
  width: 250px;
  background: #222;
  color: #eee;
  font-family: "Orbitron", sans-serif;
  box-shadow: 0 0 8px #444;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.controls button {
  background-color: #444;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.effects p {
  margin: 4px 0;
}

.svgCenter {
  display: inline-block; 
  vertical-align: middle;
}
</style>
