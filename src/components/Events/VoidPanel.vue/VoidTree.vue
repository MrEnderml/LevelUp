<template>
    <div class="tree-container" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag" @dragstart.prevent>
        <svg class="atlas-map" :viewBox="hero.void.viewBox" @wheel.prevent="onWheel" @mousemove="onMouseMove">

            <line v-for="link in links" :key="link.id" :x1="getPos(link.from).x" :y1="getPos(link.from).y"
                :x2="getPos(link.to).x" :y2="getPos(link.to).y" :class="linkState(link)" stroke-width="2" />

            <g
            v-for="node in nodes"
            :key="node.id"
            class="atlas-node"
            :class="nodeState(node)"
            @mouseenter="hovered = node"
            @mouseleave="hovered = null"
            @click="buyNode(node)"
            >

            <rect
                :x="node.x - 24"
                :y="node.y - 24"
                width="48"
                height="48"
                rx="10"
                class="node-glow"
            />

            <rect
                :x="node.x - 20"
                :y="node.y - 20"
                width="40"
                height="40"
                rx="8"
                class="node-body"
            />

            <foreignObject
                :x="node.x - 12"
                :y="node.y - 12"
                width="24"
                height="24"
            >
                <div class="node-icon" v-html="node.icon"></div>
            </foreignObject>

            <text
              :x="node.x"
              :y="node.y + 32"
              text-anchor="middle"
              class="node-level"
            >
              {{ node.level }}/{{ node.maxLevel }}
            </text>

            </g>


        </svg>

        <div 
          v-if="hovered"
          class="void-tooltip"

          :style="{
              top: tooltip.y + 'px',
              left: tooltip.x + 'px',

              transform: `
                  translate(
                      ${tooltipTranslateX},
                      ${tooltipTranslateY}
                  )
                  scale(${tooltip.scale.toFixed(2)})
              `,

              transformOrigin: 'top left'
          }"
      >

          <!-- HEADER -->
          <div class="void-tooltip-block">
              <div class="void-tooltip-title">
                  {{ hovered.name }}
              </div>
              <div class="void-tooltip-tier">
                  Void  [T{{ hovered.voidTier }}]
              </div>
          </div>
          <!-- DESCRIPTION -->
          <div class="void-tooltip-block desc">
              {{ hovered.desc }}
          </div>
          <!-- REWARD -->
          <div
            v-if="hovered.type === 'cond'"
            class="void-tooltip-block"
          >
            <div
              class="void-tooltip-value"
              style="margin: 0 auto"
              :class="getReward(hovered) ? 'active-status' : 'inactive-status'"
            >
              {{ getReward(hovered) ? 'ACTIVE' : 'INACTIVE' }}
            </div>
          </div>

          <div v-else class="void-tooltip-block">
              <div class="void-tooltip-label">
                  {{ hovered.rewardLabel }}
              </div>
              <div class="void-tooltip-value">
                  {{ fn(getReward(hovered)) }}
              </div>
          </div>
           <!-- COST -->
          <div v-if="hovered.level < hovered.maxLevel" class="void-tooltip-block">

            <div class="void-tooltip-cost-wrap">
                <div 
                    class="void-tooltip-icon"
                    v-html="newicons.voidShard"
                ></div>
                <div class="void-tooltip-cost">
                    {{ fn(nodeCost(hovered)) }}
                </div>
            </div>

          </div>

        </div>

        <div class="tree-ui-panel">

          <div class="tree-ui-title">
            VOID RESOURCES
          </div>

          <div class="tree-ui-resource">
            <span class="resource-label">
              <span
                class="resource-icon"
                v-html="newicons['voidShard']"
              ></span>
              <span style="color: #b6ff00">Void Shards</span>
            </span>
            <strong>{{ fn(hero.void.totalShards) }}</strong>
          </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue"
import { useHero } from "../../../composables/useHero"
import { newicons } from "../../../composables/icons"
import { fn } from "../../../composables/utils/global"

import { nodes } from "../../../data/dims/voidNodes"
import { links } from "../../../data/dims/voidLinks"
import { useVoid } from "../../../composables/battleUtils/dims/useVoid"

const { 
  buyNode,
  unlockNodes,
  nodesReqCost,
  voidTreeEffects,
  rebuildTreeStats,
  nodeCost
} = useVoid();

const BASE = 800
const MIN_SIZE = 500
const MAX_SIZE = 4000
const ZOOM_SPEED = 0.15

const { hero } = useHero();

rebuildTreeStats();
unlockNodes();
nodesReqCost();

function nodeState(node) {
    
    if (node.level >= node.maxLevel)
      return 'bought'

    if(node.locked)
      return 'locked'

    if(node.canBuy)
      return 'available'

    if(node.noResources)
      return 'no-resources'
    
}

function getReward (node) {
  return voidTreeEffects(node)
}

