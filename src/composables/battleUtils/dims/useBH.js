import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy.js";
import { usePlayer } from "../../utils/playerSetup.js";

import { dGravityHandler } from "../global/dGravityHandler.js";
import { fn } from "../../utils/global.js";


export const useBH = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();
    const { player } = usePlayer();

    const bhReq = [1, 3, 8, 30, 200, 1000];

    function bhTrial() {
        let str = ``;
        
        
        const tier = hero.value.bhTier;
      
        if(hero.value.tr.count >= bhReq[tier])
          hero.value.isBhBoss = true;
        
        if (!hero.value.isBhBoss) {
          str += `<span style="color: #a3ffe0">Reach transcendence ${bhReq[tier]}, to enter the Black Hole</span><br>`;
          if (tier === 0) {
            str += `<span style="color: yellow">Reach 70,000 True Level in main dimension</span>`;
          }
          return str;
        }

        str += `<span style="color: cyan; font-weight: bold">Black Hole [T${tier}]</span><br><br>`;
      
        if (tier >= 5) {
          str += `Face the Immortal Ruler of Gravity. Deal him enough damage to receive a worthy reward.<br><br>`
          str += `Total DMG dealt: <b style="color: gold">[${fn(hero.value.gravity.bhMaxDmg)}]</b><br><br>`
          str += dGravity();

          return str;
        }
      
       
        str += `<span style="color: #cccccc">
            Dive into the darkness of the Black Hole ruled by <span style="color: cyan">[D-Gravity]</span> to face the 
            <span style="color: cyan">Singulars</span>. 
            Each of their attacks is stronger than the previous. 
            When you die, your <span style="color: cyan">transcendence</span> will be destroyed, 
            and you will return to the main dimension.
        </span><br><br>`;
      
        const baseRewards = [
          `<span style="color: rgb(111, 245, 200)">+75 Singularity Levels</span>`,
          `<span style="color: gold">+0.05 IP MULT</span>`,
          `<span style="color: lightblue">Lever Rush & Stage Rush: +5%</span>`,
        ];
      
        const uniqueRewards = {
          0: `<span style="color: red">BUFF: Black Impulse [T1]</span><br>
              <span style="color: lime"><b>+0.1</b> Max Level MULT</span> per each <span style="color: cyan">Tr</span><br>
              <span style="color: gold">You start with 10m stardust</span>`,
          1: `<span style="color: red">BUFF: Black Impulse [T2]</span><br> 
              <b style="color: lime">+1.05</b> <span style="color: red">DMG</span> MULT per each <span style="color: cyan">Tr</span><br>
              <span style="color: gold">Unlock Auto-Forge</span>`,
          2: `<span style="color: red">BUFF: Black Impulse [T3]</span><br> 
              <span style="color: lightgreen"><b>+1</b> MIN LEVEL per each <span style="color: cyan">Tr</span></span><br>
              <span style="color: gold">Unlock Space-INF</span>`,
          3: `<span style="color: red">BUFF: Black Impulse [T4]</span><br> 
              <b style="color: lime">+0.005</b> <span style="color: orange">IP MULT</span> per each <span style="color: cyan">Tr</span><br> 
              <span style="color: gold">Unlock Timeline</span>`,
          4: `<b style="color: lime">-0.5%</b> <span style="color:#e600ff">Corruption Influence</span> per each <span style="color: cyan">Tr</span><br> 
              <span style="color: cyan">Unlock Singularity Shards</span>`,
        };

        
      
        str += `<span style="color: #a3ffe0">Rewards:</span><br>`;
        [...baseRewards, uniqueRewards[tier]].forEach(r => {
          str += `${r}<br>`;
        });
      
        return str;
    }

    function dGravity () {
      const dmgReward = [
        {
          reward: `Reduce Stage requirement for Singularity [D-S] by []`,
          req: `Reach [] DMG to improve this reward`
        },
        {
          reward: `Void Shards MULT []`,
          req: `Reach [] DMG to improve this reward`,
        },
        {
          reward: '[%] of Tr Power spreads to all dimensions',
          req: `Reach [] DMG to improve this reward`,
        },
        {
          reward: "[^] Starudst gain",
          req: `Reach [] DMG to improve this reward`,
        },
        {
          reward: 'Singularity Shards MULT []',
          req: `Reach [] DMG to improve this reward`,
        },
        
        {
          reward: "[] Corruption Shard",
          req: `Reach [] DMG to improve this reward`,
        },
        
      ]

      const rewards = dmgReward.map((r, i) => {

        const data = dGravityHandler(i, hero);
      
        let reward = r.reward;
        let req = r.req;
      
        reward = reward.replace('[]', `[${fn(data.v)}]`);
        reward = reward.replace('[^]', `[^${fn(data.v)}]`);
        reward = reward.replace('[%]', `[${fn(data.v)}%]`);
      
        req = req.replace('[]', fn(data.req));
      
        return `
          <div style="
            margin-top:8px;
            padding:10px;

            border-radius:12px;

            background:
              linear-gradient(
                135deg,
                rgba(20,30,40,0.85),
                rgba(10,15,25,0.95)
              );

            border:1px solid rgba(163,255,224,0.15);

            box-shadow:
              0 0 12px rgba(0,255,200,0.08),
              inset 0 0 18px rgba(163,255,224,0.05);
          ">

            <div style="
              color:#a3ffe0;
              font-weight:700;
              font-size:14px;

              text-shadow:
                0 0 10px rgba(163,255,224,0.25);
            ">
              ${reward}
            </div>

            <div style="
              margin-top:4px;

              color:#8b9bb4;
              font-size:12px;
              line-height:1.4;
            ">
              ${req}
            </div>

          </div>
        `;
      });

      

      return rewards.join("");
    }

    return {
        bhTrial
    }
}