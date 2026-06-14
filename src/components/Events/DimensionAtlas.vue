<template>
  <div
    class="atlas-container"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @dragstart.prevent
  > 
  
    <AtlasHeader />
    
    <div v-if="hero.dimDisplayMode === 'map'">
      <AtlasEvents />

      <svg 
        class="atlas-map" 
        :viewBox="hero.dims.viewBox"
        :style="dimensionBackgroundStyle"
        @wheel.prevent="onWheel"
        @mousemove="onMouseMove"
        >
        <line
          v-for="link in fLinks"
          :key="link.id"
          :x1="getPos(link.from).x"
          :y1="getPos(link.from).y"
          :x2="getPos(link.to).x"
          :y2="getPos(link.to).y"
          :stroke="(dark_d.includes(link.id) && !d_req(getDimension(link.to))) ? '#f44336' : (!d_req(getDimension(link.to)) ? '#66ffcc' : '#444')"
          stroke-width="2"
          :style="{
            filter: !d_req(getDimension(link.to)) ? 'drop-shadow(0 0 4px #66ffcc)' : 'none',
            transition: 'stroke 0.3s, filter 0.3s'
          }"
        />

        <circle
          v-if="hero.dimensionStatus == 1 || hero.dimensionStatus == 3"
          :cx="mainDim.x"
          :cy="mainDim.y"
          :r="getTotalRadius(0)"
          :stroke="hero.timeline.lineShows? 'gold': ''"
          fill="transparent"
          stroke-dasharray="5,5"
        />

        <circle
          v-if="hero.dimensionStatus == 2 && hero.bhTier >= 4"
          :cx="darkDim.x"
          :cy="darkDim.y"
          :r="getTotalRadius(1)"
          :stroke="hero.timeline.lineShows? 'red': ''"
          fill="transparent"
          stroke-dasharray="5,5"
        />

        <g
          v-for="dimension in fDimensions()"
          :key="dimension.id"
          @mouseenter="hovered = dimension"
          @mouseleave="hovered = null"
          @click="selectDimension(dimension, hero)"
        >
        <circle
          :cx="dimension.x"
          :cy="dimension.y"
          :r="20"
          :fill="hero.showProgressionCircles ? getInfColor(getDimension(dimension.id)) : 'transparent'"
          :stroke="hero.showProgressionCircles ? '#aaa' : 'transparent'"
          stroke-width="2"
          pointer-events="visible"
          :style="{
            filter: hero.showProgressionCircles && !d_req(getDimension(dimension.id))
              ? 'drop-shadow(0 0 2px ' + getInfColor(getDimension(dimension.id)) + ')'
              : 'none',
            transition: 'fill 0.3s, filter 0.3s',
          }"
        />
          <foreignObject
            v-if="dimension.svg"
            :x="dimension.x - 16"
            :y="dimension.y - 16"
            width="32"
            height="32"
            style="pointer-events: none"
            v-html="dimension.svg"
          />

          <g v-else>
            <text
              :x="dimension.x"
              :y="dimension.y + 5"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="white"
              font-size="18"
            >
              {{ dimension.name }}
            </text>
          </g>

          <text
            v-if="dimension.title"
            :x="dimension.x"
            :y="dimension.y + 36"
            text-anchor="middle"
            fill="white"
            font-size="12"
          >
            {{ dimension.title }}
          </text>
        </g>



        <g v-for="artifact in artifacts" :key="artifact.id">
          <circle
            :cx="artifact.x"
            :cy="artifact.y"
            :r="artifact.radius"
            :fill="artifact.color"
            :style="{
              filter: artifact.glow ? 'drop-shadow(0 0 6px ' + artifact.color + ')' : 'none',
              animation: artifact.pulse ? 'pulse 1.5s infinite' : 'none',
              transition: 'all 0.3s'
            }"
          />
        </g>

        <g 
          v-for="law in fLaws" 
          :key="law.id"
          @mouseenter="hovered = law"
          @mouseleave="hovered = null"
        >
          <circle
            :cx="law.x"
            :cy="law.y"
            :r="law.radius * 2"
            :fill="law.color"
            :style="{
              filter: law.glow ? 'drop-shadow(0 0 6px ' + law.color + ')' : 'none',
              animation: law.pulse ? 'pulse 1.5s infinite' : 'none',
              transition: 'all 0.3s'
            }"
          />
        </g>


      </svg>
    </div>

  <AtlasGrid v-if="hero.dimDisplayMode === 'grid'" />

   <div
      v-if="hovered && dimensionD(hovered)?.trim() !== ''"
      class="tooltip"
      :style="{
        top: tooltip.y + 'px',
        left: tooltip.x + 'px',
        transform: `translate(
          ${tooltipTranslateX},
          ${tooltipTranslateY}
        ) scale(${tooltip.scale.toFixed(2)})`,
        transformOrigin: 'top left',
        boxShadow: tooltipBoxShadowHandle(hovered),
      }"
      v-html="dimensionD(hovered)"
    ></div>



    <div v-if="hero.timeline.show" class="timeline-overlay">
      <Timeline />
    </div>

    <LawsUps v-if="stoneCheck()" :selectedStone="stoneCheck()"/>
    
    

  </div>
