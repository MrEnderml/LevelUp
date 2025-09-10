<template>
  <div class="tab-switcher">
    <button :class="{ active: activeTab === 'infinity' }" @click="activeTab = 'infinity'"><span style="font-size: 1.2em; color: gold;
      text-shadow: 0 0 4px gold;" class="infinity-icon">&#8734;</span> Infinity
    </button>
    
    <button
      :class="{ active: activeTab === 'divine' }"
      @click="activeTab = 'divine'"
      :disabled="hero.mainInfTier < 50"
    >
      <span
        v-html="getSvgIconHTML('quasarCore', '1.3em')"
        style="line-height: 0; vertical-align: middle; display: inline-block;"
      ></span> Quasar Core
    </button>

    <button
      :class="{ active: activeTab === 'milestone' }"
      @click="activeTab = 'milestone'"
    >
      Milestones
    </button>
  </div>

  <div v-if="activeTab === 'infinity'">

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

  </div>

  <div v-if="activeTab === 'divine'">

    <div class="divine-tree">
      <Tooltip :text="quasarCoreHandle()" boxShadow="0 0 10px #00ffea">
      <h2 class="d-desc">
      <span
        v-html="getSvgIconHTML('quasarCore', '1.3em')"
        style="line-height: 0; vertical-align: middle; display: inline-block;"
      ></span> 
        Quasar Core [{{ hero.selectedDivSkills.length }}/{{ maxSelected }}]
      </h2>
      </Tooltip>
      <div class="d-goals-grid">
        <div
          v-for="skill in divineSkills"
          :key="skill.id"
          :class="[
            'd-goal',
            { selected: hero.selectedDivSkills.includes(skill.id) }
          ]"
          @click="toggleSkill(skill.id)"
        >
          <Tooltip :text="quasarCoreItemsHandle(skill)" boxShadow="0 0 10px #00ffea">
            <span v-html="skill.icon"></span>
          </Tooltip>
        </div>
      </div>
    </div>

  </div>

  <div v-if="activeTab === 'milestone'" class="milestone-panel">
    <div class="tabs">
      <button
        v-for="tab in milestoneTabs"
        :key="tab"
        @click="setMilestoneTab(tab)"
        :disabled="!isTabUnlocked(tab)"
        :class="[
          'milestone-btn',
          { active: activeMilestoneTab === tab, locked: !isTabUnlocked(tab) }
        ]"
      > 
      <Tooltip :text="getUnlockRequirement(tab)" boxShadow="0 0 10px gold">
        {{ tab }}
      </Tooltip>
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeMilestoneTab === 'Infinity'">
        <p class="milestone-text">
          {{ infMilestones() }}
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Singularity'">
        <p class="milestone-text">
          {{ singMilestoneHandle() }}
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Black Hole'">
        <p class="milestone-text">
          {{ bhMilestoneHandle() }}
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Perditions'">
        <p class="milestonePrediction">
          <span class="highlight">[D-Infinity]</span> spread the perdition. 
          Next perdition at Infinity [T{{ getCurseTier() }}]
        </p>
      </div>
    </div>

    <div class="milestone-box">
      <!-- Infinity -->
      <div v-if="activeMilestoneTab === 'Infinity'" class="milestone-grid">
        <div v-for="m in infinityMilestones.filter(i => i.tier <= hero.mainInfTier)" :key="m.tier" class="milestone-card infinity-card">
          <h3>Infinity [T{{ m.tier }}]</h3>
          <p>{{ m.description }}</p>
        </div>
      </div>

      <!-- Singularity -->
      <div v-if="activeMilestoneTab === 'Singularity'" class="milestone-grid">
        <div v-for="s in singularityMilestones.filter(s => s.tier <= hero.singularity)" :key="s.tier" class="milestone-card singularity-card">
          <h3>Singularity [T{{ s.tier }}]</h3>
          <p><span style="color:#ff6666">Challenge:</span> {{ s.challenge }}</p>
          <p><span style="color:#00ffea">Reward:</span> {{ s.reward }}</p>
        </div>
      </div>

      <div v-if="activeMilestoneTab === 'Black Hole'" class="milestone-grid">
        <div v-for="s in bhMilestones.filter(s => s.tier < hero.bhTier)" :key="s.tier" class="milestone-card singularity-card">
          <h3>Black Hole [T{{ s.tier }}]</h3>
          <p><span style="color:#ff6666">Challenge:</span> {{ s.challenge }}</p>
          <p><span style="color:#00ffea">Reward:</span> {{ s.reward }}</p>
        </div>
      </div>

      <!-- Curses -->
      <div v-if="activeMilestoneTab === 'Perditions'" class="milestone-grid">
        <div v-for="c in globalCurses.filter(c => c.tier <= getPredactionTier())" 
            :key="c.tier" 
            class="milestone-card curse-card">
          <h3>Perdition [T{{ c.tier }}]</h3>
          <p>{{ c.description }}</p>
        </div>
      </div>
    </div>
    
  </div>
  
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { goals } from '../../data/infGoals.js';
import { dimensions } from '../../data/dimensions.js';
import { divineSkills } from '../../data/quasarCore.js';
import { getSvgIconHTML } from '../../composables/svgIcon.js';
import { perks as radPerks } from '../../data/radPerks.js';
import {
  infinityMilestones,
  singularityMilestones,
  globalCurses,
  bhMilestones
} from "../../data/infinityMilestones.js";

