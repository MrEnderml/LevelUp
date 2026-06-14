import { useHero } from "../useHero";

export const avgLoot = () => {

    const { hero } = useHero();

    function updateEMA(stat, deltaTime, smoothing = 0.05) {
        if (deltaTime === 0) return;
      
        const currentRate = stat.acc / deltaTime;
      
        const next =
            stat.perSec + (currentRate - stat.perSec) * smoothing;

        stat.perSec = Math.max(next, 0);

        if (stat.perSec < 0.01)
            stat.perSec = 0

        stat.acc = 0;
    }

    function updateEMARes(stat, deltaTime) {
        if (deltaTime === 0) return;
      
        const currentRate = stat.acc / deltaTime;
      
        stat.perSec = Math.max(currentRate, 0);

        if (stat.perSec < 0.01)
            stat.perSec = 0
    }
    
    function lootHandler  (dt) {
        hero.value.trackerSleep += dt;
        hero.value.trackerTimer += dt;
        hero.value.trackerResTimer += dt;
        
        hero.value.avgResources.ascension.timer += dt;
        hero.value.avgResources.rebirth.timer += dt;
    
        if (hero.value.trackerSleep < 1)
            return;

        let stats = hero.value.avgLoot;
        let res = hero.value.avgResources;

        hero.value.trackerSleep = 0;

        for (let key in stats) {
            updateEMA(stats[key], hero.value.trackerTimer, stats[key].smoothing);
        }

        for (let key in res) {
            updateEMARes(res[key], res[key].timer);
        }

        hero.value.trackerTimer = 0;
        hero.value.trackerSleep = 0;
    }

    const avgReset = () => {
        hero.value.avgLoot.exp.perSec = 0;
        hero.value.avgLoot.exp.acc = 0;
        hero.value.avgLoot.skillExp.perSec = 0;
        hero.value.avgLoot.skillExp.acc = 0;
        hero.value.avgLoot.stardust.perSec = 0;
        hero.value.avgLoot.stardust.acc = 0;
        hero.value.avgLoot.mutagen.perSec = 0;
        hero.value.avgLoot.mutagen.acc = 0;
        hero.value.avgLoot.kills.perSec = 0;
        hero.value.avgLoot.kills.acc = 0;
    }

    const globalAvgReset = () => {
        avgReset();

        hero.value.avgResources.ascension.perSec = 0;
        hero.value.avgResources.ascension.acc = 0;
        hero.value.avgResources.rebirth.perSec = 0;
        hero.value.avgResources.rebirth.perSec = 0;
    }

    return {
        lootHandler,
        avgReset,
        globalAvgReset
    }
}

