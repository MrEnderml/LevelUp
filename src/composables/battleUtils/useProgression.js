import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { useBuff } from '../../data/buffs.js'
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";
import { divineSkills } from "../../data/quasarCore.js";

import { useAscensions } from "./useAscension.js";
import { useTrees } from "./useTree.js";
import { useAbysses } from "./useAbyss.js";
import { useDimensions } from "./useDimensions.js";
import { useSouls } from "./useSouls.js";
import { useAmulets } from "./useAmulets.js";
import { useEquipments } from "./useEquipment.js";

import { useTimeline } from "./dims/useTimeline.js";

import { addLog} from '../logService.js';
import { getRandomVillainName } from "../useEnemy";
import { fn } from "../utils/global.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { useSingularity } from "./useSIngularity.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { dGravityHandler } from "./global/dGravityHandler.js";

export const useProgressions = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();
    const { player } = usePlayer();
    const { player: spPlayer} = usePlayer("space");
    const { villian } = useBaseEnemy();

    const { perksHandler } = useAscensions();
    const { nodesHandler, gainTreePoints } = useTrees();
    const { abyssHandler, abyssLevelReq, abyssDRewardsHandler } = useAbysses();
    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { soulsSpawn } = useSouls();
    const { cursedAffect } = useAmulets();
    const { collectLawEffects } = useTimeline();
    const { singShardsEffect } = useSingularity();

    const grantExp = (ctx) => {
        let exp = expCount()  *
        ctx.tree.nodesHandler(3, ['base', 'inf']) *
        ctx.eq.getEqTotal("ring") *
        ctx.ascension.perksHandler(6) *
        ctx.ascension.perksHandler(66) *

        (player.value.status.traveler.exp) *
        player.value.status.conquer.loot *
        (hero.value.mainInfTier < 9? 2: 1) *

        (spawnStatus(ctx, 'soul')? enemy.value.soulBuff.drop * hero.value.soulOverkill: 1) * 
        hero.value.soulPower.base.exp *
        killsLootHandle() *
        (getDimSpecialReward(19)? 1.5 ** player.value.overkill.loot: 1) *
        (1 + hero.value.cursedBonusExp) * 
        (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
        (hero.value.spCount >= 9? Math.min(1.025 * hero.value.sp, 5): 1) *
        (enemy.value.rebirthEnemy["drop"]) * 
        player.value.formationStats.loot * 
        ctx.ascension.perksHandler(34) * 
        (hero.value.cursesChances[3].status? 2: 1) *
        (hero.value.rebirthPts >= 3.5e5 && hero.value.eLevel > 700? Math.sqrt(Math.log(hero.value.rebirthPts + 3))/2: 1) *
        infBonusesHandler(3, hero) * 

        ctx.dimensions.getDimReward(5).exp *
        (hero.value.dId == 'unlimitted'? getDimReward(5).infExp: 1) * 
        (hero.value.dId == 'unlimitted'? getDimReward(38).expMult: 1) *
        
        (hero.value.selectedDivSkills.includes(1)? divineSkills.value[1].values[1]: 1) * 
        (hero.value.selectedDivSkills.includes(7)? divineSkills.value[7].values[1]: 1) * 
        ctx.player.value.status.critMls.loot * 
        
        ctx.dimensions.getDimEffect(59) * 
        
        hero.value.voidTreeStats.exp_1 *
        
        (hero.value.timePenalty? 0: 1);
    
        exp **= cursed[17].loot;
        exp **= ctx.abyss.corrInflueceHandle(13);
        exp **= (hero.value.stages.current > 300? singShardsEffect(6): 1);
    
        hero.value.totalExp = exp;
        let expPenalty = hero.value.infPower;
    
        exp = (hero.value.infProgress? exp ** expPenalty: exp);

        hero.value.exp += exp;
        hero.value.avgLoot.exp.acc += exp;
    
        addLog(`You killed <b style="color: red">${villian.value.name}</b> and gained <b style="color: lightgreen">${fn(exp)} EXP</b> <b style="color: gold">(+${fn((exp / hero.value.nextLevelExp) * 100, true)}%)`, "EXP");
    
        if(hero.value.rebirthPts >= 8e5){
          let sExp = (Math.random() * 100 + 15 >= 100? nextLevel(ctx, hero.value.eLevel) * 0.05: 0);
          if(sExp > 0){
            hero.value.totalExp += sExp;
            addLog(`Singularity gift: ${fn(sExp)} (+5%) exp`, "EXP");
          }
        }

        return exp;
    };

    const expCount = () => {
        return Math.log(hero.value.stages.current + 5) ** 4;
    }
    
    const checkLevelUp = (ctx) => {
        for(let i = 0; i < 10; i++) {
          levelRush(ctx);
    
          if(hero.value.maxLevel * hero.value.levelRush.c > hero.value.eLevel && hero.value.dId != 'unlimitted'){
            hero.value.eLevel += (hero.value.maxLevel * hero.value.levelRush.c > hero.value.eLevel? 1: 0);
            hero.value.tree.points += ctx.tree.gainTreePoints();
            hero.value.nextLevelExp = nextLevel(ctx, hero.value.eLevel);
          }
      
          if (hero.value.exp >= hero.value.nextLevelExp && hero.value.eLevel < hero.value.maxLevel &&
            hero.value.level < hero.value.unlimitLevelMax
          ) {
            hero.value.exp -= hero.value.nextLevelExp;
            hero.value.eLevel++;
            hero.value.tree.points += ctx.tree.gainTreePoints();
            hero.value.nextLevelExp = nextLevel(ctx, hero.value.eLevel);
          }

          unlimitHandle();
          cUnlimitHandle();
        }
    };

    const levelRush = (ctx) => {
      let power = (hero.value.soulsMax >= 40? 0.1: 0) + 
      (hero.value.rebirthPts >= 70000? 0.1: 0) + 
      0.02 * hero.value.singularity + 
      0.05 * hero.value.bhTier + 
      ctx.tree.nodesHandler(3, ['rad']) * 0.01

      hero.value.levelRush.c = Math.min(power, hero.value.levelRush.m);
    }

    const unlimitHandle = () => {
      if(hero.value.dId != 'unlimitted') return;

      hero.value.unlimitLevel = Math.max(hero.value.unlimitLevel, hero.value.eLevel + hero.value.minLevel);

      hero.value.unlimitLevelMax = getDimReward(5).maxUnlimmit
      hero.value.unlimitLevel = Math.min(hero.value.unlimitLevel, hero.value.unlimitLevelMax);

      hero.value.eLevel = Math.min(hero.value.eLevel, hero.value.unlimitLevelMax - hero.value.minLevel);
    }

    const cUnlimitHandle = () => {
      if(hero.value.dId != 'c-unlimitted') return;

      hero.value.cUnlimitMaxLevel = Math.max(hero.value.eLevel + hero.value.minLevel, hero.value.cUnlimitMaxLevel);
    }

    const stageRushCount = () => {
      let power = (hero.value.rebirthPts >= 20000? 0.15: 0) +
      (hero.value.infExpansions.ascensioin? 0.15: 0) +
      (0.02 * hero.value.singularity) +
      0.05 * hero.value.bhTier;

      hero.value.stageRush.c = Math.min(power, hero.value.stageRush.m);
    }

    const stageRush = (ctx) => {
      let count = 1 + (getDimSpecialReward(44)? 1: 0)

      for(let c = 0; c < count; c++) {
        if(isStageRush()){
          hero.value.exp += grantExp(ctx);

          stagePassed(ctx);
        }
      }
      
    }

    const isStageRush = () => {
      return hero.value.stages.current <= hero.value.maxStage * hero.value.stageRush.c && !hero.value.isLocked 
      && !hero.value.isTravell && !hero.value.soulD && hero.value.dId != 'next' && hero.value.dId != 'd-next' &&
      hero.value.dId != 'c-next' && hero.value.stageRush.active && !hero.value.isSingularity && 
      hero.value.dId != 'dimMerge'
    }

    const nextLevel = (ctx, level) => {
      let rScale = 
      (hero.value.rebirthPts >= 1?0.125:0) + 
      (hero.value.rebirthPts >= 750?0.125:0) + 
      (hero.value.rebirthPts >= 12500?0.125:0) + 
      (hero.value.rebirthPts >= 90000?0.125:0);

      let sReq = singReq();
      let lvlReq = 1.75 + 0.0025 * Math.min(level, 100)
      let base =  Math.floor(((level + 9) ** lvlReq ) ** (1 + level / 700)) * (Math.log(level+2)**((0.6-rScale) * (hero.value.eLevel >= 100? 4: 1)));

      let total = base * 
      (hero.value.isAbyss? ctx.abyss.abyssLevelReq(level): 1) *
      ctx.abyss.abyssHandler(3) * 
      infBonusesHandler(12, hero) * 
      ctx.ascension.perksHandler(36) * 
      hero.value.eqUpsMult['ring'].level *
      ctx.abyss.corrInflueceHandle(2) *


      (hero.value.isSingularity? 1e6 * (hero.value.singularity + 1): 1) *
      (hero.value.eLevel > 700? sReq: 1) * 
      ctx.void.voidEffects(3);

      total = (hero.value.dId == 'unlimitted'? total ** getDimReward(38).lvlRed: total);

      return Math.max(total, 100);
    }

    
    function singReq() {
        let base = 1000;
      
        let eLevelFactor = Math.max(hero.value.eLevel - 700, 0) ** (0.215 - (hero.value.dId === 'unlimitted' ? 0.075 : 0));
      
        let sReq = base + 20 ** eLevelFactor;
      
        if (hero.value.rebirthPts > 7e5) {
          const rebirthFactor = 1 - Math.log(hero.value.rebirthPts + 3) / 2 * 0.01;
          sReq = sReq ** rebirthFactor;
        }

        sReq /= hero.value.voidTreeStats.sing_level_req_1;
      
        return sReq;
    }


    const stageHandler = (ctx) => {
      stageRushCount()
      if(isStageRush()) {
        stageRush(ctx);
        killsCounter(ctx);
        return;
      }
      if (ctx.villian.value.spawnType == 'boss') return;

      ctx.hero.value.kills += 1 + overkillHandle();
      killsCounter(ctx);
      
      bossSpawnChance(ctx);

      if(hero.value.isSingularity) {
        ctx.sing.singKills();
        ctx.sing.singComplete();
      }

      if(ctx.hero.value.isLocked) return;

      ctx.sing.singShardsKills();

      if (ctx.hero.value.kills >= ctx.hero.value.killsPerZone && hero.value.stages.current%5 != 4) {
        stagePassed(ctx);
      }

      ctx.player.value.recoveryPenalty = 1 + 0.01 * Math.max(ctx.hero.value.stages.current - 100, 0);
    }

    const killsCounter = (ctx) => {
      ctx.tree.radKillsHandle(1 + overkillHandle());
      ctx.dimensions.d20Effect();
      ctx.dimensions.d28Effect();

      hero.value.dims.damage.kills += (dimensions.value[28].infTier > 0? 
        1 + overkillHandle(): 0);

      ctx.hero.value.avgLoot.kills.acc += 1 + overkillHandle();
    }

    const stagePassed = (ctx) => {
      if(stageCheking(ctx)) return;

      ctx.hero.value.kills = 0;
      ctx.hero.value.stages.current++;
      ctx.hero.value.tree.points += getDimEffect(47);

      ctx.hero.value.maxStage = Math.max(ctx.hero.value.maxStage, ctx.hero.value.stages.current);

      if (ctx.hero.value.dId == 'dimMerge')
        ctx.hero.value.void.stage = Math.max(ctx.hero.value.void.stage, 
          ctx.hero.value.stages.current);

      if(ctx.hero.value.isAbyss && ctx.hero.value.spCount >= 15)
        abyssDRewardsHandler();

      if (ctx.hero.value.stages.current > 10)
        ctx.ascension.ascensionShardsProgress(ctx);
  
      refreshKillsPerZone(ctx);
    }

    const bossKillHandle = (ctx) => {
      if((ctx.villian.value.spawnType == 'boss' || ctx.villian.value.spawnType == 'deBoss')
        && ctx.villian.value.dead) {
        stagePassed(ctx);
        ctx.enemy.value.boss.chance = 0;
        ctx.enemy.value.boss.overchance = 0;

        if(ctx.hero.value.infExpansions.ascension && ctx.hero.value.stages.current > 10)
          ctx.ascension.ascensionShardsProgress(ctx);
      }
    }
    
    
    const stageCheking = (ctx) => {
        let changed = false;
        const hero = ctx.hero.value;

        if(hero.dId == 'next') { 
          hero.stages.current = Math.min(hero.stages.current, 30);
          changed = (hero.stages.current >= 30? true: false);
        }
        
        if(hero.dId == 'd-next') {
          hero.stages.current = Math.min(hero.stages.current, Math.max(30 - dimensions.value[34].infTier, hero.stages.min));
          changed = (hero.stages.current >= 30 - dimensions.value[34].infTier? true: false);
        }
        
        if(hero.darkId.includes('d-next')) {
          hero.stages.current = Math.min(hero.stages.current, 30 + 5 * dimensions.value[34].infTier);
          changed = (hero.stages.current >= 30 + 5 * dimensions.value[34].infTier? true: false);
        }

        if(hero.dId == 'c-next') {
          hero.stages.current = 1;
          changed = true;
        }

        if(hero.dId == 'overstage') {
          hero.stages.current = Math.max(ctx.dimensions.getDimEffect(19), hero.stages.current);
          hero.maxStage = Math.max(ctx.dimensions.getDimEffect(19), hero.stages.current);
          changed = false;
        }
        
        if(hero.soulD && hero.dId != 'soulD') {
          hero.stages.current = 15;
          changed = true;
        }
        
        if(hero.stages.current >= 100 && hero.isAbyss && hero.dId != 'abyss-d') {
          hero.stages.current = 100;
          changed = true;
        }
        
        hero.stages.max = 300 + ctx.sing.singShardsEffect(3);
        if(hero.stages.current >= hero.stages.max) {
          hero.stages.current = hero.stages.max;
          changed = true;
        }

        if(hero.gravity.isTrial) {
          hero.stages.current = 300;
          changed = true;
        }
        
        if(ctx.hero.value.abyssTier >= 3 && ctx.hero.value.isAbyss) ctx.hero.value.abyssDStages = Math.max(ctx.hero.value.stages.current, ctx.hero.value.abyssDStages);

        return changed;
    }

    const voidKillsRed = () => {
      if (!hero.value.voidTreeStats.sing_kills_req || !hero.value.gravity.isTrial) return 0;

      return Math.log(3 + hero.value.kills) * 0.005;
    }

    const killsLootHandle = () => {
      let k = overkillHandle();
      let overloot = 0;

      if (overkillSkill(3)){
        overloot = 1 + (hero.value.rebirthPts >= 8e5? 1: 0) + 
        perksHandler(57) + 1 * buffs.value[7].extraTier;

        player.value.overkill.loot = overloot;

        let count = k * overloot * 0.01;

        return Math.max(count, 1);
      }

      player.value.overkill.loot = 0;
      return 1;
    }

    const overkillHandle = () => {
        if(hero.value.isSingularity) return 0;
        var totalKills = 0;
    
        totalKills += 
        perksHandler(21) + 
        infBonusesHandler(6, hero) +
        getDimReward(19) + 
        hero.value.eqUpsMult['boots'].overkill +
        player.value.status.critMls.overkill + 
        player.value.status.gravity.overkills + 
        (hero.value.gravity.isTrial? hero.value.voidTreeStats.sing_overkill: 0);
    
        totalKills += overkillSkill(0);
        totalKills += overkillSkill(1);
        totalKills += overkillSkill(2);
        
        totalKills *= singShardsEffect(5);
        totalKills = Math.floor(totalKills);
    
        hero.value.overkill = totalKills;
        player.value.overkill.count = hero.value.overkill;
    
        return totalKills;
    }

    const overkillSkill = (index) => {
      switch(index){
        case 0: {
          if (player.value.buff.activeBuffs.includes(7) && buffs.value[7].tier >= 1 || 
          player.value.buff.activeBuffs.includes(15) && buffs.value[15].tier >= 5){
            return Math.floor(hero.value.maxStage / 10);
          }
          break;
        }
        case 1: {
          if (player.value.buff.activeBuffs.includes(7) && buffs.value[7].tier >= 2 ||
          player.value.buff.activeBuffs.includes(15) && buffs.value[15].tier >= 5){
            return Math.floor(hero.value.maxLevel/100);
          }
          break;
        }
        case 2: {
          if (player.value.buff.activeBuffs.includes(7) && buffs.value[7].tier >= 3 || 
          player.value.buff.activeBuffs.includes(15) && buffs.value[15].tier >= 5){
            return Math.floor(hero.value.level/50);
          }
          break;
        }
        case 3: {
          if (player.value.buff.activeBuffs.includes(7) && buffs.value[7].tier >= 4 || 
          player.value.buff.activeBuffs.includes(15) && buffs.value[15].tier >= 5) return true;
        }
      }

      return 0;
    }

    const calculateStageReq = (ctx) => {
      let base = 1.15 + (hero.value.stages.current >= 25? 0.05 : 0);
      let cap = 1.01;
      let passed = 0.001 * hero.value.stages.current +
      0.001 * Math.max(hero.value.stages.current - 100, 0) + 
      0.001 * Math.max(hero.value.stages.current - 200, 0) + 
      0.05 * Math.max(hero.value.stages.current - 300, 0);
      hero.value.baseStage = base + passed;
      
      let total = base + 
      ctx.abyss.corrInflueceHandle(1) +
      (bossReq(ctx)? Math.max(0.04 - 0.01 * Math.floor(hero.value.stages.current / 25), 0.01): 0) +
      ctx.sing.singStageReq(2) +
      ctx.void.voidEffects(0) +
      (hero.value.isAbyss? 0.025 * (hero.value.abyssTier + 1): 0) +
      passed - 
      ctx.tree.nodesHandler(10, ['base', 'inf']) -
      ctx.ascension.perksHandler(15) - 
      perksHandler(35) -
      abyssHandler(1) - 
      (ctx.hero.value.soulTier >= 2? 0.01 * Math.min(ctx.hero.value.soulTier, 4): 0) -
      (hero.value.rebirthPts >= 125? 0.01: 0) - (hero.value.rebirthPts >= 22500? 0.01: 0) - 
      (hero.value.spCount >= 16? 0.01: 0) -
      ctx.dimensions.getDimReward(3) -
      ctx.dimensions.getDimReward(59) -
      hero.value.eqUpsMult['boots'].stage - 
      infBonusesHandler(13, hero) - 
      collectLawEffects(5).add - 
      ctx.dimensions.getDimEffect(44) -
      ctx.sing.singShardsEffect(2) -
      hero.value.voidTreeStats.kill_req_1 -
      voidKillsRed() -
      (hero.value.gravity.isTrial? dGravityHandler(0, hero).v: 0) - 
      (hero.value.selectedDivSkills.includes(16) ? divineSkills.value[16].values[0] : 0);

      total += (hero.value.dId == 'overkill'? 0.1: 0);
      total += (hero.value.dId == 'c-overkill'? 1: 0);

      total = Math.max(total, cap);

      return total;
    }
    
    const refreshKillsPerZone = (ctx) => {
        if(hero.value.isSingularity) return;

        ctx.hero.value.stageReq = calculateStageReq(ctx);
        let steps = (ctx.hero.value.stages.current);
        
        let start = Math.pow(ctx.hero.value.stageReq, steps);
        
        ctx.hero.value.killsPerZone = Math.max(Math.floor(start), 5);
    }

    const infoHandle = () => {
        if(hero.value.stages.current>= 2)
          hero.value.infoActive.equipment = true;
        if(hero.value.stages.current>= 5)
          hero.value.infoActive.buffs = true;
        if(hero.value.stages.current>= 10)
          hero.value.infoActive.ascension = true;
        if(hero.value.stages.current>= 15)
          hero.value.infoActive.souls = true;
        if(hero.value.stages.current>= 20)
          hero.value.infoActive.amulet = true;
        if(hero.value.level >= 100)
          hero.value.infoActive.rebirth = true;
        if(hero.value.souls >= 20)
          hero.value.infoActive.abyss = true;
        if(hero.value.rebirthPts >= 100000 && hero.value.abyssTier >= 3){
          hero.value.infoActive.space = true;
          hero.value.infoActive.corruption = true;
        }
        if(hero.value.spCount >= 5)
          hero.value.infoActive.radiation = true;
        if(hero.value.level >= 700)
          hero.value.infoActive.infinity = true;
        if(hero.value.mainInfTier >= 7) {
          hero.value.infoActive.singularity = true;
        }
        if(hero.value.mainInfTier >= 10)
          hero.value.infoActive.dimension = true;
    
        if(hero.value.stages.current>= 40)
          hero.value.ascensionAutoUnlock = true;
    }


    const eventsProgressHandle = () => {
        infoHandle();

    }

    const heroRecovery =  (ctx, dt) => {
      let d = ctx.player.value.recoveryPenalty;
      let maxHp = ctx.player.value.stats.final.hp;
      let player = ctx.player.value;

      let mult = 0.175 * d * nodesHandler(11, ['base', 'inf']);

      player.hp += maxHp * mult * dt; 

      if(player.hp >= maxHp) {
          player.hp = maxHp;

          ctx.hero.value.resetKilledTime = -1;
          ctx.player.value.dead = false;
      }
    }

  const createMagniture = (ctx) => {

    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    let minMagnitude = 0.7;
    let maxMagnitude = 1.5;
  
    if (ctx.ascension.perksHandler(22)) {
      maxMagnitude = getRandomFloat(minMagnitude, maxMagnitude);
    }
  
    ctx.villian.dx = getRandomFloat(minMagnitude, maxMagnitude);
  }

  const createEnemy = (ctx) => {
    ctx.villian.value.spawnType = 'none';

    createDCorrpution(ctx);
    if (ctx.villian.value.spawnType == 'd-corruption') return;

    bossSpawn(ctx);
    soulsSpawn();
    singularsSpawn(ctx);
    ctx.rad.createSpecialCreature();

    ctx.spStats.enemySkills();
    cursedAffect();
    createMagniture(ctx);
    ctx.villian.value.stats.recalc();
    //ctx.villian.value.stats.auto = false;

    hpHandle(ctx);

    ctx.villian.value.name = (ctx.villian.value.spawnType == 'none'?  getRandomVillainName(): ctx.villian.value.name);
  }

  const hpHandle = (ctx) => {
    ctx.villian.value.stats.recalc();

    ctx.villian.value.hp = ctx.villian.value.stats.final.hp
    ctx.villian.value.hp *= (ctx.player.value.status.irradiation.loseHp? 0.75: 1);
    ctx.villian.value.attack.final = ctx.villian.value.stats.final.atk;

    if (hero.value.souls >= 30 && ctx.villian.value.spawnType != 'none' && !ctx.player.value.dead)
      ctx.player.value.hp = ctx.player.value.stats.final.hp;
  }

  const createDCorrpution = (ctx) => {
    if (hero.value.stages.current >= 50 && hero.value.dId == 'c-corruption'){
      ctx.villian.value.spawnType = 'd-corruption';
      ctx.villian.value.name = '[D-CORRUPTION]';

      hpHandle(ctx);
    }
  }

  const singularsSpawn = (ctx) => {
    if (!ctx.hero.value.gravity.isTrial) return;

    ctx.villian.value.spawnType = 'singulars';
    ctx.villian.value.name = 'Singulars';

  }

  const bossSpawn = (ctx) => {
    if(!spawnStatus(ctx, 'boss') && ctx.enemy.value.boss.chance < 100) return;

    if (hero.value.dId == 'd-overstage' && hero.value.stages.current > 100 && 
      enemy.value.darkEnergy.totalBosses < enemy.value.darkEnergy.maxBosses
    ) {
      ctx.villian.value.deBoss.status = true;
      ctx.villian.value.spawnType = 'deBoss';
      ctx.villian.value.name = 'Obscurant';
      ctx.spStats.darkEnergyBossHandle();
    } else {
      ctx.villian.value.spawnType = 'boss';
      ctx.villian.value.name = "Boss";
    }

    ctx.enemy.value.boss.overchance = 100;
  }

  const bossReq = (ctx) => {
    return (ctx.hero.value.stages.current%5 == 4);
  }

  const bossReqPanel = () => {
    return (hero.value.stages.current%5 == 4);
  }

  const bossSpawnChance = (ctx) => {
    if(!bossReq(ctx)) return;

    let base = 0;
    let maxRed = 1.05 ** Math.floor(hero.value.stages.current / 25);
    let max = 2 * enemy.value.specialCreatures.boss.chance * 
    (hero.value.rebirthTier >= 10? hero.value.rebirthBonusesHandle[1].value: 1) / 
    maxRed;

    let kills = ctx.hero.value.kills;
    let maxKills = ctx.hero.value.killsPerZone;

    base = Math.random() * 100 + (kills / maxKills) * max;

    ctx.enemy.value.boss.overchance = 
    (kills < maxKills? (kills / maxKills) * max: 100);

    if(kills >= maxKills)
      ctx.enemy.value.boss.chance = 100;
    else ctx.enemy.value.boss.chance = base;
  }

  const resetStageOnBoss = (ctx) => {
    ctx.villian.value.spawnType == 'none';

    ctx.enemy.value.boss.overchance = 0;
    ctx.enemy.value.boss.chance = 0;

    ctx.hero.value.kills = 0;
    refreshKillsPerZone(ctx);
  }

  const spawnStatus = (ctx, type) => {
    return ctx.villian.value.spawnType === type;
  }

  const bossStats = (ctx, type) => {
    if(!spawnStatus(ctx, 'boss')) return 1;

    ctx.enemy.value.boss.drop = Math.sqrt((ctx.hero.value.stages.current/ 5) * Math.log(ctx.hero.value.stages.current));

    let stage = Math.min(ctx.hero.value.stages.current, 300);

    switch(type) {
      case "dmg":
        let atk = Math.max(Math.sqrt((stage / 10 )) ** 
        (1.04 * 0.02 * Math.floor(stage / 10)), 1.25) * 
        ctx.dimensions.getDimEffect(7).dmg * 
        ctx.dimensions.getDimEffect(52).dmg;
        enemy.value.enemyStats.main.bossDmg = atk;

        return atk;
      case "hp": 
        let hp = Math.max(Math.sqrt((stage / 5) + Math.log(stage) **
        (0.55 + 0.075 * Math.floor(stage / 5))), 2) * 
        ctx.dimensions.getDimEffect(7).hp * 
        ctx.dimensions.getDimEffect(52).hp;
        enemy.value.enemyStats.main.bossHp = hp;
        
        return hp;
    }
   
  }

  const formationHandler = () => {
    formationStats(player);
    formationStats(spPlayer);
  }

  const formationStats = (player) => {
    let id = player.value.activeFormation;
    let f = player.value.formationStats;
    
    switch(id) {
      case 0: {
        f.atk = 0.5;
        f.hp = 2;
        f.def = 0.5;
        f.loot = 1;
        break;
      }
      case 1: {
        f.atk = 2 * (perksHandler(62)? 2: 1);
        f.hp = 0.5 * (perksHandler(62)? 0.5: 1);
        f.def = 0.5 * (perksHandler(62)? 0.5: 1);
        f.loot = 1;
        break;
      }
      case 2: {
        f.atk = 0.5;
        f.hp = 0.5;
        f.def = 2;
        f.loot = 1;
        break;
      }
      case 3: {
        f.atk = 0.5 + (perksHandler(59)? 0.5: 0);
        f.hp = 0.5 + (perksHandler(59)? 0.5: 0);
        f.def = 0.5 + (perksHandler(59)? 0.5: 0);
        f.loot = 2;
        break;
      }

      default: {
        f.atk = 1
        f.hp = 1
        f.def = 1
        f.loot = 1;
      }
    }
  }

  const autoSingShards = (ctx, kills) => {
    const h = hero.value;
    if (!h.gravity.isTrial) return;
  
    let k = kills;
  
    while (k > 0) {
      let req = h.killsPerZone;
  
      if (k >= req) {
          k -= req;
    
          ctx.sing.singShardsKills();
          refreshKillsPerZone(ctx);
    
          h.kills = 0;
        } else {
          h.kills = k;
          break;
        }
      }
  };

  const afkBattle = (ctx, kills) => {
    let remainingKills = Math.floor(kills);
    const h = hero.value;

    if (remainingKills <= 0)
      return;

    if (h.isSingularity) {
      h.afkModeKills = 0;
      return;
    }

    if (h.isLocked || h.soulD) {
      h.kills += remainingKills;
      h.afkModeKills = 0;
      return;
    }
  
    
    player.value.stats.recalc();
    const ps = player.value.stats.final;
  
    const playerPower =
      ps.atk *
      Math.max(ps.aps, 0.1) *
      Math.max(ps.hp, 1);
  
    let loops = 0;
  
    while (remainingKills > 0) {
      if (loops > 5000)
        break;
  
      loops++;
  
      villian.value.stats.recalc();
      const vs = villian.value.stats.final;
  
      const enemyPower =
        vs.atk *
        Math.max(vs.aps, 0.1) *
        Math.max(vs.hp, 1);
  
      const bossPower =
        afkBossPower(h.stages.current);

      const abyssPower = (h.isAbyss? 1.02 ** h.stages.current: 1);
      const tmPower = (h.dId == 'advanceBH'? 2 ** hero.value.timelineActiveTier: 1);
      


      const totalEnemyPower =
        enemyPower * bossPower * abyssPower * tmPower;
  
      const ratio =
        playerPower / Math.max(totalEnemyPower, 1);
  
      if (ratio < 1)
        break;
  
      refreshKillsPerZone(ctx);
      const req = h.killsPerZone;
  
      if (remainingKills >= req) {
        remainingKills -= req;

        if(stageCheking(ctx)) break;

        h.stages.current++;
        h.maxStage = Math.max(h.stages.current, h.maxStage);
        if (ctx.hero.value.dId == 'dimMerge')
          ctx.hero.value.void.stage = Math.max(ctx.hero.value.void.stage, ctx.hero.value.stages.current);
        ctx.ascension.ascensionShardsProgress(ctx);
        h.kills = 0;
      } else {
        h.kills =
          Math.min(
            h.kills + remainingKills,
            req - 1
          );
        remainingKills = 0;
      }
    }

    h.afkModeKills = 0;
  };

  const afkBossPower = (stage) => {
    if (stage%5 != 4) return 1;

    let atk = Math.max(Math.sqrt((stage / 10 )) ** (1.04 * 0.02 * Math.floor(stage /10)), 1.25);
    let hp = Math.max(Math.sqrt((stage / 5) + Math.log(stage) ** (0.55 + 0.08 * Math.floor(stage / 5))), 2);

    return atk * hp;
  }


    return {
        grantExp,
        spawnStatus,
        eventsProgressHandle,
        checkLevelUp,
        refreshKillsPerZone,
        stageCheking,
        overkillHandle,
        heroRecovery,
        bossStats,
        createEnemy,
        stageHandler,
        bossReqPanel,
        bossKillHandle,
        resetStageOnBoss,
        killsLootHandle,
        formationHandler,
        afkBattle,
        voidKillsRed,
        overkillSkill
    }
}