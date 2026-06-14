import { useHero } from "../useHero";
import { useEnemy } from "../useEnemy";

import { computed } from "vue";
import { perks } from "../../data/perks.js";
import { perks as ascenPerks } from "../../data/ascension.js";
import { useBuff } from '../../data/buffs.js'
import { dimensions } from "../../data/dimensions.js";
import { equipment } from "../../data/equipment.js";
import { cursed } from "../../data/cursed.js";
import { amulets } from "../../data/amulets.js";
import { goals as infGoals } from "../../data/infGoals.js";

import { useDimensions } from "./useDimensions.js";

import { addLog} from '../logService.js';
import { fn } from "../utils/global.js";

import { useAscensions } from "./useAscension.js";
import { usePlayer } from "../utils/playerSetup.js";
import { useSouls } from "./useSouls.js";


export const useBuffs = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy(); 
    const { buffs } = useBuff();
    const { player } = usePlayer();

    const { perksHandler } = useAscensions();
    const { getDimSpecialReward, getDimReward, getDimEffect } = useDimensions();
    const { uniqueSoulHandle } = useSouls();

    const ctxBattle = () => {
      return hero.value.battleContent[hero.value.battleId].player;
    }

    const layoutUnlocked = (index) => {
        if(player.id != 'main') return "";

        if (index === player.value.buff.selectedLayoutIndex)
          return "Click to open the Editor";

        return "";
    }

    const buffActivation = () => {
        if (perks.value[6].level.base) 
          buffs.value[0].active = true;
    
        if (perks.value[9].level.base)
          buffs.value[2].active = true;
    
        if (perksHandler(7))
          buffs.value[1].active = true;
    
        if (perksHandler(17))
          buffs.value[3].active = true;
    
        if (perksHandler(25))
          buffs.value[5].active = true;

        if(perksHandler(30))
          buffs.value[0].maxTier = 4;

        if (perksHandler(38))
          buffs.value[8].maxTier = 4;
    
        if (hero.value.soulsMax >= 10)
          buffs.value[7].active = true;
    
        if (hero.value.soulsMax >= 20)
          buffs.value[4].active = true;
    
        if (hero.value.soulsMax >= 30)
          buffs.value[11].active = true;
    
        if (hero.value.soulsMax >= 40)
          buffs.value[12].active = true;
    
        if (hero.value.rebirthPts >= 500)
          buffs.value[10].active = true;
    
        if (hero.value.rebirthPts >= 25000)
          buffs.value[8].active = true;
    
        if (hero.value.rebirthPts >= 7500)
          buffs.value[9].active = true;
    
        if(hero.value.spCount >= 17)
          buffs.value[13].active = true;
    
        if(hero.value.spCount >= 29)
          buffs.value[14].active = true;
    
        if(hero.value.spCount >= 40)
          buffs.value[11].maxTier = 4;
    
        if(hero.value.mainInfTier >= 15){
          buffs.value[6].active = true;
          buffs.value[6].maxTier = 1 + hero.value.singularity;
        }
        
        if(hero.value.bhTier > 0){
          buffs.value[15].active = true;
          buffs.value[15].maxTier = Math.min(hero.value.bhTier, 5);
        }
    
        if(hero.value.singularity >= 1){
          buffs.value[7].maxTier = 4;
        }
    
        if(getDimReward(32, 0).req)
          buffs.value[13].maxTier = 4;
    
        if(getDimReward(32, 1).req)
          buffs.value[12].maxTier = 4;
    
        if(getDimReward(32, 2).req)
          buffs.value[1].maxTier = 4;
    
        if(getDimReward(32, 3).req)
          buffs.value[2].maxTier = 4;
    
        if(getDimReward(32, 4).req)
          buffs.value[9].maxTier = 4;
    
        if(getDimReward(32, 5).req)
          buffs.value[14].maxTier = 4;

        if(getDimReward(32, 6).req)
          buffs.value[5].maxTier = 4;

        if(getDimReward(32, 7).req)
          buffs.value[10].maxTier = 4;
    
        if(getDimSpecialReward(40)){
          buffs.value[16].maxTier = 4;
          buffs.value[16].active = true;
        }

        let req = [120, 140, 160, 180, 200, 220, 240, 260];
        let reqId = [5, 7, 8, 2, 1, 11, 12, 3];

        for (let i in req) {
          if (hero.value.cSoulsMax >= req[i])
            buffs.value[reqId[i]].awaken = true;
        }

         
        hero.value.buffLayouts[0].id = 0;
        hero.value.buffLayouts[0].unlocked = true;
    
        hero.value.buffLayouts[1].id = 1;
        hero.value.buffLayouts[1].unlocked = true;
    
        hero.value.buffLayouts[2].id = 2;
        hero.value.buffLayouts[2].unlocked = true;

        buffInfoHandler();
    }

    const buffInfoHandler = () => {
      for (let b of buffs.value) {
        if (b.id == 1) {
          b.info[3] = `In short, your current attack speed is multiplied by ${fn(buffInfoCalculate(1).mult) } ignoring Cap`;
        }

        if (b.id == 2) {
          if (b.awaken)
            b.info[3] = `Loot multiplier [${fn(buffInfoCalculate(2).lootMult)}]`;
          else b.info[3] = ``;
        }

        if (b.id == 3) {
          if (b.awaken)
            b.info[3] = `Total [${buffInfoCalculate(3).total}] Max Stacks`;
          else b.info[3] = ``;
        }

        if (b.id == 5) {
          if (b.awaken)
            b.info[3] = `Total [${buffInfoCalculate(5).mult}%]`;
          else b.info[3] = ``;
        }

        if (b.id == 7) {
          b.info[3] = b.info[3].replace(/\[\d+%\]/, "[" + player.value.overkill.loot + "%]");
        }

        if (b.id == 8) {
          b.info[3] = `Total Max Time [${buffInfoCalculate(8).maxTime}]`
        }

        if (b.id == 10) {
          if (getDimReward(4) > 0)
            b.info[0] = `Gain additional chance [${getDimReward(4) * 100}]. The Excess chance above 100% is applied to the additional RISE UP`;
          else b.info[0] = "";
        }

        if (b.id == 11) {
          b.info[0] = `CRIT CHANCE [${fn(buffInfoCalculate(11).crit)}] and CRIT DMG [${fn(buffInfoCalculate(11).critDmg)}]`;

          if (b.awaken)
            b.info[1] = "Max Tier: 4";

          b.info[2] = `Accuracy [${fn(buffInfoCalculate(11).hit)}]`;
        }

        if (b.id == 12) {
          b.info[0] = `Low Life - when your HP is below [${buffInfoCalculate(12).lowLife}%]. 
          DMG MULT: ${fn(buffInfoCalculate(12).dmg)}`,
          b.info[1] = `CRIT CHANCE [${fn(buffInfoCalculate(12).crit)}] and CRIT DMG [${fn(buffInfoCalculate(12).critDmg)}]`;
          
        }
      }
    }

    const buffInfoCalculate = (id) => {
      let tier = buffs.value[id].tier + buffs.value[id].extraTier;
      let et = buffs.value[id].extraTier;
      let t = buffs.value[id].tier;

      switch(id) {
        case 1: {
          return {
            mult: 1.2 + 0.01 * et,
          }
        }
        case 2: {
          return {
            lootMult: 2 * 1.1 ** t,
          }
        }
        case 3: {
          return {
            total: 100 + 10 * et,
          }
        }
        case 5: {
          return {
            mult: 10 + et,
          }
        }
        case 8: {
          return {
            maxTime: 1500 + 100 * et,
          }
        }
        case 11: {
          return {
            crit: 5 * tier,
            critDmg: 0.25 * tier,
            hit: 7.5 * tier,
          }
        }
        case 12: {
          return {
            lowLife: 30 + 2 * tier,
            crit: 3 * tier,
            critDmg: 0.15 * tier,
            dmg: 1.25 ** tier,
          }
        }
      }
    }

    const getMaxBuffs  = () => {
        let total = 1 + 
        (amulets[0].status && hero.value.maxStage >= 20? 1: 0) + 
        (amulets[1].status && hero.value.maxStage >= 30? 1: 0) + 
        (amulets[2].status && hero.value.maxStage >= 40? 1: 0) + 
        (amulets[3].status && hero.value.maxStage >= 50? 1: 0) + 
        //(hero.value.spCount >= 43 && hero.value.spaceFight == 2? 1: 0) +
        (hero.value.isAbyss && hero.value.rebirthTier >= 15? hero.value.rebirthBonusesHandle[2].value: 0) + 
        (hero.value.singularity >= 6? 1: 0) + 
        (getDimSpecialReward(55)? 1: 0);

        hero.value.maxBuffs = total;

        return total;
      }

      const toggleBuff = (id) => {
        if(hero.value.battleId != 'main') return;

        if (hero.value.isTravell && (hero.value.soulD || hero.value.dId == 'soulD')) return;

        const layout = hero.value.buffLayouts[player.value.buff.selectedLayoutIndex];
        const index = layout.buffs.indexOf(id);
      
        if (index !== -1) {
          layout.buffs.splice(index, 1); 
        } else {
          layout.buffs.push(id);
        }
      };


    const eventReq = () => {
        let dimsNotAllowed = ['noBuffs', 'c-noEq', 'c-noTree', 'c-ascension', 'c-radiation', 'c-noSpace'];
    
        if ((hero.value.isSingularity && hero.value.singularity >= 5) || dimsNotAllowed.includes(hero.value.dId)) return true;
    
        return false;
    }

    const syncActiveBuffs = (player) => {
      const layout = hero.value.buffLayouts[player.buff.selectedLayoutIndex];
      const unlocked = buffs.value.filter(b => b.active).map(b => b.id);
    
      const validLayout = layout.buffs.filter(id => unlocked.includes(id));
    
      const max = getMaxBuffs();

      if((eventReq() || player.id == 'space' && hero.value.dId == 'd-noSpace') 
        && hero.value.stages.current < 5) {
        player.buff.activeBuffs = [];
        player.buff.overflowBuffs = [];
        overflowCount(player);
        return;
      }
    
      player.buff.activeBuffs = validLayout.slice(0, max);
      player.buff.overflowBuffs = validLayout.slice(max);

      overflowCount(player);
    };


    const applyLayout = (index) => {
      if(hero.value.battleId != 'main') return;

      player.value.buff.selectedLayoutIndex = index;
    }

    function openLayoutEditor(index) {
        if(hero.value.battleId != 'main') return;

        hero.value.buff.layoutBeingEdited = index;
        hero.value.buff.layoutNameInput = hero.value.buffLayouts[index].name;
        hero.value.buff.showLayoutEditor = true;
      }
      
    function confirmLayoutEdit() {
        if (hero.value.buff.layoutBeingEdited !== null && hero.value.buff.layoutNameInput.trim() !== '') {
          hero.value.buffLayouts[hero.value.buff.layoutBeingEdited].name = hero.value.buff.layoutNameInput.trim();
        }
        cancelLayoutEdit();
    }
      
    function cancelLayoutEdit() {
        hero.value.buff.showLayoutEditor = false;
    }
      
    function resetLayoutEdit() {
      const layout = hero.value.buffLayouts[player.value.buff.selectedLayoutIndex];
    
      layout.buffs.splice(0); 
    }

    const overflowCount = (player) => {
      player.buff.overflowCount = Math.max(0, player.buff.overflowBuffs.length);
    };

    function onLayoutClick(index) {
      if (index === player.value.buff.selectedLayoutIndex) {
          openLayoutEditor(index);
      } else {
          applyLayout(index);
      }
    }

    function getPriority(id) {
      if(hero.value.battleId == 'space' && hero.value.dId == 'd-noSpace') return null;
      
      const layout = hero.value.buffLayouts[ctxBattle().buff.selectedLayoutIndex];
      const index = layout.buffs.indexOf(id);
    
      return index !== -1 ? index + 1 : null;
    }



    const effectsActivated = () => {
      const cards = [];
    
      cards.push('O');
      cards.push('P');
      cards.push('S');
      cards.push('E');

      return cards;
    }

    
    const activeSelect = (key) => {
     
    }

    const clickEffects = (key) => {
      if (key === 'i') hero.value.eLink = { set: 'Info', info: 'Skill' }
    }

    const effectsHandler = (id) => {
      switch (id) {
    
        case 'O': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #d96128;">' +
            '<strong style="color:#d96128;">Overflow</strong><br>' +
            'Overflow means the skill is queued. It will become active once a slot is free.' +
            'Overflowing skills do not affect your stats.' +
            '</span>'
          );
        }
    
        case 'P': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #fbbf24;">' +
            '<strong style="color: #fbbf24;">Priority</strong><br>' +
            'Skills are applied based on priority — lower-priority skills enter the queue first' +
            '</span><br>' + 
            '<span style="font-size:0.95em; font-style:italic; color:#bfbfbf;">' +
            'Tip: Select the most important skills first to avoid them being left in overflow.' +
            '</span>'
          );
        }

        case 'S': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #fbbf24;">' +
            '<strong style="color: #fbbf24;">Skill EXP</strong><br>' +
            'Skill EXP is awarded at Stage 20.' +
            '</span>'
          );
        }

        case 'E': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: orange;">' +
            '<strong style="color: orange;">Edit Menu</strong><br>' +
            `Click on the selected layout to open the Edit menu. 
            Click the Save button to save the layout's name. 
            Click the Reset button to remove all skills from the layout.` +
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
        onLayoutClick,
        layoutUnlocked,
        confirmLayoutEdit,
        resetLayoutEdit,
        cancelLayoutEdit,
        toggleBuff,
        getPriority,
        getMaxBuffs,
        effectsActivated,
        activeSelect,
        clickEffects,
        effectsHandler,
        buffActivation,
        syncActiveBuffs
    }
}