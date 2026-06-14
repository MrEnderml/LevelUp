export function setupGlobalEnemyBattleStats(hStats, eStats, p, v, context) {
    
    eStats.addHook("multiplicative", (final) => {
        if(!context.tree.isActiveRadNode(2)) return;

        let lessDmg = context.tree.nodesHandler(2, ['rad']) * 0.01;
        
        final.atk *= Math.max(1 - lessDmg, 0.1);
    });

    eStats.addHook("multiplicative", (final) => {
        final.aps *= p.value.status.sniper.apsSlow;
    });

    eStats.addHook("multiplicative", (final) => {
        let lessDmg = (context.hero.value.soulPower.tier >= 4 && 
            context.hero.value.infExpansions.soul? context.hero.value.soulPower.special[4].value * 0.01: 0);
        
        final.atk *= Math.max(1 - lessDmg, 0.1);
    });

    eStats.addHook("post", (final) => {
        let base = final.aps;

        if (v.spawnType == 'd-corruption') {
            base = 0.5;
        } else if (context.hero.value.dId == 'bh') {
            base = v.value.bh.aps;
            v.value.APS.min = base;
        } else {
            v.value.APS.total = base;
            v.value.APS.max = final.maxAps;
            v.value.APS.min = final.minAps;
        }
            
        final.aps = Math.min(Math.max(base, v.value.APS.min), Math.max(v.value.APS.max , v.value.APS.min))
        v.value.APS.current = final.aps;
    });


    eStats.addHook("post", (final) => {
        v.value.avoid.max = 0.75;
    
        v.value.avoid.total = final.dodge;
        v.value.avoid.base = Math.min(final.dodge, v.value.avoid.max);
    });

}
  