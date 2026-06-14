<template>
  <div class="ascension-panel">
    <div class="tabs">
      <div class="tier-wrapper">
        <button
          :class="{ active: currentTier === 1, locked: 1 > maxTier }"
          @click="selectTier(1)"
          :disabled="1 > maxTier"
        >
          <Tooltip :text="() => tiersActivated(0)">
            TIER 1
          </Tooltip>
        </button>

        <button
          style="margin-left: 10px"
          :class="{ active: currentTier === 2, locked: 2 > maxTier }"
          @click="selectTier(2)"
          :disabled="2 > maxTier"
        >
          <Tooltip :text="() => tiersActivated(1)">
            TIER 2
          </Tooltip>
        </button>

        <button
          style="margin-left: 10px"
          :class="{ active: currentTier === 3, locked: 3 > maxTier }"
          @click="selectTier(3)"
          :disabled="3 > maxTier"
        >
          <Tooltip :text="() => tiersActivated(2)">
            TIER 3
          </Tooltip>
        </button>

        <button style="margin-left: 10px" v-if="highTiersActivated(0)"
          class="active-r"
          @click="selectTier(5)"
        >
          TIER-R
        </button>

        <button style="margin-left: 10px" v-if="highTiersActivated(1)"
          class="active-inf"
          @click="selectTier(6)"
        >
          TIER-INF
        </button>

        <button style="margin-left: 10px" v-if="highTiersActivated(2)"
          class="active-s"
          @click="selectTier(7)"
        >
          TIER-S
        </button>

        <button style="margin-left: 10px" v-if="highTiersActivated(3)" 
          class="active-d"
          @click="selectTier(8)"
        >
          TIER-D
        </button>

      </div>
    </div>
    

    <div class="ascension-effects">

        <div class="effects-cards">
          <Tooltip
            v-for="key in effectsActivated(currentTier)"
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
      


      <div
        class="ascension-shards"
        @click="hero.eLink = { set: 'Info', info: 'Ascension' }"
      >
        <span class="as-label">
          <sup></sup> Ascension Shards: 
        </span>

        <span class="as-value">
          <img
            :src="ascensionIcon"
            width="16"
            height="16"
          />
          {{ getAscensionShards() }}
        </span>
      </div>

    </div>


    <div class="ds-container" v-if="currentTier == 8">

      <div class="d-ascension-shards" v-if="dimensions[9].infTier === dimensions[9].maxInfTier">
          <span class="d-as-label">
            Dimension Shards [DS]: 
          </span>

          <span class="d-as-value">
            <img :src="ascensionDIcon" width="16" height="16" />
            {{ hero.dsTotal }}
          </span>

          <Tooltip :text="() => 'Get your DS back'" boxShadow="0 0 10px purple">
            <button class="ds-button" @click="dsReset" v-if="!hero.infProgress && hero.dId == 'main'">Annihilation</button>
          </Tooltip>
      </div>

    </div>

    <div class="perk-container">
      <div class="perks-grid">
        <div class="perk" v-for="perk in filteredPerks" :key="perk.id">
          <h3>{{ perk.name }}</h3>
          <p class="perk-description" v-html="getPerkDescription(perk)"></p>
          <div class="perk-footer">

            <p>Level: {{ perk.level }} / {{ perk.max }}</p>

            <button

              :disabled="!canUpgrade(perk)"
              @click="upgradePerk(perk)"
            >
              {{ getCost(perk) }}
              <img
                v-if="currentTier < 8"
                :src="ascensionIcon"
                width="16"
                height="16"
              />
              <img
                v-else
                :src="ascensionDIcon"
                width="16"
                height="16"
              />
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';
import { perks } from '../../data/ascension.js';
import { computed, ref } from 'vue';
import { perks as radPerks } from '../../data/radPerks.js';
import { perks as treePerks } from '../../data/perks.js';
import { dimensions } from '../../data/dimensions.js';
import ascensionIcon from '../../assets/ascension.png';
import ascensionDIcon from '../../assets/ascnesion-d.png';

import { useAscensions } from '../../composables/battleUtils/useAscension.js';
import { useDimensions } from '../../composables/battleUtils/useDimensions.js';

const {
  getCost,
  getPerkDescription,
  getAscensionShards,
  dsReset,
  canUpgrade,
  upgradePerk,
  effectsActivated,
  activeSelect,
  clickEffects,
  effectsHandler,
} = useAscensions();

const {
  getDimSpecialReward
} = useDimensions();

const { hero } = useHero();

const currentTier = ref(1);
const tiers = [1, 2, 3];

const tierUnlockStage = (tier) => 10 + (tier - 1) * 15;

const maxTier = computed(() =>
  tiers.reduce((max, tier) =>
    hero.value.maxStage >= tierUnlockStage(tier) ? tier : max, 0)
);

const selectTier = (tier) => {
  currentTier.value = tier;
};

const filteredPerks = computed(() => {
  if (currentTier.value === 8) {
    return perks.filter(
      (p) => p.tier === 8 && 57 + Math.min(Math.floor(dimensions.value[34].infTier / 2), 9) +
      (getDimSpecialReward(60)? 3: 0) > p.id
    );
  }

  if (currentTier.value === 7) {
    return perks.filter(
      (p) => p.tier === 7 && 37 + hero.value.singularity > p.id
    );
  }

  if (currentTier.value === 6) {
    return perks.filter(
      (p) => p.tier === 6 && p.max > 0
    );
  }

  return perks.filter((p) => p.tier === currentTier.value);
});



function tiersActivated(id) {
  let stage = 10 + 15 * id;

  if(stage <= hero.value.maxStage) return '';

  return `Reach Stage ${stage} to unlock`;
}

