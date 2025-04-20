<template>
  <div class="app-container">
    <EventPanel v-model="currentEvent" :events="events" :hero="hero" />
    <div class="main-panel">
      <BattleLogic v-if="currentEvent === 'Combat'" :heroAttackBarProgress="heroAttackBarProgress" :enemyAttackBarProgress="enemyAttackBarProgress" />

      <Tree v-if="currentEvent === 'Tree'" />

      <Buff v-if="currentEvent === 'Buff'" />

      <Equipment v-if="currentEvent === 'Equipment'" />

      <Ascension v-if="currentEvent === 'Ascension'" />

      <Soul v-if="currentEvent === 'Soul'" />

      <Amulet v-if="currentEvent === 'Amulet'" />

      <Rebirth v-if="currentEvent === 'Rebirth'" />

      <Settings v-if="currentEvent === 'Settings'" />

      <Info v-if="currentEvent === 'Info'" />
    </div>
  </div>
  <div v-if="hero.showAfkPopup" class="afk-popup">
    <div class="afk-content">
      <p style="white-space: pre-line;">{{ hero.afkMessage }}</p>
      <button @click="hero.showAfkPopup = false">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref,  onMounted, onBeforeUnmount } from 'vue';

import { useHero } from './composables/useHero.js';
import { useEnemy } from './composables/useEnemy.js';
import { useBattle } from './composables/useBattle.js';
import { useBuff } from './data/buffs.js';
import { useAutoSave, saveGame } from './composables/autoSave.js';
import { perks } from './data/perks.js';
import { perks as ascension } from './data/ascension.js';
import { amulets } from './data/amulets.js';
import { cursed } from './data/cursed.js';

import EventPanel from './components/EventPanel.vue';
import BattleLogic from './components/BattleLogic.vue';
import Tree from './components/Events/Tree.vue';
import Equipment from './components/Events/Equipment.vue';
import Ascension from './components/Events/Ascension.vue';
import Buff from './components/Events/Buff.vue';
import Soul from './components/Events/Soul.vue';
import Amulet from './components/Events/Amulet.vue';
import Rebirth from './components/Events/Rebirth.vue';
import Settings from './components/Events/Settings.vue';
import Info from './components/Events/Info.vue';

const afkStartTime = ref(null);
const { hero } = useHero();    
const { buffs } = useBuff();
const { enemy } = useEnemy();

const loadGame = () => {
    const save = localStorage.getItem('gameSave');
    if (!save) return;

    const data = JSON.parse(save);
    if (data.hero) hero.value = data.hero;
    if (data.perks) Object.assign(perks, data.perks);
    if (data.ascension) Object.assign(ascension, data.ascension);
    if (data.buffs) buffs.value = data.buffs;
    if (data.amulets) Object.assign(amulets, data.amulets);
    if (data.cursed) Object.assign(cursed, data.cursed);
  
    const lastOnline = localStorage.getItem('lastOnline');
    if (lastOnline) {
      if(hero.value.isAbyss){
        hero.value.afkKills = 0;
        saveGame();
        return;
      }

      const diffMs = Date.now() - Number(lastOnline);
      const seconds = Math.floor(diffMs / 1000);

      let time = Math.min(seconds, 26400);
      let maxKill = hero.value.maxStage * 50;

      let div = enemy.value.maxHp * (time ** 0.1) - hero.value.attack;
      hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (enemy.value.maxHp * (time ** 0.1))) * time: time, maxKill);
      hero.value.afkTime = time;
      hero.value.afkLocked = true;
      console.log("load", time);
    }
    saveGame();
};
  

loadGame();

window.addEventListener('beforeunload', () => {
      localStorage.setItem('lastOnline', Date.now().toString());
});



const events = [
  {name: 'Combat', minStage: 1}, 
  {name: 'Tree', minStage: 1},
  {name: 'Buff', minStage: 5},
  {name: 'Equipment', minStage: 2},
  {name: 'Ascension', minStage: 10},
  {name: 'Soul', minStage: 15},
  {name: 'Amulet', minStage: 20},
  {name: 'Rebirth', minLevel: 100},
  {name: 'Settings', minStage: 0},
  {name: 'Info', minStage: 0},
]
const currentEvent = ref('Combat');

useAutoSave();

const {
  heroAttackBarProgress,
  enemyAttackBarProgress,
} = useBattle(hero, enemy, buffs);



const handleReturn = () => {
  const now = Date.now();
  const afkTime = now - afkStartTime.value;
  const seconds = Math.floor(afkTime / 1000);

  if (seconds > 5) {
    if(hero.value.isAbyss){
      hero.value.afkKills = 0;
      afkStartTime.value = null;
      return;
    }
    let time = Math.min(seconds, 26400);
    let maxKill = hero.value.maxStage * 50;

    let div = enemy.value.maxHp * (time ** 0.1) - hero.value.attack;
    hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (enemy.value.maxHp * (time ** 0.1))) * time: time, maxKill);
    hero.value.afkTime = time;
    hero.value.afkLocked = true;
  }

  afkStartTime.value = null;
};


const handleVisibilityChange = () => {
  if (document.hidden) {
    afkStartTime.value = Date.now();
  } else if (afkStartTime.value) {
    handleReturn();
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

</script>

<style scoped>
.app-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-left: 180px;
}

.main-panel {
  flex: 1;
}

.afk-popup {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.afk-content {
  background: #222;
  color: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 0 10px #000;
}

.afk-content button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #4ade80;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

</style>
