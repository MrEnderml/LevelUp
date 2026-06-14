<template>
  <div class="atlas-header">
    <div class="atlas-top-panel">
      <div class="panel-content">
        <div class="header">
          <button @click="hero.dimDisplayMode = 'map'">
            <SvgIcon name="dHeaderAtlas" size="1.5em" /> 
            Atlas
          </button>
          <button @click="hero.dimDisplayMode = 'grid'">
            <SvgIcon name="dHeaderGrid" size="1.5em" /> 
            Grid
          </button>

          <button
            :disabled="!isEternityUnlocked"
            :class="{ disabled: !isEternityUnlocked }"
            @click="toggleOtherDimensions"
          >
            <SvgIcon name="dHeaderDarkDim" size="1.5em" /> Dark Dimensions
          </button>

          <button
            :disabled="hero.bhTier < 4"
            :class="{ disabled: hero.bhTier < 4}"
            @click="timelineActive()"
          >
            <SvgIcon name="advanceBH" size="1.5em" /> Timeline
          </button>

          <button
            :disabled="hero.mainInfTier < 60"
            :class="{ disabled: hero.mainInfTier < 60 }"
            @click="corrToggle()"
          >
            <SvgIcon name="CorrInfluence" size="1.5em" /> D-Corruption
          </button>
          
        </div>
        
        <div class="footer" v-if="hero.dimDisplayMode === 'grid'">
          <input
            id="dimension-search"
            name="dimension-search"
            v-model="hero.dims.searchQuery"
            class="dimension-search small"
            placeholder="🔍 Search..."
          />

          <select
            v-model="hero.gridFilterStatus"
            class="dimension-filter small"
          >
            <option value="all">🌐 All</option>
            <option value="completed">✅ Completed</option>
            <option value="inprogress">⚡ In Progress</option>
            <option value="blocked">⛔ Blocked</option>
          </select>
        </div>

      </div>
    </div>

    <div class="atlas-quick-panel" v-if="hero.dimDisplayMode === 'map' && !hero.timeline.show">
      <div class="quick-block teleport-block">
        <div class="block-title">Teleports</div>
        <button
          class="reset-button"
          @click="resetView('main')"
        >
          🌍 main
        </button>
        <button
          v-if="hero.rebirthPts >= 1e7"
          class="reset-button reset-button-bh"
          @click="resetView('bh')"
        >
          <span v-html="getSvgIconHTML('singularity', '1em')"></span> Black Hole
        </button>
        <button
          v-if="hero.bhTier >= 4"
          class="reset-button reset-button-timeline"
          @click="resetView('advanceBH')"
        >
          <span v-html="getSvgIconHTML('advanceBH', '1em')"></span> Timeline
        </button>
      </div>

      <div class="quick-block function-block">
        <div class="block-title">Features</div>
        <button
          class="progression-button"
          @click="toggleProgressionCircles"
        >
          Progression
        </button>
        <button
          v-if="hero.bhTier >= 4"
          class="progression-button"
          @click="isStoneUp"
        >
          Stone Up
        </button>
        <button
          v-if="hero.bhTier >= 4"
          class="progression-button"
          @click="hero.timeline.lineShows = !hero.timeline.lineShows"
        >
          Law Radius 
        </button>
      </div>

      <div class="quick-block zoom-block">
        <div class="block-title">Zoom</div>

        <div class="zoom-value">
          Z: <strong>{{ hero.dims.zoom.toFixed(2) }}</strong>
        </div>
      </div>
    </div>

    <div class="atlas-quick-panel" style="left: 20px" v-if="hero.dimDisplayMode === 'map' && !hero.timeline.show">
      <div v-if="hero.autoTimeLine.isAuto" class="quick-block teleport-block">
        <div class="block-title">Timeline</div>
        <button>Tier: {{ hero.autoTimeLine.tier }}</button>
        <button>Time: {{timeFormat(hero.autoTimeLine.timer)}}</button>
      </div>

      <div v-if="hero.dims.corrShards >= 20" class="quick-block void-block">
        <div class="block-title">Void Pulsation</div>
        <button>Void Shards: {{ fn(voidShardsDrop()) }}</button>
        <button>Time: {{timeFormat(hero.void.time)}}</button>
      </div>

      <div v-if="hero.dimensionStatus == 2" class="quick-block dark-block">
        <div class="block-title">Dark Dimensions</div>
        <button>Total infinities: {{ darkInf }}</button>
      </div>
    </div>

    <DimAdder />


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getSvgIconHTML } from "../../../composables/svgIcon.js";
import SvgIcon from '../../svgIcon.vue';

import { dimensions as d_data } from "../../../data/dimensions.js";
import { useHero } from "../../../composables/useHero.js";
import { useEnemy } from "../../../composables/useEnemy.js";
import { useDimHandler } from "../../../composables/battleUtils/dims/useDimHandler.js";
import { fn, timeFormat } from "../../../composables/utils/global.js";
import { useVoid } from "../../../composables/battleUtils/dims/useVoid.js";

