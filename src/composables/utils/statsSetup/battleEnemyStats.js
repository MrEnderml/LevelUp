import { infBonusesHandler } from "../../battleUtils/global/infBonusesHandler";
import { divineSkills } from "../../../data/quasarCore";

export function setupEnemyBattleStats(stats, ctx) {
    const h = ctx.hero.value;
    const e = ctx.enemy.value;
    const p = ctx.player.value;
    const v = ctx.villian.value;
  
    stats.addHook("additive", (final) => {
      let dx = ctx.villian.value.dx;

      h.soulStageHp = statsEnemyHpHandle(15, 1);

      let hp = 1;
      hp *= statsEnemyHpHandle(h.stages.current, dx);
      hp *= ctx.progress.bossStats(ctx, "hp");
      hp *= ctx.progress.spawnStatus(ctx, 'soul')? ctx.soul.soulHp().total: 1;

      if (h.dId == 'bh') {
        let bhHp = [2.5e9, 1e10, 1e12, 1e15, 1e17, 1e100];
        //hp = e.bh.hp[h.bhTier];
        hp = bhHp[h.bhTier];
      }

      if (v.spawnType == 'd-corruption')
        hp = 1e100;

      final.hp = hp;
    });
  

    stats.addHook("additive", (final) => {
      let dx = v.dx;      

      let atk = 1;
      atk = statsEnemyAttackHandle(h.stages.current, dx);
      atk *= ctx.progress.bossStats(ctx, "dmg");
      atk *= ctx.progress.spawnStatus(ctx, 'soul')? ctx.soul.soulDmg().total: 1;

      if (h.dId == 'bh') {
        atk = v.bh.attack ** v.bh.stacks;
      }

      if (v.spawnType == 'd-corruption')
        atk = 5;

      final.atk = atk;
    });
  

    stats.addHook("post", (final) => {
      final.hp = Math.max(final.hp, 10);
      final.atk = Math.max(final.atk, 5);
    });
  
    
  
    function statsEnemyAttackHandle(stage, dx) {
        let spacePenalty = (!h.spaceUnlocked? 0.01: 0);
        let bv = 1.1 - spacePenalty - 0.001 * Math.floor(stage / 15);
        const baseAtk = 5 * bv ** stage;
        e.enemyStats.main.dmgStage = baseAtk;

        let mult = 1
      
        mult *= (h.isAbyss || h.isSingularity || h.gravity.isTrial) ? 1 : e.enemyPower ** 0.1
        mult *= h.abyssTier >= 2 ? 1 / (1.04 ** Math.log(h.ascensionShards + 1)) : 1
        mult *= ctx.ascension.perksHandler(33)
        mult *= ctx.ascension.perksHandler(49)
        mult *= infBonusesHandler(14, ctx.hero)
        mult *= h.isTravell? h.travellPenalty ** 0.5: 1;
        mult *= (h.dId == 'd-overstage' && v.spawnType == 'deBoss'? v.deBoss.stats.dmg: 1 );

        mult *= (h.isAbyss && h.rebirtMhTier >= 5) ? 1 / (1.025 ** h.rebirthTier) : 1
        mult *= h.isAbyss ? Math.max(1.04 - 0.01 * h.abyssTier + (h.abyssTier >= 3 ? 0.01 : 0), 1.02) ** stage : 1
        mult *= (h.isAbyss ? infBonusesHandler(5, ctx.hero) : 1)

        mult *= h.isSingularity ? Math.max(1000 - 120 * Math.min(h.singularity, 8), 1) : 1
        mult *= (h.gravity.isTrial || h.isSingularity) ? 1 - e.specialCreatures.dim4.loot * 0.01 : 1
        mult *= ctx.sing.singPower() ** 0.9;
        mult *= (h.gravity.isTrial || h.isSingularity ? infBonusesHandler(21, ctx.hero) : 1)
      
        mult *= ctx.dimensions.getDimEffect(3).dmg;
        mult *= ctx.dimensions.getDimEffect(20).dmg;
        mult *= ctx.dimensions.getDimEffect(26).dmg;

        mult *= ctx.abyss.corrInflueceHandle(0).dmg;
        mult *= ctx.timeline.timelineEffects().power ** 0.25;

        mult *= ctx.sing.singShardsEffect(1).dmg;
        mult *= ctx.sing.enemyShardsMult().dmg;

        mult *= ctx.void.voidEffects(5) ** 0.15;
      
        return baseAtk * dx * mult
    }
  
    function statsEnemyHpHandle(stage, dx) {
        let exp = 1;
        let startMult = Math.max(0.1 - 0.01 * Math.floor(stage / 5), 0);
        let baseMult = 1.1 + startMult;
        let ex = 1;

        if (stage > 100) exp += 0.04;
        if (stage > 200) exp += 0.04;
        if (stage > 300) exp += 0.04;
        if (stage > 400) exp += 0.04;
        if (stage > 500) exp += 0.04;

        const baseHp = 10 * baseMult ** stage ** exp;
        e.enemyStats.main.hpStage = baseHp;

        let mult = 1;
      
        
        mult *= (h.isAbyss || h.isSingularity || h.gravity.isTrial) ? 1 : e.enemyPower
        mult *= (h.abyssTier >= 2 ? 1 / (1.04 ** Math.log(h.ascensionShards + 1)) : 1)
       
        mult *= ctx.ascension.perksHandler(27)
        mult *= ctx.ascension.perksHandler(49)
        mult *= infBonusesHandler(14, ctx.hero)
        mult *= (h.dId.startsWith('d-') && h.isTravell ? 2 : 1)
        mult *= h.isTravell? h.travellPenalty: 1;
             
        mult *= (h.dId == 'd-overstage' && v.spawnType == 'deBoss'? v.deBoss.stats.hp: 1 );

        mult *= (h.isAbyss && h.rebirthTier >= 5 ? h.rebirthBonusesHandle[0].value : 1)
        mult *= h.isAbyss ? Math.max(1.05 - 0.01 * h.abyssTier + (h.abyssTier >= 3 ? 0.015 : 0), 1.03) ** stage : 1
        mult *= (h.isAbyss ? infBonusesHandler(5, ctx.hero) : 1);

        mult *= h.isSingularity ? Math.max(450000 - 75000 * Math.min(h.singularity, 8), 25000) : 1
        mult *= (h.gravity.isTrial || h.isSingularity)? 1 - e.specialCreatures.dim4.loot * 0.01 : 1
        mult *= (h.gravity.isTrial || h.isSingularity ? infBonusesHandler(21, ctx.hero) : 1)
        mult *= ctx.sing.singPower();

        mult *= ctx.dimensions.getDimEffect(2).hp;
        mult *= ctx.dimensions.getDimEffect(3).hp;
        mult *= ctx.dimensions.getDimEffect(20).hp;
        mult *= ctx.dimensions.getDimEffect(26).hp;

        mult *= ctx.abyss.corrInflueceHandle(0).hp;
        mult *= ctx.timeline.timelineEffects().power;

        mult *= ctx.sing.singShardsEffect(1).hp;
        mult *= ctx.sing.enemyShardsMult().hp;

        mult *= ctx.void.voidEffects(5);

        mult *= (h.selectedDivSkills.includes(16) ? divineSkills.value[16].values[1] : 1);

        

        ex = ex * ctx.ascension.perksHandler(32)

        return (baseHp * dx * mult) ** ex;
    }

    stats.addHook("post", (final) => {
      if(ctx.villian.value.hp > ctx.villian.value.stats.final.hp)
        ctx.villian.value.hp = ctx.villian.value.stats.final.hp;
    })

    stats.addHook("multiplicative", (final) => {
      let weakStack = v.status.weakStack.count * 0.01;
      
      final.hp *= 1 - weakStack
      final.atk *= 1 - weakStack
    });
  

    stats.addHook("additive", (final) => {
      let stage = 0.01 * ctx.hero.value.stages.current;

      let total = stage + ctx.dimensions.getDimEffect(39).vaps;

      final.aps += total;
    })

    stats.addHook("additive", (final) => {
      let aps = ctx.ascension.perksHandler(23);

      final.aps -= aps;
    })

    

  }
  