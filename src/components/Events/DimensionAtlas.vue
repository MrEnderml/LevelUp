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
    <button class="reset-button" @click="resetView('main')">
      🌍 main
    </button>
    <button v-if="hero.rebirthPts >= 1e7" class="reset-button reset-button-bh" @click="resetView('bh')">
      🌑 Black Hole
    </button>

    <svg class="atlas-map" :viewBox="viewBox">
      <line
        v-for="link in fLinks"
        :key="link.id"
        :x1="getPos(link.from).x"
        :y1="getPos(link.from).y"
        :x2="getPos(link.to).x"
        :y2="getPos(link.to).y"
        :stroke="!d_req(getDimension(link.to)) ? '#66ffcc' : '#444'"
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
          :r="30"
          fill="transparent"
          pointer-events="visible"
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

const dimensions = ref([
  { id: 'main', name: '🌍', x: 400, y: 300, color: '#4caf50', status: true },
  { id: 'gravity',svg: getSvgIconHTML('galaxy1', '2em'), x: 600, y: 200, color: '#e53935', status: true },
  { id: 'survival', svg: getSvgIconHTML('galaxy2', '2em'), x: 200, y: 200, color: '#2196f3', status: true },
  { id: 'ascension', svg: getSvgIconHTML('galaxy3', '2em'), x: 400, y: 400, color: '#673ab7', status: true },
  { id: 'overkill', svg: getSvgIconHTML('galaxy4', '2em'), x: 800, y: 300, color: '#f4a261', status: true},
  { id: 'noTree', svg: getSvgIconHTML('galaxy5', '2em'), x: 300, y: -50, color: '#90caf9', status: true},
  { id: 'noEq', svg: getSvgIconHTML('galaxy6', '2em'), x: 150, y: 50, color: '#90caf9', status: true},
  { id: 'unlimitted', svg: getSvgIconHTML('galaxy7', '2em'), x: -50, y: 50, color: '#90caf9', status: true },
  { id: 'afk', svg: getSvgIconHTML('galaxy8', '2em'), x: 450, y: 50, color: '#90caf9', status: true},
  { id: 'next', svg: getSvgIconHTML('galaxy9', '2em'), x: 400, y: -150, color: '#90caf9', status: true },
  { id: 'time', svg: getSvgIconHTML('galaxy3', '2em'), x: 400, y: -250, color: '#90caf9', status: true },
  { id: 'noStats', svg: getSvgIconHTML('galaxy2', '2em'), x: 250, y: -250, color: '#90caf9', status: true },
  { id: 'noMinLevel', svg: getSvgIconHTML('galaxy7', '2em'), x: 50, y: -250, color: '#90caf9', status: true },
  { id: 'noBuffs', svg: getSvgIconHTML('galaxy10', '2em'), x: 500, y: -150, color: '#90caf9', status: true },
  { id: 'danger', svg: getSvgIconHTML('galaxy14', '2em'), x: 700, y: -250, color: '#90caf9', status: true },
  { id: 'damage', svg: getSvgIconHTML('galaxy1', '2em'), x: 650, y: -400, color: '#90caf9', status: true },
  { id: 'overstage', svg: getSvgIconHTML('galaxy17', '2em'), x: 750, y: -550, color: '#90caf9', status: true },
  { id: 'survival-2', svg: getSvgIconHTML('galaxy3', '2em'), x: 850, y: -550, color: '#90caf9', status: true },
  { id: 'soulD', svg: getSvgIconHTML('galaxy13', '2em'), x: 850, y: 50, color: '#90caf9', status: true },
  { id: 'ascension-2', svg: getSvgIconHTML('galaxy15', '2em'), x: 400, y: 500, color: '#90caf9', status: true },
  { id: 'noSpace', svg: getSvgIconHTML('galaxy18', '2em'), x: 150, y: 125, color: '#90caf9', status: true },
  { id: 'corruption', svg: getSvgIconHTML('galaxy3', '2em'), x: 500, y: -500, color: '#90caf9', status: true },
  { id: 'hard', svg: getSvgIconHTML('galaxy12', '2em'), x: 500, y: -350, color: '#90caf9', status: true },
  { id: 'eternity', svg: getSvgIconHTML('galaxyEternity', '2em'), x: 300, y: -450, color: '#90caf9', status: true },
  { id: 'abyss-d', svg: getSvgIconHTML('galaxy5', '2em'), x: 600, y: -250, color: '#90caf9', status: true },
  { id: 'bh', svg: getSvgIconHTML('singularity', '2em'), x: -600, y: 50, color: '#90caf9', status: hero.value.rebirthPts >= 1e7 },
])

