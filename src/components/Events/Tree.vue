<template>
  <div class="perk-tree">
    <h2 @click="hero.eLink = { set: 'Info', info: 'Tree' }"><sup style="font-size: 12px">ℹ️</sup>TREE [T{{hero.treeTier+1}}]</h2>
    <p class="perk-points"  :class="hero.perkPoints > 0 ? 'has-points' : 'no-points'">Points(P): {{ Math.floor(hero.perkPoints) }}</p>

    <div class="auto-buttons" v-if="hero.infEvents >= 1 || hero.infTier >= 1 || hero.singularity >= 3">
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
          <button class="btnInf" v-if="(hero.infTier >= 1 || hero.infEvents >= 1) && !perk.status && perk.infStatus !== undefined" @click="infPerk(perk)"><span style="font-size: 14px">∞</span></button>
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
        <span class="perk-desc" v-if="perk.status && perk.id == 1"><span>Total: [{{(hero.radAttack).toFixed(2)}}]</span></span>
        <span class="perk-desc" v-if="perk.status && perk.id == 6"><span>Total: {{(hero.radAPS).toFixed(2)}}</span></span>

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
import { dimensions } from '../../data/dimensions.js';
import { perks as ascendPerks } from '../../data/ascension.js';
import { perks as treePerks } from '../../data/perks.js';

const { hero } = useHero();

const toInt = (n) => Math.max(0, Math.floor(n || 0));

function toggleAuto() {
  hero.value.treeAuto = !hero.value.treeAuto? true: false;
}

const visiblePerks = computed(() => {
  return perks.value.filter(perk => perk.maxLevel?.[hero.value.treeTier] > 0);
});

const upgrade = (perk) => {
  const points = toInt(hero.value.perkPoints);
  const maxLevel = toInt(perk.maxLevel[hero.value.treeTier]);
  const currentLevel = toInt(perk.level);

  if (points > 0 && currentLevel < maxLevel) {
    hero.value.perkPoints = points - 1;
    perk.level = currentLevel + 1;
  }
};

const infPerk = (perk) => {
  if (perk.id === 7 || perk.id === 10 || perk.id === 14) return;

  hero.value.capInfPerks = toInt(hero.value.infTier) + 1;

  const infActiveCount = perks.value.filter(p => p.infStatus).length;
  if (perk.infStatus || hero.value.capInfPerks > infActiveCount) {
    perk.infStatus = !perk.infStatus;
    const level = toInt(perk.level);

    if (perk.infStatus) {
      hero.value.perkPoints = toInt(hero.value.perkPoints) + level;
    } else {
      hero.value.perkPoints = toInt(hero.value.perkPoints) + toInt(totalInfCost(perk)) * level;
    }

    perk.level = 0;
  }
};

const infCost = (perk) => {
  let cost = totalInfCost(perk);
  return `${cost}P`
}

const totalInfCost = (perk) => {
  return Math.floor(perk.baseCost * getMult());
}

const infUpgrade = (perk) => {
  const cost = totalInfCost(perk);
  const points = toInt(hero.value.perkPoints);
  if (points >= cost) {
    perk.level = toInt(perk.level) + 1;
    hero.value.perkPoints = points - cost;
  }
};

const infMaxUpgrade = (perk) => {
  const cost = totalInfCost(perk);
  const points = toInt(hero.value.perkPoints);
  if (points <= 0 || cost <= 0) return;
  const count = toInt(points / cost);

  perk.level = toInt(perk.level) + count;
  hero.value.perkPoints = points - cost * count;
};

const maxUpgrade = (perk) => {
  const maxUp = toInt(perk.maxLevel[hero.value.treeTier]) - toInt(perk.level);
  const available = toInt(hero.value.perkPoints);

  const up = Math.min(maxUp, available);
  perk.level = toInt(perk.level) + up;
  hero.value.perkPoints = available - up;
};

const resetPerks = () => {
  for (const perk of perks.value) {
    if (perk.name !== "Invisible" && perk.name !== "Traveller") {
      perk.level = 0;
    }
  }

  const basePoints = toInt(hero.value.freeTreePoints) +
    toInt(hero.value.eLevel) *
    ((hero.value.infTier >= 1 || hero.value.infEvents >= 1) ? 2 : 1);

  hero.value.perkPoints = Math.max(0, basePoints);
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

  if(perk.id == 7 || perk.id == 10 || perk.id == 11 || perk.id == 12 || perk.id == 14 || perk.id == 17)
    return "";
  
  if(perk.id == 15)
    return "TOTAL: " + (1 + 0.2 * perk.level).toFixed(2);

  if(perk.id == 16)
    return "TOTAL: " + (perk.value ** perk.level).toFixed(2);

  if(perk.id == 20)
    return "TOTAL: " + (2 - 1.04 ** hero.value.treeTier).toFixed(2);

  return "TOTAL: " + (perk.value * perk.level);
}

function descriptionPerks(perk) {
let softAttack = 1.01 ** (139.3 + 10 * (dimensions.value[40].infTier - 40));
let healEffect = Math.min(1 + 1 * (dimensions.value[40].infTier - 40), 10);

let stunEffect = 30 + 1 * (dimensions.value[40].infTier - 40);
let stunDuration = (0.5 + 0.05 * (dimensions.value[40].infTier - 40));

let levelUp = 10 + 1 * (dimensions.value[40].infTier - 40);
let maxLevelMult = 1.1 + 0.01 * (dimensions.value[40].infTier - 40);
let aps = 0.1 + 0.01 * (dimensions.value[40].infTier - 40);

let radDescription = [
    `+1.01 MULT DMG per each killed enemy [Softcap - ${softAttack.toFixed(2)}]`,
    `+${healEffect}% HEAL from Max HP per second`,
    `When you were attacked, ${stunEffect}% TO STUN ENEMY FOR ${stunDuration.toFixed(2)} SECONDS`,
    `Level Rush - +${levelUp}%.(S)`,
    `x${maxLevelMult.toFixed(2)} Global Max Level Mult`,
    `+${aps.toFixed(2)} Attack per Second for each boss killed [Max - 1.5]`
  ]

  return perk.status? radDescription[perk.id - 1]: perk.description;
}

const radiationPerks = (perk) => {
  const maxActivePerks = (radPerks[7].level? 1: 0) + (ascendPerks[64].level? 1: 0); 

  const activeCount = treePerks.value.filter(p => p.status).length;

  if (!perk.status) {
    if (activeCount < maxActivePerks) {
      perk.status = true;
      hero.value.perkPoints += perk.level;
      perk.level = 0;
    }
  } else {
    perk.status = false;
    perk.kills = 0;
  }
};


function getMult() {
  let mult = (dimensions.value[6] && dimensions.value[6].infTier === dimensions.value[6].maxInfTier) ? 0.9 : 1;
  mult *= 1 - dimensions.value[35].infTier * 0.01;
  mult *= (hero.value.dId == 'd-noTree'? 2 + 0.25 * dimensions.value[35].infTier : 1);
  mult *= (hero.value.darkId.includes('d-noTree')? 2 - 0.02 * dimensions.value[35].infTier: 1);

  return mult;
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
