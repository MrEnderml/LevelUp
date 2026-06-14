export function engineSpaceSetup(engine, context) {

    engine.addHook("onEnemyDeath", (ctx) => {
        if(ctx.villian.hp === 0) {
            if (ctx.hero.isInfSpace) {
                ctx.hero.spsCount++;
                ctx.hero.spsCountMax = Math.max(ctx.hero.spsCount, ctx.hero.spsCountMax)
                if (ctx.hero.dId == 'main' && ctx.hero.mainInfTier >= 60)
                    ctx.hero.spsCount = ctx.hero.spsCountMax;
            }
            else ctx.hero.spCount = Math.min(ctx.hero.spCount + 1, ctx.hero.spMaxCount);
        }
            
        context.space.leaveSpaceEnemy();
    })

    engine.addHook("onHeroDeath", (ctx) => {
        context.space.leaveSpaceEnemy();
    })

    engine.addHook("beforeTick", (ctx) => {
        if(!ctx.villian.space.isSpaceFight) return;

        ctx.villian.space.fightCooldown = Math.max(ctx.villian.space.fightCooldown - ctx.dt, 0);
        if(ctx.villian.space.fightCooldown == 0) {
            ctx.player.hp = 0;
            context.space.leaveSpaceEnemy();
        }
    })

    engine.addHook("beforeTick", (ctx) => {
        context.buff.syncActiveBuffs(ctx.player);

        if(!ctx.hero.spaceUnlocked) {
            context.space.leaveSpaceEnemy();
        }
    })

}