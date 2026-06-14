<template>
  <div class="enemy-wrapper">

    <FloatingDamage :log="player.damageLog" :format="fn" />

    <div class="enemy">

    <div class="enemy-header">
        <div>
          <span class="enemy-title" :class="getEnemyNameClasses(villian, player)">
            👾 {{ villian.spawnType == 'd-corruption'? glitchify(villian.name): villian.name }}
          </span>
        </div>
        <div @click="statsModal = !statsModal">
          ⚙️
        </div>
    </div>


    <div class="stats">
      <span style='color: red; font-weight: bold'>⚔️ {{ fn(villian.attack.final) }}</span>
      <span style='color: yellow; font-weight: bold' v-if="villian.stats.final.def > 0">🛡️ {{ fn(villian.stats.final.def) }}</span>
      <span v-if="enemy.weakStack >= 1" class="weak-stack">👁️[{{ Math.floor(enemy.weakStack) }}]</span>
      <span v-if="hero.dKills > 0" class="dKills">🔥[*{{fn(Math.min(hero.dKills ** (1.3 + 0.05 * (dimensions[20].infTier - 20)), 1e6), true)}}]</span>
    </div>

    <!-- HP bar -->
    <div class="hp-bar">
      <div class="hp-progress" :style="{ width: `${(villian.hp / villian.stats.final.hp) * 100}%` }"></div>
      <span class="hp-text">{{ fn(villian.hp, false) }} / {{ fn(villian.stats.final.hp, false) }}</span>
    </div>

    <!-- Attack speed bar -->
    <div class="attack-bar">
      <div class="attack-progress" :style="{ width: `${villian.bar * 100}%` }"></div>
    </div>

    <!-- Curse -->
    <div v-if="canShowCursePanel(hero, villian)" class="curse-wrapper">
      <div class="curse-header">
        <span>Curses</span>
      </div>

      <div class="curse-list">
        <span v-for="idx in hero.activeCurse" :key="idx">
          <Tooltip :text="() => curseHandle(idx)" position="right">
            <span 
              class="curseTier" 
              :style="{ borderColor: colors[hero.activeCurseTier[idx]] }" 
              v-html="cursed[idx].icon">
            </span>
          </Tooltip>
        </span>
      </div>
    </div>

    <!-- Status Effects -->
    <StatusPanel title="Status Effects" :list="statusVillianHandler(player, villian)" />
    <StatsPanel v-if="statsModal" :unit="villian" :fn="fn" pos="45" type="villian" />

    </div>
  </div>
  
</template>


<script setup>
import { computed, ref } from 'vue';
import { useEnemy } from '../../composables/useEnemy.js';
import { useHero } from '../../composables/useHero.js';
import { soulNames} from '../../data/souls.js';
import { cursed } from '../../data/cursed.js';
import { dimensions } from '../../data/dimensions.js';
import { getSvgIconHTML } from '../../composables/SvgIcon.js';
import { divineSkills } from '../../data/quasarCore.js';

import { fn } from '../../composables/utils/global.js';
import { useBaseEnemy } from '../../composables/utils/enemySetup.js';
import { usePlayer } from '../../composables/utils/playerSetup.js';

import FloatingDamage from '../UI/FloatingDamage.vue';
import StatusPanel from '../UI/StatusPanel.vue';
import StatsPanel from './StatsPanel.vue';
import { useStatuses } from '../../composables/UI/useStatuses.js';
import { useAmulets } from '../../composables/battleUtils/useAmulets.js';

import { glitchify } from '../../composables/utils/global.js';

const { enemy } = useEnemy();
const { hero } = useHero();

const { statusVillianHandler } = useStatuses();
const { 
  tBonusEffect,
  tEffect
} = useAmulets();

const { player, villian } = defineProps({
  player: Object,
  villian: Object
});

const statsModal = ref(false);


const colors = ['green', 'yellow', 'red', '#c56eff', '#66ffcc']

