<template>
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
      <Tooltip :text="() => getUnlockRequirement(tab)" boxShadow="0 0 10px gold">
        {{ tab }}
      </Tooltip>
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeMilestoneTab === 'Abyss'">
        <p class="milestone-text">
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Infinity'">
        <p class="milestone-text" v-html="infMilestones()">
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Singularity'">
        <p class="milestone-text" v-html="singMilestoneHandle()">
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Black Hole'">
        <p class="milestone-text" v-html="bhMilestoneHandle()">
        </p>
      </div>
      <div v-if="activeMilestoneTab === 'Perditions'">
        <p class="milestonePrediction">
          <span class="highlight">[D-Infinity]</span> spread the <span style='color: #ff6666'>Perdition</span>. 
          Next perdition at <span class="highlight">Infinity [T{{ getCurseTier() }}]</span>
        </p>
      </div>
    </div>

    <div class="milestone-box">
      <!-- Abyss -->
      <div v-if="activeMilestoneTab === 'Abyss'" class="milestone-grid">
        <div v-for="s in abyssMilestones.filter(s => s.tier <= hero.abyssTier)" :key="s.tier" class="milestone-card abyss-card">
          <h3>Abyss [T{{ s.tier }}]</h3>
          <p><span style="color:#ff6666">Challenge:</span> {{ s.description }}</p>
          <p><span style="color:#ff6666">Reward:</span> {{ s.reward }}</p>
        </div>
      </div>
      <!-- Infinity -->
      <div v-if="activeMilestoneTab === 'Infinity'" class="milestone-grid">
        <div v-for="m in infinityMilestones.filter(i => i.tier <= hero.mainInfTier && i.type)" :key="m.tier" class="milestone-card infinity-card">
          <h3>Infinity [T{{ m.tier }}]</h3>
          <p v-html="m.description"></p>
        </div>
      </div>

      <!-- Singularity -->
      <div v-if="activeMilestoneTab === 'Singularity'" class="milestone-grid">
        <div v-for="s in singularityMilestones.filter(s => s.tier < hero.singularity)" :key="s.tier" class="milestone-card singularity-card">
          <h3>Singularity [T{{ s.tier }}]</h3>
          <p><span style="color:#ff6666">Challenge:</span> {{ s.challenge }}</p>
          <p><span style="color:#ff6666">Reward:</span> {{ s.reward }}</p>
        </div>
      </div>

      <div v-if="activeMilestoneTab === 'Black Hole'" class="milestone-grid">
        <div v-for="s in bhMilestones.filter(s => s.tier < hero.bhTier)" :key="s.tier" class="milestone-card singularity-card">
          <h3>Black Hole [T{{ s.tier }}]</h3>
          <p><span style="color:#ff6666">Challenge:</span> {{ s.challenge }}</p>
          <p><span style="color:#ff6666">Reward:</span> {{ s.reward }}</p>
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
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../../composables/useHero.js';
import { dimensions } from '../../../data/dimensions.js';
import { getSvgIconHTML } from '../../../composables/svgIcon.js';
import {
  abyssMilestones,
  infinityMilestones,
  singularityMilestones,
  globalCurses,
  bhMilestones
} from "../../../data/infinityMilestones.js";
import { fn } from '../../../composables/utils/global.js';

const { hero } = useHero();


const milestoneTabs = ["Abyss", "Infinity", "Singularity", "Black Hole", "Perditions"];
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


function getCurseTier(forFilter = false) {
  const tier = Math.min(hero.value.mainInfTier, 100);

  if (tier >= 100) return 100;

  const nextTier = Math.floor((tier + 5) / 5) * 5;

  return Math.max(nextTier, 25);
}

function getPredactionTier() {
  const tier = hero.value.mainInfTier;

  if (tier >= 100) return 100;

  const nextTier = Math.floor(tier / 5) * 5;

  return Math.max(nextTier, 20);
}

