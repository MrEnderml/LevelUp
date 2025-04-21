<template>
  <div class="sidebar">
    <div class="level-bar">
      <div class="tooltip-wrapper-lvl">
          <p>
            <span class="info-button-lvl">ℹ️</span> 
            Level: {{ eLevel }}<span v-if="level - eLevel > 0">(+{{hero.divLevel}})</span>/{{ maxLevel }}
          </p>
          <div class="tooltip-lvl">
            Every level gives you {{2 + 0.5 * Math.floor(hero.potential/10)}} HP, {{1 + 0.2 * Math.floor(hero.potential/20)}} DMG, {{0.5 + 0.1 * Math.floor(hero.potential/30)}} DEF
          </div>
        </div>
      
      <div class="exp-bar-container">
        <div
          class="exp-bar"
          :style="{ width: `${Math.min(100, (exp / nextLevelExp) * 100)}%` }"
        ></div>
      </div>
      <p class="exp-text">{{ exp.toFixed(0) }} / {{ nextLevelExp.toFixed(0) }} EXP</p>
    </div>

    <h3>📜 Events</h3>

    <div
      v-for="event in events"
      :key="event.name"
      class="event-wrapper"
    >
      <button
        :class="{ active: modelValue === event.name, locked: hero.maxStage < event.minStage || hero.maxReachedLevel < event.minLevel }"
        :disabled="hero.maxStage < event.minStage || hero.maxReachedLevel < event.minLevel"
        @click="emit('update:modelValue', event.name)"
      >
        <span class="icon">{{ icons[event.name] || '❔' }}</span>
        {{ event.name }}
      </button>

      <div
        v-if="hero.maxStage < event.minStage || hero.maxReachedLevel < event.minLevel"
        class="tooltip"
      >
        🔒 <span v-if="event.minStage">Stage</span><span v-else>Level</span> {{ event.minStage || event.minLevel }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useHero } from '../composables/useHero.js';

const props = defineProps({
  hero: Object,
  events: Array, 
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const exp = computed(() => props.hero.exp);
const nextLevelExp = computed(() => props.hero.nextLevelExp);
const level = computed(() => props.hero.level);
const eLevel = computed(() => props.hero.eLevel);
const maxLevel = computed(() => props.hero.maxLevel);

let div = computed(() => level.value - eLevel.value);

const icons = {
  'Combat': '⚔️',
  'Equipment': '🔥',
  'Buff': '⚡',
  'Tree': '🌿',
  'Ascension': '🌌',
  'Soul': '💀',
  'Amulet': '🔮',
  'Rebirth': '♻️',
  'Space': '✨',
  'Radiation': '☢️',
  'Settings': '⚙️',
  'Info': '📖'
}

const extraIcons = [
  '☄️', '👁️‍🗨️', '♊', '🧠', '🌑', '💥', '❄️', '💎', '🍀', '🌫️', '🔪', '🏹', '🩸', '⛓️', '🩹'
]


</script>




<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 200px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  border-radius: 0 16px 16px 0;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 1000;
}

.level-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.level-bar p {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}

.exp-bar-container {
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.exp-bar {
  height: 100%;
  background-color: #2196f3;
  border-radius: 5px;
  transition: width 0.2s;
}

.exp-text {
  color: #fff;
  font-size: 0.9rem;
}

.sidebar h3 {
  margin-bottom: 1rem;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 2px #000;
}

.sidebar button {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #eee;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.sidebar button .icon {
  margin-right: 0.5rem;
}

.sidebar button:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: scale(1.02);
}

.sidebar button.active {
  background-color: #2196f3;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 5px #2196f3;
}

.event-wrapper {
  position: relative;
}

.sidebar button.locked {
  opacity: 0.5;
  pointer-events: none;
}

.tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background-color: #000000cc;
  color: #fff;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.event-wrapper:hover .tooltip {
  opacity: 1;
}

.tooltip-lvl {
  position: absolute;
  top: 80%;
  left: 100%;
  transform: translateX(-50%);
  background-color: #1c1917;
  color: #fef2f2;
  padding: 0.8rem;
  border-radius: 0.5rem;
  width: 220px;
  font-size: 0.85rem;
  text-align: left;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper-lvl:hover .tooltip-lvl {
  opacity: 1;
  pointer-events: auto;
}

.tooltip-wrapper-lvl {
  position: relative;
  display: inline-block;
}

.info-button-lvl {
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  color: #fee2e2;
  transition: transform 0.2s;
}

.info-button-lvl:hover {
  transform: scale(1.2);
}

</style>
