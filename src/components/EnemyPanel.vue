<template>
  <div class="enemy">
    <h3
      :class="getEnemyNameClasses(enemy, hero)"
    >
      👾 {{ enemy.name }}
    </h3>

    <span style="color: white">⚔️ {{ formatNumber(attack) }}  </span>
    <span style="color: white" v-if="def > 0"> 🛡️{{formatNumber(def)}}</span>
    <span style="color: #e711e7" v-if="enemy.weakStack >= 1"> 👁️[{{Math.floor(enemy.weakStack)}}]</span>
    <span style="color: red" v-if="hero.dKills > 0"> 🔥[*{{formatNumber(Math.min(hero.dKills ** (1.3 + 0.05 * (dimensions[20].infTier - 20)), 1e6), true)}}]</span>
    <div class="hp-bar">
        <div class="hp-progress" :style="{ width: `${(hp / maxHp) * 100}%` }">
            <span class="hp-text">{{ formatNumber(hp) }} / {{ formatNumber(maxHp) }}</span>
        </div>
    </div>
    <div class="attack-bar">
      <div class="attack-progress" :style="{ width: `${attackBarProgress * 100}%` }"></div>
    </div>

    <div class="deBoss-wrapper" :class="{ 'buff-hidden': dimensions[29].infTier < 10}">
      <Tooltip :text="() => deBossDisplay('regen')" boxShadow="0 0 10px black">
        <span v-if="dimensions[29].infTier >= 10 && enemy.spawnType == 'deBoss'"  v-html="getSvgIconHTML('deRegen', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => deBossDisplay('def')">
        <span v-if="dimensions[29].infTier >= 15 && enemy.spawnType == 'deBoss'" v-html="getSvgIconHTML('deDef', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => deBossDisplay('time')">
        <span v-if="dimensions[29].infTier >= 20 && enemy.spawnType == 'deBoss'" v-html="getSvgIconHTML('deIgnoreDef', '1.5em')"></span>
      </Tooltip>
    </div>

    <div class="buff-wrapper" :class="{ 'buff-hidden': enemy.buffs.length <= 0 }">
      <Tooltip :text="() => buffDisplay('juggernaut')">
        <span v-if="enemy.buffs.includes(0)" v-html="getSvgIconHTML('juggernaut', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => buffDisplay('berserk')">
        <span v-if="enemy.buffs.includes(1)" v-html="getSvgIconHTML('berserk', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => buffDisplay('first_strike')">
        <span v-if="enemy.buffs.includes(2)" v-html="getSvgIconHTML('first_strike', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => buffDisplay('traveller')">
        <span v-if="enemy.buffs.includes(3)" v-html="getSvgIconHTML('traveller', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => buffDisplay('flexible')">
        <span v-if="enemy.buffs.includes(4)" v-html="getSvgIconHTML('flexible', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => buffDisplay('the_flash')">
        <span v-if="enemy.buffs.includes(5)" v-html="getSvgIconHTML('the_flash', '1.5em')"></span>
      </Tooltip>
    </div>

    <div class="bh-buff-wrapper">
      <Tooltip :text="() => bhBuffDisplay('bh_singularity_stacks')" boxShadow="0 0 10px cyan">
        <span v-if="hero.dId == 'bh'" v-html="getSvgIconHTML('bh_singularity_stacks', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => bhBuffDisplay('bh_speed')" boxShadow="0 0 10px cyan">
        <span v-if="hero.dId == 'bh'" v-html="getSvgIconHTML('bh_speed', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => bhBuffDisplay('bh_stack_chance')" boxShadow="0 0 10px cyan">
        <span v-if="hero.dId == 'bh' && hero.bhTier >= 0" v-html="getSvgIconHTML('bh_stack_chance', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => bhBuffDisplay('bh_stun_immune')" boxShadow="0 0 10px cyan">
        <span v-if="hero.dId == 'bh' && hero.bhTier >= 1" v-html="getSvgIconHTML('bh_stun_immune', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => bhBuffDisplay('bh_ignore_dodge')" boxShadow="0 0 10px cyan">
        <span v-if="hero.dId == 'bh' && hero.bhTier >= 2" v-html="getSvgIconHTML('bh_ignore_dodge', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="() => bhBuffDisplay('bh_slow')" boxShadow="0 0 10px cyan">
        <span v-if="hero.dId == 'bh' && hero.bhTier >= 3" v-html="getSvgIconHTML('bh_slow', '1.5em')"></span>
      </Tooltip>
       
    </div>

    <div class="curse-wrapper">
      <span v-for="idx in hero.activeCurse" :key="idx">
        <Tooltip :text="curseHandle(idx)">
          <span 
            class="curseTier" 
            :style="{ border: '2px solid ' + colors[hero.activeCurseTier[idx]] }" 
            v-html="cursed[idx].icon">
          </span>
        </Tooltip>
      </span>
    </div>

    <div class="effects-wrapper">
      <Tooltip :text="`Rage: ${enemy.rage}`" boxShadow="0 0 10px red">
        <span v-if="enemy.buffs.includes(1)" v-html="getSvgIconHTML('rage', '1.5em')"></span>
      </Tooltip>
      <Tooltip :text="`Extra hit(s) chance: ${Math.floor(enemy.extraHit)}%`" boxShadow="0 0 10px yellow">
        <span v-if="enemy.buffs.includes(5)" v-html="getSvgIconHTML('extraHit', '1.5em')"></span>
      </Tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useEnemy } from '../composables/useEnemy.js';
