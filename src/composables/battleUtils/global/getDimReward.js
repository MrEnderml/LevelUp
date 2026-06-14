import { dimensions } from "../../../data/dimensions";

export const getDimReward = (id, hero, attr = null) => {
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
          return Math.floor(1.75 ** t) - 1;
        case 17:
          return 1 - 0.015 * t;
        case 19:
          return t;
        case 20:
          return 1.06 ** t;
        case 21: {
          let scale = 1.25 * (getDimSpecialReward(58)? 2: 1);
          let total = hero.value.dims.survival.stage ** scale;

          return {
            req: total > hero.value.level,
            level: total,
            dmg: total ** 0.2,
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
          let expMult = Math.max((Math.E * t) ** 0.6, 1);
          let bonus = 12 + 3 * Math.floor(Math.max(t - 5, 0) / 5);
          let current = Math.floor(3000 + (bonus * t) ** 1.25);
          let next = Math.floor(3000 + (bonus * (t + 1)) ** 1.25);
          let lvlRed = (t >= 30? 1 - dimensions.value.filter(d => d.id.startsWith('d-')).reduce((sum, d) => sum + d.infTier, 0) * 0.001: 1);

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
          if (hero.value.cUnlimitMaxLevel < 1000) return 1;

          let lessPenalty = Math.log(Math.sqrt(hero.value.cUnlimitMaxLevel - 1000));

          return Math.max(lessPenalty, 1);
        }
        case 53: {
          return dimensions.value.filter(d => d.id.startsWith('c-')).reduce((sum, d) => sum + (d.infTier == d.spInfTier? 1: 0), 0);
        }

        case 57: {
          if (hero.value.cDangerMax < 3000) return 0;

          let danger = Math.max(Math.log(hero.value.cDangerMax - 2997) ** 2.8, 0);

          return Math.floor(danger);
        }

        case 59: {
          if (!getDimSpecialReward(59)) return 0;

          return Math.floor(hero.value.stages.current / 50);
        }


        }
    }

    const getBaseTierSourses = (id) => {
        let base = (getAllActiveDims().includes(id)? collectLawEffects(12).add: 0) +
        hero.value.voidTreeStats.inf_base_tier + 
        d5RewardHandler(8);
  
        return base;
      }