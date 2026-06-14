// useSouls.js
import { computed } from 'vue'
import { perks } from '../../data/perks.js'
import { perks as ascenPerks } from '../../data/ascension.js'
import { perks as radPerks } from '../../data/radPerks.js'
import { cursed } from '../../data/cursed.js'
import { dimensions } from '../../data/dimensions.js'
import { divineSkills } from '../../data/quasarCore.js'
import { amulets } from '../../data/amulets.js'

import { useHero } from '../useHero.js'
import { useEnemy } from '../useEnemy.js'
import { useBuff } from '../../data/buffs.js'

import { useTrees } from "./useTree.js";
import { useAscensions } from './useAscension.js'
import { useAbysses } from './useAbyss.js'
import { useDimensions } from './useDimensions.js'
import { useBaseEnemy } from '../utils/enemySetup.js'
import { usePlayer } from '../utils/playerSetup.js'
import { useInfinity } from './useInfinity.js'
import { useVoid } from './dims/useVoid.js'
import { spaceShopHandler } from './global/spaceShopHandler.js'
import { infBonusesHandler } from './global/infBonusesHandler.js'

export const useSouls = () => {

  const { hero } = useHero();
  const { enemy } = useEnemy();
  const { buffs } = useBuff();
  const { villian } = useBaseEnemy();
  const { player } = usePlayer();
 
  const { nodesHandler } = useTrees();
  const { perksHandler } = useAscensions();
  const { abyssHandler } = useAbysses();
  const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
  const { voidEffects } = useVoid();

  const activeCurses = computed(() =>
    cursed.filter(c => c.status === true).length
  )

  const soulDActive = () => {
    return hero.value.infTier >= 6 &&
    !hero.value.isSingularity &&
    !hero.value.selectedDivSkills.includes(11) &&
    hero.value.souls < hero.value.soulsCap && 
    hero.value.dId != 'c-soulD'
  }

  const soulHandle = () => {
      hero.value.soulTier = Math.floor(hero.value.souls / 10);
      
      if(hero.value.selectedDivSkills.includes(11) || hero.value.selectedDivSkills.includes(6)){
        if(hero.value.soulD)
          hero.value.stages.current = hero.value.soulDStage;
        hero.value.soulD = false;
      }
      soulCapHandle();

      hero.value.soulD = (hero.value.souls >= hero.value.soulsCap? false: hero.value.soulD);
      soulPowerHandler();

      soulsAutoHandle();
    }
  
    const soulPowerHandler = () => {
      const soulPowerReq = [
        { tier: 0, req: 100 },
        { tier: 1, req: 250 },
        { tier: 2, req: 450 },
        { tier: 3, req: 700 },
        { tier: 4, req: 1250 },
        { tier: 5, req: 2000 },
        { tier: 6, req: 10000 },
      ];
    
      for (let i = 0; i < soulPowerReq.length; i++) {
        const s = soulPowerReq[i];
    
        if (hero.value.souls < s.req) {
          hero.value.soulPower.tier = s.tier;
          hero.value.soulPower.req = s.req;
          break;
        }
      }
  
      let sp = hero.value.soulPower.special;
      let b = hero.value.soulPower.base;
      let l = hero.value.soulPower.label;
      let tier = hero.value.soulPower.tier;
      let s = hero.value.souls;
      //dmg
      if(tier >= 0) {
        sp[0].base = (0.003 + 0.0005 * tier);
        sp[0].value = 1 + sp[0].base * s;
      }
      //crit
      if(tier >= 1) {
        sp[1].base = (0.015 + 0.001 * tier)
        sp[1].value = sp[1].base * s;
      }
      //crit dmg
      if(tier >= 2) {
        sp[2].base = (0.004 + 0.001 * tier);
        sp[2].value = sp[2].base * s;
      }
      //aps
      if(tier >= 3) {
        sp[3].base = (0.0001 + 0.0001 * tier);
        sp[3].value = sp[3].base * s;
      }
      //less dmg taken
      if(tier >= 4) {
        sp[4].base = (0.001 + 0.001 * tier);
        sp[4].value = Math.min(sp[4].base * s, 90);
      }
      //accuracy
      if(tier >= 5) {
        sp[5].base = (0.0002 + 0.0002 * tier);
        sp[5].value = sp[5].base * s;
      }
      //dodge
      if(tier >= 6) {
        sp[6].base = (0.0001 + 0.00015 * tier);
        sp[6].value = sp[6].base * s;
      }
      
      let totalBonus = (hero.value.selectedDivSkills.includes(11)? divineSkills.value[11].values[0]: 1);

      let ml = (getDimSpecialReward(14)? 2: 1) * totalBonus;
      b.maxLevel = Math.floor(s * ml);
      l.maxLevel = 1 * ml;

      let ex = (0.1 + (hero.value.soulTier >= 3? 0.05: 0)) * totalBonus;
      b.exp = 1 + ex * (hero.value.infExpansions.soul? Math.min(s, 80): Math.min(s, 40));
      l.exp = ex

      b.min = Math.floor((Math.floor(hero.value.soulsMax / 10) + perksHandler(50)) * totalBonus);
      l.minLevel = (1 + (perksHandler(50)? 0.5: 0)) * totalBonus;

      b.stardust = (hero.value.souls > 40? s ** 0.275 * totalBonus: 1);
      b.mutagen = (hero.value.souls > 40? s ** 0.145 * totalBonus: 1);
    };

    const soulsAutoHandle = () => {
      if (!hero.value.selectedDivSkills.includes(6)) return
      if (hero.value.dId === 'soulD' || hero.value.dId === 'c-soulD') return

      let kill = false;

      const weak = soulDWeakness();
      const base = baseWeakness();
      const totalHp = hero.value.soulStageHp * soulHp(weak, base).total * base;
  
      const attack = player.value.stats.final.atk * divineSkills.value[6].values[0]
      
      

      if (soulDActive()) {
        kill = attack > totalHp ** weak; 
      } else {
        if (Math.random() + soulChance() < 100) return;

        kill = attack > totalHp;
      }

      if (kill) {
        let temp = villian.value.spawnType;
        villian.value.spawnType = 'soul';
        soulKillHandle();
        villian.value.spawnType = temp;
      } 

      soulStats();
  
    }

  

  const soulsSpawn = () => { 
    if (hero.value.souls >= hero.value.soulsCap && hero.value.soulD) {
      dSoulLeave();
      return;
    }

    if (hero.value.selectedDivSkills.includes(6) && (hero.value.dId != 'soulD' || hero.value.dId != 'c-soulD')) return

    if (hero.value.dId == 'soulD') hero.value.soulD = true;

    const canSpawn =
      (hero.value.stages.current > 14 || hero.value.dId === 'soulD') &&
      villian.value.spawnType === 'none' &&
      hero.value.souls < hero.value.soulsCap

    enemy.value.soulBuff.chance = 0;
    if (!canSpawn) return

    enemy.value.soulBuff.chance = hero.value.soulD ? 100 : soulChance();

    const roll = Math.random() * 100 + enemy.value.soulBuff.chance

    if (hero.value.soulD || roll >= 100) {
      villian.value.spawnType = 'soul'
      villian.value.name = "SOUL";
    }
      
    soulStats()
  }

  const dSoulLeave = () => {
    hero.value.soulD = false;
    hero.value.stages.current = hero.value.soulDStage;
    hero.value.kills = 0;
  }

  const soulKillHandle = () => {
    if(villian.value.spawnType != 'soul') return;

    soulOverkill();
    hero.value.souls = Math.min(hero.value.souls + hero.value.soulOverkill, hero.value.soulsCap);
    hero.value.afkSoulBoost = 1;

    if (hero.value.dId == 'c-soulD')
      hero.value.cSoulsMax = Math.max(hero.value.souls, hero.value.cSoulsMax);
          
    hero.value.soulsMax = Math.max(hero.value.souls, hero.value.soulsMax);
  }

  const soulOverkill = () => {
    hero.value.soulOverkill = 1 +
    ((hero.value.rebirthPts >= 2e5 ? 1 : 0) +
    (hero.value.rebirthPts >= 6.5e5 ? 1 : 0)) *
    (hero.value.dId === "soulD" ? 0 : 1);
  }

  const soulCapHandle = () => {
    let cap = 20 + 10 * Math.min(hero.value.abyssTier, 2)

    cap = (radPerks[9].level || hero.value.dId == 'soulD'? 1e10: cap);
    
    hero.value.soulsCap = cap;
  }

  const soulTotalChance = () => {
    let chance = soulBaseChance() * 
    perksHandler(16) * 
    (1 + 0.35 * (hero.value.rebirthPts >= 1000? hero.value.rebirthTier: 0)) *
    (hero.value.rebirthPts >= 20? enemy.value.rebirthEnemy["drop"] * 2: 1) * 
    (player.value.status.traveler.soul) *
    (hero.value.abyssTier >= 1? (1 + 0.5 * activeCurses.value): 1) * 
    nodesHandler(13, 'base') * 
    (enemy.value.danger >= 10? enemy.value.specialCreatures.souls.chance: 1) * 
    (hero.value.afkSoulBoost) * 
    spaceShopHandler(15, hero) *
    (hero.value.selectedDivSkills.includes(17) ? divineSkills.value[17].values[0] : 1);
    hero.value.voidTreeStats.soul_app_1 /
    
    voidEffects(6);

    return chance
  }

  const soulChance = () => {
    return Math.min(Math.max(soulTotalChance(), 0), 100);
  }

  const soulBaseChance = () => {
    const s = hero.value.souls
    const stage = hero.value.stages.current

    const dx = 60 * ((0.43 + 0.0035 * Math.min(s, 40)) ** s)
    const dy =
      Math.max(
        Math.log(stage - 14) **
        Math.log(stage ** Math.pow(Math.log(stage - 12), 0.65) - 14),
        1
      )
    
    return dx * dy;
  }

  const soulDWeakness = () => {
    let v = 1.6 + getDimEffect(14) - getDimReward(14);

    return Math.max(v, 1.1)
  }

  const baseWeakness = () => {
    let base = 
    infBonusesHandler(11, hero) *
    abyssHandler(10) * 
    perksHandler(19)

    return base;
  }

  const soulHp = () => {
    let base = baseWeakness() * 
    (hero.value.selectedDivSkills.includes(17) ? divineSkills.value[17].values[1] : 1);
    
    let weak = soulDWeakness();

    const s = hero.value.souls

    const total = 1 + Math.pow( Math.log((s * 3 + 3) ** 0.4),
    (s * 3) ** (0.135 + 0.001 * Math.max(s - 40, 0)));

    let r = total ** (hero.value.soulD ? weak : 1);

    return {
      base: r,
      total: r * base
    }
  }

  const soulDmg = () => {
    let base = baseWeakness()

    let weak = soulDWeakness();
    const s = hero.value.souls

    const total = 1 + 
    Math.pow(Math.log((s * 3 + 3) ** 0.325), (s * 3.5) ** 0.25);
    
    let r = total * (hero.value.soulD ? weak ** 0.75 : 1) * 
    (s > 100? 1 + 0.01 * s: 1);

    return {
      base: r,
      total: r * base
    }
  }

  const soulLoot = () => {
    const s = hero.value.souls

    let r = (1 + Math.pow(Math.log((s * 2 + 3)), s ** 0.2) * perksHandler(20));

    if (hero.value.selectedDivSkills.includes(11))
      r *= divineSkills.value[11].values[0];

    if(hero.value.soulD)
      return 1;

    return r;
  }



  const soulStats = () => {
    const weak = soulDWeakness()
    const base = baseWeakness();

    enemy.value.soulBuff.dmg = soulDmg(weak, base).total
    enemy.value.soulBuff.hp = soulHp(weak, base).total
    enemy.value.soulBuff.drop = soulLoot();
  }

  const soulPowerTooltipHandle = () => {
    let text = `<h3 style="color:#e600ff; font-weight: 600; text-align: center;">Absorb Souls to gain power.</h3> <hr style="border: 0; border-top: 1px solid #9b6fff; margin: 0.2em 0;">`;
  
    if (hero.value.mainInfTier < 6) {
      text += `- <span style="color: #e6d7ff; font-weight: 600">Reach <span style="color: gold; font-weight: 600">Infinity [T6]</span> to get more info.</span>`;
    } 
  
    return text;
  }

  const effectsActivated = (tier) => {
    const cards = [];
    
    cards.push('A');
    cards.push('T');
    cards.push('B');
    cards.push('R');

    if (hero.value.infExpansions.soul)
      cards.push('S');

    return cards;
  }

  
  const activeSelect = (key) => {

  }

  const clickEffects = (key) => {
    if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Soul' }
  }

  const effectsHandler = (id) => {
    switch (id) {
  
      case 'T': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #a913ff">' +
          '<strong style="color: #a913ff;">Target</strong><br>' +
          'After stage 15, there\'s a chance that a soul will possess an enemy. These enemies become much stronger and drop significantly more loot. After killing such an enemy, the soul is absorbed, empowering you.<br>' +
          'The more souls you absorb, the stronger the next ones become.' +
          '</span>'
        );
      }
  
      case 'B': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #9db8ff;">' +
          '<strong style="color: #c7dcff;">Base</strong><br>' +
          'Receive bonuses based on the number of souls you absorb.' +
          '</span>'
        );
      }
  
      case 'S': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #e6d7ff;">' +
          '<strong style="color: #e6d7ff;">Special</strong><br>' +
          'Reach a certain number of absorbed souls to unlock the next tier of Soul Power<br>' +
          'Each tier unlocks new special bonuses and increases the base effect of existing bonuses<br>' +
          '</span>'
        );
      }
  
      case 'A': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #e01fe4;">' +
          '<strong style="color: #e01fe4;">Appearance</strong><br>' +
          'The chance of a soul appearing depends on the completed stage and other multipliers.<br>' +
          '</span>'
        );
      }

      case 'R': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #ff69b4;">' +
          '<strong style="color: #ff69b4;">Reward</strong><br>' +
          'Reach a certain Soul Tier to receive rewards.<br>' +
          'Increase your Soul Tier by absorbing 10 Souls.<br>' +
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
    soulsSpawn,
    soulKillHandle,
    soulStats,
    soulChance,
    soulDWeakness,
    baseWeakness,
    soulHandle,
    soulHp,
    soulDmg,
    soulDActive,
    soulPowerTooltipHandle,
    effectsActivated,
    activeSelect,
    clickEffects,
    effectsHandler,
    soulBaseChance,
    soulTotalChance
  }
}
