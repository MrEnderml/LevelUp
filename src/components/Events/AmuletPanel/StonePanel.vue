<template>
  <div class="stone-map">
    <!-- LINES -->
    <svg class="links-layer" viewBox="0 0 300 300">
      <line
        v-for="amulet in stoneAmulets"
        :key="amulet.pos"
        :x1="150"
        :y1="150"
        :x2="coords[amulet.pos].x"
        :y2="coords[amulet.pos].y"
        :class="{ active: amulet.status }"
        :stroke="amulet.status ? amuletStroke(amulet) : '#374151'"
      />
    </svg>

    <!-- STONES -->
    <div
      v-for="amulet in stoneAmulets"
      :key="amulet.name"
      class="stone"
      :class="[amulet.pos]"
    >
      <!-- CRYSTAL -->
      <Tooltip :text="() => tooltipText(amulet)" position="right">
        <svgIcon :name="amulet.stone" size="3em" />
      </Tooltip>

    </div>
  </div>
</template>



<script setup>
import { computed } from "vue";
import { amulets } from "../../../data/amulets.js";
import { useHero } from "../../../composables/usehero.js";
import { divineSkills } from "../../../data/quasarCore.js";

import { getSvgIconHTML } from "../../../composables/svgIcon.js";
import SvgIcon from '../../svgIcon.vue';

import { fn } from "../../../composables/utils/global.js";
import { useAmulets } from "../../../composables/battleUtils/useAmulets.js";

const { hero } = useHero();

const {
  corrHeartHandler
} = useAmulets();

function tooltipText(amulet) {
  if(!amulet.status)
    return `<span style="color: red; font-weight: bold;">Stone is locked</span>`;

  const nameColor = amuletColor(amulet); 

  if(amulet.tier == 5)
    return corruptionStoneText(amulet, nameColor);

  return `<div style="
    font-size: 1em;
    line-height: 1.4;
    color: #e5e7eb;
    min-width: 220px;
  ">
    <h3 style="
      margin: 0 0 8px 0;
      font-weight: bold;
      font-size: 1.2em;
      color: ${nameColor};
      text-shadow: 0 0 6px ${nameColor};
    ">
      ${amulet.name}
    </h3>
    <ul style="
      margin: 0;
      padding: 0;
      list-style: none;
    ">
      <li style="margin-bottom: 4px;">
        Max Level: <strong style="color:#34d399">+${Math.floor(corrHeartHandler(amulet.tier - 1).ML)}</strong>
      </li>
      <li style="margin-bottom: 4px;">
        Max Curses: <strong style="color:#f87171">+${amulet.cursedSlot}</strong>
      </li>
      <li style="margin-bottom: 4px;">
        Skill Slot: ${
          hero.value.maxStage >= 20 + 10 * (amulet.tier - 1)
            ? `<strong style="color:orange">+${amulet.buffSlot}</strong>`
            : `<span style="opacity:0.5">Reach ${20 + 10 * (amulet.tier - 1)} stage</span>`
        }
      </li>
      <li style="margin-bottom: 4px;">
        Suffix: ${
          amulet.suffix.status
            ? `<span style="color: #0dc399">${amulet.suffix.text}</span>`
            : `<span style="opacity:0.5">${amulet.suffix.text}</span>`
        }
      </li>
      <li style="margin-bottom: 4px;">
        Prefix: ${
          amulet.prefix.status
            ? `<span style="color:#fcd34d">${amulet.prefix.text}: ${fn(corrHeartHandler(amulet.tier - 1).MLM)}</span>`
            : `<span style="opacity:0.5">${amulet.prefix.text}</span>`
        }
      </li>
    </ul>
  </div>`.replace(/\n\s*/g, '');
}

