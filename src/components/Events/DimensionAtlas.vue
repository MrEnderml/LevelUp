<template>
  <div
    class="atlas-container"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
  >
    <div
      v-for="(star, index) in stars"
      :key="index"
      class="star"
      :style="star"
    ></div>
    <button v-if="hero.dimDisplayMode === 'map'" class="reset-button" @click="selectDimension(dimensions[0])">
      🌍 main
    </button>
    <button v-if="hero.dimDisplayMode === 'map'" class="progression-button" @click="toggleProgressionCircles">
      Progression
    </button>
    <button v-if="hero.dimDisplayMode === 'map' && hero.rebirthPts >= 1e7" class="reset-button reset-button-bh" @click="resetView('bh')">
      🌑 Black Hole
    </button>

    <div class="atlas-header">
      <button @click="hero.dimDisplayMode = 'map'">🗺 Map</button>
      <button @click="hero.dimDisplayMode = 'grid'">🔲 Grid</button>
      <button
        @click="toggleOtherDimensions"
        :disabled="!isEternityUnlocked"
        :class="{ disabled: !isEternityUnlocked }"
      >
        🌌 Dark Dimensions
      </button>

      <input
        v-if="hero.dimDisplayMode === 'grid'"
        v-model="searchQuery"
        type="text"
        class="dimension-search small"
        placeholder="🔍 Search..."
      />

      <select v-if="hero.dimDisplayMode === 'grid'" v-model="hero.gridFilterStatus" class="dimension-filter small">
          <option value="all">🌐 All</option>
          <option value="completed">✅ Completed</option>
          <option value="inprogress">⚡ In Progress</option>
          <option value="blocked">⛔ Blocked</option>
      </select>
    </div>

    <svg v-if="hero.dimDisplayMode === 'map'" class="atlas-map" :viewBox="viewBox">
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

      <g
        v-for="dimension in fDimensions"
        :key="dimension.id"
        @mouseenter="hovered = dimension"
        @mouseleave="hovered = null"
        @click="selectDimension(dimension)"
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
          transition: 'fill 0.3s, filter 0.3s'
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
    </svg>

    <div v-if="hero.dimDisplayMode === 'grid'" class="dimension-grid-wrapper">
      <div class="dimension-grid">
        <div
          v-for="dimension in filteredDimensions"
          :key="dimension.id"
          class="dimension-card"
          :style="{ borderColor: getInfColor(dimension) }"
        >
          <div 
            class="dimension-icon" 
            v-html="dimension.svg || dimension.name"
            :style="{ color: getInfColor(dimension) }"
          ></div>
          <div class="dim-description-scroll">
            <p v-html="dimensionD(dimension)"></p>
          </div>
          <button class="enter-button" @click="selectDimension(dimension)">Enter</button>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="hovered"
      class="tooltip"
      :style="{
        top: `${(hovered.y - viewBoxYOffset) * zoom}px`,
        left: `${(hovered.x - viewBoxXOffset) * zoom}px`,
        transform: `translate(-50%, -100%) scale(${(1 / zoom).toFixed(2)})`,
        transformOrigin: 'top left'
      }"
      v-html="dimensionD(hovered)"
    >
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { getSvgIconHTML } from '../../composables/svgIcon.js';
import { dimensions as d_data } from '../../data/dimensions.js';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { perks as radPerks } from '../../data/radPerks.js';
import { perks as tperks } from '../../data/perks.js';
import { perks as ascension } from '../../data/ascension.js';
import { amulets } from '../../data/amulets.js';
import { cursed } from '../../data/cursed.js';
import { useBuff } from '../../data/buffs.js';
import { spEnemy } from '../../data/spaceEnemy.js';
import { killHistory } from '../../composables/afkHandle.js';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const searchQuery = ref('');

const isEternityUnlocked = computed(() => {
  const prev1 = d_data.value.find(dim => dim.id === 'corruption');
  const prev2 = d_data.value.find(dim => dim.id === 'hard');
  return hero.value.mainInfTier >= 35 && prev1.infTier >= 35 && prev2.infTier >= 25;
});

function toggleOtherDimensions() {
  const newD = d_data.value.find(d => d.id === 'eternity');
  if (!newD) return;

  newD.status = !newD.status;

  d_data.value.forEach(d => {
    if (d.idx < 24 || d.idx >= 26) {
      d.status = !d.status;
    }
  });

  dimensions.value = dimensions.value.map(dim => {
    if (['eternity', 'bh'].includes(dim.id)) return dim;
    return {
      ...dim,
      status: d_data.value.find(d => d.id === dim.id)?.status ?? false
    };
  });

  links.value = links.value.map(link => {
    if (['eternity', 'bh'].includes(link.id)) return link;

    return {
      ...link,
      status: d_data.value.find(d => d.id === link.to)?.status ?? false
    };
  });
}

const filteredDimensions = computed(() =>
  fDimensions.value.filter(dim => {
    const query = searchQuery.value.toLowerCase();
    const nameMatch =
      dim.id.toLowerCase().includes(query) ||
      (dim.title || "").toLowerCase().includes(query);
    const descMatch = (dimensionD(dim) || "").toLowerCase().includes(query);
    const matchesSearch = nameMatch || descMatch;


    const status = getInfStatus(dim);
    const matchesStatus =
      hero.value.gridFilterStatus === "all" || hero.value.gridFilterStatus === status;

    return matchesSearch && matchesStatus;
  })
);

const zoom = 1
const offsetX = 0
const offsetY = 0

function getDimension(id) {
  return d_data.value.find(dim => dim.id === id);
}

const artifacts = [
  
  { id: 'singularity', x: 300, y: 100, color: '#cc66ff', radius: 12, glow: true, pulse: true, label: 'Singularity' },
  { id: 'satellite', x: 250, y: 250, orbit: true, label: 'Lost Satellite' },
  { id: 'void', x: 500, y: 300, color: '#00000088', radius: 20, label: 'Void' },
]

const dark_d = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]

