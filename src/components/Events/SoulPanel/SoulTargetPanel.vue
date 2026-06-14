<template>
  <div class="soul-target">

    <div class="soul-header">

      <div class="soul-cap">
        <span class="label">Souls CAP</span>
        <span class="value">
          <span class="cap">
            <span v-if="hero.soulsCap <= 40">
              {{ hero.soulsCap }}
            </span>
            <span v-else class="infinity">∞</span>
          </span>
        </span>
      </div>

      <div class="soul-chance">
        <span class="label">Appearance</span>
        <span class="value">
          {{ fn(enemy.soulBuff.chance) }}%
        </span>
      </div>

      <div class="soul-tier">
        <span class="label">Soul Tier</span>
        <span class="value">
          {{ hero.soulTier }}
        </span>
      </div>
    </div>

    <!-- STATS -->
    <div class="soul-section">
      <h4 class="soul-section-title">Soul Stats MULT</h4>

      <div
        v-for="s in soulStatsView"
        :key="s.key"
        class="s-stats-wrapper"
        :class="{ locked: !s.unlocked }"
      >
        <template v-if="s.unlocked">
          <span class="s-stats-name">{{ s.label }}</span>
          <span class="s-stats-value">{{ fn(s.value, true) }}</span>
        </template>

        <template v-else>
          <span class="locked-text">
            Unlocks at {{ s.req }} Souls
          </span>
        </template>
      </div>
    </div>

    <!-- LOOT -->
    <div class="soul-section">
      <h4 class="soul-section-title">Loot MULT</h4>

      <div class="s-stats-wrapper">
        <span class="s-stats-name">EXP</span>
        <span class="s-stats-value">{{ fn(enemy.soulBuff.drop) }}</span>
      </div>

      <div class="s-stats-wrapper">
        <span class="s-stats-name">Equipment Drop Chance</span>
        <span class="s-stats-value">{{ fn(enemy.soulBuff.drop) }}</span>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { perks as radPerks } from '../../../data/radPerks.js';
import { perks as ascension } from '../../../data/ascension.js';
import { useHero } from '../../../composables/useHero.js';
import { useEnemy } from '../../../composables/useEnemy.js';

import { fn } from '../../../composables/utils/global.js';

const { hero } = useHero();
const { enemy } = useEnemy();

const soulStatsView = computed(() => ([
  {
    key: 'dmg',
    label: 'DMG',
    unlocked: true,
    value: enemy.value.soulBuff.dmg || 0,
  },
  {
    key: 'hp',
    label: 'HP',
    unlocked: true,
    value: enemy.value.soulBuff.hp || 0,
  }
]));
</script>


<style scoped>
.soul-target {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  background: radial-gradient(circle at top, #1a1f2a, #0f1118);
  border-radius: 10px;
  box-shadow: inset 0 0 20px rgba(120, 80, 255, 0.15);
  font-size: 0.95em;
}

/* HEADER */
.soul-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(180deg, #1b1b1b, #121212);
  box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
}

.soul-cap,
.soul-chance,
.soul-tier {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.75rem;
  color: #9aa3b2;
  text-transform: uppercase;
  text-align: center;
}

.value {
  font-weight: 700;
  font-size: 1rem;
  color: #e5e7eb;
  text-align: center;
}

.infinity {
  color: #b6ff00;
  font-size: 1.1em;
}

/* SECTIONS */
.soul-section {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
}

.soul-section-title {
  font-size: 0.85rem;
  color: #93c5fd;
  margin-bottom: 8px;
}

.s-stats-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #444;
}

.s-stats-wrapper:last-child {
  border-bottom: none;
}

.locked-text {
  color: #ff36f5;
  font-style: italic;
}

.locked {
  opacity: 0.65;
}


/* STATS */
.s-stats-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
}

.s-stats-name {
  font-weight: 600;
  color: #ddd;
}

.s-stats-value {
  color: #c77dff;
}

/* ADD STATS */
.s-add-stat {
  padding: 3px 0;
  color: #9cffc1;
}

.s-add-stat.locked {
  color: #ff6b6b;
  opacity: 0.7;
}

.unlock {
  font-size: 0.75em;
  margin-left: 6px;
  color: #ffb4b4;
}

</style>