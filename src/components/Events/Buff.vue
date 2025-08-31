<template>
  <div class="buffs-panel">
    <h2 @click="hero.eLink = { set: 'Info', info: 'Buffs' }">🌀 <sup style="font-size: 12px">ℹ️</sup>Buffs</h2>
    <span><strong>Note: </strong>You will not be able to change the buff after Stage 10. For more information, click on [ℹ️]. </span>
    <div class="buff-status">
    <div>
      <span style="color: #fbbf24">Active: {{ hero.activeBuffs.length }} / {{ hero.maxBuffs }}</span>
      <span v-if="hero.abyssTier >= 3 && hero.rebirthPts >= 100000" style="color: #66ffcc">  -  Active: {{hero.spActiveBuffs.length}} / {{hero.maxBuffs - (hero.rebirthTier >= 15 && hero.isAbyss? 1: 0) + (hero.spCount >= 43? 1: 0)}}</span>
    </div>
    <button
        v-if="hero.abyssTier >= 3 && hero.rebirthPts >= 100000"
        class="space-button"
        :class="{ active: hero.isSpaceBuff }"
        @click="spaceSwitch()"
      >
        Space
      </button>
    </div>

    <div class="layout-switcher">
      <div v-for="(layout, index) in hero.buffLayouts" :key="index">
        <button
          :class="{ selected: index === hero.selectedLayoutIndex }"
          @click="layout.unlocked && applyLayout(index)"
          @dblclick="layout.unlocked && openLayoutEditor(index)"
          :disabled="!layout.unlocked"
        >
        <Tooltip :text="layoutUnlocked(layout)" boxShadow="0 0 10px orange">
          {{ layout.name }}
        </Tooltip>
        </button>
      </div>
    </div>

    <div class="buffs-grid">
      <div
        class="buff-card"
        v-for="buff in filterBuffs"
        :key="buff.id"
        :class="{
                  selectedmix: hero.activeBuffs.includes(buff.id) && hero.spActiveBuffs.includes(buff.id),
                  selected: hero.activeBuffs.includes(buff.id) && !hero.spActiveBuffs.includes(buff.id),
                  spselected: hero.spActiveBuffs.includes(buff.id) && !hero.activeBuffs.includes(buff.id)
                }"
        @click="toggleBuff(buff.id)"
      >
        <h3 class="buff-name">
          <strong>{{ buff.name }} [T{{ buff.tier }}]</strong>
            <Tooltip :text="'This buff cannot affect some high-tier creatures'" maxWidth="125px" position="left" boxShadow="0 0 10px orange">
              <span v-if='buff.id == 16'>⚠️</span>
            </Tooltip>
            <Tooltip :text="'You gain the loot from only first killed enemy'" maxWidth="100px" position="left" boxShadow="0 0 10px orange">
              <span v-if='buff.id == 7'>⚠️</span>
            </Tooltip>
        </h3>
        <div class="exp-bar">
            <div class="exp-fill" :style="{ width: (buff.exp / buff.maxExp[buff.tier-1]) * 100 + '%' }"></div>
            <div class="exp-text">{{formatNumber(buff.exp)}}/{{formatNumber(buff.maxExp[buff.tier-1])}}</div>
        </div>
        <transition name="fade" mode="out-in">
          <div :key="buff.tier" class="buff-description">
            <p>
              <strong>[T{{ buff.tier }}]: {{ buffD(buff) }}</strong>
            </p>
            <p>
              [T{{ buff.tier + 1 }}]: {{ buffNextTierD(buff) }}
            </p>
          </div>
        </transition>
       </div> 
    </div>
  </div>

  <div v-if="showLayoutEditor" class="modal-overlay">
    <div class="modal-box">
      <h3>Edit Layout <span v-if="editLayout" style="color: lightgreen">[Edit buffs...]</span></h3>
      
      <input
        v-model="layoutNameInput"
        maxlength="15"
        placeholder="Layout name (max 15 chars)"
        @input="validateInput"
      />
      <p class="input-warning" v-if="inputError">{{ inputError }}</p>

      <p><strong>Normal Buffs:</strong></p>
      <div class="buff-columns">
        <div class="column" v-for="col in splitBuffs(hero.buffLayouts[layoutBeingEdited]?.buffs)">
          <div v-for="id in col" :key="'buff-' + id">
            • {{ getBuffName(id) }}
          </div>
        </div>
      </div>

      <p><strong>Space Buffs:</strong></p>
      <div class="buff-columns">
        <div class="column" v-for="col in splitBuffs(hero.buffLayouts[layoutBeingEdited]?.spBuffs || [])">
          <div v-for="id in col" :key="'spbuff-' + id">
            • {{ getBuffName(id) }}
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button @click="confirmLayoutEdit" :disabled="!!inputError">✅ Save</button>
        <button @click="editLayoutEdit">✏️ Edit</button>
        <button @click="cancelLayoutEdit">❌ Cancel</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { reactive, computed, ref, watchEffect, watch } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { dimensions } from '../../data/dimensions.js';
