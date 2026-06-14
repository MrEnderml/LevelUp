<template>
  <div class="amulet-panel">
    <h2 class="amulet-title"><sup style="font-size: 6px"></sup>Amulet</h2>

    <div class="effects-cards">
            <Tooltip
              v-for="key in effectsActivated()"
              :key="key"
              :text="() => effectsHandler(key)"
              position="right"
            >
              <div
                class="effect-card"
                :class="['effect-' + key, { active: activeSelect(key) }]"
                @click="clickEffects(key)"
              >
                {{ key }}
              </div>
            </Tooltip>
      </div>

    <div class="tabs">
      <button :class="{ active: tab === 'stones' }" @click="tab = 'stones'">
        Stones
      </button>
      <button :class="{ active: tab === 'curses' }" @click="tab = 'curses'">
        Curses
      </button>
    </div>

    <StonePanel v-if="tab === 'stones'" />
    <CursesPanel v-else />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import StonePanel from './AmuletPanel/StonePanel.vue';
import CursesPanel from './AmuletPanel/CursesPanel.vue';

import { useAmulets } from '../../composables/battleUtils/useAmulets.js';

const {
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useAmulets();

const tab = ref('stones');

</script>

<style scoped>
.amulet-panel {
  box-sizing: border-box;

  height: 100dvh; 

  background: linear-gradient(145deg,#2f2020,#372828);
  color: #f0f0f0;

  padding: clamp(12px, 2vh, 24px);

  border-radius: 0; 
  box-shadow: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.5vh, 18px);

  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.amulet-title {
  color:rgb(251, 93, 36);            
  text-shadow: 0 0 6px rgba(251, 93, 36, 0.74); 
}

.amulet-content {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.amulet-list {
  flex: 1 1 60%;
  min-width: 250px;
}

.amulet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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

.amulet-stats {
  list-style: none; 
  padding: 0;
  margin: 0;
}

.amulet-stats li {
  margin: 0.4rem 0;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between; 
  color: #ffe4e6;
  font-weight: 700;
}

.amulet-stats li strong.highlight {
  font-weight: bold;
}

.closed {
  opacity: 0.5;
  font-style: italic;
  color: #fca5a5;
}

.closed {
  opacity: 0.5;
  font-style: italic;
  color: #fca5a5;
}

.curse-panel {
  flex: 1 1 35%;
  min-width: 200px;
  background-color: #7f1d1d;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 5px #f87171;
  color: #ffe4e6;
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(226, 40, 40) transparent;
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

.curse-wrapper {
  font-weight: bold;
  font-size: 0.9em;
  color: #ff1b37;
}


.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.tabs button {
  position: relative;
  padding: 6px 16px;

  font-size: 0.95em;
  font-weight: 600;
  letter-spacing: 0.04em;

  color: #fca5a5;
  background: linear-gradient(
    180deg,
    #1a0b0b,
    #120606
  );

  border: 1px solid #3f1d1d;
  border-radius: 8px;

  cursor: pointer;
  transition: 
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;
}

.tabs button:hover {
  color: #fecaca;
  border-color: #7f1d1d;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.25);
}

.tabs button.active {
  color: #fff;
  border-color: #ef4444;

  background: linear-gradient(
    180deg,
    #2a0b0b,
    #180606
  );

  box-shadow:
    0 0 10px rgba(239, 68, 68, 0.5),
    inset 0 0 6px rgba(255, 120, 120, 0.25);
}

.tabs button.active::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  bottom: -5px;
  height: 2px;

  background: linear-gradient(
    90deg,
    transparent,
    #ef4444,
    transparent
  );

  box-shadow: 0 0 6px #ef4444;
}

.tabs button:active {
  transform: translateY(1px);
}




.effects-cards {
  display: flex;
  gap: 6px;
}

.effect-card {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  font-size: 0.85rem;
  cursor: default;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: inset 0 0 6px rgba(255,255,255,0.08);
}

.effect-S { color: #efd191; box-shadow: 0 0 6px #d6b368; }
.effect-E { color: #24d8fc; box-shadow: 0 0 6px #4c70d4; }
.effect-A { color: #24d8fc; box-shadow: 0 0 6px #4c70d4; }
.effect-T { color: orange; box-shadow: 0 0 6px orange; }
.effect-M, .effect-B { color: #d15528;     box-shadow: 0 0 6px #d15528; }
.effect-C { color: #eae198;     box-shadow: 0 0 6px #eae198; }
.effect-R { color: #f9453f;     box-shadow: 0 0 6px #f9453f; }
</style>
