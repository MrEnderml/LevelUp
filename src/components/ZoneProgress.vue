<template>
  <div class="zone-progress">
    <div class="zone-progress-header">
      <div class="left-icons">
        
      </div>

      <div class="progress-center" v-if="!hero.dId.startsWith('d-')">
        <span class="progress-icon">🌍</span>
        <span class="progress-text">Progress</span>
      </div>
        <div class="right-icons tooltip-content" >
        
        <Tooltip :text="darkSpaceHandle" boxShadow="0 0 10px gold">
          <span v-if="hero.dId == 'd-noSpace'" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('celestials', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="unlimitedDimHandle" boxShadow="0 0 10px red">
          <span v-if="hero.dId == 'd-unlimitted'" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('maxLevelReduction', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="noEqDimHandle" boxShadow="0 0 10px orange">
          <span v-if="hero.dId == 'd-noEq' || hero.darkId.includes('d-noEq')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('forge', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="apsHandle" boxShadow="0 0 10px red">
          <span v-if="hero.dId == 'd-noAps'" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('apsPenalty', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="dInfTreeHandle" boxShadow="0 0 10px lightgreen">
          <span v-if="hero.dId == 'd-noTree' || hero.darkId.includes('d-noTree')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('infTree', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="dBuffsHandle" boxShadow="0 0 10px yellow">
          <span v-if="hero.darkId.includes('d-noBuffs')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('dBuffs', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="dHardHandle" boxShadow="0 0 10px purple">
          <span v-if="hero.dId == 'd-hard' || hero.darkId.includes('d-hard')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('cursePower', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="bleedingVeilHandle" boxShadow="0 0 10px red">
          <span v-if="hero.dId == 'd-survival-2'" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('bleedingVeil', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="nextDimHandle" boxShadow="0 0 10px blue">
          <span v-if="hero.dId == 'd-next' || hero.darkId.includes('d-next')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('nextDim2', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="darkEnergyHandle" boxShadow="0 0 10px purple">
          <span v-if="hero.dId == 'd-overstage'" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('darkEnergy', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="darkEnemyHandle" boxShadow="0 0 10px orange">
          <span v-if="hero.dId == 'd-danger'" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('darkDangerEnemy', '1.25em')"></span>
        </Tooltip>  
        <Tooltip :text="doomHandle" boxShadow="0 0 10px #af1b0b">
          <span v-if="hero.dId == 'd-damage' || hero.darkId.includes('d-damage')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('doom', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="stageHardCap" boxShadow="0 0 10px rgb(0, 247, 255)">
          <span v-if="hero.stage >= 300" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('singularity', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="corruptionHandle" boxShadow="0 0 10px purple">
          <span v-if="hero.dId == 'd-corruption' || hero.darkId.includes('d-corruption')" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('corruptionDim', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="deathRecovery" boxShadow="0 0 10px blue">
          <span v-if="hero.stage > 100">☠️</span>
        </Tooltip>
        <Tooltip :text="infHandle" boxShadow="0 0 10px gold">
          <span v-if="!hero.infProgress && hero.infEvents > 1" class="infinity-glow">∞</span>
        </Tooltip>
        <Tooltip :text="travellHandle" boxShadow="0 0 10px blue">
          <span v-if="hero.isTravell" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('traveller', '1.25em')"></span>
        </Tooltip>
        <Tooltip :text="spaceTimerHandle" boxShadow="0 0 10px gold">
          <span v-if="enemy.isSpaceFight == 2" style="vertical-align: -webkit-baseline-middle;" v-html="getSvgIconHTML('spaceTimer', '1.25em')"></span>
        </Tooltip>
      </div>
    </div>



    <h3 class="progress-header">
      <div class="ascend-wrapper staticIconPos" :class="{ hidden: hero.stage < 10 || hero.dId == 'bh' }">
        <button class="btnAscend" @click="performAscension">
        <img :src="ascensionIcon" width="24px" height="24px" style="vertical-align: -2px;"/>
          <div class="ascend-tooltip">
            <p><strong>Ascension</strong></p>
            <p>Reset to stage 1, but you will lose level, tree and equipment.</p>
            <p>Total shards: {{ formatNumber(hero.totalAscensionShards) }} <span v-if="hero.ascendShardPerform > 0">(+{{formatNumber(hero.ascendShardPerform)}} after Ascension)</span> 💠</p>
            <p v-if="dimensions[9].infTier == dimensions[9].maxInfTier && hero.dId == 'main'">Now you are available to get Dimension Shard(DS). Reach Stage {{hero.dsStage + 10 * hero.ds}} and Ascend to gain 1 DS</p>
          </div>
        </button>
      </div>
      <div class="rebirth-wrapper staticIconPos" :class="{ hidden: hero.level < 100 || hero.isSingularity || hero.dId == 'bh' }">
        <button class="btnRebirth" @click="performRebirth">
        ♻️
          <div class="rebirth-tooltip">
            <p><strong>Rebirth</strong></p>
            <p>
            You reached the Limit of Max Level. Rebirth to break this Limit<br>
            Rebirth to stage 1, but you will lose level, tree, equipment, souls.<br>
            Every tier provides stonger enemies and high rewards
            </p>
            <p v-if="hero.mainInfTier < 2">Next rebirth Tier: {{Math.min(100 + (10 * hero.rebirthTier), 300)}} Level</p>
            <p v-if="hero.infTier >= 3 || hero.infEvents >= 3">+{{Math.floor((hero.level - 90) / 10 > hero.rebirthTier? (hero.level - (90 + 10 * hero.rebirthTier)) / 10: 0)}} Rebirth Tier</p>
            <p v-if="(hero.rebirthTier + 1)%5 == 0 && hero.rebirthTier < 21">Unlock new Rebirth Affect</p>
            <p v-if="(hero.rebirthTier + 1)%10 == 0 && hero.rebirthTier >= 21 && hero.rebirthTier < 71">Unlock new Rebirth Affect</p>
            <p v-if="hero.rebirthPts <= 1e5">You gained: {{format(hero.totalRebirthPts)}} Pts</p>
          </div>
        </button>
      </div>
      <div class="abyss-wrapper staticIconPos" :class="{ hidden: !isAbyssVisible }">
        <button class="btnAbyss" @click="performAbyss">
        🧿
          <div class="abyss-tooltip abyss-shadow">
            <p v-if="hero.abyssTier < 3"><strong>Abyss[T{{hero.abyssTier}}]</strong></p>
            <p v-if="hero.abyssTier >= 3"><strong>Abyss D</strong></p>
            <p> 
            {{abyssDescription[hero.abyssTier]}}
            </p>
            <span v-if="hero.abyssTier >= 3">Max Stage: {{hero.abyssDStages}}</span>
            <p v-html="abyssRwrd(hero.abyssTier)"></p>
            <p v-if="hero.isAbyss">Click to leave or complete Abyss</p>
          </div>
        </button>
      </div>
      <div class="inf-wrapper staticIconPos" :class="{ hidden: !(hero.infProgress && hero.dId == 'main' && !hero.isSingularity) }">
        <button class="btnInf" @click="performInf" >
          <span class="infinity-glow">∞</span>
          <div class="inf-tooltip inf-shadow">
              <p><strong>Infinity [T{{hero.mainInfTier}}]</strong></p>
              <p>You have become The Omnipotent ,but <span style="color: gold">[D-Infinity]</span> seeks to prevent you from shattering a fragment of its creation.</p>
              <p>{{infRewards[hero.infTier]}}</p>
              <p>The Dimension is trying to destroy you. Press the button, your progress will reset and you will face a Trial with EXP Gain & Max Level reduced by <span style='color: red'>^{{(hero.infPower).toFixed(2)}}</span>.
              Overcoming it will grant you <span style='color: gold'>Infinity [T{{hero.mainInfTier+1}}]</span>.
              The Celestials succumb to D's will, becoming stronger. Corruption spreads its influence among all entities of this dimension, making them wild.</p> 
              <p style="color: red" v-if="hero.infTier >= 20">The [D-Infinity] tears the tissue of the universe, worsening the drop of stardust </p>
              <p style="color: red" v-if="hero.infTier >= 25">The [D-Infinity] destroys all Celestial making them insignificant, worsening the drop of mutagen </p>
              <p style="color: red" v-if="hero.infTier >= 30">Dimensions are being consumed by the power of the multiverse. Curses are getting stronger</p>
              <p style="color: red" v-if="hero.infTier >= 35">You feel the touch of the Perdition. Every 10 Infinity Tiers you will get +1 MAX Curse and +1 MIN Curse.</p>
              <p style="color: red" v-if="hero.infTier >= 35">You feel the touch of the Perdition. Every 10 Infinity Tiers you will gain new Curse</p>
          </div>
        </button>
      </div>
      <div class="soul-wrapper staticIconPos" :class="{ hidden: !isSoulVisible }">
        <button class="btnSoul" @click="performSoulD" >
          <img :src="redSkull" width="24px" height="24px" v-if="hero.soulD" />
          <span v-if="!hero.soulD">💀</span>
          <div class="soul-tooltip abyss-shadow">
              <p><strong>D-Soul</strong></p>
              <p>Enter the Dimension where souls have 100% appearence, but they are stronger than usual souls. Soul Loot scales better.</p>
              <p>Click to <span v-if="!hero.soulD">Enter</span><span  v-if="hero.soulD">Leave</span> The Dimension</p>
              <p v-if="hero.selectedDivSkills.includes(11)">D-Soul is blocked due to <span style='color: #00ffea'>Soul Eclipse</span></p>
              <p v-if="hero.selectedDivSkills.includes(6)">D-Soul is blocked due to <span style='color: #00ffea'>The basis of the Limit</span></p>
              <p v-if="hero.dId === 'd-next' && dimensions[34].infTier > 15">Your maximum possible stage is below to enter</p>
          </div>
        </button>
      </div>
      <div class="singularity-wrapper staticIconPos" :class="{ hidden: !(hero.dId == 'main' && !hero.isAbyss && hero.infTier >= 7 + hero.singularity && hero.singularityKills < 10000) }">
      <button class="btnSingularity" @click="performSingularity" >
          <SvgIcon name="singularity" size="1.4em" />
          <div class="singularity-tooltip singularity-shadow">
              <p v-if="hero.singularity < 8"><strong>Singularity [T{{hero.singularity}}]</strong></p>
              <p v-else><strong>Singularity-BH</strong></p>
              <p>Dive into the edge of the Black Hole ruled by <span style="color: cyan">[D-Gravity]</span>.</p>
              <p v-html="singularityD[hero.singularity]"></p>
              <p>{{singularityR[hero.singularity]}}</p>
              <span v-if="hero.singularity >= 8 && hero.isSingularity">Total SP: {{totalSp()}}<br></span>
              <span v-if="hero.singularity >= 8">Max kills: {{hero.singularityKills}}</span>
              <p>Reach Level 700 to Enter the singularity</p>
              <p v-if="hero.isSingularity">Click to leave the Singularity</p>
          </div>
        </button>
      </div>
    </h3>

   <div class="lock-stage-wrapper">
      <!-- Idle system button -->
      <Tooltip :text="'Idle system: Locks the stage to prevent automatic progression'">
        <button class="lock-stage-button" @click="toggleLockStage">
          <span v-if="hero.isLocked" class="spinner"></span>
          <span v-else class="spinner fspinner"></span>
          <span class="button-text">{{ hero.isLocked ? 'Locked' : 'Unlocked' }}</span>
        </button>
      </Tooltip>

      <Tooltip :text="'Travel to specific stage'">
        <button v-if="dimensions[3].infTier == dimensions[3].maxInfTier" class="lock-stage-button" @click="showStageModal = !showStageModal">
          <span class="icon">🌍</span>
          <span class="button-text">Stage</span>
        </button>
      </Tooltip>

       <Tooltip :text="'AFK rewards'">
          <button v-if="dimensions[7].infTier == dimensions[7].maxInfTier" class="lock-stage-button" @click="showAfkModal = !showAfkModal">
            <span class="icon">🕒</span>
            <span class="button-text">AFK</span>
          </button>
        </Tooltip>

        <Tooltip :text="'Auto Settings'">
          <button v-if="hero.mainInfTier >= 1 || hero.infEvents >= 2" class="lock-stage-button" @click="showAutoModal = !showAutoModal">
            ⚙️ Auto Settings
          </button>
        </Tooltip>

        <Tooltip :text="'Pause or resume the game'">
          <button class="lock-stage-button" @click="hero.isPaused = !hero.isPaused">
            <span v-if="hero.isPaused">▶️ Resume</span>
            <span v-else>⏸️ Pause</span>
          </button>
        </Tooltip>

      <div>

      </div>

      <div v-if="showStageModal" class="stage-modal">
        <h3>Stage Travel</h3>
        <div class="stage-input-group">
          <input type="number" v-model.number="targetStage" :max="hero.maxStage" />
          <button @click="travelToStage">Travel</button>
        </div>
        <p class="stage-description">
          Enter the stage you want to travel to. Max stage: {{ hero.maxStage }}
        </p>
        <p class="stage-description" >
          During travel, enemies become 4 times stronger. Over time, their strength will return to normal.
          Skipping stages and receiving ascension shards is blocked until the next reset.
        </p>
      </div>

      <div v-if="showAfkModal" class="stage-modal">
        <h3>🕒 AFK Reward</h3>

        <div class="afk-bar-container">
          <div class="afk-bar" :style="{ width: `${afkPercent}%` }"></div>
          <span class="afk-time">{{ formatTime(Math.floor(hero.afkTimer)) }}</span>
        </div>

        <div class="afk-controls">
          <label for="afkPercentInput">Use %:</label>
          <input
            id="afkPercentInput"
            type="number"
            v-model.number="hero.afkSpendPercent"
            min="1"
            max="100"
          />
          <button @click="useAfkTime">Use</button>
        </div>
      </div>

      <div v-if="showAutoModal" class="auto-settings-modal">
        <div class="auto-panel" v-if="hero.mainInfTier >= 2 || hero.infEvents >= 2">
          <h4>🌌 Auto Ascension</h4>
          <label>
            Min Shards:
            <input type="number" v-model.number="autoTemp.ascensionMinShards" />
          </label>
          <label>
            Min Stage:
            <input type="number" v-model.number="autoTemp.ascensionMinStage" />
          </label>
        </div>

        <div class="auto-panel" v-if="hero.mainInfTier >= 3 || hero.infEvents >= 3">
          <h4>♻️ Auto Rebirth</h4>
          <label>
            Min Rebirth Pts:
            <input type="number" v-model.number="autoTemp.rebirthMinPts" />
          </label>
          <label>
            Min Level(100+):
            <input type="number" v-model.number="autoTemp.rebirthMinLevel" />
          </label>
          <label>
            Level +:
            <input type="number" v-model.number="autoTemp.rebirthMinLevelNext" />
          </label>
        </div>

        <div class="auto-panel">
          <h4>⚔️ Stop at Stage</h4>
          <label>
            Stage to Stop:
            <input type="number" v-model.number="autoTemp.stopStage" />
          </label>
          <label>
            Stage +:
            <input type="number" v-model.number="autoTemp.stopStageNext" />
          </label>
          <label>
            Stop Until Kills:
            <input type="number" v-model.number="autoTemp.stopUntilKills" />
          </label>
        </div>

        <div class="modal-buttons">
          <button @click="applyAutoSettings">Apply</button>
          <button @click="showAutoModal = false">Cancel</button>
          <button @click="resetSettings">Reset</button>
        </div>
      </div>


    </div>


    <div class="progress-bar-container">
      <div class="progress-bar-fill" :style="{ width: `${(kills / Math.floor(killsPerZone)) * 100}%` }"></div>
      <div class="progress-bar-text" v-if="!hero.isSingularity">
        {{ formatNumber(kills) }} / {{ Math.floor(killsPerZone) }} kills (Zone {{ zone }} /  5 , Stage {{ stage }})
      </div>
      <div class="progress-bar-text" v-if="hero.isSingularity">
        {{ kills }} / {{ Math.floor(killsPerZone) }} kills
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch} from 'vue';
import { useHero } from '../composables/useHero.js';
import { useEnemy } from '../composables/useEnemy.js';
import { perks as radPerks } from '../data/radPerks.js';
import { perks as tperks } from '../data/perks.js';
import { perks as ascension } from '../data/ascension.js';
import { amulets } from '../data/amulets.js';
import { cursed } from '../data/cursed.js';
import { useBuff } from '../data/buffs.js';
import { spEnemy } from '../data/spaceEnemy.js';
import { dimensions } from '../data/dimensions.js';
import { killHistory } from '../composables/afkHandle.js';
import { auto } from "../composables/autoProgression.js";
import redSkull from '../assets/red-skull.png';
import ascensionIcon from '../assets/ascension.png';
import { getSvgIconHTML } from "../composables/svgIcon.js";

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const kills = computed(() => hero.value.kills);
const killsPerZone = computed(() => hero.value.killsPerZone);
const zone = computed(() => hero.value.zone);
const stage = computed(() => hero.value.stage);


const singularityD = [
  `Enter the singularity, where gravity devours space, opponents under the influence of gravity destroy galaxies and your level is on the verge of destruction.`,
  `Enter the singularity, where the opponents have learned to recognize the essence of curses.`,
  `Enter the singularity, where The Tree is locked`,
  `Enter the singularity, where Ascension is locked`,
  `Enter the singularity, where Space is locked`,
  `Enter the singularity, where Buff is locked`,
  `Enter the singularity, where Equipment is locked`,
  `Enter the singularity, where Rebirth is locked`,
  `Enter the singularity, where enemies under curse of <span style='color: cyan'>[D-Gravity]</span>. All enemies have curse [T5]`
]

const singularityR = [
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels, 
  Overkill [T4], +2% to skip stage per Singularity Tier (S), level up while your level is below 2% of Max Level per Singularity Tier (S)`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Each curse gets a bonus from the next Tier.`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. +1 Tree Tier. New Tree Perks on [T6]. Auto is always opened`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Ascension no longer resets during Infinity. Open Tier-S. Unlock a Perk in Tier-S for each Singularity Tier`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. +1 Space Tier. Celestials from available dimensions see you. Auto is always opened`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Buffs no longer reset during Infinity; +1 Max Buff`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. + Enhance Level per each Singularity Tier. Unlock Awakened Equipment`,
  `Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Rebirth starts with 1e5 Pts. Unlock Singularity BH`,
  `Reach as max as possible to get Singularity Pts`
]

const abyssDescription = [
  `You reached MAX Souls. Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared. 
  Reach Stage ${20 + 10 * hero.value.abyssTier} when you affected first 7 curses [T1]`,
  `You reached MAX Souls. Abyss feels inexplicable essence through the darkness and directs its power to this dimension. 
  Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared.
  Reach Stage ${20 + 10 * hero.value.abyssTier} when you affected first 10 curses [T2]`,
   `You reached MAX Souls. Abyss now directs to enemies mind force them to evo faster. Corruption forces to affect the World Rule. 
  Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared. 
  Reach Stage ${20 + 10 * hero.value.abyssTier} when you affected first 13 curses [T3].`,
  `Dive into the Endless darkness to open new possibilities to escape from this Dimension. Travell to the Abyss where enemies are stronger, Level scales worse. Buff EXP are locked. Souls are disappeared.
  Reach as max as possible when you affected first 13 curses [T4]`
]

const abyssRewards = [
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. x1.3 MULT Rebirth Pts per Abyss Tier. +50% souls appear for each curse`,
  `After complete you will be cursed by 3 new curses. Soul CAP -> ${20 + 10 * (hero.value.abyssTier+1)}. There is a new enemie(Ascension Soul) after Stage 20 that drops Ascension Shards.
  Ascension Shards now affect to enemies make them weaker. `,
  "Break Rebirth Limits. Open Corruption. Unlock the Second Space Fragment.",
]

const infRewards = [ 
  `Reset everyting you've got(except Abyss D), but you will get Inf-Tree. Force any perk to serve you forever, but everything has its own price. Auto-Tree. Double Points gaining. Auto-Stage`,
  `Reset everyting you've got(except Abyss D), but you will get Ascend Permission. You have 5 Infinity Ascension Perks to serve you forever even after Infinity Reset. Extra skip stages until +25% Max Stage (S). You can get Shards from Bosses. Auto-Ascension`,
  `Reset everyting you've got(except Abyss D), but you will get Integration of Rebirth. Your Rebirth Tier are unlimmited. Enemy Power equals to 1. Auto-Rebirth`,
  `Reset everyting you've got(except Abyss D), but you will get Gamma Learning. Gain mutagens as if you have mutagen [T5]. Increase MAX Levels of Radiation Perks. Danger System scales betterand opens Inf-Enemy.`,
  `Reset everyting you've got(except Abyss D), but you will get Expansion of Space. Unlock Space [T5]. x2 stardust. Auto-Fight`,
  `Reset everyting you've got(except Abyss D), but you will get Thirst for Souls . D-Soul gives you a 100% chance to meet a soul, but its power will be limitless. Every Soul Tier gives you +1 MIN Level. EXP CAP SOULS - +40`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T0]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T1]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T2]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T3]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T4]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T5]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T6]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T7]`,
  `Reset everyting you've got(except Abyss D). Complete to open Singularity [T8]`,
]

