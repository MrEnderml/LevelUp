<template>
  <div class="progress-bar" v-if="!hero.isInfSpace">
    <div
      class="progress-gradient"
      :style="{ width: progressPercent + '%' }"
    ></div>
  </div>

  <BuffLayoutSelector />

  <div
    class="enemy-info"
    v-if="
      currentEnemy &&
      ((currentEnemy.status && hero.spCount < hero.spMaxCount) ||
        hero.isInfSpace)
    "
  >
    <h2>{{ currentEnemy.name }}</h2>

    <p v-if="!hero.isInfSpace" class="boss-reward-sp">
      Reward: {{ currentEnemy.reward }}
    </p>

    <div class="stats-row">
      <div class="stat-item">❤️ {{ stats(1) }}</div>
      <div class="stat-item">⚔️ {{ stats(2) }}</div>
      <div class="stat-item">🛡️ {{ stats(3) }}</div>
      <div class="stat-item">🥾 {{ stats(4) }}</div>
    </div>

    <div class="enemy-abilities-grid">

      <template v-for="section in spaceAbilityUI" :key="section.title">
        <div
          class="ability-card"
          v-if="hero.spbCount >= section.unlock"
        >
          <h4>{{ section.title }}</h4>

          <template v-for="stat in section.stats" :key="stat.key">
            <span
              v-if="(!stat.reqIW || hero.spsCount >= stat.reqIW) &&
                    (!stat.infOnly || hero.isInfSpace)"
            >
              <p>
                <strong>{{ stat.label }}:</strong>
                {{ specialStats[stat.key].display }}
                <span v-if="specialStats[stat.key].isMax ||
                specialStats[stat.key].isMin"><strong>[MAX]</strong></span> 
              </p>

              <p class="sub" v-if="!hero.isInfSpace">
                {{ specialStats[stat.key].breakdown.celestials >= 0
                ? '+' + specialStats[stat.key].breakdown.celestials
                : specialStats[stat.key].breakdown.celestials }}
                per Celestial Defeated
              </p>

              <p class="sub" v-else>
                {{ specialStats[stat.key].breakdown.infWarden >= 0
                ? '+' + specialStats[stat.key].breakdown.infWarden
                : specialStats[stat.key].breakdown.infWarden }}
                per IW Defeated
              </p>
            </span>
          </template>
        </div>
      </template>


    </div>
  </div>

  <div
    v-else
    style="text-align: center"
    @click="hero.eLink = { set: 'Info', info: 'Space' }"
  >
    <sup style="font-size: 12px"></sup>Raise your Danger level to attract the attention of Celestial Beings or
    Increase the Space Tier.
  </div>

  <div
    class="bottom-bar"
    v-if="
      (spEnemy[hero.spCount].status && hero.spCount < hero.spMaxCount) ||
      hero.isInfSpace
    "
  >
    <button
      v-if="!villian.space.isSpaceFight && villian.space.spaceCooldown == 0"
      class="attack-button"
      @click="attackSpaceEnemy"
    >
      ⚔️ Attack
    </button>

    <button
      v-else-if="villian.space.spaceCooldown"
      class="attack-button"
      disabled
    >
      {{ villian.space.spaceCooldown.toFixed(1) }}s
    </button>

    <button
      v-if="villian.space.isSpaceFight"
      class="attack-button"
      @click="leaveSpaceEnemy"
    >
      Leave
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, reactive } from "vue";
import { useHero } from "../../../composables/useHero.js";
import { useEnemy } from "../../../composables/useEnemy.js";
import { spEnemy } from "../../../data/spaceEnemy.js";
import { spaceAbilityUI } from "../../../data/space/spaceAbilityUI.js";

import { fn } from "../../../composables/utils/global.js";

import { useSpaces } from '../../../composables/battleUtils/useSpace.js';
import { useBaseEnemy } from "../../../composables/utils/enemySetup.js";
import { usePlayer } from "../../../composables/utils/playerSetup.js";

import BuffLayoutSelector from "./BuffLayoutSelector.vue";

const {
  specialStats,
  leaveSpaceEnemy,
  attackSpaceEnemy
} = useSpaces();

const { hero } = useHero();
const { enemy } = useEnemy();

const { villian } = useBaseEnemy("space");
const { player } = usePlayer("space");

const currentEnemy = computed(() => {
  if (hero.value.isInfSpace) {
    return {
      name: `Infinity Warden - ${hero.value.spsCount}`,
      reward: null,
      type: 'boss',
      status: true,
      stats: {
        hp: enemy.value?.totalSpaceStats?.hp ?? 0,
        dmg: enemy.value?.totalSpaceStats?.dmg ?? 0,
        def: enemy.value?.totalSpaceStats?.def ?? 0,
        AS: (hero.value.spsCount ?? 0)
      }
    };
  }

  // normal spEnemy case
  const se = spEnemy[hero.value.spCount] ?? null;
  if (!se) return null;

  return {
    ...se,
    // ensure shape
    status: se.status ?? true,
    type: se.type ?? 'mob',
  };
});


function stats(id) {
  switch (id) {
    case 1:
      return fn(villian.value.stats.final.hp);
    case 2:
      return fn(villian.value.stats.final.atk);
    case 3:
      return fn(villian.value.stats.final.def);
    case 4:
      return fn(villian.value.APS.current);
  }
}


const progressPercent = computed(() => ((hero.value.spCount % 6) / 6) * 100);




</script>

<style scoped>
.progress-bar {
  height: 10px;
  width: 100%;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.progress-gradient {
  height: 100%;
  background: linear-gradient(to right, #fcd34d, red);
  transition: width 0.3s ease;
}

.enemy-info {
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid #fcd34d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 15px rgba(252, 211, 77, 0.2);
  backdrop-filter: blur(3px);
  animation: fadeIn 0.8s ease-out;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.enemy-info h2 {
  font-size: 1.8rem;
  background: linear-gradient(90deg, #fcd34d, #ff7300);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 230, 0, 0.5);
  margin-bottom: 0.5rem;
}

.boss-reward-sp {
  margin-bottom: 0.7rem;
  text-align: center;
  color: #ffe066;
  font-size: 1.2rem;
  text-shadow: 0 0 5px #fcd34d;
}

.attack-button {
  background: linear-gradient(90deg, #fcd34d, #ff4d00);
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 15px rgba(252, 211, 77, 0.4);
  animation: pulse 1.5s infinite;
}

.bottom-bar {
  text-align: center;
}

.attack-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(252, 211, 77, 0.7);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(252, 211, 77, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(252, 211, 77, 0.7);
  }
  100% {
    box-shadow: 0 0 10px rgba(252, 211, 77, 0.3);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-row {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  font-size: 1.2rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid #fcd34d55;
  box-shadow: 0 0 8px rgba(252, 211, 77, 0.2);
}



.enemy-abilities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.ability-card {
  background: rgba(255, 230, 0, 0.05);
  border: 1px solid rgba(255, 230, 0, 0.2);
  border-radius: 10px;
  padding: 1rem 1.2rem;
  box-shadow: 0 0 10px rgba(255, 230, 0, 0.1);
  backdrop-filter: blur(3px);
}

.ability-card h4 {
  margin: 0;
  margin-bottom: 0.4rem;
  font-size: 1.1rem;
  color: #ffe162;
  text-shadow: 0 0 4px rgba(255, 200, 0, 0.5);
}

.ability-card p {
  margin: 2px 0;
  line-height: 1.3;
}

.sub {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-left: 6px;
}

/* Mobile / small screens */
@media (max-width: 900px) {
  .enemy-abilities-grid {
    grid-template-columns: 1fr;
  }
}

</style>
