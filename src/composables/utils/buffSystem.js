export function buffsRegistry(engine, context, player, villian, hStats, eStats) {
   
  const buffState = () => {
    return context.hero.value.battleContent[context.hero.value.battleId].player.buff.activeBuffs;
  }
  // 0. Invisible
  eStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(0)) {
      player.value.status.invisible.penetrateImmune = false;
      player.value.status.stun.immune = false;

      return
    }; 
  
    const tier = context.buffs.value[0].tier * 0.1
  
    let f = Math.max(Math.min(1 - tier, 1), 0.1);
    final.atk *= f;
  });


  engine.addHook("beforeHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(0)) return;
    if (context.buffs.value[0].tier < 2) return;

    ctx.player.status.invisible.reduceDamage = false;
  
    const chance = 0.1 * context.buffs.value[0].tier;
    if (Math.random() < chance) {
      ctx.villian.attack.final = 1;

      ctx.player.status.invisible.reduceDamage = true;

      ctx.villian.attack.effects.push({
        type: "block",
        icon: "🔰",
      });
    }
  });

  engine.addHook("beforeHeroDamage", (ctx) => {
    ctx.player.status.invisible.penetrateImmune = false;

    if (!player.value.buff.activeBuffs.includes(0)) return;
    if (context.buffs.value[0].tier < 3) return;
  
    ctx.player.status.invisible.penetrateImmune = true;

  }, -100);

  engine.addHook("beforeHeroDamage", (ctx) => {
    ctx.player.status.stun.immune = false;

    if (!player.value.buff.activeBuffs.includes(0)) return;
    if (context.buffs.value[0].tier < 4) return;
  
    ctx.player.status.stun.immune = true;
  }, -100);


  // 1. First strike

  engine.addHook("onHeroAttack", (ctx) => {
    if (!ctx.player.status.firstStrike) return;
    if (!player.value.buff.activeBuffs.includes(1)) return; 
    if (context.buffs.value[1].tier < 1) return;
  
    ctx.player.attack.final *= 2;
  });

  engine.addHook("onHeroAttack", (ctx) => {
    if (!ctx.player.status.firstStrike) return;
    if (!player.value.buff.activeBuffs.includes(1))  return; 
    if (context.buffs.value[1].tier < 2) return;
  
    ctx.player.attack.crit = true;
  }, -80);

  engine.addHook("afterHeroAttack", (ctx) => {
    if (!ctx.player.status.firstStrike) return;
    if (!player.value.buff.activeBuffs.includes(1))  return; 
    if (context.buffs.value[1].tier < 3) return;
    
    let stun = 0.5;
    ctx.villian.status.stun.d = stun;

    ctx.player.attack.effects.push({
      type: "stun",
      icon: "💫",
    });
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!ctx.player.status.firstStrike) return;
    if (!player.value.buff.activeBuffs.includes(1))  return; 
    if (context.buffs.value[1].tier < 4) return;
    
    let mult = 0.2 + 0.01 * context.buffs.value[1].extraTier;
    ctx.player.bar = Math.max(ctx.player.bar, mult);
  }, -80);

  engine.addHook("afterEnemyDamage", (ctx) => {
    if (!ctx.player.status.firstStrike) return;
  
    ctx.player.status.firstStrike = false;
  }, 100);

  engine.addHook("onEnemyDeath", (ctx) => {
    ctx.player.status.firstStrike = true;

    ctx.villian.status.stun.d = 0;
  })

  engine.addHook("onHeroDeath", (ctx) => {
    ctx.player.status.firstStrike = true;
  })

  // 2. Traveller
  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(1)) {
      ctx.player.status.traveler.eq = 1;
      ctx.player.status.traveler.soul = 1;
      ctx.player.status.traveler.ascension = 1;
      ctx.player.status.traveler.exp = 1;
      ctx.player.status.traveler.mut = 1;
      ctx.player.status.traveler.stardust = 1;
      return;
    }; 

    let tier = context.buffs.value[1].tier;
    
    ctx.player.status.traveler.eq = 3;

    if (tier >= 2)
      ctx.player.status.traveler.soul = 3;

    if (tier >= 3) {
      ctx.player.status.traveler.ascension = 1.5;
      ctx.player.status.traveler.exp = 3;
    }

    if (tier >= 4) {
      let et = context.buffs.value[2].extraTier
      ctx.player.status.traveler.mut = 2 * 1.1 ** et;
      ctx.player.status.traveler.stardust = 2 * 1.1 ** et;
    }
  });

  // 3. Combo

  engine.addHook("afterEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(3)) {
      ctx.player.status.combo.value = 0;
      player.value.status.combo.dmg = 1;
      return;
    } 
  
    const tier = context.buffs.value[3].tier - 1;
    let gain = [1, 1, 1.5, 2][tier] ?? 0;
    let max = ctx.player.status.combo.max;

    if (tier === 1 && Math.random() < 0.5) gain += 1;
  
    ctx.player.status.combo.value = Math.min(
      ctx.player.status.combo.value + gain,
      max
    );
  });

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(3)) return; 
  
    const tier = context.buffs.value[3].tier - 1;
    const extraTier = context.buffs.value[3].extraTier
  
    const dmgPerCombo = [0.01, 0.0125, 0.015, 0.0175][tier];
    const comboMax = [30, 40, 50, 100];
    const bonus = 1 + player.value.status.combo.value * dmgPerCombo;

    player.value.status.combo.max = comboMax[tier] + 10 * extraTier;
    player.value.status.combo.dmg = bonus;
  
    final.atk *= bonus;
  });

  engine.addHook("onHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(3)) return; 
    if (ctx.villian.attack.canceled) return;
  
    const tier = context.buffs.value[3].tier - 1;
  
    if (tier === 0) {
      ctx.player.status.combo.value = 0;
    }
  
    if (tier === 1) {
      ctx.player.status.combo.value *= 0.25;
    }
  
    if (tier === 2) {
      ctx.player.status.combo.value *= 0.5;
    }
  
    ctx.player.status.combo.value = Math.floor(ctx.player.status.combo.value);
  });

  engine.addHook("onHeroDeath", (ctx) => {
    ctx.player.status.combo.value = 0;
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(3))
      ctx.player.status.combo.value = 0;
  });

  hStats.addHook("additive", (final) => {
    if (!player.value.buff.activeBuffs.includes(3)) return;
  
    const tier = context.buffs.value[3].tier - 1;
    if (tier !== 3) return;
  
    if (player.value.status.combo.value >= player.value.status.combo.max) {
      final.aps += 0.3;
    }
  });

  // 4. Blood Art
  engine.addHook("beforeTick", (ctx) => {
    if (ctx.player.dead) return
    if (ctx.player.hp == 0) return;
    if (!player.value.buff.activeBuffs.includes(4)) return;

    let mult = ctx.player.heal.mult;
    ctx.player.heal.regen.s2 = ctx.player.stats.final.hp * 0.05;

    const heal = ctx.player.stats.final.hp * 0.05 * mult * ctx.dt;
    ctx.player.hp = Math.min(ctx.player.hp + heal, ctx.player.stats.final.hp);
  });

  engine.addHook("onEnemyDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(4)) return;
    if (context.buffs.value[4].tier < 2) return;
    
    let mult = ctx.player.heal.mult;

    const heal = ctx.player.stats.final.hp * 0.05 * mult;
    ctx.player.hp = Math.min(ctx.player.hp + heal, ctx.player.stats.final.hp);
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(4)) return;
    if (context.buffs.value[4].tier < 3) return;

    let tier = context.buffs.value[4].tier;

    ctx.player.heal.enemyMult = 1 - 0.1 * tier;
  });

  engine.addHook("afterHeroDamage", (ctx) => {
    if (ctx.player.dead) return
    if (ctx.player.hp == 0) return;
    if (!player.value.buff.activeBuffs.includes(4)) return;
    if (context.buffs.value[4].tier < 4) return;
    
    let mult = ctx.player.heal.mult;

    const heal =
      ctx.player.stats.final.hp * 0.02 +
      ctx.hero.stages.current;
  
    ctx.player.hp = Math.min(ctx.player.hp + heal * mult, ctx.player.stats.final.hp);
  });

  engine.addHook("beforeTick", (ctx) => {
    if (player.value.buff.activeBuffs.includes(4)) return;
    
    ctx.player.heal.regen.s1 = 0;
    ctx.player.heal.regen.s2 = 0;
  });

  // 5. Fast Slash

  hStats.addHook("multiplicative", (final) => {
    player.value.status.fastSlash.asReduce = 1;
    if (!player.value.buff.activeBuffs.includes(5)) return;
  
    const tier = context.buffs.value[5].tier - 1;
    const penalties = [0.1, 0.25, 0.4, 0.4];
    

    player.value.status.fastSlash.asReduce = (1 - penalties[tier]);
    final.aps *= (1 - penalties[tier]);
  });

  engine.addHook("beforeHeroAttack", (ctx) => { 
    if (!player.value.buff.activeBuffs.includes(5)) return;
  
    const tier = context.buffs.value[5].tier - 1;
    let extraHits = 0;
  
    if (tier >= 0) {
      extraHits += 1;
    }
  
    if (tier >= 1 && Math.random() < 0.25) {
      extraHits += 1;
    }
  
    if (tier >= 2 && Math.random() < 0.25) {
      extraHits += 1;
    }
  
    ctx.player.extras.hits += extraHits;
  });

  engine.addHook("beforeEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(5)) return;
    if (context.buffs.value[5].tier < 4) return; 

    let mult = 0.1 + context.buffs.value[5].extraTier * 0.01;
    const threshold = ctx.villian.stats.final.hp * mult;
  
    if (ctx.villian.hp <= threshold) {
      ctx.villian.hp = 0;
    }
  }, -80);

  // 6. Charges

  engine.addHook("afterEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(6)) return;
  
    const tier = context.buffs.value[6].tier;
  
    const chance = 0.01 + tier * 0.02;
    if (Math.random() > chance) return;
  
    const roll = Math.floor(Math.random() * 3);
    if (roll === 0) ctx.player.status.charges.power = Math.min(ctx.player.status.charges.power + 1, tier);
    if (roll === 1) ctx.player.status.charges.energy = Math.min(ctx.player.status.charges.energy + 1, tier);
    if (roll === 2) ctx.player.status.charges.life = Math.min(ctx.player.status.charges.life + 1, tier);
  });

  engine.addHook("onHeroDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(6)) return;
  
    ctx.player.status.charges.power = 0;
    ctx.player.status.charges.energy = 0;
    ctx.player.status.charges.life = 0;
  });

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(6)) return;
    
    let charges =  player.value.status.charges;

    final.atk *= 1 + 0.05 * charges.power;
    final.hp *= 1 + 0.05 * charges.life;
  });

  hStats.addHook("additive", (final) => {
    if (!player.value.buff.activeBuffs.includes(6)) return;
    
    let charges =  player.value.status.charges;

    final.aps += 0.05 * charges.power;
    final.crit += 1 * charges.energy;
    final.critDmg += 0.1 * charges.energy;
  });

  eStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(6)) return;
    
    let charges =  player.value.status.charges;

    final.atk *= Math.max(1 - 0.02 * charges.life, 0.1);
  });

  engine.addHook("beforeTick", (ctx) => {
    if (player.value.buff.activeBuffs.includes(6)) return;
  
    ctx.player.status.charges.power = 0;
    ctx.player.status.charges.energy = 0;
    ctx.player.status.charges.life = 0;
  });

  // 7. Overkill
  // ...

  // 8. Conquer

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(8)) {
      ctx.player.status.conquer.time = (context.buffs.value[8].tier < 4? 0: 250);
      player.value.status.conquer.loot = 1;
      return;
    }

    const tier = context.buffs.value[8].tier - 1;
    const tms = [500, 750, 1000, 1500];


    ctx.player.status.conquer.maxTime = tms[tier] + 100 * context.buffs.value[8].extraTier;
  
    ctx.player.status.conquer.time = Math.min(player.value.status.conquer.time + ctx.dt, 
      ctx.player.status.conquer.maxTime);
  });
  

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(8)) return;
    if (context.buffs.value[8].tier < 1) return;

    player.value.status.conquer.tier = context.buffs.value[8].tier;

    const t = player.value.status.conquer.time

    final.hp *= 1 + 0.001 * t;
  });

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(8)) return;
    if (context.buffs.value[8].tier < 2) return;

    const t = player.value.status.conquer.time

    final.atk *= 1 + 0.001 * t;
  });

  hStats.addHook("additive", (final) => {
    if (!player.value.buff.activeBuffs.includes(8)) return;
    if (context.buffs.value[8].tier < 3) return;

    const t = player.value.status.conquer.time

    final.aps += 0.1 * Math.floor(t / 250);
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(8)) return;
    if (context.buffs.value[8].tier < 4) return;


    const t = player.value.status.conquer.time

    player.value.status.conquer.loot = 1.05 ** Math.floor(t / 100);
  });

  // 9. Flexible

  hStats.addHook("additive", (final) => {
    if(!player.value.buff.activeBuffs.includes(9)) return;
  
    const tier = context.buffs.value[9].tier
    final.dodge += 0.05 * tier; 
  });

  engine.addHook("afterHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(9)) return;
    if (context.buffs.value[9].tier < 2) return;
    if (!ctx.player.status.flexible.avoidSuccess) {
      ctx.player.status.flexible.stacks = 0;
      return;
    };
  
    ctx.player.status.flexible.stacks = Math.min(
      ctx.player.status.flexible.stacks + 1,
      10
    );
  });

  hStats.addHook("additive", (final) => {
    final.dodge += player.value.status.flexible.stacks * 0.01;
  });



  engine.addHook("afterHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(9)) return;
    if (context.buffs.value[9].tier < 3) return;
    
    if(ctx.player.status.flexible.avoidSuccess) {
      ctx.player.status.flexible.buffTime = 4;
    }
  });

  engine.addHook("beforeTick", (ctx) => {
    const s = ctx.player.status.flexible;
  
    if (s.buffTime > 0) s.buffTime -= ctx.dt;
  });

  hStats.addHook("multiplicative", (final) => {
    const s = player.value.status.flexible;
    if (s.buffTime <= 0) return;
  
    final.atk *= 2;
  });

  engine.addHook("onHeroDeath", (ctx) => {
    ctx.player.status.flexible.buffTime = 0;
    ctx.player.status.flexible.stacks = 0;
  });

  engine.addHook("onEnemyDeath", (ctx) => {
    ctx.player.status.flexible.buffTime = 0;
  });



  engine.addHook("beforeHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(9)) return;
    if (context.buffs.value[9].tier < 4) return;
    if (ctx.player.status.flexible.avoidSuccess) return;
    
    const hit = ctx.villian.stats.final.hit;
    const final = ctx.player.stats.final.dodge - hit;
    ctx.player.status.flexible.avoidSuccess = Math.random() < final;
  }, -70);

  engine.addHook("afterHeroDamage", (ctx) => {
    ctx.player.status.flexible.avoidSuccess = false;
  }, 100);

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(9)) {
      ctx.player.status.flexible.buffTime = 0;
      ctx.player.status.flexible.stacks = 0;
      ctx.player.status.flexible.avoidSuccess = false;
    }
  });

  // 10. Extra Life

  engine.addHook("onHeroDeathing", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(10)) return;

    const s = ctx.player.status.extraLife;
    if (s.charges == 0) return;
  
    s.charges -= 1;
  
    ctx.player.dead = false;
    ctx.player.hp = ctx.player.stats.final.hp * 0.5;
  
    s.buffTime = context.buffs.value[10].tier >= 2? 8: 0;
    s.immuneTime = context.buffs.value[10].tier >= 3 ? 3 : 0;
  }, -100);
  
  engine.addHook("onEnemyDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(10)) return;
  
    deathStatus(ctx);
  }, 100)

  engine.addHook("onHeroDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(10)) return;
  
    deathStatus(ctx);
  }, 100)

  const deathStatus = (ctx) => {
    const tier = context.buffs.value[10].tier;

    const chance = 0.5 + context.dimensions.getDimReward(4);

    const guaranteed = Math.floor(chance);
    const extraChance = chance - guaranteed;

    let charges = guaranteed;

    if (Math.random() < extraChance) {
      charges += 1;
    }


    let shields = (tier >= 4? tier: 0);

    ctx.player.status.extraLife = {
      charges: charges,              
      chance: chance,                
      buffTime: 0,
      immuneTime: 0,
      shields: shields
    };
  }

  hStats.addHook("multiplicative", (final) => {
    const s = player.value.status.extraLife;
    if (s.buffTime <= 0) return;
  
    final.atk *= 1.5;
    final.def *= 2;
  });

  engine.addHook("beforeHeroDamage", (ctx) => {
    const s = ctx.player.status.extraLife;
    if (!s) return;
  
    if (s.immuneTime > 0) {
      ctx.villian.attack.canceled = true;
      ctx.villian.attack.final = 0;
      return;
    }
  
    if (s.shields > 0) {
      s.shields -= 1;
      ctx.villian.attack.canceled = true;
      ctx.villian.attack.final = 0;

      ctx.villian.attack.effects.push({
        type: "block",
        icon: "⛨",
      });
    }
  }, -100);

  engine.addHook("beforeTick", (ctx) => {
    const s = ctx.player.status.extraLife;
    if (!s) return;
  
    if (s.buffTime > 0) s.buffTime -= ctx.dt;
    if (s.immuneTime > 0) s.immuneTime -= ctx.dt;
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(10)) 
  
    ctx.player.status.extraLife = {
      charges: 0,              
      chance: 0.5,                
      buffTime: 0,
      immuneTime: 0,
      shields: 0
    };
  })

  // 11. Sniper

  hStats.addHook("additive", (final) => {
    player.value.status.sniper.crit = 0;
    player.value.status.sniper.critDMg = 0;

    if (!player.value.buff.activeBuffs.includes(11)) return;
  
    const tier = context.buffs.value[11].tier + context.buffs.value[11].extraTier;

    let crit = 5 * tier;
    let critDmg = 0.25 * tier;

    player.value.status.sniper.crit = crit;
    player.value.status.sniper.critDMg = critDmg;

    final.crit += crit;
    final.critDmg += critDmg;
  });

  engine.addHook("onEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(11)) return;
    if (context.buffs.value[11].tier < 2) return;
  
    if (!ctx.player.attack.crit) return;
  
    const tier = context.buffs.value[11].tier;
    const slow = 0.08 * tier;
    const duration = 0.25 * tier;
  
    ctx.player.status.sniper.apsSlow = Math.max(1 - slow, 0);

    ctx.player.status.sniper.apsSlowTime = duration;
  }, -40);

  engine.addHook("onEnemyDeath", (ctx) => {
    ctx.player.status.sniper.apsSlow = 1;
    ctx.player.status.sniper.apsSlowTime = 0;
  })

  engine.addHook("beforeTick", (ctx) => {
    const s = ctx.player.status.sniper;
    if (s.apsSlowTime > 0) s.apsSlowTime -= ctx.dt;
    else s.apsSlow = 1;
  });

  eStats.addHook("multiplicative", (final) => {
    let total = player.value.status.sniper.apsSlow;

    final.aps *= total;
  })

  hStats.addHook("additive", (final) => {
    if (!player.value.buff.activeBuffs.includes(11)) return;
    if (context.buffs.value[11].tier < 3) return;
    
    const tier = context.buffs.value[11].tier + context.buffs.value[11].extraTier;

    final.hit += 0.075 * tier;
  })

  engine.addHook("beforeEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(11)) return;
    if (context.buffs.value[11].tier < 4) return;
    if (ctx.player.attack.crit) return;
  
    const chance = ctx.player.stats.final.crit;
    ctx.player.attack.crit = Math.random() * 100 < chance;
  }, -60 + 1);

  engine.addHook("beforeTick", (ctx) => {
    if (player.value.buff.activeBuffs.includes(11)) return;

    ctx.player.status.sniper.apsSlow = 1;
    ctx.player.status.sniper.apsSlowTime = 0;
  });

  // 12. Berserk

  const isLowHP = (p) => p.hp / p.stats.final.hp <= p.status.berserk.lowLife;

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(12)) return;

    ctx.player.status.berserk.status = true;
    ctx.player.status.berserk.lowLife = 0.3 + context.buffs.value[12].extraTier * 0.02;

    if(context.buffs.value[12].tier >= 4)
      ctx.player.status.berserk.isRage = true;

  })

  hStats.addHook("multiplicative", (final) => {
    player.value.status.berserk.lowLifeDmg = 1;
    if (!player.value.buff.activeBuffs.includes(12)) return;
    if (!isLowHP(player.value)) return;
    
    let totalTier = context.buffs.value[12].tier + context.buffs.value[12].extraTier;
    let mult = 1.25 ** totalTier;

    player.value.status.berserk.lowLifeDmg = mult;

    final.atk *= mult; 
  });

  hStats.addHook("additive", (final) => {
    if (!player.value.buff.activeBuffs.includes(12)) return;
    if (context.buffs.value[12].tier < 2) return;
    if (!isLowHP(player.value)) return;
  
    let totalTier = context.buffs.value[12].tier + context.buffs.value[12].extraTier;

    let crit = 3 * totalTier;
    let critDmg = 0.15 * totalTier;

    player.value.status.berserk.crit = crit;
    player.value.status.berserk.critDmg = critDmg;

    final.crit += crit;
    final.critDmg += critDmg;
  });

  engine.addHook("beforeTick", (ctx) => {
    ctx.player.heal.regen.s3 = 0;
    if (ctx.player.dead) return;
    if (ctx.player.hp == 0) return;
    if (!player.value.buff.activeBuffs.includes(12)) return;
    if (context.buffs.value[12].tier < 3) return;
    if (!isLowHP(player.value)) return;
    
    let healMult = ctx.player.heal.mult;

    const missingPercent = 1 - ctx.player.hp / ctx.player.stats.final.hp; 
    const healPercent = missingPercent * 0.1 * healMult;
    ctx.player.heal.regen.s3 = ctx.player.stats.final.hp * missingPercent * 0.1;
    ctx.player.hp = Math.min(ctx.player.hp + healPercent * ctx.player.stats.final.hp * ctx.dt, ctx.player.stats.final.hp);
  });

  ///rage on hit
  engine.addHook("afterEnemyDamage", (ctx) => {
    if(!ctx.player.status.berserk.isRage) return;

    ctx.player.status.berserk.rage += 1;
  });

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.status.berserk.isRage) return;

    let mult = 1 + 0.01 * player.value.status.berserk.rage;

    player.value.status.berserk.rageDmg = mult;
    final.atk *= mult;
  })


  eStats.addHook("multiplicative", (final) => {
    if (!player.value.status.berserk.isRage) return;

    let lessDMG = 0.0015 * player.value.status.berserk.rage;
    player.value.status.berserk.lessDmg = lessDMG;

    final.atk *= Math.max(1 - lessDMG, 0.1);
  })


  hStats.addHook("multiplicative", (final) => {
    if (!player.value.status.berserk.isRage) return;

    player.value.status.berserk.healMult = 1 + 0.001 * player.value.status.berserk.rage;

    final.regenMult *= player.value.status.berserk.healMult;
  })


  engine.addHook("afterEnemyDamage", (ctx) => {
    if (!player.value.status.berserk.isRage) return;

    ctx.player.status.berserk.rageTimer = 1 - 0.005 * player.value.status.berserk.rage;
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.status.berserk.isRage) return;

    ctx.player.status.berserk.rageTimer -= ctx.dt;

    if(ctx.player.status.berserk.rageTimer <= 0) {
      let loseRage = 1 + 0.01 * ctx.player.status.berserk.rageTick;
      ctx.player.status.berserk.rageTick += ctx.dt;
      ctx.player.status.berserk.rage = Math.max(ctx.player.status.berserk.rage - loseRage, 0);
    } else {
      ctx.player.status.berserk.rageTick = 0;
    }

    ctx.player.status.berserk.rageTime = 1 - 0.005 * player.value.status.berserk.rage;
  });

  engine.addHook("beforeTick", (ctx) => {
    if (player.value.buff.activeBuffs.includes(12)) return;
    
    ctx.player.heal.regen.s3 = 0;
    ctx.player.status.berserk.isRage = false;
    ctx.player.status.berserk.status = false;
    ctx.player.status.berserk.rage = 0;
  });

  // 13. Juggernaut

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(13)) {
      player.value.status.juggernaut.extraDef = 1;
      return;
    }
    
    final.def *= 2;
    final.hp  *= 1.5;
    final.atk *= 0.75;
  });

  hStats.addHook("post", (final) => {
    if (!player.value.buff.activeBuffs.includes(13)) return;
    if (context.buffs.value[13].tier < 2) return;

    const missingPercent = 1 - player.value.hp / player.value.stats.final.hp;
    const stacks = Math.floor(missingPercent * 10); 
  
    final.def *= 1 + 0.1 * stacks;
  });

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(13)) return;
    if (context.buffs.value[13].tier < 3) return;
    
    let mult = Math.sqrt(Math.log(Math.max(player.value.stats.final.hp, 3)));

    player.value.status.juggernaut.extraDef = mult;
    final.def *= mult;
  });

  eStats.addHook("post", (final) => {
    if (!player.value.buff.activeBuffs.includes(13)) return;
    if (context.buffs.value[13].tier < 4) return;

    let lessDMG = 0.15 * context.buffs.value[13].tier;
  
    final.critDmg *= Math.max(1 - lessDMG, 0);
  });

  // 14. Flash

  hStats.addHook("additive", (final) => {
    if (!player.value.buff.activeBuffs.includes(14)) return;

    final.minAps += 0.5;
  })

  hStats.addHook("additive", (final) => {
    player.value.status.flash.as = 0;
    if (!player.value.buff.activeBuffs.includes(14)) return;
    if (context.buffs.value[14].tier < 2) return;

    const stages = context.hero.value.stages.current || 0;
    const bonus = Math.min(stages * 0.01, 1);
    player.value.status.flash.as = Math.min(stages * 0.01, 1);
  
    final.aps += bonus;
  });

  hStats.addHook("additive", (final) => {
    player.value.status.flash.maxAs = 0;
    if (!player.value.buff.activeBuffs.includes(14)) return;
    if (context.buffs.value[14].tier < 3) return;

    let t = 0.05 * context.buffs.value[14].tier;

    player.value.status.flash.maxAs = t;
    final.maxAps += t;
  })

  engine.addHook("beforeHeroAttack", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(14)) return;
    if (context.buffs.value[14].tier < 4) return;

    ctx.player.status.flash.status = true;
    const overcap = ctx.player.APS.total - ctx.player.APS.max;
    
    let extraHit = Math.max(Math.log(3 + Math.max(overcap, 0) ** 2.25) - 1 , 0);

    const requiredOvercap = Math.pow(Math.exp(Math.floor(extraHit) + 2) - 3, 1 / 2.25);
    const requiredAPS = ctx.player.APS.max + requiredOvercap;
  
    ctx.player.status.flash.hitReq = requiredAPS;
    ctx.player.status.flash.extraHits = Math.floor(extraHit);

    if (overcap <= 0) return;

    ctx.player.extras.hits += Math.floor(extraHit);

  }, -20);

  engine.addHook("beforeTick", (ctx) => {
    if (player.value.buff.activeBuffs.includes(14)) return;

    ctx.player.status.flash.status = false;
  });

  // 15. Black Impulse

  engine.addHook("onHeroAttack", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(15)) return;
    if (context.buffs.value[15].tier < 1) return;

  
    const bi = ctx.player.status.blackImpulse;
  
    if (Math.random() <= bi.chance) {
      bi.stacks += 1;
      bi.chance *= 0.9;
    } else {
      bi.stacks = 0;
      bi.chance = 1;
    }
  }, -20);

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(15)) return;
    const bi = player.value.status.blackImpulse;
    if (bi.stacks <= 0) return;
  
    final.atk *= Math.pow(1.2, bi.stacks);
  });


  engine.addHook("beforeEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(15)) return;
    if (context.buffs.value[15].tier < 2) return;
  
    if (Math.random() < 0.1) {
      ctx.player.attack.defIgnore = true;
      ctx.player.status.blackImpulse.defIgnored = true;
    }
  
    if (ctx.villian.stats.final.def <= 0) {
      ctx.player.attack.final *= 1.5;
    }
  }, -20);
  
  engine.addHook("afterEnemyDamage", (ctx) => {
    ctx.player.status.blackImpulse.defIgnored = false;
  });

  engine.addHook("onHeroAttack", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(15)) return;
    if (context.buffs.value[15].tier < 3) return;
    
    const bi = ctx.player.status.blackImpulse;
    let chance = 0.05 + 0.0025 * bi.stacks;
    if (Math.random() > chance) return;

    bi.curseDisableTime = 1;
  });


  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(15)) return;
    if (ctx.player.status.blackImpulse.curseDisableTime <= 0) return;

    ctx.player.status.blackImpulse.curseDisableTime -= ctx.dt;
  });

  engine.addHook("beforeEnemyDamage", (ctx) => {
    ctx.player.status.blackImpulse.dmgBonus = 0;
    if (!player.value.buff.activeBuffs.includes(15)) return;
    if (context.buffs.value[15].tier < 4) return;

    const diff = ctx.villian.hp / Math.max(ctx.player.attack.final, 1);
    if (diff > 1) {
      ctx.player.attack.final *= diff ** 0.25;
      ctx.player.status.blackImpulse.dmgBonus = diff ** 0.25;
    }
  }, -50);

  engine.addHook("beforeTick", (ctx) => {
    if (player.value.buff.activeBuffs.includes(15)) return;
    
    const bi = ctx.player.status.blackImpulse;

    bi.stacks = 0;
    bi.chance = 1;
    bi.curseDisableTime = 0;
    bi.defIgnore = false;
  });

  // 16. Irradiation
  
  engine.addHook("onEnemyDeath", (ctx) => {
    ctx.player.status.irradiation.loseHp = false;
    if (!player.value.buff.activeBuffs.includes(16)) return;
    if (context.buffs.value[16].tier < 1) return;
    if (ctx.hero.bhTier >= 5 && ctx.hero.dId == 'bh') return;
  
    ctx.player.status.irradiation.loseHp = true;
  }, 100);

  engine.addHook("afterEnemyDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(16)) return;
    if (context.buffs.value[16].tier < 2) return;
    if (ctx.hero.bhTier >= 5 && ctx.hero.dId == 'bh') return;
  
    if(ctx.villian.stats.final.hp * 0.5 > ctx.villian.hp) return;

    const dmg = ctx.villian.stats.final.hp * 0.005;
  
    ctx.villian.hp = Math.max(ctx.villian.hp - dmg, 1);
  });

  engine.addHook("onEnemyDamage", (ctx) => {
    const r = ctx.player.status.irradiation;
    if (!player.value.buff.activeBuffs.includes(16)) {
      r.stacks = 0;
      return;
    }
    if (context.buffs.value[16].tier < 3) return;
    if (ctx.hero.bhTier >= 5 && ctx.hero.dId == 'bh') return;
  
    
    r.stacks = Math.min(r.stacks + 1, r.maxStacks);
  });

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(16)) return;
    if (context.buffs.value[16].tier < 4) return;
    if (ctx.hero.bhTier >= 5 && ctx.hero.dId == 'bh') return;
  
    const r = ctx.player.status.irradiation;
    if (r.stacks < r.maxStacks) return;
    if (ctx.villian.stats.final.hp * 0.25 > ctx.villian.hp) return;
    
    const dmg = ctx.villian.stats.final.hp * 0.01 * ctx.dt;
  
    ctx.villian.hp = Math.max(ctx.villian.hp - dmg, 0);
  });

  engine.addHook("afterHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(16)) return;
    
    let tier = context.buffs.value[16].tier;
    let transfer;
    if (ctx.villian.attack.effective > 0) {
      transfer = (tier >= 4? Math.floor(ctx.player.status.irradiation.stacks * 0.5): 0)
      ctx.player.status.irradiation.stacks = (transfer > 0? transfer: 0);
    }
    
  });

  engine.addHook("onEnemyDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(16)) return;
    
    let tier = context.buffs.value[16].tier;
    let transfer = (tier >= 4? Math.floor(ctx.player.status.irradiation.stacks * 0.5): 0);

    ctx.player.status.irradiation.stacks = (transfer > 0? transfer: 0);
  });

  // 17. Gravitational Field

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(17)) return;
    if (context.buffs.value[17].tier < 1) return;

    const g = ctx.player.status.gravity;
    if (!g.active) return;
  
    g.tickTimer += ctx.dt;
    if (g.tickTimer < g.tickInterval) return;
  
    g.tickTimer = 0;
    let tier = context.buffs.value[17].tier;
    
    let defIgnore = (tier >= 8? 0: 1);

    const dmg =
      ctx.player.stats.final.atk * 0.01 * g.dmgMultiplier - 
      ctx.villian.stats.final.def * defIgnore;
  
    ctx.villian.hp = Math.max(ctx.villian.hp - dmg, 0);
  });

  engine.addHook("beforeTick", (ctx) => {
    let tier = context.buffs.value[17].tier;
    const g = ctx.player.status.gravity;

    g.tickInterval = 0.2 - 
    (tier >= 3? 0.025: 0) -
    (tier >= 5? 0.025: 0) -
    (tier >= 7? 0.025: 0) -
    (tier >= 9? 0.025: 0) -
    (tier >= 10? 0.001 * tier: 0);
    
    g.tickInterval = Math.max(g.tickInterval, 0.05);

  }, -10);

  engine.addHook("onEnemyDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(17)) return;
    if (context.buffs.value[17].tier < 2) return;
  
    const g = ctx.player.status.gravity;
    let tier = context.buffs.value[17].tier;

    g.maxStacks = 50 + (tier >= 6? 50: 0);
    g.stackDuration = 3 + (tier >= 6? 3: 0);
  
    if (g.stacks < g.maxStacks) {
      g.stacks++;
      g.stacksTTL.push(g.stackDuration);
    }
  });

  engine.addHook("onEnemyDeath", (ctx) => {
    const g = ctx.player.status.gravity;
    if (g.stacks === 0) return;
  
    for (let i = g.stacksTTL.length - 1; i >= 0; i--) {
      g.stacksTTL[i] -= ctx.dt;
      if (g.stacksTTL[i] <= 0) {
        g.stacksTTL.splice(i, 1);
        g.stacks--;
      }
    }
  });

  hStats.addHook("multiplicative", (final) => {
    if (!player.value.buff.activeBuffs.includes(17)) return;
    if (context.buffs.value[17].tier < 2) return;
  
    final.regenMult *= 1 + ctx.player.status.gravity.stacks * 0.005;
    final.def *= 1 + ctx.player.status.gravity.stacks * 0.01;
  });

  engine.addHook("onEnemyDeath", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(17)) return;
    if (context.buffs.value[17].tier < 3) return;

    const g = ctx.player.status.gravity;
    
    g.overkill = Math.floor(1.1 ** g.stacks);
  }, -50);

  engine.addHook("beforeTick", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(17)) return;
    if (context.buffs.value[17].tier < 5) return;
  
    ctx.player.status.gravity.dmgMultiplier =
      Math.max(Math.log(Math.max(ctx.player.status.gravity.stacks, 4)), 1);
  });

  engine.addHook("beforeHeroDamage", (ctx) => {
    if (!player.value.buff.activeBuffs.includes(17)) return;
    if (context.buffs.value[17].tier < 9) return;
  
    ctx.player.status.gravity.dotReduction =
      (1 - ctx.player.status.gravity.stacks * 0.01);
  });
}
  
  