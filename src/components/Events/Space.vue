<template>
  <div class="space-panel">
    <div class="toggle-tabs">
      <button :class="{ active: currentTab === 'battle' }" @click="switchTab('battle')">Space</button>
      <button :class="{ active: currentTab === 'rewards' }" @click="switchTab('rewards')">Space Power</button>
    </div>

   
    <div v-if="currentTab === 'battle'" class="battle-view">
      <div class="progress-bar">
        <div class="progress-gradient" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="enemy-info" v-if="spEnemy[hero.spCount].status && hero.spCount < hero.spMaxCount">
        <h2>{{ spEnemy[hero.spCount].name }}</h2>
        <p class="boss-reward-sp"> Reward: {{spEnemy[hero.spCount].reward}}</p>
        <p>HP: {{ stats(1) }} | ATK: {{ stats(2) }} 
        | DEF: {{ stats(3) }} | ApS: {{ stats(4) }}</p>
        <p v-if="spEnemy[hero.spCount].type == 'boss' || hero.spCount > 23">{{spEnemy[hero.spCount].stats.curses.join(' ')}}</p>
      </div>
      <div v-else style="text-align: center">Celestials dont see you</div>

      <div class="bottom-bar" v-if="spEnemy[hero.spCount].status && hero.spCount < hero.spMaxCount">
        <button v-if="enemy.isSpaceFight == 0" class="attack-button" @click="attackEnemy">⚔️ Attack</button>
        <button v-if="enemy.isSpaceFight == 2" class="attack-button" @click="LeaveEnemy">Leave</button>
        <button v-if="hero.infTier >= 5 || hero.singularity >= 5" class="auto-button" :class="{ active: hero.isSpaceAuto }" @click="autoEnemy">AUTO</button>
      </div>
    </div>

    
    <div v-else class="reward-layout">
        <div class="reward-column">
            <h3>✨ Space Power(SP) - {{hero.sp}}</h3>
            <h3>🌟Star(ST) - {{hero.st}}</h3>
            <ul>
            <li v-for="(reward, i) in sortedRewards" :key="reward.id" :class="{ 'boss-reward': reward.boss }">
                {{ formatReward(reward) }}
            </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { spacePower as sp } from '../../data/spacePower.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { spEnemy } from '../../data/spaceEnemy.js';
import { perks as ascension } from '../../data/ascension.js';

const { hero } = useHero();
const { enemy } = useEnemy();
const currentTab = ref('battle')

function switchTab(tab) {
  currentTab.value = tab
}

function stats(id){
  let penalty = hero.value.infTier - (ascension[42].level?1:0);
  switch(id){
    case 1: return lastEnemy(spEnemy[hero.value.spCount].stats.hp * (1 + penalty * 0.1));
    case 2: return lastEnemy(spEnemy[hero.value.spCount].stats.dmg * (1 + penalty * 0.1));
    case 3: return lastEnemy(spEnemy[hero.value.spCount].stats.def * (1 + penalty * 0.1));
    case 4: return (spEnemy[hero.value.spCount].stats.AS * (1 + penalty * 0.02) * (1 - 0.02 * hero.value.survivalLevel)).toFixed(2);
  }
}

function lastEnemy(value){
  return hero.value.spCount == 36? 'E': Math.floor(value);
}

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

const progressPercent = computed(() => ((hero.value.spCount%6) / 6) * 100)

function attackEnemy() {
  if(hero.value.spCount == 36)
    return;
  enemy.value.isSpaceFight = 1;
}

function LeaveEnemy(){
  enemy.value.isSpaceFight = 4;
}

function autoEnemy(){
  hero.value.isSpaceAuto = !hero.value.isSpaceAuto? true: false;
}
</script>

<style scoped>
.space-panel {
  background: radial-gradient(circle at center, #0d0d2b, #1a1a40);
  color: #fcd34d;
  font-family: 'Orbitron', sans-serif;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(255, 230, 0, 0.2);
  position: relative;
  overflow: hidden;
}

/* Tabs */
.toggle-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.toggle-tabs button {
  background: transparent;
  border: 2px solid #fcd34d;
  color: #fcd34d;
  padding: 0.5rem 1.2rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.toggle-tabs button.active {
  background: #fcd34d;
  color: black;
}

/* Прогресс */
.progress-bar {
  height: 10px;
  width: 100%;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.progress-gradient {
  height: 100%;
  background: linear-gradient(to right, #fcd34d, red);
  transition: width 0.3s ease;
}

.enemy-info {
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid #fcd34d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 15px rgba(252, 211, 77, 0.2);
  backdrop-filter: blur(3px);
  animation: fadeIn 0.8s ease-out;
}

.enemy-info h2 {
  font-size: 1.8rem;
  background: linear-gradient(90deg, #fcd34d, #ff7300);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 230, 0, 0.5);
  margin-bottom: 0.5rem;
}

.boss-reward-sp {
  margin-bottom: 0.7rem;
  text-align: center;
  color: #ffe066;
  font-size: 1.2rem;
  text-shadow: 0 0 5px #fcd34d;
}



.attack-button {
  background: linear-gradient(90deg, #fcd34d, #ff4d00);
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 15px rgba(252, 211, 77, 0.4);
  animation: pulse 1.5s infinite;
}

.bottom-bar {
    text-align: center;
}

.attack-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(252, 211, 77, 0.7);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(252, 211, 77, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(252, 211, 77, 0.7);
  }
  100% {
    box-shadow: 0 0 10px rgba(252, 211, 77, 0.3);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Награды */
.reward-layout {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-start;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}
.reward-column {
  flex: 1;
  background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  padding: 1rem 1.2rem;
  border: 2px solid #fcd34d;
  border-radius: 14px;
  min-width: 180px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 0 15px rgba(255, 230, 0, 0.15);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
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

.reward-column h3 {
  margin-bottom: 0.7rem;
  text-align: center;
  color: #ffe066;
  font-size: 1.2rem;
  text-shadow: 0 0 5px #fcd34d;
}
.reward-column ul {
  list-style: none;
  padding-left: 0;
}
.reward-center {
  flex: 1;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffe066;
  padding: 1rem;
}



.reward-column li.boss-reward {
  background: linear-gradient(90deg, #facc15, #f59e0b, #facc15);
  border: 2px solid #fcd34d;
  color: black;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255,255,255,0.4);
  animation: pulseGlow 2s infinite;
  position: relative;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 10px #fcd34d, 0 0 20px #f59e0b;
  }
  50% {
    box-shadow: 0 0 15px #fde047, 0 0 30px #facc15;
  }
}

.auto-button {
  background: linear-gradient(145deg, #ff4d4d, #ffcc00);
  color: #000;
  border: none;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(255, 0, 0, 0.4);
  transition: background 0.3s, transform 0.2s;
  margin-left: 10px;
}

.auto-button.active {
  border: 2px solid lightgreen;
  box-shadow: 0 0 12px rgba(255, 255, 0, 0.6);
  transform: scale(1.05);
}


</style>