import { selectDimension } from "../../../composables/battleUtils/dims/dimPerform.js";

import DimAdder from "./DimAdder.vue";
const { 
  toggleOtherDimensions, 
  corrToggle,
  darkInf 
} = useDimHandler();

const {
  voidShardsDrop
} = useVoid();

const { hero } = useHero();


const isEternityUnlocked = computed(() => {
  const prev1 = d_data.value.find((dim) => dim.id === "corruption");
  const prev2 = d_data.value.find((dim) => dim.id === "hard");
  return (
    hero.value.mainInfTier >= 35 && prev1.infTier >= 35 && prev2.infTier >= 25
  );
});

function toggleProgressionCircles() {
  hero.value.showProgressionCircles = !hero.value.showProgressionCircles;
}

function timelineActive() {
  hero.value.timeline.show = !hero.value.timeline.show;
}

function isStoneUp () {
   if(hero.value.dimensionStatus == 2 && hero.value.selectedStones[1] ||
    (hero.value.dimensionStatus == 1 || hero.value.dimensionStatus == 3) && hero.value.selectedStones[0]) 
    return hero.value.timeline.showUpgradeModal = true;

}


const resetView = (point) => {
  let location = {x: 0, y: 0};
  let dim = {};

  if(hero.value.dimensionStatus == 2)
    toggleOtherDimensions();

  if(hero.value.dimensionStatus == 3)
    corrToggle();

  switch(point) {
    case "bh": 
      location.x = -600;
      location.y = 50;
      dim.id = 'bh';

      break;
    case "advanceBH": 
      location.x = -1000;
      location.y = 50;
      dim.id = 'advanceBH';

      break;
    case "main":
      location.x = 400;
      location.y = 300;
      dim.id = 'main';

      break;
  }

  const zoom = hero.value.dims.zoom || 1
  const baseW = 800;
  const baseH = 600;

  const width = baseW / zoom
  const height = baseH / zoom

  const viewX = location.x - width / 2
  const viewY = location.y - height / 2

  hero.value.dims.viewBox = `${viewX} ${viewY} ${width} ${height}`

  if(hero.value.settings.dimTeleport)
      selectDimension(dim, hero.value);
}

function zoomReset() {
  let [x, y, w, h] = hero.value.dims.viewBox
    .split(' ')
    .map(Number)

  hero.value.dims.viewBox = `${x} ${y} ${800} ${600}`;
  hero.value.dims.zoom = 1;
}

</script>

<style scoped>
.atlas-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  gap: 8px;
  padding: 8px;

  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);

  z-index: 50;
}

.atlas-top-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 28px;
  z-index: 20;
}

.atlas-top-panel .panel-content {
  flex-direction: column;
  width: 95%;
  background: rgba(10, 12, 20, 0.85);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: top 0.25s ease;
}

.header, .footer {
  display: flex;
  gap: 5px
}

.atlas-top-panel button,
.atlas-top-panel input,
.atlas-top-panel select {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 10px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.dimension-search.small {
  width: 20vh;
  height: 2vh;
  padding: 0.3em 0.6em;
  font-size: 0.8em;
}

.dimension-filter.small {
  font-size: 14px;        
  padding: 4px 8px;      
  height: 32px;           
  line-height: 1;       
  border-radius: 8px;     
  border: 1px solid #ccc; 
  background: #1a1a1a;   
  color: #fff;            
  box-sizing: border-box;
}


.atlas-quick-panel {
  position: absolute;
  top: 80px;
  right: 50px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: clamp(120px, 15vw, 200px);
  z-index: 60;
}

.quick-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.block-title {
  font-weight: bold;
  font-size: 0.85rem;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: #f5e538;
}

.teleport-block {
  background: rgba(0, 120, 255, 0.4);
}

.function-block {
  background: rgba(255, 120, 0, 0.4);
}

.zoom-block {
  background:rgba(125, 233, 255, 0.15)
}

.void-block {
  background: rgb(230 0 255 / 40%);
}

.dark-block {
  background: rgba(255, 0, 0, 0.4);
}


.quick-block button {
  min-width: 80px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;
}





@media (max-width: 900px) {
  .atlas-quick-panel {
    top: 60px;
    right: 8px;
    gap: 12px;
  }
  .quick-block {
    gap: 4px;
    padding: 6px;
  }
  .quick-block button {
    font-size: 0.85rem;
    min-width: 70px;
  }
}

.zoom-block .block-title {
  font-weight: 700;
  font-size: 14px;
  color: #7de9ff;
  letter-spacing: 0.5px;
}

.zoom-reset {
  background: rgba(125, 233, 255, 0.32);
  border: 1px solid #3fbcd8;
  border-radius: 6px;
  padding: 4px 10px;
  color: #cffffa;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-reset:hover {
  background: rgba(125, 233, 255, 0.25);
  box-shadow: 0 0 6px rgba(125, 233, 255, 0.6);
}

.zoom-reset:active {
  transform: scale(0.95);
}

.zoom-value {
  font-size: 12px;
  opacity: 0.85;
}

</style>
