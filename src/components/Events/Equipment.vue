<template>
  <div class="equipment-wrapper">
    <div class="eq-header">
      <h2 class="eq-title" @click="hero.eLink = { set: 'Info', info: 'Equipment' }">
        <sup style="font-size: 6px"></sup>EQUIPMENT
      </h2>

      <div class="effects-cards">
          <Tooltip
            v-for="key in effectsActivated()"
            :key="key"
            :text="() => effectsHandler(key)"
            position="right"
            maxWidth="400px"
          >
            <div
              class="effect-card"
              :class="['effect-' + key, { active: activeSelect(key) }]"
              @click="clickEffects(key)"
            >
              {{ key }}
            </div>
          </Tooltip>
      </div>
    </div>

    <div class="eq-content">
      
      <div class="equipment-grid">
        <div
          v-for="slot in equipmentLayout"
          :key="slot.type"
          class="equipment-slot"
          :class="[
            slot.position,
            { 'equipment-selected': selectedType === slot.type }
          ]"
          @click="setSelectedType(slot.type)"
        >
          <template v-if="getItem(slot)">
           
            <div class="info">
              <div class="item-header">
                <div class="icon">
                  {{ icons[slot.type] }}
                </div>
                

                <div class="content">
                  <div class="item-name badge-name">
                    {{ getItem(slot).name }}
                  </div>

                  <div class="badge-row">
                    <span class="tag tier">
                      T{{ getItem(slot).tier }}
                    </span>

                    <span
                      v-if="hero.eqUps[slot.type] > 0"
                      class="tag upgrade"
                    >
                      E{{ hero.eqUps[slot.type] }}
                    </span>

                    <span
                      v-if="hero.awakened[slot.type] > 0 && slot.type != 'spRing'"
                      class="tag awaken"
                    >
                      A{{ hero.awakened[slot.type] }}
                    </span>

                    <span
                      v-if="procReq(slot.type)"
                      class="tag proc"
                    > 
                      <Tooltip :text="() => eqDropChances(slot.type)">
                        <span>%</span>
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </div>

              <div class="stats">
                <span
                  class="stat"
                  v-for="(stat, i) in getItemStats(getItem(slot))"
                  :key="i"
                >
                  <span :class="getStatClass(stat)">
                    {{ stat.split(":")[0] }}:
                  </span>

                  <span class="stat-value">
                    {{ stat.split(":")[1] }}
                  </span>
                </span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="empty-slot locked">
              <div class="lock-icon">🔒</div>
              <div class="lock-text">Locked</div>
            </div>
          </template>
        </div>
      </div>

      <div class="starforge-panel" v-if="hero.spCount >= 1">

        <div class="starforge-header">
          <Tooltip :text="() => getForgeTooltipText(selectedType)">
          
            <h3>
              ⭐Star Forge
              <span>[T{{ hero.forgeTier }}]</span>
            </h3>
            <div class="forge-progress-bar">
              <div
                class="forge-progress-fill"
                :style="{
                  width: globalProgressPercent + '%'
                }"
              ></div>
            </div>
          
          </Tooltip>
        </div>

        <div
          class="stardust-box"
          @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Stardust' }"
        >
          <span class="stardust-label">✨ Stardust</span>
          <span class="stardust-value">{{ getStardust() }}</span>
        </div>
      
        <div class="starforge-actions">
          <button
            class="action-btn enhance-btn"
            @click="toggleEnhancePanel"
            v-if="selectedType && hero.spCount >= eqUpsReq[selectedType]"
          >
            ⚔️
          </button>
          <button
            class="action-btn awaken-btn"
            @click="toggleAwakenPanel"
            v-if="selectedType && eqAwakenReq.includes(selectedType) && hero.singularity >= 7"
          >
            ⚡
          </button>
        </div>

        <div v-if="showEnhancePanel && hero.spCount >= eqUpsReq[selectedType]" class="enhance-panel">
          <h2 class="enhance-title">Enhance</h2>

          <div class="enhance-info">
            <span class="label">Lvl:</span>
            <span class="badge level"
              >{{ hero.eqUps[selectedType]
              }}{{ getMaxEquipmentSuffix(selectedType) }}</span
            >
          </div>


          <div class="enhance-buttons">
            <button
              class="enhance-btn"
              @mousedown="startForge"
              @mouseup="stopForge"
              @mouseleave="stopForge"
              @click="forgeUpgrade(selectedType)"
            >
              Enhance ✨{{ getCost(selectedType) }}
            </button>

            <Tooltip
              :text="() => 'Spend all your Stardust on your chosen weapon to enhance it to the maximum.'"
            >
              <button class="enhance-btn max-btn" @click="maxEnchance(selectedType)">
                Max
              </button>
            </Tooltip>
          </div>
        </div>

        <div
          v-if="showAwakenPanel && selectedType != 'spRing'"
          class="awaken-panel"
        >
          <h2 class="awaken-title">Awaken</h2>

          <div class="awaken-info">
            <span class="label">Awaken Tier:</span>
            <span class="badge awaken">{{
              hero.awakened[selectedType] || 0
            }}</span>
          </div>

          <div class="awaken-info">
            <span class="label">Required Equipment Tier:</span>
            <span class="badge tier">T{{ hero.awakenedReq[selectedType] }}</span>
          </div>

          <div class="awaken-effects">
            <div class="effect">
              <span class="effect-label">Increase Base Weapon Drop:</span>
              <span class="effect-value">{{ awakenBaseDrop(selectedType) }}</span>
            </div>
            <div class="effect">
              <span class="effect-label">Increase Enhancement Power:</span>
              <span class="effect-value">{{
                awakenEnhacementPower(selectedType)
              }}</span>
            </div>
            <div class="effect">
              <span class="effect-label">Enhance Cost[/]: </span>
              <span class="effect-value">{{
                awakenEnhacementCost(selectedType)
              }}</span>
            </div>
          </div>

          <button
            class="awaken-btn"
            @click="awakened(selectedType)"
            :disabled="!awakenedTierReq(selectedType)"
          >
            Awaken ⚡
          </button>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useHero } from "../../composables/useHero.js";
