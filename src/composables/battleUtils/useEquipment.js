import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { useBuff } from "../../data/buffs.js";
import { dimensions } from "../../data/dimensions.js";
import { spaceShop } from "../../data/spaceShop.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { divineSkills } from "../../data/quasarCore.js";

import { addLog } from "../logService.js";

import { useTrees } from "./useTree.js";
import { useAscensions } from "./useAscension.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { useDimensions } from "./useDimensions.js";

import { fn } from "../utils/global.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useProgressions } from "./useProgression.js";
import { useAbysses } from "./useAbyss.js";
import { useInfinity } from "./useInfinity.js";
import { useVoid } from "./dims/useVoid.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { useBaseEnemy } from "../utils/enemySetup.js";

export const useEquipments = () => {
  const { hero } = useHero();
  const { enemy } = useEnemy();
  const { buffs } = useBuff();
  const { player } = usePlayer();
  const { villian } = useBaseEnemy();

  const { nodesHandler } = useTrees();
  const { perksHandler } = useAscensions();
  const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
  const { killsLootHandle } = useProgressions();
  const { corrInflueceHandle, abyssHandler } = useAbysses();
  const { voidEffects } = useVoid();

  const weaponDrop = () => {
    if (hero.value.maxStage > 1) {
      var totalDrop =
        (player.value.status.traveler.eq) * 
        (1 + 0.75 * hero.value.soulTier) *
        killsLootHandle() *
        (villian.value.spawnType == "boss" ? enemy.value.boss.drop : 1) *
        (villian.value.spawnType == "soul" ? enemy.value.soulBuff.drop * hero.value.soulOverkill : 1) *
         enemy.value.rebirthEnemy["drop"] *
        player.value.formationStats.loot *
        (hero.value.spCount >= 10 ? 1 + 0.1 * hero.value.sp : 1) *
        perksHandler(34) *
        perksHandler(55) *
        (hero.value.rebirthTier >= 50 ? hero.value.rebirthBonusesHandle[7].value: 1) *
        infBonusesHandler(4, hero) *
        nodesHandler(15, ["base", "inf"]) *
        (hero.value.cursesChances[3].status ? 2 : 1) *
        (hero.value.selectedDivSkills.includes(7) ? divineSkills.value[7].values[1] : 1) *
        player.value.status.conquer.loot * 
        getDimReward(36).eq * 
        (getDimSpecialReward(48)? getDimReward(48): 1) *
        corrInflueceHandle(12) * 
        player.value.status.critMls.loot *
        hero.value.voidTreeStats.eq_drop_1 *
        
        (hero.value.timePenalty? 0: 1);

      totalDrop **= cursed[17].loot;
      totalDrop /= voidEffects(1);

      hero.value.eqTotalDrop = totalDrop;

      let penalty = 1 / (8 ** Math.max(hero.value.equipmentTiers["sword"] - 49, 0));


      hero.value.eqDropChances["sword"] = 20 * 
      (0.2 + 0.025 * hero.value.awakened["sword"]) ** hero.value.eqDrop["sword"] *
      Math.log(hero.value.stages.current + 1) ** 2 * penalty

      hero.value.dropChance["sword"] = Math.min(hero.value.eqDropChances["sword"] * totalDrop , 100);

      hero.value.dropChance["armor"] = Math.min(
        18 * (0.185 + 0.02 * hero.value.awakened["armor"]) ** hero.value.eqDrop["armor"] *
        Math.log(hero.value.stages.current + 1) ** 2.1 * totalDrop, 100);

      hero.value.dropChance["boots"] = Math.min(
        15 * (0.17 + 0.02 * hero.value.awakened["boots"]) ** hero.value.eqDrop["boots"] *
        Math.log(hero.value.stages.current + 1) ** 2.3 * totalDrop, 100);

      hero.value.dropChance["ring"] = Math.min(
        8 * (0.15 + 0.02 * hero.value.awakened["ring"]) ** hero.value.eqDrop["ring"] *
        Math.log(hero.value.stages.current + 1) ** 2.5 * totalDrop, 100);

      let count = 1 + (getDimSpecialReward(8)? 1: 0);

      if (Math.random() * 100 + hero.value.dropChance["sword"] >= 100 && 
         (hero.value.equipmentTiers["sword"] < hero.value.eqTierReq["sword"])) {

          hero.value.eqDrop["sword"] = Math.min(hero.value.eqDrop["sword"] + count, hero.value.eqTierReq["sword"]);

          addLog( `You dropped the <b style="color: gold">${getBaseEq('sword', hero.value.equipmentTiers["sword"]).name } [T${hero.value.equipmentTiers["sword"]}]</b>`, "Weapons");
        }

        if (Math.random() * 100 + hero.value.dropChance["armor"] >= 100 && 
          hero.value.equipmentTiers["armor"] < hero.value.eqTierReq["armor"]) {
          
          hero.value.eqDrop["armor"] = Math.min(hero.value.eqDrop["armor"] + count, hero.value.eqTierReq["armor"]);
          addLog(`You dropped the <b style="color: gold">${getBaseEq('armor', hero.value.equipmentTiers["armor"]).name} [T${hero.value.equipmentTiers["armor"]}]</b>`, "Weapons");
        }

        if (Math.random() * 100 + hero.value.dropChance["boots"] >= 100 && 
          hero.value.equipmentTiers["boots"] < hero.value.eqTierReq["boots"]) {

          hero.value.eqDrop["boots"] = Math.min(hero.value.eqDrop["boots"] + count, hero.value.eqTierReq["boots"]);
          addLog(`You dropped the <b style="color: gold">${getBaseEq('boots', hero.value.equipmentTiers["boots"]).name} [T${hero.value.equipmentTiers["boots"]}]</b>`,"Weapons");
        }

        if (Math.random() * 100 + hero.value.dropChance["ring"] >= 100 && 
          hero.value.equipmentTiers["ring"] < hero.value.eqTierReq["ring"]) {

          hero.value.eqDrop["ring"] = Math.min(hero.value.eqDrop["ring"] + count, hero.value.eqTierReq["ring"]);
          addLog(`You dropped the <b style="color: gold">${getBaseEq('ring', hero.value.equipmentTiers["ring"]).name} [T${hero.value.equipmentTiers["ring"]}]</b>`,"Weapons");
        }
      }
      
  };

  const getBaseEq = (type, tier) => {
    if (type == 'sword') {
      if (tier < 51)
        return equipment[0].tiers[tier];
      else {
        let extraTier = tier - 50;
  
        return {
          tier: tier,
          name: 'Dimension Destroyer [Ω-Y]',
          bonus: {
            cap: 800 + 25 * extraTier,
            multDmg: 7 + 0.1 * extraTier
          }
        }
      }

    } 
    

    if (type == 'armor') {
      if (tier < 23)
        return equipment[1].tiers[tier];
      else {
        let extraTier = tier - 22;
  
        return {
          tier: tier,
          name: 'Eternity Armor',
          bonus: {
            cap: 300 + 25 * extraTier,
            hp: 2.2 + 0.1 * extraTier
          }
        }
      }
    }

    if (type == 'boots') {
      if (tier < 23)
        return equipment[2].tiers[tier];
      else {
        let extraTier = tier - 22;
  
        return {
          tier: tier,
          name: 'Eternity Boots',
          bonus: {
            cap: 150 + 10 * extraTier,
            speed: 1.22 + 0.03 * extraTier
          }
        }
      }
    }

    if (type == 'ring') {
      if (tier < 23)
        return equipment[3].tiers[tier];
      else {
        let extraTier = tier - 22;
  
        return {
          tier: tier,
          name: 'Eternity Ring',
          bonus: {
            cap: 300 + 25 * extraTier,
            expMult: 10 + 0.3 * extraTier
          }
        }
      }
    }

    if (type == 'spRing') {
      return equipment[4].tiers[tier];
    }

  }

  const eqForgeHandle = () => {
    hero.value.totalEnhances =
      Math.min(
        hero.value.eqUps["sword"],
        hero.value.equipmentTiers["sword"] + hero.value.freeEnchances
      ) +
      Math.min(
        hero.value.eqUps["armor"],
        hero.value.equipmentTiers["armor"] + hero.value.freeEnchances
      ) +
      Math.min(
        hero.value.eqUps["boots"],
        hero.value.equipmentTiers["boots"] + hero.value.freeEnchances
      ) +
      Math.min(
        hero.value.eqUps["ring"],
        hero.value.equipmentTiers["ring"] + hero.value.freeEnchances
      ) +
      hero.value.eqUps["spRing"];
    
    let ft = 50 + 1.1 ** Math.sqrt(hero.value.totalEnhances);
    hero.value.forgeTierReq = Math.floor(Math.max(ft - spaceShopHandler(3, hero), 20));

    hero.value.forgeTier = Math.floor(
      hero.value.totalEnhances / hero.value.forgeTierReq
    );

    //sword
    let { cap: baseCap, bonus: baseBonus } = getBaseValues(
      "sword",
      hero.value.awakened,
      hero.value.forgeTier
    );

    const cond = (hero.value.isSingularity && hero.value.singularity < 6? true: false);

    let eqUpsSwordCap = Math.min( hero.value.eqUps["sword"],
      hero.value.equipmentTiers["sword"] + hero.value.freeEnchances) * 
      corrInflueceHandle(7);

    hero.value.eqUpsMult["sword"].cap = (cond? 0: 1) *
      getBaseEq('sword', hero.value.equipmentTiers["sword"]).bonus.cap * (baseCap * eqUpsSwordCap)
    hero.value.eqUpsMult["sword"].bonus = (cond? 0: 1) *
      getBaseEq('sword', hero.value.equipmentTiers["sword"]).bonus.multDmg * (baseBonus * eqUpsSwordCap);
        
    hero.value.eqUpsMult["sword"].crit =
      hero.value.spbCount >= 3 && !cond? 5 + 5 * (baseCap * eqUpsSwordCap): 0;

    hero.value.eqUpsMult["sword"].critDmg =
      hero.value.spbCount >= 3 && !cond? 0.5 + 0.5 * (baseCap * eqUpsSwordCap): 0;

    //armor
    ({ cap: baseCap, bonus: baseBonus } = getBaseValues(
      "armor",
      hero.value.awakened,
      hero.value.forgeTier
    ));

    let eqUpsArmorCap = Math.min( hero.value.eqUps["armor"],
      hero.value.equipmentTiers["armor"] + hero.value.freeEnchances) * 
      corrInflueceHandle(7);

    hero.value.eqUpsMult["armor"].cap = (cond? 0: 1) *
      getBaseEq('armor', hero.value.equipmentTiers["armor"]).bonus.cap * (baseCap * eqUpsArmorCap);

    hero.value.eqUpsMult["armor"].bonus = (cond? 0: 1) *
      getBaseEq('armor', hero.value.equipmentTiers["armor"]).bonus.hp * (baseBonus * eqUpsArmorCap);

    hero.value.eqUpsMult["armor"].def =
      hero.value.spbCount >= 6 && !cond? 100 + 100 * (baseCap * eqUpsArmorCap): 0;

    hero.value.eqUpsMult["armor"].heal =
      hero.value.spbCount >= 6 && !cond? 1 + 0.1 * (baseCap * eqUpsArmorCap): 1;

    //boots
    ({ cap: baseCap, bonus: baseBonus } = getBaseValues(
      "boots",
      hero.value.awakened,
      hero.value.forgeTier
    ));

    let eqUpsBootsCap = Math.min(hero.value.eqUps["boots"],
      hero.value.equipmentTiers["boots"] + hero.value.freeEnchances) * 
      corrInflueceHandle(7);

    hero.value.eqUpsMult["boots"].cap = (cond? 0: 1) *
      getBaseEq('boots', hero.value.equipmentTiers["boots"]).bonus.cap * (baseCap * eqUpsBootsCap);

    hero.value.eqUpsMult["boots"].bonus = (cond? 0: 1) *
      getBaseEq('boots', hero.value.equipmentTiers["boots"]).bonus.speed * (baseBonus * eqUpsBootsCap);

    hero.value.eqUpsMult["boots"].stage =
      hero.value.spbCount >= 7 && !cond? 0.01 + 0.01 * Math.floor(eqUpsBootsCap / 10 ) : 0;

    hero.value.eqUpsMult["boots"].overkill =
      hero.value.spbCount >= 7 && !cond? 1 +  Math.floor(((1 + baseCap) * eqUpsBootsCap) / 3 ) : 0;

    //ring
    ({ cap: baseCap, bonus: baseBonus } = getBaseValues(
      "ring",
      hero.value.awakened,
      hero.value.forgeTier
    ));

    let eqUpsRingCap = Math.min( hero.value.eqUps["ring"],
      hero.value.equipmentTiers["ring"] + hero.value.freeEnchances) * 
      corrInflueceHandle(7);

    hero.value.eqUpsMult["ring"].cap = (cond? 0: 1) *
      getBaseEq('ring', hero.value.equipmentTiers["ring"]).bonus.cap * (baseCap * eqUpsRingCap);

    hero.value.eqUpsMult["ring"].bonus = (cond? 0: 1) *
      getBaseEq('ring', hero.value.equipmentTiers["ring"]).bonus.expMult * (baseBonus * eqUpsRingCap);

    hero.value.eqUpsMult["ring"].level =
      hero.value.spbCount >= 8 && !cond? 1 / (1 + baseCap) ** (baseCap * eqUpsRingCap): 1;

    hero.value.eqUpsMult["ring"].multLevel =
      hero.value.spbCount >= 8 && !cond? 0.01 * eqUpsRingCap : 0;

    //spRing
    let penalty = corrInflueceHandle(7);

    hero.value.eqUpsMult["spRing"].cap = (cond? 0: 1) *
      equipment[4].tiers[hero.value.equipmentTiers["spRing"]].bonus.cap * (0.1 * hero.value.eqUps["spRing"]) * penalty;
    hero.value.eqUpsMult["spRing"].bonus = (cond? 0: 1) * 
    Math.floor(
      equipment[4].tiers[hero.value.equipmentTiers["spRing"]].bonus.minLevel * (0.05 * hero.value.eqUps["spRing"])) * penalty;

    hero.value.eqUpsMult["spRing"].potential = (cond? 0: 1) * Math.floor(spaceShopHandler(10, hero) ** 0.6) * penalty;
    hero.value.eqUpsMult["spRing"].infPoints = (cond? 0: 1) * spaceShopHandler(10, hero) * penalty;

    function getBaseValues(type, awakened, forgeTier) {
      return {
        cap: 0.1 + 0.0035 * awakened[type] + 0.001 * forgeTier,
        bonus: 0.05 + 0.0015 * awakened[type] + 0.0005 * forgeTier,
      };
    }
  };

  const eqUpsCapHandle = () => {
    hero.value.eqUps["sword"] = Math.min(hero.value.eqUps["sword"], hero.value.equipmentTiers["sword"] + hero.value.freeEnchances);
    hero.value.eqUps["armor"] = Math.min(hero.value.eqUps["armor"], hero.value.equipmentTiers["armor"] + hero.value.freeEnchances);
    hero.value.eqUps["boots"] = Math.min(hero.value.eqUps["boots"], hero.value.equipmentTiers["boots"] + hero.value.freeEnchances);
    hero.value.eqUps["ring"] = Math.min(hero.value.eqUps["ring"], hero.value.equipmentTiers["ring"] + hero.value.freeEnchances);
  }

  const awakenUpdate = () => {
    hero.value.awakenedReq["sword"] = eqAwakenTierReq(
      hero.value.awakened["sword"]
    );
    hero.value.awakenedReq["armor"] = eqAwakenTierReq(
      hero.value.awakened["armor"]
    );
    hero.value.awakenedReq["boots"] = eqAwakenTierReq(
      hero.value.awakened["boots"]
    );
    hero.value.awakenedReq["ring"] = eqAwakenTierReq(
      hero.value.awakened["ring"]
    );
  };

  const eqAwakenTierReq = (tier) => {
    let totalTier =
      20 +
      15 * tier -
      (hero.value.spCount >= 35 ? 1 : 0) -
      (hero.value.spCount >= 46 ? 2 : 0) -
      perksHandler(44) -
      spaceShopHandler(7, hero) -
      abyssHandler(12) - 
      infBonusesHandler(39, hero);

    return totalTier;
  };

  const awakened = (type) => {
    hero.value.awakened[type]++;
    hero.value.awakenedReq[type] = eqAwakenTierReq(hero.value.awakened[type]);
  };

  const awakenedTierReq = (type) => {
    return hero.value.equipmentTiers[type] >= hero.value.awakenedReq[type];
  };

  const awakenedCostScales = (type) => {
    if (type == "spRing") return 1;

    let base = 5;
    let cost = base ** hero.value.awakened[type];

    return 1 / cost;
  };

  const eqTierHandle = () => {

    if (hero.value.dId == "d-noEq" || hero.value.darkId.includes("d-noEq")) {
      let min = (hero.value.dId? 1: 0);
      min = (hero.value.darkId.includes("d-noEq")? getDimReward(36).min: min);

      hero.value.eqTierReq["sword"] = min;
      hero.value.eqTierReq["armor"] = min;
      hero.value.eqTierReq["boots"] = min;
      hero.value.eqTierReq["ring"] = min;
    }

    if (eventReq()) {
      hero.value.equipmentTiers["sword"] = 0;
      hero.value.equipmentTiers["armor"] = 0;
      hero.value.equipmentTiers["boots"] = 0;
      hero.value.equipmentTiers["ring"] = 0;

      hero.value.eqTierReq["sword"] = 0;
      hero.value.eqTierReq["armor"] = 0;
      hero.value.eqTierReq["boots"] = 0;
      hero.value.eqTierReq["ring"] = 0;
    }

    hero.value.equipmentTiers["sword"] = Math.min(
      hero.value.eqDrop["sword"] + hero.value.eqMin["sword"],
      hero.value.eqTierReq["sword"]
    );
    hero.value.equipmentTiers["armor"] = Math.min(
      hero.value.eqDrop["armor"] + hero.value.eqMin["armor"],
      hero.value.eqTierReq["armor"]
    );
    hero.value.equipmentTiers["boots"] = Math.min(
      hero.value.eqDrop["boots"] + hero.value.eqMin["boots"],
      hero.value.eqTierReq["boots"]
    );
    hero.value.equipmentTiers["ring"] = Math.min(
      hero.value.eqDrop["ring"] + hero.value.eqMin["ring"],
      hero.value.eqTierReq["ring"]
    );

  };

  const eqCpmplect = () => {
    let eq =
      (hero.value.rebirthPts >= 25
        ? hero.value.equipmentTiers["sword"] >= 3 &&
          hero.value.equipmentTiers["armor"] >= 3 &&
          hero.value.equipmentTiers["boots"] >= 3
          ? 3
          : 0
        : 0) +
      (hero.value.rebirthPts >= 200
        ? hero.value.equipmentTiers["sword"] >= 4 &&
          hero.value.equipmentTiers["armor"] >= 4 &&
          hero.value.equipmentTiers["boots"] >= 4 &&
          hero.value.equipmentTiers["ring"] >= 4
          ? 4
          : 0
        : 0) +
      (hero.value.rebirthPts >= 4000
        ? hero.value.equipmentTiers["sword"] >= 5 &&
          hero.value.equipmentTiers["armor"] >= 5 &&
          hero.value.equipmentTiers["boots"] >= 5 &&
          hero.value.equipmentTiers["ring"] >= 5
          ? 5
          : 0
        : 0);

    return eq;
  };

  const eqMin = () => {
    let total = (hero.value.spCount >= 47 ? 1 : 0) + spaceShopHandler(8, hero);

    hero.value.eqMin["sword"] =
      0 + perksHandler(10) + Math.floor(hero.value.spbCount) + total;

    hero.value.eqMin["armor"] = 0 + perksHandler(11) + total;

    hero.value.eqMin["boots"] = 0 + perksHandler(12) + total;

    hero.value.eqMin["ring"] =
      0 + (perksHandler(13) && perksHandler(5) ? 1 : 0) + total;
  };

  const eqStatsHandle = () => {
    if (hero.value.maxStage < 2 && !hero.value.isSingularity) return;

    let total = 3 + 
    (hero.value.rebirthPts >= 15 ? 1 : 0) +
    (hero.value.spCount >= 3 ? 1 : 0) +
    (hero.value.spCount >= 26 ? 1 : 0) +
    getDimReward(8);

    hero.value.eqTierReq["sword"] =
      total +
      perksHandler(1) +
      hero.value.eqMin["sword"] +
      (hero.value.spbCount >= 4? 1000: 0);

    hero.value.eqTierReq["armor"] =
      total +
      perksHandler(2) +
      hero.value.eqMin["armor"];

    hero.value.eqTierReq["boots"] =
      total +
      perksHandler(3) +
      hero.value.eqMin["boots"];

    if (perksHandler(5)) {
      hero.value.eqTierReq["ring"] =
        total +
        perksHandler(4) +
        hero.value.eqMin["ring"];
    } else hero.value.eqTierReq["ring"] = 0;

    eqMin();
    eqTierHandle();

    hero.value.multEnchance =
      (hero.value.spCount >= 28 ? 5 * Math.floor(hero.value.spbCount) : 0) +
      perksHandler(44) +
      getDimReward(36).en +
      spaceShopHandler(5, hero);

    if (hero.value.isSingularity && hero.value.singularity >= 6)
      hero.value.freeEnchances = 0;
    else
      hero.value.freeEnchances =
        0 +
        (hero.value.spCount >= 25 ? 3 : 0) +
        perksHandler(43) +
        (hero.value.singularity >= 7 ? hero.value.singularity : 0) +
        perksHandler(52) + 
        perksHandler(63);

    eqForgeHandle();
    awakenUpdate();
    //eqUpsCapHandle();

    hero.value.totalStats.spEnhances = Math.max(hero.value.totalStats.spEnhances, 
      hero.value.eqUps['spRing']);
  };

  const eventReq = () => {
    let dimsNotAllowed = ['noEq', 'c-noTree', 'c-noSpace', 'c-ascension', 'c-radiation', 'c-noBuffs'];

    if ((hero.value.isSingularity && hero.value.singularity >= 6) || dimsNotAllowed.includes(hero.value.dId)) return true;

    return false;
  }

  const autoForgeAll = () => {
    if (!hero.value.isAutoForge || hero.value.maxStage < 2) return;
    if ( eventReq()) return;


    const weapons = ["sword", "armor", "boots", "ring", "spRing"];

    for (let type of weapons) {
      let totalUps =
        type === "spRing"? 10000:  hero.value.equipmentTiers[type] + hero.value.freeEnchances;

      if (!forgeReq(type)) continue;

      if (hero.value.eqUps[type] < totalUps) {
        const cost = eqUpCost(type);
        if (hero.value.stardust < cost) continue;

        hero.value.stardust -= cost;
        hero.value.eqUps[type]++;
      }
    }
  };

  function eqUpCost(type) {
    let dark_d_penalty = getDimEffect(36).cost;

    let power = 1 + 0.025 * hero.value.eqUps[type] -
    (hero.value.spCount >= 37 ? 0.06 * (hero.value.spbCount) : 0);

    power = (type == "spRing"? power / 4 + Math.floor(hero.value.eqUps[type] / 100) - spaceShopHandler(2, hero) : power) ;

    power = Math.max(power, 1);

    let weaponPenalty = type !== "spRing" ? Math.E ** (hero.value.eqUps[type] / 2.5) : 1;

    let result =
      ((hero.value.eqUps[type] + 1) * 10 * weaponPenalty) ** power *
      dark_d_penalty *
      awakenedCostScales(type) * 
      (1 + perksHandler(63)) ** 2 *
      voidEffects(2) * 
      infBonusesHandler(40, hero);

    return Math.max(result, 10);
  }

  const forgeReq = (type) => {
    switch (type) {
      case "sword":
        return hero.value.spCount >= 1;
      case "armor":
        return hero.value.spCount >= 7;
      case "boots":
        return hero.value.spCount >= 11;
      case "ring":
        return hero.value.spCount >= 21;
      case "spRing":
        return hero.value.spCount >= 12;
      default:
        return false;
    }
  };

  const forgeUpgrade = (selectedType) => {
    const totalUps =
      hero.value.equipmentTiers[selectedType] + hero.value.freeEnchances;

    if (eqUpCost(selectedType) > hero.value.stardust) return;

    if (
      hero.value.eqUps[selectedType] < totalUps ||
      selectedType == "spRing"
    ) {
      hero.value.stardust -= eqUpCost(selectedType);
      hero.value.eqUps[selectedType] += 1;
    }
  };

  const maxEnchance = (selectedType) => {
    let totalUps;

    if(selectedType == "spRing")
      totalUps = 10000;
    else
      totalUps = hero.value.equipmentTiers[selectedType] + hero.value.freeEnchances;

    while (true) {
      const currentUps = hero.value.eqUps[selectedType];
      const cost = eqUpCost(selectedType);

      if (hero.value.stardust < cost) break;
      if (currentUps >= totalUps) break;

      hero.value.stardust -= cost;
      hero.value.eqUps[selectedType] += 1
    }
  };

  const getEqBase = (type) => {
    switch (type) {
      case "sword": 
        return getBaseEq('sword', Math.max(hero.value.equipmentTiers.sword, 0))
          .bonus.multDmg;
      case "armor":
        return getBaseEq('armor', Math.max(hero.value.equipmentTiers.armor, 0))
          .bonus.hp;
      case "boots":
        return getBaseEq('boots', Math.max(hero.value.equipmentTiers.boots, 0))
          .bonus.speed;
      case "ring":
        return getBaseEq('ring', Math.max(hero.value.equipmentTiers.ring, 0))
          .bonus.expMult;
    }
  };

  const getEqUps = (type) => {
    switch (type) {
      case "sword":
        return hero.value.eqUpsMult["sword"].bonus;
      case "armor":
        return hero.value.eqUpsMult["armor"].bonus;
      case "boots":
        return hero.value.eqUpsMult["boots"].bonus;
      case "ring":
        return hero.value.eqUpsMult["ring"].bonus;
    }
  };

  const getEqTotal = (type) => {
    return getEqBase(type) + getEqUps(type);
  };

  const getForgeTooltipText = (type) => {
    const total = hero.value.totalEnhances || 0;
    const tier = (hero.value.forgeTier || 0) + 1;
    const req = hero.value.forgeTierReq || 50;
    const target = tier * req;
    const forgeBonusPercent = type == "spRing" ? 0 : (tier - 1) * 1;
    let awakenedBonus = 0;

    let text = `Enhances: ${total}/${target}
    Enhancement Power [Forge Tier]: <span style="color: gold">${forgeBonusPercent.toFixed(
      2
    )}%</span>`;

    if (type) {
      const awakenedTier = (hero.value.awakened[type] || 0) + 1;
      const minVal = 0.0035;
      const maxVal = 0.1;
      const current = minVal * awakenedTier;

      awakenedBonus = Math.max(
        0,
        Math.min(100, ((current - minVal) / (maxVal - minVal)) * 100)
      );

      text += `\nEnhancement Power [Awaken]: <span style="color: gold">${awakenedBonus.toFixed(
        2
      )}%</span>`;
    }

    const totalBonus = awakenedBonus + forgeBonusPercent;

    text += `
   Total Enhancement Bonus: <span style="color: gold">[${totalBonus.toFixed(
     2
   )}%]</span><br>
   - Base Modifier (BM): Each Enhance increases this modifier’s power by <span style="color: gold">[${
     (10 + 10 * totalBonus * 0.01).toFixed(2)
   }%]</span>.<br>
   - Additional Modifier (AM):Each Enhance increases this modifier’s power by <span style="color: gold">[${
     (5 + 5 * totalBonus * 0.01).toFixed(2)
   }%]</span><br>
   - Suffix and Prefix (S&P): Each Enhance increases these modifier’s power by <span style="color: gold">[${
     (10 + 10 * totalBonus * 0.01).toFixed(2)
   }%]</span>`;

    return text;
  };

  const getItemStats = (item) => {
    const stats = [
      `BM: +${fn(
        item.bonusDisplay + Math.floor(hero.value.eqUpsMult[item.type].cap)
      )} Max Level`,
      `AM: +${fn(item.ownProperty + hero.value.eqUpsMult[item.type].bonus)} ${
        item.stat
      }`,

      // Sword S/P
      ...(hero.value.spbCount >= 3 && item.type === "sword"
        ? [
            `S: +${fn(hero.value.eqUpsMult.sword.crit)} CRIT`,
            `P: +${fn(hero.value.eqUpsMult.sword.critDmg)} CRIT DMG`,
          ]
        : []),

      // Armor S/P
      ...(hero.value.spbCount >= 6 && item.type === "armor"
        ? [
            `S: +${fn(hero.value.eqUpsMult.armor.def)} DEF`,
            `P: +${fn(hero.value.eqUpsMult.armor.heal)} HEALING EFFECT`,
          ]
        : []),

      // Boots S/P
      ...(hero.value.spbCount >= 7 && item.type === "boots"
        ? [
            `S: -${fn(
              hero.value.eqUpsMult.boots.stage
            )} Reduce stage requirement`,
            `P: +${fn(hero.value.eqUpsMult.boots.overkill)} Overkill`,
          ]
        : []),

      // Ring S/P
      ...(hero.value.spbCount >= 8 && item.type === "ring"
        ? [
            `S: *${fn(hero.value.eqUpsMult.ring.level)} Level requirement`,
            `P: +${fn(hero.value.eqUpsMult.ring.multLevel)} Max Level MULT`,
          ]
        : []),

      // Special Ring
      ...(spaceShop.value[10].status && item.type === "spRing"
        ? [
            `S: +${fn(hero.value.eqUpsMult.spRing.potential)} Potential`,
            `P: +${fn(hero.value.eqUpsMult.spRing.infPoints)} IP`,
          ]
        : []),
    ];

    return stats;
  };

  const getStatClass = (stat) => {
    const key = stat.split(":")[0].trim();
    if (key === "BM" || key === "AM") return "stat-bm-am";
    if (key === "S") return "stat-s";
    if (key === "P") return "stat-p";
    return "";
  };

  const awakenEnhacementPower = (type) => {
    const awakenedTier = hero.value.awakened[type] + 1 || 0;
    const minVal = 0.0035;
    const maxVal = 0.1;
    const current = minVal * awakenedTier;
    const next = minVal * (awakenedTier + 1);

    let awakenedBonus = Math.max(
      0,
      Math.min(100, ((current - minVal) / (maxVal - minVal)) * 100)
    );

    let awakenedBonusNext = Math.max(
      0,
      Math.min(100, ((next - minVal) / (maxVal - minVal)) * 100)
    );

    return `${fn(awakenedBonus)}% ➔ ${fn(awakenedBonusNext)}%`;
  };

  const awakenBaseDrop = (type) => {
    switch (type) {
      case "sword":
        return `${fn(0.2 + 0.025 * hero.value.awakened[type])} ➔ ${fn(
          0.2 + 0.025 * (hero.value.awakened[type] + 1)
        )}`;
      case "armor":
        return `${fn(0.185 + 0.02 * hero.value.awakened[type])} ➔ ${fn(
          0.185 + 0.02 * (hero.value.awakened[type] + 1)
        )}`;
      case "boots":
        return `${fn(0.17 + 0.02 * hero.value.awakened[type])} ➔ ${fn(
          0.17 + 0.02 * (hero.value.awakened[type] + 1)
        )}`;
      case "ring":
        return `${fn(0.15 + 0.02 * hero.value.awakened[type])} ➔ ${fn(
          0.15 + 0.02 * (hero.value.awakened[type] + 1)
        )}`;
    }
  };

  const awakenEnhacementCost = (type) => {
    let base = 5;
    let cost = base ** hero.value.awakened[type];
    let costNext = base ** (hero.value.awakened[type] + 1);

    return `${fn(cost)} ➔ ${fn(costNext)}`;
  };

  const getCost = (type) => {
    return fn(eqUpCost(type), true);
  };

  const getStardust = () => {
    return fn(hero.value.stardust);
  };

  const equipmentList = () => {
    const slots = ["sword", "armor", "boots", "ring"];

    return slots
      .filter((slot) => {
        if (slot === "ring") {
          const req = hero.value.eqTierReq?.ring ?? 0;
          return req > 0;
        }
        return true;
      })
      .map((slot) => {
        const tierReq = hero.value.eqTierReq?.[slot] ?? 0;

        const isLocked = slot === "sword" ? hero.value.spbCount >= 4 : false;

        return {
          name: slot.charAt(0).toUpperCase() + slot.slice(1),
          tier: (hero.value.equipmentTiers?.[slot] ?? 0) + 1,
          drop: (hero.value.dropChance?.[slot] ?? 0).toFixed(2),
          maxTier: isLocked ? "∞" : tierReq,
        };
      });
  };

  const getEqMaxLevel = () => {
    return getBaseEq('sword', hero.value.equipmentTiers['sword']).bonus.cap + 
    getBaseEq('armor', hero.value.equipmentTiers['armor']).bonus.cap +
    getBaseEq('boots', hero.value.equipmentTiers['boots']).bonus.cap +
    getBaseEq('ring', hero.value.equipmentTiers['ring']).bonus.cap +
    equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap;
  }

  const getEqEnhanceMaxLevel = () => {
    return hero.value.eqUpsMult['sword'].cap +
    hero.value.eqUpsMult['armor'].cap +
    hero.value.eqUpsMult['boots'].cap +
    hero.value.eqUpsMult['ring'].cap +
    hero.value.eqUpsMult['spRing'].cap
  }

  const setBonuses = () => [
    {
      req: 25,
      text: "(T3, T3, T3): +3 Min Level, +3 Max Level",
    },
    {
      req: 200,
      text: "(T4, T4, T4, T4): +4 Min Level, +4 Max Level",
    },
    {
      req: 4000,
      text: "(T5, T5, T5, T5): +5 Min Level, +5 Max Level",
    },
  ];

  const effectsActivated = () => {
    const cards = [];

    cards.push("W");
    cards.push("C");
    cards.push("D");

    if (hero.value.rebirthPts >= 25 || hero.value.mainInfTier > 0)
    cards.push("S");

    if (hero.value.spbCount >= 2) cards.push("R");
    if (hero.value.spCount >= 2) cards.push("E");

    if (hero.value.bhTier >= 2)
      cards.push('A');

    return cards;
  };

  const activeSelect = (key) => {
    if (key === 'A') return hero.value.isAutoForge;
  };

  const clickEffects = (key) => {
    if (key === 'A') hero.value.isAutoForge = !hero.value.isAutoForge;
    if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Equipment' }
  };

  const effectsHandler = (id) => {
    switch (id) {
      case "C": {
        let min = hero.value.eqMin["armor"];
        let max = hero.value.eqTierReq["armor"];
        return `<span style="font-size:0.95em; font-style:italic; color: #4de1f5;">
            <strong style="color: #0de3ff">Caps</strong><br>
            Max Cap - the highest tier you can obtain from killing enemies.<br>
            <strong>Max Cap: ${max}</strong><br>
            Min Cap - increases your minimum Equipment Tier (After any reset, you start with a higher Equipment Tier. The starting tier depends on your Min Cap). It also increases your Max Cap.<br>
            <strong>Min Cap: ${min}</strong><br>
            <span style="color: red">Note: </span>The current Min and Max cap values ​​for the sword may be different.
          </span>`.replace(/\n\s*/g, "");
      }

      case "R": {
        return `<span style="font-size:0.95em; font-style:italic; color: #ffeb7a;">
            <strong style="color: #ffe02f">Space Ring</strong><br>
            Cannot drop from enemies.<br>
            Has no enhance cap.<br>
            Cannot be awakened.
          </span>`.replace(/\n\s*/g, "");
      }

      case "W": {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#54e7b6;">' +
          '<strong style="color: #66ffcc">Weapons</strong><br>' +
          `Each Weapon has its own tier. Higher tiers provide better stats. <br>` +
          "Higher-tier weapon drops are rarer." +
          "Increase Equipment Drop Chance to improve the drop rate. " +
          "At higher stages, the Equipment Drop Chances also increases. " +
          "</span>"
        );
      }

      case "D": {
        const list = equipmentList()
          .map(
            (eq) =>
              "<span>" +
              '<span style="color: #9cc9ff; font-weight: 600;">' +
              eq.name +
              " [T" +
              eq.tier +
              "]" +
              "</span>: " +
              '<span style="color: #9cc9ff;">' +
              eq.drop +
              "%" +
              "</span>" +
              '<span style="color: #8bff9c"> | MAX: ' +
              eq.maxTier +
              "</span>" +
              "</span><br>"
          )
          .join("");

        return (
          '<span style="font-size:0.95em; font-style:italic; color: #9cc9ff;">' +
          '<span style="font-weight:600; color: #66ffcc">Equipment Drop Chance</span><br>' +
          list +
          "</span>"
        );
      }

      case "S": {
        const list = setBonuses()
          .map((set) => {
            if (hero.value.rebirthPts < set.req) {
              return (
                "<span>" +
                '<span style="color: #ff8080;">' +
                "Reach " +
                set.req +
                " Rebirth Pts" +
                "</span>" +
                "</span><br>"
              );
            }

            return (
              "<span>" +
              '<span style="color: #58ff4f; font-weight: 600;">' +
              set.text +
              "</span>" +
              "</span><br>"
            );
          })
          .join("");

        return (
          '<span style="font-size:0.95em; font-style:italic; color: #58ff4f;">' +
          '<span style="color: #66ffcc;"><strong>Set Bonuses</strong></span><br>' +
          list +
          "</span>"
        );
      }

      case "E": {
        return (
          '<span style="font-size:0.95em; font-style:italic; color: #ffeb7a;">' +
          '<span style="color: #ffe02f;"><strong>Enhances</strong></span><br>' +
          `Enhances increase weapon modifiers. The Max number of enhances is determined by your Weapon's current Tier and other sources.<br>` +
          `Additional Enhances: <b>${hero.value.freeEnchances}</b>` +
          "</span>"
        );
      }

      case 'A': {
        return (
          '<span style="font-size:0.95em; font-style:italic; color:#ffeb7a;">' +
          'Click to enable/disable AUTO purchase of ascension perks.<br>' +
          'Status: ' + (hero.value.isAutoForge? 'ON': 'OFF') + '<br>' +
          'Sourse: Black Hole [T2]' +
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
  };

  return {
    autoForgeAll,
    eqStatsHandle,
    eqCpmplect,
    eqForgeHandle,
    weaponDrop,
    awakened,
    awakenedTierReq,
    eqUpCost,
    effectsActivated,
    activeSelect,
    clickEffects,
    effectsHandler,
    awakenBaseDrop,
    awakenEnhacementPower,
    awakenEnhacementCost,
    getForgeTooltipText,
    getItemStats,
    getStatClass,
    forgeUpgrade,
    maxEnchance,
    getStardust,
    getCost,
    getEqTotal,
    getBaseEq,
    getEqBase,
    getEqUps,
    getEqEnhanceMaxLevel,
    getEqMaxLevel
  };
};
