<template>
  <div class="infinity-panel">
    <div class="infinity-goals">
      <h2>Infinity Points(IP): {{Math.floor(hero.infPoints)}}</h2>
      <div class="goals-grid">
        <div :class="[
          goal.level === 2 ? 'goalCorrupted' : goal.level === 3 ? 'goalDivine' : 'goal',
          { completed: goal.tier === goal.maxTier }
        ]" v-for="goal in filterGoals" :key="goal.id">
        <Tooltip :text="() => infDescription(goal)">
          <span v-html="goal.icon"></span>
        </Tooltip>
        </div>
      </div>
    </div>

    <div class="infinity-bonuses">
      <h2>Infinity Bonuses</h2>
      <div v-for="(bonus, index) in filterBonuses" :key="bonus.id">
        <strong>{{ bonus.stat }}:</strong> {{ bonus.value }}<br>
        <strong v-if="index === filterBonuses.length - 1">Reach Infinity [T{{ bonusReq[hero.mainInfTier] }}]</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { goals } from '../../data/infGoals.js';

const { hero } = useHero();
const bonusReq = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 10,
  10: 13,
  13: 15,
  15: 16,
  16: 18,
  18: 20,
  20: 100
}

const filterGoals = computed(() => 
  goals.value
    .filter(g => g.status)
    .sort((a, b) => a.level - b.level)
);

const filterBonuses = computed(() => 
  bonuses.value.filter(bonus => bonus.status <= hero.value.mainInfTier)
);

function infDescription(goal) {
  let str = goal.requirement[goal.tier];

  str += `<br><span>Reward: ${goal.reward} IP</span>`;

  return str;
}

const inf = computed(() => hero.value.infPoints);
const sqrt = () => Math.sqrt(inf.value + 1);
const log = () => Math.log(inf.value + 2);

const scale = (base, mod = 1) => (base ** (inf.value / (sqrt() * mod)));
const addScale = (base, mod = 1) => (base ** (inf.value / (sqrt() + mod)));
const inverseScale = (base, mod = 1) => (1 / (base ** (inf.value / (sqrt() * mod))));
const additive = (base, mod = 1) => Math.floor(base ** (inf.value / (sqrt() * mod)));
const linearDiff = (base, mod = 1) => ((base ** (inf.value / (sqrt() * mod))) - 1);

function unlimitBonus(){
  return hero.value.dId == 'unlimitted'? 1.75 ** Math.max(Math.floor((hero.value.unlimitLevel - 1000) / 500), 0): 1
}

const bonuses = computed(() => [
  { id: 1, stat: 'Damage', value: `*${formatNumber(scale(1.055))}`, status: 0 },
  { id: 2, stat: 'HP', value: `*${formatNumber(scale(1.03))}`, status: 0 },
  { id: 3, stat: 'Defense', value: `*${formatNumber(scale(1.02))}`, status: 0 },
  { id: 4, stat: 'EXP Gain', value: `*${formatNumber(addScale(1.06, log()) * unlimitBonus())}`, status: 0 },
  { id: 5, stat: 'Equipment Chance', value: `*${formatNumber(scale(1.08))}`, status: 1 },
  { id: 6, stat: 'Abyss weakness', value: `*${formatNumber(Math.max(inverseScale(1.0225), 0.1))}`, status: 1 },
  { id: 7, stat: 'Overkill', value: `+${additive(1.35, log()).toFixed(0)}`, status: 2 },
  { id: 8, stat: 'Ascension Shards Gain', value: `*${formatNumber(scale(1.045))}`, status: 3 },
  { id: 9, stat: 'Rebirth Shards Gain', value: `*${formatNumber(scale(1.025))}`, status: 3 },
  { id: 10, stat: 'Buff Exp Gain', value: `*${formatNumber(scale(1.035))}`, status: 4 },
  { id: 11, stat: 'Corruption weakness', value: `+${formatNumber(linearDiff(1.01))}`, status: 5 },
  { id: 13, stat: 'Souls weakness', value: `*${formatNumber(Math.max(inverseScale(1.025), 0.1))}`, status: 6 },
  { id: 14, stat: 'Level scales better', value: `*${formatNumber(Math.max(inverseScale(1.025)), 0.1)}`, status: 7 },
  { id: 15, stat: 'Stage scales better', value: `*${formatNumber(Math.max(inverseScale(1.025)), 0.1)}`, status: 7 },
  { id: 16, stat: 'Enemy weakness', value: `*${formatNumber(Math.max(inverseScale(1.02), 0.1))}`, status: 8 },
  { id: 17, stat: 'Max Level Mult', value: `*${formatNumber(scale(1.07, log()))}`, status: 10 },
  { id: 18, stat: 'Min Level', value: `+${Math.floor(scale(1.045))}`, status: 13 },
  { id: 19, stat: 'New Infinity Buff: Charges', value: ``, status: 15 },
  { id: 20, stat: 'Max Danger', value: `+${Math.floor(scale(1.08))}`, status: 16 },
  { id: 21, stat: 'Stardust', value: `+${formatNumber(scale(1.0125))}`, status: 18 },
  { id: 22, stat: 'Potential', value: `+${Math.floor(scale(1.0425))}`, status: 20 },
]);

const  formatNumber = (num, f = true) => {
    if(f && num < 100) return num.toFixed(2);
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
  width: 300px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  margin-top: 20px;
  max-height: 350px;
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

.goal {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid gold;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goalCorrupted {
  background: rgba(255, 0, 234, 0.1);
  border: 2px solid rgb(255, 0, 234);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goalDivine {
  background: rgba(0, 255, 234, 0.1);
  border: 2px solid rgb(0, 255, 234);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goal.completed {
  background: rgba(255, 215, 0, 0.3);
  color: #222;
  animation: pulse 2s infinite;
}

.goalCorrupted.completed {
  background: rgba(247, 0, 255, 0.3);
  color: #222;
  animation: pulseCorrupted 2s infinite;
}

.goalDivine.completed {
  background: rgba(0, 255, 234, 0.3);
  color: #222;
  animation: pulseDivine 2s infinite;
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

@keyframes pulseCorrupted {
  0% {
    box-shadow: 0 0 10px rgba(255, 0, 234, 0.42);
  }
  50% {
    box-shadow: 0 0 20px rgb(255, 0, 234);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 0, 234, 0.36);
  }
}

@keyframes pulseDivine {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 242, 0.42);
  }
  50% {
    box-shadow: 0 0 20px rgb(0, 255, 242);
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 247, 255, 0.36);
  }
}

</style>
