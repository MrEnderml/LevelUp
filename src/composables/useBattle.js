import { ref, computed, onMounted, onUnmounted} from 'vue';
import { perks as ascenPerks } from '../data/ascension.js';
import { cursed } from '../data/cursed.js';
import { dimensions } from '../data/dimensions.js';
import { divineSkills } from '../data/quasarCore.js';

import { createCurse } from './battleUtils/curses.js';
import { useSouls } from './battleUtils/useSouls.js';
import { useRebirths } from './battleUtils/useRebirth.js';
import { useEquipments } from './battleUtils/useEquipment.js';
import { useSpaces } from './battleUtils/useSpace.js';
import { useRadiations } from './battleUtils/useRadiation.js';
import { useInfinity } from './battleUtils/useInfinity.js';
import { useProgressions } from './battleUtils/useProgression.js';
import { useAscensions } from './battleUtils/useAscension.js';
import { useTrees } from './battleUtils/useTree.js';
import { useAmulets } from './battleUtils/useAmulets.js';
import { useAbysses } from './battleUtils/useAbyss.js';
import { useDimensions } from './battleUtils/useDimensions.js';
import { useBuffs } from './battleUtils/useBuffs.js'
import { useSpecialStats } from './battleUtils/useSpecialStats.js';
import { useVoid } from './battleUtils/dims/useVoid.js';

import { useTimeline } from './battleUtils/dims/useTimeline.js';

import { createBattleEngine } from './utils/battleEngine.js';
import { useStats } from './utils/useStats.js';
import { buffsRegistry } from './utils/buffSystem.js';

import { setupHeroBattleStats } from './utils/statsSetup/battleHeroStats.js';
import { setupEnemyBattleStats } from './utils/statsSetup/battleEnemyStats.js';
import { engineSetup } from './utils/engineSetup/engineSetup.js';

import { useNotificationHandler } from './UI/useNotificationHandler.js';

import { usePlayer } from './utils/playerSetup.js';
import { useBaseEnemy } from './utils/enemySetup.js';
import { setupSpaceEnemyBattleStats } from './utils/statsSetup/battleEnemySpaceStats.js';
import { engineBattleSetup } from './utils/engineSetup/engineBattleSetup.js';
import { engineSpaceSetup } from './utils/engineSetup/engineSpaceSetup.js';
import { setupGlobalEnemyBattleStats } from './utils/statsSetup/setupEnemyBattleStats.js';
import { useSingularity } from './battleUtils/useSIngularity.js';
import { useResets } from './battleUtils/useResets.js';
import { engineBaseEnemySetup } from './utils/engineSetup/engineBaseEnemySetup.js';
import { engineCritSetup } from './utils/engineSetup/engineCritSetup.js';
import { avgLoot } from './utils/avgLoot.js';
import { loading } from './utils/loading.js';


