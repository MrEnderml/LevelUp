import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";


import { dimensions } from "../../../data/dimensions.js";
import { laws } from '../../../data/laws.js';
import { dimensionsPos } from "../../../data/dims/dimensionsPos.js";

import { timelineLevels } from '../../../data/timeline.js';
import { useSingularity } from "../useSIngularity.js";
import { useSpaces } from "../useSpace.js";
import { usePlayer } from "../../utils/playerSetup.js";
import { spaceShopHandler } from "../global/spaceShopHandler.js";
import { infBonusesHandler } from "../global/infBonusesHandler.js";
import { useNotificationHandler } from "../../UI/useNotificationHandler.js";

export const useTimeline = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { player } = usePlayer();

    const { singShardsEffect } = useSingularity();
    const { pushNoteById } = useNotificationHandler();
    

    const mainDim = dimensionsPos.value.find(d => d.id === 'main');
    const darkDim = dimensionsPos.value.find(d => d.id === 'eternity');

    function timelineReq () {
      let stage = timelineLevels[hero.value.timelineActiveTier].req['Stage'];
      let level = timelineLevels[hero.value.timelineActiveTier].req['Total Level'];

      return {
        stage: stage,
        level: level
      }
    }

    function timelineAuto (dt) {
      if (!hero.value.autoTimeLine.isAuto) return;

      hero.value.autoTimeLine.timer -= dt;

      if (hero.value.autoTimeLine.timer <= 0) {
        hero.value.autoTimeLine.timer = timelineTimer();

        pushNoteById("tm-auto-complete")

        refillStone(hero.value.autoTimeLine.tier);
      }
    }

    const timelineTimer = () => {
      let baseTime = hero.value.autoTimeLine.time[hero.value.autoTimeLine.tier];

      baseTime -= hero.value.voidTreeStats.law_time_1 * 60;

      return Math.max(baseTime, 600);
    }

    function timelineEffects () {
      let tier = hero.value.timelineActiveTier;

      if (hero.value.dId != 'advanceBH') 
        return {
          power: 1,
          resonance: 1,
          corrInfluence: 0,
          infTier: timelineLevels[tier].req['Infinity Tier']
        }

      

      return {
        power: timelineLevels[tier].req['Enemy Power'],
        resonance: timelineLevels[tier].req['Curse Power'],
        corrInfluence: timelineLevels[tier].req['Corruption Influence'],
        infTier: timelineLevels[tier].req['Infinity Tier'],
      }
    }

    function timelineTrial() {
        const level = timelineLevels[hero.value.timelineActiveTier];
      
        let text = `
          <span style="color: gold; font-weight: bold;">Timeline</span><br><br>
          Journey into the past, to the era of the ancient titans. Master the laws of existence and open new paths to power.<br><br>
          
          Enter the time: <span style="color: ${level.color}; font-weight: bold;">${level.name}</span><br><br>
        `;
      
        if(!hero.value.timelinePass[hero.value.timelineActiveTier]){
          text += `<span style='color: red; font-weight: bold'>Complete the previous trial to enter</span>`;
          return text;
        }
      
        text += `<span style="color: #66ffcc; font-weight: bold;">Completion Conditions:</span><br>`;
        text += `- <span style="color: #ffff66;">Stage</span>: <span style="color: white; font-weight: bold;">${level.req['Stage']}</span><br>`;
        text += `- <span style="color: #ffff66;">Total Level</span>: <span style="color: white; font-weight: bold;">${level.req['Total Level']}</span><br><br>`;
      
        text += `<span style="color: #ff8888; font-weight: bold;">Trial Effects:</span><br>`;
        text += `- <span style="color: #ff5555;">Enemy Power</span>: <span style="color: white; font-weight: bold;"> *${level.req['Enemy Power']}</span><br>`;
        text += `- <span style="color: #ff5555;">Resonance</span>: <span style="color: white; font-weight: bold;"> *${level.req['Curse Power']}</span><br>`;
        text += `- <span style="color:rgb(250, 40, 243);">Corruption Influence</span>: <span style="color: white; font-weight: bold;"> +${level.req['Corruption Influence']}%</span><br>`;
        text += `- <span style="color: gold;">Infinity Tier</span>: <span style="color: white; font-weight: bold;">${level.req['Infinity Tier']}</span><br>`;
      
        return text;
    }

    function refillStone(t) {
      let tier = (t !== undefined? t: hero.value.timelineActiveTier) + 1;

      let extraStone = hero.value.voidTreeStats.laws_add_stone * 0.01;
      let count = 1;
      if (Math.random() < extraStone)
        count++;

      if(hero.value.lawStonesSet.length + 2 >= hero.value.inventorySize && count > 0)
        pushNoteById("inventoryWarning")

      for(let i = 0; i < count; i++) {
        if (hero.value.lawStonesSet.length >= hero.value.inventorySize) return;

        let stone = createStone(tier);
        hero.value.lawStonesSet.push(stone);
      }
    }

    function lawText(obj) {
        const tierColors = {
          1: "#3bb273", 
          2: "#f2d541", 
          3: "#d94e67", 
          4: "#a93df2", 
          5: "#66ffcc"  
        };

        let l = obj.id.endsWith(1)? 0: 1;
      
        const stone = hero.value.lawSlots[l];
        if (!stone || !stone.laws) return "The slot is empty";
      
        let text = `<span style='color: #66ffcc'>Radius: <span style="color: gold">${Math.floor(getTotalRadius(l))}</span></span><br><br>`;
      
        for (const { id: lawIndex, tier: lawTier } of stone.laws) {
          const law = laws.value[lawIndex];
          if (!law) continue;
        
          const bonus = law.bonus[lawTier - 1] ?? 0;
        
          const desc = law.desc.replace(
            "[]",
            `<span style="color: #ffd700">${bonus}</span>`
          );
        
          text +=
            `<strong style="color: ${tierColors[lawTier]}">${law.name}</strong> ` +
            `<span style="color: ${tierColors[lawTier]}">[T${lawTier}]</span><br>` +
            `${desc}<br>`;
        }
      
        return text;
    }

    const applyLaw = () => {
      hero.value.timeline.activeLawDims = dimensionsPos.value.filter(dim => 
        (isActiveDimension(mainDim, dim, 0) && dim.status === 1) ||
        (isActiveDimension(darkDim, dim, 1) && dim.status === 2) ||
        (isActiveDimension(mainDim, dim, 0) && dim.status === 3)
      ).map(dim => dim.id);
    }

    const radiusSourses = () => {
      let r = hero.value.voidTreeStats.laws_radius_1 * 
      (dimensions.value[51].infTier >= dimensions.value[51].spInfTier?
      (1 + 0.01 * Math.min(Math.max(hero.value.mainInfTier - 60, 0) / 2, 20)): 1);

      return r;
    }

    function isActiveDimension(baseDim, dim, slotIndex) {
      const inRadius = getRadius(baseDim, dim, slotIndex);
    
      const statusMatches = dim.status === hero.value.dimensionStatus;

      if(dim.id == 'main')
        return inRadius && statusMatches && hero.value.lawSlots[0] != null;
    
      return inRadius && statusMatches;
    }

    function getRadius(baseDim, dim, slotIndex) {
      let radius = getTotalRadius(slotIndex)

      const inRadius = isInRadius(baseDim, dim, radius);

      return inRadius
    }

    function getTotalRadius (slotIndex) {
      let r = radiusCalc(hero.value.lawSlots[slotIndex], 0);

      r *= (slotIndex == 1? 0.5: 1);
      r *= radiusSourses();

      return r;
    }

    function isInRadius(main, dim, radius) {
      const dx = main.x - dim.x;
      const dy = main.y - dim.y;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    }
    
    function radiusCalc(stone, status) {
      if(stone == null) return 0;
      return Math.floor(stone.radius + stone.radius ** 0.5 * (stone.ups + status));
    }

    const rebuildActiveDimsCache = () => {
      const dimensionIdxMap = {};
      for (const d of dimensions.value)
        dimensionIdxMap[d.id] = d.idx;
      

      hero.value.timeline.activeDimsCache =
        dimensionsPos.value
        .filter(dim => 
          getRadius(mainDim, dim, 0) && !dim.id.startsWith("d-") || 
          getRadius(darkDim, dim, 1) && dim.id.startsWith("d-")
        ).map(dim => dimensionIdxMap[dim.id] ?? -1)
    }

    const createStone = (stoneTier) => {
      const lawTierProbabilities = [
        [1],                   
        [0.6, 0.4],            
        [0.4, 0.35, 0.25],       
        [0.35, 0.25, 0.225, 0.175],  
        [0.25,0.2,0.2,0.2,0.15] 
      ];
      
      function modifyTierWeights(weights, bonus = 0) {
        const modified = weights.map((weight, tier) => {
          return weight * Math.pow(1 + bonus, tier)
        })
      
        const total = modified.reduce((a,b)=>a+b,0)
      
        return modified.map(w => w / total)
      }
      
      function weightedRandomIndex(weights) {
        const total = weights.reduce((a,b)=>a+b,0);
        let r = Math.random() * total;
        for (let i = 0; i < weights.length; i++) {
          r -= weights[i];
          if (r <= 0) return i;
        }
        return weights.length - 1;
      }
    
      function getNextStoneId(existingIds) {
        let id = 0;
        while (existingIds.includes(id)) id++;
        return id;
      }
    
      const stone = {
        id: getNextStoneId(hero.value.lawStonesSet.map(s => s?.id)),
        tier: stoneTier,
        radius: Math.floor((Math.random() * (150 - 120 + 1) + 120) * 1.2 ** stoneTier),
        range: {
          min: Math.floor((0 * (150 - 120 + 1) + 120) * 1.2 ** stoneTier),
          max: Math.floor((1 * (150 - 120 + 1) + 120) * 1.2 ** stoneTier)
        },
        laws: [],
        ups: 0,
        block: false,
      };
      
      const tierBonus = singShardsEffect(10);
      const maxLaws = stoneTier; 
      const tierWeights = lawTierProbabilities[stoneTier - 1];
      const modWeight = modifyTierWeights(tierWeights, tierBonus)
    
      while (stone.laws.length < maxLaws) {
        let lawIndex;
      
        do {
          lawIndex = Math.floor(Math.random() * (3 * stoneTier));
        } while (stone.laws.some(l => l.id === lawIndex));
      
        const lawTier = weightedRandomIndex(modWeight) + 1;
      
        stone.laws.push({
          id: lawIndex,
          tier: lawTier,
        });
      }
    
      return stone;
    }
        
    const collectLawEffects = (lawIdx) => {
      const law = laws.value[lawIdx];
      if (!law) return { add: 0, mult: 1 };
    
      let add = 0;
      let mult = 1;
    
      for (const slot of hero.value.lawSlots) {
        if (!slot) continue;
      
        const lawData = slot.laws.find(l => l.id === lawIdx);
        if (!lawData) continue;
      
        const tier = lawData.tier;
        const value = law.bonus[tier - 1] ?? 0;
      
        if (law.scope === 'current-dimension') {
          if (!hero.value.timeline.activeLawDims.includes(hero.value.dId))
            continue;
        }
      
        if (law.type === 'add') add = value;
        if (law.type === 'mult') mult = value;
      }
    
      return { add, mult };
    };

    function radiusCalc(stone, status) {
      if (!stone) return 0;
      return Math.floor(stone.radius + stone.radius ** 0.5 * (stone.ups + status));
    }

    function calcUpgradeCost(stone) {
      if (!stone) return 0;
      let total = stone.ups;
      return upCost(total);
    }
    
    function upCost(val) {
      return Math.floor((1 + 0.15 * val) * (val + 1) ** 1.075);
    }
    
    function upgradeStone(selectedStone) {
      if (!selectedStone) return;
    
      const cost = calcUpgradeCost(selectedStone);
    
      if (hero.value.ancientShards >= cost) {
        hero.value.ancientShards -= cost;
        selectedStone.ups++;
      }

      rebuildActiveDimsCache()
    }

    const ancientShardsMult = () => {
      let base = 1 +
      infBonusesHandler(29, hero) +
      hero.value.voidTreeStats.an_shards_1 +
      spaceShopHandler(17, hero) +
      (dimensions.value[51].infTier >= dimensions.value[51].spInfTier? 0.5: 0)
      

      return base;
    }
  

    return {
        timelineTrial,
        lawText,
        applyLaw,
        createStone,
        collectLawEffects,
        timelineReq,
        timelineEffects,
        refillStone,
        timelineAuto,
        radiusCalc,
        getTotalRadius,
        calcUpgradeCost,
        upgradeStone,
        ancientShardsMult,
        timelineTimer,
        upCost,
        radiusSourses,
        rebuildActiveDimsCache
    }
}