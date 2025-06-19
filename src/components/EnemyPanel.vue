<template>
  <div class="enemy">
    <h3 :class="{ 'soul-name': enemy.soulBuff.active || enemy.rebirthSoul, 'boss-name': enemy.boss.isBoss, 'ascension-name': enemy.ascensionSoul.active,
     'space-name': enemy.isSpaceFight, 'inf-name': enemy.spawnType.slice(0, 3) == 'inf', 'dim-name': enemy.spawnType.slice(0, 3) == 'dim',
     'singularity-name': hero.isSingularity }">👾 
      {{ enemy.soulBuff.active ? soulNames[hero.souls%50] || 'Unknown Soul' : enemy.name }}
    </h3>

    <span style="color: white">⚔️ {{ formatNumber(attack) }}  </span>
    <span style="color: white" v-if="def > 0"> 🛡️{{formatNumber(def)}}</span>
    <span style="color: #e711e7" v-if="enemy.weakStack >= 1"> 👁️[{{Math.floor(enemy.weakStack)}}]</span>
    <span style="color: red" v-if="hero.dKills > 0"> 🔥[*{{formatNumber((1.01 * (1.000 + 0.001 * (dimensions[20].infTier - 20))) ** hero.dKills, true)}}]</span>
    <span style="color: red" v-if="enemy.d_damagePenalty > 0 && hero.dId == 'd-damage'">
      🔥[*{{ formatNumber((1.02 ** Math.sqrt(enemy.d_damagePenalty ** (1.5 + 0.01 * dimensions[28].infTier))), true) }}]
    </span>
    <span style="color: red" v-if="enemy.d_damagePenalty > 0 && hero.darkId.includes('d-damage')">
      🔥[*{{ formatNumber(Math.pow(Math.max(1.015 - 0.00075 * dimensions[28].infTier, 1.001), enemy.d_damagePenalty), true) }}]
    </span>
    <div class="hp-bar">
        <div class="hp-progress" :style="{ width: `${(hp / maxHp) * 100}%` }">
            <span class="hp-text">{{ formatNumber(hp) }} / {{ formatNumber(maxHp) }}</span>
        </div>
    </div>
    <div class="attack-bar">
      <div class="attack-progress" :style="{ width: `${attackBarProgress * 100}%` }"></div>
    </div>
    <div class="curse-wrapper">
      <span v-for="idx in hero.activeCurse" class="curseTier" :style="{ border: '2px solid ' + colors[hero.activeCurseTier[idx]] }">{{cursed[idx].icon}}</span>
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

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
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

.curse-wrapper {
  margin-top: 10px;
}

.curseTier{
  border-radius: 20px;
}
</style>
