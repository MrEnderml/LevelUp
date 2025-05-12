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

export function useBattle(hero, enemy, buffs) {
  const heroAttackBarProgress = ref(0);
  const enemyAttackBarProgress = ref(0);

  addLog("Hey. Have a nice day!!!", "All");

  const grantExp = () => {
    var exp = expCount() * (1 + (perks.value[3].value * perks.value[3].level * 0.01)) *
    (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult + hero.value.eqUpsMult['ring'].bonus) *
    (1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level) *
    (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 3: 1) *
    (enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.drop: 1) * (1 + Math.min(hero.value.souls, 60 + (hero.value.infTier >= 6? 20: 0)) * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))) *
    (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? overkillHandle(): 1) *
    (1 + hero.value.cursedBonusExp) * (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
    (hero.value.rebirthPts >= 5? 2: 1) * (hero.value.sp >= 11? Math.min(1.025 ** hero.value.sp, 8): 1) *
    ((enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1)) *
    (enemy.value.rebirthEnemy["drop"]) * 
    (hero.value.activeFormation == 3? 2: 1) * 
    (1 + ascenPerks[34].level * 0.01) * 
    (hero.value.infTier >= 1 || hero.value.level >= 700? (1.1 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    exp = (!hero.value.infProgress? exp ** (1 - 0.02 * hero.value.infTier): exp);

    addLog(`You killed ${enemy.value.name} and gained ${formatNumber(exp)} exp`, "EXP");
    if(hero.value.stage <= hero.value.maxStage * hero.value.lacrimose && hero.value.isStage)
      hero.value.exp += exp * (25 + hero.value.stage);
    else 
      hero.value.exp += exp;

    checkLevelUp();


  };

  const checkLevelUp = () => {
    if (hero.value.exp >= hero.value.nextLevelExp && hero.value.eLevel < hero.value.maxLevel) {
      hero.value.exp -= hero.value.nextLevelExp;
      hero.value.eLevel++;
      hero.value.perkPoints += (hero.value.infTier >= 1? 2: 1);
      hero.value.nextLevelExp = nextLevel(hero.value.eLevel);
    }
    let power = (hero.value.soulsMax >= 40? 0.1: 0) + (perks.value[3].status? 0.1: 0) + (hero.value.rebirthPts >= 70000? 0.1: 0);
    hero.value.eLevel += (hero.value.maxLevel * power > hero.value.eLevel? 1: 0);

    rebirthPtsHandle();
  };

  const nextLevel = (level) => {
    let rScale = (hero.value.rebirthPts >= 1?0.145:0) + (hero.value.rebirthPts >= 750?0.145:0) +(hero.value.rebirthPts >= 12500?0.145:0) +(hero.value.rebirthPts >= 90000?0.145:0);
    
    return Math.max(100, Math.floor(((level+9)**2)**(1 + level/700)) * (Math.log(level+2)**((0.6-rScale) * (hero.value.eLevel >= 100? 4: 1))) * 
    (hero.value.isAbyss? 1.0155 ** level: 1)) * (hero.value.sp >= 24 && hero.value.abyssDStages >= 30? Math.max(2 - (1.015 ** (hero.value.abyssDStages - 29)), 0.02): 1) * 
    (hero.value.infTier >= 7? (1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1) * 
    (ascenPerks[36].level? 1.2 / Math.log(Math.sqrt(hero.value.rebirthPts) + 2): 1);
  }

  let intervalId = null;

  const startBattleLoop = () => {
    const interval = 50;
    intervalId = setInterval(() => {
      afkKillsHandle();

      if(hero.value.perform){
        hero.value.perform = false;
        enemy.value.soulBuff.active = false;
        enemy.value.boss.isBoss = false;
        refreshKillsPerZone();
        createEnemy();  
      }
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
      //test();

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

        hero.value.hp = hero.value.maxHp;
        stationReset();
        createSpaceCreature();
      }

      if(hero.value.isSpaceAuto)
        spaceAuto();


      if(hero.value.activeBuffs.includes(8)){
        if(buffs.value[8].tier == 1) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 500); 
        if(buffs.value[8].tier == 2) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 750); 
        if(buffs.value[8].tier == 3) buffs.value[8].time = Math.min(buffs.value[8].time + (interval / 1000), 1000); 
      }
      else 
        buffs.value[8].time = 0;
      

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
        if(hero.value.activeBuffs.includes(5) && buffs.value[5].stuck < 0)
          fastSlashBuff();  
        
        selfDestructionCurse();

        firstStrikeBuff();
        comboStuckBuff();
        sniperBuff();
        
        let totalDmg = (hero.value.attack * acrobaticCurse() * cursedShieldCurse()) - enemy.value.def;
        enemy.value.hp = Math.max(0, enemy.value.hp - Math.max(Math.max(totalDmg, 0), 0));
        heroAttackBarProgress.value = heroAttackBarProgress.value - 1;
        buffs.value[1].usedSkill = false;

        if(totalDmg > 0 && hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 4){
          hero.value.hp = Math.min(hero.value.hp + (hero.value.maxHp * 0.02 + hero.value.stage), hero.value.maxHp);
        }


        if (enemy.value.hp === 0) {
          if(enemy.value.isSpaceFight == 2){
              enemy.value.isSpaceFight = 0;
              hero.value.activeCurse = [];
              hero.value.spCount++;
              if(hero.value.spCount%6 == 0)
                hero.value.st++;
              else 
                hero.value.sp += (Math.floor(hero.value.spCount/6) + 1);

              let temp = hero.value.activeBuffs;
              hero.value.activeBuffs = hero.value.spActiveBuffs;
              hero.value.spActiveBuffs = temp;
          }

          //soul
          if(enemy.value.soulBuff.active){
            hero.value.souls = Math.min(hero.value.souls + 1, hero.value.soulsCap);
            hero.value.afkSoulBoost = 1;
            if(hero.value.souls > hero.value.soulsMax && hero.value.souls < 40){
              ascensionShardsProgress(hero.value.stage);
            }
            hero.value.soulsMax = Math.max(hero.value.souls, hero.value.soulsMax);
          }
          if(enemy.value.rebirthSoul){
            rebirthPtsHandle();
            enemy.value.rebirthSoul = false;
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

          enemy.value.soulBuff.active = false;
          weaponDrop();
         

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
          if(enemy.value.danger > 0 && hero.value.spCount%6 == 5){
            let ch = (Math.random() * 100 + enemy.value.spaceBossChance >= 100? true: false);
            if(ch)
              spEnemy[hero.value.spCount].status = ch;
          }
          
          handleEnemyDefeat();
          createEnemy();

          stationReset();  
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
          hero.value.resetKilledTime = 15;
          if(enemy.value.isSpaceFight == 2){
            enemy.value.isSpaceFight = 0;
            stationReset();

            let temp = hero.value.activeBuffs;
            hero.value.activeBuffs = hero.value.spActiveBuffs;
            hero.value.spActiveBuffs = temp;

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
        let mult = 0.0125;
        mult = (perks.value[11].value * perks.value[11].level == 1? 0.0225: 0.0125);
        mult = (perks.value[11].value * perks.value[11].level == 2? 0.0325: 0.0125);
        mult = (perks.value[11].value * perks.value[11].level == 3? 0.05: 0.0125);
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
          hero.value.hp += ((1 - (hero.value.hp/hero.value.maxHp)/10) * hero.value.maxHp * 0.05) * (curse? cursed[11].mult: 1);
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
        hero.value.hp += hero.value.maxHp * 0.0005 * Math.floor(Math.min(perks.value[1].buff, 10)) * (curse? cursed[11].mult: 1);
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
      (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? overkillHandle(): 1) * 
      (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
      (enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1) *
      (enemy.value.ascensionSoul.active || enemy.value.rebirthSoul? enemy.value.ascensionSoul.stats: 1) *
      (enemy.value.rebirthEnemy["drop"]) *
      (hero.value.activeFormation == 3? 2: 1) *
      (1 + (hero.value.sp >= 13? 0.1 * hero.value.sp: 1)) *
      (1 + ascenPerks[34].level * 0.01) * 
      (hero.value.rebirthTier >= 50? 1.03 ** hero.value.rebirthTier: 1) * 
      (hero.value.infTier >= 1? (1.08 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

      hero.value.dropChance['sword'] = 20 * (0.2 ** (hero.value.equipmentTiers['sword'] - ascenPerks[10].level - ((hero.value.spCount / 6) >= 1? Math.floor(hero.value.spCount / 6): 0)))
       * Math.log(hero.value.stage + 1) ** 1.1 * totalDrop;
      hero.value.dropChance['armor'] = 20 * (0.185 ** (hero.value.equipmentTiers['armor'] - ascenPerks[11].level )) * Math.log(hero.value.stage + 1) ** 1.13 *
      totalDrop;
      hero.value.dropChance['boots'] = 15 * (0.17 ** (hero.value.equipmentTiers['boots'] - ascenPerks[12].level )) * Math.log(hero.value.stage + 1) ** 1.16 * 
      totalDrop;
      hero.value.dropChance['ring'] = 8 * (0.15 ** (hero.value.equipmentTiers['ring'] - ascenPerks[13].level )) * Math.log(hero.value.stage + 1) ** 1.2 * 
      totalDrop;
      

      if (Math.random() * 100 + hero.value.dropChance['sword'] >= 100 &&
          (hero.value.equipmentTiers['sword'] < hero.value.eqTierReq['sword'] || Math.floor(hero.value.spCount/6) >= 4)){
            hero.value.equipmentTiers['sword']++;
            addLog(`You dropped the ${ equipment[0].tiers[hero.value.equipmentTiers['sword']].name } T[${ hero.value.equipmentTiers['sword'] }]`, "Weapon")
      }

      if (Math.random() * 100 + hero.value.dropChance['armor'] >= 100 &&
          hero.value.equipmentTiers['armor'] < hero.value.eqTierReq['armor']){
            hero.value.equipmentTiers['armor']++;
            addLog(`You dropped the ${ equipment[1].tiers[hero.value.equipmentTiers['armor']].name } T[${ hero.value.equipmentTiers['armor'] }]`, "Weapon")
      }

      if (Math.random() * 100 + hero.value.dropChance['boots'] >= 100 &&
          hero.value.equipmentTiers['boots'] < hero.value.eqTierReq['boots']){
            hero.value.equipmentTiers['boots']++;
            addLog(`You dropped the ${ equipment[2].tiers[hero.value.equipmentTiers['boots']].name } T[${ hero.value.equipmentTiers['boots'] }]`, "Weapon")
      }

      if (Math.random() * 100 + hero.value.dropChance['ring'] >= 100 &&
          hero.value.equipmentTiers['ring'] < hero.value.eqTierReq['ring']){
            hero.value.equipmentTiers['ring']++;
            addLog(`You dropped the ${ equipment[3].tiers[hero.value.equipmentTiers['ring']].name } T[${ hero.value.equipmentTiers['ring'] }]`, "Weapon")
      }


    }
  }
  const curseBonus = () => {
    let bonus = 0;
    for(let id of hero.value.activeCurse){
      bonus += cursed[id].tier[hero.value.activeCurseTier[id]].bonus;
    }
    bonus = bonus * (hero.value.sp >= 24 && hero.value.abyssDStages >= 50? 1.04 ** (hero.value.abyssDStages - 49): 1) * (hero.value.rebirthTier >= 10? 1.5: 1) 
    * (1 + ascenPerks[34].level * 0.01);
    bonus = (hero.value.isAbyss? Math.sqrt(bonus): bonus);
    if(bonus > 0)
      addLog(`You gain ${bonus.toFixed(2)} Curse bonuses`, 'Curses');

    hero.value.cursedBonusExp = Math.pow(bonus, ((1 + 0.2 * hero.value.mutations) + 0.1 * Math.max(hero.value.activeCurse.length - 1, 0))) * 
    (1 / Math.log(Math.max(3, 100 - hero.value.stage))) / 10;


    //hero.value.cursedBonusExp = Math.min(hero.value.cursedBonusExp, 10 * (hero.value.eLevel > 300? hero.value.cursedBonusExp ** 0.3: 1));

    hero.value.cursedBonus = (hero.value.cursedBonusExp * 10) * (1.5 ** Math.min(hero.value.soulTier, 3)) * (hero.value.rebirthPts >= 10? 2: 1) * 
    (hero.value.rebirthPts >= 50000? enemy.value.rebirthEnemy["drop"]: 1) * 
    (hero.value.isAbyss? 0: 1) * (hero.value.activeFormation == 3? 2: 1) * 
    (hero.value.infTier >= 4? (1.065 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    hero.value.activeCurse = [];
  }
  const expBuffGrant = () => {
    for(let idx of hero.value.activeBuffs){
      if(buffs.value[idx].tier < buffs.value[idx].maxTier)
        buffs.value[idx].exp += hero.value.cursedBonus;
    }
    
    for(let idx in buffs.value){
      if (buffs.value[idx].exp >= buffs.value[idx].maxExp[buffs.value[idx].tier-1] && buffs.value[idx].tier < buffs.value[idx].maxTier){
        buffs.value[idx].exp = buffs.value[idx].exp - buffs.value[idx].maxExp[buffs.value[idx].tier-1]
        buffs.value[idx].tier++;
      }

      if(buffs.value[idx].tier == buffs.value[idx].maxTier)
        buffs.value[idx].exp = 0;
    }
  }
  ///curse
  const cursedAffect = () => {
    if (hero.value.stage > 19 || hero.value.isAbyss){
      hero.value.activeCurse = [];
      let filterCursed = cursed.filter(curse => curse.status === true);
      hero.value.activeCurseTier = new Array(filterCursed.length).fill(-1);

      if (hero.value.isAbyss) {
        if(hero.value.abyssTier == 0){
          for(let i = 0; i < 7;i++){
            hero.value.activeCurse.push(filterCursed[i].id);
            hero.value.activeCurseTier[i] = 0;
          }
        } else if(hero.value.abyssTier == 1){
          for(let i = 0; i < 10;i++){
            hero.value.activeCurse.push(filterCursed[i].id);
            hero.value.activeCurseTier[i] = 1;
          }
        } else if(hero.value.abyssTier == 2){
          for(let i = 0; i < 13;i++){
            hero.value.activeCurse.push(filterCursed[i].id);
            hero.value.activeCurseTier[i] = 2;
          }
        } else if(hero.value.abyssTier == 3){
          for(let i = 0; i < 13;i++){
            hero.value.activeCurse.push(filterCursed[i].id);
            hero.value.activeCurseTier[i] = 3;
          }
        }
        
        return;
      }
      

      let countCurse = Math.floor(Math.random() * (hero.value.curse + 1));
      let tier = 0;
      let stuck = [];

      let t3 = Math.min(45, 1.1 * Math.log(hero.value.stage - 17)**1.95 * (hero.value.sp >= 24 && hero.value.abyssDStages >= 20?Math.log(hero.value.abyssDStages) ** 0.45: 1));
      let t2 = Math.min(50, 10 * Math.log(hero.value.stage - 17)**0.95 * (hero.value.sp >= 24 && hero.value.abyssDStages >= 20?Math.log(hero.value.abyssDStages) ** 0.35: 1));
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


        if(hero.value.sp >= 5){
          if(mutations < 4 && tier == 2){
            if(hero.value.stage >= (30 - radPerks[5].level) + 5 * mutations && (Math.random() * 100 + hero.value.mutation[mutations].chance >= 100)){
              mutations++;
              tier = 3;
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

      if(mutations > 0){
        hero.value.mutations = mutations;
        let mutagen = ((mutations + (hero.value.infTier >= 4? 1: 0)) ** 3) * (1.025 ** radPerks[4].level) * (1 + ascenPerks[34].level * 0.01) + 1;
        addLog(`You gain ${mutagen.toFixed(2)} mutagens`, "Radiation");
        hero.value.mutagen += mutagen;
      }
        
    }
  }
  //1
  const activeBloodCurse = (interval) => {
    if (hero.value.activeCurse.includes(1)){
      cursed[1].time += interval / 1000;
      if (hero.value.activeCurseTier[1] == 0) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.03: 0); 
      }
      if (hero.value.activeCurseTier[1] == 1) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.06: 0); 
      }
      if (hero.value.activeCurseTier[1] == 2) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.09: 0); 
      }
      if (hero.value.activeCurseTier[1] == 3) {
        enemy.value.hp += (cursed[1].time >= 1? enemy.value.maxHp * 0.12: 0); 
      }
      enemy.value.hp = Math.min(enemy.value.hp, enemy.value.maxHp);
      cursed[1].time = (cursed[1].time >= 1? 0: cursed[1].time);
    }
    cursed[1].time = hero.value.activeCurse.includes(1)? cursed[1].time: 0;
  }
  //0
  const penetrateCurse = () => {
    if (hero.value.activeCurse.includes(0)){
      let penetrate = 0
      if (hero.value.activeCurseTier[0] == 0) {
        penetrate = 0.1;
      }
      if (hero.value.activeCurseTier[0] == 1) {
        penetrate = 0.2;
      }
      if (hero.value.activeCurseTier[0] == 2) {
        penetrate = 0.3;
      }
      if (hero.value.activeCurseTier[0] == 3) {
        penetrate = 0.4;
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
        block = 0.1;
      }
      if (hero.value.activeCurseTier[2] == 1) {
        block = 0.2;
      }
      if (hero.value.activeCurseTier[2] == 2) {
        block = 0.3;
      }
      if (hero.value.activeCurseTier[2] == 3) {
        block = 0.4;
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
        speed = 0.3;
      }
      if (hero.value.activeCurseTier[3] == 1) {
        speed = 0.5;
      }
      if (hero.value.activeCurseTier[3] == 2) {
        speed = 0.7;
      }
      if (hero.value.activeCurseTier[3] == 3) {
        speed = 0.9;
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
        avoid = (chance + 4 >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 1) {
        avoid = (chance + 8 >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 2) {
        avoid = (chance + 12 >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 3) {
        avoid = (chance + 16 >= 100? 0: 1);
      }

      return avoid
    }
    return 1;
  }
  //5
  const stunCurse = () => {
    if (hero.value.activeCurse.includes(5) && cursed[5].time <= 0){
      let chance = Math.random() * 100;
      if (hero.value.activeCurseTier[5] == 0) {
        cursed[5].time = chance + 10 > 100? 0.4: 0;
      }
      if (hero.value.activeCurseTier[5] == 1) {
        cursed[5].time = chance + 15 > 100? 0.6: 0;
      }
      if (hero.value.activeCurseTier[5] == 2) {
        cursed[5].time = chance + 20 > 100? 0.8: 0;
      }
      if (hero.value.activeCurseTier[5] == 3) {
        cursed[5].time = chance + 25 > 100? 1: 0;
      }
    }
  }
  //6
  const AccurateBlowCurse = () => {
    if (hero.value.activeCurse.includes(6)){
      let chance = Math.random() * 100;
      let crit = 1;
      if (hero.value.activeCurseTier[6] == 0) {
        crit = chance + 30 >= 100? 1.5: 1;
      }
      if (hero.value.activeCurseTier[6] == 1) {
        crit = chance + 25 >= 100? 2: 1;
      }
      if (hero.value.activeCurseTier[6] == 2) {
        crit = chance + 20 >= 100? 2.5: 1;
      }
      if (hero.value.activeCurseTier[6] == 3) {
        crit = chance + 15 >= 100? 3: 1;
      }
      return crit;
    }
    return 1;
  }
  //7
  const selfDestructionCurse = () => {
    if (hero.value.activeCurse.includes(7)){
      
      if (hero.value.activeCurseTier[7] == 0) {
        hero.value.hp -= hero.value.maxHp * 0.02;
      }
      if (hero.value.activeCurseTier[7] == 1) {
        hero.value.hp -= hero.value.maxHp * 0.03;
      }
      if (hero.value.activeCurseTier[7] == 2) {
        hero.value.hp -= hero.value.maxHp * 0.04;
      }
      if (hero.value.activeCurseTier[7] == 3) {
        hero.value.hp -= hero.value.maxHp * 0.05;
      }

      hero.value.hp = Math.max(hero.value.hp, 0);
    }
  }
  //8
  const steelSkinCurse = () => {
    if (hero.value.activeCurse.includes(8)){
      if (hero.value.activeCurseTier[8] == 0) {
        enemy.value.def = enemy.value.maxHp * 0.02;
      }
      if (hero.value.activeCurseTier[8] == 1) {
        enemy.value.def = enemy.value.maxHp * 0.04;
      }
      if (hero.value.activeCurseTier[8] == 2) {
        enemy.value.def = enemy.value.maxHp * 0.06;
      }
      if (hero.value.activeCurseTier[8] == 3) {
        enemy.value.def = enemy.value.maxHp * 0.08;
      }
    }
  }
  //9
  const titanCurse = () => {
    if (hero.value.activeCurse.includes(9)){
      if (hero.value.activeCurseTier[9] == 0) {
        enemy.value.maxHp *= 1.3;
      }
      if (hero.value.activeCurseTier[9] == 1) {
        enemy.value.maxHp *= 1.5;
      }
      if (hero.value.activeCurseTier[9] == 2) {
        enemy.value.maxHp *= 1.8;
      }
      if (hero.value.activeCurseTier[9] == 3) {
        enemy.value.maxHp *= 2;
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
        cursed[10].bleed = enemy.value.attack * 0.1;
        cursed[10].time = (chance? 2: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 1) {
        chance = Math.random() * 100 + 10 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.2;
        cursed[10].time = (chance? 3: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 2) {
        chance = Math.random() * 100 + 15 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.3;
        cursed[10].time = (chance? 4: cursed[10].time);
      }
      if (hero.value.activeCurseTier[10] == 3) {
        chance = Math.random() * 100 + 20 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.4;
        cursed[10].time = (chance? 5: cursed[10].time);
      }
    }
  }
  //11
  const DirtyBloodCurse = () => {
    if (hero.value.activeCurse.includes(11)){
      if (hero.value.activeCurseTier[11] == 0) {
        cursed[11].mult = 0.9;
      }
      if (hero.value.activeCurseTier[11] == 1) {
        cursed[11].mult = 0.8;
      }
      if (hero.value.activeCurseTier[11] == 2) {
        cursed[11].mult = 0.7;
      }
      if (hero.value.activeCurseTier[11] == 3) {
        cursed[11].mult = 0.6;
      }
    }
  }
  //12
  const MusclesCurse = () => {
    if (hero.value.activeCurse.includes(12)){
      if (hero.value.activeCurseTier[12] == 0) {
        enemy.value.attack *= 1.25;
      }
      if (hero.value.activeCurseTier[12] == 1) {
        enemy.value.attack *= 1.5;
      }
      if (hero.value.activeCurseTier[12] == 2) {
        enemy.value.attack *= 1.75;
      }
      if (hero.value.activeCurseTier[12] == 3) {
        enemy.value.attack *= 2;
      }
      enemy.value.hp = enemy.value.maxHp;
    }
  }

  const createEnemy = () => {
    enemy.value.spawnType = 'none';
    if(enemy.value.boss.isBoss){
      enemy.value.boss.isBoss = true;
      enemy.value.spawnType = 'boss';
      enemy.value.boss.attack = Math.max(Math.sqrt(1.035**hero.value.stage)**(1.04 + 0.02*Math.floor(hero.value.stage/10)), 1.5); 
      enemy.value.boss.hp = Math.max(Math.sqrt((hero.value.stage / 5) + Math.log(hero.value.stage)**(0.55+0.08*Math.floor(hero.value.stage/5))), 2);
      enemy.value.boss.drop = Math.sqrt((hero.value.stage / 5) * Math.log(hero.value.stage));
    }
    if(!enemy.value.boss.isBoss || hero.value.isAbyss)
      cursedAffect();

    createInfSouls();
    createSoul();
    createAscensionSouls();

    var dx = getRandomFloat(0.7 + hero.value.zone * 0.04, 1.1 + hero.value.zone * 0.06)
    statEnemyCalculate(dx)

    if(hero.value.soulsMax >= 30 && enemy.value.spawnType != 'none')
      hero.value.hp = hero.value.maxHp;


    titanCurse();
    steelSkinCurse();
    MusclesCurse();

    if(enemy.value.spawnType == 'boss' || enemy.value.spawnType == 'soul' || enemy.value.spawnType == 'a-soul' || enemy.value.spawnType == 'none')
      enemy.value.name = enemy.value.soulBuff.active || enemy.value.rebirthSoul? soulNames[hero.value.souls%50]:  getRandomVillainName();

    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  const createSoul = () => {
    if( hero.value.stage > 14 && enemy.value.spawnType == 'none'){ //soul
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

      if(!enemy.value.soulBuff.active && hero.value.rebirthTier >= 20){
        enemy.value.rebirthSoul = false;
        let chance = Math.random() * 100 + 2 * enemy.value.dangerEnemyChance[5];
        if (chance >= 100){
          enemy.value.spawnType = 'soul';
          enemy.value.rebirthSoul = true;
        }
      }
      
      enemy.value.soulBuff.dmg = (0.4 + Math.pow( Math.log((hero.value.souls*2 + 3)**0.35), (hero.value.souls*2.5)**(0.115 + 0.001 *  Math.max(hero.value.souls - 40, 0))) * 
      (ascenPerks[19].level? 0.85: 1)) ** (hero.value.soulD? 2: 1) * (hero.value.infTier >= 1? (1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

      enemy.value.soulBuff.hp = (0.4 + Math.pow( Math.log((hero.value.souls*3 + 3)**0.4) , (hero.value.souls*3)**(0.135 + 0.001 *  Math.max(hero.value.souls - 40, 0))) * 
      (ascenPerks[19].level? 0.85: 1)) ** (hero.value.soulD? 2: 1) * (hero.value.infTier >= 1? (1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

      enemy.value.soulBuff.drop = (1 + Math.pow( Math.log((hero.value.souls*1.75 + 3)**0.5), hero.value.souls**0.175) * (ascenPerks[20].level? 1.3: 1)) ** (hero.value.soulD? 1.35: 1);
      enemy.value.soulBuff.drop = (enemy.value.soulBuff.drop > 8? 8 + Math.sqrt(enemy.value.soulBuff.drop - 8): enemy.value.soulBuff.drop);

    } 
  }
  
  const createSpaceCreature = () => {
    enemy.value.name = spEnemy[hero.value.spCount].name;
    enemy.value.attack = spEnemy[hero.value.spCount].stats.dmg * (1 + hero.value.infTier * 0.1);
    enemy.value.maxHp = spEnemy[hero.value.spCount].stats.hp * (1 + hero.value.infTier * 0.1);
    enemy.value.def = spEnemy[hero.value.spCount].stats.def * (1 + hero.value.infTier * 0.1);
    enemy.value.hp = enemy.value.maxHp;
    enemy.value.attacksPerSecond = spEnemy[hero.value.spCount].stats.AS * (1 + hero.value.infTier * 0.02);
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

      if(hero.value.spCount == 24){
        hero.value.activeCurse = [0, 10, 5];
        hero.value.activeCurseTier[0] = 1;
        hero.value.activeCurseTier[10] = 1;
        hero.value.activeCurseTier[5] = 2;
      }

      if(hero.value.spCount == 25){
        hero.value.activeCurse = [3, 4, 6];
        hero.value.activeCurseTier[3] = 2;
        hero.value.activeCurseTier[4] = 3;
        hero.value.activeCurseTier[6] = 1;
      }

      if(hero.value.spCount == 26){
        hero.value.activeCurse = [7, 6];
        hero.value.activeCurseTier[7] = 3;
        hero.value.activeCurseTier[6] = 3;
      }

      if(hero.value.spCount == 27){
        hero.value.activeCurse = [2, 10, 3];
        hero.value.activeCurseTier[2] = 3;
        hero.value.activeCurseTier[10] = 1;
        hero.value.activeCurseTier[3] = 3;
      }

      if(hero.value.spCount == 28){
        hero.value.activeCurse = [0, 10, 3, 8];
        hero.value.activeCurseTier[0] = 3;
        hero.value.activeCurseTier[3] = 1;
        hero.value.activeCurseTier[8] = 3;
        hero.value.activeCurseTier[10] = 2;
      }
      
      if(hero.value.spCount == 29){
        hero.value.activeCurse = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
        hero.value.activeCurseTier[0] = 3;
        hero.value.activeCurseTier[1] = 3;
        hero.value.activeCurseTier[2] = 3;
        hero.value.activeCurseTier[3] = 3;
        hero.value.activeCurseTier[4] = 4;
        hero.value.activeCurseTier[5] = 4;
        hero.value.activeCurseTier[6] = 4;
        hero.value.activeCurseTier[7] = 4;
        hero.value.activeCurseTier[8] = 4;
        hero.value.activeCurseTier[10] = 4;
        hero.value.activeCurseTier[11] = 4;
      }
    }

  }

  const createAscensionSouls = () => {
    if(hero.value.stage >= 20 && hero.value.abyssTier >= 2){
      let chance = Math.min(4 ** (1.03 + 0.0175 * (hero.value.stage - 20)) * (enemy.value.danger >= 20? enemy.value.dangerEnemyChance[4]: 1), 20);
      let dx = 1.5 ** (1.01 + 0.01 * (hero.value.stage - 20));

      enemy.value.ascensionSoul.active = (Math.random() * 100 + chance >= 100 && enemy.value.spawnType == 'none'? true: false);
      enemy.value.spawnType = enemy.value.ascensionSoul.active? 'a-soul': enemy.value.spawnType;
      enemy.value.ascensionSoul.stats = dx;
    }
  }
  
  const createInfSouls = () => {
    if(hero.value.infTier >= 4){
      if(enemy.value.danger >= 100 && enemy.value.spawnType == 'none' && hero.value.stage > 59){
        enemy.value.spawnType = (Math.random()*100 + enemy.value.dangerEnemyChance[1] >= 100? 'inf-1': enemy.value.spawnType);
        enemy.value.name = (enemy.value.spawnType == 'inf-1'? 'Ω-Infinity': enemy.value.name);
      }
      if(enemy.value.danger >= 150 && enemy.value.spawnType == 'none' && hero.value.stage > 64){
        enemy.value.spawnType = (Math.random()*100 + enemy.value.dangerEnemyChance[2] >= 100? 'inf-2': enemy.value.spawnType);
        enemy.value.name = (enemy.value.spawnType == 'inf-2'? 'Mirror of the Eternal': enemy.value.name);
      }
      if(enemy.value.danger >= 200 && enemy.value.spawnType == 'none' && hero.value.stage > 69){
        enemy.value.spawnType = (Math.random()*100 + enemy.value.dangerEnemyChance[3] >= 100? 'inf-3': enemy.value.spawnType);
        enemy.value.name = (enemy.value.spawnType == 'inf-2'? 'The Infinite One': enemy.value.name);
      }
    }
  }

  const rewardInfSouls = () => {
    if(hero.value.infTier >= 4){
      if(enemy.value.spawnType == 'inf-1'){
        enemy.value.dangerEnemyLoot[0] += 1;
        addLog("You destroyed Ω-Infinity and gained 1 Potential", "Radiation");
      }
      if(enemy.value.spawnType == 'inf-2'){
        enemy.value.dangerEnemyLoot[1] += 1;
        addLog("You destroyed Mirror of the Eternal and gained 1 Infinity Point", "Radiation");
      }
      if(enemy.value.spawnType == 'inf-3'){
        enemy.value.dangerEnemyLoot[2] += 1;
        addLog("You destroyed The Infinite One and gained 1 Star", "Radiation");
      }
    }
  }
  //stats
  const statEnemyCalculate = (dx) => {
    enemy.value.attack = 10 * ((1.04 ** (hero.value.stage + 1)) ** Math.min((1.15 + 0.12*Math.floor(hero.value.stage/5)), 2.1)) * dx * 
    (enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.dmg: 1) * 
    (enemy.value.boss.isBoss? enemy.value.boss.attack: 1) * 
    (hero.value.isAbyss? 1 :enemy.value.rebirthEnemy["dmg"]) * 
    (hero.value.isAbyss? Math.max(1.04 - 0.01 * hero.value.abyssTier, 1.02) ** hero.value.stage: 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) * 
    (hero.value.isAbyss? 1: enemy.value.enemyPower) * 
    (!hero.value.infProgress? 1 + 0.1 * hero.value.infTier: 1) *
    (hero.value.abyssTier >= 2? 1 / ((1.04 + (ascenPerks[29].level? 0.01: 0)) ** Math.log(hero.value.ascensionShards + 1)): 1) * 
    (ascenPerks[27].level? 1 - (hero.value.corruption - 0.1) * 0.5: 1) *
    (hero.value.isAbyss && hero.value.rebirthTier >= 5? (1 / (1.025 ** hero.value.rebirthTier)): 1) *
    (1 - ascenPerks[33].level * 0.01) * 
    (hero.value.infTier >= 6? (1 / 1.02 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    enemy.value.attack = Math.max(enemy.value.attack, 10);

    enemy.value.maxHp = 40 * ((((1.065 - 0.00075 * Math.floor(hero.value.stage/5))** hero.value.stage) ** Math.min((1.3+0.225*Math.sqrt(hero.value.stage/2)), 2.8)) / (2 - (hero.value.stage > 14? 0.5: 0) - (hero.value.stage > 19? 0.5: 0))) * dx * 
    (enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.hp: 1) *
    (enemy.value.boss.isBoss? enemy.value.boss.hp: 1) *
    (hero.value.isAbyss? 1 :enemy.value.rebirthEnemy["hp"]) * 
    (hero.value.isAbyss? Math.max(1.05 - 0.01 * hero.value.abyssTier, 1.03) ** hero.value.stage: 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) *
    (enemy.value.enemyPower) * 
    (!hero.value.infProgress? 1 + 0.1 * hero.value.infTier: 1) *
    (hero.value.abyssTier >= 2? 1 / ((1.04 + (ascenPerks[29].level? 0.01: 0)) ** Math.log(hero.value.ascensionShards + 1)): 1) *
    (hero.value.isAbyss && hero.value.rebirthTier >= 5? (1 / (1.025 ** hero.value.rebirthTier)): 1) *
    (ascenPerks[27].level? 1 - (hero.value.corruption - 0.1) * 0.5: 1) *
    (1 - ascenPerks[22].level * 0.01) * 
    (1 - ascenPerks[32].level * 0.01) * 
    (hero.value.infTier >= 6? (1 / 1.02 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    enemy.value.maxHp = Math.max(enemy.value.maxHp, 20);


    enemy.value.hp = enemy.value.maxHp;

    enemy.value.def = 0;

    enemy.value.attacksPerSecond = 0.4 + Math.min(1, (0.1 * Math.floor(hero.value.stage / 5))) + fastReflexesCurse();
    enemy.value.attacksPerSecond -= (ascenPerks[23].level * 0.15)
    enemy.value.attacksPerSecond = Math.min(enemy.value.attacksPerSecond, 3.9);
    enemy.value.attacksPerSecond = Math.max(enemy.value.attacksPerSecond, 0.4);
  }

  const eqStatsHandle = () => {
    hero.value.eqTierReq['sword'] = 3 + (ascenPerks[1].level == 1? 1: 0) + (ascenPerks[10].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
    (hero.value.sp >= 3? 1: 0) + (Math.floor(hero.value.spCount/6) >= 1? Math.floor(hero.value.spCount/6): 0) + (hero.value.sp >= 70? 1: 0);

    hero.value.eqTierReq['armor'] = 3 + (ascenPerks[2].level == 1? 1: 0) + (ascenPerks[11].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
    (hero.value.sp >= 3? 1: 0) + (hero.value.sp >= 70? 1: 0);

    hero.value.eqTierReq['boots'] = 3 + (ascenPerks[3].level == 1? 1: 0) + (ascenPerks[12].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
    (hero.value.sp >= 3? 1: 0) + (hero.value.sp >= 70? 1: 0);

    if (ascenPerks[5].level == 1) {
      hero.value.eqTierReq['ring'] = 3 + (ascenPerks[4].level == 1? 1: 0) + (ascenPerks[13].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0) + 
      (hero.value.sp >= 3? 1: 0) + (hero.value.sp >= 70? 1: 0);
    }
    else 
      hero.value.eqTierReq['ring'] = 0
  }

  const statCalculate = () => {
    hero.value.attack = 10 + (((1 + 0.2 * Math.floor(hero.value.potential/20)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel))) * 
    (perks.value[0].infStatus? (perks.value[0].value ** Math.min(perks.value[0].level, 100) + 1.0075 ** Math.min(Math.max(perks.value[0].level - 100, 0), 100)): 1) *
    (perks.value[0].status? (1.01 ** Math.min(perks.value[0].kills,140) + (perks.value[0].kills >= 140? perks.value[0].kills ** 0.09 - 1: 0)): 1) * 
    (!perks.value[0].infStatus && !perks.value[0].status? perks.value[0].value ** perks.value[0].level: 1) * 
    (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.multDmg + hero.value.eqUpsMult['sword'].bonus) * 
    (hero.value.infTier >= 1 || hero.value.level >= 700? (1.05 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))) : 1) *
    (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1);

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


    hero.value.crit = 0 + (perks.value[7].level * perks.value[7].value) + (hero.value.rebirthPts >= 150? 5: 0) + (buffs.value[12].crit) + 
    (Math.floor(hero.value.spCount/6) >= 3? hero.value.eqUpsMult['sword'].crit: 0) + (hero.value.activeBuffs.includes(11)? 15: 0); 
    hero.value.critAttack = 150 + (perks.value[8].level * perks.value[8].value) + (buffs.value[12].critDmg) + (hero.value.activeBuffs.includes(11)? 75: 0) + 
    (Math.floor(hero.value.spCount/6) >= 3? hero.value.eqUpsMult['sword'].critDmg: 0);
    
    hero.value.attack *= (hero.value.activeFormation == 1? 2: 1);
    hero.value.attack *= (hero.value.activeFormation == 0? 0.5: 1);
    hero.value.attack *= (hero.value.activeFormation == 2? 0.5: 1);
    hero.value.attack *= (hero.value.activeFormation == 3? 0.5: 1);

    hero.value.maxHp = ((100 + ((2 + 0.5 * Math.floor(hero.value.potential/10)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel))) + 
    (perks.value[1].value * perks.value[1].level) +
    (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp + hero.value.eqUpsMult['armor'].bonus)) * 
    (hero.value.infTier >= 1 || hero.value.level >= 700? (1.045 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1) *
    (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1);
    

    hero.value.maxHp *= (hero.value.activeFormation == 0? 2: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 1? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 2? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 3? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1);
    


    hero.value.def = 0 + ((0.5 + 0.1 * Math.floor(hero.value.potential/30)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel)) *
    (1 + ((perks.value[2].value * perks.value[2].level)*0.01)) * (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1)
    buffs.value[0].def * (hero.value.infTier >= 1 || hero.value.level >= 700? (1.04 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);


    hero.value.def *= (hero.value.activeFormation == 2? 2: 1);
    hero.value.def *= (hero.value.activeFormation == 1? 0.5: 1);
    hero.value.def *= (hero.value.activeFormation == 0? 0.5: 1);
    hero.value.def *= (hero.value.activeFormation == 3? 0.5: 1);
    //extra life
    hero.value.def *= (buffs.value[10].buffT2 > 0? 1.25: 1);
    //jagernout
    juggernautBuff();

    hero.value.minLevel = eqCpmplect() + (ascenPerks[26].level? Math.floor(hero.value.stage/5)-1: 0) + 
    ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)) + perks.value[12].level + 
    (hero.value.infTier >= 3 && hero.value.rebirthTier >= 40? Math.floor(1.05 ** hero.value.rebirthTier): 0) + 
    (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel + hero.value.eqUpsMult['spRing'].bonus) + 
    (hero.value.infTier >= 6? Math.floor(hero.value.soulsMax/10): 0);

    hero.value.level = hero.value.eLevel + hero.value.minLevel;
    hero.value.maxReachedLevel = Math.max(hero.value.maxReachedLevel, hero.value.level);

    hero.value.maxLevel = 30 + (perks.value[4].status? 0: perks.value[4].value * perks.value[4].level) + ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level + hero.value.souls +
    ((equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap + hero.value.eqUpsMult['sword'].cap) +  
    (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap + hero.value.eqUpsMult['armor'].cap) + 
    (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap + hero.value.eqUpsMult['boots'].cap) + 
    (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap + hero.value.eqUpsMult['ring'].cap) + 
    (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap + hero.value.eqUpsMult['spRing'].cap)) +
    (amulets[0].status? 4: 0) + (amulets[1].status? 8: 0) + (amulets[2].status? 12: 0) + (amulets[3].status? 16: 0) + 
    eqCpmplect() + (ascenPerks[26].level? 2*Math.floor(hero.value.stage/5)-1: 0) + 
    (hero.value.sp >= 50? hero.value.sp * 2: 0) + (radPerks[12].level) +
    ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
    (hero.value.spCount / 6 >= 5? 150: 0));

    hero.value.maxLevel *= 1 + (amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + (amulets[3].prefix.status? 0.08: 0) + 
    (perks.value[4].status? 0.15: 0) + (ascenPerks[31].level * 0.01) + (hero.value.rebirthTier >= 80? 0.08: 0);
    hero.value.maxLevel = Math.floor(hero.value.maxLevel);
    hero.value.trueLevel = hero.value.maxLevel;

    if(!hero.value.infProgress && hero.value.level >= 700){
      hero.value.infProgress = true;
    }
    hero.value.maxLevel = !hero.value.infProgress? Math.floor((Math.pow(hero.value.maxLevel, 1 - 0.02 * hero.value.infTier))): hero.value.maxLevel; 
    
    if(hero.value.rebirthTier < 20 && hero.value.infTier < 3)
      hero.value.maxLevel = Math.min(hero.value.maxLevel, 100 + 10*hero.value.rebirthTier);
    if(hero.value.maxLevel >= 300 && hero.value.abyssTier >= 3)
      hero.value.maxLevel = Math.floor(Math.min(300 + (hero.value.maxLevel - 300) * hero.value.corruption ,700))

    if(hero.value.eLevel > hero.value.maxLevel){
      hero.value.level = hero.value.maxLevel;
      hero.value.nextLevelExp = nextLevel(hero.value.eLevel);
    }
  

    let base = 0.5 + (hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 1? 0.5: 0);

    hero.value.attacksPerSecond = base + (perks.value[5].status? 0.1 * (Math.floor(hero.value.stage / 5 - 1)): perks.value[5].value * perks.value[5].level) + 
    (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed + hero.value.eqUpsMult['boots'].bonus ) + 
    (buffs.value[3].combo == 100? 0.3: 0) + 
    (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? 0.1 * Math.floor(buffs.value[8].time/250): 0) + 
    (flashBuff());
    hero.value.attacksPerSecond -= hero.value.activeBuffs.includes(5)? buffs.value[5].debuff: 0;

    hero.value.attacksPerSecond = Math.min(hero.value.attacksPerSecond, 4);
    hero.value.attacksPerSecond = Math.max(hero.value.attacksPerSecond, base);

    hero.value.avoid = 0 + (hero.value.rebirthPts >= 1750? 8: 0);

    hero.value.corruption = 0.1 + (hero.value.sp >= 46? 1.002 ** hero.value.sp - 1: 0) + (radPerks[11].level? 0.01 * Math.floor((hero.value.maxStage-5)/5): 0) + 
    (hero.value.sp >= 24 && hero.value.abyssDStages >= 40? (1 - (1 / (Math.sqrt(hero.value.abyssDStages - 39) ** 0.1))): 0) + 
    (hero.value.infTier >= 5? (1.01 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)) - 1): 0) + 
    (hero.value.rebirthTier >= 70? (1.02 ** Math.sqrt(hero.value.rebirthTier) - 1): 0);
    hero.value.corruption = Math.min(hero.value.corruption, 1);
  }

  const eqCpmplect = () => {
    let eq = (hero.value.rebirthPts >= 25? ((hero.value.equipmentTiers['sword'] >= 3 && hero.value.equipmentTiers['armor'] >= 3 && hero.value.equipmentTiers['boots'] >= 3)? 3: 0) : 0) +
    ( hero.value.rebirthPts >= 200? ((hero.value.equipmentTiers['sword'] >= 4 && hero.value.equipmentTiers['armor'] >= 4 
      && hero.value.equipmentTiers['boots'] >= 4 && hero.value.equipmentTiers['ring'] >= 4)? 4: 0) : 0) + 
    ( hero.value.rebirthPts >= 4000? ((hero.value.equipmentTiers['sword'] >= 5 && hero.value.equipmentTiers['armor'] >= 5 
      && hero.value.equipmentTiers['boots'] >= 5 && hero.value.equipmentTiers['ring'] >= 5)? 5: 0): 0);
    
    return eq;
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

    if(hero.value.sp >= 30)
      buffs.value[13].active = true;

    if(hero.value.sp >= 75)
      buffs.value[14].active = true;

  }

  const healBuff = (interval) => {
    let curse = hero.value.activeCurse.includes(11);
    buffs.value[4].time += interval / 1000;
      if(hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 1){
        hero.value.hp += (buffs.value[4].time >= 1? hero.value.stage: 0) * (curse? cursed[11].mult: 1);
      }
      if(hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 2){
        hero.value.hp += (buffs.value[4].used? hero.value.maxHp * 0.05: 0) * (curse? cursed[11].mult: 1);
        buffs.value[4].used = false;
      }
      if(hero.value.activeBuffs.includes(4) && buffs.value[4].tier >= 3){
        hero.value.hp += (buffs.value[4].time >= 1? hero.value.maxHp * 0.05: 0) * (curse? cursed[11].mult: 1);
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

    let chance = (Math.random()*100 + 35 >= 100? 1: 0);
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
  
  const sniperBuff = () => {
    if(buffs.value[1].usedSkill)
      return;

    if(!hero.value.activeBuffs.includes(11)){
      hero.value.attack *= (Math.random() * 100 + hero.value.crit >= 100? hero.value.critAttack*0.01: 1);
      return;
    }
      
    let chance = Math.random() * 100 + hero.value.crit >= 100;
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 2){
      hero.value.attack *= (hero.value.crit >= 100? 2: 1);
    }
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 3){
      if(!chance)
        chance = Math.random() * 100 + hero.value.crit >= 100;
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
    if(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 3){
      hero.value.def *= 1 + ((1 - (hero.value.hp / hero.value.maxHp)));
    }
    if(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 2){
      hero.value.def += (hero.value.maxHp * 0.1);
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
    
    if(ascenPerks[10].level == 1 && ascenPerks[10].status){
      hero.value.equipmentTiers['sword']++;
      ascenPerks[10].status = false
    }

    if(ascenPerks[11].level == 1 && ascenPerks[11].status){
      hero.value.equipmentTiers['armor']++;
      ascenPerks[11].status = false
    }

    if(ascenPerks[12].level == 1 && ascenPerks[12].status){
      hero.value.equipmentTiers['boots']++;
      ascenPerks[12].status = false
    }

    if(ascenPerks[13].level == 1 && ascenPerks[5].level == 1 && ascenPerks[13].status){
      hero.value.equipmentTiers['ring']++;
      ascenPerks[13].status = false
    }

    if(ascenPerks[8].level && hero.value.maxStage > 19)
      amulets[0].status = true;

    if(ascenPerks[14].level && ascenPerks[8].level)
      amulets[0].suffix.status = true;

    if(ascenPerks[24].level && ascenPerks[8].level)
      amulets[0].prefix.status = true;

    if(ascenPerks[30].level){
      buffs.value[0].maxTier = 4;
    }
    

  }

  const ascensionShardsProgress = (stage) => {
    var x = Math.sqrt(Math.log(stage+2) ** (stage/7)) * (1 + hero.value.maxLevel / 100);
    x *= hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 1.5: 1;
    x *= enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1;
    x *= (enemy.value.boss.isBoss? enemy.value.boss.drop: 1);
    x *= (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats * 0.35: 1);
    x *= (enemy.value.ascensionSoul.active && hero.value.activeFormation == 3? 2: 1);
    x *= (ascenPerks[29].level? (1.025 ** hero.value.sp): 1);
    x *= (1 + ascenPerks[34].level * 0.01);
    x *= (hero.value.infTier >= 3? (1.05 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    if(enemy.value.ascensionSoul.active){
      hero.value.ascensionShards += x;
      addLog(`You gain ${x.toFixed(2)} ascension shards from ${enemy.value.name}`, "Ascend && Rebirth");
      return;
    }

    hero.value.ascensionShards += x;
    hero.value.totalAscensionShards += x;

    hero.value.ascendShardPerform = (1.5 * hero.value.totalAscensionShards * (hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3) * (hero.value.rebirthPts >= 2? 2: 1) * 
    (hero.value.rebirthPts >= 2500? enemy.value.rebirthEnemy["drop"]: 1)) - hero.value.totalAscensionShards;

    if(hero.value.isAscend){
      
      hero.value.ascensionShards += hero.value.ascendShardPerform;
      hero.value.isAscend = false;
      return;
    }
    if(enemy.value.soulBuff.active){
      addLog(`You gain ${x.toFixed(2)} ascension shards from ${enemy.value.name}`, "Ascend && Rebirth");
      return;
    }
      
    if(enemy.value.boss.isBoss){
      addLog(`You gain ${x.toFixed(2)} ascension shards from Boss ${enemy.value.name}`, "Ascend && Rebirth");
      return;
    }
      

    addLog(`You gain ${x.toFixed(2)} ascension shards `, "Ascend && Rebirth");
  }

  const handleEnemyDefeat = () => {
    hero.value.kills = Math.min(hero.value.kills + overkillHandle(), Math.floor(hero.value.killsPerZone));

    hero.value.lacrimose = (hero.value.rebirthPts >= 20000? 0.15: 0) + (hero.value.infTier >= 2? 0.25: 0);
    if(hero.value.stage <= hero.value.maxStage * hero.value.lacrimose && hero.value.isStage){
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
        hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
        if(hero.value.abyssTier >= 3 && hero.value.isAbyss) hero.value.abyssDStages = Math.max(hero.value.stage, hero.value.abyssDStages);
        if(hero.value.isAbyss && hero.value.abyssTier == 3) 
          hero.value.abyssDStages = Math.max(hero.value.abyssDStages, hero.value.stage);
          
        if (hero.value.stage > 10)
          ascensionShardsProgress(hero.value.stage);
      }

      refreshKillsPerZone();
    }
  }

  const overkillHandle = () => {
    var totalKills = 1

    totalKills += (ascenPerks[21].level? 1: 0) + (ascenPerks[35].level) + (hero.value.infTier >= 2? Math.floor(1.1 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 0);

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

    if(!hero.value.isStage)
      return 0;
    return totalKills;
  }

  const refreshKillsPerZone = () => {
    var x = (hero.value.stage > 9? 1.34: 1.15) - (perks.value[10].value * perks.value[10].level) - (ascenPerks[15].level == 1? 0.01: 0) - (hero.value.soulTier >= 2? 0.01: 0) - 
    (hero.value.rebirthPts >= 125? 0.01: 0) -  (hero.value.rebirthPts >= 22500? 0.01: 0) - (hero.value.sp >= 27? 0.01: 0) - 
    (hero.value.sp >= 24 && hero.value.abyssDStages >= 70? 0.01 * (1.01 * Math.log(hero.value.abyssDStages - 67)): 0) ;

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
      //console.log("Stage: " + hero.value.stage, "Zone: " + hero.value.zone, start);

    }
    start = Math.min(start, 10000);
    hero.value.killsPerZone = start * (hero.value.infTier >= 7? (1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);
  }

  const expCount = () => {
    return Math.log(hero.value.stage + 5)**4;
  }

  const soulHandle = () => {
    amulets[1].status = hero.value.soulsMax >= 20? true: false;
    amulets[1].suffix.status = hero.value.soulsMax >= 30? true: false;
    amulets[1].prefix.status = hero.value.soulsMax >= 40? true: false;

    perks.value[0].value = 1.01 + (hero.value.soulsMax >= 40? 0.001 * hero.value.treeTier: 0);

    hero.value.formationTypes[2].status = (hero.value.soulsMax >= 40? true: false);

    hero.value.soulTier = Math.floor(hero.value.souls/10);
    
  }

  const rebirthPtsHandle = () => {
   
    let pt = Math.min((Math.log(Math.max((hero.value.level - 97), 3)**(1.15 + 0.08 * (Math.floor(hero.value.rebirthPts)).toFixed(0).length))**(hero.value.level/Math.max(100 - (1 * hero.value.level/9), 1))), 10000);
    pt = (pt >= 400? 400 + Math.sqrt(pt - 400): pt);
    let pts = pt * 
      (hero.value.rebirthPts >= 100? enemy.value.rebirthEnemy["drop"]: 1) * (1.3 ** hero.value.abyssTier) * 
      (perks.value[14].level? perks.value[14].value: 1) * (hero.value.soulTier >= 4? 1.5: 1) * 
      (hero.value.rebirthPts >= 1250? Math.min((1 + 0.01 * hero.value.rebirthTier) ** 8, 2) * ((1 + 0.01 * Math.max(hero.value.rebirthTier - 9, 0)) ** 2) : 1) * 
      (1 + ascenPerks[34].level * 0.01) * (hero.value.infTier >= 3? (1.025 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);

    if (hero.value.level >= 100){
      hero.value.totalRebirthPts = pts;
    } 
    if(enemy.value.rebirthSoul && enemy.value.hp <= 0){
      let totalPts = (pts ** 0.2) * ((hero.value.stage - 20)/ 10) * (hero.value.activeFormation == 3? 2: 1);
      hero.value.rebirthPts += totalPts;
      addLog(`You gain ${totalPts.toFixed(2)} Rebirth Pts from ${enemy.value.name}`, "Ascend && Rebirth");
    }

  }

  const rebirthHandle = () => {
    hero.value.potential = (hero.value.rebirthPts >= 3? 10: 0) + (hero.value.rebirthPts >= 75? 10: 0) + (hero.value.rebirthPts >= 250? 10: 0) + 
    (hero.value.rebirthPts >= 5000? 10: 0) + (hero.value.rebirthPts >= 17500? 10: 0) + (hero.value.rebirthPts >= 60000? 10: 0) + radPerks[6].level + 
    (hero.value.infTier >= 3 && hero.value.rebirthTier >= 30? Math.floor(1.053 ** hero.value.rebirthTier): 0) + (enemy.value.dangerEnemyLoot[0]);


    if(hero.value.rebirthPts >= 2000) 
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
    }
  }

  const amuletsHandle = () => {
    hero.value.treeTier = 0 + 
    (amulets[0].status && amulets[0].suffix.status? 1: 0) + 
    (amulets[1].status && amulets[1].suffix.status? 1: 0) + 
    (amulets[2].status && amulets[2].suffix.status? 1: 0) + 
    (amulets[3].status && amulets[3].suffix.status? 1: 0);

    hero.value.maxBuffs = 1 + (amulets[0].status && hero.value.maxStage >= 20? 1: 0) + (amulets[1].status && hero.value.maxStage >= 30? 1: 0) + 
    (amulets[2].status && hero.value.maxStage >= 40? 1: 0) + (amulets[3].status && hero.value.maxStage >= 50? 1: 0) + 
    (hero.value.rebirthPts >= 15000? 1: 0) + (hero.value.isAbyss && hero.value.rebirthTier >= 15? 1: 0);
    hero.value.curse = 1 + (amulets[0].status? 1: 0) + (amulets[1].status? 1: 0) + (amulets[2].status? 1: 0) + (amulets[3].status? 1: 0) + 
    (hero.value.rebirthTier >= 10? 1: 0);
  }

  const mutationHandle = () => {
    hero.value.mutation[0].chance = 30 + 0.5 * radPerks[0].level;
    hero.value.mutation[1].chance = 10 + 1 * radPerks[1].level;
    hero.value.mutation[2].chance = 0 + 1.5 * radPerks[2].level;
    hero.value.mutation[3].chance = 0 + 2 * radPerks[3].level;

    if(radPerks[9].level) hero.value.soulsCap = 10000;

    if(hero.value.infTier >= 4){
      radPerks[0].max = 100;
      radPerks[1].max = 80;
      radPerks[2].max = 50;
      radPerks[3].max = 40;

      radPerks[4].max = 40;
      radPerks[5].max = 10;

      if(radPerks[6].status) radPerks[6].max = 120;
      if(radPerks[10].status) radPerks[10].max = 200;

      radPerks[12].max = 200;
    }
    if (radPerks[4].level > 0) radPerks[4].description = `Increase mutagen gaining [${(1.025 ** radPerks[4].level).toFixed(2)}]`;
    if (radPerks[6].status) radPerks[6].description = `+[${radPerks[6].level}] Potential`;
    if (radPerks[10].status) radPerks[10].description = `+1 DANGER per level`;

    enemy.value.danger = radPerks[10].level;
    enemy.value.enemyPower = (1.01 - (hero.value.infTier >= 4? 0.005: 0)) ** radPerks[10].level;
    enemy.value.spaceBossChance = (((1.09 + (hero.value.infTier >= 4? 0.01: 0)) ** radPerks[10].level - 1) / (10 ** Math.floor((hero.value.spCount) / 6))) * 
    (hero.value.rebirthTier >= 60? 1.02 ** hero.value.rebirthTier: 1);
    enemy.value.spaceBossChance = Math.min(enemy.value.spaceBossChance, 100);

    enemy.value.dangerEnemyChance[0] = (1.03 ** (radPerks[10].level - 10));
    enemy.value.dangerEnemyChance[4] = (1.025 ** (radPerks[10].level - 20));
    enemy.value.dangerEnemyChance[5] = (1.02 ** (radPerks[10].level - 40));
    enemy.value.dangerEnemyChance[1] = (enemy.value.dangerEnemyLoot[0] < 60? (1.02 ** (radPerks[10].level - 100) - (0.11 * enemy.value.dangerEnemyLoot[0])): 0);
    enemy.value.dangerEnemyChance[2] = (enemy.value.dangerEnemyLoot[1] < 100? (1.03 ** (radPerks[10].level - 150) - (0.02 * enemy.value.dangerEnemyLoot[1])): 0);
    enemy.value.dangerEnemyChance[3] = (enemy.value.dangerEnemyLoot[2] < 5? 1 * (1 / (10 * enemy.value.dangerEnemyLoot[2] + 1)): 0);
  }


  const spaceHandle = () => {
    hero.value.eqUpsMult['sword'].cap = (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap * 
      (0.1 * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+(hero.value.sp >= 55? 3: 0))));
    hero.value.eqUpsMult['sword'].bonus = (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.multDmg * 
      (0.05 * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+(hero.value.sp >= 55? 3: 0))));
    hero.value.eqUpsMult['sword'].crit = 5 + 5 * (0.1 * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+(hero.value.sp >= 55? 3: 0)));
    hero.value.eqUpsMult['sword'].critDmg = 25 + 25 * (0.1 * Math.min(hero.value.eqUps['sword'], hero.value.equipmentTiers['sword']+(hero.value.sp >= 55? 3: 0)));  

    hero.value.eqUpsMult['armor'].cap = (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap * 
      (0.1 * Math.min(hero.value.eqUps['armor'], hero.value.equipmentTiers['armor']+(hero.value.sp >= 55? 3: 0))));
    hero.value.eqUpsMult['armor'].bonus = (equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp * 
      (0.05 * Math.min(hero.value.eqUps['armor'], hero.value.equipmentTiers['armor']+(hero.value.sp >= 55? 3: 0))));

    hero.value.eqUpsMult['boots'].cap = (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap * 
      (0.1 * Math.min(hero.value.eqUps['boots'], hero.value.equipmentTiers['boots']+(hero.value.sp >= 55? 3: 0))));
    hero.value.eqUpsMult['boots'].bonus = (equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed * 
      (0.05 * Math.min(hero.value.eqUps['boots'], hero.value.equipmentTiers['boots']+(hero.value.sp >= 55? 3: 0))));

    hero.value.eqUpsMult['ring'].cap = (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap * 
      (0.1 * Math.min(hero.value.eqUps['ring'], hero.value.equipmentTiers['ring']+(hero.value.sp >= 55? 3: 0))));
    hero.value.eqUpsMult['ring'].bonus = (equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult * 
      (0.05 * Math.min(hero.value.eqUps['ring'], hero.value.equipmentTiers['ring']+(hero.value.sp >= 55? 3: 0))));

    hero.value.eqUpsMult['spRing'].cap = (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap * (0.1 * hero.value.eqUps['spRing']));
    hero.value.eqUpsMult['spRing'].bonus = Math.floor((equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel * (0.05 * hero.value.eqUps['spRing'])));


    amulets[3].status = (hero.value.sp >= 4? true: false);
    amulets[3].suffix.status = (hero.value.sp >= 18? true: false);
    amulets[3].prefix.status = (hero.value.sp >= 34? true: false);


    if (hero.value.spCount/6 >= hero.value.spBossPerk){
      hero.value.spBossPerk++;
      hero.value.equipmentTiers['sword']++;
    }

    if (hero.value.spCount/6 >= 2){
      hero.value.equipmentTiers['spRing'] = 1;
      hero.value.eqTierReq['spRing'] = 1;
    }

    if(hero.value.rebirthPts >= 1e5 && hero.value.abyssTier >= 3){
      for(let i = 0; i < cursed.length;i++){
        cursed[i].tier[3].status = true;
      }
    }

    if(hero.value.sp >= 65){
      buffs.value[4].maxTier = 4;
    }

    if(enemy.value.dangerEnemyLoot[2] > 0){
      hero.value.st = Math.floor(hero.value.spCount / 6) + enemy.value.dangerEnemyLoot[2];
    }

    if(hero.value.infTier >= 5){
      for(let idx = 24; idx < 29; idx++)
        spEnemy[idx].status = true;
    }

    if(Math.floor(hero.value.spCount / 6) >= 5){
      hero.value.equipmentTiers['spRing'] = 1 + hero.value.st;
    }
  }

  const starDustDrop = () => {
    
    if(hero.value.sp < 2)
      return 0;
    let stardust = 0;
    let st = 39 - (hero.value.sp >= 9? 1: 0) - (hero.value.sp >= 21? 2: 0) - (hero.value.sp >= 38? 2: 0);
    if(hero.value.stage - st > 0){
      stardust = ((1.05 ** (hero.value.stage - st)) * (1 + ascenPerks[34].level * 0.01) * 
      (hero.value.infTier >= 5? 2: 1) * (hero.value.sp >= 24 && hero.value.abyssDStages >= 60? (1.02 ** (hero.value.abyssDStages - 59)): 1)) - 1;
    }
    if(hero.value.afkKills > 0)
      return stardust;
    if(stardust > 0){
      addLog(`You gain ${stardust.toFixed(2)} stardust`, "Stardust");
      hero.value.stardust += stardust;
    }
    
  }

  const afkKillsHandle = () => {
    if(hero.value.afkKills > 0){
      let buffExp = 0;
      let stardust = 0;
      let radiation = 0;
      hero.value.afkSoulBoost = 1.05 ** Math.sqrt(hero.value.afkKills);
      if(perks.value[0].status)
        perks.value[0].kills += hero.value.afkKills * (overkillHandle()+1);

      if(hero.value.stage > 19){
        buffExp = (hero.value.afkKills * (hero.value.curse * 0.05) * hero.value.stage) * (hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3) * 
        (hero.value.rebirthPts >= 10? 2: 1) * (hero.value.rebirthPts >= 50000? enemy.value.rebirthEnemy["drop"]: 1) * (hero.value.isAbyss? 0: 1) * 
        (hero.value.infTier >= 4? (1.065 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);
        hero.value.cursedBonus = buffExp ** 1.2;
        expBuffGrant();
      }

      const stage = hero.value.stage;
      const abyss = hero.value.abyssDStages;

      if(hero.value.sp >= 5){
        const t3 = Math.min(45, 1.1 * Math.log(Math.max(3, stage - 17)) ** 1.95 * (abyss >= 20 ? Math.log(abyss) ** 0.35 : 1));
      
        radiation = hero.value.afkKills * (t3 * 0.025) * (((hero.value.mutation[0].chance + hero.value.mutation[1].chance + hero.value.mutation[2].chance + hero.value.mutation[3].chance) * 0.01) / 
        (4 ** (1 - 0.1 * Math.max(Math.floor((hero.value.stage - (30 - radPerks[5].level)) / 10), 0)))) * (1.025 ** radPerks[4].level);
      }
      

      stardust = starDustDrop() * hero.value.afkKills;

      if(hero.value.isLocked && hero.value.afkLocked){
        let exp = hero.value.afkKills * afkExp();
        hero.value.afkKills = 0;
        hero.value.exp += exp;
        
        hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
        afkMessages(0, 0, false, exp, buffExp, stardust, radiation);
        hero.value.afkLocked = false;
        return;
      }


      let totalExp = 0;
      let currentStage = hero.value.stage;
      let currentZone = hero.value.zone;

      while(hero.value.afkKills > 0){
        if((hero.value.kills + hero.value.afkKills * hero.value.overkill) - hero.value.killsPerZone > 0){
          hero.value.afkKills -= Math.floor(hero.value.killsPerZone / hero.value.overkill) - hero.value.kills;
          hero.value.kills = 0;
          totalExp += Math.floor(hero.value.killsPerZone) * afkExp();
          hero.value.zone++;
          refreshKillsPerZone();
        } else {
          refreshKillsPerZone();
          hero.value.kills += Math.floor(hero.value.afkKills * hero.value.overkill);
          totalExp += Math.floor(hero.value.afkKills) * afkExp();
          hero.value.exp += totalExp;
          hero.value.afkKills = 0;
          
          hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
          afkMessages(currentZone, currentStage,true, totalExp, buffExp, stardust, radiation);
          return;
        }


        if(hero.value.afkKills * hero.value.overkill - hero.value.killsPerZone > 0 && hero.value.zone >= 5 && hero.value.stage > 5 && hero.value.stage%5 == 4){
          if(hero.value.maxStage - 15 > hero.value.stage && !hero.value.isAbyss){
            hero.value.afkKills -= Math.floor(hero.value.killsPerZone / hero.value.overkill);
            totalExp += Math.floor(hero.value.killsPerZone) * afkExp();
            hero.value.zone++;
            refreshKillsPerZone();
          } else {
            refreshKillsPerZone();
            hero.value.kills = Math.floor(hero.value.killsPerZone) - 3;
            totalExp += hero.value.afkKills * afkExp();
            hero.value.afkKills = 0;
            hero.value.exp += totalExp;
            if(hero.value.zone > 5) hero.value.zone = 5; 
            

            hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
            afkMessages(currentZone, currentStage,true, totalExp, buffExp, stardust, radiation);
            return;
          }
          
        }

        if(hero.value.zone > 5){
          hero.value.zone = 1;
          hero.value.stage++;
          hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
          if (hero.value.stage > 10)
            ascensionShardsProgress(hero.value.stage);
        }
        if(hero.value.abyssTier >= 3 && hero.value.isAbyss) hero.value.abyssDStages = Math.max(hero.value.stage, hero.value.abyssDStages);
      }
    }
  }

  const afkMessages = (currentZone, currentStage, Locked, totalExp, buffExp = 0, stardust, radiation) => {
    totalExp = totalExp ** (1 - 0.02 * hero.value.infTier);

    hero.value.afkMessage = `
    <span>Offline bonus for ${Math.floor(hero.value.afkTime / 3600)}h ${Math.floor(hero.value.afkTime/60%60)}m ${hero.value.afkTime%60}s (MAX - 8h) </span><br>
    <span>You gained ${formatNumber(totalExp)} EXP.</span> 
    <span>You gained ${formatNumber(buffExp)} BUFF EXP.</span>
    <span>You gained ${Math.floor(stardust)} stardust.</span>
    <span>You gained ${Math.floor(radiation)} mutagens.</span><br>
    `
    if(hero.value.stage >= 15){
      hero.value.afkMessage += `<span>Soul Booster Chance equals to ${hero.value.afkSoulBoost.toFixed(2)}</span><br>`;
    }
    if(Locked)
      hero.value.afkMessage += `<span>You passed from ${currentStage} stage ${currentZone} zone -> ${hero.value.stage} stage ${hero.value.zone} zone</span><br>`;
    
    hero.value.stardust += stardust;
    hero.value.mutagen += radiation;
  }

  const spaceAuto = () => {
    for(let it = 1; it <= 30; it++){
      let status = hero.value.spCount > 0 && hero.value.spCount%6 == 0? 1.5: 1;
      let enemyDps = (spEnemy[hero.value.spCount].stats.dmg - hero.value.def) * spEnemy[hero.value.spCount].stats.AS * it * 1.25 * status;
      let heroDps = (hero.value.attack - spEnemy[hero.value.spCount].stats.def) * hero.value.attacksPerSecond * it;
  
      if(heroDps >= spEnemy[hero.value.spCount].stats.hp * 1.25 * status && hero.value.maxHp > enemyDps && spEnemy[hero.value.spCount]?.status){
        hero.value.spCount++;
  
        if(hero.value.spCount%6 == 0)
          hero.value.st++;
        else 
          hero.value.sp += (Math.floor(hero.value.spCount/6) + 1);
      }
    }
  }

  const treeAuto = () => {
    if(!hero.value.treeAuto)
      return;

    let t = hero.value.treeTier;
    for (let perk of perks.value) {
      if (hero.value.perkPoints <= 0) break;
      if ((perk.infStatus && hero.value.perkPoints <= perk.baseCost )) break;
      if (perk.level < perk.maxLevel[t] || perk.infStatus) {
        perk.level++
        hero.value.perkPoints -= (perk.infStatus? perk.baseCost: 1);
      }
    }
  }

  const afkExp = () => {
    return  expCount() * (1 + (perks.value[3].value * perks.value[3].level * 0.01)) * equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult *
    (1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level) *
    (1 + hero.value.souls * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))) * (hero.value.rebirthPts >= 5? 2: 1) * (enemy.value.rebirthEnemy["drop"]);
  }

  const  formatNumber = (num) => {
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }

  const infHandle = () => {

    if(hero.value.infTier > 0 || hero.value.level >= 700){
      for(let idx = 0; idx < infGoals.value.length; idx++){
        if(infGoals.value[idx].tier < infGoals.value[idx].maxTier && infGoalsReq(idx)){
          hero.value.infPointsGoals += infGoals.value[idx].reward;
          infGoals.value[idx].tier++;
        }
      }
    }
  }

  const infPtsHandle = () => {
    infHandle();
    hero.value.infPoints = hero.value.infPointsGoals + enemy.value.dangerEnemyLoot[1];
  }
 
  const infGoalsReq = (idx) => {
    if(idx == 0 && hero.value.infTier > infGoals.value[0].tier) return true;
    if(idx == 1 && hero.value.abyssDStages >= 20 + 15 * infGoals.value[1].tier) return true;
    if(idx == 2 && hero.value.attack >= 2e6 * (infGoals.value[2].tier + 1)) return true;
    if(idx == 3 && hero.value.souls >= 100 + 20 * infGoals.value[3].tier) return true;
    if(idx == 4 && hero.value.eqUps['spRing'] >= 50 + 25 * (infGoals.value[4].tier)) return true;
    if(idx == 5 && hero.value.equipmentTiers['sword'] >= 11 + 3 * infGoals.value[5].tier) return true;
    if(idx == 6 && hero.value.level >= 750 + 50 * infGoals.value[6].tier) return true;
    if(idx == 7 && hero.value.trueLevel >= 1500 + 150 * infGoals.value[7].tier) return true;
    if(idx == 8 && hero.value.corruption >= 0.6 + 0.1 * infGoals.value[8].tier) return true;
    if(idx == 9 && hero.value.potential >= 200 + 50 * infGoals.value[9].tier) return true;

    return false;
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
    if(hero.value.sp >= 5)
      hero.value.infoActive.radiation = true;
    if(hero.value.level >= 700)
      hero.value.infoActive.infinity = true;
  }

  const test = () => {
    let a = hero.value.lent;
    hero.value.maxStage = 41;
    //hero.value.perkPoints = 90;
    //maxLevel -> eLevel in statsCalculating
    hero.value.soulsMax = 60;
    //hero.value.souls = 60;
    hero.value.stage = 40;
    hero.value.ascensionShards = 2100000;
    hero.value.stardust = 12322;
    hero.value.rebirthTier = 80;
    hero.value.abyssTier = 3;
    hero.value.exp = 1e9;
    hero.value.sp = 50;
    hero.value.st = 4;
    cursed[7].status = true;
    cursed[8].status = true;
    cursed[9].status = true;
    cursed[10].status = true;
    cursed[11].status = true;
    cursed[12].status = true;
    hero.value.mutagen = 12000;
    hero.value.abyssDStages = 81;
    //hero.value.infPoints = 234;
    hero.value.infTier = 7;
    hero.value.rebirthPts = 100000;
    buffs.value[4].tier = 3;
    hero.value.spCount = 5;
  }

  createEnemy();
  return {
    heroAttackBarProgress,
    enemyAttackBarProgress
  };
}
