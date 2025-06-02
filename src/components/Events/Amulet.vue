<template>
  <div class="amulet-panel red-theme">
    <h2>🔮 Amulets</h2>
    
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
        <Tooltip :text="() => formatCurses()">
          <h3>☠️ *Curses</h3>
        </Tooltip>
        <ul>
          <li v-for="(curse, idx) in filterCurses" :key="idx">
            <strong>{{ curse.icon }} {{ curse.name }}</strong>
            <ul>
               <template v-for="(tier, tIndex) in curse.tier" :key="tIndex" >
                <li v-if="tIndex < 3 || tier.status" :class="{ 'tier-four': tIndex === 3 }"> 
                  [T{{ tIndex + 1 }}] {{ tier.effect }} 
                  (Bonus: {{ (tier.bonus * (hero.rebirthTier >= 10 ? 1.5 : 1)).toFixed(2) }})
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
  if(hero.value.stage < 14)
    return `Reach Stage 15`;
  return `<span>[T3(%)] - ${tier.t3}</span><br><span>[T2(%)] - ${tier.t2}</span><br><span>[T1(%)] - ${tier.t1}</span>`;
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

</style>