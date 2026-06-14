<template>
  <div class="rebirth-panel">
    <div class="left-panel">
      <h2 
        class="rebirth-title" 
        :class="{dark: hero.rebirthTier >= 100}" 
        @click="hero.eLink = { set: 'Info', info: 'Rebirth' }"
      >
        Rebirth [T{{hero.rebirthTier}}]
      </h2>

      <div class="effects-cards">
        <Tooltip
          v-for="key in effectsActivated()"
          :key="key"
          :text="() => effectsHandler(key)"
          position="right-top"
          maxWidth="200px"
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

      <p class="rebirthTiers">
        <span>Rebirth Features</span>
        <span
          v-for="bonus in getRebirthBonusText()"
          :key="bonus.tier"
          class="rebirth-item"
        >
          <strong>[T{{ bonus.tier }}]</strong>
          <span v-html="bonus.label"></span>
        </span>
      </p>
    </div>

    <div class="right-panel">
      <!-- Rebirth -->
      <h2
        v-if="activeRewardTab === 'rebirth'"
        class="rbPts"
        @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Rebirth' }"
      >
        <sup style="font-size: 12px"></sup>
        Rebirth Pts (RP): {{ Math.min(Math.floor(hero.rebirthPts), 1e5) }} / 100000
      </h2>

      <!-- Singularity -->
      <div v-else class="singularity-header">
        <h2 class="snPts">
          Singularity Pts (SP): {{ Math.floor(hero.rebirthPts) }}
        </h2>
      </div>

      <div class="reward-tabs">
        <button
          class="tab"
          :class="{ active: activeRewardTab === 'rebirth' }"
          @click="activeRewardTab = 'rebirth'"
        >
          Rebirth
        </button>

        <button
          v-if="hero.singularity >= 8"
          class="tab singularity"
          :class="{ active: activeRewardTab === 'singularity' }"
          @click="activeRewardTab = 'singularity'"
        >
          Singularity
        </button>
      </div>

      <div class="rewards-panel">
        <div
          v-for="reward in rewardsFilter"
          :key="reward.points"
          :class="[
            reward.points <= 1e5 ? 'reward' : 'rewardAbove',
            hero.rebirthPts >= reward.points && reward.points <= 1e5
              ? 'unlocked'
              : '',
            hero.rebirthPts >= reward.points && reward.points > 1e5
              ? 'unlocked'
              : '',
          ]"
        >
          <span>{{ reward.points }} pts → {{ reward.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { rewards } from "../../data/rebirth.js";
import { ref, computed } from "vue";
import { useHero } from "../../composables/useHero.js";
import { useEnemy } from "../../composables/useEnemy.js";
import { perks as radPerks } from "../../data/radPerks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { newicons } from "../../composables/icons.js";

import { fn } from "../../composables/utils/global.js";

import { useRebirths } from "../../composables/battleUtils/useRebirth.js";

const { effectsActivated, activeSelect, clickEffects, effectsHandler } =
  useRebirths();

const { hero } = useHero();
const { enemy } = useEnemy();

const activeRewardTab = ref("rebirth");

const rebirthBonusesConfig = [
  {
    tier: 5,
    text: "Depending on the Tier of Rebirth, the enemies of the Abyss become weaker.",
    valueIndex: 0,
  },
  { tier: 10, text: "Boss Appearance Chance", valueIndex: 1 },
  { tier: 15, text: "+1 Max slot for skills in Abyss", valueIndex: null },
  { tier: 20, text: "Souls Appearance", valueIndex: 3 },
  { tier: 30, text: "Potential", valueIndex: 4 },
  { tier: 40, text: "MIN Level", valueIndex: 5 },
  { tier: 50, text: "Equipment Drop Chance", valueIndex: 6 },
  { tier: 60, text: "Increase Essense Bonus gain", valueIndex: 7 },
  { tier: 70, text: "Corruption weakness", valueIndex: 8 },
  { tier: 80, text: "Max Level Mult", valueIndex: 9 },
  { tier: 90, text: "Rebirth Loot scales better", valueIndex: 10 },
  { tier: 100, text: "Increase the Rebirth features effects with [T100]", valueIndex: 11 }
];

function getRebirthBonusText() {
  const tier = hero.value.rebirthTier ?? 0;
  const handle = hero.value.rebirthBonusesHandle ?? [];

  return rebirthBonusesConfig
    .filter((cfg) => tier >= cfg.tier)
    .map((cfg) => {
      let valueStr = "";

      if (cfg.valueIndex !== null) {
        const v =
          handle?.[cfg.valueIndex]?.value ?? handle?.[cfg.valueIndex] ?? null;
        if (v !== null && v !== undefined && v !== "") {
          valueStr = ` [${fn(v)}]`;
        }
      }

      return {
        tier: cfg.tier,
        label: `${cfg.text} ${valueStr}`,
      };
    });
}

const rewardsFilter = computed(() => {
  if (activeRewardTab.value === "rebirth") {
    return rewards.filter((r) => r.points <= 1e5);
  }

  return rewards.filter((r) => r.points > 1e5);
});
</script>

<style scoped>
.rebirth-panel {
  box-sizing: border-box;

  height: 100dvh;

  background: linear-gradient(145deg, #203925, #1a231c);
  color: #f0f0f0;

  padding: clamp(12px, 2vh, 24px);

  border-radius: 0;
  box-shadow: none;

  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vh, 18px);

  overflow: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.left-panel,
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: #ccffcc;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 0 8px rgba(0, 255, 128, 0.2);

  overflow-x: hidden;
  height: 90%;
}

.left-panel {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(62, 226, 40) transparent;
}

.right-panel h2 {
  color: #b9f6ca;
  text-shadow: 0 0 10px #00ff80, 0 0 15px #66ff66;
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
}

.rebirth-title {
  color: #b9f6ca;
  text-shadow: 0 0 10px #00ff80, 0 0 15px #66ff66;
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
}

.rebirth-title.dark {
  color:rgb(229, 120, 250);
  text-shadow: 0 0 10px rgb(255, 0, 221), 0 0 15px rgb(252, 102, 255);
}

.left-panel p,
.right-panel p,
.right-panel span {
  font-size: 1rem;
  line-height: 1.6;
  color: #c8fdd3;
}

strong {
  color: #a0ff9d;
  text-shadow: 0 0 3px #00ff80;
}
span {
  display: block;
  margin: 0.1rem 0;
}

.reward,
.rewardAbove {
  flex-shrink: 0;
  padding: 0.7rem 1rem;
  margin: 0.3rem 0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: 1px solid;
  background: rgba(76, 175, 80, 0.2);
  color: #e8f5e9;
}

.reward.unlocked {
  background: #00e676;
  border-color: #00c853;
  color: #002910;
  font-weight: bold;
}
.rewardAbove.unlocked {
  background: #70e3bd;
  border-color: #70e3bd;
  color: #002910;
  font-weight: bold;
}

.rewards-panel {
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgb(62, 226, 40) transparent;
}

.pot {
  display: inline-flex;
  gap: 10px;
}


.rbPts {
  font-size: 1.6rem;
  color: #b9f6ca;
  text-shadow: 0 0 10px #00ff80;
  margin-bottom: 0.8rem;
}
.snPts {
  font-size: 1.6rem;
  color: #a4ffe1;
  text-shadow: 0 0 10px rgb(128, 247, 207);
  margin-bottom: 0.8rem;
}

@media (max-width: 900px) {
  .rebirth-panel {
    flex-direction: column;
    gap: 1rem;
    height: auto;
  }
  .left-panel,
  .right-panel {
    width: 100%;
    height: auto;
  }
}

.rebirthTiers {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  margin: 6px 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02),
    rgba(0, 0, 0, 0.25)
  );
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.03);

  font-weight: bold;
  text-align: justify;
  margin-top: 0.5rem;
}

