<template>
  <div class="souls-wrapper">
    <div class="soul-header">
        <h2 class="soul-title" @click="hero.eLink = { set: 'Info', info: 'Soul' }">
          <span class="info-icon"></span> Souls
        </h2>

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
    </div>

    
    
    <div class="soul-bottom">
      <SoulPowerPanel />
    </div>

    
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';

import SoulPowerPanel from './SoulPanel/SoulPowerPanel.vue';
import { useSouls } from '../../composables/battleUtils/useSouls.js';

const { hero } = useHero();



const {
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useSouls();


</script>

<style scoped>
.souls-wrapper {
  box-sizing: border-box;

  height: 100dvh; 

  background: linear-gradient(145deg, #141214, #372c37);
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

.soul-title {
  color: #f424fb;            
  text-shadow: 0 0 6px  #f424fb; 
  text-align: center;  
}

.info-icon {
  font-size: 0.55rem;       
  vertical-align: middle;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
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


.effect-T { color: #5920b6; box-shadow: 0 0 6px #432b69; }
.effect-B { color: #9db8ff; box-shadow: 0 0 6px #0d3dc1; }
.effect-S { color: #e6d7ff;     box-shadow: 0 0 6px #72599c; }
.effect-A { color: #ba18bd;     box-shadow: 0 0 6px #7e3d7f; }
.effect-R { color: #ff69b4;     box-shadow: 0 0 6px #7a4760; }

</style>