const { hero } = useHero();

const activeTab = ref('infinity');

const milestoneTabs = ["Infinity", "Singularity", "Black Hole", "Perditions"];
const activeMilestoneTab = ref("Infinity");

const isTabUnlocked = (tab) => {
  if (tab === "Singularity") return hero.value.mainInfTier >= 7;
  if (tab === "Perditions") return hero.value.mainInfTier >= 20;
  if (tab === "Black Hole") return hero.value.bhTier >= 1;

  return true;
};

const getUnlockRequirement = (tab) => {
  if (tab === "Singularity" && hero.value.mainInfTier < 7) return "Unlocks at Infinity [T7]";
  if (tab === "Perditions" && hero.value.mainInfTier < 20) return "Unlocks at Infinity [T20]";
  if (tab === "Black Hole" && hero.value.bhTier < 1) return "Beat your first Black Hole";

  return "";
};

function setMilestoneTab(tab) {
  if (isTabUnlocked(tab)) activeMilestoneTab.value = tab;
}


function  getBonusReq(tier) {
    if (tier <= 7) return tier + 1;
    if (tier === 8 || tier === 9) return 10;
    if (tier >= 10 && tier <= 12) return 13;
    if (tier === 13 || tier === 14) return 15;
    if (tier === 15) return 16;
    if (tier === 16 || tier === 17) return 18;
    if (tier === 18 || tier === 19) return 20;
    if (tier === 20 || tier === 21) return 22;
    if (tier === 22 || tier === 23 || tier === 24) return 25;
    if (tier < 30) return 30;
    if (tier < 35) return 35;
    if (tier < 40) return 40;
    if (tier < 50) return 50;
    if (tier < 100) return 100;
    return 1;
}

function getCurseTier(forFilter = false) {
  const tier = hero.value.mainInfTier;

  if (tier >= 100) return 100;

  const nextTier = Math.floor((tier + 5) / 5) * 5;

  return Math.max(nextTier, 25);
}

function getPredactionTier() {
  const tier = hero.value.mainInfTier;

  if (tier >= 100) return 100;

  const nextTier = Math.floor(tier / 5) * 5;

  return Math.max(nextTier, 25);
}

function singMilestoneHandle() {
  if (hero.value.singularity >= 8) return "All milestones are unlocked";

  return `Unlock the next milestone at Singularity [T${hero.value.singularity + 1}]`;
}