const dimensions = ref([
  { id: 'main', name: '🌍', x: 400, y: 300, color: '#4caf50' },
  { id: 'gravity', svg: getSvgIconHTML('galaxy1', '2em'), x: 600, y: 200, color: '#e53935' },
  { id: 'survival', svg: getSvgIconHTML('galaxy2', '2em'), x: 200, y: 200, color: '#2196f3' },
  { id: 'ascension', svg: getSvgIconHTML('galaxy3', '2em'), x: 400, y: 400, color: '#673ab7' },
  { id: 'overkill', svg: getSvgIconHTML('galaxy4', '2em'), x: 800, y: 300, color: '#f4a261' },
  { id: 'noTree', svg: getSvgIconHTML('galaxy5', '2em'), x: 300, y: -50, color: '#90caf9' },
  { id: 'noEq', svg: getSvgIconHTML('galaxy6', '2em'), x: 150, y: 50, color: '#90caf9' },
  { id: 'unlimitted', svg: getSvgIconHTML('galaxy7', '2em'), x: -50, y: 50, color: '#90caf9' },
  { id: 'afk', svg: getSvgIconHTML('galaxy8', '2em'), x: 450, y: 50, color: '#90caf9' },
  { id: 'next', svg: getSvgIconHTML('galaxy9', '2em'), x: 400, y: -150, color: '#90caf9' },
  { id: 'time', svg: getSvgIconHTML('galaxy3', '2em'), x: 400, y: -250, color: '#90caf9' },
  { id: 'noStats', svg: getSvgIconHTML('galaxy2', '2em'), x: 250, y: -250, color: '#90caf9' },
  { id: 'noMinLevel', svg: getSvgIconHTML('galaxy8', '2em'), x: 50, y: -250, color: '#90caf9' },
  { id: 'noBuffs', svg: getSvgIconHTML('galaxy10', '2em'), x: 500, y: -150, color: '#90caf9' },
  { id: 'danger', svg: getSvgIconHTML('galaxy14', '2em'), x: 700, y: -250, color: '#90caf9' },
  { id: 'damage', svg: getSvgIconHTML('galaxy1', '2em'), x: 650, y: -400, color: '#90caf9' },
  { id: 'overstage', svg: getSvgIconHTML('galaxy17', '2em'), x: 750, y: -550, color: '#90caf9' },
  { id: 'survival-2', svg: getSvgIconHTML('galaxy3', '2em'), x: 850, y: -550, color: '#90caf9' },
  { id: 'soulD', svg: getSvgIconHTML('galaxy13', '2em'), x: 850, y: 50, color: '#90caf9' },
  { id: 'ascension-2', svg: getSvgIconHTML('galaxy15', '2em'), x: 400, y: 500, color: '#90caf9' },
  { id: 'noSpace', svg: getSvgIconHTML('galaxy18', '2em'), x: 150, y: 125, color: '#90caf9' },
  { id: 'corruption', svg: getSvgIconHTML('galaxy3', '2em'), x: 500, y: -500, color: '#90caf9' },
  { id: 'hard', svg: getSvgIconHTML('galaxy12', '2em'), x: 500, y: -350, color: '#90caf9' },
  { id: 'eternity', svg: getSvgIconHTML('galaxyEternity', '2em'), x: 300, y: -450, color: '#90caf9', status: true },
  { id: 'abyss-d', svg: getSvgIconHTML('galaxy13', '2em'), x: 600, y: -250, color: '#90caf9' },
  { id: 'bh', svg: getSvgIconHTML('singularity', '2em'), x: -600, y: 50, color: '#90caf9', status: hero.value.rebirthPts >= 1e7 },
  { id: 'advanceBH', svg: getSvgIconHTML('advanceBH', '2em'), x: -1000, y: 50, color: '#90caf9', status: hero.value.bhTier >= 4 },
  { id: 'd-corruption', svg: getSvgIconHTML('galaxy3', '2em'), x: 500, y: -500, color: '#90caf9' },
  { id: 'd-hard', svg: getSvgIconHTML('galaxy12', '2em'), x: 500, y: -350, color: '#90caf9' },
  { id: 'd-damage', svg: getSvgIconHTML('galaxy1', '2em'), x: 650, y: -400, color: '#90caf9' },
  { id: 'd-overstage', svg: getSvgIconHTML('galaxy17', '2em'), x: 750, y: -550, color: '#90caf9' },
  { id: 'd-survival-2', svg: getSvgIconHTML('galaxy3', '2em'), x: 850, y: -550, color: '#90caf9' },
  { id: 'd-danger', svg: getSvgIconHTML('galaxy14', '2em'), x: 700, y: -150, color: '#90caf9' },
  { id: 'd-noBuffs', svg: getSvgIconHTML('galaxy10', '2em'), x: 500, y: -150, color: '#90caf9' },
  { id: 'd-noMinLevel', svg: getSvgIconHTML('galaxy7', '2em'), x: 250, y: -250, color: '#90caf9' },
  { id: 'd-next', svg: getSvgIconHTML('galaxy9', '2em'), x: 400, y: -150, color: '#90caf9' },
  { id: 'd-unlimitted', svg: getSvgIconHTML('galaxy7', '2em'), x: 600, y: 50, color: '#90caf9' },
  { id: 'd-noTree', svg: getSvgIconHTML('galaxy14', '2em'), x: 300, y: -50, color: '#90caf9' },
  { id: 'd-noAps', svg: getSvgIconHTML('galaxy7', '2em'), x: 400, y: 50, color: '#90caf9' },
  { id: 'd-noEq', svg: getSvgIconHTML('galaxy15', '2em'), x: 150, y: 50, color: '#90caf9' },
  { id: 'd-noSpace', svg: getSvgIconHTML('galaxy18', '2em'), x: 150, y: 125, color: '#90caf9' },
  { id: 'radiation', svg: getSvgIconHTML('galaxy16', '2em'), x: 200, y: -450, color: '#90caf9' },
  { id: 'noMaxLevel', svg: getSvgIconHTML('galaxy17', '2em'), x: 200, y: -350, color: '#90caf9' },
  { id: 'dimMerge', svg: getSvgIconHTML('galaxy18', '2em'), x: -100, y: -600, color: '#90caf9' },
].map(dim => ({
  ...dim,
  status: dim.status ?? d_data.value.find(d => d.id === dim.id)?.status ?? false
})))

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
  { id: 25, from: 'main', to: 'bh' },
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
].map(link => ({
  ...link,
  status: link.status ?? d_data.value.find(d => d.id === link.to)?.status ?? false
})))


