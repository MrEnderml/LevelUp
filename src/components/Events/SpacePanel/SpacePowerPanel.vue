<template>
<div class="reward-column">
            <h3 @click="hero.eLink = { set: 'Info', info: 'Space' }">✨ <sup style="font-size: 12px">ℹ️</sup>Space Power(SP) - {{hero.baseSp}} <span v-if="hero.sp > hero.baseSp">(+{{hero.sp - hero.baseSp}})</span></h3>
            <h3>🌟Star(ST) - {{hero.stBosses}} <span v-if="hero.st - hero.stBosses > 0">(+{{hero.st - hero.stBosses}})</span></h3>
            <ul>
            <li v-for="(reward, i) in sortedRewards" :key="reward.id" :class="{ 'boss-reward': reward.boss }">
                {{ formatReward(reward) }}
            </li>
            </ul>
        </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, reactive } from 'vue';
import { useHero } from '../../../composables/useHero.js';
import { spacePower as sp } from '../../../data/spacePower.js';

import { fn } from '../../../composables/utils/global.js';

const { hero } = useHero();

function formatReward(reward) {
    if (reward.sp) {
        return `${reward.sp}SP: ${reward.d}`;
    } else if (reward.st) {
        return `${reward.st}ST: ${reward.d}`;
    }
    return '';       
}

const sortedRewards = computed(() => {
    return sp.filter(reward => reward.id <= Math.min(hero.value.spCount + 1, hero.value.spMaxCount ));
});
</script>

<style scoped>
.reward-column {
  flex: 1;
  display: flex;
  flex-direction: column;

  background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  padding: 1rem 1.2rem;
  border: 2px solid #fcd34d;
  border-radius: 14px;
  min-width: 180px;

  height: 100%;
  overflow: hidden;

  box-shadow: 0 0 15px rgba(255, 230, 0, 0.15);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}

.reward-column ul {
  list-style: none;
  padding-left: 0;
  margin: 0;

  flex: 1;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: rgb(223, 226, 40) transparent;
}

.reward-column h3 {
  margin-bottom: 0.7rem;
  text-align: center;
  color: #ffe066;
  font-size: 1.2rem;
  text-shadow: 0 0 5px #fcd34d;
}

.reward-column li {
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-left: 3px solid #fcd34d;
  background: rgba(255, 255, 255, 0.02);
  color: #ffe066;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(252, 211, 77, 0.1);
  transition: background 0.3s ease;
}

.reward-column li:hover {
  background: rgba(252, 211, 77, 0.05);
  box-shadow: 0 0 12px rgba(252, 211, 77, 0.4);
}

.reward-column li.boss-reward {
  background: linear-gradient(90deg, #facc15, #f59e0b, #facc15);
  border: 2px solid #fcd34d;
  color: black;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255,255,255,0.4);
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 10px #fcd34d, 0 0 20px #f59e0b;
  }
  50% {
    box-shadow: 0 0 15px #fde047, 0 0 30px #facc15;
  }
}

</style>