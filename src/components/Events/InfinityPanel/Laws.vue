<template>
  <div class="law-tab">
    <h2 class="title">Law Stones</h2>
    <div style="padding-bottom: 10px">
      <span style="color: #66ffcc; font-weight: bold"
        >Ancient Fragments <b>[AF]</b>:
      </span>
      <span style="color: gold; font-weight: bold">{{
        fn(hero.ancientShards, true)
      }}</span>
    </div>

    <div class="header-events">

      <div class="inventory-controls">
        <div style="display: flex; flex-direction: column; gap: 5px">
          <span class="inventory-status">
            Inventory <strong>[{{ sortedStones.filter(s => s).length }} / {{ hero.inventorySize }}]</strong>
          </span>

          <div style="display: flex; gap: 5px">
            <Tooltip :text="() => 'Grind the stone to receive [AF]'">
              <button
                class="inventory-btn"
                @click="deleteMode = !deleteMode"
                :class="{ active: deleteMode }"
              >
                G
              </button>
            </Tooltip>

            <Tooltip :text="() => 'Block the Stone'">
              <button
                class="inventory-btn"
                @click="blockMode = !blockMode"
                :class="{ active: blockMode }"
              >
                B
              </button>
            </Tooltip>
          </div>
          
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 5px">
          <Tooltip :text="() => 'Sort by'">
            <select v-model="sortMode" class="inventory-select">
              <option value="tier">Tier</option>
              <option value="fragments">Fragments</option>
              <option value="radius">Radius</option>
            </select>
          </Tooltip>
          <button class="filter-btn" @click="toggleFilterPanel">
            Filter
          </button>
        </div>
        
      </div>

      <div v-if="showFilter">
        <div class="filter-modal">
          <div class="filter-grid">
            <div
              v-for="law in laws"
              :key="law.idx"
              class="filter-item"
              :class="{ active: selectedFilters.includes(law.idx) }"
              @click="toggleLaw(law.idx)"
            > 
            <Tooltip :text="() => law.hint">
              <span>{{ law.name.replace('Law of ', '') }}</span>
            </Tooltip>
            </div>
          </div>

          <div class="filter-actions">
            <button @click="resetFilters">Reset</button>
          </div>

        </div>
      </div>

      <div class="slots">
        <div
          v-for="(slot, i) in hero.lawSlots"
          :key="i"
          class="slot"
          @click="clickSelectedSlot(i)"
          :style="getSlotStyle(slot, i)"
        >
          <template v-if="slot && slot.laws?.length">
            <div class="stone-wrapper">
              <span
                v-html="
                  getSvgIconHTML('stoneLaw', '3em', {
                    color: tierColors[slot.tier],
                    tier: slot.tier,
                  })
                "
                :class="{ divine: slot.tier === 5 }"
              ></span>

              <button class="remove-stone" @click.stop="removeStone(i)">✖</button>
            </div>
          </template>
          <template v-else>
            <div class="empty-slot">Empty Slot</div>
          </template>
        </div>
      </div>

    </div>
    

    <div class="inventory">
      
      <div class="stones-grid">
        <div
          v-for="stone in filteredStones"
          :key="stone.id"
          class="stone-cell"
          :class="{
            'slot-1': hero.selectedStones?.[0]?.id === stone.id,
            'slot-2': hero.selectedStones?.[1]?.id === stone.id,
          }"
          :style="{
            border: getBorder(stone)
          }"
          @click="handleInventoryClick(stone.id)"
        >
        <span v-if="stone.block" class="block-icon">
          🔒
        </span>
          <Tooltip
            :text="() => lawTextHandle(stone)"
            :boxShadow="`0 0 10px ${tierColors[stone.tier]}`"
            position="top"
          >
            <span
              v-html="
                getSvgIconHTML('stoneLaw', '3em', {
                  color: tierColors[stone.tier],
                  tier: stone.tier,
                })
              "
              :class="{ divine: stone.tier === 5 }"
            ></span>
          </Tooltip>
        </div>

      </div>

      
    </div>

    <LawsUps v-if="selectedStone" :selectedStone="selectedStone"/>

    
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useHero } from "../../../composables/useHero.js";
import { dimensions } from "../../../data/dimensions.js";
import { getSvgIconHTML } from "../../../composables/svgIcon.js";
import { laws } from "../../../data/laws.js";

