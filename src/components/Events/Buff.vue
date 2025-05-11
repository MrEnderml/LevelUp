<template>
  <div class="buffs-panel">
    <h2>🌀 Buffs</h2>
    <div class="buff-status">
    <div>
      <span style="color: #fbbf24">Active: {{ hero.activeBuffs.length }} / {{ hero.maxBuffs }}</span>
      <span v-if="hero.abyssTier >= 3 && hero.rebirthPts >= 100000" style="color: #66ffcc">  -  Active: {{hero.spActiveBuffs.length}} / {{hero.maxBuffs - (hero.rebirthTier >= 15 && hero.isAbyss? 1: 0)}}</span>
    </div>
    <button
        v-if="hero.abyssTier >= 3 && hero.rebirthPts >= 100000"
        class="space-button"
        :class="{ active: hero.isSpaceBuff }"
        @click="spaceSwitch()"
      >
        Space
      </button>
    </div>

    <div class="buffs-grid">
      <div
        class="buff-card"
        v-for="buff in filterBuffs"
        :key="buff.id"
        :class="{
                  selectedmix: hero.activeBuffs.includes(buff.id) && hero.spActiveBuffs.includes(buff.id),
                  selected: hero.activeBuffs.includes(buff.id) && !hero.spActiveBuffs.includes(buff.id),
                  spselected: hero.spActiveBuffs.includes(buff.id) && !hero.activeBuffs.includes(buff.id)
                }"
        @click="toggleBuff(buff.id)"
      >
        <h3 class="buff-name">
        <strong>{{ buff.name }} T[{{ buff.tier }}]</strong>
        </h3>
        <div class="exp-bar">
            <div class="exp-fill" :style="{ width: (buff.exp / buff.maxExp[buff.tier-1]) * 100 + '%' }"></div>
            <div class="exp-text">{{formatNumber(buff.exp)}}/{{formatNumber(buff.maxExp[buff.tier-1])}}</div>
        </div>
        <transition name="fade" mode="out-in">
        <div :key="buff.tier" class="buff-description">
            <p>
              <strong>T[{{ buff.tier }}] - {{ buff.description[buff.tier-1] }}</strong>
            </p>
            <p>
              T[{{ buff.tier + 1 }}] - {{ buff.description[buff.tier] }}
            </p>
        </div>
        </transition>
       </div> 
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';

const { hero } = useHero();
const { enemy } = useEnemy();
const { buffs } = useBuff();

const filterBuffs = computed(() => 
    buffs.value.filter(b => b.active === true)
)

const getActiveDescriptions = (buff) => {
  return buff.description.slice(0, buff.tier); 
};

const toggleBuff = (id) => {
  if(hero.value.isSpaceBuff && enemy.value.isSpaceFight == 0){
    const index = hero.value.spActiveBuffs.indexOf(id);
    if (index !== -1) {
      hero.value.spActiveBuffs.splice(index, 1);
    } else if (hero.value.spActiveBuffs.length < hero.value.maxBuffs - (hero.rebirthTier >= 15 && hero.value.isAbyss? 1: 0)) {
      hero.value.spActiveBuffs.push(id);
    }
  } else if(hero.value.stage < 10 + 10 * hero.value.abyssTier){
    const index = hero.value.activeBuffs.indexOf(id);
    if (index !== -1) {
      hero.value.activeBuffs.splice(index, 1);
    } else if (hero.value.activeBuffs.length < hero.value.maxBuffs) {
      hero.value.activeBuffs.push(id);
    }
  }
};

function spaceSwitch() {
  hero.value.isSpaceBuff = !hero.value.isSpaceBuff? true: false;
}

function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}

</script>
<style scoped>


.buffs-panel {
  background-color: #1a1a1a;
  padding: 1rem;
  border-radius: 1rem;
  color: #fff7db;
  box-shadow: 0 0 10px rgba(255, 191, 0, 0.2);
  width: 75%;
  position: fixed;
  top: 5%;
  right: 2%;
}

.buffs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  overflow-y: auto;
  max-height: 500px;
  padding: 2px;
}

.buff-card {
  background-color: #1f2937;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  height: auto;
  width: 100%; /* Карточка займет всю доступную ширину до max-width */
  overflow: hidden; /* Если текст выходит за пределы, скрывать */
  box-sizing: border-box; /* Чтобы padding не увеличивал размер элемента */
}

.buff-card:hover {
  border-color: #f59e0b;
  transform: translateY(-2px);
}

.buff-card.spselected:hover {
  border-color: rgb(11, 210, 245);
  transform: translateY(-2px);
}

.buff-description {
  max-height: 140px; /* Ограничиваем высоту области описания */
  overflow-y: auto; /* Добавляем вертикальную прокрутку */
  padding-right: 5px; /* Немного отступа для скролл-бара */
}

.buff-card.selected {
  border-color: #fbbf24;
  box-shadow: 0 0 12px rgba(255, 191, 0, 0.6);
  animation: pulse 1.5s infinite;
  background: linear-gradient(145deg, #2b2b2b, #3b3b3b);
}

.buff-card.spselected {
  border-color: #66ffcc;
  box-shadow: 0 0 12px rgba(102, 255, 204, 0.66);
  animation: sppulse 1.5s infinite;
  background: linear-gradient(145deg, #2b2b2b, #3b3b3b);
}

.buff-card.selectedmix {
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #fbbf24, #66ffcc) 1;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #2b2b2b, #3a3a3a);
  animation: mixpulse 1.5s infinite;
  position: relative;
}


.buff-card h3 {
  color: #fde68a;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.buff-card p {
  font-size: 0.85rem;
  color: #fef3c7;
}

.buff-name {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: help;
  color: #facc15; /* Жёлтый */
  font-weight: bold;
}

.tooltip-content {
  visibility: hidden;
  width: 180px;
  background-color: #1e293b;
  color: #f8fafc;
  text-align: left;
  border-radius: 8px;
  padding: 0.75rem;
  position: fixed;
  z-index: 10;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  word-wrap: break-word;
  border: 1px solid #facc15; /* Добавляем синюю обводку */
  max-height: 120px;
  overflow-y: auto;
}

.tooltip-container:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.exp-bar {
  position: relative;
  background-color: #4b5563;
  height: 14px;
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  transition: width 0.4s ease-in-out;
}

.exp-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #fff7db;
  line-height: 14px;
  pointer-events: none;
}

@keyframes sppulse {
  0% {
    box-shadow: 0 0 10px rgba(102, 255, 204, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 255, 204, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(102, 255, 204, 0.4);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(255, 191, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 191, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 191, 0, 0.4);
  }
}

@keyframes mixpulse {
  0% {
    box-shadow: 0 0 10px rgba(255, 223, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 255, 204, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 223, 128, 0.4);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  box-shadow: 0 0 10px rgba(255, 191, 0, 0.8);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
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

.space-button {
  background-color: transparent;
  border: 2px solid #66ffcc;
  color: #66ffcc;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.space-button:hover {
  background-color: #66ffcc;
  color: #1a1a1a;
  box-shadow: 0 0 10px rgba(102, 255, 204, 0.6);
}

.space-button.active {
  background-color:rgba(81, 245, 190, 0.9);
  color: #1a1a1a;
  box-shadow: 0 0 15px rgba(102, 255, 204, 0.73);
}

.buff-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>