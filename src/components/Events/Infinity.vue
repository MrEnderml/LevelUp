<template>
  <div class="infinity-panel">
    <div class="infinity-goals">
      <h2>
      <span @click="hero.eLink = { set: 'Info', info: 'Infinity' }"><sup style="font-size: 12px">ℹ️</sup>Infinity Points(IP):</span> 
      <span @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'IP' }"><sup style="font-size: 12px">ℹ️</sup>{{Math.floor(hero.infPoints)}}</span></h2>
      <div class="goals-grid">
        <div :class="[
          goal.level === 2 ? 'goalCorrupted' : goal.level === 3 ? 'goalDivine' : goal.level === 4 ? 'goalDarkness' : 'goal',
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
      <div v-for="(bonus, index) in filterBonuses" :key="bonus.id" class="bonus-line">
        <span class="bonus-stat">{{ bonus.stat }}</span>
        <span class="bonus-value">{{ bonus.value }}</span>
      </div>

      <div class="bonus-requirement" v-if="filterBonuses.length">
        Reach Infinity [T{{ getBonusReq(hero.mainInfTier) }}]
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { goals } from '../../data/infGoals.js';
import { dimensions } from '../../data/dimensions.js';

const { hero } = useHero();
function  getBonusReq(tier) {
    if (tier <= 7) return tier + 1;
    if (tier === 8 || tier === 9) return 10;
    if (tier >= 10 && tier <= 12) return 13;
    if (tier === 13 || tier === 14) return 15;
    if (tier === 15) return 16;
    if (tier === 16 || tier === 17) return 18;
    if (tier === 18 || tier === 19) return 20;
    if (tier === 20 || tier === 21) return 22;
    if (tier === 22 || tier === 23 || tier === 24) return 25
    if (tier >= 25) return 100;
    return 1;
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
  str += ` [<span>${goal.tier}/${goal.maxTier}</span>]`
  str += `<br><span style="color: gold">Reward: ${goal.reward} IP</span>`;

  return str;
}

const inf = computed(() => hero.value.infPoints);
const sqrt = () => Math.sqrt(inf.value + 1);
const log = () => Math.log(inf.value + 2);
const sBonus = () => (hero.value.mainInfTier >= 25? 0.0035: 0)
const dBonus = () => (dimensions.value[20].infTier == dimensions.value[20].maxInfTier? 0.005: 0)


const dmgScale = (base, mod = 1) => ((base + sBonus() + dBonus()) ** (inf.value / (sqrt() * mod)));
const scale = (base, mod = 1) => ((base + sBonus()) ** (inf.value / (sqrt() * mod)));
const addScale = (base, mod = 1) => ((base + sBonus()) ** (inf.value / (sqrt() + mod)));
const inverseScale = (base, mod = 1) => (1 / ((base + sBonus()) ** (inf.value / (sqrt() * mod))));
const additive = (base, mod = 1) => Math.floor((base + sBonus()) ** (inf.value / (sqrt() * mod)));
const linearDiff = (base, mod = 1) => (((base + sBonus()) ** (inf.value / (sqrt() * mod))) - 1);
const minLevel = () => Math.floor(inf.value / (200 - (sBonus() > 0? 20: 0)));
const pot = () => Math.floor(inf.value / (250 - (sBonus() > 0? 25: 0)));
const danger = () => Math.floor(inf.value / (15 - (sBonus() > 0? 1: 0)));
const overkill = () => Math.floor(inf.value / (500 - (sBonus() > 0? 50: 0)));

function unlimitBonus(){
  let total = (hero.value.rebirthPts >= 3.5e5 && hero.value.eLevel > 700? Math.sqrt(Math.log(hero.value.rebirthPts + 3))/2: 1) * 
  (hero.value.dId == 'unlimitted'? 2.25 ** Math.max(Math.floor((hero.value.unlimitLevel - 1000) / 500), 0): 1)
  return total;
}



