<template>
  <div class="filter-buttons">
    <button :class="{ active: shopFilter === 'All' }" @click="shopFilter = 'All'">
      All
    </button>

    <button :class="{ active: shopFilter === 'Available' }" @click="shopFilter = 'Available'">
      Available
    </button>

    <button :class="{ active: shopFilter === 'Acquired' }" @click="shopFilter = 'Acquired'">
      Acquired
    </button>
  </div>

  <div class="head-wrapper">
    <span>Stardust: {{ fn(hero.stardust) }}✨</span><br>
    <span>Infinity Warden: {{ hero.spsCountMax }}</span>
  </div>

  <div class="shop-grid">
    <div v-for="perk in spaceShopFilter" :key="perk.id" :class="['perk-card', { bought: perk.status }]">
      <h4 class="perk-title">{{ perk.title || 'Unknown Perk' }}</h4>
      <p class="perk-desc" v-html="highlightKeyword(perk.d, 'Infinity Warden')"></p>

      <button class="perk-button"
        :disabled="spsPerkUnlocked(perk) || perk.status || hero.stardust < astralisPerkCost(perk)"
        @click="buyAstralisPerk(perk)">
        <template v-if="spsPerkUnlocked(perk)">
          🔒 Req: {{ perk.req }} Infinity Warden
        </template>
        <template v-else-if="perk.status">
          ✅ Acquired
        </template>
        <template v-else>
          {{ fn(astralisPerkCost(perk)) }} ✨
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, reactive } from 'vue';
import { useHero } from '../../../composables/useHero.js';
import { perks as ascension } from '../../../data/ascension.js';
import { spaceShop } from '../../../data/spaceShop.js'

import { fn } from '../../../composables/utils/global.js';
import { useSpaces } from '../../../composables/battleUtils/useSpace.js';

const { hero } = useHero();
const shopFilter = ref('All');

const {
  buyAstralisPerk,
  astralisPerkCost
} = useSpaces();

const spaceShopFilter = computed(() => {
  let perks = Array.isArray(spaceShop.value)
    ? [...spaceShop.value].sort((a, b) => a.idx - b.idx)
    : [];

  switch (shopFilter.value) {
    case 'Acquired':
      return perks.filter(perk => perk.status);

    case 'Available':
      return perks.filter(perk =>
        !perk.status &&
        hero.value.spsCountMax >= perk.req
      );

    default:
      return perks;
  }
});


function spsPerkUnlocked(perk) {
  return !(hero.value.spsCountMax >= perk.req);
}

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${keyword}s?)`, 'gi');
  return text.replace(regex, `<span style="color:#ffdd55;font-weight:bold;">$1</span>`);
}

</script>

<style scoped>
.shop-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  overflow: hidden;
}

.head-wrapper {
  font-size: 1.2em;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ffd700;
  text-shadow: 0 0 5px #ffcc33;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #ffdd55 transparent;
}

.perk-card {
  background: linear-gradient(145deg, #0b0b1f, #1a1a2f);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7), 0 0 12px #6600ff40 inset;
  transition: transform 0.2s, box-shadow 0.3s;
}

.perk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8), 0 0 20px #aa33ff60 inset;
}

.perk-card.bought {
  background: linear-gradient(145deg, #101020, #1f1f3f);
  border: 2px solid #33ff88;
  opacity: 0.95;
}

.perk-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 0.5rem;
}

.perk-desc {
  font-size: 0.85rem;
  color: #cbd5e1;
  flex-grow: 1;
  overflow: hidden;
}

.perk-button {
  margin-top: auto;
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(90deg, #ff9900, #ffcc33);
  color: #1b1b1b;
  text-align: center;
  transition: background 0.2s, transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 0 10px rgba(255, 221, 85, 0.3);
}

.perk-button:hover:not(:disabled) {
  transform: scale(1.05);
  background: linear-gradient(90deg, #ffaa22, #ffee55);
  box-shadow: 0 0 15px rgba(255, 221, 85, 0.5);
}

.perk-button:disabled {
  background: #555;
  cursor: not-allowed;
}

/* Filter */

.filter-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-buttons button {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #555;
  background: #222;
  color: white;
  cursor: pointer;
}

.filter-buttons button.active {
  border-color: gold;
  color: gold;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
}

/* */
</style>