function linkState(link) {

const from = nodes.value.find(n => n.id === link.from)
const to = nodes.value.find(n => n.id === link.to)

if(!from || !to)
    return 'link-locked'

    if(to.locked)
        return 'link-locked'

    return 'link-active'
}

const hovered = ref(null)
const isDragging = ref(false)
const last = ref({ x: 0, y: 0 })

const mouse = ref({ x: 0, y: 0 })

const tooltip = reactive({
  x: 0,
  y: 0,
  scale: 1
})



const getPos = (id) => nodes.value.find(n => n.id === id) || { x: 0, y: 0 }


const onMouseMove = (e) => {
    mouse.value.x = e.clientX
    mouse.value.y = e.clientY

    updateTooltipPosition();
}

const getTooltipSide = () => {
  const [x, y, w, h] = hero.value.void.viewBox.split(' ').map(Number)

  const horizontal =
    mouse.value.x > x + w * 0.6 ? 'left'
    : mouse.value.x < x + w * 0.4 ? 'right'
    : 'center'

  const vertical =
    mouse.value.y > y + h * 0.6 ? 'top'
    : mouse.value.y < y + h * 0.4 ? 'bottom'
    : 'center'

  return { horizontal, vertical }
}

const onWheel = (e) => {
    let [x, y, w, h] = hero.value.void.viewBox.split(" ").map(Number)

    const rect = e.currentTarget.getBoundingClientRect()

    const mx = ((e.clientX - rect.left) / rect.width) * w + x
    const my = ((e.clientY - rect.top) / rect.height) * h + y

    const direction = e.deltaY > 0 ? 1 : -1
    const factor = 1 + direction * ZOOM_SPEED

    const newW = w * factor
    const newH = h * factor

    if (newW < MIN_SIZE || newW > MAX_SIZE) return

    const dx = (mx - x) / w
    const dy = (my - y) / h

    x = mx - dx * newW
    y = my - dy * newH

    hero.value.void.viewBox = `${x} ${y} ${newW} ${newH}`
    hero.value.void.zoom = BASE / newW
}


const startDrag = (e) => {
    e.preventDefault()

    isDragging.value = true
    last.value = { x: e.clientX, y: e.clientY }
}


const onDrag = (e) => {
    if (!isDragging.value) return

    let [x, y, w, h] = hero.value.void.viewBox.split(" ").map(Number)

    const dx = (e.clientX - last.value.x) / hero.value.void.zoom;
    const dy = (e.clientY - last.value.y) / hero.value.void.zoom;

    hero.value.void.viewBox = `${x - dx} ${y - dy} ${w} ${h}`

    last.value = { x: e.clientX, y: e.clientY }
}

const TOOLTIP_OFFSET = 14

const updateTooltipPosition = () => {
  if (!hovered.value) return

  const { horizontal, vertical } = getTooltipSide()

  let x = mouse.value.x
  let y = mouse.value.y

  if (horizontal === 'right') x += TOOLTIP_OFFSET
  if (horizontal === 'left') x -= TOOLTIP_OFFSET

  if (vertical === 'bottom') y += TOOLTIP_OFFSET
  if (vertical === 'top') y -= TOOLTIP_OFFSET

  tooltip.x = x
  tooltip.y = y
  tooltip.scale = 1
}

const tooltipTranslateX = computed(() => {
  const { horizontal } = getTooltipSide()
  return horizontal === 'left' ? '-100%' : '0%'
})

const tooltipTranslateY = computed(() => {
  const { vertical } = getTooltipSide()
  return vertical === 'top' ? '-100%' : '0%'
})



const endDrag = () => {
    isDragging.value = false
}

const selectNode = (node) => {
    console.log("Selected:", node)
}
</script>

<style scoped>
.tree-container {
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
    width: 150px;
}

/* node */
.atlas-node {
  cursor: pointer;
  transition: 0.2s;
}

.node-body {
  fill: #101418;
  stroke-width: 2px;
}

.node-glow {
  fill: transparent;
  opacity: 0;
  transition: 0.2s;
}

.atlas-node.available .node-body {
  stroke: #66ff99;
}

