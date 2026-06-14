<template>
  <div class="timeline-content">
    <button class="close-btn" @click="hero.timeline.show = false">✖</button>

    <div class="auto-container">
      <div
          v-if="isVissble()"
          class="effect-card effect-A"
          :class="{ active: isActive() }"
          @click="timelineToggle"
        >
          A
      </div>
    </div>
    

    <h2 class="timeline-title">
      <span v-html="getSvgIconHTML('advanceBH', '1em')"></span> Timeline 
    </h2>
    

    <div class="timeline-buttons">
      <button
        v-for="(level, i) in timelineLevels"
        :key="i"
        :style="{ color: level.color }"
        @click="hero.timelineActiveTier = i"
        class="timeline-icon-btn"
      >
        <span
          v-html="getSvgIconHTML('stoneLaw', '1.5em', { tier: i + 1 })"
          :class="{ divine: i === 4 }"
        ></span>
      </button>
    </div>

    <div
      v-if="
        hero.timelineActiveTier !== null &&
        timelineLevels[hero.timelineActiveTier]
      "
    >
      <div class="timeline-header">
        <h3
          :style="{
            color: timelineLevels[hero.timelineActiveTier]?.color || '#fff',
            margin: '0px',
          }"
        >
          {{ timelineLevels[hero.timelineActiveTier]?.name || "" }}
        </h3>
      </div>
      <div class="timeline-body">
        <div class="timeline-row">
          <span
            :style="{ color: timelineLevels[hero.timelineActiveTier].color }"
            class="value"
            >{{ timelineLevels[hero.timelineActiveTier].desc }}</span
          >
        </div>
        <br />
        <div class="timeline-row">
          <span
            class="value reward"
            v-html="
              timelineDescHandle(timelineLevels[hero.timelineActiveTier].tier)
            "
          >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { timelineLevels } from '../../../data/timeline.js';

import { getSvgIconHTML } from "../../../composables/svgIcon.js";
import SvgIcon from '../../svgIcon.vue';

import { useHero } from "../../../composables/useHero.js";
import { useEnemy } from "../../../composables/useEnemy.js";

import { useDimensions } from "../../../composables/battleUtils/useDimensions.js";
import { useTimeline } from "../../../composables/battleUtils/dims/useTimeline.js";



const { hero } = useHero();
const { enemy } = useEnemy();

const {
  getDimSpecialReward
} = useDimensions();

const {
  timelineTimer
} = useTimeline();

function timelineToggle () {
  if (hero.value.autoTimeLine.isAuto) {
    hero.value.autoTimeLine.isAuto = false;
    hero.value.autoTimeLine.tier = null;
  } else {
    hero.value.autoTimeLine.isAuto = true;
    hero.value.autoTimeLine.tier = hero.value.timelineActiveTier;
  }

  hero.value.autoTimeLine.timer = timelineTimer();
}

function isActive () {
  return hero.value.autoTimeLine.tier == hero.value.timelineActiveTier;
}

function isVissble () {
  return hero.value.timelinePass[hero.value.timelineActiveTier + 1] && 
  getDimSpecialReward(46);
}

