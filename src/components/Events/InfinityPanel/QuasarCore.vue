<template>
  <div class="divine-tree-wrapper">
  <div class="divine-tree">
    <h2 class="d-desc">
        Quasar Core [{{ hero.selectedDivSkills.length }}/{{ hero.quasar.cores }}]
    </h2>

    <div v-for="tier in sortedTiers" :key="tier" class="tier-section">
      <h3 class="tier-title">Tier {{ tier }}</h3>

      <div class="d-goals-grid">
        <div
          v-for="skill in skillsByTier[tier]"
          :key="skill.id"
          :class="['d-goal', { selected: hero.selectedDivSkills.includes(skill.id) }]"
          @click="toggleSkill(skill.id)"
        >
          <Tooltip :text="() => quasarCoreItemsHandle(skill)" boxShadow="0 0 10px #00ffea" position="right">
            <span v-html="skill.icon"></span>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useHero } from '../../../composables/useHero.js';
import { goals } from '../../../data/infGoals.js';
import { dimensions } from '../../../data/dimensions.js';
import { divineSkills } from '../../../data/quasarCore.js';
import { getSvgIconHTML } from '../../../composables/svgIcon.js';
import { fn } from '../../../composables/utils/global.js';
import { perks as radPerks } from '../../../data/radPerks.js';

import SvgIcon from '../../svgIcon.vue';

const { hero } = useHero();

function toggleSkill(skillId) {
  if(hero.value.infProgress) return;

  if (hero.value.selectedDivSkills.includes(skillId)) {
    hero.value.selectedDivSkills = hero.value.selectedDivSkills.filter(id => id !== skillId);

    if(skillId == 14) { 
      radPerks[10].level = 0;
      
    }
  } else if (hero.value.selectedDivSkills.length < hero.value.quasar.cores) {
    if(skillId == 11) hero.value.souls = 0;
    if(skillId == 14) hero.value.souls = Math.min(hero.value.souls, 40);
    
    
    hero.value.selectedDivSkills.push(skillId);
  }
}

const skillsByTier = computed(() => {
  const map = {};
  const tier = hero.value.mainInfTier;
  const maxCores = 14 + (tier >= 100? 3: 0) + (tier >= 150? 3: 0);
  divineSkills.value.filter(d => d.id <= maxCores).forEach(skill => {
    if (!map[skill.tier]) map[skill.tier] = [];
    map[skill.tier].push(skill);
  });
  return map;
});

const sortedTiers = computed(() => {
  return Object.keys(skillsByTier.value)
    .map(Number)
    .sort((a, b) => b - a); 
});



function quasarCoreItemsHandle(skill) {
  let str = `<span style='color: #00ffea'>${skill.name}</span><br>
  ${formatPerkDescription(skill)}`;
  return str;
}

function formatPerkDescription(perk, digits = 2) {
  if (!perk || typeof perk.desc !== 'string') return '';
  const values = Array.isArray(perk.values) ? perk.values.slice() : [];
  let vi = 0;

  const fmt = (v) => {
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return Number.isFinite(n)? fn(n) : String(v);
  };

  return perk.desc.replace(/\[([^\]]*)\]/g, (_m, content) => {
    if (/%v/i.test(content)) {
      const replaced = content.replace(/%v/gi, () => fmt(values[vi++]));
      return `<span style="color:gold">[${replaced}]</span>`;
    }

    if (content.trim() === '') {
      const v = values[vi++];
      return `<span style="color:gold">[${fmt(v)}]</span>`;
    }

    const formatted = content.replace(/-?\d+(\.\d+)?/g, (num) => fmt(num));
    return `<span style="color:gold">[${formatted}]</span>`;
  });
}
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  line-height: 0;
  margin-right: 6px;
  vertical-align: -2px;
}


.divine-tree-wrapper {
  display: flex;
  justify-content: center;
  padding: clamp(10px, 2vw, 40px);
}

/* Основной блок */
.divine-tree {
  width: clamp(280px, 70vw, 900px);
  border: 2px solid #00ffea;
  border-radius: 14px;
  padding: clamp(10px, 2vw, 20px);
  background: rgba(0, 20, 35, 0.55);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 20px rgba(0, 255, 234, 0.3);
}

/* Заголовок */
.d-desc {
  color: #00ffea;
  text-shadow: 0 0 10px #00ffea;
  font-size: clamp(1rem, 2vw, 1.6rem);
  text-align: center;
  margin-bottom: 10px;
}

/* Название тира */
.tier-title {
  color: #7de8ff;
  font-size: clamp(0.8rem, 1.6vw, 1.2rem);
  text-shadow: 0 0 6px #00bcd4;
  margin: 12px 0 8px;
  text-align: center;
}

/* Сетка навыков */
.d-goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(48px, 10vw, 72px), 1fr));
  gap: clamp(8px, 1vw, 14px);
  justify-items: center;
}

/* Иконки навыков */
.d-goal {
  width: clamp(48px, 10vw, 72px);
  height: clamp(48px, 10vw, 72px);
  background: rgba(10, 10, 20, 0.7);
  border: 2px solid #444;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(22px, 3vw, 32px);
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 0 6px rgba(0, 255, 234, 0.15);
}

.d-goal:hover {
  border-color: #90caf9;
  box-shadow: 0 0 12px rgba(144, 202, 249, 0.35);
}

.d-goal.selected {
  border-color: rgb(97, 178, 244);
  background-color: rgba(97, 178, 244, 0.18);
  box-shadow: 0 0 14px rgba(97, 178, 244, 0.45);
}

</style>