function singMilestoneHandle() {
  if (hero.value.singularity >= 8) return "<span style='color: #ffd700; font-weight: bold;'>All milestones are unlocked</span>";

  return `Unlock the next milestone at <span style='color: #00ffea'>Singularity [T${hero.value.singularity + 1}]</span>`;
}

function bhMilestoneHandle() {
  if(hero.value.bhTier >= 4) return "<span style='color: #ffd700; font-weight: bold;'>All milestones are unlocked</span>";

  return `Beat The <span style='color: #00ffea'>Black Hole [T${hero.value.bhTier}]</span> to unlock the next milestone`;
}

function infMilestones() {
  if (hero.value.mainInfTier >= 14) return "<span style='color: #ffd700; font-weight: bold;'>All milestones are unlocked</span>";

  return `Unlock the next milestone at <span style='color: #ffd700; font-weight: bold;'>Infinity [T${hero.value.mainInfTier + 1}]</span>`;
}

</script>

<style scoped>


.tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(6px, 1vw, 12px);
  margin-bottom: clamp(10px, 2vw, 18px);
}

.milestone-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: clamp(300px, 80vw, 1100px);
  margin: 0 auto;
}



.milestone-btn {
  padding: clamp(6px, 1vw, 10px) clamp(10px, 2vw, 20px);
  border-radius: 10px;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  border: 1px solid #444;
  cursor: pointer;
  background: linear-gradient(180deg, #222, #111);
  color: #eee;
  font-weight: bold;
  transition: 0.15s;
  box-shadow: 0 0 4px rgba(255, 215, 0, 0.2);
}

.milestone-btn:hover:not(.locked) {
  background: linear-gradient(180deg, #333, #1a1a1a);
}

.milestone-btn.active {
  background: radial-gradient(circle, #ffd700, #b8860b);
  color: #000;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  border-color: gold;
}

/* Locked tabs */
.milestone-btn.locked {
  background: linear-gradient(180deg, #3a1a1a, #1a0c0c);
  color: #ff8080;
  border-color: #902020;
  cursor: not-allowed;
  opacity: 0.8;
}



.tab-content {
  background: rgba(10, 10, 15, 0.7);
  padding: clamp(10px, 2vw, 20px);
  border-radius: 12px;
  width: clamp(260px, 70vw, 900px);
  margin: 0 auto clamp(15px, 2vw, 25px);
  box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.15);
}



.milestone-box {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
  border-radius: 12px;
  padding: clamp(10px, 1.5vw, 20px);
  width: clamp(260px, 70vw, 900px);
  height: clamp(300px, 50vh, 470px);
  overflow-y: auto;
  margin: 0 auto;
  scrollbar-width: thin;
  scrollbar-color: gold transparent;
}



.milestone-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(clamp(180px, 30%, 260px), 1fr)
  );
  gap: clamp(10px, 1.4vw, 18px);
}



.milestone-card {
  padding: clamp(10px, 1.4vw, 16px);
  border-radius: 12px;
  font-size: clamp(0.85rem, 1vw, 1rem);
  background: rgba(20, 20, 30, 0.7);
  backdrop-filter: blur(4px);
  box-shadow: 0 0 10px #000;
  transition: 0.2s;
}

.milestone-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
}

.abyss-card {
  border: 1px solid #cc00ff;
  color: #cc00ff;
  text-shadow: 0 0 4px #cc00ff;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.infinity-card {
  border: 1px solid gold;
  color: gold;
  text-shadow: 0 0 4px gold;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.singularity-card {
  border: 1px solid #00ffea;
  color: #00ffea;
  text-shadow: 0 0 4px #00ffea;
  box-shadow: 0 0 10px rgba(0, 255, 234, 0.2);
}

.curse-card {
  border: 1px solid #ff6666;
  color: #ff6666;
  text-shadow: 0 0 4px #ff6666;
  box-shadow: 0 0 10px rgba(255, 102, 102, 0.2);
}


.milestone-text,
.milestonePrediction {
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  text-align: center;
}

.highlight {
  color: #ffd700;
  font-weight: bold;
}

</style>