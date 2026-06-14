<template>
  <div class="app-container">
    <EventPanel class="event-panel" v-model="currentEvent" :events="events" :hero="hero" />
    <div class="main-panel">
      <DebugPanell :engine="engine" /> 

      <NotificationPanel />

      <BattleLogic v-if="currentEvent === 'Combat'" />

      <Tree v-if="currentEvent === 'Tree'" />

      <Buff v-if="currentEvent === 'Skills'" />

      <Equipment v-if="currentEvent === 'Equipment'" />

      <Ascension v-if="currentEvent === 'Ascension'" />

      <Soul v-if="currentEvent === 'Soul'" />

      <Amulet v-if="currentEvent === 'Amulet'" />

      <Rebirth v-if="currentEvent === 'Rebirth'" />

      <Space v-if="currentEvent === 'Space'" />

      <Radiation v-if="currentEvent === 'Radiation'" />

      <Infinity v-if="currentEvent === 'Infinity'" />

      <DimensionAtlas v-if="currentEvent === 'D-Atlas'" /> 
      
      <Void v-if="currentEvent === 'Void'"/>

      <Settings v-if="currentEvent === 'Settings'" />

      <Info v-if="currentEvent === 'Info'" />
    </div>
  </div>

  <AFKPanel />
</template>

<script setup>
import { ref,  onMounted, onBeforeUnmount } from 'vue';

import { useHero } from './composables/useHero.js';
import { useEnemy } from './composables/useEnemy.js';
import { useBattle } from './composables/useBattle.js';
import { useBuff } from './data/buffs.js';

import EventPanel from './components/EventPanel.vue';
import BattleLogic from './components/battleComponents/BattleLogic.vue';
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
import Void from './components/Events/VoidPanel.vue/Void.vue';
import Settings from './components/Events/Settings.vue';
import Info from './components/Events/Info.vue';
import DebugPanel from './components/DebugPanel.vue';

import AFKPanel from './components/UI/AFKPanel.vue';
import { loading } from "./composables/utils/loading.js";
import NotificationPanel from './components/UI/NotificationPanel.vue';

const { 
  loadGame,
  useAutoSave,
  handleReturn,
  startAFK,
  endAFK
} = loading();

const { hero } = useHero();    
const { buffs } = useBuff();
const { enemy } = useEnemy();

loadGame();

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastOnline', Date.now().toString());
});



const events = [
  {name: 'Combat'}, 
  {name: 'Tree'},
  {name: 'Skills'},
  {name: 'Equipment'},
  {name: 'Ascension'},
  {name: 'Soul'},
  {name: 'Amulet'},
  {name: 'Rebirth'},
  {name: 'Space'},
  {name: 'Radiation'},
  {name: 'Infinity'},
  {name: 'D-Atlas'},
  {name: 'Void'},
  {name: 'Settings'},
  {name: 'Info'},
  
]
const currentEvent = ref('Combat');

useAutoSave();

const { engine } = useBattle(hero, enemy, buffs);

function handleVisibilityChange() {
  if (document.hidden) {
    startAFK();
  } else {
    endAFK();
  }
}
onMounted(() => {

document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );
});

onBeforeUnmount(() => {

document.removeEventListener(
    "visibilitychange",
    handleVisibilityChange
  );
});

</script>

<style scoped>
.app-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.event-panel {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid #333;
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
