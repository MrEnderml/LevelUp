import { autoProgress } from "../../autoProgression";

export function engineSetup(engine, context) {

    engine.addHook("onEnemyDeath", (ctx) => {
        context.progress.bossKillHandle(context);
        context.progress.grantExp(context);
        context.progress.formationHandler();

        context.eq.weaponDrop();
        context.soul.soulKillHandle();
        context.amulets.curseBonus();
        context.amulets.expSkillsGrant();

        context.rad.rewardSpecialCreature();
        
        context.progress.stageHandler(context);
        context.progress.createEnemy(context);

        context.progress.refreshKillsPerZone(context);

        context.rad.celestialSpawn();
        context.rad.mutagenGain();
        

        context.space.starudstGain(ctx);
        
        ctx.villian.dead = false;
        ctx.villian.bar = 0;
        ctx.hero.settings.battleTime = 0;
    })

    engine.addHook("onHeroDeath", (ctx) => {
        ctx.hero.resetKilledTime = 1;
        ctx.player.bar = 0;
        ctx.villian.bar = 0;
        ctx.player.statistic.deaths++;

        if(ctx.hero.spaceUnlocked && !ctx.hero.isSingularity)
          ctx.hero.kills = Math.floor(Math.max(ctx.hero.kills - ctx.hero.killsPerZone * ctx.hero.corruption.killsLose, 0));

        context.abyss.corrInflueceHandle(14);
        context.abyss.corrInflueceHandle(15);

        if (ctx.hero.dims.veil.stacks > 0)
          ctx.hero.dims.veil.stacks -= 1;

        if(ctx.villian.spawnType == 'boss' || ctx.villian.spawnType == 'deBoss') {
            context.progress.resetStageOnBoss(context);
        }

        context.progress.createEnemy(context);
    })

    engine.addHook("beforeTick", (ctx) => {
        if(ctx.player.dead) {
            context.progress.heroRecovery(context, ctx.dt)
        }
    })

    engine.addHook("beforeTick", (ctx) => {
        context.tree.treeAuto(ctx.dt);

        context.progress.checkLevelUp(context);
        context.progress.eventsProgressHandle();
        if (ctx.hero.afkModeKills > 0)
          context.progress.afkBattle(context, ctx.hero.afkModeKills);
        
        context.buff.buffActivation();
        context.buff.syncActiveBuffs(ctx.player);
        context.eq.eqStatsHandle();

        context.ascension.ascensionHandle(ctx);
        context.ascension.ascensionAuto();

        context.amulets.amuletsHandler();
        context.soul.soulHandle();
        context.rebirth.rebirthHandle();
        context.space.spaceHandle();

        context.rad.radiationHandle();

        context.inf.infHandler(context);

        context.spStats.calculateLevel();
        context.spStats.calculateMaxLevelTotal();
        context.spStats.corruptionHandle();
        context.spStats.darkDimsHandle(ctx.dt);

        context.space.spaceAuto(ctx.dt);

        context.eq.autoForgeAll();

        context.timeline.applyLaw();
        context.timeline.timelineAuto(ctx.dt);

        autoProgress();

        context.resets.dimHandle();

        context.abyss.autoDimAbyss();
        context.abyss.autoAbyss();

        context.void.voidTimer(ctx.dt);

        context.loot.lootHandler(ctx.dt);

        if (ctx.hero.timePenalty)
          context.loot.globalAvgReset();

        context.loading.timePenaltyHandler();

        ctx.hero.dTimer += ctx.dt;

        if(!ctx.player.dead)
          ctx.hero.settings.battleTime += ctx.dt;
    })


    engine.addHook("onHeroDeath", (ctx) => {
        if(ctx.hero.dId != 'survival-2') return;

        ctx.hero.dims.survival.stage = Math.max(ctx.hero.maxStage, ctx.hero.dims.survival.stage);

        context.resets.performInf();
    }, 100)

    // Weak Stacks
    engine.addHook("onHeroDeath", (ctx) => {
        let stack = context.dimensions.getDimReward(2);
  
        ctx.villian.status.weakStack.count = Math.min(ctx.villian.status.weakStack.count + stack, ctx.villian.status.weakStack.max);
        
      })
  
      engine.addHook("onEnemyDeath", (ctx) => {
        if(context.dimensions.getDimSpecialReward(45)) return;

        if(context.dimensions.getDimSpecialReward(2))
          ctx.villian.status.weakStack.count = Math.floor(ctx.villian.status.weakStack.count * 0.9);
        else
          ctx.villian.status.weakStack.count = 0;
      })

      engine.addHook("onEnemyDeath", (ctx) => {
        if(!context.dimensions.getDimSpecialReward(45)) return;

        
        ctx.villian.status.weakStack.count = 90;
      })
  
      // Traverll penalty
  
      engine.addHook("beforeTick", (ctx) => {
        if(!ctx.hero.isTravell) return;
  
        ctx.hero.travellPenalty = Math.max(ctx.hero.travellPenalty - ctx.dt * 0.01, 1);
      })
      
      // Survival dims
      engine.addHook("onHeroDeath", (ctx) => {
        if (ctx.hero.dId == "survival")
  
        ctx.hero.kills = 0;
      })

      //Bleeding Veil
      engine.addHook("onHeroDeath", (ctx) => {
        if (ctx.hero.dId == "d-survival-2")
  
        context.resets.performInf();
      }, 100)

      engine.addHook("onHeroDeath", (ctx) => {
        if (ctx.hero.dId != "c-survival") return;
        if (ctx.hero.dTimer < 60) return;
  
        context.resets.performInf();
        ctx.player.hp = ctx.player.stats.final.hp;
      }, 100)

 
}