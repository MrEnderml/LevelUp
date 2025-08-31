<template>
  <div class="battle-container">
    <HeroPanel  :attackBarProgress="heroAttackBarProgress" />
    <EnemyPanel :attackBarProgress="enemyAttackBarProgress" />
  </div>
  
</template>

<script setup>
import HeroPanel from './HeroPanel.vue';
import EnemyPanel from './EnemyPanel.vue';

defineProps({
  heroAttackBarProgress: Number,
  enemyAttackBarProgress: Number
});
</script>

<style scoped>
.battle-container {
  margin-top: 240px;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-right: 60px;
}
</style>