import { useTimeline } from "../../../composables/battleUtils/dims/useTimeline.js";

import { fn } from "../../../composables/utils/global.js";

import LawsUps from "./LawsUps.vue";

const { hero } = useHero();

const { 
  applyLaw,
  createStone,
  upCost,
  radiusCalc,
  ancientShardsMult,
  rebuildActiveDimsCache
} = useTimeline();


const selectedSlot = ref(null);
const selectedInventorySlot = ref(0);
const deleteMode = ref(false);
const blockMode = ref(false);
const selectedStone = ref(null);
const sortMode = ref("tier");

const selectedLawFilter = ref(null);
const showFilter = ref(false);
const selectedFilters = ref([]);

function handleInventoryClick(id) {
  if (id == null) return;

  const arr = hero.value.lawStonesSet;
  const index = arr.findIndex(s => s && s.id === id);
  if (index === -1) {
    return;
  }

  const stone = arr[index];
  if (!stone) return;

  if (blockMode.value) {
    stone.block = !stone.block;
    return;
  }

  if (deleteMode.value) {
    const isUsedInSlot = hero.value.lawSlots.some(s => s?.id === stone.id);
    if (isUsedInSlot) return;
    if (stone.block) return;

    hero.value.lawStonesSet.splice(index, 1);

    hero.value.ancientShards += calcShardsForStone(stone);
    return;
  }

  if (selectedSlot.value !== null) {
    placeStone(stone);
    return;
  }

  selectedStone.value = stone;
  hero.value.timeline.showUpgradeModal = true;
}


function placeStone(stone) {
  const alreadyPlaced = hero.value.lawSlots.some(slot => slot?.id === stone.id);

  if (!alreadyPlaced) {
    hero.value.lawSlots[selectedSlot.value] = stone;
    hero.value.selectedStones[selectedSlot.value] = stone;
  }

  selectedSlot.value = null;

  rebuildActiveDimsCache()
}


function toggleFilter(idx) {
  selectedLawFilter.value =
    selectedLawFilter.value === idx ? null : idx;
}

const filteredStones = computed(() => {
  return sortedStones.value.filter(stone => {
    if (!stone) return false;

    if (selectedFilters.value.length === 0) return true;

    return selectedFilters.value.every(filterId =>
      stone.laws.some(law => law.id === filterId)
    );
  });
});

function toggleFilterPanel() {
  showFilter.value = !showFilter.value;
}

function toggleLaw(idx) {
  const i = selectedFilters.value.indexOf(idx);

  if (i !== -1) {
    selectedFilters.value.splice(i, 1);
  } else {
    selectedFilters.value.push(idx);
  }
}

function resetFilters() {
  selectedFilters.value = [];
}


function extraCostUps(ups) {
  let cost = 0;
  for (let i = 0; i < ups; i++) {
    cost += upCost(i);
  }

  return cost;
}

function getBorder(stone) {
  if (!stone) return "";
  if (hero.value.selectedStones[0]?.id === stone.id) return "1px solid #66ffcc";
  if (hero.value.selectedStones[1]?.id === stone.id) return "1px solid red";
  if (stone.block) return "1px solid orange";
  if (isStoneSelected(stone)) return "1px solid gold";
  return "";
}



