<template>
<div class="top-right-wrapper">
  <div class="afk-stats">

  <div class="afk-header">

    <div class="afk-title">
      Average Loot
    </div>

    <button
      class="afk-mode-btn"
      @click="switchAfkMode"
    >
      {{ hero.settings.afkMode }}
    </button>

  </div>

  <div class="afk-row">
    <span>Exp/{{ hero.settings.afkMode }}:</span>

    <span class="purple">
      {{ fn(hero.avgLoot.exp.perSec * afkMultiplier) }}
    </span>
  </div>

  <div
    class="afk-row"
    v-if="hero.maxStage >= 20 || hero.mainInfTier >= 1"
  >
    <span>Skill Exp/{{ hero.settings.afkMode }}:</span>

    <span class="yellow">
      {{ fn(hero.avgLoot.skillExp.perSec * afkMultiplier) }}
    </span>
  </div>

  <div
    class="afk-row"
    v-if="hero.spCount >= 5"
  >
    <span>Mutagen/{{ hero.settings.afkMode }}:</span>

    <span class="green">
      {{ fn(hero.avgLoot.mutagen.perSec * afkMultiplier) }}
    </span>
  </div>

  <div
    class="afk-row"
    v-if="hero.spCount >= 2"
  >
    <span>Stardust/{{ hero.settings.afkMode }}:</span>

    <span class="gold">
      {{ fn(hero.avgLoot.stardust.perSec * afkMultiplier) }}
    </span>
  </div>

  <div
    class="afk-row"
    v-if="hero.infExpansions.ascensioin"
  >
    <span>Ascension/{{ hero.settings.afkMode }}:</span>

    <span class="blue">
      {{ fn(hero.avgResources.ascension.perSec * afkMultiplier) }}
    </span>
  </div>

  <div
    class="afk-row"
    v-if="hero.infExpansions.rebirth && hero.singularity < 8"
  >
    <span>Rebirth/{{ hero.settings.afkMode }}:</span>

    <span class="green">
      {{ fn(hero.avgResources.rebirth.perSec * afkMultiplier) }}
    </span>
  </div>

  <div v-if="!hero.isSingularity" class="afk-row">
    <span>Kills/{{ hero.settings.afkMode }}:</span>

    <span class="yellow">
      {{ fn(hero.avgLoot.kills.perSec * afkMultiplier) }}
    </span>
  </div>

  </div>

  <div v-if="hero.mainInfTier >= 10" class="info-box">
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
import { ref, computed } from 'vue';
import { useHero } from '../../composables/useHero.js'
import { useEnemy } from '../../composables/useEnemy.js'
import { dimensions } from '../../data/dimensions.js';
import { timelineLevels } from '../../data/timeline.js';
import { glitchify, fn } from '../../composables/utils/global.js';

const { hero } = useHero();
const { enemy } = useEnemy();

const afkModes = ['s', 'm', 'h', 'd'];

const afkMultiplier = computed(() => {
  switch (hero.value.settings.afkMode) {
    case 'm': return 60;
    case 'h': return 3600;
    case 'd': return 86400;
    default: return 1;
  }
});

function switchAfkMode() {

const idx =
  afkModes.indexOf(hero.value.settings.afkMode);

hero.value.settings.afkMode =
  afkModes[(idx + 1) % afkModes.length];
}



function curDimension(){
  let d = dimensions.value.find(d => d.id === hero.value.dId);

  if(hero.value.dId == 'bh') return `[Black Hole] [${d.idx}]`;
  if(hero.value.dId == 'advanceBH') return `[Timeline] [${d.idx}]`;

  let name = (hero.value.dId.startsWith('c-')? glitchify(d.name): d.name);

  return d ? `[${name}] [${d.idx}]` : '[Unknown]';
}


function curTier(){
  let d = dimensions.value.find(d => d.id === hero.value.dId);
  if (!d) return '[?]';
  
  if(hero.value.dId == 'advanceBH') return `[${timelineLevels[hero.value.timelineActiveTier].req['Infinity Tier']}]`;
  if(hero.value.dId.startsWith('d-')) return `[${d.infTier}]`;

  if (hero.value.dId === 'main') return `[${hero.value.mainInfTier}]`;
  if (['unlimitted', 'abyss-d', 'survival-2', 'bh', 'advanceBH', 'dimMerge'].includes(hero.value.dId))
    return `[${d.infTier}]`;
    
  return `${d.infTier}/${d.maxInfTier}`;
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

.afk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 10px;
}

.afk-mode-btn {
    min-width: 34px;
    height: 26px;

    border: 1px solid rgba(168, 85, 247, 0.35);
    border-radius: 8px;

    background:
        linear-gradient(
            180deg,
            rgba(40, 30, 60, 0.95),
            rgba(20, 15, 35, 0.95)
        );

    color: #d8b4fe;

    font-size: 0.8rem;
    font-weight: 700;

    cursor: pointer;

    transition: 0.2s;
}

.afk-mode-btn:hover {
    transform: translateY(-1px);

    border-color: #c084fc;

    box-shadow:
        0 0 10px rgba(192, 132, 252, 0.25);
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

.blue {
  color: #6ee7ff
}

</style>
