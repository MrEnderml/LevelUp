<template>
  <div class="infinity-panel">
    <div class="infinity-goals">
      <h2>Infinity Points(IP): {{hero.infPoints}}</h2>
      <div class="goals-grid">
        <div :class="['goal', { completed: goal.tier == goal.maxTier }]" v-for="goal in goals" :key="goal.id">
        <Tooltip :text="() => infDescription(goal)">
          <span>{{goal.icon}}</span>
        </Tooltip>
        </div>
      </div>
    </div>

    <div class="infinity-bonuses">
      <h2>Infinity Bonuses</h2>
      <div v-for="bonus in filterBonuses" :key="bonus.id">
        <strong>{{ bonus.stat }}:</strong> {{ bonus.value }}<br>
        <strong v-if="filterBonuses.length == bonus.id && hero.infTier < 7">Reach Infinity [T{{hero.infTier + 1}}]</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { goals } from '../../data/infGoals.js';

const { hero } = useHero();

const filterBonuses = computed(() => 
  bonuses.value.filter(bonus => bonus.status <= hero.value.infTier)
);

function infDescription(goal) {
  let str = goal.requirement[goal.tier];

  str += `<br><span>Reward: ${goal.reward} IP</span>`;

  return str;
}

const bonuses = computed(() => [
  { id: 1, stat: 'Damage', value: `*${(1.05 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 0 },
  { id: 2, stat: 'HP', value: `*${(1.045 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 0 },
  { id: 3, stat: 'Defense', value: `*${(1.04 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 0 },
  { id: 4, stat: 'EXP Gain', value: `*${(1.1 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 0 },
  { id: 5, stat: 'Equipment Chance', value: `*${(1.08 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 1 },
  { id: 6, stat: 'Souls weakness', value: `*${(1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 1 },
  { id: 7, stat: 'Overkill', value: `+${Math.floor(1.1 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)))}`, status: 2 },
  { id: 8, stat: 'Ascension Shards Gain', value: `*${(1.05 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 3 },
  { id: 9, stat: 'Rebirth Shards Gain', value: `*${(1.025 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 3 },
  { id: 10, stat: 'Buff Exp Gain', value: `*${(1.065 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 4 },
  { id: 11, stat: 'Corruption weakness', value: `+${(1.01 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)) - 1).toFixed(2)}`, status: 5 },
  { id: 12, stat: 'Enemy weakness', value: `*${(1 / 1.02 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 6 },
  { id: 13, stat: 'Level scalles better', value: `*${(1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 7 },
  { id: 14, stat: 'Stage scalles better', value: `*${(1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))).toFixed(2)}`, status: 7 },
  
]);
</script>

<style scoped>
.infinity-panel {
  display: flex;
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  padding: 20px;
  gap: 20px;
  border: 2px solid gold;
  border-radius: 20px;
  margin-left: 200px;
}

.infinity-goals {
  flex: 6;
  background: #353535;
  border: 2px solid gold;
  border-radius: 15px;
  padding: 20px;
  color: gold;
  box-shadow: 0 0 10px gold;
}

.infinity-bonuses {
  flex: 4;
  background: #353535;
  border: 2px solid gold;
  border-radius: 15px;
  padding: 20px;
  color: gold;
  box-shadow: 0 0 10px gold;
  overflow: auto;
  max-height: 425px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  margin-top: 20px;
  max-height: 350px;
}

.goal {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid gold;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}


ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

li {
  margin-bottom: 15px;
  background: rgba(255, 215, 0, 0.05);
  padding: 10px;
  border-radius: 8px;
}

h2 {
  color: gold;
  text-shadow: 0 0 10px gold;
}

h3, p, strong {
  color: #ffd700;
}

.goal.completed {
  background: rgba(255, 215, 0, 0.3);
  color: #222;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px gold;
  }
  50% {
    box-shadow: 0 0 20px #fff700;
  }
  100% {
    box-shadow: 0 0 10px gold;
  }
}

</style>
