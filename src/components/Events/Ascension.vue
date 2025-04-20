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
      </div>
    </div>

    <p>Shards:🌌 <strong>{{ format(hero.ascensionShards) }}</strong></p>

    <div class="perk-container">
      <div class="perk" v-for="perk in filteredPerks" :key="perk.id">
        <h3>{{ perk.name }}</h3>
        <p>{{ perk.description }}</p>
        <p>Level: {{ perk.level }} / {{ perk.max }}</p>
        <button :disabled="!canUpgrade(perk)" @click="upgradePerk(perk)">
          {{ getCost(perk) }} 🌌
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';
import { perks } from '../../data/ascension.js';
import { computed, ref } from 'vue';

const { hero } = useHero();


const currentTier = ref(1);
const tiers = [1, 2, 3];

const tierUnlockStage = (tier) => 10 + (tier - 1) * 15;

const maxTier = computed(() =>
  tiers.reduce((max, tier) =>
    hero.value.maxStage >= tierUnlockStage(tier) ? tier : max, 0)
);

const selectTier = (tier) => {
  if (tier <= maxTier.value) {
    currentTier.value = tier;
  }
};

const performAscension = () => {

  hero.value.level = 1;
  hero.value.exp = 0;
  hero.value.stage = 1;
  hero.value.zone = 1;
  hero.value.ascensionShards += gainedShards;

  // Сброс дополнительных параметров при необходимости
  // hero.value.perkPoints = 0;
  // hero.value.treeTier = 0;

  // Можешь использовать addLog("Ты возвысился и получил " + gainedShards + " осколков!");
};

const filteredPerks = computed(() =>
  perks.filter(p => p.tier === currentTier.value)
);

const getCost = (perk) => {
  return perk.baseCost + perk.level * perk.costPerLevel;
};

const canUpgrade = (perk) => {
  return (
    perk.level < perk.max &&
    hero.value.ascensionShards >= getCost(perk)
  );
};

const upgradePerk = (perk) => {
  const cost = getCost(perk);
  if (hero.value.ascensionShards >= cost && perk.level < perk.max) {
    hero.value.ascensionShards -= cost;
    perk.level++;
  }
};

function format(value) {
  if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return Math.floor(value);
  }
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
  overflow: hidden; /* Прячем скроллинг */
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
  grid-template-columns: repeat(3, 1fr); /* Теперь 3 перка в ряд */
  gap: 10px; /* Уменьшаем расстояние между перками */
  max-height: calc(100vh - 220px); /* Ограничиваем высоту контейнера, чтобы не было скроллинга */
  overflow-y: auto; /* Включаем вертикальный скроллинг внутри контейнера */
  padding: 5px;
  max-width: 800px;
}

.perk {
  background-color: #24324f;
  padding: 8px 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden; /* Чтобы контент не выходил за пределы */
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
</style>