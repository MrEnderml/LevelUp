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

      <Space v-if="currentEvent === 'Space'" />

      <Radiation v-if="currentEvent === 'Radiation'" />

      <Infinity v-if="currentEvent === 'Infinity'" />

      <DimensionAtlas v-if="currentEvent === 'D-Atlas'" />  

      <Settings v-if="currentEvent === 'Settings'" />

      <Info v-if="currentEvent === 'Info'" />
    </div>
  </div>
  <div v-if="hero.showAfkPopup" class="afk-popup">
    <div class="afk-content">
      <p style="white-space: pre-line" v-html="hero.afkMessage"></p>
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
import { perks as radPerks } from './data/radPerks.js'; 
import { spEnemy as space } from './data/spaceEnemy.js';
import { goals } from './data/infGoals.js';
import { auto } from "./composables/autoProgression.js";
import { dimensions } from "./data/dimensions.js";
import { killHistory } from './composables/afkHandle.js';

import EventPanel from './components/EventPanel.vue';
import BattleLogic from './components/BattleLogic.vue';
import Tree from './components/Events/Tree.vue';
import Equipment from './components/Events/Equipment.vue';
import Ascension from './components/Events/Ascension.vue';
import Buff from './components/Events/Buff.vue';
import Soul from './components/Events/Soul.vue';
import Amulet from './components/Events/Amulet.vue';
import Rebirth from './components/Events/Rebirth.vue';
import Space from './components/Events/Space.vue';
import Radiation from './components/Events/Radiation.vue';
import Infinity from './components/Events/Infinity.vue';
import DimensionAtlas from './components/Events/DimensionAtlas.vue';
import Settings from './components/Events/Settings.vue';
import Info from './components/Events/Info.vue';
import Tools from './components/Tools.vue';

const afkStartTime = ref(null);
const { hero } = useHero();    
const { buffs } = useBuff();
const { enemy } = useEnemy();


function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (
        !target[key] ||
        typeof target[key] !== 'object' ||
        Array.isArray(target[key])
      ) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const loadGame = () => {
    const save = localStorage.getItem('gameSave');
    if (!save) return;

    const data = JSON.parse(save);
    if (data.hero) deepMerge(hero.value, data.hero);

    if(hero.value.mainInfTier == 0)
      hero.value.mainInfTier = hero.value.infTier
      
    if (data.enemy) deepMerge(enemy.value, data.enemy);
    if (data.perks) {
      for (let idx in data.perks) {
        perks.value[idx].block = data.perks[idx].block;
        const perkData = data.perks[idx];
        const targetPerk = perks.value[idx];

        if (!perkData || !targetPerk) continue;
        targetPerk.level = perkData.level;

        if ('status' in perkData) {
          targetPerk.status = perkData.status;
        }

        if (targetPerk.infStatus != undefined) {
          targetPerk.infStatus = perkData.infStatus;
        }
      }
      
      if (data.perks[0]?.kills !== undefined) {
        perks.value[0].kills = data.perks[0].kills;
      }
      if (data.perks[1]?.buff !== undefined) {
        perks.value[1].buff = data.perks[1].buff;
      }
    }
    if (data.ascension) {
      for(let idx in data.ascension) {
        ascension[idx].level = data.ascension[idx].level;
        if(ascension[idx].status !== undefined)
          ascension[idx].status = data.ascension[idx].status;
        if (ascension[idx].infStatus !== undefined)
            ascension[idx].infStatus = data.ascension[idx].infStatus
      }
    }
    if (data.space) {
      for(let idx in data.space){
       if(idx%6 == 5)
          space[idx].status = data.space[idx].status;
        else 
          space[idx].status = true;
      }
    }
    if (data.buffs) {
      for(let idx in data.buffs){
        buffs.value[idx].exp = data.buffs[idx].exp;
        buffs.value[idx].tier = data.buffs[idx].tier;
        buffs.value[idx].maxTier = data.buffs[idx].maxTier;
        buffs.value[idx].active = data.buffs[idx].active;
      }
    }
   
    if (data.cursed) {
      for(let idx in data.cursed){
        if(cursed[idx].status !== 'undefined')
          cursed[idx].status = data.cursed[idx].status;
      }
    };
    if (data.radPerks) {
      for(let idx in data.radPerks){
        radPerks[idx].level = data.radPerks[idx].level;
        if( idx == 6){
          radPerks[idx].max = data.radPerks[idx].max;
          radPerks[idx].status = data.radPerks[idx].status;
          radPerks[idx].baseCost = data.radPerks[idx].baseCost;
        }
        if( idx == 7){
          radPerks[idx].max = data.radPerks[idx].max;
          radPerks[idx].perkStatus = data.radPerks[idx].perkStatus;
        }
        if( idx == 10){
          radPerks[idx].max = data.radPerks[idx].max;
          radPerks[idx].status = data.radPerks[idx].status;
        }
      }
    }
    if (data.infGoals) {
      for(let idx in data.infGoals){
        goals.value[idx].tier = Math.min(data.infGoals[idx].tier, data.infGoals[idx].maxTier);
      }
    }

    if(data.auto) deepMerge(auto.value, data.auto);

    if(data.dimensions) {
        for (let idx in data.dimensions){
          if(idx > 23) continue;

          dimensions.value[idx].infTier = data.dimensions[idx].infTier;
          if(idx == 1)
            dimensions.value[idx].ascension = data.dimensions[idx].ascension;
        }
        dUpdate();
      }
 
    if (data.hKill?.length) {
      killHistory.splice(0, killHistory.length, ...data.hKill);
    }


    const lastOnline = localStorage.getItem('lastOnline');
    if (lastOnline) {

      const diffMs = Date.now() - Number(lastOnline);
      hero.value.afkTimeHandle = (diffMs >= 0? 1: -1);
      if(hero.value.afkTimeHandle < 0) hero.value.secrets.time = true;
      const seconds = Math.floor(diffMs / 1000);

      let time = Math.abs(Math.min(seconds, 28800));
      let maxKill = hero.value.maxStage * 75;

      let div = hero.value.enemyAfkHp * (time ** 0.1) - hero.value.attack;
      hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (hero.value.enemyAfkHp * (time ** 0.1))) * time: time, maxKill);
      hero.value.afkTime = time;
      hero.value.afkLocked = true;
    }
    saveGame();
};