.atlas-node.available .node-glow {
  opacity: 1;
  stroke: #66ff99;

  filter: drop-shadow(0 0 8px #66ff99);
}

.atlas-node.no-resources .node-body {
  stroke: #ff6666;
}

.atlas-node.no-resources .node-glow {
  opacity: 1;
  stroke: #ff4444;

  filter: drop-shadow(0 0 8px #ff4444);
}

.atlas-node.locked .node-body {
  stroke: #555;
  opacity: 0.45;
}

.atlas-node.inactive .node-body {
  stroke: #66ccff;
}

.atlas-node.bought .node-body {
  stroke: #ff66f7;
}


/* Links */
.atlas-link {
  stroke-width: 3;
  fill: none;

  transition:
    stroke 0.2s,
    filter 0.2s,
    opacity 0.2s;
}

.link-active {
  stroke: #ffffff;

  filter:
    drop-shadow(0 0 4px #66ccff);
}

.link-available {
  stroke: #66ff99;

  filter:
    drop-shadow(0 0 6px #66ff99);
}

.link-no-resources {
  stroke: #ff6666;

  filter:
    drop-shadow(0 0 6px #ff4444);
}

.link-locked {
  stroke: #444;
  opacity: 0.4;
}

/* icons */
.node-icon {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.node-icon svg {
  width: 100%;
  height: 100%;
}


.node-level {
  fill: #a5f3fc;

  font-size: 10px;
  font-weight: 700;

  pointer-events: none;
}

/* Tooltip */

.void-tooltip {
  position: fixed;
  z-index: 9999;

  width: 300px;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  padding: 0.7rem;

  border-radius: 16px;

  background:
    linear-gradient(
      180deg,
      rgba(20,10,30,0.98),
      rgba(10,5,18,0.98)
    );

  border: 1px solid rgba(168,85,247,0.14);

  backdrop-filter: blur(12px);

  box-shadow:
    0 0 20px rgba(168,85,247,0.12),
    inset 0 0 20px rgba(168,85,247,0.05);

  color: white;

  pointer-events: none;
}

.void-tooltip-block {
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 1rem;

  padding:
    0.72rem
    0.85rem;

  border-radius: 12px;

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.02)
    );

  border:
    1px solid rgba(255,255,255,0.05);

  overflow: hidden;
}

.void-tooltip-block::before {
  content: '';

  position: absolute;

  left: 0;
  top: 0;
  bottom: 0;

  width: 3px;

  background:
    linear-gradient(
      180deg,
      #d0aaff,
      #a855f7
    );

  opacity: 0.9;
}


.void-tooltip-title {
  font-size: 0.96rem;
  font-weight: 700;

  color: #f3e8ff;

  text-shadow:
    0 0 12px rgba(208,170,255,0.2);
}

.void-tooltip-tier {
  padding:
    0.24rem
    0.6rem;

  background:
    rgba(168,85,247,0.1);

  border:
    1px solid rgba(208,170,255,0.16);

  color: #d0aaff;

  font-size: 0.7rem;
  font-weight: 700;
}


.void-tooltip-block.desc {
  display: block;

  line-height: 1.5;

  font-size: 0.82rem;

  color: #ddd6fe;
}


.void-tooltip-label {
  font-size: 0.72rem;

  text-transform: uppercase;
  letter-spacing: 0.5px;

  color: #c4b5fd;
}

.void-tooltip-value {
  font-size: 0.84rem;
  font-weight: 700;

  color: #d0aaff;

  text-shadow:
    0 0 8px rgba(208,170,255,0.18);
}



.void-tooltip-cost-wrap {
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 0.45rem;
}

.void-tooltip-icon {
  width: 18px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  filter:
    drop-shadow(0 0 6px rgba(168,85,247,0.4));
}

.void-tooltip-icon svg {
  width: 100%;
  height: 100%;
}

.void-tooltip-cost {
  color: #d0aaff;

  font-size: 0.84rem;
  font-weight: 700;

  text-shadow:
    0 0 8px rgba(208,170,255,0.2);
}

.active-status {
  color: #66ffcc;
  text-shadow: 0 0 8px #66ffcc;
  font-weight: 700;
}

.inactive-status {
  color: #ff6b6b;
  text-shadow: 0 0 8px #ff6b6b;
  font-weight: 700;
}

/* Resourse panel */

.tree-ui-panel {
  position: absolute;

  top: 20px;
  right: 20px;

  width: 240px;

  padding: 14px;

  border-radius: 16px;

  background:
    linear-gradient(
      145deg,
      rgba(28, 18, 50, 0.92),
      rgba(8, 8, 18, 0.96)
    );

  border: 1px solid rgba(180, 120, 255, 0.25);

  backdrop-filter: blur(10px);

  box-shadow:
    0 0 25px rgba(140, 80, 255, 0.35),
    inset 0 0 18px rgba(180, 120, 255, 0.06);

  z-index: 50;

  color: #ddd;

  font-family: Orbitron, sans-serif;
}

.tree-ui-title {
  text-align: center;

  margin-bottom: 14px;

  font-size: 13px;
  font-weight: bold;

  letter-spacing: 2px;

  color: #c084fc;

  text-shadow:
    0 0 8px rgba(192, 132, 252, 0.7);
}

.tree-ui-resource {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 10px;

  font-size: 13px;
}

.tree-ui-resource strong {
  color: #66ffcc;

  text-shadow:
    0 0 6px rgba(102, 255, 204, 0.7);
}

.resource-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.resource-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;

  line-height: 0;
}

.resource-icon :deep(svg) {
  width: 100%;
  height: 100%;

  display: block;

  filter:
    drop-shadow(0 0 4px rgba(160, 100, 255, 0.7));
}
</style>