import { equipment } from "../../data/equipment.js";
import { perks } from "../../data/ascension.js";
import { dimensions } from "../../data/dimensions.js";
import { spaceShop } from "../../data/spaceShop.js";

import { fn } from "../../composables/utils/global.js";
import { useEquipments } from "../../composables/battleUtils/useEquipment.js";

const { hero } = useHero();
const { 
  awakened, 
  awakenedTierReq, 
  eqUpCost, 
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
  awakenBaseDrop,
  awakenEnhacementPower,
  awakenEnhacementCost,
  getForgeTooltipText,
  getItemStats,
  getStatClass,
  forgeUpgrade,
  getStardust,
  getCost,
  maxEnchance,
  getBaseEq
} = useEquipments();

const upgradeResult = ref("");
const selectedType = ref("");
const showEnhancePanel = ref(false);
const showAwakenPanel = ref(false);

function toggleEnhancePanel() {
  showEnhancePanel.value = !showEnhancePanel.value;
  if (showEnhancePanel.value) showAwakenPanel.value = false;
}

function toggleAwakenPanel() {
  showAwakenPanel.value = !showAwakenPanel.value;
  if (showAwakenPanel.value) showEnhancePanel.value = false;
}

const globalProgressPercent = computed(() => {
  const total = hero.value.totalEnhances || 0;
  const req = hero.value.forgeTierReq || 50;
  return Math.min(100, (total % req) * 2);
});

const setSelectedType = (type) => {
  selectedType.value = type;
};

const icons = {
  sword: "⚔️",
  armor: "🧥",
  boots: "🥾",
  ring: "💍",
  spRing: "☄️",
};

const eqUpsReq = {
  sword: 1,
  armor: 7,
  boots: 11,
  ring: 21,
  spRing: 12,
  'd-sword': 10000
};

const eqAwakenReq = ['sword', 'armor', 'boots', 'ring'];


