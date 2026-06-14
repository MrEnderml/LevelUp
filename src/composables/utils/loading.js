import { reactive, ref, computed, onMounted, watch } from "vue";

import { useHero } from "../useHero.js";
import { useEnemy } from "../useEnemy.js";

import { useBuff } from "../../data/buffs.js";
import { perks } from "../../data/perks.js";
import { perks as ascension } from '../../data/ascension.js';
import { cursed } from '../../data/cursed.js';
import { amulets } from '../../data/amulets.js';
import { perks as radPerks} from '../../data/radPerks.js';
import { spEnemy as space } from '../../data/spaceEnemy.js';
import { dimensions } from '../../data/dimensions.js';
import { spaceShop } from '../../data/spaceShop.js';
import { goals } from "../../data/infGoals.js";
import { auto, autoTemp } from "../autoProgression.js";
import { nodes } from "../../data/dims/voidNodes.js";

import CryptoJS from "crypto-js";
import { useAmulets } from "../battleUtils/useAmulets.js";
import { usePlayer } from "./playerSetup.js";
import { useBaseEnemy } from "./enemySetup.js";
import { useTimeline } from "../battleUtils/dims/useTimeline.js";
import { useVoid } from "../battleUtils/dims/useVoid.js";
import { useTrees } from "../battleUtils/useTree.js";

