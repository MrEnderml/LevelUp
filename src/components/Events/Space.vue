<template>
  <div class="space-panel">
    <div class="toggle-tabs">
      <button :class="{ active: currentTab === 'battle' }" @click="switchTab('battle')">Space</button>
      <button :class="{ active: currentTab === 'rewards' }" @click="switchTab('rewards')">Space Power</button>
      <button v-if="hero.bhTier >= 3" :class="{ active: currentTab === 'shop' }" @click="switchTab('shop')">Astralis</button>
      <span class="settings-icon" @click="showSpSettings = !showSpSettings">⚙️</span>
    </div>

    <div v-if="showSpSettings" class="settings-panel">
      <div class="settings-title">Settings</div>
      <label v-if="hero.infTier >= 5 || hero.infEvents >= 5 || hero.singularity >= 5">
        <input type="checkbox" v-model="hero.isSpaceAuto" />
        Auto battle
      </label>
      <label>
        <input type="checkbox" v-model="hero.repeatOnDefeat" />
        Retry on defeat
      </label>
      <label>
        <input type="checkbox" v-model="hero.nextEnemyOnWin" />
        Next enemy on win
      </label>
      <label>
        <input type="checkbox" v-model="hero.noBattleWindowChanges" />
        No battle window changes
      </label>
    </div>
   
    <div v-if="currentTab === 'battle'" class="battle-view">
      <div class="progress-bar" v-if="!hero.isInfSpace">
        <div class="progress-gradient" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="enemy-info" v-if="spEnemy[hero.spCount].status && hero.spCount < hero.spMaxCount">
        <h2>{{ spEnemy[hero.spCount].name }}</h2>
        <p class="boss-reward-sp"> Reward: {{spEnemy[hero.spCount].reward}}</p>
        <p>HP: {{ stats(1) }} | ATK: {{ stats(2) }} 
        | DEF: {{ stats(3) }} | ApS: {{ stats(4) }}</p>
        <p v-if="spEnemy[hero.spCount].type == 'boss'">{{spEnemy[hero.spCount].stats.curses.join(' ')}}</p>
      </div>

      <div class="enemy-info" v-else-if="hero.isInfSpace">
        <h2>Infinity Warden - {{hero.spsCount}}</h2>
        <p>HP: {{ stats(1) }} | ATK: {{ stats(2) }} 
        | DEF: {{ stats(3) }} | ApS: {{ stats(4) }}</p>
      </div>

      <div v-else style="text-align: center" @click="hero.eLink = { set: 'Info', info: 'Space' }"><sup style="font-size: 12px">ℹ️</sup>Celestials dont see you</div>

      <div class="bottom-bar" v-if="spEnemy[hero.spCount].status && hero.spCount < hero.spMaxCount || hero.isInfSpace">
        <button 
          v-if="!hero.isSpaceFightCooldown && enemy.isSpaceFight <= 0" 
          class="attack-button" 
          @click="attackEnemy"
        >
          <Tooltip :text="autoSpaceCondition" position="top">⚔️ Attack</Tooltip>
        </button>

        <button 
          v-else-if="hero.isSpaceFightCooldown"
          class="attack-button" 
          disabled
        >
          {{ Math.floor(hero.spaceFightCooldown + 1) }}s
        </button>

        <button 
          v-if="enemy.isSpaceFight === 2" 
          class="attack-button" 
          @click="LeaveEnemy"
        >
          Leave
        </button>
      </div>
    </div>

    
    <div v-else-if="currentTab === 'rewards'" class="reward-layout">
        <div class="reward-column">
            <h3 @click="hero.eLink = { set: 'Info', info: 'Space' }">✨ <sup style="font-size: 12px">ℹ️</sup>Space Power(SP) - {{hero.baseSp}} <span v-if="hero.sp > hero.baseSp">(+{{hero.sp - hero.baseSp}})</span></h3>
            <h3>🌟Star(ST) - {{hero.stBosses}} <span v-if="hero.st - hero.stBosses > 0">(+{{hero.st - hero.stBosses}})</span></h3>
            <ul>
            <li v-for="(reward, i) in sortedRewards" :key="reward.id" :class="{ 'boss-reward': reward.boss }">
                {{ formatReward(reward) }}
            </li>
            </ul>
        </div>
    </div>
  
    <div v-else-if="currentTab === 'shop' && hero.bhTier >= 3" class="shop-layout">
      <div class="head-wrapper">
        <span>Stardust: {{ formatNumber(hero.stardust) }}✨</span><br>
        <span>Infinity Warden: {{hero.spsCountMax}}</span>
      </div>

      <div class="shop-grid">
        <div v-for="perk in spaceShopFilter" :key="perk.id" 
            :class="['perk-card', { bought: perk.status }]">
          <h4 class="perk-title">{{ perk.title || 'Unknown Perk' }}</h4>
          <p class="perk-desc" v-html="highlightKeyword(perk.d, 'Infinity Warden')"></p>

          <button 
            class="perk-button"
            :disabled="spsPerkUnlocked(perk) || perk.status || hero.stardust < perk.cost"
            @click="buyPerk(perk)"
          >
            <template v-if="spsPerkUnlocked(perk)">
              🔒 Req: {{ perk.req }} Infinity Warden
            </template>
            <template v-else-if="perk.status">
              ✅ Acquired
            </template>
            <template v-else>
              {{ formatNumber(perk.cost) }} ✨
            </template>
          </button>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, reactive } from 'vue'
