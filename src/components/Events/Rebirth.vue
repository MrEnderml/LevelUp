<template>
  <div class="rebirth-panel">
    <div class="left-panel">
      <h2>♻️ Rebirth [T{{hero.rebirthTier}}]</h2>
      
      <p>Limit: {{ Math.min(100 + hero.rebirthTier * 10, 300) }}</p>
      <p><strong class="pot"><span style="color: gold">Potential: {{hero.potential}}</span><span>(Increase stats per level)</span></strong><br>
        <strong><span style="color: lightgreen">+0.5 HP per 10 Potential</span></strong>
        <strong><span style="color: #eb4e4e">+0.2 DMG per 20 Potential</span></strong>
        <strong><span style="color: orange">+0.1 DEF per 30 Potential</span></strong>
      </p>
      <p style="font-weight: bold">Enemy EVO<br>
        <span>DMG - [{{enemy.rebirthEnemy["dmg"]}}]</span>
        <span>HP - [{{enemy.rebirthEnemy["hp"]}}]</span>
        <span :title="'EXP, WEAPON CHANCE'">LOOT - [{{enemy.rebirthEnemy["drop"]}}] </span>
        <span style="color: #062e9f" v-if="hero.abyssTier >= 2">ASCENSION AFFECT: {{(1.04 ** Math.log(hero.ascensionShards)).toFixed(2)}}</span>
      </p>
      <p class="rebirthTiers">
        <span v-if="hero.rebirthTier >= 5">T[5] - Rebirth Tier forces Abyss enemies getting weaker [{{(1.025 ** hero.rebirthTier).toFixed(2)}}]</span>
        <span v-if="hero.rebirthTier >= 10">T[10] - 50% curse Bonus. +1 Max Curse</span>
        <span v-if="hero.rebirthTier >= 15">T[15] - +1 max Buff in Abyss</span>
        <span v-if="hero.rebirthTier >= 20">T[20] - Chance the appearance of the lower tier souls. The lower Tier souls drop Rebirth Pts.</span>
      </p>
    </div>

    <div class="right-panel">
      <h2>Rebirth Pts: {{Math.floor(hero.rebirthPts)}}</h2>
      <div class="rewards-panel">
        <div
            v-for="reward in rewards"
            :key="reward.points"
            :class="['reward', { unlocked: hero.rebirthPts &gt;= reward.points }]"
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

const { hero } = useHero();
const { enemy } = useEnemy();

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

.left-panel h2,
.right-panel h2 {
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

.rewards-panel {
  max-height: 500px;
  overflow-y: auto;
}

.pot {
  display: inline-flex;
  gap: 10px;
}

.rebirthTiers {
  font-weight: bold;
  text-align: justify;
}
</style>
