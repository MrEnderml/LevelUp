<template>
  <div class="amulet-panel red-theme">
    <h2 @click="hero.eLink = { set: 'Info', info: 'Amulet' }">🔮 <sup style="font-size: 12px">ℹ️</sup>Amulets</h2>
    
    <div class="amulet-content">
      <div class="amulet-list">
        <div class="amulet-grid">
          <div
            v-for="(amulet, index) in amulets"
            :key="index"
            class="amulet-card"
          >
            <h3 class="amulet-name">{{ amulet.name }} [T{{amulet.tier}}]</h3>
            <ul class="amulet-stats" v-if="amulet.status === true">
              <li>Max Level: <strong>+{{ amulet.maxLevel }}</strong></li>
              <li>Max Curses: <strong>+{{ amulet.cursedSlot }}</strong></li>
              <li>Buff Slot: 
                <span v-if="hero.maxStage >= 20 + 10 * (amulet.tier-1)"><strong>+{{ amulet.buffSlot }}</strong></span>
                <span v-else class="closed">Reach {{20 + 10 * (amulet.tier-1)}} stage</span>
              </li>
              <li>Suffix: 
                <span v-if="amulet.suffix.status === false" class="closed">{{suff[index]}}</span>
                <span v-else>{{ amulet.suffix.text }}</span>
              </li>
              <li>Prefix:
                <span v-if="amulet.prefix.status === false" class="closed">{{pref[index]}}</span>
                <span v-else>{{ prefixHandle(amulet.tier) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="curse-panel">
        <p class="curse-wrapper">
          Max Curses: [{{hero.curse}}] | Min Curses [{{hero.minCurse}}]
          <Tooltip :text="cursePowerHandle" boxShadow="0 0 10px #fda4af" position="bottom" maxWidth="120px">
            <span v-if="hero.mainInfTier >= 30"><sup style="font-size: 6px">ℹ️</sup>Curse Power: [{{formatNumber(hero.curseMult, true)}}]</span>
          </Tooltip>
        </p>
        <Tooltip :text="() => formatCurses()" position="right">
          <h3 @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Curse' }">☠️ <sup style="font-size: 12px">ℹ️</sup>*Curses</h3>
        </Tooltip>
        <ul>
          <li v-for="(curse, idx) in filterCurses" :key="idx">
            <span style='display: flex'>
              <strong v-html="curse.icon"></strong>
              <strong>{{ curse.name }}</strong>
            </span>
            <ul>
               <template v-for="(tier, tIndex) in curse.tier" :key="tIndex">
                  <li 
                    v-if="tIndex < 3 || tier.status" 
                    :class="[
                      { 'tier-four': tIndex === 3, 'tier-five': tIndex === 4 },
                      { 'tier-green': tIndex === 0, 'tier-yellow': tIndex === 1, 'tier-red': tIndex === 2 }
                    ]"
                  > 
                    [T{{ tIndex + 1 }}] {{ tEffect(tier, curse.id) }} 
                    (Bonus: {{ tBonusEffect(tier) }})
                  </li>
                </template>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { amulets } from '../../data/amulets.js';
import { cursed as curses } from '../../data/cursed.js';
import { useHero } from '../../composables/usehero.js';
import { divineSkills } from '../../data/quasarCore.js';

const {hero} = useHero();

const suff = ['Ascension [T2]', 'Soul [T3]', '10000 Rebirth Pts', 'Space 18SP']
const pref = ['Ascension [T3]', 'Soul [T4]', '40000 Rebirth Pts', 'Space 34SP']

const filterAmulets = computed(() => 
    amulets.filter(b => b.status === true)
)

const filterCurses = computed(() => 
    curses.filter(curse => curse.status === true)
)

const filterCursesTier = computed(() => 
    curses.filter
)

function tBonusEffect(tier) {
  let base = tier.bonus;

  let quasarShackles = (hero.value.selectedDivSkills.includes(0)? divineSkills.value[0].values[1]: 1);
  let fluctuationFailures = (hero.value.selectedDivSkills.includes(10)? divineSkills.value[10].values[1]: 1);

  base = base * (hero.rebirthTier >= 10 ? 1.5 : 1) * quasarShackles * fluctuationFailures;

  return base.toFixed(2);
}

const curseRules  = {
  0:  { mult: 1,       cap: 100 },      // Penetrate
  1:  { mult: 0.75,    cap: 50 },       // Heal
  2:  { mult: 0.5,     cap: 90 },       // Block
  3:  { mult: 0.5,     cap: 4 },        // Attack Per Second
  4:  { mult: 0.35,    cap: 90 },       // avoid attack
  5:  { mult: 0.25,    cap: 50 },       // to STUN for
  6:  { mult: 0.4,     cap: 1000 },     // to CRIT
  7:  { mult: 0.35,    cap: 20 },       // Each of your
  8:  { mult: 0.9,     cap: 90 },       // Enemy gets
  9:  { mult: 1,       cap: 1000 },     // Max HP
  10: { mult: 0.25,    cap: 90 },       // to bleed by
  11: { mult: 0.25,    cap: 90 },       // The Hero
  12: { mult: 0.4,     cap: 100 },      // Attack
  13: { mult: 0.5,     cap: 5 },        // id 13
  14: { mult: 1,       cap: Infinity }, // id 15
  15: { mult: 0.4,     cap: 20 },       // id 16
  16: { mult: 0.3,     cap: 50 },       // id 17
  17: { mult: 0.2,     cap: 50 },       // id 18
  18: { mult: 0.4,     cap: 20 },       // id 19
};

function tEffect(tier, curseId) {
  const baseMult = hero.value.curseMult;
  const rule = curseRules[curseId] || { mult: 1, cap: Infinity };

  return tier.effect.replace(/(\d+(\.\d+)?)/g, match => {
    let val = parseFloat(match) * Math.max(baseMult * rule.mult, 1);
    val = Math.min(val, rule.cap);
    return val.toFixed(2);
  });
}


function prefixHandle(t){
  return `Max Level MULT - ${1 + t * 0.02 * (hero.value.sp >= 99? 2: 1)}`
}

const CursesChance = computed(() => {
  const t3 = Math.min(35, 1.1 * Math.log(hero.value.stage - 17)**1.95 * (hero.value.sp >= 24 && hero.value.abyssDStages >= 20?Math.log(hero.value.abyssDStages) ** 0.35: 1));
  const t2 = Math.min(45, 10 * Math.log(hero.value.stage - 17)**0.95 * (hero.value.sp >= 24 && hero.value.abyssDStages >= 20?Math.log(hero.value.abyssDStages) ** 0.25: 1));
  const t1 = 100 - t2 - t3;

   return {
    t1: t1.toFixed(1),
    t2: t2.toFixed(1),
    t3: t3.toFixed(1)
  };
})

function formatCurses() {
  let tier = CursesChance.value;
  let t5 = hero.value.curset5Chance = (hero.value.rebirthPts >= 1.5e5? 1: 0) * 
  (hero.value.rebirthPts >= 3.5e5? Math.log(hero.value.rebirthPts + 3): 1) * Math.max(1.01 ** (hero.value.abyssDStages - 99), 1);
  
  let s = `<span>[T1(%)] - ${tier.t1}</span><br><span>[T2(%)] - ${tier.t2}</span><br><span>[T3(%)] - ${tier.t3}</span>`;
  if (t5 > 0) s += `<br><span>[T5(%)] - ${t5.toFixed(2)}</span>`

  if(hero.value.stage < 14)
    return `Reach Stage 15`;
  return s;
}

function cursePowerHandle() {
  return `Every curse has its threshold. Once you overcome this threshold, the curse becomes stronger depends on Curse Power. <spna style='color: red'>Curse power does not affect its bonus.</span>`
}

 const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);

    if(tier >= units)
      return "999d";
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }
</script>