function highTiersActivated(id) {
  switch(id) {
    case 0: 
      return radPerks[8].level == 1;
    case 1:
      return (hero.value.infExpansions.ascensioin);
    case 2:
      return hero.value.singularity >= 4;
    case 3:
      return dimensions.value[9].infTier == dimensions.value[9].maxInfTier;
  }
}
</script>

<style scoped>
.ascension-panel {
  box-sizing: border-box;

  height: 100dvh; 

  background: linear-gradient(145deg, #1f2d46, #2e3b66);
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


/* Tabs */
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1vw;
  margin-bottom: 2vh;
}

.tier-wrapper {
  position: relative;
}


button {
  padding: 0.8vh 1.5vw;
  border: none;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.08);
  color: #eee;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  font-size: clamp(0.8rem, 1vw, 1.1rem);
}

button.active { background-color: #2196f3; color: #fff; }
button.active-r { background-color: #0fe56c; color: #fff; }
button.active-inf { background-color: rgb(215,229,15); color: #000; }
button.active-s { background-color: #66ffcc; color: #000; }
button.active-d { background-color: rgb(254,65,254); color: #fff; }
button.locked { background-color: rgba(255,255,255,0.04); color: #888; cursor: not-allowed; }

.tier-wrapper:hover .tooltip { visibility: visible; opacity: 1; }

/* Perks */
.perk-container {
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: rgb(40,71,226) transparent;
}

.perks-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(220px, 1fr));

  gap: 1vw;
  width: 100%;
  padding: 1vh 0;
}

@media (max-width: 1000px) {
  .perk-container {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 600px) {
  .perk-container {
    grid-template-columns: 1fr;
  }
}

.perk {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;

  background-color: #24324f;
  padding: 1vh 1vw;
  border-radius: 1rem;
  box-shadow: 0 0.2rem 0.5rem rgba(0,0,0,0.2);

  min-height: max-content;
}

.perk h3 { font-size: clamp(0.9rem, 1vw, 1.1rem); color: #f4f4f4; margin-bottom: 0.5vh; }
.perk p { font-size: clamp(0.75rem, 0.9vw, 1rem); color: #b1c2d3; margin-bottom: 0.5vh; }


.perk button {
  width: 100%;
  background-color: #3b5d7a;
  color: white;
  padding: 0.5vh 1vw;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: clamp(0.7rem, 0.9vw, 0.9rem);
  transition: background-color 0.3s, transform 0.2s;
}
.perk button:disabled { background-color: #2a3b5f; cursor: not-allowed; }
.perk button:hover:not(:disabled) { background-color: #4b6d8d; transform: scale(1.05); }
.perk button:active { transform: scale(0.98); }

.perk-footer {
  margin-top: auto;
}



.ascension-effects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* EFFECTS ROW */
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

/* COLOR CODING */
.effect-E, .effect-S { color: #6ee7ff; box-shadow: 0 0 6px #0a2878; }
.effect-G { color: #4f7cff; box-shadow: 0 0 6px #0d3dc1; }
.effect-I { color: gold;     box-shadow: 0 0 6px gold; }
.effect-C { color: cyan;     box-shadow: 0 0 6px cyan; }


.effect-A {
  background-color: #333;          
  border: 1px solid #666;
}

.effect-A:hover {
  background-color: #555;         
  box-shadow: 0 0 6px rgba(0, 255, 255, 0.5);
}

.effect-A.active {
  background-color: #00fff0;       
  border-color: #00cccc;
  color: #0a0a0a;                
  box-shadow: 0 0 10px #00fff0, 0 0 15px #00cccc;
  transform: scale(1.1);         
}



.ascension-shards {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 6px 10px;
  border-radius: 8px;

  background: linear-gradient(
    145deg,
    rgba(10,40,120,0.35),
    rgba(5,15,40,0.35)
  );

  border: 1px solid rgba(100,140,255,0.25);
  cursor: pointer;

  transition: 0.2s;
}

.ascension-shards:hover {
  background: linear-gradient(
    145deg,
    rgba(15,60,180,0.45),
    rgba(10,25,70,0.45)
  );
}

.as-label {
  font-size: 0.8rem;
  opacity: 0.75;
}

.as-value {
  display: flex;
  align-items: center;
  gap: 6px;

  font-weight: 700;
  color: #9db8ff;
}



.ds-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.d-ascension-shards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  padding: 6px 12px;
  border-radius: 10px;

  background: linear-gradient(
    145deg,
    rgba(90, 0, 110, 0.35),
    rgba(25, 0, 40, 0.4)
  );

  border: 1px solid rgba(200, 80, 255, 0.3);
  box-shadow: 0 0 8px rgba(200, 80, 255, 0.2);

  transition: all 0.2s ease;
}

.d-ascension-shards:hover {
  background: linear-gradient(
    145deg,
    rgba(140, 0, 160, 0.45),
    rgba(40, 0, 60, 0.5)
  );

  box-shadow: 0 0 12px rgba(200, 80, 255, 0.35);
}

.d-as-label {
  font-size: 12px;
  color: #c084fc;
  opacity: 0.9;
}

.d-as-value {
  display: flex;
  align-items: center;
  gap: 6px;

  font-weight: 700;
  font-size: 13px;

  color: #f0abfc;
  text-shadow: 0 0 6px rgba(240, 171, 252, 0.6);
}


.ds-button {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 120, 255, 0.4);

  background: linear-gradient(90deg, #a855f7, #d946ef);
  color: #fff;
  font-weight: 600;
  font-size: 11px;

  cursor: pointer;
  transition: all 0.2s ease;
}

.ds-button:hover {
  background: linear-gradient(90deg, #c084fc, #e879f9);
  box-shadow: 0 0 8px rgba(216, 180, 254, 0.6);
}

.ds-button:active {
  transform: scale(0.95);
}

</style>