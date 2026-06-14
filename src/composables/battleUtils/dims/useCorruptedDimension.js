import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";

import { fn } from "../../utils/global.js";

import { dimensions } from "../../../data/dimensions.js";
import { dimensionsPos } from "../../../data/dims/dimensionsPos.js";
import { useDimensions } from "../useDimensions.js";
import { glitchify } from "../../utils/global.js";


export const useCorruptedDimension = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { getDimReward } = useDimensions();

    let name = "";

    const setCorruptedCard = (d) => {
        if(!d.id.startsWith('c-'))
            return "";

        let str = `
            <div style="
            font-size: 18px;
            font-weight: 900;
            margin-bottom: 6px;
            color:rgb(242, 168, 245);
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.45);
            ">
            Dimension: ${glitchify(d.name)} [${d.idx}]
            </div>
        `;
        
        
        str += dimDescCard(d)

        str += infinityTierCard(d.infTier, d.maxInfTier);

        str += dimRewardCard(d);

        
        return str;
    }



    function dimRewardCard(d) {
        if(d.r == "") 
            return "";

        let desc = "";
        let title = "Reward";
        let baseColor = '#b06eff';        
        let baseBackground = 'rgba(183, 110, 255, 0.1)'; 
        let baseBorder = '#9a4dcc'; 
      
        switch (d.id) {
          case "c-unlimitted":
            desc = c_unlimit_reward_handle(d);
            break;
          
          case "c-soulD":
            desc = c_soul_reward_handle(d);
            break;
          
          case "c-danger":
            desc = c_danger_reward_handle(d);
            break;
          
          default: 
            desc = d.r;
            break;

        }
      
        return `
          <div style="
            background: ${baseBackground};
            padding: 10px 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            text-align: center;
            box-shadow: 0 0 6px rgba(0, 200, 220, 0.35);
            border: 1px solid ${baseBorder};
          ">
            <div style="
              font-size: 16px;
              font-weight: 800;
              text-transform: uppercase;
              color: ${baseColor};
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            ">
              ${title}
            </div>
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: ${baseColor};
            ">
              ${desc}
            </div>
          </div>
        `;
    }

    function infinityTierCard(cur, max = null) {
        const tier = max ? `Infinity [T${cur}]/[T${max}]` : `Infinity [T${cur}]`;
      
        return `
          <div style="
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 14px;
            background: rgba(153, 102, 255, 0.1); 
            border-left: 3px solid #d3a0ff;       
            color: #d3a0ff;    
            margin-bottom: 10px;
          ">
            ${tier}
          </div>
        `;
    }

    function dimDescCard(d) {
        let desc = "";
        let baseColor = ' #cdaaff';
      
        switch(d.id){
          
          default:
            desc = d.d;
            break;
        }
      
        return `
          <div style="
            background: #1d1b2e;
            padding: 10px 12px;
            border-radius: 8px;
            color: ${baseColor};
            font-size: 14px;
            margin-bottom: 12px;
            line-height: 1.3;
            border: 1px solid rgba(200,170,255,0.25);
          ">
            ${desc}
          </div>
        `;
    }

    function c_unlimit_reward_handle(d) {
      const base = d.r;
      let lessPenalty = getDimReward(50)
      let maxLevel = hero.value.cUnlimitMaxLevel;

      let warp = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;
    
      return warp(base
        .replace(/\[1\]/, `[${fn(lessPenalty)}]`)
        .replace(/\[1\]/, `[${Math.floor(maxLevel)}]`))
   }

    function c_soul_reward_handle(d) {
      return `Unlock Unique Abilites | Max Consumed Souls [${hero.value.cSoulsMax}]`;
    }

    function c_danger_reward_handle(d) {
      let stage = Math.floor(hero.value.cDangerMax / 50) + 1;
      let danger = getDimReward(57);

      return `Gain Max Danger depends on completed stages in this dimensions after Stage 60.<br> 
        Max Stgae [${stage}] | Max Danger [${Math.floor(danger)}]`;
    }


    return {
        setCorruptedCard,
    }
}