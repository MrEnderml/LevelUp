import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { perks as radPerks } from '../../data/radPerks.js';
import { useBuff } from '../../data/buffs.js'
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";

import { fn } from "../utils/global.js";

import { useDimensions } from "./useDimensions.js";

export const useTrees = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();

    const { getDimReward, getDimSpecialReward, getDimEffect } = useDimensions(); 


    const upgradeNode = (perk) => {
        let tree = hero.value.tree;

        if (perk.currentStatus == 'base') {
            let maxLevel = perk.maxLevel[hero.value.tree.tier];
            let level = perk.level.base;

            if (tree.points > 0 && level < maxLevel) {
                tree.points = Math.max(tree.points - 1, 0);
                perk.level.base += 1;
                perk.tpSpend.base += 1;
            }
        }

        if(perk.currentStatus == 'inf') {
            if(perk.infStatus == false) return;

            let cost = infNodesCostHandle(perk.id);

            if(tree.points >= cost) {
                perk.level.inf += 1;
                tree.points = Math.max(Math.floor(tree.points - cost), 0);
                perk.tpSpend.inf += cost;
            }
        }
    }

    const upgradeMaxNode = (perk) => {
        let tree = hero.value.tree;
        if(tree.points <= 0) return;

        if (perk.currentStatus == 'base') {
            const maxUp = perk.maxLevel[tree.tier] - perk.level.base;
            const req = tree.points;

            const up = Math.min(maxUp, req);

            perk.level.base += up;
            tree.points -= up;
            perk.tpSpend.base += up;
        }

        if (perk.currentStatus == 'inf') {
            if(perk.infStatus == false) return;

            let cost = 0;
            let totalCost = 0;
            while (totalCost <= tree.points) {
                cost = infNodesCostHandle(perk.id);
                if(totalCost + cost > tree.points) break;

                totalCost += cost;
                perk.tpSpend.inf += cost;

                perk.level.inf++;
            }
            tree.points -= totalCost;
        }
    }

    const infActivate = (perk) => {
        if(perk.infStatus == false) return;

        let tree = hero.value.tree;

        if(perk.currentStatus != 'inf') {
            setStatus(perk, 'inf');

            tree.points += perk.tpSpend['base']
            perk.level['base'] = 0;
            perk.tpSpend['base'] = 0;
        } else {
            setStatus(perk, 'base');

            tree.points += perk.tpSpend['inf']
            perk.level['inf'] = 0;
            perk.tpSpend['inf'] = 0;
        }
    }

    const countRadNodes = () => {
        let base = 0;
        let total = base + radPerks[7].level + radPerks[15].level + 
        ascenPerks[64].level;

        hero.value.tree.maxRadNodes = total;
    }

    const radActivate = (perk) => {
        countRadNodes();

        let maxActive = hero.value.tree.maxRadNodes;
        //let active = perks.value.filter(p => p.currentStatus == 'rad' || p.status.includes('rad')).length;
        let active = perks.value.filter(p => p.currentStatus == 'rad').length;

        let tree = hero.value.tree;

        if(perk.currentStatus != 'rad') {
            if(active >= maxActive) return;

            setStatus(perk, 'rad');

            tree.points += perk.tpSpend['base']
            perk.level['base'] = 0;
            perk.tpSpend['base'] = 0;
        } else {
            setStatus(perk, 'base');

            perk.kills = 0;
        }
    }

    function setStatus(perk, status) {
        perk.currentStatus = status;
        perk.status = [status];
    }

    const resetNodes = (perk = null) => {
        const tree = hero.value.tree;
    
        const resetPerk = (perk) => {
            for (const status of ['base', 'inf']) {
                tree.points += perk.tpSpend[status] || 0;
                perk.tpSpend[status] = 0;
                perk.level[status] = 0;
            }
        };
    
        if (perk === null) {
            perks.value.forEach(perk => {
                if (perk?.type === 'buff') return;
                resetPerk(perk);
            });
        } else {
            resetPerk(perk);
        }
    };

    const globalResetNodes = () => {
        perks.value.forEach(perk => {
            perk.currentStatus = 'base';
        });
    }

    const descNodes = (perk) => {
        let radDescription = [
            `${fn(radNodes(0, ['rad'], ['rad']))} MULT DMG depends on killed enemy [Effect gets worse per each kill]`,
            `${fn(radNodes(1, ['rad'], ['rad']))} HEAL MULT`,
            `${fn(radNodes(2, ['rad'], ['rad']))}% less DMG taken from hits`,
            `+${fn(radNodes(3, ['rad'], ['rad']))}% Level Rush`,
            `${fn(radNodes(4, ['rad'], ['rad']))} Global Max Level MULT`,
            `+${fn(radNodes(5, ['rad'], ['rad']))} Max APS`
        ]

        return perk.currentStatus == 'rad'? radDescription[perk.id]: perk.description;
    }

    const descEffects = (perk) => {
        let blocked = [6, 9, 11, 13, 16];
        if(blocked.includes(perk.id) || perk.level[perk.currentStatus] == 0) return;

        if (perk.currentStatus == 'inf') 
            return "TOTAL: " + fn(infNodes(perk.id, ["inf"], ['inf']));

        if (perk.currentStatus == 'base') 
            return "TOTAL: " + fn(baseNodes(perk.id, ["base"], ['base']));
        
    }

    const nodesHandler = (id, statuses) => {
        const perk = perks.value[id];
        if (!perk) return {};
      
        const active = [perk.currentStatus];
      
        if(perk.id > 0 && statuses.includes('rad'))
            return radNodes(perk.id, active, statuses);
        else return nodesCalc(id, active, statuses);
    };

    const nodesCalc = (id, active, statuses) => {

        switch(id) {
            case 0: 
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses) * radNodes(id, active, statuses);
            case 1:
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses);
            case 2:
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses);
            case 3:
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses);
            case 4:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 5:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 7:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 8:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 10:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 11:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 12:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 13:
                return baseNodes(id, active, statuses);
            case 14:
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses);
            case 15:
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses);
            case 16:
                return baseNodes(id, active, statuses);
            case 17:
                return baseNodes(id, active, statuses) * infNodes(id, active, statuses);
            case 18:
                return baseNodes(id, active, statuses) + infNodes(id, active, statuses);
            case 19:
                return baseNodes(id, active, statuses);
        }
    }
      
    

    const radNodes = (id, active, statuses) => {
        const perk = perks.value[id];
        if (!perk) return 1;

        switch(id) {
            case 0: {
                const soft = 0.75 + 0.0035 * getDimReward(40) + 0.0035 * radPerks[14].level;
                const radDMG = Math.log(3 + hero.value.tree.kills) ** soft;
                
                return (active.includes('rad') && statuses.includes('rad')? radDMG: 1);
            }
            case 1: {
                let healMult = 1.25 + 0.025 * getDimReward(40) + 0.025 * radPerks[14].level;

                return (active.includes('rad') && statuses.includes('rad')? healMult: 1);
            }
            case 2: {
                let lessDMGTaken = 20 + getDimReward(40) + radPerks[14].level;

                return (active.includes('rad') && statuses.includes('rad')? lessDMGTaken: 1);
            }
            case 3: {
                const levelRush = 10 + 0.5 * getDimReward(40) + 0.5 * radPerks[14].level;

                return (active.includes('rad') && statuses.includes('rad')? levelRush: 0);
            }
    
            case 4: {
                const maxLevel = 1.1 + 0.01 * getDimReward(40) + 0.01 * radPerks[14].level;

                return (active.includes('rad') && statuses.includes('rad')? maxLevel: 1);
            }
    
            case 5: {
                const aps = 0.1 + 0.01 * getDimReward(40) + 0.01 * radPerks[14].level;
                
                return (active.includes('rad') && statuses.includes('rad')? aps: 0);
            }
        }
    }

    const radKillsHandle = (kills) => {
        if(perks.value[0].status.includes("rad")) {
            hero.value.tree.kills += kills;
        } else hero.value.tree.kills = 0;
    }

    const isActiveRadNode = (id) => {
        return perks.value[id].status.includes("rad")
    }

    const baseNodes = (id, active, statutes) => {

        const perk = perks.value[id];
        const level = perk.level.base;
        if (!perk) return {};
    
        switch (id) {
    
            // DAMAGE
            case 0: {
                let bonus = (hero.value.soulsMax >= 40? 0.001 * hero.value.tree.tier: 0);
                const dmg = (perk.value + bonus) ** level;
                return (active.includes('base') && statutes.includes('base')? dmg: 1);
            }
    
            // HP
            case 1: {
                const hp = 1 + 0.01 * level;
                return (active.includes('base') && statutes.includes('base')? hp: 1);
            }
    
            // DEF
            case 2: {
                const def = 1 + (perk.value * level) * 0.01;
                return (active.includes('base') && statutes.includes('base')? def: 1);
            }
    
            // EXP
            case 3: {
                const exp = 1 + (perk.value * level) * 0.01;
                return (active.includes('base') && statutes.includes('base')? exp: 1);
            }
    
            // MAX LEVEL (additive)
            case 4: {
                const maxLevel = perk.value * level;
                return (active.includes('base') && statutes.includes('base')? maxLevel: 0);
            }
    
            // APS (additive)
            case 5: {
                const aps = perk.value * level;
                return (active.includes('base') && statutes.includes('base')? aps: 0);
            }
    
            // CRIT CHANCE
            case 7: {
                const critChance = level * perk.value;
                return (active.includes('base') && statutes.includes('base')? critChance: 0);
            }
    
            // CRIT DAMAGE
            case 8: {
                const critDamage = level * perk.value;
                return (active.includes('base') && statutes.includes('base')? critDamage: 0);
            }
    
            // STAGE SCALING
            case 10: {
                const stageScaling = perk.value * level;
                return (active.includes('base') && statutes.includes('base')? stageScaling: 0);
            }
    
            // RECOVERY
            case 11: {
                const recovery = 1 + perk.value * level;
                return (active.includes('base') && statutes.includes('base')? recovery: 0);
            }
    
            // MIN LEVEL
            case 12: {
                return (active.includes('base') && statutes.includes('base')? level: 0);
            }
    
            // DROP CHANCE (tree-based)
            case 13: {
                const exp = Math.floor(hero.value.tree.points / 500);
                const chance = level
                    ? (1.1 + 0.015 * exp) ** Math.sqrt(Math.max(hero.value.tree.points, 0))
                    : 1;
    
                return (active.includes('base') && statutes.includes('base')? chance: 1);
            }
    
            // REBIRTH POINTS
            case 14: {
                const rebirthPts = perk.value ** level;
                return (active.includes('base') && statutes.includes('base')? rebirthPts: 1);
            }
    
            // EQUIPMENT CHANCE
            case 15: {
                const eqChance = perk.value ** level;
                return (active.includes('base') && statutes.includes('base')? eqChance: 1);
            }
    
            // BUFF EXP
            case 16: {
                const buffExp = 1.25 ** level;
                return (active.includes('base') && statutes.includes('base')? buffExp: 1);
            }
    
            // STARDUST
            case 17: {
                const stardust = 1 + level * 0.01;
                return (active.includes('base') && statutes.includes('base')? stardust: 1);
            }
    
            // POTENTIAL
            case 18: {
                return (active.includes('base') && statutes.includes('base')? level: 0);
            }

            case 19: {
                const abyssWeakness = 1 / 1.25 ** hero.value.tree.tier;
                return (active.includes('base') && statutes.includes('base')? abyssWeakness: 1);
            }
    
            default:
                return {};
        }
    };

    function getNodeEffects(nodeFn, id) {
        const effects = nodeFn(id);
        if (!effects) return 0;

        return Object.values(effects)[0];
    }

    const infCostMultipliers = () => {
        const sources = [];

        const push = (id, value) => {
          sources.push({
            id,
            value
          });
        };
      
        if (getDimSpecialReward(6))
            push('D6',0.9);
        
        if (getDimReward(35) < 1)
            push('D35',getDimReward(35));
        
        if (getDimEffect(35).dId > 1)
            push('D35 [Trial]',getDimEffect(35).dId);
        
        if (getDimEffect(35).darkId > 1)
            push('D35 [Intervention]',getDimEffect(35).darkId);
      
        if (getDimSpecialReward(47))
            push('D47', getDimReward(47));
        
      
        if (hero.value.dId === 'unlimitted') {
          push('D5',2);
        }
      
        const total =
          sources.reduce((a, b) => a * b.value, 1);
      
        return {
          sources,
          total
        };
    }

    const infNodes = (id, active, statuses) => {
        const perk = perks.value[id];
        const level = perk.level.inf;
        if (!perk) return 1;

        switch(id) {
            case 0: {
                const mult = 0.01 * Math.floor(level / perk.infThreshold);
                const infDMG = 1 + (0.01 + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? infDMG: 1);
            }
            case 1: {
                let mult = 0.001 * Math.floor(level / perk.infThreshold);
                let hp = 1 + (0.01 + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? hp: 1);
            }
            case 2: {
                let mult = 0.1 * Math.floor(level / perk.infThreshold);
                let def = 1 + ((perks.value[2].value + mult) * level) * 0.01;

                return (active.includes('inf') && statuses.includes('inf')? def: 1);
            }
            case 3: {
                const mult = 1.5 * Math.floor(level / perk.infThreshold);
                const exp = 1 + ((perk.value + mult) * level * 0.01);
                return (active.includes('inf') && statuses.includes('inf')? exp: 1);
            }
    
            case 4: {
                const mult = 0.3 * Math.floor(level / perk.infThreshold);
                const maxLevel = (perk.value + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? maxLevel: 0);
            }
    
            case 5: {
                const mult = 0.05 * Math.floor(level / perk.infThreshold);
                const aps = (perk.value + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? aps: 0);
            }
    
            case 7: {
                const mult = 0.01 * Math.floor(level / perk.infThreshold);
                const crit = level * (perk.value + mult);

                return (active.includes('inf') && statuses.includes('inf')? crit: 0);
            }
    
            case 8: {
                const mult = 0.02 * Math.floor(level / perk.infThreshold);
                const critDmg = level * (perk.value + mult);

                return (active.includes('inf') && statuses.includes('inf')? critDmg: 0);
            }
    
            case 10: {
                const mult = 0.0025 * Math.floor(level / perk.infThreshold);
                const stage = (perk.value + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? stage: 0);
            }
            case 11: {
                const mult = 0.1 * Math.floor(level / perk.infThreshold);
                const recovery = 1 + (perk.value + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? recovery: 0);
            }
            case 12: {
                const mult = 0.25 * Math.floor(level / perk.infThreshold);
                const minLevel = (perk.value + mult) * level;
                
                return (active.includes('inf') && statuses.includes('inf')? minLevel: 0);
            }
            case 14: {
                const mult = 0.01 * Math.floor(level / perk.infThreshold);
                const rebirthPts = (perk.value + mult) ** level;
                
                return (active.includes('inf') && statuses.includes('inf')? rebirthPts: 1);
            }
            case 15: {
                const mult = 0.05 * Math.floor(level / perk.infThreshold);
                const eqChance = (perk.value + mult) ** level;

                return (active.includes('inf') && statuses.includes('inf')? eqChance: 1);
            }
            case 16: {
                const mult = 0.05 * Math.floor(level / perk.infThreshold);
                const skillExp = (perk.value + mult) ** level;

                return (active.includes('inf') && statuses.includes('inf')? skillExp: 1);
            }
            case 17: {
                const mult = 0.25 * Math.floor(level / perk.infThreshold);
                const stardust = 1 + (perk.value + mult) * level * 0.01;

                return (active.includes('inf') && statuses.includes('inf')? stardust: 1);
            }
            case 18: {
                const mult = 0.05 * Math.floor(level / perk.infThreshold);
                const potential = (perk.value + mult) * level;

                return (active.includes('inf') && statuses.includes('inf')? potential: 0);
            }
        }
    }

    const infNodesCostHandle = (id) => {
        let multHandle = infCostMultipliers().total;
        let level = perks.value[id].level.inf;
        let cost = perks.value[id].baseCost;
        let tier = Math.floor(level / perks.value[id].infThreshold);
        let tierCost = 1.1 ** tier;

        switch(id){
            case 0: {
                let base = cost * multHandle;
                let total = base * 1.05 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 1: {
                let base = cost * multHandle;
                let total = base * 1.05 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 2: {
                let base = cost * multHandle;
                let total = base * 1.04 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 3: {
                let base = cost * multHandle;
                let total = base * 1.02 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 4: {
                let base = cost * multHandle;
                let total = base * 1.035 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 5: {
                let base = cost * multHandle;
                let total = base * 1.07 ** level * tierCost;

                return Math.floor(total);
            }
            case 7: {
                let base = cost * multHandle;
                let total = base * 1.06 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 8: {
                let base = cost * multHandle;
                let total = base * 1.04 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 10: {
                let base = cost * multHandle;
                let total = base * 1.06 ** level * tierCost;

                return Math.floor(total);
            }
            case 11: {
                let base = cost * multHandle;
                let total = base * 1.15 ** level * tierCost;

                return Math.floor(total);
            }
            case 12: {
                let base = cost * multHandle;
                let total = base * 1.06 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 14: {
                let base = cost * multHandle;
                let total = base * 1.1 ** level * tierCost;

                return Math.floor(total);
            }
            case 15: {
                let base = cost * multHandle;
                let total = base * 1.05 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 16: {
                let base = cost * multHandle;
                let total = base * 1.05 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 17: {
                let base = cost * multHandle;
                let total = base * 1.015 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
            case 18: {
                let base = cost * multHandle;
                let total = base * 1.1 ** Math.sqrt(level) * tierCost;

                return Math.floor(total);
            }
        }
    }

    const gainTreePoints = () => {
        return (hero.value.infExpansions.tree? 2: 1);
    }

    const treePointsHandle = () => {
        hero.value.tree.freePoints = getDimReward(6) + 
        enemy.value.specialCreatures.dim1.loot

        return hero.value.tree.freePoints;
    }

    function getPriority(perk) {
        return perk.system?.prioritize ?? 0;
    }

    function canUpgrade(perk, mode, tier, points) {
        if (!perk) return false;
        if (perk.system.block) return false;
        if (mode == 'rad' || perk.type == 'buff') return;
        if (points < upgradeCost(perk, mode)) return false;
        if (perk.currentStatus !== mode) return false;
      
        if (
          perk.system.levelCondition > 0 &&
          perk.level[mode] >= perk.system.levelCondition
        ) return false;
      
        if (mode == 'base' && perk.level[mode] >= perk.maxLevel[tier]) return false;
      
        return true;
    }

    function upgradeCost(perk, mode) {
        return mode === 'inf'
          ? infNodesCostHandle(perk.id)
          : 1;
    }
    
    const toggleAuto = (state) => {
        hero.value.tree.auto = state;
    }

    const eventReq = () => {
        let dimsNotAllowed = ['noTree', 'c-noEq', 'c-noSpace', 'c-ascension', 'c-radiation', 'c-noBuffs'];
    
        if ((hero.value.isSingularity && hero.value.singularity >= 2) || dimsNotAllowed.includes(hero.value.dId)) return true;
    
        return false;
    }

    const treeAuto = (interval) => {
        if (!hero.value.tree.auto) return;
        if (eventReq()) return;
      
        if (hero.value.tree.autoCooldown > 0) {
          hero.value.tree.autoCooldown -= interval / 1000;
          return;
        }
      
        const tier = hero.value.tree.tier;
      
        let points = hero.value.tree.points;
        if (points <= 0) return;
      
        let available = perks.value.filter(p => canUpgrade(p, p.currentStatus, tier, points) && !p.system.block);
        if (!available.length) return;

        let minPriority = Math.min(...available.map(p => p.system.prioritize));

        let queue = available.filter(p => p.system.prioritize === minPriority);

        for (const perk of queue) {
            if (points <= 0) break;

            const mode = perk.currentStatus;

            const cost = upgradeCost(perk, mode);
            if (points < cost) continue;

            perk.level[mode] += 1;

            perk.tpSpend[mode] += cost;
            points -= cost;
        }

      
        hero.value.tree.points = points;
      };

      const effectsActivated = (tier) => {
        const cards = [];
      
        cards.push('T');

        if (hero.value.tree.freePoints > 0)
            cards.push('F');
            
        if (radPerks[7].level)
          cards.push('Z');
      
        if (hero.value.infExpansions.tree){  
            cards.push('N');
            cards.push('A');
        }

        if (getDimSpecialReward(6))
            cards.push('C');

        cards.push('R');
      
        return cards;
      }
  
      
      const activeSelect = (key) => {
        if (key === 'A') return hero.value.tree.auto;
      }
  
      const clickEffects = (key) => {
        if (key === 'A') hero.value.tree.auto = !hero.value.tree.auto;
        if (key === 'R') resetNodes();
        if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Tree' }
      }
  
      const effectsHandler = (id) => {
        switch (id) {
      
            case 'T': {
                return `
                  <span style="font-size:0.95em; font-style:italic; color:#7cff9e;">
                    <strong style="color:#aaffc3;">Tree</strong><br>
                    Tree Tier increases the maximum level of nodes and unlocks new nodes.<br>
                    Tree Points <span style="color:#5cff7a;">[TP]</span> are granted by leveling up.
                  </span>
                `.replace(/\n\s*/g, '');
              }
              
              case 'A': {
                return `
                  <span style="font-size:0.95em; font-style:italic; color:#3fffd9;">
                    <strong style="color:#6effe8;">AUTO-Tree</strong><br>
                    Click to enable/disable automatic node upgrades.<br>
                    Status: <strong style="color:${hero.value.tree.auto ? '#7CFF9E' : '#FF4D4D'}">
                      ${hero.value.tree.auto ? 'ON' : 'OFF'}
                    </strong>
                  </span>
                `.replace(/\n\s*/g, '');
              }
              
              case 'F': {
                return `
                  <span style="font-size:0.95em; font-style:italic; color: #7cff9e;">
                    <strong style="color: #aaffc3;">Free Tree Points</strong><br>
                    Free Tree Points can be used like regular Tree Points. 
                    The difference is that they are not affected by leveling up and are always available.<br>

                    FTP: <b style="color: gold">${treePointsHandle()}<b>
                  </span>
                `.replace(/\n\s*/g, '');
              }
              
              case 'N': {
                return `
                  <span style="font-size:0.95em; font-style:italic; color:#ffd966;">
                    <strong style="color:#ffea9a;">Infinity Nodes</strong><br>
                    No upgrade limit. Cost increases per level.<br>
                    Each node has its own threshold, overcoming which allows you to move to a higher tier and increase the base power of the nodes.
                  </span>
                `.replace(/\n\s*/g, '');
              }

              case 'C': {
                const m = infCostMultipliers();
          
                let text = '<span style="font-size:0.95em; font-style:italic; color:lightgreen;">' +
                  '<strong style="color: gold;">Infinity Nodes Cost Scaling</strong><br>' +
                  'Sources:<br>';
                  for (const s of m.sources)
                    text  += `${s.id}: <b>${s.value.toFixed(2)}</b><br>`;

                  text += 'Total Multiplier: <b>' + m.total.toFixed(2) + '</b>' +
                  '</span>'
                
                return text;
              }
              
              case 'R': { 
                return `
                  <span style="font-size:0.95em; font-style:italic; color:#ff6b6b;">
                    <strong style="color:#ff4d4d;">Reset</strong><br>
                    Click to refund all <span style="color:#7cff9e;">[TP]</span> and reset all node levels.
                  </span>
                `.replace(/\n\s*/g, '');
              }
              
              case 'Z': { 
                countRadNodes();

                return `
                  <span style="font-size:0.95em; font-style:italic; color:#9bff3d;">
                    <strong style="color:#b6ff00;">Radiation Node</strong><br>
                    Mutates node behavior with unique properties while replacing the base node<br>
                    Limited amount. <strong>[${hero.value.tree.maxRadNodes}]</strong>
                  </span>
                `.replace(/\n\s*/g, '');
              }

              case 'i': { 
                return `
                  <span style="font-size:0.95em; font-style:italic; color: yellow;">
                    <strong style="color: gold;">Info</strong><br>
                    Click to see additional info.
                  </span>
                `.replace(/\n\s*/g, '');
              }
              
        }
      }

    return {
        nodesHandler,
        upgradeNode,
        upgradeMaxNode,
        infActivate,
        radActivate,
        countRadNodes,
        radNodes,
        resetNodes,
        globalResetNodes,
        descNodes,
        descEffects,
        infNodesCostHandle,
        toggleAuto,
        treeAuto,
        gainTreePoints,
        effectsActivated,
        activeSelect,
        clickEffects,
        effectsHandler,
        treePointsHandle,
        radKillsHandle,
        isActiveRadNode
    }
}