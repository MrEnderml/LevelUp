<template>
  <div class="layout">

    <div class="left-side">

      <div class="header">
        <ZoneProgress />
        <BattleChanger />
      </div>
      
      <div class="battle-wrapper">
        <BattleView/>
      </div>

    </div>

    <div class="right-side">
      <DimTimer />
      <LogPanel />
    </div>



  </div>
</template>

<script setup>
import BattleView from './BattleView.vue';
import ZoneProgress from '../ZoneProgress.vue';
import LogPanel from '../battleComponents/LogPanel.vue';
import DimTimer from '../battleComponents/DimTimer.vue';
import BattleChanger from './BattleChanger.vue';
//import HeroStatsHandler from './HeroStatsHandler.vue';
import { useHero } from '../../composables/useHero';

</script>



<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  width: 100%;
  min-height: 100vh;
  gap: 0;
}

.header {
  display: flex;
  align-items: start;
  gap: 10px;
}

.left-side {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 95vh;
}

.right-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  gap: 20px;
  max-height: 95vh;
}

.zone-progress {
  margin-bottom: 20px;
}


.battle-wrapper {
  max-width: 55vw;
  margin-top: 5vh;
}

.battle-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}


@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .right-side {
    flex-direction: row;
    justify-content: center;
  }
  .battle-container {
    flex-direction: column;
    align-items: center;
  }
}

</style>
