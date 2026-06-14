import { dimensions } from "../../../data/dimensions";
import { useFloatingDamage } from "../../UI/useFloatingDamage";
import { fn } from "../global";

export function engineBaseEnemySetup(engine, hStats, eStats, p, v, context) {
    let h = context.hero.value;
    let e = context.enemy.value;

    const { pushAnyLog } = useFloatingDamage();
    // Dark Energy Bosses
    engine.addHook("beforeTick", (ctx) => {
      if (ctx.hero.settings.battleTime >= 10 && 
        ctx.hero.settings.autoLeave) {
          ctx.player.hp = 0;
          ctx.hero.settings.battleTime = 0;
      }
    })

    engine.addHook("beforeTick", (ctx) => {
      if(ctx.villian.deBoss.tier < 1) return;
      if(ctx.villian.spawnType != 'deBoss') return;

      const heal = ctx.villian.deBoss.regen * 0.01 * ctx.villian.stats.final.hp * 
      (ctx.player.status.critMls.healBlock > 0? 0: 1);
    
      ctx.villian.hp = Math.min(ctx.villian.hp + heal * ctx.dt, ctx.villian.stats.final.hp);
    })

    hStats.addHook("multiplicative", (final) => {
      if(v.value.deBoss.tier < 2) return;
      if(v.value.spawnType != 'deBoss') return;

      let lessDMG = v.value.deBoss.def * 0.01

      final.atk *= Math.max(1 - lessDMG, 0.1);
    })

    engine.addHook("beforeTick", (ctx) => {
      if(ctx.villian.deBoss.tier < 3) return;
      if(ctx.villian.spawnType != 'deBoss') return;
      
      ctx.villian.deBoss.timer = Math.max(ctx.villian.deBoss.timer - ctx.dt, 0);
      if(ctx.villian.deBoss.timer == 0)
        ctx.player.hp = 0;
    })

    engine.addHook("beforeEnemyDamage", (ctx) => {
      if(ctx.villian.spawnType != 'deBoss') return;
      if (ctx.villian.deBoss.tier >= 4 && ctx.villian.deBoss.shields > 0) {
        ctx.player.attack.canceled = true;
        ctx.player.attack.final = 0;

        ctx.villian.deBoss.shields--;

        ctx.player.attack.effects.push({
          type: "block",
          icon: "⛨",
        });
      }
    })

    //Bleeding Veil

    engine.addHook("beforeTick", (ctx) => {
      if (ctx.hero.dId != 'd-survival-2') return;
      if (ctx.player.dead) return;
      if (ctx.player.hp == 0) return;
      
      let veil = ctx.player.status.dims.veil.damage;
      ctx.player.hp = Math.max(ctx.player.hp - veil * ctx.dt, 0);
    })
    
    // Enemy Skills 

    //Juggernaut

    hStats.addHook("multiplicative", (final) => {
      if (!v.value.skills.active.includes(0)) return;

      let t = (h.dId == 'd-noBuffs'? dimensions.value[32].infTier: 0);

      let mult = 0.1 + 0.05 * t;

      v.value.skills.jugger.d = `Gain less Critical DMG by ${fn(mult * 100)}%`;
    
      final.critDmg *= Math.max(1 - mult, 0);
    });

    //berserk
    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.skills.active.includes(1)) return;

      v.value.skills.berserk.isRage = true;
      v.value.skills.berserk.d = `Unlock the Rage Rune`;
    })

    engine.addHook("afterHeroDamage", (ctx) => {
      if (!v.value.skills.berserk.isRage) return;

      ctx.villian.skills.berserk.rage += 1;
    });

    eStats.addHook("multiplicative", (final) => {
      if (!v.value.skills.berserk.isRage) return;

      let mult = 1 + 0.01 * v.value.skills.berserk.rage;

      v.value.skills.berserk.rageDmg = mult;
      final.atk *= mult;
    })


    eStats.addHook("multiplicative", (final) => {
      if (!v.value.skills.berserk.isRage) return;

      let lessDMG = 0.0015 * v.value.skills.berserk.rage;
      v.value.skills.berserk.lessDmg = lessDMG;

      final.atk *= Math.max(1 - lessDMG, 0.1);
    })


    hStats.addHook("multiplicative", (final) => {
      if (!v.value.skills.berserk.isRage) return;

      v.value.skills.berserk.healMult = 1;
    })


    engine.addHook("afterHeroDamage", (ctx) => {
      if (!v.value.skills.berserk.isRage) return;

      ctx.villian.skills.berserk.rageTimer = 1 - 0.005 * v.value.skills.berserk.rage;
    });

    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.skills.berserk.isRage) return;

      ctx.villian.skills.berserk.rageTimer -= ctx.dt;

      if(ctx.villian.skills.berserk.rageTimer <= 0) {
        let loseRage = 1 + 0.01 * ctx.villian.skills.berserk.rageTick;
        ctx.villian.skills.berserk.rageTick += ctx.dt;
        ctx.villian.skills.berserk.rage = Math.max(ctx.villian.skills.berserk.rage - loseRage, 0);
      } else {
        ctx.villian.skills.berserk.rageTick = 0;
      }

      ctx.villian.skills.berserk.rageTime = 1 - 0.005 * v.value.skills.berserk.rage;
    });

    engine.addHook("beforeTick", (ctx) => {
      if (v.value.skills.active.includes(1)) return;
      
      ctx.villian.skills.berserk.isRage = false;
      ctx.villian.skills.berserk.rage = 0;
    });

    // First Strike
    
    engine.addHook("beforeTick", (ctx) => {
      if (!ctx.villian.skills.firstStrike.firstStrike) return;
      if (!v.value.skills.active.includes(2)) return;
      
      let t = (h.dId == 'd-noBuffs'? dimensions.value[32].infTier: 0);
      let bar = 0.25 + 0.01 * t;
      v.value.skills.firstStrike.d = `Your first attack starts with the APS bar filled to ${bar.toFixed(2)}%.`;

      ctx.villian.bar = Math.max(ctx.villian.bar, bar);
    }, -80);
  
    engine.addHook("afterHeroDamage", (ctx) => {
      if (!ctx.villian.skills.firstStrike.firstStrike) return;
    
      ctx.villian.skills.firstStrike.firstStrike = false;
    }, 100);
  
    engine.addHook("onEnemyDeath", (ctx) => {
      ctx.villian.skills.firstStrike.firstStrike = true;
    })

    // Traveller
    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.skills.active.includes(3)) {
        ctx.villian.skills.traveler.loot = 1;
        ctx.hero.stardustPenalty.d32 = 1;
        return;
      }

      let t = (h.dId == 'd-noBuffs'? dimensions.value[32].infTier: 0);

      let loot = 0.8 - 0.025 * t;
      ctx.villian.skills.traveler.d = `Gain less Stardust and Mutagen by ${loot.toFixed(2)}`;
      
      ctx.villian.skills.traveler.loot = Math.max(loot, 0.1);
      ctx.hero.stardustPenalty.d32 = Math.max(loot, 0.1);
    });

    //Flexible

    engine.addHook("beforeEnemyDamage", (ctx) => {
      if (!v.value.skills.active.includes(4)) return;
      if (ctx.villian.skills.flexible.avoidSuccess) return;

      ctx.villian.skills.flexible.avoidSuccess = Math.random() < ctx.villian.stats.final.dodge;
    }, -70);

    engine.addHook("afterEnemyDamage", (ctx) => {
      ctx.villian.skills.flexible.avoidSuccess = false;
    }, 100);

    //Flash

    engine.addHook("beforeEnemyAttack", (ctx) => {
      if (!v.value.skills.active.includes(5)) return;
      
      let t = (h.dId == 'd-noBuffs'? dimensions.value[32].infTier: 0);
      let cap = 0.75 - 0.02 * t;

      const overcap = ctx.villian.APS.total - (ctx.villian.APS.max * cap);
      
      let extraHit = Math.max(Math.log(3 + overcap ** 2) - 1 , 0);
      
      ctx.villian.skills.flash.d = `Attack Speed above ${fn(cap * 100)}% of Cap converts into a chance for extra hits`;
      ctx.villian.skills.flash.extraHit = Math.floor(extraHit);

      if (overcap <= 0) return;

      ctx.villian.extras.hits += Math.floor(extraHit);
  
    }, -20);

    // Fast Slash
    engine.addHook("beforeHeroDamage", (ctx) => {
      if (!v.value.skills.active.includes(6)) return;
      
      let t = (h.dId == 'd-noBuffs'? dimensions.value[32].infTier: 0);

      let th = (0.15 + 0.01 * t);
      const threshold = ctx.player.stats.final.hp * th;
      ctx.villian.skills.fastSlash.d = `Instantly kill hero when HP falls below ${fn(th * 100)}%`;

      if (ctx.player.hp <= threshold) {
        ctx.player.hp = 0;
      }
    }, -80);

    // Extra life
    engine.addHook("beforeEnemyDamage", (ctx) => {
      if (!v.value.skills.active.includes(7)) return;
      
      ctx.villian.skills.extraLife.d = `Gain Divine Shields. Each Divine Shield blocks one hit completely`;

      if (ctx.villian.skills.extraLife.shields > 0) {
        ctx.villian.skills.extraLife.shields -= 1;
        ctx.player.attack.canceled = true;
        ctx.player.attack.final = 0;
  
        ctx.player.attack.effects.push({
          type: "block",
          icon: "⛨",
        });
      }
    }, -100);

    engine.addHook("onEnemyDeath", (ctx) => {
      if (!v.value.skills.active.includes(7)) return;
    
      deathStatus(ctx);
    }, 100)
  
    engine.addHook("onHeroDeath", (ctx) => {
      if (!v.value.skills.active.includes(7)) return;
    
      deathStatus(ctx);
    }, 100)

    const deathStatus = (ctx) => {
      let t = (h.dId == 'd-noBuffs'? dimensions.value[32].infTier: 0);
      let shields = 2 + Math.floor(t / 5);

      ctx.villian.skills.extraLife.shields = shields;
    }

    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.skills.active.includes(7)) 
        ctx.villian.skills.extraLife.shields = 0;
      
    }, 100)


    // BH BOSSES

    engine.addHook("beforeHeroDamage", (ctx) => {
      if (!v.value.bh.status) return;
      
      if (v.value.bh.tier >= 1) {
        v.value.bh.extraStack = 0.05 * v.value.bh.tier * 
        v.value.bh.effects;

        if (Math.random() < v.value.bh.extraStack)
          v.value.bh.stacks += 1;
      }

      v.value.bh.stacks += 1;
    }, -80);

    engine.addHook("onHeroDeath", (ctx) => {
      if (!v.value.bh.status) return;
      
      context.hero.value.dId == 'main';
      context.resets.performInf();
      context.sing.deathBhStatus();
    });

    engine.addHook("onEnemyDeath", (ctx) => {
      if (!v.value.bh.status) return;
      context.hero.value.bhTier += 1;
      context.hero.value.isBhBoss = false

      context.hero.value.dId == 'main';
      context.resets.performInf();
      context.sing.deathBhStatus();
      
    });

    

    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.bh.status) return;
      if ( h.bhTier < 2) return;

      v.value.status.stun.d = 0;
    })

    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.bh.status) return;
      if ( h.bhTier < 3) return;

      v.value.bh.alwaysHit = true;
    })

    engine.addHook("onEnemyDamage", (ctx) => {
      if (!v.value.bh.status) return;
      if ( h.bhTier < 4) return;

      let base = 0.5 * h.bhTier * v.value.bh.effects

      let dmgDealed = base * 0.001;
      let finalDmg = ctx.player.stats.final.hp * dmgDealed;

      v.value.bh.selfDestruction = finalDmg;
  
      ctx.player.hp = Math.max(ctx.player.hp - finalDmg, 0);

      let item = {
        effective: finalDmg,
        effects: [{
          type: 'curse',
          icon: '🔪'
        }]
      }

      pushAnyLog(item, ctx.villian);
    })

    engine.addHook("beforeTick", (ctx) => {
      if (!v.value.bh.status) return;
      if ( h.bhTier < 5) return;

      v.value.hp = 1e100;
    })

    engine.addHook("beforeEnemyDamage", (ctx) => {
      if (!v.value.bh.status) return;
      if ( h.bhTier < 5) return;

      ctx.hero.gravity.bhDmg += ctx.player.attack.effective;

      ctx.hero.gravity.bhMaxDmg = Math.max(
        ctx.hero.gravity.bhMaxDmg, ctx.hero.gravity.bhDmg);

      
    }, 96)

    // DIMS-CORR

    engine.addHook("beforeEnemyDamage", (ctx) => {
      if (h.dId != 'c-damage') return;
    
      ctx.player.attack.crit = false;
    }, 15);

    engine.addHook("beforeHeroDamage", (ctx) => {
      if (h.dId != 'c-damage') return;
    
      ctx.villian.attack.crit = true;
    }, 15);


    // D-Corr

    engine.addHook("beforeTick", (ctx) => {
      if (ctx.villian.spawnType != 'd-corruption') return;
      if (ctx.player.dead) return;
      if (ctx.player == 0) return;
      ctx.villian.dCorr.time += ctx.dt;

      v.value.dCorr.healMult = 1 + 0.025 * ctx.villian.dCorr.time;
      ctx.villian.dCorr.dmg = 70 * ctx.villian.dCorr.time ** 3.7;

      ctx.player.hp = Math.max(ctx.player.hp - ctx.villian.dCorr.dmg * ctx.dt, 0);
      ctx.villian.hp = 1e100;
    })

    hStats.addHook("multiplicative", (final) => {
      if (v.value.spawnType != 'd-corruption') return;;

      final.regenMult /= v.value.dCorr.healMult;
    })

    engine.addHook("onHeroDeath", (ctx) => {
      if (ctx.villian.spawnType != 'd-corruption') return;
      
      h.stages.current -= 10;
      ctx.villian.dCorr.time = 0;
      ctx.villian.spawnType = 'none';
    });

    engine.addHook("beforeTick", (ctx) => {
      if (ctx.villian.spawnType != 'd-corruption') return;
      if (ctx.villian.dCorr.time < 30) return;
      if (h.dims.corrShards >= 20) return;

      context.resets.dInfHandle();
      context.dimensions.dimUp(63);

    })
}