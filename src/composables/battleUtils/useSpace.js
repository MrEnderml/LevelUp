import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks as ascenPerks } from "../../data/ascension.js";
import { useBuff } from "../../data/buffs.js";
import { dimensions } from "../../data/dimensions.js";
import { spaceShop } from "../../data/spaceShop.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";

import { addLog } from "../logService.js";

import { spEnemy } from "../../data/spaceEnemy.js";
import { spaceStatsConfig } from "../../data/spaceEnemyStats.js";

import { useAscensions } from "./useAscension.js";
import { useAbysses } from "./useAbyss.js";
import { useDimensions } from "./useDimensions.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { useTrees } from "./useTree.js";
import { useInfinity } from "./useInfinity.js";

import { fn } from "../utils/global.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useSouls } from "./useSouls.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { divineSkills } from "../../data/quasarCore.js";
import { dGravityHandler } from "./global/dGravityHandler.js";

export const useSpaces = () => {
  const { hero } = useHero();
  const { enemy } = useEnemy();
  const { buffs } = useBuff();

  const { player } = usePlayer("space");

  const { villian } = useBaseEnemy("space");

  
  const { abyssHandler, corrInflueceHandle } = useAbysses();
  const { infPenalties } = useInfinity();
  const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
  const { perksHandler } = useAscensions();
  const { nodesHandler } = useTrees();

  const spaceHandle = () => {
    if (hero.value.spbCount >= 2) {
      hero.value.equipmentTiers["spRing"] = 1;
      hero.value.eqTierReq["spRing"] = 1;
    }

    if (hero.value.rebirthPts >= 1e5 && hero.value.abyssTier >= 3) {
      for (let i = 0; i < cursed.length; i++) {
        cursed[i].tier[3].status = true;
      }
    }

    if (hero.value.spCount >= 27) {
      buffs.value[4].maxTier = 4;
    }
    if (hero.value.spCount >= 31) {
      buffs.value[3].maxTier = 4;
    }

    hero.value.spbCount = Math.floor(hero.value.spCount / 6);

    hero.value.st =
    hero.value.spbCount + 
    enemy.value.specialCreatures.inf3.loot + 
    spaceShopHandler(20, hero);

    hero.value.stBosses = Math.floor(hero.value.spCount / 6);

    if (hero.value.spbCount >= 5) {
      hero.value.equipmentTiers["spRing"] = 1 + hero.value.st;
    }

    
    if (corrInflueceHandle(10))
      hero.value.baseSp = 0;
    else hero.value.baseSp = getSP(hero.value.spCount);
    
    hero.value.sp =
      hero.value.baseSp +
      enemy.value.specialCreatures.dim2.loot +
      getDimReward(23) + 
      spaceShopHandler(5, hero);

    hero.value.spMaxCount =
      24 +
      (hero.value.infExpansions.space ? 6 : 0) +
      (hero.value.singularity >= 5 ? 6 : 0) +
      (hero.value.rebirthPts >= 7.5e6? 6: 0) +
      (getDimSpecialReward(23) ? 6 : 0);

    hero.value.isInfSpace =
      hero.value.spCount >= 48 && hero.value.bhTier >= 3 ? true : false;
    hero.value.isInfSpace =
      hero.value.dId == "main" || hero.value.dId == "d-noSpace" || hero.value.dId == 'c-noSpace'
        ? hero.value.isInfSpace
        : false;

    spEnemy[48].status = hero.value.isInfSpace ? true : false;

    hero.value.spaceUnlocked =
      hero.value.abyssTier < 3 || hero.value.rebirthPts < 1e5 ? false : true;
  };

  

  const getSP = (spCount) => {
    let totalSP = 0;
    let currentSPValue = 1;
    let stepsInCycle = 0;

    for (let i = 1; i <= spCount; i++) {
      stepsInCycle++;

      if (stepsInCycle === 6) {
        stepsInCycle = 0;
        currentSPValue++;
        continue;
      }

      totalSP += currentSPValue;
    }

    return totalSP;
  };

  const specialStats = computed(() => {
    return specialStatsCalculated();
  })

  const specialStatsCalculated = () => {
    const stats = {}
    const infWardenKills = hero.value.spsCount
    const celestialKills = hero.value.spbCount;

    let weakStatus = spaceShopHandler(11, hero);

    for (const [key, cfg] of Object.entries(spaceStatsConfig)) {
      let value =
        cfg.base +
        (cfg.celestial ?? 0) * celestialKills +
        (cfg.infWarden * weakStatus ?? 0) * infWardenKills

      const isMax = cfg.max !== undefined && value >= cfg.max
      const isMin = cfg.min !== undefined && value <= cfg.min

      if (cfg.min !== undefined) value = Math.max(cfg.min, value)
      if (cfg.max !== undefined) value = Math.min(cfg.max, value)

      stats[key] = {
        raw: value,
        display: cfg.format ? cfg.format(value) : value,
        breakdown: {
          base: cfg.base,
          celestials: cfg.celestial ?? 0,
          infWarden: cfg.infWarden ?? 0,
        },
        isMax,
        isMin
      }
    }

    return stats
  }

  const createSpecialStats = () => {
    villian.value.name = spEnemy[hero.value.spCount].name;
    villian.value.spawnType = "space";

    villian.value.space.stats = specialStatsCalculated();

    villian.value.space.fightCooldown = villian.value.space.stats.fightCooldown.raw;
  }

  const createSpaceCreature = () => {
    createSpecialStats();
  };

  const eventReq = () => {
    let dimsNotAllowed = ['noSpace', 'c-noEq', 'c-noTree', 'c-ascension', 'c-radiation', 'c-noBuffs'];

    if ((hero.value.isSingularity && hero.value.singularity >= 4) || dimsNotAllowed.includes(hero.value.dId)) return true;

    return false;
  }

  const spaceAuto = (dt) => {
    if (villian.value.space.spaceCooldown > 0) {
      villian.value.space.spaceCooldown = Math.max(villian.value.space.spaceCooldown - dt, 0);
      return;
    };

    if (!hero.value.isSpaceAuto) return;
    if (!hero.value.spaceUnlocked || villian.value.space.isSpaceFight) return;
    if (hero.value.spCount >= hero.value.spMaxCount && !hero.value.isInfSpace) return;
    if (!hero.value.infExpansions.space) return;
    if (!spEnemy[hero.value.spCount].status) return;
    if (eventReq()) return;
    
    attackSpaceEnemy();
  }

  const battleChanger = () => {
    return hero.value.noBattleWindowChanges && villian.value.space.spaceCooldown == 0 && villian.value.space.isSpaceFight; 
  }

  const stardustStage = () => {
    hero.value.stardustStage = 39 - (hero.value.spCount >= 8? 1: 0) - (hero.value.spCount >= 14? 2: 0) - (hero.value.spCount >= 20? 2: 0) - 
    (hero.value.spCount >= 32? 3: 0) - (hero.value.spCount >= 39? 3: 0) - (hero.value.spCount >= 44? 4: 0) - 
    spaceShopHandler(12, hero);

    hero.value.stardustStage = Math.floor(Math.max(hero.value.stardustStage, 1));
  }

  const attackSpaceEnemy = () => {
    if (hero.value.noBattleWindowChanges) hero.value.spaceWindowChange = true;

    if (villian.value.space.isSpaceFight) return;
    player.value.dead = false;
    player.value.bar = 0;
    player.value.hp = player.value.stats.final.hp;
  
    villian.value.dead = false;
    villian.value.bar = 0;
    villian.value.hp = villian.value.stats.final.hp * (player.value.buff.activeBuffs.includes(16)? 0.75: 1);
    
  
    villian.value.space.isSpaceFight = true;

    extraLifeSkill();
    createSpaceCreature();
  }

  const leaveSpaceEnemy = () => {
    villian.value.dead = true;
    villian.value.space.isSpaceFight = false;
    villian.value.space.spaceCooldown = 3;

    player.value.hp = 0;
    player.value.buff.activeBuffs.length = 0;
    player.value.buff.overflowBuffs.length = 0;

    hero.value.battleId = "main";

  }

  const extraLifeSkill = () => {
    if (!player.value.buff.activeBuffs.includes(10)) return;

    const tier = buffs.value[10].tier;

    const chance = 0.5 + getDimReward(4);

    const guaranteed = Math.floor(chance);
    const extraChance = chance - guaranteed;

    let charges = guaranteed;

    if (Math.random() < extraChance) {
      charges += 1;
    }


    let shields = (tier >= 4? tier: 0);

    player.value.status.extraLife = {
      charges: charges,              
      chance: chance,                
      buffTime: 0,
      immuneTime: 0,
      shields: shields
    };
  }

  const stardustDrop = (ctx) => {
    if(hero.value.spCount < 2 || hero.value.stages.current - hero.value.stardustStage < 0) return 0;

    stardustStage();

    let stardust = (1.0525 ** (hero.value.stages.current - hero.value.stardustStage)) * 
    (hero.value.mainInfTier < 9? 2: 1) *
    nodesHandler(17, ['base', 'inf']) * 
    perksHandler(34) * 
    perksHandler(66) *
    (hero.value.infExpansions.space? 2: 1) * 
    abyssHandler(4) * 
    (hero.value.cursesChances[3].status? 2: 1) * 
    (hero.value.spCount >= 45? hero.value.battleContent["main"].player.formationStats.loot: 1) *
    hero.value.soulPower.base.stardust *
    (hero.value.battleContent["main"].player.status.traveler.stardust) * 
    (hero.value.battleContent["main"].player.status.conquer.loot) *
    
    infBonusesHandler(19, hero) * 
    spaceShopHandler(0, hero) *
    (1 + 0.05 * enemy.value.specialCreatures.ddim5.loot) * 
    getDimReward(37).stardust *
    (hero.value.selectedDivSkills.includes(7)? divineSkills.value[7].values[0]: 1) * 
    ctx.player.status.critMls.loot *
    hero.value.voidTreeStats.stardust_1 *

    hero.value.stardustPenalty.d32 * 

    (hero.value.timePenalty? 0: 1);
    
    stardust /= infPenalties().stardust;

    stardust **= cursed[17].loot;
    stardust **= dGravityHandler(3, hero).v;

    hero.value.avgLoot.stardust.acc += stardust;

    return stardust;
  }

  const starudstGain = (ctx) => {
    let stardust = stardustDrop(ctx);
    hero.value.stardustInfo = 0;

    if(stardust > 0){
      addLog(`You gain <b style="color: gold">${fn(stardust, true)} stardust</b>`, "Stardust");
      hero.value.stardust += stardust;
      hero.value.stardustInfo = stardust;
      enemy.value.averageLoot.stardust = stardust;
    } else {
      enemy.value.averageLoot.stardust = 0;
    }
  }

  const getStardustOnReset = () => {
    let bonus = (hero.value.bhTier >= 1? 1e7: 0);

    return bonus;
  }

  function buyAstralisPerk(perk) {
    if (hero.value.stardust >= astralisPerkCost(perk) && !perk.status) {

      hero.value.stardust -= astralisPerkCost(perk);
      perk.status = true;
    }
  }

  const astralisPerkCost = (perk) => {
    let red = (getDimSpecialReward(49)? getDimReward(49): 1);

    let cost = perk.cost / red;

    return Math.max(cost, 0);
  }

  const resetSpace = () => {
    if (hero.value.dId == 'main' && hero.value.mainInfTier >= 60) {
      hero.value.spCount = hero.value.spMaxCount;
      hero.value.spsCount = hero.value.spsCountMax;
    } else {
      hero.value.spCount = Math.min(getDimReward(37).count, hero.value.spMaxCount);
      hero.value.spsCount = Math.max(getDimReward(37).count - 48, 0);
    }
    

    hero.value.spbCount = Math.floor(hero.value.spCount / 6);
    hero.value.sp = 0;
    hero.value.st = 0;

    villian.value.space.isSpaceFight = false;

    if(hero.value.singularity < 5) {
      for(let sp of spEnemy){
        if(sp.type == 'boss'){
          sp.status = false;
        }
      }
    }  

  }

  const spaceBossesMaxLevel = () => {
    const h = hero.value;
    let tier = h.spbCount;
    let ML = 0;
    let base = 50;

    for (let i = 0; i < tier; i++)
      ML += base * i;

    return ML;
  }

  const effectsActivated = () => {
    const cards = [];
    
    if (hero.value.infExpansions.space)
      cards.push('A');
    
    cards.push('W');

    cards.push('S');

    cards.push('T');

    cards.push('C');

    cards.push('P');

    if(hero.value.bhTier >= 3)
      cards.push('I');

    return cards;
  }

  
  const activeSelect = (key) => {
    if (key === 'A') return hero.value.isSpaceAuto;
    if (key === 'W') return hero.value.noBattleWindowChanges
  }

  const clickEffects = (key) => {
    if (key === 'A') return hero.value.isSpaceAuto = !hero.value.isSpaceAuto;
    if (key === 'W') return hero.value.noBattleWindowChanges = !hero.value.noBattleWindowChanges;

    if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Space' }
  }

  const effectsHandler = (id) => {
    switch (id) {
  
      case 'A': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Auto Battle</strong><br>' +
          'Status: ' + (hero.value.isSpaceAuto? 'ON': 'OFF') +
          '</span>'
        );
      }
      
      case 'W': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Auto Teleport</strong><br>' +
          'You will be teleported into the space battle every time it starts.<br>' +
          'Status: ' + (hero.value.noBattleWindowChanges? 'ON': 'OFF') +
          '</span>'
        )
      }

      case 'S': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Stardust Stage</strong><br>' +
          `Stardust appears at Stage <b>${hero.value.stardustStage + 1}</b><br>` +
          `The amount of stardust dropped increases for each stage completed.` +
          '</span>'
        )
      }

      case 'T': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Space Tier</strong><br>' +
          `Current Space Tier: ${hero.value.spbCount}<br>` +
          `Max Space Tier: ${Math.floor(hero.value.spMaxCount / 6)}<br>` +
          '</span>'
        )
      }

      case 'C': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Celestial</strong><br>' +
          `After you've killed five space creatures, you'll encounter a Celestial. 
          To find a Celestial, you need to increase your Danger level, kill enemies in the main battle, and there's a chance the Celestial will appear. 
          After defeating the Celestial, you'll advance to the next Space Tier, and the space creatures will become stronger and gain new ability` +
          '</span>'
        )
      }

      case 'I': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Infinity Wardens</strong><br>' +
          `After defeating the Beat Hole [T3], you'll unlock Infinite Space filled with space creatures. 
          There's no limit to their numbers, but each Infinity Warden becomes significantly more powerful. 
          After every 10 Infinity Wardens killed, new abilities are unlocked.` +
          '</span>'
        )
      }

      case 'P': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb7f04;">' +
          '<strong style="color:#ffb700;">Space Power</strong><br>' +
          `Space power directly influences:
          <b>[SP-11]: EXP MULT
          [SP-13]: Equipment Drop Chance
          [SP-46]: Corruption weakness
          [SP-50]: Max Level
          [SP-119]: Danger
          [SP-148]:CRIT DMG</b>` +
          '</span>'
        )
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
    spaceHandle,
    createSpaceCreature,
    spaceAuto,
    starudstGain,
    effectsActivated,
    activeSelect,
    clickEffects,
    effectsHandler,
    getStardustOnReset,
    resetSpace,
    specialStats,
    attackSpaceEnemy,
    leaveSpaceEnemy,
    buyAstralisPerk,
    astralisPerkCost,
    specialStatsCalculated,
    spaceBossesMaxLevel
  };
};