import { useHero } from '../composables/useHero.js';
import { soulNames} from '../data/souls.js';
import { cursed } from '../data/cursed.js';
import { dimensions } from '../data/dimensions.js';
import { getSvgIconHTML } from '../composables/SvgIcon.js';
import { divineSkills } from '../data/quasarCore.js';

const { enemy } = useEnemy();
const { hero } = useHero();

const props = defineProps({
  attackBarProgress: Number
});

const hp = computed(() => enemy.value.hp);
const maxHp = computed(() => enemy.value.maxHp);
const attack = computed(() => enemy.value.attack);
const def = computed(() => enemy.value.def);

const colors = ['green', 'yellow', 'red', '#c56eff', '#66ffcc']

function buffDisplay(id) {
  switch (id) {
    case 'juggernaut':
      return `<span style="color: orange">Juggernaut</span><br>
        1. ×${formatNumber(1.5 + 0.5 * dimensions.value[32].infTier, true)} DEF, ×${formatNumber(1.5 + 1 * dimensions.value[32].infTier, true)} HP, x${formatNumber(0.75 + 0.25 * dimensions.value[32].infTier, true)} DMG<br>
        2. Gain +${formatNumber((10 + 2.5 * dimensions.value[32].infTier), true)}% DEF for each 10% of missing HP<br>
        3. +${formatNumber((5 + 0.5 * dimensions.value[32].infTier), true)}% DEF from Max HP<br>
        4. ${formatNumber(Math.min(50 + 5 * dimensions.value[32].infTier, 100), true)}% chance to heal ${formatNumber(Math.min(10 + 1 * dimensions.value[32].infTier, 50), true)}% HP on full block.`;

    case 'berserk':
      return `<span style="color: crimson">Berserk</span><br>
        1. Low HP, High DMG -> 1 : 2<br>
        2. +15% Crit Chance and +75% Crit Damage when HP is low<br>
        3. If HP drops below 30%, restore 1% HP for every 10% HP missing<br>
        4. +5 Rage per hit. +1% DMG per Rage. -1% DMG taken per 2 Rage`;

    case 'first_strike':
      return `<span style="color: gold">First Strike</span><br>
        1. First attack deals double DMG<br>
        2. First attack is always critical<br>
        3. First attack will STUN for 1 second<br>
        4. First attack starts with ApS bar at 25%`;

    case 'traveller':
      return `<span style="color: lime">Traveller</span><br>
        1. Equipment drop chance decreased by 3<br>
        2. Curse drop decreased by 3<br>
        3. Ascension shards drop decreased by 3<br>
        4. EXP multiplier decreased by 3<br>
        5. Stardust drop decreased by 2<br>
        6. Mutagen drop decreased by 2<br>`;

    case 'flexible':
      return `<span style="color: #66ccff">Flexible</span><br>
        1. +20% to avoid enemy HIT<br>
        2. Avoid chance checks twice<br>
        3. When the avoid is successful, gain 7% for the next chance`;

    case 'the_flash':
      return `<span style="color: #ffcc00">The Flash</span><br>
        1. A base APS cannot be lower than 1<br>
        2. +0.01 APS for each Stage passed<br>
        3. Overcapped APS converts into chance of extra hit`;

    default:
      return `<span style="color: gray">Unknown Buff</span>`;
  }
}

