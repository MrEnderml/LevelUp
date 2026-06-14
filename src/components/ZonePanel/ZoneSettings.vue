<template>
<div class="lock-stage-wrapper">
      <!-- Idle system button -->
      <Tooltip :text="() => 'Idle system: Locks the stage to prevent automatic progression'">
        <button class="lock-stage-button" @click="toggleLockStage">
          <span v-if="hero.isLocked" class="spinner"></span>
          <span v-else class="spinner fspinner"></span>
          <span class="button-text">{{ hero.isLocked ? 'Locked' : 'Unlocked' }}</span>
        </button>
      </Tooltip>

      <Tooltip :text="() => ''">
        <button v-if="getDimSpecialReward(3)" class="lock-stage-button" @click="modalsHandler('stage')">
          <span class="icon">🌍</span>
          <span class="button-text">Stage</span>
        </button>
      </Tooltip>

        <Tooltip :text="() => ''">
          <button v-if="hero.infExpansions.tree" class="lock-stage-button" @click="modalsHandler('auto')">
            ⚙️ Auto Settings
          </button>
        </Tooltip>

        <Tooltip :text="() => ''">
          <button v-if="getDimSpecialReward(7)" class="lock-stage-button" @click="modalsHandler('afk')">
            <span class="icon">🕒</span>
            <span class="button-text">SOT</span>
          </button>
        </Tooltip>

        <Tooltip :text="() => 'Pause or resume the game'">
          <button class="lock-stage-button" @click="hero.isPaused = !hero.isPaused">
            <span v-if="hero.isPaused">▶️ Resume</span>
            <span v-else>⏸️ Pause</span>
          </button>
        </Tooltip>

      <div>

      </div>

      <div v-if="showStageModal" @click.self="showStageModal = false">
        <div class="stage-modal">
          
          <h3> Stage Travel</h3>

          <div class="stage-input-group">
            <input
              type="number"
              v-model.number="targetStage"
              :max="hero.maxStage"
              placeholder="Enter stage..."
            />

            <button @click="travelToStage">
              Travel
            </button>
          </div>

          <div class="stage-info">
            <p>
              Max Stage:
              <span class="highlight">{{ hero.maxStage }}</span>
            </p>
          </div>

          <div class="stage-warning">
            <p>
              Enemies become stronger as you travel. Their strength will return to normal over time.
            </p>
            <p>
              Stage Rush and Ascension Shards are disabled until the next reset.
            </p>
            <p v-if="travellBlock.includes(hero.dId)">
              Stage Travell does not work in this dimension
            </p>
            <p v-if="hero.dId.startsWith('d-')">
              In the dark dimensions, the penalty for travel is much greater.
            </p>
          </div>

        </div>
      </div>

      <div v-if="showAfkModal" class="stage-modal">
          <h3>🕒 Stored Offline Time</h3>

          <div class="afk-bar-container">
            <div class="afk-bar" :style="{ width: `${afkPercent}%` }"></div>
            <span class="afk-time">{{ timeFormat(Math.floor(hero.settings.storedTime)) }}</span>
          </div>

          <div class="afk-controls">
            <label for="afkPercentInput">Use %:</label>
            <input
              id="afkPercentInput"
              type="number"
              v-model.number="hero.afkSpendPercent"
              min="1"
              max="100"
            />
            <button @click="useAfkTime">Use</button>
          </div>

            <div class="stage-warning">
              <p>
                Store your offline time and use it when needed. Stored Offline Time accumulates as usual. When using time, you spend a percentage of your current time.<br>
                <b>Note: When storing offline time, you earn half as much time as with regular offline time.</b><br>
                <b>Turn on time accumulation in Setting Panel</b>
              </p>
            </div>
      </div>

      <div v-if="showAutoModal" class="auto-settings-modal">
        <div class="auto-panel">
          <label>
            Stage Rush:

            <button
              class="toggle-btn"
              :class="{ active: hero.stageRush.active }"
              @click="hero.stageRush.active = !hero.stageRush.active"
            >
              {{ hero.stageRush.active ? "ON" : "OFF" }}
            </button>
          </label>
          
          <label>
            <Tooltip :text="() => stageTooltip(8)" position="right" maxWidth="150px">
              Auto-Leave
            </Tooltip>
            
            <button
              class="toggle-btn"
              :class="{ active: hero.settings.autoLeave }"
              @click="hero.settings.autoLeave = !hero.settings.autoLeave"
            >
              {{ hero.settings.autoLeave ? "ON" : "OFF" }}
            </button>
          </label>
        </div>

        <div class="auto-panel" v-if="hero.infExpansions.ascensioin">
          <h4>🌌 Auto Ascension</h4>
          <label>
            <Tooltip :text="() => stageTooltip(6)" position="right" maxWidth="100px">
              Min Shards:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.ascensionMinShards" />
          </label>
          <label>
            <Tooltip :text="() => stageTooltip(7)" position="right" maxWidth="100px">
              Min Stage:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.ascensionMinStage" />
          </label>
        </div>

        <div class="auto-panel" v-if="hero.infExpansions.rebirth">
          <h4>♻️ Auto Rebirth</h4>
          <label>
            <Tooltip :text="() => stageTooltip(3)" position="right" maxWidth="100px">
              Min Rebirth Pts:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.rebirthMinPts" />
          </label>
          <label>
            <Tooltip :text="() => stageTooltip(4)" position="right" maxWidth="100px">
              Min Level(100+):
            </Tooltip>
            
            <input type="number" v-model.number="autoTemp.rebirthMinLevel" />
          </label>
          <label>
            <Tooltip :text="() => stageTooltip(5)" position="right" maxWidth="100px">
              Level+:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.rebirthMinLevelNext" />
          </label>
        </div>

        <div class="auto-panel">
          <h4>⚔️ Stop at Stage</h4>
          <label>
            <Tooltip :text="() => stageTooltip(0)" position="right" maxWidth="100px">
              Stage to Stop:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.stopStage" />
          </label>
          <label>
            <Tooltip  :text="() => stageTooltip(1)" position="right" maxWidth="100px">
              Stage+:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.stopStageNext" />
          </label>
          <label>
            <Tooltip :text="() => stageTooltip(2)" position="right" maxWidth="100px">
              Stop Until Kills:
            </Tooltip>
            <input type="number" v-model.number="autoTemp.stopUntilKills" />
          </label>
        </div>

        <div class="modal-buttons">
          <button @click="applyAutoSettings">Apply</button>
          <button @click="showAutoModal = false">Cancel</button>
          <button @click="resetSettings">Reset</button>
        </div>
      </div>


    </div>