const dUpdate = () => {
  dimensions.value[9].infTier = (dimensions.value[9].infTier == 14? 6: dimensions.value[9].infTier);
  dimensions.value[23].infTier = (dimensions.value[23].infTier == 30? 10: dimensions.value[23].infTier);
  dimensions.value[10].infTier = (dimensions.value[10].infTier == 15? 10: dimensions.value[10].infTier);
  dimensions.value[12].infTier = (dimensions.value[12].infTier == 10? 0: dimensions.value[12].infTier);  
  dimensions.value[20].infTier = (dimensions.value[20].infTier == 15? 20: dimensions.value[20].infTier); 
  dimensions.value[22].infTier = (dimensions.value[22].infTier == 15? 25: dimensions.value[22].infTier); 
  dimensions.value[19].infTier = (dimensions.value[19].infTier == 15? 20: dimensions.value[19].infTier); 
  dimensions.value[21].infTier = (dimensions.value[21].infTier == 15? 30: dimensions.value[21].infTier);
  dimensions.value[13].infTier = (dimensions.value[13].infTier == 0? 15: dimensions.value[13].infTier);   
  dimensions.value[18].infTier = (dimensions.value[18].infTier == 15? 20: dimensions.value[18].infTier);  
  
}  

loadGame();

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastOnline', Date.now().toString());
});



const events = [
  {name: 'Combat'}, 
  {name: 'Tree'},
  {name: 'Buff'},
  {name: 'Equipment'},
  {name: 'Ascension'},
  {name: 'Soul'},
  {name: 'Amulet'},
  {name: 'Rebirth'},
  {name: 'Space'},
  {name: 'Radiation'},
  {name: 'Infinity'},
  {name: 'D-Atlas'},
  {name: 'Settings'},
  {name: 'Info'},
  
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
  const lastOnline = localStorage.getItem('lastOnline');
  hero.value.afkTimeHandle = (now - lastOnline >= 0? 1: -1);

  if (seconds > 5) {

    if(hero.value.afkTimeHandle < 0) hero.value.secrets.time = true;
    
    let time = Math.abs(Math.min(seconds, 28800));
    let maxKill = hero.value.maxStage * 75;

    let div = enemy.value.maxHp * (time ** 0.1) - hero.value.attack;
    hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (hero.value.enemyAfkHp * (time ** 0.1))) * time: time, maxKill);
    hero.value.afkTime = time;
    hero.value.afkLocked = true;

    hero.value.afkTimer = Math.min(hero.value.afkTimer + time, hero.value.afkMaxTimer);
  }

  //afkStartTime.value = null;
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
  margin-left: 100px;
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