const bonuses = computed(() => [
  { id: 1, stat: 'Damage', value: `*${formatNumber(dmgScale(1.055, 1, 2))}`, status: 0 },
  { id: 2, stat: 'HP', value: `*${formatNumber(scale(1.015))}`, status: 0 },
  { id: 3, stat: 'Defense', value: `*${formatNumber(scale(1.0125))}`, status: 0 },
  { id: 4, stat: 'EXP Gain', value: `*${formatNumber(addScale(1.06, log()) * unlimitBonus())}`, status: 0 },
  { id: 5, stat: 'Equipment Chance', value: `*${formatNumber(scale(1.08))}`, status: 1 },
  { id: 6, stat: 'Abyss weakness', value: `*${formatNumber(Math.max(inverseScale(1.0225), 0.1))}`, status: 1 },
  { id: 7, stat: 'Overkill', value: `+${overkill()}`, status: 2 },
  { id: 8, stat: 'Ascension Shards Gain', value: `*${formatNumber(scale(1.045))}`, status: 3 },
  { id: 9, stat: 'Rebirth Shards Gain', value: `*${formatNumber(scale(1.025))}`, status: 3 },
  { id: 10, stat: 'Buff Exp Gain', value: `*${formatNumber(scale(1.035))}`, status: 4 },
  { id: 11, stat: 'Corruption weakness', value: `+${formatNumber(linearDiff(1.01))}`, status: 5 },
  { id: 13, stat: 'Souls weakness', value: `*${formatNumber(Math.max(inverseScale(1.025), 0.1))}`, status: 6 },
  { id: 14, stat: 'Level scales better', value: `*${formatNumber(Math.max(inverseScale(1.03), 0.1))}`, status: 7 },
  { id: 15, stat: 'Stage scales better', value: `*${formatNumber(Math.max(inverseScale(1.03), 0.1))}`, status: 7 },
  { id: 16, stat: 'Enemy weakness', value: `*${formatNumber(Math.max(inverseScale(1.02), 0.1))}`, status: 8 },
  { id: 17, stat: 'Max Level Mult', value: `*${formatNumber(scale(1.07, log()))}`, status: 10 },
  { id: 18, stat: 'Min Level', value: `+${minLevel()}`, status: 13 },
  { id: 19, stat: 'New Infinity Buff: Charges', value: ``, status: 15 },
  { id: 20, stat: 'Max Danger', value: `+${danger()}`, status: 16 },
  { id: 21, stat: 'Stardust', value: `*${formatNumber(scale(1.0145))}`, status: 18 },
  { id: 22, stat: 'Potential', value: `+${pot()}`, status: 20 },
  { id: 23, stat: 'Singularity weakness', value: `*${formatNumber(inverseScale(1.01, log()))}`, status: 22 },
  { id: 24, stat: 'IP Bonuses scale better', value: ``, status: 25 },
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
  margin-left: 120px;
  width: 900px;
}

.infinity-goals {
  flex: 5;
  background: #353535;
  border: 2px solid gold;
  border-radius: 15px;
  padding: 20px;
  color: gold;
  box-shadow: 0 0 10px gold;
}

.infinity-bonuses {
  flex: 5;
  background: #353535;
  border: 2px solid gold;
  border-radius: 15px;
  padding: 20px;
  color: gold;
  box-shadow: 0 0 10px gold;
  overflow: auto;
  max-height: 425px;
  width: 300px;
  scrollbar-width: thin;
  scrollbar-color: rgb(255, 255, 0) transparent;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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

.goalDarkness {
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgb(255, 0, 0);
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

.goalDarkness.completed {
  background: rgba(255, 0, 0, 0.3);
  color: #222;
  animation: pulseDarkness 2s infinite;
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

@keyframes pulseDarkness {
  0% {
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.42);
  }
  50% {
    box-shadow: 0 0 20px rgb(255, 0, 0);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.36);
  }
}

.infinity-bonuses {
  padding: 0.5rem;
}

.bonus-line {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #555;
}

.bonus-stat {
  font-weight: bold;
}

.bonus-value {
  color: #aaffaa;
}

.bonus-requirement {
  margin-top: 8px;
  font-weight: bold;
  text-align: center;
  color: #ffaa00;
}

</style>
