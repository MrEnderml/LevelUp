import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { perks as radPerks } from "../../data/radPerks.js";
import { useBuff } from '../../data/buffs.js'
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";
import { goals as infGoals } from "../../data/infGoals.js";
import { divineSkills } from "../../data/quasarCore.js";

import { useDimensions } from "./useDimensions.js";
import { useInfinity } from "./useInfinity.js";
import { useAbysses } from "./useAbyss.js";
import { useTrees } from "./useTree.js";

import { addLog} from '../logService.js';
import { fn } from "../utils/global.js";
import { useAscensions } from "./useAscension.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { useTimeline } from "./dims/useTimeline.js";
import { useVoid } from "./dims/useVoid.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";


export const useAmulets = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();

    const { player } = usePlayer();
    const { villian } = useBaseEnemy();

    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { infPenalties } = useInfinity();
    const { abyssHandler } = useAbysses();
    const { nodesHandler } = useTrees();
    const { perksHandler } = useAscensions();
    const { timelineEffects } = useTimeline();
    const { voidEffects } = useVoid();
    
    const curseRules = {
      0: { mult: 1, cap: 100 }, // Penetrate
      1: { mult: 0.75, cap: 50 }, // Heal
      2: { mult: 0.5, cap: 90 }, // Block
      3: { mult: 0.5, cap: Infinity }, // Attack Per Second
      4: { mult: 0.35, cap: 75 }, // avoid attack
      5: { mult: 0.25, cap: 50 }, // to STUN for
      6: { mult: 0.4, cap: 1000 }, // to CRIT
      7: { mult: 0.35, cap: 20 }, // Each of your
      8: { mult: 0.8, cap: Infinity }, // Enemy gets
      9: { mult: 1, cap: Infinity }, // Max HP
      10: { mult: 0.25, cap: 90 }, // to bleed by
      11: { mult: 0.25, cap: 90 }, // The Hero
      12: { mult: 0.05, cap: Infinity }, // Attack
      13: { mult: 0.25, cap: Infinity }, // id hit
      14: { mult: 1, cap: Infinity }, // only crits
      15: { mult: 0.1, cap: 100 }, // stun expires
      16: { mult: 0.3, cap: Infinity }, // crit resist
      17: { mult: 0.2, cap: 50 }, // less resourses
      18: { mult: 0.3, cap: 100 }, // extra hits
      19: { mult: 0.2, cap: 100 }, // less crit dmg
    };

    const tEffect = (tier, curseId) => {
      const baseMult = hero.value.curseMult;
      const rule = curseRules[curseId] || { mult: 1, cap: Infinity };
      
      let cap = Math.min(baseMult, 1);

      return tier.effect.replace(/(\d+(\.\d+)?)/g, (match) => {
        let val = parseFloat(match) * Math.max(baseMult * rule.mult, cap);
        val = Math.min(val, rule.cap);
        return val.toFixed(2);
      });
    }

    const tBonusEffect = (tier) => {
      let base = tier.bonus;
    
      let quasarShackles = hero.value.selectedDivSkills.includes(0)
        ? divineSkills.value[0].values[1]
        : 1;
      let fluctuationFailures = hero.value.selectedDivSkills.includes(10)
        ? divineSkills.value[10].values[1]
        : 1;
    
      base =
        base *
        (hero.rebirthTier >= 10 ? 1.5 : 1) *
        quasarShackles *
        fluctuationFailures;
    
      return base.toFixed(2);
    }

    function formatCurses() {
      let s = `<span>[T1] - ${fn(hero.value.cursesChances[0].value, true)}%</span>
      <span>[T2] - ${fn(hero.value.cursesChances[1].value, true)}%</span>
      <span>[T3] - ${fn(hero.value.cursesChances[2].value, 100)}%</span>`;
    
      if (hero.value.cursesChances[3].value > 0 && hero.value.singularity >= 8)
        s += `<br><span>[T5] - ${fn(
          Math.min(hero.value.cursesChances[3].value, 100),
          true
        )}%</span>`;
    
      if (hero.value.stages.current < 14) return `Reach Stage 15`;
    
      return s;
    }
    
    const treeTierHandler = () => {
      hero.value.tree.tier = 0 + 
        (amulets[0].status && amulets[0].suffix.status? 1: 0) + 
        (amulets[1].status && amulets[1].suffix.status? 1: 0) + 
        (amulets[2].status && amulets[2].suffix.status? 1: 0) + 
        (amulets[3].status && amulets[3].suffix.status? 1: 0) + 
        (hero.value.singularity >= 3? 1: 0);
    }

    const amuletsHandler = () => {
        treeTierHandler();
       
        curseCount();
        
        unlockCurseT5();
        
        stonesHandler();

        cursePowerHanlder();
    }

    const curseCount = () => {
      hero.value.curse = 1 + 
      (amulets[0].status? 1: 0) + 
      (amulets[1].status? 1: 0) + 
      (amulets[2].status? 1: 0) + 
      (amulets[3].status? 1: 0) + 
      Math.max(Math.floor((hero.value.mainInfTier - 25) / 10), 0);

      hero.value.minCurse = Math.max(Math.floor((hero.value.mainInfTier - 25) / 10), 0);
    }

    const unlockCurseT5 = () => {
        if(hero.value.singularity >= 8){
            for(let i = 0; i < cursed.length;i++){
              cursed[i].tier[4].status = true;
            }
          }
    }

    const cursePowerHanlder = () => {
        let quasarShackles = (hero.value.selectedDivSkills.includes(0)? divineSkills.value[0].values[0]: 1);
        let fluctuationFailures = (hero.value.selectedDivSkills.includes(10)? divineSkills.value[10].values[0]: 1);
    
        let totalEffects = 1 * quasarShackles * fluctuationFailures * 
        (hero.value.singularity >= 2? 1 - 0.02 * hero.value.singularity: 1) *
        (getDimSpecialReward(4)? 1 - Math.min(0.01 * dimensions.value.filter(dim => dim.infTier >= dim.spInfTier).length, 0.9): 1) * 
        infPenalties().curseMult * 
        timelineEffects().resonance * 
        infBonusesHandler(23, hero) * 
        abyssHandler(13) *
        voidEffects(7) * 
        spaceShopHandler(13, hero);
        ///////////////////////
        hero.value.curseMult = getDimEffect(27) * totalEffects;
        
        hero.value.curseMult *= getDimEffect(61);
    

        let curses = Math.min(Math.floor((hero.value.mainInfTier - 30) / 10), 7);
        for(let count = 0; count < curses; count++){
          cursed[13 + count].status = true;
        }
    }

    const stonesHandler = () => {
      amulets[0].status = (ascenPerks[8].level && hero.value.maxStage >= 20? true: false);
      amulets[0].suffix.status = (ascenPerks[14].level && ascenPerks[8].level ? true: false);
      amulets[0].prefix.status = (ascenPerks[24].level && ascenPerks[8].level ? true: false);

      amulets[1].status = hero.value.maxStage >= 20 && hero.value.soulsMax >= 20? true: false;
      amulets[1].suffix.status = hero.value.soulsMax >= 30? true: false;
      amulets[1].prefix.status = hero.value.soulsMax >= 40? true: false;

      amulets[2].status = (hero.value.rebirthPts >= 2000 && hero.value.maxStage >= 20? true: false);
      amulets[2].suffix.status = (hero.value.rebirthPts >= 10000? true: false);
      amulets[2].prefix.status = (hero.value.rebirthPts >= 40000? true: false);

      amulets[3].status = hero.value.spCount >= 4 && hero.value.maxStage >= 20 ? true : false;
      amulets[3].suffix.status = hero.value.spCount >= 13 ? true : false;
      amulets[3].prefix.status = hero.value.spCount >= 19 ? true : false;

      amulets[4].status = (getDimSpecialReward(61)? true: false);

  
    }

    const corrHeartHandler = (id = 0) => {
      let c = Math.max(hero.value.curseMult, 1);

      let ML;
      let MLM;

      if (getDimSpecialReward(61)) {
        ML = Math.max(Math.log(c ** Math.sqrt(c)), 1);
        MLM = Math.max(Math.log(c * Math.sqrt(c)), 1);
      } else {
        ML = 1
        MLM = 1
      }

      MLM *= (hero.value.spCount >= 34? 2: 1);
      

      let totalMaxLevel = 0;
      let totalMaxLevelMult = 0;

      amulets[4].maxLevel = ML;
      amulets[4].maxLevelMult = MLM;

      for(let i = 0; i < 4; i++) {
        if(!amulets[i].status) continue;

        totalMaxLevel += amulets[i].maxLevel;

        if (amulets[i].prefix.status) 
          totalMaxLevelMult += amulets[i].prefix.value;
      }



      return {
        ML: amulets[id].maxLevel * ML,
        MLM: amulets[id].prefix.value * MLM,
        totalML: totalMaxLevel * ML,
        totalMLM: totalMaxLevelMult * MLM
      }

    }

    const cursedAffect = () => {
      const h = hero.value;
      const e = enemy.value

      h.activeCurse = [];

      if (h.dId === 'bh') return;
      if (villian.value.spawnType == 'soul') return;
      if (villian.value.spawnType == 'deBoss') return;
      if (villian.value.spawnType == 'd-corruption') return;
      if (villian.value.spawnType == 'boss') return;

      const enabled =
        h.stages.current > 19 ||
        h.isAbyss ||
        h.isSingularity ||
        h.dId === 'hard' ||
        h.dId === 'd-hard' ||
        h.dId === 'abyss-d' ||
        h.dId === 'afk'
        
    
      if (!enabled) return;
    
      const filterCursed = cursed.filter(c => c.status);
      const maxCurses = filterCursed.length;
    
      h.activeCurse = [];
      h.activeCurseTier = Array(maxCurses).fill(-1);
    
      const addFixedCurses = (count, tier) => {
        const limit = Math.min(count, maxCurses);
        for (let i = 0; i < limit; i++) {
          h.activeCurse.push(filterCursed[i].id);
          h.activeCurseTier[filterCursed[i].id] = tier;
        }
      };

      if (h.dId === 'abyss-d' ) {
        addFixedCurses(13, 3);
        return;
      }
    
      if (h.isAbyss) {
        const abyssMap = [7, 10, 13, 13];
        addFixedCurses(abyssMap[h.abyssTier] ?? 13, h.abyssTier);
        return;
      }

      if (
        h.dId === 'hard' ||
        h.dId === 'd-hard'
      ) {
        addFixedCurses(13, 4);
        return;
      }

      if ((h.isSingularity && h.singularity >= 8)) {
        addFixedCurses(13, 3);
        return;
      }
    
      if (h.isSingularity) {
        if (h.singularity < 1) return;
        addFixedCurses(13, 2);
        return;
      }
    
    
      const min = h.minCurse;
      const max = h.curse + 1;
      const countCurse = Math.floor(Math.random() * (max - min + 1)) + min;
    
      h.cursesChances[3].status = false;
    
      const stageFactor = Math.max(1, h.stages.current - 17);
      const abyssMul = abyssHandler(0);
    
      const t3 = Math.min(35, 1.1 * Math.log(stageFactor) ** 1.95 * abyssMul);
      const t2 = Math.min(45, 10 * Math.log(stageFactor) ** 0.95 * abyssMul);
      const t1 = 100 - t2 - t3;
    
      h.cursesChances[0].value = t1;
      h.cursesChances[1].value = t2;
      h.cursesChances[2].value = t3;
    
      h.cursesChances[3].value = 
        (h.rebirthPts >= 3.5e5 ? 1 + Math.log(h.rebirthPts + 3) : 1) *
        abyssHandler(6);
    
      let mutations = 0;
      const used = new Set();
    
      const rollTier = () => {
        const r = Math.random() * 100;
        if (r < t1) return 0;
        if (r < t1 + t2) return 1;
        return 2;
      };
    
      for (let i = 0; i < countCurse && used.size < maxCurses; i++) {
        let tier = rollTier();
    
        if (h.spCount >= 5 && mutations < 4 && tier === 2) {
          const reqStage = 40 - 2 * radPerks[5].level + 20 * mutations;
          if ( h.stages.current >= reqStage &&
            Math.random() * 100 + h.mutation[mutations].chance >= 100 ) {
            mutations++;
            tier = 3;
    
            if (
              !h.cursesChances[3].status &&
              h.stages.current >= 115 &&
              h.cursesChances[3].value + Math.random() * 100 >= 100
            ) {
              h.cursesChances[3].status = true;
              tier = 4;
            }
          }
        }
    
        let curseId;
        do {
          curseId = filterCursed[Math.floor(Math.random() * maxCurses)].id;
        } while (used.has(curseId));
    
        used.add(curseId);
        h.activeCurse.push(curseId);
        h.activeCurseTier[curseId] = tier;
      }
    
      h.mutations = mutations;
    };

    const curseBonus = () => {
      const h = hero.value;
      const e = enemy.value;
    
      if (!h.activeCurse.length) return;
    
      let bonus = 0;
      const singMul = (h.singularity >= 2 ? 2 : 1);
    
      for (const id of h.activeCurse) {
        const tier = h.activeCurseTier[id];
        if (tier < 0) continue;
        bonus += cursed[id].tier[tier].bonus * singMul;
      }
    
      bonus *= abyssHandler(5);
      bonus *= (h.rebirthTier >= 60 ? h.rebirthBonusesHandle[7].value : 1);
      bonus *= (h.dId === 'hard' ? 0 : 1);
    
      if (h.dId === 'd-hard') bonus = Math.sqrt(bonus);
    
      if (h.isAbyss) {
        const power = 0.25 +
        perksHandler(46);
    
        bonus **= power;
      }
    
      if (e.buffs.includes(3)) bonus /= 3;
    
      const divineMul =
        (h.selectedDivSkills.includes(0) ? divineSkills.value[0].values[1] : 1) *
        (h.selectedDivSkills.includes(10) ? divineSkills.value[10].values[1] : 1);
    
      bonus *= divineMul;
    
      
    
      const divineCurse =
        h.cursesChances[3].status
          ? 0.2 + (h.rebirthPts >= 7.5e5 ? 0.1 : 0)
          : 0;
    
      const curseCountMul =
        divineCurse +
        (1 + 0.1 * h.mutations) +
        0.05 * Math.max(h.activeCurse.length - 1, 0);
    
      h.cursedBonusExp = Math.pow(bonus, curseCountMul);

      if (bonus > 0)
        addLog(`You gain <b style="color: red">${fn(h.cursedBonusExp, true)} Essence</b>`, 'Essence');
    
      h.cursedBonus =
        h.cursedBonusExp *
        (hero.value.mainInfTier < 9? 2: 1) *
        (1.5 ** Math.min(h.soulTier, 3)) *
        (h.rebirthPts >= 10 ? 2 : 1) *
        (h.rebirthPts >= 5e4 ? e.rebirthEnemy.drop : 1) *
        player.value.formationStats.loot *
        infBonusesHandler(9, hero) *
        (getDimReward(11)) *
        (h.selectedDivSkills.includes(7) ? divineSkills.value[7].values[1] : 1) *
        nodesHandler(16, ["base", "inf"]) * 
        getDimReward(32).t * 
        perksHandler(66) *
        (hero.value.spCount > 28? 1.25 ** hero.value.spbCount: 1) *
        hero.value.voidTreeStats.skill_exp_1 /
        
        voidEffects(8);
    
      hero.value.avgLoot.skillExp.acc += h.cursedBonus;
      h.activeCurse.length = 0;
    };

    const expSkillsGrant = () => {
      if(hero.value.stages.current < 20) return;

      const b = buffs.value;
      const h = hero.value;
      const p = player.value;
    
      const targets = getDimSpecialReward(11)? b: p.buff.activeBuffs.map(i => b[i]);
    
      for (const buff of targets) {
        if (buff.tier < buff.maxTier || buff.awaken)
          buff.exp += h.cursedBonus;
      }
    

      for (let buff of b) {
        if(buff.awaken && buff.tier >= buff.maxTier) {
          let need = buff.maxAwakenExp;
          
          if ( buff.exp >= need) {
            buff.exp -= need;
            buff.extraTier++;
            buff.maxAwakenExp *= 1000;
          }
        }
      }
    
      for (const buff of b) {
        if (buff.awaken && buff.tier >= buff.maxTier) continue;

        if (buff.tier >= buff.maxTier) {
          buff.exp = 0;
          continue;
        }
    
        const need = buff.maxExp[buff.tier - 1];
        if (buff.exp >= need) {
          buff.exp -= need;
          buff.tier++;
        }
    
        if (buff.tier >= buff.maxTier)
          buff.exp = 0;
      }
    };
    
    

    const cursesUnlockCheck = () => {
      if(hero.value.abyssTier >= 1){
        cursed[7].status = true;
        cursed[8].status = true;
        cursed[9].status = true;
      }
      if(hero.value.abyssTier >= 2){
        cursed[10].status = true;
        cursed[11].status = true;
        cursed[12].status = true;
      }
    }
    

    const effectsActivated = (tier) => {
      const cards = [];
      
      cards.push('B');
      cards.push('S');

      cards.push('E');

      if(hero.value.singularity >= 8)
        cards.push('A');

      cards.push('C');
      cards.push('M');
      
      if (hero.value.singularity >= 2)
        cards.push('T');

      if (hero.value.singularity >= 2)
        cards.push('R');
  
      return cards;
    }

    
    const activeSelect = (key) => {
      
    }

    const clickEffects = (key) => {
      
      if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Amulet' }
    }

    const effectsHandler = (id) => {
      switch (id) {
        case 'B': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#d91710;">' +
            '<strong>Essence Bonus</strong><br>' +
            `Kill an enemy to obtain [Total Essence]. [Total Essence] is equal to the sum of all Essences obtained from the cursed enemy.<br>` +
            `Essence [Extra Multiplier] = 1 + 0.05 * total Curses + (0.1 for each Curse [T4]) + ([0.2 - 0.3] for Curse [T5])<br>` + 
            `EXP MULT = [Total Essence]^[Extra Multiplier]<br>` +
            `SKILL EXP MULT = [Total Essence]^[Extra Multiplier]<br>` +
            '</span>'
          );
        }

        case 'S': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#efd191;">' +
            '<strong>Stones</strong><br>' +
            `Once you unlock the amulet, you'll see five stone slots. Each stone has its own ability, but also increases the maximum number of curses. The suffix and prefix are additional abilities that can be unlocked by completing certain events.` +
            '</span>'
          );
        }
        case 'E': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#91dfef;">' +
            '<strong>Essense</strong><br>' +
            'Enemies killed while under the effects of curses drop essences, which can be converted into skill EXP and EXP multiplier.<br>' +
            'The more curses there were on the enemy, the more concentrated the essences become and the larger the multiplier you can get for the essences.<br>' +
            '</span>'
          );
        }

        case 'A': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #24d8fc;">' +
            '<strong>Advanced Curse</strong><br>' +
            'Under the influence of gravity, a mutated curse transforms into an advanced curse [T5].<br>' +
            'Only one advanced curse can exist.<br>' +
            'An advanced curse grants an additional Essence gain multiplier<br>' +
            'Killing an enemy with the Curse [T5] grants double loot<br>' +
            'Sourse: <strong>Singularity [T8]</strong>' +
            '</span>'
          );
        }

        case 'T': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: orange;">' +
            '<strong>Treshold</strong><br>' +
            'Each curse has its own threshold. Once it is overcome, the curse grows stronger based on its Resonance. Resonance does not affect Essence gain.<br>' +
            '</span>'
          );
        }

        case 'M': {
          let max = hero.value.curse;
          let min = hero.value.minCurse;
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#d15528;">' +
            '<strong>Management</strong><br>' +
            'Maximum Curses: <strong>' + (max) + '</strong><br>' +
            'Minimum Curses: <strong>' + (min) + '</strong><br>' +
            '</span>'
          );
        }

        case 'C': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#eae198">' +
            '<strong>Rate of Curses</strong><br>' +
            (formatCurses()) +
            '</span>'
          );
        }

        case 'R': {
          let r = hero.value.curseMult;
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#f9453f">' +
            '<strong>Resonance</strong><br>' +
            'The concentration of Corruption that is converted into resonance. The higher the resonance, the stronger the curse.<br>' +
            'Resonanse: <strong>[' + (fn(r)) + ']</strong>' +
            '</span>'
          );
        }

        case 'i': { 
          return `
            <span style="font-size:0.95em; font-style:italic; color: yellow;">
              <strong style="color: gold;">Info</strong><br>
              Click to see additional info.
            </span>
          `.replace(/\n\s*/g, '');
        }

      
      }
    }

    

    return {
      cursePowerHanlder,
      amuletsHandler,
      cursesUnlockCheck,
      tEffect,
      tBonusEffect,
      cursedAffect,
      curseBonus,
      expSkillsGrant,
      effectsHandler,
      clickEffects,
      activeSelect,
      effectsActivated,
      corrHeartHandler,
    }
}