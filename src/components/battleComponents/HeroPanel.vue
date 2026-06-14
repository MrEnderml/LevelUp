<template>
  <div class="hero-wrapper">

    <FloatingDamage :log="villian.damageLog" :format="fn" />

    <div class="hero">
      <div class="hero-header">
        <div class="formations">
            <button
              v-for="(formation, index) in filterFormation"
              :key="formation.name"
              :class="[
                'formation-btn',
                { active: player.activeFormation === formation.id },
              ]"
              @click="toggleFormation(formation.id)"
            >
              <Tooltip :text="() => formationD(formation.id)">
                {{ formation.icon }}
              </Tooltip>
            </button>
        </div>
      
        <div class="hero-header-actions">
          <Tooltip :text="() => renderMilestones()" position="right">
            <button v-if="getDimSpecialReward(54)" class="formation-btn">💥</button>
          </Tooltip>

          <div @click="statsModal = !statsModal">
            <button class="formation-btn">⚙️</button>
          </div>
        </div>
        
      </div>

      <div style='display: flex; gap: 5px;'>
        <span
          style="font-weight: bold"
          @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Damage' }"
        >
          <sup style="font-size: 6px"></sup>
          ⚔️ {{ fn(player.attack.final) }}
        </span>

      <span style="color: yellow; font-weight: bold;" @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'DEF' }"> <sup style="font-size: 6px"></sup>🛡️{{ fn(player.stats.final.def) }}</span>
      </div>
      
      <div class="hp-bar" @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'HP' }">
        <div class="hp-progress" :style="{ width: `${(player.hp / player.stats.final.hp) * 100}%` }"></div>
       
        <span class="hp-text">
          <sup style="font-size: 6px"></sup>{{ fn(player.hp, false) }} / {{ fn(player.stats.final.hp, false) }}
        </span>
      </div>
      <!-- Attack speed bar -->
      <div class="attack-bar">
        <div
          class="attack-progress"
          :style="{ width: `${player.bar * 100}%` }"
        ></div>
      </div>

      <StatusPanel title="Status Effects" :list="statusPlayerHandler(player, villian)" />
      <StatsPanel v-if="statsModal" :unit="player" :fn="fn" pos="45" type="player" />
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useHero } from "../../composables/useHero.js";
import { usePlayer } from "../../composables/utils/playerSetup.js";
import { useBaseEnemy } from "../../composables/utils/enemySetup.js";
import { useEnemy } from "../../composables/useEnemy.js";
import { useBuff } from "../../data/buffs.js";
import { dimensions } from "../../data/dimensions.js";
import { getSvgIconHTML } from '../../composables/SvgIcon.js';
import { perks } from '../../data/ascension.js';

import { useProgressions } from '../../composables/battleUtils/useProgression.js';
import { fn } from "../../composables/utils/global.js";

import FloatingDamage from "../UI/FloatingDamage.vue";
import StatusPanel from "../UI/StatusPanel.vue";
import { useStatuses } from "../../composables/UI/useStatuses.js";

import StatsPanel from "./StatsPanel.vue";
import { useSpecialStats } from "../../composables/battleUtils/useSpecialStats.js";
import { useDimensions } from "../../composables/battleUtils/useDimensions.js";

const { player, villian} = defineProps({
  player: Object,
  villian: Object
});

const {
  formationHandler
} = useProgressions();

const {
  statusPlayerHandler
} = useStatuses();

const {
  renderMilestones
} = useSpecialStats();

const {
  getDimSpecialReward
} = useDimensions();

const { hero } = useHero();
const { enemy } = useEnemy();
const { buffs } = useBuff();


const statsModal = ref(false);

function formationD(id) {
  let f = player.formationStats;

  if(id == 0)
    return `<span>Formation [HP]</span>
    </span><span style='color: lightgreen'>HP - x${f.hp}</span> | <span style='color: red'>ATK - x${f.atk}</span> | <span style='color: orange'>DEF - x${f.def}</span>`

  if(id == 2)
    return `<span>Formation [DEF]</span>
    <span style='color: orange'>DEF - x${f.def}</span> | <span style='color: lightgreen'>HP - x${f.hp}</span> | <span style='color: red'>ATK - x${f.atk}</span>`

  if(id == 1)
    return `<span>Formation [DMG]</span>
    <span style='color: red'>ATK - x${f.atk}</span> | <span style='color: orange'>DEF - x${f.def}</span> | <span style='color: lightgreen'>HP - x${f.hp}</span>`;

  const colors = {
    EXP: "#4ade80",              
    "Skill EXP": "#facc15",       
    "Equipment Drop Chance": "#38bdf8", 
    "Ascension Shards": "blue", 
    "Stardust": "gold"        
  };

  const loot = [
    "EXP",
    "Skill EXP",
    "Equipment Drop Chance",
    "Ascension Shards"
  ];

  if (hero.value.spCount >= 45) {
    loot.push("Stardust");
  }

  const coloredLoot = loot
    .map(item => `<span style="color:${colors[item]}">${item}</span>`)
    .join(", ");

  if(id == 3)
    return `<span>Formation [Loot]</span>
    <span style='color: orange'>DEF - x${f.def}</span> | <span style='color: lightgreen'>HP - x${f.hp}</span> | <span style='color: red'>ATK - x${f.atk}</span> | 
    <span style='color: gold'>LOOT: x${f.loot}</span> - ${coloredLoot}`
}