const computedStyle = computed(() => {
  const x = (this.hovered.x - this.viewBoxXOffset) * this.zoom;
  const y = (this.hovered.y - this.viewBoxYOffset) * this.zoom;

  const tooltipWidth = 200;  
  const tooltipHeight = 100; 

  const margin = 10;

 
  const isTooRight = x + tooltipWidth > window.innerWidth;
  const isTooBottom = y + tooltipHeight > window.innerHeight;

  const translateX = isTooRight ? '-100%' : '0%';
  const translateY = isTooBottom ? '0%' : '-100%';

  return {
    top: `${y}px`,
    left: `${x}px`,
    transform: `translate(${translateX}, ${translateY}) scale(${(1 / this.zoom).toFixed(2)})`,
    transformOrigin: 'top left',
  };
})

const fDimensions = computed(() => 
  dimensions.value.filter(d => d.status === true)
)

const fLinks = computed(() => 
  links.value.filter(l => l.status === true)
)

const availableDimensions = computed(() => {
  if(d_data.value[9].infTier == d_data.value[9].maxInfTier)
    dimensions.value.map(d => d.status = true)
})

const hovered = ref(null)
const viewBox = ref('0 0 800 600')


let dragging = false
let lastX = 0
let lastY = 0

const startDrag = (e) => {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
}
const onDrag = (e) => {
  if (!dragging) return
  const [vx, vy, vw, vh] = viewBox.value.split(' ').map(Number)
  const dx = (e.clientX - lastX) / zoom
  const dy = (e.clientY - lastY) / zoom
  viewBox.value = `${vx - dx} ${vy - dy} ${vw} ${vh}`
  lastX = e.clientX
  lastY = e.clientY
}
const endDrag = () => {
  dragging = false
}

function getInfColor(dim) {
  let id = dim.id;
  let d = {};
  for(let ds of d_data.value){
    if(ds.id == id){
      d = ds;
      break;
    }
  }

  if (d_req(d)) return '#f44336'; // 🔴 blocked
  
  const tier = d.infTier ?? 0;
  const max = d.maxInfTier ?? Infinity;

  if (tier >= max) return '#66ff66'; // 🟢 completed
  if (tier >= 0 && tier < max) return '#ffcc00'; // 🟡 in progress
  return '#444'; // ⚫ default (не начато)
}

function getInfStatus(dim) {
  let id = dim.id;
  let d = {};
  for(let ds of d_data.value){
    if(ds.id == id){
      d = ds;
      break;
    }
  }

  if (d_req(d)) return "blocked";
  const tier = d.infTier ?? 0;
  const max = d.maxInfTier ?? Infinity;
  if (tier >= max) return "completed";
  if (tier >= 0) return "inprogress";
  return "default";
}



function toggleProgressionCircles() {
  hero.value.showProgressionCircles = !hero.value.showProgressionCircles;
}

const getPos = (id) => dimensions.value.find(d => d.id === id)

const dimensionGraph = {
  26: [],
  27: [],
  28: [26, 27],
  29: [28, 27, 26],
  30: [29, 28, 27, 26],
  31: [28, 27, 26],
  32: [31, 28, 27, 26],
  33: [32, 31, 28, 27, 26],
  34: [32, 31, 28, 27, 26],
  35: [34, 32, 31, 28, 27, 26],
  36: [35, 34, 32, 31, 28, 27, 26],
  37: [36, 35, 34, 32, 31, 28, 27, 26],
  38: [34, 32, 31, 28, 27, 26],
  39: [35, 34, 32, 31, 28, 27, 26]
};

const selectDimension = (dimension) => {
  if(hero.value.isSingularity) return;
  
  const id = dimension.id;
  const newD = d_data.value.find(ds => ds.id === id);
  const currentD = d_data.value.find(ds => ds.id === hero.value.dId);

  hero.value.dTimer = 0;
  killHistory.length = 0;
  hero.value.infEvents = 0;


  if(d_req(newD))
    return;

  if(newD.id == 'eternity'){
    toggleOtherDimensions();
    return;
  }

  if(newD.id.startsWith('d-'))
    selectDarkD(newD);
  else 
    hero.value.darkId = [];


  if(hero.value.dId == newD.id && hero.value.dId !== 'time')
    return;

  if (newD.id === 'ascension' || newD.id === 'ascension-2') {
    for (let perk in ascension) {
      hero.value.transferAscensionArray[perk] = ascension[perk].level; 
      ascension[perk].level = 0; 
    }
  }

  if (currentD.id === 'ascension' || currentD.id === 'ascension-2') {
    for (let perk in ascension) {
      ascension[perk].level = hero.value.transferAscensionArray[perk] || 0; 
      hero.value.transferAscensionArray[perk] = 0; 
    }
  }

  if(newD.id == 'main') hero.value.infEvents = hero.value.mainInfTier;

  hero.value.infTier = (newD.id === 'main'
    ? (hero.value.mainInfTier ?? 0)
    : newD.infTier);

  hero.value.dId = (newD.id == 'eternity'? hero.value.dId: newD.id);
  
  if(newD.id == 'eternity')
    return;

  if(newD.id == 'bh'){
    hero.value.transcendenceBH = Math.floor(hero.value.transcendence);
    d_data.value[25].infTier = 50 + 5 * hero.value.bhTier;
  }

  performD(newD, currentD);
}

const selectDarkD = (newD) => {
  const darkDimensions = d_data.value.filter(d => d.id.startsWith('d-'));
  const newActiveIdx = dimensionGraph[newD.idx] || [];
  const newActiveIds = newActiveIdx
    .map(idx => d_data.value.find(d => d.idx === idx))
    .filter(d => d && d.id.startsWith('d-'))
    .map(d => d.id);

  for (const id of newActiveIds) {
    if (!hero.value.darkId.includes(id)) {
      hero.value.darkId.push(id);
    }
  }

  hero.value.darkId = hero.value.darkId.filter(id => newActiveIds.includes(id));

}

const viewBoxXOffset = computed(() => {
  const [vx] = viewBox.value.split(' ').map(Number)
  return vx
})

const viewBoxYOffset = computed(() => {
  const [, vy] = viewBox.value.split(' ').map(Number)
  return vy
})

const resetView = (point) => {
  
  const main = getPos(point)
  if (main) {
    const width = 800
    const height = 600
    const viewX = main.x - width / 2
    const viewY = main.y - height / 2
    viewBox.value = `${viewX} ${viewY} ${width} ${height}`
  }
}

