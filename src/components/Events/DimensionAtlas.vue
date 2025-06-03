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
    <button class="reset-button" @click="resetView">
      🌍 main
    </button>

    <svg class="atlas-map" :viewBox="viewBox">
      <line
        v-for="link in links"
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
        v-for="dimension in dimensions"
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
  {
    id: 'blackhole',
    x: -600,
    y: 0,
    color: '#000000',
    radius: 64,
    label: 'Black Hole'
  },
  { id: 'singularity', x: 300, y: 100, color: '#cc66ff', radius: 12, glow: true, pulse: true, label: 'Singularity' },
  { id: 'satellite', x: 250, y: 250, orbit: true, label: 'Lost Satellite' },
  { id: 'void', x: 500, y: 300, color: '#00000088', radius: 20, label: 'Void' },
]

const dimensions = ref([
  { id: 'main', name: '🌍', x: 400, y: 300, color: '#4caf50', description: 'Основное измерение.' },
  { id: 'gravity',svg: getSvgIconHTML('galaxy1', '2em'), x: 600, y: 200, color: '#e53935', description: 'Огненное измерение.' },
  { id: 'survival', svg: getSvgIconHTML('galaxy2', '2em'), x: 200, y: 200, color: '#2196f3', description: 'Морозное измерение.' },
  { id: 'ascension', svg: getSvgIconHTML('galaxy3', '2em'), x: 400, y: 400, color: '#673ab7' },
  { id: 'overkill', svg: getSvgIconHTML('galaxy4', '2em'), x: 800, y: 300, color: '#f4a261', description: 'Древние дюны и ветра.' },
  { id: 'noTree', svg: getSvgIconHTML('galaxy5', '2em'), x: 300, y: -50, color: '#90caf9', description: 'Парящее измерение облаков - 1.' },
  { id: 'noEq', svg: getSvgIconHTML('galaxy6', '2em'), x: 150, y: 50, color: '#90caf9', description: 'Парящее измерение облаков. - 2' },
  { id: 'unlimitted', svg: getSvgIconHTML('galaxy7', '2em'), x: -50, y: 50, color: '#90caf9' },
  { id: 'afk', svg: getSvgIconHTML('galaxy8', '2em'), x: 450, y: 50, color: '#90caf9'},
  { id: 'next', svg: getSvgIconHTML('galaxy1', '2em'), x: 400, y: -150, color: '#90caf9' }
])

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
])

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

  if(hero.value.dId == newD.id)
    return;

  if(d_req(newD))
    return;

  if(currentD.id === 'main' && !hero.value.infProgress){
    hero.value.mainInfTier--;
  }

  if (newD.id === 'ascension') {
    for (let perk in ascension) {
      newD.ascension[perk] = ascension[perk].level;
      ascension[perk].level = 0;
    }
  }

  if (currentD.id === 'ascension') {
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

const resetView = () => {
  
  const main = getPos('main')
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

  let filtered = ['unlimitted', 'next', 'main']

  if(d.id == 'unlimitted')
    d.r = unlimittedDescription();

  let str = `<span><strong>Dimension: ${d.name}</strong></span><br>`
  str += `<span>${d.d}</span><br><br>`;
  if(d_req(d)) str += `<span style="color: red">${d.c}</span><br>`;
  if(!filtered.includes(d.id)) str += `<span style="color: gold">Infinity [T${d.infTier}]/[T${d.maxInfTier}]</span><br><br>`;
  if(d.id == 'main') str += `<span style="color: gold">Infinity [T${hero.value.mainInfTier}]</span><br><br>`
  if(d.r != '') str += `Reward: <span>${d.r}</span><br>`;
  if(d.sp != '') str += `Special Reward: <span>${d.sp}</span><br>`;
  if(d.id == hero.value.dId) str += `<span style="color: green">[You are here now]</span><br>`

  return str;
}

function unlimittedDescription(){
  let infBonus = Math.floor((hero.value.unlimitLevel - 1000) / 500);
  infBonus = Math.max(0, infBonus);

  let unlimitD = `
  <span>
  Exp boost ${Math.max(1 + (hero.value.unlimitLevel - 700) / 100, 1).toFixed(2)} - 
  Max Level MULT ${Math.max(1.05 ** ((hero.value.unlimitLevel - 700) / 75), 1).toFixed(2)} - 
  MIN Level ${Math.max(Math.floor((hero.value.unlimitLevel - 700) / 100 ), 0)}
  </span><br>
  </span><br><span>Max Level: ${hero.value.unlimitLevel}</span><br>
  <span>Reach Level ${1500 + 500 * infBonus} to get a Bonus to Infinite EXP in this Dimension by ${(1.75 ** (infBonus + 1)).toFixed(2)}</span><br>
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
    return true;
  }

  return false;
}

function performD(d, prev) {
  hero.value.perform = true;
  
  hero.value.eLevel = 1;
  hero.value.exp = 0;
  hero.value.stage = 1;
  hero.value.maxLevel = 30;
  hero.value.zone = 1;
  hero.value.kills = 0;
  hero.value.killsPerZone = 5;
  hero.value.nextLevelExp = 100;
  hero.value.totalRebirthPts = 0;

  enemy.value.soulBuff.chance = 0;

  hero.value.treeTier = 0;
  hero.value.perkPoints = 0 + hero.value.freeTreePoints;

  hero.value.eqDrop['sword'] = 0;
  hero.value.eqDrop['armor'] = 0;
  hero.value.eqDrop['boots'] = 0;
  hero.value.eqDrop['ring'] = 0;

  hero.value.lacrimose = 0;

  hero.value.afkSoulBoost = 1;
  hero.value.soulD = false;

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
  hero.value.rebirthPts = 0;
  hero.value.cursedBonusExp = 0;
  hero.value.cursedBonus = 0;
  hero.value.rebirthTier = 0;

  hero.value.activeCurse = [];
  hero.value.activeCuseTier = [];
  hero.value.curse = 0;
  hero.value.souls = 0;
  hero.value.soulTier = 0;
  hero.value.soulsCap = 20;
  hero.value.soulsMax = 0;
  hero.value.maxBuffs = 1;
  hero.value.ascendShardPerform = 0;
  hero.value.ascensionShards = 0;
  hero.value.totalAscensionShards = 0;
  hero.value.abyssTier = 0;
  hero.value.isAbyss = false;

  hero.value.isSpaceAuto = false;
  hero.value.soulD = false;
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
        if(perk.tier != 6 && perk.tier != 7)
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
</script>

<style scoped>
.atlas-container {
  position: relative;
  width: 100%;
  height: 600px;background: radial-gradient(ellipse at center, #0b0f1a 0%, #000000 100%);
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
  cursor: grab;
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

.atlas-map {
  width: 100%;
  height: 100%;
}

.dimension-circle {
  transition: transform 0.2s ease, filter 0.2s ease;
}
.dimension-circle:hover {
  filter: drop-shadow(0 0 6px white);
}

.tooltip {
  position: absolute;
  transform: translate(-50%, -130%);
  background-color: #111;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 0 8px #000;
  border: 1px solid #333;
  max-width: 220px;
  text-align: center;

  white-space: normal;      
  word-break: break-word;   
  overflow-wrap: break-word;
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