</template>


<script setup>
import { ref, computed, reactive, onMounted  } from 'vue'
import { getSvgIconHTML } from '../../composables/svgIcon.js';
import { dimensions as d_data } from '../../data/dimensions.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';;
import { useBuff } from '../../data/buffs.js';

import AtlasHeader from './DAtlas/AtlasHeader.vue';
import AtlasEvents from './DAtlas/AtlasEvents.vue';
import AtlasGrid from './DAtlas/AtlasGrid.vue';
import Timeline from './DAtlas/Timeline.vue';
import LawsUps from './InfinityPanel/LawsUps.vue';

import { useDimHandler } from "../../composables/battleUtils/dims/useDimHandler.js";
import { useNormalDimension } from "../../composables/battleUtils/dims/useNormalDimension.js";
import { useDarkDimension } from "../../composables/battleUtils/dims/useDarkDimension.js";

import { dimensionsPos } from "../../data/dims/dimensionsPos.js";
import { useResets } from '../../composables/battleUtils/useResets.js';
import { useTimeline } from '../../composables/battleUtils/dims/useTimeline.js';

import { selectDimension } from '../../composables/battleUtils/dims/dimPerform.js';

const {
  setNormalCard
} = useNormalDimension();

const {
  performD
} = useResets();

const {
  setDarkCard
} = useDarkDimension();

const { 
  toggleOtherDimensions,
  getInfColor,
  dimensionD,
  d_req,
  fDimensions,
} = useDimHandler();

const {
  timelineEffects,
  getTotalRadius
} = useTimeline();


const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();



let dragging = false
let lastX = 0
let lastY = 0

const mouse = reactive({
  x: 0,
  y: 0
})
const tooltip = reactive({
  x: 0,
  y: 0,
  scale: 1
})

const artifacts = [
  { id: 'singularity', x: 300, y: 100, color: '#cc66ff', radius: 12, glow: true, pulse: true, label: 'Singularity' },
  { id: 'satellite', x: 250, y: 250, orbit: true, label: 'Lost Satellite' },
  { id: 'void', x: 500, y: 300, color: '#00000088', radius: 20, label: 'Void' },
]

const lawHandle = [
  { id: 'law-1', x: 400, y: 250, color: 'gold', radius: 5, glow: true, pulse: true, status: hero.value.bhTier >= 4? 1: -1 },
  { id: 'law-2', x: 300, y: -500, color: 'red', radius: 5, glow: true, pulse: true, status: hero.value.bhTier >= 4? 2: -1 },
]

const dark_d = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]

const fLaws = computed(() => 
  lawHandle.filter(law => {
    if (law.status === -1) return false;

    if (law.status === 0) return hero.value.dimensionStatus >= 1;

    if (law.status === 1) return hero.value.dimensionStatus === 1 ||
    hero.value.dimensionStatus === 3;

    if (law.status === 2) return hero.value.dimensionStatus === 2;

    return true;
  })
);

const offsetX = 0
const offsetY = 0


function getDimension(id) {
  return d_data.value.find(dim => dim.id === id);
}