function dimensionD(hovered) {
  let id = hovered.id;
  let d = {};
  for(let ds of d_data.value){
    if(ds.id == id){
      d = ds;
      break;
    }
  }

  if(d.id == 'bh')
    return bhChallenge();

  if(d.id == 'advanceBH')
    return advanceBH();

  if(d_data.value[24].status == false)
    return darkDimensions(d);


  let filtered = ['unlimitted', 'main', 'time', 'abyss-d', 'survival-2', 'eternity', 'dimMerge']
  let dInfFiltered = ['time', 'abyss-d', 'survival-2', 'eternity', 'dimMerge']

  if(d.id == 'unlimitted')
    d.r = unlimittedDescription();
  

  let str = `<span><strong>Dimension: ${d.name} [${d.idx}]</strong></span><br>`

  if(d.id == 'hard') str += `Enter the dimension where curses are [T5] and they are permanent. You won't get loot from curses. Abyss is locked. Reach Stage ${100 + 5 * (d.infTier - 15)} to be able to advance to the next INF Tier<br>`;
  else if(d.id == 'overstage') str += `Enter the Dimension where you start from Stage ${100 + 5 * (d_data.value[19].infTier - 20)}<br>`
  else str += `<span>${d.d}</span><br><br>`;

  if(d_req(d)) str += `<span style="color: red">${d.c}</span><br>`;
  if(!filtered.includes(d.id)) str += `<span style="color: gold">Infinity [T${d.infTier}]/[T${d.maxInfTier}]</span><br><br>`;
  if(d.id == 'main') str += `<span style="color: gold">Infinity [T${hero.value.mainInfTier}]</span><br><br>`
  if(dInfFiltered.includes(d.id)) str += `<span style="color: gold">Infinity [T${d.infTier}]</span><br><br>`

  if(d.id == 'noBuffs') str += `Reward: Buff EXP Boost - <spna>${formatNumber(1.15 ** (d.infTier - 5), true)}</span><br>`
  else if(d.id == 'time') str += dTime();
  else if(d.id == 'danger') str += `Max Danger: +${Math.floor(1.45 ** (d.infTier - 10) - 1)}<br>`
  else if(d.id == 'damage') str += `Damage MULT: ${(1.04 ** (d.infTier - 20)).toFixed(2)}<br>`
  else if(d.id == 'survival-2') str += `Max stage: ${hero.value.survivalStage}<br>You will get double stats until Level(not includeing Min Level) ${Math.floor(hero.value.survivalStage ** 1.175)}<br>`
  else if(d.r != '') str += `Reward: <span>${d.r}</span><br>`;

  if(d.sp != '') str += `Special Reward: <span>${d.sp}</span><br>`;
  if(d.id == hero.value.dId) str += `<span style="color: green">[You are here now]</span><br>`
  if(hero.value.isSingularity) str += `<span style="color: #66ffcc">You are in Singularity right now</span><br>`

  if(d.id == 'time') str += `<br>Your best time ${timeFormat(hero.value.dTimeReward)}`

  return str;
}

function darkDimensions(d){


  let str = `<span><strong>Dimension: ${d.name} [${d.idx}]</strong></span><br>`

  if(d_req(d)) str += `<span style="color: red">${d.c}</span><br>`;

  if(d.id == 'eternity' && d.status == false) str += dark_dimensions_handle();
  else if(d.id == 'd-danger') str += d_danger_des_handle(d);
  else if(d.id == 'd-noSpace') str += d_noSpace_des_hanlde(d);
  else str += `<span>${d.d}</span><br><br>`;

  if(d.id != 'eternity') str += `<span style="color: gold">Infinity [T${d.infTier}]</span><br><br>`


  if(d.id == 'eternity' && d.status == false) str += ``;
  else if(d.id == 'd-overstage') str += dark_energy_reward(d);
  else if(d.id == 'd-unlimitted') str += d_unlimitted_handle(d);
  else if(d.id == 'd-noBuffs') str += d_buffs_handle(d);
  else if(d.id == 'd-danger') str += d_danger_reward_handle(d);
  else if(d.id == 'd-noSpace') str += d_noSpace_reward_handle(d);
  else if(d.id == 'd-damage') str += d_damage_reward_handle(d);
  else str += `<span style="color: #9cedd2">Reward: ${d.r}</span><br>`;

  if(d.debuff !== '') str += `<span style="color: #e74c61">Dimension Intervention: ${d.debuff}</span><br>`;


  if(d.id == hero.value.dId) str += `<span style="color: green">[You are here now]</span><br>`
  if(hero.value.isSingularity) str += `<span style="color: #66ffcc">You are in Singularity right now</span><br>`

  return str;
}

function dark_dimensions_handle(){
  return `Enter the Dark Side of the Dimensions. 
  The Dark Dimensions have an unlimited Infinity Cap, but you must reach [Total Level] 1400 to unlock the next tier. 
  Each subsequent Infinity Tier is more challenging than the previous one. 
  Infinity Penalty Reduction does not apply across these dimensions. 
  The dimensions are linked: each next dimension inherits a portion of the power from the previous one.<br>`
}

const bhReq = [1, 3, 8, 30, 100, 250, 1000, 100, 100, 100, 100];
function bhChallenge() {
  let str = ``;
  
  const tier = hero.value.bhTier;

  if(hero.value.transcendence >= bhReq[tier])
    hero.value.isBhBoss = true;

  if (!hero.value.isBhBoss) {
    str += `<span style="color: #a3ffe0">Reach transcendence ${bhReq[tier]}, to enter the Black Hole</span><br>`;
    if (tier === 0) {
      str += `<span style="color: yellow">Reach 70,000 True Level in main dimension</span>`;
    }
    return str;
  }

  

 
  str += `<span style="color: cyan; font-weight: bold">Black Hole [T${tier}]</span><br><br>`;

  str += `<span style="color: #cccccc">
      Dive into the darkness of the Black Hole ruled by <span style="color: cyan">[D-Gravity]</span> to face the 
      <span style="color: cyan">Singulars</span>. 
      Each of their attacks is stronger than the previous. 
      When you die, your <span style="color: cyan">transcendence</span> will be destroyed, 
      and you will return to the main dimension.
  </span><br><br>`;

  const baseRewards = [
    `<span style="color: rgb(111, 245, 200)">+75 Singularity Levels</span>`,
    `<span style="color: gold">+0.05 IP MULT</span>`,
    `<span style="color: lightblue">Lever Rush & Stage Rush: +5%</span>`,
  ];

  const uniqueRewards = {
    0: `<span style="color: red">BUFF: Black Impulse [T1]</span><br>
        <span style="color: lime">+0.1 Max Level MULT</span> per each <span style="color: cyan">transcendence</span>
        <span style="color: gold">You start with 10m stardust</span>`,
    1: `<span style="color: red">BUFF: Black Impulse [T2]</span><br> 
        <span style="color: lime">+1.05</span> <span style="color: red">DMG</span> MULT per each <span style="color: cyan">transcendence</span>
        <span style="color: gold">Unlock Auto-Forge</span>`,
    2: `<span style="color: red">BUFF: Black Impulse [T3]</span><br> 
        <span style="color: lightgreen">+1 MIN LEVEL per each <span style="color: cyan">transcendence</span></span>
        <span style="color: gold">Unlock Space-INF</span>`,
    3: `<span style="color: red">BUFF: Black Impulse [T4]</span><br> 
        <span style="color: lime">+0.005</span> <span style="color: orange">IP MULT</span> per each <span style="color: cyan">transcendence</span><br> 
        <span style="color: gold">Unlock Timeline</span>`
  };

  str += `<span style="color: #a3ffe0">Rewards:</span><br>`;
  [...baseRewards, uniqueRewards[tier]].forEach(r => {
    str += `${r}<br>`;
  });

  return str;
}