function bhBuffDisplay(id) {
  switch(id){
   case 'bh_singularity_stacks': 
    return `Each Singularity stack increases damage by ${enemy.value.bhMod.toFixed(1)}.
    Total stacks: ${enemy.value.bhBossHits}`;
  case 'bh_speed': 
    return `Total APS: ${enemy.value.attacksPerSecond.toFixed(1)}`; 
  case 'bh_stack_chance': 
    return `Chance to gain an extra Singularity stack: ${enemy.value.bhExtraHit.toFixed(2)}`;
  case 'bh_stun_immune': 
    return `Immune to Stun`;
  case 'bh_ignore_dodge': 
    return `100% Chance to Hit`;
  case 'bh_slow': 
    return `Decreases the hero's APS by ${enemy.value.bhApSDown.toFixed(2)}%`;
  default: 
    return `Unknown effect`;

    }
}

function deBossDisplay(id) {
  switch (id) {
    case 'regen': 
      return `Dark Energy recovers the enemy's health by ${formatNumber(enemy.value.deBoss.regen)}% of max HP`;
    case 'def': 
      return `Dark Energy covers the enemy with a shield equal to ${enemy.value.deBoss.def}% of max HP`;
    case 'time':
      return `Dark energy spreads its power, making it impossible to remain here. Time left: ${Math.floor(enemy.value.deBoss.darkEnemyTimer)}s`;
    case 'ignore': 
      return `Dark Energy distorts space, making the Hero's damage ignored with a chance of ${enemy.value.deBoss.ignoreDMG}%`;
    default:
      return '';
  }
}


function curseHandle(idx) {
  const curse = cursed[idx];
  const currentTierIndex = hero.value.activeCurseTier[idx]; 
  const tier = curse.tier[currentTierIndex];

  if (!tier) return '';

   return `
    <span style="color: #FF5555; font-weight: bold;">${curse.name}</span><br>
    <span style="color: #AAAAAA;">${curse.description || ''}</span><br>
    <span style="color: #FFD700;">[T${currentTierIndex + 1}]</span> 
    <span style="color: #FFFFFF;">${tEffect(tier, curse.id)}</span> 
    <span style="color: rgba(211, 117, 255, 1)">(Bonus: ${tBonusEffect(tier)})</span>
  `.replace(/\n\s*/g, '');
}



const curseRules  = {
  0:  { mult: 1,       cap: 100 },      // Penetrate
  1:  { mult: 0.75,    cap: 50 },       // Heal
  2:  { mult: 0.5,     cap: 90 },       // Block
  3:  { mult: 0.5,     cap: 4 },        // Attack Per Second
  4:  { mult: 0.35,    cap: 90 },       // avoid attack
  5:  { mult: 0.25,    cap: 50 },       // to STUN for
  6:  { mult: 0.4,     cap: 1000 },     // to CRIT
  7:  { mult: 0.35,    cap: 20 },       // Each of your
  8:  { mult: 0.9,     cap: 90 },       // Enemy gets
  9:  { mult: 1,       cap: 1000 },     // Max HP
  10: { mult: 0.25,    cap: 90 },       // to bleed by
  11: { mult: 0.25,    cap: 90 },       // The Hero
  12: { mult: 0.4,     cap: 100 },      // Attack
  13: { mult: 0.5,     cap: 5 },        // id 13
  14: { mult: 1,       cap: Infinity }, // id 15
  15: { mult: 0.4,     cap: 20 },       // id 16
  16: { mult: 0.3,     cap: 50 },       // id 17
  17: { mult: 0.2,     cap: 50 },       // id 18
  18: { mult: 0.4,     cap: 20 },       // id 19
};

function tEffect(tier, curseId) {
  const baseMult = hero.value.curseMult;
  const rule = curseRules[curseId] || { mult: 1, cap: Infinity };

  return tier.effect.replace(/(\d+(\.\d+)?)/g, match => {
    let val = parseFloat(match) * Math.max(baseMult * rule.mult, 1);
    val = Math.min(val, rule.cap);
    return val.toFixed(2);
  });
}


function tBonusEffect(tier) {
  let base = tier.bonus;

  let quasarShackles = (hero.value.selectedDivSkills.includes(0)? divineSkills.value[0].values[1]: 1);
  let fluctuationFailures = (hero.value.selectedDivSkills.includes(10)? divineSkills.value[10].values[1]: 1);

  base = base * (hero.rebirthTier >= 10 ? 1.5 : 1) * quasarShackles * fluctuationFailures;

  return base.toFixed(2);
}

