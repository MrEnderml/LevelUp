<template>
  <div class="buffs-panel">
    <h2 class="buffs-header" @click="hero.eLink = { set: 'Info', info: 'Buffs' }">
      <span class="info-icon">ℹ️</span> Skills
    </h2>

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

    <div class="buff-status">
      <span style="color:#fbbf24">
        Active: {{ hero.battleContent[hero.battleId].player.buff.activeBuffs.length }} / {{ hero.maxBuffs }}
        <span v-if="hero.battleContent[hero.battleId].player.buff.overflowCount > 0" class="overflow-count">
          [+{{ hero.battleContent[hero.battleId].player.buff.overflowCount }} ]
        </span>
      </span>
    </div>

    <div class="layout-switcher">
      <div v-for="(layout, index) in hero.buffLayouts" :key="index">
        <button
          :class="{ 
            selected: index === hero.battleContent[hero.battleId].player.buff.selectedLayoutIndex,
          }"
          @click="onLayoutClick(index)"
          :disabled="!layout.unlocked"
        >
          <Tooltip :text="() => layoutUnlocked(index)" boxShadow="0 0 10px orange" position="right">
            {{ layout.name }}
          </Tooltip>
        </button>
      </div>
    </div>

    <div class="buffs-container"> 

      <div class="buffs-grid">
        <div
          class="buff-card"
          v-for="buff in filterBuffs"
          :key="buff.id"
          :class="{
                  selected: hero.battleContent[hero.battleId].player.buff.activeBuffs.includes(buff.id),
                  overflow: hero.battleContent[hero.battleId].player.buff.overflowBuffs.includes(buff.id)
                  }"
          @click="toggleBuff(buff.id)"
        >
          <h3 class="buff-name">
            <strong>{{ buff.name }} [T{{ buff.tier + buff.extraTier }}]</strong>

            <Tooltip :text="() => 'View full Skill details'" maxWidth="125px">
              <button class="info-btn" @click.stop="openInfo(buff)">
                ℹ
              </button>
            </Tooltip>

            <span
              v-if="getPriority(buff.id)"
              class="buff-priority-label"
            >
              [P{{ getPriority(buff.id) }}]
            </span>

            <span
              v-if="hero.battleContent[hero.battleId].player.buff.overflowBuffs.includes(buff.id)"
              class="buff-overflow-label"
            >
              OVERFLOW
            </span>

          </h3>
          <div class="exp-bar">
              <div class="exp-fill" :style="{ width: (buff.exp / buffExpShow(buff)) * 100 + '%' }"></div>
              <div class="exp-text">{{fn(buff.exp)}}/{{fn(buffExpShow(buff))}}</div>
          </div>
          <transition name="fade" mode="out-in">
            <div :key="buff.tier" class="buff-description">
              <p>
                <strong>[T{{ buff.tier }}]: {{ buffDesc(buff, buff.tier - 1) }}</strong>
              </p>
              <p>
                [T{{ buff.tier + 1 }}]: {{ buffDesc(buff, buff.tier) }}
              </p>
            </div>
          </transition>

        </div> 
      </div>

    </div>
    
  </div>

  <div v-if="hero.buff.showLayoutEditor" class="modal-overlay">
    <div class="modal-box">
      <h3>Edit Layout <span v-if="hero.buff.editLayout" style="color: lightgreen">[Edit buffs...]</span></h3>
      
      <input
        v-model="hero.buff.layoutNameInput"
        maxlength="15"
        placeholder="Layout name (max 15 chars)"
        @input="validateInput"
      />
      <p class="input-warning" v-if="inputError">{{ inputError }}</p>

      <div class="modal-actions">
        <button @click="confirmLayoutEdit" :disabled="!!inputError">Save</button>
        <button @click="resetLayoutEdit">Reset</button>
        <button @click="cancelLayoutEdit">Cancel</button>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div v-if="infoBuff" class="buff-info-global" @click.stop>
      <div class="buff-info-header">
        <h2>{{ infoBuff.name }} {{ infoBuff.awaken? '[Awakened]': '' }}</h2>
        <button class="close-btn" @click="infoBuff = null">✖</button>
      </div>

      <div class="buff-over-wrapper">
        <div
          v-for="t in infoBuff.tier"
          :key="t"
          class="buff-tier-line"
        > 
          <div class="tier-row">
            <div class="tier-main">
              <span class="tier-badge">T{{ t }}</span>
              <span class="tier-desc">{{ buffDescByTier(infoBuff, t) }}</span>
            </div>

            <span 
              v-if="buffInfoByTier(infoBuff, t)?.trim()" 
              class="info-desc"
            >
              {{ buffInfoByTier(infoBuff, t) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>


</template>

<script setup>
import { reactive, computed, ref, watchEffect, watch, onMounted, onBeforeUnmount } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { dimensions } from '../../data/dimensions.js';
import { perks } from '../../data/ascension.js';

import { useBuffs } from '../../composables/battleUtils/useBuffs.js';
import SvgIcon from '../svgIcon.vue';

const {
  onLayoutClick,
  layoutUnlocked,
  confirmLayoutEdit,
  resetLayoutEdit,
  cancelLayoutEdit,
  toggleBuff,
  overflowBuffs,
  getMaxBuffs,
  getPriority,
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useBuffs();

import { fn } from "../../composables/utils/global.js";

const { hero } = useHero();
const { enemy } = useEnemy();
const { buffs } = useBuff();

const inputError = ref('');
const infoBuff = ref(null);


function buffDescByTier(buff, tier) {
  return buff.description[tier-1];
}

function buffInfoByTier(buff, tier) {
  return buff.info[tier-1];
}


const filterBuffs = computed(() => 
  buffs.value.filter(b => b.active === true)
)


function buffDesc(buff, tier) {
  if(buff.id == 6)
    return buffCharge(buff, tier)

  if (tier >= buff.description.length - 1)
    return "Max Tier";

  if (tier >= buff.maxTier && buff.maxTier < buff.description.length && buff.nextTierReq)
    return `Next Tier Requirement: ${buff.nextTierReq}`;
  
  return buff.description[tier] || '';  
}

function buffExpShow (buff) {
  if (!buff.awaken)
    return buff.maxExp[buff.tier - 1];
  else return buff.maxAwakenExp;
}


function buffCharge(buff, tier = 0){
  if(buff.id != 6)
    return buff.description[buff.tier];
  let str = `${1 + 1 * tier}% to gain random Charge, when you hit. You lose all charges on death; +1 Max Charge per Tier; Max Charges: ${tier + 1}; Max Skill Tier depends on Singularity Tier`
  
  return str;
}

function validateInput() {
        const name = hero.value.buff.layoutNameInput.trim();
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

function openInfo(buff) {
  if(buff.id == 6)
    return;

  infoBuff.value = (infoBuff.value == null? buff: null);
}

function getBuffName(id) {
        const buff = buffs.value.find(b => b.id === id);
        return buff ? buff.name : `Unknown [${id}]`;
}

getMaxBuffs();

</script>


<style scoped>


.buffs-panel {
  box-sizing: border-box;
  height: 100dvh; 
  padding: clamp(12px, 2vh, 24px);

  border-radius: 0; 
  box-shadow: none;

  background-color: #1a1a1a;
  color: #fff7db;


  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.5vh, 18px);

  overflow: hidden;
}

.buffs-container {
  scrollbar-width: thin;
  scrollbar-color: rgb(246, 226, 47) transparent;
  overflow-y: auto;

  width: 100%;
}

.buffs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, max-content));
  gap: 15px;
}


