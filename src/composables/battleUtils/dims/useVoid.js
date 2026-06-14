import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";
import { usePlayer } from "../../utils/playerSetup";
import { useSingularity } from "../useSIngularity";
import { useAbysses } from "../useAbyss";
import { infBonusesHandler } from "../global/infBonusesHandler";


import { nodes } from "../../../data/dims/voidNodes";
import { spaceShopHandler } from "../global/spaceShopHandler";
import { d5RewardHandler } from "../global/d5RewardHandler";
import { dGravityHandler } from "../global/dGravityHandler";

export const useVoid = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();
    const { playr } = usePlayer();
    
    const { singShardsEffect } = useSingularity();
    const { abyssHandler } = useAbysses();

    const voidEffects = (id) => {
        let status = (hero.value.dId == 'dimMerge'? true: false);
        let s = Math.max(hero.value.stages.current, 1);

        switch (id) {
            case 0: { //stage req
                if(!status) return 0;
                return 1 + 0.15 * s;
            }
            case 1: { //eq drop chnace
                if(!status) return 1;
                return 1e50 * 10 ** s;
            }
            case 2: { // enhance cost
                if(!status) return 1;
                return 10 ** s;
            }
            case 3: { // level req
                if(!status) return 1;
                return 8 ** s;
            }
            case 4: { //min level decr
                if(!status) return 0;
                return 10 * s
            }
            case 5: { // enemy power
                if(!status) return 1;
                return 1e5 * 5 ** s;
            }
            case 6: {// soul ape
                if(!status) return 1;
                return 10 ** s;
            }
            case 7: { // reson
                if(!status) return 1;
                return 1 + 0.25 * s;
            }
            case 8: { // skill exp
                if(!status) return 1;
                return 10 ** s;
            }
            case 9: { // corr inf
                if(!status) return 0;
                return s;
            }
            case 10: { // inc penalty
                if(!status) return 0;
                return s;
            }
        }
    }

    const voidShardsDrop = () => {
        let s = hero.value.void.stage - 1;

        let base = 2;
        let baseMult = 1 + 0.02 * s * voidMults();
        let total = 0;

        for (let i = 0; i < s; i++)
            total += base * baseMult;

        return total;
    }

    const voidMults = () => {
        let base = 1;

        base = singShardsEffect(12) * 
        abyssHandler(20) * 
        hero.value.voidTreeStats.void_shards * 
        spaceShopHandler(18, hero) *
        infBonusesHandler(35, hero) * 
        d5RewardHandler(5, hero) *
        dGravityHandler(1, hero).v * 
        (1 + 0.01 * enemy.value.specialCreatures.ddim10.loot);

        return base;
    }


    const buyNode = (node) => {
        if (!node.canBuy) return
      
        hero.value.void.totalShards -= nodeCost(node);
        node.level++

        rebuildTreeStats();
        unlockNodes();
        nodesReqCost();
    }

    const nodeCost = (node) => {
        if (node.level > 0)
            return node.cost + node.costGrow ** node.level
        else return Math.max(node.cost, 1);
    }


    const nodesReqCost = () => {
        let sh = hero.value.void.totalShards;
        

        for (const n of nodes.value) {
            if (n.locked) continue;
            let nCost = nodeCost(n);

            if (sh >= nCost && n.level < n.maxLevel) {
                n.canBuy = true;
                n.noResources = false;
            } else if (sh < nCost && n.level < n.maxLevel) {
                n.noResources = true;
                n.canBuy = false;
            } else {
                n.noResources = false;
                n.canBuy = false;
            }
                
        }
    }

    const unlockNodes = () => {
        for (const node of nodes.value) {
      
          if (!node.req?.length) {
            node.locked = false
            continue
          }
      
          node.locked = !node.req.every(reqId => {
            const req = nodes.value.find(n => n.id === reqId)
      
            return req?.level > 0
          })
        }
    }

    const rebuildTreeStats = () => {

        const stats = {
          void_shards: 1,
          kill_req_1: 0,
          soul_app_1: 1,
          eq_drop_1: 1,
          skill_exp_1: 1,
          exp_1: 1,
          stardust_1: 1,
          mutagen_1: 1,
          ascen_shards_1: 1,
          an_shards_1: 0,
          law_time_1: 0,
          laws_add_stone: 0,
          laws_radius_1: 1,
          laws_refund: 75,
          sing_levels_1: 0,
          sing_double_shards: false,
          sing_level_req_1: 1,
          sing_kills_req: false,
          sing_overkill: 0,
          sing_shards_mult_1: 1,
          inf_tr_spread: 0,
          inf_ip_mult: 0,
          inf_pen_base: 0.01,
          inf_base_tier: 0,
          inf_double_complete: false,
          inf_res_1: 0,
          qua_eff_1: 1,
          qua_unnused: 0,
          abyss_auto: false,
          abyss_stage: 50,
          danger_cost: false,
          cost_ascen: 1
        }
      
        for (const node of nodes.value) {
      
          if (node.level <= 0)
            continue
          
          if(node.type == 'group')
            stats[node.group] += node.value * node.level
          else if(node.type == 'group-r')
            stats[node.group] -= node.value * node.level
          else if(node.type == 'mult')
            stats[node.group] = node.value * node.level
          else if(node.type == 's-mult')
            stats[node.group] = 1 + node.value * node.level
          else if(node.type == 'exp')
            stats[node.group] = node.value ** node.level
          else if(node.type == 'cond')
            stats[node.group] = (node.level > 0? true: false)
          else stats[node.group] = specialStat(node);
        }
      
        hero.value.voidTreeStats = stats
    }

    const voidTreeEffects = (node) => {
        return hero.value.voidTreeStats[node.group]
    }

    const specialStat = (node) => {
        switch(node.group) {
            case 'laws_radius_1':
                return 1 + node.value * node.level * hero.value.mainInfTier * 0.01;
            case 'qua_unnused':
                return 0.01 * node.level * hero.value.quasar.freeCores ** 1.5;
            case 'sing_overkill':
                return 1 * node.level * hero.value.gravity.totalShards;
        }
    }


    const voidTimer = (dt) => {
        if (hero.value.dims.corrShards < 20) return;

        hero.value.void.time -= dt;

        if (hero.value.void.time <= 0) {
            hero.value.void.time = voidTimerCalc();
            hero.value.void.totalShards += voidShardsDrop();
        }
    }

    const voidTimerCalc = () => {
        let time = hero.value.void.maxTime;

        return time;
    }

    return {
        buyNode,
        unlockNodes,
        nodesReqCost,
        voidTreeEffects,
        rebuildTreeStats,
        nodeCost,
        voidEffects,
        voidTimer,
        voidTimerCalc,
        voidShardsDrop,
        voidMults
    }
}