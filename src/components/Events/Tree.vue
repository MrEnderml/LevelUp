<template>
  <div class="tree-wrapper">
    <h2 class="tree-title">
      Tree [T{{ hero.tree.tier }}]
    </h2>

    <div class="perk-points">
      <span :class="hero.tree.points > 0 ? 'has-points' : 'no-points'">
        Tree Points [TP]: <strong>{{ hero.tree.points }}</strong>
      </span>
    </div>

    <div class="effects-cards">
          <Tooltip
            v-for="key in effectsActivated()"
            :key="key"
            :text="() => effectsHandler(key)"
            position="right"
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


    <!-- Perks -->
    <div class="perks-container">
      <div
        v-for="perk in visiblePerks"
        :key="perk.id"
        :class="[
          'perk-base',
          {
            'perk-card': perk.currentStatus === 'base',
            'radPerk-Card': perk.currentStatus === 'rad',
            'infPerk-Card': perk.currentStatus === 'inf'
          }
        ]"
      >
        <!-- Header -->
        <div class="perk-header">
          <h3 :class="perk.currentStatus">
            {{ perk.name }} 
            {{ perk.currentStatus == 'inf'? "[T" + Math.floor(perk.level.inf / perk.infThreshold) + "]": "" }}
          </h3>
          <span class="perk-level" v-if="perk.currentStatus != 'rad'">
            Lvl {{ perk.level[perk.currentStatus] }} 
            <span v-if="perk.currentStatus == 'base'"> / {{ perk.maxLevel[hero.tree.tier] }}</span>
          </span>
        </div>

        <!-- Buttons -->
        <div class="perk-buttons">
          <button class="perk-btn inf" v-if="canInfActivate(perk)" @click="infActivate(perk)">
            ∞
          </button>

          <button class="perk-btn rad" v-if="canRadActivate(perk)" @click="radActivate(perk)">
            ☢
          </button>

          <button class="perk-btn system" v-if="hero.infExpansions.tree" :class="{ active: perk.system.block }" @click="toggleSystem(perk)">
            S
          </button>

          <button class="perk-btn reset" @click="resetNodes(perk)">
            <Tooltip :text="() => TooltipHandler(3)" boxShadow="0 0 10px red" maxWidth="120px">
              R
            </Tooltip>
          </button>
        </div>

        <!-- Description -->
        <div 
          class="perk-desc" 
          :class="perk.currentStatus"
          :style="nodeProgressStyle(perk)"
          >
          <p class="perk-text">{{ descNodes(perk) }}</p>
          <p class="perk-effect">{{ descEffects(perk) }}</p>
        </div>


        <!-- Footer -->
        <div class="perk-footer" v-if="perk.currentStatus != 'rad'">
          <button
            class="upgrade-button"
            @click="upgradeNode(perk)"
          >
            {{ upgradeLabel(perk) }}
          </button>

          <button
            class="upgrade-button"
            @click="upgradeMaxNode(perk)"
          >
            MAX
          </button>
        </div>

        

      </div>
    </div>

    <NodeSystemPanel
          v-if="systemPerk"
          :perk="systemPerk"
          :hero="hero"
          @close="systemPerk = null"
        />
  
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { perks } from '../../data/perks.js';
import { perks as radPerks } from '../../data/radPerks.js';
import { useTrees } from '../../composables/battleUtils/useTree.js';

const { hero } = useHero();

import NodeSystemPanel from './TreePanel/NodeSystemPanel.vue';