function abyssRwrd(tier) {
  if (tier < 3) return abyssRewards[tier];

  let str = `<span><span style="color: #f942f9">Beat Stage 20</span>: High Tier Curses appear more often </span><br/>`;

  if (hero.value.abyssDStages >= 20)
    str += `<span><span style="color: #f942f9">Beat Stage 30</span>: Level scales based on Max Stage in Abyss D</span>`; 
  if (hero.value.abyssDStages >= 30){
    str += `<span>[*${Math.max(2 - (1.015 ** (hero.value.abyssDStages - 29)), 0.1).toFixed(2)}]</span><br/>`;
    str += `<span><span style="color: #f942f9">Beat Stage 40</span>: Corruption weakness is based on Max Stage in Abyss D</span>`;
  }
  if (hero.value.abyssDStages >= 40){
    str += `<span>[+${Math.max(1 - (1 / (Math.sqrt(hero.value.abyssDStages - 39) ** 0.15)), 0.1).toFixed(2)}]</span><br/>`;
    str += `<span><span style="color: #f942f9">Beat Stage 50</span>: Curse Bonus boost is based on Max Stage in Abyss D</span>`;  
  }
  if (hero.value.abyssDStages >= 50){
    str += `<span>[*${((1 + 0.005 * Math.min(hero.value.abyssDStages - 49, 100))).toFixed(2)}]</span><br/>`;
    str += `<span><span style="color: #f942f9">Beat Stage 60</span>: Stardust drop is better based on Max Stage in Abyss D</span>`; 
  }
  if (hero.value.abyssDStages >= 60){
    str += `<span >[*${(1 + 0.05 * (hero.value.abyssDStages - 59)).toFixed(2)}]</span><br/>`;
    str += `<span><span style="color: #f942f9">Beat Stage 70</span>: Stage requirement scales better based on Max Stage in Abyss D</span><br/>`;
  }
  if (hero.value.abyssDStages >= 70){
    str += `<span><span style="color: #f942f9">Beat Stage 80</span>: Open D-Atlas</span><br/>`;
  }
  if(hero.value.abyssDStages > 100){
    str += `<span><span style="color: #f942f9">Beat Stage 100</span>: MULT to convert Curse [T4] to [T5] - </span>`;
    if (hero.value.abyssDStages >= 100) {
      str += `<span>[*${(1.01 ** (hero.value.abyssDStages - 99)).toFixed(2)}]</span><br/>`;
      str += `<span><span style="color: #f942f9">Beat Stage 120</span>: Stage Requirement reduced for Dimension Shards</span>`;
    }
    if (hero.value.abyssDStages >= 120) {
      str += `<span>[-${Math.floor((hero.value.abyssDStages - 119) ** 0.65)}]</span><br/>`;
      str += `<span><span style="color: #f942f9">Beat Stage 140</span>: The Danger Power is weaker</span>`;
    }
    if(hero.value.abyssDStages >= 140){
      str += `<span>[^${formatNumber((100 - Math.sqrt(hero.value.abyssDStages - 139)) * 0.01, true)}]</span><br>`
      str += `<span><span style="color: #f942f9">Beat Stage 160</span>: Celestials are weaker</span>`;
    }
    if(hero.value.abyssDStages >= 160){
      str += `<span>[*${Math.max(1 / (1.01 ** (hero.value.abyssDStages - 159)), 0.1).toFixed(2)}]</span><br>`;
      str += `<span><span style="color: #f942f9">Beat Stage 180</span>: Soul-D is weaker</span><br>`;
    }
    if(hero.value.abyssDStages >= 180){
      str += `<span><span style="color: #f942f9">Beat Stage 200</span>: Max Level MULT</span>`;
    }
    if(hero.value.abyssDStages >= 200){
     str += `<span>[+${(0.025 * (hero.value.abyssDStages - 199)).toFixed(2)}]</span><br>`;
     str += `<span><span style="color: red">Beat Stage 1000</span>: ???</span><br>`;
    }
  }

  return str;
}