function bhMilestoneHandle() {
  if(hero.value.bhTier >= 4) return "All milestones are unlocked";

  return `Beat The Black Hole [T${hero.value.bhTier}] to unlock the next milestone`;
}

function infMilestones() {
  if (hero.value.mainInfTier >= 14) return "All milestones are unlocked";

  return `Unlock the next milestone at Infinity [T${hero.value.mainInfTier + 1}]`;
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


const maxSelected = computed(() => 1 + Math.max(Math.floor((hero.value.mainInfTier - 50)/5), 0) );

function toggleSkill(skillId) {
  if(!hero.value.infProgress) return;

  if (hero.value.selectedDivSkills.includes(skillId)) {
    hero.value.selectedDivSkills = hero.value.selectedDivSkills.filter(id => id !== skillId);

    if(skillId == 14) { 
      radPerks[10].level = 0;
      
    }
  } else if (hero.value.selectedDivSkills.length < maxSelected.value) {
    if(skillId == 11) hero.value.souls = 0;
    if(skillId == 14) hero.value.souls = Math.min(hero.value.souls, 40);
    
    
    hero.value.selectedDivSkills.push(skillId);
  }
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
const overkill = () => Math.floor(inf.value / (450 - (sBonus() > 0? 50: 0)));
const mutagen = () => 1 + 0.01 * (inf.value / 250);

function unlimitBonus(){
  let total = (hero.value.rebirthPts >= 3.5e5 && hero.value.eLevel > 700? Math.sqrt(Math.log(hero.value.rebirthPts + 3))/2: 1) * 
  (hero.value.dId == 'unlimitted'? Math.max(5 * Math.floor((hero.value.unlimitLevel - 1000) / 500), 0) ** 1.25: 1);
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
  { id: 11, stat: 'Corruption weakness', value: `+${formatNumber(linearDiff(1.008))}`, status: 5 },
  { id: 13, stat: 'Souls weakness', value: `*${formatNumber(Math.max(inverseScale(1.025), 0.1))}`, status: 6 },
  { id: 14, stat: 'Level scales better', value: `*${formatNumber(Math.max(inverseScale(1.03), 0.1))}`, status: 7 },
  { id: 15, stat: 'Stage scales better', value: `*${formatNumber(Math.max(inverseScale(1.03), 0.01))}`, status: 7 },
  { id: 16, stat: 'Enemy weakness', value: `*${formatNumber(Math.max(inverseScale(1.02), 0.1))}`, status: 8 },
  { id: 17, stat: 'Max Level Mult', value: `+${formatNumber(scale(1.07, log()))}`, status: 10 },
  { id: 18, stat: 'Min Level', value: `+${minLevel()}`, status: 13 },
  { id: 19, stat: 'New Infinity Buff: Charges', value: ``, status: 15 },
  { id: 20, stat: 'Max Danger', value: `+${danger()}`, status: 16 },
  { id: 21, stat: 'Stardust', value: `*${formatNumber(scale(1.0145))}`, status: 18 },
  { id: 22, stat: 'Potential', value: `+${pot()}`, status: 20 },
  { id: 23, stat: 'Singularity weakness', value: `*${formatNumber(inverseScale(1.01, log()))}`, status: 22 },
  { id: 24, stat: 'IP Bonuses scale better', value: ``, status: 25 },
  { id: 25, stat: '+1 Buff Layout', value: ``, status: 30 },
  { id: 26, stat: 'You start with 10k mutagens', value: ``, status: 35 },
  { id: 27, stat: 'Mutagen', value: `*${formatNumber(mutagen())}`, status: 40 },
  { id: 28, stat: 'Unlock Quasar Core', value: ``, status: 50 },
]);

function quasarCoreHandle() {
  let count = Math.max(Math.floor((hero.value.mainInfTier - 45) / 5), 0);
  let next = 50 + 5 * count;
  return `Absorb the <span style='color: #00ffea'>Quasar Power</span> into yourself. Each <span style='color: gold'>Infinity Tier</span> increases the effects of the <span style='color: #00ffea'>Quasar Power</span>.
  Gain the next <span style='color: #00ffea'>Quasar Core</span> at <span style='color: gold'>Infinity [T${next}]</span>.
  
  <span style='color: red'>You can change Quasar Core when you are idle in Infinity</span>`;
}

function quasarCoreItemsHandle(skill) {
  let str = `<span style='color: #00ffea'>${skill.name}</span><br>
  ${formatPerkDescription(skill)}`;
  return str;
}

function formatPerkDescription(perk, digits = 2) {
  if (!perk || typeof perk.desc !== 'string') return '';
  const values = Array.isArray(perk.values) ? perk.values.slice() : [];
  let vi = 0;

  const fmt = (v) => {
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n.toFixed(digits) : String(v);
  };

  return perk.desc.replace(/\[([^\]]*)\]/g, (_m, content) => {
    if (/%v/i.test(content)) {
      const replaced = content.replace(/%v/gi, () => fmt(values[vi++]));
      return `<span style="color:gold">[${replaced}]</span>`;
    }

    if (content.trim() === '') {
      const v = values[vi++];
      return `<span style="color:gold">[${fmt(v)}]</span>`;
    }

    const formatted = content.replace(/-?\d+(\.\d+)?/g, (num) => fmt(num));
    return `<span style="color:gold">[${formatted}]</span>`;
  });
}


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

