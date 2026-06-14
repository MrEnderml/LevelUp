import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";

import { fn } from "../../utils/global.js";

import { dimensions } from "../../../data/dimensions.js";
import { useTimeline } from "./useTimeline.js";
import { useDimensions } from "../useDimensions.js";
import { useDimHandler } from "./useDimHandler.js";


export const useDarkDimension = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    let dId = null;

    const { getAllActiveDims } = useTimeline();
    const { getDimReward, getDimEffect, getBaseTierSourses} = useDimensions();

    const setDarkCard = (d, d_req) => {
        

        let str = `
            <div style="
            font-size: 18px;
            font-weight: 900;
            margin-bottom: 6px;
            color:rgb(245, 168, 168);
            text-shadow: 0 0 4px rgba(0,0,0,0.45);
            ">
            Dimension: ${d.name} [${d.idx}]
            </div>
        `;
        
        if (d_req(d)) {
            str += reqCard(d.c);
            return str;
        }
        
        str += dimDescCard(d);

        str += infTierCardHandler(d);

        str += dimRewardCard(d);

        if(d.debuff !== '') 
            str += interventionCard(d);

        //laws
        
        return str;
    }

    function dimRewardCard(d) {
        if(d.id == 'eternity')
            return "";

        let desc = "";
        let title = "Reward";
        let baseColor = '#9cedd2';
        let baseBackground = '#111d1b';
        let baseBorder = '#ffe8df';
      
        switch (d.id) {
            case "d-overstage":
                desc = dark_energy_reward(d);
                break;
              
            case "d-unlimitted":
                desc = d_unlimitted_handle(d);
                break;
              
            case "d-noBuffs":
                desc = d_buffs_handle(d);
                break;
          
            case "d-danger":
                desc = d_danger_reward_handle(d);
                break;
          
            case "d-noSpace":
                desc = d_noSpace_reward_handle(d);
                break;
          
            case "d-damage":
                desc = d_damage_reward_handle(d);
                break;
            case "d-next":
                desc = d_next(d);
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

    const infTierCardHandler = (d) => {
        dId = d.idx;

        if(d.id == 'eternity')
            return "";
        else 
            return infinityTierCard(d.infTier);
    }

    function infinityTierCard(cur, max = null) {
        const tier = infTierTemplate(cur, max);
      
        return `
          <div style="
            padding: 6px 10px;
            border-radius: 6px;
            background: rgba(255,215,0,0.1);
            border-left: 3px solid gold;
            font-size: 14px;
            color: gold;
            margin-bottom: 10px;
          ">
            ${tier}
          </div>
        `;
    }

    function infTierTemplate (cur, max) {
      let e = getBaseTierSourses(dId);

      let inf = e > 0? `Infinity [T${cur} + ${e}]`: `Infinity [T${cur}]`;
      let tier = max ? `${inf}/[T${max}]` : inf;

      return tier;
    }

    function dimDescCard(d) {
        let desc = "";
        let baseColor = '#ffd3d3'
      
        switch(d.id){
          case "eternity":
            desc = dark_dimensions_handle();
            break;
          case "d-noSpace": 
            desc = d_noSpace_des_hanlde(d);
            break;
          case "d-danger": 
            desc = d_danger_des_handle(d);
            break;
          case "d-overstage":
            desc = d_overstage_des_handle(d);
            break;
          case "dimMerge":
            desc = dimmergeDesc();
            break;
          default:
            desc = d.d;
            break;
        }
      
        return `
          <div style="
            background: #1d1f2e;
            padding: 10px 12px;
            border-radius: 8px;
            color: ${baseColor};
            font-size: 14px;
            margin-bottom: 12px;
            line-height: 1.3;
            border: 1px solid rgba(255,255,255,0.12);
          ">
            ${desc}
          </div>
        `;
    }

    function reqCard(text) {
        return `
            <div style="
              background: rgba(255,70,70,0.12);
              border-left: 3px solid #ff4646;
              padding: 6px 10px;
              border-radius: 6px;
              color: #ff6a6a;
              font-size: 14px;
              margin-bottom: 10px;
              line-height: 1.25;
            ">
              ${text}
            </div>
          `;
    }

    function interventionCard(d) {
        return `
          <div style="
            background: rgba(180, 32, 48, 0.12);
            border: 1px solid #e74c61;
            padding: 10px 12px;
            border-radius: 10px;
            margin-bottom: 12px;
            box-shadow: 0 0 8px rgba(231, 76, 97, 0.25);
          ">
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #ff7a8d;
              text-transform: uppercase;
              margin-bottom: 4px;
              letter-spacing: 0.4px;
            ">
              Intervention
            </div>
      
            <div style="
              font-size: 14px;
              font-weight: 500;
              color: #e74c61;
              line-height: 1.3;
            ">
              ${d.debuff}
            </div>
          </div>
        `;
    }




    function d_noSpace_des_hanlde(d) {
        const base = d.d; 
        const required = 6 + (d.infTier * 6);
      
        return base.replace(/\d+\s+Space?/, `<span style='color: yellow'>${required} Space Creatures</span>`) + `<br><br>`;
    }

    function d_danger_des_handle(d) {
        let danger = 1000 + 500 * d.infTier;
        let stage = 100 + 10 * d.infTier;
      
        return `
          Enter the dimension where <span style='color: orange'>[D-Space]</span> stays its presence within <span style='color: orange'>Dimension Colossuses</span>. 
          You will encounter this entity in Stage <span style='color: gold'>[${stage}+]</span>, Danger <span style='color: gold'>[${danger}+]</span>. 
          Defeat it to unlock the path to the next Infinity Tier and awaken a new dimension dark creature.
          <br><br>
        `
    }

    function d_overstage_des_handle(d){
        return `<div>
            Enter the Dimension where bosses are replaced by 
            <span style="color:#8af7ff; font-weight:700;">Obscurants</span>.<br>
            Kill the 
            <span style="color:#8af7ff; font-weight:700;">Obscurants</span> 
            to obtain a 
            <span style="color:#b0ffde; font-weight:700;">Dark Energy Shard</span>.<br>
            Total Obscurants: 
            <span style="color:#f7d774; font-weight:700;">5</span> 
            <span style="color:#62f2c8;">(+1 per Infinity Tier)</span>.<br>
            In the next Infinity Tier you will 
            <span style="color:#ff6a6a; font-weight:700;">lose all shards</span>,
            but gain a 
            <span style="color:#b0ffde; font-weight:700;">Shard Multiplier</span> 
            for the following Infinity Tier.<br>
            Obscurants start spawning from 
            <span style="color:#f7d774; font-weight:700;">Stage 100</span>.<br>
            <span style="color:#b0ffde; font-weight:700;">Dark Energy Shards</span>
            directly affect your 
            <span style="color:#8af7ff;">Max Level</span>.
          </div>`
    }

    function dark_dimensions_handle(){
  
        function dimCard(text, color = "#9cedd2") {
          return `
            <div style="
              background: #0b1414;
              border-left: 3px solid ${color};
              padding: 10px 12px;
              border-radius: 8px;
              color: #d8fffa;
              margin-bottom: 12px;
              line-height: 1.35;
              font-size: 14px;
            ">
              ${text}
            </div>
          `;
        }
        let str = "";
      
        str += dimCard(
          "Dark Dimensions have no Infinity Cap."
        );
      
        str += dimCard(
          `You must reach 
          <span style="color:#b3ffe9;font-weight:600;">Total Level 1400</span> 
          to unlock the next Infinity Tier.`
        );
      
        str += dimCard(
          "Each new Infinity Tier becomes more difficult than the previous one."
        );
      
        str += dimCard(
          "Infinity Resistance does not apply in Dark Dimensions."
        );
      
        str += dimCard(
          "Each new Dark Dimension inherits part of the strength from the previous one."
        );
      
        str += dimCard(
          "The effect of the intervention weakens with each Infinity Tier of this dimension."
        );
      
      
      
        return str;
    }



    function dark_energy_reward(d){
        let text = ``;
      
        let percent = d.infTier;
        let totalInfs = dimensions.value.filter(d => d.id.startsWith('d-')) .reduce((sum, d) => sum + d.infTier, 0) 
      
        if(d.infTier < 10)
          text += `Reach <span style="color: gold">Infinity [T10]</span> to unlock new influence of Dark Energy<br>`;
        else text += `Dark Energy is gathering the power of infinities from all dark dimensions and empowers itself with <span style="color: gold">${percent}%</span> of the total 
        <span style="color: gold">infinities [${totalInfs}]</span>. This effect increases with each Infinity Tier<br>  `;

        if(d.infTier >= 10 && d.infTier < 15)
          text += `<br>Reach <span style="color: gold">Infinity [T15]</span> to unlock new influence of Dark Energy<br><br>`;
        else if (d.infTier >= 15) text += `<br>You retain the MAX amount of Dark Energy Shards.<br><br>`
      
        text += `<span style="color: #9cedd2">Max Level [^${(enemy.value.darkEnergy.deTotal).toFixed(4)}]</span><br>`
      
        return text;
    }

    function d_unlimitted_handle(d) {
        
        let text = `
          Reward: Weakens <span style='color: rgb(255, 88, 88)'>[D-Ultimatum]</span> 
          <span style='color: gold'>[T${d.infTier}]</span>
          <span style='color: rgb(204, 102, 255)'>${getDimReward(38).current}</span> 
          -> <span style='color: gold'>[T${d.infTier + 1}]</span>
          <span style='color: rgb(204, 102, 255)'>${getDimReward(38).next}</span><br>
          
          EXP MULT for dimension [5] [S5-Ω3t]: 
          <span style='color: rgb(204, 102, 255)'>${fn(getDimReward(38).expMult)}</span><br>
        `;

        if (d.infTier < 10) {
          text += `<br>Reach <span style="color: gold">Infinity [T10]</span> to unlock new feature`;
        } else {
          text += `<br>Weakening of the [D-Ultimatum] every 5 Infinity Tier starting from Infinity [T10]<br>`;
        }

        if (d.infTier >= 20 && d.infTier < 25) {
          text += `<br>Reach <span style="color: gold">Infinity [T25]</span> to unlock new feature`;
        } else if (d.infTier >= 25) {
          text += `<br>Infinities from Dark Dimensions reduces the Level Requirement for [D5] 
          <b style="color: gold">[^${fn(getDimReward(38).lvlRed)}]</b><br>`;
        }
      
        return `<br><span style="color: #9cedd2">${text}</span><br>`;
    }

    function d_buffs_handle(d) {
        let buffTiers = [1, 4, 6, 8, 12, 16, 20, 25];
        let maxCount = 9;
        let count = Math.min(getBuffIntervalPosition(buffTiers, d.infTier), maxCount);
      
        const wrap = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;
      
        switch(count) {
          case 1: return wrap(`Reach Infinity [T1] to unlock Juggernaut [T4]`);
          case 2: return wrap(`Reach Infinity [T4] to unlock Berserk [T4]`);
          case 3: return wrap(`Reach Infinity [T6] to unlock First Strike [T4]`);
          case 4: return wrap(`Reach Infinity [T8] to unlock Traveller [T4]`);
          case 5: return wrap(`Reach Infinity [T12] to unlock Flexible [T4]`);
          case 6: return wrap(`Reach Infinity [T16] to unlock Flash [T4]`);
          case 7: return wrap(`Reach Infinity [T20] to unlock Fast Slash[T4]`);
          case 8: return wrap(`Reach Infinity [T25] to unlock Extra Life  [T4]`);
          case 9: return wrap(`Gain 1.25 Skill EXP MULT for each Infinity Tier above 25`)
          default: return wrap(`Gain 1.25 Skill EXP MULT for each Infinity Tier above 25`);
        }
    }

    function d_damage_reward_handle(d){
        let text = ``;
        if(d.infTier >= 20)
          text = `You have a 50% chance not to receive a stack of <span style="color: red">doom</span> when hit.<br><br>`;
        else if(d.infTier >= 10)
          text = `You have a 25% chance not to receive a stack of <span style="color: red">doom</span> when hit.<br>
          Reach <span style="color: gold">Infninity [T20]</span> to unlock new feature<br><br>`;
        else text = `Reach <span style="color: gold">Infninity [T10]</span> to unlock new feature<br><br>`;
      
      
        let warp = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;
      
        return text + warp(d.r);
    }

    function d_danger_reward_handle(d) {
        let warp = (text) => `<span style="color:#9cedd2">Dark Creature: <span style="color:red">${text}</span><br> | 
        Reduce Danger Power by [^${1 - 0.01 *d.infTier}] | Increase The cap of Dark Creatures</span><br>`;
      
        switch(d.infTier){
          case 0: return warp('Dreadfang');
          case 1: return warp('Voidborn Might');
          case 2: return warp('Overseer Prime');
          case 3: return warp('Baselurker');
          case 4: return warp('Infinity Bane');
          case 5: return warp('Crushdepth');
          case 6: return warp('Entropy Leech');
          case 7: return warp('Flameveil');
          case 8: return warp('Bloodhowl');
          case 9: return warp('Tormenthide');
          case 10: return warp('Plaguedozer');
          case 11: return warp('Malignhorn');

          default: return warp('All Dark Creatures are found.');
        }
    }

    function d_noSpace_reward_handle(d) {
        const base = d.r; 
        const weaker = (1 - 0.01 * d.infTier).toFixed(2);     
        const stardust = Math.max((Math.E * d.infTier) ** 0.45, 1).toFixed(2);  
        const count = 6 * d.infTier;

        let warp = (text) => `<span style="color:#9cedd2">Reward: ${text}</span><br>`;
      
        return warp(base
          .replace(/\[\^1\]/, `[^${weaker}]`)
          .replace(/\[1\]/, `[${stardust}]`)
          .replace(/\[6\]/, `[${count}]`));
    }

    function d_next (d) {
      const tier = d.infTier;

      if (tier >= 18) 
        return `Increase Ascension Shards gain by 1.25 for each Tier above 18. <b>[${fn(getDimReward(34))}]</b>`;
      else return d.r;
    }



    function getBuffIntervalPosition(arr, num) {
        if (num <= 0) return 1; 
      
        let pos = 1;
        for (let i = 0; i < arr.length; i++) {
          if (num >= arr[i]) {
            pos = i + 2; 
          } else {
            break;
          }
        }
        return pos;
    }

    return {
        setDarkCard
    }
}