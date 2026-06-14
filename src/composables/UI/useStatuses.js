import { useBaseEnemy } from "../utils/enemySetup";
import { usePlayer } from "../utils/playerSetup"

import { fn } from "../utils/global";
import { newicons } from "../icons";
import { useHero } from "../useHero";
import { useSpecialStats } from "../battleUtils/useSpecialStats";
import { useDimensions } from "../battleUtils/useDimensions";



export const useStatuses = () => {
    const { hero } = useHero();
    const { trHandle } = useSpecialStats();
    const { getDimReward } = useDimensions();

    const statusPlayerHandler = (player, villian) => {
        let pList = [];
        let s = player.status;
        let vs = villian.status;
        

        if(hero.value.tr.count >= 1 && hero.value.dId == 'main' || 
            hero.value.tr.bhCount >= 1 && hero.value.dId == 'bh' || 
            hero.value.tr.count >= 1 && hero.value.dId == 'advanceBH' || 
            trHandle().tr >= 1 && trHandle().status == 'd') {
            pList.push({
                type: 'buff-1',
                status: "pos",
                icon: '🌀',
                text: trTextHandle(hero.value.tr)
            })
        }

        if(s.stun.d > 0) {
            pList.push({
                type: 'stun',
                status: "neg",
                icon: '💫',
                text: `<span style="color:#9ca3af;">Stun: <b>${s.stun.d.toFixed(1)}</b></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Curse [Stun]</span>`
            })
        }

        if(s.bleeding.time > 0) {
            let b = s.bleeding;
            pList.push({
                type: 'bleed',
                status: "neg",
                icon: '🩸',
                text: `<span style="color:#9ca3af;">Bleeding deals you <b style="color: red">${fn(b.dmg)} DMG</b> per second. 
                Remain time: <b style="color: gold">${b.time.toFixed(1)}</b></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Curse [Bleeding]</span>`
            })
        }

        


        if(s.invisible.penetrateImmune) {
            pList.push({
                type: 'buff-2',
                status: "pos",
                icon: '⚙️',
                text: `<span style="color: yellow">You cannot be penetrated</span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Invisible [T3]</span>`
            })
        }

        if(s.stun.immune) {
            pList.push({
                type: 'immune',
                status: "pos",
                icon: '💫',
                text: `<span style="color: yellow">You cannot be stunned</span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Invisible [T4]</span>`
            })
        }

        if(s.conquer.time && player.buff.activeBuffs.includes(8)) {
            pList.push({
                type: 'buff-3',
                status: "pos",
                icon: '🕐',
                text: `${conquerText(s.conquer)}`
            })
        }

        

        

        if(getDimReward(21).req) {
            pList.push({
                type: 'buff-4',
                status: "pos",
                icon: newicons["survivalStage"],
                text: `<span style="color:lightgreen; font-weight:bold;">Rune of Life</span>
                
                <span style="color:#9ca3af;">You gain <b style="color: red">${fn(getDimReward(21).dmg)} DMG</b> until Level <span style="color: lightgreen"><b>${fn(getDimReward(21).level)}</b></span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">D21</span>`
            })
        }

        if(hero.value.dims.damage.kills > 0) {
            pList.push({
                type: 'buff-5',
                status: "pos",
                icon: newicons["killStack"],
                text:  `<span style="color:#9ca3af;">Kills: </span><span style="color:#facc15;"><b>${fn(hero.value.dims.damage.kills)}</b></span>
                <span style="color:#9ca3af;">DMG MULT: </span> <span style="color:#f87171;">x<b>${fn(hero.value.dims.damage.effect)}</b></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">D28</span>`
            })
        }

        if(hero.value.dims.veil.stacks > 0) {
            pList.push({
                type: 'buff-6',
                status: "pos",
                icon: newicons["veilStacks"],
                text:  `<span style="color:#f87171; font-weight:bold;">Veil</span><br><br><span style="color:#9ca3af;">You are under the effect of <span style="color: #F8686A"><b>Veil Rune</b></span>, doubling your stats. Each time you die, one charge is removed. Veil's effect is removed when the charges count reaches zero.<br> Remaining charges: <span style="color: yellow"><b>${hero.value.dims.veil.stacks}</b></span></span>
                <span style="font-size: 11px; color: #ffb3b3;">Veil charges can be restored by starting a new Infinity Trial or by traveling between dimensions. The MAX count of charges depends on the Infinity Tier of Dimension [30]</span>

                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">D30</span>`
            })
        }

        if (s.juggernaut.extraDef > 1) {
            pList.push({
                type: 'buff-6-5',
                status: "pos",
                icon: newicons["jugger"],
                text:  `<span style="color:#9ca3af"><b style="color: gold">+${fn(s.juggernaut.extraDef)}</b> DEF MULT based on Max HP</span>

                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Juggernaut [T3]</span>`
            })
        }

        if(s.berserk.isRage) {
            pList.push({
                type: 'buff-7',
                status: "pos",
                icon: newicons["rage"],
                text:  rageHandle(s.berserk),
            })
        }

        if(s.flash.status) {
            let f = s.flash;
            pList.push({
              type: 'buff-8',
              status: "pos",
              icon: newicons["extraHits"],
              text: `<span style="color:#facc15;">Extra Hits:</span> <span style="color:#fde047;">${f.extraHits}</span>
                <span style="color:#9ca3af;">Reach Attack Speed <span style="color:#86efac;">${fn(f.hitReq)}</span> to gain extra hit.</span>
          
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Flash [T4]</span>`
            })
          }
        
        if(s.blackImpulse.dmgBonus > 0) {
            pList.push({
                type: 'buff-9',
                status: "pos",
                icon: newicons['blackDiff'],
                text: `<span style="color:#9ca3af;">You deal <span style="color: cyan">${fn(s.blackImpulse.dmgBonus)}</span>x bonus DMG.</span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Black Impulse [T4]</span>`
            })
        } 
        


        if(s.charges.power > 0) {
            pList.push({
                type: 'charges-1',
                status: "pos",
                icon: newicons['redCharge'],
                text: `<span style="color:#9ca3af;"> +<b style="color:#f87171;">5%</b> DMG and <b style="color:#f87171;">0.05</b> Attack Speed per power charge
                <b style="color:#f87171;">Power charges: ${s.charges.power}</b> </span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Charges</span>`
            })
        }

        if(s.charges.energy > 0) {
            pList.push({
                type: 'charges-2',
                status: "pos",
                icon: newicons['blueCharge'],
                text: `<span style="color:#9ca3af;">+<b style="color:#60a5fa;">1%</b> CRIT and <b style="color:#60a5fa;">0.1</b> CRIT DMG per energy charge
                 <b style="color:#60a5fa;">Energy charges: ${s.charges.energy}</b></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Charges</span>`
            })
        }

        if(s.charges.life > 0) {
            pList.push({
                type: 'charges-3',
                status: "pos",
                icon: newicons['greenCharge'],
                text: `<span style="color:#9ca3af;">+<b style="color:#4ade80;">5%</b> HP and <b style="color:#4ade80;">2%</b> less DMG taken per life charge
                <b style="color:#4ade80;">Life charges: ${s.charges.life}</b></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Charges</span>`
            })
        }


        if(s.extraLife.charges > 0) {
            let e = s.extraLife;
            pList.push({
                type: 'extraLife',
                status: "pos",
                icon: `❤️`,
                text: `<span style="color:#9ca3af;">You may rise <span style="color: yellow"><b>${e.charges}</b></span> time${e.charges === 1 ? '' : 's'} per fight</span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Extra Life [T1]</span>`
            })
        }

        if(s.extraLife.buffTime > 0) {
            let e = s.extraLife;
            pList.push({
                type: 'buff-10',
                status: "pos",
                icon: newicons["extraLifeBuff"],
                text: `<span style="color:#9ca3af;">Damage incresed by <span style="color: yellow"><b>1.5</b></span> and DEF increasd by <span style="color: yellow"><b>2</b></span>
                Time: <span style="color: yellow"><b>${e.buffTime.toFixed(1)}<b></span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Extra Life [T2]</span>`
            })
        }

        if(s.extraLife.immuneTime > 0) {
            let e = s.extraLife;
            pList.push({
                type: 'buff-11',
                status: "pos",
                icon: '🧘',
                text: `<span style="color: yellow">You are immune to damage</span>
                Time: <span style="color: yellow"><b>${e.immuneTime.toFixed(1)}<b></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Extra Life [T3]</span>`
            })
        }


        if(s.irradiation.stacks > 0) {
            pList.push({
                type: 'buff-12',
                status: "pos",
                icon: newicons['toxicCharge'],
                text: `<span style="color:#9ca3af;">Toxic charges: <span style="color:#b6ff00"><b>${s.irradiation.stacks}</b></span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Irradiation [T3]</span>`
            })
        }
        
        if(s.flexible.buffTime > 0) {
            pList.push({
                type: 'buff-14',
                status: "pos",
                icon: newicons["acrobaticStacks"],
                text: `<span style="color:#9ca3af;">You are dealing double DMG
                Time <span style="color: yellow"><b>${s.flexible.buffTime.toFixed(1)}</b></span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Flexible [T3]</span>`
            })
        }

        if(s.flexible.stacks > 0) {
            pList.push({
                type: 'buff-13',
                status: "pos",
                icon: '🤺',
                text: `<span style="color:#9ca3af;">Dodge stacks: <span style="color:lightgreen"><b>${s.flexible.stacks}</b></span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Flexible [T2]</span>`
            })
        }
          
        if(s.extraLife.shields > 0) {
            pList.push({
              type: 'buff-15',
              status: "pos",
              icon: newicons["divineShield"],
              text: `<span style="color:#facc15;">Divine Shields:</span> <span style="color:#fde047;"><b>${s.extraLife.shields}</b></span>
          
              <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Extra Life [T4]</span>`
            })
        }

        

        if(s.combo.value > 0) {
            pList.push({
                type: 'buff-16',
                status: "pos",
                icon: newicons["combo"],
                text: `<span style="color:#facc15;">Combo [Stacks]: <span style="color: yellow"><b>${fn(s.combo.value)}</b></span>
                DMG MULT: <span style="color: yellow"><b>${fn(s.combo.dmg)}</b></span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Combo</span>`
            })
        }

        if(s.blackImpulse.stacks > 0) {
            pList.push({
                type: 'buff-17',
                status: "pos",
                icon: newicons['blackImpulse'],
                text: `<span style="color:#9ca3af;">Impulse Charges: <span style="color: cyan">${s.blackImpulse.stacks}</span>
                Impulse Chance: <span style="color: yellow">${fn(s.blackImpulse.chance * 100)}%</span>
                DMG bonus: <span style="color: red">${fn(1.2 ** s.blackImpulse.stacks)}</span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Black Impulse [T1]</span>`
            })
        }  

        if(player.hp < player.stats.final.hp * s.berserk.lowLife && s.berserk.status) {
            pList.push({
                type: 'buff-18',
                status: "pos",
                icon: newicons['lowLife'],
                text: `<span style="color: #ff4d4d">You are on low life</span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Berserk</span>`
            })
        }

        return pList;
    }

    const statusVillianHandler = (player, villian) => {
        let vList = [];
        let v = villian.status;
        let vs = villian.space;
        let p = player.status;
        let h = hero.value;

        if(h.bhTier >= 0 && h.dId == 'bh') {
            vList.push({
                type: 'buff-1',
                status: "pos",
                icon: newicons["bhStacks"],
                text: `<span style="color:#9ca3af;">Each hit grants the Singular a stack of Singularity.
                Each stack increases damage.
                
                Stacks: <b style="color: gold">[${villian.bh.stacks}]</b></span>`
            })
        }

        if(h.bhTier >= 0 && h.dId == 'bh') {
            vList.push({
                type: 'buff-2',
                status: "pos",
                icon: newicons["bhAps"],
                text: `<span style="color:#9ca3af;">Attack Speed cannot drop below <b style="color: gold">${fn(villian.bh.aps)}</b></span>`
            })
        }

        if(h.bhTier >= 1 && h.dId == 'bh') {
            vList.push({
                type: 'buff-3',
                status: "pos",
                icon: newicons["bhExtraStack"],
                text: `<span style="color:#9ca3af;">Each hit has a <b style="color: gold">${fn(villian.bh.extraStack * 100)}%</b> chance to grant an extra Singularity stack</span>`
            })
        }

        if(h.bhTier >= 2 && h.dId == 'bh') {
            vList.push({
                type: 'buff-4',
                status: "pos",
                icon: newicons["bhStunImmune"],
                text: `<span style="color:#9ca3af;">Cannot be stunned</span>`
            })
        }

        if(h.bhTier >= 3 && h.dId == 'bh') {
            vList.push({
                type: 'buff-5',
                status: "pos",
                icon: newicons["bhDodgeIgnore"],
                text: `<span style="color:#9ca3af;">Attacks always hit</span>`
            })
        }

        if(h.bhTier >= 4 && h.dId == 'bh') {
            vList.push({
                type: 'buff-6',
                status: "pos",
                icon: newicons["bhSpike"],
                text: `<span style="color:#9ca3af;">When the Singular takes damage, it triggers Self-Destruction that deals <b style="color: gold">${fn(villian.bh.selfDestruction)}</b><span>`
            })
        }

        if(h.bhTier >= 5 && h.dId == 'bh') {
            vList.push({
                type: 'buff-8',
                status: "pos",
                icon: newicons["bhDmgImmune"],
                text: `<span style="color:#9ca3af;">Total DMG dealt: <b style="color: gold">[${fn(h.gravity.bhDmg)}]</b></span>`
            })
        }


        if(villian.spawnType == 'd-corruption') {
            vList.push({
                type: 'buff-10',
                status: "pos",
                icon: newicons["dCorrDmg"],
                text: `The <span style="color: #ff00f2"><b>[D-Corruption]</b></span> spreads his influence by dealing overtime DMG <span style="color: red"><b>[${fn(villian.dCorr.dmg)}]</b></span>.
                DMG dealt increases every second.`
            })
        }

        if(villian.spawnType == 'd-corruption') {
            vList.push({
                type: 'buff-11',
                status: "pos",
                icon: newicons["dCorrInvis"],
                text: `The <span style="color: #ff00f2"><b>[D-Corruption]</b></span> is <span style="color: yellow">immune</span> to DMG from Hits`
            })
        }

        if(villian.spawnType == 'd-corruption') {
            vList.push({
                type: 'buff-12',
                status: "pos",
                icon: newicons["dCorrHealPenalty"],
                text: `<span style="color: #ff00f2">Corruption</span> corrodes the flesh, reducing the HEAL MULT by <span style="color: red"><b>[${fn(villian.dCorr.healMult)}]</b></span>.
                The effect increases every second.`
            })
        }

        if(villian.spawnType == 'd-corruption') {
            vList.push({
                type: 'buff-13',
                status: "pos",
                icon: newicons["dCorrTime"],
                text: `Remain Time: <span style="color: #ff00f2"><b>${(Math.max(30 - villian.dCorr.time, 0)).toFixed(1)}s</b></span>.`
            })
        }



        if(v.stun.d > 0) {
            vList.push({
                type: 'stun',
                status: "neg",
                icon: '💫',
                text: `Stun: <b style="color: gold">${v.stun.d.toFixed(1)}</b>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">First Strike [T3]</span>`
            })
        }

        if(p.sniper.apsSlowTime > 0) {
            vList.push({
                type: 'debuff',
                status: "neg",
                icon: newicons["sniperSlowBuff"],
                text: `Attack speed decreased by ${fn(p.sniper.apsSlow)}%
                Time: <span style="color: yellow">${p.sniper.apsSlowTime.toFixed(1)}</span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Sniper [T2]</span>`
            })
        }

        if(vs.fightCooldown > 0 && villian.id == "space") {
            vList.push({
                type: 'buff',
                status: "pos",
                icon: '🕐',
                text: `After the time expires, the player dies.
                Time: <span style="color: #e65f5f">${vs.fightCooldown.toFixed(1)}</span>`
            })
        }

        if(v.weakStack.count > 0) {
            vList.push({
                type: 'buff',
                status: "neg",
                icon: newicons["weakStack"],
                text: `Charges: <span style="color: #f424fb">${v.weakStack.count}</span>
                Each charge reduces enemy Power by 1%. Max Charges <b style="color: red">[90]</b>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">D2</span>`
            })
        }

        // Dark Energy Bosses

        if(villian.deBoss.tier >= 1 && villian.spawnType == 'deBoss') {
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["deBossRegen"],
                text: `Dark Energy recovers the <span style="color: #8AF7FF">Obscurant</span> HP by
                <span style="color: #8AF7FF">${fn(villian.deBoss.regen)}%</span> of max HP`
            })
        }

        if(villian.deBoss.tier >= 2 && villian.spawnType == 'deBoss') {
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["deBossDef"],
                text: `Dark Energy covers the the <span style="color: #8AF7FF">Obscurant</span> with 
                a shield reducing incoming DMG by <span style="color: #8AF7FF">${fn(villian.deBoss.def)}%</span>`
            })
        }

        if(villian.deBoss.tier >= 3 && villian.spawnType == 'deBoss') {
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["deBossTimer"],
                text: `Dark energy spreads its influence, destroying everything within <span style="color: #8AF7FF">${villian.deBoss.timer.toFixed(1)}</span>  seconds.`
            })
        }

        if(villian.deBoss.tier >= 4 && villian.spawnType == 'deBoss') {
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["deBossShield"],
                text: `Dark energy distorts space, causing damage from a hit to be 
                completely ignored <span style="color: #8AF7FF">${fn(villian.deBoss.shields)}</span> times.`
            })
        }

        // Enemy skills 

        if(villian.skills.active.includes(0)) {
            let jugger = villian.skills.jugger;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["juggernautSkill"],
                text: `<span style="color: #fef3c7"><b>Juggernaut</b><br><br>${jugger.d}</span>`
            })
        }

        if(villian.skills.active.includes(1)) {
            let berserk = villian.skills.berserk;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["berserkSkill"],
                text: `<span style="color: #fef3c7"><b>Berserk</b><br><br>${berserk.d}</span>`
            })
        }

        if(villian.skills.active.includes(2)) {
            let fs = villian.skills.firstStrike;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["firstStrikeSkill"],
                text: `<span style="color: #fef3c7"><b>First Strike</b><br><br>${fs.d}</span>`
            })
        }

        if(villian.skills.active.includes(3)) {
            let tr = villian.skills.traveler;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["travelerSkill"],
                text: `<span style="color: #fef3c7"><b>Traveler</b><br><br>${tr.d}</span>`
            })
        }

        if(villian.skills.active.includes(4)) {
            let f = villian.skills.flexible;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["flexibleSkill"],
                text: `<span style="color: #fef3c7"><b>Flexible</b><br><br>${f.d}</span>`
            })
        }

        if(villian.skills.active.includes(5)) {
            let f = villian.skills.flash;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["flashSkill"],
                text: `<span style="color: #fef3c7"><b>Flash</b><br><br>${f.d}</span>`
            })
        }

        if(villian.skills.active.includes(6)) {
            let f = villian.skills.fastSlash;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["fastSlashSkill"],
                text: `<span style="color: #fef3c7"><b>Fast Slash</b><br><br>${f.d}</span>`
            })
        }

        if(villian.skills.active.includes(7)) {
            let e = villian.skills.extraLife;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["extraLifeSkill"],
                text: `<span style="color: #fef3c7"><b>Extra Life</b><br><br>${e.d}</span>`
            })
        }

        if(player.status.critMls.healBlock > 0) {
            let e = villian.skills.extraLife;
            vList.push({
                type: 'buff',
                status: "neg",
                icon: newicons["healBlock"],
                text: `<span style="color:#facc15;">The enemy is unable to heal for: ${player.status.critMls.healBlock.toFixed(1)}s</span>`
            })
        }

        if(villian.skills.extraLife.shields > 0) {
            let e = villian.skills.extraLife;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["divineShield"],
                text: `Divine Shields: ${e.shields}`
            })
        }

        if(villian.skills.active.includes(5)) {
            let f = villian.skills.flash;
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["extraHits"],
                text: `Extra Hits: ${f.extraHits}`
            })
        }

        if(villian.skills.berserk.isRage) {
            vList.push({
                type: 'buff',
                status: "pos",
                icon: newicons["rage"],
                text:  rageHandle(villian.skills.berserk),
            })
        }

        if(player.status.blackImpulse.curseDisableTime > 0) {
            vList.push({
                type: 'buff',
                status: "neg",
                icon: newicons['curseDisable'],
                text: `<span style="color:#9ca3af;"><span style="color: yellow">All Curses are disabled</span>
                Time: <span style="color: yellow">${player.status.blackImpulse.curseDisableTime.toFixed(1)}</span></span>
                
                <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Black Impulse [T3]</span>`
            })
        }  

        return vList;
    }

    function conquerText(c) {
        let text = `<span style="color:#9ca3af;">Gain increased stats per second<br><br>`; 
      
        text += `Time: <span style="color: yellow">${c.time.toFixed(0)}</span><br>`;
      
        if (c.tier >= 1)
          text += `Max HP: <span style="color: #4CAF50">x${(1 + 0.001 * c.time).toFixed(2)}</span><br>`;
      
        if (c.tier >= 2)
          text += `DMG: <span style="color: #F44336">x${(1 + 0.001 * c.time).toFixed(2)}</span><br>`;
      
        if (c.tier >= 3)
          text += `APS: <span style="color: #2196F3">${(0.1 * Math.floor(c.time / 250)).toFixed(2)}</span><br>`;
      
        if (c.tier >= 4) {
          text += `Increase Loot gain by <b style="color: yellow">${fn(c.loot)}</b><br>`;
        }

        text += `</span>
        <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Conquer</span>`
      
        return text;
    }

    function rageHandle(b) {
        return `<span style="color:#f87171; font-weight:bold;">Rage</span>
        
        <span style="color:#9ca3af;">Accumulate rage by striking your enemy. 
        If you don't deal damage for <span style="color:#fde047;"><b>${b.rageTime.toFixed(2)}</b>s</span>, you lose Rage.</span>
        
        <span style="color:#e5e7eb;">Total Rage: <span style="color:#facc15;"><b>${Math.floor(b.rage)}</b></span></span>
      
        <span style="color:#9ca3af;">While you are affected by Rage, you gain:</span>
        <span style="color:#fca5a5;">x<b>${fn(b.rageDmg)}</b></span> <span style="color:#e5e7eb;">DMG MULT</span>  
        <span style="color:#fb7185;"><b>${(b.lessDmg * 100).toFixed(0)}</b>%</span> <span style="color:#e5e7eb;">less DMG taken</span>  
        <span style="color:#86efac;">x<b>${fn(b.healMult)}</b></span> <span style="color:#e5e7eb;">healing effect</span>
        
        <span style="color:#a78bfa;">Source:</span> <span style="color:#c4b5fd;">Berserk [T4]</span>`;
    }
    
    function trTextHandle(tr) {
        let text = `<span style="color:#9ca3af;"><b>Your current <span style="color:rgb(0, 238, 255)">[Tr]</span> is <span style="color: cyan">${Math.floor(trHandle().tr)}</span><br><br>`;

        if (trHandle().status == 'd') {
            text += `${fn(tr.spread)}% of <span style="color:rgb(0, 238, 255)">[Tr]</span> Power is spread across all dimensions.<br><br>`
        }

        if (hero.value.bhTier < 5)
            text += `Beat <span style="color: cyan">Black Hole [T${hero.value.bhTier}]</span> to get new <span style="color: cyan">[Tr]</span> effect</span>`;
        
        if (hero.value.bhTier > 0) {
          text += `<span style="color: #00ffae; justify-content: space-between; display: flex;">Max Level Mult: +${fn(trHandle().maxLvlMult)} <span style="color: red">[Tr: ${tr.max[0]}]</span></span>`;
        }
        if (hero.value.bhTier > 1) {
          text += `<span style="color: #ff5050; justify-content: space-between; display: flex;">Increased DMG by ${fn(trHandle().atk)} <span style="color: red">[Tr: ${tr.max[1]}]</span></span>`;
        }
        if (hero.value.bhTier > 2) {
          text += `<span style="color: lightgreen; justify-content: space-between; display: flex;">Min Level: +${fn(trHandle().min)} <span style="color: red">[Tr: ${tr.max[2]}]</span></span>`;
        }
        if (hero.value.bhTier > 3) {
          text += `<span style="color: #ffd700; justify-content: space-between; display: flex;">IP MULT: +${fn(trHandle().ip)} <span style="color: red">[Tr: ${tr.max[3]}]</span></span>`;
        }
        if (hero.value.bhTier > 4) {
        text += `<san style="color:rgb(255, 0, 234); justify-content: space-between; display: flex;">Corruption Influence: -${fn(trHandle().corrInfluece)}% <span style="color: red">[Tr: ${tr.max[4]}]</span></span>`;
        }

        text += `</b>`;

        return text;

    }

    return {
        statusPlayerHandler,
        statusVillianHandler
    }
}