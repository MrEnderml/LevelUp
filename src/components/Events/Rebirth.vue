<template>
  <div class="rebirth-panel">
    <div class="left-panel">
      <h2 @click="hero.eLink = { set: 'Info', info: 'Rebirth' }">♻️ <sup style="font-size: 12px">ℹ️</sup>Rebirth [T{{hero.rebirthTier}}]</h2>
      
      <p>
        <strong class="pot"><span style="color: gold" @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Potential' }"><sup style="font-size: 12px">ℹ️</sup>Potential: {{hero.potential}}</span></strong><br>
        <strong><span style="color: lightgreen">+0.5 HP per 10 Potential</span></strong>
        <strong><span style="color: #eb4e4e">+0.2 DMG per 20 Potential</span></strong>
        <strong><span style="color: orange">+0.1 DEF per 30 Potential</span></strong>
      </p>
      <p style="font-weight: bold">
        <Tooltip :text="enemyEvo" boxShadow="0 0 10px lightgreen" position="right">
          <span>*Enemy EVO</span>
        </Tooltip>
        <span>DMG - [{{enemy.rebirthEnemy["dmg"]}}]</span>
        <span>HP - [{{enemy.rebirthEnemy["hp"]}}]</span>
        <Tooltip :text="rebirthLootHandle" boxShadow="0 0 10px lightgreen" position="right">
          <span>*LOOT - [{{formatNumber(enemy.rebirthEnemy["drop"])}}] </span>
        </Tooltip>
      </p>

      <Tooltip :text="ascendEffectHandle" boxShadow="0 0 10px #062e9f" position="right">
        <span v-if="hero.abyssTier >= 2" style="color: #062e9f; font-weight: bold">*ASCENSION AFFECT</span>
      </Tooltip>

      <p class="rebirthTiers">
        <span v-if="hero.rebirthTier >= 5">[T5] - Rebirth Tier forces Abyss enemies getting weaker [{{(1 / (1.025 ** hero.rebirthTier)).toFixed(2)}}]</span>
        <span v-if="hero.rebirthTier >= 10">[T10] - 50% curse Bonus. +1 Max Curse</span>
        <span v-if="hero.rebirthTier >= 15">[T15] - +1 max Buff in Abyss</span>
        <span v-if="hero.rebirthTier >= 20">[T20] - Get Rebirth Pts as if you had 25 more Levels</span>
        <span v-if="hero.rebirthTier >= 30">[T30] - Potential based on Rebirth Tier [{{Math.floor(1.053 ** Math.min(hero.rebirthTier, 80))}}]</span>
        <span v-if="hero.rebirthTier >= 40">[T40] - MIN Level based on Rebirth Tier [{{Math.floor(1.05 ** Math.min(hero.rebirthTier, 80))}}]</span>
        <span v-if="hero.rebirthTier >= 50">[T50] - Equipment Chance based on Rebirth Tier [{{formatNumber(1.03 ** hero.rebirthTier)}}]</span>
        <span v-if="hero.rebirthTier >= 60">[T60] - Space Boss appearance based on Rebirth Tier [{{formatNumber(1.02 ** hero.rebirthTier)}}]</span>
        <span v-if="hero.rebirthTier >= 70">[T70] - Corruption weakness based on Rebirth Tier [{{(1.02 ** Math.sqrt(hero.rebirthTier) - 1).toFixed(2)}}]</span>
        <span v-if="hero.rebirthTier >= 80">[T80] - Max Level Mult based on Rebirth Tier [{{(0.02 * (Math.min(hero.rebirthTier, 200) - 79)).toFixed(2)}}]</span>
      </p>
    </div>

    <div class="right-panel">
      <h2 v-if="hero.rebirthPts <= 1e5" class="rbPts" @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'Rebirth' }"><sup style="font-size: 12px">ℹ️</sup>Rebirth Pts(RP): {{Math.floor(hero.rebirthPts)}}</h2>
      <h2 v-else class="snPts">Singularity Pts(SP): {{Math.floor(hero.rebirthPts)}}</h2>
      <div class="rewards-panel">
        <div
            v-for="reward in rewardsFilter"
            :key="reward.points"
            :class="[
              reward.points <= 1e5 ? 'reward' : 'rewardAbove',
              hero.rebirthPts >= reward.points && reward.points <= 1e5 ? 'unlocked' : '',
              hero.rebirthPts >= reward.points && reward.points > 1e5 ? 'unlocked' : ''
            ]"
        >
            <span>{{ reward.points }} pts → {{ reward.description }}</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { rewards } from '../../data/rebirth.js'
