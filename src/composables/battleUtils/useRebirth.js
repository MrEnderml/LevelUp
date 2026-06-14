// useRebirth.js
import { useHero } from '../useHero.js';
import { useEnemy } from '../useEnemy.js';

import { perks as ascenPerks } from '../../data/ascension.js';
import { perks as radPerks } from '../../data/radPerks.js';

import { fn } from '../utils/global.js';
import { dimensionsPos } from '../../data/dims/dimensionsPos.js';

import { useTrees } from "./useTree.js";
import { useAscensions } from './useAscension.js';
import { useDimensions } from './useDimensions.js';
import { infBonusesHandler } from './global/infBonusesHandler.js';

export function useRebirths() {
  const { hero } = useHero();
  const { enemy } = useEnemy();

  const { nodesHandler } = useTrees();
  const { perksHandler } = useAscensions(); 

  const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();

  const rebirthPtsHandle = () => {
    let extraLevel =
      hero.value.level +
      perksHandler(37) +
      (hero.value.rebirthTier >= 20 ? hero.value.rebirthBonusesHandle[3].value : 0);

    let pt = Math.min(
      (
        Math.log(Math.max(extraLevel - 97, 3) ** (1.15 + 0.08 * (Math.floor(hero.value.rebirthPts)).toFixed(0).length))
      ) ** (extraLevel / Math.max(100 - (1 * extraLevel / 9), 1)),
      10000
    );

    hero.value.baseRebirthPts = pt >= 400 ? 400 + Math.sqrt(pt - 400) : pt;

    let pts =
      hero.value.baseRebirthPts *
      (hero.value.mainInfTier < 9? 2: 1) *
      (hero.value.rebirthPts >= 5 ? enemy.value.rebirthEnemy["drop"] : 1) *
      1.3 ** hero.value.abyssTier *
      nodesHandler(14, ['base', 'inf']) *
      (hero.value.soulTier >= 4 ? 1.5 : 1) *
      (hero.value.rebirthPts >= 1250? Math.min((1 + 0.01 * hero.value.rebirthTier) ** 8, 2) * (1 + 0.01 * Math.max(hero.value.rebirthTier - 9, 0)) ** 2: 1) *
      perksHandler(34) *
      infBonusesHandler(8, hero)

    hero.value.totalPtsMult = pts;

    if (hero.value.level >= 100) {
      hero.value.totalRebirthPts = pts;

      if (hero.value.singularity < 8) {
        hero.value.totalRebirthPts = Math.min(hero.value.totalRebirthPts, 1e5 - hero.value.rebirthPts);
        hero.value.rebirthPts = Math.min(hero.value.rebirthPts, 1e5);
      } else {
        hero.value.rebirthPts = 1e5 + hero.value.singularityKills ** 3.5;

        hero.value.rebirthPts = Math.min(hero.value.rebirthPts, 1e7);

        if (hero.value.rebirthPts >= 1e7)
          dimensionsPos.value[24].status = 1;

        if (hero.value.bhTier >= 4)
          dimensionsPos.value[25].status = 1;
      }
    }
  };

  const potentialHandler = () => {
    hero.value.potential =
      (hero.value.rebirthPts >= 3 ? 10 : 0) +
      (hero.value.rebirthPts >= 75 ? 10 : 0) +
      (hero.value.rebirthPts >= 250 ? 10 : 0) +
      (hero.value.rebirthPts >= 5000 ? 10 : 0) +
      (hero.value.rebirthPts >= 17500 ? 10 : 0) +
      (hero.value.rebirthPts >= 60000 ? 10 : 0) +
      radPerks[6].level +
      (hero.value.rebirthTier >= 30 ? hero.value.rebirthBonusesHandle[4].value : 0) +
      enemy.value.specialCreatures.inf1.loot +
      nodesHandler(18, ['base', 'inf']) +
      infBonusesHandler(20, hero) +
      (hero.value.rebirthPts >= 5e5 ? 30 : 0) +
      getDimReward(10) +
      hero.value.eqUpsMult["spRing"].potential +
      enemy.value.specialCreatures.ddim7.loot;
  }

  const rebirthHandle = () => {
    potentialHandler();

    formUnlocked();
      
    if (hero.value.rebirthTierBonusesChance != hero.value.rebirthTier) {
      rebirthTierBonusesHandler();
      hero.value.rebirthTierBonusesChance = hero.value.rebirthTier;
    }

    rebirthPtsHandle();
    rebirthEnemyHandle();
    rebirthAutoHandle();
  };

  const formUnlocked = () => {
    if (hero.value.rebirthPts >= 100)
      hero.value.formationTypes[0].status = true;

    if (hero.value.rebirthPts >= 1500)
      hero.value.formationTypes[1].status = true;

    if (hero.value.rebirthPts >= 35000)
      hero.value.formationTypes[2].status = true;

    if (hero.value.rebirthPts >= 80000)
      hero.value.formationTypes[3].status = true;
  }


  const getRPonReset = () => {
    if (hero.value.rebirthPts >= 1.5e6) return hero.value.rebirthPts;

    let bonus = (hero.value.infExpansions.rebirth? 1e3: 0)
    let rp = (hero.value.singularity < 8? bonus: 1e5 + Math.log(hero.value.singularityKills + 3) ** 7.26);

    return rp;
  }

  const getRebirthTierOnReset = () => {
    let bonus = (hero.value.infExpansions.rebirth? 10: 0);

    return bonus;
  }

  const rebirthAutoHandle = () => {
    if(hero.value.selectedDivSkills.includes(5)){
      hero.value.rebirthTier = calculateRebirthTier(hero.value.level, 0)
    }
  }


  const rebirthEnemyHandle = () => {
    if (hero.value.rebirthTier) {
      let dmg = 1.02 ** hero.value.rebirthTier;
      let hp = 1.04 ** hero.value.rebirthTier;
      let drop = (dmg + hp) ** 0.75 * (1 + hero.value.rebirthTier * 0.01);

      drop = drop > 4 ? 4 + Math.sqrt(drop - 4) : drop;
      drop *= (hero.value.rebirthTier >= 90? hero.value.rebirthBonusesHandle[10].value: 1);

      enemy.value.rebirthEnemy["drop"] = drop;
    } else {
      enemy.value.rebirthEnemy["drop"] = 1;
    }
  };

  const rebirthTierBonusesHandler = () => {
    let r = hero.value.rebirthBonusesHandle;
    let t = hero.value.rebirthTier;

    r[0].value = Math.max(1 / (1.025 ** t * r[11].value), 0.01);

    r[1].value = 1 + 0.05 * t * r[11].value;

    r[2].value = 1;


    let tr = Math.floor(t / 25);      
    let b = 0.01 * tr + 0.01 * (tr * (tr + 1)) / 2;
    r[3].value = (1.01 + b) ** t * r[11].value;

    r[4].value = 0.75 * t * r[11].value;

    r[5].value = 0.5 * t * r[11].value
    
    r[6].value = 1.05 ** t * r[11].value;

    r[7].value = 1.5 + 0.005 * t * r[11].value;

    r[8].value = (1.02 ** Math.sqrt(t) - 1) * r[11].value;

    r[9].value = 0.01 * t * r[11].value;

    r[10].value = 1.01 ** t * r[11].value;

    r[11].value = 1 + 0.01 * Math.max(t - 100, 0);
  }

  function rebirthLootHandle() {
    let text = `Each Rebirth Tier increases Rebirth [Loot].
    Rebirth [Loot]: <strong>${fn(enemy.value.rebirthEnemy["drop"])}</strong>

    Rebirth [Loot] affects:
      - <span style="color: #4CAF50">EXP</span>
      - <span style="color:rgb(33, 243, 233)">Equipment Drop Chance</span>
      - <span style="color: #FF9800">5 Rebirth Pts</span>: <span style="color: lightgreen">Rebirth Pts</span> gain
      - <span style="color: #FF9800">20 Rebirth Pts</span>: <span style="color:rgb(189, 30, 233)">Soul</span> appearance
      - <span style="color: #FF9800">2500 Rebirth Pts</span>: Gain <span style="color:rgb(57, 125, 234)">Ascension Shards</span> when you Ascend
      - <span style="color: #FF9800">50000 Rebirth Pts</span>: <span style="color: orange">Skill EXP</span>
    `;
    
    return text;
  }

  const eventReq = () => {
    let dimsNotAllowed = ['c-noEq', 'c-noTree', 'c-ascension', 'c-radiation', 'c-noBuffs'];

    if (dimsNotAllowed.includes(hero.value.dId)) return true;

    return false;
  }

  function calculateRebirthTier(level, currentTier = 0) {
    if (!level) return 0;
    if (eventReq()) return 0;

    if ( currentTier >= 20 && !hero.value.infExpansions.rebirth) return 0;
  
    let tier = 0;
    let remainingLevel = level - 90;
  
    while (remainingLevel > 0) {
      let step;
      if (tier < 100) step = 10;
      else if (tier < 150) step = 50;
      else step = 200;
  
      if (remainingLevel >= step) {
        tier++;
        remainingLevel -= step;
      } else {
        break;
      }
    }

    if(!hero.value.infExpansions.rebirth)
      return Math.min(tier - currentTier, 1);
  
    return tier - currentTier;
  }


  const effectsActivated = () => {
    const cards = [];
    
    cards.push('T');
    cards.push('L');
    cards.push('P');
    cards.push('F');

    if(!hero.value.infExpansions.rebirth)
      cards.push('S');
      
    if(hero.value.rebirthTier >= 100 && hero.value.rebirthTier < 150)
      cards.push('C');

    if(hero.value.rebirthTier >= 150)
      cards.push('A');

    return cards;
  }

  
  const activeSelect = () => {
    
  }

  const clickEffects = (key) => {
    if(key == 'P')
      hero.value.eLink = { set: 'Info', info: 'Stats', stat: 'Potential' }

    if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Rebirth' }
  }

  const effectsHandler = (id) => {
    switch (id) {
      
      case 'T': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#9ff5b0">' +
          '<strong style="color:#c8fdd3">Rebirth Tier</strong><br>' +
          'Starting from Level 100, each 10 levels may grant you a Rebirth Tier when you perform Rebirth.<br>' +
          '<b>Min level affects to Rebirth Tier receive.</b>' +
          '</span>'
        );
      }

      case 'L': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #9ff5b0">' +
          '<strong style="color:#c8fdd3">Loot</strong><br>' +
          (rebirthLootHandle()) +
          '</span>'
        );
      }
  
      case 'P': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #9ff5b0">' +
          '<strong style="color: gold;">Potential [' + (Math.floor(hero.value.potential)) + ']</strong><br>' +
          'Inrease stats when you level up.<br>' +
          '<strong><span style="color: lightgreen">+0.5 HP per 10 Potential</span></strong><br>' +
          '<strong><span style="color: #eb4e4e">+0.2 DMG per 20 Potential</span></strong><br>' +
          '<strong><span style="color: orange">+0.1 DEF per 30 Potential</span></strong><br>' +
          'Click to see more info about Potential' +
          '</span>'
        );
      }
  
      case 'F': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #63fbaf">' +
          '<strong style="color: #00ff80;">Rebirth Features</strong><br>' +
          'Reach certain Rebirth Tier to unlock new features. These features depends on Rebirth Tier and may increase its abilities.' +
          '</span>'
        );
      }
  
      case 'S': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#eb5656;">' +
          '<strong style="color:#ff0e0e;">Rebirth Suppression</strong><br>' +
          'Rebirth Suppression limits your Max Level. Each Rebirth Tier increases this limit by <strong>+10</strong>.<br>' +
          'The Rebirth Tier Cap is <strong>20</strong>.' +
          '</span>'
        );
      }

      case 'C': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #c36fd7;">' +
          '<strong style="color: #d931ec;">Rebirth [Collaplse]</strong><br>' +
          'After Rebirth [T100] you need 50 levels to reach next Tier<br>' +
          '</span>'
        );
      }

      case 'A': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #c36fd7;">' +
          '<strong style="color: #d931ec;">Rebirth [Annihilation]</strong><br>' +
          'After Rebirth [T150] you need 200 levels to reach next Tier<br>' +
          '</span>'
        );
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
    rebirthPtsHandle,
    rebirthHandle,
    rebirthEnemyHandle,
    effectsActivated,
    activeSelect,
    clickEffects,
    effectsHandler,
    getRPonReset,
    getRebirthTierOnReset,
    calculateRebirthTier
  };
}
