<template>
  <div class="radiation-panel">
    <!-- Левая колонка: Шанс выпадения мутагенов -->
    <div class="mutation-chances">
      <h2>☢️ Mutagens</h2>
      <ul>
        <li
          v-for="(mutation, idx) in hero.value.mutation"
          :key="mutation.type"
          class="mutation"
        >
          <span class="glow">{{ mutation.type }}</span> — {{ mutation.chance }}%
        </li>
      </ul>
    </div>

    <!-- Правая колонка: Перки -->
    <div class="radiation-perks">
      <h2>🧬 Radiation Perks</h2>
      <div class="perks-scroll">
        <div class="perks">
            <div
            class="perk-group"
            v-for="(group, index) in groupedPerks"
            :key="index"
            >
            <div
                v-for="perk in group"
                :key="perk.id"
                class="perk"
                :style="{ animationDelay: `${perk.id * 0.1}s` }"
            >
                <h3>{{ perk.name }}</h3>
                <p class="perk-description">{{ perk.description }}</p>
                <small class="perk-level">Уровень: {{ perk.level }} / {{ perk.max }}</small>
                <button
                    :disabled="perk.level >= perk.max"
                    @click="upgradePerk(perk)"
                    >
                    Прокачать ({{ getCost(perk) }})
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { perks as rawPerks } from '../../data/radPerks.js';
import { useHero } from '../../composables/useHero.js';

const perks = reactive([...rawPerks]);
const { hero } = useHero();

console.log(hero.value.lent); //undefined


const getCost = (perk) => {
  return perk.baseCost + (perk.level * perk.costPerLevel);
};

const groupedPerks = computed(() => {
  const chunks = []
  for (let i = 0; i < perks.length; i += 2) {
    chunks.push(perks.slice(i, i + 2))
  }
  return chunks
})

function upgradePerk(perk) {
  if (perk.level < perk.max) {
    const cost = getCost(perk);
    
    

    perk.level++;
    if (perk.id == 11 && perk.level > 0){
        perk.description = perk.descriptionNext;
    }
    if (perk.id == 5){
        perk.description = perk.description.replace(/\[\d+(\.\d+)?]/, '') + ` [${(1.025 ** perk.level).toFixed(2)}]`;
    }
    
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.radiation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  gap: 1rem;
  font-family: 'Share Tech Mono', monospace;
  background: radial-gradient(circle at center, #0a0f0a, #0b0b12);
  padding: 1rem;
  color: #d4ff00;
  box-sizing: border-box;
  overflow: hidden;
}

@media (min-width: 768px) {
  .radiation-panel {
    flex-direction: row;
  }

  .mutation-chances {
    flex: 3;
  }

  .radiation-perks {
    flex: 7;
  }
}

.mutation-chances,
.radiation-perks {
  background: rgba(0, 255, 0, 0.05);
  border: 2px solid #66ff66;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-width: 400px;
}

.mutation {
  padding: 0.25rem 0;
  font-size: 1rem;
  list-style: none;
}

.glow {
  color: #b6ff00;
  text-shadow: 0 0 4px #b6ff00, 0 0 8px #88ff88;
}

.perk-description {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.perks-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 0.5rem;
}

.perks {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: flex-start;
}

.perk-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 170px; /* ширина одной "колонки" из двух перков */
  flex-shrink: 0;
}

.perk {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid #aaffaa;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.85rem;
  animation: fadeInUp 0.4s ease-out both;
  width: 220px;
  height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  background: #b6ff00;
  color: black;
  font-weight: bold;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
button:hover {
  background: #dfff00;
}

/* Анимация появления */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .perks {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .perk {
    font-size: 0.8rem;
  }
}

.perk-level {
  font-size: 0.75rem;
  color: #99ff99;
  display: block;
  margin-top: 0.25rem;
}
</style>
