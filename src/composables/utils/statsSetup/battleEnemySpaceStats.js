import { spaceShopHandler } from "../../battleUtils/global/spaceShopHandler";

export function setupSpaceEnemyBattleStats(engine, eStats, hStats, v, p, ctx) {
    const h = ctx.hero.value;
    const e = ctx.enemy.value;

    eStats.addHook("additive", (final) => {

        let count = ctx.hero.value.spCount;
        let spCount = ctx.hero.value.spbCount;
        let bossMult = (count > 0 && count%6 == 5? 1.5 + 0.1 * spCount: 1);
        let spsCount = ctx.hero.value.spsCount;

        let hpBase = 40000;
        let hpExp = 1.425 - 0.04 * Math.min(spCount, 3);
        let atkBase = 300;
        let defBase = 1500;

        final.hp = (hpBase *
        hpExp ** count * 
        0.85 ** Math.min(spCount, 3) * 
        bossMult * 
        infWarden("hp", spsCount) * 
        statsMult().mult) ** 
        statsMult().exp;

        final.atk = (atkBase * 
        1.175 ** count * 
        0.6 ** Math.min(spCount, 3) * 
        bossMult ** 0.35 *
        infWarden("dmg", spsCount) * 
        statsMult().mult) ** 
        statsMult().exp;

        final.def = (defBase *
        1.2 ** count *
        0.7 ** Math.min(spCount, 3) *
        bossMult ** 0.7 * 
        infWarden("def", spsCount) * 
        statsMult().mult) ** 
        statsMult().exp;

        final.aps += 0.5 + 0.05 * spCount + 0.01 * spsCount;
        
    });

    function statsMult () {
      let mult = 1;
      let exp = 1;

      mult *= ctx.abyss.abyssHandler(9);
      mult *= ctx.dimensions.getDimEffect(37);
      mult *= (1 / spaceShopHandler(4, ctx.hero));

      if (ctx.dimensions.getDimEffect(37) == 1)
        exp *= ctx.dimensions.getDimReward(37).debuff;

      return {
        exp: exp,
        mult: mult,
      }
    }


    function infWarden (type, spsCount) {
      if (!h.isInfSpace) return 1;

      switch(type) {
        case "hp": return 1.5 ** spsCount * 1000;
        case "dmg": return 1.05 ** spsCount * 2;
        case "def": return 1.15 ** spsCount * 150;
      }
    }

    
    //1
    hStats.addHook("multiplicative", (final) => {
      if(h.spbCount < 1) return;
      let def = v.value.space.stats.defIgnore.raw * 0.01;
      
      final.def *= 1 - def;
    });
    //2
    engine.addHook("beforeTick", (ctx) => {
      if(h.spbCount < 2) return;
      if(ctx.villian.dead || ctx.player.dead) return;

      let regen = v.value.space.stats.hpRegen.raw * 0.01;
      let maxHp = ctx.villian.stats.final.hp;

      let total = regen * maxHp * (ctx.player.status.critMls.healBlock > 0? 0: 1)

      ctx.villian.hp = Math.min(ctx.villian.hp + total * ctx.dt, maxHp);
    })
    //3
    engine.addHook("beforeEnemyDamage", (ctx) => {
      if(h.spbCount < 3) return;
  
      let chance = v.value.space.stats.blockChance.raw;

      if (Math.random()*100 < chance) {
        ctx.player.attack.final = 0;
  
        ctx.player.attack.effects.push({
          type: "block",
          icon: "🔰",
        });
      }
    });
    //4
    eStats.addHook("additive", (final) => {
      if(h.spbCount < 4) return;

      let crit = v.value.space.stats.critChance.raw;
      let critDmg = v.value.space.stats.critDMG.raw;

      final.crit += crit;
      final.critDmg += critDmg;
    });
    //5
    engine.addHook("afterHeroAttack", (ctx) => {
      if(h.spbCount < 5) return;

      let chance = v.value.space.stats.stunChance.raw;
      let duration = v.value.space.stats.stunDuration.raw;

      if (Math.random()*100 < chance) {

        ctx.player.status.stun.d = duration;

        ctx.player.attack.effects.push({
          type: "stun",
          icon: "💫",
        });
      }
    });
    //6
    eStats.addHook("additive", (final) => {
      if(h.spbCount < 6) return;

      let aps = v.value.space.stats.aps.raw;

      final.aps += aps;
    });
    //7
    engine.addHook("beforeEnemyAttack", (ctx) => { 
      if(h.spbCount < 7) return;
      
      let chance = v.value.space.stats.multiHit.raw%100;
      let extraHit = Math.floor(v.value.space.stats.multiHit.raw / 100);
      
    
      ctx.player.extras.hits += extraHit;
      ctx.player.extras.chance += chance;
    });
    //8
    eStats.addHook("additive", (final) => {
      if(h.spbCount < 8) return;

      let hit = v.value.space.stats.hit.raw;

      final.hit += hit;
    });
    //9 - 10
    engine.addHook("afterEnemyDamage", (ctx) => {
      if(h.spsCount < 10) return;
      
      let steal = v.value.space.stats.lifeSteal.raw;
      const heal = ctx.villian.stats.final.hp * steal;

      ctx.player.hp = Math.min(ctx.player.hp + heal, ctx.player.stats.final.hp);
    });
    //10 - 20
    hStats.addHook("multiplicative", (final) => {
      if(h.spsCount < 20) return;

      let lessDMGTaken = v.value.space.stats.lessDMGTaken.raw * 0.01;

      final.atk *= 1 - lessDMGTaken;
    });
    //11 - 30
    eStats.addHook("additive", (final) => {
      if(h.spsCount < 30) return;
    
      let avoid = v.value.space.stats.avoid.raw * 0.01;
      final.dodge += avoid;
    });
    //12 - 40
    eStats.addHook("additive", (final) => {
      if(h.spsCount < 40) return;
    
      let maxAps = v.value.space.stats.maxAps.raw 

      final.maxAps += maxAps;
    });
    //13 - 50
    hStats.addHook("multiplicative", (final) => {
      if(h.spsCount < 50) return;

      let lessDMGTakenFromCrits = v.value.space.stats.lessDMGTakenFromCrits.raw * 0.01;

      final.critDmg *= 1 - lessDMGTakenFromCrits;
    });
    //14 - 60
    eStats.addHook("additive", (final) => {
      if(h.spsCount < 60) return;
    
      let minAps = v.value.space.stats.minAps.raw 
      
      final.minAps += minAps;
    });
    //15 - 70
    hStats.addHook("multiplicative", (final) => {
      if(h.spsCount < 70) return;

      let defMult = v.value.space.stats.defMult.raw * 0.01;

      final.def *= 1 + defMult;
    });
    //16 - 80
    hStats.addHook("multiplicative", (final) => {
      if(h.spsCount < 80) return;

      let hpMult = v.value.space.stats.hpMult.raw * 0.01;

      final.hp *= 1 + hpMult;
    });
    //17 - 90
    hStats.addHook("multiplicative", (final) => {
      if(h.spsCount < 90) return;

      let atkMult = v.value.space.stats.atkMult.raw * 0.01;

      final.atk *= 1 + atkMult;
    });
    //18 - 100
    engine.addHook("beforeHeroDamage", (ctx) => {
      if(h.spsCount < 1000) return;
    
      if (v.value.space.dmgImmune > 0) {
        ctx.player.attack.canceled = true;
        ctx.player.attack.final = 0;
        return;
      }
    }, -100);

    engine.addHook("beforeTick", (ctx) => {
      if(h.spsCount < 1000) return;
      if(v.value.space.dmgImmune == 0) return;

      v.value.space.dmgImmune = Math.max(v.value.space.dmgImmune - ctx.dt, 0);
      
    });

    eStats.addHook("post", (final) => {
      final.hp = Math.max(final.hp, 100);
      final.atk = Math.max(final.atk, 10);
    });

    // Hero Space Stats
    hStats.addHook("multiplicative", (final) => {
      let mult = (ctx.ascension.perksHandler(28) && v.value.space.isSpaceFight? 1.25: 1) * 
      (h.rebirthPts >= 4e5 && e.space.isSpaceFight? 1.5: 1);

      final.atk *= mult;
    });

    hStats.addHook("multiplicative", (final) => {
      let mult = (ctx.ascension.perksHandler(28) && v.value.space.isSpaceFight? 1.25: 1)

      final.hp *= mult;
    });

    hStats.addHook("multiplicative", (final) => {
      let mult = (ctx.ascension.perksHandler(28) && v.value.space.isSpaceFight? 1.25: 1)

      final.def *= mult;
    });
  

  }
  