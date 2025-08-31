<template>
  <div class="souls-wrapper">
    
    <div class="soul-target">
      <h3>🎯 Target</h3>
      <p>[{{hero.souls}}<span v-if="radPerks[9].level == 0">/{{hero.soulsCap}}</span>] {{ soulNames[hero.souls%50] }} 
      <span :title="'Soul Chance'">*[{{chanceFormat(enemy.soulBuff.chance)}}%]</span></p>
      <div style="text-align: left"><br>
        <div class="s-stats-wrapper">
          <span class="s-stats-name">DMG</span>
          <span class="s-stats-value">{{formatNumber(enemy.soulBuff.dmg, true)}}</span>
        </div>
        <div class="s-stats-wrapper">
          <span class="s-stats-name">HP</span>
          <span class="s-stats-value">{{formatNumber(enemy.soulBuff.hp, true)}}</span>
        </div>
        <div class="s-stats-wrapper">
          <span class="s-stats-name">EXP</span>
          <span class="s-stats-value">{{format(enemy.soulBuff.drop)}}</span>
        </div>
        <div class="s-stats-wrapper sp-stats-wrapper">
          <span class="s-stats-name">Equipment Chance</span>
          <span class="s-stats-value">{{format(enemy.soulBuff.drop)}}</span>
        </div>
        <div class="s-stats-wrapper" :class="{'s-stats-blocked': enemy.soulBuff.mutagen == 1}">
          <Tooltip :text="'Improves drops from regular mobs'">
            <span class="s-stats-name">*Mutagen</span>
          </Tooltip>
          <span class="s-stats-value">{{(hero.souls <= 40? 'Beat 40 souls': format(enemy.soulBuff.mutagen))}}</span>
        </div>
        <div class="s-stats-wrapper" :class="{'s-stats-blocked': enemy.soulBuff.stardust == 1}">
          <Tooltip :text="'Improves drops from regular mobs'">
            <span class="s-stats-name">*Stardust</span>
          </Tooltip>
          <span class="s-stats-value">{{(hero.souls <= 40? 'Beat 40 souls': format(enemy.soulBuff.stardust))}}</span>
        </div>
      </div>
    </div>

    <div class="tier-rewards">
      <h2 @click="hero.eLink = { set: 'Info', info: 'Souls' }">
        <sup style="font-size: 12px">ℹ️</sup>
        Souls [T{{ hero.soulTier }}]
      </h2>

      <div
        v-for="(tierRewards, index) in unlockedTierRewards"
        :key="index"
        class="tier-block"
      >
        <div class="tier-title">T{{ index + 1 }}</div>
        <ul class="reward-list">
          <li v-for="(reward, i) in tierRewards" :key="i">
            <template v-if="reward.startsWith('*')">
              <span class="perk-reward">
                <Tooltip :text="getPerkTooltip(reward)">
                  <span>{{ reward }}</span>
                </Tooltip>
              </span>
            </template>

            <template v-else-if="reward.includes('BUFF')">
              <span class="buff-reward">{{ reward }}</span>
            </template>

            <template v-else-if="reward.includes('(P)')">
              <span class="perk-reward">{{ reward }}</span>
            </template>

            <template v-else>
              <span>{{ reward }}</span>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { rewards, soulNames } from '../../data/souls.js';
import { perks as radPerks } from '../../data/radPerks.js';
import { perks as ascension } from '../../data/ascension.js';

const { hero } = useHero();
const { enemy } = useEnemy();

const perkTooltips = {
  "Level Rush": "Increases your level while your level is below x% of max level",
  "Stage Rush": "Increases stage gain while your stage is below x% of max"
};

function getPerkTooltip(rewardText) {
  if(rewardText.includes('Level Rush'))
    return perkTooltips['Level Rush']

  return 'No description available';
}

const unlockedTierRewards = computed(() => {
  return rewards.slice(0, hero.value.soulTier + 1);
});

function format(value) {
  if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
}