</template>


<script setup>
import { computed, reactive, ref, watch} from 'vue';
import { useHero } from '../../composables/useHero.js';
import { dimensions } from '../../data/dimensions.js';

import SvgIcon from '../svgIcon.vue';
import { getSvgIconHTML } from "../../composables/svgIcon.js"
import { fn, timeFormat } from '../../composables/utils/global.js';
import { auto, autoTemp } from "../../composables/autoProgression.js";
import { useDimensions } from '../../composables/battleUtils/useDimensions.js';
import { loading } from '../../composables/utils/loading.js';

const { hero } = useHero();

const { afkTimeHandle } = loading();

const { 
  getDimSpecialReward
} = useDimensions();

const emit = defineEmits(['close']);

const closeModal = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};

const showStageModal = ref(false);
const showAfkModal = ref(false);
const showAutoModal = ref(false);

function applyAutoSettings() {
  auto.value.ascension.minShards = autoTemp.value.ascensionMinShards;
  auto.value.ascension.minStage = autoTemp.value.ascensionMinStage;

  auto.value.rebirth.minPts = autoTemp.value.rebirthMinPts;
  auto.value.rebirth.minLevel = autoTemp.value.rebirthMinLevel;
  auto.value.rebirth.minLevelNext = autoTemp.value.rebirthMinLevelNext;

  auto.value.stop.stage = autoTemp.value.stopStage;
  auto.value.stop.stageNext = autoTemp.value.stopStageNext;
  auto.value.stop.untilKills = autoTemp.value.stopUntilKills;
}

function resetSettings() {
  auto.value.ascension.minShards = 0;
  auto.value.ascension.minStage = 0;

  autoTemp.value.ascensionMinShards = 0;
  autoTemp.value.ascensionMinStage = 0;


  auto.value.rebirth.minPts = 0;
  auto.value.rebirth.minLevel = 0;
  auto.value.rebirth.minLevelNext = 0;

  autoTemp.value.rebirthMinPts = 0;
  autoTemp.value.rebirthMinLevel = 0;
  autoTemp.value.rebirthMinLevelNext = 0;


  auto.value.stop.stage = 0;
  auto.value.stop.stageNext = 0;
  auto.value.stop.untilKills = 0;

  autoTemp.value.stopStage = 0;
  autoTemp.value.stopStageNext = 0;
  autoTemp.value.stopUntilKills = 0;
}

