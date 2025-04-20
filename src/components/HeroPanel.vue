<template>
  <div class="hero">
    <div class="hero-header">
      <h3 style="color: white">🧝 Hero</h3>
      <div class="formations">
          <button
            v-for="(formation, index) in filterFormation"
            :key="formation.name"
            :class="['formation-btn', { active: hero.activeFormation === formation.id }]"
            @click="toggleFormation(formation.id)"
            :title="formation.description"
          >
            {{ formation.icon }}
          </button>
        </div>
    </div>
    <span style="color: white">⚔️ {{ format(attack) }}  </span>
    <span style="color: white">  🛡️{{ format(def) }}</span>
    <div class="hp-bar">
        <div class="hp-progress" :style="{ width: `${(hp / maxHp) * 100}%` }">
            <span class="hp-text">{{ format(hp) }} / {{ format(maxHp) }}</span>
        </div>
    </div>
    <!-- Attack speed bar -->
    <div class="attack-bar">
      <div class="attack-progress" :style="{ width: `${attackBarProgress * 100}%` }"></div>
    </div>
    <div class="buff-header">
      <div :class="[buffs[3].combo > 0? 'comboActive': 'combo']">
        <span>⚡[{{buffs[3].combo.toFixed(0)}}]</span>
      </div>
      <div :class="[buffs[8].time > 1? 'conquerActive': 'conquer']">
        <span>🕐[{{buffs[8].time.toFixed(0)}}]</span>
      </div>
      <div :class="[hero.activeBuffs.includes(10)? 'extraLifeActive': 'extraLife']">
        <span>❤️[{{buffs[10].rise}}]</span>
      </div>
      <div :class="[hero.activeBuffs.includes(10) && buffs[10].buffT3 > 0? 'extraLifeImmuneActive': 'extraLifeImmune']">
        <span>🧘[{{buffs[10].buffT3.toFixed(0)}}]</span>
      </div>
      
      
    </div>
    
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useHero } from '../composables/useHero.js';
import { useBuff } from '../data/buffs.js';

const { hero } = useHero();
const { buffs } = useBuff();

const props = defineProps({
  attackBarProgress: Number,
  attacksPerSecond: Number
});

const hp = computed(() => hero.value.hp);
const maxHp = computed(() => hero.value.maxHp);
const attack = computed(() => hero.value.attack);
const def = computed(() => hero.value.def)

function format(value) {
  if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
}

const filterFormation = computed(() => 
  hero.value.formationTypes.filter(f => f.status === true)
)

function toggleFormation(index) {
  hero.value.activeFormation = hero.value.activeFormation === index ? null : index;
  console.log( hero.value.activeFormation);
  
}
</script>

<style scoped>
.hero {
  width: 250px;
  border: 2px solid #4caf50;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
}

.hp-bar {
  width: 100%;
  height: 24px;
  background-color: #eee;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.hp-progress {
  height: 100%;
  background-color: #4caf50; /* или #f44336 для врага */
  border-radius: 5px;
  transition: width 0.3s ease;
}

.hp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #fff;
  font-size: 0.9rem;
  pointer-events: none;
  text-shadow: 
    0 0 1px #000,
    0 0 2px #000,
    0 0 3px #000,
    1px 1px 0 #000,
   -1px -1px 0 #000;
}

.attack-bar {
  width: 100%;
  height: 10px;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.attack-progress {
  height: 100%;
  background-color: #ff9800;
  border-radius: 5px;
  transition: width 0.1s linear;
}


.comboActive, .conquerActive {
  display: content;
  color: #fbbf24
}

.combo, .conquer, .extraLife, .extraLifeImmune {
  display: none;
}
.extraLifeActive, .extraLifeImmuneActive {
  display: content;
  color:rgb(251, 61, 36)
}


\* formation *\
..formations {
  display: flex;
  gap: 0.5rem;
}

.formation-btn {
  font-size: 1.2rem;
  padding: 0.1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: 0.3s;
  box-shadow: none;
}

.formation-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.formation-btn.active {
  background: #66bb6a;
  color: white;
  border-color: #43a047;
  box-shadow: 0 0 10px #81c784;
}

.hero-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.buff-header{
  display: flex;
  gap: 3px;
}
</style>
