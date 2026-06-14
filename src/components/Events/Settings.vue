<template>
  <div class="settings-wrapper">

    <div class="settings-layout">
      <div class="settings-block toggles-block">

        <div class="toggles">
          <div class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(0)" position="right">
                  AFK Popup
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.settings.showAfkPopupRule }"
              @click="hero.settings.showAfkPopupRule = !hero.settings.showAfkPopupRule"
            >
              {{ hero.settings.showAfkPopupRule ? 'ON' : 'OFF' }}
            </div>

          </div>


          <div v-if="getDimSpecialReward(7)" class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(1)" position="right">
                  Stored Time
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.settings.afkStoredTime }"
              @click="hero.settings.afkStoredTime = !hero.settings.afkStoredTime"
            >
              {{ hero.settings.afkStoredTime ? 'ON' : 'OFF' }}
            </div>

          </div>

          <div class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(2)" position="right">
                  Safety Check
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.eventDoubleClick }"
              @click="hero.eventDoubleClick = !hero.eventDoubleClick"
            >
              {{ hero.eventDoubleClick ? 'ON' : 'OFF' }}
            </div>

          </div>

          <div class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(3)" position="right">
                  Damage Display
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.settings.damageDisplay }"
              @click="hero.settings.damageDisplay  = !hero.settings.damageDisplay "
            >
              {{ hero.settings.damageDisplay  ? 'ON' : 'OFF' }}
            </div>

          </div>

          <div class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(4)" position="right">
                  Notafications
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.settings.notes }"
              @click="hero.settings.notes = !hero.settings.notes"
            >
              {{ hero.settings.notes ? 'ON' : 'OFF' }}
            </div>

          </div>

          <div v-if="hero.mainInfTier >= 10" class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(5)" position="right">
                  Dimension Teleport
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.settings.dimTeleport  }"
              @click="hero.settings.dimTeleport = !hero.settings.dimTeleport"
            >
              {{ hero.settings.dimTeleport ? 'ON' : 'OFF' }}
            </div>

          </div>

          <div class="setting-item">
            <div class="setting-left">
              <span class="setting-name">
                <Tooltip :text="() => tooltipText(6)" position="right">
                  Auto Save
                </Tooltip>
              </span>
            </div>

            <div
              class="chip"
              :class="{ active: hero.settings.autoSave  }"
              @click="hero.settings.autoSave = !hero.settings.autoSave"
            >
              {{ hero.settings.autoSave ? 'ON' : 'OFF' }}
            </div>

          </div>

        </div>
      </div>

      <div class="settings-block actions-block">
        <div class="actions">

          <button class="btn save" @click="saveGame">
            💾 Save
          </button>

          <button class="btn export" @click="exportGame">
            📤 Export
          </button>

          <button class="btn import" @click="triggerFileInput">
            📥 Import
          </button>

          <input type="file" ref="fileInput" accept=".enc" hidden @change="handleFileImport" />

          <button class="btn danger" @click="resetGame">
            Reset
          </button>

          <button
            v-if="hero.mainInfTier >= 10 && hero.dId == 'main'"
            class="btn infinity"
            @click="resetInf"
          >
            <span class="infinity-glow">
              ∞
            </span>

            Reset Infinity
          </button>

        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { computed, ref } from 'vue';
import { useHero } from "../../composables/useHero.js";

import { loading } from "../../composables/utils/loading.js";
import { useDimensions } from '../../composables/battleUtils/useDimensions.js';

const fileInput = ref(null);

const { 
  exportGame,
  triggerFileInput,
  handleFileImport,
  resetGame,
  resetInf,
  saveGame
} = loading(fileInput);

const {
  getDimSpecialReward
} = useDimensions();
const { hero } = useHero();

function tooltipText (id) {
  switch(id) {
    case 0: return `Show popup after returning from offline progress.`
    case 1: return `Offline time is stored and can be used later manually.`
    case 2: return `Confirmation is required before events are reset.`
    case 3: return `Displays damage received and dealt on the screen`
    case 4: return `Display a notification window every time a message appears.`
    case 5: return `If you use teleportation, you will automatically enter to the dimension`
    case 6: return 'Automatically saves your progress every 30 seconds.'
  }
}

</script>



<style scoped>

.settings-wrapper {

  min-height: 100dvh;

  padding: 24px;

  background:
    radial-gradient(
      circle at top,
      #181825,
      #0a0a0f
    );

  color: white;

  font-family: Inter, sans-serif;
}


.settings-layout {

  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 24px;
}

.settings-block {

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.02)
    );

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 22px;

  padding: 22px;

  backdrop-filter: blur(10px);

  box-shadow:
    0 0 30px rgba(0,0,0,0.25),
    inset 0 0 20px rgba(255,255,255,0.02);
}


.block-header {

  margin-bottom: 20px;
}

.block-title {

  font-size: 1.15rem;
  font-weight: 700;

  color: #e9d5ff;

  letter-spacing: 0.5px;
}


.toggles {

  display: flex;
  flex-direction: column;

  gap: 14px;
}

.setting-item {

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 16px;

  border-radius: 16px;

  background:
    rgba(255,255,255,0.03);

  border:
    1px solid rgba(255,255,255,0.05);

  transition: 0.2s;
}

.setting-item:hover {

  border-color:
    rgba(168,85,247,0.25);

  box-shadow:
    0 0 20px rgba(168,85,247,0.08);
}

.setting-left {

  display: flex;
  align-items: center;

  gap: 10px;
}

.setting-name {

  font-size: 0.96rem;
  color: #f3f4f6;
}



.info-wrapper {

  position: relative;
}

.info-btn {

  
  background:
    rgba(247, 182, 85, 0.15);

  color: #fee0b4;

  font-size: 0.75rem;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.info-btn:hover {

  background:
    rgba(168,85,247,0.35);
}



.chip {

  min-width: 74px;

  padding: 6px 14px;

  border-radius: 999px;

  background:
    rgba(255,255,255,0.05);

  border:
    1px solid rgba(255,255,255,0.08);

  text-align: center;

  cursor: pointer;

  transition: 0.2s;

  font-size: 0.85rem;
  font-weight: 600;

  color: #a1a1aa;
}

.chip.active {

  background:
    linear-gradient(
      90deg,
      #7c3aed,
      #06b6d4
    );

  color: white;

  border-color: transparent;

  box-shadow:
    0 0 18px rgba(139,92,246,0.25);
}


.actions {

  display: flex;
  flex-direction: column;

  gap: 14px;
}


.btn {

  height: 52px;

  border: none;
  border-radius: 16px;

  cursor: pointer;

  font-size: 0.95rem;
  font-weight: 700;

  color: white;

  transition: 0.2s;
}

.btn:hover {

  transform:
    translateY(-2px);
}

.save {

  background:
    linear-gradient(
      90deg,
      #2563eb,
      #06b6d4
    );
}

.export {

  background:
    linear-gradient(
      90deg,
      #2563eb,
      #06b6d4
    );
}

.import {

  background:
    linear-gradient(
      90deg,
      #2563eb,
      #06b6d4
    );
}

.danger {

  background:
    linear-gradient(
      90deg,
      #7f1d1d,
      #dc2626
    );
}

.infinity {

  background:
    linear-gradient(
      90deg,
      #959c29,
      #eaed3a
    );
}

.infinity-glow {

  color: #fde68a;

  text-shadow:
    0 0 12px rgba(255,215,0,0.65);

  margin-right: 6px;
}


@media (max-width: 900px) {

  .settings-layout {

    grid-template-columns: 1fr;
  }
}

</style>