const toggleLockStage = () => {
    if (!hero.value.isLocked){
        hero.value.isLocked = true;
        hero.value.isStage = false;
    }
    else{
        hero.value.isLocked = false;
        hero.value.isStage = true;
    }
};

const isAbyssVisible = computed(() => {
  const h = hero.value;

  if (h.dId === 'bh') return false; 

  return (
    (h.abyssTier < 3 && h.soulsMax >= 20 + 10 * h.abyssTier) ||
    h.spCount >= 15
  ) && !h.isSingularity && h.dId !== 'hard';
});

const isSoulVisible = computed(() => {
  const h = hero.value;
  return (
    (h.infEvents >= 6 || h.infTier >= 6) &&
    !h.isSingularity &&
    h.dId !== 'soulD' &&
    h.dId !== 'bh'
  );
});


function totalSp(){
  return formatNumber(Math.log(hero.value.kills + 3) ** 7.26 - Math.log(hero.value.singularityKills + 3) ** 7.26);
}

function dsGain() {
  let total = Math.floor(Math.max(hero.value.stage - hero.value.dsStage, 0) / 10);
  return hero.value.dsStage + 10 * total
}


const performSingularity = () => {
  if(enemy.value.isSpaceFight == 2) return;

  if(hero.value.eventDoubleClick){
    const confirmed = window.confirm(
      "Click OK to confirm to enter the Singularity."
    )
    if (!confirmed) return;
  }

  if(!hero.value.isSingularity && hero.value.level < 700)
    return;
  
  hero.value.perform = true;
  enemy.value.soulBuff.active = false;
  enemy.value.boss.isBoss = false; 
  hero.value.soulD = false;
  hero.value.activeBuffs = [];
  killHistory.length = 0;

  if(hero.value.isSingularity && hero.value.singularity >= 8) {
      hero.value.singularityKills = hero.value.kills;
  }

  perform();

  if(hero.value.isSingularity){
    hero.value.isSingularity = false;

    if(hero.value.singularity >= 2) hero.value.treeAuto = true;
    if(hero.value.singularity >= 3){
      ascension.forEach((perk, index) => {
        perk.level = hero.value.singularityAscension[index] || 0;
      });
    }
    if(hero.value.singularity >= 4) {
      hero.value.sp = hero.value.singularitySpace.sp;
      hero.value.singularitySpace.sp = 0
      hero.value.st = hero.value.singularitySpace.st;
      hero.value.singularitySpace.st = 0;
      hero.value.spCount = hero.value.singularitySpace.spCount;
      hero.value.singularitySpace.spCount = 0;
      hero.value.isSpaceAuto = true;
    }
    if(hero.value.singularity >= 6) {
      hero.value.eqUps['spRing'] = hero.value.singularityRingUp;
      hero.value.singularityRingUp = 0;
    }
    if(hero.value.singularity >= 7) {
      hero.value.rebirthPts = 1e5;
      hero.value.rebirthTier = hero.value.singularityRebirthTier;
      hero.value.singularityRebirthTier = 0;
    }
    return;
  }
  hero.value.isSingularity = true;

  hero.value.killsPerZone = Math.min(1250 * (hero.value.singularity + 1), 10000);
  hero.value.stage = 1;

  if(hero.value.singularity >= 2){
    hero.value.treeAuto = false;
    for (let perk of tperks.value){
      if(perk.status !== 'undefined')
        perk.status = false;
      if(perk.infStatus !== 'undefined')
        perk.infStatus = false;
    }
  }
  if(hero.value.singularity >= 3){
    ascension.forEach((perk, index) => {
      hero.value.singularityAscension[index] = perk.level;
      perk.level = 0;
    });
  }
  if(hero.value.singularity >= 5) hero.value.activeBuffs = [];
  if(hero.value.singularity >= 4) {
    hero.value.isSpaceAuto = false;
    hero.value.singularitySpace.sp = hero.value.sp;
    hero.value.sp = 0
    hero.value.singularitySpace.st = hero.value.st;
    hero.value.st = 0;
    hero.value.singularitySpace.spCount = hero.value.spCount;
    hero.value.spCount = 0;
  }
  if(hero.value.singularity >= 6) {
    hero.value.singularityRingUp = hero.value.eqUps['spRing'];
    hero.value.eqUps['spRing'] = 0;
  }
  if(hero.value.singularity >= 7) {
    hero.value.rebirthPts = 0;
    hero.value.singularityRebirthTier = hero.value.rebirthTier;
    hero.value.rebirthTier = 0;
  }
  if(hero.value.singularity >= 8) {
    hero.value.kills = hero.value.singularityKills;
    hero.value.rebirthPts = 1e5 + (Math.log(hero.value.singularityKills) ** 7.26);
  }
}