import { perks } from '../../data/ascension.js';

const { hero } = useHero();
const { enemy } = useEnemy();
const { buffs } = useBuff();



const selectedLayoutIndex = ref(0);
const showLayoutEditor = ref(false);
const layoutBeingEdited = ref(null);
const editLayout = ref(false);
const layoutNameInput = ref('');
const inputError = ref('');

function layoutUnlocked(layout) {
  if (layout.unlocked) return "";

  if (layout.id === 1 && hero.value.singularity < 5) {
    return "Unlock at Singularity [T5]";
  }
  if (layout.id === 2 && hero.value.mainInfTier < 30) {
    return "Unlock at Infinity [T30]";
  }

  return "";
}


const filterBuffs = computed(() => 
    buffs.value.filter(b => b.active === true)
)

const getActiveDescriptions = (buff) => {
  return buff.description.slice(0, buff.tier); 
};

function buffD(buff){
  if(buff.id == 6)
    return buffCharge(buff)

  specialBuffs(buff)
  
  return buff.description[buff.tier-1];
}

function buffNextTierD(buff) {
  if (buff.id == 6)
    return buffCharge(buff, 1);

  specialBuffs(buff)

  const nextTier = buff.tier;
  const maxTier = buff.maxTier;

  if (nextTier >= buff.description.length - 1)
    return "Max Tier";

  if (nextTier >= maxTier && buff.maxTier < buff.description.length && buff.nextTierReq)
    return `Next Tier Requirement: ${buff.nextTierReq}`;


  return buff.description[nextTier] || '';
}

function specialBuffs(buff){
  if(buff.id == 7 && buff.tier == 4)
    return `${10 + 5 * (dimensions.value[19].infTier == dimensions.value[19].maxInfTier? 1: 0)}% to gain EXP and WEAPON CHANCE for each overkilled Enemy`
  
  if(buff.id == 10 && buff.tier == 1)
    buff.description[0] = `${35 + 5 * dimensions.value[4].infTier}% to RISE UP after death with 50% HP. Does not work on the same enemy twice.`
}

function buffCharge(buff, tier = 0){
  if(buff.id != 6)
    return buff.description[buff.tier];
  let str = `[Charges Info in Info->Buff Section] ${25 + 1 * (buff.tier - 1 + tier)}% to gain random Charge, when you hit. ${50 - 2*(buff.tier - 1 + tier)}% to lost random Charge when you were hit; Max Charges: ${buff.tier + tier};`
  
  return str;
}

const toggleBuff = (id) => {
  if(hero.value.isSpaceBuff && enemy.value.isSpaceFight <= 0){
    const index = hero.value.spActiveBuffs.indexOf(id);
    if (index !== -1) {
      hero.value.spActiveBuffs.splice(index, 1);
    } else if (hero.value.spActiveBuffs.length < hero.value.maxBuffs - (hero.value.rebirthTier >= 15 && hero.value.isAbyss? 1: 0) + (hero.value.spCount >= 43? 1: 0)) {
      hero.value.spActiveBuffs.push(id);
    }
  } else if(hero.value.stage < 10 + 10 * hero.value.abyssTier && !hero.value.isTravell && (!hero.value.soulD || hero.value.dId == 'soulD') || 
  perks[57].level){
    const index = hero.value.activeBuffs.indexOf(id);
    if (index !== -1) {
      hero.value.activeBuffs.splice(index, 1);
    } else if (hero.value.activeBuffs.length < hero.value.maxBuffs) {
      hero.value.activeBuffs.push(id);
    }
  }
};

