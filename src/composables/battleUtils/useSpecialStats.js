
import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed, h } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { useBuff } from '../../data/buffs.js'
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";
import { goals as infGoals } from "../../data/infGoals.js";
import { divineSkills } from "../../data/quasarCore.js";
import { perks as radPerks } from "../../data/radPerks.js";

import { useDimensions } from "./useDimensions.js";
import { useAbysses } from "./useAbyss.js";
import { useEquipments } from "./useEquipment.js";
import { useAscensions } from "./useAscension.js";
import { useTrees } from "./useTree.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { useTimeline } from "./dims/useTimeline.js";

import { addLog} from '../logService.js';
import { fn } from "../utils/global.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { useAmulets } from "./useAmulets.js";
import { useSingularity } from "./useSIngularity.js";
import { useInfinity } from "./useInfinity.js";
import { useVoid } from "./dims/useVoid.js";
import { useDimHandler } from "./dims/useDimHandler.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { d5RewardHandler } from "./global/d5RewardHandler.js";
import { dGravityHandler } from "./global/dGravityHandler.js";
import { useSpaces } from "./useSpace.js";


export const useSpecialStats = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();

    const { player } = usePlayer();
    const { villian } = useBaseEnemy();

    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { darkInf } = useDimHandler();
    const { abyssHandler, corrInflueceHandle } = useAbysses();
    const { eqCpmplect, getEqEnhanceMaxLevel, getEqMaxLevel } = useEquipments();
    const { perksHandler } = useAscensions();
    const { nodesHandler } = useTrees();
    const { collectLawEffects } = useTimeline();
    const { corrHeartHandler } = useAmulets();
    const { timelineEffects } = useTimeline();
    const { singShardsEffect } = useSingularity();
    const { voidEffects } = useVoid();
    const { spaceBossesMaxLevel } = useSpaces();


    const calculateMinLevelAdditive = () => {
        hero.value.minLevelAdd = 
        nodesHandler(12, ['base', 'inf']) + 
        eqCpmplect() + 
        perksHandler(26) +
        perksHandler(50) +
        perksHandler(54) + 
        perksHandler(68).min +
        ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)) + 
        (hero.value.infExpansions.soul? hero.value.soulPower.base.min: 0) + 
        (hero.value.rebirthTier >= 40? Math.floor(hero.value.rebirthBonusesHandle[5].value): 0) + 
        (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel + hero.value.eqUpsMult['spRing'].bonus) + 
        (hero.value.spCount >= 41? Math.floor(hero.value.spCount / 6): 0) + 
        spaceShopHandler(9, hero) + 
        infBonusesHandler(24, hero) +
        (hero.value.rebirthPts >= 9e5? hero.value.singularity: 0) + 
        
        getDimReward(5).min + 
        getDimReward(12) +
        (getDimSpecialReward(41)? getDimReward(41): 0) + 
        getDimEffect(55) +
        
        trHandle().min + 
        enemy.value.specialCreatures.ddim4.loot + 
        collectLawEffects(10).add +
        abyssHandler(14) +
        (getDimSpecialReward(53)? getDimReward(53): 0) -
        
        voidEffects(4) -
        getDimEffect(53);
    
        hero.value.minLevel = Math.max(hero.value.minLevelAdd, 0);
    }
    
    const calculateMinLevelMultiplicative = () => {
        hero.value.minLevelMult = 1 + 
        getDimReward(33) + 
        (hero.value.selectedDivSkills.includes(13)? divineSkills.value[13].values[1]: 0);
    
        hero.value.minLevel *= hero.value.minLevelMult;
        hero.value.minLevel = Math.floor(hero.value.minLevel);
    
        hero.value.minLevel = (hero.value.dId == 'noMinLevel' || hero.value.dId == 'd-noMinLevel'? 0: hero.value.minLevel);
    }
    
    const calculateLevel = () => {
        calculateMinLevelAdditive();
        calculateMinLevelMultiplicative();
    
        hero.value.level = hero.value.eLevel + hero.value.minLevel;
        hero.value.totalStats.totalLevel = hero.value.level;
        hero.value.maxReachedLevel = Math.max(hero.value.maxReachedLevel, hero.value.level);
        hero.value.maxLevelInfo = hero.value.maxLevel;
    
    }


    const calculateMaxLevelAdditive = () => {
          let maxLevelAdd = 30 + 
          nodesHandler(4, ['base', 'inf']) +
          perksHandler(0) +
          perksHandler(9) +
          perksHandler(18) + 
          perksHandler(56) + 
          perksHandler(68).max +
          perksHandler(26) * 2 + 
          hero.value.soulPower.base.maxLevel + 
          getEqEnhanceMaxLevel() + 
          getEqMaxLevel() +
          eqCpmplect() + 
          corrHeartHandler().totalML + 
          
          
          (hero.value.spCount >= 23? hero.value.sp * 2: 0) + 
          (radPerks[12].level) +
          spaceBossesMaxLevel() +
          spaceShopHandler(1, hero);
          
      
          hero.value.maxLevelAdd = maxLevelAdd;
      
          return maxLevelAdd;
    }
      
    const calculateMacLevelMultiplicative = () => {
          let maxLevelMult = 1 + 
          hero.value.eqUpsMult['ring'].multLevel + 
          
          perksHandler(31) + 
          perksHandler(41) + 
          perksHandler(68).mult +
          corrHeartHandler().totalMLM + 
          abyssHandler(11) + 
          (hero.value.rebirthTier >= 80? hero.value.rebirthBonusesHandle[9].value: 0) +
          
          infBonusesHandler(16, hero) +
          
          getDimReward(5).maxLevel +
          
          trHandle().maxLvlMult + 
          (0.01 * enemy.value.specialCreatures.ddim3.loot) + 
          collectLawEffects(7).add
      
          maxLevelMult *= nodesHandler(4, ['rad']);
      
          hero.value.maxLevelMult = maxLevelMult;
      
          return maxLevelMult;
    }
      
    const calculateMaxLevelExponent = () => {
          let maxLevelExp = enemy.value.darkEnergy.deTotal;
      
          return maxLevelExp;
    }
      
    const calculateMaxLevelTotal = () => {
        hero.value.maxLevel = (calculateMaxLevelAdditive() * calculateMacLevelMultiplicative()) ** calculateMaxLevelExponent();
      
        hero.value.maxLevel *= (hero.value.selectedDivSkills.includes(1)? divineSkills.value[1].values[0]: 1);
        hero.value.maxLevel *= corrInflueceHandle(11);
        hero.value.maxLevel *= (hero.value.selectedDivSkills.includes(13)? divineSkills.value[13].values[0]: 1);
          
        hero.value.trueLevel = Math.floor(hero.value.maxLevel); 
      
        hero.value.tr.count = Math.min(hero.value.trueLevel / 70000, 1000);
        trSpreadHandle();

        calculateInfReductionTotal();
        singLevels()
        globalMaxLevelEffect();

        hero.value.maxLevel = Math.floor(Math.max(hero.value.maxLevel, 1));

        infTierLevelReq();
        infTrial();

        voidTierEffect();
    }
            
    const globalMaxLevelEffect = () => {
            hero.value.maxLevel = hero.value.infProgress? Math.floor((Math.pow(hero.value.maxLevel, hero.value.infPower))): hero.value.maxLevel;
          
            let sLevels = hero.value.singularityLevels;
            let corruption = Math.min(hero.value.corruption.total, hero.value.corruption.cap);
            let dCorruption = Math.min(hero.value.corruption.total, hero.value.corruption.dcap) * 0.1;
            
            if(hero.value.dId.startsWith('d-')){
              let mult = getDimEffect(26).corr;
              hero.value.maxLevel *= getDimEffect(38);
              hero.value.maxLevel = Math.floor(Math.min(300 + (hero.value.maxLevel - 300) * dCorruption / mult, 700 + sLevels));

            }
            else if(hero.value.dId == 'noMaxLevel') {
                hero.value.maxLevel = 1;
                hero.value.eLevel = 1;
            }
            else if(hero.value.dId == 'unlimitted' || hero.value.dId == 'c-unlimitted')
              hero.value.maxLevel = Math.min(hero.value.maxLevel, hero.value.trueLevel)

            else if(hero.value.dId == 'next')
              hero.value.maxLevel = Math.floor(Math.min(hero.value.maxLevel ,700 + sLevels))

            else if(hero.value.maxLevel >= 300 && hero.value.abyssTier >= 3)
              hero.value.maxLevel = Math.floor(Math.min(300 + (hero.value.maxLevel - 300) * corruption ,700 + sLevels))

            else if(hero.value.abyssTier < 3 && hero.value.rebirthPts <= 1e5 && hero.value.infTier >= 3)
              hero.value.maxLevel = Math.min(hero.value.maxLevel, 300);

            else if(hero.value.infTier < 3)
              hero.value.maxLevel = Math.min(hero.value.maxLevel, 100 + 10 * hero.value.rebirthTier);

            else 
              hero.value.maxLevel = Math.min(hero.value.maxLevel, 700 + sLevels);
    }

    const singLevels = () => {
        let sLevels = Math.floor((hero.value.rebirthPts >= 4.5e5? Math.log(hero.value.rebirthPts + 3) ** 1.906: 0)) + 
        25 * (hero.value.singularity) + 
        75 * hero.value.bhTier + 
        singShardsEffect(4) + 
        hero.value.voidTreeStats.sing_levels_1;
    
        hero.value.singularityLevels = Math.floor(sLevels);
    }

    const infTierLevelReq = () => {
      hero.value.mainInfTierCap = 60 + 2 * hero.value.dims.corrShards;
      hero.value.infTierLevelReq = 700 + 25 * hero.value.dims.corrShards;
    }

    const calculateInfReductionTotal = () => {
        calculateInfReduction();
        hero.value.infPenalty = (hero.value.dId.startsWith('d-')? 0: hero.value.infPenalty);

        calculateInfPower();
    }
    
    const infTrial = () => {
        if(hero.value.infProgress && hero.value.level >= hero.value.infTierLevelReq && hero.value.dId == 'main'){
          hero.value.infProgress = false;
          let pass = 1 + (hero.value.voidTreeStats.inf_double_complete? 1: 0);
          hero.value.mainInfTier = Math.min(hero.value.mainInfTier + pass, hero.value.mainInfTierCap);
          hero.value.infTier = hero.value.mainInfTier;
        }

        if(hero.value.level >= 700)
          hero.value.infUnlocked = true;
    }
    
    const calculateInfPower = () => {
        let min = hero.value.voidTreeStats.inf_pen_base;
        let max = 1;
        hero.value.infPower = Math.max(Math.min(1 - 0.02 * (hero.value.infTier + 1) + hero.value.infPenalty, max), min);
    }

    const calculateInfReduction = () => {
        hero.value.infPenalty = 
        perksHandler(47) + 
        perksHandler(42) + 
        (hero.value.rebirthPts >= 2.5e6? Math.sqrt(Math.log(hero.value.rebirthPts)) * 0.015: 0) + 
        abyssHandler(17) + 
        infBonusesHandler(36, hero) + 
        d5RewardHandler(2, hero) +
        getDimReward(13) + 
        getDimReward(27) + 
        (hero.value.selectedDivSkills.includes(2)? divineSkills.value[2].values[0]: 0) + 
        (hero.value.selectedDivSkills.includes(8)? divineSkills.value[8].values[0]: 0) + 
        (enemy.value.specialCreatures.dim6.loot * 0.01) + 
        (0.0075 * enemy.value.specialCreatures.ddim1.loot) + 
        singShardsEffect(14) + 
        hero.value.voidTreeStats.inf_res_1 + 
        
        (hero.value.dId == 'c-noEq'? 0.03 * hero.value.forgeTier: 0) + 
        (hero.value.dId == 'c-ascension'? 0.01 * Math.log(Math.max(Math.sqrt(hero.value.ascensionShards), 3)): 0);
    
        return hero.value.infPenalty;
    }



    const calculateCorruption = () => {
        let base =  
        getCorruptionSourses("space") +
        getCorruptionSourses("rad") +
        getCorruptionSourses("inf") +
        getCorruptionSourses("rebirth") +
        getCorruptionSourses("dim") +
        getCorruptionSourses("abyss");
    
        hero.value.corruption.total = hero.value.corruption.base + base;
    }

    const getCorruptionSourses = (type) => {

      switch(type) {
        case "space": return (hero.value.spCount >= 22? 1.003 ** hero.value.sp - 1: 0);
        case "rad": return (radPerks[11].level? 0.02 * Math.floor((hero.value.maxStage - 5)/5): 0);
        case "inf": return infBonusesHandler(10, hero);
        case "rebirth": return (hero.value.rebirthTier >= 70? hero.value.rebirthBonusesHandle[8].value: 0);
        case "dim": return getDimReward(22).weak + getDimReward(26).corr;
        case "abyss": return abyssHandler(2);
      }
    }
    
    const corruptionEffects = () => {
        if(hero.value.dId == 'corruption') hero.value.corruption.total = 0.1;
    
        if(hero.value.dId == 'd-corruption' || hero.value.darkId.includes('d-corruption'))
          hero.value.corruption.status = 'dark'
        else hero.value.corruption.status = 'base';
    }
    
    
    const corrInfluenceHandle = () => {
        let corr = 5 +
        hero.value.dims.corrShards +
        (getDimEffect(45)) +  
        getDimEffect(51) + 
        timelineEffects().corrInfluence + 
        voidEffects(9);
        
        corr -= collectLawEffects(6).add + 
        trHandle().corrInfluece + 
        abyssHandler(18) + 
        infBonusesHandler(33, hero) +
        d5RewardHandler(4, hero);
    
        corr = Math.max(Math.min(corr, 100), 0);
    
        hero.value.corrInfluence = corr;
    }
    
    const corruptionHandle = () => {
        calculateCorruption();
        killLose();
        corruptionEffects();
        corruptionShards();
        corrInfluenceHandle();
    }

    const killLose = () => {
      let t = hero.value.corruption.total;
      let cap = (hero.value.dId.startsWith('d-')? hero.value.corruption.dcap: hero.value.corruption.cap);
      let base = (hero.value.dId.startsWith('d-')? 0.0005: 0.005) / corrInflueceHandle(8);
      let total = Math.min(t, cap) + (Math.max(t - cap, 0) / Math.max(Math.sqrt(t ** 4), 1))

      let lose = 1 - base * total * 100;

      hero.value.corruption.killsLose = Math.max(Math.min(lose, 1), 0);
    }

    const corruptionShards = () => {
      hero.value.dims.corrShards = dimensions.value.filter(d => d.id.startsWith('c-')).reduce((sum, d) => sum + (d.infTier == d.spInfTier? 1: 0), 0) + 
      singShardsEffect(15) + 
      abyssHandler(21) +
      d5RewardHandler(7, hero) +
      dGravityHandler(5, hero).v + 
      enemy.value.specialCreatures.ddim12.loot;
    }

    const darkEnergyHandle = () => {
      
      const h = hero.value;
      let mult = 1;
      if (h.dId == 'd-overstage')
        enemy.value.darkEnergy.totalBosses = Math.min(
        Math.max(Math.floor((hero.value.stages.current - 95) / 5), enemy.value.darkEnergy.maxTotalBosses),
        enemy.value.darkEnergy.maxBosses);

      if(dimensions.value[29].infTier >= 10){
        let totalInfs = dimensions.value.filter(d => d.id.startsWith('d-')).reduce((sum, d) => sum + d.infTier, 0);
        totalInfs = Math.max(totalInfs, 0);
        
        mult = 1 + totalInfs * 0.0001 * (1 + dimensions.value[29].infTier * 0.01);
      }

      enemy.value.darkEnergy.maxTotalBosses = Math.max(enemy.value.darkEnergy.maxTotalBosses, enemy.value.darkEnergy.totalBosses);
  
      let bossMult = 0.0025;

      let max = (dimensions.value[29].infTier >= 15? 
        Math.max(enemy.value.darkEnergy.totalBosses, enemy.value.darkEnergy.maxTotalBosses): enemy.value.darkEnergy.totalBosses);
  
      enemy.value.darkEnergy.maxBosses = 5 + dimensions.value[29].infTier;
      enemy.value.darkEnergy.mult = 1.07 + 0.07 * dimensions.value[29].infTier;
      enemy.value.darkEnergy.deTotal = 1 + (darkEnergyBossMult(max) * enemy.value.darkEnergy.mult * mult) * 
      perksHandler(58) * 
      (h.dId == 'c-radiation'? 1 * Math.log(Math.sqrt(Math.max(hero.value.mutagen, 3))): 1);
    }

    const darkEnergyBossMult = (max) => {
      let total = 0;

      for (let i = 0; i < max; i++) {
        if (i < 20)
          total += 0.0025;
        else if (i < 30)
          total += 0.002;
        else if (i < 40)
          total += 0.0015;
      }

      return total;
    }

    const darkEnergyBossHandle = () => {
      let tier = Math.max(Math.floor((dimensions.value[29].infTier - 5) / 5), 0);
      let d = dimensions.value[29].infTier;

      villian.value.deBoss.tier = tier;
      villian.value.deBoss.regen = (tier >= 1? Math.min(1 + 0.5 * (d - 10), 25) : 0);
      villian.value.deBoss.def = (tier >= 2? 5 + 2.5 * (d - 15): 0);
      villian.value.deBoss.timer = (tier >= 3? 15 - 0.1 * Math.min(d - 20, 50): -1);
      villian.value.deBoss.shields = (tier >= 4? 2 + Math.max(d - 25, 0): 0);

      villian.value.deBoss.stats.hp = 1.1 ** enemy.value.darkEnergy.totalBosses;
      villian.value.deBoss.stats.dmg = 1 + 0.04 * enemy.value.darkEnergy.totalBosses;
    }

    const bleedVealHandle = () => {
        let mult = 1.01 + 0.0025 * dimensions.value[30].infTier;
        let red = (hero.value.dId == 'd-survival-2'? 200 * (mult ** hero.value.stages.current) * Math.log(3 + dimensions.value[30].infTier) ** 4: 0);

        red = (perksHandler(61) ? Math.max(red - player.value.stats.final.def, 0): red);
        red = Math.floor(red);
    
        player.value.status.dims.veil.damage = red;
    }

    const enemySkills = () => {
        villian.value.skills.active = []; 
    
        let buffTiers = [1, 4, 6, 8, 12, 16, 20, 25];
        let maxCount = 8;
        let count = Math.min(getBuffIntervalPosition(buffTiers, dimensions.value[32].infTier), maxCount);
        
    
        if(hero.value.dId == 'd-noBuffs'){
          villian.value.skills.active = [];

          for(let idx = 0; idx < count; idx++){
            villian.value.skills.active.push(idx);
          }
        }
    
        if(hero.value.darkId.includes('d-noBuffs')){
          let descrase = Math.min(Math.log(1 + dimensions.value[32].infTier) ** 4 , 80);
    
          for(let idx = 0; idx < maxCount; idx++){
            let chance = (Math.random() * 100 + Math.max(100 - descrase, 20) >= 100? true: false);
            if(chance)
              villian.value.skills.active.push(idx);
          }
        }
    }


    function getBuffIntervalPosition(arr, num) {
        if (num <= 0) return 1; 
      
        let pos = 1;
        for (let i = 0; i < arr.length; i++) {
          if (num >= arr[i]) {
            pos = i + 2; 
          } else {
            break;
          }
        }
        return pos;
    }


    const darkDimsHandle = (dt) => {
      darkEnergyHandle();
      bleedVealHandle();
    }

    const trSpreadHandle = () => {
      hero.value.tr.spread = (hero.value.voidTreeStats.inf_tr_spread? 5: 0) +
      infBonusesHandler(38, hero) + 
      dGravityHandler(2, hero).v;
    }
    

    const trHandle = () => {
      let maxLevelMult = 0;
      let atk = 1;
      let minLevel = 0;
      let ipMult = 1;
      let corrInfluece = 0;
      let tr = 0;

      let h = hero.value;

      let trStatus = (h.tr.spread > 0 && 
        h.dId != 'main' && h.dId != 'bh' && h.dId != 'advanceBH'? 'd': 'm');

      if (trStatus == 'm') {
        tr = (h.dId != 'main'? 0: h.tr.count);
        tr = (h.dId == 'bh'? h.tr.bhCount: tr);
        tr = (h.dId != 'advanceBH'? tr: h.tr.count);
      }
      tr = (trStatus == 'd'? h.tr.count * h.tr.spread * 0.01: tr);

      tr = Math.floor(tr);

      let cap = hero.value.tr.max;

      trCapHandle();

      if (h.bhTier > 0)
        maxLevelMult = 0.1 * Math.min(tr, cap[0]);

      if (h.bhTier > 1)
        atk = 1 + 0.05 * Math.min(tr, cap[1]);

      if (h.bhTier > 2)
        minLevel = Math.min(tr, cap[2]);

      if (h.bhTier > 3)
        ipMult = 0.01 * Math.min(tr, cap[3]);

      if (h.bhTier > 4)
        corrInfluece = 0.5 * Math.min(tr, cap[4]);

      return {
        maxLvlMult: maxLevelMult,
        atk: atk,
        min: minLevel,
        ip: ipMult,
        corrInfluece: corrInfluece,
        tr: tr,
        status: trStatus
      }

    }

    const trCapHandle = () => {
      let cap = hero.value.tr

      cap.max[0] = 30 + singShardsEffect(7)
      cap.max[1] = 30 + singShardsEffect(8)
      cap.max[2] = 30 + singShardsEffect(9)
      cap.max[3] = 30 + singShardsEffect(11)
      cap.max[4] = 30 + singShardsEffect(13)
    
    }

    const createSingulars = () => {
      if(hero.value.dId == 'bh') {
        villian.value.spawnType = 'bh';
        villian.value.name = enemy.value.bh.name[hero.value.bhTier];
        villian.value.bh.status = true;
        villian.value.bh.tier = hero.value.bhTier;

        villian.value.hp = enemy.value.bh.hp[hero.value.bhTier];
        villian.value.bh.attack = enemy.value.bh.attack[hero.value.bhTier];
        villian.value.bh.aps = enemy.value.bh.aps[hero.value.bhTier];
        
        villian.value.bh.stacks = 0;
        hero.value.tr.bhCount = hero.value.tr.count;
      }
    }

    const critMilestoneHandle = (id) => {
      let crit = Math.max(player.value.stats.final.crit - 100, 0);
      let critDmg = Math.max(player.value.stats.final.critDmg - 50, 0);

      let triggerChance = 1 + (player.value.stats.final.critDmg > 45? Math.max(Math.log(crit), 0) * 0.1: 0);
      let triggerEffect = 1 + (player.value.stats.final.critDmg > 50? Math.sqrt(critDmg) * 0.1: 0);

      switch(id){
        case 0: {
          let chance = 2 * triggerChance;
          let d = 0.2 * triggerEffect;

          return {chance: chance, d: d};
        }
        case 1: {
          let healEffect = 1 * triggerEffect ** 1.1;

          return healEffect;
        }
        case 2: {
          let defIgnore = 4 * triggerEffect;

          return defIgnore;
        }
        case 3: {
          let chance = 4 * triggerChance;
          let d = 0.5 * triggerEffect;

          return {chance: chance, d: d};
        }
        case 4: {
          return 2;
        }
        case 5: {
          let base = 50 * triggerEffect ** 1.25;

          return base;
        }
        case 6: {
          let chance = 0.5 * triggerChance;
          let effect = 2 * triggerEffect;

          return {chance: chance, effect: effect};
        }
        case 7: {
          return triggerChance;
        }
        case 8: {
          return triggerEffect;
        }
      }
    }

    function renderMilestones() {
      var crit = player.value.stats.final.crit;
      var critDmg = player.value.stats.final.critDmg;
    
      var cChance = "#00BFFF";  
      var cEffect = "orange";  
      var cTrigger = "#00BFFF";   
    
      var milestones = [
        { value: 10, text: "<span style='color:" + cChance + ";font-weight:bold;'>" + fn(critMilestoneHandle(0).chance) + "%</span> chance to stun enemy for <span style='color:" + cEffect + ";font-weight:bold;'>" + fn(critMilestoneHandle(0).d) + "s</span>" },
        { value: 15, text: "On CRIT kill: Heal <span style='color:" + cEffect + ";font-weight:bold;'>" + fn(critMilestoneHandle(1)) + "%</span> Max HP ignoring HEAL MULT" },
        { value: 20, text: "<span style='color:" + cChance + ";font-weight:bold;'>" + fn(critMilestoneHandle(2)) + "%</span> chance to ignore Enemy DEF" },
        { value: 25, text: "<span style='color:" + cChance + ";font-weight:bold;'>" + fn(critMilestoneHandle(3).chance) + "%</span> chance to prevent healing for <span style='color:" + cEffect + ";font-weight:bold;'>" + fn(critMilestoneHandle(3).d) + "s</span>" },
        { value: 30, text: "On kill: Double loot" },
        { value: 35, text: "On kill: <span style='color:" + cEffect + ";font-weight:bold;'>+" + critMilestoneHandle(5) + "</span> Overkill" },
        { value: 40, text: "<span style='color:" + cChance + ";font-weight:bold;'>" + fn(critMilestoneHandle(6).chance) + "%</span> chance to deal <span style='color:" + cEffect + ";font-weight:bold;'>" + fn(critMilestoneHandle(6).effect) + "%</span> of Enemy's Max HP as DMG." },
        { value: 45, text: "Increase <span style='color:" + cTrigger + ";font-weight:bold;'>trigger chance</span> based on CRIT above 100. <span style='color:" + cTrigger + ";font-weight:bold;'>[" + fn(critMilestoneHandle(7)) + "]</span>" },
        { value: 50, text: "Increase <span style='color:" + cEffect + ";font-weight:bold;'>effect power</span> based on CRIT DMG above 50. <span style='color:" + cEffect + ";font-weight:bold;'>[" + fn(critMilestoneHandle(8)) + "]</span>" }
      ];
    
      var text = "";
      text += "<b style='color:gold'>CRIT MILESTONES</b><br><br>";
    
      text += "Activate The Trigger if <span style='color:" + cEffect + ";font-weight:bold;'>CRIT DMG</span> reaches certain values. <br><br>";
      text += "Effects trigger only on <span style='color:" + cTrigger + ";font-weight:bold;'>CRIT</span>.<br>" +
"After that, each effect has its own <span style='color: #00BFFF;font-weight:bold;'>chance to activate</span>.<br><br>"
    
      text += "CRIT: <span style='color:" + cTrigger + ";font-weight:bold;'>" + fn(crit) + "</span><br>";
      text += "CRIT DMG: <span style='color:" + cEffect + ";font-weight:bold;'>" + fn(critDmg) + "</span><br><br>";
    
      for (var i = 0; i < milestones.length; i++) {
        var m = milestones[i];
        var active = critDmg >= m.value;
    
        text += "<span style='color:" + (active ? "white" : "#777") + ";'>";
        text += "<span style='color:" + (active ? "gold" : "#555") + ";font-weight:bold;'>[" + m.value + "]</span> ";
        text += m.text;
        text += "</span><br>";
      }
    
      return text;
    }

    const voidTierEffect = () => {
      if (hero.value.dId != 'dimMerge') return;

      hero.value.infTier = 100 + voidEffects(10);
      dimensions.value[42].infTier = 100 + voidEffects(10);
    }    

    return {
        calculateLevel,
        calculateMaxLevelTotal,
        corruptionHandle,
        getCorruptionSourses,
        darkDimsHandle,
        darkEnergyBossHandle,
        enemySkills,
        trHandle,
        createSingulars,
        renderMilestones,
        critMilestoneHandle
    }
}