import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { useBuff } from '../../data/buffs.js'

import { fn } from "../utils/global.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { useAbysses } from "./useAbyss.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { d5RewardHandler } from "./global/d5RewardHandler.js";
import { dGravityHandler } from "./global/dGravityHandler.js";
import { useProgressions } from "./useProgression.js";

export const useSingularity = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();

    const { player } = usePlayer()
    const { villian } = useBaseEnemy();

    const { abyssHandler } = useAbysses();


    const getTotalSp = () => {
        if(!hero.value.isSingularity) return 0;

        let total = 1e5 + hero.value.kills ** 3.5;

        return total;
    }

    const singPower = () => {
        if(!hero.value.isSingularity) return 1;

        let k = hero.value.kills;

        let mult = 10 * Math.min(k, 25) +
        50 * Math.max(k - 25, 0) +
        500 * Math.max(k - 50, 0) +
        25000 * Math.max(k - 75, 0);

        let min = 0.75;
        let max = 1.25 + 0.05 * hero.value.singularity + 
        (hero.value.singularity >= 8? mult: 0);

        let div = 100;

        let step = (max - min) / div;

        return min + step * hero.value.kills;
    }

    const singComplete = () => {
        if(hero.value.kills < 100) return;

        hero.value.singularityKills = (hero.value.singularity >= 8? 100: hero.value.singularityKills);
        hero.value.singularity = Math.min(hero.value.singularity + 1, 8);
        hero.value.isSingularity = false;
    }

    const singKills = () => {
        hero.value.singularityKills = Math.max(hero.value.singularityKills, hero.value.kills);
        hero.value.kills = Math.max(hero.value.singularityKills, hero.value.kills)
    }

    const gEffect = (t) => 1.0067 ** Math.min(t, 100) + 0.0067 * Math.sqrt(Math.max(t - 100, 0));

    const singShardsEffect = (id) => {
        let g = hero.value.gravityShardsEffect[id];
 
        singShardsGainEffect();

        if (g.type == 0)
            return 0.01 * g.tier
        else if (g.type == 1)
            return g.tier
        else if (g.type == 3)
            return 1 + 0.01 * g.tier;
        else {
            let hp = 1 / Math.max(1 + 0.01 * g.tier, 1);
            let dmg = Math.max(1 - 0.001 * g.tier, 0.1);

            return {hp: hp, dmg: dmg}
        }
        
 
    }

    const singMult = () => {
        let base = 1 * 
        abyssHandler(19) *
        hero.value.voidTreeStats.sing_shards_mult_1 * 
        spaceShopHandler(19, hero) * 
        infBonusesHandler(34, hero) * 
        d5RewardHandler(6, hero) *
        dGravityHandler(4, hero).v * 
        (1 + 0.01 * enemy.value.specialCreatures.ddim11.loot)

        hero.value.singMult = base;

        return base;
    }

    const singShardsGainEffect = () => {
        let shards = hero.value.gravity.shards;
        hero.value.gravity.totalShards = shards * singMult();

        let totalShards = shards * singMult();
        let sEffect = hero.value.gravityShardsEffect;

        for(let g of sEffect) {
            while (totalShards >= Math.floor(g.totalReq)) {
                g.nowReq = g.totalReq;
                g.totalReq += g.req * gEffect(g.tier);
                g.tier++;
            }
        }
    }

    const singStageReq = (check = true) => {
        if (villian.value.spawnType != 'singulars' && check) return 0;

        return 0.005 * hero.value.gravity.shards;
    }

    const singShardsKills = () => {
        const h = hero.value;

        if (h.kills >= h.killsPerZone && h.gravity.isTrial) {
            h.gravity.shards += (h.voidTreeStats.sing_double_shards? 2: 1);
            h.kills = 0;
        }
    }

    const enemyShardsMult = (check = true) => {
        if (villian.value.spawnType != 'singulars' && check)
            return {hp: 1, dmg: 1};

        let shards = hero.value.gravity.shards;

        let hp = Math.max(Math.log(shards) ** 1.25, 1) ** (1 + 0.0067 * Math.min(shards, 5000));
        let dmg = 1 + 0.025 * Math.min(shards, 100) + 
        0.01 * Math.sqrt(shards);

        return {hp: hp, dmg: dmg}
    }

    function deathBhStatus () {
        const h = hero.value;
        const v = villian.value;

        v.bh.status = false;
  
        h.dId = 'main';
        h.infTier = h.mainInfTier;
        h.gravity.bhDmg = 0;
  
        v.bh.maxTime = Math.max(v.bh.time, v.bh.maxTime);
        v.bh.time = 0;
        v.bh.effects = 1;
        v.bh.alwaysHit = false;
        
        h.infProgress = false;
      }

    return {
        getTotalSp,
        singPower,
        singComplete,
        singKills,
        singShardsEffect,
        singStageReq,
        enemyShardsMult,
        singShardsKills,
        deathBhStatus
    }
}