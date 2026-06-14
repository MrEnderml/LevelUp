import { useHero } from '../useHero.js';
import { useEnemy } from "../useEnemy.js";
import { perks as radPerks } from '../../data/radPerks.js';
import { perks as ascenPerks } from '../../data/ascension.js';
import { divineSkills } from "../../data/quasarCore.js";
import { spaceShop } from "../../data/spaceShop.js";

import { addLog} from '../logService.js';

import { dimensions } from "../../data/dimensions.js";
import { dimensionsPos } from '../../data/dims/dimensionsPos.js';

import { useTimeline } from './dims/useTimeline.js';
import { useBH } from "./dims/useBH.js";


import { computed } from 'vue';
import { useResets } from './useResets.js';
import { useBaseEnemy } from '../utils/enemySetup.js';
import { usePlayer } from '../utils/playerSetup.js';
import { d5RewardHandler } from './global/d5RewardHandler.js';

export const useDimensions = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { villian } = useBaseEnemy();
    const { player } = usePlayer();

    const { collectLawEffects, getAllActiveDims } = useTimeline()

    


    const getDimSpecialReward = (id) => {
      return dimensions.value[id].infTier >= dimensions.value[id].spInfTier;
    }

    const getBaseTierSourses = (id) => {
      let base = (hero.value.timeline.activeDimsCache.includes(id)? collectLawEffects(12).add: 0) +
      hero.value.voidTreeStats.inf_base_tier + 
      d5RewardHandler(8, hero);

      return base;
    }

    const getDimReward = (id, attr = null) => {
      let e = getBaseTierSourses(id);

      let d = dimensions.value[id].infTier - (dimensions.value[id]?.infStart | 0);

      let t = d + e;
      switch(id) {
        case 1:
          return 1 - 0.015 * t;
        case 2:
          return t;
        case 3:
          return 0.0075 * t;
        case 4:
          return 0.05 * t;
        case 5: {
          let l = hero.value.unlimitLevel;
          let base = Math.max(l - 700, 0);

          let exp = 1 + Math.max(base / 100, 0);
          let min = Math.max(Math.floor(base / 100));
          let maxLevelMult = 0.1 * Math.max(base / 50, 0);

          let infBonus = Math.max(Math.floor((l - 1500) / 500), 0);
          let infExp = (infBonus * 5 + 1) ** 1.5;

          let maxUnlimmit = getDimReward(38).current;

          return {
            exp: exp,
            min: min,
            maxLevel: maxLevelMult,
            infExp: infExp,
            infBonus: infBonus,
            maxUnlimmit: maxUnlimmit
          }

        }
        case 6:
          return 50 * t;
        case 8:
          return 1 * t;
        case 10:
          return 6 * t;
        case 11:
          return 1.15 ** t;
        case 12:
          return 3 * t;
        case 13:
          return t * 0.0075;
        case 14: 
          return 0.1 * t;
        case 15:
          return 30 * t;
        case 17:
          return 1 - 0.015 * t;
        case 19:
          return t;
        case 20:
          return 1.06 ** t;
        case 21: {
          let scale = 1.25 + (getDimSpecialReward(58)? 0.1: 0);
          let total = hero.value.dims.survival.stage ** scale;

          return {
            req: total > hero.value.eLevel,
            level: total,
            dmg: total ** 0.175,
          }
        }
        case 22: 
          return {
            corr: 0.125 * t,
            weak: 0.1 * t
          };
        case 23:
          return 10 * t;
        case 26:
          return {
            space: 0.075 * t,
            corr: 0.2 * t,
          }
        case 27:
          return t * 0.005;
        case 28: 
          hero.value.dims.damage.effect = (1 + 0.0075 * t) ** Math.log(3 + Math.sqrt(hero.value.dims.damage.kills));
          return hero.value.dims.damage.effect;
        case 29:
          return t;
        case 30:
          return t;
        case 31: {
            let power = 1 - 0.01 * dimensions.value[31].infTier;
  
            return {
              p: power
            }
          }
        case 32: {
          const req = [1, 4, 6, 8, 12, 16, 20, 25];
          return {req: t >= req[attr], t: 1.25 ** Math.max(t - 25, 0)};
        }
        case 33:
          return t * 0.005;
        case 34:
          if (t < 18) return 1;
          return 1.25 ** (t - 18);
        case 35: 
          return 1 - t * 0.01;
        case 36:
          return {min: t, eq: 1.5 ** t};
        case 37: {
          let st = Math.max((Math.E * t) ** 0.4, 1);
          let d = 1 - 0.01 * t;
          let count = 6 * t;

          return {
            stardust: st,
            debuff: d,
            count : count
          }
        }
        case 38: {
          let exponentBonus = 1.25 + 0.01 * Math.max(t - 30, 0);

          let expMult = Math.max((Math.E * t), 1);
          let bonus = 12 + 3 * Math.floor(Math.max(t - 5, 0) / 5);
          let current = Math.floor(3000 + (bonus * t) ** exponentBonus);
          let next = Math.floor(3000 + (bonus * (t + 1)) ** exponentBonus);
          let lvlRed = (t >= 25? 1 - dimensions.value.filter(d => d.id.startsWith('d-')).reduce((sum, d) => sum + d.infTier, 0) * 0.001: 1);

          return {
            expMult: expMult,
            current: current,
            next: next,
            lvlRed: lvlRed
          }
        }
        case 39: {
          return {min: t, aps: 0.05 * t};
        }
        case 40:
          return t;
        case 41: 
          return Math.floor(Math.log(3 + hero.value.trueLevel) ** 1.25)
        case 47:
          return Math.max(1 - 0.01 * hero.value.dims.corrShards, 0.5);
        case 48:
          return 1.05 ** hero.value.stages.current;
        case 49:
          return 100;
        case 50: {
          if (hero.value.cUnlimitMaxLevel < 850) return 1;

          let lessPenalty = Math.log(Math.sqrt(hero.value.cUnlimitMaxLevel - 849));

          return Math.max(lessPenalty, 1);
        }
        case 51: {
          if (!getDimSpecialReward(51)) return;

          return {
            r: 1 + 0.01 * Math.min(hero.value.dims.corrShards, 20),
            as: 0.5
          }
        }
        case 53: {
          return dimensions.value.filter(d => d.id.startsWith('c-')).reduce((sum, d) => sum + (d.infTier == d.spInfTier? 1: 0), 0);
        }

        case 57: {
          if (hero.value.cDangerMax < 4000) return 0;

          let exp = 2.8 + 0.075 * Math.floor(Math.max(hero.value.cDangerMax - 4000, 0) / 1000);

          let danger = Math.max(Math.log(hero.value.cDangerMax - 3997) ** exp, 0);

          return Math.floor(danger);
        }

        case 59: {
          if (!getDimSpecialReward(59)) return 0;

          return 0.01 * hero.value.dims.corrShards;
        }


        }
    }

    const getDimEffect = (id) => {
      let d = dimensions.value[id].infTier;
      let t = d - (dimensions.value[id]?.infStart | 0);

      switch(id) {
        case 2: {
            let dmg = 1;
            let hp = 1;

            if(hero.value.dId == "gravity" && hero.value.stages.current >= 20) {
              let stage = (hero.value.stages.current - 19);
              dmg = 1 / (1.05 + 0.01 * t) ** stage;
              hp = (1.1 + 0.01 * t) ** stage;
            }
            
            return {dmg: dmg, hp: hp};
          };
        case 3: {
          let hp = 1;
          let dmg = 1;


          if(hero.value.dId == "overkill") {
            hp = Math.log(3 + hero.value.kills) ** 2;
            dmg = Math.log(3 + hero.value.kills) ** 0.25;
          }

          return { dmg: dmg, hp: hp};
        }
        case 7: {
          let hp = 1;
          let dmg = 1;

          if(hero.value.dId == "afk") {
            let bossCount = Math.floor(hero.value.stages.current / 5);
            hp = 5 ** bossCount;
            dmg = 1.5 ** bossCount
          }

          return {dmg: dmg, hp: hp};
        }
        case 9:
          return (hero.value.dId == 'next'? Math.min(hero.value.stages.current, 20): hero.value.stages.current)
        case 14: 
          return (hero.value.dId === 'soulD'? 4 + 0.25 * t: 0);
        case 15:
          return (hero.value.dId == 'danger'? 300 + 50 * t: 0);
        case 19: 
          return (hero.value.dId == 'overstage'? 100 + 10 * t: hero.value.stages.current);
        case 20: {
            let hp = 1;
            let dmg = 1;

            if(hero.value.dId == 'damage'){
              hp = Math.min(villian.value.status.dims.damage.kills ** (1.3 + 0.05 * t), 1e6);
              dmg = Math.min(villian.value.status.dims.damage.kills ** 0.1, 10);
            }

            return {hp: hp, dmg: dmg}
          }
        case 26: {
            let hp = 1;
            let dmg = 1;
            let corruption = 1;
            let penalty = (hero.value.isTravell? 2: 1);

            if (hero.value.dId == "d-corruption") {
              hp = Math.max(10000 - hero.value.corruption.total ** (4 - 0.075 * t), 100) * 1.55 ** t * penalty;
              dmg = Math.max(100 - hero.value.corruption.total ** (2 - 0.025 * t), 10) * 1.05 ** t * penalty
              corruption = 1 + 0.075 * t;
            }

            if (hero.value.darkId.includes('d-corruption')) {
              hp = Math.max(10000 - hero.value.corruption.total ** (4 + 0.075 * t), 10) * penalty;
              dmg = Math.max(100 - hero.value.corruption.total ** (2 + 0.035 * t), 2) * penalty;
            }

            return {dmg: dmg, hp: hp, corr: corruption};
        }
        case 27: {
          let dId = 1;
          let penalty = (hero.value.isTravell? 2: 1);

          if(hero.value.dId == 'd-hard')
            dId = ((1 + (0.01 + 0.004 * d) * hero.value.stages.current)) ** (1 + 0.015 * d) * penalty;

          if(hero.value.darkId.includes('d-hard'))
            dId = Math.max(1 + 0.0115 * hero.value.stages.current - 0.025 * d, 1) * penalty;

          return dId;
        }
        case 28: {
          let kills = villian.value.status.dims.ddamage.kills;
          let dmg = 1;
          let stats = 1;
          let penalty = (hero.value.dId.startsWith("d-") && hero.value.isTravell ? 1.2 : 1);

          if (hero.value.dId === "d-damage")
            dmg = Math.max(Math.min( kills ** (1 + 0.025 * d) * penalty, 1e6 * 1.05 ** d), 1);

          if (hero.value.darkId.includes("d-damage"))
            dmg = Math.max(Math.min( kills ** Math.max(1 - 0.015 * d, 0.5) * penalty, 1e6), 1);

          if (hero.value.dId === "d-damage")
            stats = Math.max(Math.min( kills ** (1 + 0.0025 * d), 1e3), 1);

          if (hero.value.darkId.includes("d-damage"))
            stats = Math.max(Math.min( kills ** Math.max(1 - 0.03 * d, 0.5), 1e3), 1);
          
          return {
            dmg: dmg,
            stats: stats
          }
        }

        case 34: 
          return (hero.value.dId == 'd-next'? Math.min(hero.value.stages.current, Math.max(30 - d, 1)): hero.value.stages.current);
        case 35: {
          let id = (hero.value.dId == 'd-noTree'? 2 + 0.25 * t : 1);
          let darkId = (hero.value.darkId.includes('d-noTree')? 2 - 0.02 * t: 1);

          return {
            dId: id,
            darkId: darkId
          }
        }
        case 36: {
          let costScale = (hero.value.dId == 'd-noEq'?  (Math.E * (dimensions.value[36].infTier + 1)) ** 1.3: 1);
          costScale = (hero.value.darkId.includes('d-noEq')? Math.max(Math.E ** (1.3 - 0.015 * dimensions.value[36].infTier), 1): costScale);

          return {cost: costScale};
        }
        case 37: 
          return (hero.value.dId == "d-noSpace"? (Math.E * (1 + t)) ** 1.75: 1);
        case 38:
          let reduce = (t >= 20? 1 + t * 0.025: 1) * getDimReward(50);
          return (hero.value.dId == 'd-unlimitted'? 1 / Math.max(hero.value.dTimer ** (0.1 + 0.01 * t) ** reduce, 1): 1);
        case 39: {
          let aps = 0;
          let vaps = 0;

          if (hero.value.dId == 'd-noAps') {
            aps = 0.0125 * hero.value.stages.current * Math.sqrt(Math.log(3 + t));
            vaps = 0.005 * hero.value.stages.current * Math.sqrt(Math.log(3 + t));
          }

          return {aps: aps, vaps: vaps};
        }
        case 44: {
          if (hero.value.dId != 'c-overkill') return 0;
          let red = 0;

          red = Math.log(3 + hero.value.kills) * 0.01;

          return Math.min(0.25, red);
        }
        case 45: {
          if (hero.value.dId != 'c-gravity') return 0;

          return 0.25 * Math.max(hero.value.stages.current - 20, 0);
        }

        case 46: {
          if (hero.value.dId != 'c-survival') return false;

          return true
        }
        case 47: {
          if (hero.value.dId != 'c-noTree') return false;

          return hero.value.stages.current;
        }
        case 51: {
          if (hero.value.dId != 'c-next') return 0;

          return Math.floor(hero.value.kills / 10000); 
        }
        case 52: {
          if (hero.value.dId != 'c-noStats') return {hp: 1, dmg: 1};

          let hp = 1.25 ** hero.value.stages.current;
          let dmg = 1 + 0.05 * hero.value.stages.current;

          return {hp: hp, dmg: dmg};   
        }
        case 53:
          if (hero.value.dId != 'c-noMinLevel') return 0;

          return 5 * hero.value.stages.current
        case 55:
          if (hero.value.dId != 'c-noBuffs') return 0;

          return 5 * hero.value.stages.current
        case 57: {
          if (hero.value.dId != 'c-danger') return 0;

          return 50 * hero.value.stages.current;
        }

        case 59: {
          if (hero.value.dId != 'c-overstage') return 1;

          return (hero.value.stages.current > 1? 0: 1);
        }

        case 61: {
          if (hero.value.dId != 'c-hard') return 1;

          return 100;
        }
        

        default: return t;
      }
    }

    const dimUp = (id) => {
      dimensions.value[id].infTier += 1;
    }

    const d20Effect = () => {
      villian.value.status.dims.damage.kills = (hero.value.dId == 'damage'? 
        villian.value.status.dims.damage.kills + 1: 0);
    }

    const d28Effect = () => {
      let d = dimensions.value[28].infTier;
      let proc = (d >= 10? 0.25: 0) + (d >= 20? 0.25: 0);

      if(Math.random() < proc) return;


      villian.value.status.dims.ddamage.kills = (hero.value.dId == 'd-damage' || hero.value.darkId.includes('d-damage')? 
        villian.value.status.dims.ddamage.kills + 1: 0);
    }

    const dim30 = () => {
      hero.value.maxStage = Math.max(hero.value.maxStage, hero.value.stage);
      if(hero.value.dId == 'survival-2') hero.value.survivalStage = Math.max(hero.value.survivalStage, hero.value.maxStage);
    }

    return {
        getDimSpecialReward,
        getDimEffect,
        getDimReward,
        d20Effect,
        d28Effect,
        dimUp,
        getBaseTierSourses
    }
}