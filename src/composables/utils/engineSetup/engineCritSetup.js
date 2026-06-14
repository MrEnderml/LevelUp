import { dimensions } from "../../../data/dimensions";
import { useFloatingDamage } from "../../UI/useFloatingDamage";
import { fn } from "../global";

export function engineCritSetup(engine, hStats, eStats, p, v, context) {
    let h = context.hero.value;
    let e = context.enemy.value;

    let mls = context.spStats;
    let stats = p.value.stats.final;

    engine.addHook("afterHeroAttack", (ctx) => {
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 10) return;

        if (Math.random() >= stats.crit * 0.01) return;
        if ( ctx.villian.status.stun.d > 0) return;
        if (Math.random() >= mls.critMilestoneHandle(0).chance * 0.01) return;

        let stun = mls.critMilestoneHandle(0).d;
        ctx.villian.status.stun.d = stun;
    
        ctx.player.attack.effects.push({
          type: "stun",
          icon: "💫",
        });
    });

    engine.addHook("onEnemyDeath", (ctx) => {
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 15) return;
        if (!ctx.player.attack.crit) return;

        if (Math.random() >= stats.crit * 0.01) return;

        let heal = mls.critMilestoneHandle(1) * 0.01 * ctx.player.stats.final.hp;

        ctx.player.hp = Math.min(ctx.player.hp + heal, ctx.player.stats.final.hp);
    });

    engine.addHook("beforeEnemyDamage", (ctx) => {
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 20) return;

        if (Math.random() >= stats.crit * 0.01) return;
        if (Math.random() >= mls.critMilestoneHandle(2) * 0.01) return;

        ctx.player.attack.defIgnore = true;
    }, -20);

    engine.addHook("beforeEnemyDamage", (ctx) => {
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 25) return;

        if (Math.random() >= stats.crit * 0.01) return;
        if (Math.random() >= mls.critMilestoneHandle(3).chance * 0.01) return;

        ctx.player.status.critMls.healBlock = mls.critMilestoneHandle(3).d;
    });

    engine.addHook("beforeTick", (ctx) => {
        if (!context.dimensions.getDimSpecialReward(54)) return;

        ctx.player.status.critMls.healBlock = Math.max(ctx.player.status.critMls.healBlock - ctx.dt);
    });

    engine.addHook("onEnemyDeath", (ctx) => {
        ctx.player.status.critMls.loot = 1;
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 30) return;

        if (Math.random() >= stats.crit * 0.01) return;

        ctx.player.status.critMls.loot = mls.critMilestoneHandle(4);
    }, -100);

    engine.addHook("onEnemyDeath", (ctx) => {
        ctx.player.status.critMls.overkill = 0;
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 35) return;

        if (Math.random() >= stats.crit * 0.01) return;

        ctx.player.status.critMls.overkill = mls.critMilestoneHandle(5);
    }, -100);

    engine.addHook("beforeEnemyDamage", (ctx) => {
        if (!context.dimensions.getDimSpecialReward(54)) return;
        if (stats.critDmg < 40) return;

        if (Math.random() >= stats.crit * 0.01) return;
        if (Math.random() >= mls.critMilestoneHandle(6).chance * 0.01) return;

        let dmg = mls.critMilestoneHandle(6).effect * 0.01 * ctx.villian.stats.final.hp;

        ctx.villian.hp = Math.min(ctx.villian.hp - dmg, ctx.villian.stats.final.hp);
    });
    

}