.buffs-header {
  display: flex;
  color: #fbbf24;            
  text-shadow: 0 0 6px rgba(255, 191, 0, 0.7);
}

.buffs-header .info-icon {
  font-size: 0.55rem;       
  vertical-align: middle;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
}

.buffs-header:hover .info-icon {
  transform: scale(1.2);    
}

.buff-status {
  display: flex;
}

.layout-switcher {
  display: flex;
  gap: 8px;
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


.overflow-count {
  color: #ef4444;
  margin-left: 6px;
  font-weight: 600;
}


.buff-card {
  position: relative;
  background-color: #1f2937;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  height: auto;
  overflow: hidden; 
  box-sizing: border-box; 
}

.buff-card:hover {
  border-color: #f59e0b;
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

.buff-card.overflow {
  border-color: #ef4444;
  box-shadow: 0 0 10px rgba(239,68,68,0.5);
  animation: overflowPulse 1.5s infinite;
  background: linear-gradient(
    135deg,
    rgba(239,68,68,0.15),
    rgba(0,0,0,0.3)
  );
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

  text-shadow: 0 0 2px rgba(0, 0, 0, 0.9), 0 0 4px rgba(0, 0, 0, 0.8);
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

@keyframes overflowPulse {
  0% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4)
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.8)
  }
  100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4)
  }
}


.buff-priority-label {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(251,191,36,0.2);
  color: #fbbf24;
  font-weight: 700;
}

.buff-overflow-label {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px;
  color: #fecaca;
  opacity: 0.7;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
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


.info-btn {
  border: 1px solid #fbbf24; 
  background-color: #1e1e2f; 
  color: #fbbf24; 
  font-weight: 600;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.info-btn:hover {
  background-color: #fbbf24;
  color: #1a1a1a;
  transform: scale(1.2);
  box-shadow: 0 0 8px #fbbf24;
}


.buff-info-global {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(145deg, #1e1e2f, #2b2b3b);
  color: #fff7db;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(255, 191, 0, 0.5);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.buff-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.buff-info-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fbbf24;
  margin: 0;
}

.close-btn {
  background: transparent;
  padding: 0.5em;
  border: none;
  color: #fbbf24;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

.buff-over-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.buff-tier-line {
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 191, 0, 0.05);
  border-radius: 6px;
}

.tier-badge {
  display: inline-block;
  min-width: 36px;
  text-align: center;
  font-weight: bold;
  color: #fbbf24;
  background: rgba(255, 191, 0, 0.2);
  border-radius: 4px;
  padding: 0.15rem 0.4rem;
  flex-shrink: 0;
}

.tier-desc {
  flex: 1;
  color: #fff7db;
  font-size: 0.95rem;
  line-height: 1.3;
}

.info-desc {
  display: block;
  font-size: 11px;
  opacity: 0.7;
  margin-top: 2px;
  line-height: 1.3;
}

.tier-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

.tier-main {
  display: flex;
  align-items: center; 
  gap: 6px;
}



/* MINI CARD */
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
  cursor: default;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: inset 0 0 6px rgba(255,255,255,0.08);
}

.effect-S { color: #f1d33c; box-shadow: 0 0 6px #a29555; }
.effect-O { color: #d96128; box-shadow: 0 0 6px #894e33; }
.effect-P, .effect-E { color: #fbbf24; box-shadow: 0 0 6px #a1853c; }

</style>