<style scoped>
.amulet-panel.red-theme {
  background-color: #3b0a0a;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px #dc2626;
  color: #ffe4e6;
  width: 800px;
  font-family: 'Segoe UI', sans-serif;
  margin-left: 50px;
}

.amulet-content {
  display: flex;
  gap: 1rem;
}

.amulet-list {
  width: 65%;
}

.amulet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.amulet-card {
  background-color: #7f1d1d;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 5px #f87171;
  min-height: 225px;
}

.amulet-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fecaca;
}

.amulet-stats li {
  font-size: 0.95rem;
  margin: 0.25rem 0;
}

.closed {
  opacity: 0.5;
  font-style: italic;
  color: #fca5a5;
}

.curse-panel {
  background-color: #7f1d1d;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 5px #f87171;
  width: 30%;
  color: #ffe4e6;
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(226, 40, 40) transparent;
}

.curse-panel h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fda4af;
}

.curse-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.curse-panel li {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

.curse-panel li strong {
  color: #fecaca;
  font-size: 1rem;
  display: block;
  margin-bottom: 0.2rem;
}

.amulet-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  color: #fecaca;
  position: relative;
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
  box-shadow: 0 0 10px #ef4444;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
}

.tier-four {
  color: #c56eff;
  font-weight: bold;
  text-shadow: 0 0 6px #c56eff;
}

.tier-five {
  color: #66ffcc;
  font-weight: bold;
  text-shadow: 0 0 6px #66ffcc;
}

.tier-green {
  color: #4ade80;
  font-weight: bold;
  text-shadow: 0 0 6px #4ade80;
}

.tier-yellow {
  color: #facc15;
  font-weight: bold;
  text-shadow: 0 0 6px #facc15;
}

.tier-red {
  color: #f87171;
  font-weight: bold;
  text-shadow: 0 0 6px #f87171;
}

.curse-wrapper {
  font-weight: bold;
  font-size: 0.9em;
  color: #ff1b37;
}

</style>