export function loading(fileInput) {
        
    const { hero } = useHero();
    const { enemy } = useEnemy();
    const { buffs } = useBuff();
    const { player } = usePlayer();
    const { player: spPlayer} = usePlayer("space");
    const { villian } = useBaseEnemy();
    const { villian: spVillian} = useBaseEnemy("space");

    const { expSkillsGrant} = useAmulets();
    const { timelineTimer } = useTimeline();
    const { voidTimerCalc, voidShardsDrop } = useVoid();
    const { radKillsHandle } = useTrees();
    const { refillStone } = useTimeline();

    const D_RULE = "Only one must exist";

    const loadOldVersion = (oldsave) => {
        let h = hero.value;
        let e = enemy.value;
        let data  = oldsave;

        h.version = "1.0";
        h.time = Date.now();
        h.maxTime = Date.now();

        if(h.dId == 'main')
            h.infProgress = false;

        h.ascensionShards = data.hero.ascensionShards;
        h.rebirthPts = data.hero.rebirthPts;
        h.rebirthTier = Math.min(data.hero.rebirthTier, 100);
        h.abyssTier = data.hero.abyssTier;
        h.abyssDStages = data.hero.abyssDStages;
        h.mutagen = data.hero.mutagen;
        h.spCount = data.hero.spCount;
        h.spsCount = data.hero.spsCount;
        h.spsCountMax = data.hero.spsCountMax;
        h.stardust = data.hero.stardust;
        h.infPoints = data.hero.infPoints;
        h.infTier = data.hero.infTier;
        if (h.infTier > 0 || h.level > 700)
          h.infUnlocked = true;
        h.mainInfTier = data.hero.mainInfTier;
        h.singularity = data.hero.singularity;
        h.survivalLevel = data.hero.survivalLevel;
        h.bhTier = data.hero.bhTier;
        h.singularityKills = data.hero.singularityKills;

        h.ds = data.hero.ds;
        h.dsSpend = data.hero.dsSpend;
        h.dsMax = data.hero.dsMax
        h.dsTotal = data.hero.dsTotal;
        h.dsStage = data.hero.dsStage;

        h.infPenalty = data.hero.infPenalty;
        h.infPower = data.hero.infPower;

        h.darkId = data.hero.darkId;
        h.damageStage = data.hero.damageStage;
        h.survivalLife = data.hero.survivalLife;
        h.selectedDivSkills = [];

        hero.value.dims.passedDims = dimensions.value.filter(
          dim => dim.infTier >= dim.spInfTier).length

        if(h.mainInfTier >= 1)
            h.infExpansions.tree = true;
        if(h.mainInfTier >= 2)
            h.infExpansions.ascensioin = true;
        if(h.mainInfTier >= 3)
            h.infExpansions.rebirth = true;
        if(h.mainInfTier >= 4)
            h.infExpansions.radiation = true;
        if(h.mainInfTier >= 5)
            h.infExpansions.space = true;
        if(h.mainInfTier >= 6)
            h.infExpansions.soul = true;

        e.specialCreatures.inf1.loot = data.enemy.dangerEnemyLoot[0];
        e.specialCreatures.inf2.loot = data.enemy.dangerEnemyLoot[1];
        e.specialCreatures.inf3.loot = data.enemy.dangerEnemyLoot[2];

        e.specialCreatures.dim1.loot = data.enemy.dEnemyLoot[0];
        e.specialCreatures.dim2.loot = data.enemy.dEnemyLoot[1];
        e.specialCreatures.dim3.loot = data.enemy.dEnemyLoot[2];
        e.specialCreatures.dim4.loot = data.enemy.dEnemyLoot[3];
        e.specialCreatures.dim5.loot = data.enemy.dEnemyLoot[4];
        e.specialCreatures.dim6.loot = data.enemy.dEnemyLoot[5];

        for (let i = 1; i <= 6; i++) {
          const ddim = e.specialCreatures[`ddim${i}`];
        
          ddim.max =
            data.enemy?.darkEnemyCap?.[i - 1] ??
            ddim.max;
        
          ddim.loot =
            data.enemy?.darkEnemyLoot?.[i - 1] ??
            0;
        
          ddim.req =
            data.enemy?.darkEnemyReq?.[i - 1] ??
            false;
        }


        e.darkEnergy.totalBosses =
          data.enemy?.darkEnergy?.totalBosses ?? 0;

        e.darkEnergy.maxTotalBosses =
          data.enemy?.darkEnergy?.maxTotalBosses ?? 0;

        e.darkEnergy.maxBosses =
          data.enemy?.darkEnergy?.maxBosses ?? 0;

        e.darkEnergy.mult =
          data.enemy?.darkEnergy?.mult ?? 1;

        e.darkEnergy.deTotal =
          data.enemy?.darkEnergy?.deTotal ?? 1;

        if (data.ascension) {
            for(let idx in data.ascension) {
                if(ascension[idx] == null) continue;

                if(data.ascension[idx].tier == 6) {
                    let max = 50 + 5 * h.mainInfTier;

                    ascension[idx].level = Math.min(data.ascension[idx].level, max);
                }
                ascension[idx].level = Math.min(data.ascension[idx].level, ascension[idx].max);
            }
        }

        if (data.space) {
            for(let idx in data.space){
                if(space[idx].type == 'boss')
                    space[idx].status = data.space[idx].status;
            }
        }

        if (data.buffs) {
            for(let idx in data.buffs){
              buffs.value[idx].exp = data.buffs[idx].exp;
              buffs.value[idx].tier = data.buffs[idx].tier;
              buffs.value[idx].maxTier = data.buffs[idx].maxTier;
              buffs.value[idx].active = data.buffs[idx].active;
            }
        }

        if (data.cursed) {
            for(let idx in data.cursed){
              if(cursed?.[idx]?.status !== undefined)
                cursed[idx].status = data.cursed[idx].status;
            }
        };

        if (data.radPerks) {
            for(let idx in data.radPerks){
                radPerks[idx].max = data.radPerks[idx].max;
                radPerks[idx].level = data.radPerks[idx].level;
            }
        }

        if(data.dimensions) {
            for (let idx in data.dimensions) {
                if (dimensions.value?.[idx]?.infTier !== undefined) {
                    dimensions.value[idx].infTier = data.dimensions[idx].infTier;
                    dimensions.value[idx].infTier = Math.min(Math.max(dimensions.value[idx].infTier, dimensions.value[idx]?.infStart || 0), dimensions.value[idx].maxInfTier);
                }
                
            }
                
        }


        if (data.infGoals) {
            for(let idx in data.infGoals){
                goals.value[idx].tier = Math.min(data.infGoals[idx].tier, data.infGoals[idx].maxTier);
            }
        }

        if(data.auto) deepMerge(auto.value, data.auto);
      
        if (data.spaceShop)
            for(let idx in data.spaceShop)
                spaceShop.value[idx].status = data.spaceShop[idx].status;
    }

    const loadCurrentVersion = (save) => {
        let h = hero.value;
        let data = save;

        if (data.hero) deepMerge(hero.value, data.hero);
        if (data.enemy) deepMerge(enemy.value, data.enemy);

        if (data.player) deepMerge(player.value, data.player);
        if (data.spPlayer) deepMerge(spPlayer.value, data.spPlayer);
        if (data.villian) deepMerge(villian.value, data.villian);
        if (data.spVillian) deepMerge(spVillian.value, data.spVillian);

        if (data.perks) {
            for (let idx in data.perks) {
                if (perks.value?.[idx] === undefined) continue;
                perks.value[idx].status = data.perks[idx].status;
                perks.value[idx].currentStatus = data.perks[idx].currentStatus;
               

                perks.value[idx].level.inf = data.perks[idx].level.inf;
                perks.value[idx].level.base = data.perks[idx].level.base;

                perks.value[idx].tpSpend.inf = data.perks[idx].tpSpend.inf;
                perks.value[idx].tpSpend.base = data.perks[idx].tpSpend.base;

                perks.value[idx].system.prioritize = data.perks[idx].system.prioritize;
                perks.value[idx].system.levelCondition = data.perks[idx].system.levelCondition;
                perks.value[idx].system.block = data.perks[idx].system.block;
            }
        }

        if (data.ascension) {
            for(let idx in data.ascension) {
                if(ascension[idx] == null) continue;

                ascension[idx].level = Math.min(data.ascension[idx].level, data.ascension[idx].max);
            }
        }

        if (data.space) {
            for(let idx in data.space){
                if(space[idx].type == 'boss')
                    space[idx].status = data.space[idx].status;
            }
        }

        if (data.buffs) {
            for(let idx in data.buffs){
              buffs.value[idx].exp = data.buffs[idx].exp;
              buffs.value[idx].tier = data.buffs[idx].tier;
              buffs.value[idx].maxTier = data.buffs[idx].maxTier;
              buffs.value[idx].active = data.buffs[idx].active;
            }
        }

        if (data.cursed) {
            for(let idx in data.cursed){
                if(cursed?.[idx]?.status !== undefined)
                    cursed[idx].status = data.cursed[idx].status;
            }
        };

        if (data.radPerks) {
            for(let idx in data.radPerks){
                radPerks[idx].max = data.radPerks[idx].max;
                radPerks[idx].level = data.radPerks[idx].level;
            }
        }

        if(data.dimensions) {
            for (let idx in data.dimensions) {
                if (dimensions.value?.[idx]?.infTier !== undefined) {
                    dimensions.value[idx].infTier = data.dimensions[idx].infTier;
                    dimensions.value[idx].infTier = Math.max(dimensions.value[idx].infTier, dimensions.value[idx]?.infStart || 0)
                }
            }
        }

        if (data.infGoals) {
            for(let idx in data.infGoals){
                goals.value[idx].tier = Math.min(data.infGoals[idx].tier, data.infGoals[idx].maxTier);
            }
        }

        if(data.auto) deepMerge(auto.value, data.auto);

        if(data.amulets) {
            for (let idx in data.amulets)
                amulets[idx].status = data.amulets[idx].status;
        }
      
        if (data.spaceShop)
            for(let idx in data.spaceShop)
                spaceShop.value[idx].status = data.spaceShop[idx].status;

        if (data.voidNodes)
            for (let idx in nodes.value)
              nodes.value[idx].level = data.voidNodes[idx].level;
        
        auto.value = data.autoSetting ?? auto.value;
        autoTemp.value = data.autoTemp ?? autoTemp.value;
    }

    const loadGame = () => {
        const save = localStorage.getItem('gameSave');
        if (!save) return;

        const data = JSON.parse(save);

        if(data.hero.version !== "1.0") {
            loadOldVersion(data);
            return;
        }

        loadCurrentVersion(data);
        afkTimeHandle('offline', data);
    }

    const dataBuild = () => {
        const data = {
            hero: hero.value,
            enemy: enemy.value,
            player: playerData(),
            spPlayer: playerSpaceData(),
            villian: villianData(),
            perks: perks.value,
            ascension: ascension,
            buffs: buffs.value,
            amulets: amulets,
            cursed: cursed,
            radPerks: radPerks,
            space: space,
            infGoals: goals.value,
            dimensions: dimensions.value,
            spaceShop: spaceShop.value,
            amulets: amulets,
            voidNodes: nodes.value,
            autoSetting: auto.value,
            autoTemp: autoTemp.value
        };

        return data;
    }

    const playerData = () => {

        const p = player.value;
      
        return {
      
          stats: {
            base: p.stats.base,
            final: p.stats.final,
          },
      
          hp: p.hp,
          attack: p.attack,
      
          status: p.status,
      
          activeFormation:
            p.activeFormation,
      
          formationStats:
            p.formationStats,
      
          buff: p.buff,
      
          statistic:
            p.statistic,
        };
    }

    const playerSpaceData = () => {
        const p = spPlayer.value;

        return {
            buff: p.buff,
            activeFormation: p.activeFormation,
            formationStats: p.formationStats,
        }
    }

    const villianData = () => {
        const v = villian.value;

        return {
            stats: {
                base: v.stats.base,
                final: v.stats.final,
              },
          
              hp: v.hp,
              attack: v.attack,
          
              status: v.status,
              dCorr: v.dCorr,
              bh: v.bh,
              skills: v.skills,
              deBoss: v.deBoss,
              space: v.space,
        }
    }

    const saveGame = () => {
        const saveData = dataBuild();
        localStorage.setItem("gameSave", JSON.stringify(saveData));
        localStorage.setItem('lastOnline', Date.now().toString()); 
    };

    function inspectObjectSize(
        obj,
        path = 'root',
        result = [],
        seen = new WeakSet()
      ) {
      
        if (
          obj &&
          typeof obj === 'object'
        ) {
      
          if (seen.has(obj))
            return result;
      
          seen.add(obj);
        }
      
        let size = 0;
      
        try {
      
          size =
            new Blob([
              JSON.stringify(obj)
            ]).size;
      
        } catch {
      
          return result;
        }
      
        result.push({
          path,
          kb: (size / 1024).toFixed(2) + ' KB',
          mb: (size / 1024 / 1024).toFixed(2) + ' MB'
        });
      
        if (
          obj &&
          typeof obj === 'object'
        ) {
      
          for (const key in obj) {
      
            let next =
              obj[key];
      
            let nextPath =
              `${path}.${key}`;
      
            if (
              key === '_rawValue' ||
              key === '_value'
            ) {
      
              nextPath =
                `${path}.(vue-data)`;
            }
      
            inspectObjectSize(
              next,
              nextPath,
              result,
              seen
            );
          }
        }
      
        return result;
      }

    const exportGame = () => {
        const data = dataBuild();
        const json = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(json, D_RULE).toString();
      
        const blob = new Blob([encrypted], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "savegame.enc";
        link.click();
    };

    const triggerFileInput = () => {
        if (!fileInput.value) return;
      
        fileInput.value.value = "";
      
        fileInput.value.click();
      };
      

    const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        const raw = e.target.result;
        let data;

        try {
        const decrypted = CryptoJS.AES.decrypt(raw, D_RULE)
            .toString(CryptoJS.enc.Utf8);

        data = JSON.parse(decrypted);
        } catch {
        try {
            data = JSON.parse(raw);
        } catch {
            alert("Unable to load file: corrupted or invalid format");
            return;
        }
        }

        if (!data) {
            alert("Invalid save file");
            return;
        }

        if (data.hero.version !== "1.0") {
            loadOldVersion(data);
        } else {
            loadCurrentVersion(data);
        }

        afkTimeHandle('offline', data);
    };

    reader.readAsText(file);
    };


    const resetGame = () => {
        if (confirm("Are you sure you want to reset all progress?")) {
          localStorage.removeItem("gameSave");
          location.reload();
        }
    };
      
    const resetInf = () => {
        if (hero.value.dId == 'main') {
          hero.value.infProgress = false;
        }
    };

    function useAutoSave() {
      const time = 30000;
      let interval = null;
    
      const startAutoSave = () => {
        if (interval) return;
    
        interval = setInterval(() => {
          saveGame();
        }, time);
      };
    
      const stopAutoSave = () => {
        if (!interval) return;
    
        clearInterval(interval);
        interval = null;
      };
    
      onMounted(() => {
        saveGame();
    
        if (hero.value.settings.autoSave) {
          startAutoSave();
        }
      });
    
      watch(
        () => hero.value.settings.autoSave,
        (enabled) => {
          if (enabled) {
            startAutoSave();
          } else {
            stopAutoSave();
          }
        }
      );
    }

    function deepMerge(target, source) {
        for (const key in source) {
          if (
            source[key] !== null &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key])
          ) {
            if (
              !target[key] ||
              typeof target[key] !== 'object' ||
              Array.isArray(target[key])
            ) {
              target[key] = {};
            }
            deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
    }

    function startAFK() {
        const h = hero.value;
      
        if (h.afkStarted || h.isPaused)
          return;
      
        h.afkStarted = true;
      
        h.startAfkTime =
          Date.now();
      
        afkSnapshot();
    }

    function endAFK() {
        const h = hero.value;
        if (!h.afkStarted) return;

        h.afkTime = getAFKSeconds('afk');

        h.afkStarted = false;
        afkLootReward();
        storedAccumulate();
        handleAFKPanels();
    }

    function getAFKSeconds(mode, data) {

        const h = hero.value;
        const MAX_AFK = 3600 * 24;

        switch (mode) {
      
          case 'godmode':
            return 3600;
      
          case 'stored': {

            return h.settings.storedTimeUsed;
          }
      
          case 'offline': {
      
            const now = Date.now();
      
            const savedTime =
              data?.hero?.time ?? h.time;
      
            const maxSeenTime =
              data?.hero?.maxTime ?? h.maxTime;
      
            if (now < maxSeenTime) {
      
              h.timePenalty = true;
      
              return 0;
            }
      
            const diff =
              Math.floor((now - savedTime) / 1000);
      
            
      
            return Math.min(diff, MAX_AFK);
          }

          case 'afk': {
            const now = Date.now();
            const h = hero.value;

            const diff =
                Math.floor(
                (now - h.startAfkTime) / 1000
                );
            
            h.maxTime = Math.max(h.maxTime, now);

            if (now - h.maxTime < 0) {
                h.timePenalty = true;

                return 0;
            }

            return Math.min(diff, MAX_AFK);

          }
      
          default:
            return 0;
        }
    }

    function afkTimeHandle(mode = 'offline', data = null) {

        const h = hero.value;
      
        const seconds =
          getAFKSeconds(mode, data);
      
        h.afkTime = seconds;
      
        if (seconds <= 0)
          return;
      
        h.timePenalty = false;
      
        h.time = Date.now();
        h.maxTime = Date.now();
      
        afkLootReward();
        storedAccumulate();
      
        player.value.damageLog.length = 0;
        villian.value.damageLog.length = 0;
      
        handleAFKPanels();
    }

    function handleAFKPanels() {

        const h = hero.value;
      
        if (!h.settings.showAfkPopupRule) {
      
          h.settings.showOfflineRewards = false;
          h.settings.showStoredTime = false;
      
          return;
        }
      
        if (h.settings.afkStoredTime && h.settings.storedTimeUsed == 0) {
      
          h.settings.showOfflineRewards = false;
          h.settings.showStoredTime = true;
      
        } else {
      
          h.settings.showOfflineRewards = true;
          h.settings.showStoredTime = false;
        }
    }

    function useStoredTime() {
        afkTimeHandle('stored'); 
    }

    function useGodMode() {
        afkTimeHandle('godmode');
    }

    function afkSnapshot() {
        hero.value.afkSnapshot = {
          exp: hero.value.avgLoot.exp.perSec,
          skillExp: hero.value.avgLoot.skillExp.perSec,
          stardust: hero.value.avgLoot.stardust.perSec,
          mutagen: hero.value.avgLoot.mutagen.perSec,

          kills: hero.value.avgLoot.kills.perSec,
      
          ascension: hero.value.avgResources.ascension.perSec,
          rebirth: hero.value.avgResources.rebirth.perSec,
        };
    }
    
    const afkReward = () => {
        if (hero.value.settings.afkStoredTime && hero.value.settings.storedTimeUsed == 0) return;

        const h = hero.value;
        const t = h.afkTime;

        const s = h.afkSnapshot;

        let voidShards = calcVoidAFK().count * voidShardsDrop();
        let timelineStones = calcTimelineAFK().count;

        let soul = Math.max(Math.log(Math.max(t - 500, 1)) ** 1.5, 1);
        h.afkSoulBoost = soul;

        return {
            exp: s.exp * t || 0,
            skillExp: s.skillExp * t || 0,
            stardust: s.stardust * t || 0,
            mutagen: s.mutagen * t || 0,
        
            ascension: s.ascension * t || 0,
            rebirth: s.rebirth * t || 0,

            kills: s.kills * t || 0,
            soul: soul || 1,

            voidShards: voidShards || 0,
            timeline: timelineStones || 0,
          };
    }

    const storedAccumulate = () => {
        if (!hero.value.settings.afkStoredTime) return;
        if (hero.value.settings.storedTimeUsed > 0) return;

        const AFK_MAX = 86400 / 2;

        hero.value.settings.storedTime = Math.min(hero.value.settings.storedTime + 
            hero.value.afkTime / 2, AFK_MAX)
    }

    const afkLootReward = () => {
        if (hero.value.settings.afkStoredTime && hero.value.settings.storedTimeUsed <= 0) return;

        const h = hero.value;
        const t = h.afkTime;

        const s = h.afkSnapshot;

        h.exp += s.exp * t || 0;
        h.cursedBonus += s.skillExp * t || 0;

        if (h.spCount >= 2) 
            h.stardust += s.stardust * t || 0;
        if (h.spCount >= 5)
            h.mutagen += s.mutagen * t || 0;
        
        
        if (h.infExpansions.ascensioin)
            h.ascensionShards += s.ascension * t || 0;
        if (h.infExpansions.rebirth)
            h.rebirthPts += s.rebirth * t || 0;

        let kills = s.kills * t || 0;
        h.afkModeKills = kills;

        if (h.autoTimeLine.isAuto && !h.timePenalty) 
            timelineCalc();
        
        if (h.mainInfTier >= 100 && !h.timePenalty) 
            voidCalc();

        expSkillsGrant();
        killsHandle(kills);
        tHandler(t);

        h.dTimer += t;
        h.avgResources.ascension.timer += t;
        h.avgResources.rebirth.timer += t;
    }

    const tHandler = (t) => {
        if (player.value.buff.activeBuffs.includes(8))
            player.value.status.conquer.time = Math.min(player.value.status.conquer.time + t,
                player.value.status.conquer.maxTime);
    }

    const killsHandle = (kills) => {
        const h = hero.value;

        radKillsHandle(kills);
        h.dims.damage.kills += (dimensions.value[28].infTier > 0? kills: 0);
    }

    const calcVoidAFK = () => {
        const h = hero.value;
      
        return processAFKCountdown(
          h.void.time,
          h.afkTime,
          voidTimerCalc
        );
    };

    const calcTimelineAFK = () => {
        const h = hero.value;
      
        return processAFKCountdown(
          h.autoTimeLine.timer,
          h.afkTime,
          timelineTimer
        );
    };

    const voidCalc = () => {
        const h = hero.value;
      
        const res = processAFKCountdown(
          h.void.time,
          h.afkTime,
          voidTimerCalc
        );
      
        h.void.time = res.time;
      
        h.void.totalShards += voidShardsDrop() * res.count;
    };

    const timelineCalc = () => {
        const h = hero.value;
      
        const res = processAFKCountdown(
          h.autoTimeLine.timer,
          h.afkTime,
          timelineTimer
        );
      
        h.autoTimeLine.timer = res.time;
      
        for (let i = 0; i < res.count; i++) {
          refillStone(h.autoTimeLine.tier);
        }
      };

    function processAFKCountdown(currentTime, afkTime, getTimer) {
        let time = currentTime - afkTime;
        let count = 0;
      
        while (time <= 0) {
          count++;
          time += getTimer();
        }
      
        return {
          count,
          time
        };
      }

    const timePenaltyHandler = () => {
      const h = hero.value;
      if (h.time - h.maxTime > 5000)
        h.timePenalty = false;
    }
      



    return {
        loadGame,
        resetGame,
        resetInf,
        triggerFileInput,
        handleFileImport,
        exportGame,
        saveGame,
        useAutoSave,
        afkReward,
        afkSnapshot,
        startAFK,
        endAFK,
        useGodMode,
        useStoredTime,
        afkTimeHandle,
        timePenaltyHandler
    }
}
