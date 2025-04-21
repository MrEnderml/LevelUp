<template>
  <div class="souls-wrapper">
    <!-- Левая панель: цель -->
    <div class="soul-target">
      <h3>🎯 Target</h3>
      <p>[{{hero.souls}}] {{ soulNames[hero.souls] }} {{chanceFormat(enemy.soulBuff.chance)}}%</p>
      <p style="text-align: left">Description:<br>
        <span><strong>DMG MULT:</strong> [{{format(enemy.soulBuff.dmg)}}]</span><br>
        <span><strong>HP MULT:</strong> [{{format(enemy.soulBuff.hp)}}]</span><br>
        <span :title="'EXP, WEAPON CHANCE, ASCENSION SHARDS'"><strong>LOOT MULT:</strong> [{{format(enemy.soulBuff.drop)}}]</span><br> 
      </p>
    </div>

    <!-- Центральная панель: прогресс -->
    <div class="souls-panel">
      <h2> 
        <div class="tooltip-wrapper">
          <span class="info-button">ℹ️</span>
          <div class="tooltip">
            -Souls appear from 15 stage<br>
            -Each soul gives +1 Max Level and +10% EXP.<br>
            -Kill soul to gain ascension shards 1 time<br>
            -Kill 10 to up soul gathering Tier.<br>
            -As a higher stage, as a higher chance to find a soul<br>
            -P - Permanent after reaching<br>
          </div>
        </div>
      Souls T[{{hero.soulTier}}]</h2>
      <div class="progress-container">
        <div class="soul-bar">
          <div
            class="soul-fill"
            :style="{ height: ((hero.souls % 10) / 10) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>

    
      <div class="tier-rewards">
        <h3>Rewards</h3>
        <ul>
            <li v-for="(tierRewards, index) in unlockedTierRewards" :key="index">
            <strong>T{{ index + 1 }}</strong>
            <ul class="sub-rewards">
                <li v-for="(reward, i) in tierRewards" :key="i">
                {{ reward }}
                </li>
            </ul>
            </li>
        </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { rewards, soulNames } from '../../data/souls.js';

const { hero } = useHero();
const { enemy } = useEnemy();



const unlockedTierRewards = computed(() => {
  return rewards.slice(0, hero.value.soulTier + 1);
});

function format(value) {
  if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
}

function chanceFormat(value){
  if(value >= 100)
    return 100
  return value.toFixed(2);
}


</script>

<style scoped>
.souls-wrapper {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  color: #f3e8ff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-left: 200px;
}

/* Общие стили заголовков */
.soul-target h3,
.souls-panel h2,
.tier-rewards h3 {
  font-size: 1.4rem;
  font-weight: bold;
  color: #c084fc;
  text-shadow: 0 0 5px #c084fc;
  margin-bottom: 0.5rem;
}

/* Общие стили текста */
.soul-target p,
.souls-panel p,
.tier-rewards li {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #f3e8ff;
  text-shadow: 0 0 2px #9333ea;
}

/* Общие стили блоков */
.soul-target,
.souls-panel,
.tier-rewards {
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px #9333ea;
}

.soul-target {
  background-color: #3b0764;
  width: 250px;
  text-align: center;
}

.souls-panel {
  background-color: #4c1d95;
  width: 200px;
  text-align: center;
}

.tier-rewards {
  max-height: 450px;
  overflow-y: auto;
  background-color: #581c87;
  max-width: 300px;
}

/* Прогресс-бар */
.progress-container {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem 0;
  position: relative;
}

.soul-bar {
  position: relative;
  width: 20px;
  height: 100%;
  background-color: #6b21a8;
  border: 2px solid #c084fc;
  border-radius: 10px;
  overflow: hidden;
}

.soul-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to bottom, #f0abfc, #c084fc, #9333ea);
  animation: soul-pulse 2s infinite ease-in-out;
  box-shadow: 0 0 10px #c084fc, 0 0 20px #9333ea;
  overflow: hidden;
}

.soul-fill::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  animation: soul-wave 3s linear infinite;
  pointer-events: none;
}

.soul-arrow {
  position: absolute;
  left: 100%;
  transform: translateX(0.3rem);
  color: #f3e8ff;
  font-size: 1.2rem;
  transition: top 0.3s ease;
}

/* Текущий тир */
.souls-panel p:nth-of-type(2) {
  font-weight: bold;
  color: #e9d5ff;
  background-color: #7e22ce44;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  display: inline-block;
  margin-top: 0.5rem;
}

/* Tier и награды */
.tier-rewards ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tier-rewards strong {
  color: #d8b4fe;
  font-size: 1.05rem;
  text-shadow: 0 0 3px #a855f7;
}

.tier-rewards li {
  margin: 0.5rem 0;
}

.sub-rewards {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.25rem;
}

.sub-rewards li {
  font-size: 0.9rem;
  color: #e9d5ff;
  padding-left: 0.5rem;
  position: relative;
}

.sub-rewards li::before {
  position: absolute;
  left: -1rem;
  color: #c084fc;
}

/* Анимации */
@keyframes soul-pulse {
  0%, 100% {
    box-shadow: 0 0 8px #c084fc, 0 0 16px #9333ea;
  }
  50% {
    box-shadow: 0 0 15px #e9d5ff, 0 0 30px #a855f7;
  }
}

@keyframes soul-wave {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
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
  box-shadow: 0 0 10px rgba(174, 0, 255, 0.8);;
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
