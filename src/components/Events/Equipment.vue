<template>
  <div class="equipment-panel">
    <h2> EQUIPMENT 
      <span class="tooltip-container"> ℹ️
        <span class="tooltip-text" v-if="heroComputed">
            Chance to drop equipment:<br>
            <span>Sword[T{{heroComputed.equipmentTiers['sword'] + 1}}]: {{ heroComputed.dropChance['sword'].toFixed(2) }}% - [MAX - {{heroComputed.eqTierReq['sword']}}]</span><br>
            <span>Body[T{{heroComputed.equipmentTiers['armor'] + 1}}]: {{ heroComputed.dropChance['armor'].toFixed(2) }}% - [MAX - {{heroComputed.eqTierReq['armor']}}]</span><br>
            <span>Boots[T{{heroComputed.equipmentTiers['boots'] + 1}}]: {{ heroComputed.dropChance['boots'].toFixed(2) }}% - [MAX - {{heroComputed.eqTierReq['boots']}}]</span><br>
            <span v-if="heroComputed.eqTierReq['ring'] > 0">Ring[T{{heroComputed.equipmentTiers['ring'] + 1}}]: 
            {{ heroComputed.dropChance['ring'].toFixed(2) }}% - [MAX - {{heroComputed.eqTierReq['ring']}}]</span><br>
            <span v-if="hero.rebirthPts >= 35">Gather a complect to gain bonus: </span><br>
            <span v-if="hero.rebirthPts >= 35">(T3, T3, T3) - +3 Min Level, +3 Max Level</span><br>
            <span v-if="hero.rebirthPts >= 200">(T4, T4, T4, T4) - +4 Min Level, +4 Max Level</span><br>
            <span v-if="hero.rebirthPts >= 4000">(T5, T5, T5, T5) - +5 Min Level, +5 Max Level</span><br>
        </span>        
      </span>
    </h2>
    
    <div
      class="equipment-slot"
      v-for="item in equippedItems"
      :key="item.type"
    >
      <div class="icon">{{ icons[item.type] }}</div>
      <div class="info">
        <p class="item-name">{{ item.name }}[T{{item.tier}}]</p>
        <span class="stat">+{{ item.bonusDisplay }} Max Level</span>
        <span class="stat">+{{ item.ownProperty }} {{ item.stat }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { equipment } from '../../data/equipment.js';

const { hero } = useHero();

const heroComputed = computed(() => hero.value);
console.log(heroComputed.value)

const icons = {
  sword: '⚔️',
  armor: '🧥',
  boots: '🥾',
  ring: '💍',
};

const getStatName = (type) => {
  switch (type) {
    case 'sword': return 'MULT DMG';
    case 'armor': return 'HP';
    case 'boots': return 'ATTACK PER SECOND';
    case 'ring': return 'MULT EXP';
    default: return '';
  }
};

const bonusType = (type) => {
    switch (type) {
        case 'sword': return 'multDmg';
        case 'armor': return 'hp';
        case 'boots': return 'speed';
        case 'ring': return 'expMult';
        default: return '';
    }
}

const equippedItems = computed(() => {
  return Object.entries(hero.value.equipmentTiers).map(([type, tier]) => {
    if (tier <= 0) return null;
    const eqData = equipment.find(e => e.type === type);
    const tierData = eqData?.tiers?.find(t => t.tier === tier);

    return {
      type,
      tier,
      name: tierData?.name || '???',
      bonusDisplay: tierData?.bonus?.cap ?? '?',
      ownProperty: tierData?.bonus[bonusType(type)] ?? '?',
      stat: getStatName(type),
    };
  }).filter(Boolean);
});
</script>

<style scoped>
.equipment-panel {
  background: #1e1e2f;
  color: #f0f0f0;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  max-width: 400px;
  margin: auto;
}

.equipment-panel h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #66ffcc;
}

.equipment-slot {
  display: flex;
  align-items: center;
  background: #2a2a3d;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
}

.equipment-slot:hover {
  transform: scale(1.02);
  border-color: #66ffcc;
}

.icon {
  font-size: 2rem;
  margin-right: 1rem;
  text-shadow: 0 0 6px #66ffcc;
}

.info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.stat, .tier {
  font-size: 0.9rem;
  color: #aaa;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 6px;
  font-size: 0.9em;
  color: #ccc;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  font-size: 14px;
  width: max-content;
  background-color: #222;
  color: #fff;
  text-align: left;
  padding: 6px 10px;
  border-radius: 4px;
  position: absolute;
  z-index: 10;
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  transition: opacity 0.2s ease-in-out, visibility 0.2s;
  pointer-events: none;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