const links = ref([
  { id: 1, from: 'main', to: 'gravity' },
  { id: 2, from: 'main', to: 'survival' },
  { id: 3, from: 'main', to: 'ascension' },
  { id: 4, from: 'gravity', to: 'overkill' },
  { id: 5, from: 'survival', to: 'noTree' },
  { id: 6, from: 'noTree', to: 'noEq' },
  { id: 7, from: 'noTree', to: 'unlimitted' },
  { id: 8, from: 'noTree', to: 'afk' },
  { id: 9, from: 'noTree', to: 'next' },
  { id: 10, from: 'next', to: 'noStats' },
  { id: 11, from: 'next', to: 'noBuffs' },
  { id: 12, from: 'next', to: 'time' },
  { id: 13, from: 'noBuffs', to: 'danger' },
  { id: 14, from: 'danger', to: 'damage' },
  { id: 15, from: 'noBuffs', to: 'soulD' },
  { id: 16, from: 'ascension', to: 'ascension-2' },
  { id: 17, from: 'noEq', to: 'noSpace' },
  { id: 18, from: 'damage', to: 'overstage' },
  { id: 19, from: 'overstage', to: 'survival-2' },
  { id: 20, from: 'damage', to: 'corruption' },
  { id: 21, from: 'damage', to: 'hard' },
  { id: 22, from: 'corruption', to: 'eternity' },
  { id: 23, from: 'hard', to: 'eternity' },
  { id: 24, from: 'danger', to: 'abyss-d' },
  { id: 26, from: 'noStats', to: 'noMinLevel' },
  { id: 27, from: 'eternity', to: 'd-corruption' },
  { id: 28, from: 'eternity', to: 'd-hard' },
  { id: 29, from: 'd-corruption', to: 'd-damage' },
  { id: 30, from: 'd-hard', to: 'd-damage' },
  { id: 31, from: 'd-damage', to: 'd-overstage' },
  { id: 32, from: 'd-overstage', to: 'd-survival-2' },
  { id: 33, from: 'd-damage', to: 'd-danger' },
  { id: 34, from: 'd-damage', to: 'd-noBuffs' },
  { id: 35, from: 'd-noBuffs', to: 'd-noMinLevel' },
  { id: 36, from: 'd-noBuffs', to: 'd-next' },
  { id: 37, from: 'd-next', to: 'd-noTree' },
  { id: 38, from: 'd-next', to: 'd-unlimitted' },
  { id: 39, from: 'd-noTree', to: 'd-noEq' },
  { id: 40, from: 'd-noTree', to: 'd-noAps' },
  { id: 41, from: 'd-noEq', to: 'd-noSpace' },
  { id: 42, from: 'eternity', to: 'radiation' },
  { id: 43, from: 'radiation', to: 'noMaxLevel' },
  { id: 44, from: 'radiation', to: 'dimMerge' },
].map(link => {
  const dimStatus = dimensionsPos.value.find(d => d.id === link.to)?.status ?? -1;
  return {
    ...link,
    status: dimStatus
  };
}));

const stoneCheck = () => {
  return hero.value.dimensionStatus == 2? hero.value.selectedStones[1]: hero.value.selectedStones[0];
}

const MIN_SIZE = 500
const MAX_SIZE = 4000
const ZOOM_SPEED = 0.1
const BASE = 800

const onWheel = (e) => {
  e.preventDefault()

  let [x, y, w, h] = hero.value.dims.viewBox
    .split(' ')
    .map(Number)

  const direction = e.deltaY > 0 ? 1 : -1
  const factor = 1 + direction * ZOOM_SPEED

  
  const rect = e.currentTarget.getBoundingClientRect()
  const mx = (e.clientX - rect.left) / rect.width
  const my = (e.clientY - rect.top) / rect.height

  
  let newW = w * factor
  let newH = h * factor

 
  if (newW < MIN_SIZE || newH < MIN_SIZE) return
  if (newW > MAX_SIZE || newH > MAX_SIZE) return

  
  x += (w - newW) * mx
  y += (h - newH) * my

  hero.value.dims.viewBox = `${x} ${y} ${newW} ${newH}`

  hero.value.dims.zoom = +(BASE / newW);
}

const TOOLTIP_OFFSET = 14

const updateTooltipPosition = () => {
  if (!hovered.value) return

  const { horizontal, vertical } = getTooltipSide()

  let x = mouse.x
  let y = mouse.y

  if (horizontal === 'right') {
    x += TOOLTIP_OFFSET
  } else if (horizontal === 'left') {
    x -= TOOLTIP_OFFSET
  }

  if (vertical === 'bottom') {
    y += TOOLTIP_OFFSET
  } else if (vertical === 'top') {
    y -= TOOLTIP_OFFSET
  }

  tooltip.x = x
  tooltip.y = y
  tooltip.scale = 1;
}


const getTooltipSide = () => {
  const vw = window.innerWidth
  const vh = window.innerHeight

  const horizontal =
    mouse.x > vw * 0.6 ? 'left'
    : mouse.x < vw * 0.4 ? 'right'
    : 'center'

  const vertical =
    mouse.y > vh * 0.6 ? 'top'
    : mouse.y < vh * 0.4 ? 'bottom'
    : 'center'

  return { horizontal, vertical }
}

const tooltipTranslateX = computed(() => {
  const { horizontal } = getTooltipSide()
  return horizontal === 'left' ? '-100%' : '0%'
})

const tooltipTranslateY = computed(() => {
  const { vertical } = getTooltipSide()
  return vertical === 'top' ? '-100%' : '0%'
})







function tooltipBoxShadowHandle(d){
  if(d.id.startsWith('c-')) return `0 0 10px #cc66ff`;
  else if(d.id.startsWith('d-')) return `0 0 10px red`;
  else return `0 0 10px #66ffcc`;
}

function isInRadius(main, dim, radius) {
  const dx = main.x - dim.x;
  const dy = main.y - dim.y;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}

