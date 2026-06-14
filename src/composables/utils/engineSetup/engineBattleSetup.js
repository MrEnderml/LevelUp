export function engineBattleSetup(engine, context) {
    
    // DODGE
    engine.addHook("beforeHeroDamage", (ctx) => {
      const dodgeChance = ctx.player.avoid.base;
      const hit = ctx.villian.stats.final.hit;

      if (ctx.villian.bh.alwaysHit) return;

      let final = dodgeChance - hit;

      if (Math.random() < final || 
      ctx.player.status.flexible.avoidSuccess) {
        ctx.villian.attack.canceled = true;
        ctx.villian.attack.final = 0;

        ctx.player.status.flexible.avoidSuccess = true;

        ctx.villian.attack.effects.push({
          type: "dodge",
          icon: "🤺",
        });
      }
    }, -60);
    

    engine.addHook("beforeEnemyDamage", (ctx) => {
      const dodgeChance = ctx.villian.avoid.base;
      const hit = ctx.player.stats.final.hit;

      let final = dodgeChance - hit;

      if (Math.random() < final || 
      ctx.villian.skills.flexible.avoidSuccess) {
        ctx.player.attack.canceled = true;
        ctx.player.attack.final = 0;

        ctx.player.attack.effects.push({
          type: "dodge",
          icon: "🤺",
        });
      }
    }, -60);



    // CRITS
    engine.addHook("beforeEnemyDamage", (ctx) => {
      const critChance = ctx.player.stats.final.crit;
      if(ctx.player.attack.crit) return;

      ctx.player.attack.crit = Math.random() * 100 < critChance;
    }, -60);

    engine.addHook("beforeHeroDamage", (ctx) => {
        const critChance = ctx.villian.stats.final.crit;
        if(ctx.villian.attack.crit) return;

        ctx.villian.attack.crit = Math.random() * 100 < critChance;
    },-60);

    engine.addHook("beforeEnemyDamage", (ctx) => {
      if (ctx.player.attack.crit) {
        ctx.player.attack.final *= ctx.player.stats.final.critDmg;

        ctx.player.attack.effects.push({
          type: "crit",
          icon: "💥",
        });
      }
    }, +20);

    engine.addHook("beforeHeroDamage", (ctx) => {
      if (ctx.villian.attack.crit) {
        ctx.villian.attack.final *= ctx.villian.stats.final.critDmg;

        ctx.villian.attack.effects.push({
          type: "crit",
          icon: "💥",
        });
      }
    }, +20);

    // ExtraHits

    engine.addHook("beforeHeroAttack", (ctx) => {
      ctx.player.extras.hits = 0;
      ctx.player.extras.chance = 0;
    }, -95)

    engine.addHook("beforeEnemyAttack", (ctx) => {
      ctx.villian.extras.hits = 0;
      ctx.villian.extras.chance = 0;
    }, -95)

    // Effective Damage

    engine.addHook("beforeHeroDamage", (ctx) => {
      let def = (ctx.villian.attack.defIgnore? 0: ctx.player.stats.final.def);
      ctx.villian.attack.effective = Math.max(ctx.villian.attack.final - def, 0);

      if(ctx.villian.attack.final < ctx.player.stats.final.def && !ctx.villian.attack.canceled && 
        !ctx.player.status.invisible.reduceDamage
      ) {
        ctx.villian.attack.effects.push({
          type: "block",
          icon: "🛡️",
        });
      }

      if(ctx.player.status.extraLife.immuneTime > 0) {
        ctx.villian.attack.effects.push({
          type: "immune",
          icon: "🧘",
        });
      }
      
    }, 100)

    engine.addHook("beforeEnemyDamage", (ctx) => {
      let atk = ctx.player.attack.final;

      if (ctx.villian.spawnType == 'd-corruption')
        ctx.player.attack.final = 0;

      if(ctx.hero.dId == 'c-survival-2')
        atk = Math.min(atk, ctx.player.stats.final.hp);

      ctx.player.attack.final = atk;
      
      let def = (ctx.player.attack.defIgnore? 0: ctx.villian.stats.final.def);
      ctx.player.attack.effective = Math.max(atk - def, 0);

      ctx.hero.totalStats.maxDmgDealed = Math.max(ctx.hero.totalStats.maxDmgDealed, ctx.player.attack.effective)

      if(ctx.player.attack.final < ctx.villian.stats.final.def && !ctx.player.attack.canceled 
      ) {
        ctx.player.attack.effects.push({
          type: "block",
          icon: "🛡️",
        });
      }

      if(ctx.villian.space.dmgImmune > 0) {
        ctx.villian.attack.effects.push({
          type: "immune",
          icon: "🧘",
        });
      }

      
    }, 95)
}