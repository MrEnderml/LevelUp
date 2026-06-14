import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { useBuff } from '../../data/buffs.js'
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";
import { goals as infGoals } from "../../data/infGoals.js";
import { perks as radPerks } from "../../data/radPerks.js";

import { useDimensions } from "./useDimensions.js";
import { useAbysses } from "./useAbyss.js";

import { addLog} from '../logService.js';
import { fn } from "../utils/global.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useInfinity } from "./useInfinity.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";


export const useAscensions = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();

    const { player } = usePlayer();

    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { abyssHandler } = useAbysses();
    //const { spaceShopHandler } = useSpaces();


    const ascensionShardsProgress = (ctx) => {
        if(hero.value.isTravell) return;

        let stage = hero.value.stages.current;

        let x = Math.sqrt(Math.log(Math.min(stage + 2, 300)) ** (Math.min(stage, 300)/7)) * Math.min(1 + hero.value.maxLevel / 100, 7);
        x *= (hero.value.mainInfTier < 9? 2: 1);
        x *= player.value.status.traveler.ascension;
        x *= (enemy.value.boss.isBoss? Math.min(Math.max(enemy.value.boss.drop ** 0.75, 1), 10): 1);
        x *= perksHandler(29);
        x *= perksHandler(34);
        x *= perksHandler(53);
        x *= infBonusesHandler(7, hero);
        x *= player.value.formationStats.loot;
        x *= hero.value.voidTreeStats.ascen_shards_1;
        x *= spaceShopHandler(14, hero);
        x *= (getDimSpecialReward(1)? 1.01 ** infPerksLevels(): 1);
        x *= getDimReward(34);
        x *= (hero.value.timePenalty? 0: 1);
        
        //x **= (hero.value.dId == 'unlimitted'? 0.8: 1);
      
    
        hero.value.shardsMult = x;
    
        if(hero.value.dId == 'ascension' || hero.value.dId == 'ascension-2') return;
    
    
        hero.value.ascensionShards += x;
        hero.value.totalAscensionShards += x;
        hero.value.avgResources.ascension.acc += x;
        hero.value.totalStats.totalAS += x;
    
        hero.value.shardsPerformMult = (2.5 * (hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3) * (hero.value.rebirthPts >= 2? 2: 1) * 
        (hero.value.rebirthPts >= 2500? enemy.value.rebirthEnemy["drop"]: 1))
    
        hero.value.ascendShardPerform = hero.value.totalAscensionShards * hero.value.shardsPerformMult - hero.value.totalAscensionShards;
          
        if(enemy.value.boss.isBoss){
          addLog(`You gain <b style="color: #9db8ff">${fn(x, true)} Ascension Shards</b> from <b style="color: red">Boss</b>`, "Ascension");
          return;
        }
          
    
        addLog(`You gain <b style="color: #9db8ff">${fn(x, true)} Ascension Shards</b> from Stage`, "Ascension");
    }

    const ascensionHandle = () => { 
        dsHandle();

        perksMaxLevelInstall();
        calculateDimShardsStage();
    }

    const calculateDimShardsStage = () => {
      let base = (hero.value.rebirthPts >= 8.5e5? Math.floor(Math.log(hero.value.rebirthPts + 3)): 0) + 
      abyssHandler(7) + 
      (getDimSpecialReward(13)? 30: 0);
  
      hero.value.dimShards.stage = hero.value.dimShards.base - base;
    }

    const dsHandle = () => {
      hero.value.dsTotal = hero.value.ds + 
      enemy.value.specialCreatures.dim3.loot +
      enemy.value.specialCreatures.ddim6.loot - 
      hero.value.dsSpend;

      hero.value.dsMax = Math.max(hero.value.dsTotal, hero.value.dsMax);
    }

    const perksHandler = (id) => {
      if(eventReq()) return ascenPerks[id].status.disValue;

      switch(id) {
        case 6:
          return ascenPerks[6].level? (1.02 ** 
            (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + 
            hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring'] + 
            hero.value.equipmentTiers['spRing'])): 1;
        case 15:
          return ascenPerks[15].level? 
          0.01 * (Math.min((10 + hero.value.maxStage) / 15, 3) + 
          (hero.value.infExpansions.ascensioin? 1: 0) +
          (hero.value.singularity >= 4? 1: 0) +
          (getDimSpecialReward(9)? 1: 0) + 
          (radPerks[9].level? 1: 0)): 0;
        case 16:
          return ascenPerks[16].level? 1 + 0.3 * hero.value.souls: 1;
        case 19:
          return ascenPerks[19].level ? 1 / (1 + 0.01 * hero.value.soulTier) : 1;
        case 20:
          return ascenPerks[20].level ? 1.3 : 1
        case 21:
          return ascenPerks[21].level ? (hero.value.kills > 0 ? Math.floor(Math.log10(hero.value.kills)) + 1 : 1): 0;
        case 23:
          return ascenPerks[23].level? hero.value.activeCurse.length * 0.02: 0;
        case 26:
          return ascenPerks[26].level? Math.floor(hero.value.stages.current / 5) - 1: 0;
        case 27:
          return (ascenPerks[27].level? Math.max(1 / (1 + 0.1 * Math.max(hero.value.corruption.total, 0.1)), 0.1): 1);
        case 28: 
          return ascenPerks[28].level? 1.5: 1;
        case 29:
          return ascenPerks[29].level? (1 + 0.04 * hero.value.sp): 1;
        case 31:
          return ascenPerks[31].level * 0.01;
        case 32:
          return 1 - ascenPerks[32].level * 0.0001 
        case 33:
          return 1 - ascenPerks[33].level * 0.001; 
        case 34:
          return (1 + ascenPerks[34].level * 0.01);
        case 35: 
          return ascenPerks[35].level * 0.01;
        case 36:
          return ascenPerks[36].level? Math.max(1.2 / Math.log(Math.sqrt(hero.value.rebirthPts) ** 3.5 + 2), 0.01): 1;
        case 37:
          return ascenPerks[37].level? 50 : 0;
        case 39: 
          return ascenPerks[39].level? 10: 0;
        case 40:
          return ascenPerks[40].level? 100: 0;
        case 41:
          return (ascenPerks[41].level? Math.max(hero.value.corruption.total - hero.value.corruption.cap, 0) / (3.5 - getDimReward(22).weak): 0);
        case 42:
          return ascenPerks[42].level? 0.02: 0;
        case 43:
          return ascenPerks[43].level? 3: 0;
        case 44:
          return ascenPerks[44].level? 1 * hero.value.singularity : 0;
        case 46:
          return ascenPerks[46].level? 0.25: 0;
        case 47:
          return ascenPerks[47].level? hero.value.dims.passedDims * 0.005: 0;
        case 48:
          return ascenPerks[48].level? 1 + 0.05 * hero.value.dims.passedDims: 1;
        case 49:
          return ascenPerks[49].level? 1 - 0.006 * Math.min(hero.value.stages.current, 150) - 0.00025 * Math.max(hero.value.stages.current - 150, 0): 1
        case 50:
          return ascenPerks[50].level? Math.floor(hero.value.soulsMax / 20): 0;
        case 51:
          return ascenPerks[51].level? 2 * hero.value.maxStage: 0;
        case 52:
          return ascenPerks[52].level? Math.floor(hero.value.dims.passedDims / 2): 0
        case 53:
          return ascenPerks[53].level? 1.5 ** hero.value.dsTotal: 1;
        case 54:
          return ascenPerks[54].level? hero.value.dims.passedDims : 0
        case 55:
          return 1.02 ** ascenPerks[55].level; 
        case 57:
          return ascenPerks[57].level? 1 * Math.floor(dimensions.value.filter(d => d.id.startsWith('d-')).reduce((sum, d) => sum + d.infTier, 0) / 50) : 0;
        case 58: 
          return ascenPerks[58].level? Math.max(2 - 0.04 * dimensions.value[29].infTier, 1.05) : 1;
        case 60:
          return ascenPerks[60].level? infGoals.value.filter(g => g.tier === g.maxTier).length * 0.01: 0;
        case 63:
          return ascenPerks[63].level? 10: 0;
        case 65: {
            let digits = Math.floor(Math.log10(Math.max(hero.value.mutagen, 10))); 
            let damping = 1 - 0.01 * digits; 
            
            return ascenPerks[65].level? damping: 1;
        }
        case 66: 
          return ascenPerks[66].level? 1.25 ** ascenPerks[66].level: 1;
        case 67: 
          return ascenPerks[67].level? 1.25 ** ascenPerks[67].level: 1;
        case 68: {
          if (!ascenPerks[68].level) return {min: 0, max: 0, mult: 0}

          return {
            min: 5 * ascenPerks[68].level,
            max: 50 * ascenPerks[68].level,
            mult: 0.1 * ascenPerks[68].level,
          }
        }

        default:
          return ascenPerks[id].level;
          
      }
    }

    const perksCost = (perk) => {
      if (perk.tier == 6 || perk.tier == 7) {
        let base = perk.baseCost;

        if(perk.tier == 6)
          base += 0.075 * Math.floor(perk.level / 100);

        let level = perk.level + (perk.tier == 7? 1: 0);
        return Math.floor((base ** level) ** perksConstMultipliers());
      }

      if (perk.id == 0 || perk.id == 9 || perk.id == 18) 
        return perk.baseCost + perk.level * perk.costPerLevel;

      if (perk.id >= 57 && perk.id < 66 && false)
        return (perk.baseCost - 1) ** (perk.level + 1);

      if (perk.max > 1)
        return perk.baseCost + (perk.costPerLevel * perk.level)

      return perk.baseCost ** (perk.level + 1);
    }

    const perksConstMultipliers = () => {
      let total = perksCostMultipliersList().t;

      return total;
    }

    const perksCostMultipliersList = () => {
      let iPenalty = getDimReward(1); 
      let aPenalty = getDimReward(17);
      let sPenalty = (hero.value.rebirthPts >= 1e6? 1 - 0.01 * Math.log(hero.value.rebirthPts + 3): 1);
      let vPenalty = hero.value.voidTreeStats.cost_ascen

      let total = iPenalty * sPenalty * aPenalty * vPenalty;

      return {i: iPenalty, a: aPenalty, s: sPenalty, v: vPenalty, t: total};
    }

    const canUpgrade = (perk) => {
      return (
        perk.tier < 8 && perk.level < perk.max &&
        hero.value.ascensionShards >= perksCost(perk) ||
        perk.tier == 8 && perk.level < perk.max &&
        hero.value.dsTotal >= perksCost(perk)
    
      );
    };

    const upgradePerk = (perk) => {
      const cost = perksCost(perk);

      if(perk.tier == 8 && hero.value.dsTotal >= cost && perk.level < perk.max){
        hero.value.dsSpend += cost;
        perk.level++;
        
      }
      else if (hero.value.ascensionShards >= cost && perk.level < perk.max) {
        hero.value.ascensionShards -= cost;
        perk.level++;
      }
    };

    const dsReset = () => {
      hero.value.dsSpend = 0;
    
    
      ascenPerks.forEach(perk => {
        if (perk.tier === 8) perk.level = 0;
      })
    
      radNodesLimits();
    }

    function radNodesLimits () {
      const maxActivePerks = hero.value.tree.maxRadNodes;
      const activeCount = perks.value.filter(p => p.currentStatus == 'rad').length;
    
      if (activeCount > maxActivePerks) {
        perks.value.forEach(p => {
          if(p.currentStatus == 'rad')
            p.currentStatus == 'base';
        });
      }
    };

    const infPerksLevels = () => {
      let level = 0;

      for(let i in ascenPerks){
        if (ascenPerks[i].tier == 6)
          level += ascenPerks[i].level;
      }

      return level;
    }

    
    const perksMaxLevelHandler = (id) => {
      let perk = ascenPerks[id];

      if(!perk.status.max || perk.tier == 8) return perk.max;

      let globalEffect = 1 + (0.1 * (8 - perk.tier)) * 0;

      if(perk.id == 0 || perk.id == 9 || perk.id == 18) {
        let baseValue = [10, 15, 30];
        let base = baseValue[perk.id/9] * globalEffect ** 2;

        return base;
      }

      if(perk.tier == 6) {
        if(infPerksUnlocked(perk)) return 0;
        let base = 50 * globalEffect;
        base += hero.value.mainInfTier * 5;


        return base;
      }

      
      let base = 1 * globalEffect;

      return base;
    }

    const infPerksUnlocked = (perk) => {
      return (perk.id == 55 || perk.id == 56) && !getDimSpecialReward(17);
    }

    const perksMaxLevelInstall = () => {
      for(let i in ascenPerks){
        ascenPerks[i].max = perksMaxLevelHandler(i);
      }
    }

    const perksEffective = (id) => {
      let perk = ascenPerks[id]

      if(!perk.status.max) return 1;
      
      let globalEffect = 1 + (0.1 * (8 - perk.tier)) * 0; 
    }

    const getPerkDescription = (perk) => {
      if (!perk.status.d) {
        return perk.description;
      }
    
      return `${perk.description}
        <span style="color:#5485b7; font-weight:bold">
          [${fn(perksHandler(perk.id))}]
        </span>`;
    };

    const getCost = (perk) => {
      return fn(perksCost(perk)); 
    }

    const getAscensionShards = () => {
      return fn(hero.value.ascensionShards);
    }

    const ascensionInfluense = () => {
      let effect = Math.max(1 / (1.04 + (ascenPerks[29].level? 0.01: 0)) ** Math.log(hero.value.ascensionShards + 3), 0.01);

      return effect;
    }

    const eventReq = () => {
      let dimsNotAllowed = ['ascension', 'ascension-2', 'c-noEq', 'c-noTree', 'c-ascension', 'c-radiation', 'c-noBuffs'];
  
      if ((hero.value.isSingularity && hero.value.singularity >= 3) || dimsNotAllowed.includes(hero.value.dId)) return true;
  
      return false;
    }

    const ascensionAuto = () => {
      if (hero.value.maxStage < 10) return;

      if(!hero.value.ascensionAuto) return;
    
      if (eventReq()) return;
    
      for (const perk of ascenPerks) {
        if (perk.tier === 7 || perk.level >= perk.max) continue;
    
        const cost = perksCost(perk);
        if (hero.value.ascensionShards <= cost) continue;
    
        let canUpgrade = false;
    
        switch (perk.tier) {
          case 6:
            if(hero.value.infExpansions.ascensioin)
              canUpgrade = true;
            
            break;
    
          case 5:
            canUpgrade = !!radPerks[8].level;
            break;
    
          case 3:
            canUpgrade = hero.value.maxStage >= 40;
            break;
    
          case 2:
            canUpgrade = hero.value.maxStage >= 25;
            break;
    
          case 1:
            canUpgrade = hero.value.maxStage >= 10;
            break;
        }
    
        if (!canUpgrade) continue;
    
        perk.level++;
        hero.value.ascensionShards -= cost;
      }
    };


    const effectsActivated = (tier) => {
      const cards = [];
      
      cards.push('S');

      if (hero.value.abyssTier >= 2)
        cards.push('E');
    
      if (tier === 6)
        cards.push('I');
    
      if ((tier === 6 || tier === 7) && perksCostMultipliersList().t < 1)
        cards.push('C');
    
      if (hero.value.infExpansions.ascensioin)
        cards.push('A');

      return cards;
    }

    
    const activeSelect = (key) => {
      if (key === 'A') return hero.value.ascensionAuto;
    }

    const clickEffects = (key) => {
      if (key === 'A') hero.value.ascensionAuto = !hero.value.ascensionAuto;
      if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Ascension' }
    }

    const effectsHandler = (id) => {
      switch (id) {
        
        case 'S': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#9db8ff;">' +
            '<strong style="color:#c7dcff;">Ascension Shards</strong><br>' +
            'Ascension Shards are obtained by completing stages. You can gain additional shards after Ascension Reset' +
            '</span>'
          );
        }

        case 'E': {
          const effect = ascensionInfluense();
    
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#9db8ff;">' +
            '<strong style="color:#c7dcff;">Enemy Weakness [Ascension Influence]</strong><br>' +
            'Under the Ascension Influence enemies are getting weaker<br>' +
            'Scales with Ascension Shards.<br>' +
            'Current bonus: <strong>' + effect.toFixed(2) + '</strong><br>' +
            'Sourse: Abyss [T2]' +
            '</span>'
          );
        }
    
        case 'I': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#ffd966;">' +
            '<strong style="color:gold;">Infinity Expansion</strong><br>' +
            'Increases the maximum level of Infinity Perks by <strong>+5</strong> for each Infinity Tier in the main dimension.<br>' +
            'Infinity bonuses do not reset during Infinity Trials.<br>' +
            'After every <strong>100 levels</strong>, Infinity Perk costs increase.<br>' +
            `Total Levels: <b>${infPerksLevels()}</b><br>` +
            'Sourse: Infinity Expansion' +
            '</span>'
          );
        }
    
        case 'C': {
          const m = perksCostMultipliersList();
    
          
          let text = '<span style="font-size:0.95em; font-style:italic; color:#8ff;">' +
            '<strong style="color:cyan;">Perk Cost Scaling</strong><br>' +
            'Sources:<br>';
            if (m.s < 1)
              text += 'S: <strong>' + m.s.toFixed(2) + '</strong><br>';
            if (m.i < 1)
              text += 'D1: <strong>' + m.i.toFixed(2) + '</strong><br>';
            if (m.a < 1)
              text += 'D17: <strong>' + m.a.toFixed(2) + '</strong><br>';
            if (m.v < 1)
              text += 'Void: <strong>' + m.v.toFixed(2) + '</strong><br>';

            text += 'Total Multiplier [^]: <strong>' + m.t.toFixed(2) + '</strong>' +
            '</span>'
          
          return text;
        }
        case 'A': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#8ff;">' +
            'Click to enable/disable AUTO purchase of ascension perks.<br>' +
            'Status: ' + (hero.value.ascensionAuto? 'ON': 'OFF') + '<br>' +
            'Sourse: Infinity Expansion' +
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
        ascensionShardsProgress,
        ascensionHandle,
        perksHandler,
        getCost,
        getPerkDescription,
        getAscensionShards,
        dsReset,
        upgradePerk,
        canUpgrade,
        ascensionInfluense,
        perksCostMultipliersList,
        ascensionAuto,
        effectsActivated,
        activeSelect,
        clickEffects,
        effectsHandler,
        infPerksLevels
    }
}