<template>
  <div class="perk-tree">
    <h2>TIER[{{hero.treeTier+1}}]</h2>
    <p class="perk-points"  :class="hero.perkPoints > 0 ? 'has-points' : 'no-points'">Points: {{ hero.perkPoints }}</p>
    <button class="reset-button" @click="resetPerks">
    🔄Reset perks
    </button>
    <div class="perks-container">
      <div
        v-for="perk in visiblePerks"
        :key="perk.id"
        class="perk-card"
      >
        <div class="perk-header">
          <h3>{{ perk.name }}</h3>
          <span class="perk-level">Lvl {{ perk.level }} / {{perk.maxLevel[hero.treeTier]}}</span>
        </div>
        <p class="perk-desc">{{ perk.description }}</p>
        <p class="perk-desc"><span v-if="perk.level > 0">{{calculate(perk)}}</span></p>
        <div class="perk-footer">
          <button 
            class="upgrade-button"
            :disabled="hero.perkPoints < perk.cost || perk.level >= perk.maxLevel"
            @click="upgrade(perk)"
          >
            UPGRADE
          </button>
          <button 
            class="upgrade-button"
            style="margin-left: 5px"
            :disabled="hero.perkPoints < perk.cost || perk.level >= perk.maxLevel"
            @click="maxUpgrade(perk)"
            >M
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { computed } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { perks } from '../../data/perks.js';


const { hero } = useHero();

const visiblePerks = computed(() => {
  return perks.filter(perk => perk.maxLevel?.[hero.value.treeTier] > 0);
});

const upgrade = (perk) => {
  if (hero.value.perkPoints > 0 && perk.level < perk.maxLevel[hero.value.treeTier]) {
    hero.value.perkPoints -= 1;
    perk.level++;
  }
};

const maxUpgrade = (perk) => {
  let maxUp = perk.maxLevel[hero.value.treeTier] - perk.level;
  
  perk.level += Math.min(maxUp, hero.value.perkPoints);
  hero.value.perkPoints -= Math.min(maxUp, hero.value.perkPoints);
  
}

const resetPerks = () => {
  let refundedPoints = 0;

  for (const perk of perks) {
    if(perk.name == "Invisible" || perk.name == "Traveller")
      perk.level = perk.level;
    else {
      refundedPoints += perk.level;
      perk.level = 0;
    }
    
  }

  hero.value.perkPoints += refundedPoints;
};


const calculate = (perk) => {
  if(perk.id == 1)
    return "TOTAL: " + (perk.value ** perk.level).toFixed(2);

  if(perk.id == 4)
    return "TOTAL: " + (1 + perk.value * perk.level * 0.01).toFixed(2);

  if(perk.id == 6)
    return "TOTAL: " + (perk.value * perk.level).toFixed(1);  

  if(perk.id == 7 || perk.id == 10 || perk.id == 11 || perk.id == 12 || perk.id == 14 || perk.id == 15)
    return "";

  return "TOTAL: " + (perk.value * perk.level);
}
</script>

<style scoped>
.perk-tree {
  position: fixed;
  left: 220px;
  top: 0px;
  padding: 1.5rem;
  background: #242424;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.perk-tree h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #65fd9c;
}

.perk-points {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.has-points {
  color: #0dc399; /* зелёный */
  font-weight: bold
}

.no-points {
  color: #f44336; /* красный */
  font-weight: bold
}

.perks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.perk-card {
  background: linear-gradient(145deg, #f0f0f0, #0dc399);
  border-radius: 10px;
  box-shadow:  3px 3px 6px #d1d1d1,
               -3px -3px 6px #ffffff;
  padding: 1rem;
  width: 180px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.perk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.perk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.perk-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #333;
}

.perk-level {
  background: #2196f3;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.perk-desc {
  font-size: 0.9rem;
  color: #1c1c1c;
  margin-bottom: 1rem;
  min-height: 40px;
}

.perk-footer {
  text-align: center;
}

.upgrade-button {
  background: #4caf50;
  border: none;
  border-radius: 6px;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.upgrade-button:hover:not(:disabled) {
  background: #43a047;
}

.upgrade-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.reset-button {
  position: fixed;
  left: 80%;
  top: 4%;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.reset-button:hover {
  background-color: #d32f2f;
}
</style>