function spaceSwitch() {
  hero.value.isSpaceBuff = !hero.value.isSpaceBuff? true: false;
}



//-------layout edit
function openLayoutEditor(index) {
  layoutBeingEdited.value = index;
  layoutNameInput.value = hero.value.buffLayouts[index].name;
  showLayoutEditor.value = true;
}

function confirmLayoutEdit() {
  if (layoutBeingEdited.value !== null && layoutNameInput.value.trim() !== '') {
    hero.value.buffLayouts[layoutBeingEdited.value].name = layoutNameInput.value.trim();
  }
  showLayoutEditor.value = false;
  editLayout.value = false;

  saveCurrentToLayout();
}

function cancelLayoutEdit() {
  showLayoutEditor.value = false;
}

const editLayoutEdit = () => {
  editLayout.value = true;
  cancelLayoutEdit();
};

function getBuffName(id) {
  const buff = buffs.value.find(b => b.id === id);
  return buff ? buff.name : `Unknown [${id}]`;
}

function splitBuffs(buffIds) {
  const half = Math.ceil(buffIds.length / 2);
  return [buffIds.slice(0, half), buffIds.slice(half)];
}


function validateInput() {
  const name = layoutNameInput.value.trim();
  if (!name) {
    inputError.value = 'Name cannot be empty.';
  } else if (/[^a-zA-Z0-9 _-]/.test(name)) {
    inputError.value = 'Only letters, numbers, spaces, _ and - allowed.';
  } else if (name.length > 15) {
    inputError.value = 'Max 10 characters.';
  } else {
    inputError.value = '';
  }
}


function applyLayout(index) {
  if(hero.value.selectedLayoutIndex == index)
    return;

  hero.value.selectedLayoutIndex = index;
  const layout = hero.value.buffLayouts[index];

  const availableIds = buffs.value.filter(b => b.active).map(b => b.id);

  const validBuffs = layout.buffs.filter(id => availableIds.includes(id));
  const validSpBuffs = layout.spBuffs.filter(id => availableIds.includes(id));

  const maxNormal = hero.value.maxBuffs;
  const maxSp = maxNormal - (hero.value.rebirthTier >= 15 && hero.value.isAbyss ? 1 : 0) + (hero.value.spCount >= 43 ? 1 : 0);

  hero.value.activeBuffs = validBuffs.slice(0, maxNormal);
  hero.value.spActiveBuffs = validSpBuffs.slice(0, maxSp);
}


function saveCurrentToLayout() {
  const layout = hero.value.buffLayouts[hero.value.selectedLayoutIndex];
  layout.buffs = [...hero.value.activeBuffs];
  layout.spBuffs = [...hero.value.spActiveBuffs];
}

watchEffect(() => {
  if(editLayout.value)
    return;

  const layout = hero.value.buffLayouts[hero.value.selectedLayoutIndex];

  const unlocked = buffs.value.filter(b => b.active).map(b => b.id);

  const maxNormal = hero.value.maxBuffs;
  const maxSp = maxNormal - (hero.value.rebirthTier >= 15 && hero.value.isAbyss ? 1 : 0) + (hero.value.spCount >= 43 ? 1 : 0);

  const missingNormal = layout.buffs.filter(id =>
    unlocked.includes(id) && !hero.value.activeBuffs.includes(id)
  );

  const missingSp = layout.spBuffs.filter(id =>
    unlocked.includes(id) && !hero.value.spActiveBuffs.includes(id)
  );

  if (hero.value.activeBuffs.length < maxNormal)
    hero.value.activeBuffs.push(...missingNormal.slice(0, maxNormal - hero.value.activeBuffs.length));

  if (hero.value.spActiveBuffs.length < maxSp)
    hero.value.spActiveBuffs.push(...missingSp.slice(0, maxSp - hero.value.spActiveBuffs.length));
});