function getEnemyNameClasses(enemy, hero) {
  return {
    'soul-name': enemy.soulBuff.active || enemy.rebirthSoul,
    'boss-name': enemy.boss.isBoss,
    'ascension-name': enemy.ascensionSoul.active,
    'space-name': enemy.isSpaceFight > 0,
    'inf-name': enemy.spawnType.slice(0, 3) === 'inf',
    'dim-name': enemy.spawnType.slice(0, 3) === 'dim',
    'singularity-name': hero.isSingularity,
    'darkEnergyBoss-name': enemy.spawnType === 'deBoss',
    'darkDangerCreatures-name': enemy.spawnType.slice(0, 5) === 'd-dim',
    'bhSingulars': hero.dId == 'bh'
  }
}

function formatNumber(num, f = false) {
  if (num < 10 && f) return num.toFixed(2)
  if (num < 1000) return Math.floor(num).toString();

  const units = [
  "",  // 10^0
  "k", // 10^3
  "m", // 10^6
  "b", // 10^9
  "t", // 10^12
  "q", // 10^15 (quadrillion)
  "Q", // 10^18 (quintillion)
  "s", // 10^21 (sextillion)
  "S", // 10^24 (septillion)
  "o", // 10^27 (octillion)
  "n", // 10^30 (nonillion)
  "d", // 10^33 (decillion)
  "u", // 10^36 (undecillion)
  "D", // 10^39 (duodecillion)
  "T", // 10^42 (tredecillion)
  "qt", // 10^45 (quattuordecillion)
  "Qd", // 10^48 (quindecillion)
  "sd", // 10^51 (sexdecillion)
  "St", // 10^54 (septendecillion)
  "Od", // 10^57 (octodecillion)
  "Nd", // 10^60 (novemdecillion)
  "vg", // 10^63 (vigintillion)
  "Uv", // 10^66 (unvigintillion)
  "Dv", // 10^69 (duovigintillion)
  "Tv", // 10^72 (tresvigintillion)
  "qtv", // 10^75 (quattuorvigintillion)
  "Qtv", // 10^78 (quinvigintillion)
  "sdv", // 10^81 (sexvigintillion)
  "Stv", // 10^84 (septenvigintillion)
  "Odv", // 10^87 (octovigintillion)
  "Ndv", // 10^90 (novemvigintillion)
  "Tg", // 10^93 (trigintillion)
  "∞",  // 10^96+
];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[Math.min(tier, units.length)];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  const truncated = Math.floor(scaled * 10) / 10;

  return truncated.toString().replace(/\.0$/, '') + suffix; 
}
</script>

<style scoped>
.enemy {
  width: 250px;
  border: 2px solid #f44336;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  color: white;
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
  text-shadow: 
    0 0 1px #000,
    0 0 2px #000,
    0 0 3px #000,
    1px 1px 0 #000,
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

.soul-name {
  color: #c084fc;
  font-weight: bold;
  text-shadow: 0 0 5px #9333ea;
}

.boss-name {
  color:rgb(241, 60, 60);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(211, 56, 17);
}

.ascension-name {
  color:rgb(60, 63, 241);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(41, 27, 233);
}

.space-name {
  color:rgb(253, 196, 9);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(248, 193, 13);
}

.inf-name {
  color:rgb(253, 249, 9);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(248, 244, 13);
}

.singularity-name {
  color: rgba(136, 132, 255, 0.6);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(136, 132, 255);
}

.dim-name {
  color:rgb(9, 253, 233);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(9, 253, 233);
}

.darkEnergyBoss-name {
  color: rgb(30 67 64);
  font-weight: bold;
  text-shadow: 0 0 5px rgb(0 0 0);
}

.darkDangerCreatures-name {
  color: orange;
  font-weight: bold;
  text-shadow: 0 0 5px orange;
}

.bhSingulars {
  color: cyan;
  font-weight: bold;
  text-shadow: 0 0 5px cyan;
}

.curse-wrapper {
  margin-top: 10px;
  display: flex;
}

.buff-wrapper, .bh-buff-wrapper, .effects-wrapper {
  display: flex;
  gap: 1px;
  margin-top: 10px;
}

.deBoss-wrapper {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.curseTier{
  border-radius: 20px;
}

.curseTier {
  display: flex;
  justify-content: center;
  width: 16px;  
  height: 16px;
  border-radius: 50%;
  overflow: hidden; 
}

.curseTier svg {
  display: block;     
  width: 70%;
  height: 70%;
  vertical-align: middle;
}

.buff-hidden {
  display: none;
}

</style>
