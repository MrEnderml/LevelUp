<template>
  <div class="radiation-panel">
    <div class="mutation-chances">
      <h2>
        Mutagens: {{Math.floor(hero.mutagen)}}
      </h2>  
      <ul>
        <li
          v-for="(mutation, idx) in hero.mutation"
          :key="mutation.type"
          class="mutation"
        >
          <span class="glow">{{ mutation.type }}</span> — {{ mutation.chance.toFixed(1) }}%
        </li>
      </ul>
      <div v-if="perks[10].status" class="danger-wrapper">
        <div>
          DANGER: [{{perks[10].level}}]
        </div> 
        <p>Enemy Power: [{{(enemy.enemyPower).toFixed(2)}}]</p>
        <span>Space Boss [T{{Math.floor(hero.spCount / 6) + 1}}] - [{{(enemy.spaceBossChance).toFixed(2)}}%]</span><br>
        <span v-if="perks[10].level >= 10">Souls(%) - [{{enemy.dangerEnemyChance[0].toFixed(2)}}]</span><br>
        <span v-if="perks[10].level >= 20">Ascension Souls(%) - [{{enemy.dangerEnemyChance[4].toFixed(2)}}]</span><br>
        <span v-if="perks[10].level >= 40">Rebirth Souls(%) - [{{enemy.dangerEnemyChance[5].toFixed(2)}}]</span><br>

        <span v-if="hero.infTier >= 4">Ω-Infinity(%)  <span v-if="enemy.danger < 100">Reach Danger 100</span> 
        <span v-if="enemy.danger >= 100">- [{{enemy.dangerEnemyChance[1].toFixed(2)}}]</span></span><br>

        <span v-if="hero.infTier >= 4">Mirror of the Eternal(%)  <span v-if="enemy.danger < 150">Reach Danger 150</span>
        <span v-if="enemy.danger >= 150">- [{{enemy.dangerEnemyChance[2].toFixed(2)}}]</span></span><br>

        <span v-if="hero.infTier >= 4">The Infinite One(%) <span v-if="enemy.danger < 200">Reach Danger 200</span> 
        <span v-if="enemy.danger >= 200">- [{{enemy.dangerEnemyChance[3].toFixed(2)}}]</span></span><br>
      </div>
    </div>

    <!-- Правая колонка: Перки -->
    <div class="radiation-perks">
      <h2>🧬 Radiation Perks</h2>
      <div class="perks-scroll">
        <div class="perks">
            <div
            class="perk-group"
            v-for="(group, index) in groupedPerks"
            :key="index"
            >
            <div
                v-for="perk in group"
                :key="perk.id"
                class="perk"
                :style="{ animationDelay: `${perk.id * 0.1}s` }"
            >
                <h3>{{ perk.name }}</h3>
                <p class="perk-description">{{ perk.description }}</p>
                <small class="perk-level">Lvl: {{ perk.level }} / {{ perk.max }}</small>
                <button
                    :disabled="perk.level >= perk.max"
                    @click="upgradePerk(perk)"
                    @mousedown="startAutoUpgrade(perk)"
                    @mouseup="stopAutoUpgrade"
                    @mouseleave="stopAutoUpgrade"
                    >
                    Upgrade ({{ getCost(perk) }})
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { perks as rawPerks } from '../../data/radPerks.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';

const perks = reactive([...rawPerks]);
const { hero } = useHero();
const { enemy } = useEnemy();

console.log(hero.value.lent); //undefined


const getCost = (perk) => {
  return perk.baseCost + (perk.level * perk.costPerLevel);
};

const groupedPerks = computed(() => {
  const chunks = []
  for (let i = 0; i < perks.length; i += 2) {
    chunks.push(perks.slice(i, i + 2))
  }
  return chunks
})

function upgradePerk(perk) {
  if (perk.level < perk.max && getCost(perk) <= hero.value.mutagen) {  
    
    hero.value.mutagen -= getCost(perk);
    perk.level++;
    if (perk.id == 11 && perk.level > 0){
        perk.description = perk.descriptionNext;
    }
    if (perk.id == 5){
        perk.description = perk.description.replace(/\[\d+(\.\d+)?]/, '') + ` [${(1.025 ** perk.level).toFixed(2)}]`;
    }

    if (perk.id == 7 && !perk.status){
      perk.level = 0;
      perk.max = 60;
      perk.baseCost = 5;
      perk.description = `[+0] Potential`
      perk.status = true;
    }
    if(perk.id == 7 && perk.status){
      perk.description = `+[${perk.level}] Potential`
    }

    if (perk.id == 11 && !perk.status){
      perk.level = 0;
      perk.max = 100;
      perk.baseCost = 1;
      perk.description = `+1 DANGER per level`;
      perk.status = true;
    }
    
  }
}

let intervalId = null;
let holdTimeout = null;

function startAutoUpgrade(perk) {
  
  holdTimeout = setTimeout(() => {
    intervalId = setInterval(() => {
      upgradePerk(perk);
    }, 75);
  }, 500);
}

function stopAutoUpgrade() {
  clearTimeout(holdTimeout);
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  holdTimeout = null;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.radiation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  gap: 1rem;
  font-family: 'Share Tech Mono', monospace;
  background: radial-gradient(circle at center, #0a0f0a, #0b0b12);
  padding: 1rem;
  color: #d4ff00;
  box-sizing: border-box;
  overflow: hidden;
  margin-left: 120px;
}

@media (min-width: 768px) {
  .radiation-panel {
    flex-direction: row;
  }

  .mutation-chances {
    flex: 3;
  }

  .radiation-perks {
    flex: 7;
  }
}

.mutation-chances,
.radiation-perks {
  background: rgba(0, 255, 0, 0.05);
  border: 2px solid #66ff66;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-width: 500px;
}

.mutation {
  padding: 0.25rem 0;
  font-size: 1rem;
  list-style: none;
}

.glow {
  color: #b6ff00;
  text-shadow: 0 0 4px #b6ff00, 0 0 8px #88ff88;
}

.perk-description {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.perks-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 0.5rem;
}

.perks {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: flex-start;
}

.perk-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 170px; /* ширина одной "колонки" из двух перков */
  flex-shrink: 0;
}

.perk {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid #aaffaa;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.85rem;
  animation: fadeInUp 0.4s ease-out both;
  width: 220px;
  height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  background: #b6ff00;
  color: black;
  font-weight: bold;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
button:hover {
  background: #dfff00;
}

/* Анимация появления */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .perks {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .perk {
    font-size: 0.8rem;
  }
}

.perk-level {
  font-size: 0.75rem;
  color: #99ff99;
  display: block;
  margin-top: 0.25rem;
}


.tooltip {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1c1917;
  color: #fef2f2;
  padding: 0.8rem;
  border-radius: 0.5rem;
  width: 220px;
  font-size: 0.85rem;
  text-align: left;
  z-index: 10000000;
  box-shadow: 0 0 10px #66ff66;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
}


.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.info-button {
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  color: #fee2e2;
  transition: transform 0.2s;
}

.info-button:hover {
  transform: scale(1.2);
}

.danger-wrapper {
  max-width: 250px;
  overflow: auto;
  max-height: 400px;
  overflow-x: hidden;
}

</style>