function corruptionStoneText(amulet, nameColor) {
  return `<div style="
    font-size: 1em;
    line-height: 1.4;
    color: #e5e7eb;
    min-width: 220px;
  ">
    <h3 style="
      margin: 0 0 8px 0;
      font-weight: bold;
      font-size: 1.2em;
      color: ${nameColor};
      text-shadow: 0 0 8px ${nameColor};
    ">
      ${amulet.name}
    </h3>

    <p style="
      margin: 0 0 10px 0;
      font-size: 0.95em;
      color: #cbd5f5;
      opacity: 0.9;
    ">
      ${amulet.text}
    </p>

    <ul style="
      margin: 0;
      padding: 0;
      list-style: none;
    ">
      <li style="margin-bottom: 4px;">
        Resonance: 
        <strong style="color: #f9453f">${fn(hero.value.curseMult)}</strong>
      </li>

      <li style="margin-bottom: 4px;">
        Max Level: 
        <strong style="color:#34d399">x${fn(amulet.maxLevel)}</strong>
      </li>

      <li style="margin-bottom: 4px;">
        Max Level Mult: 
        <strong style="color:#fcd34d">x${fn(amulet.maxLevelMult)}</strong>
      </li>
      <hr>
      <li style="margin-bottom: 4px;">
        Total Max Levels: 
        <strong style="color:#34d399">${fn(corrHeartHandler().totalML)}</strong>
      </li>

      <li style="margin-bottom: 4px;">
        Total Max Level Mult: 
        <strong style="color:#fcd34d">${fn(corrHeartHandler().totalMLM)}</strong>
      </li>
    </ul>
  </div>`.replace(/\n\s*/g, '');
}


const stoneAmulets = computed(() => [
  { ...amulets[1], pos: "right", stone:  "SoulCore" },
  { ...amulets[4], pos: "center", stone:  "CorrInfluence" },
  { ...amulets[0], pos: "top", stone: "AscensionCore" },
  { ...amulets[2], pos: "bottom", stone:  "VoidCore" },
  { ...amulets[3], pos: "left", stone:  "StarCore" },
]);

const amuletColor = (amulet) => {
  if (!amulet.status) return "locked";

  if (amulet.tier === 5) return "purple";
  if (amulet.tier === 4) return "orange";
  if (amulet.tier === 3) return "lightgreen";
  if (amulet.tier === 2) return "#f424fb";
  if (amulet.tier === 1) return "#9db8ff";
};

const coords = {
  center: { x: 150, y: 150 },
  top:    { x: 150, y: 20 },
  right:  { x: 280, y: 150 },
  bottom: { x: 150, y: 280 },
  left:   { x: 20,  y: 150 }
};

const amuletStroke = (a) => {
  if (a.tier >= 4) return '#facc15';
  if (a.tier === 3) return '#34d399';
  if (a.tier === 2) return '#c084fc';
  return '#60a5fa';
};



const links = [
  { id: "c-t", from: "center", to: "top" },
  { id: "c-r", from: "center", to: "right" },
  { id: "c-b", from: "center", to: "bottom" },
  { id: "c-l", from: "center", to: "left" }
];

const linkActive = (link) =>
  stoneAmulets.value.find(a => a.pos === "center")?.status &&
  stoneAmulets.value.find(a => a.pos === link.to)?.status;


const suff = ["Ascension [T2]", "Soul [T3]", "10000 Rebirth Pts", "Space 18SP"];
const pref = ["Ascension [T3]", "Soul [T4]", "40000 Rebirth Pts", "Space 34SP"];

const filterAmulets = computed(() => amulets.filter((b) => b.status === true));


function prefixHandle(t) {
  return `Max Level MULT - ${1 + t * 0.02 * (hero.value.sp >= 99 ? 2 : 1)}`;
}

</script>

<style scoped>
.stone-map {
  position: relative;
  width: 300px;
  height: 300px;
  margin: auto;
}

.stone {
  position: absolute;
  transform: translate(-50%, -50%);
}

.stone.top    { left: 150px; top: 20px; }
.stone.right  { left: 280px; top: 150px; }
.stone.bottom { left: 150px; top: 280px; }
.stone.left   { left: 20px;  top: 150px; }
.stone.center { left: 150px; top: 150px; }




.links-layer line {
  stroke-width: 4;
}

.links-layer line.active {
  filter: drop-shadow(0 0 6px currentColor);
}

.amulet-stats {
  list-style: none;
  padding: 0;
  margin: 0;
}




.stone-tooltip {
  position: absolute;
  top: 50%;
  left: 110%; 
  transform: translateY(-50%);
  background: #0f0f0f;
  border: 1px solid #3f1d1d;
  padding: 10px;
  border-radius: 10px;
  width: 240px;
  pointer-events: none; 
  z-index: 1000;
  display: none; 
}

.stone:hover .stone-tooltip {
  display: block; 
  pointer-events: auto; 
}




</style>