const performSoulD = () => {
  if (enemy.value.isSpaceFight == 2) return;
  if (hero.value.souls >= hero.value.soulsCap) return;
  if (hero.value.dId === 'd-next' && dimensions.value[34].infTier > 15) return;
  
  if(hero.value.selectedDivSkills.includes(11) || hero.value.selectedDivSkills.includes(6)){
    return;
  }

  hero.value.soulD = hero.value.soulD? false: true;
  if(hero.value.soulD){
    hero.value.soulDStage = hero.value.stage;
    hero.value.stage = 15;
    hero.value.kills = 0;
  } else {
    hero.value.stage = hero.value.soulDStage;
    hero.value.kills = 0;
    hero.value.zone = 1;
    enemy.value.soulBuff.active = false;
  }
  hero.value.mutations = 0;
}

const performAscension = () => {
  if(enemy.value.isSpaceFight == 2) return;

  if(hero.value.eventDoubleClick){
    const confirmed = window.confirm(
      "Click OK to confirm The Ascension"
    )
    if (!confirmed) return;
  }

  hero.value.perform = true;
  hero.value.isAscend = true;
};

const performRebirth = () => {
  if(enemy.value.isSpaceFight == 2) return;

  if(hero.value.eventDoubleClick){
    const confirmed = window.confirm(
      "Click OK to confirm The Rebirth"
    )
    if (!confirmed) return;
  }

  hero.value.perform = true;
  hero.value.isRebirth = true;
}

