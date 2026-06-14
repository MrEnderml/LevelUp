import { useFloatingDamage } from "../UI/useFloatingDamage";

export function createBattleEngine(hero, enemy, player, villian) {
  const ctx = { hero, enemy, player, villian, dt: 0 };

  const hooks = {
    beforeTick: [],
    afterTick: [],

    beforeHeroAttack: [],
    onHeroAttack: [],
    afterHeroAttack: [],

    beforeEnemyAttack: [],
    onEnemyAttack: [],
    afterEnemyAttack: [],

    beforeHeroDamage: [],
    onHeroDamage: [],
    afterHeroDamage: [],

    beforeEnemyDamage: [],
    onEnemyDamage: [],
    afterEnemyDamage: [],

    onEnemyDeath: [],
    onHeroDeath: [],
    onHeroDeathing: [],
  };

  const { pushDamageLog, updateFloatingHits } = useFloatingDamage();

  //beforeHeroAttack
  //onHeroAttack
  //applyDamageToEnemy()
  //beforeEnemyDamage
  // damage on enemy
  //onEnemyDamage
  //afterEnemyDamage
  //afterHeroAttack

  function addHook(name, fn, priority = 0) {
    hooks[name].push({ fn, priority });
  }

  function emitHook(name, ...args) {
    const list = hooks[name];
    if (!list) return;
  
    for (const { fn } of [...list].sort((a, b) => a.priority - b.priority)) {
      fn(ctx, ...args);
    }
  }

  function checkDeath(entity, hookName1, hookName2) {
    if (entity.hp <= 0 && !entity.dead)
      emitHook(hookName1)

    if (entity.hp <= 0 && !entity.dead) {
      entity.dead = true;
      emitHook(hookName2);
    }
  }

  function createAttack(base, source) {
    return {
      base,
      final: base,
      effective: base,
      canceled: false,
      source,
      effects: [],
      defIgnore: false,
      crit: false,
      extraHits: ctx[source].extras.hits,
      extraChance: ctx[source].extras.chance,
    };
  }

  function updateBars(dt) {
    const H = ctx.player;
    const E = ctx.villian;
  
    if (!H.dead) {
      if (H.status.stun.d > 0) H.status.stun.d = Math.max(0, H.status.stun.d - dt);
      else H.bar += (H.APS.current || 0) * dt;
    }
  
    if (!E.dead && !H.dead) {
      if (E.status.stun.d > 0) E.status.stun.d = Math.max(0, E.status.stun.d - dt);
      else E.bar += (E.APS.current || 0) * dt;
    }
  }

  function applyDamageToEnemy() {
    emitHook("beforeEnemyDamage");

    avgAttack(ctx.player);
    if (!ctx.player.attack.canceled) {
      ctx.villian.hp = Math.max(0, ctx.villian.hp - ctx.player.attack.effective);
      ctx.player.attackCount++;
    }

    emitHook("onEnemyDamage");
    emitHook("afterEnemyDamage");
  }

  function applyDamageToHero() {
    emitHook("beforeHeroDamage");

    avgAttack(ctx.villian);

    if (!ctx.villian.attack.canceled) {
      ctx.player.hp = Math.max(0, ctx.player.hp - ctx.villian.attack.effective);
      ctx.villian.attack.count++;
    }

    emitHook("onHeroDamage");
    emitHook("afterHeroDamage");

    
  }

  function processHeroAttack() {
    const H = ctx.player;
    if (H.bar < 1) return;
  
    H.bar -= 1;
    ctx.player.attackCount = 0;

    emitHook("beforeHeroAttack");
    ctx.player.attack = createAttack(H.stats.final.atk || 0, "player");
    emitHook("onHeroAttack");
  
    executeHeroAttack(ctx.player.attack);
    checkDeath(ctx.villian, "onEnemyDeathing", "onEnemyDeath");
    emitHook("afterHeroAttack");
  }

  function processEnemyAttack() {
    const E = ctx.villian;
    if (E.bar < 1) return;
  
    E.bar -= 1;
    ctx.villian.attackCount = 0;
  
    emitHook("beforeEnemyAttack");
    ctx.villian.attack = createAttack(E.stats.final.atk || 0, "villian");
    emitHook("onEnemyAttack");
  
    executeEnemyAttack(ctx.villian.attack);
    checkDeath(ctx.player, "onHeroDeathing", "onHeroDeath");
    emitHook("afterEnemyAttack");
  }

  function executeHeroAttack(attack) {
    applyDamageToEnemy();
  
    for (let i = 0; i < attack.extraHits; i++) {
      ctx.player.attack = createAttack(ctx.player.stats.final.atk || 0, "player");
      emitHook("onHeroAttack");
      applyDamageToEnemy();
    }
  
    if (attack.extraChance > 0 && Math.random() < attack.extraChance) {
      ctx.player.attack = createAttack(ctx.player.stats.final.atk || 0, "player");
      emitHook("onHeroAttack");
      applyDamageToEnemy();
    }
  }

  function executeEnemyAttack(attack) {
    applyDamageToHero();
  
    for (let i = 0; i < attack.extraHits; i++) {
      ctx.villian.attack = createAttack(ctx.villian.stats.final.atk || 0, "villian");
      emitHook("onEnemyAttack");
      applyDamageToHero();
    }
  
    if (attack.extraChance > 0 && Math.random() < attack.extraChance) {
      ctx.villian.attack = createAttack(ctx.villian.stats.final.atk || 0, "villian");
      emitHook("onEnemyAttack");
      applyDamageToHero();
    }
  }

  function tick(dt) {
    ctx.dt = dt;

    emitHook("beforeTick");
    updateBars(dt);
    emitHook("afterTick");

    checkDeath(ctx.player, "onHeroDeathing", "onHeroDeath");
    checkDeath(ctx.villian, "onEnemyDeathing", "onEnemyDeath");
    
    processHeroAttack();
    processEnemyAttack();

    updateFloatingHits(ctx.player, dt);
    updateFloatingHits(ctx.villian, dt);
  }

  function avgAttack(sourse) {
    let atk = sourse.attack;

    if (atk.final > atk.max) atk.max = atk.final;
    if (atk.final < atk.min) atk.min = atk.final;

    atk.avg = (atk.min + atk.max) / 2;

    pushDamageLog(sourse);
  }

  return { ctx, addHook, emitHook, tick };
}