const lawData = {
  1: {
    color: '#1cdd1c',
    title: 'Complete this Trial to obtain the Law Stone [T1]. The stone may contain the following laws:<br><br>',
    laws: [
      { name: 'Law of Power', desc: 'Increase damage' },
      { name: 'Law of Life', desc: 'Increase HP' },
      { name: 'Law of Defense', desc: 'Increase Defense' },
    ],
  },
  2: {
    color: 'yellow',
    title: 'Complete this Trial to obtain the Law Stone [T2]. The stone may contain the following laws including previous ones:<br><br>',
    laws: [
      { name: 'Law of Existence', desc: 'Increase critical chance' },
      { name: 'Law of Crits', desc: 'Increase critical damage' },
      { name: 'Law of Kills', desc: 'Reduce stage requirements' },
    ],
  },
  3: {
    color: 'red',
    title: 'Complete this Trial to obtain the Law Stone [T3]. The stone may contain the following laws including previous ones:<br><br>',
    laws: [
      { name: 'Law of Path', desc: 'Reduce the Influence of Corruption' },
      { name: 'Law of Elevations', desc: 'Increase Max Level MULT' },
      { name: 'Law of Fury', desc: 'Increase Max Danger' },
    ],
  },
  4: {
    color: 'rgb(169, 61, 242)',
    title: 'Complete this Trial to obtain the Law Stone [T4]. The stone may contain the following laws including previous ones:<br><br>',
    laws: [
      { name: 'Law of Light', desc: 'Increase Attack Speed' },
      { name: 'Law of Elevations', desc: 'Increase minimum level' },
      { name: 'Law of Attainments', desc: 'Reduce Danger Power' },
    ],
  },
  5: {
    color: '#66ffcc',
    title: 'Complete this Trial to obtain the Law Stone [T5]. The stone may contain the following laws including previous ones:<br><br>',
    laws: [
      { name: 'Law of Infinity', desc: 'Increase base infinity tier of dimensions' },
      { name: 'Law of Might', desc: 'Increase IP MULT' },
      { name: 'Law of Energy', desc: 'Increase Quasar Core efficiency' },
    ],
  },
};


function timelineDescHandle(tier) {
  const data = lawData[tier];
  if (!data) return '';

  
  const title = `${data.title.replace(
    /Law Stone \[T\d\]/,
    `<span style="color: ${data.color}; font-weight: bold">Law Stone [T${tier}]</span>`
  )}`;

  const lawHtml = data.laws
    .map(
      (l, i) => `
        <div class="law-item" style="border-left: 4px solid ${data.color}; padding: 6px 10px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <span v-html="getSvgIconHTML('stoneLaw', '1em', { tier: ${tier} })" style="flex-shrink: 0;"></span>
          <strong style="color: ${data.color}; min-width: 150px;">${l.name}</strong> — ${l.desc}
        </div>
      `
    )
    .join('');

  return `${title}${lawHtml}`;
}

</script>

<style scoped>
.timeline-content {
  position: relative; 
  background: rgba(20, 20, 40, 0.9);
  padding: 20px;
  border-radius: 18px;
  border: 2px solid #666;
  box-shadow: 0 0 30px rgba(200, 200, 255, 0.3);
  text-align: center;
  color: #eee;
}


.timeline-title {
  font-size: 28px;
  margin-bottom: 20px;
  letter-spacing: 2px;
  text-shadow: 0 0 8px #999;
}

.timeline-levels {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.timeline-level {
  background: rgba(40, 40, 60, 0.9);
  border: 2px solid #999;
  border-radius: 14px;
  padding: 12px;
  transition: 0.3s;
}
.timeline-level:hover {
  transform: scale(1.05);
  background: rgba(60, 60, 90, 1);
}



.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  color: #eee;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  color: gold;
  transform: scale(1.2);
}


.divine {
  filter: drop-shadow(0 0 6px #66ffcc) drop-shadow(0 0 12px #66ffcc);
}

.timeline-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.timeline-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
  font-size: 1.5em;
}

.timeline-icon-btn:hover {
  transform: scale(1.2);
}


.timeline-window {
  background: rgba(40, 40, 60, 0.9);
  padding: 16px;
  border-radius: 14px;
  border: 2px solid #999;
}



.law-item {
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 4px solid;
  padding: 6px 10px;
  margin-bottom: 6px;
  background: rgba(30,30,50,0.3);
  border-radius: 6px;
}
.law-item strong {
  font-weight: bold;
  min-width: 150px;
}



.auto-container {
  display: flex;
  justify-content: center; 
  align-items: center;     
}

.effect-card {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  font-weight: 700;
  font-size: 0.85rem;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: inset 0 0 6px rgba(255,255,255,0.08);
}

.effect-card:active {
  transform: scale(0.9);
}

.effect-A {
  background-color: #333;
  border: 1px solid #666;
}

.effect-A:hover {
  background-color: #555;
  box-shadow: 0 0 6px rgba(0, 255, 255, 0.5);
}

.effect-A.active {
  background-color: #00fff0;
  border-color: #00cccc;
  color: #0a0a0a;
  box-shadow: 0 0 10px #00fff0, 0 0 15px #00cccc;
  transform: scale(1.1);
}
</style>
