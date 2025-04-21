<template>
  <div class="amulet-panel red-theme">
    <h2>🔮 Amulets
      <div class="tooltip-wrapper">
      <span class="info-button">ℹ️</span>
      <div class="tooltip">
        -Bonus gives you EXP and EXP to your BUFFS. <br>
        -2 and more curses give you extra MULT to bonus. <br>
        -Higher stages provide you MULT to bonus. <br>
      </div>
      </div>
    </h2>
    
    <div class="amulet-content">
      <div class="amulet-list">
        <div class="amulet-grid">
          <div
            v-for="(amulet, index) in amulets"
            :key="index"
            class="amulet-card"
          >
            <h3 class="amulet-name">{{ amulet.name }} [T{{amulet.tier}}]</h3>
            <ul class="amulet-stats" v-if="amulet.status === true">
              <li>Max Level: <strong>+{{ amulet.maxLevel }}</strong></li>
              <li>Max Curses: <strong>+{{ amulet.cursedSlot }}</strong></li>
              <li>Buff Slot: 
                <span v-if="hero.maxStage >= 20 + 10 * (amulet.tier-1)"><strong>+{{ amulet.buffSlot }}</strong></span>
                <span v-else class="closed">Reach {{20 + 10 * (amulet.tier-1)}} stage</span>
              </li>
              <li>Suffix: 
                <span v-if="amulet.suffix.status === false" class="closed">closed</span>
                <span v-else>{{ amulet.suffix.text }}</span>
              </li>
              <li>Prefix:
                <span v-if="amulet.prefix.status === false" class="closed">closed</span>
                <span v-else>{{ amulet.prefix.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="curse-panel">
        <h3>☠️ Curses</h3>
        <ul>
          <li v-for="(curse, idx) in filterCurses" :key="idx">
            <strong>{{ curse.icon }} {{ curse.name }}</strong>
            <ul>
              <li v-for="(tier, t) in curse.tier" :key="t">[T{{t+1}}]{{ tier.effect }} (Bonus: {{ (tier.bonus * (hero.rebirthTier >= 10? 1.5: 1)).toFixed(2) }})</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { amulets } from '../../data/amulets.js';
import { cursed as curses } from '../../data/cursed.js';
import { useHero } from '../../composables/usehero.js';

const {hero} = useHero();

const filterAmulets = computed(() => 
    amulets.filter(b => b.status === true)
)

const filterCurses = computed(() => 
    curses.filter(curse => curse.status === true)
)
</script>

<style scoped>
.amulet-panel.red-theme {
  background-color: #3b0a0a;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px #dc2626;
  color: #ffe4e6;
  width: 800px;
  font-family: 'Segoe UI', sans-serif;
  margin-left: 50px;
}

.amulet-content {
  display: flex;
  gap: 1rem;
}

.amulet-list {
  width: 65%;
}

.amulet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.amulet-card {
  background-color: #7f1d1d;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 5px #f87171;
  min-height: 225px;
}

.amulet-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fecaca;
}

.amulet-stats li {
  font-size: 0.95rem;
  margin: 0.25rem 0;
}

.closed {
  opacity: 0.5;
  font-style: italic;
  color: #fca5a5;
}

.curse-panel {
  background-color: #7f1d1d;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 5px #f87171;
  width: 30%;
  color: #ffe4e6;
  max-height: 500px;
  overflow-y: auto;
}

.curse-panel h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fda4af;
}

.curse-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.curse-panel li {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

.curse-panel li strong {
  color: #fecaca;
  font-size: 1rem;
  display: block;
  margin-bottom: 0.2rem;
}

.amulet-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  color: #fecaca;
  position: relative;
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
  z-index: 10;
  box-shadow: 0 0 10px #ef4444;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
}

</style>