function getSlotStyle(slot, index) {
  let style = {};

  if (selectedSlot.value === index) {
    style.border = "2px solid #ffd700";
    style.filter = "drop-shadow(0 0 5px #ffd700)";
    style.transform = "scale(1.05)";
  }

  if (slot) {
    if (hero.value.selectedStones[0]?.id === slot.id) {
      style.border = "2px solid #66ffcc";
      style.filter = "drop-shadow(0 0 5px #66ffcc)";
    } else if (hero.value.selectedStones[1]?.id === slot.id) {
      style.border = "2px solid red";
      style.filter = "drop-shadow(0 0 5px red)";
    } else if (isStoneSelected(slot)) {
      style.border = "2px solid gold";
      style.filter = "drop-shadow(0 0 5px gold)";
    }
  }

  return style;
}

function isStoneSelected(stone) {
  return hero.value.selectedStones.some((s) => s && s.id === stone.id);
}

function getSlotColor(slot, index) {
  if (!slot) return "";
  if (hero.value.selectedStones[0]?.id === slot.id) return "#66ffcc";
  if (hero.value.selectedStones[1]?.id === slot.id) return "red";
  if (isStoneSelected(slot)) return "gold";
  return "";
}

const tierColors = {
  1: "#3bb273",
  2: "#f2d541",
  3: "#d94e67",
  4: "#a93df2",
  5: "#66ffcc",
};

function lawTextHandle(stone) {
  if (!stone || !stone.laws) return "";


  if (deleteMode.value) {
    const shards = calcShardsForStone(stone);
    return `<span style="display:flex;align-items:center; gap:4px;">
        ${getSvgIconHTML("ancientShards", "1em")}
        <span style="color: gold">${fn(shards, true)}</span>
      </span>`;
  }

  let text = ` <div><strong style="color: ${
    tierColors[stone.tier]
  }">Stone of Law [T${stone.tier}]</strong>
      <span style="color: #00ffff">Radius: ${radiusCalc(stone, 0)}</span><br>`;

    for (const { id: lawIndex, tier: lawTier } of stone.laws) {
      const law = laws.value[lawIndex];
      if (!law) continue;

      const bonus = law.bonus[lawTier - 1] ?? 0;

      const desc = law.desc.replace(
        "[]",
        `<span style="color: #ffd700">${bonus}</span>`
      );

      text +=
        `<br><strong style="color: ${tierColors[lawTier]}">${law.name}</strong> ` +
        `<span style="color: ${tierColors[lawTier]}">[T${lawTier}]</span><br>` +
        `${desc}<br>`;
    }

  text += `</div>`;
  return text;
}

function calcShardsForStone(stone) {
  if (!stone || !stone.laws) return 0;

  let bonus = 0;
  for (const { id: lawIndex, tier: lawTier } of stone.laws) {
    bonus += lawTier * 1.1 ** stone.tier;
  }
  let refund = hero.value.voidTreeStats.laws_refund * 0.01;

  return bonus * 1.2 ** stone.tier * ancientShardsMult() + extraCostUps(stone.ups) * refund;
}


function stoneHasSlotLaw(stone) {
  if (!stone) return false;

  const slot = hero.value.lawSlots[selectedSlot.value];
  if (!slot || !slot.laws) return false;

  return (
    stone.laws?.some((lawObj) => {
      const lawIndex = parseInt(Object.keys(lawObj)[0]);
      return slot.laws.includes(lawIndex);
    }) ?? false
  );
}

function removeStone(index) {
  hero.value.lawSlots[index] = null;
  hero.value.selectedStones[index] = null;
  rebuildActiveDimsCache()
}

const sortedStones = computed(() => {
  return [...hero.value.lawStonesSet].sort((a, b) => {
    if (!a || !b) return 0;

    if (sortMode.value === "tier") {
      return b.tier - a.tier;
    }
    if (sortMode.value === "fragments") {
      return calcShardsForStone(b) - calcShardsForStone(a);
    }

    if (sortMode.value === "radius") {
      return b.radius - a.radius;
    }

    return 0;
  });
});

function clickSelectedSlot(i) {
  if (selectedSlot.value == null)
    selectedSlot.value = i;
  else selectedSlot.value = null;
}


function refillStones() {
  hero.value.lawStonesSet = []; 

  for (let i = 0; i < hero.value.inventorySize; i++) {
    const stoneTier = Math.floor(Math.random() * 5) + 1;

    const stone = createStone(stoneTier, hero);
    hero.value.lawStonesSet.push(stone);
  }
}