const targetStage = ref(1);
const travellBlock = ['overstage', 'd-overstage', 'next', 'd-next', 'c-next', 'bh', 'dimMerge'];

function travelToStage() {
  if(hero.value.isSingularity) return;
  if(travellBlock.includes(hero.value.dId)) return;

  targetStage.value = Math.max(Math.min(targetStage.value, hero.value.maxStage), 1);

  hero.value.stages.current = targetStage.value;
  hero.value.travellPenalty = (hero.value.dId.startsWith('d-')? 8: 4);
  hero.value.isTravell = true;
}

const afkPercent = computed(() => (hero.value.settings.storedTime / 86400) * 100);

function useAfkTime() {
  if ( hero.value.settings.storedTime <= 0 || hero.value.afkSpendPercent == 0) return;

  const percent = Math.min(Math.max(hero.value.afkSpendPercent, 0), 100) / 100;
  const usedTime = hero.value.settings.storedTime * percent;

  hero.value.settings.storedTimeUsed = usedTime;
  hero.value.settings.storedTime -= usedTime;

  afkTimeHandle("stored");
}

const toggleLockStage = () => {
    if (!hero.value.isLocked){
        hero.value.isLocked = true;
        hero.value.isStage = false;
    }
    else{
        hero.value.isLocked = false;
        hero.value.isStage = true;
    }
};

const modalsHandler = (modal) => {
  const wasOpen =
    (modal === 'stage' && showStageModal.value) ||
    (modal === 'auto' && showAutoModal.value) ||
    (modal === 'afk' && showAfkModal.value);

  showStageModal.value = false;
  showAutoModal.value = false;
  showAfkModal.value = false;

  if (wasOpen) return;

  if (modal === 'stage') showStageModal.value = true;
  if (modal === 'auto') showAutoModal.value = true;
  if (modal === 'afk') showAfkModal.value = true;
};

function stageTooltip(id) {
  switch(id) {
    case 0: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">This indicator will block the Idle System at a certain stage.</span>`;
    case 1: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">If the indicator [Stop Until Kills] meets its condition, it adds a number to the indicator [Stage to Stop].</span>`;
    case 2: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">This indicator unlocks the Idle System if the corresponding condition is met.</span>`;
    case 3: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Perform Rebirth if you meet the the Rebirth Pts requirements.</span>`;
    case 4: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Perform Rebirth if you meet the the Level requirements.</span>`;
    case 5: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">If you perform Rebirth, it will increase the [Min Level] value by the value that is in [Level+].</span>`;
    case 6: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Perform Ascension if you meet the the Ascension Shards requirements.</span>`;
    case 7: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">Perform Ascension if you meet the the Stage requirements.</span>`;
    case 8: return `<span style="color:#bfbfbf; font-style:italic; font-size:0.95em;">If you encounter a powerful enemy, you can leave the battle after 10 seconds. <b>Leaving the battle is considered death</b>.</span>`
  }
}

</script>

<style scoped>
.lock-stage-wrapper {
  position: relative;
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  margin: 5px;
}

.lock-stage-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #2f2f2f;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 0.85rem;
  z-index: 10;
}


.lock-stage-button:hover {
  background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
  box-shadow: 0 4px 6px rgba(0,0,0,0.5);
}

