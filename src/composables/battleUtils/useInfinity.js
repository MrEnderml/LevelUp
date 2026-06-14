import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { goals as infGoals } from "../../data/infGoals.js";
import { divineSkills } from "../../data/quasarCore.js";
import { dimensions } from "../../data/dimensions.js";
import { perks as ascenPerks } from '../../data/ascension.js';

import { useAscensions } from "./useAscension.js";
import { useDimensions } from "./useDimensions.js";
import { useTimeline } from "./dims/useTimeline.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { useSpecialStats } from "./useSpecialStats.js";
import { useAbysses } from "./useAbyss.js";
import { fn } from "../utils/global.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { d5RewardHandler } from "./global/d5RewardHandler.js";

export const useInfinity = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { player } = usePlayer();
    const { villian } = useBaseEnemy();

    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { abyssHandler } = useAbysses();
     

    const infHandler = (ctx) => {
        infTiersReq();
        infHandle();
    
        hero.value.infPointsMult = 1 + (0.05 * hero.value.singularity) +
        (hero.value.rebirthPts >= 5e6? Math.log(hero.value.rebirthPts) * 0.015: 0) +
        (enemy.value.specialCreatures.dim5.loot * 0.01) + 
        (getDimSpecialReward(22)? hero.value.mainInfTier * 0.01: 0) + 
        ctx.ascension.perksHandler(60) + 
        (hero.value.dId.startsWith('d-') && hero.value.selectedDivSkills.includes(9) && hero.value.corruption.total >= 10? divineSkills.value[9].values[0]: 0) + 
        (0.05 * hero.value.bhTier) + 
        ctx.spStats.trHandle().ip +
        ctx.timeline.collectLawEffects(13).add +
        abyssHandler(15) + 
        hero.value.voidTreeStats.inf_ip_mult +
        hero.value.voidTreeStats.qua_unnused;

        hero.value.infPointsAdd = hero.value.infPointsGoals + 
        enemy.value.specialCreatures.inf2.loot  + 
        hero.value.eqUpsMult['spRing'].infPoints;

        hero.value.infPoints = hero.value.infPointsAdd * hero.value.infPointsMult;
    
        hero.value.infPoints *= (hero.value.selectedDivSkills.includes(2)? divineSkills.value[2].values[1]: 1);
        hero.value.infPoints *= ctx.abyss.corrInflueceHandle(4);
    
        hero.value.infPoints = Math.floor(hero.value.infPoints);

        quasarCores();
        quasarCoreHandle(ctx);
    }
    
    const infHandle = () => {
        if(hero.value.mainInfTier == 0 && hero.value.level < 700) return;
        
        let ip = 0;
        for (let idx = 0; idx < infGoals.value.length; idx++) {
          const goal = infGoals.value[idx];
      
          if (goal.tier < goal.maxTier && infGoalsReq(idx)) {
              if (goal.level < 5)
                  goal.tier++;
          }
      
          if (goal.level < 5) {
              ip += goal.reward * goal.tier;
          }
      
          if (hero.value.mainInfTier >= 85 && goal.level === 5) {
              ip += goalRankTwoHandle(idx);
          }
        }

        hero.value.infPointsGoals = ip;
    }

    const quasarCores = () => {
      const h = hero.value;
      const tier = hero.value.mainInfTier;
    
      const firstPart = Math.max(
        Math.floor((Math.min(tier, 100) - 45) / 5), 0);
    
      const secondPart = Math.max(
        Math.floor((tier - 100) / 10), 0);
    
      h.quasar.cores = firstPart + secondPart;
    
      if (tier < 100) {
        h.quasar.next = 50 + h.quasar.cores * 5;
      } else {
        h.quasar.next = 100 + (secondPart + 1) * 10;
      }
    
      h.quasar.coresUsed = hero.value.selectedDivSkills.length;
      h.quasar.freeCores = h.quasar.cores - h.quasar.coresUsed;
    };
     
    const infGoalsReq = (idx) => {
  const goals = infGoals.value;

  if (!goals[idx].status) return false;

  switch (idx) {
    case 0:
      return hero.value.mainInfTier > goals[0].tier;

    case 1:
      return hero.value.abyssDStages >= 20 + 15 * goals[1].tier;

    case 2:
      return player.value.attack.final >= 2e6 * (goals[2].tier + 1);

    case 3:
      return hero.value.souls >= 100 + 20 * goals[3].tier;

    case 4:
      return hero.value.eqUps.spRing >= 50 + 25 * goals[4].tier;

    case 5:
      return hero.value.equipmentTiers.sword >= 11 + 3 * goals[5].tier;

    case 6:
      return hero.value.level >= 750 + 50 * goals[6].tier;

    case 7:
      return hero.value.trueLevel >= 1500 + 150 * goals[7].tier;

    case 8:
      return hero.value.corruption.total >= 0.6 + 0.1 * goals[8].tier;

    case 9:
      return hero.value.potential >= 200 + 50 * goals[9].tier;

    case 10:
      return hero.value.abyssDStages >= 120 + 20 * goals[10].tier;

    case 11:
      return player.value.attack.final >= 1e9 * (goals[11].tier + 1);

    case 12:
      return hero.value.souls >= 300 + 50 * goals[12].tier;

    case 13:
      return hero.value.eqUps.spRing >= 200 + 25 * goals[13].tier;

    case 14:
      return hero.value.equipmentTiers.sword >= 24 + 3 * goals[14].tier;

    case 15:
      return hero.value.level >= 1000 + 100 * goals[15].tier;

    case 16:
      return hero.value.trueLevel >= 5000 + 1000 * goals[16].tier;

    case 17:
      return hero.value.singularity > goals[17].tier;

    case 18:
      return enemy.value.specialCreatures.inf2.loot >=
        100 + 100 * goals[18].tier;

    case 19:
      return player.value.stats.final.hp >=
        2e5 * (goals[19].tier + 1);

    case 20:
      return hero.value.abyssDStages >=
        220 + 20 * goals[20].tier;

    case 21:
      return player.value.attack.final >=
        1e12 * (goals[21].tier + 1);

    case 22:
      return hero.value.souls >=
        600 + 100 * goals[22].tier;

    case 23:
      return hero.value.eqUps.spRing >=
        350 + 50 * goals[23].tier;

    case 24:
      return hero.value.equipmentTiers.sword >=
        37 + 3 * goals[24].tier;

    case 25:
      return hero.value.level >=
        2200 + 200 * goals[25].tier;

    case 26:
      return hero.value.trueLevel >=
        3e4 + 1e4 * goals[26].tier;

    case 27:
      return hero.value.dims.passedDims > goals[27].tier;

    case 28:
      return player.value.stats.final.def >=
        5e4 + 1e4 * goals[28].tier;

    case 29:
      return hero.value.mainInfTier >
        15 + goals[29].tier;

    case 30:
      return hero.value.dims.passedDims >= 10 + 2 * goals[30].tier;

    case 31:
      return hero.value.rebirthPts >=
        625000 * (2 ** goals[31].tier);

    case 32:
      return hero.value.infPoints >=
        5000 + 5000 * goals[32].tier;

    case 33:
      return hero.value.exp >=
        1e9 * 1e6 ** goals[33].tier;

    case 34:
      return hero.value.dTimeReward <=
        480 / (goals[34].tier + 1);

    default:
      return false;
  }
};
    
    const goalRankTwoHandle = (id) => {
      let h = hero.value;

      let b = d5RewardHandler(3, hero);

      switch(id) {
        case 36: return Math.log(3 + h.void.totalShards) ** 1.25 * b;
        case 37: return Math.log(3 + h.gravity.totalShards) ** 1.5 * b;
        case 38: return Math.floor(dimensions.value.filter(d => d.id.startsWith('d-')).reduce((sum, d) => sum + d.infTier, 0) / 10) * b;
        case 39: return Math.floor(h.totalStats.totalLevel / 100) * b;
        case 40: return Math.sqrt(h.tr.count) * b;
        case 41: return Math.log(3 + Math.sqrt(h.totalStats.totalAS)) * b;
        case 42: return Math.log(3 + Math.sqrt(h.totalStats.maxDmgDealded)) ** 1.1 * b;
        case 43: return Math.min(h.mainInfTier / 10, 10) + Math.max((h.mainInfTier - 100) / 2, 0) * b;
        case 44: return Math.floor(h.totalStats.spEnhances / 10) * b;
        case 45: return 100 * h.void.tier * b;

        default: return 0;
      }
    }

    const infTiersReq = () => {
        for(let goal of infGoals.value){
          if(goal?.nodeId){
            if(infGoals.value[goal.nodeId - 1].tier == infGoals.value[goal.nodeId - 1].maxTier)
              goal.status = true;
          }
          if(goal.id == 19){
            if(hero.value.mainInfTier >= 4){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 20){
            if(hero.value.mainInfTier >= 13){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 28){
            if(hero.value.abyssDStages >= 80){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 29){
            if(hero.value.mainInfTier >= 15){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 30){
            if(hero.value.mainInfTier >= 15){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 31){
            if(getDimSpecialReward(9)){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 34){
            if(hero.value.unlimitLevel >= 2000){
              infGoals.value[goal.id - 1].status = true;
            }
          }
          if(goal.id == 35){
            if(hero.value.dTimeReward > 0){
              infGoals.value[goal.id - 1].status = true;          
            }
          }
          if(goal.id == 36){
            if(hero.value.mainInfTier >= 100){
              infGoals.value[goal.id - 1].status = true;          
            }
          }
          if(goal.id == 37){
            if(hero.value.bhTier >= 5){
              infGoals.value[goal.id - 1].status = true;          
            }
          }
          if(goal.id == 45){
            if(hero.value.mainInfTier >= 100){
              infGoals.value[goal.id - 1].status = true;          
            }
          }
        }
    }    

    const quasarCorePower = (ctx) => {
      hero.value.quasar.power = 
      (1 + 0.01 * (ctx.timeline.collectLawEffects(14).mult - 1)) * 
      ctx.abyss.corrInflueceHandle(9) *
      hero.value.voidTreeStats.qua_eff_1 *
      spaceShopHandler(16, hero) * 
      infBonusesHandler(31, hero) * 
      (1 + 0.01 * enemy.value.specialCreatures.ddim9.loot) *
      (hero.value.dId == 'c-noSpace'? 1 + (hero.value.spCount + hero.value.spsCount) * 0.01: 1);

      return hero.value.quasar.power;
    }

    const quasarMainPower = () => {
      return Math.min(hero.value.mainInfTier - 50, 50) + 
      Math.max(hero.value.mainInfTier - 100, 0) / 4;
    }

    const quasarCoreHandle = (ctx) => {
        if(hero.value.mainInfTier < 50) return;
    
        let tier = quasarMainPower();

        let e = quasarCorePower(ctx);
    
        divineSkills.value[0].values[0] = Math.max(0.75 - 0.005 * tier * e, 0.1);
        divineSkills.value[0].values[1] = 0.25 + 0.01 * tier * e;
    
        divineSkills.value[1].values[0] = 0.5 + 0.005 * tier * e;
        divineSkills.value[1].values[1] = Math.floor(1.175 ** (tier * e));
        //0.1
        divineSkills.value[2].values[0] = 0.01 + 0.0015 * tier * Math.sqrt(Math.log(Math.max(hero.value.infPoints, 3))) * e;
        divineSkills.value[2].values[1] = 0.25 + 0.003 * tier * e;
    
        divineSkills.value[3].values[0] = (player.value.APS.total >= player.value.APS.max? 
          Math.log(3 + Math.max(player.value.APS.total - player.value.APS.max, 0)) * Math.log(Math.max(Math.sqrt(tier), 3)) * e: 1);
        
        divineSkills.value[4].values[0] = Math.floor(16 * tier * e);
        divineSkills.value[4].values[1] = Math.floor(Math.max(50 - 0.5 * tier * e, 1));
    
        divineSkills.value[6].values[0] = Math.floor(1.15 ** (tier * e));
    
        divineSkills.value[7].values[0] = (enemy.value.danger > 0? 1 + 0.01 * tier * (enemy.value.danger ** 0.4) * e: 1);
        divineSkills.value[7].values[1] = 0.1 + 0.008 * tier * e;
        //0.1
        divineSkills.value[8].values[0] = 0.01 + 0.006 * tier * e;
        divineSkills.value[8].values[1] = 0.01 + 0.004 * tier * e;
    
        divineSkills.value[9].values[0] = 0.02 * tier * e;
    
        divineSkills.value[10].values[0] = Math.max(2 - 0.01 * tier * e, 0.1);
        divineSkills.value[10].values[1] = 1.1 + 0.005 * tier * e;
    
        divineSkills.value[11].values[0] = 1 + 0.04 * tier * e;
    
        divineSkills.value[12].values[0] = Math.floor((Math.E ** 2.7) * tier * e);
        divineSkills.value[12].values[1] = Math.max(1.25 - 0.0025 * tier * e, 0.1);
    
        divineSkills.value[13].values[0] = 0.25 + 0.0075 * tier * e
        divineSkills.value[13].values[1] = 0.005 * tier * e;
    
        divineSkills.value[14].values[0] = Math.max(0.95 - 0.0025 * tier * e, 0.1);

        let overcaped = (player.value.stats.final.crit >= 100? player.value.stats.final.crit - 100: 0);
        divineSkills.value[15].values[0] = overcaped * 0.015 * Math.floor(tier / 10) * e;

        divineSkills.value[16].values[0] = 0.01 + 0.01 * Math.floor(tier / 5) * e;
        divineSkills.value[16].values[1] = Math.floor(1e6 * (1 / (tier * e)));

        divineSkills.value[17].values[0] = Math.floor(1.1 ** (tier ** 1.1  * e));
        divineSkills.value[17].values[1] = Math.floor(1e5 *  (1 / (tier ** 0.9  * e)));

        divineSkills.value[18].values[0] = Math.floor((tier * e) / 50);

        divineSkills.value[19].values[0] = Math.floor((tier * e) / 40);

        divineSkills.value[20].values[0] = Math.max(1 - 0.01 * Math.floor((tier * e) / 10), 0.1);
    }
    
    

    const infPenalties = () => {
      let t = hero.value.infTier;
      let status = (hero.value.selectedDivSkills.includes(18)? 
      !(divineSkills.value[18].values[0] >= hero.value.selectedDivSkills.length) : true);

      let reducePenalty = d5RewardHandler(1, hero);

      let st = (hero.value.infProgress && status? (1 + 0.2 * Math.max(t - 20, 0)) ** (1 + 0.02 * t) * reducePenalty: 1);
      let mut = (hero.value.infProgress && status? (1 + 0.05 * Math.max(t - 25, 0)) ** (1 + 0.0075 * t) * reducePenalty: 1);
      let curse = (hero.value.infProgress && status? Math.max((1 + 0.1 * Math.max(t - 30, 0))) ** (1 + 0.005 * t) * reducePenalty: 1);

      return {
        stardust: st,
        mutagen: mut,
        curseMult: curse 
      }
    }

    function quasarCoreTooltip() {
      let next = hero.value.quasar.next;
      return `Absorb the <span style='color: #00ffea'>Quasar Core</span> into yourself. Each <span style='color: gold'>Infinity Tier</span> increases the effects of the <span style='color: #00ffea'>Quasar Power</span>.
      Gain the next <span style='color: #00ffea'>Quasar Core</span> at <span style='color: gold'>Infinity [T${next}]</span>.
    
      <span style='color: red'>You can change Quasar Core when you are not in Infinity Trial</span>`;
    }

    function timelineMainDescHandle() {
      return `
        <span style="color: #f0c420; font-weight: bold;">Law Stone</span>
        Every law stone has a <span style="color: #66ffcc; font-weight: bold;">Tier</span>, which specifies:
        - The <span style="color: #ff5555; font-weight: bold;">number</span> of possible <span style="color: #66ffcc; font-weight: bold;">laws</span> on the stone.
        - The <span style="color: #ff5555; font-weight: bold;">maximum</span> possible <span style="color: #66ffcc; font-weight: bold;">Law Tier</span>.
    
        <span style="color: #ffff66; font-weight: bold;">The higher the Law Tier, the more powerful the law itself</span>.
        Laws are <span style="color: #ff5555; font-weight: bold;">not connected to a specific stone</span>. There are many law stones with various combinations of laws and tiers.
        Laws of <span style="color: #ff5555; font-weight: bold;">highest tiers have the lowest chance</span> of appearing compared to lower tiers.
        You can complete the trials and get <span style="color: #ff5555; font-weight: bold;">as many stones as you want</span>.
    
        <span style="color: #66ffcc; font-weight: bold;">Radius</span>
        The radius <span style="color: #ffff66; font-weight: bold;">defines</span> the area of effect of the <span style="color: #66ffcc; font-weight: bold;">law</span>.
        The higher the radius, the more dimensions can be contained within it.
        The law <span style="color: #ffff66; font-weight: bold;">only affects</span> the dimensions that are <span style="color: #ffff66; font-weight: bold;">inside the radius</span>.
          `;
    }

    const effectsActivated = (tab) => {
      const cards = [];
    
      if (tab == 'infinity') {
        if (hero.value.infPenalty > 0 || hero.value.mainInfTier >= 35)
          cards.push('R');

        cards.push('B');
      }
        
    
      if (tab == 'divine') {
        cards.push('Q');
        cards.push('P');
        cards.push('D');
      }
        

      if (tab == 'sing') {
        if (hero.value.singMult > 1)
          cards.push('M');

        cards.push('Z');
      }

      if (tab == 'laws') {
        cards.push('L');
        cards.push('r');
        cards.push('F');
        cards.push('S');

        if (getDimSpecialReward(46))
          cards.push('A');
      }

      return cards;
    }

    
    const activeSelect = (key) => {
    }

    const clickEffects = (key) => {
      if (key == 'i') return hero.value.eLink = { set: 'Info', info: 'Infinity' };
    }

    const effectsHandler = (id) => {
      switch (id) {
    
        case 'R': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #fffdc7;">' +
            '<strong style="color:gold;">Infinity Resistance</strong><br>' +
            `Infinity Resistance represents your ability to withstand the oppressive forces of Infinity Trials that reduce the Infinity Penalty.
            Infinity Resistance: <b>${fn(hero.value.infPenalty)}</b>` +
            '</span>'
          );
        }

        case 'B': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #fffdc7;">' +
            '<strong style="color:gold;">Infinity Bonuses</strong><br>' +
            'Increase the power of Infinity bonuses by earning Infinity Points.' +
            '</span>'
          );
        }
    
        case 'Q': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #18fffb;">Quasar Cores</strong><br>' +
            (quasarCoreTooltip()) +
            '</span>'
          );
        }

        case 'P': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #18fffb;">Quasar Power</strong><br>' +
            'Quasar Power affects the effect of Quasar Cores<br>' +
            `Quasar Power from main dimension: <b>${fn(quasarMainPower())}</b><br>` +
            `Quasar Power from other sources: <b>${fn(hero.value.quasar.power)}</b><br>` +
            `Total Quasar Power: <b>${fn(hero.value.quasar.power * quasarMainPower())}</b>` +
            '</span>'
          );
        }

        case 'D': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #18fffb;">Quasar Description</strong><br>' +
            `The Quasar Core is divided into three types.
            The first type provides specific benefits.
            The second type provides benefits.
            The third type provides benefits but also degrades certain aspects.
            The second and the third types have numbers in square brackets indicating the benefit and drawback.<br>` +
            `Let's take the Doomflare example. You get the Max danger level <b style="color: gold">[first number]</b>, but the Danger Power will be much worse <b style="color: gold">[second number]</b>.
            If the Quasar Power is high enough, the second number will increase even more, giving you an advantage.` +
            '</span>'
          );
        }

        case 'L': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #f0c420;">Law Stone</strong><br><br>' +
            'Every stone has a <span style="color:#66ffcc; font-weight:bold;">Tier</span>, which determines:<br>' +
            'The <span style="color:#ff5555; font-weight:bold;">number</span> of possible ' +
            '<span style="color:#66ffcc; font-weight:bold;">Laws</span> on the stone.<br>' +
            'The <span style="color:#ff5555; font-weight:bold;">maximum</span> ' +
            '<span style="color:#66ffcc; font-weight:bold;">Law Tier</span>.<br>' + 
            'The <span style="color:#ff5555; font-weight:bold;">Length</span> of Radius<br><br>' +
            'Each Law has its own <span style="color:#66ffcc; font-weight:bold;">Tier</span>. The higher the <span style="color:#66ffcc; font-weight:bold;">Tier</span>, the stronger its effect.' +
            '</span>'
          );
        }

        case 'r': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #f0c420;">Radius</strong><br><br>' +
            'The radius <span style="color: #ffff66; font-weight: bold;">defines</span> the area of effect of the <span style="color: #66ffcc; font-weight: bold;">law</span>. ' +
            'The higher the radius, the more dimensions can be contained within it. ' +
            'The law <span style="color: #ffff66; font-weight: bold;">only affects</span> the dimensions that are <span style="color: #ffff66; font-weight: bold;">inside the radius</span>. <br>' +
            `<span style="color: red">The radius is weakened by half in dark dimensions</span>` +
            '</span>'
          );
        }

        case 'F': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #f0c420;">Ancient Fragments</strong><br><br>' +
            `Ancient Fragments are obtained by grinding Law Stones. The number of Ancient Fragments obtained depends on the stone's tier and law's tiers. Ancient Fragments can be spent on upgrading the radius of Law Stones. Click on the stone in your inventory.<br>` +
            `When grinding Law Stones, you will receive 75% of the total amount of [AF] spent on the upgrade.` +
            '</span>'
          );
        }

        case 'A': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #f0c420;">AUTO-TIMELINE</strong><br><br>' +
            `If you complete a certain timed stage, you'll automatically receive stones for a set amount of time.
            In the Timeline panel, you can select the timeline for obtaining stones. 
            <span style="color: red">If your inventory is full, you won't receive stones.</span>` +
            '</span>'
          );
        }

        case 'S': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color: #f0c420;">Stone Slots</strong><br><br>' +
            `Click on the slot and choose the stone.
            First slot for the normal dimensions. Second slot for the dark dimensions.<br>` +
            `Click on the stone in your inventory to unlock the upgrade panel.` +
            '</span>'
          );
        }

        case 'M': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color:rgb(32, 240, 230);">Singularity MULT</strong><br><br>' +
            `Singularity MULT increase the singularity shards and does not increase the Singularity [D-S] requirement.
            Singularity MULT: <b>${fn(hero.value.singMult)}</b>` +
            '</span>'
          );
        }

        case 'Z': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#aef6f5;">' +
            '<strong style="color:rgb(32, 240, 230);">Singularity Bonuses</strong><br><br>' +
            `Increase the tier of the Singularity perks by meeting the Singularity Shards requirements.
            Singularity Perks have abilities that improve with each tier<br>` +
            '</span>'
          );
        }

        case 'i': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #ffe02f">' +
            '<strong style="color: gold">Info</strong><br>' +
            `Click to see more info` +
            '</span>'
          );
        }

       
    
      }
    }

    



    return {
        infHandler,
        infPenalties,
        effectsActivated,
        activeSelect,
        clickEffects,
        effectsHandler,
        goalRankTwoHandle
    }
}