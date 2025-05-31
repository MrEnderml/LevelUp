<template>
  <div class="hero-wrapper">
    <div class="hero">
      <div class="hero-header">
        <Tooltip :text="() => stats()">
          <h3 style="color: white">🧝 *Hero</h3>
        </Tooltip>
        <div class="formations">
          <button
            v-for="(formation, index) in filterFormation"
            :key="formation.name"
            :class="[
              'formation-btn',
              { active: hero.activeFormation === formation.id },
            ]"
            @click="toggleFormation(formation.id)"
            :title="formation.description"
          >
            {{ formation.icon }}
          </button>
        </div>
      </div>
      <span style="color: white">⚔️ {{ formatNumber(attack) }} </span>
      <span style="color: white"> 🛡️{{ formatNumber(def) }}</span>
      <div class="hp-bar">
        <div class="hp-progress" :style="{ width: `${(hp / maxHp) * 100}%` }">
          <span class="hp-text"
            >{{ formatNumber(hp) }} / {{ formatNumber(maxHp) }}</span
          >
        </div>
      </div>
      <!-- Attack speed bar -->
      <div class="attack-bar">
        <div
          class="attack-progress"
          :style="{ width: `${attackBarProgress * 100}%` }"
        ></div>
      </div>
      <div class="buff-header">
        <div>
          <span :class="[buffs[6].charges.power > 0? 'chargePower': 'charge']">
            [🔴{{buffs[6].charges.power}}]
          </span>
          <span :class="[buffs[6].charges.energy > 0? 'chargeEnergy': 'charge']">
            [🔵{{buffs[6].charges.energy}}]
          </span>
          <span :class="[buffs[6].charges.life > 0? 'chargeLife': 'charge']">
            [🟢{{buffs[6].charges.life}}]
          </span>
        </div>
        <div :class="[buffs[3].combo > 0 ? 'comboActive' : 'combo']">
          <span>⚡[{{ buffs[3].combo.toFixed(0) }}]</span>
        </div>
        <div
          :class="[hero.activeBuffs.includes(8) ? 'conquerActive' : 'conquer']"
        >
          <span>🕐[{{ buffs[8].time.toFixed(0) }}]</span>
        </div>
        <div
          :class="[
            hero.activeBuffs.includes(10) ? 'extraLifeActive' : 'extraLife',
          ]"
        >
          <span>❤️[{{ buffs[10].rise }}]</span>
        </div>
        <div
          :class="[
            hero.activeBuffs.includes(10) && buffs[10].buffT3 > 0
              ? 'extraLifeImmuneActive'
              : 'extraLifeImmune',
          ]"
        >
          <span>🧘[{{ buffs[10].buffT3.toFixed(0) }}]</span>
        </div>
      </div>
    </div>
    <div class="difficulty-box" v-if="hero.dId == 'survival'">
      <div class="controls">
        <button @click="decrease">➖</button>
        <span>Lv {{ hero.survivalLevel }}</span>
        <button @click="increase">➕</button>
      </div>
      <div class="effects">
        <p>
          🗡️ Hero DMG: <strong>-{{ damageReduction }}%</strong>
        </p>
        <p>
          ⏱️ Enemy APS: <strong>-{{ speedReduction }}%</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useHero } from "../composables/useHero.js";
import { useBuff } from "../data/buffs.js";

const { hero } = useHero();
const { buffs } = useBuff();

const props = defineProps({
  attackBarProgress: Number,
  attacksPerSecond: Number,
});

const hp = computed(() => hero.value.hp);
const maxHp = computed(() => hero.value.maxHp);
const attack = computed(() => hero.value.attack);
const def = computed(() => hero.value.def);

function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, "") + suffix;
}

const filterFormation = computed(() =>
  hero.value.formationTypes.filter((f) => f.status === true)
);

function toggleFormation(index) {
  hero.value.activeFormation =
    hero.value.activeFormation === index ? null : index;
  console.log(hero.value.activeFormation);
}

function stats() {
  let str = "";

  str += `💢<span>BASE CRIT: ${hero.value.crit.toFixed(1)}</span><br>`;
  str += `🔪<span>BASE CRIT DAMAGE: ${(hero.value.critAttack / 100).toFixed(1)}</span><br>`;
  str += `🤺<span>BASE DOODGE: ${hero.value.avoid}</span><br>`;
  str += `💀<span>Overkill: ${Math.floor(hero.value.overkill - 1)}</span><br>`;
  str += `🥾<span>APS: ${hero.value.attacksPerSecond.toFixed(1)}</span><br>`;

  return str;
}


const maxLevel = 25;
const minLevel = 0;

const increase = () => {
  if (hero.value.survivalLevel < maxLevel) hero.value.survivalLevel++;
};

const decrease = () => {
  if (hero.value.survivalLevel > minLevel) hero.value.survivalLevel--;
};

const damageReduction = computed(() => (hero.value.survivalLevel * 4).toFixed(1));
const speedReduction = computed(() => (hero.value.survivalLevel * 2).toFixed(1));
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
  text-shadow: 0 0 1px #000, 0 0 2px #000, 0 0 3px #000, 1px 1px 0 #000,
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

.comboActive,
.conquerActive {
  display: content;
  color: #fbbf24;
}

.chargePower {
  display: content;
  font-size: 14px;
  color:rgb(251, 57, 36);
}
.chargeEnergy {
  display: content;
  font-size: 14px;
  color:rgb(36, 208, 251);
}
.chargeLife {
  display: content;
  font-size: 14px;
  color:rgb(47, 251, 36);
}

.combo,
.conquer,
.extraLife,
.extraLifeImmune,
.charge {
  display: none;
}
.extraLifeActive,
.extraLifeImmuneActive {
  display: content;
  color: rgb(251, 61, 36);
}

.formations {
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

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.buff-header {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.difficulty-box {
  position: absolute;
  border: 2px solid #aaa;
  border-radius: 12px;
  padding: 12px;
  width: 250px;
  background: #222;
  color: #eee;
  font-family: "Orbitron", sans-serif;
  box-shadow: 0 0 8px #444;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.controls button {
  background-color: #444;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.effects p {
  margin: 4px 0;
}
</style>