.spinner {
  width: 14px;               
  height: 14px;
  border: 2px solid #ccc;
  border-top: 2px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.fspinner {
  border-top-color: #ff5555;
}

.spinner.paused {
  animation-play-state: paused;
}

.button-text {
  font-size: 0.75rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  color: white;
  max-height: 80vh;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stage-list-scrollable {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 6px;
  margin: 10px 0;
  width: 100%;
}


.stage-list-scrollable::-webkit-scrollbar {
  width: 6px;
}
.stage-list-scrollable::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.stage-list-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.stage-list-scrollable button {
  background: #333;
  color: white;
  padding: 6px;
  border: none;
  border-radius: 6px;
}
.stage-list-scrollable button:hover {
  background: #555;
}

.close-btn {
  background-color: #900;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
}

.staticIconPos {
  width: 25px;
  height: 25px;
}

.hidden {
  visibility: hidden; 
}

/* Stage Travvel */

.stage-modal {
  position: absolute;
  left: 0;
  top: 80px;

  width: 280px;
  padding: 16px;

  background: #12121a;
  border: 1px solid rgba(255, 200, 100, 0.3);
  border-radius: 12px;

  color: #eee;
  font-family: "Orbitron", sans-serif;

  box-shadow:
    0 0 12px rgba(255, 200, 100, 0.25),
    0 0 30px rgba(0, 0, 0, 0.6);

  animation: popIn 0.2s ease;
  z-index: 1000;
}

.stage-modal h3 {
  text-align: center;
  margin-bottom: 12px;
  color: #facc15;
  text-shadow: 0 0 6px rgba(255, 200, 100, 0.6);
}

.stage-input-group {
  display: flex;
  gap: 8px;
}

.stage-input-group input {
  flex: 1;
  padding: 6px;

  background: #1b1b26;
  border: 1px solid #444;
  border-radius: 6px;

  color: #fff;
  text-align: center;
}

.stage-input-group input:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 6px rgba(255, 200, 100, 0.5);
}

.stage-input-group button {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;

  background: linear-gradient(145deg, #facc15, #f97316);
  color: #000;
  font-weight: bold;

  cursor: pointer;
  transition: all 0.2s ease;
}

.stage-input-group button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(255, 200, 50, 0.7);
}

.stage-info {
  margin-top: 10px;
  font-size: 12px;
  color: #bbb;
}

.highlight {
  color: #facc15;
  font-weight: bold;
}

.stage-warning {
  margin-top: 10px;
  font-size: 11px;
  color: #ffb3b3;

  border-top: 1px solid rgba(255, 100, 100, 0.2);
  padding-top: 8px;
}

@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* */


.stage-wrapper {
  background: #1e293b;
  padding: 16px;
  max-width: 400px;
  color: #eee;
  text-align: center;
}



.afk-wrapper {
  background: #1e293b;
  padding: 16px;
  color: #eee;
  width: 400px;
  font-family: "Consolas", monospace;
}

.afk-bar-container {
  background: #333;
  border-radius: 8px;
  height: 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
}

.afk-bar {
  height: 100%;
  background: linear-gradient(to right, #00ffcc, #0099ff);
  transition: width 0.4s ease;
}

.afk-time {
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
  text-shadow: 0 0 4px #000;
}

.afk-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.afk-controls input {
  width: 60px;
  padding: 4px;
  border: 1px solid #666;
  border-radius: 4px;
  background: #222;
  color: #fff;
}

.afk-controls button {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.2s ease;
}

.afk-controls button:hover {
  background: #218838;
}




.auto-panel-wrapper {
  flex-direction: column;
  background-color: #1e293b;
  padding: 8px;
}

.auto-panel {
  background: rgba(30, 30, 50, 0.95);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #444;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 14px;
}

.auto-panel h3 {
  font-size: 15px;
  margin-bottom: 8px;
  color: #ffd700;
}

.auto-panel label {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

.auto-panel input {
  width: 80px;
  background: #222;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  padding: 2px 6px;
}


.auto-settings-modal {
  position: absolute;
  top: 50px; 
  right: 20px;
  background: #111;
  border: 2px solid #444;
  padding: 16px;
  z-index: 1000;
  width: 280px;
  color: #fff;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 40vh;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.auto-settings-modal .auto-panel {
  margin-bottom: 12px;
}

.auto-settings-modal label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.auto-settings-modal .modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}


.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px; 
  margin-top: 12px;
}

.modal-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #4a90e2;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s;
}

.modal-buttons button:hover {
  background-color: #357ab8;
}

.modal-buttons button:active {
  background-color: #2c5f94;
}


/* Stage Rush */

.toggle-btn {
  width: 60px;         
  height: 20px;
  border-radius: 6px;

  background: #222;
  border: 1px solid #555;

  color: #aaa;
  font-size: 12px;
  font-weight: bold;

  transition: all 0.2s ease;

  display: flex;
  align-items: center;    
  justify-content: center;
}

.toggle-btn.active {
  background: #1e7a3f;
  border-color: #2ecc71;
  color: #d4ffe3;
}

.toggle-btn:hover {
  border-color: #888;
  color: #fff;
  transform: scale(1.05);
}

.toggle-btn:active {
  transform: scale(0.95);
}

</style>