const filterFormation = computed(() =>
  hero.value.formationTypes.filter((f) => f.status === true)
);

function toggleFormation(index) {
  player.activeFormation =
    player.activeFormation === index ? null : index;
  
  formationHandler(player)
}





function survivalLevelHandle() {
  return ` You will gain double stats while you have remaining attempts. You lose an attempt whenever you die.<br>
  Total attempts: ${hero.value.survivalLife}`
}

function survivalHighLevelHandle() {
  return `You will gain double stats while your level is lower than [<span style="color: gold">${Math.floor(hero.value.survivalStage ** 1.175)}</span>]`;
}

function irradiationHandle() {
  return `<span style="color:#d4ff00; font-weight:bold;">☢ Irradiation</span>
    Gain <span style="color:#d4ff00">+1 Radiation stack</span> on <span style="color:#ff5555">Hit</span>.<br>
    Current stacks: <span style="color:#d4ff00; font-weight:bold;"> ${buffs.value[16].stack}</span>
  `;
}




</script>

<style scoped>

.hero-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  width: 22vw;
  padding: 16px;
  border-radius: 16px;

  background: linear-gradient(145deg, #1c1c1c, #242424);
  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    inset 0 0 12px rgba(255, 255, 255, 0.03),
    0 0 18px rgba(0, 0, 0, 0.6);

  backdrop-filter: blur(4px);

  display: flex;
  flex-direction: column;
  gap: 10px;

  transition: 0.3s ease;
  z-index: 11;
}


.hero-header {
  display: flex;
  align-items: center;     
  justify-content: space-between;
}

.hero-header-actions {
  display: flex;
  gap: 5px;
}

.formation-btn {
  background: rgba(255, 255, 255, 0.06);
  color: #eee;
  border-radius: 8px;

  border: 1px solid transparent;
  transition: 0.25s;

  padding: 0.25em;
  margin-left: 0.2em;
}

.formation-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.formation-btn.active {
  background: #47c766;
  border-color: #3aa257;
  box-shadow: 0 0 12px #47c766;
}


.stat-line {
  font-family: "Orbitron", sans-serif;
  font-size: 15px;
  color: #ddd;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}


.hp-bar {
  position: relative; 
  width: 100%;
  height: 24px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.hp-progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.hp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 0.9rem;
  color: #5ef52f;
  text-shadow: 0 0 2px #000, 0 0 4px #000;
  pointer-events: none;
}


.attack-bar {
  width: 100%;
  height: 10px;
  background: #1b1b1b;
  border-radius: 6px;
  overflow: hidden;
}

.attack-progress {
  height: 100%;
  background: linear-gradient(90deg, #ffae00, #ff7300);
  transition: width 0.1s;
  box-shadow: 0 0 6px #ffae00;
}




.status-panel {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}


.status-block {
  border: 2px solid rgba(255, 170, 60, 0.4);
  border-radius: 12px;
  padding: 10px;
  background: rgba(30, 15, 5, 0.6);
  width: 100%;
}


.status-header {
  font-size: 0.8rem;
  color: #ffcc66;
  margin-bottom: 6px;
  position: relative;
  padding-bottom: 4px;
}

.status-header::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, #ffaa33, transparent);
}


.status-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}


.status-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;
  border: 2px solid;

  background: rgba(40, 20, 5, 0.8);
  transition: 0.2s;
}


.status-icon.positive {
  border-color: #ffd166;
  box-shadow: 0 0 8px rgba(255, 209, 102, 0.7);
}


.status-icon.negative {
  border-color: #ff6b3d;
  box-shadow: 0 0 8px rgba(255, 107, 61, 0.7);
}


.status-icon:hover {
  transform: scale(1.1);
}


.status-icon.enemy {
  filter: brightness(0.85);
}

.divider {
  height: 2px;
  width: 100%;
  margin: 6px 0;

  background: linear-gradient(
    90deg,
    transparent,
    #ffaa33,
    transparent
  );

  opacity: 0.8;
}


</style>
