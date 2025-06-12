<template>
  <div class="perk-tree">
    <h2 @click="hero.eLink = { set: 'Info', info: 'Tree' }"><sup style="font-size: 12px">ℹ️</sup>TIER[{{hero.treeTier+1}}]</h2>
    <p class="perk-points"  :class="hero.perkPoints > 0 ? 'has-points' : 'no-points'">Points(P): {{ Math.floor(hero.perkPoints) }}</p>

    <div class="auto-buttons" v-if="hero.infTier >= 1 || hero.singularity >= 3">
      <button
        @click="toggleAuto"
        :class="['btn', 'btn-auto', { active: hero.treeAuto }]"
      >
        AUTO
      </button>
    </div>

    <button class="reset-button" @click="resetPerks">
    🔄Reset perks
    </button>
    <div class="perks-container">
      <div
        v-for="perk in visiblePerks"
        :key="perk.id"
        :class="['perk-base', {'perk-card': !perk.status, 'radPerk-Card': perk.status, 'infPerk-Card': perk.infStatus}]"
      >
        <div class="perk-header">
          <h3>{{ perk.name }}</h3>
          <span class="perk-level" v-if="!perk.status && !perk.infStatus">Lvl {{ perk.level }} / {{perk.maxLevel[hero.treeTier]}}</span>
          <span class="perk-level" v-if="perk.infStatus">Lvl {{perk.level}}</span>
        </div>

        <div class="perk-buttons">
          <button class="btnInf" v-if="!perk.status && hero.infTier >= 1 && perk.infStatus !== undefined" @click="infPerk(perk)"><span style="font-size: 14px">∞</span></button>
          <button class="radPerks tooltip-wrapper" @click="radiationPerks(perk)" v-if="perk.id < 7 && radPerks[7].level && !perk.infStatus">☢
              <div class="tooltip">
                Click to activate/deactivate radiation perk. 
                You can choose only one perk.
              </div>
          </button>
          <button v-if="hero.infTier >= 1 || hero.singularity >= 3" class="btnBlock" :class="{ active: perk.block }" @click="perk.block = !perk.block">
            <Tooltip :text="perk.block ? 'Perk is blocked' : 'Activate to block this perk for AUTO'">
              <span>🔒</span>
            </Tooltip>
          </button>
        </div>
        
        <span class="perk-desc">{{ descriptionPerks(perk) }}</span>
        <span class="perk-desc" v-if="!perk.status"><span v-if="perk.level > 0">{{calculate(perk)}}</span></span>
        <span class="perk-desc" v-if="perk.status && perk.id == 1"><span>Total: 
        [{{(1.01 ** Math.min(perk.kills,140) + (perk.kills >= 140? (perk.kills ** 0.09 - 1): 0)).toFixed(2)}}]</span></span>
        <span class="perk-desc" v-if="perk.status && perk.id == 6"><span>Total: {{(Math.max(0.1 * Math.floor(hero.stage / 5 - 1), 1.5)).toFixed(1)}}</span></span>

        <div class="perk-footer">
          <button 
            class="upgrade-button"
            :disabled="hero.perkPoints < perk.cost || perk.level >= perk.maxLevel"
            @click="upgrade(perk)"
            v-if="!perk.status && !perk.infStatus"
          >
            UPGRADE
          </button>
          <button 
            class="upgrade-button"
            @click="infUpgrade(perk)"
            v-if="perk.infStatus"
          >
            {{infCost(perk)}}
          </button>
          <button 
            class="upgrade-button"
            style="margin-left: 5px"
            :disabled="hero.perkPoints < perk.cost || perk.level >= perk.maxLevel"
            @click="maxUpgrade(perk)"
            v-if="!perk.status && !perk.infStatus"
            >MAX
          </button>
          <button 
            class="upgrade-button"
            style="margin-left: 5px"
            @click="infMaxUpgrade(perk)"
            v-if="perk.infStatus"
            >MAX
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { computed } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { perks } from '../../data/perks.js';
import { perks as radPerks} from '../../data/radPerks.js';
import {dimensions} from '../../data/dimensions.js';

const { hero } = useHero();
const MULT = (dimensions.value[6].infTier == dimensions.value[6].maxInfTier? 0.9: 1);


function toggleAuto() {
  hero.value.treeAuto = !hero.value.treeAuto? true: false;
}


const visiblePerks = computed(() => {
  return perks.value.filter(perk => perk.maxLevel?.[hero.value.treeTier] > 0);
});

const upgrade = (perk) => {
  if (hero.value.perkPoints > 0 && perk.level < perk.maxLevel[hero.value.treeTier]) {
    hero.value.perkPoints -= 1;
    perk.level++;
  }
};

const infPerk = (perk) => {
  if(perk.id == 7 || perk.id == 10 || perk.id == 14)
    return;

  hero.value.capInfPerks = hero.value.infTier;

  if(perk.infStatus || hero.value.capInfPerks > perks.value.filter(p => p.infStatus).length){
    perk.infStatus = !perk.infStatus? true: false;
    hero.value.perkPoints += (perk.infStatus? perk.level: Math.floor(perk.baseCost * MULT) * perk.level)
    perk.level = 0;
  }
  
}

const infCost = (perk) => {
  let cost = Math.floor(perk.baseCost * MULT);
  //cost = Math.floor(cost * 0.9);
  return `${cost}P`
}

