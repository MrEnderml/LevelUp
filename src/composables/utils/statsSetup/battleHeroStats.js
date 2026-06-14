import { infBonusesHandler } from "../../battleUtils/global/infBonusesHandler";
import { divineSkills } from "../../../data/quasarCore";

export function setupHeroBattleStats(stats, player, ctx) {
  const h = ctx.hero.value;
  const e = ctx.enemy.value;

  stats.addHook("additive", (final) => {
    const levelFactor =
      (2 + 0.5 * Math.floor(h.potential / 10)) *
      (
        Math.min(h.maxLevel, h.eLevel - 1) +
        h.minLevel *
          (ctx.dimensions.getDimSpecialReward(12) ? 2 : 1) +
        (h.eLevel > 700 && h.maxLevel > 700
          ? Math.min(h.eLevel, h.maxLevel) - 700
          : 0)
      )

    const levelMultiplier =
      (h.dId === "noStats" || h.dId === "d-noMinLevel" || h.dId === "c-noStats") ? 0 : 1

    h.levelFactor.hp = levelFactor * levelMultiplier

    final.hp += levelFactor * levelMultiplier;
  })

  stats.addHook("multiplicative", (final) => {
    let mult = 1

    mult *= ctx.eq.getEqTotal("armor");

    if (h.selectedDivSkills.includes(8))
      mult *= ctx.divineSkills.value[8].values[1]

    mult *= ctx.tree.nodesHandler(1, ["base", "inf"])

    mult *= infBonusesHandler(1, ctx.hero);

    if ((h.gravity.isTrial || h.isSingularity) && h.rebirthPts >= 6e5) 
      mult *= 2

    if (h.dims.veil.stacks > 0) mult *= 2

    mult /= ctx.dimensions.getDimEffect(28).stats;

    mult *= player.value.formationStats.hp;

    mult *= ctx.timeline.collectLawEffects(1).mult

    mult *= ctx.abyss.corrInflueceHandle(3);

    if (player.value.id == 'space')
      mult *= ctx.ascension.perksHandler(28)

    final.hp *= mult
  })

  stats.addHook("post", (final) => {
    if (h.dId === "survival") 
      final.hp = 1;

    player.value.stats.final.hp = final.hp;

    if(player.value.hp > player.value.stats.final.hp)
      player.value.hp = player.value.stats.final.hp;

  })


  stats.addHook("additive", (final) => {
    const base =
      (0.5 + 0.1 * Math.floor(h.potential / 30)) *
      (
        Math.min(h.maxLevel, h.eLevel - 1) +
        h.minLevel *
          (ctx.dimensions.getDimSpecialReward(12) ? 2 : 1) +
        (h.eLevel > 700 && h.maxLevel > 700
          ? Math.min(h.eLevel, h.maxLevel) - 700
          : 0)
      )

    const mult =
      (h.dId === "noStats" || h.dId === "d-noMinLevel" || h.dId === "c-noStats") ? 0 : 1

    h.levelFactor.def = base * mult

    final.def += base * mult + h.eqUpsMult.armor.def
  })

  stats.addHook("multiplicative", (final) => {
    let mult = 1

    if (h.selectedDivSkills.includes(8))
      mult *= ctx.divineSkills.value[8].values[1]

    mult *= ctx.tree.nodesHandler(2, ["base", "inf"])

    if (player.value.id == 'space')
      mult *= ctx.ascension.perksHandler(28)

    if ((h.gravity.isTrial || h.isSingularity) && h.rebirthPts >= 6e5) 
      mult *= 2

    if (h.dims.veil.stacks > 0) mult *= 2

    mult *= infBonusesHandler(2, ctx.hero);

    mult /= ctx.dimensions.getDimEffect(28).stats;

    mult *= player.value.formationStats.def;

    mult *= ctx.timeline.collectLawEffects(2).mult

    mult *= ctx.abyss.corrInflueceHandle(3);

    final.def *= mult
  })

  stats.addHook("post", (final) => {
    if(ctx.abyss.corrInflueceHandle(17))
      final.def = 0;
  })

  stats.addHook("additive", (final) => {
    let atk = (1 + 0.2 * Math.floor(h.potential / 20)) *
      ( Math.min(h.maxLevel, h.eLevel - 1) +
        (h.eLevel > 700 && h.maxLevel > 700
          ? Math.min(h.eLevel, h.maxLevel) - 700 : 0) +
        h.minLevel * (ctx.dimensions.getDimSpecialReward(12) ? 2 : 1)
      )
    
    if (h.dId === "noStats" || h.dId === "d-noMinLevel" || h.dId === "c-noStats") 
      atk = 0;

    h.levelFactor.atk = atk;

    final.atk += atk
  })

  
  stats.addHook("multiplicative", (final) => {
    let mult = 1
  
    if (h.selectedDivSkills.includes(8))
      mult *= ctx.divineSkills.value[8].values[1]
  
    mult *= ctx.tree.nodesHandler(0, ["inf", "base", "rad"])
  
    mult *= ctx.eq.getEqTotal("sword");
  
    mult *= infBonusesHandler(0, ctx.hero)
  
    mult *= ctx.dimensions.getDimEffect(2).dmg;
  
    if ((h.gravity.isTrial || h.isSingularity) && h.rebirthPts >= 6e5)
      mult *= 2
  
    if ((h.gravity.isTrial || h.isSingularity) && ctx.dimensions.getDimSpecialReward(10))
      mult *= 2
  
    mult *= ctx.ascension.perksHandler(48)
    mult *= ctx.ascension.perksHandler(67)

    if (player.value.id == 'space')
      mult *= ctx.ascension.perksHandler(28)

    if (player.value.id == 'space' && h.rebirthPts >= 4e5)
      mult *= 1.5;
  
    mult *= ctx.dimensions.getDimReward(20);
  
    // survival stage
    if (ctx.dimensions.getDimReward(21).req)
      mult *= ctx.dimensions.getDimReward(21).dmg;
  
    mult *= ctx.dimensions.getDimReward(28);
  
    // extra life
    if (h.dims.veil.stacks > 0)
      mult *= 2
  
    // black hole
    mult *= ctx.spStats.trHandle().atk;
  
    mult *= 1 + 0.01 * e.specialCreatures.ddim2.loot;
  
    mult /= ctx.dimensions.getDimEffect(28).dmg;
  
    mult *= player.value.formationStats.atk;
  
    mult *= ctx.divineSkills.value[3].values[0];

    mult *= ctx.timeline.collectLawEffects(0).mult

    mult *= (h.soulPower.tier >= 0 && h.infExpansions.soul? 
    h.soulPower.special[0].value: 1);
      
    mult *= ctx.abyss.corrInflueceHandle(3);

    mult *= ctx.sing.singShardsEffect(0);

    final.atk *= mult
  })

  stats.addHook("post", (final) => {
    if(ctx.abyss.corrInflueceHandle(18))
      final.atk = 0;
  })

  stats.addHook("additive", (final) => {
    let crit = 
      ctx.tree.nodesHandler(7, ['base', 'inf']) +
      (h.rebirthPts >= 150? 5: 0) + 
      (Math.floor(h.spCount/6) >= 3? h.eqUpsMult['sword'].crit: 0)  + 
      ctx.timeline.collectLawEffects(3).add +
      (h.soulPower.tier >= 1 && h.infExpansions.soul? h.soulPower.special[1].value: 0) -
      ctx.abyss.corrInflueceHandle(5).crit;
  
      final.crit += crit;
  })

  stats.addHook("post", (final) => {
    final.crit = Math.max(final.crit, 0);
  })

  stats.addHook("additive", (final) => {
    if(!ctx.dimensions.getDimSpecialReward(52)) return;

    let critatk = 0.001 *
      ( Math.min(h.maxLevel, h.eLevel - 1) +
      (h.eLevel > 700 && h.maxLevel > 700? Math.min(h.eLevel, h.maxLevel) - 700 : 0) +
      h.minLevel * (ctx.dimensions.getDimSpecialReward(12) ? 2 : 1))
    
    if (h.dId === "noStats" || h.dId === "d-noMinLevel" || h.dId === "c-noStats") 
      critatk = 0;

    h.levelFactor.critDmg = critatk;

    final.critDmg += critatk
  })

  stats.addHook("additive", (final) => {
    let critAttack = 
      ctx.tree.nodesHandler(8, ['base', 'inf']) +
      (Math.floor(h.spCount/6) >= 3? h.eqUpsMult['sword'].critDmg: 0) + 
      ctx.timeline.collectLawEffects(4).add +
      (h.soulPower.tier >= 2 && h.infExpansions.soul? h.soulPower.special[2].value: 0) -
      ctx.abyss.corrInflueceHandle(5).critDmg + 
      (h.spCount >= 43? 0.01 * h.sp: 0) + 
      (h.selectedDivSkills.includes(15) ? divineSkills.value[15].values[0] : 0) + 
      (0.1 * e.specialCreatures.ddim8.loot); 
    
      final.critDmg += critAttack;
  })

  stats.addHook("post", (final) => {
    final.critDmg = Math.max(final.critDmg, 0);
  })


  stats.addHook("additive", (final) => {
    let avoid = 0;

    avoid += (h.rebirthPts >= 1750? 0.08: 0) + (h.spCount >= 33? Math.floor(h.spCount / 6) * 0.01: 0) +
    (h.soulPower.tier >= 6 && h.infExpansions.soul? h.soulPower.special[6].value * 0.01: 0);

    final.dodge += avoid;
  })

  stats.addHook("post", (final) => {
    player.value.avoid.max = 0.75;

    player.value.avoid.total = final.dodge;
    player.value.avoid.base = Math.min(final.dodge, player.value.avoid.max);
  });

  stats.addHook("additive", (final) => {
    let hit = 0;

    hit = (h.soulPower.tier >= 5 && h.infExpansions.soul? h.soulPower.special[5].value * 0.01: 0)

    final.hit += hit;
  })



  stats.addHook("additive", (final) => {
    final.maxAps += ctx.tree.nodesHandler(5, ["rad"]);

  })


  stats.addHook("additive", (final) => {
    let aps = ctx.tree.nodesHandler(5, ["base", "inf"]) + 
    ctx.eq.getEqTotal("boots") +
    (h.soulPower.tier >= 3 && h.infExpansions.soul? h.soulPower.special[3].value: 0) +
    ctx.timeline.collectLawEffects(9).add +
    ctx.dimensions.getDimReward(39).aps -
    ctx.dimensions.getDimEffect(39).aps;

    final.aps += aps;
  })

  
  stats.addHook("post", (final) => {
    let base = final.aps;
    player.value.APS.total = base;
    player.value.APS.max = final.maxAps;
    player.value.APS.min = final.minAps;
    
    final.aps = Math.min(Math.max(base, player.value.APS.min), Math.max(player.value.APS.max , player.value.APS.min))
    player.value.APS.current = final.aps;

    if(ctx.abyss.corrInflueceHandle(18))
      player.value.APS.current = 0;
  })

  stats.addHook("multiplicative", (final) => {
    let mult = (1 + 0.01 * Math.max(h.stages.current - 100, 0)) * 
    (ctx.dimensions.getDimEffect(46)? 10: 1) * 
    (1 + 0.05 * ctx.tree.nodesHandler(11, ['base', 'inf']));

    final.recovery *= 1 / mult;
  })

  stats.addHook("post", (final) => {
    player.value.recoveryPenalty = final.recovery;
  })

  stats.addHook("multiplicative", (final) => {
    let total = (h.eqUpsMult['armor'].heal) * 
    ctx.tree.nodesHandler(1, ['rad']);

    final.regenMult *= total;
  })

  stats.addHook("post", (final) => {
    if(ctx.abyss.corrInflueceHandle(16))
      player.value.heal.mult = 0;
    if (ctx.dimensions.getDimEffect(46))
      player.value.heal.mult = final.regenMult * 0.5;
    else 
      player.value.heal.mult = final.regenMult;
  })
  
}
