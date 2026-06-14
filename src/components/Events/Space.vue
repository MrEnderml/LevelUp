<template>
  <div class="space-panel">
    <div class="toggle-tabs">
      <button :class="{ active: currentTab === 'battle' }" @click="switchTab('battle')">Space</button>
      <button :class="{ active: currentTab === 'rewards' }" @click="switchTab('rewards')">Space Power</button>
      <button v-if="hero.bhTier >= 3" :class="{ active: currentTab === 'shop' }" @click="switchTab('shop')">Astralis</button>
    </div>

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

    <div v-if="currentTab === 'battle'" class="battle-view">
      <FightPanel />
    </div>

    
    <div v-else-if="currentTab === 'rewards'" class="reward-layout">
      <SpacePowerPanel />
    </div>
  
    <div v-else-if="currentTab === 'shop' && hero.bhTier >= 3" class="shop-layout">
      <AstralisPanel />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, reactive } from 'vue';
import { useHero } from '../../composables/useHero.js';


import { fn } from '../../composables/utils/global.js';

import FightPanel from './SpacePanel/FightPanel.vue';
import SpacePowerPanel from './SpacePanel/SpacePowerPanel.vue';
import AstralisPanel from './SpacePanel/AstralisPanel.vue';

const { hero } = useHero();

import { useSpaces } from '../../composables/battleUtils/useSpace.js';

const {
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useSpaces();

const currentTab = ref('battle');
const showSpSettings = ref(false);

function switchTab(tab) {
  currentTab.value = tab
}

</script>

<style scoped>

.space-panel {
  background: radial-gradient(circle at center, #0d0d2b, #0a0a18 70%);
  color: #fcd34d;
  

  box-sizing: border-box;

  height: 100dvh; 


  padding: clamp(12px, 2vh, 24px);

  border-radius: 0; 
  box-shadow: none;

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.5vh, 18px);

  overflow: hidden;
  font-family: 'Orbitron', sans-serif;
}

/* === Tabs === */
.toggle-tabs {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.toggle-tabs button {
  background: rgba(252, 211, 77, 0.05);
  border: 2px solid #fcd34d;
  color: #fcd34d;
  padding: 0.6rem 1.3rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 1px;

  transition: 0.25s ease;
}

.toggle-tabs button:hover {
  background: rgba(252, 211, 77, 0.2);
  transform: translateY(-2px);
}

.toggle-tabs button.active {
  background: #fcd34d;
  color: #0d0d2b;
  box-shadow: 0 0 10px #fcd34d;
}

/* ⚙ Settings icon */
.settings-icon {
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.7em;
  color: #f0a500;
  transition: 0.3s;
}

.settings-icon:hover {
  transform: rotate(20deg);
  color: #ffd374;
}


/* === Layouts === */
.reward-layout,
.shop-layout,
.battle-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #fcd34d33;
  border-radius: 12px;

  padding: clamp(0.8rem, 1vw, 1.5rem);
  overflow: hidden;
}



.effects-cards {
  display: flex;
  gap: 6px;
}

/* MINI CARD */
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


.effect-A, .effect-W {
  background-color: #333;          
  border: 1px solid #666;
}

.effect-A:hover, .effect-W:hover {
  background-color: #555;         
  box-shadow: 0 0 6px rgba(255, 187, 0, 0.65);
}

.effect-A.active,
.effect-W.active {
  background-color: #ffb700;
  border-color: #eb7f04;
  color: #0a0a0a;
  box-shadow: 0 0 10px rgb(255, 179, 0), 0 0 15px rgb(204, 190, 0);
  transform: scale(1.1);
}


</style>