function canShowCursePanel(hero, villian) {
  return (
    (
      hero.stages.current >= 20 ||
      hero.isAbyss ||
      hero.dId === 'hard' ||
      hero.dId === 'd-hard' ||
      hero.isSingularity
    ) &&
    hero.battleId === 'main' &&
    villian.spawnType !== 'd-corruption' &&
    hero.dId !== 'bh'
  );
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
    <span style="color: rgba(211, 117, 255, 1)">(Essense: ${tBonusEffect(tier)})</span>
  `.replace(/\n\s*/g, '');
}

function getEnemyNameClasses(enemy, player) {
  return {
    'singularity-name': hero.value.isSingularity || enemy.spawnType == 'singulars',
    'soul-name': enemy.spawnType == 'soul',
    'boss-name': enemy.spawnType == 'boss',
    'space-name': enemy.spawnType == 'space',
    'inf-name': enemy.spawnType.slice(0, 3) === 'inf',
    'dim-name': enemy.spawnType.slice(0, 3) === 'dim',
    'darkEnergyBoss-name': enemy.spawnType === 'deBoss',
    'darkDangerCreatures-name': enemy.spawnType.slice(0, 5) === 'd-dim',
    'bhSingulars': enemy.spawnType == 'bh',
    'd-corruption': enemy.spawnType == 'd-corruption'
  }
}

</script>

<style scoped>
.enemy-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.enemy {
  width: 24vw;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, #1c1c1c, #242424);
  border: 2px solid rgba(255, 80, 80, 0.5);
  box-shadow:
    0 0 8px rgba(255, 0, 0, 0.2),
    inset 0 0 10px rgba(0, 0, 0, 0.6);
  color: #fff;
  font-family: 'Orbitron', sans-serif;

  display: flex;
  flex-direction: column;
  gap: 10px;

  z-index: 10;
}

.enemy-title {
  font-weight: bold;
}

.enemy-header {
  display: flex;
  align-items: center;     
  justify-content: space-between;
}


.stats {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 3px;
}
.weak-stack { color: #e711e7; }
.dKills { color: red; }


.hp-bar {
  width: 100%;
  height: 26px;
  background: rgba(50, 0, 0, 0.6);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 90, 90, 0.3);
  box-shadow:
    inset 0 0 6px rgba(0,0,0,0.6),
    0 0 4px rgba(255,0,0,0.3);
}
.hp-progress {
  height: 100%;
  background: linear-gradient(90deg, #ff4d4d, #b30000);
  transition: width 0.25s ease-out;
}
.hp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 0.85rem;
  pointer-events: none;
  color: red;
  text-shadow:
    0 0 2px #000,
    0 0 4px #000,
    1px 1px 0 #000,
    -1px -1px 0 #000;
}


.attack-bar {
  width: 100%;
  height: 10px;
  background-color: #3a0a0a;
  border-radius: 5px;
  overflow: hidden;
}
.attack-progress {
  height: 100%;
  background: #ff9800;
  border-radius: 5px;
  transition: width 0.1s linear;
}


.buff-wrapper, .bh-buff-wrapper, .effects-wrapper {
  display: flex;
  gap: 2px;
}
.buff-hidden { display: none; }

/* Curses */
.curse-wrapper {
  border: 2px solid rgb(255 61 61 / 35%);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgb(26 6 6 / 60%);

  margin: 5px 0px;
  min-height: 110px;
}

.curse-header {
  font-size: 0.85rem; 
  font-weight: 700;
  color: #ffbaba;
  position: relative;
  padding-bottom: 4px;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.curse-header::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40%;
  height: 2px;
  background: linear-gradient(90deg, #ff4d4d, transparent);
}

.curse-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.curseTier {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  border: 2px solid;
  border-radius: 8px;

  background: linear-gradient(
    180deg,
    rgba(80, 17, 17, 0.7),
    rgba(60, 8, 8, 0.7)
  );

  box-shadow: 0 0 6px rgba(255, 77, 77, 0.4);
  transition: 0.2s;
  cursor: pointer;
}


.curseTier:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 0 12px rgba(138, 77, 255, 0.8);
}

/* creatures names */

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
  color: cyan;
  font-weight: bold;
  text-shadow: cyan;
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

.d-corruption {
  color: #ff00f2;
  font-weight: bold;
  text-shadow: 0 0 5px #ff00f2;
}

</style>
