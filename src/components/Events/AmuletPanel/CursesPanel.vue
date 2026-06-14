<template>
<div class="curses-scrollbar">
  <div class="curses-grid">
    <li v-for="(curse, idx) in filterCurses" :key="idx" class="curse-card">
      <span class="curse-card-title">
        <span class="curse-icon" v-html="curse.icon"></span>
        <span class="curse-name">{{ curse.name }}</span>
      </span>
      <ul>
        <template v-for="(tier, tIndex) in curse.tier" :key="tIndex">
          <li
            v-if="tIndex < 3 || tier.status"
            :class="[
              { 'tier-four': tIndex === 3, 'tier-five': tIndex === 4 },
              {
                'tier-green': tIndex === 0,
                'tier-yellow': tIndex === 1,
                'tier-red': tIndex === 2,
              },
            ]"
          >
            [T{{ tIndex + 1 }}] {{ tEffect(tier, curse.id) }} (Essence:
            {{ tBonusEffect(tier) }})
          </li>
        </template>
      </ul>
    </li>
  </div>
</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { cursed as curses } from "../../../data/cursed.js";
import { useHero } from "../../../composables/usehero.js";
import { divineSkills } from "../../../data/quasarCore.js";

import { fn } from "../../../composables/utils/global.js";

import { useAmulets } from '../../../composables/battleUtils/useAmulets.js';

const {
  tEffect,
  tBonusEffect,
} = useAmulets();

const { hero } = useHero();

const filterCurses = computed(() =>
  curses.filter((curse) => curse.status === true)
);

const filterCursesTier = computed(() => curses.filter);

</script>

<style scoped>
.curses-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(246, 87, 47) transparent;

  overflow-y: auto;
  max-height: 80vh;
}

.curses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
}

.curse-card-title {
  display: flex;
  align-items: center;
  gap: 0.6em;

  width: 100%;
  box-sizing: border-box;

  padding: 0.55em 0.75em;
  border-radius: 10px;

  background: linear-gradient(
    135deg,
    rgba(140, 25, 25, 0.35),
    rgba(35, 10, 10, 0.75)
  );

  border: 1px solid rgba(220, 80, 80, 0.45);
  box-shadow:
    inset 0 0 8px rgba(255, 80, 80, 0.25),
    0 0 10px rgba(120, 20, 20, 0.35);

  font-size: 1em;
}

/* иконка */
.curse-icon {
  flex-shrink: 0;

  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;
  background: rgba(0, 0, 0, 0.45);

  box-shadow:
    inset 0 0 6px rgba(255, 90, 90, 0.4),
    0 0 6px rgba(255, 60, 60, 0.25);

  color: #ff9b9b;
}

/* название растягивается */
.curse-name {
  flex: 1;

  font-weight: 700;
  letter-spacing: 0.03em;

  color: #ffd0d0;
  text-shadow: 0 0 6px rgba(255, 80, 80, 0.45);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}



.tier-four {
  color: #c56eff;
  font-weight: bold;
  text-shadow: 0 0 6px #c56eff;
}

.tier-five {
  color: #66ffcc;
  font-weight: bold;
  text-shadow: 0 0 6px #66ffcc;
}

.tier-green {
  color: #4ade80;
  font-weight: bold;
  text-shadow: 0 0 6px #4ade80;
}

.tier-yellow {
  color: #facc15;
  font-weight: bold;
  text-shadow: 0 0 6px #facc15;
}

.tier-red {
  color: #f87171;
  font-weight: bold;
  text-shadow: 0 0 6px #f87171;
}


.curse-card {
  background: linear-gradient(180deg, #1a0f0f, #120909);
  border: 1px solid #3f1d1d;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.2);

  height: 35vh;
  overflow-y: auto;
  scrollbar-width: thin;
}

.curse-card header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #fda4af;
}

ul, li {
  list-style: none;
  padding-left: 0;
  margin: 6px 0 0;
}


</style>
