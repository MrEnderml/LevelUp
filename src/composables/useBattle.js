import { ref, computed, onMounted, onUnmounted} from 'vue';
import { perks } from '../data/perks.js';
import { perks as ascenPerks } from '../data/ascension.js';
import { equipment } from '../data/equipment.js';
import { addLog} from './logService.js';
import { getRandomVillainName } from '../composables/useEnemy.js';
import { soulNames } from '../data/souls.js';
import { cursed } from '../data/cursed.js';
import { amulets } from '../data/amulets.js';
import { perks as radPerks} from '../data/radPerks.js';
import { spacePower as spPerks } from '../data/spacePower.js';
import { spEnemy } from '../data/spaceEnemy.js';
import { goals as infGoals } from '../data/infGoals.js';
import { dimensions } from '../data/dimensions.js';
import { autoProgress, auto } from './autoProgression.js';
import { recordKill, avgLootPerMinute, killHistory } from './afkHandle.js';

export function useBattle(hero, enemy, buffs) {
  const heroAttackBarProgress = ref(0);
  const enemyAttackBarProgress = ref(0);
  let ShardsInterval = 0;

  addLog("Hey. Have a nice day!!!", "All");

  const grantExp = () => {
    var exp = expCount() * (1 + (perks.value[3].value * perks.value[3].level * 0.01)) *
    (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult + hero.value.eqUpsMult['ring'].bonus) *
    (1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level) *
    (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 3: 1) *
    (enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1) * 
    (1 + Math.min(hero.value.souls, 40 + (Math.max(hero.value.infTier, hero.value.mainInfTier) >= 6? 40: 0)) * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))) *
    (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? overkillHandle() * (0.1 + (dimensions.value[19].infTier == dimensions.value.maxInfTier? 0.05: 0)): 1) *
    (1 + hero.value.cursedBonusExp) * (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
    (hero.value.rebirthPts >= 5? 2: 1) * (hero.value.spCount >= 9? Math.min(1.025 * hero.value.sp, 5): 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) *
    (enemy.value.rebirthEnemy["drop"]) * 
    (hero.value.activeFormation == 3? 2: 1) * 
    (1 + ascenPerks[34].level * 0.01) * 
    (hero.value.curset5? 2: 1) *
    Math.max(1 + (hero.value.unlimitLevel - 700) / 100, 1) *
    (hero.value.rebirthPts >= 3.5e5 && hero.value.eLevel > 700? Math.sqrt(Math.log(hero.value.rebirthPts + 3))/2: 1) *
    (hero.value.mainInfTier >= 1 || hero.value.level >= 700? (infBase(1.06) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1)+Math.log(hero.value.infPoints + 2)))) * 
    (hero.value.dId == 'unlimitted'? 1.75 ** Math.max(Math.floor(Math.max(hero.value.unlimitLevel - 1000, 0) / 500), 0): 1): 1);

    hero.value.totalExp = exp;
    let expPenalty = Math.min(1 - 0.02 * hero.value.infTier + hero.value.infPenalty, 1);
    exp = (!hero.value.infProgress? exp ** expPenalty: exp);
    enemy.value.averageLoot.exp = exp;

    addLog(`You killed ${enemy.value.name} and gained ${formatNumber(exp)} (+${formatNumber((exp / hero.value.nextLevelExp) * 100, true)}%) exp`, "EXP");
    if(hero.value.stage <= hero.value.maxStage * hero.value.lacrimose && hero.value.isStage)
      hero.value.exp += exp * 25;
    else 
      hero.value.exp += exp;

    if(hero.value.rebirthPts >= 8e5){
      let sExp = (Math.random()*100 + 15 >= 100? nextLevel(hero.value.eLevel) * 0.05: 0);
      if(sExp > 0){
        hero.value.totalExp = sExp;
        addLog(`Singularity gift: ${formatNumber(sExp)} (+5%) exp`, "EXP");
      }
    }
    
    
    checkLevelUp();


  };

  const checkLevelUp = () => {
    let power = (hero.value.soulsMax >= 40? 0.1: 0) + (perks.value[3].status? 0.1: 0) + (hero.value.rebirthPts >= 70000? 0.1: 0) + (0.02 * hero.value.singularity);
    if(hero.value.maxLevel * power > hero.value.eLevel && hero.value.dId != 'unlimitted'){
      hero.value.eLevel += (hero.value.maxLevel * power > hero.value.eLevel? 1: 0);
      hero.value.perkPoints += (hero.value.infTier >= 1? 2: 1);
    }

    if (hero.value.exp >= hero.value.nextLevelExp && hero.value.eLevel < hero.value.maxLevel) {
      hero.value.exp -= hero.value.nextLevelExp;
      hero.value.eLevel++;
      hero.value.perkPoints += (hero.value.infTier >= 1? 2: 1);
      hero.value.nextLevelExp = nextLevel(hero.value.eLevel);
    }
    
    rebirthPtsHandle();
  };

  const nextLevel = (level) => {
    let rScale = (hero.value.rebirthPts >= 1?0.145:0) + (hero.value.rebirthPts >= 750?0.145:0) +(hero.value.rebirthPts >= 12500?0.145:0) +(hero.value.rebirthPts >= 90000?0.145:0);
    let sReq = (1000 + 10 * Math.max(hero.value.eLevel - 700, 0)) ** (hero.value.rebirthPts > 7e5? 1 - Math.log(hero.value.rebirthPts + 3)/2 * 0.01 : 1);
    let scale = Math.floor(((level+9)**2)**(1 + level/700)) * (Math.log(level+2)**((0.6-rScale) * (hero.value.eLevel >= 100? 4: 1))) * 
    (hero.value.isAbyss? 1.0155 ** level: 1) * (hero.value.spCount >= 15 && hero.value.abyssDStages >= 30? Math.max(2 - (1.015 ** (hero.value.abyssDStages - 29)), 0.1): 1) * 
    (hero.value.mainInfTier >= 7? (1 / infBase(1.03) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1) * 
    (ascenPerks[36].level? Math.max(1.2 / Math.log(Math.sqrt(hero.value.rebirthPts) + 2), 0.1): 1) * (hero.value.isSingularity? 1e6 * (hero.value.singularity + 1): 1) * 
    (hero.value.eLevel > 700? Math.max(sReq, 1000): 1) * hero.value.eqUpsMult['ring'].level;
    return Math.max(scale, 100);
  }

  let intervalId = null;

  const startBattleLoop = () => {
    const interval = 50;
    intervalId = setInterval(() => {
      afkKillsHandle();
      travellCooldown(interval);
      ascensionAutoBuyer();
      ShardsInterval += interval;
      afkTimer(interval);
      if(hero.value.perform){
        performAscension();
        performRebirth();

        hero.value.perform = false;
        enemy.value.soulBuff.active = false;
        enemy.value.boss.isBoss = false;

        if(hero.value.isSingularity){
          createEnemy();
        } else {
          refreshKillsPerZone();
          createEnemy(); 
        }
      }
      autoProgress();
      eqStatsHandle();
      checkLevelUp();
      ascensionEffect();
      berserkBuff();
      buffActivation();
      soulHandle();
      rebirthHandle();
      rebirthPtsHandle();
      rebirthEnemyHandle();
      amuletsHandle();
      mutationHandle();
      spaceHandle();
      infPtsHandle();

      statCalculate();
      treeAuto();
      infoHandle();
      singularityHandle();
      dHandle();
      //test();

      hero.value.dTimer += (interval / 1000);

      if(enemy.value.isSpaceFight == 1){
        enemy.value.isSpaceFight = 2;
        enemy.value.soulBuff.active = false;
        enemy.value.boss.isBoss = false;

        let temp = hero.value.activeBuffs;
        hero.value.activeBuffs = hero.value.spActiveBuffs;
        hero.value.spActiveBuffs = temp;

        buffs.value[8].time = 0;
        buffs.value[1].stun = 0;
        buffs.value[3].combo = 0;

        cursed[5].time = 0;
        enemy.value.weakStack = 0;

        hero.value.hp = hero.value.maxHp;
        stationReset();
        createSpaceCreature();
      }

      if(hero.value.isSpaceAuto)
        spaceAuto();


      conquerBuff(interval + 5);
     
      if(hero.value.resetKilledTime > 0){
        heroAttackBarProgress.value = 0;
        hero.value.resetKilledTime -= interval / 1000;
      }
      else if(cursed[5].time > 0 && (hero.value.activeBuffs.includes(0) && !buffs.value[0].tier == 4))
        cursed[5].time -= interval / 1000;
      else
        heroAttackBarProgress.value += hero.value.attacksPerSecond * interval / 1000;

      if (heroAttackBarProgress.value >= 1) {
        buffs.value[5].stuck--;
        buffs.value[1].stun += (dStun()? 0.5: 0);

        if(hero.value.activeBuffs.includes(5) && buffs.value[5].stuck < 0)
          fastSlashBuff();  
        
        chargeGet();

        selfDestructionCurse();
        firstStrikeBuff();
        comboStuckBuff();
        sniperBuff();
        
        let totalDmg = (hero.value.attack * acrobaticCurse()) - enemy.value.def;
        enemy.value.hp = Math.max(0, enemy.value.hp - Math.max(Math.max(totalDmg, 0), 0));
        heroAttackBarProgress.value = heroAttackBarProgress.value - 1;
        buffs.value[1].usedSkill = false;

        if(totalDmg > 0 && hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 4){
          let heal = ((hero.value.maxHp * 0.02 + hero.value.stage)) * (1 + hero.value.eqUpsMult['armor'].heal * 0.01)
          hero.value.hp = Math.min(hero.value.hp + heal, hero.value.maxHp);
        }


        if (enemy.value.hp === 0) {
          if(enemy.value.isSpaceFight == 2){
              enemy.value.isSpaceFight = 0;
              hero.value.activeCurse = [];
              hero.value.spCount++;

              let temp = hero.value.activeBuffs;
              hero.value.activeBuffs = hero.value.spActiveBuffs;
              hero.value.spActiveBuffs = temp;
          }

          //soul
          if(enemy.value.soulBuff.active){
            hero.value.souls = Math.min(hero.value.souls + 1 + hero.value.soulOverkill, hero.value.soulsCap);
            hero.value.afkSoulBoost = 1;
            if(hero.value.souls > hero.value.soulsMax && hero.value.souls < 40){
              ascensionShardsProgress(hero.value.stage);
            }
            hero.value.soulsMax = Math.max(hero.value.souls, hero.value.soulsMax);
          }
          
          if (enemy.value.ascensionSoul.active){
            ascensionShardsProgress(hero.value.stage);
            enemy.value.ascensionSoul.active = false;
          }

          rewardInfSouls();
          curseBonus();
          expBuffGrant();
          grantExp();
          starDustDrop();
          mutagenGain();
          timeCombatHandle();

          enemy.value.soulBuff.active = false;
          weaponDrop();

          if(hero.value.dId == 'damage') hero.value.dKills++;
          else hero.value.dKills = 0;
         

          if(enemy.value.boss.isBoss){
            if(hero.value.infTier >= 2)
              ascensionShardsProgress(hero.value.stage);
            enemy.value.boss.isBoss = false;
            hero.value.kills = 0;
            hero.value.zone = 1;
            hero.value.stage++;
            hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
            ascensionShardsProgress(hero.value.stage);
          }
          if((enemy.value.danger > 0 || hero.value.singularity >= 5) && hero.value.spCount%6 == 5){
            let ch = (Math.random() * 100 + enemy.value.spaceBossChance >= 100? true: false);
            if(ch)
              spEnemy[hero.value.spCount].status = ch;
          }
          
          handleEnemyDefeat();
          createEnemy();

          stationReset(); 
          recordKill(enemy);

          enemy.value.weakStack *= (dimensions.value[2].infTier >= dimensions.value[2].maxInfTier? 0.9: 0);
        }
      }

      // Враг
      if(hero.value.resetKilledTime > 0)
        enemyAttackBarProgress.value = 0;
      if(buffs.value[1].stun > 0)
        buffs.value[1].stun -= 1 * interval / 1000;
      else
        enemyAttackBarProgress.value += enemy.value.attacksPerSecond * interval / 1000;

      if (enemyAttackBarProgress.value >= 1 && enemy.value.hp > 0) {
        let totalDMG = enemy.value.attack;
        stunCurse();
        BleedingCurse();
        chargeLost();
        //invisible buff
        totalDMG = invisibleBuff(totalDMG);
        //Soild Body Radiation
        if(perks.value[2].status) buffs.value[1].stun = (Math.random() * 100 + 30 >= 100? 0.5: 0);

        totalDMG *= AccurateBlowCurse();
        totalDMG *= flexibleBuff();
        if(buffs.value[10].buffT3 > 0) {
          totalDMG = 0;
          hero.value.hp = buffs.value[10].buffT3HP;
        }
        if(totalDMG > 0) comboResetBuff();
        hero.value.hp = Math.max(0, hero.value.hp - Math.max(totalDMG - hero.value.def * penetrateCurse(), 0));
        enemyAttackBarProgress.value--;
        
      }


      if(hero.value.hp <= 0){
        extraLifeBuff();
        if(hero.value.hp <= 0){
          if(hero.value.dId == 'survival-2'){
            hero.value.survivalStage = Math.max(hero.value.survivalStage, hero.value.maxStage);
            performInf();
            perform();
          }

          hero.value.resetKilledTime = 15;
          cursed[10].time = 0;
          buffs.value[1].used = false;
          enemy.value.weakStack = Math.min(enemy.value.weakStack + 1 * dimensions.value[2].infTier, 90);
          if(enemy.value.isSpaceFight == 2){
            enemy.value.isSpaceFight = 0;
            stationReset();

            let temp = hero.value.activeBuffs;
            hero.value.activeBuffs = hero.value.spActiveBuffs;
            hero.value.spActiveBuffs = temp;

            enemy.value.weakStack = 0;
          }

          
          if(enemy.value.soulBuff.active){
            enemy.value.soulBuff.active = false;
            hero.value.afkSoulBoost = 1;
          }

          if(enemy.value.boss.isBoss){
            enemy.value.boss.isBoss = false;
            hero.value.kills = 0;
          }
          createEnemy();

          if(hero.value.activeBuffs.includes(3) && buffs.value[3].tier == 4){
            buffs.value[3].combo = buffs.value[3].combo * 0;
          }
        }
      }

      if(enemy.value.isSpaceFight == 4){
        enemy.value.isSpaceFight = 0;

        let temp = hero.value.activeBuffs;
        hero.value.activeBuffs = hero.value.spActiveBuffs;
        hero.value.spActiveBuffs = temp;
        createEnemy();
      }


      if(hero.value.resetKilledTime > 0){
        if(hero.value.hp < 0) hero.value.hp = 0;
        let mult = Math.min(0.0125 + 0.01 * perks.value[11].level, 0.08);
        hero.value.hp += mult * hero.value.maxHp; 
        hero.value.hp = Math.min(hero.value.hp, hero.value.maxHp);
        if(hero.value.hp == hero.value.maxHp)
          hero.value.resetKilledTime = -1;

        //enemy.value.hp += 0.01 * enemy.value.maxHp;
        //enemy.value.hp = Math.min(enemy.value.hp, enemy.value.maxHp)
      }

      DirtyBloodCurse();
      //heal
      healBuff(interval);
      //enemy heal
      activeBloodCurse(interval);
      //berserk
      if(hero.value.activeBuffs.includes(12) && buffs.value[12].tier >= 3){
        if(hero.value.hp < hero.value.maxHp * 0.3){
          let curse = hero.value.activeCurse.includes(11);
          hero.value.hp += ((1 - (hero.value.hp/hero.value.maxHp)/10) * hero.value.maxHp * 0.05) * (curse? cursed[11].mult: 1) * 
          (1 + hero.value.eqUpsMult['armor'].heal * 0.01);
        }
      }
      //bleeding
      if(hero.value.activeCurse.includes(10)){
        if(cursed[10].time > 0 && hero.value.hp > 0){
          hero.value.hp -= (cursed[10].bleed / 20);
          cursed[10].time -= interval/1000;
        }
      }
      //extralife immune dmg
      if(buffs.value[10].buffT3 > 0) {
        hero.value.hp = buffs.value[10].buffT3HP;
      }

      buffs.value[10].buffT2 -= interval/1000;
      buffs.value[10].buffT3 -= interval/1000;

      //Endrurance radiation
      if(perks.value[1].status){
        perks.value[1].buff += interval / 1000;
        let curse = hero.value.activeCurse.includes(11);
        hero.value.hp += hero.value.maxHp * 0.0005 * Math.floor(Math.min(perks.value[1].buff, 10)) * (curse? cursed[11].mult: 1) * 
        (1 + hero.value.eqUpsMult['armor'].heal * 0.01);
        hero.value.hp = Math.min(hero.value.hp, hero.value.maxHp);
      } else perks.value[1].buff = 0;

    }, interval);
  };

  const stopBattleLoop = () => {
    clearInterval(intervalId);
  };
  
  onMounted(startBattleLoop);
  onUnmounted(stopBattleLoop);
  
  const stationReset = () => {
    enemyAttackBarProgress.value = 0;
    heroAttackBarProgress.value = 0;
    buffs.value[5].stuck = -1;
    buffs.value[1].used = false;
    if(hero.value.activeBuffs.includes(1))
      buffs.value[1].usedSkill = true;
    
    buffs.value[4].used = true;
    
    buffs.value[10].rise = 1;
    buffs.value[10].buffT2 = 0;
    buffs.value[10].buffT3 = 0;
    buffs.value[10].buffT3HP = 0;

    buffs.value[12].dmg = 1;
    buffs.value[12].crit = 0;
    buffs.value[12].critDmg = 0;
    if(perks.value[1].status) perks.value[1].buff = 0;
    cursed[5].time = 0;
  }

  const weaponDrop = () => {
    if(hero.value.maxStage > 1) {
      var totalDrop = (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 1? 3 : 1) * (1 + 0.75 * hero.value.soulTier) * 
      (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? overkillHandle()*(0.1 + (dimensions.value[19].infTier == dimensions.value.maxInfTier? 0.05: 0)): 1) * 
      (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
      (enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1) *
      (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) *
      (enemy.value.rebirthEnemy["drop"]) *
      (hero.value.activeFormation == 3? 2: 1) *
      (1 + (hero.value.spCount >= 10? 0.1 * hero.value.sp: 1)) *
      (1 + ascenPerks[34].level * 0.01) * 
      (hero.value.rebirthTier >= 50? 1.03 ** hero.value.rebirthTier: 1) * 
      (hero.value.mainInfTier >= 1? (1.08 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1) * 
      (perks.value[15].value ** perks.value[15].level) * 
      (hero.value.curset5? 2: 1)
      hero.value.eqTotalDrop = totalDrop;

      hero.value.dropChance['sword'] = Math.min(20 * ((0.2 + 0.035 * hero.value.awakened['sword']) ** (hero.value.eqDrop['sword'])) * Math.log(hero.value.stage + 1) ** 2 * 
      totalDrop, 100);
      hero.value.dropChance['armor'] = Math.min(20 * ((0.185 + 0.02 * hero.value.awakened['armor']) ** (hero.value.eqDrop['armor'])) * Math.log(hero.value.stage + 1) ** 2.1 *
      totalDrop, 100);
      hero.value.dropChance['boots'] = Math.min(15 * ((0.17 + 0.02 * hero.value.awakened['boots']) ** (hero.value.eqDrop['boots'])) * Math.log(hero.value.stage + 1) ** 2.3 * 
      totalDrop, 100);
      hero.value.dropChance['ring'] = Math.min(8 * ((0.15 + 0.02 * hero.value.awakened['ring']) ** (hero.value.eqDrop['ring'])) * Math.log(hero.value.stage + 1) ** 2.5 * 
      totalDrop, 100);
      

      if (Math.random() * 100 + hero.value.dropChance['sword'] >= 100 &&
          (hero.value.equipmentTiers['sword'] < hero.value.eqTierReq['sword'] || Math.floor(hero.value.spCount/6) >= 4 && hero.value.equipmentTiers['sword'] < 50)){
            hero.value.eqDrop['sword']++;
            addLog(`You dropped the ${ equipment[0].tiers[hero.value.equipmentTiers['sword']].name } T[${ hero.value.equipmentTiers['sword'] }]`, "Weapon")
      }

      if (Math.random() * 100 + hero.value.dropChance['armor'] >= 100 &&
          hero.value.equipmentTiers['armor'] < hero.value.eqTierReq['armor']){
            hero.value.eqDrop['armor']++;
            addLog(`You dropped the ${ equipment[1].tiers[hero.value.equipmentTiers['armor']].name } T[${ hero.value.equipmentTiers['armor'] }]`, "Weapon")
      }

      if (Math.random() * 100 + hero.value.dropChance['boots'] >= 100 &&
          hero.value.equipmentTiers['boots'] < hero.value.eqTierReq['boots']){
            hero.value.eqDrop['boots']++;
            addLog(`You dropped the ${ equipment[2].tiers[hero.value.equipmentTiers['boots']].name } T[${ hero.value.equipmentTiers['boots'] }]`, "Weapon")
      }

      if (Math.random() * 100 + hero.value.dropChance['ring'] >= 100 &&
          hero.value.equipmentTiers['ring'] < hero.value.eqTierReq['ring']){
            hero.value.eqDrop['ring']++;
            addLog(`You dropped the ${ equipment[3].tiers[hero.value.equipmentTiers['ring']].name } T[${ hero.value.equipmentTiers['ring'] }]`, "Weapon")
      }


    }
  }
  const curseBonus = () => {
    let bonus = 0;
    for(let id of hero.value.activeCurse){
      bonus += cursed[id].tier[hero.value.activeCurseTier[id]].bonus * (hero.value.singularity >= 2? 2: 1);
    }
    bonus = bonus * (hero.value.spCount >= 15 && hero.value.abyssDStages >= 50? 1.0125 ** Math.min(hero.value.abyssDStages - 49, 100): 1) * (hero.value.rebirthTier >= 10? 1.5: 1) 
    * (1 + ascenPerks[34].level * 0.01) * (hero.value.dId == 'hard'? 0: 1);
    let bRed = (ascenPerks[46].level? bonus ** 0.75: Math.sqrt(bonus))
    bonus = (hero.value.isAbyss? bRed: bonus);
    if(bonus > 0)
      addLog(`You gain ${formatNumber(bonus, true)} Curse bonuses`, 'Curses');

    let bCurset5 = (hero.value.curset5? 0.2 + (hero.value.rebirthPts >= 7.5e5? 0.1: 0): 0);
    hero.value.cursedBonusExp = Math.pow(bonus, (bCurset5 + (1 + 0.1 * hero.value.mutations) + 0.05 * Math.max(hero.value.activeCurse.length - 1, 0))) * 
    (1 / Math.log(Math.max(3, 100 - hero.value.stage))) / 10;


    //hero.value.cursedBonusExp = Math.min(hero.value.cursedBonusExp, 10 * (hero.value.eLevel > 300? hero.value.cursedBonusExp ** 0.3: 1));
    
    hero.value.cursedBonus = (hero.value.cursedBonusExp * 10) * (1.5 ** Math.min(hero.value.soulTier, 3)) * (hero.value.rebirthPts >= 10? 2: 1) * 
    (hero.value.rebirthPts >= 50000? enemy.value.rebirthEnemy["drop"]: 1) * 
    (hero.value.isAbyss? 0: 1) * (hero.value.activeFormation == 3? 2: 1) * 
    (hero.value.mainInfTier >= 4? (infBase(1.035) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1) * 
    (1.15 ** (dimensions.value[11].infTier - 5));

    hero.value.activeCurse = [];
  }
  const expBuffGrant = () => {
    if(dimensions.value[11].infTier == dimensions.value[11].maxInfTier){
      for(let buff of buffs.value){
        if(buff.tier < buff.maxTier)
          buff.exp += hero.value.cursedBonus;
      }
    } else {
      for(let idx of hero.value.activeBuffs){
        if(buffs.value[idx].tier < buffs.value[idx].maxTier)
          buffs.value[idx].exp += hero.value.cursedBonus;
      }
    }
    enemy.value.averageLoot.buffexp = hero.value.cursedBonus;
    
    for(let idx in buffs.value){
      if (buffs.value[idx].exp >= buffs.value[idx].maxExp[buffs.value[idx].tier-1] && buffs.value[idx].tier < buffs.value[idx].maxTier){
        buffs.value[idx].exp = buffs.value[idx].exp - buffs.value[idx].maxExp[buffs.value[idx].tier-1]
        buffs.value[idx].tier++;
      }

      if(buffs.value[idx].tier >= buffs.value[idx].maxTier)
        buffs.value[idx].exp = 0;
    }
  }
  ///curse
  const cursedAffect = () => {
    if (hero.value.stage > 19 || hero.value.isAbyss || hero.value.isSingularity || hero.value.dId == 'hard'){
      hero.value.activeCurse = [];
      let filterCursed = cursed.filter(curse => curse.status === true);
      hero.value.activeCurseTier = new Array(filterCursed.length).fill(-1);

      if (hero.value.isAbyss) {
        if(hero.value.abyssTier == 0){
          for(let i = 0; i < 7;i++){
            if(removeCurse(i)){
              hero.value.activeCurse.push(filterCursed[i].id);
              hero.value.activeCurseTier[i] = 0;
            }
          }
        } else if(hero.value.abyssTier == 1){
          for(let i = 0; i < 10;i++){
            if(removeCurse(i)){
              hero.value.activeCurse.push(filterCursed[i].id);
              hero.value.activeCurseTier[i] = 1;
            }
          }
        } else if(hero.value.abyssTier == 2){
          for(let i = 0; i < 13;i++){
            if(removeCurse(i)){
              hero.value.activeCurse.push(filterCursed[i].id);
              hero.value.activeCurseTier[i] = 2;
            }
          }
        } else if(hero.value.abyssTier == 3){
          for(let i = 0; i < Math.min(13, filterCursed.length);i++){
            if(removeCurse(i)){
              hero.value.activeCurse.push(filterCursed[i].id);
              hero.value.activeCurseTier[i] = 3;
            }
          }
        }
        
        return;
      }

      if(hero.value.dId == 'hard' && hero.value.stage > 1){
        for(let i = 0; i < 13;i++){
          if(removeCurse(i)){
            hero.value.activeCurse.push(filterCursed[i].id);
            hero.value.activeCurseTier[i] = 4;
          }
        }
        return;
      }

      if(hero.value.isSingularity && hero.value.singularity >= 8){
        for(let i = 0; i < 13;i++){
          hero.value.activeCurse.push(filterCursed[i].id);
          hero.value.activeCurseTier[i] = 4;
        }
        return;
      };
      if(hero.value.isSingularity && hero.value.singularity < 1) 
        return
      if(hero.value.isSingularity && hero.value.singularity >= 1){
        for(let i = 0; i < 13;i++){
          hero.value.activeCurse.push(filterCursed[i].id);
          hero.value.activeCurseTier[i] = 3;
        }
        return;
      };
      
      

      let countCurse = Math.floor(Math.random() * (hero.value.curse + 1));
      let tier = 0;
      let stuck = [];
      hero.value.curset5 = false;

      let t3 = Math.min(35, 1.1 * Math.log(hero.value.stage - 17)**1.95 * (hero.value.spCount >= 15 && hero.value.abyssDStages >= 20?Math.log(hero.value.abyssDStages) ** 0.35: 1));
      let t2 = Math.min(45, 10 * Math.log(hero.value.stage - 17)**0.95 * (hero.value.spCount >= 15 && hero.value.abyssDStages >= 20?Math.log(hero.value.abyssDStages) ** 0.25: 1));
      let t1 = 100 - t2 - t3;
      let mutations = 0;
      for(var count = 0; count < countCurse; count++) {
        var chance = Math.random() * 100;

        if (chance < t1)
          tier = 0
        else if(chance < t2 + t1)
          tier = 1
        else
          tier = 2


        if(hero.value.spCount >= 5){
          if(mutations < 4 && tier == 2){
            if(hero.value.stage >= (30 - radPerks[5].level) + 5 * mutations && (Math.random() * 100 + hero.value.mutation[mutations].chance >= 100)){
              mutations++;
              tier = 3;
              if(!hero.value.curset5 && hero.value.curset5Chance + Math.random() * 100 >= 100 && hero.value.stage >= 115){
                hero.value.curset5 = true;
                tier = 4;
              }
            }
          }
        }
        
        let curse = -1;

        while (!stuck.includes(curse)) {
          const randomCurse = filterCursed[Math.floor(Math.random() * filterCursed.length)];
             
          curse = randomCurse.id;
          if (!stuck.includes(curse)) {
            stuck.push(curse);
            hero.value.activeCurse.push(curse); //curse
            hero.value.activeCurseTier[curse] = tier; //curse = tier
          }
          else curse = -1;
        }
      }
      hero.value.mutations = mutations;
    }
  }

  const mutagenGain = () => {
    if(hero.value.mutations > 0){
      let mutagen = ((hero.value.mutations + (hero.value.infTier >= 4? 1: 0)) ** 2.5) * (1.025 ** radPerks[4].level) * 
      (1 + ascenPerks[34].level * 0.01) * (hero.value.curset5? 2: 1);
      mutagen /= (!hero.value.infProgress? (1 + 0.05 * Math.max(hero.value.infTier - 25, 0)): 1);
      addLog(`You gain ${formatNumber(mutagen)} mutagens`, "Radiation");
      hero.value.mutagen += mutagen;
      enemy.value.averageLoot.mutagen = mutagen;
    } else {
      hero.value.mutations = 0;
      enemy.value.averageLoot.mutagen = 0;
    }
  }

  const removeCurse = (id) => {
    switch(id){
      case 0: return perks.value[16].level? false: true;
      case 1: return ascenPerks[45].level? false: true;
      default: return true;
    }
  }
  //1
  const activeBloodCurse = (interval) => {
    if (hero.value.activeCurse.includes(1)){
      cursed[1].time += interval / 1000;
      if (hero.value.activeCurseTier[1] == 0) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.03 * hero.value.curseMult: 0); 
      }
      if (hero.value.activeCurseTier[1] == 1) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.06 * hero.value.curseMult: 0); 
      }
      if (hero.value.activeCurseTier[1] == 2) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.09 * hero.value.curseMult: 0); 
      }
      if (hero.value.activeCurseTier[1] == 3) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.12 * hero.value.curseMult: 0); 
      }
      if (hero.value.activeCurseTier[1] == 4) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.2 * hero.value.curseMult: 0); 
      }
      enemy.value.hp = Math.min(enemy.value.hp, enemy.value.maxHp);
      cursed[1].time = (cursed[1].time >= 1? 0: cursed[1].time);
    }
    cursed[1].time = (hero.value.activeCurse.includes(1)? cursed[1].time: 0);
  }
  //0
  const penetrateCurse = () => {
    if (hero.value.activeCurse.includes(0)){
      let penetrate = 0
      if (hero.value.activeCurseTier[0] == 0) {
        penetrate = 0.1 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[0] == 1) {
        penetrate = 0.2 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[0] == 2) {
        penetrate = 0.3 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[0] == 3) {
        penetrate = 0.4 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[0] == 4) {
        penetrate = Math.min(0.8 * hero.value.curseMult, 1);
      }

      return 1 - (buffs.value[0].ptr? 0: penetrate);
    }
    return 1;
  }
  //2
  const cursedShieldCurse = () => {
    if (hero.value.activeCurse.includes(2)){
      let block = 0
      if (hero.value.activeCurseTier[2] == 0) {
        block = Math.min(0.1 * hero.value.curseMult, 0.9);;
      }
      if (hero.value.activeCurseTier[2] == 1) {
        block = Math.min(0.2 * hero.value.curseMult, 0.9);;
      }
      if (hero.value.activeCurseTier[2] == 2) {
        block = Math.min(0.3 * hero.value.curseMult, 0.9);;
      }
      if (hero.value.activeCurseTier[2] == 3) {
        block = Math.min(0.4 * hero.value.curseMult, 0.9);;
      }
      if (hero.value.activeCurseTier[2] == 4) {
        block = Math.min(0.6 * hero.value.curseMult, 0.9);
      }

      return 1 - block;
    }
    return 1;
  }
  //3
  const fastReflexesCurse = () => {
    if (hero.value.activeCurse.includes(3)){
      let speed = 0
      if (hero.value.activeCurseTier[3] == 0) {
        speed = 0.3 * hero.value.curseMult
      }
      if (hero.value.activeCurseTier[3] == 1) {
        speed = 0.5 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[3] == 2) {
        speed = 0.7 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[3] == 3) {
        speed = 0.9 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[3] == 4) {
        speed = 1.5 * hero.value.curseMult;
      }

      return speed
    }
    return 0;
  }
  //4
  const acrobaticCurse = () => {
    if (hero.value.activeCurse.includes(4)){
      let avoid = 1;
      let chance = Math.random() * 100;
      if (hero.value.activeCurseTier[4] == 0) {
        avoid = (chance + 4 * hero.value.curseMult >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 1) {
        avoid = (chance + 8 * hero.value.curseMult >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 2) {
        avoid = (chance + 12 * hero.value.curseMult >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 3) {
        avoid = (chance + 16 * hero.value.curseMult >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 4) {
        avoid = (chance + 25 * hero.value.curseMult >= 100? 0: 1);
      }

      return buffs.value[11].hit? 1: avoid;
    }
    return 1;
  }
  //5
  const stunCurse = () => {
    if (hero.value.activeCurse.includes(5) && cursed[5].time <= 0){
      let chance = Math.random() * 100;
      if (hero.value.activeCurseTier[5] == 0) {
        cursed[5].time = chance + 10 * hero.value.curseMult > 100? 0.4 * hero.value.curseMult: 0;
      }
      if (hero.value.activeCurseTier[5] == 1) {
        cursed[5].time = chance + 15 * hero.value.curseMult > 100? 0.6 * hero.value.curseMult: 0;
      }
      if (hero.value.activeCurseTier[5] == 2) {
        cursed[5].time = chance + 20 * hero.value.curseMult > 100? 0.8 * hero.value.curseMult: 0;
      }
      if (hero.value.activeCurseTier[5] == 3) {
        cursed[5].time = chance + 25 * hero.value.curseMult > 100? 1 * hero.value.curseMult: 0;
      }
      if (hero.value.activeCurseTier[5] == 4) {
        cursed[5].time = chance + 35 * hero.value.curseMult > 100? 1.2 * hero.value.curseMult: 0;
      }
    }
  }
  //6
  const AccurateBlowCurse = () => {
    if (hero.value.activeCurse.includes(6)){
      let chance = Math.random() * 100;
      let crit = 1;
      if (hero.value.activeCurseTier[6] == 0) {
        crit = chance + 30 * hero.value.curseMult >= 100? 1.5 * hero.value.curseMult: 1;
      }
      if (hero.value.activeCurseTier[6] == 1) {
        crit = chance + 25 * hero.value.curseMult >= 100? 2 * hero.value.curseMult: 1;
      }
      if (hero.value.activeCurseTier[6] == 2) {
        crit = chance + 20 * hero.value.curseMult >= 100? 2.5 * hero.value.curseMult: 1;
      }
      if (hero.value.activeCurseTier[6] == 3) {
        crit = chance + 15 * hero.value.curseMult >= 100? 3 * hero.value.curseMult: 1;
      }
      if (hero.value.activeCurseTier[6] == 4) {
        crit = chance + 25 * hero.value.curseMult >= 100? 4 * hero.value.curseMult: 1;
      }
      return crit;
    }
    return 1;
  }
  //7
  const selfDestructionCurse = () => {
    if (hero.value.activeCurse.includes(7)){
      
      if (hero.value.activeCurseTier[7] == 0) {
        hero.value.hp -= hero.value.maxHp * 0.02 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[7] == 1) {
        hero.value.hp -= hero.value.maxHp * 0.03 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[7] == 2) {
        hero.value.hp -= hero.value.maxHp * 0.04 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[7] == 3) {
        hero.value.hp -= hero.value.maxHp * 0.05 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[7] == 4) {
        hero.value.hp -= hero.value.maxHp * 0.08 * hero.value.curseMult;
      }

      hero.value.hp = Math.max(hero.value.hp, 0);
    }
  }
  //8
  const steelSkinCurse = () => {
    if (hero.value.activeCurse.includes(8)){
      if (hero.value.activeCurseTier[8] == 0) {
        enemy.value.def = enemy.value.maxHp * 0.02 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[8] == 1) {
        enemy.value.def = enemy.value.maxHp * 0.04 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[8] == 2) {
        enemy.value.def = enemy.value.maxHp * 0.06 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[8] == 3) {
        enemy.value.def = enemy.value.maxHp * 0.08 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[8] == 4) {
        enemy.value.def = enemy.value.maxHp * 0.12 * hero.value.curseMult;
      }
    }
  }
  //9
  const titanCurse = () => {
    if (hero.value.activeCurse.includes(9)){
      if (hero.value.activeCurseTier[9] == 0) {
        enemy.value.maxHp *= 1.3 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[9] == 1) {
        enemy.value.maxHp *= 1.5 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[9] == 2) {
        enemy.value.maxHp *= 1.8 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[9] == 3) {
        enemy.value.maxHp *= 2 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[9] == 4) {
        enemy.value.maxHp *= 3 * hero.value.curseMult;
      }
      enemy.value.hp = enemy.value.maxHp;
    }
  }
  //10
  const BleedingCurse = () => {
    if (hero.value.activeCurse.includes(10)){
      let chance;
      if (hero.value.activeCurseTier[10] == 0) {
        chance = Math.random() * 100 + 5 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.1 * hero.value.curseMult;
        cursed[10].time = (chance? 2 * hero.value.curseMult: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 1) {
        chance = Math.random() * 100 + 10 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.2 * hero.value.curseMult;
        cursed[10].time = (chance? 3 * hero.value.curseMult: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 2) {
        chance = Math.random() * 100 + 15 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.3 * hero.value.curseMult;
        cursed[10].time = (chance? 4 * hero.value.curseMult: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 3) {
        chance = Math.random() * 100 + 20 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.4 * hero.value.curseMult;
        cursed[10].time = (chance? 5 * hero.value.curseMult: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 4) {
        chance = Math.random() * 100 + 30 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.6 * hero.value.curseMult;
        cursed[10].time = (chance? 6 * hero.value.curseMult: cursed[10].time);
      }
    }
  }
  //11
  const DirtyBloodCurse = () => {
    if (hero.value.activeCurse.includes(11)){
      if (hero.value.activeCurseTier[11] == 0) {
        cursed[11].mult = 0.9 / hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[11] == 1) {
        cursed[11].mult = 0.8 / hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[11] == 2) {
        cursed[11].mult = 0.7 / hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[11] == 3) {
        cursed[11].mult = 0.6 / hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[11] == 4) {
        cursed[11].mult = 0.4 / hero.value.curseMult;
      }
    }
  }
  //12
  const MusclesCurse = () => {
    if (hero.value.activeCurse.includes(12)){
      if (hero.value.activeCurseTier[12] == 0) {
        enemy.value.attack *= 1.25 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[12] == 1) {
        enemy.value.attack *= 1.5 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[12] == 2) {
        enemy.value.attack *= 1.75 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[12] == 3) {
        enemy.value.attack *= 2 * hero.value.curseMult;
      }
      if (hero.value.activeCurseTier[12] == 4) {
        enemy.value.attack *= 3 * hero.value.curseMult;
      }
      enemy.value.hp = enemy.value.maxHp;
    }
  }

  const createEnemy = () => {
    enemy.value.spawnType = 'none';
    if(enemy.value.boss.isBoss){
      enemy.value.boss.isBoss = true;
      enemy.value.spawnType = 'boss';
      let force = (hero.value.dId == 'afk'? 2: 1);
      enemy.value.boss.attack = Math.max(Math.sqrt((hero.value.stage / 10 )*force)**(1.04 + force*0.02*Math.floor(hero.value.stage/10)), 1.35*force); 
      enemy.value.boss.hp = Math.max(Math.sqrt((hero.value.stage / 5) + Math.log(hero.value.stage)**(0.55+0.08*Math.floor(hero.value.stage/5))), 2);
      enemy.value.boss.drop = Math.sqrt((hero.value.stage / 5) * Math.log(hero.value.stage));
    }
    if((!enemy.value.boss.isBoss || hero.value.dId == 'afk') || hero.value.isAbyss || hero.value.isSingularity || hero.value.dId == 'hard')
      cursedAffect();

    createInfSouls();
    createSoul();
    createAscensionSouls();

    var dx = getRandomFloat(0.7 + hero.value.zone * 0.04, 1.1 + hero.value.zone * 0.06)
    statEnemyCalculate(dx)

    if(hero.value.soulsMax >= 30 && enemy.value.spawnType != 'none' && hero.value.resetKilledTime < 0)
      hero.value.hp = hero.value.maxHp;


    titanCurse();
    steelSkinCurse();
    MusclesCurse();

    if(enemy.value.spawnType == 'boss' || enemy.value.spawnType == 'soul' || enemy.value.spawnType == 'a-soul' || enemy.value.spawnType == 'none')
      enemy.value.name = enemy.value.soulBuff.active? soulNames[hero.value.souls%50]:  getRandomVillainName();

    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  const createSoul = () => {
    if((hero.value.stage > 14 || hero.value.dId == 'soulD') && enemy.value.spawnType == 'none' && hero.value.souls < hero.value.soulsCap){ //soul
      let dx = 60 * ((0.43 + 0.0035 * Math.min(hero.value.souls, 40)) ** (hero.value.souls));
      let dy = Math.max((Math.log(hero.value.stage - 14) ** Math.log(hero.value.stage**Math.pow(Math.log(hero.value.stage-12), 0.65) - 14)), 1);
      let filterCursed = cursed.filter(curse => curse.status === true);

      enemy.value.soulBuff.chance = dx * dy * (ascenPerks[16].level? 1 + 0.3 * hero.value.souls: 1) * (1 + 0.35 * (hero.value.rebirthPts >= 1000? hero.value.rebirthTier: 0)) *
      (hero.value.rebirthPts >= 20? enemy.value.rebirthEnemy["drop"] * 2: 1) * (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 2? 3 : 1) *
      (hero.value.abyssTier >= 1? (1 + 0.5 * filterCursed.length): 1) * (perks.value[13].level? 1.075 ** Math.sqrt(hero.value.perkPoints): 1) * 
      (enemy.value.danger >= 10? enemy.value.dangerEnemyChance[0]: 1) * 
      (hero.value.afkSoulBoost);

      
      enemy.value.soulBuff.chance = hero.value.soulD? 100: enemy.value.soulBuff.chance;

      enemy.value.soulBuff.active = Math.random() * 100 + enemy.value.soulBuff.chance >= 100? true: false;
      enemy.value.spawnType = enemy.value.soulBuff.active? 'soul': enemy.value.spawnType;
      enemy.value.soulBuff.active = hero.value.soulD? true: enemy.value.soulBuff.active;
      
      let soulDweakness = 2 + (hero.value.dId == 'soulD'? 4 + (0.6 * (dimensions.value[14].infTier - 10)): 0) - 0.075 * (dimensions.value[14].infTier - 10) - 
      0.01 * (hero.value.spCount >= 15 && hero.value.abyssDStages >= 180? Math.max(hero.value.abyssDStages - 179, 20): 0);

      enemy.value.soulBuff.dmg = (0.4 + Math.pow( Math.log((hero.value.souls*2 + 3)**0.35), (hero.value.souls*2.5)**(0.115 + 0.001 *  Math.max(hero.value.souls - 40, 0))) * 
      (ascenPerks[19].level? 0.85: 1)) ** (hero.value.soulD? soulDweakness: 1) * Math.max((hero.value.mainInfTier >= 6? (1 / infBase(1.025) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 0.1);

      enemy.value.soulBuff.hp = (0.4 + Math.pow( Math.log((hero.value.souls*3 + 3)**0.4) , (hero.value.souls*3)**(0.135 + 0.001 *  Math.max(hero.value.souls - 40, 0))) * 
      (ascenPerks[19].level? 0.85: 1)) ** (hero.value.soulD? soulDweakness: 1) * Math.max((hero.value.mainInfTier >= 6? (1 / infBase(1.025) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 0.1);

      enemy.value.soulBuff.drop = (1 + Math.pow( Math.log((hero.value.souls*1.75 + 3)**0.5), hero.value.souls**0.175) * (ascenPerks[20].level? 1.3: 1)) ** (hero.value.soulD? 1.35: 1);
      enemy.value.soulBuff.drop = (enemy.value.soulBuff.drop > 8? 8 + Math.sqrt(enemy.value.soulBuff.drop - 8): enemy.value.soulBuff.drop);

    } 
  }
  
  const createSpaceCreature = () => {
    let abyssPenalty = (hero.value.abyssDStages >= 160 && hero.value.spCount >= 15? Math.max(1 / (1.01 ** (hero.value.abyssDStages - 159)), 0.1): 1);
    let corruption = (hero.value.dId == 'corruption'? 3: 1);
    enemy.value.name = spEnemy[hero.value.spCount].name;
    enemy.value.attack = spEnemy[hero.value.spCount].stats.dmg * (1 + Math.max(hero.value.infTier - hero.value.infPenalty, 0) * 0.1) * abyssPenalty * 
    corruption;
    enemy.value.maxHp = spEnemy[hero.value.spCount].stats.hp * (1 + Math.max(hero.value.infTier - hero.value.infPenalty, 0) * 0.1) * abyssPenalty *
    corruption;
    enemy.value.def = spEnemy[hero.value.spCount].stats.def * (1 + Math.max(hero.value.infTier - hero.value.infPenalty, 0) * 0.1) * abyssPenalty *
    corruption;
    enemy.value.hp = enemy.value.maxHp;
    enemy.value.attacksPerSecond = spEnemy[hero.value.spCount].stats.AS * (1 + Math.max(hero.value.infTier - hero.value.infPenalty, 0) * 0.02) *
    (1 - 0.02 * hero.value.survivalLevel);
    hero.value.activeCurse = [];

    if(hero.value.spCount%6 == 5 || hero.value.spCount >= 24){
      let filterCursed = cursed.filter(curse => curse.status === true);
      hero.value.activeCurseTier = new Array(filterCursed.length).fill(-1);

      if(hero.value.spCount == 5){
        hero.value.activeCurse = [0, 3, 4, 10];
        hero.value.activeCurseTier[0] = 3;
        hero.value.activeCurseTier[3] = 3;
        hero.value.activeCurseTier[4] = 1;
        hero.value.activeCurseTier[10] = 3;
      }

      if(hero.value.spCount == 11){
        hero.value.activeCurse = [5, 3, 6, 7, 1];
        hero.value.activeCurseTier[5] = 3;
        hero.value.activeCurseTier[3] = 3;
        hero.value.activeCurseTier[6] = 2;
        hero.value.activeCurseTier[7] = 2;
        hero.value.activeCurseTier[1] = 2;
      }

      if(hero.value.spCount == 16){
        hero.value.activeCurse = [2, 4, 0, 1, 8];
        hero.value.activeCurseTier[2] = 3;
        hero.value.activeCurseTier[4] = 3;
        hero.value.activeCurseTier[0] = 1;
        hero.value.activeCurseTier[1] = 1;
        hero.value.activeCurseTier[8] = 3;
      }

      if(hero.value.spCount == 23){
        hero.value.activeCurse = [0, 3, 4, 5, 6, 7, 10, 1];
        hero.value.activeCurseTier[0] = 2;
        hero.value.activeCurseTier[3] = 2;
        hero.value.activeCurseTier[4] = 3;
        hero.value.activeCurseTier[5] = 3;
        hero.value.activeCurseTier[6] = 0;
        hero.value.activeCurseTier[7] = 1;
        hero.value.activeCurseTier[10] = 3;
        hero.value.activeCurseTier[1] = 2;
      }

      if(hero.value.spCount == 29 || hero.value.spCount == 35 || hero.value.spCount == 41 || hero.value.spCount == 47){
        hero.value.activeCurse = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
        hero.value.activeCurseTier[0] = 3;
        hero.value.activeCurseTier[1] = 3;
        hero.value.activeCurseTier[2] = 3;
        hero.value.activeCurseTier[3] = 3;
        hero.value.activeCurseTier[4] = 3;
        hero.value.activeCurseTier[5] = 3;
        hero.value.activeCurseTier[6] = 3;
        hero.value.activeCurseTier[7] = 3;
        hero.value.activeCurseTier[8] = 3;
        hero.value.activeCurseTier[10] = 3;
        hero.value.activeCurseTier[11] = 3;
      }
    }

  }

  const createAscensionSouls = () => {
    if(hero.value.stage >= 20 && hero.value.abyssTier >= 2 && hero.value.dId != 'ascension'){
      let chance = Math.min(1 ** (1.01 + 0.0125 * (hero.value.stage - 20)), 4);
      let dx = 1.5 ** (1.01 + 0.01 * (hero.value.stage - 20));

      enemy.value.ascensionSoul.active = (Math.random() * 100 + chance >= 100 && enemy.value.spawnType == 'none'? true: false);
      enemy.value.spawnType = enemy.value.ascensionSoul.active? 'a-soul': enemy.value.spawnType;
      enemy.value.ascensionSoul.stats = dx;
    }
  }
  
  const createInfSouls = () => {
    if(hero.value.infTier >= 4 && !hero.value.isAbyss && hero.value.dId == 'main'){
      if(enemy.value.danger >= 100 && enemy.value.spawnType == 'none' && hero.value.stage > 59){
        enemy.value.spawnType = (Math.random()*100 + enemy.value.dangerEnemyChance[1] >= 100? 'inf-1': enemy.value.spawnType);
        enemy.value.name = (enemy.value.spawnType == 'inf-1'? 'Ω-Infinity': enemy.value.name);
      }
      if(enemy.value.danger >= 150 && enemy.value.spawnType == 'none' && hero.value.stage > 64){
        enemy.value.spawnType = (Math.random()*100 + enemy.value.dangerEnemyChance[2] >= 100? 'inf-2': enemy.value.spawnType);
        enemy.value.name = (enemy.value.spawnType == 'inf-2'? 'Mirror of the Infinity': enemy.value.name);
      }
      if(enemy.value.danger >= 200 && enemy.value.spawnType == 'none' && hero.value.stage > 69){
        enemy.value.spawnType = (Math.random()*100 + enemy.value.dangerEnemyChance[3] >= 100? 'inf-3': enemy.value.spawnType);
        enemy.value.name = (enemy.value.spawnType == 'inf-3'? 'The Infinite One': enemy.value.name);
      }
      
      if(dimensions.value[15].infTier == dimensions.value[15].maxInfTier){
        if(enemy.value.danger >= 400 && enemy.value.spawnType == 'none' && hero.value.stage > 119){
          enemy.value.spawnType = (Math.random()*100 + enemy.value.dEnemyChance[0] >= 100? 'dim-1': enemy.value.spawnType);
          enemy.value.name = (enemy.value.spawnType == 'dim-1'? 'Twisted Rootspawn': enemy.value.name);
        }
        if(enemy.value.danger >= 550 && enemy.value.spawnType == 'none' && hero.value.stage > 139){
          enemy.value.spawnType = (Math.random()*100 + enemy.value.dEnemyChance[1] >= 100? 'dim-2': enemy.value.spawnType);
          enemy.value.name = (enemy.value.spawnType == 'dim-2'? 'Voidpulse Entity': enemy.value.name);
        }
        if(enemy.value.danger >= 600 && enemy.value.spawnType == 'none' && hero.value.stage > 134){
          enemy.value.spawnType = (Math.random()*100 + enemy.value.dEnemyChance[2] >= 100? 'dim-3': enemy.value.spawnType);
          enemy.value.name = (enemy.value.spawnType == 'dim-3'? 'Fracture Beast': enemy.value.name);
        }
        if(enemy.value.danger >= 400 && enemy.value.spawnType == 'none' && hero.value.stage > 119){
          enemy.value.spawnType = (Math.random()*100 + enemy.value.dEnemyChance[3] >= 100? 'dim-4': enemy.value.spawnType);
          enemy.value.name = (enemy.value.spawnType == 'dim-4'? 'Clot of Dark Energy': enemy.value.name);
        }
        if(enemy.value.danger >= 600 && enemy.value.spawnType == 'none' && hero.value.stage > 144){
          enemy.value.spawnType = (Math.random()*100 + enemy.value.dEnemyChance[4] >= 100? 'dim-5': enemy.value.spawnType);
          enemy.value.name = (enemy.value.spawnType == 'dim-5'? 'Infinitron Prime': enemy.value.name);
        }
        if(enemy.value.danger >= 700 && enemy.value.spawnType == 'none' && hero.value.stage > 149){
          enemy.value.spawnType = (Math.random()*100 + enemy.value.dEnemyChance[5] >= 100? 'dim-6': enemy.value.spawnType);
          enemy.value.name = (enemy.value.spawnType == 'dim-6'? 'Entropy Reaver': enemy.value.name);
        }
      }
      
    }
  }

  const rewardInfSouls = () => {
    if(hero.value.infTier >= 4){
      if(enemy.value.spawnType == 'inf-1'){
        enemy.value.dangerEnemyLoot[0] += 1;
        addLog("You destroyed Ω-Infinity and gained 1 Potential", "Creatures");
      }
      if(enemy.value.spawnType == 'inf-2'){
        enemy.value.dangerEnemyLoot[1] += 1;
        addLog("You destroyed Mirror of the Infinity and gained 1 Infinity Point", "Creatures");
      }
      if(enemy.value.spawnType == 'inf-3'){
        enemy.value.dangerEnemyLoot[2] += 1;
        addLog("You destroyed The Infinite One and gained 1 Star", "Creatures");
      }
    }
    if(dimensions.value[15].infTier == dimensions.value[15].maxInfTier){
      if(enemy.value.spawnType == 'dim-1'){
        enemy.value.dEnemyLoot[0] = Math.min(enemy.value.dEnemyLoot[0] + 1, 200);
        hero.value.perkPoints++;
        addLog("You destroyed Twisted Rootspawn and gained 1 Tree Point(TP)", "Creatures");
      }
      if(enemy.value.spawnType == 'dim-2'){
        enemy.value.dEnemyLoot[1] = Math.min(enemy.value.dEnemyLoot[1] + 1, 50);
        addLog("You destroyed Voidpulse Entity and gained 1 Space Power(SP)", "Creatures");
      }
      if(enemy.value.spawnType == 'dim-3'){
        enemy.value.dEnemyLoot[2] = Math.min(enemy.value.dEnemyLoot[2] + 1, 5);
        addLog("You destroyed Fracture Beast and gained 1 Dimension Shard(DS)", "Creatures");
      }
      if(enemy.value.spawnType == 'dim-4'){
        enemy.value.dEnemyLoot[3] = Math.min(enemy.value.dEnemyLoot[3] + 1, 90);
        addLog("You destroyed Clot of Dark Energy and Enemies of Singularity gain 1 stack of Weakness ", "Creatures");
      }
      if(enemy.value.spawnType == 'dim-5'){
        enemy.value.dEnemyLoot[4] = Math.min(enemy.value.dEnemyLoot[4] + 1, 25);
        addLog("You destroyed Infinitron Prime and gained 0.01 MULT IP", "Creatures");
      }
      if(enemy.value.spawnType == 'dim-6'){
        enemy.value.dEnemyLoot[5] = Math.min(enemy.value.dEnemyLoot[5] + 1, 5);
        addLog("You destroyed Entropy Reaver and gained -0.01 INF Penalty", "Creatures");
      }
    }
  }
  //stats
  const statEnemyCalculate = (dx) => {
    let stageScaleDmg = (hero.value.stage >= 100? 0.2: 0) + (hero.value.stage >= 125? 0.1: 0) - (hero.value.stage >= 150? 0.05: 0)- (hero.value.stage >= 175? 0.15: 0)- (hero.value.stage >= 200? 0.2: 0)
    enemy.value.attack = 10 * ((1.04 ** (hero.value.stage + 1)) ** Math.min((1.15 + 0.12*Math.floor(hero.value.stage/5)), 2.25 + stageScaleDmg)) * dx * 
    (enemy.value.soulBuff.active? enemy.value.soulBuff.dmg: 1) * 
    (enemy.value.boss.isBoss? enemy.value.boss.attack: 1) * 
    (hero.value.isAbyss? 1 :enemy.value.rebirthEnemy["dmg"]) * 
    (hero.value.isAbyss? Math.max(1.04 - 0.01 * hero.value.abyssTier + (hero.value.abyssTier >= 3? 0.01: 0), 1.02) ** hero.value.stage: 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) * 
    (hero.value.isAbyss || hero.value.isSingularity? 1: Math.sqrt(enemy.value.enemyPower)) * 
    (!hero.value.infProgress? 1 + 0.1 * Math.max(hero.value.infTier - 5 * hero.value.infPenalty, 0) * (hero.value.dId == 'corruption'? 3: 1): 1) *
    (hero.value.abyssTier >= 2? 1 / ((1.04 + (ascenPerks[29].level? 0.01: 0)) ** Math.log(hero.value.ascensionShards + 1)): 1) * 
    (ascenPerks[27].level? Math.max(1 / (Math.max(hero.value.overcorruption - 0.1, 0.1)), 0.1): 1) *
    (hero.value.isAbyss && hero.value.rebirthTier >= 5? (1 / (1.025 ** hero.value.rebirthTier)): 1) *
    (1 - ascenPerks[33].level * 0.0075) * 
    (1 - ascenPerks[56].level * 0.0075) * 
    Math.max((hero.value.mainInfTier >= 22 && hero.value.isSingularity? (1 / infBase(1.01) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1) * Math.log(hero.value.infPoints + 3)))): 1), 0.1) *
    Math.max((hero.value.mainInfTier >= 8? (1 / infBase(1.02) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 0.2) * 
    Math.max((hero.value.mainInfTier >= 1 && hero.value.isAbyss? (1 / infBase(1.0225) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 0.1) * 
    (perks.value[19].level? 2 - 1.035 ** hero.value.treeTier: 1) *
    ((hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 4? Math.max(1 - 0.01 * Math.floor(buffs.value[8].time / 75), 0.1): 1)) * 
    (hero.value.isSingularity? 10000 - 1050 * Math.min(hero.value.singularity, 8): 1) * 
    (hero.value.isSingularity? 1 - enemy.value.dEnemyLoot[3]*0.01: 1) * 
    (hero.value.dId == 'survival-2'? 10: 1) * 
    (hero.value.dId == 'gravity'? 1.035 ** hero.value.stage: 1) * 
    (hero.value.dId == 'overkill'? Math.log(hero.value.kills+3)**1.25: 1) *
    (hero.value.dId == 'damage'? (1.005 * (1.0000 + 0.00075 * (dimensions.value[20].infTier - 20))) ** hero.value.dKills: 1) *
    (1 - enemy.value.weakStack * 0.01) * 
    (hero.value.travellPenalty) * 
    (hero.value.isSingularity && hero.value.singularity >= 8? Math.log(hero.value.kills + 3) ** (1 + 0.0175 * ((hero.value.kills)/75)): 1) * 
    (ascenPerks[49].level? 1 - 0.005 * Math.min(hero.value.stage, 150) - 0.00025 * Math.max(hero.value.stage - 150, 0): 1)


    enemy.value.attack = Math.max(enemy.value.attack, 10);

    let stageScaleHP = (hero.value.stage >= 100? 0.3: 0) + (hero.value.stage >= 125? 0.15: 0) - (hero.value.stage >= 150? 0.015: 0)- (hero.value.stage >= 175? 0.01: 0)- (hero.value.stage >= 200? 0.01: 0)
    enemy.value.maxHp = 40 * ((((Math.max(1.065 - 0.00075 * Math.floor(hero.value.stage/5)), 1.05)** hero.value.stage) ** Math.min((1.3+0.205*Math.sqrt(hero.value.stage/2)), 2.8 + stageScaleHP)) / (2 - (hero.value.stage > 14? 0.5: 0) - (hero.value.stage > 19? 0.5: 0))) * dx * 
    (hero.value.isAbyss? 1 :enemy.value.rebirthEnemy["hp"]) * 
    (hero.value.isAbyss? Math.max(1.05 - 0.01 * hero.value.abyssTier + (hero.value.abyssTier >= 3? 0.015: 0), 1.03) ** hero.value.stage: 1) *
    (hero.value.isAbyss || hero.value.isSingularity? 1: enemy.value.enemyPower) * 
    (!hero.value.infProgress? 1 + 0.1 * Math.max(hero.value.infTier - 5 * hero.value.infPenalty, 0) * (hero.value.dId == 'corruption'? 3: 1): 1) *
    (hero.value.abyssTier >= 2? 1 / ((1.04 + (ascenPerks[29].level? 0.01: 0)) ** Math.log(hero.value.ascensionShards + 1)): 1) *
    (hero.value.isAbyss && hero.value.rebirthTier >= 5? (1 / (1.025 ** hero.value.rebirthTier)): 1) *
    (ascenPerks[27].level? Math.max(1 / (1 + Math.max(hero.value.corruption - 0.1, 0)), 0.1): 1) *
    (1 - ascenPerks[22].level * 0.01) * 
    (1 - ascenPerks[32].level * 0.01) * 
    (1 - ascenPerks[55].level * 0.01) * 
    Math.max((hero.value.mainInfTier >= 22 && hero.value.isSingularity? (1 / infBase(1.01) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1) * Math.log(hero.value.infPoints + 3)))): 1), 0.1) *
    Math.max((hero.value.mainInfTier >= 8? (1 / infBase(1.025) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 0.1) * 
    Math.max((hero.value.mainInfTier >= 1 && hero.value.isAbyss? (1 / infBase(1.0225) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 0.1) * 
    (perks.value[19].level? 2 - 1.04 ** hero.value.treeTier: 1) *
    ((hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 4? Math.max(1 - 0.01 * Math.floor(buffs.value[8].time / 75), 0.1): 1)) * 
    (hero.value.isSingularity? Math.max(450000 - 62500 * Math.min(hero.value.singularity, 8) , 7500) : 1) * 
    (hero.value.isSingularity? 1 - enemy.value.dEnemyLoot[3]*0.01: 1) * 
    (hero.value.dId == 'survival-2'? 100: 1) * 
    (hero.value.dId == 'gravity'? 1.045 ** hero.value.stage: 1) * 
    (hero.value.dId == 'overkill'? Math.log(hero.value.kills + 3) ** 1.2: 1) *
    (hero.value.dId == 'damage'? (1.01 * (1.000 + 0.00175 * (dimensions.value[20].infTier - 20))) ** hero.value.dKills: 1) *
    (1 - enemy.value.weakStack * 0.01) * 
    (hero.value.travellPenalty) * 
    (hero.value.isSingularity && hero.value.singularity >= 8? Math.log(hero.value.kills + 3) ** Math.min(1 + 0.01 * ((hero.value.kills)/10), 1.4 + 0.3 * Math.floor(hero.value.kills/1000)): 1) * 
    (ascenPerks[49].level? 1 - 0.006 * Math.min(hero.value.stage, 150) - 0.0003 * Math.max(hero.value.stage - 150, 0): 1)

    hero.value.enemyAfkHp = enemy.value.maxHp;

    enemy.value.maxHp *= (enemy.value.boss.isBoss? enemy.value.boss.hp: 1) *
    (enemy.value.soulBuff.active? enemy.value.soulBuff.hp: 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1);

    enemy.value.maxHp = Math.max(enemy.value.maxHp, 20);

    enemy.value.hp = enemy.value.maxHp;

    enemy.value.def = 0;

    enemy.value.attacksPerSecond = 0.4 + Math.min(2, (0.1 * Math.floor(hero.value.stage / 5))) + fastReflexesCurse();
    enemy.value.attacksPerSecond -= (ascenPerks[23].level * 0.15)
    enemy.value.attacksPerSecond = enemy.value.attacksPerSecond * (1 - 0.02 * hero.value.survivalLevel);
    enemy.value.attacksPerSecond = Math.min(enemy.value.attacksPerSecond, 3.9);
    enemy.value.attacksPerSecond = Math.max(enemy.value.attacksPerSecond, 0.4);
  }

  const statCalculate = () => {
    hero.value.attack = (10 + (((1 + 0.2 * Math.floor(hero.value.potential/20)) * 
    (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + 
    (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0) + 
    hero.value.minLevel * (dimensions.value[12].infTier == dimensions.value[12].maxInfTier? 2: 1)))) * (hero.value.dId == 'noStats'? 0: 1)) * 

    (perks.value[0].infStatus? ((perks.value[0].value - 0.001) ** perks.value[0].level): 1) *
    (perks.value[0].status? (1.01 ** Math.min(perks.value[0].kills,140) + (perks.value[0].kills >= 140? perks.value[0].kills ** 0.09 - 1: 0)): 1) * 
    (!perks.value[0].infStatus && !perks.value[0].status? perks.value[0].value ** perks.value[0].level: 1) * 
    (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.multDmg + hero.value.eqUpsMult['sword'].bonus) * 
    (hero.value.mainInfTier >= 1 || hero.value.level >= 700? ((infBase(1.055, 1) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)))) : 1) *
    (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1) *
    (hero.value.rebirthPts >= 4e5 && enemy.value.isSpaceFight == 2? 1.5: 1) *
    (hero.value.dId == 'gravity' && hero.value.stage >= 20? 1 / 1.05 ** (hero.value.stage - 19): 1 ) *
    (1 - hero.value.survivalLevel * 0.04) * 
    (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1) *
    (hero.value.isSingularity && dimensions.value[10].infTier == dimensions.value[10].maxInfTier? 2: 1) *
    (ascenPerks[48].level? 1 + 0.05 * dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length: 1) * 
    (1.04 ** (dimensions.value[20].infTier - 20)) * 
    (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1)

    //first stirke
    
    hero.value.attack *= (hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 1 && !buffs.value[1].used)? 2: 1
    hero.value.attack *= (hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 2 && !buffs.value[1].used)? hero.value.critAttack*0.01: 1
    //combo
    hero.value.attack *= buffs.value[3].tier == 1? (1 + 0.01 * buffs.value[3].combo): 1;
    hero.value.attack *= buffs.value[3].tier == 2? (1 + 0.0125 * buffs.value[3].combo): 1;
    hero.value.attack *= buffs.value[3].tier == 3? (1 + 0.015 * buffs.value[3].combo): 1;
    hero.value.attack *= buffs.value[3].tier == 4? (1 + 0.0175 * buffs.value[3].combo): 1;
    //conquer
    hero.value.attack *= (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 2? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1);
    //extra life
    hero.value.attack *= (buffs.value[10].buffT2 > 0? 1.5: 1);
    //berserk
    hero.value.attack *= (buffs.value[12].dmg);
    //charge
    hero.value.attack *= (1 + 0.05 * buffs.value[6].charges.power)


    hero.value.crit = 0 + (perks.value[7].level * perks.value[7].value) + (hero.value.rebirthPts >= 150? 5: 0) + (buffs.value[12].crit) + 
    (Math.floor(hero.value.spCount/6) >= 3? hero.value.eqUpsMult['sword'].crit: 0) + (hero.value.activeBuffs.includes(11)? 15: 0) + 
    (1 * buffs.value[6].charges.energy); 
    hero.value.critAttack = 150 + (perks.value[8].level * perks.value[8].value) + (buffs.value[12].critDmg) + (hero.value.activeBuffs.includes(11)? 75: 0) + 
    (Math.floor(hero.value.spCount/6) >= 3? hero.value.eqUpsMult['sword'].critDmg: 0) + (5 * buffs.value[6].charges.energy);
    
    hero.value.attack *= (hero.value.activeFormation == 1? 2: 1);
    hero.value.attack *= (hero.value.activeFormation == 0? 0.5: 1);
    hero.value.attack *= (hero.value.activeFormation == 2? 0.5: 1);
    hero.value.attack *= (hero.value.activeFormation == 3? 0.5: 1);

    hero.value.attack *= cursedShieldCurse();

    hero.value.maxHp = ((100 + ((2 + 0.5 * Math.floor(hero.value.potential/10)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel * (dimensions.value[12].infTier == dimensions.value[12].maxInfTier? 2: 1) + 
    (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0))) * (hero.value.dId == 'noStats'? 0: 1)) + 
    (perks.value[1].value * perks.value[1].level) +
    (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp + hero.value.eqUpsMult['armor'].bonus)) * 
    (hero.value.mainInfTier >= 1 || hero.value.level >= 700? (infBase(1.015) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1) *
    (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1) * (1 + 0.05 * buffs.value[6].charges.life) * 
    (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1) * (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1);
    

    hero.value.maxHp *= (hero.value.activeFormation == 0? 2: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 1? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 2? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 3? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1);
    //d-survival
    hero.value.maxHp = (hero.value.dId == 'survival'? 1: hero.value.maxHp);

    hero.value.def = 0 + (((0.5 + 0.1 * Math.floor(hero.value.potential/30)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel * (dimensions.value[12].infTier == dimensions.value[12].maxInfTier? 2: 1)) + 
    (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0)) * (hero.value.dId == 'noStats'? 0: 1) + hero.value.eqUpsMult['armor'].def) *
    (1 + 0.05 * buffs.value[6].charges.life) *
    (1 + ((perks.value[2].value * perks.value[2].level)*0.01)) * (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1) *
    (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1) * (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1) *
    buffs.value[0].def * (hero.value.mainInfTier >= 1 || hero.value.level >= 700? (infBase(1.0125) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);


    hero.value.def *= (hero.value.activeFormation == 2? 2: 1);
    hero.value.def *= (hero.value.activeFormation == 1? 0.5: 1);
    hero.value.def *= (hero.value.activeFormation == 0? 0.5: 1);
    hero.value.def *= (hero.value.activeFormation == 3? 0.5: 1);
    //extra life
    hero.value.def *= (buffs.value[10].buffT2 > 0? 1.25: 1);
    //jagernout
    juggernautBuff();
    //d-survival
    hero.value.def = (hero.value.dId == 'survival'? 1: hero.value.def);

    hero.value.minLevel = eqCpmplect() + (ascenPerks[26].level? Math.floor(hero.value.stage/5)-1: 0) + 
    ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)) + perks.value[12].level + 
    (hero.value.infTier >= 3 && hero.value.rebirthTier >= 40? Math.floor(1.05 ** Math.min(hero.value.rebirthTier, 80)): 0) + 
    (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel + hero.value.eqUpsMult['spRing'].bonus) + 
    (hero.value.infTier >= 6? Math.floor(hero.value.soulsMax/10): 0) + 
    (ascenPerks[50].level? Math.floor(hero.value.soulsMax/20): 0) +
    (hero.value.mainInfTier >= 13? infBase(200, 18): 0) + 
    (Math.max(Math.floor(Math.max(hero.value.unlimitLevel - 700, 0) / 100 ), 0)) + 
    (hero.value.rebirthPts >= 9e5? hero.value.singularity: 0) + 
    (ascenPerks[54].level? dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length : 0) + 
    (hero.value.spCount >= 41? Math.floor(hero.value.spCount / 6): 0) + 
    dimensions.value[12].infTier

    hero.value.minLevel = (hero.value.dId == 'noMinLevel'? 0: hero.value.minLevel);

    hero.value.level = hero.value.eLevel + hero.value.minLevel;
    hero.value.maxReachedLevel = Math.max(hero.value.maxReachedLevel, hero.value.level);
    if(hero.value.dId == 'unlimitted')
      hero.value.unlimitLevel = Math.max(hero.value.unlimitLevel, hero.value.level);

    hero.value.maxLevel = 30 + (perks.value[4].status? 0: perks.value[4].value * perks.value[4].level) + ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level + 
    hero.value.souls * (dimensions.value[14].infTier == dimensions.value[14].maxInfTier? 2: 1) +
    ((equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap + hero.value.eqUpsMult['sword'].cap) +  
    (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap + hero.value.eqUpsMult['armor'].cap) + 
    (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap + hero.value.eqUpsMult['boots'].cap) + 
    (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap + hero.value.eqUpsMult['ring'].cap) + 
    (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap + hero.value.eqUpsMult['spRing'].cap)) +
    (amulets[0].status? 4: 0) + (amulets[1].status? 8: 0) + (amulets[2].status? 12: 0) + (amulets[3].status? 16: 0) + 
    eqCpmplect() + (ascenPerks[26].level? 2*Math.floor(hero.value.stage/5)-1: 0) + 
    (hero.value.spCount >= 23? hero.value.sp * 2: 0) + (radPerks[12].level) +
    ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
    (hero.value.spCount / 6 >= 5? 150: 0) + (hero.value.spCount / 6 >= 6? 200: 0) + (hero.value.spCount / 6 >= 7? 300: 0) + (hero.value.spCount / 6 >= 8? 400: 0));

    hero.value.maxLevelMult = ((amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + (amulets[3].prefix.status? 0.08: 0)) * (hero.value.spCount >= 34? 2: 1) + 
    (ascenPerks[31].level * 0.01) + (hero.value.rebirthTier >= 80? 1.01 ** (Math.min(hero.value.rebirthTier, 125) - 79) - 1: 0) + (perks.value[4].status? 0.15: 0) +
    (ascenPerks[41].level? hero.value.overcorruption / (4 - 0.15 * (dimensions.value[22].infTier - 25)): 0) + (hero.value.mainInfTier >= 10? infBase(1.07) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints)*Math.log(hero.value.infPoints))) - 1: 0) + 
    (Math.max((1.05 ** ((hero.value.unlimitLevel - 700) / 75) - 1), 0)) +
    hero.value.eqUpsMult['ring'].multLevel + 
    (hero.value.spCount >= 15 && hero.value.abyssDStages >= 200? 1.025 ** (hero.value.abyssDStages - 199) - 1: 0)

    hero.value.maxLevel *= 1 + hero.value.maxLevelMult;

    hero.value.maxLevel = Math.floor(hero.value.maxLevel);
    hero.value.trueLevel = hero.value.maxLevel;


    hero.value.infPenalty = (ascenPerks[47].level? dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length * 0.005: 0) + 
    (ascenPerks[42].level? 0.02: 0) + (enemy.value.dEnemyLoot[5]*0.01) + (Math.max(dimensions.value[13].infTier - 15, 0) * 0.005) + 
    (hero.value.rebirthPts >= 2.5e6? Math.sqrt(Math.log(hero.value.rebirthPts)) * 0.01: 0); 
    hero.value.maxInfPenalty = hero.value.infPenalty;

    hero.value.infPenalty = (hero.value.dId !== 'main' && hero.value.mainInfTier >= 20? hero.value.infPenalty * infPenaltyScale(hero.value.mainInfTier, 35): hero.value.infPenalty);
    if(!hero.value.infProgress && hero.value.level >= 700 && hero.value.dId == 'main'){
      hero.value.infProgress = true;
      hero.value.mainInfTier = Math.min(hero.value.mainInfTier + 1, 40);
      hero.value.infTier = hero.value.mainInfTier;
    }
    let infPower = Math.min(1 - 0.02 * hero.value.infTier + hero.value.infPenalty, 1);
    hero.value.maxLevel = !hero.value.infProgress? Math.floor((Math.pow(hero.value.maxLevel, infPower))): hero.value.maxLevel; 
    
    let sLevels = Math.floor((hero.value.rebirthPts >= 4.5e5? Math.log(hero.value.rebirthPts + 3) ** 1.906: 0)) + 25 * (hero.value.singularity)

    if(hero.value.dId == 'unlimitted')
      hero.value.maxLevel = Math.min(hero.value.maxLevel, hero.value.trueLevel)
    else if(hero.value.dId == 'next')
      hero.value.maxLevel = Math.floor(Math.min(hero.value.maxLevel ,700 + sLevels))
    else if(hero.value.maxLevel >= 300 && hero.value.abyssTier >= 3)
      hero.value.maxLevel = Math.floor(Math.min(300 + (hero.value.maxLevel - 300) * hero.value.corruption ,700 + sLevels))
    else if(hero.value.abyssTier < 3 && hero.value.rebirthPts <= 1e5 && hero.value.infTier >= 3)
      hero.value.maxLevel = Math.min(hero.value.maxLevel, 300);
    else if(hero.value.infTier < 3)
      hero.value.maxLevel = Math.min(hero.value.maxLevel, 100 + 10*hero.value.rebirthTier);
  

    let base = 0.5 + (hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 1? 0.5: 0);

    hero.value.attacksPerSecond = base + (perks.value[5].status? Math.min(0.1 * Math.floor(hero.value.stage / 5 - 1), 1.5): perks.value[5].value * perks.value[5].level) + 
    (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed + hero.value.eqUpsMult['boots'].bonus ) + 
    (buffs.value[3].combo == 100? 0.3: 0) + 
    (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 3? 0.1 * Math.floor(buffs.value[8].time/250): 0) + 
    (flashBuff()) + 
    (0.1 * buffs.value[6].charges.power);
    hero.value.attacksPerSecond -= hero.value.activeBuffs.includes(5)? buffs.value[5].debuff: 0;

    hero.value.attacksPerSecond = Math.min(hero.value.attacksPerSecond, 4);
    hero.value.attacksPerSecond = Math.max(hero.value.attacksPerSecond, base);

    hero.value.avoid = 0 + (hero.value.rebirthPts >= 1750? 8: 0) + (hero.value.spCount >= 33? Math.floor(hero.value.spCount / 6): 0);

    hero.value.corruption = 0.1 + (hero.value.spCount >= 22? 1.002 ** hero.value.sp - 1: 0) + (radPerks[11].level? 0.01 * Math.floor((hero.value.maxStage-5)/5): 0) + 
    (hero.value.spCount >= 15 && hero.value.abyssDStages >= 40? (1 - (1 / (Math.sqrt(hero.value.abyssDStages - 39) ** 0.15))): 0) + 
    (hero.value.mainInfTier >= 5? (infBase(1.01) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)) - 1): 0) + 
    (hero.value.rebirthTier >= 70? (1.02 ** Math.sqrt(hero.value.rebirthTier) - 1): 0) + 
    ((dimensions.value[22].infTier - 25) * 0.1);

    hero.value.overcorruption = Math.max(hero.value.corruption - 1, 0);
    hero.value.corruption = Math.min(hero.value.corruption, 1);
    if(hero.value.dId == 'corruption') hero.value.corruption = 0.1;

    hero.value.freeTreePoints = 50 * (dimensions.value[6].infTier - 10) + enemy.value.dEnemyLoot[0];

    hero.value.dsStage = 150 - (hero.value.rebirthPts >= 8.5e5? Math.floor(Math.log(hero.value.rebirthPts + 3)): 0) - 
    (hero.value.abyssDStages >= 120 && hero.value.spCount >= 15? Math.floor(Math.sqrt(hero.value.abyssDStages - 119)): 0) - 
    (dimensions.value[13].infTier == dimensions.value[13].maxInfTier? 30: 0);
    
    hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
    if(hero.value.dId == 'survival-2') hero.value.survivalStage = Math.max(hero.value.survivalStage, hero.value.maxStage);
 
  }

  const eqStatsHandle = () => {
    hero.value.eqTierReq['sword'] = 3 + (ascenPerks[1].level == 1? 1: 0)  + (hero.value.rebirthPts >= 15? 1: 0) + 
    (hero.value.spCount >= 3? 1: 0) + (hero.value.spCount >= 26? 1: 0) + hero.value.eqMin['sword'] + (dimensions.value[8].infTier - 5);

    hero.value.eqTierReq['armor'] = 3 + (ascenPerks[2].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
    (hero.value.spCount >= 3? 1: 0) + (hero.value.spCount >= 26? 1: 0) + hero.value.eqMin['armor'] + (dimensions.value[8].infTier - 5);

    hero.value.eqTierReq['boots'] = 3 + (ascenPerks[3].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
    (hero.value.spCount >= 3? 1: 0) + (hero.value.spCount >= 26? 1: 0) + hero.value.eqMin['boots'] + (dimensions.value[8].infTier - 5);

    if (ascenPerks[5].level == 1) {
      hero.value.eqTierReq['ring'] = 3 + (ascenPerks[4].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
      (hero.value.spCount >= 3? 1: 0) + (hero.value.spCount >= 26? 1: 0) + hero.value.eqMin['ring'] + (dimensions.value[8].infTier - 5);
    }
    else 
      hero.value.eqTierReq['ring'] = 0

    eqMin();
    eqTierHandle();

    if(hero.value.isSingularity && hero.value.singularity >= 6)
      hero.value.freeEnchances = 0;
    else
      hero.value.freeEnchances = 0 + (hero.value.spCount >= 25? 3: 0) + (ascenPerks[43].level? 3: 0) + (hero.value.singularity >= 7? hero.value.singularity: 0) + 
      (ascenPerks[52].level? Math.floor(dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length/2): 0);
  }

  const eqTierHandle = () => {
    hero.value.equipmentTiers['sword'] = Math.min(hero.value.eqDrop['sword'] + hero.value.eqMin['sword'], 50);
    hero.value.equipmentTiers['armor'] = hero.value.eqDrop['armor'] + hero.value.eqMin['armor'];
    hero.value.equipmentTiers['boots'] = hero.value.eqDrop['boots'] + hero.value.eqMin['boots'];
    hero.value.equipmentTiers['ring'] = hero.value.eqDrop['ring'] + hero.value.eqMin['ring'];

    if(hero.value.dId == 'noEq' || hero.value.isSingularity && hero.value.singularity >= 6){
      hero.value.equipmentTiers['sword'] = 0;
      hero.value.equipmentTiers['armor'] = 0;
      hero.value.equipmentTiers['boots'] = 0;
      hero.value.equipmentTiers['ring'] = 0; 

      hero.value.eqTierReq['sword'] = 0;
      hero.value.eqTierReq['armor'] = 0;
      hero.value.eqTierReq['boots'] = 0;
      hero.value.eqTierReq['ring'] = 0;
    }


  
  }

  const eqCpmplect = () => {
    let eq = (hero.value.rebirthPts >= 25? ((hero.value.equipmentTiers['sword'] >= 3 && hero.value.equipmentTiers['armor'] >= 3 && hero.value.equipmentTiers['boots'] >= 3)? 3: 0) : 0) +
    ( hero.value.rebirthPts >= 200? ((hero.value.equipmentTiers['sword'] >= 4 && hero.value.equipmentTiers['armor'] >= 4 
      && hero.value.equipmentTiers['boots'] >= 4 && hero.value.equipmentTiers['ring'] >= 4)? 4: 0) : 0) + 
    ( hero.value.rebirthPts >= 4000? ((hero.value.equipmentTiers['sword'] >= 5 && hero.value.equipmentTiers['armor'] >= 5 
      && hero.value.equipmentTiers['boots'] >= 5 && hero.value.equipmentTiers['ring'] >= 5)? 5: 0): 0);
    
    return eq;
  }

  const eqMin = () => {
    hero.value.eqMin['sword'] = 0 + (ascenPerks[10].level? 1: 0) + Math.floor(hero.value.spCount/6) + (hero.value.spCount >= 47? 1: 0);

    hero.value.eqMin['armor'] = 0 + (ascenPerks[11].level? 1: 0) + (hero.value.spCount >= 47? 1: 0);

    hero.value.eqMin['boots'] = 0 + (ascenPerks[12].level? 1: 0) + (hero.value.spCount >= 47? 1: 0);

    hero.value.eqMin['ring'] = 0 + (ascenPerks[13].level && ascenPerks[5].level? 1: 0) + (hero.value.spCount >= 47? 1: 0);
  }
  //buff
  const buffActivation = () => {
    if (perks.value[6].level) 
      buffs.value[0].active = true;

    if (perks.value[9].level)
      buffs.value[2].active = true;

    if (ascenPerks[7].level)
      buffs.value[1].active = true;

    if (ascenPerks[17].level)
      buffs.value[3].active = true;

    if (ascenPerks[25].level)
      buffs.value[5].active = true;

    if (hero.value.soulsMax >= 10)
      buffs.value[7].active = true;

    if (hero.value.soulsMax >= 20)
      buffs.value[4].active = true;

    if (hero.value.soulsMax >= 30)
      buffs.value[11].active = true;

    if (hero.value.soulsMax >= 40)
      buffs.value[12].active = true;

    if (hero.value.rebirthPts >= 500)
      buffs.value[10].active = true;

    if (hero.value.rebirthPts >= 25000)
      buffs.value[8].active = true;

    if (hero.value.rebirthPts >= 7500)
      buffs.value[9].active = true;

    if(hero.value.spCount >= 17)
      buffs.value[13].active = true;

    if(hero.value.spCount >= 29)
      buffs.value[14].active = true;

    if(hero.value.spCount >= 40)
      buffs.value[11].maxTier = 4;

    if(hero.value.mainInfTier >= 15){
      buffs.value[6].active = true;
      buffs.value[6].maxTier = 1 + hero.value.singularity;
    }
     

    if(hero.value.singularity >= 1){
      buffs.value[7].maxTier = 4;
    }


    chargesBuffReset();

  }

  const dStun = () => {
    if(dimensions.value[4].infTier >= dimensions.value[4].maxInfTier){
      return Math.random()*100 + 5 >= 100;
    }
    return false;
  }

  const healBuff = (interval) => {
    let curse = hero.value.activeCurse.includes(11);
    buffs.value[4].time += interval / 1000;
      if(hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 1){
        hero.value.hp += (buffs.value[4].time >= 1? hero.value.stage: 0) * (curse? cursed[11].mult: 1) * 
        (1 + hero.value.eqUpsMult['armor'].heal * 0.01);
      }
      if(hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 2){
        hero.value.hp += (buffs.value[4].used? hero.value.maxHp * 0.05: 0) * (curse? cursed[11].mult: 1) * 
        (1 + hero.value.eqUpsMult['armor'].heal * 0.01);
        buffs.value[4].used = false;
      }
      if(hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 3){
        hero.value.hp += (buffs.value[4].time >= 1? hero.value.maxHp * 0.05: 0) * (curse? cursed[11].mult: 1) * 
        (1 + hero.value.eqUpsMult['armor'].heal * 0.01);
      }
      hero.value.hp = Math.min(hero.value.hp, hero.value.maxHp);
      buffs.value[4].time = buffs.value[4].time >= 1? 0: buffs.value[4].time;
      buffs.value[4].time = hero.value.activeBuffs.includes(4)? buffs.value[4].time: 0;
  }

  const invisibleBuff = (enemyAttack) => {
    buffs.value[0].ptr = 1;
    buffs.value[0].def = 1;
    if (hero.value.activeBuffs.includes(0) && buffs.value[0].tier >= 1){
      var defChance = Math.random() + 0.33 >= 1;
      buffs.value[0].def = defChance? 2: 1;
    }
    if (hero.value.activeBuffs.includes(0) && buffs.value[0].tier >= 2){
      var blockChance = Math.random() + 0.35 >= 1
      enemyAttack = blockChance? 1 : enemyAttack;
    }
    if (hero.value.activeBuffs.includes(0) && buffs.value[0].tier >= 3){
      buffs.value[0].ptr = 0;
    }
    return enemyAttack;
  }

  const firstStrikeBuff = () => {
    if (hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 3 && !buffs.value[1].used){
      buffs.value[1].stun = 1;
    }
    buffs.value[1].used = true;
  }

  const comboStuckBuff = () => {
    if( hero.value.activeBuffs.includes(3) ){
      if( buffs.value[3].tier == 1){
        buffs.value[3].combo = Math.min(buffs.value[3].combo + 1, 30);
      }
      if( buffs.value[3].tier == 2){
        buffs.value[3].combo = Math.min(buffs.value[3].combo + 1 + (Math.random() + 0.5 >= 1? 1: 0), 40);
      }
      if( buffs.value[3].tier == 3){
        buffs.value[3].combo = Math.min(buffs.value[3].combo + 1.5, 50);
      }
      if( buffs.value[3].tier == 4){
        buffs.value[3].combo = Math.min(buffs.value[3].combo + 2, 100);
        
      }
    }
    if (!hero.value.activeBuffs.includes(3))
      buffs.value[3].combo = 0;
  }

  const comboResetBuff = () => {
    if (hero.value.activeBuffs.includes(3)){
      if(buffs.value[3].tier == 1){
        buffs.value[3].combo = 0;
      }
      if(buffs.value[3].tier == 2){
        buffs.value[3].combo = buffs.value[3].combo * 0.25;
      }
      if(buffs.value[3].tier == 3){
        buffs.value[3].combo = buffs.value[3].combo * 0.5;
      }
    }
  }

  const flexibleBuff = () => {
    let chance = 1;
    if(!hero.value.activeBuffs.includes(9))
      chance = (Math.random()*100 + hero.value.avoid >= 100? 0: 1);

    if(hero.value.activeBuffs.includes(9) && buffs.value[9].tier == 1)
      chance = (Math.random()*100 + hero.value.avoid + 10 >= 100? 0: 1);

    if(hero.value.activeBuffs.includes(9) && buffs.value[9].tier == 2)
      chance = (Math.random()*100 + hero.value.avoid + 20 >= 100? 0: 1);
    
    if(hero.value.activeBuffs.includes(9) && buffs.value[9].tier == 3)
      chance = (Math.random()*100 + hero.value.avoid + 20 >= 100 || Math.random()*100 + hero.value.avoid + 20 >= 100? 0: 1);
      
    return chance;
  }

  const extraLifeBuff = () => {
    if(!buffs.value[10].rise)
      return;
    let dChance = 5 * dimensions.value[4].infTier;
    let chance = (Math.random()*100 + (35 + dChance) >= 100? 1: 0);
    if(hero.value.activeBuffs.includes(10) && buffs.value[10].tier >= 1 && chance){
      buffs.value[10].rise = 0;
      hero.value.hp = hero.value.maxHp * 0.5;
    }
    if(hero.value.activeBuffs.includes(10) && buffs.value[10].tier >= 2 && chance){
      buffs.value[10].buffT2 = 8;
    }
    if(hero.value.activeBuffs.includes(10) && buffs.value[10].tier >= 3 && chance){
      buffs.value[10].buffT3 = 4;
      buffs.value[10].buffT3HP = hero.value.hp;
    }
  }

  const fastSlashBuff = () => {
    if(hero.value.activeBuffs.includes(5) && buffs.value[5].tier >= 1){
      buffs.value[5].debuff = 0.8;
      buffs.value[5].stuck = 1;
    }
    if(hero.value.activeBuffs.includes(5) && buffs.value[5].tier >= 2){
      buffs.value[5].debuff = 0.7;
      buffs.value[5].stuck += (Math.random()*100 + 45 >= 100? 1: 0);
    }
    if(hero.value.activeBuffs.includes(5) && buffs.value[5].tier >= 2){
      buffs.value[5].debuff = 0.6;
      buffs.value[5].stuck += (Math.random()*100 + 25 >= 100? 1: 0);
    }

    heroAttackBarProgress.value += buffs.value[5].stuck;
  }

  const chargesBuffReset = () => {
    if(!hero.value.activeBuffs.includes(6)){
      buffs.value[6].charges.power = 0;
      buffs.value[6].charges.energy = 0;
      buffs.value[6].charges.life = 0;
    }
  }

  const chargeGet = () => {
    chargeMix(25, 1);
  }

  const chargeLost = () => {
    chargeMix(50, -1);
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const chargeMix = (value, sign) => {
    if(hero.value.activeBuffs.includes(6)){
      let tier =  buffs.value[6].tier;
      let chance = value + (sign > 0? 1: -2) * (tier - 1);
      let success = Math.random() * 100 + chance >= 100;
      
      if(!success)
        return;

      let rndCharge = Math.floor(Math.random() * 3);
      const charges = buffs.value[6].charges;

      switch (rndCharge) {
        case 0:
          charges.power = clamp(charges.power + 1 * sign, 0, tier);
          break;
        case 1:
          charges.energy = clamp(charges.energy + 1 * sign, 0, tier);
          break;
        case 2:
          charges.life = clamp(charges.life + 1 * sign, 0, tier);
          break;
      }
    }
  }

  const conquerBuff = (interval) => {
    if(hero.value.activeBuffs.includes(8)){
      if(buffs.value[8].tier == 1) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 500); 
      if(buffs.value[8].tier == 2) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 750); 
      if(buffs.value[8].tier == 3) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 1000);
      if(buffs.value[8].tier == 4) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 1250); 
    }
    else 
      buffs.value[8].time = 0 + (buffs.value[8].tier >= 4? 250: 0);
  }
  
  const sniperBuff = () => {
    if(buffs.value[1].usedSkill)
      return;

    if(!hero.value.activeBuffs.includes(11)){
      hero.value.attack *= (Math.random() * 100 + hero.value.crit >= 100? hero.value.critAttack*0.01: 1);
      return;
    }

    buffs.value[11].hit = false;  
    let chance = Math.random() * 100 + hero.value.crit >= 100;
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 2){
      hero.value.attack *= (hero.value.crit >= 100? 2: 1);
    }
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 3){
      if(!chance)
        chance = Math.random() * 100 + hero.value.crit >= 100;
    }
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 4){
      buffs.value[11].hit = chance;
    }

    hero.value.attack *= (chance? (hero.value.critAttack)*0.01: 1);
    
  }

  const berserkBuff = () => {
    if(hero.value.activeBuffs.includes(12) && buffs.value[12].tier >= 1){
      buffs.value[12].dmg = (1 + (1 - hero.value.hp / hero.value.maxHp ) * 1); 
    }
    if(hero.value.activeBuffs.includes(12) && buffs.value[12].tier >= 2){
      buffs.value[12].crit = (1 - hero.value.hp / hero.value.maxHp) * 15;
      buffs.value[12].critDmg = (1 - hero.value.hp / hero.value.maxHp) * 75;
    }
  }

  const juggernautBuff = () => {
    if(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 1){
      hero.value.def *= 1.5;
      hero.value.maxHp *= 1.5;
      hero.value.attack *= 0.75;
    }
    if(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 2){
      hero.value.def *= 1 + ((1 - (hero.value.hp / hero.value.maxHp)));
    }
    if(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 3){
      hero.value.def += (hero.value.maxHp * 0.05);
    }
  }

  const flashBuff = () => {
    let total = 0;
    if(hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 2){
      total += Math.min(Math.floor(hero.value.spCount / 6) * 0.1, 0.5);
    }
    if(hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 3){
      total += Math.min(hero.value.stage * 0.01, 1);
    }
    return total;
  }
//ascension
  const ascensionEffect = () => {
    amulets[0].status = (ascenPerks[8].level && hero.value.maxStage >= 20? true: false);

    amulets[0].suffix.status = (ascenPerks[14].level && ascenPerks[8].level? true: false);

    amulets[0].prefix.status = (ascenPerks[24].level && ascenPerks[8].level? true: false);

    if(ascenPerks[30].level){
      buffs.value[0].maxTier = 4;
    }
    
    if(ascenPerks[38].level)
      buffs.value[8].maxTier = 4;

    ascenPerks[32].level = Math.min(ascenPerks[32].level, 90);
    ascenPerks[33].level = Math.min(ascenPerks[33].level, 90);

    if(ShardsInterval >= 1000 && dimensions.value[1].infTier == dimensions.value[1].maxInfTier){
      ShardsInterval = 0;
      hero.value.ascensionShards += hero.value.totalAscensionShards * 0.1;
    }

    hero.value.dsTotal = hero.value.ds + enemy.value.dEnemyLoot[2] - hero.value.dsSpend;
    hero.value.dsMax = Math.max(hero.value.dsTotal, hero.value.dsMax);

    if(dimensions.value[17].infTier == dimensions.value[17].maxInfTier){
      ascenPerks[56].infStatus = true;
      ascenPerks[55].infStatus = true;
    } else {
      ascenPerks[56].infStatus = false;
      ascenPerks[55].infStatus = false;
    }

    ascenPerks.forEach(perk => {
      if(perk.tier == 6 && perk.id >= 32 && perk.id < 37)
        perk.infStatus = true;
    })
  }

  const ascensionShardsProgress = (stage) => {
    if(hero.value.isTravell) return;

    var x = Math.sqrt(Math.log(stage+2) ** (stage/7)) * Math.min(1 + hero.value.maxLevel / 100, 7);
    x *= hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 1.5: 1;
    x *= enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1;
    x *= (enemy.value.boss.isBoss? enemy.value.boss.drop: 1);
    x *= (ascenPerks[29].level? (1 + 0.04 * hero.value.sp): 1);
    x *= (1 + ascenPerks[34].level * 0.01);
    x *= (hero.value.mainInfTier >= 3? (infBase(1.045) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    hero.value.shardsMult = x;

    if(hero.value.dId == 'ascension') return;

    if(enemy.value.ascensionSoul.active){
      x *= enemy.value.ascensionSoul.stats * 0.1;
      x *= (enemy.value.ascensionSoul.active && hero.value.activeFormation == 3? 2: 1);
      x *= (enemy.value.danger >= 20? enemy.value.dangerEnemyChance[4]: 1);
      hero.value.ascensionShards += x;
      addLog(`You gain ${formatNumber(x, true)} ascension shards from ${enemy.value.name}`, "Ascend && Rebirth");
      return;
    }

    hero.value.ascensionShards += x;
    hero.value.totalAscensionShards += x;

    hero.value.shardsPerformMult = (1.5 * (hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3) * (hero.value.rebirthPts >= 2? 2: 1) * 
    (hero.value.rebirthPts >= 2500? enemy.value.rebirthEnemy["drop"]: 1))

    hero.value.ascendShardPerform = hero.value.totalAscensionShards * hero.value.shardsPerformMult - hero.value.totalAscensionShards;

    if(enemy.value.soulBuff.active){
      addLog(`You gain ${formatNumber(x, true)} ascension shards from ${enemy.value.name}`, "Ascend && Rebirth");
      return;
    }
      
    if(enemy.value.boss.isBoss){
      addLog(`You gain ${formatNumber(x, true)} ascension shards from Boss ${enemy.value.name}`, "Ascend && Rebirth");
      return;
    }
      

    addLog(`You gain ${formatNumber(x, true)} ascension shards `, "Ascend && Rebirth");
  }

  const handleEnemyDefeat = () => {
    if(hero.value.isStage)
      hero.value.kills = Math.min(hero.value.kills + overkillHandle(), Math.floor(hero.value.killsPerZone));
    else
      hero.value.kills = hero.value.kills + overkillHandle();

    

    if(hero.value.isSingularity || !hero.value.isStage)
      return;

    hero.value.lacrimose = (hero.value.rebirthPts >= 20000? 0.15: 0) + (hero.value.infTier >= 2? 0.25: 0) + (0.02 * hero.value.singularity);
    if(hero.value.stage <= hero.value.maxStage * hero.value.lacrimose && hero.value.isStage && !hero.value.isTravell && !hero.value.soulD && hero.value.dId != 'next'){
      hero.value.stage++;
      hero.value.zone = 1;
      hero.value.kills = 0;
      refreshKillsPerZone();
      grantExp();
      if (hero.value.stage > 10)
        ascensionShardsProgress(hero.value.stage);
    }

    if(hero.value.kills == Math.floor(hero.value.killsPerZone) && hero.value.zone == 5 && hero.value.stage > 5 && hero.value.stage%5 == 4 && !enemy.value.boss.isBoss){
      enemy.value.boss.isBoss = true;
      hero.value.hp = hero.value.maxHp;
    }

    if (hero.value.kills >= Math.floor(hero.value.killsPerZone) && !enemy.value.boss.isBoss) {
      hero.value.kills = 0;
      hero.value.zone++;
  
      if (hero.value.zone > 5) {
        hero.value.zone = 1;
        hero.value.stage++;
        
        if(hero.value.dId == 'next')
          hero.value.stage = Math.min(hero.value.stage, 30);
        if(hero.value.soulD && hero.value.dId != 'soulD')
          hero.value.stage = 15;
        if(hero.value.stage > 100 && hero.value.isAbyss && hero.value.dId != 'abyss-d')
          hero.value.stage = 100;
        
        if(hero.value.abyssTier >= 3 && hero.value.isAbyss) hero.value.abyssDStages = Math.max(hero.value.stage, hero.value.abyssDStages);
          
        if (hero.value.stage > 10)
          ascensionShardsProgress(hero.value.stage);
      }

      refreshKillsPerZone();
    }
  }

  const overkillHandle = () => {
    var totalKills = 1

    totalKills += (ascenPerks[21].level? 1: 0) + (ascenPerks[35].level) + (hero.value.mainInfTier >= 2? Math.floor(infBase(1.35) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1) * Math.log(hero.value.infPoints + 2)))): 0) +
    (1 * (dimensions.value[19].infTier - 20)) + hero.value.eqUpsMult['boots'].overkill;

    if (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 1){
      totalKills+=1
    }
    if (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 2){
      totalKills+=Math.floor(hero.value.maxLevel/100);
    }
    if (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 3){
      totalKills+= Math.floor(hero.value.level/50);
    }
    if(perks.value[0].status)
      perks.value[0].kills += totalKills;

    hero.value.overkill = totalKills;

    return totalKills;
  }

  const refreshKillsPerZone = () => {
    var x = (hero.value.stage > 9? 1.34: 1.15) - (perks.value[10].value * perks.value[10].level) - (ascenPerks[15].level == 1? 0.01: 0) - (hero.value.soulTier >= 2? 0.01: 0) - 
    (hero.value.rebirthPts >= 125? 0.01: 0) -  (hero.value.rebirthPts >= 22500? 0.01: 0) - (hero.value.spCount >= 16? 0.01: 0) - 
    (hero.value.spCount >= 15 && hero.value.abyssDStages >= 70? 0.01 * (1.01 * Math.log(hero.value.abyssDStages - 67)): 0) - 
    (dimensions.value[3].infTier * 0.01) - (hero.value.eqUpsMult['boots'].stage)

    x += (hero.value.dId == 'overkill'? 0.1: 0);
    x = Math.max(x, 1.05);

    var end = 5 * (hero.value.stage-1) + hero.value.zone;
    var start = 5;
    for(var i = 1; i < end; i++){
      start *= x;
      if(i > 1 && i%5 == 0){
        var baseMult = 0;
        for(var y = 0; y < Math.floor((hero.value.stage - 1) / 5); y++)
          baseMult += 0.0125 + (0.00001 * Math.floor(hero.value.stage / 50));
        
        start *= 0.2 + baseMult;
        start = Math.max(start, 5);
      }

    }
    start = Math.min(start, 10000);
    hero.value.killsPerZone = Math.max(start * (hero.value.mainInfTier >= 7? (1 / infBase(1.03) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), 5);
  }

  const expCount = () => {
    return Math.log(hero.value.stage + 5)**4.5;
  }

  const soulHandle = () => {
    amulets[1].status = hero.value.maxStage >= 20 && hero.value.soulsMax >= 20? true: false;
    amulets[1].suffix.status = hero.value.soulsMax >= 30? true: false;
    amulets[1].prefix.status = hero.value.soulsMax >= 40? true: false;

    perks.value[0].value = 1.01 + (hero.value.soulsMax >= 40? 0.001 * hero.value.treeTier: 0);

    hero.value.formationTypes[2].status = (hero.value.soulsMax >= 40? true: false);

    hero.value.soulTier = Math.floor(hero.value.souls/10);
    
  }

  const rebirthPtsHandle = () => {
    let extraLevel = hero.value.level + (ascenPerks[37].level? 50: 0) + (hero.value.rebirthTier >= 20? 25: 0);
    let pt = Math.min((Math.log(Math.max((extraLevel - 97), 3)**(1.15 + 0.08 * (Math.floor(hero.value.rebirthPts)).toFixed(0).length))**(extraLevel/Math.max(100 - (1 * extraLevel/9), 1))), 10000);
    pt = (pt >= 400? 400 + Math.sqrt(pt - 400): pt);
    let pts = pt * 
      (hero.value.rebirthPts >= 100? enemy.value.rebirthEnemy["drop"]: 1) * (1.3 ** hero.value.abyssTier) * 
      (perks.value[14].level? 1 + 0.2 * perks.value[14].level: 1) * (hero.value.soulTier >= 4? 1.5: 1) * 
      (hero.value.rebirthPts >= 1250? Math.min((1 + 0.01 * hero.value.rebirthTier) ** 8, 2) * ((1 + 0.01 * Math.max(hero.value.rebirthTier - 9, 0)) ** 2) : 1) * 
      (1 + ascenPerks[34].level * 0.01) * (hero.value.mainInfTier >= 3? (infBase(1.025) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    hero.value.totalPtsMult = pts;
    if (hero.value.level >= 100){
      hero.value.totalRebirthPts = pts;
      if(hero.value.singularity < 8){
        hero.value.totalRebirthPts = Math.min(hero.value.totalRebirthPts, 1e5 - hero.value.rebirthPts);
        hero.value.rebirthPts = Math.min(hero.value.rebirthPts, 1e5);
      }
      else {
        hero.value.rebirthPts = 1e5 + (hero.value.isSingularity? Math.log(hero.value.kills + 3) ** 7.255: Math.log(hero.value.singularityKills + 3) ** 7.255);
        hero.value.rebirthPts = Math.min(hero.value.rebirthPts, 1e7);
      }
      
    } 
    
  }

  const rebirthHandle = () => {
    hero.value.potential = (hero.value.rebirthPts >= 3? 10: 0) + (hero.value.rebirthPts >= 75? 10: 0) + (hero.value.rebirthPts >= 250? 10: 0) + 
    (hero.value.rebirthPts >= 5000? 10: 0) + (hero.value.rebirthPts >= 17500? 10: 0) + (hero.value.rebirthPts >= 60000? 10: 0) + radPerks[6].level + 
    (hero.value.infTier >= 3 && hero.value.rebirthTier >= 30? Math.floor(1.053 ** Math.min(hero.value.rebirthTier, 80)): 0) + (enemy.value.dangerEnemyLoot[0]) + 
    (perks.value[18].level) + (hero.value.mainInfTier >= 20? infBase(250, 22): 0) + 
    (hero.value.rebirthPts >= 5e5? 30: 0) + (6 * (dimensions.value[10].infTier - 10));


    if(hero.value.rebirthPts >= 2000 && hero.value.maxStage >= 20) 
      amulets[2].status = true;
    else amulets[2].status = false;

    if(hero.value.rebirthPts >= 10000)
      amulets[2].suffix.status = true;
    else amulets[2].suffix.status = false;

    if(hero.value.rebirthPts >= 40000)
      amulets[2].prefix.status = true;
    else amulets[2].prefix.status = false;

    if(hero.value.rebirthPts >= 100)
      hero.value.formationTypes[0].status = true;
    if(hero.value.rebirthPts >= 1500)
      hero.value.formationTypes[1].status = true;
    if(hero.value.rebirthPts >= 80000)
      hero.value.formationTypes[3].status = true;

    hero.value.curset5Chance = (hero.value.rebirthPts >= 1.5e5? 1: 0) * 
    (hero.value.rebirthPts >= 3.5e5? Math.log(hero.value.rebirthPts + 3): 1) * 
    (hero.value.abyssDStages >= 100 && hero.value.spCount >= 15? Math.max(1.01 ** (hero.value.abyssDStages - 99), 1): 1);

    hero.value.soulOverkill = ((hero.value.rebirthPts >= 2e5? 1: 0) + (hero.value.rebirthPts >= 6.5e5? 1: 0)) * (hero.value.dId == 'soulD'? 0: 1);


  }

  const rebirthEnemyHandle = () => {
    if(hero.value.rebirthTier){
      let dmg = (1.02 ** hero.value.rebirthTier)
      let hp = (1.04 ** hero.value.rebirthTier)
      let drop = ((dmg + hp)**0.75) * (1 + hero.value.rebirthTier * 0.01);
      drop = drop > 4? 4 + Math.sqrt(drop - 4): drop;

      enemy.value.rebirthEnemy["dmg"] = (hero.value.infTier >= 3? 1: dmg.toFixed(2));
      enemy.value.rebirthEnemy["hp"] = (hero.value.infTier >= 3? 1: hp.toFixed(2));
      enemy.value.rebirthEnemy["drop"] = drop.toFixed(2);
    } else {
      enemy.value.rebirthEnemy["dmg"] = 1;
      enemy.value.rebirthEnemy["hp"] = 1;
      enemy.value.rebirthEnemy["drop"] = 1;
    }
  }

  const amuletsHandle = () => {
    hero.value.treeTier = 0 + 
    (amulets[0].status && amulets[0].suffix.status? 1: 0) + 
    (amulets[1].status && amulets[1].suffix.status? 1: 0) + 
    (amulets[2].status && amulets[2].suffix.status? 1: 0) + 
    (amulets[3].status && amulets[3].suffix.status? 1: 0) + 
    (hero.value.singularity >= 3? 1: 0) - 1;

    hero.value.maxBuffs = 1 + (amulets[0].status && hero.value.maxStage >= 20? 1: 0) + (amulets[1].status && hero.value.maxStage >= 30? 1: 0) + 
    (amulets[2].status && hero.value.maxStage >= 40? 1: 0) + (amulets[3].status && hero.value.maxStage >= 50? 1: 0) + 
    (hero.value.rebirthPts >= 15000? 1: 0) + (hero.value.isAbyss && hero.value.rebirthTier >= 15? 1: 0) + (hero.value.singularity >= 6? 1: 0);
    hero.value.curse = 1 + (amulets[0].status? 1: 0) + (amulets[1].status? 1: 0) + (amulets[2].status? 1: 0) + (amulets[3].status? 1: 0) + 
    (hero.value.rebirthTier >= 10? 1: 0);

    if(hero.value.abyssTier >= 1 || hero.value.dId == 'hard'){
      cursed[7].status = true;
      cursed[8].status = true;
      cursed[9].status = true;
    }
    if(hero.value.abyssTier >= 2 || hero.value.dId == 'hard'){
      cursed[10].status = true;
      cursed[11].status = true;
      cursed[12].status = true;
    }

    if(hero.value.singularity >= 8){
      for(let i = 0; i < cursed.length;i++){
        cursed[i].tier[4].status = true;
      }
    }

    hero.value.curseMult = (hero.value.isSingularity || hero.value.infProgress? 1: 1 + 0.025 * Math.max(hero.value.infTier - 30, 0));
  }

  const mutationHandle = () => {
    hero.value.mutation[0].chance = Math.min(30 + 0.5 * radPerks[0].level + (ascenPerks[39].level? 10: 0), 100);
    hero.value.mutation[1].chance = Math.min(10 + 1 * radPerks[1].level + (ascenPerks[39].level? 10: 0), 100);
    hero.value.mutation[2].chance = Math.min(0 + 1.5 * radPerks[2].level + (ascenPerks[39].level? 10: 0), 100);
    hero.value.mutation[3].chance = Math.min(0 + 2 * radPerks[3].level + (ascenPerks[39].level? 10: 0), 100);

    if(radPerks[9].level) hero.value.soulsCap = 10000;
    radPerks[10].max = 100;

    radPerks[0].max = (hero.value.infTier >= 4? 80: 25);
    radPerks[1].max = (hero.value.infTier >= 4? 60: 25);
    radPerks[2].max = (hero.value.infTier >= 4? 40: 25);
    radPerks[3].max = (hero.value.infTier >= 4? 30: 25);

    radPerks[4].max = (hero.value.infTier >= 4? 40: 30);
    radPerks[5].max = (hero.value.infTier >= 4? 10: 5);
    if(radPerks[6].status) radPerks[6].max = (hero.value.infTier >= 4? 60: 30);
    radPerks[12].max = (hero.value.infTier >= 4? 200: 100);

    if(ascenPerks[51].level) hero.value.dangerStage = Math.max(hero.value.dangerStage, hero.value.stage);

    radPerks[10].max += (hero.value.infTier >= 4? 100: 0) + (ascenPerks[40].level? 100: 0) + (hero.value.mainInfTier >= 16? infBase(15, 20): 0) + 
    Math.floor(hero.value.rebirthPts >= 2e6? Math.log(hero.value.rebirthPts) ** 2: 0) + hero.value.dangerStage + 
    (dimensions.value[15].infTier > 10? Math.floor(1.45 ** (dimensions.value[15].infTier - 10)): 0) + (hero.value.spCount >= 38? hero.value.sp: 0);


    if(hero.value.dId == 'danger') radPerks[10].level = 300 + 30 * (dimensions.value[15].infTier - 10)

    if (radPerks[4].level >= 0) radPerks[4].description = `Increase mutagen gaining [${(1.025 ** radPerks[4].level).toFixed(2)}]`;
    if (radPerks[6].status) radPerks[6].description = `+[${radPerks[6].level}] Potential`;
    else radPerks[6].description = `REBUILD REBIRTH SYSTEM THAT ALLOWS YOU TO SPEND MUTAGEN TO UP YOUR POTENTIAL`;

    let epPenalty = (hero.value.abyssDStages >= 140 && hero.value.spCount >= 15? (100 - Math.sqrt(hero.value.abyssDStages - 139)) * 0.01: 1);
    enemy.value.danger = radPerks[10].level;
    enemy.value.enemyPower = ((1.017 - (hero.value.infTier >= 4? 0.005: 0) + (hero.value.dId == 'danger'? 0.0175: 0)) ** epPenalty) ** radPerks[10].level;
    enemy.value.spaceBossChance = (((1.09 + (hero.value.infTier >= 4? 0.01: 0)) ** radPerks[10].level - 1) / (10 ** Math.floor((hero.value.spCount) / 6))) * 
    (hero.value.rebirthTier >= 60? 1.02 ** hero.value.rebirthTier: 1);
    enemy.value.spaceBossChance = Math.min(enemy.value.spaceBossChance, 100);
    enemy.value.spaceBossChance = (hero.value.singularity >= 5? 100: enemy.value.spaceBossChance);

    enemy.value.dangerEnemyChance[0] = (1.03 ** (radPerks[10].level - 10));
    enemy.value.dangerEnemyChance[4] = (1.015 ** (radPerks[10].level - 20));
    enemy.value.dangerEnemyChance[5] = (1.02 ** (radPerks[10].level - 40));
    enemy.value.dangerEnemyChance[1] = (enemy.value.dangerEnemyLoot[0] < 60? (1.02 ** (radPerks[10].level - 100) - (0.11 * enemy.value.dangerEnemyLoot[0])): 0);
    enemy.value.dangerEnemyChance[2] = (enemy.value.dangerEnemyLoot[1] < 1000? (0.945 ** enemy.value.dangerEnemyLoot[1] * 1.0325 ** (radPerks[10].level - 150)): 0);
    enemy.value.dangerEnemyChance[3] = (enemy.value.dangerEnemyLoot[2] < 5? 1 * (1 / (10 * enemy.value.dangerEnemyLoot[2] + 1)) * (1.04 * radPerks[10].level - 200): 0);
    
    if(dimensions.value[15].infTier == dimensions.value[15].maxInfTier){
      //tree points
      enemy.value.dEnemyChance[0] = (enemy.value.dEnemyLoot[0] < 200? (0.9 ** enemy.value.dEnemyLoot[0] * 1.03 ** Math.max(radPerks[10].level - 399, 0)): 0);
      //sp
      enemy.value.dEnemyChance[1] = (enemy.value.dEnemyLoot[1] < 50? (0.6 ** enemy.value.dEnemyLoot[1] * 1.03 ** Math.max(radPerks[10].level - 549, 0)): 0);
      //ds
      enemy.value.dEnemyChance[2] = (enemy.value.dEnemyLoot[2] < 5? (0.2 ** enemy.value.dEnemyLoot[2] * 1.002 ** Math.max(radPerks[10].level - 599, 0)): 0);
      // E weakness in SH
      enemy.value.dEnemyChance[3] = (enemy.value.dEnemyLoot[3] < 90? (0.6 ** enemy.value.dEnemyLoot[3] * 1.03 ** Math.max(radPerks[10].level - 399, 0)): 0);
      //ip mult
      enemy.value.dEnemyChance[4] = (enemy.value.dEnemyLoot[4] < 25? (0.25 ** enemy.value.dEnemyLoot[4] * 1.025 ** Math.max(radPerks[10].level - 599, 0)): 0);
      // inf pen
      enemy.value.dEnemyChance[5] = (enemy.value.dEnemyLoot[5] < 5? (0.2 ** enemy.value.dEnemyLoot[5] * 1.0025 ** Math.max(radPerks[10].level - 699, 0)): 0);
    }

    if(hero.value.dId == 'soulD'){
      hero.value.soulD = true;
      radPerks[9].level = 1;
    }
  }

  const spaceHandle = () => {
    let baseCap = 0.1 + 0.0035 * hero.value.awakened['sword'];
    let baseBonus = 0.05 + 0.0015 * hero.value.awakened['sword'];
    hero.value.eqUpsMult['sword'].cap = (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap * 
      (baseCap * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['sword'].bonus = (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.multDmg * 
      (baseBonus * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['sword'].crit = (hero.value.spCount/6 >= 3? 5 + 5 * (baseCap * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+hero.value.freeEnchances)): 0);
    hero.value.eqUpsMult['sword'].critDmg = (hero.value.spCount/6 >= 3? 25 + 25 * (baseCap * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+hero.value.freeEnchances)): 0);  
    

    baseCap = 0.1 + 0.0035 * hero.value.awakened['armor']
    baseBonus = 0.05 + 0.0015 * hero.value.awakened['armor']
    hero.value.eqUpsMult['armor'].cap = (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap * 
      (baseCap * Math.min(hero.value.eqUps['armor'], hero.value.equipmentTiers['armor']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['armor'].bonus = (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp * 
      (baseBonus * Math.min(hero.value.eqUps['armor'], hero.value.equipmentTiers['armor']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['armor'].def = (hero.value.spCount/6 >= 6? 100 + 100 * (baseCap * Math.min(hero.value.eqUps['armor'], hero.value.equipmentTiers['armor']+hero.value.freeEnchances)): 0);
    hero.value.eqUpsMult['armor'].heal = (hero.value.spCount/6 >= 6? 10 + 10 * (baseCap * Math.min(hero.value.eqUps['armor'], hero.value.equipmentTiers['armor']+hero.value.freeEnchances)): 0);  


    baseCap = 0.1 + 0.0035 * hero.value.awakened['boots']
    baseBonus = 0.05 + 0.0015 * hero.value.awakened['boots']
    hero.value.eqUpsMult['boots'].cap = (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap * 
      (baseCap * Math.min(hero.value.eqUps['boots'], hero.value.equipmentTiers['boots']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['boots'].bonus = (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed * 
      (baseBonus * Math.min(hero.value.eqUps['boots'], hero.value.equipmentTiers['boots']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['boots'].stage = (hero.value.spCount/6 >= 7? 0.01 + 0.01 * Math.floor((Math.min(hero.value.eqUps['boots'], hero.value.equipmentTiers['boots']+hero.value.freeEnchances))/10): 0);
    hero.value.eqUpsMult['boots'].overkill = (hero.value.spCount/6 >= 7? 1 + Math.floor((1 + baseCap) * (Math.min(hero.value.eqUps['boots'], hero.value.equipmentTiers['boots']+hero.value.freeEnchances))/5): 0);  


    baseCap = 0.1 + 0.0035 * hero.value.awakened['ring']
    baseBonus = 0.05 + 0.0015 * hero.value.awakened['ring']
    hero.value.eqUpsMult['ring'].cap = (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap * 
      (baseCap * Math.min(hero.value.eqUps['ring'], hero.value.equipmentTiers['ring']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['ring'].bonus = (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult * 
      (baseBonus * Math.min(hero.value.eqUps['ring'], hero.value.equipmentTiers['ring']+hero.value.freeEnchances)));
    hero.value.eqUpsMult['ring'].level = (hero.value.spCount/6 >= 8? 1 / (1 + baseCap) ** (baseCap * Math.min(hero.value.eqUps['ring'], hero.value.equipmentTiers['ring']+hero.value.freeEnchances)): 1);
    hero.value.eqUpsMult['ring'].multLevel = (hero.value.spCount/6 >= 8? 0.01 * (Math.min(hero.value.eqUps['ring'], hero.value.equipmentTiers['ring']+hero.value.freeEnchances)): 0);  


    hero.value.eqUpsMult['spRing'].cap = (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap * (0.1 * hero.value.eqUps['spRing']));
    hero.value.eqUpsMult['spRing'].bonus = Math.floor((equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel * (0.05 * hero.value.eqUps['spRing'])));


    amulets[3].status = (hero.value.spCount >= 4 && hero.value.maxStage >= 20? true: false);
    amulets[3].suffix.status = (hero.value.spCount >= 13? true: false);
    amulets[3].prefix.status = (hero.value.spCount >= 19? true: false);


    if (hero.value.spCount/6 >= 2){
      hero.value.equipmentTiers['spRing'] = 1;
      hero.value.eqTierReq['spRing'] = 1;
    }

    if(hero.value.rebirthPts >= 1e5 && hero.value.abyssTier >= 3){
      for(let i = 0; i < cursed.length;i++){
        cursed[i].tier[3].status = true;
      }
    }

    if(hero.value.spCount >= 27){
      buffs.value[4].maxTier = 4;
    }
    if(hero.value.spCount >= 31){
      buffs.value[3].maxTier = 4;
    }

    hero.value.st = Math.floor(hero.value.spCount / 6) + enemy.value.dangerEnemyLoot[2];

    if(Math.floor(hero.value.spCount / 6) >= 5){
      hero.value.equipmentTiers['spRing'] = 1 + hero.value.st;
    }

    hero.value.baseSp = getSP(hero.value.spCount)
    hero.value.sp = hero.value.baseSp + enemy.value.dEnemyLoot[1] + (6 * (dimensions.value[23].infTier - 10));
    hero.value.spMaxCount = 24 + (hero.value.infTier >= 5? 6: 0) + (hero.value.singularity >= 5? 6: 0) + (ascenPerks[53].level? 6: 0) + 
    (dimensions.value[23].infTier == dimensions.value[23].maxInfTier? 6: 0);
  }

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
  }

  const starDustDrop = () => {
    hero.value.stardustInfo = 0;

    if(hero.value.spCount < 2)
      return 0;
    let stardust = 0;
    let st = 39 - (hero.value.spCount >= 8? 1: 0) - (hero.value.spCount >= 14? 2: 0) - (hero.value.spCount >= 20? 2: 0) - 
    (hero.value.spCount >= 32? 3: 0) - (hero.value.spCount >= 39? 3: 0) - (hero.value.spCount >= 44? 4: 0);
    if(hero.value.stage - st > 0){
      stardust = (((1.0525 ** (hero.value.stage - st)) * (1 + ascenPerks[34].level * 0.01) * 
      (hero.value.infTier >= 5? 2: 1) * (hero.value.spCount >= 15 && hero.value.abyssDStages >= 60? (1.015 ** Math.min(hero.value.abyssDStages - 59, 120)): 1) * 
      (hero.value.curset5? 2: 1) * (hero.value.spCount >= 45 && hero.value.activeFormation == 3? 2: 1) *
      (1 + perks.value[17].level*0.01) * ((hero.value.mainInfTier >= 18? infBase(1.0145) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 1))) - 1) /
      (!hero.value.infProgress? (1 + 0.2 * Math.max(hero.value.infTier - 20, 0)): 1);
      
    }
    enemy.value.averageLoot.stardust = 0;
    if(stardust > 0){
      addLog(`You gain ${formatNumber(stardust, true)} stardust`, "Stardust");
      hero.value.stardust += stardust;
      hero.value.stardustInfo = stardust;
      enemy.value.averageLoot.stardust = stardust;
    }
    
  }

  const afkKillsHandle = () => {
    if(hero.value.afkKills > 0){
      hero.value.afkSoulBoost = 1.05 ** Math.sqrt(hero.value.afkKills);
      if(hero.value.dId == 'damage')
        hero.value.dKills += hero.value.afkKills;
      if(perks.value[0].status)
        perks.value[0].kills += hero.value.afkKills * (overkillHandle() + 1);

      if(hero.value.isSingularity){
        if(hero.value.singularity >= 8) return;

        hero.value.kills += Math.floor((hero.value.afkKills) / (hero.value.singularity + 1));
        hero.value.afkKills = 0;
        
        hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
        hero.value.afkLocked = false;
        return;
      }

      if(hero.value.isLocked && hero.value.afkLocked){
        hero.value.afkKills = 0;
 
        hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
        afkMessages(0, 0, false);
        hero.value.afkLocked = false;
        return;
      }

      let currentStage = hero.value.stage;
      let currentZone = hero.value.zone;

      while(hero.value.afkKills > 0){
        if((hero.value.kills + hero.value.afkKills) - hero.value.killsPerZone > 0){
          hero.value.afkKills -= Math.floor(hero.value.killsPerZone) - hero.value.kills;
          hero.value.kills = 0;
          hero.value.zone++;
          refreshKillsPerZone();
        } else {
          refreshKillsPerZone();
          hero.value.kills += Math.floor(hero.value.afkKills);
          hero.value.afkKills = 0;
          
          hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
          afkMessages(currentZone, currentStage, true);
          return;
        }


        if(hero.value.afkKills - hero.value.killsPerZone > 0 && hero.value.zone >= 5 && hero.value.stage > 5 && hero.value.stage%5 == 4){
          if(hero.value.maxStage - 15 > hero.value.stage && !hero.value.isAbyss){
            hero.value.afkKills -= Math.floor(hero.value.killsPerZone);
            hero.value.zone++;
            refreshKillsPerZone();
          } else {
            refreshKillsPerZone();
            hero.value.kills = Math.floor(hero.value.killsPerZone) - 3;
            hero.value.afkKills = 0;
            if(hero.value.zone > 5) hero.value.zone = 5; 
            
            hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
            afkMessages(currentZone, currentStage, true);
            return;
          }
          
        }

        if(hero.value.zone > 5){
          hero.value.zone = 1;
          if(hero.value.isAbyss && hero.value.stage >= 100)
            hero.value.stage = Math.min(hero.value.stage + 1, 100);
          else hero.value.stage++;

          hero.value.stage = (hero.value.dId == 'next'? Math.min(hero.value.stage, 30): hero.value.stage);

          hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
          if (hero.value.stage > 10)
            ascensionShardsProgress(hero.value.stage);
        }
        if(hero.value.abyssTier >= 3 && hero.value.isAbyss) hero.value.abyssDStages = Math.max(hero.value.stage, hero.value.abyssDStages);
      }
    }
  }

  const afkMessages = (currentZone, currentStage, Locked) => {
    let totalExp = (avgLootPerMinute.value.exp * (hero.value.afkTime / 60) * 0.95) * (hero.value.afkTimeHandle > 0? 1: -1);
    let buffExp = (hero.value.stage >= 20? (avgLootPerMinute.value.buffexp * (hero.value.afkTime / 60) * 0.95) * (hero.value.afkTimeHandle > 0? 1: -1): 0);
    let mutagen = (hero.value.spCount >= 5? (avgLootPerMinute.value.mutagen * (hero.value.afkTime / 60) * 0.95) * (hero.value.afkTimeHandle > 0? 1: -1): 0);
    let stardust = (hero.value.spCount >= 1? (avgLootPerMinute.value.stardust * (hero.value.afkTime / 60) * 0.95) * (hero.value.afkTimeHandle > 0? 1: -1): 0);

    hero.value.afkMessage = `
    <span>Offline bonus for ${Math.floor(hero.value.afkTime / 3600)}h ${Math.floor(hero.value.afkTime/60%60)}m ${hero.value.afkTime%60}s (MAX - 8h) </span><br>
    <span>You gained ${formatNumber(totalExp)} EXP.</span>
    <span>You gained ${formatNumber(buffExp)} BUFF EXP.</span>
    <span>You gained ${formatNumber(stardust)} stardust.</span>
    <span>You gained ${formatNumber(mutagen)} mutagens.</span><br> 
    `
    if(hero.value.stage >= 15){
      hero.value.afkMessage += `<spa(>Soul Booster Chance equals to ${hero.value.afkSoulBoost.toFixed(2)}</span><br>`;
    }
    if(dimensions.value[1].infTier == dimensions.value[1].maxInfTier){
      let shards = Math.floor(hero.value.totalAscensionShards * 0.001 * hero.value.afkTime);  
      hero.value.ascensionShards += shards * hero.value.afkTimeHandle;
      hero.value.afkMessage += `<span>Ascension Shards: ${formatNumber(shards * hero.value.afkTimeHandle)}</span><br>`;
    }
    if(Locked)
      hero.value.afkMessage += `<span>You passed from ${currentStage} stage ${currentZone} zone -> ${hero.value.stage} stage ${hero.value.zone} zone</span><br>`;
    
    hero.value.stardust += stardust;
    hero.value.mutagen += mutagen;
    hero.value.dTimer += hero.value.afkTime;
    hero.value.exp += totalExp;
    if(hero.value.stage > 19){
      hero.value.cursedBonus = buffExp;
      expBuffGrant();
    }

    killHistory.forEach(k => {
      k.timestamp += hero.value.afkTime * 1000;
    });
    hero.value.afkTime = 0;
    localStorage.setItem('lastOnline', Date.now().toString());
  }

  const spaceAuto = () => {
    for(let it = 1; it <= 3; it++){
      let status = hero.value.spCount > 0 && hero.value.spCount%6 == 5? 2: 1;
      let enemyDps = (spEnemy[hero.value.spCount].stats.dmg - hero.value.def) * spEnemy[hero.value.spCount].stats.AS * it * 1.25 * status;
      let heroDps = (hero.value.attack - spEnemy[hero.value.spCount].stats.def) * hero.value.attacksPerSecond * it;
      let hpCondition = (hero.value.dId == 'survival'? true: hero.value.maxHp > enemyDps);
  
      if(heroDps >= spEnemy[hero.value.spCount].stats.hp * 1.5 * status && hpCondition && hero.value.spCount < hero.value.spMaxCount){
        hero.value.spCount++;
      }
    }
  }

  const treeAuto = () => {
    if(!hero.value.treeAuto)
      return;

    let t = hero.value.treeTier;
    const MULT = (dimensions.value[6].infTier == dimensions.value[6].maxInfTier? 0.9: 1);
    for (let perk of perks.value) {
      if (hero.value.perkPoints <= 0) break;
      if ((perk.infStatus && hero.value.perkPoints <= perk.baseCost) || perk.status || perk.block) continue;
      if (perk.level < perk.maxLevel[t] || perk.infStatus) {
        perk.level++
        hero.value.perkPoints -= (perk.infStatus? perk.baseCost * MULT: 1);
      }
    }
  }


  const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }

  const infHandle = () => {
    

    if(hero.value.mainInfTier > 0 || hero.value.level >= 700){
      for(let idx = 0; idx < infGoals.value.length; idx++){
        if(infGoals.value[idx].tier < infGoals.value[idx].maxTier && infGoalsReq(idx)){
          infGoals.value[idx].tier++;
        }
      }

      let ip = 0
      for(let idx = 0; idx < infGoals.value.length; idx++){
        for(let idy = 0; idy < infGoals.value[idx].tier; idy++){
          ip += infGoals.value[idx].reward;
        }
      }
      hero.value.infPointsGoals = ip;
    }
  }

  const infPtsHandle = () => {
    infTiersReq();
    infHandle();
    let count = Object.values(hero.value.secrets).filter(v => v).length * 20;

    hero.value.infPointsMult = 1 + (0.05 * hero.value.singularity) + (hero.value.rebirthPts >= 5e6? Math.log(hero.value.rebirthPts)*0.015: 0) +
    (enemy.value.dEnemyLoot[4]*0.01) +  (dimensions.value[22].infTier == dimensions.value[22].maxInfTier?hero.value.mainInfTier * 0.01: 0);

    hero.value.infPoints = (count + hero.value.infPointsGoals + enemy.value.dangerEnemyLoot[1]) * hero.value.infPointsMult;
  }
 
  const infGoalsReq = (idx) => {
    if(!infGoals.value[idx].status)
      return;

    const conditions = [
      () => hero.value.mainInfTier > infGoals.value[0].tier,
      () => hero.value.abyssDStages >= 20 + 15 * infGoals.value[1].tier,
      () => hero.value.attack >= 2e6 * (infGoals.value[2].tier + 1),
      () => hero.value.souls >= 100 + 20 * infGoals.value[3].tier,
      () => hero.value.eqUps['spRing'] >= 50 + 25 * infGoals.value[4].tier,
      () => hero.value.equipmentTiers['sword'] >= 11 + 3 * infGoals.value[5].tier,
      () => hero.value.level >= 750 + 50 * infGoals.value[6].tier,
      () => hero.value.trueLevel >= 1500 + 150 * infGoals.value[7].tier,
      () => hero.value.corruption >= 0.6 + 0.1 * infGoals.value[8].tier,
      () => hero.value.potential >= 200 + 50 * infGoals.value[9].tier,
      () => hero.value.abyssDStages >= 120 + 20 * infGoals.value[10].tier,
      () => hero.value.attack >= 1e9 * (infGoals.value[11].tier + 1),
      () => hero.value.souls >= 300 + 50 * infGoals.value[12].tier,
      () => hero.value.eqUps['spRing'] >= 200 + 25 * infGoals.value[13].tier,
      () => hero.value.equipmentTiers['sword'] >= 24 + 3 * infGoals.value[14].tier,
      () => hero.value.level >= 1000 + 100 * infGoals.value[15].tier,
      () => hero.value.trueLevel >= 5000 + 1000 * infGoals.value[16].tier,
      () => hero.value.singularity > infGoals.value[17].tier,
      () => enemy.value.dangerEnemyLoot[1] >= 100 + 100 * infGoals.value[18].tier,
      () => hero.value.maxHp >= 2e5 * (infGoals.value[19].tier + 1),
      () => hero.value.abyssDStages >= 220 + 20 * infGoals.value[20].tier,
      () => hero.value.attack >= 1e12 * (infGoals.value[21].tier + 1),
      () => hero.value.souls >= 600 + 100 * infGoals.value[22].tier,
      () => hero.value.eqUps['spRing'] >= 350 + 50 * infGoals.value[23].tier,
      () => hero.value.equipmentTiers['sword'] >= 37 + 3 * infGoals.value[24].tier,
      () => hero.value.level >= 2200 + 200 * infGoals.value[25].tier,
      () => hero.value.trueLevel >= 3e4 + 1e4 * infGoals.value[26].tier,
      () => dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length > infGoals.value[27].tier,
      () => hero.value.def >= 5e4 + 1e4 * infGoals.value[28].tier,
      () => hero.value.mainInfTier > 15 + infGoals.value[29].tier,
      () => dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length > 10 + 2 * infGoals.value[30].tier,
      () => hero.value.rebirthPts >= 2e5 + 2e5 * infGoals.value[31].tier,
      () => hero.value.infPoints >= 3000 + 2000 * infGoals.value[32].tier,
      () => hero.value.exp >= 1e9 * 1e6 ** infGoals.value[33].tier,
      () => hero.value.dTimeReward <= 480 / (1 * (infGoals.value[34].tier + 1)),
    ];

    if (conditions[idx]) return conditions[idx]();
    return false;
  }

  const infTiersReq = () => {
    for(let goal of infGoals.value){
      if(goal?.nodeId){
        if(infGoals.value[goal.nodeId - 1].tier == infGoals.value[goal.nodeId - 1].maxTier)
          goal.status = true;
      }
      if(goal.id == 19){
        if(hero.value.mainInfTier >= 4){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 20){
        if(hero.value.mainInfTier >= 13){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 28){
        if(hero.value.abyssDStages >= 80){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 29){
        if(hero.value.mainInfTier >= 15){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 30){
        if(hero.value.mainInfTier >= 15){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 31){
        if(dimensions.value[9].infTier == dimensions.value[9].maxInfTier){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 34){
        if(hero.value.unlimitLevel >= 2000){
          infGoals.value[goal.id - 1].status = true;
        }
      }
      if(goal.id == 35){
        if(hero.value.dTimeReward > 0){
          infGoals.value[goal.id - 1].status = true;
        }
      }
    }
  }

  const infoHandle = () => {
    if(hero.value.stage >= 2)
      hero.value.infoActive.equipment = true;
    if(hero.value.stage >= 5)
      hero.value.infoActive.buffs = true;
    if(hero.value.stage >= 10)
      hero.value.infoActive.ascension = true;
    if(hero.value.stage >= 15)
      hero.value.infoActive.souls = true;
    if(hero.value.stage >= 20)
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
    if(hero.value.mainInfTier >= 7)
      hero.value.infoActive.singularity = true;
    if(hero.value.abyssDStages >= 80)
      hero.value.infoActive.dimension = true;

    if(hero.value.stage >= 40)
      hero.value.ascensionAutoUnlock = true;
  }

  const infBase = (v, b = 0) => {
    let bTotal = (hero.value.mainInfTier >= 25? 0.0035: 0);
    let dReward = (b == 1 && dimensions.value[20].infTier == dimensions.value[20].maxInfTier? 0.005: 0)

    if(b == 18) return Math.floor(hero.value.infPoints / (v - (bTotal > 0? 20: 0)))
    if(b == 20) return Math.floor(hero.value.infPoints / (v - (bTotal > 0? 1: 0)))
    if(b == 22) return Math.floor(hero.value.infPoints / (v - (bTotal > 0? 25: 0)))

    return v + dReward + bTotal;
  }

  const singularityHandle = () => {
    if(hero.value.isSingularity && hero.value.kills >= 10000 && hero.value.singularityKills < 1e4){
      hero.value.isSingularity = false;
      hero.value.singularity = Math.min(hero.value.singularity + 1, 8);
      hero.value.kills = 0;
      hero.value.killsPerZone = 5;
      createEnemy();

      if(hero.value.singularity >= 2) hero.value.treeAuto = true;
      if(hero.value.singularity >= 3){
        ascenPerks.forEach((perk, index) => {
          perk.level = hero.value.singularityAscension[index] || 0;
        });
        
      }
      if(hero.value.singularity >= 4) {
        hero.value.sp = hero.value.singularitySpace.sp;
        hero.value.singularitySpace.sp = 0
        hero.value.st = hero.value.singularitySpace.st;
        hero.value.singularitySpace.st = 0;
        hero.value.spCount = hero.value.singularitySpace.spCount;
        hero.value.singularitySpace.spCount = 0;
        hero.value.isSpaceAuto = true;
      }
      if(hero.value.singularity >= 6) {
        hero.value.eqUps['spRing'] = hero.value.singularityRingUp;
        hero.value.singularityRingUp = 0;
      }
      if(hero.value.singularity >= 7) {
        hero.value.rebirthPts = 1e5;
        hero.value.rebirthTier = hero.value.singularityRebirthTier;
        hero.value.singularityRebirthTier = 0;
      }
      if(hero.value.singularity >= 8 && hero.value.singularityKills > 0) {
        hero.value.singularityKills = 1e4;
      }
    }
  }

  const dHandle = () => {
    let d = {};
    for(let ds of dimensions.value){
      if(ds.id == hero.value.dId){
        d = ds;
        break;
      }
    }
    let notAllowdId = ['main', 'unlimitted', 'time', 'survival-2', 'abyss-d']

    if(hero.value.dId == 'eternity') return;

    if(hero.value.dId == 'time' && hero.value.level >= 700){
      hero.value.dTimeReward = (hero.value.dTimeReward == 0? hero.value.dTimer: hero.value.dTimeReward)
      hero.value.dTimeReward = Math.min(hero.value.dTimeReward, hero.value.dTimer)
    }

    if(!notAllowdId.includes(hero.value.dId) && d.infTier < d.maxInfTier && hero.value.level >= 700){
      if(hero.value.dId == 'hard' && hero.value.stage < 100 + 5 * (d.infTier - 15)) return;

      hero.value.infTier++;
      d.infTier++;
      dInfHandler()
      hero.value.eLevel = Math.floor(hero.value.eLevel ** (1 - 0.02 * hero.value.infTier) + (ascenPerks[42].level? 0.02: 0));
      hero.value.perkPoints = hero.value.eLevel * 2;
      hero.value.treeTier = 0;
      
      performInf();
    }
  }

  const dInfHandler = () => {
    if(hero.value.dId == 'hard' && hero.value.level >= 1e10){
      dimensions.value[13].infTier = 10;
      dimensions.value[13].infTier = 11;
    }
  }

  const performInf = () => {
    hero.value.stage = 1 + (hero.value.dId == 'overstage'? 100 + 5 * (dimensions.value[19].infTier - 20): 0);
    hero.value.zone = 1;
    hero.value.kills = 0;
    hero.value.killsPerZone = 5;
    hero.value.maxStage = 1;

    hero.value.eqDrop['sword'] = 0;
    hero.value.eqDrop['armor'] = 0;
    hero.value.eqDrop['boots'] = 0;
    hero.value.eqDrop['ring'] = 0;

    hero.value.equipmentTiers['spRing'] = 0;
    hero.value.eqTierReq['spRing'] = 0;

    hero.value.eqUps['sword'] = 0;
    hero.value.eqUps['armor'] = 0;
    hero.value.eqUps['boots'] = 0;
    hero.value.eqUps['ring'] = 0;
    hero.value.eqUps['spRing'] = 0;

    hero.value.formationTypes[0].status = false;
    hero.value.formationTypes[1].status = false;
    hero.value.formationTypes[2].status = false;
    hero.value.formationTypes[3].status = false;
    hero.value.activeFormation = null;

    hero.value.totalRebirthPts = 0;
    hero.value.rebirthPts = (hero.value.singularity < 8? 0: 1e5 + Math.log(hero.value.singularityKills + 3) ** 7.26);
    hero.value.rebirthTier = 0;

    hero.value.activeCurse = [];
    hero.value.activeCuseTier = [];
    hero.value.souls = 0;
    hero.value.soulsMax = 0;
    hero.value.soulsCap = 40;
    hero.value.soulTier = 0;
    hero.value.ascendShardPerform = 0;
    hero.value.ascensionShards **= 0.75;
    hero.value.totalAscensionShards = 0;
    hero.value.isAbyss = false;

    hero.value.activeBuffs = [];
    hero.value.spActiveBuffs = [];
    
    hero.value.spCount = 0;
    hero.value.sp = 0;
    hero.value.st = 0;
    hero.value.isSpaceAuto = false;

    for(let sp of spEnemy){
      if(sp.id%6 == 0){
        sp.status = false;
      }
    }    
    
    hero.value.spaceFight = false;
    hero.value.isSpaceBuff = false;
    enemy.value.isSpaceFight = 0;

    if(hero.value.singularity < 6){
      for(let buff of buffs.value){
          if(buff.id == 6) continue;
          buff.tier = 1;
          buff.maxTier = 3;
        }
    }
    
    for (let perk of perks.value){
      perk.level = 0;
      if(perk.status !== 'undefined')
        perk.status = false;
      if(perk.infStatus !== 'undefined')
        perk.infStatus = false;
    }

    for(let idx in radPerks){
      radPerks[idx].level = 0;
    }

    if(hero.value.singularity < 4){
      for(let perk of ascension){
        if(perk.tier != 6 && perk.tier != 7 && perk.tier != 8)
          perk.level = 0;
      }
    }

    radPerks[6].status = false;
    radPerks[6].baseCost = 2500;
    radPerks[6].description = 'REBUILD REBIRTH SYSTEM THAT ALLOWS YOU TO SPEND MUTAGEN TO UP YOUR POTENTIAL';
    radPerks[6].max = 1;
  
    radPerks[7].perkStatus = false;
    radPerks[10].status = false;
    radPerks[10].max = 1;

    hero.value.soulD = false;
    enemy.value.spawnType = 'none';
    enemy.value.ascensionSoul.active = false;
    enemy.value.soulBuff.active = false;
    enemy.value.boss.isBoss = false;
    hero.value.infProgress = false;
    hero.value.isSpaceAuto = false;
    hero.value.windowUpdate = true;  
    perks.value[0].kills = 0;
    hero.value.shardsMult = 0;
    hero.value.shardsPerformMult = 0;
    hero.value.dKills = 0;
    killHistory.length = 0;
  }

  const performAscension = () => {
    if(hero.value.isAscend || auto.value.ascension.enabled){
      hero.value.ascensionShards += hero.value.ascendShardPerform;
      if(dimensions.value[9].infTier == dimensions.value[9].maxInfTier && hero.value.stage >= hero.value.dsStage + 10 * hero.value.ds && hero.value.dId == 'main' ){
        hero.value.ds++;
      }
      perform();
      
      hero.value.isAscend = false;
      auto.value.ascension.enabled = false;
    }
  };

  const performRebirth = () => {
    if(hero.value.isRebirth || auto.value.rebirth.enabled){
      hero.value.rebirthPts += hero.value.totalRebirthPts;

      if(hero.value.infTier < 3){
        if(hero.value.level >= 100 + 10 * hero.value.rebirthTier && hero.value.rebirthTier < 20){
            hero.value.rebirthTier++;
        }
      } else if((hero.value.level - 90) / 10 > hero.value.rebirthTier){
        hero.value.rebirthTier += Math.floor((hero.value.level - (90 + 10 * hero.value.rebirthTier)) / 10);
      }
  
  
      perform();

      hero.value.isRebirth = false;
      auto.value.rebirth.enabled = false;
      hero.value.souls = 0;
    }
  }

  const perform = () => {
    hero.value.eLevel = 1;
    hero.value.exp = 0;
    hero.value.stage = 1 + (hero.value.dId == 'overstage'? 100 + 5 * (dimensions.value[19].infTier - 20): 0);
    hero.value.zone = 1;
    hero.value.kills = 0;
    hero.value.killsPerZone = 5;
    hero.value.nextLevelExp = 100;
    hero.value.activeCurse = [];
    hero.value.totalAscensionShards = 0;
    hero.value.ascendShardPerform = 0;
    hero.value.totalRebirthPts = 0;
  
    enemy.value.soulBuff.chance = 0;
  
    for (let perk of perks.value){
      if(perk.name == "Invisible" || perk.name == "Traveller")
        perk.level = perk.level;
      else
        perk.level = 0;
    }
    hero.value.treeTier = 0;
    hero.value.perkPoints = 0 + hero.value.freeTreePoints;
  
    hero.value.eqDrop['sword'] = 0;
    hero.value.eqDrop['armor'] = 0;
    hero.value.eqDrop['boots'] = 0;
    hero.value.eqDrop['ring'] = 0;
  
    hero.value.afkSoulBoost = 1;
    hero.value.soulD = false;
    enemy.value.weakStack = 0;
    hero.value.shardsMult = 0;
    hero.value.shardsPerformMult = 0;
    hero.value.travellPenalty = 1;
    hero.value.isTravell = false;
    hero.value.dKills = 0;

    if(hero.value.gcnpSetting){
      hero.value.isLocked = true;
      hero.value.isStage = false;
    } else {
      hero.value.isLocked = false;
      hero.value.isStage = true;
    }
  }

  const afkTimer = (interval) => {
    if(dimensions.value[7].infTier == dimensions.value[7].maxInfTier)
      hero.value.afkTimer = Math.min(hero.value.afkTimer + (interval / 1000) , hero.value.afkMaxTimer);
  }

  const timeCombatHandle = () => {
    if(hero.value.dTimeReward > 0){
      const time = hero.value.dTimeReward;
      const speedMult = time <= 60 ? 2 : 1;

      const afkPercent = Math.min((15 / Math.log(Math.max(time, 3))) * speedMult, 10);
      const afkDuration = Math.min((7.5 / Math.sqrt(Math.max(time, 3))) * speedMult, 5);

      hero.value.timeKiller += afkPercent;


      if(hero.value.timeKiller >= 100) {
        hero.value.afkTimer = Math.min(hero.value.afkTimer + afkDuration, hero.value.afkMaxTimer);
        hero.value.timeKiller = 0;
      }
    }
  }

  const travellCooldown = (interval) => {
    if(dimensions.value[3].infTier == dimensions.value[3].maxInfTier)
      hero.value.travellPenalty = Math.max(hero.value.travellPenalty - (interval / 1000) * 0.01, 1);
  }

  const ascensionAutoBuyer = () => {
    if (hero.value.dId != 'ascension' && !hero.value.isSingularity && hero.value.ascensionAuto && hero.value.stage >= 10) {
      for (const perk of ascenPerks) {
        if (perk.tier === 7 || perk.level >= perk.max) continue;
    
        const cost = getAscensionCost(perk);
    
        const canUpgrade = (() => {
          if (perk.tier === 6)
            return hero.value.mainInfTier >= 2 && hero.value.ascensionShards > cost && perk.infStatus === true;
    
          if (perk.tier === 5)
            return radPerks[8].level && hero.value.ascensionShards > cost;
    
          if (perk.tier === 3)
            return hero.value.maxStage >= 40 && hero.value.ascensionShards > cost;
    
          if (perk.tier === 2)
            return hero.value.maxStage >= 25 && hero.value.ascensionShards > cost;
    
          if (perk.tier === 1)
            return hero.value.maxStage >= 10 && hero.value.ascensionShards > cost;
    
          return false;
        })();
    
        if (canUpgrade) {
          perk.level++;
          hero.value.ascensionShards -= cost;
        }
      }
    }
  }

  function getAscensionCost(perk) {
    if (perk.tier === 6) {
      let iPenalty = 1 - 0.01 * dimensions.value[1].infTier;
      let aPenalty = 1 - 0.0075 * Math.max(dimensions.value[17].infTier - 15, 0);
      let sPenalty = (hero.value.rebirthPts >= 1e6? 1 - 0.01 * Math.log(hero.value.rebirthPts + 3): 1);
      let total = iPenalty * sPenalty * aPenalty;
      return Math.floor((perk.baseCost ** perk.level) ** total);
    }
    return perk.baseCost + perk.level * perk.costPerLevel;
  }

  function infPenaltyScale(x, max) {
    const maxX = max;
    const power = 3.25; 
    const clampedX = Math.min(Math.max(x, 0), maxX); 
    return Math.pow(clampedX / maxX, power);
  }

  const test = () => {
    //dimensions.value[9].infTier = 7;
   //hero.value.infPoints = 7000;
    //hero.value.infPointsGoals = 3000;
    //dimensions.value[17].infTier = 30;
    //dimensions.value[1].maxInfTier = 15;
    //dimensions.value[22].infTier = 35;
    //dimensions.value[14].infTier = 20;
    //dimensions.value[20].infTier = 22;
    //dimensions.value[11].infTier = 15;
    //dimensions.value[9].infTier = 7;
    //dimensions.value[23].maxInfTier = 20;
    //hero.value.ds = 30;
    //hero.value.singularity = 0;
    //hero.value.mainInfTier = 29;
    //hero.value.infTier = 19; 
    //dimensions.value[15].infTier = 20;
    //hero.value.infPoints = 3500;
    //hero.value.kills = 1750;
   //hero.value.ascensionShards = 1e13;
    //hero.value.singularity = 8;
    //hero.value.dTimeReward = 1213;
    //radPerks[10].level = 900;
    //hero.value.dId = 'main';
    //hero.value.infTier = 2;
    //hero.value.singularity = 8;
    //hero.value.kills = 7000;
    //hero.value.rebirthPts = 1e7;
    //hero.value.singularityKills = 4000;
    //hero.value.stage = 169;
    //hero.value.spCount = 0;
    //hero.value.mainInfTier = 11;
    //hero.value.infTier = 20;
    //enemy.value.dangerEnemyLoot[1] = 500;
    //hero.value.singularity = 5; 
    //ascenPerks[31].level = 20;
    //hero.value.mutagen = 1e5;
    //hero.value.kills = 9990;
    //hero.value.stage = 41;
    //hero.value.souls = 240;
    //hero.value.soulsMax = 240;
    //hero.value.soulsCap = 40;
    //hero.value.abyssTier = 3;
    //hero.value.rebirthTier = 90;
    //hero.value.ascensionShards = 1e12;
    //hero.value.mainInfTier = 10;
    //hero.value.awakened['sword'] = 0;
   //hero.value.ascensionShards = 0;
    //hero.value.eLevel = 700;
    //hero.value.afkTimer = 7200;
    //hero.value.afkMaxTimer = 14400;
    //dimensions.value[19].infTier = 20;
    //dimensions.value[13].maxInfTier = 25;
    //hero.value.infTier = 22;
    //dimensions.value[9].infTier = 7;
    //hero.value.survivalStage = 150; 
    //hero.value.infTier = 27;
    //ascenPerks[55].level = 0;
    //ascenPerks[56].level = 0;
    //hero.value.abyssDStages = 170;
    //hero.value.mainInfTier = 35;
    //hero.value.kills = 9500;
   //s hero.value.singularity = 4;
   //hero.value.eqUps['spRing'] = 50;
     //hero.value.stage = 12;
     hero.value.singularityKills = 10000;
     //hero.value.rebirthPts = 4e4;
     //hero.value.singularity = 7;
    //hero.value.stardust = 1e6;
    hero.value.mainInfTier = 17
    dimensions.value[15].infTier = 25;
    //hero.value.corruption = 0.1;
    hero.value.abyssDStages = 170;
    
  }

  createEnemy();
  return {
    heroAttackBarProgress,
    enemyAttackBarProgress
  };
}
