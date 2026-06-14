<template>
  <div class="progress-bar-container">
    <div
      class="progress-bar-fill"
      :class="{ singularity: hero.isSingularity || hero.gravity.isTrial }"
      :style="{ width: `${(hero.kills / hero.killsPerZone) * 100}%` }"
    ></div>

    <div class="progress-bar-text" v-if="hero.isSingularity">
      {{ fn(hero.kills) }} / {{ fn(hero.killsPerZone) }} kills
    </div>

    <div class="progress-bar-text-shards" v-else-if="hero.gravity.isTrial">
      {{ fn(hero.kills) }} / {{ fn(hero.killsPerZone) }} kills <b>[+1 Shard]</b>
    </div>

    <div class="progress-bar-text" v-else>
      {{ fn(hero.kills) }} / {{ fn(hero.killsPerZone) }} kills (Stage {{ hero.stages.current }}) 
      <span v-if="bossReqPanel()" style="color: red">
        [{{ fn(enemy.boss.overchance) }}%]
      </span>
    </div>

    
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch} from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';

import SvgIcon from '../svgIcon.vue';
import { getSvgIconHTML } from "../../composables/svgIcon.js"
import { fn } from '../../composables/utils/global.js';

import { useProgressions } from '../../composables/battleUtils/useProgression.js';

const { hero } = useHero();
const { enemy } = useEnemy();

const {
  bossReqPanel
} = useProgressions();  


</script>

<style scoped>
.progress-bar-container {
  position: relative;
  background-color: #333;
  height: 26px;
  border-radius: 8px;
  overflow: hidden;

  display: flex;
  align-items: flex-end;
}

.progress-bar-fill {
  height: 10%;
  background: linear-gradient(90deg, #4caf50, #81c784);
}

.progress-bar-fill.singularity {
  height: 10%;
  background: linear-gradient(90deg, #00e5ff, #00bcd4);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.7);
}

.progress-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 0 0 2px #000;
  white-space: nowrap;
  pointer-events: none;
}

.progress-bar-text-shards {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4ef5df;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 0 0 2px #000;
  white-space: nowrap;
  pointer-events: none;
}

</style>