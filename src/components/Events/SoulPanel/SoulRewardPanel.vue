<template>
<div class="tier-rewards">
      <div
        v-for="(tierRewards, index) in unlockedTierRewards"
        :key="index"
        class="tier-block"
      >
        <div class="tier-title">Soul <b>[T{{ index + 1 }}]</b></div> 
        <ul class="reward-list">
          <li v-for="(reward, i) in tierRewards" :key="i">
            <template v-if="reward.startsWith('*')">
              <span class="perk-reward"> {{ reward }} </span>
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
</template>


<script setup>
import { ref, computed } from 'vue';
import { useHero } from '../../../composables/useHero.js';
import { rewards } from '../../../data/souls.js';

const { hero } = useHero();

const unlockedTierRewards = computed(() => {
  return rewards.slice(0, hero.value.soulTier + 1);
});

</script>

<style scoped>
.tier-rewards {
  padding: 1em;
  background: #1a1a1f;
  border-radius: 12px;
  box-shadow: 0 0 8px #0006;
  max-width: 480px;
  color: #f0f0f0;
  font-family: Orbitron, sans-serif;
  scrollbar-width: thin;
  scrollbar-color: rgb(214, 40, 226) transparent;
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

</style>