import { ref, computed } from 'vue'
import { useHero } from '../../composables/useHero.js'
import { useEnemy } from '../../composables/useEnemy.js'
import { perks as radPerks} from '../../data/radPerks.js';
import { perks as ascenPerks } from '../../data/ascension.js';

const { hero } = useHero();
const { enemy } = useEnemy();

const rewardsFilter = computed(() => 
  rewards.filter(r => r.points <= (hero.value.singularity >= 8? 1e7: 1e5))
)

function ascendEffectHandle() {
  let effect = Math.max(1 / (1.04 + (ascenPerks[29].level? 0.01: 0)) ** Math.log(hero.value.ascensionShards + 3), 0.01);
  let text = `Enemy weakness. Depends on Ascension Shards [${effect.toFixed(2)}]`;

  return text;
}

function rebirthLootHandle() {
  let text = `Rebirth [Loot] affects:<br>
    - <span style="color: #4CAF50">EXP</span><br>
    - <span style="color:rgb(33, 243, 233)">Equipment Drop Chance</span><br>
    - <span style="color: #FF9800">20 Rebirth Pts</span>: Chance of <span style="color:rgb(189, 30, 233)">Soul</span> appearance<br>
    - <span style="color: #FF9800">100 Rebirth Pts</span>: <span style="color: lightgreen">Rebirth Pts</span> gain<br>
    - <span style="color: #FF9800">2500 Rebirth Pts</span>: Gain <span style="color:rgb(57, 125, 234)">Ascension Shards</span> when you Ascend<br>
    - <span style="color: #FF9800">50000 Rebirth Pts</span>: <span style="color: orange">Buff EXP</span>
  `;
  
  return text;
}

function enemyEvo() {
  let text = `Each Rebirth Tier increases Enemy Power and increases Loot Drops.`;

  return text;
}

const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);

    if(tier >= units)
      return "999d";
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }

</script>

<style scoped>
.rebirth-panel {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #1b5e20, #43a047);
  border-radius: 12px;
  box-shadow: 0 0 25px rgba(0, 255, 128, 0.4);
  position: relative;
  overflow: hidden;
  max-width: 90%;
  margin-left: 100px;
}

/* Светящиеся частицы */
.rebirth-panel::before,
.rebirth-panel::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: rgba(0, 255, 128, 0.1);
  border-radius: 50%;
  filter: blur(60px);
  animation: float 12s infinite ease-in-out;
  z-index: 0;
}

.rebirth-panel::before {
  top: -50px;
  left: -50px;
}

.rebirth-panel::after {
  bottom: -40px;
  right: -40px;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(15px); }
}

.left-panel,
.right-panel {
  flex: 1;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: #ccffcc;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 0 8px rgba(0, 255, 128, 0.2);
}

.left-panel {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 550px;
  scrollbar-width: thin;
  scrollbar-color: rgb(62, 226, 40) transparent;
}

.left-panel h2 {
  color: #b9f6ca;
  text-shadow: 0 0 8px #00ff80;
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
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

.reward {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #66bb6a;
  color: #e8f5e9;
  padding: 0.7rem 1rem;
  margin: 0.5rem 0;
  border-radius: 10px;
  transition: 0.3s;
  font-size: 0.95rem;
}

.reward.unlocked {
  background: #00e676;
  color: #002910;
  font-weight: bold;
  border-color: #00c853;
}

.rewardAbove {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #70e3bd;
  color: #e8f5e9;
  padding: 0.7rem 1rem;
  margin: 0.5rem 0;
  border-radius: 10px;
  transition: 0.3s;
  font-size: 0.95rem;
}

.rewardAbove.unlocked {
  background: #70e3bd;
  color: #002910;
  font-weight: bold;
  border-color: #70e3bd;
}

.rbPts {
  color: #b9f6ca;
  text-shadow: 0 0 8px #00ff80;
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
}

.snPts {
  color: #a4ffe1;
  text-shadow: 0 0 8px rgb(128, 247, 207);
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
}

.rewards-panel {
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(62, 226, 40) transparent;
}

.pot {
  display: inline-flex;
  gap: 10px;
}

.rebirthTiers {
  font-weight: bold;
  text-align: justify;
}

.radPot {
  color: "#66ff66";
  display: block;
}
</style>
