import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { perks as radPerks } from '../../data/radPerks.js';
import { useBuff } from '../../data/buffs.js'
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";

import { useTrees } from "./useTree.js";
import { useRebirths } from "./useRebirth.js";
import { useSpaces } from "./useSpace.js";
import { useRadiations } from "./useRadiation.js";
import { useDimensions } from "./useDimensions.js";
import { useAmulets } from "./useAmulets.js";

import { fn } from "../utils/global.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useEquipments } from "./useEquipment.js";
import { useSpecialStats } from "./useSpecialStats.js";
import { useAbysses } from "./useAbyss.js";
import { useDimHandler } from "./dims/useDimHandler.js";
import { useTimeline } from "./dims/useTimeline.js";
import { useSingularity } from "./useSIngularity.js";
import { useNotificationHandler } from "../UI/useNotificationHandler.js";
import { avgLoot } from "../utils/avgLoot.js";

export const useResets = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();
    const { villian } = useBaseEnemy();
    const { player } = usePlayer();

    const { resetNodes, globalResetNodes, treePointsHandle } = useTrees();
    const { getRPonReset, getRebirthTierOnReset, calculateRebirthTier } = useRebirths();
    const { getStardustOnReset, resetSpace } = useSpaces();
    const { getMutagenOnReset } = useRadiations();
    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { cursesUnlockCheck } = useAmulets();
    const { eqForgeHandle } = useEquipments();
    const { createSingulars, enemySkills } = useSpecialStats();
    const { corrInflueceHandle } = useAbysses();
    const { corrToggle } = useDimHandler();
    const { timelineReq, refillStone } = useTimeline();
    const { deathBhStatus } = useSingularity();
    const { pushNoteById } = useNotificationHandler();
    const { avgReset } = avgLoot();

    function performD(d, prev) {
        const notAllowedIds = ['main', 'unlimitted'];
        
        performInf()

        //hero.value.stages.current = (hero.value.dId == 'dimMerge'? 1: hero.value.stages.current);
        hero.value.infProgress = notAllowedIds.includes(d.id)? false: true;

        for(let buff of buffs.value){
          if(buff.id == 6) continue;
            buff.tier = 1;
            buff.maxTier = 3;
            buff.exp = 0;
            buff.active = false;
        }

        if (prev.id == 'bh' && d.id != 'bh')
          deathBhStatus();
        if (prev.id != 'bh' && d.id == 'bh')
          createSingulars();
    }

    const performSingularity = () => {
        if(hero.value.eventDoubleClick){
          const confirmed = window.confirm(
            "Click OK to confirm to enter the Singularity."
          )
          if (!confirmed) return;
        }
      
        if(!hero.value.isSingularity && hero.value.level < 700) {
          return;
        }
          
      
        if(hero.value.isSingularity && hero.value.singularity >= 8) {
            hero.value.singularityKills = hero.value.kills;
        }


      
        performReset();
        globalResetNodes();
        player.value.hp = 10;
      
        if(hero.value.isSingularity){
          villian.value.hp = 10;
          hero.value.isSingularity = false;
          hero.value.singLeft = true;

          return;
        }
        hero.value.isSingularity = true;
      
        hero.value.killsPerZone = 100;

        if (hero.value.singularity >= 8)
          hero.value.kills = hero.value.singularityKills - 1;
        else 
          hero.value.kills = 0;
        hero.value.stages.current = 1;
      
        if(hero.value.singularity >= 2)
          resetNodes();
        
        if(hero.value.singularity >= 4)
          resetSpace();
        
        if(hero.value.singularity >= 7) {
          hero.value.rebirthPts = 0;
          hero.value.rebirthTier = 0;
        }
      }
      
    const performSoulD = () => {
        if (hero.value.souls >= hero.value.soulsCap) return;
        if (hero.value.stages.current < 15) return;
        if (hero.value.dId === 'd-next' && dimensions.value[34].infTier > 15) return;
        
        if(hero.value.selectedDivSkills.includes(11) || hero.value.selectedDivSkills.includes(6)){
          return;
        }
      
        hero.value.soulD = hero.value.soulD? false: true;
        if(hero.value.soulD){
          hero.value.soulDStage = hero.value.stages.current;
          hero.value.stages.current = 15;
          hero.value.kills = 0;
        } else {
          hero.value.stages.current = hero.value.soulDStage;
          hero.value.kills = 0;
        }
        hero.value.mutations = 0;
    }
      
    const performAbyss = () => {
        if(hero.value.eventDoubleClick){
          const confirmed = window.confirm(
            "Click OK to confirm to enter the Abyss."
          )
          if (!confirmed) return;
        }
      
        if(hero.value.dId == 'abyss-d') return;

        let stage = (hero.value.isAbyss? hero.value.stages.current: 0);

        abyssReset();
      
        if(stage >= (20 + 10 * hero.value.abyssTier)){
          hero.value.abyssTier = Math.min(hero.value.abyssTier + 1, 3);
          cursesUnlockCheck();
          
          return;
        }
    }

    const abyssReset = () => {
        hero.value.isAbyss = !hero.value.isAbyss;
        performReset();
        hero.value.souls = 0;
    }
      
      
    const performInf = () => {
        if(hero.value.eventDoubleClick){
            const confirmed = window.confirm(
              "Click OK to confirm The Infinity Trial"
            )
            if (!confirmed) return;
        }

        infExpansionsHandle();
        performReset();
        

        hero.value.infProgress = true;
        hero.value.maxStage = 1;

        minStage();
        
        globalResetNodes();
       
        hero.value.eqUps['sword'] = 0;
        hero.value.eqUps['armor'] = 0;
        hero.value.eqUps['boots'] = 0;
        hero.value.eqUps['ring'] = 0;
        hero.value.eqUps['spRing'] = 0;

        hero.value.equipmentTiers["spRing"] = 0;
        hero.value.eqTierReq["spRing"] = 0;

        eqForgeHandle();
    
        hero.value.abyssTier = (hero.value.rebirthPts >= 1.5e6? 3: 0)

        hero.value.activeCurse = [];
        hero.value.activeCurseTier = [];
        hero.value.souls = 0;
        hero.value.soulsMax = 0;
        hero.value.soulsCap = 20 + (hero.value.abyssTier >= 1? 10: 0) + (hero.value.abyssTier >= 2? 10: 0);
        hero.value.soulTier = 0;

        hero.value.totalRebirthPts = 0;
        hero.value.rebirthPts = getRPonReset()
        hero.value.rebirthTier = getRebirthTierOnReset();
        

        hero.value.ascendShardPerform = 0;
        hero.value.ascensionShards = 0;
        hero.value.totalAscensionShards = 0;
        hero.value.isAbyss = (hero.value.dId == 'abyss-d'? true: false);
    
        player.value.buff.activeBuffs = [];
        
        resetSpace();
        hero.value.stardust = 0 + getStardustOnReset();
    
        if(hero.value.singularity < 6){
          for(let buff of buffs.value){
              if(buff.id == 6) continue;
              buff.tier = 1;
              buff.maxTier = 3;
              buff.exp = 0;
              buff.active = false;
            }
        }
        
    
        for(let idx in radPerks){
          if(idx == 13) continue;
          radPerks[idx].level = 0;
        }
        
        hero.value.mutagen = getMutagenOnReset();
    
        if(hero.value.singularity < 4){
          for(let perk of ascenPerks){
            if(perk.tier != 6 && perk.tier != 7 && perk.tier != 8)
              perk.level = 0;
          }
        }

        hero.value.autoTreeCooldown = 3;
    
        hero.value.soulD = false;
        villian.value.spawnType = 'none';
        enemy.value.soulBuff.active = false;
        enemy.value.boss.isBoss = false;

        //hero.value.infProgress = (hero.value.dId == 'bh'? false: true);
        hero.value.windowUpdate = true;  
        hero.value.tree.kills = 0;

        //killHistory.length = 0;
        enemy.value.d_damagePenalty = 0;

        hero.value.damageStage = 0;
        enemy.value.darkEnergy.totalBosses = (hero.value.dId == 'd-overstage'? 0: enemy.value.darkEnergy.totalBosses);

        hero.value.dims.veil.stacks = getDimReward(30);
        hero.value.dTimer = 0;
        hero.value.travellPenalty = 1;
        hero.value.isTravell = false;
        hero.value.spaceUnlocked = (hero.value.abyssTier < 3 || hero.value.rebirthPts < 1e5? false: true);
        hero.value.cursedBonus = 0;
        hero.value.cursedBonusExp = 0;

        hero.value.dims.damage.kills = 0;
        player.value.statistic.deaths = 0;

        player.value.damageLog = [];
        villian.value.damageLog = [];

        hero.value.avgResources.ascension.perSec = 0;
        hero.value.avgResources.ascension.timer = 0;
        hero.value.avgResources.ascension.acc = 0;
        hero.value.avgResources.rebirth.perSec = 0;
        hero.value.avgResources.rebirth.timer = 0;
        hero.value.avgResources.rebirth.acc = 0;

        hero.value.notes.cooldowns = {};
    }

    const minStage = () => {
      if (hero.value.dId != 'next' && hero.value.dId != 'd-next' && hero.value.dId != 'c-next' &&
        hero.value.dId != 'overstage' && hero.value.dId != 'dimMerge') {
          hero.value.stages.current = 1 + getDimReward(39).min;
        }
        hero.value.maxStage = 1 + getDimReward(39).min;
    }

    const infExpansionsHandle = () => {
      if(hero.value.infTier >= 0) hero.value.infExpansions.tree = true;
      else false;

      if(hero.value.infTier >= 1) hero.value.infExpansions.ascensioin = true;
      else false;

      if(hero.value.infTier >= 2) hero.value.infExpansions.rebirth = true;
      else false;

      if(hero.value.infTier >= 3) hero.value.infExpansions.radiation = true;
      else false;

      if(hero.value.infTier >= 4) hero.value.infExpansions.space = true;
      else false;

      if(hero.value.infTier >= 5) hero.value.infExpansions.soul = true;
      else false;

    }
    
    const performAscension = () => {
        if(hero.value.eventDoubleClick){
            const confirmed = window.confirm(
              "Click OK to confirm The Ascension"
            )
            if (!confirmed) return;
        }

        hero.value.ascensionShards += hero.value.ascendShardPerform;
        hero.value.avgResources.ascension.acc += hero.value.ascendShardPerform;

        if(getDimSpecialReward(9) && hero.value.stages.current >= dsGain() && hero.value.dId == 'main' ){
          while (hero.value.stages.current >= dsGain())
            hero.value.ds++;
        }

        performReset();
    };

    function dsGain() {
      let total = hero.value.dimShards.stage + 10 * hero.value.ds;
      return total;
    }
    
    const performRebirth = () => {
        if(hero.value.eventDoubleClick){
            const confirmed = window.confirm(
              "Click OK to confirm The Rebirth"
            )
            if (!confirmed) return;
        }

        //auto.value.rebirth.enabled

        hero.value.rebirthPts += hero.value.totalRebirthPts;
        hero.value.avgResources.rebirth.acc += hero.value.totalRebirthPts;

        let rebirth = calculateRebirthTier(hero.value.level, hero.value.rebirthTier);

        if (corrInflueceHandle(6))
          hero.value.rebirthTier += rebirth;

        performReset();

        hero.value.souls = 0;
        //auto.value.rebirth.enabled = false;
    }
    
    const performReset = () => {
        hero.value.eLevel = 1;
        hero.value.exp = 0;

        hero.value.stages.current = 1;

        hero.value.stages.current = getDimEffect(19);

        hero.value.stages.current = getDimEffect(9);
        hero.value.stages.current = getDimEffect(34);
        
        hero.value.kills = 0;
        hero.value.killsPerZone = 5;
        hero.value.nextLevelExp = 100;
        hero.value.activeCurse = [];
        hero.value.totalAscensionShards = 0;
        hero.value.ascendShardPerform = 0;
        hero.value.shardsMult = 0;
        hero.value.shardsPerformMult = 0;
        hero.value.totalRebirthPts = 0;
      
        enemy.value.soulBuff.chance = 0;
      
        resetNodes();

        hero.value.tree.tier = 0;
        hero.value.tree.points = treePointsHandle();

        if (dimensions.value[36].infTier > 0) {
          let minEq = getDimReward(36).min;

          hero.value.eqDrop["sword"] = Math.min(
            hero.value.eqTierReq["sword"],
            Math.min(hero.value.eqDrop["sword"], minEq)
          );
          hero.value.eqDrop["armor"] = Math.min(
            hero.value.eqTierReq["armor"],
            Math.min(hero.value.eqDrop["armor"], minEq)
          );
          hero.value.eqDrop["boots"] = Math.min(
            hero.value.eqTierReq["boots"],
            Math.min(hero.value.eqDrop["boots"], minEq)
          );
          hero.value.eqDrop["ring"] = Math.min(
            hero.value.eqTierReq["ring"],
            Math.min(hero.value.eqDrop["ring"], minEq)
          ); 
        } else {
          hero.value.eqDrop['sword'] = 0;
          hero.value.eqDrop['armor'] = 0;
          hero.value.eqDrop['boots'] = 0;
          hero.value.eqDrop['ring'] = 0;
        }

        hero.value.equipmentTiers.sword = 0;
        hero.value.equipmentTiers.armor = 0;
        hero.value.equipmentTiers.boots = 0;
        hero.value.equipmentTiers.ring = 0;
      
        hero.value.afkSoulBoost = 1;
        hero.value.soulD = false;
        villian.value.status.weakStack.count = 0;
        
        hero.value.travellPenalty = 1;
        hero.value.isTravell = false;

        hero.value.mutations = 0;

        villian.value.stats.recalc();
        villian.value.hp = villian.value.stats.final.hp;

        villian.value.status.dims.damage.kills = 0;
        villian.value.status.dims.ddamage.kills = 0;

        avgReset();

        villian.value.spawnType == 'none';

        enemySkills()
    }

    const dimHandle = () => {
      let d = {};
      for(let ds of dimensions.value){
        if(ds.id == hero.value.dId){
          d = ds;
          break;
        }
      }
      let notAllowdId = ['main', 'unlimitted', 'time', 'survival-2', 'abyss-d']
  
      if(hero.value.dId == 'advanceBH') {
        timelineHandle();
        return;
      }
  
      if(hero.value.dId == 'time' && hero.value.level >= 700){
        hero.value.dTimeReward = (hero.value.dTimeReward == 0? hero.value.dTimer: hero.value.dTimeReward)
        hero.value.dTimeReward = Math.min(hero.value.dTimeReward, hero.value.dTimer)
      }
  
      let level = 700;
      level = (hero.value.dId.startsWith('c-')? hero.value.infTierLevelReq: level);
      level = (hero.value.dId.startsWith('d-')? 1400: level);
  
      if(!notAllowdId.includes(hero.value.dId) && d.infTier < d.spInfTier && hero.value.level >= level && dReq(d)){
        dInfHandle(d);
      }
    }

    const dInfHandle = (d) => {
        let pass = 1 + (hero.value.voidTreeStats.inf_double_complete? 1: 0);

        hero.value.infTier += pass;
        if (d)
          d.infTier = Math.min(d.infTier + pass, d.maxInfTier);

        if (hero.value.dId == 'c-unlimitted' || 
          hero.value.dId == 'c-soulD') return;

        performInf();

        if (hero.value.dId.startsWith('c-')) {
          hero.value.infTier = hero.value.mainInfTier;
          hero.value.dId = 'main';
          hero.value.infProgress = false;
          corrToggle();
        }

        hero.value.dims.passedDims = dimensions.value.filter(
          dim => dim.infTier >= dim.spInfTier).length
    }

    const timelineHandle = () => {
      let timeline = timelineReq();

      if (hero.value.stages.current >= timeline.stage && 
        hero.value.level >= timeline.level) {
          refillStone();
          hero.value.timelinePass[hero.value.timelineActiveTier + 1] = true;

          hero.value.dId = 'main';
          performInf();

          pushNoteById("tm-complete");

          hero.value.infTier = hero.value.mainInfTier;
          hero.value.infProgress = false;
      }
    }
  
    const dReq = (d) => {
      switch(d.idx){
        case 13: return hero.value.stages.current >= 100 + 5 * (d.infTier - 20);
        case 29: return enemy.value.darkEnergy.totalBosses >= enemy.value.darkEnergy.maxBosses;
        case 31: return enemy.value.specialCreatures['ddim' + (d.infTier + 1)]?.req;
        case 37: return hero.value.spCount + hero.value.spsCount >= 6 + (6 * d.infTier);
        case 46: return hero.value.dTimer < 60; 
        case 56: return hero.value.souls >= 100;
        case 57: return hero.value.maxStage >= 80;
        default: return true;
      }
    }
  

    return {
      performAscension,
      performRebirth,
      performAbyss,
      performInf,
      performSoulD,
      performSingularity,
      performD,
      dimHandle,
      dsGain,
      dInfHandle
    }
}