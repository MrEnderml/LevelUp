<script setup>
import { useEnemy } from '../../../composables/useEnemy';
import { useHero } from '../../../composables/useHero';
import { useBaseEnemy } from '../../../composables/utils/enemySetup';
import { usePlayer } from '../../../composables/utils/playerSetup';

const { hero } = useHero();
const { enemy } = useEnemy();

const { villian } = useBaseEnemy("space");
const { player } = usePlayer("space");

function selectLayout(layout) {
    if(villian.value.space.isSpaceFight) return;

    if(player.value.buff.selectedLayoutIndex == layout.id)
        player.value.buff.selectedLayoutIndex = null;
    else player.value.buff.selectedLayoutIndex = layout.id;
}

</script>

<template>
  <div class="layout-panel">
    <div
      v-for="layout in hero.buffLayouts"
      :key="layout.id"
      class="layout-slot"
      :class="{
        active: layout.id === player.buff.selectedLayoutIndex,
        locked: !layout.unlocked
      }"
      @click="selectLayout(layout)"
    >
      <div class="layout-name">
        {{ layout.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-panel {
  display: flex;
  gap: 6px;
  padding: 6px;
  background: rgba(20, 20, 30, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  margin: 0 auto;
}

/* слот */
.layout-slot {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: linear-gradient(145deg, #1f1f2e, #141420);
  border: 1px solid #2a2a40;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.2s;
  position: relative;
}

/* hover */
.layout-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 8px rgba(100, 150, 255, 0.4);
}

/* активный */
.layout-slot.active {
  border: 1px solid #60a5fa;
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.7);
}

/* заблокирован */
.layout-slot.locked {
  opacity: 0.3;
  cursor: not-allowed;
}

/* номер */
.layout-id {
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
}

/* название */
.layout-name {
  font-size: 12px;
  color: #ffffff;
}

/* количество баффов */
.buff-count {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 10px;
  color: #facc15;
}
</style>