.rebirth-item {
  color: #dfeff0;
  font-family: "Orbitron", sans-serif;
  font-size: 13px;
  line-height: 1.3;
}

.rebirth-item strong {
  color: #00ff80;
  margin-right: 6px;
  text-shadow: 0 0 6px rgba(249, 66, 249, 0.15);
}

.reward-tabs {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.tab {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #aaa;
  cursor: pointer;
  border: 1px solid transparent;
}

.tab.active {
  color: #fff;
  border-color:rgb(68, 255, 0);
  background: rgba(0, 255, 240, 0.15);
}

.tab.singularity {
  color: #84ffff;
}

.tab.singularity.active {
  border-color: #00fff0;
  background: rgba(0, 255, 240, 0.15);
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

  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.08);
}

/* COLOR CODING */
.effect-L, .effect-T {
  color: #9ff5b0;
  box-shadow: 0 0 6px #9ff5b0;
}
.effect-P {
  color: gold;
  box-shadow: 0 0 6px gold;
}
.effect-I {
  color: gold;
  box-shadow: 0 0 6px gold;
}
.effect-F {
  color: #00ff80;
  box-shadow: 0 0 6px #00ff80;
}
.effect-S {
  color: #ff0e0e;
  box-shadow: 0 0 6px #ff0e0e;
}
.effect-C, .effect-A {
  color: #d931ec;
  box-shadow: 0 0 6px #b860c2;
}
</style>
