import { ref, computed, onMounted, onUnmounted} from 'vue';
import { perks } from '../data/perks.js';
import { perks as ascenPerks } from '../data/ascension.js';
import { equipment } from '../data/equipment.js';
import { addLog} from './logService.js';
import { getRandomVillainName } from '../composables/useEnemy.js';
import { soulNames } from '../data/souls.js';
import { cursed } from '../data/cursed.js';
import { amulets } from '../data/amulets.js';

export function useBattle(hero, enemy, buffs) {
  const heroAttackBarProgress = ref(0);
  const enemyAttackBarProgress = ref(0);

  addLog("Hey. Have a nice day!!!");

  const grantExp = () => {
    var exp = expCount() * (1 + (perks[3].value * perks[3].level * 0.01)) *
    equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult *
    (1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level) *
    (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 1.5: 1) *
    (enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.drop: 1) * (1 + hero.value.souls * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))) *
    (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? overkillHandle(): 1) *
    (1 + hero.value.cursedBonusExp) * (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
    (hero.value.rebirthPts >= 5? 2: 1) *
    ((enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1)) *
    (enemy.value.rebirthEnemy["drop"]) * 
    (hero.value.activeFormation == 3? 2: 1);

    addLog(`You killed ${enemy.value.name} and gained ${exp.toFixed(0)} exp`);
    hero.value.exp += exp;
    checkLevelUp();


  };

  const checkLevelUp = () => {
    if (hero.value.exp >= hero.value.nextLevelExp && hero.value.level < hero.value.maxLevel) {
      hero.value.exp -= hero.value.nextLevelExp;
      hero.value.eLevel++;
      hero.value.perkPoints++;
      hero.value.nextLevelExp = nextLevel(hero.value.eLevel);

      hero.value.eLevel += (hero.value.soulsMax >= 4 && hero.value.eLevel < hero.value.maxLevel * 0.25? (Math.random() * 100 + 1 >= 100? 1: 0): 0);
    }
    rebirthPtsHandle();
  };

  const nextLevel = (level) => {
    let rScale = (hero.value.rebirthPts >= 1?0.12:0) + (hero.value.rebirthPts >= 750?0.12:0) +(hero.value.rebirthPts >= 12500?0.12:0) +(hero.value.rebirthPts >= 90000?0.12:0);
    return Math.max(100, Math.floor(((level+9)**2)**(1 + level/700)) * (Math.log(level+2)**((0.6-rScale) * (hero.value.eLevel >= 100? 4: 1))) * 
    (hero.value.isAbyss? 1.0075 ** level: 1));
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
      statCalculate();
      buffActivation();
      soulHandle();
      rebirthHandle();rebirthPtsHandle();
      rebirthEnemyHandle();
      amuletsHandle();
      test();
      
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
      else if(cursed[5].time > 0)
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

        if (enemy.value.hp === 0) {
          //soul
          if(enemy.value.soulBuff.active){
            hero.value.souls = Math.min(hero.value.souls + 1, hero.value.soulsCap);
            if(hero.value.souls > hero.value.soulsMax){
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

          curseBonus();
          expBuffGrant();
          grantExp();

          enemy.value.soulBuff.active = false;
          weaponDrop();
         

          if(enemy.value.boss.isBoss){
            enemy.value.boss.isBoss = false;
            hero.value.kills = 0;
            hero.value.zone = 1;
            hero.value.stage++;
            hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
          }
            
          handleEnemyDefeat();
          createEnemy();

          enemyAttackBarProgress.value = 0;
          heroAttackBarProgress.value = 0;
          buffs.value[5].stuck = -1;
          buffs.value[1].used = false;
          buffs.value[1].usedSkill = true;
          
          buffs.value[4].used = true;
          buffs.value[10].rise = 1;
          buffs.value[12].dmg = 1;
          buffs.value[12].crit = 0;
          buffs.value[12].critDmg = 0;
          
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
        
        totalDMG *= AccurateBlowCurse();
        totalDMG *= flexibleBuff();
        if(buffs.value[10].buffT3 > 0) {
          totalDMG = 0;
          hero.value.hp = buffs.value[10].buffT3HP;
        }
        if(totalDMG > 0) comboResetBuff();
        hero.value.hp = Math.max(0, hero.value.hp - Math.max(totalDMG - hero.value.def, 0) - penetrateCurse()*buffs.value[0].ptr);
        enemyAttackBarProgress.value--;
        
      }


      if(hero.value.hp <= 0){
        extraLifeBuff();
        if(hero.value.hp <= 0){
          hero.value.resetKilledTime = 15;
          if(enemy.value.soulBuff.active){
            enemy.value.soulBuff.active = false;
            createEnemy();
          }

          if(enemy.value.boss.isBoss){
            enemy.value.boss.isBoss = false;
            hero.value.kills = 0;
            createEnemy();
          }
        }
      }


      if(hero.value.resetKilledTime > 0){
        let mult = 0.0125;
        mult = (perks[11].value * perks[11].level == 1? 0.0225: 0.0125);
        mult = (perks[11].value * perks[11].level == 2? 0.0325: 0.0125);
        mult = (perks[11].value * perks[11].level == 3? 0.05: 0.0125);
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
          hero.value.hp += ((1 - (hero.value.hp/hero.value.maxHp)) * 5) * (curse? cursed[11].mult: 1);
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

    }, interval);
  };

  const stopBattleLoop = () => {
    clearInterval(intervalId);
  };
  
  onMounted(startBattleLoop);
  onUnmounted(stopBattleLoop);
  
  const weaponDrop = () => {
    if(hero.value.maxStage > 1) {
      var totalDrop = (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 1? 3 : 1) * (1 + 0.75 * hero.value.soulTier) * 
      (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? overkillHandle(): 1) * 
      (enemy.value.boss.isBoss? enemy.value.boss.drop: 1) *
      (enemy.value.ascensionSoul.active || enemy.value.rebirthSoul? enemy.value.ascensionSoul.stats: 1) *
      (enemy.value.rebirthEnemy["drop"]) *
      (hero.value.activeFormation == 3? 2: 1);

      hero.value.dropChance['sword'] = 20 * (0.2 ** (hero.value.equipmentTiers['sword'] - ascenPerks[10].level )) * Math.log(hero.value.stage + 1) ** 1.1 *
      totalDrop;
      hero.value.dropChance['armor'] = 20 * (0.185 ** (hero.value.equipmentTiers['armor'] - ascenPerks[11].level )) * Math.log(hero.value.stage + 1) ** 1.13 *
      totalDrop;
      hero.value.dropChance['boots'] = 15 * (0.17 ** (hero.value.equipmentTiers['boots'] - ascenPerks[12].level )) * Math.log(hero.value.stage + 1) ** 1.16 * 
      totalDrop;
      hero.value.dropChance['ring'] = 8 * (0.15 ** (hero.value.equipmentTiers['ring'] - ascenPerks[13].level )) * Math.log(hero.value.stage + 1) ** 1.2 * 
      totalDrop;
      

      if (Math.random() * 100 + hero.value.dropChance['sword'] >= 100 &&
          hero.value.equipmentTiers['sword'] < hero.value.eqTierReq['sword']){
            hero.value.equipmentTiers['sword']++;
            addLog(`You dropped the ${ equipment[0].tiers[hero.value.equipmentTiers['sword']].name } T[${ hero.value.equipmentTiers['sword'] }]`)
      }

      if (Math.random() * 100 + hero.value.dropChance['armor'] >= 100 &&
          hero.value.equipmentTiers['armor'] < hero.value.eqTierReq['armor']){
            hero.value.equipmentTiers['armor']++;
            addLog(`You dropped the ${ equipment[1].tiers[hero.value.equipmentTiers['armor']].name } T[${ hero.value.equipmentTiers['armor'] }]`)
      }

      if (Math.random() * 100 + hero.value.dropChance['boots'] >= 100 &&
          hero.value.equipmentTiers['boots'] < hero.value.eqTierReq['boots']){
            hero.value.equipmentTiers['boots']++;
            addLog(`You dropped the ${ equipment[2].tiers[hero.value.equipmentTiers['boots']].name } T[${ hero.value.equipmentTiers['boots'] }]`)
      }

      if (Math.random() * 100 + hero.value.dropChance['ring'] >= 100 &&
          hero.value.equipmentTiers['ring'] < hero.value.eqTierReq['ring']){
            hero.value.equipmentTiers['ring']++;
            addLog(`You dropped the ${ equipment[3].tiers[hero.value.equipmentTiers['ring']].name } T[${ hero.value.equipmentTiers['ring'] }]`)
      }


    }
  }
  const curseBonus = () => {
    let bonus = 0;
    for(let id of hero.value.activeCurse){
      bonus += cursed[id].tier[hero.value.activeCurseTier[id]].bonus;
    }
    hero.value.activeCurse = [];

    hero.value.cursedBonusExp = Math.pow(bonus, (1 + 0.05 * Math.max(hero.value.activeCurse.length - 1, 0))) * 
    (1 / Math.log(Math.max(2, 50 - hero.value.stage)) * (hero.value.rebirthTier >= 10? 1.5: 1)) / 10;

    hero.value.cursedBonus = (hero.value.cursedBonusExp * 10) * (hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3) * (hero.value.rebirthPts >= 10? 2: 1) * 
    (hero.value.rebirthPts >= 50000? enemy.value.rebirthEnemy["drop"]: 1) * 
    (hero.value.isAbyss? 0: 1) * 
    (hero.value.activeFormation == 3? 2: 1);
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
        }
        
        return;
      }
      

      let countCurse = Math.floor(Math.random() * (hero.value.curse + 1));
      let tier = 0;
      let stuck = [];

      let t3 = Math.min(10, 1 * Math.log(hero.value.stage - 17)**1.75);
      let t2 = Math.min(40, 10 * Math.log(hero.value.stage - 17)**0.75);
      let t1 = 100 - t2 - t3;

      for(var count = 0; count < countCurse; count++) {
        var chance = Math.random() * 100;

        if (chance < t1)
          tier = 0
        else if(chance < t2)
          tier = 1
        else
          tier = 2

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
    }
  }
  //1
  const activeBloodCurse = (interval) => {
    if (hero.value.activeCurse.includes(1)){
      cursed[1].time += interval / 1000;
      if (hero.value.activeCurseTier[1] == 0) {
        enemy.value.hp += cursed[1].time >= 1? enemy.value.maxHp * 0.03: 0; 
      }
      if (hero.value.activeCurseTier[1] == 1) {
        enemy.value.hp += cursed[1].time >= 1? enemy.value.maxHp * 0.06: 0; 
      }
      if (hero.value.activeCurseTier[1] == 2) {
        enemy.value.hp += cursed[1].time >= 1? enemy.value.maxHp * 0.1: 0; 
      }
      enemy.value.hp = Math.min(enemy.value.hp, enemy.value.maxHp);
      cursed[1].time = cursed[1].time >= 1? 0: cursed[1].time;
    }
    cursed[1].time = hero.value.activeCurse.includes(1)? cursed[1].time: 0;
  }
  //0
  const penetrateCurse = () => {
    if (hero.value.activeCurse.includes(0)){
      let penetrate = 0
      if (hero.value.activeCurseTier[0] == 0) {
        penetrate = 0.15;
      }
      if (hero.value.activeCurseTier[0] == 1) {
        penetrate = 0.3;
      }
      if (hero.value.activeCurseTier[0] == 2) {
        penetrate = 0.45;
      }

      return enemy.value.attack > hero.value.def? hero.value.def * penetrate: enemy.value.attack * penetrate
    }
    return 0;
  }
  //2
  const cursedShieldCurse = () => {
    if (hero.value.activeCurse.includes(2)){
      let block = 0
      if (hero.value.activeCurseTier[2] == 0) {
        block = 0.12;
      }
      if (hero.value.activeCurseTier[2] == 1) {
        block = 0.24;
      }
      if (hero.value.activeCurseTier[2] == 2) {
        block = 0.36;
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
        speed = 0.8;
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
        avoid = (chance + 8 >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 1) {
        avoid = (chance + 16 >= 100? 0: 1);
      }
      if (hero.value.activeCurseTier[4] == 2) {
        avoid = (chance + 24 >= 100? 0: 1);
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
        cursed[5].time = chance + 10 > 100? 0.5: 0;
      }
      if (hero.value.activeCurseTier[5] == 1) {
        cursed[5].time = chance + 15 > 100? 0.7: 0;
      }
      if (hero.value.activeCurseTier[5] == 2) {
        cursed[5].time = chance + 20 > 100? 0.9: 0;
      }
    }
  }
  //6
  const AccurateBlowCurse = () => {
    if (hero.value.activeCurse.includes(6)){
      let chance = Math.random() * 100;
      let crit = 1;
      if (hero.value.activeCurseTier[6] == 0) {
        crit = chance + 30 > 100? 1.5: 1;
      }
      if (hero.value.activeCurseTier[6] == 1) {
        crit = chance + 25 > 100? 2: 1;
      }
      if (hero.value.activeCurseTier[6] == 2) {
        crit = chance + 20 > 100? 2.5: 1;
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
        cursed[10].time = chance? 2: cursed[10].time;
      }
      if (hero.value.activeCurseTier[10] == 1) {
        chance = Math.random() * 100 + 10 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.2;
        cursed[10].time = chance? 3: cursed[10].time;
      }
      if (hero.value.activeCurseTier[10] == 2) {
        chance = Math.random() * 100 + 15 >= 100? true: false;
        cursed[10].bleed = enemy.value.attack * 0.3;
        cursed[10].time = chance? 4: cursed[10].time;
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
      enemy.value.hp = enemy.value.maxHp;
    }
  }

  const createEnemy = () => {
    if(enemy.value.boss.isBoss){
      enemy.value.boss.isBoss = true;
      enemy.value.boss.attack = Math.max(Math.sqrt(1.035**hero.value.stage)**(1.04 + 0.02*Math.floor(hero.value.stage/10)), 1.5); 
      enemy.value.boss.hp = Math.max(Math.sqrt((hero.value.stage / 5) + Math.log(hero.value.stage)**(0.55+0.08*Math.floor(hero.value.stage/5))), 2);
      enemy.value.boss.drop = Math.sqrt((hero.value.stage / 5) * Math.log(hero.value.stage));
    }
    if(!enemy.value.boss.isBoss || hero.value.isAbyss)
      cursedAffect();

    createSoul();
    createAscensionSouls();

    var dx = getRandomFloat(0.7 + hero.value.zone * 0.04, 1.1 + hero.value.zone * 0.06)
    statEnemyCalculate(dx)

    titanCurse();
    steelSkinCurse();
    MusclesCurse();

    enemy.value.name = enemy.value.soulBuff.active || enemy.value.rebirthSoul? soulNames[hero.value.souls%50]:  getRandomVillainName();

    function getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  const createSoul = () => {
    if( hero.value.stage > 14 && !enemy.value.boss.isBoss){ //soul
      let dx = 60 * ((0.42 + 0.005 * hero.value.souls) ** (hero.value.souls));
      let dy = Math.max((Math.log(hero.value.stage - 14) ** Math.log(hero.value.stage**Math.pow(Math.log(hero.value.stage-12), 0.55) - 14)), 1);
      let filterCursed = cursed.filter(curse => curse.status === true);

      enemy.value.soulBuff.chance = dx * dy * (ascenPerks[16].level? 1 + 0.15 * hero.value.souls: 1) * (1 + 0.2 * (hero.value.rebirthPts >= 1000? hero.value.rebirthTier: 0)) *
      (hero.value.rebirthPts >= 20? enemy.value.rebirthEnemy["drop"]: 1) * (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 2? 3 : 1) *
      (hero.value.abyssTier >= 1? (1 + 0.5 * filterCursed.length): 1) * (perks[13].level? 1.06 ** Math.sqrt(hero.value.perkPoints): 1);

      enemy.value.soulBuff.active = Math.random() * 100 + enemy.value.soulBuff.chance >= 100? true: false;

      if(!enemy.value.soulBuff.active && hero.value.rebirthTier >= 20){
        enemy.value.rebirthSoul = Math.random() * 100 + enemy.value.soulBuff.chance * 5  >= 100? true: false;
      }

      if(hero.value.soulsMax >= 30 && (enemy.value.soulBuff.active || enemy.value.rebirthSoul))
        hero.value.hp = hero.value.maxHp;

      enemy.value.soulBuff.dmg = Math.pow( Math.log((hero.value.stage + hero.value.souls*2.5)**0.35), (hero.value.stage + hero.value.souls*2)**0.115) * 
      (ascenPerks[19].level? 0.85: 1);
      enemy.value.soulBuff.hp = Math.pow( Math.log((hero.value.stage + hero.value.souls*3.5)**0.4), (hero.value.stage + hero.value.souls*2.5)**0.125) * 
      (ascenPerks[19].level? 0.85: 1);
      enemy.value.soulBuff.drop = Math.pow( Math.log(hero.value.stage**0.5), hero.value.stage**0.175) * (ascenPerks[20].level? 1.3: 1);
    } 
  }

  const createAscensionSouls = () => {
    if(hero.value.stage >= 20 && hero.value.abyssTier >= 2){
      let chance = Math.min(4 ** (1.03 + 0.015 * (hero.value.stage - 20)), 10);
      let dx = 2 ** (1.01 + 0.01 * (hero.value.stage - 20));

      enemy.value.ascensionSoul.active = (Math.random() * 100 + chance >= 100 && !enemy.value.boss.isBoss && !enemy.value.soulBuff.active && !enemy.value.rebirthSoul? true: false);
      enemy.value.ascensionSoul.stats = dx;
    }
  }
  //stats
  const statEnemyCalculate = (dx) => {
    enemy.value.attack = 10 * ((1.04 ** (hero.value.stage + 1)) ** (1.15 + 0.125*Math.floor(hero.value.stage/5))) * dx * 
    (enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.dmg: 1) * 
    (enemy.value.boss.isBoss? enemy.value.boss.attack: 1) * 
    enemy.value.rebirthEnemy["dmg"] * 
    (hero.value.isAbyss? Math.max(1.055 - 0.01 * hero.value.abyssTier, 1.02) ** hero.value.stage: 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) * 
    (hero.value.abyssTier >= 2? 1 / (1.04 ** Math.log(hero.value.ascensionShards + 1)): 1) * 
    (hero.value.isAbyss && hero.value.rebirthTier >= 5? (1 / (1.025 ** hero.value.rebirthTier)): 1);

    enemy.value.maxHp = 40 * ((((1.065 - 0.00075 * Math.floor(hero.value.stage/5))** hero.value.stage) ** (1.3+0.225*Math.sqrt(hero.value.stage/2))) / (2 - (hero.value.stage > 14? 0.5: 0) - (hero.value.stage > 19? 0.5: 0))) * dx * 
    (enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.hp: 1) *
    (enemy.value.boss.isBoss? enemy.value.boss.hp: 1) *
    enemy.value.rebirthEnemy["hp"] * 
    (hero.value.isAbyss? Math.max(1.085 - 0.02 * hero.value.abyssTier, 1.03) ** hero.value.stage: 1) *
    (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1) *
    (hero.value.abyssTier >= 2? 1 / (1.04 ** Math.log(hero.value.ascensionShards + 1)): 1) *
    (hero.value.isAbyss && hero.value.rebirthTier >= 5? (1 / (1.025 ** hero.value.rebirthTier)): 1) *
    (1 - ascenPerks[22].level*0.01); 


    enemy.value.hp = enemy.value.maxHp;

    enemy.value.def = 0;

    enemy.value.attacksPerSecond = 0.4 + Math.min(1, (0.1 * Math.floor(hero.value.stage / 5))) + fastReflexesCurse();
    enemy.value.attacksPerSecond -= (ascenPerks[23].level * 0.15)
    enemy.value.attacksPerSecond = Math.min(enemy.value.attacksPerSecond, 3.9);
    enemy.value.attacksPerSecond = Math.max(enemy.value.attacksPerSecond, 0.4);
  }

  const eqStatsHandle = () => {
    hero.value.eqTierReq['sword'] = 3 + (ascenPerks[1].level == 1? 1: 0) + (ascenPerks[10].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0);

    hero.value.eqTierReq['armor'] = 3 + (ascenPerks[2].level == 1? 1: 0) + (ascenPerks[11].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0);

    hero.value.eqTierReq['boots'] = 3 + (ascenPerks[3].level == 1? 1: 0) + (ascenPerks[12].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0);

    if (ascenPerks[5].level == 1) {
      hero.value.eqTierReq['ring'] = 3 + (ascenPerks[4].level == 1? 1: 0) + (ascenPerks[13].level == 1? 1: 0) + (hero.value.rebirthPts >= 15? 1: 0);
    }
    else 
      hero.value.eqTierReq['ring'] = 0
  }

  const statCalculate = () => {
    hero.value.attack = 10 + (((1 + 0.2 * Math.floor(hero.value.potential/20)) * (hero.value.level-1))) * 
    (perks[0].value ** perks[0].level).toFixed(2) * 
    equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.multDmg;
    //first stirke
    
    hero.value.attack *= (hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 1 && !buffs.value[1].used)? 2: 1
    hero.value.attack *= (hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 2 && !buffs.value[1].used)? hero.value.critAttack*0.01: 1
    //combo
    hero.value.attack *= buffs.value[3].tier == 1? (1 + 0.01 * buffs.value[3].combo): 1;
    hero.value.attack *= buffs.value[3].tier == 2? (1 + 0.0125 * buffs.value[3].combo): 1;
    hero.value.attack *= buffs.value[3].tier == 3? (1 + 0.014 * buffs.value[3].combo): 1;
    hero.value.attack *= buffs.value[3].tier == 4? (1 + 0.015 * buffs.value[3].combo): 1;
    //conquer
    hero.value.attack *= (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 2? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1);
    //extra life
    hero.value.attack *= (buffs.value[10].buffT2 > 0? 1.5: 1);
    //berserk
    hero.value.attack *= (buffs.value[12].dmg);


    hero.value.crit = 0 + (perks[7].level * perks[7].value) + (hero.value.rebirthPts >= 150? 5: 0) + (buffs.value[12].crit); 
    hero.value.critAttack = 150 + (perks[8].level * perks[8].value) + (buffs.value[12].critDmg) + (hero.value.activeBuffs.includes(11)? 75: 0);
    
    hero.value.attack *= (hero.value.activeFormation == 1? 2: 1);
    hero.value.attack *= (hero.value.activeFormation == 0? 0.5: 1);
    hero.value.attack *= (hero.value.activeFormation == 2? 0.5: 1);
    hero.value.attack *= (hero.value.activeFormation == 3? 0.5: 1);

    hero.value.maxHp = (100 + ((2 + 0.5 * Math.floor(hero.value.potential/10)) * (hero.value.level-1))) + 
    (perks[1].value * perks[1].level) +
    equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp;
    hero.value.maxHp *= (hero.value.activeFormation == 0? 2: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 1? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 2? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeFormation == 3? 0.5: 1);
    hero.value.maxHp *= (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1);
    


    hero.value.def = 0 + ((0.5 + 0.1 * Math.floor(hero.value.potential/30)) * (hero.value.level-1)) * (1 + ((perks[2].value * perks[2].level)*0.01)) *
    buffs.value[0].def;
    hero.value.def *= (hero.value.activeFormation == 2? 2: 1);
    hero.value.def *= (hero.value.activeFormation == 1? 0.5: 1);
    hero.value.def *= (hero.value.activeFormation == 0? 0.5: 1);
    hero.value.def *= (hero.value.activeFormation == 3? 0.5: 1);
    //extra lifeasd
    hero.value.def *= (buffs.value[10].buffT2 > 0? 1.25: 1);


    hero.value.level = Math.min(hero.value.maxLevel, hero.value.eLevel + eqCpmplect() + (ascenPerks[26].level? Math.floor(hero.value.stage/5)-1: 0) + 
    ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)) + perks[12].level );
    hero.value.maxReachedLevel = Math.max(hero.value.maxReachedLevel, hero.value.level);

    hero.value.maxLevel = 30 + (perks[4].value * perks[4].level) + ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level + hero.value.souls +
    (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap + equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap +
    equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap + equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap) +
    (amulets[0].status? 4: 0) + (amulets[1].status? 8: 0) + (amulets[2].status? 12: 0) + (amulets[3].status? 16: 0) + 
    eqCpmplect() + (ascenPerks[26].level? 2*Math.floor(hero.value.stage/5)-1: 0);

    hero.value.maxLevel *= 1 + (amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + (amulets[3].prefix.status? 0.08: 0);
    hero.value.maxLevel = Math.floor(hero.value.maxLevel);
    hero.value.maxLevel = Math.min(hero.value.maxLevel, 100 + 10*hero.value.rebirthTier);

    if(hero.value.level > hero.value.maxLevel){
      hero.value.level = hero.value.maxLevel;
      hero.value.nextLevelExp = nextLevel(hero.value.eLevel);
    }
      
    hero.value.divLevel = hero.value.level - hero.value.eLevel;

    hero.value.attacksPerSecond = 0.5 + (perks[5].value * perks[5].level) + 
    equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed + 
    (buffs.value[3].combo == 100? 0.3: 0) + 
    (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? 0.1 * Math.floor(buffs.value[8].time/250): 0);
    hero.value.attacksPerSecond -= hero.value.activeBuffs.includes(5)? buffs.value[5].debuff: 0;

    hero.value.attacksPerSecond = Math.min(hero.value.attacksPerSecond, 4);
    hero.value.attacksPerSecond = Math.max(hero.value.attacksPerSecond, 0.5);

    hero.value.avoid = 0 + (hero.value.rebirthPts >= 1750? 8: 0);
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
    if (perks[6].level) 
      buffs.value[0].active = true;

    if (perks[9].level)
      buffs.value[2].active = true;

    if (ascenPerks[7].level)
      buffs.value[1].active = true;

    if (ascenPerks[17].level)
      buffs.value[3].active = true;

    if (ascenPerks[25].level)
      buffs.value[5].active = true;

    if (hero.value.soulsMax >= 10)
      buffs.value[4].active = true;

    if (hero.value.soulsMax >= 20)
      buffs.value[7].active = true;

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
      if(buffs.value[3].tier == 4){
        buffs.value[3].combo = buffs.value[3].combo * 0.75;
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

    let chance = (Math.random()*100 + 20 >= 100? 1: 0);
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
      buffs.value[5].stuck += (Math.random()*100 + 35 >= 100? 1: 0);
    }
    if(hero.value.activeBuffs.includes(5) && buffs.value[5].tier >= 2){
      buffs.value[5].debuff = 0.6;
      buffs.value[5].stuck += (Math.random()*100 + 10 >= 100? 1: 0);
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
      
    let chance;
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 1){
      chance = Math.random() * 100 + 15 + hero.value.crit >= 100;
    }
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 2){
      hero.value.attack *= (hero.value.crit + 15 >= 100? 2: 1);
    }
    if(hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 3){
      if(!chance)
        chance = Math.random() * 100 + 15 + hero.value.crit >= 100;
    }

    hero.value.attack *= (chance? (hero.value.critAttack)*0.01: 1);
  }

  const berserkBuff = () => {
    if(hero.value.activeBuffs.includes(12) && buffs.value[12].tier >= 1){
      buffs.value[12].dmg = (1 + (1 - hero.value.hp / hero.value.maxHp ) * 2); 
    }
    if(hero.value.activeBuffs.includes(12) && buffs.value[12].tier >= 2){
      buffs.value[12].crit = (1 - hero.value.hp / hero.value.maxHp) * 15;
      buffs.value[12].critDmg = (1 - hero.value.hp / hero.value.maxHp) * 100;
    }
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

  }

  const ascensionShardsProgress = (stage) => {
    var x = Math.sqrt(Math.log(stage) ** (stage/8)) * (1 + hero.value.maxLevel / 100);
    x *= hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 1.5: 1;
    x *= enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1;
    x *= (enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats * 0.35: 1);
    x *= (enemy.value.ascensionSoul.active && hero.value.activeFormation == 3? 2: 1);

    if(enemy.value.ascensionSoul.active){
      hero.value.ascensionShards += x;
      addLog(`You gain ${x.toFixed(2)} ascension shards `);
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
    addLog(`You gain ${x.toFixed(2)} ascension shards  `)
  }

  const handleEnemyDefeat = () => {
    hero.value.kills = Math.min(hero.value.kills + (!hero.value.isStage? 0: overkillHandle()), Math.floor(hero.value.killsPerZone));

    if(hero.value.rebirthPts >= 20000 && hero.value.stage <= hero.value.maxStage * 0.25){
      let chance = Math.random()*100 + 1 >= 100? 1: 0;
      if(chance){
        hero.value.stage++;
        hero.value.zone = 1;
        hero.value.kills = 0;
        refreshKillsPerZone();
      }
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
        if (hero.value.stage > 10)
          ascensionShardsProgress(hero.value.stage);
      }

      refreshKillsPerZone();
    }
  }

  const overkillHandle = () => {
    var totalKills = 1

    totalKills += ascenPerks[21].level? 1: 0;

    if (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 1){
      totalKills+=1
    }
    if (hero.value.activeBuffs.includes(7) >= 2 && buffs.value[7].tier >= 2){
      totalKills+=Math.floor(hero.value.maxLevel/100);
    }
    if (hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 3){
      totalKills+= Math.floor(hero.value.level/50);
    }

    return totalKills;
  }

  const refreshKillsPerZone = () => {
    var x = (hero.value.stage > 9? 1.35: 1.15) - (perks[10].value * perks[10].level) - (ascenPerks[15].level == 1? 0.01: 0) - (hero.value.soulTier >= 2? 0.01: 0) - 
    (hero.value.rebirthPts >= 125? 0.01: 0) -  (hero.value.rebirthPts >= 22500? 0.01: 0);

    var end = 5 * (hero.value.stage-1) + hero.value.zone;
    var start = 5;
    for(var i = 1; i < end; i++){
      start *= x;
      if(i > 1 && i%5 == 0){
        var baseMult = 0;
        for(var y = 0; y < Math.floor((hero.value.stage - 1) / 5); y++)
          baseMult += 0.0125
        
        start *= 0.2 + baseMult;
        start = Math.max(start, 5);
      }
      //console.log("Stage: " + hero.value.stage, "Zone: " + hero.value.zone, start);

    }
    hero.value.killsPerZone = start;
  }

  const expCount = () => {
    return Math.log(hero.value.stage + 4)**3.7;
  }

  const soulHandle = () => {
    amulets[1].status = hero.value.soulsMax >= 20? true: false;
    amulets[1].suffix.status = hero.value.soulsMax >= 30? true: false;
    amulets[1].prefix.status = hero.value.soulsMax >= 40? true: false;

    perks[0].value = 1.01 + (hero.value.soulsMax >= 40? 0.001 * hero.value.treeTier: 0);

    hero.value.formationTypes[2].status = (hero.value.soulsMax >= 40? true: false);

    hero.value.soulTier = Math.floor(hero.value.souls/10);
  }

  const rebirthPtsHandle = () => {
    let pts =  1 + (Math.log(hero.value.level - 98)**(hero.value.level/Math.max(100 - (1 * hero.value.level/50), 1))) * 
      (hero.value.rebirthPts >= 9000? enemy.value.rebirthEnemy["drop"]: 1) * (1.2 ** hero.value.abyssTier) * 
      (perks[14].level? perks[14].value: 1) * (hero.value.soulTier >= 4? 1.5: 1) * 
      (hero.value.rebirthPts >= 1250? Math.min((1 + 0.01 * hero.value.rebirthTier) ** 8, 2) * ((1 + 0.01 * Math.max(hero.value.rebirthTier - 9, 0)) ** 2) : 1);
    if (hero.value.level > 100){
      hero.value.totalRebirthPts = pts;
    } 
    if(enemy.value.rebirthSoul && enemy.value.hp <= 0){
      let totalPts = (pts ** 0.1) * ((hero.value.stage - 20)/ 10) * (hero.value.activeFormation == 3? 2: 1);
      hero.value.rebirthPts += totalPts;
      addLog(`You gain ${totalPts.toFixed(2)} Rebirth Pts from ${enemy.value.name}`);
    }
  }

  const rebirthHandle = () => {
    hero.value.potential = (hero.value.rebirthPts >= 3? 10: 0) + (hero.value.rebirthPts >= 75? 10: 0) + (hero.value.rebirthPts >= 250? 10: 0) + 
    (hero.value.rebirthPts >= 5000? 10: 0) + (hero.value.rebirthPts >= 17500? 10: 0) + (hero.value.rebirthPts >= 60000? 10: 0);


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
      let drop = ((dmg + hp)**0.75);
      enemy.value.rebirthEnemy["dmg"] = dmg.toFixed(2);
      enemy.value.rebirthEnemy["hp"] = hp.toFixed(2);
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

  const afkKillsHandle = () => {
    if(hero.value.afkKills > 0){
      let buffExp = 0;
      if(hero.value.stage > 19){
        buffExp = (hero.value.afkKills * (hero.value.curse * 0.025) * hero.value.stage) * (hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3) * 
        (hero.value.rebirthPts >= 10? 2: 1) * (hero.value.rebirthPts >= 50000? enemy.value.rebirthEnemy["drop"]: 1) * (hero.value.isAbyss? 0: 1);
        hero.value.cursedBonus = buffExp;
        expBuffGrant();
      }

      if(hero.value.isLocked && hero.value.afkLocked){
        let exp = hero.value.afkKills * afkExp();
        hero.value.afkKills = 0;
        hero.value.exp += exp;
        
        hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
        hero.value.afkMessage = `Offline bonus for ${Math.floor(hero.value.afkTime / 3600)}h ${Math.floor(hero.value.afkTime/60%60)}m ${hero.value.afkTime%60}s 
        (MAX - 8h). You gained ${exp.toFixed()} EXP. Buff EXP ${Math.floor(buffExp)}`;
        hero.value.afkLocked = false;
        return;
      }


      let totalExp = 0;
      let currentStage = hero.value.stage;
      let currentZone = hero.value.zone;

      while(hero.value.afkKills > 0){
        if(hero.value.afkKills - hero.value.killsPerZone > 0){
          hero.value.afkKills -= Math.floor(hero.value.killsPerZone);
          totalExp += Math.floor(hero.value.killsPerZone) * afkExp();
          hero.value.zone++;
          refreshKillsPerZone();
        } else {
          hero.value.kills = Math.floor(hero.value.afkKills);
          totalExp += Math.floor(hero.value.afkKills) * afkExp();
          hero.value.exp += totalExp;
          hero.value.afkKills = 0;

          hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
          hero.value.afkMessage = `Offline bonus for ${Math.floor(hero.value.afkTime / 3600)}h ${Math.floor(hero.value.afkTime/60%60)}m ${hero.value.afkTime%60}s 
          (MAX - 8h). You gained ${totalExp.toFixed()} EXP.  Buff EXP ${Math.floor(buffExp)}. You passed from ${currentStage} stage ${currentZone} zone -> ${hero.value.stage} stage ${hero.value.zone} zone`;
          return;
        }


        if(hero.value.afkKills - hero.value.killsPerZone > 0 && hero.value.zone == 5 && hero.value.stage > 5 && hero.value.stage%5 == 4){
          if(hero.value.maxStage - 15 > hero.value.stage){
            hero.value.afkKills -= Math.floor(hero.value.killsPerZone);
            totalExp += Math.floor(hero.value.killsPerZone) * afkExp();
            hero.value.zone++;
            refreshKillsPerZone();
          } else {
            hero.value.kills = Math.floor(hero.value.killsPerZone) - 5;
            totalExp += Math.floor(hero.value.killsPerZone - 5) * afkExp();
            hero.value.afkKills = 0;
            hero.value.exp += totalExp;

            hero.value.showAfkPopup = hero.value.showAfkPopupRule? true: false;
            hero.value.afkMessage = `Offline bonus for ${Math.floor(hero.value.afkTime / 3600)}h ${Math.floor(hero.value.afkTime/60%60)}m ${hero.value.afkTime%60}s 
            (MAX - 8h). You gained ${totalExp.toFixed(0)} EXP. Buff EXP ${Math.floor(buffExp)}. You passed from ${currentStage} stage ${currentZone} zone -> ${hero.value.stage} stage ${hero.value.zone} zone`;
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
      }
    }
  }

  const afkExp = () => {
    return  expCount() * (1 + (perks[3].value * perks[3].level * 0.01)) * equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult *
    (1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level) *
    (1 + hero.value.souls * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))) * (hero.value.rebirthPts >= 5? 2: 1) * (enemy.value.rebirthEnemy["drop"]);
  }

  const test = () => {
    let a = hero.value.mutation;
  }

  createEnemy();
  return {
    heroAttackBarProgress,
    enemyAttackBarProgress
  };
}
