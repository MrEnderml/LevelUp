<template>
  <div class="ascension-panel">
    <div class="tabs">
      <div
        v-for="tier in tiers"
        :key="tier"
        class="tier-wrapper"
      >
        <button
          :class="{ active: currentTier === tier, locked: tier > maxTier }"
          @click="selectTier(tier)"
          :disabled="tier > maxTier"
        >
          TIER {{ tier }}
        </button>
        <span
          v-if="tier > maxTier"
          class="tooltip"
        >
          Reach {{ tierUnlockStage(tier) }} stage
        </span>
        <button style="margin-left: 10px" v-if="radPerks[8].level == 1 && tier >= 3"
          class="active-r"
          @click="selectTier(5)"
        >
          TIER-R
        </button>
        <button style="margin-left: 10px" v-if="hero.mainInfTier >= 2 && tier >= 3"
          class="active-inf"
          @click="selectTier(6)"
        >
          TIER-INF
        </button>
        <button style="margin-left: 10px" v-if="hero.singularity >= 4 && tier >= 3"
          class="active-s"
          @click="selectTier(7)"
        >
          TIER-S
        </button>
        <button style="margin-left: 10px" v-if="dimensions[9].infTier == dimensions[9].maxInfTier && tier >= 3" 
          class="active-d"
          @click="selectTier(8)"
        >
          TIER-D
        </button>
      </div>
    </div>

    <p>Shards:🌌 <strong>{{ formatNumber(hero.ascensionShards) }}</strong> 
    <span v-if="dimensions[1].infTier == dimensions[1].maxInfTier"> (+{{formatNumber(hero.totalAscensionShards * 0.1)}})</span>
    </p>
    <span v-if="dimensions[9].infTier == dimensions[9].maxInfTier" class="ds-text"><strong>Dimension Shard(DS): {{hero.ds}}</strong></span>

    <div class="perk-container">
      <div class="perk" v-for="perk in filteredPerks" :key="perk.id">
        <h3>{{ perk.name }}</h3>
        <p class="perk-description">{{ getPerkDescription(perk) }}</p>
        <p v-if="currentTier != 6">Level: {{ perk.level }} / {{ perk.max }}</p>
        <p v-if="currentTier == 6">Level: {{ perk.level }}</p>
        <button :disabled="!canUpgrade(perk)" @click="upgradePerk(perk)">
          {{ formatNumber(getCost(perk)) }} 🌌
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';
import { perks } from '../../data/ascension.js';
import { computed, ref } from 'vue';
import { perks as radPerks } from '../../data/radPerks.js';
import { dimensions } from '../../data/dimensions.js';
const { hero } = useHero();


const currentTier = ref(1);
const tiers = [1, 2, 3];

const tierUnlockStage = (tier) => 10 + (tier - 1) * 15;

const maxTier = computed(() =>
  tiers.reduce((max, tier) =>
    hero.value.maxStage >= tierUnlockStage(tier) ? tier : max, 0)
);

const selectTier = (tier) => {
  if(tier == 5)
    currentTier.value = 5;
  
  if(tier == 6)
    currentTier.value = 6;

  if(tier == 7)
    currentTier.value = 7;
  
  if(tier == 8)
    currentTier.value = 8;

  if (tier <= maxTier.value) {
    currentTier.value = tier;
  }
};

const filteredPerks = computed(() =>
  currentTier.value === 7
    ? perks.filter(p => p.tier === currentTier.value && 38 + hero.value.singularity > p.id)
    : perks.filter(p => p.tier === currentTier.value)
);

const getCost = (perk) => {
  let iPenalty = 1 - 0.01 * dimensions.value[1].infTier;
  let sPenalty = (hero.value.rebirthPts >= 1e6? 1 - 0.01 * Math.log(hero.value.rebirthPts): 1);
  let total = iPenalty * sPenalty;
  if(perk.tier == 6)
    return Math.floor((perk.baseCost ** perk.level) ** total);
  if(perk.tier == 7)
    return perk.baseCost ** total
  return perk.baseCost + perk.level * perk.costPerLevel;
};

const canUpgrade = (perk) => {
  return (
    perk.tieer < 8 && perk.level < perk.max &&
    hero.value.ascensionShards >= getCost(perk) ||
    perk.tier == 8 && perk.level < perk.max &&
    hero.value.ds >= getCost(perk)

  );
};

const upgradePerk = (perk) => {
  const cost = getCost(perk);
  if (hero.value.ascensionShards >= cost && perk.level < perk.max) {
    hero.value.ascensionShards -= cost;
    perk.level++;
  }
};

function getPerkDescription(perk) {
  if (perk.id === 28) {
    return `Enemies weakness based on Corruption weakness [${(1- (hero.value.corruption - 0.1) * 0.5).toFixed(2)}]. Also works in The Abyss`
  }
  if (perk.id === 30) {
    return `Gain Ascension Shards based on SP - [${(1 + 0.04 * hero.value.sp).toFixed(2)}]. Ascension Affect scales better`
  }
  if(perk.id === 37){
    return `Level Exp Reduction based on Rebirth Pts [${(1.2 / Math.log(Math.sqrt(hero.value.rebirthPts) + 2)).toFixed(2)}]`
  }
  if(perk.id === 42){
    return `Max Level MULT based on overcap corruption [${(1 + hero.value.overcorruption / 4).toFixed(2) }]`
  }
  return perk.description
}

function formatNumber(num) {
  if (num < 1000000) return Math.floor(num).toString();

  const units = ["", "", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}
</script>

<style scoped>
.ascension-panel {
  background: linear-gradient(145deg, #1f2d46, #2e3b66); /* Градиентный фон */
  color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 100%;
  overflow: hidden; 
  margin-left: 50px;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tier-wrapper {
  position: relative;
  display: inline-block;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #eee;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

button.active {
  background-color: #2196f3;
  color: white;
}

button.active-r {
  background-color: #0fe56c;
  color: white;
}

button.active-inf {
  background-color:rgb(215, 229, 15);
  color: white;
}

button.active-s {
  background-color: #66ffcc;
  color: white;
}

button.active-d {
  background-color:rgb(254, 65, 254);
  color: white;
}

button.locked {
  background-color: rgba(255, 255, 255, 0.04);
  color: #888;
  cursor: not-allowed;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 80%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 0.75rem;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 100;
}

.tier-wrapper:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

h2 {
  text-align: center;
  font-size: 1.5rem; /* Уменьшаем размер заголовка */
  margin-bottom: 15px;
  color: #a7b9d9;
}

.perk-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 10px; 
  max-height: calc(100vh - 220px); 
  overflow-y: auto; 
  padding: 5px;
  max-width: 800px;
}

.perk {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #24324f;
  padding: 8px 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden; 
}

.perk h3 {
  font-size: 1rem; /* Уменьшаем шрифт заголовка */
  color: #f4f4f4;
}

.perk p {
  font-size: 0.9rem; /* Уменьшаем размер текста */
  color: #b1c2d3;
}

.perk button {
  background-color: #3b5d7a;
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  border: none;
  margin-top: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 0.8rem;
}

.perk button:disabled {
  background-color: #2a3b5f;
  cursor: not-allowed;
}

.perk button:hover:not(:disabled) {
  background-color: #4b6d8d;
  transform: scale(1.05);
}

.perk button:active {
  transform: scale(0.98);
}

.perk-description {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.ds-text {
  color: #fb15fb;
}
</style>