const {
  upgradeNode,
  upgradeMaxNode,
  infActivate,
  radActivate,
  resetNodes,
  descNodes,
  descEffects,
  toggleAuto,
  infNodesCostHandle,
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useTrees();


const visiblePerks = computed(() =>
  perks.value.filter(p => p.maxLevel?.[hero.value.tree.tier] > 0)
);

const systemPerk = ref(null);

const toggleSystem = (perk) => {
  systemPerk.value =
    systemPerk.value === perk ? null : perk;
};

const canInfActivate = (perk) =>
  hero.value.infExpansions.tree &&
  perk.infStatus &&
  perk.currentStatus !== 'rad';

const canRadActivate = (perk) =>
  perk.id < 7 &&
  radPerks[7].level &&
  perk.currentStatus !== 'inf';

const upgradeLabel = (perk) =>
  perk.currentStatus === 'inf'
    ? infNodesCostHandle(perk.id) + ' TP'
    : '1 TP';


function TooltipHandler(id) {
  switch(id) {
    case 1: 
      return '<span style="font-size:0.9em;">Click to activate / deactivate the radiation node</span>'
    case 3: 
      return '<span style="font-size:0.9em;">Refund all <span style="color:lightgreen;">[TP]</span> and reset the node\'s level</span>'
    case 4: 
      return '<span style="font-size:0.9em;">Refund all <span style="color:lightgreen;">[TP]</span> and reset all nodes level</span>'
    case 5: 
      return '<span style="font-size:0.9em; font-weight: bold">Tree Points <span style="color:lightgreen;">[TP]</span> are granted by leveling up.<br></span>' + 
    (hero.value.mainInfTier >= 1? '<span style="font-size:0.9em; font-weight: bold; color: gold">Infinity grants double points gain</span>': '');
    case 6:
      return '<span style="font-size: 0.9em">Tree Tier increases the maximum level of nodes and unlocks new nodes.</span>'
  }
}

function nodeProgressStyle(perk) {
  if (perk.currentStatus != 'inf') return {};

  const progress = Math.min(1, (perk.level.inf % perk.infThreshold) / perk.infThreshold);

  const percent = Math.floor(progress * 100);

  return {
    boxShadow: `
      inset ${percent * 1.8}px 0 0 rgba(249, 251, 107, 0.25),
      inset 3px 0 0 rgba(207,186,70,0.9),
      0 0 8px rgba(207,186,70,0.35)
    `
  };
}
</script>


<style scoped>
.tree-wrapper {
  box-sizing: border-box;

  height: 100dvh; 

  background: linear-gradient(145deg,rgb(30, 43, 34),rgb(22, 41, 27));
  color: #f0f0f0;

  padding: clamp(12px, 2vh, 24px);

  border-radius: 0; 
  box-shadow: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.5vh, 18px);

  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.tree-title {
  font-size: 1.4rem;
  font-weight: bold;
  color:rgb(122, 223, 159);
}


.perk-points {
  text-align: center;
  font-size: 1rem;
  margin-bottom: 1rem;
}


.has-points {
  color: #0dc399; 
  font-weight: bold
}

.no-points {
  color: #f44336; 
  font-weight: bold
}

.perks-container {
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;

  scrollbar-width: thin;
  scrollbar-color: rgb(90, 246, 47) transparent;
}

.perk-card {
  background: linear-gradient(145deg, #f0f0f0, #0dc399);
  border-radius: 10px;
  box-shadow:  3px 3px 6px #d1d1d1,
               -3px -3px 6px #ffffff;
  padding: 1rem;
  width: 180px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.perk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.perk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.perk-header h3 {
  font-size: 1.1rem;
  margin: 0;
}

.perk-header h3.base {
  color: #0dc399; /* Base color */
}

.perk-header h3.inf {
  color: #cfba46; /* Inf color */
}

.perk-header h3.rad {
  color: #1cb71c; /* Rad color */
}

.perk-level {
  background: #2196f3;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.8rem;
}


/* DESC */
.perk-desc {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  padding: 6px 8px;
}

.perk-text,
.perk-effect {
  font-size: 0.85rem;
  color: #e6e6e6;
  line-height: 1.25;
  margin: 2px 0;
}

.perk-effect {
  margin-top: 12px;
  font-size: 0.8rem;
  opacity: 0.9;
}


.perk-desc.base {
  box-shadow: inset 3px 0 0 rgba(13, 195, 153, 0.9),
              0 0 8px rgba(13, 195, 153, 0.25);
}

.perk-desc.base .perk-effect {
  text-shadow: 0 0 4px rgba(13, 195, 153, 0.6);
}

.perk-desc.infff {
  box-shadow: inset 3px 0 0 rgba(207, 186, 70, 0.9),
              0 0 8px rgba(207, 186, 70, 0.3);
}

.perk-desc.inf .perk-effect {
  text-shadow: 0 0 4px rgba(207, 186, 70, 0.6);
}

.perk-desc.rad {
  box-shadow: inset 3px 0 0 rgba(28, 183, 28, 0.9),
              0 0 8px rgba(28, 183, 28, 0.35);
}

.perk-desc.rad .perk-effect {
  text-shadow: 0 0 4px rgba(28, 183, 28, 0.6);
}


/* PERK */
.perk-base {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-height: 220px;
}

.perk-footer {
  text-align: center;
  margin-top: auto;
  display: flex;
  justify-content: start;
  gap: 5px;
  flex-wrap: wrap;
}

.upgrade-button {
  background: #4caf50;
  border: none;
  border-radius: 6px;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.upgrade-button:hover:not(:disabled) {
  background: #43a047;
}

.upgrade-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}



.perk-buttons {
  display: flex;
  gap: 6px; 
  margin-bottom: 0.5rem; 
  align-items: center;
}

.perk-btn {
  width: 30px;         /* одинаковая ширина */
  height: 30px;        /* одинаковая высота */
  padding: 0;          /* убираем внутренние отступы */
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

/* INF */
.perk-btn.inf {
  background: linear-gradient(145deg, #fff200, #ffcc00);
  color: #2c2c2c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.perk-btn.inf:hover {
  background: linear-gradient(145deg, #ffcc00, #fff200);
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(255, 204, 0, 0.4);
}

/* RAD */
.perk-btn.rad {
  background: linear-gradient(145deg, #66ff66, #33cc33);
  color: #0a0a0a;
  box-shadow: 0 2px 4px rgba(0, 255, 0, 0.3);
}
.perk-btn.rad:hover {
  background: linear-gradient(145deg, #33cc33, #66ff66);
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(102, 255, 102, 0.5);
}

/* BLOCK (S) */
.perk-btn.system {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #555;
}
.perk-btn.system.active {
  background: #220000;
  border-color: #ff4444;
  color: #ff7777;
  box-shadow: 0 0 12px rgba(255, 0, 0, 0.4);
}

/* RESET (R) */
.perk-btn.reset {
  background: #f44336;
  color: white;
}
.perk-btn.reset:hover {
  background: #d32f2f;
}




.radPerk-Card {
  box-shadow:  3px 3px 6px #66ff66,
               -3px -3px 6px #66ff66;
  background: linear-gradient(145deg, #f0f0f0, #0dc336);
  border-radius: 10px;
  padding: 1rem;
  width: 180px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.infPerk-Card {
  box-shadow:  3px 3px 6px rgb(240, 255, 102),
               -3px -3px 6px rgb(252, 255, 102);
  background: linear-gradient(145deg, #f0f0f0,rgb(255, 251, 0));
  border-radius: 10px;
  padding: 1rem;
  width: 180px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}


.info-button {
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  color: #fee2e2;
  transition: transform 0.2s;
}

.info-button:hover {
  transform: scale(1.2);
}


.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  transition: background-color 0.2s, color 0.2s;
  cursor: pointer;
  border: none;
}

.btn-auto {
  background-color: #d1fae5;
  color: #065f46;
}

.btn-auto:hover {
  background-color: #a7f3d0;
}

.active.btn-auto {
  background-color:rgb(18, 233, 161);
  color: white;
}

.btnBlock {
  background-color: #bcedc1;
  color: #bbb;
  border: 2px solid #555;
  border-radius: 8px;
  padding: 2px 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btnBlock:hover {
  background-color:rgb(150, 247, 160);
  color: #fff;
  border-color: #888;
}

.btnBlock.active {
  background-color: #8b0000; 
  color: #fff;
  border-color: #ff5555;
  box-shadow: 0 0 6px #ff5555aa;
}



.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem; 
  margin: 1rem 7rem 1rem 0;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.reset-button:hover {
  background-color: #d32f2f;
}

.auto-buttons button {
  padding: 0.5rem 1rem;
  background-color:rgb(29, 153, 255);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.auto-buttons button:hover {
  background-color:rgb(47, 116, 185);
}
.auto-buttons .active {
  background-color: #4caf50;
}



.effects-cards {
  display: flex;
  gap: 6px;
}

/* MINI CARD */
.effect-card {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  font-size: 0.85rem;
  cursor: default;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: inset 0 0 6px rgba(255,255,255,0.08);
}

.effect-T, .effect-F {
  color: #7cff9e;
  box-shadow: 0 0 6px rgba(124, 255, 158, 0.6);
}
.effect-I, .effect-C {
  color: gold;
  box-shadow: 0 0 6px gold;
}
.effect-N {
  color: #ffd966;
  box-shadow: 0 0 6px #ffd966;
}
.effect-R {
  color: #ff4d4d;
  box-shadow: 0 0 6px rgba(255, 77, 77, 0.7);
}
.effect-Z {
  color: #9bff3d;
  box-shadow: 0 0 8px rgba(155, 255, 61, 0.8);
}
.effect-i {
  color: yellow;
  box-shadow: 0 0 8px rgba(249, 255, 61, 0.8);
}

.effect-A {
  background-color: #132b2b;
  border: 1px solidrgb(42, 255, 74);
  color:rgb(63, 255, 92);
  transition: all 0.25s ease;
}

.effect-A:hover {
  box-shadow: 0 0 8px rgba(63, 255, 101, 0.7);
}

.effect-A.active {
  background-color:rgb(63, 255, 89);
  color: #052b27;
  box-shadow:
    0 0 10px rgb(63, 255, 130),
    0 0 18px rgba(63, 255, 124, 0.8);
  transform: scale(1.12);
}


</style>