const performAbyss = () => {
  if(enemy.value.isSpaceFight == 2) return;

  if(hero.value.eventDoubleClick){
    const confirmed = window.confirm(
      "Click OK to confirm to enter the Abyss."
    )
    if (!confirmed) return;
  }

  if(hero.value.dId == 'abyss-d') return;

  if(hero.value.isAbyss && hero.value.stage >= (20 + 10 * hero.value.abyssTier)){
    hero.value.abyssTier = Math.min(hero.value.abyssTier + 1, 3);
    if(hero.value.abyssTier == 1){
      hero.value.soulsCap += 10;
    }
    if(hero.value.abyssTier == 2){
      hero.value.soulsCap += 10;
    }
   
    hero.value.isAbyss = false;
    hero.value.perform = true;
    perform();
    hero.value.souls = 0;
    return;
  }

  if(hero.value.isAbyss && hero.value.stage < 20 + 10 * hero.value.abyssTier){
    hero.value.isAbyss = false;
    hero.value.perform = true;
    perform();
    hero.value.souls = 0;
    return;
  }
  
  hero.value.souls = 0;
  hero.value.isAbyss = true;
  hero.value.perform = true;

  perform();
}

const performInf = () => {
  if(enemy.value.isSpaceFight == 2) return;

  if(hero.value.eventDoubleClick){
    const confirmed = window.confirm(
      "Click OK to confirm The Infinity Trial"
    )
    if (!confirmed) return;
  }

  hero.value.perform = true;
  hero.value.dTimer = 0;
  hero.value.infTier = hero.value.mainInfTier;
  hero.value.infEvents = hero.value.mainInfTier + 1;

  perform();
  hero.value.activeBuffs = [];
  hero.value.spActiveBuffs = [];
  hero.value.stardust = 0 + (hero.value.bhTier >= 1? 1e7: 0);
  hero.value.spCount = 0;
  hero.value.spsCount = 0;
  hero.value.sp = 0;
  hero.value.st = 0;

  hero.value.formationTypes[0].status = false;
  hero.value.formationTypes[1].status = false;
  hero.value.formationTypes[2].status = false;
  hero.value.formationTypes[3].status = false;
  hero.value.activeFormation = null;

  hero.value.totalRebirthPts = 0;
  hero.value.rebirthPts = (hero.value.singularity < 8? 0: 1e5 + Math.log(hero.value.singularityKills + 3) ** 7.26);
  hero.value.cursedBonusExp = 0;
  hero.value.cursedBonus = 0;
  hero.value.rebirthTier = 0;

  hero.value.autoTreeCooldown = 3;
  hero.value.activeCurse = [];
  hero.value.activeCuseTier = [];
  hero.value.curse = 0;
  hero.value.souls = 0;
  hero.value.soulTier = 0;
  hero.value.soulsCap = 20 + (hero.value.rebirthPts >= 2.5e5? 10: 0) + 
  (hero.value.rebirthPts >= 5.5e5? 10: 0);
  hero.value.soulsMax = 0;
  hero.value.maxBuffs = 1;
  hero.value.ascendShardPerform = 0;
  hero.value.ascensionShards = 0;
  hero.value.totalAscensionShards = 0;
  hero.value.abyssTier = (hero.value.rebirthPts >= 2.5e5? 1: 0) + 
  (hero.value.rebirthPts >= 5.5e5? 1: 0) + (hero.value.rebirthPts >= 1.5e6? 1: 0);
  hero.value.isAbyss = false;

  hero.value.soulD = false;
  hero.value.spaceFight = false;
  hero.value.isSpaceBuff = false;

  
  hero.value.equipmentTiers['spRing'] = 0;
  hero.value.eqTierReq['spRing'] = 0;

  hero.value.eqUps['sword'] = 0;
  hero.value.eqUps['armor'] = 0;
  hero.value.eqUps['boots'] = 0;
  hero.value.eqUps['ring'] = 0;
  hero.value.eqUps['spRing'] = 0;

  for(let idx in radPerks){
    radPerks[idx].level = 0;
  }
  radPerks[6].status = false;
  radPerks[6].baseCost = 2500;
  radPerks[6].description = 'REBUILD REBIRTH SYSTEM THAT ALLOWS YOU TO SPEND MUTAGEN TO UP YOUR POTENTIAL';
  radPerks[6].max = 1;

  for(let sp of spEnemy){
    if(sp.id%6 == 0){
      sp.status = false;
    }
  }  
  

  if(hero.value.singularity < 4){
    for(let perk of ascension){
      if(perk.tier != 6 && perk.tier != 7 && perk.tier != 8)
        perk.level = 0;
    }
  }
  
  amulets[0].status = false;
  amulets[1].status = false;
  amulets[2].status = false;
  amulets[3].status = false;

  amulets[0].suffix.status = false
  amulets[1].suffix.status = false
  amulets[2].suffix.status = false
  amulets[3].suffix.status = false

  amulets[0].prefix.status = false
  amulets[1].prefix.status = false
  amulets[2].prefix.status = false
  amulets[3].prefix.status = false


  cursed[7].status = false;
  cursed[8].status = false;
  cursed[9].status = false;
  cursed[10].status = false;
  cursed[11].status = false;
  cursed[12].status = false; 

  if(hero.value.singularity < 6){
    for(let buff of buffs.value){
        if(buff.id == 6) continue;
        buff.exp = 0;
        buff.tier = 1;
        buff.maxTier = 3;
        buff.active = false;
      }
  }
  

  for (let perk of tperks.value){
    perk.level = 0;
    if(perk.status !== 'undefined')
      perk.status = false;
    if(perk.infStatus !== 'undefined')
      perk.infStatus = false;
  }

  buffs.value[0].ptr = 0;
  buffs.value[0].def = 1;

  buffs.value[1].used = false;
  buffs.value[1].usedSkill = false;
  buffs.value[1].stun = 0;

  buffs.value[2].combo = 0;

  buffs.value[4].time = 0;

  buffs.value[5].debuff = 0;
  buffs.value[5].stuck = 0;

  buffs.value[8].time = 0;

  buffs.value[10].rise = 1;
  buffs.value[10].buffT2 = 0
  buffs.value[10].buffT3 = 0;
  buffs.value[10].buffT3HP = 0;

  buffs.value[12].dmg = 1;
  buffs.value[12].crit = 0;
  buffs.value[12].critDmg = 0;


  enemy.value.rebirthEnemy.dmg = 1;
  enemy.value.rebirthEnemy.hp = 1;
  enemy.value.rebirthEnemy.drop = 1;

  enemy.value.ascensionSoul.stats = 1;
  enemy.value.ascensionSoul.active = false;

  enemy.value.rebirthSoul = false;
  enemy.value.danger = 0;
  enemy.value.enemyPower = 1;
  enemy.value.spaceBossChance = 0;
  enemy.value.isSpaceFight = 0;
  enemy.value.dangerEnemyChance = [0, 0, 0, 0, 0, 0];
  enemy.value.spawnType = 'none';

  hero.value.maxStage = 1;
  hero.value.souls = 0;
  hero.value.mutagen = (hero.value.mainInfTier >= 35? 1e4: hero.value.mutagen);
  hero.value.mutations = 0;
  hero.value.infProgress = false; 
  killHistory.length = 0;
  enemy.value.soulBuff.soulsStardustReq = 0;
  enemy.value.soulBuff.soulsMutagenReq = 0;

  hero.value.spaceUnlocked = (hero.value.abyssTier < 3 && hero.value.rebirthPts < 1e5? false: true);
  
}