function advanceBH() {
  let text = `<span style="color: gold">Timeline</span><br><br>
  Journey into the past, to the era of the ancient titans. Master the laws of existence and open new paths to power.<br><br>

  <span style="color: red">This feature will be unlocked in the update 0.6 [Dimensional Merge]</span>
  `;

  return text;
}

function dTime(){
  if (hero.value.dTimeReward > 0) {
    const time = hero.value.dTimeReward;
    const speedMult = time <= 60 ? 2 : 1;

    const afkPercent = Math.max(Math.min((15 / Math.log(Math.max(time, 3))) * speedMult, 10), 1);
    const afkDuration = Math.min((7.5 / Math.sqrt(Math.max(time, 3))) * speedMult, 5);

    return `Reward: Each ${Math.round(100 / afkPercent)} killed enemy grants the AFK boost for ${afkDuration.toFixed(1)}s<br>`;
  } else {
    return `Reward: 0% to get AFK boost for 0s<br>`;
  }
}

function timeFormat(t) {
  if (isNaN(t) || t == null) return '00:00';

  const sec = Math.floor(t % 60).toString().padStart(2, '0');
  const min = Math.floor((t / 60) % 60).toString().padStart(2, '0');
  const hr  = Math.floor((t / 3600) % 24).toString().padStart(2, '0');
  const days = Math.floor(t / 86400);

  if (days > 0) {
    return `${days}d ${hr}:${min}:${sec}`;
  } else if (hr !== '00') {
    return `${hr}:${min}:${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}

function unlimittedDescription(){
  let infBonus = Math.floor((hero.value.unlimitLevel - 1000) / 500);
  infBonus = Math.max(0, infBonus);

  let expBoost = Math.max(Math.max(hero.value.unlimitLevel - 700, 0) / 100, 1);

  let unlimitD = `
  <span>
  Exp boost ${expBoost.toFixed(2)} - 
  Max Level MULT ${(hero.value.unlimitMaxLevel).toFixed(2)} - 
  MIN Level ${hero.value.unlimitMinLevel}
  </span><br>
  </span><br><span>Max Level: ${hero.value.unlimitLevel}</span>/<span>[${hero.value.unlimitLevelMax}]</span><br>
  <span>Reach Level ${1500 + 500 * infBonus} to get a Bonus to Infinite EXP in this Dimension by ${formatNumber((infBonus * 5 + 1) ** 1.5)}</span><br>
  <span>Reach Level 2000 to unlock new Infinity Goal</span><br>
  `

  return unlimitD;
}

function d_buffs_handle(d) {
  let buffTiers = [1, 4, 6, 8, 12, 16, 20, 25];
  let maxCount = 7;
  let count = Math.min(getBuffIntervalPosition(buffTiers, d.infTier), maxCount);

  const wrap = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;

  switch(count) {
    case 1: return wrap(`Reach Infinity [T1] to unlock Juggernaut [T4]`);
    case 2: return wrap(`Reach Infinity [T4] to unlock Berserk [T4]`);
    case 3: return wrap(`Reach Infinity [T6] to unlock First Strike [T4]`);
    case 4: return wrap(`Reach Infinity [T8] to unlock Traveller [T4]`);
    case 5: return wrap(`Reach Infinity [T12] to unlock Flexible [T4]`);
    case 6: return wrap(`Reach Infinity [T16] to unlock Flash [T4]`);
    default: return wrap(`All possible buffs are taken.`);
  }
}

function getBuffIntervalPosition(arr, num) {
    if (num <= 0) return 1; 
  
    let pos = 1;
    for (let i = 0; i < arr.length; i++) {
      if (num >= arr[i]) {
        pos = i + 2; 
      } else {
        break;
      }
    }
    return pos;
}

function d_danger_des_handle(d) {
  let danger = 1000 + 500 * d.infTier;
  let stage = 100 + 10 * d.infTier;

  return `
    Enter the dimension where <span style='color: orange'>[D-Space]</span> stays its presence within <span style='color: orange'>Dimension Colossuses</span>. 
    You will encounter this entity in Stage <span style='color: gold'>[${stage}+]</span>, Danger <span style='color: gold'>[${danger}+]</span>. 
    Defeat it to unlock the path to the next Infinity Tier and awaken a new dimension dark creature.
    <br><br>
  `
}

function d_danger_reward_handle(d) {
  let warp = (text) => `<span style="color:#9cedd2">Dark Creature: <span style="color:red">${text}</span><br> | 
  Danger Power is weaker by [^${1 - 0.01 *d.infTier}] | Increase The cap of Dark Creatures</span><br>`;

  switch(d.infTier){
    case 0: return warp('Dreadfang');
    case 1: return warp('Voidborn Might');
    case 2: return warp('Overseer Prime');
    case 3: return warp('Baselurker');
    case 4: return warp('Infinity Bane');
    case 5: return warp('Crushdepth');
    default: return warp('All Dark Creatures are found.');
  }
}

function d_unlimitted_handle(d) {
  let current = Math.floor(3000 + (12 * d.infTier) ** 1.25);
  let next = Math.floor(3000 + (12 * (d.infTier + 1)) ** 1.25);
  let expMult = Math.max((Math.E * d.infTier) ** 0.6, 1);

  let text = `
    Reward: Weakens <span style='color: rgb(255, 88, 88)'>[D-Ultimatum]</span> 
    <span style='color: gold'>[T${d.infTier}]</span>
    <span style='color: rgb(204, 102, 255)'>${current}</span> 
    -> <span style='color: gold'>[T${d.infTier + 1}]</span>
    <span style='color: rgb(204, 102, 255)'>${next}</span><br>
    
    EXP MULT for dimension [5] [S5-Ω3t]: 
    <span style='color: rgb(204, 102, 255)'>${expMult.toFixed(2)}</span>
  `;

  if (d.infTier < 10) {
    text += `Reach <span style="color: gold">Infinity [T10]</span> to unlock new feature`;
  } else {
    text += `Min Level in dimension [5] [S5-Ω3t] scales better with Infinity Tier`;
  }

  return `<br><span style="color: #9cedd2">${text}</span><br>`;
}


function d_noSpace_des_hanlde(d) {
  const base = d.d; 
  const required = 6 + (d.infTier * 6);

  return base.replace(/\d+\s+Celestials?/, `${required} Celestials`) + `<br><br>`;
}

function d_noSpace_reward_handle(d) {
  const base = d.r; 
  const weaker = (1 - 0.01 * d.infTier).toFixed(2);     
  const stardust = Math.max((Math.E * d.infTier) ** 0.45, 1).toFixed(2);  

  let warp = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;

  return warp(base
    .replace(/\[\^1\]/, `[^${weaker}]`)
    .replace(/\[1\]/, `[${stardust}]`));
}

function dark_energy_reward(d){
  let text = ``;

  let percent = d.infTier;
   let totalInfs = d_data.value.filter(d => d.id.startsWith('d-')) .reduce((sum, d) => sum + d.infTier, 0) - 
      d_data.value[29].infTier;
      totalInfs = Math.max(totalInfs, 0);

  if(d.infTier < 10)
    text += `Reach <span style="color: gold">Infinity [T10]</span> to unlock new influence of Dark Energy<br>`;
  else text += `Dark Energy is gathering the power of infinities from all dark dimensions and empowers itself with <span style="color: gold">${percent}%</span> of the total 
  <span style="color: gold">infinities [${totalInfs}]</span>. This effect increases with each Infinity Tier<br>`;

  text += `<span style="color: #9cedd2">Reward: Max Level [^${(enemy.value.darkEnergy.deTotal).toFixed(4)}]</span><br>`

  return text;
}

function d_damage_reward_handle(d){
  let text = ``;
  if(d.infTier >= 20)
    text = `You have a 50% chance not to receive a stack of <span style="color: red">doom</span> when hit.<br><br>`;
  else if(d.infTier >= 10)
    text = `You have a 25% chance not to receive a stack of <span style="color: red">doom</span> when hit.<br>
    Reach <span style="color: gold">Infninity [T20]</span> to unlock new feature<br><br>`;
  else text = `Reach <span style="color: gold">Infninity [T10]</span> to unlock new feature<br><br>`;


  let warp = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;

  return text + warp(d.r);
}


function d_req(d){
  if(d.id == 'bh') {
    if(!hero.value.isBhBoss) return true;
  }

  if(d.id == 'advanceBH')
    return true;

  if (d.id === 'ascension') {
    if (hero.value.mainInfTier < 10) return true;
  }

  if (d.id === 'gravity') {
    if (hero.value.mainInfTier < 7) return true;
  }

  if (d.id === 'survival') {
    if (hero.value.mainInfTier < 8) return true;
  }

  if (d.id === 'unlimitted') {
    const prev = d_data.value.find(dim => dim.id === 'noTree');
    if (prev.infTier < 12 || hero.value.mainInfTier < 12) return true;
  }

  if (d.id === 'noTree') {
    const prev = d_data.value.find(dim => dim.id === 'survival');
    if (prev.infTier < 5 || hero.value.mainInfTier < 10) return true;
  }

  if (d.id === 'afk') {
    const prev = d_data.value.find(dim => dim.id === 'noTree');
    if (prev.infTier < 11 || hero.value.mainInfTier < 10) return true;
  }

  if (d.id === 'noEq') {
    const prev = d_data.value.find(dim => dim.id === 'noTree');
    if (prev.infTier < 13 || hero.value.mainInfTier < 15) return true;
  }

  if (d.id === 'overkill') {
    const prev = d_data.value.find(dim => dim.id === 'gravity');
    if (prev.infTier < 5) return true;
  }

  if (d.id === 'next') {
    const prev = d_data.value.find(dim => dim.id === 'noTree');
    if (prev.infTier < 15 || hero.value.mainInfTier < 16) return true;
  }

  if (d.id === 'noStats') {
    const prev = d_data.value.find(dim => dim.id === 'next');
    if (prev.infTier < 7 || hero.value.mainInfTier < 17) return true;
  }

  if (d.id === 'noMinLevel') {
    const prev = d_data.value.find(dim => dim.id === 'noStats');
    if (prev.infTier < 15 || hero.value.mainInfTier < 19) return true;
  }

  if (d.id === 'time') {
    const prev = d_data.value.find(dim => dim.id === 'next');
    const prev1 = d_data.value.find(dim => dim.id === 'noTree');
    if (prev.infTier < 7 || prev1.infTier < 15 || hero.value.mainInfTier < 20) return true;
  }

  if (d.id === 'noBuffs') {
    const prev = d_data.value.find(dim => dim.id === 'next');
    if (prev.infTier < 7 || hero.value.mainInfTier < 18) return true;
  }

  if (d.id === 'soulD') {
    const prev = d_data.value.find(dim => dim.id === 'noBuffs');
    if (prev.infTier < 15 || hero.value.mainInfTier < 22) return true;
  }

  if (d.id === 'danger') {
    const prev = d_data.value.find(dim => dim.id === 'noBuffs');
    if (prev.infTier < 12 || hero.value.mainInfTier < 21) return true;
  }

   if (d.id === 'ascension-2') {
    const prev = d_data.value.find(dim => dim.id === 'ascension');
    if (prev.infTier < 15) return true;
  }

  if (d.id === 'noSpace') {
    const prev = d_data.value.find(dim => dim.id === 'noEq');
    if (prev.infTier < 10) return true;
  }

  if (d.id === 'damage') {
    const prev = d_data.value.find(dim => dim.id === 'danger');
    if (prev.infTier < 20 || hero.value.mainInfTier < 23) return true;
  }

   if (d.id === 'survival-2') {
    const prev = d_data.value.find(dim => dim.id === 'overstage');
    if (prev.infTier < 25) return true;
  }

  if (d.id === 'overstage') {
    const prev = d_data.value.find(dim => dim.id === 'damage');
    if (prev.infTier < 25) return true;
  }

  if (d.id === 'abyss-d') {
    const prev = d_data.value.find(dim => dim.id === 'danger');
    if (prev.infTier < 25 || hero.value.mainInfTier < 25 || hero.value.rebirthPts < 1.5e6) return true;
  }

   if (d.id === 'hard') {
    const prev = d_data.value.find(dim => dim.id === 'damage');
    if (prev.infTier < 21) return true;
  }

  if (d.id === 'corruption') {
    const prev = d_data.value.find(dim => dim.id === 'damage');
    if (prev.infTier < 30 || hero.value.mainInfTier < 30) return true;
  }

  if (d.id === 'eternity') {
    const prev1 = d_data.value.find(dim => dim.id === 'corruption');
    const prev2 = d_data.value.find(dim => dim.id === 'hard');
    if (prev1.infTier < 35 || prev2.infTier < 25 || hero.value.mainInfTier < 35) return true;
  }


  if (d.id === 'd-corruption') {
    if(hero.value.mainInfTier < 35) return true;
  }

  if (d.id === 'd-hard') {
    if(hero.value.mainInfTier < 35) return true;
  }

  if (d.id === 'd-damage') {
    if(hero.value.mainInfTier < 36) return true;
  }

  if (d.id === 'd-overstage') {
    if(hero.value.mainInfTier < 40) return true;
  }

  if (d.id === 'd-survival-2') {
    if(hero.value.mainInfTier < 42) return true;
  }

  if (d.id === 'd-danger') {
    if(hero.value.mainInfTier < 38) return true;
  }

  if (d.id === 'd-noBuffs') {
    if(hero.value.mainInfTier < 39) return true;
  }

  if (d.id === 'd-noMinLevel') {
    if(hero.value.mainInfTier < 60) return true;
  }

  if (d.id === 'd-next') {
    if(hero.value.mainInfTier < 42) return true;
  }

  if (d.id === 'd-noTree') {
    if(hero.value.mainInfTier < 45) return true;
  }

  if (d.id === 'd-noEq') {
    if(hero.value.mainInfTier < 50) return true;
  }

  if (d.id === 'd-noSpace') {
    if(hero.value.mainInfTier < 55) return true;
  }

  if (d.id === 'd-unlimitted') {
    if(hero.value.mainInfTier < 53) return true;
  }

  if (d.id === 'd-noAps') {
    if(hero.value.mainInfTier < 48) return true;
  }

  if (d.id === 'radiation') {
    if (hero.value.mainInfTier < 40) return true;
  }

  if (d.id === 'noMaxLevel') {
    if (hero.value.mainInfTier < 50) return true;
  }

  if (d.id === 'dimMerge') {
    return true;
  }

  

  return false;
}

function performD(d, prev) {
  hero.value.perform = true;
  
  hero.value.dKills = 0;
  hero.value.eLevel = 1;
  hero.value.exp = 0;
  hero.value.stage = 1 + (hero.value.dId == 'overstage'? 100 + 5 * (d_data.value[19].infTier - 20) - hero.value.minStage: 0) + 
  hero.value.minStage;
  
  hero.value.maxLevel = 30;
  hero.value.zone = 1;
  hero.value.kills = 0;
  hero.value.killsPerZone = 5;
  hero.value.nextLevelExp = 100;

  enemy.value.soulBuff.chance = 0;

  hero.value.treeTier = 0;
  hero.value.perkPoints = 0 + hero.value.freeTreePoints;

  hero.value.eqDrop['sword'] = 0;
  hero.value.eqDrop['armor'] = 0;
  hero.value.eqDrop['boots'] = 0;
  hero.value.eqDrop['ring'] = 0;

  hero.value.lacrimose = 0;

  hero.value.activeBuffs = [];
  hero.value.spActiveBuffs = [];
  hero.value.stardust = 0 + (hero.value.bhTier >= 1? 1e7: 0);
  hero.value.spCount = 0;
  hero.value.spsCount = 0;
  hero.value.sp = 0;
  hero.value.st = 0;

  hero.value.formationTypes[0].status = false;
  hero.value.formationTypes[1].status = false;
  hero.value.formationTypes[2].status = false;
  hero.value.formationTypes[3].status = false;
  hero.value.activeFormation = null;

  hero.value.totalRebirthPts = 0;
  hero.value.rebirthPts = (hero.value.singularity < 8? 0: 1e5 + Math.log(hero.value.singularityKills + 3) ** 7.26);
  hero.value.cursedBonusExp = 0;
  hero.value.cursedBonus = 0;
  hero.value.rebirthTier = 0;

  hero.value.activeCurse = [];
  hero.value.activeCuseTier = [];
  hero.value.curse = 0;
  hero.value.souls = 0;
  hero.value.soulTier = 0;
  hero.value.soulsCap = 20 + (hero.value.rebirthPts >= 2.5e5? 10: 0) + 
  (hero.value.rebirthPts >= 5.5e5? 10: 0)
  hero.value.soulsMax = 0;
  hero.value.maxBuffs = 1;
  hero.value.ascendShardPerform = 0;
  hero.value.ascensionShards = 0;
  hero.value.totalAscensionShards = 0;
  hero.value.abyssTier = 0 + (hero.value.rebirthPts >= 2.5e5? 1: 0) + 
  (hero.value.rebirthPts >= 5.5e5? 1: 0) + (hero.value.rebirthPts >= 1.5e6? 1: 0);
  hero.value.isAbyss = (hero.value.dId == 'abyss-d'? true: false);

  hero.value.spaceFight = false;
  hero.value.isSpaceBuff = false;

  hero.value.equipmentTiers['spRing'] = 0;
  hero.value.eqTierReq['spRing'] = 0;

  hero.value.eqUps['sword'] = 0;
  hero.value.eqUps['armor'] = 0;
  hero.value.eqUps['boots'] = 0;
  hero.value.eqUps['ring'] = 0;
  hero.value.eqUps['spRing'] = 0;

  for(let idx in radPerks){
    radPerks[idx].level = 0;
  }
  radPerks[6].status = false;
  radPerks[6].baseCost = 2500;
  radPerks[6].description = 'REBUILD REBIRTH SYSTEM THAT ALLOWS YOU TO SPEND MUTAGEN TO UP YOUR POTENTIAL';
  radPerks[6].max = 1;

  radPerks[10].status = false;
  radPerks[10].max = 1;

  for(let sp of spEnemy){
    if(sp.id%6 == 0){
      sp.status = false;
    }
  }  

  for(let perk of ascension){
    if(perk.tier != 6 && perk.tier != 7 && perk.tier != 8)
      perk.level = 0;
  }
  
  amulets[0].status = false;
  amulets[1].status = false;
  amulets[2].status = false;
  amulets[3].status = false;

  amulets[0].suffix.status = false
  amulets[1].suffix.status = false
  amulets[2].suffix.status = false
  amulets[3].suffix.status = false

  amulets[0].prefix.status = false
  amulets[1].prefix.status = false
  amulets[2].prefix.status = false
  amulets[3].prefix.status = false


  cursed[7].status = false;
  cursed[8].status = false;
  cursed[9].status = false;
  cursed[10].status = false;
  cursed[11].status = false;
  cursed[12].status = false; 

   for(let buff of buffs.value){
        if(buff.id == 6) continue;
        buff.exp = 0;
        buff.tier = 1;
        buff.maxTier = 3;
        buff.active = false;
  }
  

  for (let perk of tperks.value){
    perk.level = 0;
    if(perk.status !== 'undefined')
      perk.status = false;
    if(perk.infStatus !== 'undefined')
      perk.infStatus = false;
  }

  buffs.value[0].ptr = 0;
  buffs.value[0].def = 1;

  buffs.value[1].used = false;
  buffs.value[1].usedSkill = false;
  buffs.value[1].stun = 0;

  buffs.value[2].combo = 0;

  buffs.value[4].time = 0;

  buffs.value[5].debuff = 0;
  buffs.value[5].stuck = 0;

  buffs.value[8].time = 0;

  buffs.value[10].rise = 1;
  buffs.value[10].buffT2 = 0
  buffs.value[10].buffT3 = 0;
  buffs.value[10].buffT3HP = 0;

  buffs.value[12].dmg = 1;
  buffs.value[12].crit = 0;
  buffs.value[12].critDmg = 0;

  enemy.value.ascensionSoul.stats = 1;
  enemy.value.ascensionSoul.active = false;

  enemy.value.rebirthSoul = false;
  enemy.value.danger = 0;
  enemy.value.enemyPower = 1;
  enemy.value.spaceBossChance = 0;
  enemy.value.isSpaceFight = 0;
  enemy.value.dangerEnemyChance = [0, 0, 0, 0, 0, 0];
  enemy.value.spawnType = 'none';
  enemy.value.soulBuff.active = false;
  enemy.value.boss.isBoss = false; 

  hero.value.maxStage = 1;
  hero.value.souls = 0;
  hero.value.mutagen = (hero.value.mainInfTier >= 35 && hero.value.dId != 'bh'? 1e4: 0);
  hero.value.mutations = 0;

  const notAllowedIds = ['main', 'unlimitted'];
  hero.value.infProgress = notAllowedIds.includes(hero.value.dId);

  hero.value.autoTreeCooldown = 3;
  enemy.value.weakStack = 0;
  enemy.value.rebirthEnemy["drop"] = 1;

  hero.value.survivalLevel = 0;
  hero.value.windowUpdate = true;
  tperks.value[0].kills = 0;

  hero.value.shardsMult = 0;
  hero.value.shardsPerformMult = 0;
  hero.value.travellPenalty = 1;
  hero.value.isTravell = false;

  hero.value.afkSoulBoost = 1;
  hero.value.soulD = false;

  hero.value.damageStage = 0;
  enemy.value.d_damagePenalty = 0;
  enemy.value.soulBuff.soulsStardustReq = 0;
  enemy.value.soulBuff.soulsMutagenReq = 0;
  
  hero.value.survivalLife = d_data.value[30].infTier;

  if(hero.value.gcnpSetting){
      hero.value.isLocked = true;
      hero.value.isStage = false;
    } else {
      hero.value.isLocked = false;
      hero.value.isStage = true;
    }
    
  hero.value.spaceUnlocked = (hero.value.abyssTier < 3 && hero.value.rebirthPts < 1e5? false: true);
  hero.value.hp = hero.value.maxHp;
}

function randomStarStyle() {
  const x = Math.random() * window.innerWidth
  const y = Math.random() * window.innerHeight
  const duration = 1 + Math.random() * 3
  return {
    left: `${x}px`,
    top: `${y}px`,
    animationDuration: `${duration}s`
  }
}

const stars = Array.from({ length: 100 }, () => randomStarStyle())

function formatNumber(num, f = false) {
  if (num < 10 && f) return num.toFixed(2);
  if (num < 1000) return Math.floor(num).toString();

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}
</script>

<style scoped>
.atlas-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 85vh; 
  background: radial-gradient(ellipse at center, #0b0f1a 0%, #000000 100%);
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
  cursor: grab;
  margin-left: 120px;
}

.atlas-map {
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: twinkle 2s infinite ease-in-out;
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
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 6px 10px;
  font-size: 0.875rem;
  text-align: center;
  max-width: 280px;
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 0 6px #000;
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
  right: 220px;
}

.reset-button-bh{
 right: 100px;
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

.dimension-search.small {
  width: 180px;
  padding: 0.3em 0.6em;
  font-size: 0.8em;
}

.dimension-grid-wrapper {
  max-height: 80vh;
  overflow-y: auto;
  padding: 1em;
}

.dimension-grid-wrapper {
  height: 100vh;
  overflow-y: auto;
  background: #0e0e17;
  padding: 1em;
  box-sizing: border-box;
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1em;
}

.dimension-card {
  background: #1c1c25;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1em;
  color: #f0f0f0;
  box-shadow: 0 0 6px #0008;
  transition: transform 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 25vh;
  overflow: hidden;
}

.dimension-card:hover {
  background: #29293d;
  transform: scale(1.02);
}

.dimension-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0.5em;
  align-self: center;
}

.dim-description-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  font-size: 0.8em;
  opacity: 0.85;
}

.dim-description-scroll::-webkit-scrollbar {
  width: 4px;
}
.dim-description-scroll::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.enter-button {
  margin-top: 0.5em;
  padding: 0.4em;
  width: 100%; /* на всю ширину */
  background: #444cf7;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.85em;
  cursor: pointer;
  transition: background 0.2s;
}

.enter-button:hover {
  background: #626bff;
}

button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
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


</style>