.tab-switcher {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-left: 120px;
}
.tab-switcher button {
  padding: 6px 12px;
  border: none;
  background-color: #222;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}
.tab-switcher button.active {
  background-color: #37dbd9;
}
.tab-switcher button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.d-goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 12px;
}

.d-goal {
  width: 64px;
  height: 64px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 6px;
  border: 2px solid #555;
  cursor: pointer;
  transition: 0.2s;
}

.d-goal:hover {
  border-color: #90caf9;
}

.d-goal.selected {
  border-color:rgb(97, 178, 244);
  background-color: rgba(97, 178, 244, 0.2);
}

.d-desc {
  color: #00ffea;
  text-shadow: 0 0 10px #00ffea;
}

.divine-tree {
  border: 2px solid #00ffea;
  border-radius: 10px;
  padding: 10px;
}


.milestone-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100vh;
  max-height: 80vh;
}


.milestone-box {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1rem;
  height: 420px; 
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}


.milestone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}


.milestone-card {
  padding: 0.8rem;
  border-radius: 10px;
  box-shadow: 0 0 10px #111;
  font-size: 0.9rem;
}

/* Infinity */
.infinity-card {
  border: 1px solid gold;
  color: gold;
  text-shadow: 0 0 4px gold;
}

/* Singularity */
.singularity-card {
  border: 1px solid #00ffea;
  color: #00ffea;
  text-shadow: 0 0 4px #00ffea;
}

/* Curses */
.curse-card {
  border: 1px solid #ff6666;
  color: #ff6666;
  text-shadow: 0 0 4px #ff6666;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.milestone-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #2a2a2a;
  color: #eee;
  font-weight: bold;
  transition: 0.2s;
}

.milestone-btn:hover:not(.locked) {
  background: #444;
}

.milestone-btn.active {
  background: #ffd700;
  color: #000;
  box-shadow: 0 0 6px #ffd700;
}

.milestone-btn.locked {
  background: #3a1a1a;
  color: #ff8080;
  cursor: not-allowed;
}

.locked-text {
  font-size: 0.8em;
  color: #ff6666;
  margin-left: 4px;
}

.tab-content {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
}

.milestone-text {
  color: gold;
  font-size: 1rem;
  line-height: 1.4;
}

.milestonePrediction {
  color: #ff8080;
  font-size: 1rem;
  line-height: 1.4;
}

.highlight {
  color: #ffd700; /* золотой */
  font-weight: bold;
}
</style>