const equipmentLayout = [
  { type: 'sword', position: 'top-left' },
  { type: 'd-sword', position: 'top-right' },

  { type: 'armor', position: 'mid-left' },
  { type: 'ring', position: 'mid-right' },

  { type: 'boots', position: 'bot-left' },
  { type: 'spRing', position: 'bot-right' }
];

function getItemByType(type) {
  return equippedItems.value.find(i => i.type === type);
}

function getItem(slot) {
  return getItemByType(slot.type);
}


const getStatName = (type) => {
  switch (type) {
    case "sword":
      return "MULT DMG";
    case "armor":
      return "MULT HP";
    case "boots":
      return "Attack Speed";
    case "ring":
      return "MULT EXP";
    case "spRing":
      return "Min Level";
    default:
      return "";
  }
};

const bonusType = (type) => {
  switch (type) {
    case "sword":
      return "multDmg";
    case "armor":
      return "hp";
    case "boots":
      return "speed";
    case "ring":
      return "expMult";
    case "spRing":
      return "minLevel";
    default:
      return "";
  }
};

const equippedItems = computed(() => {
  return Object.entries(hero.value.equipmentTiers)
    .map(([type, tier]) => {
      if (tier <= 0) return null;

      const data = getBaseEq(type, tier);
      return {
        type,
        tier,
        name: data?.name || "???",
        bonusDisplay: data?.bonus?.cap ?? "?",
        ownProperty: data?.bonus[bonusType(type)] ?? "?",
        stat: getStatName(type),
      };
    })
    .filter(Boolean);
});

function getMaxEquipmentSuffix(type) {
  let max = 0;
  if (type === "spRing") return "";

  max = this.hero.equipmentTiers[type] + this.hero.freeEnchances;

  return max ? ` / ${max}` : "";
}

let forgeInterval = null;
let holdTimeout = null;

function startForge() {
  holdTimeout = setTimeout(() => {
    forgeInterval = setInterval(() => {
      if (
        hero.value.dId === "unlimitted" ||
        (hero.value.dId.startsWith("d-") && hero.value.level < 1400) ||
        hero.value.dId === "main" ||
        (hero.value.dId !== "main" && hero.value.level < 700)
      )
        forgeUpgrade(selectedType);
      else clearInterval(forgeInterval);
    }, 50);
  }, 500);
}

function stopForge() {
  clearInterval(holdTimeout);
  clearInterval(forgeInterval);
  forgeInterval = null;
  holdTimeout = null;
}

function eqDropChances (type) {
  const h = hero.value;
  let text = ``;
  switch(type) {
    case 'sword': {
      text += `<span style="color:#f87171">Sword Drop Chnace: <b style="color: gold">${fn(h.eqDropChances["sword"])}</b>
      Total Eq Drop Chance: <b style="color: gold">${fn(h.eqTotalDrop)}</b></span>`
      return text;
    }
  }
}

function procReq (type) {
  const h = hero.value;
  switch(type) {
    case "sword":
      return h.spbCount >= 4
    default: return false;
  }
}



</script>

<style scoped>

.eq-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #66ffcc;
}

/* EQ Layout */
.equipment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 10px;
}

.top-left { grid-column: 1; grid-row: 1; }
.top-right { grid-column: 2; grid-row: 1; }

.mid-left { grid-column: 1; grid-row: 2; }
.mid-right { grid-column: 2; grid-row: 2; }

.bot-left { grid-column: 1; grid-row: 3; }
.bot-right { grid-column: 2; grid-row: 3; }

.empty-slot.locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 4px;

  width: 100%;
  height: 100%;

  border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.1);

  background: linear-gradient(
    135deg,
    rgba(20,20,30,0.6),
    rgba(10,10,15,0.8)
  );

  opacity: 0.7;
}

.lock-icon {
  font-size: 18px;
  filter: grayscale(1);
}

.lock-text {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
}

/* Slots UI */
.equipment-slot {
  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: flex-start;

  padding: 12px;
  border-radius: 10px;

  background: rgba(20, 20, 30, 0.6);

  min-height: 70px; 
}