</script>

<style scoped>
.law-tab {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  padding: 1rem 1.2rem;

  border: 2px solid #ff5c00;
  border-radius: 12px;
  background: radial-gradient(circle at top, #1a1a1a, #0d0d0d);
  color: white;

  box-shadow:
    inset 0 0 20px rgba(255, 92, 0, 0.15),
    0 0 20px rgba(255, 92, 0, 0.2);
}


.title {
  text-align: center;
  margin-bottom: 1rem;
  color: #ff8844;

  text-shadow:
    0 0 6px #ff5c00,
    0 0 12px rgba(255, 92, 0, 0.6);
}

/* Header Panel */

.header-events {
  display: flex;
  align-items: flex-start;

  gap: 18px;

  padding: 14px;
  margin-bottom: 14px;

  border-radius: 18px;

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.03),
      rgba(255,255,255,0.015)
    );

  border: 1px solid rgba(255,255,255,0.06);

  box-shadow:
    inset 0 0 20px rgba(255,255,255,0.02),
    0 0 20px rgba(0,0,0,0.4);
}

.slots {
  display: flex;
  align-items: center;
  gap: 14px;

  flex-wrap: wrap;
}

.slot {
  width: 100px;
  height: 100px;
  border: 1px solid #444;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: linear-gradient(145deg, #111, #1a1a1a);

  transition: all 0.25s ease;
  position: relative;

  box-shadow:
    inset 0 0 10px rgba(255,255,255,0.05),
    0 0 6px rgba(0,0,0,0.6);
}

.slot:hover {
  transform: scale(1.05);
  border-color: #ff8844;

  box-shadow:
    0 0 10px rgba(255, 136, 68, 0.5),
    inset 0 0 10px rgba(255,255,255,0.1);
}

.slot.active {
  border: 2px solid gold;

  box-shadow:
    0 0 12px gold,
    inset 0 0 10px rgba(255,215,0,0.2);

  background: linear-gradient(145deg, #2a1f00, #1a1400);
}

.empty-slot {
  color: #888;
  font-size: 0.9em;
  text-align: center;
}


.slot .divine {
  filter: drop-shadow(0 0 5px gold);
}

.remove-stone {
  position: absolute;
  top: 0px;
  right: 0px;
  background: #333;
  color: #fff;
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75em;
  padding: 0 4px;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.remove-stone:hover {
  opacity: 1;
  background: #ff1a1a;
  color: #fff;
  box-shadow: 0 0 6px red;
}

.stone-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.laws {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
}
.law {
  font-size: 0.8rem;
  cursor: help;
}

.inventory {
  margin-top: 2rem;
  text-align: center;
}

.stones-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fill, 64px);

  justify-content: center;

  gap: 3px;

  padding: 16px;

  border-radius: 18px;

  background:
    linear-gradient(
      180deg,
      rgba(10,10,14,0.95),
      rgba(5,5,8,0.95)
    );

  border: 1px solid rgba(255,255,255,0.05);

  box-shadow:
    inset 0 0 18px rgba(0,0,0,0.6);
}

.stone-cell {
  position: relative;
  width: 64px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(60, 60, 60, 0.15);
  border: 1px solid #333;

}



.stone-cell.empty {
  background: rgba(30, 30, 30, 0.5);
}

