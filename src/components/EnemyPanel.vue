<template>
  <div class="enemy">
    <h3 :class="{ 'soul-name': enemy.soulBuff.active || enemy.rebirthSoul, 'boss-name': enemy.boss.isBoss, 'ascension-name': enemy.ascensionSoul.active, 'space-name': enemy.isSpaceFight, 
    'inf-name': enemy.spawnType.slice(0, 3) == 'inf' }">👾 
      {{ enemy.soulBuff.active ? soulNames[hero.souls%50] || 'Unknown Soul' : enemy.name }}
    </h3>

    <span style="color: white">⚔️ {{ formatNumber(attack) }}  </span>
    <span style="color: white" v-if="def > 0"> 🛡️{{formatNumber(def)}}</span>
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

const { enemy } = useEnemy();
const { hero } = useHero();

const props = defineProps({
  attackBarProgress: Number
});

const hp = computed(() => enemy.value.hp);
const maxHp = computed(() => enemy.value.maxHp);
const attack = computed(() => enemy.value.attack);
const def = computed(() => enemy.value.def);

const colors = ['green', 'yellow', 'red', '#c56eff']

function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
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

.curse-wrapper {
  margin-top: 10px;
}

.curseTier{
  border-radius: 20px;
}
</style>
