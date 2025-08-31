import { ref } from 'vue'
import { useHero } from '../composables/useHero.js';

export const auto = ref({
  ascension: {
    minShards: 0,
    minStage: 0,
    enabled: false,
  },
  rebirth: {
    minPts: 0,
    minLevel: 0,
    minLevelNext: 0,
    enabled: false,
  },
  stop: {
    stage: 0,
    stageNext: 0,
    untilKills: 0,
    enabled: false,
  }
})

const { hero } = useHero();

export const autoProgress = () => {
    if(auto.value.ascension.minShards != 0 && hero.value.stage >= 10){
      if(hero.value.totalAscensionShards >= auto.value.ascension.minShards){
        auto.value.ascension.enabled = true;
        hero.value.perform = true;
      }
    }
    if(auto.value.ascension.minStage != 0){
        if(hero.value.stage >= auto.value.ascension.minStage && hero.value.stage >= 10){
          auto.value.ascension.enabled = true;
          hero.value.perform = true;
        }
    }


    if(auto.value.rebirth.minPts != 0 && hero.value.stage >= 3 && hero.value.level >= 100){
      if(hero.value.totalRebirthPts >= auto.value.rebirth.minPts){
        auto.value.rebirth.enabled = true;
        hero.value.perform = true;
      }
    }
    if(auto.value.rebirth.minLevel != 0){
      if(hero.value.level >= auto.value.rebirth.minLevel && hero.value.stage >= 3 && hero.value.level >= 100){
        auto.value.rebirth.minLevel += auto.value.rebirth.minLevelNext;
        auto.value.rebirth.enabled = true;
        hero.value.perform = true;
        } 

    }

    if(hero.value.stage == auto.value.stop.stage && hero.value.zone == 1){
      hero.value.isLocked = true;
      hero.value.isStage = false;

      auto.value.stop.enabled = true;
    }

    if(hero.value.kills >= auto.value.stop.untilKills && auto.value.stop.untilKills != 0 && auto.value.stop.enabled){
      auto.value.stop.stage += auto.value.stop.stageNext;
      hero.value.isLocked = false;
      hero.value.isStage = true;
      
      auto.value.stop.enabled = false;
    }
    
    if(hero.value.mainInfTier < 1) {
      auto.value.ascension.minShards = 0;
      auto.value.ascension.minStage = 0;
      auto.value.ascension.enabled = false;
    }
    if(hero.value.mainInfTier < 2){
      auto.value.rebirth.minPts = 0;
      auto.value.rebirth.minLevel = 0;
      auto.value.rebirth.minLevelNext = 0;
      auto.value.rebirth.enabled = false;
    }
}


export const shouldStop = (stage, level, kills) => {
  return stage >= auto.value.stop.stage &&
    (level < auto.value.stop.untilLevel || kills < auto.value.stop.untilKills)
}