function formatNumber(num) {
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


.buffs-panel {
  background-color: #1a1a1a;
  padding: 1rem;
  border-radius: 1rem;
  color: #fff7db;
  box-shadow: 0 0 10px rgba(255, 191, 0, 0.2);
  width: 70%;
  position: fixed;
  top: 5%;
  right: 5%;
}

.buffs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  overflow-y: auto;
  max-height: 500px;
  padding: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.buff-card {
  background-color: #1f2937;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  height: auto;
  width: 100%; /* Карточка займет всю доступную ширину до max-width */
  overflow: hidden; /* Если текст выходит за пределы, скрывать */
  box-sizing: border-box; /* Чтобы padding не увеличивал размер элемента */
}

.buff-card:hover {
  border-color: #f59e0b;
  transform: translateY(-2px);
}

.buff-card.spselected:hover {
  border-color: rgb(11, 210, 245);
  transform: translateY(-2px);
}

.buff-description {
  max-height: 140px; 
  overflow-y: auto; 
  padding-right: 5px; 
  scrollbar-width: thin;
  scrollbar-color: rgb(246, 226, 47) transparent;
}

.buff-card.selected {
  border-color: #fbbf24;
  box-shadow: 0 0 12px rgba(255, 191, 0, 0.6);
  animation: pulse 1.5s infinite;
  background: linear-gradient(145deg, #2b2b2b, #3b3b3b);
}

.buff-card.spselected {
  border-color: #66ffcc;
  box-shadow: 0 0 12px rgba(102, 255, 204, 0.66);
  animation: sppulse 1.5s infinite;
  background: linear-gradient(145deg, #2b2b2b, #3b3b3b);
}

.buff-card.selectedmix {
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #fbbf24, #66ffcc) 1;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #2b2b2b, #3a3a3a);
  animation: mixpulse 1.5s infinite;
  position: relative;
}


.buff-card h3 {
  color: #fde68a;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.buff-card p {
  font-size: 0.85rem;
  color: #fef3c7;
}

.buff-name {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: help;
  color: #facc15; /* Жёлтый */
  font-weight: bold;
}

.tooltip-content {
  visibility: hidden;
  width: 180px;
  background-color: #1e293b;
  color: #f8fafc;
  text-align: left;
  border-radius: 8px;
  padding: 0.75rem;
  position: fixed;
  z-index: 10;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  word-wrap: break-word;
  border: 1px solid #facc15; /* Добавляем синюю обводку */
  max-height: 120px;
  overflow-y: auto;
}

.tooltip-container:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.exp-bar {
  position: relative;
  background-color: #4b5563;
  height: 14px;
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  transition: width 0.4s ease-in-out;
}

.exp-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #fff7db;
  line-height: 14px;
  pointer-events: none;
}

@keyframes sppulse {
  0% {
    box-shadow: 0 0 10px rgba(102, 255, 204, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 255, 204, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(102, 255, 204, 0.4);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(255, 191, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 191, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 191, 0, 0.4);
  }
}

@keyframes mixpulse {
  0% {
    box-shadow: 0 0 10px rgba(255, 223, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 255, 204, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 223, 128, 0.4);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  box-shadow: 0 0 10px rgba(255, 191, 0, 0.8);
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

.space-button {
  background-color: transparent;
  border: 2px solid #66ffcc;
  color: #66ffcc;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.space-button:hover {
  background-color: #66ffcc;
  color: #1a1a1a;
  box-shadow: 0 0 10px rgba(102, 255, 204, 0.6);
}

.space-button.active {
  background-color:rgba(81, 245, 190, 0.9);
  color: #1a1a1a;
  box-shadow: 0 0 15px rgba(102, 255, 204, 0.73);
}

.buff-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}





.layout-switcher {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.layout-switcher button {
  background: #222;
  color: white;
  border: 1px solid #666;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.layout-switcher button.selected {
  background: #0ff;
  color: #000;
}



.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: #222;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  color: white;
}

.modal-box input {
  width: 100%;
  margin-bottom: 10px;
  padding: 4px 6px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #111;
  color: #fff;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.input-warning {
  color: #ff6666;
  font-size: 12px;
  margin-top: -6px;
  margin-bottom: 10px;
}

.buff-columns {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}


</style>