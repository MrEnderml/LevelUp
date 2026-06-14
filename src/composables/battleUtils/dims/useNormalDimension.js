import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";

import { fn, timeFormat } from "../../utils/global.js";

import { dimensions } from "../../../data/dimensions.js";

import { useDimensions } from "../useDimensions.js";
import { useTimeline } from "./useTimeline.js";
import { usePlayer } from "../../utils/playerSetup.js";
import { useVoid } from "./useVoid.js";


export const useNormalDimension = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { player } = usePlayer();

    let dId = null;

    const { getDimSpecialReward, getDimReward, getDimEffect, getBaseTierSourses } = useDimensions();
    const { getAllActiveDims } = useTimeline();
    const { voidTimer, voidShardsDrop } = useVoid();

    const noTier = ['eternity', 'dimMerge'];
    const singleTier = ['time', 'abyss-d', 'survival-2','unlimitted', 'dimMerge'];

    const setNormalCard = (d, d_req) => {
        

        let str = `
            <div style="
            font-size: 18px;
            font-weight: 900;
            margin-bottom: 6px;
            color: #ffffff;
            text-shadow: 0 0 4px rgba(0,0,0,0.45);
            ">
            Dimension: ${d.name} [${d.idx}]
            </div>
        `;
        
        if (d_req(d)) {
            str += reqCard(d.c);
            return str;
        }
        
        str += dimDescCard(d)

        str += infTierCardHandler(d, d_req);

        str += dimRewardCard(d);

        str += dimSpecialRewardCard(d);

        if(d.id == 'time') 
            str += time_dim_sr_handle();
        
        return str;
    }

    function dimSpecialRewardCard(d) {
      if (d.sp == '') 
        return '';

      return `
            <div style="
              background: #e9faff;
              padding: 10px 12px;
              border-radius: 10px;
              margin-bottom: 10px;
              text-align: center;
              box-shadow: 0 0 8px rgba(0, 240, 255, 0.45);
              border: 1px solid #b8f5ff;
            ">
              <div style="
                font-size: 16px;
                font-weight: 900;
                text-transform: uppercase;
                color: #007e89;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">
                Special Reward
              </div>
              <div style="
                font-size: 14px;
                font-weight: 600;
                color: #00606b;
              ">
                ${d.sp}
              </div>
            </div>
          `;
    }

    function dimRewardCard(d) {
        if(d.r == "") 
            return "";

        let desc = "";
        let title = "Reward";
        let baseColor = '#006f75';
        let baseBackground = '#dffeff';
        let baseBorder = '#b2f2f5';
      
        switch (d.id) {
          case "noBuffs":
            desc = `Skill EXP Boost: <span style="color:#00a8ff;font-weight:700">
                      ${fn(getDimReward(11))}
                    </span>`;
            break;
          
          case "unlimitted":
            desc = unlimit_dim_r_handle();
            break;

          case "danger":
            desc = `Max Danger: <span style="color:#ff7f50;font-weight:700">
                      +${fn(getDimReward(15))}
                    </span>`;
            break;
      
          case "damage":
            desc = `Damage MULT: <span style="color:#ff4d4d;font-weight:700">
                      ${fn(getDimReward(20))}
                    </span>`;
            break;
      
          case "survival-2":
            desc = `
              Max stage: <span style="color:#00a8ff;font-weight:700">
                ${hero.value.dims.survival.stage}
              </span><br>
              Rune of Live is active until Level 
              <span style="color:#00a8ff;font-weight:700">
                ${Math.floor(getDimReward(21).level)}
              </span>
            `;
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

    const infTierCardHandler = (d, d_req) => {
        dId = d.idx;

        if (d.id === 'main' && hero.value.mainInfTierCap > 60)
          return infinityTierCardCorr(hero.value.mainInfTier, hero.value.mainInfTierCap);

        else if (d.id === 'main')
          return infinityTierCard(hero.value.mainInfTier, hero.value.mainInfTierCap);
        
        else if (noTier.includes(d.id)) 
            return "";

        else if (singleTier.includes(d.id) && !d_req(d)) 
            return infinityTierCard(d.infTier);
        
        else if (!d_req(d)) 
            return infinityTierCard(d.infTier, d.maxInfTier);       
    }

    function infinityTierCardCorr(cur, max) {
      const tier = max ? `Infinity [T${cur}]/[T${max}]` : `Infinity [T${cur}]`;
      
      return `
        <div style="
          padding: 6px 10px;
          border-radius: 6px;
          background: rgba(153, 102, 255, 0.1); 
          border-left: 3px solid #d3a0ff;       
          color: #d3a0ff;  
          font-size: 14px;
          margin-bottom: 10px;
        ">
          ${tier}
        </div>
      `;
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

      let inf = e > 0? `Infinity [T${cur}+${e}]`: `Infinity [T${cur}]`;
      let tier = max ? `${inf}/[T${max}]` : inf;

      return tier;
    }

    function dimDescCard(d) {
        let desc = "";
        let baseColor = '#d3e1ff';
      
        switch(d.id){
          case "main":
            desc = main_dim_des_handle();
            break;
          case "hard": 
            desc = `Enter the dimension where curses are [T5] and they are permanent. 
            You can't get Essense from curses. Abyss is locked.
            Reach Stage <span style="color:#00a8ff;font-weight:700">

            ${100 + 5 * (d.infTier - 20)}
            </span> to be able to advance to the next Infinity Trial.
             You start with Infinity [T20].`;
            break;
          case "overstage":
            desc = `Enter the Dimension where you start from Stage 
            <span style="color:#00a8ff;font-weight:700">
            ${100 + 10 * (d.infTier - 20)}
            </span>.`;
            break;
          case "dimMerge":
            desc = (hero.value.dims.corrShards >= 20? merge_dim_des_handle(): corr_dim_des_handle()); 
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


    function main_dim_des_handle() {
        function dimCard(text, color = "#8af7ff") {
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
        str += dimCard("The Infinity Trial is completed automatically in dimensions");
        str += dimCard("Abyssal Covenant – fulfill the Abyssal requirements, and the Abyss will be completed automatically. Only works in other dimensions.");
        str += dimCard("The Influence of the Infinity Expansions extends to all dimensions.");
        str += dimCard("Get a reward for each Infinity trial you complete in the dimension");
        str += dimCard("A special reward is given when you complete all Infinity trials in the dimension.");
      
        return str;
    }

    function corr_dim_des_handle () {
      let d = hero.value.dims;

      let text = ` Travel through all dimensions using <span style="color:#cc66ff; font-weight:600">Corruption Shards</span> to unlock
      <span style="color:#b6ff00; font-weight:700">Dimensional Mergence</span>.<br><br>
      <span style="color:#cc66ff"> Corruption Shards: <strong>${d.corrShards} / 20</strong></span><br><br>

      <span style="color:#b726ff; font-weight:bold">[D-Corruption]</span> exerts his power over this world by twisting <span style="color:#cc66ff">corruption</span>.
      Each <span style="color: #cc66ff">Corruption Shard</span> increases the <span style="color:gold">Infinity Cap</span> in the main dimension, but also strengthens the
      <span style="color:#cc66ff">Corruption Influence</span>.<br><br>

      <span style="color:gold"> +2 to Infinity Cap <strong>[${2 * d.corrShards}]</strong></span><br>
      <span style="color:#cc66ff">+1% Corruption Influence <strong>[${d.corrShards}%]</strong></span><br><br>

      Reach <span style="color: gold; font-weight:700">[T${60 + 2 * d.corrShards}]</span>
      in the main dimension to unlock the next <span style="color:#cc66ff">Corrupted Dimension</span>.`

      return text;
    }

    function merge_dim_des_handle () {
      let text = `By combining the power of all dimensions, you created a crack in the world that leads into the <span style="color: #b6ff00"><b>Void</b></span>, where its own laws.<br>
      Upon entering the <span style="color: #b6ff00"><b>Void</b></span>, each completed stage will increase the demands on all aspects. The <span style="color: #b6ff00"><b>Void</b></span> is directly connected to other <span style="color: cyan"><b>[D-Rulers]</b></span>, so each completed stage 
      also increases <span style="color: #cc66ff"><b>Corruption Influence</b></span> and <span style="color: gold"><b>Infinity Penalty</b></span><br> 
      As you progress through stages, you absorb <span style="color: #b6ff00"><b>Void Shards</b></span>, which accumulate and can be consumed every 8 hours.<br><br>
      <span style="color: #b6ff00"><b>Objective: Find the [D-Eternity] to learn more information about the [D-Rulers].</b></span><br><br>
      
      Max Stage: <span style="color: #b6ff00"><b>${hero.value.void.stage}</b></span><br>
      <span style="color: #b6ff00"><b>Accumulated Void Shards: ${fn(voidShardsDrop())}</b></span><br>
      Remained Time to consume Void Shards: <span style="color: #b6ff00"><b>${timeFormat(hero.value.void.time)}</b></span><br>`;

      return text;
    }

    function unlimit_dim_r_handle(){
        let unlimitD = `
        <span>Max Level: ${hero.value.unlimitLevel}</span>/<span>[${getDimReward(5).maxUnlimmit}]</span><br><br>
        <span>
        EXP MULT: ${fn(getDimReward(5).exp)} <br>
        Max Level MULT: ${fn(getDimReward(5).maxLevel)} <br>
        MIN Level: ${getDimReward(5).min}<br>
        </span><br>
        ${unlimit_bonuses(hero.value.unlimitLevel)}
        `
      
        return unlimitD;
    }

    function unlimit_bonuses(lvl) {
        function dimCard(text, color = "#8af7ff") {
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

          
        const goals = [
          { lvl: 2000, text: '' },
          { lvl: 3000, text: 'Reduce the Prediction Penalties by 1% for each 200 levels' },
          { lvl: 4000, text: '+0.01 Infinity Resistance for each 500 levels' },
          { lvl: 5000, text: 'Increase the effect of the unlocked Infinity Goals [T2] by 1% for each 100 levels' },
          { lvl: 6000, text: '-1% of Corruption Influence for each 500 levels' },
          { lvl: 7000, text: '+0.01 Void Shards MULT for each 100 levels in this dimension' },
          { lvl: 8000, text: '+0.01 Singularity Shards MULT for each 1000 levels' },
          { lvl: 9000, text: '+1 Corruption Shard for each 2000 levels' },
          { lvl: 10000, text: '+1 Base Tier to all dimensions for each 10000 levels' },
          { lvl: 12500, text: 'Reduce Stage Requiremrnt for each 500 levels' },
          { lvl: 15000, text: 'Increase Stardust gain by 1.1 for each 1000 levels' },
          { lvl: 17500, text: 'Increase IP MUlT by 0.01 for each 500 levels' },
          { lvl: 20000, text: '[D-Unlimatum] no longer affects this dimension.' },
        ];
      
        let result = '';
        let lockedShown = false;

        let infBonus = Math.max(Math.floor((hero.value.unlimitLevel - 1500) / 500), 0);
        let bonus = (infBonus * 5 + 1) ** 1.5;
      
        for (const g of goals) {
            if (g.lvl === 2000 && lvl >= g.lvl) {
              result += dimCard(
                `Reach Level ${2000 + 500 * infBonus} to get an additional EXP MULT by ${fn(bonus)} when you are in D5`,
                "#8af7ff"
              );
            }
            else if (lvl >= g.lvl) {
              result += dimCard(g.text, "#8af7ff");
            } else if (!lockedShown) {
              result += dimCard(
                `Reach Level ${g.lvl} to unlock a new Feature`,
                "#ff8a8a"
              );
              lockedShown = true;
            }
          }
      
        return result;
    }
      

    function time_dim_sr_handle() {
        return `
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
    }

    function timeFormat(t) {
        if (isNaN(t) || t == null) return '00:00';
      
        const sec = Math.floor(t % 60).toString().padStart(2, '0');
        const min = Math.floor((t / 60) % 60).toString().padStart(2, '0');
        const hr  = Math.floor((t / 3600) % 24).toString().padStart(2, '0');
        const days = Math.floor(t / 86400);
      
        if (days > 0) {
          return `${days}d ${hr}:${min}:${sec}`;
        } else if (hr !== '00') {
          return `${hr}:${min}:${sec}`;
        } else {
          return `${min}:${sec}`;
        }
    }

    function dTime(){
      if (hero.value.dTimeReward > 0) {
        const time = hero.value.dTimeReward;
        const speedMult = time <= 60 ? 2 : 1;
    
        const afkPercent = Math.max(Math.min((15 / Math.log(Math.max(time, 3))) * speedMult, 10), 1);
        const afkDuration = Math.min((7.5 / Math.sqrt(Math.max(time, 3))) * speedMult, 5);
    
        return `Reward: Each ${Math.round(100 / afkPercent)} killed enemy grants the AFK boost for ${afkDuration.toFixed(1)}s<br>`;
      } else {
        return `Reward: 0% to get AFK boost for 0s<br>`;
      }
    }

    return {
        setNormalCard
    }
}