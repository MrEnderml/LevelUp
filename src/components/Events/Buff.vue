<template>
  <div class="buffs-panel">
    <h2>🌀 Buffs
    <div class="tooltip-wrapper">
      <span class="info-button">ℹ️</span>
      <div class="tooltip">
        -After 10 stage all buffs become permanent. You can change them after ASCENSION or REBIRTH<br>
        -Reach 20 stage to gain EXP for buff. 
      </div>
      </div>
    </h2>
    <p>Active: {{ hero.activeBuffs.length }} / {{ hero.maxBuffs }}</p>

    <div class="buffs-grid">
      <div
        class="buff-card"
        v-for="buff in filterBuffs"
        :key="buff.id"
        :class="{ selected: hero.activeBuffs.includes(buff.id) }"
        @click="toggleBuff(buff.id)"
      >
        <h3 class="buff-name">
        <strong>{{ buff.name }} T[{{ buff.tier }}]</strong>
        <span class="tooltip-container">🌀
            <div class="tooltip-content">
            <p v-for="(desc, index) in getActiveDescriptions(buff)" :key="index">
                <strong>T[{{ index + 1 }}]</strong>: {{ desc }}
            </p>
            </div>
        </span>
        </h3>
        <div class="exp-bar">
            <div class="exp-fill" :style="{ width: (buff.exp / buff.maxExp[buff.tier-1]) * 100 + '%' }"></div>
            <div class="exp-text">{{buff.exp.toFixed(0)}}/{{buff.maxExp[buff.tier-1]}}</div>
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
import { useBuff } from '../../data/buffs.js';

const { hero } = useHero();
const { buffs } = useBuff();

const filterBuffs = computed(() => 
    buffs.value.filter(b => b.active === true)
)

const getActiveDescriptions = (buff) => {
  return buff.description.slice(0, buff.tier); 
};

const toggleBuff = (id) => {
  if(hero.value.stage < 10){
    const index = hero.value.activeBuffs.indexOf(id);
    if (index !== -1) {
      hero.value.activeBuffs.splice(index, 1);
    } else if (hero.value.activeBuffs.length < hero.value.maxBuffs) {
      hero.value.activeBuffs.push(id);
    }
  }
};
</script>

<style scoped>
.buffs-panel {
  background-color: #1a1a1a;
  padding: 1rem;
  border-radius: 1rem;
  color: #fff7db;
  box-shadow: 0 0 10px rgba(255, 191, 0, 0.2);
}

.buffs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
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
  max-width: 250px; /* Ограничиваем максимальную ширину */
  max-height: 350px; /* Ограничиваем максимальную высоту */
  height: auto;
  width: 100%; /* Карточка займет всю доступную ширину до max-width */
  overflow: hidden; /* Если текст выходит за пределы, скрывать */
  box-sizing: border-box; /* Чтобы padding не увеличивал размер элемента */
}

.buff-card:hover {
  border-color: #f59e0b;
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

</style>