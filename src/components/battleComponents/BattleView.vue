<template>
  <div class="battle-container">
    <HeroPanel :player="hero.battleContent[hero.battleId].player" 
    :villian="hero.battleContent[hero.battleId].villian"  />
    <EnemyPanel :player="hero.battleContent[hero.battleId].player" 
    :villian="hero.battleContent[hero.battleId].villian"  />
  </div>
  
</template>

<script setup>
import HeroPanel from '../battleComponents/HeroPanel.vue';
import EnemyPanel from '../battleComponents/EnemyPanel.vue';
import { usePlayer } from '../../composables/utils/playerSetup';
import { useBaseEnemy } from '../../composables/utils/enemySetup';
import { useHero } from '../../composables/useHero';

const { player } = usePlayer();
const { villian } = useBaseEnemy();
const { hero } = useHero();

</script>

<style scoped>

</style>
