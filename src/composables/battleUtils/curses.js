import { effect } from "vue";
import { useFloatingDamage } from "../UI/useFloatingDamage";


export function createCurse(engine, context, hStats, eStats) {

  const { pushAnyLog } = useFloatingDamage();

  const cap = () => {
    return Math.min(context.hero.value.curseMult, 1);
  }

  const curseDisable = () => {
    return context.player.value.status.blackImpulse.curseDisableTime > 0;
  }

  // 0. Penetrate Curse
  hStats.addHook("multiplicative", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(0)) {
      const tierMultipliers = [0.1, 0.2, 0.3, 0.4, 0.8];
      const tier = context.hero.value.activeCurseTier[0];

      const penetrate = Math.min(
        tierMultipliers[tier] * Math.max(context.hero.value.curseMult, cap()),
        1
      );
      let total = 1 - (context.player.value.status.invisible.penetrateImmune ? 0 : penetrate);
      
      final.def *= total;
    }
  })
 
  // 1. Active blood
  engine.addHook("beforeTick", (ctx) => {
    if (curseDisable()) return;
    if (ctx.villian.dead || ctx.villian.hp == 0) return;
    if (context.hero.value.activeCurse.includes(1)){
      const tierMultipliers = [0.03, 0.06, 0.09, 0.12, 0.2];
      const tier = context.hero.value.activeCurseTier[1];

      let total = Math.min(tierMultipliers[tier] * Math.max(ctx.hero.curseMult * 0.75, cap()), 0.5) * 
      (ctx.player.status.critMls.healBlock > 0? 0: 1) * ctx.player.heal.enemyMult;
      
      ctx.villian.hp = Math.min(ctx.villian.hp + total * ctx.villian.stats.final.hp * ctx.dt, ctx.villian.stats.final.hp);
    }
  }, +25)
  
    
  // 2. Cursed Shield
  hStats.addHook("multiplicative", (final) => {
    context.player.value.curses.cursedShield = 1;
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(2)) {
      const tierMultipliers = [0.1, 0.2, 0.3, 0.4, 0.6];
      const tier = context.hero.value.activeCurseTier[2];
      const block = Math.min(
        tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.5, cap()),
        0.9
      );
      context.player.value.curses.cursedShield = (1 - block);
      final.atk *= (1 - block);
    }
  })
  

   // 3. Fast Reflexes
  eStats.addHook("additive", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(3)) {
      const tierMultipliers = [0.3, 0.5, 1.7, 0.9, 1.2];
      const tier = context.hero.value.activeCurseTier[3];

      let aps =  tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.5, cap());

      final.aps += aps;
    }
  })

  // 4. Acrobatic Curse
  eStats.addHook("additive", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(4)) {
      const tier = context.hero.value.activeCurseTier[4] || 0;
      const bonusPerTier = [4, 8, 12, 16, 25];
      let avoid = Math.min(
        bonusPerTier[tier] * Math.max(context.hero.value.curseMult * 0.35, cap()),
        100
      );
      final.dodge += avoid * 0.01;
    }
  })

  // 5. Stun Curse
  engine.addHook("afterEnemyAttack", (ctx) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(5) && ctx.player.status.stun.d <= 0) {
      const tierMultipliers = [10, 15, 20, 25, 35];
      const tier = context.hero.value.activeCurseTier[5];

      const threshold = Math.min(
        tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.25, cap()),
        50
      );
      const duration = 1;

      let rnd = Math.random() * 100 + threshold >= 100;
      
      if(rnd && !ctx.player.status.stun.immune) {
        ctx.player.status.stun.d = duration;

        if(ctx.player.status.stun.immune) return;

        ctx.villian.attack.effects.push({
          type: "stun",
          icon: "💫",
        });
      }

    }
  })

  engine.addHook("onHeroDeath", (ctx) => {
    ctx.player.status.stun.d = 0;
  })
  // 6. Accurate Blow 
  eStats.addHook("additive", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(6)) {
      const tier = context.hero.value.activeCurseTier[6];

      const thresholds = [30, 25, 20, 15, 25];
      
      final.crit += thresholds[tier] * Math.max(context.hero.value.curseMult * 0.4, cap());
    }
  })

  eStats.addHook("additive", (final) => {
    if (context.hero.value.activeCurse.includes(6)) {
      const tier = context.hero.value.activeCurseTier[6];

      const maxCrits = [1.5, 2, 2.5, 3, 4];
      
      final.critDmg += maxCrits[tier] * Math.max(context.hero.value.curseMult * 0.4, cap());
    }
  })

  // 7. Self Destruction
  engine.addHook("onEnemyDamage", (ctx) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(7)) {
      const tierMultipliers = [0.02, 0.03, 0.04, 0.05, 0.08];
      const tier = context.hero.value.activeCurseTier[7];

      let dmgDealed = Math.min(
        tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.35, cap()),
        0.2
      );

      let finalDmg = ctx.player.stats.final.hp * dmgDealed

      ctx.player.hp = Math.max(ctx.player.hp - finalDmg, 0);

      let item = {
        effective: finalDmg,
        effects: [{
          type: 'curse',
          icon: '🔪'
        }]
      }

      pushAnyLog(item, ctx.villian);
    }
  })

  // 8. Steel Skin
  eStats.addHook("post", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(8)) {
      const tierMultipliers = [0.15, 0.2, 0.25, 0.3, 0.6];
      const tier = context.hero.value.activeCurseTier[8];

      let total = tierMultipliers[tier] *
      Math.max(context.hero.value.curseMult * 0.8, cap());
      
      final.def += final.hp * total;
    }
  }, +50)

  // 9. Titan Curse
  eStats.addHook("multiplicative", (final) => {
    context.enemy.value.enemyStats.main.titan = 1;
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(9)) {
      const tierMultipliers = [1.3, 1.5, 2, 4, 10];
      const tier = context.hero.value.activeCurseTier[9];
      
      let total = tierMultipliers[tier] * Math.max(context.hero.value.curseMult, cap());
      context.enemy.value.enemyStats.main.titan = total;

      final.hp *= total;
    }
  })

  // 10. Bleeding Curse
  engine.addHook("onEnemyAttack", (ctx) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(10)) {
      const tierMultipliers = [1, 2, 3, 4, 6];
      const chance = [10, 20, 30, 40, 60];
      const tier = context.hero.value.activeCurseTier[10];

      let rnd = Math.random() * 100 + chance[tier] >= 100;
      
      let bleedTime = tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.25, cap());
      let bleedDmg = ctx.villian.attack.final * 0.1 * tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.25, cap());

      if(rnd) {
        ctx.player.status.bleeding.time = bleedTime;
        ctx.player.status.bleeding.dmg = bleedDmg;

        ctx.villian.attack.effects.push({
          type: "bleed",
          icon: "🩸",
        });
      }
    }
  })

  engine.addHook("beforeTick", (ctx) => {
    if (curseDisable()) return;
    if(ctx.player.status.bleeding.time > 0) {
      ctx.player.status.bleeding.time -= ctx.dt;

      ctx.player.hp = Math.max(ctx.player.hp - ctx.player.status.bleeding.dmg * ctx.dt, 0);
    }
  }, +50)

  engine.addHook("onHeroDeath", (ctx) => {
    ctx.player.status.bleeding.time = 0;
    ctx.player.status.bleeding.dmg = 0;
  })

  engine.addHook("onEnemyDeath", (ctx) => {
    ctx.player.status.bleeding.time = 0;
    ctx.player.status.bleeding.dmg = 0;
  })

   // 11. Dirty Blood 
  hStats.addHook("multiplicative", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(11)) {
      const tierMultipliers = [0.1, 0.2, 0.3, 0.4, 0.5];
      const tier = context.hero.value.activeCurseTier[11];

      let total = Math.min(tierMultipliers[tier] *
      Math.max(context.hero.value.curseMult * 0.25, cap()), 0.9);

      final.regenMult *= (1 - total);
    }
  })

   // 12. Muscles Curse
  eStats.addHook("multiplicative", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(12)) {
      const tierMultipliers = [1.25, 1.5, 1.75, 2, 3];
      const tier = context.hero.value.activeCurseTier[12];

      let total = tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.05, cap());
      context.enemy.value.enemyStats.main.muscles = total;

      final.atk *= total;
    }
  })

   // 13. True Sight
  eStats.addHook("additive", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(13)) {
      const tierMultipliers = [5, 7.5, 10, 12.5, 15];
      const tier = context.hero.value.activeCurseTier[13];
      
      let total = tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.25, cap()) * 0.01;

      final.hit += total;
    }
  })

  // 14. Critical Lock
  engine.addHook("onHeroDamage", (ctx) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(14)) {
      if(!ctx.player.attack.crit)
        ctx.player.attack.final = 0;
    }
  }, -50)

  // 15. Unyielding Mind
  engine.addHook("afterHeroDamage", (ctx) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(15)) {
      const tierMultipliers = [10, 15, 20, 25, 30];
      const tier = context.hero.value.activeCurseTier[15];

      const stunExpires = Math.min( tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.1, cap()), 100);
      const threshold = ctx.villian.status.stun.d * stunExpires;
      ctx.villian.status.stun.d = Math.min(ctx.villian.status.stun.d, threshold);
    }
  })

  // 16. Critical Ward
  hStats.addHook("additive", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(16)) {
      const tierMultipliers = [2, 4, 6, 8, 10];
      const tier = context.hero.value.activeCurseTier[16];

      const resist = tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.3, cap());

      final.crit -= resist;
    }
  })

   // 17. Withering Spoils
  engine.addHook("onEnemyDeath", (ctx) => {
    if (curseDisable()) return;
    context.cursed[17].loot = 1;
    if (context.hero.value.activeCurse.includes(17)) {
      const baseValues = [0.95, 0.9, 0.85, 0.8, 0.75];
      const tier = context.hero.value.activeCurseTier[17];

      context.cursed[17].loot = Math.min(Math.max(
        baseValues[tier] / Math.max(context.hero.value.curseMult * 0.2, cap()),
        0.5), 1);
    }
  }, -100);

  // 18. Echo Strike
  engine.addHook("beforeEnemyAttack", (ctx) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(18)) {
      const tierMultipliers = [5, 10, 15, 20, 25];
      const tier = context.hero.value.activeCurseTier[18];

      const extraHits = Math.min(tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.4, cap()), 1);
      
      ctx.villian.extras.hits += extraHits;
    }
  })

  // 19. Crit Dampening
  hStats.addHook("multiplicative", (final) => {
    if (curseDisable()) return;
    if (context.hero.value.activeCurse.includes(19)) {
      const tierMultipliers = [0.1, 0.15, 0.2, 0.25, 0.3];
      const tier = context.hero.value.activeCurseTier[19];

      let total =  Math.min(
        tierMultipliers[tier] * Math.max(context.hero.value.curseMult * 0.2, cap()),
        1
      );

      final.critDmg *= (1 - total);
    }
  })

}