function radiusCalc(stone, status) {
  if(stone == null) return 0;
  return Math.floor(stone.radius + stone.radius ** 0.5 * (stone.ups + status));
}


const mainDim = dimensionsPos.value.find(d => d.id === 'main');
const darkDim = dimensionsPos.value.find(d => d.id === 'eternity');

function isActiveDimension(baseDim, dim, slotIndex) {
  const radius = radiusCalc(hero.value.lawSlots[slotIndex], 0);
  const inRadius = isInRadius(baseDim, dim, radius);

  const statusMatches = dim.status === hero.value.dimensionStatus;

  return inRadius && statusMatches;
}

const activeLawDimsAll = dimensionsPos.value
  .filter(dim => 
    (isActiveDimension(mainDim, dim, 0) && dim.status === 1) ||
    (isActiveDimension(darkDim, dim, 1) && dim.status === 2)
  )
  .map(dim => dim.id);





const fLinks = computed(() =>
  links.value.filter(link => {
    const fromDim = dimensionsPos.value.find(d => d.id === link.from);
    const toDim = dimensionsPos.value.find(d => d.id === link.to);

    const isFromVisible = fromDim && (
      fromDim.status === 0 ? hero.value.dimensionStatus >= 1 :
      fromDim.status === 1 ? hero.value.dimensionStatus === 1 || hero.value.dimensionStatus === 3 :
      fromDim.status === 2 ? hero.value.dimensionStatus === 2 :
      false
    );

    const isToVisible = toDim && (
      toDim.status === 0 ? hero.value.dimensionStatus >= 1 :
      toDim.status === 1 ? hero.value.dimensionStatus === 1 || hero.value.dimensionStatus === 3 :
      toDim.status === 2 ? hero.value.dimensionStatus === 2 :
      false
    );

    return isFromVisible && isToVisible;
  })
);


const hovered = ref(null)





const startDrag = (e) => {
  if (e.target.closest('input, select, button, textarea')) return;

  e.preventDefault()
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
}
const onDrag = (e) => {
  if (!dragging) return

  const [vx, vy, vw, vh] = hero.value.dims.viewBox.split(' ').map(Number)
  const dx = (e.clientX - lastX) / hero.value.dims.zoom
  const dy = (e.clientY - lastY) / hero.value.dims.zoom
  hero.value.dims.viewBox = `${vx - dx} ${vy - dy} ${vw} ${vh}`
  lastX = e.clientX
  lastY = e.clientY
}
const endDrag = () => {
  dragging = false
}

const onMouseMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
  updateTooltipPosition()
}



const getPos = (id) => dimensionsPos.value.find(d => d.id === id)


const viewBoxXOffset = computed(() => {
  const [vx] = hero.value.dims.viewBox.split(' ').map(Number)
  return vx
})

const viewBoxYOffset = computed(() => {
  const [, vy] = hero.value.dims.viewBox.split(' ').map(Number)
  return vy
})


function corruptedDimension(d){
  let str = `<span><strong>Dimension: ${d.name} [${d.idx}]</strong></span><br>`;

  
}

const dimensionBackgroundStyle = computed(() => {
  if (hero.value.dimensionStatus !== 3) return {} 
  const alpha = 0.2 + 0.01 * hero.value.dims.corrShards;
  return {
    background: `rgb(102 51 153 / ${alpha})`,
    transition: 'background 0.3s ease'
  }
})


</script>

<style scoped>
.atlas-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(ellipse at center, #0b0f1a 0%, #000000 100%);
  border: 2px solid #333;
  border-radius: 12px;

  overflow: hidden;
  cursor: grab;
}



.atlas-map {
  width: 100vw;
  height: 100vh;
}



@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

.dimension-circle {
  transition: transform 0.2s ease, filter 0.2s ease;
}
.dimension-circle:hover {
  filter: drop-shadow(0 0 6px white);
}


.tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  line-height: 1.35;
  background: #0b1414;
  border-radius: 10px;
  padding: 12px 14px;
  text-align: center;
  font-size: 0.875rem;
  width: 350px;
}



.reset-button, .progression-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 20;
  padding: 6px 10px;
  background: #222;
  color: #fff;
  border: 1px solid #555;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}
.reset-button:hover {
  background: #333;
}

.progression-button {
 right: 100px;
}

.reset-button-bh{
  right: 205px;
}

.reset-button-timeline {
  right: 320px;
}

@keyframes pulse {
  0% {
    r: 8;
    opacity: 1;
  }
  50% {
    r: 12;
    opacity: 0.6;
  }
  100% {
    r: 8;
    opacity: 1;
  }
}



.atlas-header {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  flex-wrap: wrap;
}









.timeline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 15, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; 
}





</style>