const links = ref([
  { id: 1, from: 'main', to: 'gravity', status: true },
  { id: 2, from: 'main', to: 'survival', status: true },
  { id: 3, from: 'main', to: 'ascension', status: true },
  { id: 4, from: 'gravity', to: 'overkill', status: true },
  { id: 5, from: 'survival', to: 'noTree', status: true },
  { id: 6, from: 'noTree', to: 'noEq', status: true },
  { id: 7, from: 'noTree', to: 'unlimitted', status: true },
  { id: 8, from: 'noTree', to: 'afk', status: true },
  { id: 9, from: 'noTree', to: 'next', status: true },
  { id: 10, from: 'next', to: 'noStats', status: true },
  { id: 11, from: 'next', to: 'noBuffs', status: true },
  { id: 12, from: 'next', to: 'time', status: true },
  { id: 13, from: 'noBuffs', to: 'danger', status: true },
  { id: 14, from: 'danger', to: 'damage', status: true },
  { id: 15, from: 'noBuffs', to: 'soulD', status: true },
  { id: 16, from: 'ascension', to: 'ascension-2', status: true },
  { id: 17, from: 'noEq', to: 'noSpace', status: true },
  { id: 18, from: 'damage', to: 'overstage', status: true },
  { id: 19, from: 'overstage', to: 'survival-2', status: true },
  { id: 20, from: 'damage', to: 'corruption', status: true },
  { id: 21, from: 'damage', to: 'hard', status: true },
  { id: 20, from: 'corruption', to: 'eternity', status: true },
  { id: 21, from: 'hard', to: 'eternity', status: true },
  { id: 22, from: 'danger', to: 'abyss-d', status: true },
  { id: 23, from: 'main', to: 'bh', status: false },
  { id: 24, from: 'noStats', to: 'noMinLevel', status: true },
])

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

const getPos = (id) => dimensions.value.find(d => d.id === id)

const selectDimension = (dimension) => {
  const id = dimension.id;
  const newD = d_data.value.find(ds => ds.id === id);
  const currentD = d_data.value.find(ds => ds.id === hero.value.dId);

  hero.value.dTimer = 0;
  killHistory.length = 0;

  if(hero.value.dId == newD.id && hero.value.dId !== 'time')
    return;

  if(d_req(newD))
    return;

  if (newD.id === 'ascension' || newD.id === 'ascension-2') {
    for (let perk in ascension) {
      newD.ascension[perk] = ascension[perk].level;
      ascension[perk].level = 0;
    }
  }

  if (currentD.id === 'ascension' || currentD.id === 'ascension-2') {
    for (let perk in ascension) {
      ascension[perk].level = currentD.ascension[perk] ?? 0;
    }
  }

  

  hero.value.infTier = newD.id === 'main'
    ? (hero.value.mainInfTier ?? 0)
    : newD.infTier;

  hero.value.dId = newD.id;

  performD(newD, currentD);
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

  let filtered = ['unlimitted', 'main', 'time', 'abyss-d', 'survival-2']
  let dInfFiltered = ['time', 'abyss-d', 'survival-2']

  if(d.id == 'unlimitted')
    d.r = unlimittedDescription();
  if(d.id == 'bh')
    return `Reach Level 10000`;

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
  else if(d.id == 'survival-2') str += `You will get double stats until Level(not includeing Min Level) ${Math.floor(hero.value.survivalStage ** 1.175)}<br>`
  else if(d.r != '') str += `Reward: <span>${d.r}</span><br>`;

  if(d.sp != '') str += `Special Reward: <span>${d.sp}</span><br>`;
  if(d.id == hero.value.dId) str += `<span style="color: green">[You are here now]</span><br>`

  if(d.id == 'time') str += `<br>Your best time ${timeFormat(hero.value.dTimeReward)}`

  return str;
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

  let unlimitD = `
  <span>
  Exp boost ${Math.max(Math.max(hero.value.unlimitLevel - 700, 0) / 100, 1).toFixed(2)} - 
  Max Level MULT ${((1.05 ** (Math.max(hero.value.unlimitLevel - 700, 0) / 75))).toFixed(2)} - 
  MIN Level ${Math.max(Math.floor((hero.value.unlimitLevel - 700) / 100 ), 0)}
  </span><br>
  </span><br><span>Max Level: ${hero.value.unlimitLevel}</span><br>
  <span>Reach Level ${1500 + 500 * infBonus} to get a Bonus to Infinite EXP in this Dimension by ${(1.75 ** (infBonus + 1)).toFixed(2)}</span><br>
  <span>Reach Level 2000 to unclock new Infinity Goal</span><br>
  `

  return unlimitD;
}

function d_req(d){
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
    if (prev1.infTier < 35 || prev2.infTier < 15 || hero.value.mainInfTier < 100) return true;
  }

  return false;
}

function performD(d, prev) {
  hero.value.perform = true;
  
  hero.value.dKills = 0;
  hero.value.eLevel = 1;
  hero.value.exp = 0;
  hero.value.stage = 1 + (hero.value.dId == 'overstage'? 100 + 5 * (d_data.value[19].infTier - 20): 0);
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
  hero.value.stardust = 0;
  hero.value.spCount = 0;
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

  hero.value.isSpaceAuto = false;
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

  radPerks[7].perkStatus = false;
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
  hero.value.mutagen = 0;
  hero.value.mutations = 0;

  const notAllowedIds = ['main', 'unlimitted'];
  hero.value.infProgress = notAllowedIds.includes(hero.value.dId);

  hero.value.treeAuto = false;
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

  if(hero.value.gcnpSetting){
      hero.value.isLocked = true;
      hero.value.isStage = false;
    } else {
      hero.value.isLocked = false;
      hero.value.isStage = true;
    }
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
  max-width: 220px;
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 0 6px #000;
}

.reset-button {
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

</style>