export function useBattle(hero, enemy, buffs) {
  const battleContentHandler = () => {
    hero.value.battleContent["main"].player = player;
    hero.value.battleContent["main"].villian = villian;

    hero.value.battleContent["space"].player = spPlayer;
    hero.value.battleContent["space"].villian = spVillian;
  } 

  const { player } = usePlayer();
  const { player: spPlayer } = usePlayer("space");

  const { villian } = useBaseEnemy();
  const { villian: spVillian } = useBaseEnemy("space");

  battleContentHandler();

  const { notesHandler } = useNotificationHandler();

  const context = {
    hero: hero,
    enemy: enemy,
    
    player: player,
    villian: villian,

    soul: useSouls(),
    eq: useEquipments(),
    space: useSpaces(),
    rad: useRadiations(),
    tree: useTrees(),
    inf: useInfinity(),
    buffs: buffs,
    cursed: cursed,
    buff: useBuffs(),
    tree: useTrees(),
    ascension: useAscensions(),
    rebirth: useRebirths(),
    amulets: useAmulets(),
    abyss: useAbysses(),
    dimensions: useDimensions(),
    divineSkills: divineSkills,
    progress: useProgressions(),
    spStats: useSpecialStats(),
    timeline: useTimeline(),
    sing: useSingularity(),
    resets: useResets(),
    void: useVoid(),
    loot: avgLoot(),
    loading: loading(),
  }


  const createWorldBattle = (player, villian) => {
    const engine = createBattleEngine(hero.value, enemy.value, player.value, villian.value);
    player.value.stats = useStats(engine, player.value.stats.base);
    villian.value.stats = useStats(engine, villian.value.stats.base, {
      auto: true 
    })

    createCurse(engine, context, player.value.stats, villian.value.stats);
    buffsRegistry(engine, context, player, villian, player.value.stats, villian.value.stats);
    
    setupHeroBattleStats(player.value.stats, player, context);

    setupGlobalEnemyBattleStats(player.value.stats, villian.value.stats, player, villian, context);
    setupEnemyBattleStats(villian.value.stats, context);

    engineSetup(engine, context);
    engineCritSetup(engine, player.value.stats, villian.value.stats, player, villian, context);
    engineBattleSetup(engine, context);
    engineBaseEnemySetup(engine, player.value.stats, villian.value.stats, player, villian, context);

    return engine;
  }

  const createSpaceBattle = (player, villian) => {
    const engine = createBattleEngine(hero.value, enemy.value, player.value, villian.value);
    player.value.stats = useStats(engine, player.value.stats.base);
    villian.value.stats = useStats(engine, villian.value.stats.base, {
      auto: true 
    })
    player.value.dead = true;
    villian.value.dead = true;
    villian.value.space.stats = context.space.specialStatsCalculated();

    buffsRegistry(engine, context, player, villian, player.value.stats, villian.value.stats);
    
    setupHeroBattleStats(player.value.stats, player, context);

    setupGlobalEnemyBattleStats(player.value.stats, villian.value.stats, player, villian, context);
    setupSpaceEnemyBattleStats(engine, villian.value.stats, player.value.stats, villian, player, context);

    engineSpaceSetup(engine, context);
    engineCritSetup(engine, player.value.stats, villian.value.stats, player, villian, context);
    engineBattleSetup(engine, context);


    return engine;
  }

  context.void.rebuildTreeStats();

  battleContentHandler();

  const worldEngine = createWorldBattle(player, villian);
  const spaceEngine = createSpaceBattle(spPlayer, spVillian);

  
  hero.value.battleId = 'main';
  let intervalId = null;

  const startBattleLoop = () => {
    let interval = 50;
    let slowTick = 0; 
    let secondTick = 0;
    let dt = interval / 1000;


    intervalId = setInterval(() => {
      if(hero.value.isPaused) return;

      worldEngine.tick(dt);

      if (spVillian.value.space.isSpaceFight)
        spaceEngine.tick(dt);

      notesHandler();

      slowTick += interval;
      if (slowTick >= 250) {
        slowTick = 0;

      }

      secondTick += interval;
    if (secondTick >= 1000) {
      secondTick = 0;

      

      if (!spVillian.value.space.isSpaceFight)
        spaceEngine.tick(dt);

      hero.value.time = Date.now();
    }


    }, interval);
  }

  const stopBattleLoop = () => {
    clearInterval(intervalId);
  };
  
  onMounted(startBattleLoop);
  onUnmounted(stopBattleLoop);
                            
  const hardcapHandle = () => {
    hero.value.eqUps['spRing'] = Math.min(hero.value.eqUps['spRing'], 500);
    
    
    hero.value.stage = Math.min(hero.value.stage, 300);

    if(hero.value.attack === NaN)
      hero.value.attack = 10;
    if(hero.value.maxHp === NaN)
      hero.value.maxHp = 100;
    if(hero.value.def === NaN)
      hero.value.def = 0;

    dimensions.value[9].infTier = Math.min(dimensions.value[9].infTier, 7);

    if(hero.value.dId == 'bh' && !hero.value.newUpdateChanges.blackhole){
      performInf();
      perform();

      hero.value.dId = 'main';
      hero.value.infTier = hero.value.mainInfTier;
      hero.value.transcendenceBH = 0;
    }
    hero.value.newUpdateChanges.blackhole = true;


    if(!hero.value.newUpdateChanges.dimReworks){
      for(let idx in dimensions.value){
        if(idx == 24) dimensions.value[24].infTier = 35;
        if(idx == 40) dimensions.value[40].infTier = 40;
        if(idx == 41) dimensions.value[41].infTier = 50;
        if(idx >= 26 && idx < 40)
          dimensions.value[idx].infTier = 0;
      }
      hero.value.newUpdateChanges.dimReworks = true;

    }

    hero.value.ascensionShards = Math.min(1e30, hero.value.ascensionShards);
    ascenPerks[31].level = Math.min(ascenPerks[31].level, 300);
    ascenPerks[34].level = Math.min(ascenPerks[34].level, 500);
    ascenPerks[35].level = Math.min(ascenPerks[35].level, 25);

    //hero.value.eLevel = Math.min(hero.value.eLevel, hero.value.maxLevel);

    hero.value.abyssDStages = Math.min(hero.value.abyssDStages, 300);
  }

  

  const test = () => {
    hero.value.bhTier = 4;
    hero.value.mainInfTier = 60;
  }

  return {
    worldEngine
  };
}