.divine {
  filter:
    drop-shadow(0 0 6px #66ffcc)
    drop-shadow(0 0 14px #66ffcc)
    drop-shadow(0 0 20px rgba(102,255,204,0.6));
}

.delete-toggle {
  background: #444;
  color: #fff;
  border: 1px solid #666;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.9em;
  transition: 0.2s;
}

.delete-toggle.active {
  background: #c62828;
  border-color: #900;
}

.block-icon {
  position: absolute;
  top: 2px;
  left: 2px;

  font-size: 12px;
  z-index: 2;

  color: #ff4d4d;
  text-shadow: 0 0 4px rgba(255, 0, 0, 0.8);
}



/* Header Panel Filter */

.filter-panel {
  padding: 10px;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  margin-bottom: 10px;
}

.filter-title {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 6px;
}

.filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-item {
  padding: 4px 8px;
  background: #1a1a1a;
  border: 1px solid #333;
  cursor: pointer;
  font-size: 12px;
  color: #aaa;
  border-radius: 4px;
  transition: 0.2s;
}

.filter-item:hover {
  background: #2a2a2a;
}

.filter-item.active {
  color: #66ffcc;
  border-color: #66ffcc;
  box-shadow: 0 0 6px #66ffcc;
}

.filter-reset {
  margin-top: 8px;
  width: 100%;
  background: #222;
  border: 1px solid #444;
  color: #ff6666;
  padding: 4px;
  cursor: pointer;
}


.filter-btn {
  height: 34px;
  min-width: 34px;

  padding: 0 12px;

  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);

  background:
    linear-gradient(
      180deg,
      #1a1d28,
      #10131b
    );

  color: #cfcfe6;

  font-weight: 700;
  font-size: 0.8rem;

  cursor: pointer;

  transition: 0.2s;
}


.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}


.filter-modal {
  min-width: 260px;
  padding: 14px;
  border-radius: 16px;
  background:
    linear-gradient(
      180deg,
      rgba(20,20,30,0.96),
      rgba(10,10,16,0.96)
    );

  border: 1px solid rgba(255,255,255,0.06);
  box-shadow:
    0 0 25px rgba(0,0,0,0.5);

  backdrop-filter: blur(8px);
}


.filter-header {
  display: flex;
  justify-content: space-between;
  color: #66ffcc;
}


.filter-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr); 
  gap: 6px;
}


.filter-item {
  padding: 6px;
  background: #1a1a1a;
  border: 1px solid #333;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: #aaa;
  border-radius: 6px;
  transition: 0.2s;
}

.filter-item:hover {
  background: #2a2a2a;
}


.filter-item.active {
  color: #66ffcc;
  border-color: #66ffcc;
  box-shadow: 0 0 8px #66ffcc;
}


.filter-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.filter-actions button {
  flex: 1;
  margin: 0 4px;
  background: #222;
  border: 1px solid #444;
  color: #fff;
  padding: 4px;
  cursor: pointer;
}


/* Inventory*/


.inventory-controls {
  display: flex;
  gap: 14px;
  align-items: flex-start;

  padding: 10px 12px;

  border-radius: 14px;

  background:
    linear-gradient(
      180deg,
      rgba(15,15,20,0.95),
      rgba(8,8,12,0.95)
    );

  border: 1px solid rgba(255,255,255,0.05);

  min-width: 260px;
}

.inventory-status {
  color: #d6d6dc;
  font-size: 0.9rem;

  letter-spacing: 0.5px;
}

.inventory-status strong {
  color: #ffd166;
}

.inventory-btn {
  height: 34px;
  min-width: 34px;

  padding: 0 12px;

  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);

  background:
    linear-gradient(
      180deg,
      #1a1d28,
      #10131b
    );

  color: #cfcfe6;

  font-weight: 700;
  font-size: 0.8rem;

  cursor: pointer;

  transition: 0.2s;
}

.inventory-btn:hover {
  border-color: #66ccff;
  color: white;
  box-shadow:
    0 0 10px rgba(102,204,255,0.25);
}

.inventory-btn.active {
  background:
    linear-gradient(
      180deg,
      #3d1f1f,
      #221010
    );

  border-color: #ff6666;

  color: #ff9090;

  box-shadow:
    0 0 12px rgba(255,80,80,0.3);
}

.inventory-select {
  height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: #11151d;
  color: #ddd;
  border: 1px solid rgba(255,255,255,0.08);
  outline: none;
  transition: 0.2s;
}

.inventory-select:hover {
  border-color: #666;
}
</style>