const perform = () => {
  hero.value.eLevel = 1;
  hero.value.exp = 0;
  hero.value.stage = 1 + (hero.value.dId == 'overstage'? 100 + 2 * (dimensions.value[19].infTier - 15) - hero.value.minStage: 0) + 
  hero.value.minStage;

  hero.value.stage = (hero.value.dId == 'next'? Math.min(hero.value.stage, 30): hero.value.stage);
  hero.value.stage = (hero.value.dId == 'd-next'? Math.min(hero.value.stage, Math.max(30 - dimensions.value[34].infTier, 1)): hero.value.stage);

  hero.value.zone = 1;
  hero.value.kills = 0;
  hero.value.killsPerZone = 5;
  hero.value.nextLevelExp = 100;
  hero.value.activeCurse = [];
  hero.value.totalAscensionShards = 0;
  hero.value.ascendShardPerform = 0;
  hero.value.totalRebirthPts = 0;

  enemy.value.soulBuff.chance = 0;

  for (let perk of tperks.value){
    if(perk.name == "Invisible" || perk.name == "Traveller")
      perk.level = perk.level;
    else
      perk.level = 0;
  }
  hero.value.treeTier = 0;
  hero.value.perkPoints = 0 + hero.value.freeTreePoints;

  hero.value.eqDrop['sword'] = 0;
  hero.value.eqDrop['armor'] = 0;
  hero.value.eqDrop['boots'] = 0;
  hero.value.eqDrop['ring'] = 0;

  hero.value.afkSoulBoost = 1;
  hero.value.soulD = false;
  enemy.value.weakStack = 0;
  hero.value.shardsMult = 0;
  hero.value.shardsPerformMult = 0;
  hero.value.travellPenalty = 1;
  hero.value.isTravell = false;
  hero.value.dKills = 0;
  hero.value.damageStage = 0;
  enemy.value.d_damagePenalty = 0;

  hero.value.survivalLife = dimensions.value[30].infTier;

  if(hero.value.gcnpSetting){
    hero.value.isLocked = true;
    hero.value.isStage = false;
  } else {
    hero.value.isLocked = false;
    hero.value.isStage = true;
  }
}

function format(value) {
  if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
}

function formatNumber(num, f = false) {
  if(f && num < 100) return num.toFixed(2);
  if (num < 1000) return Math.floor(num);

  const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
  const tier = Math.floor(Math.log10(num) / 3);

  const suffix = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}


const showStageModal = ref(false);
const showAfkModal = ref(false);
const showAutoModal = ref(false);
const autoTemp = reactive({
  ascensionMinShards: auto.value.ascension.minShards,
  ascensionMinStage: auto.value.ascension.minStage,
  rebirthMinPts: auto.value.rebirth.minPts,
  rebirthMinLevel: auto.value.rebirth.minLevel,
  rebirthMinLevelNext: auto.value.rebirth.minLevelNext,
  stopStage: auto.value.stop.stage,
  stopStageNext: auto.value.stop.stageNext,
  stopUntilKills: auto.value.stop.untilKills
})

function applyAutoSettings() {
  auto.value.ascension.minShards = autoTemp.ascensionMinShards;
  auto.value.ascension.minStage = autoTemp.ascensionMinStage;

  auto.value.rebirth.minPts = autoTemp.rebirthMinPts;
  auto.value.rebirth.minLevel = autoTemp.rebirthMinLevel;
  auto.value.rebirth.minLevelNext = autoTemp.rebirthMinLevelNext;

  auto.value.stop.stage = autoTemp.stopStage;
  auto.value.stop.stageNext = autoTemp.stopStageNext;
  auto.value.stop.untilKills = autoTemp.stopUntilKills;
}

function resetSettings() {
  auto.value.ascension.minShards = 0;
  auto.value.ascension.minStage = 0;

  autoTemp.ascensionMinShards = 0;
  autoTemp.ascensionMinStage = 0;


  auto.value.rebirth.minPts = 0;
  auto.value.rebirth.minLevel = 0;
  auto.value.rebirth.minLevelNext = 0;

  autoTemp.rebirthMinPts = 0;
  autoTemp.rebirthMinLevel = 0;
  autoTemp.rebirthMinLevelNext = 0;


  auto.value.stop.stage = 0;
  auto.value.stop.stageNext = 0;
  auto.value.stop.untilKills = 0;

  autoTemp.stopStage = 0;
  autoTemp.stopStageNext = 0;
  autoTemp.stopUntilKills = 0;
}

const targetStage = ref(1);
function travelToStage() {
  if(hero.value.isSingularity) return;

  if(targetStage.value == 1111) {
    console.log('Secret-4');
    hero.value.secrets.travell = true;
  }
  targetStage.value = Math.max(Math.min(targetStage.value, hero.value.maxStage), 1);

  hero.value.stage = targetStage.value < 100? (hero.value.dId == 'overstage'? 100 + 2 * (dimensions.value[19].infTier - 15): targetStage.value): targetStage.value; 
  hero.value.travellPenalty = (hero.value.dId.startsWith('d-')? 8: 4);
  hero.value.isTravell = true;
}

