<template>
  <div
    class="atlas-container"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
  >
    
    <svg class="atlas-map" :viewBox="viewBox">
      <!-- Линии между измерениями -->
      <line
        v-for="link in links"
        :key="link.id"
        :x1="getPos(link.from).x"
        :y1="getPos(link.from).y"
        :x2="getPos(link.to).x"
        :y2="getPos(link.to).y"
        stroke="#aaa"
        stroke-width="2"
        stroke-dasharray="4"
      />

      <!-- Кружки-измерения -->
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
          :r="hovered?.id === dimension.id ? 26 : 20"
          :fill="dimension.color"
          class="dimension-circle"
        />
        <text
          :x="dimension.x"
          :y="dimension.y + 5"
          text-anchor="middle"
          fill="white"
          font-size="12"
        >
          {{ dimension.name }}
        </text>
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="hovered"
      class="tooltip"
      :style="{
        top: `${(hovered.y - viewBoxYOffset) * zoom}px`,
        left: `${(hovered.x - viewBoxXOffset) * zoom}px`
      }"
    >
      <strong>{{ hovered.name }}</strong><br />
      <span>{{ hovered.description }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const zoom = 1
const offsetX = 0
const offsetY = 0

const dimensions = ref([
  { id: 'main', name: '🌍 Origin', x: 400, y: 300, color: '#4caf50', description: 'Основное измерение.' },
  { id: 'fire', name: '🔥 Пламя', x: 600, y: 200, color: '#e53935', description: 'Огненное измерение.' },
  { id: 'ice', name: '❄️ Лёд', x: 200, y: 200, color: '#2196f3', description: 'Морозное измерение.' },
  { id: 'void', name: '🌌 Пустота', x: 600, y: 400, color: '#673ab7', description: 'Пустота времени.' },
  { id: 'forest', name: '🌿 Лес', x: 200, y: 400, color: '#8bc34a', description: 'Вечнозелёный мир.' },
  { id: 'desert', name: '🏜️ Пески', x: 800, y: 300, color: '#f4a261', description: 'Древние дюны и ветра.' },
  { id: 'sky', name: '☁️ Небо', x: 400, y: 100, color: '#90caf9', description: 'Парящее измерение облаков.' }
])

const links = ref([
  { id: 1, from: 'main', to: 'fire' },
  { id: 2, from: 'main', to: 'ice' },
  { id: 3, from: 'main', to: 'void' },
  { id: 4, from: 'main', to: 'forest' },
  { id: 5, from: 'fire', to: 'desert' },
  { id: 6, from: 'ice', to: 'sky' }
])

const hovered = ref(null)
const viewBox = ref('0 0 800 600')

// Drag logic
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
  alert(`Вы вошли в: ${dimension.name}`)
}

// Extract x and y offsets from viewBox
const viewBoxXOffset = computed(() => {
  const [vx] = viewBox.value.split(' ').map(Number)
  return vx
})

const viewBoxYOffset = computed(() => {
  const [, vy] = viewBox.value.split(' ').map(Number)
  return vy
})
</script>

<style scoped>
.atlas-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: radial-gradient(ellipse at center, #1b1e26, #0d0f14);
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
  cursor: grab;
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
}

</style>
