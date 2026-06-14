<template>
  <div class="tab-switcher">
    <button 
      :class="{ active: activeTab === 'infinity' }" 
      @click="activeTab = 'infinity'"
      ><span class="infinity-icon">&#8734;</span> Infinity
    </button>
    
    <button
      :class="{ active: activeTab === 'divine' }"
      @click="activeTab = 'divine'"
      :disabled="hero.mainInfTier < 50"
    >
      <span
        v-html="getSvgIconHTML('quasarCore', '1.3em')"
        class="svg-icon"
      ></span> Quasar Core
    </button>

    <button :class="{ active: activeTab === 'milestone' }" @click="activeTab = 'milestone'">
      Milestones
    </button>

    <button :class="{ active: activeTab === 'laws' }" @click="activeTab = 'laws'" :disabled="hero.bhTier < 4">
      Laws
    </button>

    <button :class="{ active: activeTab === 'sing' }" @click="activeTab = 'sing'" :disabled="hero.bhTier < 5">
      D-Singularity
    </button>
  </div>

  <div class="effects-cards">
          <Tooltip
            v-for="key in effectsActivated(activeTab)"
            :key="key"
            :text="() => effectsHandler(key)"
            position="right"
            maxWidth="400px"
          >
            <div
              class="effect-card"
              :class="['effect-' + key, { active: activeSelect(key) }]"
              @click="clickEffects(key)"
            >
              {{ key }}
            </div>
          </Tooltip>
  </div>

  <InfPanel v-if="activeTab === 'infinity'"/>

  <QuasarCore v-if="activeTab === 'divine'"/>

  <div v-if="activeTab === 'milestone'" class="milestone-panel">
    <Milestone />
  </div>

  <Laws v-if="activeTab === 'laws'" />

  <Singularity v-if="activeTab === 'sing'" />

  
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { dimensions } from '../../data/dimensions.js';
import { divineSkills } from '../../data/quasarCore.js';
import { getSvgIconHTML } from '../../composables/svgIcon.js';

import Laws from './InfinityPanel/Laws.vue';
import InfPanel from './InfinityPanel/InfPanel.vue';
import QuasarCore from './InfinityPanel/QuasarCore.vue';
import Milestone from './InfinityPanel/Milestone.vue';
import Singularity from './InfinityPanel/Singularity.vue';
import { laws } from '../../data/laws.js';

import { fn } from '../../composables/utils/global.js';

import { useInfinity } from '../../composables/battleUtils/useInfinity.js';

const {
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useInfinity();

const { hero } = useHero();

const activeTab = ref('infinity');

</script>

<style scoped>
.tab-switcher {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  padding: 6px;
  background: rgba(20, 20, 30, 0.7);
  border-radius: 10px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(80, 255, 255, 0.15);
}

.tab-switcher button {
  position: relative;
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(180deg, #1a1a1a, #141414);
  color: #ccc;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
}

/* --- Hover --- */
.tab-switcher button:hover:not(:disabled) {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 0 6px rgba(120, 255, 255, 0.25);
}

/* --- Активная вкладка --- */
.tab-switcher button.active {
  background: linear-gradient(180deg, #37dbd9, #1fc9c7);
  color: #000;
  box-shadow: 0 0 10px rgba(55, 219, 217, 0.6);
}

.tab-switcher button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(40%);
}

.infinity-icon {
  font-size: 1.2em;
  color: gold;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.8);
  margin-right: 6px;
  vertical-align: -1px;
}


.svg-icon {
  display: inline-block;
  line-height: 0;
  margin-right: 6px;
  vertical-align: -2px;
}


.effects-cards {
  display: flex;
  margin: 0 auto;
  padding: 1rem;
  gap: 10px;
}

/* MINI CARD */
.effect-card {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  font-size: 0.85rem;
  cursor: default;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: inset 0 0 6px rgba(255,255,255,0.08);
}

/* COLOR CODING */
.effect-R { color: #fdff6e; box-shadow: 0 0 6px #fdff6e; }
.effect-B { color: #fdff6e; box-shadow: 0 0 6px #fdff6e; }

.effect-Q, .effect-D { color: #6ee7ff; box-shadow: 0 0 6px #6ee7ff; }

.effect-r { color: #66ffcc; box-shadow: 0 0 6px #66ffcc; }
.effect-L { color: #f0c420; box-shadow: 0 0 6px #f0c420; }
.effect-A { color: #5ecca7; box-shadow: 0 0 6px #5ecca7; }
.effect-F { color: #3df8ba; box-shadow: 0 0 6px #3df8ba; }
.effect-S { color: #48dbd4; box-shadow: 0 0 6px #48dbd4; }

.effect-M { color: #6ee7ff; box-shadow: 0 0 6px #6ee7ff; }
.effect-P { color: #6ee7ff; box-shadow: 0 0 6px #6ee7ff; }


</style>
