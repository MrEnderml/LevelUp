import { ref } from 'vue'
import { useHero } from '../composables/useHero.js';
import { useResets } from './battleUtils/useResets.js';

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

export const autoTemp = ref({
  ascensionMinShards: 0,
  ascensionMinStage: 0,
  rebirthMinPts: 0,
  rebirthMinLevel: 0,
  rebirthMinLevelNext: 0,
  stopStage: 0,
  stopStageNext: 0,
  stopUntilKills: 0,
})

const { hero } = useHero();

const { performAscension, performRebirth } = useResets();

export const autoProgress = () => {
    if(auto.value.ascension.minShards != 0 && hero.value.stages.current >= 10){
      if(hero.value.totalAscensionShards >= auto.value.ascension.minShards){
        performAscension();
      }
    }
    if(auto.value.ascension.minStage != 0){
        if(hero.value.stages.current >= auto.value.ascension.minStage && hero.value.stages.current >= 10){
          performAscension();
        }
    }


    if(auto.value.rebirth.minPts != 0 && hero.value.stages.current >= 3 && hero.value.level >= 100){
      if(hero.value.totalRebirthPts >= auto.value.rebirth.minPts || hero.value.rebirthPts + hero.value.totalRebirthPts >= 100000){
        performRebirth();
      }
    }
    if(auto.value.rebirth.minLevel != 0){
      if(hero.value.level >= auto.value.rebirth.minLevel && hero.value.stages.current >= 3 && hero.value.level >= 100){
        auto.value.rebirth.minLevel += auto.value.rebirth.minLevelNext;
        performRebirth();
        } 

    }

    if(hero.value.stages.current == auto.value.stop.stage){
      hero.value.isLocked = true;
      hero.value.isStage = false;

      auto.value.stop.enabled = true;
    }

    if(hero.value.kills >= auto.value.stop.untilKills && auto.value.stop.untilKills != 0 && auto.value.stop.enabled){
      auto.value.stop.stage += auto.value.stop.stageNext;
      autoTemp.value.stopStage += auto.value.stop.stageNext;
      
      hero.value.isLocked = false;
      hero.value.isStage = true;
      
      auto.value.stop.enabled = false;
    }
    
    if(!hero.value.infExpansions.ascensioin) {
      auto.value.ascension.minShards = 0;
      auto.value.ascension.minStage = 0;
      auto.value.ascension.enabled = false;
    }
    if(!hero.value.infExpansions.rebirth){
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

export const autoSave = () => {
  return {
    auto: auto.value,
    autoTemp: autoTemp.value
  };
}

export const autoLoad = (data) => {
  if (data.auto) {
    auto.value = data.auto.auto;
  }

  if (data.autoTemp) {
    autoTemp.value = data.auto.autoTemp;
  }
}
