<template>
  <div class="hero-stats-wrapper">
    <div class="tooltip-wrapper">
      <span class="tooltip-icon">💢</span>
      <div class="crit-tooltip">
        <div class="crit-tooltip-content">
          <div v-html="stats(0)"></div>
        </div>
      </div>
    </div>
    <Tooltip :text="stats(1)">
      <span>🔪</span>
    </Tooltip>
    <Tooltip :text="stats(2)">
      <span>❤️</span>
    </Tooltip>
    <Tooltip :text="stats(3)">
      <span>🤺</span>
    </Tooltip>
    <Tooltip :text="stats(4)">
      <span>💀</span>
    </Tooltip>
    <Tooltip :text="stats(5)">
      <span>🥾</span>
    </Tooltip>
  </div>
</template>


<script setup>
import { computed, ref } from "vue";
import { useHero } from "../composables/useHero.js";
import { useEnemy } from "../composables/useEnemy.js";
import { getSvgIconHTML } from '../composables/SvgIcon.js';
import { useBuff } from '../data/buffs.js'

const { hero } = useHero();
const { enemy } = useEnemy();
const { buffs } = useBuff();

function stats(id) {
  switch(id) {
    case 0: {
      let text = `CRIT(%) — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${formatNumber(hero.value.crit, true)}</span><br>`;

      if(hero.value.mainInfTier < 35) return text;
      if(hero.value.mainInfTier < 62) {
        text += `<span style="color:gray; font-style:italic;">Reach <span style="color:gold;">[T62]</span> in main dimension to unlock milestones.</span>`;
        return text;
      }

      text += `<br><span style="font-weight: bold; text-align: center; display: block;">MILESTONES</span>
      <span style='color: red;font-weight: bold;'>Reach the required Crit Chance to activate milestones</span>
      <div style="font-family: 'Orbitron', sans-serif; line-height: 1.6; color: #fff; background: #1e1e1e; padding: 12px; border-radius: 8px; max-height: 300px; overflow-y: auto">
        ${renderMilestones(hero.value.crit)}
      </div>`

      return text;
    }
    case 1: return `CRIT DAMAGE — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${formatNumber((hero.value.critAttack / 100), true)}</span>`;

    case 211: {
      const totalColor = hero.value.healing.total >= 0 ? '#32CD32' : 'red';
      const totalValue = Math.abs(hero.value.healing.total);

      return `<span style='color: #32CD32; font-weight: bold; text-shadow: 0 0 4px #32CD32;'>[Heal per second]</span>
        Heal multiplier — <span style='color: #32CD32; font-weight: bold; text-shadow: 0 0 4px #32CD32;'>${formatNumber(hero.value.healing.healMult, true)}</span>
        Heal(%) — <span style='color: #32CD32; font-weight: bold; text-shadow: 0 0 4px #32CD32;'>${formatNumber(hero.value.healing.heal, true)}</span>
        HP Lost(%) — <span style='color: red; font-weight: bold; text-shadow: 0 0 4px red;'>${formatNumber(hero.value.healing.debuff, true)}</span>
        Total(%) — <span style='color: ${totalColor}; font-weight: bold; text-shadow: 0 0 4px ${totalColor};'>${formatNumber(totalValue, true)}</span>
      `;
    }

    case 3: return `DODGE(%) — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${Math.floor(hero.value.totalAvoid)}</span>`;
    case 4: return `OVERKILL — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${Math.floor(hero.value.overkill - 1)}</span>`;
    case 5: return `MAX APS — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${formatNumber(hero.value.maxAPS, true)}</span>
    MIN APS — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${formatNumber(0.5 + (hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 1? 0.5: 0), true)}</span>
    TOTAL APS — <span style='color: gold; font-weight: bold; text-shadow: 0 0 4px gold;'>${formatNumber(hero.value.totalAPS, true)}</span>`
  }
}




 const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);

    if(tier >= units.length)
      return "999d";
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }


</script>

<style scoped>

.hero-stats-wrapper {
  z-index: 999;
  margin-bottom: 15px;
  display: inline-block;
  width: 100%;
}

.hero-stats-wrapper span {
    border: 2px solid #FFD700; 
    border-radius: 8px;
    margin: 2px;
    transition: transform 0.2s;
}

.hero-stats-wrapper span:hover {
  transform: scale(1.2);
  box-shadow: 0 0 8px #FFD700;
}


.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-icon {
  cursor: pointer;
}


.crit-tooltip {
  display: none;
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  width: 260px;      
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  white-space: normal;
  z-index: 1000;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;      
}

.tooltip-wrapper:hover .crit-tooltip,
.crit-tooltip:hover {
  display: block;
}

</style>