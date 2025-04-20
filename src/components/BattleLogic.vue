<template>
  <ZoneProgress />
  <BattleView
    :heroAttackBarProgress="heroAttackBarProgress"
    :enemyAttackBarProgress="enemyAttackBarProgress"
  />
  <LogPanel />
</template>

<script setup>
import BattleView from './BattleView.vue';
import ZoneProgress from './ZoneProgress.vue';
import LogPanel from './LogPanel.vue';


defineProps({
  heroAttackBarProgress: Number,
  enemyAttackBarProgress: Number
})

</script>