.equipment-slot:hover {
  transform: scale(1.02);
  border-color: #66ffcc;
}

.equipment-selected {
  outline: 2px solid #e6b800;
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 10px #ffd70088;
  border-radius: 6px;
  transition: 0.15s;
}

.icon {
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
}

.info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.stat,
.tier {
  font-size: 0.9rem;
  color: #aaa;
}

.eq-content {
  display: flex;
  gap: 1em;
}

.equipment-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.equipment-wrapper {
  box-sizing: border-box;
  height: 100dvh; 

  background: linear-gradient(145deg, #192523, #213936);

  padding: clamp(12px, 2vh, 24px);

  border-radius: 0; 
  box-shadow: none;

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: clamp(8px, 1.5vh, 18px);

  overflow: hidden;
}


.equipment-panel {
  background: #1e1e2f;
  color: #f0f0f0;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);

  box-sizing: border-box;
  max-height: 80vh;

  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: thin;
  scrollbar-color: rgb(37, 254, 250) transparent;
}

.starforge-panel {
  background: radial-gradient(circle at top, #2a1f3d, #140f1f);
  border: 2px solid #facc15;
  padding: 1.2rem 1.5rem;
  color: #facc15;
  font-family: "Orbitron", sans-serif;

  box-shadow:
    0 0 12px rgba(250, 204, 21, 0.4),
    inset 0 0 20px rgba(255, 200, 50, 0.1);

  box-sizing: border-box;
  width: 400px;
  position: relative;
}

.starforge-header {
  text-align: center;
}

.forge-progress-bar {
  height: 10px;
  border-radius: 8px;
  background: #1a1425;
  border: 1px solid rgba(255, 200, 100, 0.2);
}

.forge-progress-fill {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #fde68a,
    #facc15,
    #f97316
  );

  box-shadow:
    0 0 8px rgba(255, 200, 100, 0.6),
    0 0 16px rgba(255, 150, 50, 0.4);

  transition: width 0.3s ease;
}

.starforge-panel h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #ffe066;
  text-shadow:
    0 0 6px rgba(255, 220, 100, 0.8),
    0 0 12px rgba(255, 180, 50, 0.4);
}

.starforge-panel select {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.4rem;
  border-radius: 6px;
  background: #1e1e2f;
  color: #66ffcc;
  border: 1px solid #66ffcc;
}

.stardust-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 8px 12px;
  margin: 10px 0;

  border-radius: 10px;

  background: linear-gradient(145deg, #1a1425, #2a1f3d);
  border: 1px solid rgba(255, 200, 100, 0.3);

  box-shadow:
    inset 0 0 10px rgba(255, 200, 100, 0.1),
    0 0 8px rgba(255, 200, 50, 0.2);

  transition: all 0.2s ease;
}

.stardust-box:hover {
  transform: scale(1.02);

  box-shadow:
    inset 0 0 12px rgba(255, 220, 120, 0.2),
    0 0 12px rgba(255, 200, 50, 0.4),
    0 0 20px rgba(255, 150, 50, 0.2);
}

.stardust-label {
  font-size: 0.9rem;
  color: #fde68a;

  text-shadow:
    0 0 4px rgba(255, 220, 120, 0.6);
}

.stardust-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #facc15;

  text-shadow:
    0 0 6px rgba(255, 200, 50, 0.8),
    0 0 12px rgba(255, 150, 50, 0.4);
}



.forge-info {
  margin-top: 0.5rem;
}

.forge-info button {
  background: #ffeb3b;
  color: #000;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 0 10px #ffeb3b, 0 0 20px #ffeb3b70;
}

.auto-forge-info button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #555;
  background: #1a1425;
  color: #aaa;
  transition: all 0.2s ease;
}

.auto-forge-info button:hover {
  background: #241a33;
}