const afkPercent = computed(() => (hero.value.afkTimer / hero.value.afkMaxTimer) * 100);

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s - (${Math.floor((seconds / hero.value.afkMaxTimer)*100)}%)`;
}

function useAfkTime() {
  if(hero.value.isSingularity) return;

  const percent = Math.min(Math.max(hero.value.afkSpendPercent, 0), 100);
  const usedTime = Math.floor((hero.value.afkMaxTimer * Math.min(percent, (hero.value.afkTimer / hero.value.afkMaxTimer) * 100)) / 100);
  hero.value.afkTimer -= usedTime;
  
  let maxKill = hero.value.maxStage * 75;

  let div = hero.value.enemyAfkHp * (usedTime ** 0.1) - hero.value.attack;
  hero.value.afkKills = Math.min(div > 0? (hero.value.attack / (hero.value.enemyAfkHp * (usedTime ** 0.1))) * usedTime: usedTime, maxKill);
  hero.value.afkTime = usedTime;
  hero.value.afkLocked = true;
}

function deathRecovery() {
  let text = `At this stage, the world suppresses your excessive power, making recovery after death take longer by [${(hero.value.recoveryPenalty).toFixed(2)}] times`;

  return text;
}

function infHandle() {
  let penalty = Math.max(Math.min(hero.value.infPower, 1), 0);

  return `Penalty for this trial: 
  Max Level: <span style='color: red'>[^${penalty.toFixed(2)}]</span>
  EXP Gain: <span style='color: red'>[^${penalty.toFixed(2)}]</span>`;
}

function darkEnergyHandle() {
  let text = `Kill all <span style="color: rgb(30, 67, 64); font-weight: bold; text-shadow: 0 0 5px rgb(0, 0, 0);">[Obscurants]</span> to advance to the next <span style='color: gold'>Infinity Tier</span><br><br>`;
  text += `<span style="color: rgb(30, 67, 64); font-weight: bold; text-shadow: 0 0 5px rgb(0, 0, 0);">[Obscurants]</span>: ${enemy.value.darkEnergy.totalBosses} / ${enemy.value.darkEnergy.maxBosses}<br>`;
  

  if(enemy.value.darkEnergy.totalBosses < enemy.value.darkEnergy.maxBosses)
    text += `Stage: <span style='color: gold'>${100 + 5 * enemy.value.darkEnergy.totalBosses}</span>`
  else text += `All <span style="color: rgb(30, 67, 64); font-weight: bold; text-shadow: 0 0 5px rgb(0, 0, 0);">[Obscurants]</span> are found`

  return text;
}

function doomHandle() {
  let text = `When you kill an enemy, you gain a stack of <span style="color: red">*Doom*</span>. Each stack reduces your stats.

    Current stacks: ${enemy.value.d_damagePenalty}

    DMG penalty: ${Math.floor(hero.value.d_damage_penalty.dmg)}
    HP penalty: ${Math.floor(hero.value.d_damage_penalty.hp)}
    DEF penalty: ${Math.floor(hero.value.d_damage_penalty.def)}
  `;

  if(dimensions.value[28].infTier >= 20)
    text += `<br>You have a 50% chance not to receive a stack of <span style="color: red">*Doom*</span> when you kill.`;
  else if(dimensions.value[28].infTier >= 10)
    text += `<br>You have a 25% chance not to receive a stack of <span style="color: red">*Doom*</span> when you kill.`;
  
  return text;
}

function darkEnemyHandle() {
  let danger = 1000 + 500 * dimensions.value[31].infTier;
  let stage = 100 + 10 * dimensions.value[31].infTier;
  return `Find <span style="color: orange">Dimension Colossuses</span> to advance to the next <span style="color: gold">Infinity Tier</span>
  
  Requirement: 
  Danger: <span style="color: gold">[${danger}+]</span>
  Stage: <span style="color: gold">[${stage}+]</span>
  `
}

function nextDimHandle() {
  let stage = Math.max(30 - dimensions.value[34].infTier, 1);
  let maxStage = 30 + 5 * dimensions.value[34].infTier;
  if(hero.value.dId == 'd-next')
    return `This world has been shattered by gravity. Your maximum possible stage is <span style="color: red">${stage}</span>.`;
  if(hero.value.darkId.includes('d-next'))
    return `You Max possible Stage is <span style="color: gold">${maxStage}</span>`;

  return "";
}

function bleedingVeilHandle() {  
  return `<span style='color: #c31414'>[Bleeding Veil]</span>

    Each second, you will take DMG equal to <span style='color: #c31414'>[${hero.value.bleedvealValue}]</span>
    The power of <span style='color: #c31414'>[Bleeding Veil]</span> increases with each stage passed.
  `
}

function corruptionHandle() {
  let text = `<span style="color: violet">While you are affected by corruption:</span><br>`;

  text += `<span style="color: orange">Celestials Power: *</span> <span style="color: gold">${formatNumber((hero.value.dId.startsWith('d-') && hero.value.isTravell? 2: 1) * hero.value.dCorruptionEffect)}</span><br>`;

  // Enemy DMG
  if (hero.value.dId == 'd-corruption') {
    text += `<span style="color: red">Enemy DMG: *</span> <span style="color: gold">${formatNumber(Math.floor(Math.max(
      100 - hero.value.overcorruption ** (2 - 0.025 * dimensions.value[26].infTier),
      10
    ) * 1.05 ** dimensions.value[26].infTier))}</span><br>`;
  } else if (hero.value.darkId.includes('d-corruption')) {
    text += `<span style="color: red">Enemy DMG: *</span> <span style="color: gold">${Math.floor(
      (hero.value.dId.startsWith('d-') && hero.value.isTravell? 2: 1) * Math.max(100 - hero.value.overcorruption ** (2 + 0.05 * dimensions.value[26].infTier), 10)
    )}</span><br>`;
  }

  // Enemy HP
  if (hero.value.dId == 'd-corruption') {
    text += `<span style="color: lightgreen">Enemy HP: *</span> <span style="color: gold">${formatNumber(Math.floor(Math.max(
      10000 - hero.value.overcorruption ** (4 - 0.05 * dimensions.value[26].infTier),
      100
    ) * 1.5 ** dimensions.value[26].infTier))}</span><br>`;
  } else if (hero.value.darkId.includes('d-corruption')) {
    text += `<span style="color: lightgreen">Enemy HP: *</span> <span style="color: gold">${Math.floor(
      (hero.value.dId.startsWith('d-') && hero.value.isTravell? 2: 1) * Math.max(10000 - hero.value.overcorruption ** (4 + 0.075 * dimensions.value[26].infTier), 100)
    )}</span><br>`;
  }

  // Decrease Max Level
  if (hero.value.dId == 'd-corruption') {
    text += `<span style="color: lightblue">Decrease your Max Level by</span> <span style="color: red">${(
      hero.value.overcorruption /
      (10 + 2.5 * dimensions.value[26].infTier)
    ).toFixed(2)}</span>`;
  }

  return text;
}

function dHardHandle() {
  let text = `Curse Power: <span style="color: red">*${(hero.value.curseMult).toFixed(2)}</span>`;

  return text;
}

function dBuffsHandle() {
  let descrease = Math.min(Math.log(1 + dimensions.value[32].infTier) ** 4 , 80);

  let text = `Buffs appearance chance: <span style='color: yellow'>${(100 - descrease).toFixed(2)}</span>`;

  return text;
}

function dInfTreeHandle() {
  let mult = 1;

  if(hero.value.dId == 'd-noTree')
    mult = 2 + 0.25 * dimensions.value[35].infTier;
  else if(hero.value.darkId.includes('d-noTree'))
    mult = 2 - 0.02 * dimensions.value[35].infTier;

  let text = `Cost of Infinity Tree Perks: <span style="color: gold">${(mult).toFixed(2)}<span>`;

  return text;
}

function apsHandle() {
  let aps =  0.01 * hero.value.stage * Math.sqrt(Math.log(3 + dimensions.value[39].infTier));
  let enemyAps = 0.01 * hero.value.stage * Math.sqrt(Math.log(3 + dimensions.value[39].infTier));

  let text = `APS Penalty: <span style="color: red">-${aps.toFixed(2)}</span>
  Max APS: <span style="color: red">${Math.max(hero.value.maxAPS, hero.value.attacksPerSecond)}</span>
  Enemy APS: <span style="color: yellow">+${enemyAps.toFixed(2)}</span>: 
  `
  
  return text;
}

function noEqDimHandle() {
    let dark_d_penalty = (hero.value.dId == 'd-noEq'? (Math.E * (dimensions.value[36].infTier + 1)) ** 1.3: 1);
    dark_d_penalty = (hero.value.darkId.includes('d-noEq')? Math.max(Math.E ** (1.3 - 0.015 * dimensions.value[36].infTier), 1): dark_d_penalty);

    let text = `Enhances Cost: <span style="color: gold">*${formatNumber(dark_d_penalty)}</span>`;
    if(hero.value.darkId.includes('d-noEq'))
      text += `<br>Your possible Max Equipment Tier is <span style="color: rgb(0, 255, 255)">${dimensions.value[36].infTier + 1}</span>`

    return text; 
}

function unlimitedDimHandle() {
  let lvlRed = Math.max(hero.value.dTimer ** (0.1 + 0.01 * dimensions.value[38].infTier), 1);
  let text = `Max Level Reduction: <span style="color: red">${lvlRed.toFixed(3)}</span>`;

  return text;
}

function stageHardCap() {
  return `<span style="color: rgb(0, 255, 255)">Your knowledge of this world is too small, perhaps [D-Gravity] will give you a hint</span>`;
}

function darkSpaceHandle() {
  let power = (Math.E * (1 + dimensions.value[37].infTier)) ** 1.75;
  let count = 6 * (dimensions.value[37].infTier + 1);
  let text = `Celestials are <span style="color: gold">${formatNumber(power)}</span> times stronger<br>`;
  text +=  `Beat <span style="color: gold">${hero.value.spCount + hero.value.spsCount} / ${count}</span> celestials to advance to the next Infinity Tier`;

  return text;
}

function travellHandle() {
  let text = `<span style="color: lightblue">Travel Effect</span>
  
  Enemies are stronger by <span style="color: red">${hero.value.travellPenalty.toFixed(2)}</span>.
  `
  if(hero.value.dId.startsWith('d-'))
    text += `<br>While you are in the Dark Dimension, the effect of the travell is worse and extends to other effects:
    - The effect of Corruption is doubled
    - The effect of Curse is doubled
    - You gain 2 Doom stacks instead of 1`;

  return text;
}

function spaceTimerHandle() {
  let text = `<span style="color: orange">[D-Space]</span> spreads its influence here. You can't stay for too long. 
  You have <span style="color: gold">${Math.floor(hero.value.spaceTimer)}s</span> before you die.`;

  return text;
}

</script>

<style scoped>
.zone-progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  text-align: center;
  min-height: 3vh;
}

.left-icons,
.right-icons {
  display: flex;
  gap: 0.1rem;
  align-items: center;
}

.progress-center {
  flex: 1;                 
  display: flex;
  justify-content: center; 
  position: fixed;
    left: 47%;
}

.progress-text {
  text-shadow: 0 0 4px #00ffea;
}

.tooltip-content {
  text-align: left;  
}


.zone-progress {
  position: absolute;
  top: 20%;  
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.zone-progress h3 {
  color: #fff;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.progress-bar-container {
  position: relative;
  background-color: #333;
  height: 26px;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  transition: width 0.4s ease;
}

.progress-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 0 0 2px #000;
  white-space: nowrap;
  pointer-events: none;
}




.lock-stage-wrapper {
  position: relative;
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  margin: 5px;
}

.stage-modal {
  position: absolute; 
  top: 100%; 
  z-index: 1000;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 0.5rem;
  width: 200px;
}

.lock-stage-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #2f2f2f;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  font-size: 0.85rem;
}

.stage-input-group {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.3rem;
}

.stage-input-group input {
  width: 60px;
  text-align: center;
}

.stage-description {
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 0.3rem;
}

.lock-stage-button:hover {
  background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
  box-shadow: 0 4px 6px rgba(0,0,0,0.5);
}

.spinner {
  width: 14px;               
  height: 14px;
  border: 2px solid #ccc;
  border-top: 2px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.fspinner {
  border-top-color: #ff5555;
}

.spinner.paused {
  animation-play-state: paused;
}

.button-text {
  font-size: 0.75rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}




.progress-header {
  display: flex;
  align-items: center;
  gap: 8px; 
}

.btnAscend {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
}

.ascend-wrapper {
  position: relative;
  display: inline-block;
}


.btnAscend:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.ascend-tooltip {
  display: none;
  position: absolute;
  top: -100%;
  left: 100%;
  transform: translateY(-50%);
  width: 230px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  white-space: normal;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 17, 255, 0.8);
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.btnAscend:hover .ascend-tooltip {
  display: block;
}
/* rebirth */
.btnRebirth, .btnAbyss, .btnInf, .btnSoul, .btnSingularity {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.btnAbyss {
  scrollbar-color: rgb(217, 47, 243) transparent;
}

.rebirth-wrapper, .abyss-wrapper, .inf-wrapper, .soul-wrapper, .singularity-wrapper {
  position: relative;
  display: inline-block;
}


.btnRebirth:hover, .btnAbyss:hover, .btnInf:hover, .btnSoul:hover, .btnSingularity:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.rebirth-tooltip, .abyss-tooltip, .inf-tooltip, .soul-tooltip, .singularity-tooltip {
  display: none;
  position: absolute;
  
  left: 100%;
  transform: translateY(-50%);
  width: 230px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  white-space: normal;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(21, 255, 0, 0.8);
}

.btnRebirth:hover .rebirth-tooltip, .btnAbyss:hover .abyss-tooltip, .btnInf:hover .inf-tooltip, .btnSoul:hover .soul-tooltip, .btnSingularity:hover .singularity-tooltip {
  display: block;
}

.abyss-shadow {
  top: 180%;
  box-shadow: 0 0 10px rgba(225, 0, 255, 0.8);
  overflow-y: auto;
  max-height: 300px;
}

.inf-shadow {
  top: 180%;
  box-shadow: 0 0 10px rgb(238, 255, 0);
  max-height: 300px;
  overflow: auto;
}

.singularity-shadow {
  top: 180%;
  box-shadow: 0 0 12px 4px #66ffcc;
  max-height: 300px;
  overflow: auto;
}

.infinity-glow {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s linear infinite;
  display: inline-block;
  line-height: 25px;
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}



.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  color: white;
  max-height: 80vh;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stage-list-scrollable {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 6px;
  margin: 10px 0;
  width: 100%;
}


.stage-list-scrollable::-webkit-scrollbar {
  width: 6px;
}
.stage-list-scrollable::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.stage-list-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.stage-list-scrollable button {
  background: #333;
  color: white;
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.stage-list-scrollable button:hover {
  background: #555;
}

.close-btn {
  background-color: #900;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.staticIconPos {
  width: 25px;
  height: 25px;
}

.hidden {
  visibility: hidden; 
}




.stage-wrapper {
  background: #1e293b;
  padding: 16px;
  max-width: 400px;
  color: #eee;
  text-align: center;
}

.stage-input-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}

.stage-input-group input {
  padding: 8px;
  border: none;
  border-radius: 6px;
  width: 100px;
  background: #333;
  color: #fff;
}

.stage-input-group button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.stage-input-group button:hover {
  background: #66bb6a;
}



.afk-wrapper {
  background: #1e293b;
  padding: 16px;
  color: #eee;
  width: 400px;
  font-family: "Consolas", monospace;
}

.afk-bar-container {
  background: #333;
  border-radius: 8px;
  height: 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
}

.afk-bar {
  height: 100%;
  background: linear-gradient(to right, #00ffcc, #0099ff);
  transition: width 0.4s ease;
}

.afk-time {
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
  text-shadow: 0 0 4px #000;
}

.afk-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.afk-controls input {
  width: 60px;
  padding: 4px;
  border: 1px solid #666;
  border-radius: 4px;
  background: #222;
  color: #fff;
}

.afk-controls button {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

.afk-controls button:hover {
  background: #218838;
}




.auto-panel-wrapper {
  flex-direction: column;
  background-color: #1e293b;
  padding: 8px;
}

.auto-panel {
  background: rgba(30, 30, 50, 0.95);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #444;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 14px;
}

.auto-panel h3 {
  font-size: 15px;
  margin-bottom: 8px;
  color: #ffd700;
}

.auto-panel label {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

.auto-panel input {
  width: 80px;
  background: #222;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  padding: 2px 6px;
}


.auto-settings-modal {
  position: absolute;
  top: 50px; 
  right: 20px;
  background: #111;
  border: 2px solid #444;
  padding: 16px;
  z-index: 1000;
  width: 280px;
  color: #fff;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 40vh;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.auto-settings-modal .auto-panel {
  margin-bottom: 12px;
}

.auto-settings-modal label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.auto-settings-modal .modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}


.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* расстояние между кнопками */
  margin-top: 12px;
}

.modal-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #4a90e2;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-buttons button:hover {
  background-color: #357ab8;
}

.modal-buttons button:active {
  background-color: #2c5f94;
}



</style>
