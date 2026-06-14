import { useHero } from '../../useHero.js';
import { useEnemy } from "../../useEnemy.js";


import { dimensions } from "../../../data/dimensions.js";
import { dimensionsPos } from '../../../data/dims/dimensionsPos.js';

import { useTimeline } from "./useTimeline.js";
import { useBH } from "./useBH.js";

import { useNormalDimension } from './useNormalDimension.js';
import { useDarkDimension } from './useDarkDimension.js';
import { useCorruptedDimension } from './useCorruptedDimension.js';

import { computed } from 'vue';
import { useResets } from '../useResets.js';

export const useDimHandler = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { lawText, timelineTrial } = useTimeline();
    const { bhTrial } = useBH();
    const { setNormalCard } = useNormalDimension();
    const { setDarkCard } = useDarkDimension();
    const { setCorruptedCard } = useCorruptedDimension();

    
    const toggleOtherDimensions = () => {
      if(hero.value.dimensionStatus === 3) return;
      hero.value.dimensionStatus = hero.value.dimensionStatus === 1 ? 2 : 1;
    }

    const corrToggle = () => {
      //hero.value.isDimCorruption = !hero.value.isDimCorruption
      hero.value.dimensionStatus = (hero.value.dimensionStatus == 3? 1: 3);
      
      let tier = 60;
      if(hero.value.dimensionStatus == 3) {
        dimensionsPos.value.forEach(d => {
          if (d.id.startsWith('c-') && tier <= hero.value.mainInfTier) {
            d.status = 3;
            tier += 2;
          }
        });
    
        return;
      }
      
      dimensionsPos.value.forEach(d => {
          if (d.id.startsWith('c-')) {
            d.status = -1;
          }
      });
    
    }

    const getPos = (id, dims) => {
      return dims.value.find(d => d.id === id)
    } 

    function findD (aim) {
      let id = aim.id;
      for(let ds of dimensions.value){
        if(ds.id == id){
          return ds;
        }
      }
    }

    function getInfColor(dim) {
      let d = findD(dim);
    
      if(dim.id.startsWith('c-') && d.infTier < d.maxInfTier) return `#cc66ff`; // corrupted
      if (d_req(d)) return '#f44336'; // 🔴 blocked
      
      const tier = d.infTier ?? 0;
      const max = d.maxInfTier ?? Infinity;
    
      if (tier >= max) return '#66ff66'; // 🟢 completed
      if (tier >= 0 && tier < max) return '#ffcc00'; // 🟡 in progress
      return '#444'; // ⚫ default (не начато)
    }

    function dimensionD(hovered) {
      let d = findD(hovered);
      let objs = hovered;

      let str = '';

      if(objs.id.startsWith('law'))
        return lawText(objs);
      
      if(hero.value.dimensionStatus == 3)
        str += setCorruptedCard(d);
      else {
        if(d.id == 'advanceBH')
          return (activeDimsLaws(d)? activeDimsLaws(d): "") + timelineTrial();
      
        if(d.id == 'bh')
          return (activeDimsLaws(d)? activeDimsLaws(d): "") + bhTrial();
        
          
      
        if(hero.value.dimensionStatus == 2)
          str += setDarkCard(d, d_req);
        
        if(hero.value.dimensionStatus == 1)
          str += setNormalCard(d, d_req);

        if(d.id == hero.value.dId) 
          str += specialCard("location");
      }
      
      
      if(hero.value.isSingularity)
        str += specialCard("singularity");
      

      str += activeDimsLaws(d);
       
    
      return str;
    }

    function activeDimsLaws (d) {
      if(hero.value.timeline.activeLawDims.includes(d.id)) {
        if(hero.value.dimensionStatus == 2)
          return specialCard("laws-d");
        else return specialCard("laws-n");
      }

      return "";
    }

    function specialCard(type) {
      let str = "";
      switch(type){
        case "location":
        str = `<div style="
            position: absolute;
            top: 6px;
            left: 6px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #00cc44;
            box-shadow: 0 0 6px #00cc44;
          ">
          </div>`
        break;
    
        case "singularity":
        str = `
          <div style="
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(102,255,204,0.12);
            border-left: 3px solid #66ffcc;
            font-size: 14px;
            color: #66ffcc;
            margin-bottom: 10px;
            line-height: 1.25;
          ">
            You are in Singularity right now
          </div>
        `;
        break;
    
        case "time":
        str = `
          <div style="
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(150,180,255,0.12);
            border-left: 3px solid #8fb3ff;
            font-size: 14px;
            color: #aac7ff;
            margin-bottom: 10px;
            line-height: 1.25;
          ">
            Your best time: ${timeFormat(hero.value.dTimeReward)}
          </div>
        `;
        break;
    
        case "laws-n":
        str = `
          <div style="
            position: absolute;
            top: 6px;
            left: 18px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: gold;
            box-shadow: 0 0 6px gold;
          ">
          </div>
        `;
        break;

        case "laws-d":
        str = `
          <div style="
            position: absolute;
            top: 6px;
            left: 18px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: red;
            box-shadow: 0 0 6px red;
          ">
          </div>
        `;
        break;
      }
    
      return str;
    }

    const fDimensions = () => {
      return dimensionsPos.value.filter(dim => {
        if (dim.status === -1) return false; 
        if (dim.status === 0) return hero.value.dimensionStatus >= 1;
        if (dim.status === 1) return hero.value.dimensionStatus === 1 || hero.value.dimensionStatus === 3;
        if (dim.status === 2) return hero.value.dimensionStatus === 2;
        return true;
      })
    };

    const darkInf = computed(() =>
      dimensions.value.filter(d => d.id.startsWith('d-')).reduce((sum, d) => sum + d.infTier, 0)
    ) 

    const effectsActivated = () => {
      const cards = [];
      
      cards.push('M');
      cards.push('D');

      cards.push('I');

      cards.push('i');
         
      return cards;
    }
  
    const activeSelect = (key) => {
     
    }
  
    const clickEffects = (key) => {
      if(key == 'i') return hero.value.eLink = { set: 'Info', info: 'Radiation' };
    }
  
    const effectsHandler = (id) => {
      switch (id) {
        
        case 'M': {
          return (
            `<span style="font-size:0.95em; font-style:italic; color: #cde651;">
              <strong style="color: #cfed3a">Mutations</strong><br>
              Mutation — an ability to mutate a curse from [T3] to [T4].
              Each mutation has a chance to mutage a curse to [T4].
              Higher-tier mutations will not trigger if the previous mutation attempt fails.<br>
              Enemies may have only 4 curses [T4].<br>
              Enemies affected by Curse [T4] can drop Mutagen.
            </span>`
          ).replace(/\n\s*/g, '');
        }
  
        case 'D': {
          return (
            `<span style="font-size:0.95em; font-style:italic; color: #dbf944;">
              <strong style="color: #d4ff00">Danger</strong><br>
              Danger — an ability that creates a special space where unique creatures can appear, but they become much stronger in this space.
              To enable special creature spawns, you must reach a certain Stage and Danger level.<br>
              Danger Power increases creature HP and DMG.<br>
              Note: The spawn chance depends only on the Danger level; the Stage does not affect this chance.
            </span>`
          ).replace(/\n\s*/g, '');
        }
  
        case 'I': {
          return (
            '<span style="font-size:0.95em; font-style:italic; color: #ffeb7a">' +
            '<strong style="color:  #ffe02f">Infinity Expansion</strong><br>' +
            `While you have Infinity Expansion for radiation` +
            
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

    

    function d_req(d){
      if(d.id == 'bh') {
        if(!hero.value.isBhBoss) return true;
      }
    
      if(d.id == 'advanceBH')
        return !hero.value.timelinePass[hero.value.timelineActiveTier];
    
      if (d.id === 'ascension') {
        if (hero.value.mainInfTier < 10) return true;
      }
    
      if (d.id === 'gravity') {
        if (hero.value.mainInfTier < 7) return true;
      }
    
      if (d.id === 'survival') {
        if (hero.value.mainInfTier < 8) return true;
      }
    
      if (d.id === 'unlimitted') {
        const prev = dimensions.value.find(dim => dim.id === 'noTree');
        if (prev.infTier < 12 || hero.value.mainInfTier < 12) return true;
      }
    
      if (d.id === 'noTree') {
        const prev = dimensions.value.find(dim => dim.id === 'survival');
        if (prev.infTier < 5 || hero.value.mainInfTier < 10) return true;
      }
    
      if (d.id === 'afk') {
        if (hero.value.mainInfTier < 20) return true;
      }
    
      if (d.id === 'noEq') {
        const prev = dimensions.value.find(dim => dim.id === 'noTree');
        if (prev.infTier < 13 || hero.value.mainInfTier < 15) return true;
      }
    
      if (d.id === 'overkill') {
        const prev = dimensions.value.find(dim => dim.id === 'gravity');
        if (prev.infTier < 5) return true;
      }
    
      if (d.id === 'next') {
        const prev = dimensions.value.find(dim => dim.id === 'noTree');
        if (prev.infTier < 15 || hero.value.mainInfTier < 16) return true;
      }
    
      if (d.id === 'noStats') {
        const prev = dimensions.value.find(dim => dim.id === 'next');
        if (prev.infTier < 4 || hero.value.mainInfTier < 17) return true;
      }
    
      if (d.id === 'noMinLevel') {
        const prev = dimensions.value.find(dim => dim.id === 'noStats');
        if (prev.infTier < 25 || hero.value.mainInfTier < 19) return true;
      }
    
      if (d.id === 'time') {
        const prev = dimensions.value.find(dim => dim.id === 'next');
        const prev1 = dimensions.value.find(dim => dim.id === 'noTree');
        if (prev.infTier < 4 || prev1.infTier < 15 || hero.value.mainInfTier < 20) return true;
      }
    
      if (d.id === 'noBuffs') {
        const prev = dimensions.value.find(dim => dim.id === 'next');
        if (prev.infTier < 4 || hero.value.mainInfTier < 18) return true;
      }
    
      if (d.id === 'soulD') {
        const prev = dimensions.value.find(dim => dim.id === 'noBuffs');
        if (prev.infTier < 25 || hero.value.mainInfTier < 22) return true;
      }
    
      if (d.id === 'danger') {
        const prev = dimensions.value.find(dim => dim.id === 'noBuffs');
        if (prev.infTier < 20 || hero.value.mainInfTier < 21) return true;
      }
    
       if (d.id === 'ascension-2') {
        const prev = dimensions.value.find(dim => dim.id === 'ascension');
        if (prev.infTier < 10) return true;
      }
    
      if (d.id === 'noSpace') {
        const prev = dimensions.value.find(dim => dim.id === 'noEq');
        if (hero.value.mainInfTier < 20 || prev.infTier < 15) return true;
      }
    
      if (d.id === 'damage') {
        const prev = dimensions.value.find(dim => dim.id === 'danger');
        if (prev.infTier < 20 || hero.value.mainInfTier < 23) return true;
      }
    
       if (d.id === 'survival-2') {
        const prev = dimensions.value.find(dim => dim.id === 'overstage');
        if (prev.infTier < 25) return true;
      }
    
      if (d.id === 'overstage') {
        const prev = dimensions.value.find(dim => dim.id === 'damage');
        if (prev.infTier < 26) return true;
      }
    
      if (d.id === 'abyss-d') {
        const prev = dimensions.value.find(dim => dim.id === 'danger');
        if (prev.infTier < 25 || hero.value.mainInfTier < 25 || hero.value.rebirthPts < 1.5e6) return true;
      }
    
       if (d.id === 'hard') {
        const prev = dimensions.value.find(dim => dim.id === 'damage');
        if (prev.infTier < 23) return true;
      }
    
      if (d.id === 'corruption') {
        const prev = dimensions.value.find(dim => dim.id === 'damage');
        if (prev.infTier < 30 || hero.value.mainInfTier < 30) return true;
      }
    
      if (d.id === 'eternity') {
        const prev1 = dimensions.value.find(dim => dim.id === 'corruption');
        const prev2 = dimensions.value.find(dim => dim.id === 'hard');
        if (prev1.infTier < 35 || prev2.infTier < 25 || hero.value.mainInfTier < 35) return true;
      }
    
    
      if (d.id === 'd-corruption') {
        if(hero.value.mainInfTier < 35) return true;
      }
    
      if (d.id === 'd-hard') {
        if(hero.value.mainInfTier < 35) return true;
      }
    
      if (d.id === 'd-damage') {
        if(hero.value.mainInfTier < 36) return true;
      }
    
      if (d.id === 'd-overstage') {
        if(hero.value.mainInfTier < 40) return true;
      }
    
      if (d.id === 'd-survival-2') {
        if(hero.value.mainInfTier < 42) return true;
      }
    
      if (d.id === 'd-danger') {
        if(hero.value.mainInfTier < 38) return true;
      }
    
      if (d.id === 'd-noBuffs') {
        if(hero.value.mainInfTier < 39) return true;
      }
    
      if (d.id === 'd-noMinLevel') {
        if(hero.value.mainInfTier < 60) return true;
      }
    
      if (d.id === 'd-next') {
        if(hero.value.mainInfTier < 42) return true;
      }
    
      if (d.id === 'd-noTree') {
        if(hero.value.mainInfTier < 45) return true;
      }
    
      if (d.id === 'd-noEq') {
        if(hero.value.mainInfTier < 50) return true;
      }
    
      if (d.id === 'd-noSpace') {
        if(hero.value.mainInfTier < 55) return true;
      }
    
      if (d.id === 'd-unlimitted') {
        if(hero.value.mainInfTier < 53) return true;
      }
    
      if (d.id === 'd-noAps') {
        if(hero.value.mainInfTier < 48) return true;
      }
    
      if (d.id === 'radiation') {
        if (hero.value.mainInfTier < 40) return true;
      }
    
      if (d.id === 'noMaxLevel') {
        if (hero.value.mainInfTier < 50) return true;
      }
    
      if (d.id === 'dimMerge') {
        if (hero.value.mainInfTier < 60) return true;
      }
    
      
    
      return false;
    }

    return {
        toggleOtherDimensions,
        getPos,
        getInfColor,
        effectsActivated,
        activeSelect,
        clickEffects,
        effectsHandler,
        dimensionD,
        d_req,
        fDimensions,
        corrToggle,
        darkInf
    }
}