function formatNumber(num, f = false) {
  if (num < 100 && f) return num.toFixed(2);
  if (num < 1000000) return Math.floor(num).toString();

  const units = ["", "", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d", "u", "D", "T", "qt"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = tier < 16? units[tier]: "E";
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}

function chanceFormat(value){
  if(value >= 100)
    return 100
  return value.toFixed(2);
}


</script>

<style scoped>
.souls-wrapper {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  color: #f3e8ff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-left: 200px;
}


.soul-target h3,
.tier-rewards h3 {
  font-size: 1.4rem;
  font-weight: bold;
  color: #c084fc;
  text-shadow: 0 0 5px #c084fc;
  margin-bottom: 0.5rem;
}


.soul-target p,
.tier-rewards li {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #f3e8ff;
  text-shadow: 0 0 2px #9333ea;
}


.soul-target,
.tier-rewards {
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px #9333ea;
  scrollbar-width: thin;
  scrollbar-color: rgb(214, 40, 226) transparent;
}

.soul-target {
  background-color: #3b0764;
  width: 250px;
  text-align: center;
  min-height: 450px;
}

.souls-panel {
  background-color: #4c1d95;
  width: 200px;
  text-align: center;
}

.tier-rewards {
  max-height: 450px;
  overflow-y: auto;
  background-color: #581c87;
  max-width: 300px;
}


.stats-wrapper,.s-stats-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #555;
}

.sp-stats-wrapper {
  border-bottom: 1px dashed #e94747;
}

.stats-name, .s-stats-name {
  font-weight: bold;
}

.stats-value {
  color:rgb(242, 38, 249);
}

.s-stats-blocked {
  color: #eb2c2c;
}

.soul-bar {
  position: relative;
  width: 20px;
  height: 100%;
  background-color: #6b21a8;
  border: 2px solid #c084fc;
  border-radius: 10px;
  overflow: hidden;
}

.soul-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to bottom, #f0abfc, #c084fc, #9333ea);
  animation: soul-pulse 2s infinite ease-in-out;
  box-shadow: 0 0 10px #c084fc, 0 0 20px #9333ea;
  overflow: hidden;
}

.soul-fill::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  animation: soul-wave 3s linear infinite;
  pointer-events: none;
}

.soul-arrow {
  position: absolute;
  left: 100%;
  transform: translateX(0.3rem);
  color: #f3e8ff;
  font-size: 1.2rem;
  transition: top 0.3s ease;
}


.souls-panel p:nth-of-type(2) {
  font-weight: bold;
  color: #e9d5ff;
  background-color: #7e22ce44;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  display: inline-block;
  margin-top: 0.5rem;
}


.sub-rewards {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.25rem;
}

.sub-rewards li {
  font-size: 0.9rem;
  color: #e9d5ff;
  padding-left: 0.5rem;
  position: relative;
}

.sub-rewards li::before {
  position: absolute;
  left: -1rem;
  color: #c084fc;
}

@keyframes soul-pulse {
  0%, 100% {
    box-shadow: 0 0 8px #c084fc, 0 0 16px #9333ea;
  }
  50% {
    box-shadow: 0 0 15px #e9d5ff, 0 0 30px #a855f7;
  }
}

@keyframes soul-wave {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
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
  box-shadow: 0 0 10px rgba(174, 0, 255, 0.8);
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





.tier-rewards {
  padding: 1em;
  background: #1a1a1f;
  border-radius: 12px;
  box-shadow: 0 0 8px #0006;
  max-width: 480px;
  margin: auto;
  color: #f0f0f0;
  font-family: Orbitron, sans-serif;
}

.tier-rewards h2 {
  font-size: 1.2em;
  margin-bottom: 1em;
  cursor: pointer;
  color: #e600ff;
  text-align: center;
}

.tier-block {
  margin-bottom: 1.2em;
  padding: 0.5em;
  background: #2a2a33;
  border-left: 4px solid #f284ff;
  border-radius: 8px;
}

.tier-title {
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 0.3em;
  color: #88f;
}

.reward-list {
  padding-left: 1em;
  list-style: none;
}

.reward-list li {
  margin: 0.3em 0;
  padding: 0.2em 0.4em;
  border-left: 2px solid #444;
}

.buff-reward {
  color: #ff69b4;
  font-weight: bold;
}

.perk-reward {
  color: #00ffd0;
}

</style>
