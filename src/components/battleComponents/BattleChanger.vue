<template>
    <div v-if="hero.spaceUnlocked" class="battle-switcher">
      <div
        v-for="mode in modes"
        :key="mode.id"
        class="mode-btn"
        :style="{
          background: villian.space.isSpaceFight && mode.id == 'space' ? '#ffa5008a': ''}"
        :class="{ active: hero.battleId === mode.id }"
        @click="select(mode.id)"
      >
        <span class="icon">{{ mode.icon }}</span>
      </div>
    </div>
</template>
  

<script setup>
import { useHero } from '../../composables/useHero';
import { useBaseEnemy } from '../../composables/utils/enemySetup';

const { hero } = useHero();
const { villian } = useBaseEnemy("space");

const modes = [
  { id: 'space', icon: '✨', label: 'Space' },
  { id: 'main', icon: '🌍', label: 'World' }
];

function select (id) {
  if (!villian.value.space.isSpaceFight) return;
  hero.value.battleId = id;
}

</script>



<style scoped>
.battle-switcher {
  display: flex;
  gap: 6px;
  padding: 6px;
  border-radius: 12px;
  background: linear-gradient(145deg, #1a1a2e, #11111a);
  border: 1px solid #2a2a40;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  width: fit-content;
}

.mode-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #1f1f2e;
  border: 1px solid transparent;

  cursor: pointer;
  transition: 0.2s;
}

.mode-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 8px rgba(100, 150, 255, 0.4);
}

.mode-btn.active {
  border: 1px solid #60a5fa;
  background: radial-gradient(circle, #1e3a8a, #0f172a);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.7);
}

.icon {
  font-size: 20px;
}
</style>