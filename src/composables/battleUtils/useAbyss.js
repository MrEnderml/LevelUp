import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { useBuff } from "../../data/buffs.js";

import { fn } from "../utils/global.js";
import { useTrees } from "./useTree.js";
import { usePlayer } from "../utils/playerSetup.js";
import { perks as radPerks } from '../../data/radPerks.js'

export const useAbysses = () => {
  const { hero } = useHero();
  const { enemy } = useEnemy();
  const { buffs } = useBuff();
  const { player } = usePlayer();

  const abyssDRewardsHandler = (id) => {
          let stage = hero.value.abyssDStages
          const s = stage * (1 + 0.01 * Math.max(stage - 299, 0));

          switch(id) {
            case 0: 
              return Math.log(s) ** 0.3;
            case 1:
              return 0.01 * Math.log(s - 17);
            case 2:
              return Math.max(1 - (1 / (Math.sqrt(s - 39) ** 0.175)), 0.1);
            case 3:
              return Math.max(2 - (1.025 ** (s - 49)), 0.1);
            case 4:
              return 1 + 0.05 * (s - 59);
            case 5:
              return 1 + 0.005 * Math.min(s - 79, 100);
            case 6:
              return 1.01 ** (s - 99);
            case 7:
              return Math.floor((s - 119) ** 0.65);
            case 8:
              return (100 - Math.sqrt(s - 139)) * 0.01;
            case 9:
              return  Math.max(1 / (1.01 ** (s - 159)), 0.1);
            case 10:
              return Math.max(1 / (1 + 0.02 * Math.min(s - 179, 100)), 0.1);
            case 11:
              return 0.025 * (s - 199);
            case 12:
              return Math.floor((s - 219) / 25);
            case 13:
              return 1 / Math.sqrt((s - 239) ** 0.25)
            case 14:
              return Math.floor(s / 10);
            case 15:
              return 0.01 * Math.floor(s / 10);
            case 17:
              return 0.01 * Math.floor(stage / 30);
            case 18:
              return 0.1 * Math.floor(stage / 5);
            case 19:
              return 1 + 0.01 * Math.floor(stage / 40);
            case 20:
              return 1 + 0.01 * Math.floor(stage / 50);
            case 21:
              return Math.floor(stage / 100);
          }

      
  }

  const abyssLevelReq = (level) => {
    let s = hero.value.abyssDStages;
    let pen = 
    (s >= 100? 0.02: 0) + 
    (s >= 200? 0.03: 0) + 
    (s >= 300? 0.04: 0);

    let base = 1.0155 + pen;

    return (base ** level);
  }
  
  const abyssHandler = (id) => {
    let stage = [20, 30, 40, 50, 60, 80, 100, 120, 140, 160, 180, 200, 220,
        240, 260, 280, 300, 320, 340, 360, 380, 400];
    let result = [1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0,
      1, 0, 0, -1, 0, 0, 1, 1, 0
    ];
    
    return (hero.value.spCount >= 15 && hero.value.abyssDStages >= stage[id]? abyssDRewardsHandler(id): result[id]);
  }

  const abyssRewardList = () => {
    const s = hero.value.abyssDStages;
    const r = hero.value.abyssDRewards;
  
    let out = "";
    let cap = 0;
  
    const add = (stage, text, value = null) => {
      if (s >= stage) {
        out += `
          <span>
            <span style="color:#f942f9">Stage ${stage}</span>: ${text}
          </span>
        `;
        if (value !== null) out += `<span>[${value}]</span>`;
        out += `<br/>`;
      } else if(cap < 1) {
        out += `Reach <span style="color:#f942f9">Stage ${stage}</span> to unlock new feature`;
        cap++;
      }
    };
  
    add(20, "High Tier Curses appear more often");
  
    add(30, "Stage requirement is reduced",
        `-${fn(abyssDRewardsHandler(1))}`);
  
    add(40, "Corruption weakness",
        `+${fn(abyssDRewardsHandler(2))}`);
  
    add(50, "Level requirement is reduced",
        `*${fn(abyssDRewardsHandler(3))}`);
  
    add(60, "Stardust drop is increased",
        `*${fn(abyssDRewardsHandler(4))}`);
  
    add(80, "Increase Essence gain",
        `*${fn(abyssDRewardsHandler(5))}`);
  
    add(100, "The chance to convert curse [T4] → [T5]",
        `*${fn(abyssDRewardsHandler(6))}`);
  
    add(120, "Dimension Shard requirement is reduced",
        `-${fn(abyssDRewardsHandler(7))}`);
  
    add(140, "Reduce Danger Power",
        `^${fn(abyssDRewardsHandler(8))}`);
  
    add(160, "Celestials are weaker",
        `*${fn(abyssDRewardsHandler(9))}`);
  
    add(180, "Soul-D enemies are weaker",
        `*${fn(abyssDRewardsHandler(10))}`);
  
    add(200, "Max Level MULT is increased",
        `+${fn(abyssDRewardsHandler(11))}`);

    add(220, "Reduce Awakened Tiers Requirement",
      `-${fn(abyssDRewardsHandler(12))}`);

    add(240, "Resonance Power is reduced",
      `*${fn(abyssDRewardsHandler(13))}`);

    add(260, "Min Level is increased",
      `+${fn(abyssDRewardsHandler(14))}`);

    add(280, "IP MULT is increased",
      `+${fn(abyssDRewardsHandler(15))}`);

    add(300, "Increase the effect of features below",
      `+${fn(1 + 0.01 * (s - 299))}`);
    
    add(320, "-0.01 Infinity Resistance per 30 stages in Abyss",
      `+${fn(abyssDRewardsHandler(17))}`);
    
    add(340, "-0.1% Corruption Influence per 5 stages in Abyss",
      `+${fn(abyssDRewardsHandler(18))}`);

    add(360, "+0.01 Singularity Shards MULT per 40 stages in Abyss",
      `+${fn(abyssDRewardsHandler(19))}`);
    
    add(380, "+0.01 Void Shars MULT per 50 stages in Abyss",
        `+${fn(abyssDRewardsHandler(20))}`);
    
    add(400, "+1 Corruption shard per 100 completed stages in Abyss",
        `+${fn(abyssDRewardsHandler(21))}`);
  
    add(1000, "???");
  
    return out;
  }

  const corrInflueceHandle = (id) => {
    let req = (hero.value.dId.startsWith('c-') || hero.value.dId == 'dimMerge' || hero.value.dId == 'advanceBH');
    let c = hero.value.corrInfluence;

    switch (id) {
      case 0: {
        if (c < 5 || !req) return {hp: 1, dmg: 1};

        let s = hero.value.stages.current;
        let hp = 1 + 0.01 * s * c ** 1.5;
        let dmg = 1 + Math.sqrt(0.01 * s * c);
        
        return {hp: hp, dmg: dmg}
      }
      case 1: {
        if (c < 10 || !req) return 0;

        let r = 0.002 * c;
        return r;
      }
      case 2: {
        if (c < 15 || !req) return 1;

        let red = 1.05 ** c;

        return red;
      }
      case 3: {
        if (c < 20 || !req) return 1;

        let red = 1 - Math.sqrt(player.value.statistic.deaths * c) * 0.01;

        return Math.max(red, 0.01);
      }
      case 4: {
        if (c < 25 || !req) return 1;

        let l = player.value.buff.activeBuffs.length;

        let red = 1 - (l ** 1.5) * 0.01;

        return Math.max(red, 0);
      }
      case 5: {
        if ( c < 30 || !req) return {crit: 0, critDmg: 0};

        let crit = c;
        let critDmg = 0.1 * c;

        return {crit: crit, critDmg: critDmg}        
      }
      case 6: {
        if ( c < 35 || !req) return true;

        return false;
      }
      case 7: {
        if (c < 40 || !req) return 1;

        let red = 1 - c * 0.005;

        return Math.max(red, 0);
      }
      case 8: {
        if ( c < 45 || !req) return 1;

        return 1 + 0.01 * c;
      }
      case 9: {
        if (c < 50 || !req) return 1;

        let red = 1 - c * 0.0075;

        return Math.max(red, 0.25);
      }
      case 10: {
        if (c < 55 || !req) return false;

        return true;
      }
      case 11: {
        if (c < 60 || !req) return 1;

        let div = hero.value.level / hero.value.maxLevel;
        let red = Math.max(1 - div, 0.1);

        return red;
      }
      case 12: {
        if (c < 65 || !req) return 1;

        let red = 1 / (1.2 ** c);

        return red;
      }
      case 13: {
        if (c < 70 || !req) return 1;

        return 0.7;
      }
      case 14: {
        if ( c < 75  || !req) return; 

        hero.value.kills = Math.floor(hero.value.kills * 0.9);
        return;
      }
      case 15: {
        if (c < 80 || !req) return;

        hero.value.eLevel = Math.max(hero.value.eLevel - 10, 1);
        return;
      }
      case 16: {
        if (c < 85 || !req) return false;

        return true;
      }
      case 17: {
        if (c < 90 || !req) return false;

        return true;
      }
      case 18: {
        if (c < 95 || !req) return false;

        return true;
      }
      case 19: {
        if (c < 100 || !req) return false;

        return true;
      }
    }
  }

  const autoDimAbyss = () => {
    if (hero.value.dId == 'main') return;
    
    if (hero.value.rebirthPts >= 1.5e6) return;

    hero.value.abyssTier = Math.max(Math.min(
      Math.floor(Math.min(hero.value.maxStage, hero.value.soulsMax) / 10) - 1,
      3
    ), 0);

    if (radPerks[9].level) return;
    if (hero.value.dId == 'soulD') return;

    hero.value.soulsCap = 20 + 10 * Math.min(hero.value.abyssTier, 2);

   }

  const autoAbyss = () => {
    if (!hero.value.voidTreeStats.abyss_auto) return;

    hero.value.abyssDStages = Math.max(hero.value.stages.current - hero.value.voidTreeStats.abyss_stage, 
      hero.value.abyssDStages
    );
  }

  return {
    abyssDRewardsHandler,
    abyssHandler,
    abyssLevelReq,
    abyssRewardList,
    autoDimAbyss,
    corrInflueceHandle,
    autoAbyss
  };
};