.auto-forge-info button.active {
  border-color: #facc15;
  background: linear-gradient(90deg, #facc15, #f97316);
  color: #000;
  font-weight: bold;

  box-shadow:
    0 0 10px rgba(255, 200, 50, 0.8),
    0 0 20px rgba(255, 150, 50, 0.4);
}

.upgrade-message {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  animation: fadePop 1s ease forwards;
}

.upgrade-message.success {
  color: #66ff66;
  text-shadow: 0 0 6px #66ff66;
}

.upgrade-message.fail {
  color: #ff4444;
  text-shadow: 0 0 6px #ff4444;
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1.1);
  }
  60% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.awakened-button {
  background: linear-gradient(145deg, #66ffcc, #33ccaa);
  color: #000;
  font-weight: bold;
  padding: 3px;
  border: none;
  box-shadow: 0 0 8px #66ffcc88, 0 0 2px #000;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-shadow: 0 0 2px #fff;
}

.awakened-button:hover {
  background: linear-gradient(145deg, #33ccaa, #66ffcc);
  box-shadow: 0 0 12px #66ffccaa, 0 0 4px #000;
  transform: scale(1.05);
}

.awakened-txt {
  color: #66ffcc;
}

.starforge-actions {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem;
}

.action-btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  color: #fff;
  transition: all 0.2s ease;
}

.enhance-btn {
  background: linear-gradient(90deg, #f97316, #facc15);
  box-shadow: 0 0 8px #f97316;
}

.awaken-btn {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  box-shadow: 0 0 8px #3b82f6;
}

.action-btn:hover {
  transform: scale(1.05);
}

.equipment-drop-panel {
  background: rgba(20, 20, 30, 0.7);
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.45;
  width: 100%;
}

.equipment-drop-panel h3,
.equipment-drop-panel h4 {
  margin-bottom: 6px;
  color: #ffd56b;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.equipment-drop-panel ul {
  padding-left: 12px;
  list-style: none;
}

.equipment-drop-panel li {
  margin: 4px 0;
}


.item-header {
  display: grid;
  grid-template-columns: 28px 1fr; 
  gap: 6px;
  align-items: start;
}

.badge-row {
  margin-top: 0.5rem;
  display: flex;
  gap: 5px;
}

.badge-name {
  background: rgba(0, 200, 255, 0.15);
  border: 1px solid rgba(0, 200, 255, 0.4);
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 600;
  font-size: 14px;
  color: #7adfff;
  white-space: nowrap;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.tag.tier {
  background: rgba(0, 150, 255, 0.15);
  border: 1px solid rgba(0, 150, 255, 0.4);
  color: #7acbff;
}

.tag.upgrade {
  background: rgba(255, 215, 0, 0.15);
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: #ffeb7a;
}

.tag.awaken {
  background: rgba(180, 90, 255, 0.15);
  border: 1px solid rgba(180, 90, 255, 0.5);
  color: #d8a4ff;
}

.tag.proc {
  background: rgba(255, 90, 90, 0.15);
  border: 1px solid rgba(255, 90, 90, 0.5);
  color: #ffa4a4;
}

.stat {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  padding-left: 6px;
  white-space: nowrap;
  display: flex;
  gap: 4px;
  align-items: baseline;
}

.stat-bm-am {
  color: #7adfff; /* голубой */
  font-weight: 600;
}

.stat-s {
  color: #ff6b6b; /* красный */
  font-weight: 600;
}

.stat-p {
  color: #ffd54a; /* золотой */
  font-weight: 600;
}

.stat-value {
  color: #ffffffcc;
}

.awaken-panel {
  background: rgba(20, 20, 40, 0.95);
  padding: 12px 16px;
  border-radius: 10px;
  color: #fff;
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.2);
  font-family: "Orbitron", sans-serif;
}

.awaken-title {
  font-size: 18px;
  font-weight: 700;
  color: #00e5ff;
  margin-bottom: 8px;
  text-align: center;
  text-shadow: 0 0 6px rgba(0, 229, 255, 0.5);
}

.awaken-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.label {
  color: #a0c4ff;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}

.badge.tier {
  background: rgba(0, 150, 255, 0.15);
  border: 1px solid rgba(0, 150, 255, 0.4);
  color: #7acbff;
}

.badge.awaken {
  background: rgba(180, 90, 255, 0.15);
  border: 1px solid rgba(180, 90, 255, 0.5);
  color: #d8a4ff;
}


.awaken-effects {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

.effect {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
}

.effect-label {
  color: #ffd54a;
  font-weight: 600;
}

.effect-value {
  color: #ffffffcc;
  font-weight: 500;
}

.awaken-btn {
  background: linear-gradient(90deg, #00e5ff, #7acbff);
  color: #000;
  font-weight: 700;
  transition: 0.2s;
}

.awaken-btn:disabled {
  opacity: 0.5;
}


.awaken-btn:hover {
  transform: translateY(-2px) scale(1.03);

  box-shadow:
    0 0 12px rgba(50, 241, 255, 0.9),
    0 0 20px rgba(50, 252, 255, 0.5);
}

.enhance-panel {
  background: #211907f2;
  padding: 14px 16px;
  border-radius: 10px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
  font-family: 'Orbitron', sans-serif;
}

.enhance-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffd600;
  text-align: center;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
  margin-bottom: 6px;
}

.enhance-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.label {
  color: #ffecb3;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}

.badge.level {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: #ffd600;
}

.badge.extra {
  background: rgba(255, 235, 130, 0.2);
  border: 1px solid rgba(255, 235, 130, 0.5);
  color: #fff176;
}

/* Enhace Panel Btn */

.enhance-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: stretch; 
  margin-top: 10px;
}

.enhance-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;            
  padding: 0 14px;         

  border-radius: 10px;
  border: 1px solid rgba(255, 200, 100, 0.4);

  background: linear-gradient(145deg, #facc15, #f97316);
  color: #000;
  font-weight: 700;
  font-size: 0.95rem;


  box-shadow:
    0 0 8px rgba(255, 200, 50, 0.6),
    inset 0 0 6px rgba(255, 255, 255, 0.2);

  transition: all 0.2s ease;
}

.enhance-btn:hover {
  transform: translateY(-2px) scale(1.03);

  box-shadow:
    0 0 12px rgba(255, 200, 50, 0.9),
    0 0 20px rgba(255, 150, 50, 0.5);
}

.enhance-btn:active {
  transform: scale(0.98);

  box-shadow:
    0 0 6px rgba(255, 200, 50, 0.5),
    inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.max-btn {
  height: 40px;             
  min-width: 60px;

  background: linear-gradient(145deg, #2a1f3d, #140f1f);
  color: #facc15;

  border: 1px solid rgba(255, 200, 100, 0.3);

  box-shadow:
    inset 0 0 6px rgba(255, 200, 100, 0.1),
    0 0 6px rgba(255, 200, 50, 0.2);
}

.max-btn:hover {
  background: linear-gradient(145deg, #3a2a55, #1a1425);

  box-shadow:
    0 0 10px rgba(255, 200, 50, 0.4),
    0 0 16px rgba(255, 150, 50, 0.2);
}

/* Cards */
.effects-cards {
  display: flex;
  gap: 6px;
}

.effect-card {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  font-size: 0.85rem;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: inset 0 0 6px rgba(255,255,255,0.08);
}

.effect-C, .effect-W { color: #4de1f5; box-shadow: 0 0 6px #4de1f5; }
.effect-E { color: #7992fd; box-shadow: 0 0 6px #7991fd; }
.effect-D { color: #9cc9ff; box-shadow: 0 0 6px #9cc9ff; }
.effect-S { color: #58ff4f; box-shadow: 0 0 6px #58ff4f; }
.effect-R { color: #ffeb7a; box-shadow: 0 0 6px #ffeb7a; }

.effect-A { color: #ffeb7a; box-shadow: 0 0 6px #ffeb7a; }

.effect-A:hover {
  background-color: #555;         
  box-shadow: 0 0 6px #ffeb7a8f;
}

.effect-A.active {
  background-color: #ffeb7a;       
  border-color: #d6c460;
  color: #0a0a0a;                
  box-shadow: 0 0 10px #ffeb7a, 0 0 15px #dfcd68;
  transform: scale(1.1);         
}

</style>