import { spacePower as sp } from '../../data/spacePower.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { spEnemy } from '../../data/spaceEnemy.js';
import { perks as ascension } from '../../data/ascension.js';
import { spaceShop } from '../../data/spaceShop.js'

const { hero } = useHero();
const { enemy } = useEnemy();

const currentTab = ref('battle');
const showSpSettings = ref(false);

function switchTab(tab) {
  currentTab.value = tab
}

function stats(id){
  switch(id){
    case 1: return formatNumber(enemy.value.totalSpaceStats.hp);
    case 2: return formatNumber(enemy.value.totalSpaceStats.dmg);
    case 3: return formatNumber(enemy.value.totalSpaceStats.def);
    case 4: return (spEnemy[hero.value.spCount].stats.AS).toFixed(2);
  }
}


function autoSpaceCondition () {
  if(hero.value.isSpaceAuto)
    return hero.value.autoSpaceCondition;
  
  return;
}

const spaceShopFilter = computed(() => {
  return Array.isArray(spaceShop.value)
    ? [...spaceShop.value].sort((a, b) => a.idx - b.idx)
    : [];
});


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
  if(hero.value.dId == 'bh' || hero.value.isSingularity)
    return;
  
  enemy.value.isSpaceFight = 1;
}

function LeaveEnemy(){
  enemy.value.isSpaceFight = 4;
}


const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}

function spsPerkUnlocked(perk){
  return !(hero.value.spsCountMax >= perk.req);
}

function buyPerk(perk) {
  if (hero.value.stardust >= perk.cost && !perk.status) {
    hero.value.stardust -= perk.cost;
    perk.status = true;
  }
}

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${keyword}s?)`, 'gi');
  return text.replace(regex, `<span style="color:#ffdd55;font-weight:bold;">$1</span>`);
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
  scrollbar-width: thin;
  scrollbar-color: rgb(223, 226, 40) transparent;
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




.settings-icon {
  margin-left: 8px;
  cursor: pointer;
  font-size: 1.5em;
  color: #f0a500;
}

.settings-panel {
  position: absolute;
  z-index: 200;
  right: 0;
  background: #0f0f0f;
  padding: 14px 18px;
  border-radius: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
}

.settings-title {
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 4px;
  color: #f0ebd8;
  text-align: center;
}

.settings-panel label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f0ebd8;
  font-size: 1em;
}

.settings-panel input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #888;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  position: relative;
}

.settings-panel input[type="checkbox"]:checked {
  background: #f0ebd8;
  border-color: #f0ebd8;
}

.settings-panel input[type="checkbox"]:checked::after {
  content: '✔';
  position: absolute;
  top: -2px;
  left: 3px;
  font-size: 14px;
  color: #0f0f0f;
}

.spaceShop {
  max-height: 600px;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgb(223, 226, 40) transparent;
}




.shop-layout {
  padding: 1rem;
  max-height: 60vh;
  max-width: 95vh;
  overflow-y: auto;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.perk-card {
  background: linear-gradient(145deg, #0b0b1f, #1a1a2f);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 180px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.7), 0 0 12px #6600ff40 inset;
}

.perk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.8), 0 0 20px #aa33ff60 inset;
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
  transition: background 0.2s, transform 0.2s;
}

.perk-button:hover:not(:disabled) {
  transform: scale(1.05);
  background: linear-gradient(90deg, #ffaa22, #ffee55);
}

.perk-button:disabled {
  background: #555;
  cursor: not-allowed;
}

.head-wrapper {
  font-size: 1.2em;
  text-align: center;
  font-weight: bold;
}

</style>
