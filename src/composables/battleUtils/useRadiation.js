import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";
import { perks as radPerks } from '../../data/radPerks.js';
import { perks as ascenPerks } from '../../data/ascension.js';
import { divineSkills } from "../../data/quasarCore.js";
import { spaceShop } from "../../data/spaceShop.js";

import { addLog} from '../logService.js';

import { dimensions } from "../../data/dimensions.js";

import { useAscensions } from "./useAscension.js";
import { useAbysses } from "./useAbyss.js";
import { spaceShopHandler } from "./global/spaceShopHandler.js";
import { useDimensions } from "./useDimensions.js";
import { useInfinity } from "./useInfinity.js";
import { useTimeline } from "./dims/useTimeline.js";

import { fn } from "../utils/global.js";
import { useBaseEnemy } from "../utils/enemySetup.js";
import { spEnemy } from "../../data/spaceEnemy.js";

import { cursed } from "../../data/cursed.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useBuff } from "../../data/buffs.js";
import { infBonusesHandler } from "./global/infBonusesHandler.js";
import { useNotificationHandler } from "../UI/useNotificationHandler.js";


export const useRadiations = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();
    const { buffs } = useBuff();
    const { villian } = useBaseEnemy();
    const { player } = usePlayer();

    const { perksHandler } = useAscensions();
    const { abyssHandler } = useAbysses();
    const { collectLawEffects } = useTimeline();
    const { pushNoteById } = useNotificationHandler();

    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { infPenalties } = useInfinity();

    const createSpecialCreature = () => {
        if(hero.value.isAbyss) return;

        baseCreaturesChances()

        if(hero.value.infExpansions.radiation && hero.value.dId == 'main'){
          infCreaturesChances();
          infCreatures();
        }

        if(getDimSpecialReward(15) && hero.value.dId == 'main'){
            dimsCreaturesChances();
            dimsCreatures();
        }
    
        if(hero.value.dId == 'd-danger'){
            darkDimsCreaturesChances();
            darkDangerBoss();
            darkDimsCreatures();
        }
    }

    const infCreatures = () => {
        if(enemy.value.danger >= 100 && villian.value.spawnType == 'none' && hero.value.stages.current > 59){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.inf1.chance >= 100? 'inf-1': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'inf-1'? 'Ω-Infinity': villian.value.name);
          }
          if(enemy.value.danger >= 150 && villian.value.spawnType == 'none' && hero.value.stages.current > 64){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.inf2.chance >= 100? 'inf-2': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'inf-2'? 'Mirror of the Infinity': villian.value.name);
          }
          if(enemy.value.danger >= 200 && villian.value.spawnType == 'none' && hero.value.stages.current > 69){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.inf3.chance >= 100? 'inf-3': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'inf-3'? 'The Infinite One': villian.value.name);
          }
    }

    const dimsCreatures = () => {
        if(enemy.value.danger >= 400 && villian.value.spawnType == 'none' && hero.value.stages.current > 119){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.dim1.chance >= 100? 'dim-1': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'dim-1'? 'Twisted Rootspawn': villian.value.name);
          }
          if(enemy.value.danger >= 550 && villian.value.spawnType == 'none' && hero.value.stages.current > 139){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.dim2.chance >= 100? 'dim-2': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'dim-2'? 'Voidpulse Entity': villian.value.name);
          }
          if(enemy.value.danger >= 600 && villian.value.spawnType == 'none' && hero.value.stages.current > 134){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.dim3.chance >= 100? 'dim-3': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'dim-3'? 'Fracture Beast': villian.value.name);
          }
          if(enemy.value.danger >= 400 && villian.value.spawnType == 'none' && hero.value.stages.current > 119){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.dim4.chance >= 100? 'dim-4': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'dim-4'? 'Clot of Dark Energy': villian.value.name);
          }
          if(enemy.value.danger >= 600 && villian.value.spawnType == 'none' && hero.value.stages.current > 144){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.dim5.chance >= 100? 'dim-5': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'dim-5'? 'Infinitron Prime': villian.value.name);
          }
          if(enemy.value.danger >= 700 && villian.value.spawnType == 'none' && hero.value.stages.current > 149){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.dim6.chance >= 100? 'dim-6': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'dim-6'? 'Entropy Reaver': villian.value.name);
          }
    }

    const darkDimsCreatures = () => {
        if(enemy.value.danger >= 1000 && hero.value.stages.current >= 100 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim1.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim1.chance >= 100? 'd-dim-1': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-1'? 'Dreadfang': villian.value.name);
          }
          if(enemy.value.danger >= 1500 && hero.value.stages.current >= 110 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim2.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim2.chance >= 100? 'd-dim-2': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-2'? 'Voidborn Might': villian.value.name);
          }
          if(enemy.value.danger >= 2000 && hero.value.stages.current >= 120 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim3.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim3.chance >= 100? 'd-dim-3': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-3'? 'Overseer Prime': villian.value.name);
          }
          if(enemy.value.danger >= 2500 && hero.value.stages.current >= 130 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim4.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim4.chance >= 100? 'd-dim-4': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-4'? 'Baselurker': villian.value.name);
          }
          if(enemy.value.danger >= 3000 && hero.value.stages.current >= 140 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim5.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim5.chance >= 100? 'd-dim-5': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-5'? 'Infinity Bane': villian.value.name);
          }
          if(enemy.value.danger >= 3500 && hero.value.stages.current >= 150 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim6.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim6.chance >= 100? 'd-dim-6': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-6'? 'Crushdepth': villian.value.name);
          }
          if(enemy.value.danger >= 4000 && hero.value.stages.current >= 160 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim7.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim7.chance >= 100? 'd-dim-7': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-7'? 'Entropy Leech': villian.value.name);
          }
          if(enemy.value.danger >= 4500 && hero.value.stages.current >= 170 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim8.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim8.chance >= 100? 'd-dim-8': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-8'? 'Flameveil': villian.value.name);
          }
          if(enemy.value.danger >= 5000 && hero.value.stages.current >= 180 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim9.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim9.chance >= 100? 'd-dim-9': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-9'? 'Bloodhowl ': villian.value.name);
          }
          if(enemy.value.danger >= 5500 && hero.value.stages.current >= 190 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim10.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim10.chance >= 100? 'd-dim-10': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-10'? 'Tormenthide': villian.value.name);
          }
          if(enemy.value.danger >= 6000 && hero.value.stages.current >= 200 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim11.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim11.chance >= 100? 'd-dim-11': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-11'? 'Plaguedozer': villian.value.name);
          }
          if(enemy.value.danger >= 6500 && hero.value.stages.current >= 210 && villian.value.spawnType == 'none' && enemy.value.specialCreatures.ddim12.req){
            villian.value.spawnType = (Math.random()*100 + enemy.value.specialCreatures.ddim12.chance >= 100? 'd-dim-12': villian.value.spawnType);
            villian.value.name = (villian.value.spawnType == 'd-dim-12'? 'Malignhorn': villian.value.name);
          }
    }

    const darkDangerBoss = () => {
        let d = dimensions.value[31].infTier;
        let id = 'ddim' + (d + 1);
        if(hero.value.stages.current >= 100 + 10 * d && 
          enemy.value.danger >= 1000 + 500 * d && 
          !enemy.value.specialCreatures[id].req){
            let chance = (Math.random() * 100 + 100 >= 100? true: false);
            villian.value.spawnType = (chance? 'd-dim-boss': villian.value.spawnType);
          }
    }
    
    const rewardSpecialCreature = () => {
        if(hero.value.infExpansions.radiation){
            rewardBaseCreatures();
        }
    
        if(getDimSpecialReward(15)){
            rewardDimsCreatures();
        }
    
        if(hero.value.dId == 'd-danger'){
            rewardDarkDimsCreatures();
        }
    }

    const rewardBaseCreatures = () => {
        if(villian.value.spawnType == 'inf-1'){
            enemy.value.specialCreatures.inf1.loot = Math.min(enemy.value.specialCreatures.inf1.loot + 1, enemy.value.specialCreatures.inf1.max);
            addLog("You destroyed Ω-Infinity and gained 1 Potential", "Creatures");
          }
          if(villian.value.spawnType == 'inf-2'){
            enemy.value.specialCreatures.inf2.loot = Math.min(enemy.value.specialCreatures.inf2.loot + 1, enemy.value.specialCreatures.inf2.max);
            addLog("You destroyed Mirror of the Infinity and gained 1 Infinity Point", "Creatures");
          }
          if(villian.value.spawnType == 'inf-3'){
            enemy.value.specialCreatures.inf3.loot = Math.min(enemy.value.specialCreatures.inf3.loot + 1, enemy.value.specialCreatures.inf3.max);
            addLog("You destroyed The Infinite One and gained 1 Star", "Creatures");
        }
    }

    const rewardDimsCreatures = () => {
        if(villian.value.spawnType == 'dim-1'){
            enemy.value.specialCreatures.dim1.loot = Math.min(enemy.value.specialCreatures.dim1.loot + 1, enemy.value.specialCreatures.dim1.max);
            addLog("You destroyed Twisted Rootspawn and gained 1 Tree Point(TP)", "Creatures");
          }
          if(villian.value.spawnType == 'dim-2'){
            enemy.value.specialCreatures.dim2.loot = Math.min(enemy.value.specialCreatures.dim2.loot + 1, enemy.value.specialCreatures.dim2.max);
            addLog("You destroyed Voidpulse Entity and gained 1 Space Power(SP)", "Creatures");
          }
          if(villian.value.spawnType == 'dim-3'){
            enemy.value.specialCreatures.dim3.loot = Math.min(enemy.value.specialCreatures.dim3.loot + 1, enemy.value.specialCreatures.dim3.max);
            addLog("You destroyed Fracture Beast and gained 1 Dimension Shard(DS)", "Creatures");
          }
          if(villian.value.spawnType == 'dim-4'){
            enemy.value.specialCreatures.dim4.loot = Math.min(enemy.value.specialCreatures.dim4.loot + 1, enemy.value.specialCreatures.dim4.max);
            addLog("You destroyed Clot of Dark Energy and Enemies of the Singularity are weakened by 1%", "Creatures");
          }
          if(villian.value.spawnType == 'dim-5'){
            enemy.value.specialCreatures.dim5.loot = Math.min(enemy.value.specialCreatures.dim5.loot + 1, enemy.value.specialCreatures.dim5.max);
            addLog("You destroyed Infinitron Prime and gained 0.01 MULT IP", "Creatures");
          }
          if(villian.value.spawnType == 'dim-6'){
            enemy.value.specialCreatures.dim6.loot = Math.min(enemy.value.specialCreatures.dim6.loot + 1, enemy.value.specialCreatures.dim6.max);
            addLog("You destroyed Entropy Reaver and gained 0.01 Infinity Resistance", "Creatures");
          }
    }

    const rewardDarkDimsCreatures = () => {
        if(villian.value.spawnType == 'd-dim-boss'){
            enemy.value.specialCreatures['ddim' + (dimensions.value[31].infTier + 1)].req = true;
            addLog("You destroyed the Dimension Boss", "Creatures");
          }
    
          if(villian.value.spawnType == 'd-dim-1'){
            enemy.value.specialCreatures.ddim1.loot = Math.min(enemy.value.specialCreatures.ddim1.loot + 1, enemy.value.specialCreatures.ddim1.max);
            addLog("You destroyed Dreadfang and gained 0.01 Infinity Resistance", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-2'){
            enemy.value.specialCreatures.ddim2.loot = Math.min(enemy.value.specialCreatures.ddim2.loot + 1, enemy.value.specialCreatures.ddim2.max);
            addLog("You destroyed Voidborn Might and gained 0.01 to MULT DMG", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-3'){
            enemy.value.specialCreatures.ddim3.loot = Math.min(enemy.value.specialCreatures.ddim3.loot + 1, enemy.value.specialCreatures.ddim3.max);
            addLog("You destroyed Overseer Prime and gained 0.01 to Max Level Mult", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-4'){
            enemy.value.specialCreatures.ddim4.loot = Math.min(enemy.value.specialCreatures.ddim4.loot + 1, enemy.value.specialCreatures.ddim4.max);
            addLog("You destroyed Baselurker and gained 1 Min Level", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-5'){
            enemy.value.specialCreatures.ddim5.loot = Math.min(enemy.value.specialCreatures.ddim5.loot + 1, enemy.value.specialCreatures.ddim5.max);
            addLog("You destroyed Infinity Bane and gained 0.05 Stardust MULT", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-6'){
            enemy.value.specialCreatures.ddim6.loot = Math.min(enemy.value.specialCreatures.ddim6.loot + 1, enemy.value.specialCreatures.ddim6.max);
            addLog("You destroyed Crushdepth and gained 1 DS", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-7'){
            enemy.value.specialCreatures.ddim7.loot = Math.min(enemy.value.specialCreatures.ddim7.loot + 1, enemy.value.specialCreatures.ddim7.max);
            addLog("You destroyed Entropy Leech and gained 1 Potential", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-8'){
            enemy.value.specialCreatures.ddim8.loot = Math.min(enemy.value.specialCreatures.ddim8.loot + 1, enemy.value.specialCreatures.ddim8.max);
            addLog("You destroyed Flameveil and gained 0.1 CRIT DMG", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-9'){
            enemy.value.specialCreatures.ddim9.loot = Math.min(enemy.value.specialCreatures.ddim9.loot + 1, enemy.value.specialCreatures.ddim9.max);
            addLog("You destroyed Bloodhowl and gained 0.01 Increased Quasar Power", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-10'){
            enemy.value.specialCreatures.ddim10.loot = Math.min(enemy.value.specialCreatures.ddim10.loot + 1, enemy.value.specialCreatures.ddim10.max);
            addLog("You destroyed Tormenthide and gained 0.01 Void Shards MULT", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-11'){
            enemy.value.specialCreatures.ddim11.loot = Math.min(enemy.value.specialCreatures.ddim11.loot + 1, enemy.value.specialCreatures.ddim11.max);
            addLog("You destroyed Plaguedozer and gained 0.01 Singularity Shards MULT", "Creatures");
          }
          if(villian.value.spawnType == 'd-dim-12'){
            enemy.value.specialCreatures.ddim12.loot = Math.min(enemy.value.specialCreatures.ddim12.loot + 1, enemy.value.specialCreatures.ddim12.max);
            addLog("You destroyed Malignhorn and gained 1 Corruption Shard", "Creatures");
          }
    }

    const mutationHandle = () => {
        hero.value.mutation[0].chance = Math.min(30 + 0.5 * radPerks[0].level + perksHandler(39), 100);
        hero.value.mutation[1].chance = Math.min(10 + 1 * radPerks[1].level + perksHandler(39), 100);
        hero.value.mutation[2].chance = Math.min(0 + 1.5 * radPerks[2].level + perksHandler(39), 100);
        hero.value.mutation[3].chance = Math.min(0 + 2 * radPerks[3].level + perksHandler(39), 100);
    }

    const radiationPerks = () => {
        
        radPerks[10].max = 100;
    
        radPerks[0].max = (hero.value.infExpansions.radiation? 80: 25);
        radPerks[1].max = (hero.value.infExpansions.radiation? 60: 25);
        radPerks[2].max = (hero.value.infExpansions.radiation? 40: 25);
        radPerks[3].max = (hero.value.infExpansions.radiation? 30: 25);
    
        radPerks[4].max = (hero.value.infExpansions.radiation? 40: 30);
        radPerks[5].max = (hero.value.infExpansions.radiation? 10: 5);
        radPerks[6].max = (hero.value.infExpansions.radiation? 60: 30);
    
        radPerks[12].max = (hero.value.infExpansions.radiation? 200: 100);
        radPerks[12].max += (hero.value.selectedDivSkills.includes(4)? divineSkills.value[4].values[0]: 0);
        radPerks[12].level = Math.min(radPerks[12].level, 200 + (hero.value.selectedDivSkills.includes(4)? divineSkills.value[4].values[0]: 0));
    
        hero.value.dangerStage = perksHandler(51);
    
        radPerks[10].max += 
        (hero.value.infExpansions.radiation? 100: 0) + 
        perksHandler(40) + 
        infBonusesHandler(18, hero) +
        Math.floor(hero.value.rebirthPts >= 2e6? Math.log(hero.value.rebirthPts) ** 2: 0) + 
        hero.value.dangerStage * 2 + 
        getDimReward(15) + 
        (hero.value.spCount >= 38? hero.value.sp: 0) + 
        (hero.value.selectedDivSkills.includes(12)? Math.floor(divineSkills.value[12].values[0]): 0) + 
        collectLawEffects(8).add + 
        (getDimSpecialReward(57)? getDimReward(57): 0);
    
        if(hero.value.selectedDivSkills.includes(14)){
          radPerks[10].level = radPerks[10].max;
    
          for (let i in radPerks) {
            if (Number(i) === 10) continue;
            radPerks[i].level = 0;
          }
        }

        if(getDimEffect(57)) {
          radPerks[10].level = getDimEffect(57);
          hero.value.cDangerMax = Math.max(hero.value.cDangerMax, radPerks[10].level);
        }
          
        
        if(getDimEffect(15))
          radPerks[10].level = getDimEffect(15)
    
        if (radPerks[4].level >= 0) radPerks[4].description = `Increase mutagen gaining [${fn(1.025 ** radPerks[4].level)}]`;
        if (radPerks[6].level >= 0) radPerks[6].description = `+[${radPerks[6].level}] Potential`;
        radPerks[16].description = `Increase mutagen gain depends on stage [${fn(mutagenOnStage())}]`;
    }

    const celestialSpawn = () => {
      if(spEnemy[hero.value.spCount].type == 'boss' && !spEnemy[hero.value.spCount].status) {
        let rnd = Math.random() * 100 + enemy.value.specialCreatures.celestials.chance >= 100;

        if(rnd) {
          spEnemy[hero.value.spCount].status = true;
          if (hero.value.singularity < 5)
            pushNoteById("celestialAppears")
        }
          
      }
    }

    const baseCreaturesChances = () => {
        enemy.value.danger = radPerks[10].level;
        enemy.value.enemyPower = enemyPowerHandle();
        
        let sc = enemy.value.specialCreatures;

        sc.celestials.chance = (1.09 ** radPerks[10].level - 1) / 10 ** hero.value.spbCount;
        sc.celestials.chance = (hero.value.singularity >= 5? 100: sc.celestials.chance);

        sc.souls.chance = (1.015 ** Math.max(radPerks[10].level - 10, 0));
        sc.boss.chance = 1.125 ** Math.log(1 + Math.max(radPerks[10].level - 20, 0));
    }

    const infCreaturesChances = () => {
        let sc = enemy.value.specialCreatures;

        sc.inf1.chance = (sc.inf1.loot < sc.inf1.max? 1.02 ** Math.max(radPerks[10].level - 100, 0) * (0.89 ** sc.inf1.loot) : 0);
        sc.inf2.chance = (sc.inf2.loot < sc.inf2.max? 1.0325 ** Math.max(radPerks[10].level - 150, 0) * (0.965 ** sc.inf2.loot) : 0);
        sc.inf3.chance = (sc.inf3.loot < sc.inf3.max? 1.04 ** Math.max(radPerks[10].level - 200, 0) * (0.075 ** sc.inf3.loot) : 0);
    }
    
    const dimsCreaturesChances = () => {
        if(getDimSpecialReward(15)){
            let sc = enemy.value.specialCreatures;
            //tree points
            sc.dim1.chance = (sc.dim1.loot < sc.dim1.max? (0.925 ** sc.dim1.loot * 1.03 ** Math.max(radPerks[10].level - 399, 0)): 0);
            //sp
            sc.dim2.chance = (sc.dim2.loot < sc.dim2.max? (0.7 ** sc.dim2.loot * 1.03 ** Math.max(radPerks[10].level - 549, 0)): 0);
            //ds
            sc.dim3.chance = (sc.dim3.loot < sc.dim3.max? (0.4 ** sc.dim3.loot * 1.002 ** Math.max(radPerks[10].level - 599, 0)): 0);
            // E weakness in SH
            sc.dim4.chance = (sc.dim4.loot < sc.dim4.max? (0.8 ** sc.dim4.loot * 1.03 ** Math.max(radPerks[10].level - 399, 0)): 0);
            //ip mult
            sc.dim5.chance = (sc.dim5.loot < sc.dim5.max? (0.15 ** sc.dim5.loot * 1.025 ** Math.max(radPerks[10].level - 599, 0)): 0);
            // inf pen
            sc.dim6.chance = (sc.dim6.loot < sc.dim6.max? (0.8 ** sc.dim6.loot * 1.005 ** Math.max(radPerks[10].level - 699, 0)): 0);
          }
    }

    const darkDimsCreaturesChances = () => {
        darkCreaturesCapHandle();
        if(hero.value.dId == 'd-danger'){
          let sc = enemy.value.specialCreatures;

          //inf penalty
          sc.ddim1.chance = darkCreaturesHandle(0, 0.65)
          //dmg
          sc.ddim2.chance = darkCreaturesHandle(1, 0.924)
          //max level mult
          sc.ddim3.chance = darkCreaturesHandle(2, 0.9)
          //min level
          sc.ddim4.chance = darkCreaturesHandle(3, 0.615)
          //stardust drop
          sc.ddim5.chance = darkCreaturesHandle(4, 0.925)
          //ds
          sc.ddim6.chance = darkCreaturesHandle(5, 0.2)
          //potential
          sc.ddim7.chance = darkCreaturesHandle(6, 0.8)
          //crit dmg
          sc.ddim8.chance = darkCreaturesHandle(7, 0.65)
          //quasar power
          sc.ddim9.chance = darkCreaturesHandle(8, 0.2)
          //void shards
          sc.ddim10.chance = darkCreaturesHandle(9, 0.35)
          //sing shards
          sc.ddim11.chance = darkCreaturesHandle(10, 0.125)
          //corr shards
          sc.ddim12.chance = darkCreaturesHandle(11, 0.05)
        }
    
        if(hero.value.dId == 'soulD'){
          hero.value.soulD = true;
          radPerks[9].level = 1;
        }
    }
    

    const radiationHandle = () => {
        mutationHandle();
      
        radiationPerks();

        adjustDanger();
    }
      
          
      
    const enemyPowerHandle = () => {
          let power = 1;
        
          hero.value.baseDangerPower = (1.013 -
            (hero.value.infExpansions.radiation? 0.007 : 0) +
            (hero.value.dId === 'danger' ? 0.008 : 0));
            
          
          power = hero.value.baseDangerPower;
          
          power = power ** radPerks[10].level;
          
          power = power ** abyssHandler(8);
          
          power = power ** (hero.value.selectedDivSkills.includes(12)? divineSkills.value[12].values[1]: 1); 
          
          power = power ** getDimReward(31).p;
  
          power = power ** (divineSkills.value[14].values[0]);
 
          power = power ** perksHandler(65);
        
          power = power ** collectLawEffects(11).mult; 

          power /= spaceShopHandler(6, hero);

          power /= (getDimSpecialReward(62)? getRadPerk(13): 1);

          return Math.max(power, 1);
    };

    const getRadPerk = (id) => {
      let r = radPerks[id];

      switch(id) {
        case 13: return 1.05 ** r.level;
      }
    }

    const getCost = (perk) => {
      if(perk.id == 13 && perk.level >= 200 && hero.value.selectedDivSkills.includes(4))
        return Math.floor(perk.baseCost + (perk.level * perk.costPerLevel * divineSkills.value[4].values[1]));
      
      if (perk.id == 11 && hero.value.voidTreeStats.danger_cost) 
        return perk.baseCost + (perk.level * perk.costPerLevel) / 2

      if (perk.id == 14 || perk.id == 15)
        return perk.baseCost * perk.costPerLevel ** perk.level;

      return perk.baseCost + (perk.level * perk.costPerLevel);
    }

    function adjustDanger() {
      if (!hero.value.rad.isAuto) return;
      if (hero.value.radTarget == 0) return;

      let targetPower = hero.value.rad.radTarget;
      const maxLoops = 1000;
    
      let loops = 0;
      
      while (loops < maxLoops) {
        loops++;
    
        const currentPower = enemyPowerHandle();
        const currentLevel = radPerks[10].level;
        const cost = getCost(radPerks[10]);
        
        if (radPerks[10].level >= radPerks[10].max) break;
        if (Math.abs(currentPower - targetPower) < 0.1) break;

        if (currentPower > targetPower && currentLevel > 0) {
          const refund = (cost) * 0.5;
          
          if (hero.value.mutagen < refund) break;

          radPerks[10].level--;
          hero.value.mutagen -= refund;
    
          continue;
        }
    
        if (currentPower < targetPower) {
          if (hero.value.mutagen < cost) break;
    
          radPerks[10].level++;
          hero.value.mutagen -= cost;
    
          continue;
        }
    
        break;
      }
    
      enemy.value.danger = radPerks[10].level;
      enemy.value.enemyPower = enemyPowerHandle();
    }

    function maxDangerUp() {
      let loops = 0;
      while (true) {
        if (loops > 10000) break;
        if (radPerks[10].level >= radPerks[10].max) break;

        const cost = getCost(radPerks[10]);
    
        if (hero.value.mutagen < cost) break;
    
        radPerks[10].level++;
        hero.value.mutagen -= cost;

        loops++;
      }
    
      enemy.value.danger = radPerks[10].level;
      enemy.value.enemyPower = enemyPowerHandle();
    }
      
    const darkCreaturesCapHandle = () => {
        let sc = enemy.value.specialCreatures;
        let tier = dimensions.value[31].infTier;

        sc.ddim1.max = 10 + Math.floor(2.5 * tier);
        sc.ddim2.max = 50 + 25 * tier;
        sc.ddim3.max = 25 + Math.floor(12.5 * tier);
        sc.ddim4.max = 5 + Math.floor(2.5 * tier);
        sc.ddim5.max = 20 + 20 * tier;
        sc.ddim6.max = 1 + tier;
        sc.ddim7.max = 10 + 5 * tier;
        sc.ddim8.max = 10 + 2 * tier;
        sc.ddim9.max = 5 + Math.floor(2.5 * tier);
        sc.ddim10.max = 5 + 5 * tier;
        sc.ddim11.max = 1 + tier;
        sc.ddim12.max = 1 + Math.floor(tier / 4);
    }
        
    const darkCreaturesHandle = (tier, base) => {
          let danger = 1000 + 500 * tier;

          let creature = enemy.value.specialCreatures["ddim" + (tier + 1)];
      
          if(creature.loot >= creature.max)
            return 0;
      
          if(radPerks[10].level >= danger && hero.value.dId == 'd-danger')
            return (creature.req? (base ** creature.loot * 1.1 ** (Math.max(radPerks[10].level - danger, 0) ** 0.65)): 0)
          else return 0;
    }

    const getMutagenOnReset = () => {
      let m = (hero.value.mainInfTier >= 10? 2000: 0);

      return m;
    }

    const mutagenOnStage = () => {
      if (!radPerks[16].level) return 1;
      return Math.sqrt(hero.value.stages.current) / Math.log(3 + hero.value.stages.current);
    }

    const mutagenGain = () => {
      if(hero.value.mutations > 0){
        let mutagen = (hero.value.mutations ** 2.5) * 
        (hero.value.mainInfTier < 9? 2: 1) *
        (1.025 ** radPerks[4].level) * 
        player.value.status.conquer.loot *
        perksHandler(34) * 
        perksHandler(66) *
        (hero.value.cursesChances[3].status? 2: 1) * 
        hero.value.soulPower.base.mutagen * 
        infBonusesHandler(25, hero) *
        (player.value.status.traveler.mut) * 
        (hero.value.selectedDivSkills.includes(7)? divineSkills.value[7].values[1]: 1) * 
        player.value.status.critMls.loot * 
        hero.value.voidTreeStats.mutagen_1 *
        mutagenOnStage() *

        villian.value.skills.traveler.loot * 
        
        (hero.value.timePenalty? 0: 1);
  
        mutagen /= infPenalties().mutagen
  
        mutagen **= cursed[17].loot;
        
        addLog(`You gain <b style="color: #b6ff00">${fn(mutagen)} mutagens</b>`, "Mutagen");

        hero.value.currentMutagen = mutagen;
        hero.value.mutagen += mutagen;
        hero.value.avgLoot.mutagen.acc += mutagen;
      }

    }


    const effectsActivated = () => {
      const cards = [];
      
      cards.push('M');
      cards.push('D');

      cards.push('S');
      cards.push('L');

      if(getDimSpecialReward(62))
        cards.push('A');

      return cards;
    }
  
    const activeSelect = (key) => {
      if (key === 'A') return hero.value.rad.isAuto;
    }
  
    const clickEffects = (key) => {
      if (key == 'i') return hero.value.eLink = { set: 'Info', info: 'Radiation' };
      if (key === 'A') hero.value.rad.isAuto = !hero.value.rad.isAuto;
    }
  
    const effectsHandler = (id) => {
      switch (id) {
        
        case 'M': {
          return (
            `<span style="font-size:0.95em; font-style:italic; color: #cde651;">
              <strong style="color: #cfed3a">Mutations</strong><br>
              Mutation — an ability to mutate a curse from [T3] to [T4].
              Each mutation has a chance to mutate a curse to [T4].
              Higher-tier mutations will not trigger if the previous mutation attempt fails.<br>
              Mutation starts mutate curses at Stage 40, +20 Stages for each high-tier mutation.<br>
              Enemies may have only 4 curses [T4].<br>
              Enemies affected by Curse [T4] can drop Mutagen.
            </span>`
          ).replace(/\n\s*/g, '');
        }
  
        case 'D': {
          return (
            `<span style="font-size:0.95em; font-style:italic; color: #dbf944;">
              <strong style="color: #d4ff00">Danger</strong><br>
              Danger — an ability that creates a special space where unique creatures can appear, but they become much stronger <b>only in main battle</b>.
              To enable special creature spawns, you must reach a certain Stage and Danger level.<br>
              Danger Power increases creature HP and DMG.<br>
              Note: The spawn chance depends only on the Danger level; the Stage does not affect this chance.
            </span>`
          ).replace(/\n\s*/g, '');
        }
  
        case 'A': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#d4ff00;">' +
            '<strong style="color: #d4ff00">AUTO-Danger</strong><br>' +
            'Click to enable/disable AUTO for Danger.<br>' +
            'Auto-Danger upgrades Danger until certain Danger Power. When the Danger level is ' + 
            'higher than the Danger Power target, it spends half the cost to reduce Danger level by one.<br>' +
            'Max - upgrade Danger until Max Level. Note: disable Auto-Danger<br>' +
            'Status: ' + (hero.value.rad.isAuto? 'ON': 'OFF') + '<br>' +
            'Sourse: D62' +
            '</span>'
          );
        }

        case 'S': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#d4ff00;">' +
            '<strong style="color: #d4ff00">Mutations [Stage]</strong><br>' +
            `Mutation [T1] triggers at Stage ${40 - 2 * radPerks[5].level}<br>` +
            `Mutation [T2] triggers at Stage ${60 - 2 * radPerks[5].level}<br>` +
            `Mutation [T3] triggers at Stage ${80 - 2 * radPerks[5].level}<br>` +
            `Mutation [T4] triggers at Stage ${100 - 2 * radPerks[5].level}<br>` +
            '</span>'
          );
        }

        case 'L': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color:#d4ff00;">' +
            '<strong style="color: #d4ff00">Mutagen [Loot]</strong><br>' +
            `Mutagen = [Mutation Counts]^2.5<br>` +
            `[Mutation Counts] depends on count of Curses [T4]` +
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
        rewardSpecialCreature,
        createSpecialCreature,
        radiationHandle,
        getMutagenOnReset,
        effectsActivated,
        activeSelect,
        clickEffects,
        effectsHandler,
        mutagenGain,
        celestialSpawn,
        adjustDanger,
        maxDangerUp,
        getCost,
        enemyPowerHandle,
        getRadPerk
    }
}