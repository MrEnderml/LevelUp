<template>
<div class="btn-wrapped">

<button class="btn" @click="tool('afk')">1 HOURS</button>
<button class="btn" @click="tool('ShardsPlus')">+10k Shards</button>
<button class="btn" @click="tool('RebirthPtsMore')">+1k Pts</button>
<div style="display: none">
<button class="btn" @click="tool('levelPlus')">+1 Level</button>
    <button class="btn" @click="tool('levelPlusTen')">+10 Levels</button>
    <button class="btn" @click="tool('levelPlusFifty')">+50 Levels</button>
    <button class="btn" @click="tool('Shards')">+100 Ascension Shards</button>
    
    <button class="btn" @click="tool('RebirthTier')">+1 Rebirth Tier</button>
    <button class="btn" @click="tool('RebirthPts')">+10 Rebirth Pts</button>
    <button class="btn" @click="tool('RebirthPtsMore')">+1000 Rebirth Pts</button>
    <button class="btn" @click="tool('ClearStage')">Clear stage</button>
    <button class="btn" @click="tool('StageBoss')">Clear until the boss</button>
    <button class="btn" @click="tool('FourEnemies')">Kill 4 Enemies</button>
    <button class="btn" @click="tool('Souls')">Souls</button>
</div>
    
</div>
</template>

<script setup>
import { useHero } from '../composables/useHero.js';
import { useEnemy } from '../composables/useEnemy.js';
const { hero } = useHero();
const { enemy } = useEnemy();

function tool(str) {
    if (str == "afk"){
        let time = 3600;
        let maxKill = hero.value.maxStage * 50;

        let div = enemy.value.maxHp * (time ** 0.1) - hero.value.attack;
        hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (enemy.value.maxHp * (time ** 0.1))) * time: time, maxKill);
        hero.value.afkTime = time;
        hero.value.afkLocked = true;
    }
    if(str == "levelPlus"){
        hero.value.eLevel++;
        hero.value.perkPoints += 1;
    }
     if(str == "levelPlusTen"){
        hero.value.eLevel+=10;
        hero.value.perkPoints += 10;
    }
     if(str == "levelPlusFifty"){
        hero.value.eLevel+=50;
        hero.value.perkPoints += 50;
    }
     if(str == "Shards"){
        hero.value.ascensionShards += 100;
    }
     if(str == "ShardsPlus"){
        hero.value.ascensionShards += 10000;
    }
     if(str == "RebirthTier"){
        hero.value.rebirthTier++;
    }
     if(str == "RebirthPts"){
        hero.value.rebirthPts+= 10;
    }
     if(str == "RebirthPtsMore"){
         hero.value.rebirthPts+= 1000;
    }
     if(str == "ClearStage"){
        hero.value.stage++;
        hero.value.zone = 1;
        hero.value.kills = 0;
    }
     if(str == "StageBoss"){
        hero.value.kills = Math.floor(hero.value.killsPerZone) - 3;
        hero.value.zone = 5;
    }
    if(str == "FourEnemies"){
        hero.value.kills+= 4;
    }
    if(str == "Souls"){
        hero.value.souls++;
    }
}


</script>

<style scoped>

.btn {
    border: 2px solid red;
    color: white;
}

.btn-wrapped {
    width: 120px;
    left: 15%;
    position: fixed;
    z-index: 1000000;
    top: 15%;
}
</style>