<template>
<div class="dimension-grid-wrapper">
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
      <button class="enter-button" @click="selectDimension(dimension, hero)">
        Enter
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { dimensions } from "../../../data/dimensions.js";
import { useHero } from "../../../composables/useHero.js";
import { useEnemy } from "../../../composables/useEnemy.js";

import { selectDimension } from "../../../composables/battleUtils/dims/dimPerform.js";

import { useDimHandler } from "../../../composables/battleUtils/dims/useDimHandler.js";

const { 
    toggleOtherDimensions, 
    getInfColor, 
    dimensionD,
    fDimensions,
    d_req 
} = useDimHandler();

const { hero } = useHero();
const { enemy } = useEnemy();

const filteredDimensions = computed(() =>
  fDimensions().filter((dim) => {
    if (hero.value.dimensionStatus == 3 && !dim.id.startsWith('c-')) return false;
    
    const query = hero.value.dims.searchQuery.toLowerCase();
    const nameMatch =
      dim.id.toLowerCase().includes(query) ||
      (dim.title || "").toLowerCase().includes(query);
    const descMatch = (dimensionD(dim) || "").toLowerCase().includes(query);
    const matchesSearch = nameMatch || descMatch;

    const status = getInfStatus(dim);
    const matchesStatus =
      hero.value.gridFilterStatus === "all" ||
      hero.value.gridFilterStatus === status;

    return matchesSearch && matchesStatus;
  })
);

function getInfStatus(dim) {
  let id = dim.id;
  let d = {};
  for(let ds of dimensions.value){
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
</script>



<style scoped>
.dimension-grid-wrapper {
  max-height: 90vh;
  margin-top: 100px;
  overflow-y: auto;
  padding: 1em;
  background: #0e0e17;
  box-sizing: border-box;

  scrollbar-width: thin;
  scrollbar-color: gold transparent;
}

.dimension-grid-wrapper::-webkit-scrollbar {
  width: 6px;
}

.dimension-grid-wrapper::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
}

.dimension-grid-wrapper::-webkit-scrollbar-thumb {
  background: gold;
  border-radius: 10px;
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
  height: 35vh;
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

  scrollbar-width: thin;
  scrollbar-color: gold transparent;
}

.dim-description-scroll::-webkit-scrollbar {
  width: 4px;
}
.dim-description-scroll::-webkit-scrollbar-thumb {
  background: gold;
  border-radius: 4px;
}

.dimension-grid-wrapper::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
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
</style>