const infUpgrade = (perk) => {
  if (hero.value.perkPoints >= perk.baseCost) {
    perk.level++;
    hero.value.perkPoints -= Math.floor(perk.baseCost * MULT);
  }
}

const infMaxUpgrade = (perk) => {
  let count = Math.floor(hero.value.perkPoints / Math.floor(perk.baseCost * MULT));
  perk.level += count;
  hero.value.perkPoints -= Math.floor(perk.baseCost * MULT) * count;
}

const maxUpgrade = (perk) => {
  let maxUp = perk.maxLevel[hero.value.treeTier] - perk.level;
  
  perk.level += Math.min(maxUp, hero.value.perkPoints);
  hero.value.perkPoints -= Math.min(maxUp, hero.value.perkPoints);
  
}

const resetPerks = () => {
  let refundedPoints = 0;

  for (const perk of perks.value) {
    if(perk.name == "Invisible" || perk.name == "Traveller")
      perk.level = perk.level;
    else {
      perk.level = 0;
    }
  }

  hero.value.perkPoints = hero.value.freeTreePoints + hero.value.eLevel * (hero.value.infTier >= 1? 2: 1);
};


const calculate = (perk) => {
  if(perk.id == 1 && !perk.infStatus)
    return "TOTAL: " + (perk.value ** perk.level).toFixed(2);

  if(perk.id == 1 && perk.infStatus)
    return "TOTAL: " + ((perk.value - 0.001) ** perk.level).toFixed(2);  

  if(perk.id == 4)
    return "TOTAL: " + (1 + perk.value * perk.level * 0.01).toFixed(2);

  if(perk.id == 6)
    return "TOTAL: " + (perk.value * perk.level).toFixed(1);  

  if(perk.id == 7 || perk.id == 10 || perk.id == 11 || perk.id == 12 || perk.id == 14 || perk.id == 15 || perk.id == 17)
    return "";

  if(perk.id == 16)
    return "TOTAL: " + (perk.value ** perk.level).toFixed(2);

  if(perk.id == 20)
    return "TOTAL: " + (2 - 1.04 ** hero.value.treeTier).toFixed(2);

  return "TOTAL: " + (perk.value * perk.level);
}

function descriptionPerks(perk) {
let radDescription = [
    `+1.01 MULT DMG per each killed enemy [Softcap - 4]`,
    "+1% HEAL per second when battle starts [MAX - 10%]",
    "When you were attacked, 30% TO STUN ENEMY FOR 0.5 SECONDS",
    "Level up if your Level is below 10% of MAX Level.(S)",
    "x1.15 Max Level Mult",
    "+0.1 Attack per Second for each boss killed [Max - 1.5]"
  ]

  return perk.status? radDescription[perk.id - 1]: perk.description;
}

const radiationPerks = (perk) => {
  if(!perk.status && !radPerks[7].perkStatus){
      perk.status = true;
      radPerks[7].perkStatus = true;
      hero.value.perkPoints += perk.level;
      perk.level = 0;
  } else if(perk.status){
      perk.status = false;
      radPerks[7].perkStatus = false;
      perk.kills = 0
  }

  //radPerks[7].perkStatus = false;
}
</script>

<style scoped>
.perk-tree {
  max-height: 670px;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  left: 220px;
  top: 0px;
  padding: 1.5rem;
  background: #242424;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  scrollbar-width: thin;
  scrollbar-color: rgb(102, 253, 82) transparent;
}

.perk-tree h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #65fd9c;
}

.perk-points {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.has-points {
  color: #0dc399; /* зелёный */
  font-weight: bold
}

.no-points {
  color: #f44336; /* красный */
  font-weight: bold
}

.perks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
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
  color: #333;
}

.perk-level {
  background: #2196f3;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.perk-desc {
  font-size: 0.9rem;
  color: #1c1c1c;
  margin-bottom: 1rem;
  min-height: 40px;
}

.perk-base {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.reset-button {
  position: absolute;
  left: 80%;
  top: 4%;
  margin-top: 1rem;
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

.perk-buttons {
  display: flex;
  gap: 6px; /* расстояние между кнопками */
  margin-bottom: 0.5rem; /* отступ от нижнего контента */
  align-items: center;
}

.radPerks {
  padding: 6px 10px;
  background: linear-gradient(145deg, #66ff66, #33cc33);
  font-size: 12px;
  font-weight: bold;
  color: #0a0a0a;
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 255, 0, 0.3);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  width: 30px;
}

.radPerks:hover {
  background: linear-gradient(145deg, #33cc33, #66ff66);
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(102, 255, 102, 0.5);
}

.btnInf {
  padding: 4px 6px;
  background: linear-gradient(145deg, #fff200, #ffcc00);
  font-size: 12px;
  font-weight: bold;
  color: #2c2c2c;
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 30px;
}

.btnInf:hover {
  background: linear-gradient(145deg, #ffcc00, #fff200);
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(255, 204, 0, 0.4);
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

.tooltip {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1c1917;
  color: #fef2f2;
  padding: 0.8rem;
  border-radius: 0.5rem;
  width: 220px;
  font-size: 0.85rem;
  text-align: left;
  z-index: 10;
  box-shadow: 0 0 10px rgba(81, 255, 0, 0.8);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
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

.auto-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem;
  margin-right: 4rem;
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

</style>
