<template>
<div class="top-right-wrapper">
  <div class="afk-stats">
    <div class="afk-title">Average Loot</div>
    <div class="afk-row">
      <span>Exp/min:</span>
      <span class="purple">{{ formatNumber(avgLootPerMinute.exp) }}</span>
    </div>
    <div class="afk-row" v-if="hero.maxStage >= 20 || hero.mainInfTier >= 1">
      <span>Buff Exp/min:</span>
      <span class="yellow">{{ formatNumber(avgLootPerMinute.buffexp) }}</span>
    </div>
    <div class="afk-row" v-if="hero.spCount >= 5">
      <span>Mutagen/min:</span>
      <span class="green">{{ formatNumber(avgLootPerMinute.mutagen) }}</span>
    </div>
    <div class="afk-row" v-if="hero.spCount >= 1 && stardustStage()">
      <span>Stardust/min:</span>
      <span class="gold">{{ formatNumber(avgLootPerMinute.stardust) }}</span>
    </div>
  </div>
  <div v-if="hero.abyssDStages >= 80" class="info-box">
    <div class="info-title">Dimension Info</div>
    <div class="info-line">🌐 Dimension: <span style="color: #f942f9;">{{ curDimension() }}</span></div>
    <div class="info-line">
        <span class="label-with-icon">
            <span class="infinity-glow">∞</span> Tier:
        </span>
        <span style="color: gold">{{ curTier() }}</span>
    </div>
    <div class="info-line">🕐 Time: <span>{{ timeFormat(hero.dTimer) }}</span></div>
  </div>
</div>
</template>

<script setup>
import { useHero } from '../composables/useHero.js'
import { useEnemy } from '../composables/useEnemy.js'
import { dimensions } from '../data/dimensions.js';
import { avgLootPerMinute } from '../composables/afkHandle.js';

const { hero } = useHero();
const { enemy } = useEnemy();

function curDimension(){
  let d = dimensions.value.find(d => d.id === hero.value.dId);
  return d ? `[${d.name}] [${d.idx}]` : '[Unknown]';
}

function stardustStage(){
  let stage = 39 - (hero.value.spCount >= 8? 1: 0) - (hero.value.spCount >= 14? 2: 0) - (hero.value.spCount >= 20? 2: 0) - 
  (hero.value.spCount >= 32? 3: 0) - (hero.value.spCount >= 39? 3: 0) - (hero.value.spCount >= 44? 4: 0);
  return hero.value.stage >= stage;
}

function curTier(){
  let d = dimensions.value.find(d => d.id === hero.value.dId);
  if (!d) return '[?]';
  
  if(hero.value.dId.startsWith('d-')) return `[${d.infTier}]`;

  if (hero.value.dId === 'main') return `[${hero.value.mainInfTier}]`;
  if (['unlimitted', 'abyss-d', 'survival-2', 'bh'].includes(hero.value.dId))
    return `[${d.infTier}]`;
    
  return `[${d.infTier}]/[${d.maxInfTier}]`;
}

function timeFormat(t) {
  if (isNaN(t) || t == null) return '00:00';

  const sec = Math.floor(t % 60).toString().padStart(2, '0');
  const min = Math.floor((t / 60) % 60).toString().padStart(2, '0');
  const hr  = Math.floor((t / 3600) % 24).toString().padStart(2, '0');
  const days = Math.floor(t / 86400);

  if (days > 0) {
    return `${days}d ${hr}:${min}:${sec}`;
  } else if (hr !== '00') {
    return `${hr}:${min}:${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}

const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);

    if (tier >= units.length) {
      return "999d";
    }

    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }
</script>

<style scoped>
.info-box {
  background: linear-gradient(to bottom right, #2a2340, #1a1325);
  color: #e0e0ff;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 0 10px rgba(100, 100, 255, 0.3);
  font-family: 'Orbitron', sans-serif;
  max-width: 240px;
}

.info-title {
  font-weight: bold;
  color: #cfa9ff;
  margin-bottom: 6px;
  font-size: 15px;
}

.info-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
}

.label-with-icon {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-line span {
  color: #ffffff;
  font-weight: 600;
}

.infinity-glow {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  line-height: 20px;
}

.afk-stats {
  background: rgba(20, 20, 30, 0.9);
  padding: 12px 16px;
  border-radius: 10px;
  font-family: 'Orbitron', sans-serif;
  color: #ddd;
  font-size: 14px;
  width: max-content;
  box-shadow: 0 0 10px rgba(100, 255, 255, 0.1);
}

.afk-title {
  font-weight: bold;
  text-align: center;
  font-size: 15px;
}

.afk-row {
  display: flex;
  justify-content: space-between;
  min-width: 200px;
}

.purple {
  color: #bb86fc;
}

.yellow {
  color: #ffd700;
}

.green {
  color: #7CFC00;
}

.gold {
  color: #ffcc66;
}

.top-right-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 12px; /* расстояние между блоками */
  z-index: 1000;
}
</style>
