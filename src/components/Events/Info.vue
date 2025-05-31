<template>
  <div class="info-container">
    <div class="event-tabs">
      <button
        v-for="event in events"
        :key="event"
        :disabled="disfunc(event)"
        @click="activeEvent = event"
        :class="{ active: activeEvent === event }"
      >
        {{ event }}
      </button>
    </div>

    <div
      v-for="section in filteredSections"
      :key="section.title"
      class="info-card"
      :class="section.class"
    >
      <h3 class="info-title">{{ section.title }}</h3>
      <p
        v-for="(line, index) in section.content"
        :key="index"
        class="info-line"
        v-html="line == false? '': line"
      ></p>
    </div>

    <div v-if="activeEvent === 'Buffs'" class="info-card buffs-section">
      <h3 class="info-title">Buffs</h3>
      <p class="info-line">After stage 10 all Buffs become permanent(+10 CAP for each Abyss Tier). You can change them after <strong>ASCENSION</strong> & <strong>REBIRTH</strong></p>
      <p class="info-line">Reach stage 20 to gain BUFF EXP</p>
      <p>MAX available BUFF Tier - 3. </p>
      <p class="info-line">Double Check - If the first attempt is false, the check is repeated.</p>
      <p class="info-line">Overkill - The ability to kill an enemy without a fight. The enemy does not drop loot.</p>
      <p class="info-line" v-if="hero.rebirthPts >= 100000 && hero.abyssTier >= 3">Space - Activate/deactivate to choose buffs for Space Fight. Space Buffs dont get BUFF EXP</p>
      <div class="buffs-list">
        <div v-for="buff in availableBuffs" :key="buff.id" class="buff-card">
          <h4 class="buff-name">🔹 {{ buff.name }}</h4>
          <ul class="buff-descriptions">
            <li v-for="(desc, index) in tieredDescriptions(buff)" :key="index">{{ desc }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="activeEvent === 'Stats'" class="stats-panel">
      <div class="tabs">
        <button
          v-for="section in statTabs"
          :key="section"
          @click="selectedTab = section"
          :class="['tab-button', { active: section === selectedTab }]"
        >
          {{ section }}
        </button>
      </div>

      <div class="stats-content">
        <ul v-if="currentSection">
          <li
            v-for="(item, index) in currentSection.content"
            :key="index"
            class="stat-item"
          >
           <span
              class="desc"
              :class="{ uppercase: item.uppercase }"
              :style="{ color: item.color || '#ccc' }"
            >
              {{ item.desc }}
            </span>
            <span class="value">
              {{ typeof item.value === 'function' ? item.value() : item.value }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { ref, computed, watch } from 'vue';
import { equipment } from '../../data/equipment.js';
import { perks as ascenPerks } from '../../data/ascension.js';
import { perks } from '../../data/perks.js';
import { perks as radPerks } from '../../data/radPerks.js';
import { amulets } from '../../data/amulets.js';
import { dimensions } from '../../data/dimensions.js';
import { cursed } from '../../data/cursed.js';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const activeEvent = ref('Lore');
const selectedTab = ref('Level')

const events = [
  'Lore',
  'Tree',
  'Equipment',
  'Ascension',
  'Souls',
  'Amulet',
  'Rebirth',
  'Abyss',
  'Space',
  'Radiation',
  'Corruption',
  'Infinity',
  'Buffs',
  'Singularity',
  'Dimension',
  'Stats',
];

function disfunc(event){
  return !hero.value.infoActive[event.toLowerCase()];
}

const filteredSections = computed(() => {
  return styledSections.filter(section =>
    section.class.includes(activeEvent.value.toLowerCase())
  );
});

const currentSection = computed(() =>
  statSections.find((s) => s.title === selectedTab.value)
);

const availableBuffs = computed(() => buffs.value.filter(buff => buff.active));

function tieredDescriptions(buff) {
  return buff.description.slice(0, buff.tier);
}


const styledSections = [
  {
    title: 'Endless Progress',
    class: 'endless-section lore',
    content: [
      'Endgame content is The Dimension [DD-zΘaYY]',
      'Next update 0.4: ?'
      ]
  },
  {
    title: 'Why LevelUp?',
    class: 'lore-section',
    content: [`
    Do you realize how powerful you are? Traveling between Dimensions, destroying Galaxies and Celestials. 
    But what you may not know is that D-Rule is watching you, and when you are weak enough, he will destroy you, because only one can be the Chosen One.
     What is it that makes you want to be stronger every time, and break down every wall that stands in your way. 
     Ask me when you find me between all these dimensions.
    `]
  },
  {
    title: 'Usefull Info',
    class: 'lore-section',
    content: [
      'S - Can be stacked with the same effect',
      '* - When you hover over it, a pop-up window appears with information',
      '^ - Exponent',
      'ApS - Attack per Second',
      'Total Level = Current Level + MIN Level',
      'True Max Level - Level without any effects',
      '<strong>Event information is revealed when you reach that event.</strong>',
      'Green circle next to progress(GCNP) - activate to stop in current zone. Useful for farming. Maximum farming efficiency when you kill an enemy with one hit',
      'Stats from the level are added only those that are in the range of the maximum level + minimum level *When your current Level is higher than the Maximum Level*'
    ]
  },
  {
    title: 'AFK',
    class: 'afk-section lore',
    content: [
      'Enemies grow stronger when you are AFK. You can kill a maximum of 1 enemy per second..',
      'Max AFK Kills = Max Stage Passed × 75.',
      'You skip boss fights if their stage is 15 below your max stage.',
      'Exp gain depends on stage and Tree, Ascension, Rebirth perks.(excluding Formation, Buffs)',
      'Soul Booster increase The chance of soul appearence. The Power depends on Total AFK kills. Soul Booster works for only One Soul.',
      'On AFK Radiation affects T3 curse chance and each mutagen Tier chance'
    ]
  },
  {
    title: 'Tree',
    class: 'tree-section',
    content: [
      'Reset Perks: Resets all to level 1 and refunds Points.',
      'Increase the MAX level of perks by raising the tree tier',
      hero.value.infTier >= 1 && 'The Cap of Infinity Perks is equal to The Infinity Tier',
      hero.value.infTier >= 1 && 'Auto - Activate to upgrade perks automatically '
    ]
  },
  {
    title: 'Ascension',
    class: 'ascension-section',
    content: [
      'Gain Ascension Shards after stage 10.',
      'Ascension Shards are obtained by completing stages',
      'Souls only reward once by Ascension Shards.',
      hero.value.infTier >= 2 && 'Bosses give additional shards depending on the stage and Boss Loot [Infinity T2]'
    ]
  },
  {
    title: 'Souls',
    class: 'souls-section',
    content: [
      'Soul appears from stage 15.',
      'Each soul gives +1 Max Level & (+10% EXP until 40 Souls - +40 After [Infinity T6]).',
      '+1 MIN Level per 10 Souls [Infinity T6]',
      'Next tier: 10 kills.',
      'Soul Loot & Power depends on total souls',
      'Soul chance depends on stage + total souls.',
      'Soul Cap = 20 (expandable post-Abyss).'
    ]
  },
  {
    title: 'Equipment',
    class: 'equipment-section',
    content: [
      'Get weapons from killed monsters',
      'The drop chance depends on current Stage. The next tier has a lower drop chance',
      'At the beginning you can only have weapons of tier 3',
      'Minimum Tier adds a Tier to your weapon without affecting the drop chance',
      hero.value.sp >= 1 && `Enchance level depends on Equipment Tier.<br>
      If the Enchance level is higher than the Equipment Tier, only Enchance up to the current Tier are taken. <br>
      The amount of stardust dropped depends on the minimum stage before the current one [Current Stage - (40 - SP Perks)]<br>
      Boost: Select what percentage you want to add to the chance of Enchance<br>
      Auto - Enchance weapons with 100% chance to max level<br>
      Each Enchance increases the general parameter(Max Level) by 10% of the current one, and the additional parameter(Mult Dmg, HP, ...) by 5%`
    ]
  },
  {
    title: 'Amulet',
    class: 'amulet-section',
    content: [
      'EXP & EXP Buff from Bonuses.',
      'Extra Bonus Multiplier = ^(1 + 0.05 * total curses + [0.1 for each curse T4])',
      `Bonus Penalty: ${(1 / Math.log(Math.max(3, 100 - hero.value.stage))).toFixed(2)}`,
      'Higher stage = Higher Curse tier chance && less Penalty.',
      'Unlock the Amulet Suffix to upgrade the Tree Tier.',
      'Curse tiers: Green (T1), Yellow (T2), Red (T3), Purple (T4)'
    ]
  },
  {
    title: 'Rebirth',
    class: 'rebirth-section',
    content: [
      'Rebirth = Total Level ≥ Cap',
      'Total Level = Levels + MIN Levels',
      'MIN Levels = stats only',
      'Rebirth Points depends on Total Level.',
      'Potential increases stats per level',
      'Enemy EVO scales Power(DMG & HP)[until Infinity T3] & loot by Rebirth Tier',
      '<strong>No EVO Power in Abyss</strong>',
      'Each 5 Rebirth Tier(10 After Tier 20) discover new possibilities of Rebirth'
    ]
  },
  {
    title: 'Abyss',
    class: 'abyss-section',
    content: [
      hero.value.soulsMax >= 20 && 'Abyss T1 - After complete you will be cursed by 3 new curses. Soul CAP -> 30. x1.3 MULT Rebirth Pts per Abyss Tier. +50% souls appear for each curse',
      hero.value.soulsMax >= 30 && `Abyss T2 - After complete you will be cursed by 3 new curses. Soul CAP -> 40. There are new enemies after 20 stages that drops Ascension Shards.
  Ascension Shards now affect to enemies make them weaker.`,
      hero.value.soulsMax >= 40 && 'Abyss T3 - Break Rebirth Limits. Open Corruption. Unlock the Second Space Fragment',
    ].filter(Boolean)
  },
  {
    title: 'Space',
    class: 'space-section',
    content: [
      'Kill a monster with a certain danger to find the boss',
      'Auto - Reproduces combat without fighting. Suitable for fighting weak opponents. [Infinity T5]',
      'Comet Ring = no limit.'
    ]
  },
  {
    title: 'Radiation',
    class: 'radiation-section',
    content: [
      'Mutagens can mutate Curse [T3] to [T4].',
      'T(x+1) mutagen needs T(x) success.',
      'Mutagen gain = ∑(mutations)^2.5 * Mult.',
      'Stages for mutagens finding: T1-30, T2-35, T3-40, T4-45',
      'Danger ↑ = special enemy chance ↑ + strength ↑.',
      'Danger doesnt work in Abyss',
      `Danger Levels:<br>10: Souls<br>20: Ascension Souls<br>40: Rebirth Souls<br>`,
      `Hold the button to upgrade quickly`,
      hero.value.infTier >= 4 && `Infinite Creatures:<br>
      Infinite creatures do not reset during Infinity, and each creature has its own personal Drop and MAX Drop<br>
      Ω-Infinity - [Danger 100 & Stage 60+]: +1 Potential [${enemy.value.dangerEnemyLoot[0]} / 60]<br>
      Mirror of the Infinity - [Danger 150 & Stage 65+]: +1 IP [${enemy.value.dangerEnemyLoot[1]} / 1000]<br>
      The Infinite One - [Danger 200 & Stage 70+]: +1 ST [${enemy.value.dangerEnemyLoot[2]} / 5]`
    ]
  },
  {
    title: 'Corruption',
    class: 'corruption-section',
    content: [
      'Appears after Abyss T3.',
      'Corruption reduces Max Level × 0.1 after 300 Max Level.',
      'Weaken it to recover power.',
    ]
  },
  {
    title: 'Infinity',
    class: 'infinity-section',
    content: [
      'Each Infinity provides rebuild mechanic, but everything is reset(except Abyss D)',
      'You can reset the influence of Infinity in the settings if you are not strong enough to overcome this challenge.',
      'Infinity Bonuses depends on IP',
      `Infinity Discoveries:`,
      hero.value.level >= 700 && `Infinity [T1]: Reset everyting you've got(except Abyss D), but you will get Inf-Tree. Force any perk to serve you forever, but everything has its own price. Auto-Tree. Double Points gaining. Auto-Stage`,
      hero.value.mainInfTier >= 1 && `Infinity [T2]: Reset everyting you've got(except Abyss D), but you will get Ascend Permission. You have 5 Infinity Ascension Perks to serve you forever even after Infinity Reset. Extra skip stages until +25% Max Stage (S). You can get Shards from Bosses. Auto-Ascension`,
      hero.value.mainInfTier >= 2 && `Infinity [T3]: Reset everyting you've got(except Abyss D), but you will get Integration of Rebirth. Your Rebirth Tier are unlimmited. Enemy Power equals to 1. Auto-Rebirth`,
      hero.value.mainInfTier >= 3 && `Infinity [T4]: Reset everyting you've got(except Abyss D), but you will get Gamma Learning. Gain mutagens as if you have mutagen [T5]. Increase MAX Levels. Danger System scalles better. Danger System opens new Inf-Enemy`,
      hero.value.mainInfTier >= 4 && `Infinity [T5]: Reset everyting you've got(except Abyss D), but you will get Expansion of Space. Unlock Space [T5]. x2 stardust. Auto-Fight`,
      hero.value.mainInfTier >= 5 && `Infinity [T6]: Reset everyting you've got(except Abyss D), but you will get Thirst for Souls . D-Soul gives you a 100% chance to meet a soul, but its power will be limitless. Every Soul Tier gives you +1 MIN Level. EXP CAP SOULS - +40`,
      hero.value.mainInfTier >= 6 && `Infinity [T7]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T0]`,
      hero.value.mainInfTier >= 7 && `Infinity [T8]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T1]`,
      hero.value.mainInfTier >= 8 && `Infinity [T9]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T2]`,
      hero.value.mainInfTier >= 9 && `Infinity [T10]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T3]`,
      hero.value.mainInfTier >= 10 && `Infinity [T11]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T4]`,
      hero.value.mainInfTier >= 11 && `Infinity [T12]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T5]`,
      hero.value.mainInfTier >= 12 && `Infinity [T13]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T6]`,
      hero.value.mainInfTier >= 13 && `Infinity [T14]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T7]`,
      hero.value.mainInfTier >= 14 && `Infinity [T15]: Reset everyting you've got(except Abyss D). Complete to open Singularity [T8]`,
    ]
  },
  {
    title: 'Singularity',
    class: 'singularity-section',
    content: [
      hero.value.singularity >= 0 && 'Singularity [T0]',
      hero.value.singularity >= 0 && 'Challenge: Enter the singularity, where gravity devours space, opponents under the influence of gravity destroy galaxies and your level is on the verge of destruction.',
      hero.value.singularity >= 0 && 'Reward: Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Overkill [T4], +2% to skip stage per Singularity Tier (S), level up while your level is below 2% of Max Level per Singularity Tier (S).',

      hero.value.singularity >= 2 && 'Singularity [T2]',
      hero.value.singularity >= 2 && 'Challenge: Enter the singularity, where the opponents have learned to recognize the essence of curses',
      hero.value.singularity >= 2 && 'Reward: Each curse gets a bonus from the next Tier. +25 singularity levels.',

      hero.value.singularity >= 3 && 'Singularity [T3]',
      hero.value.singularity >= 3 && 'Challenge: Enter the singularity, where The Tree is locked.',
      hero.value.singularity >= 3 && 'Reward: +1 Tree Tier. +25 singularity levels.',

      hero.value.singularity >= 4 && 'Singularity [T4]',
      hero.value.singularity >= 4 && 'Challenge: Enter the singularity, where Ascension is locked.',
      hero.value.singularity >= 4 && 'Reward: Ascension no longer resets during Infinity. Open Tier-S. Unlock a Perk in Tier-S for each Singularity Tier. +25 singularity levels.',

      hero.value.singularity >= 5 && 'Singularity [T5]',
      hero.value.singularity >= 5 && 'Challenge: Enter the singularity, where Space is locked.',
      hero.value.singularity >= 5 && 'Reward: +1 Space Tier. Celestials from all dimensions see you. Auto is always opened. +25 singularity levels.',

      hero.value.singularity >= 6 && 'Singularity [T6]',
      hero.value.singularity >= 6 && 'Challenge: Enter the singularity, where Buff is locked.',
      hero.value.singularity >= 6 && 'Reward: Buffs no longer reset during Singularity. +1 Max Buff. +25 singularity levels.',
      
      hero.value.singularity >= 7 && 'Singularity [T7]',
      hero.value.singularity >= 7 && 'Challenge: Enter the singularity, where Equipment is locked.',
      hero.value.singularity >= 7 && 'Reward: +1 Enchance Level per each Singularity Tier. Unlock Awakened Equipment. +25 singularity levels.',
      `Singularity [T7]: Awakened Equipment: Reach the certain Tier of Equipment to increase a Base Drop Chance and the effectiveness of Enhanced generic parameter by 1%, additional parameter by 0.5%. +1 Gem Slot(Future content)`,
    
      hero.value.singularity >= 8 && 'Singularity [T8]',
      hero.value.singularity >= 8 && 'Challenge: Enter the singularity, where Rebirth is locked.',
      hero.value.singularity >= 8 && 'Reward: +1 Tree Tier. +25 singularity levels. You start with 100000 Rebirth Pts. Unclock Singularity Pts',
    ]
  },
  {
    title: 'Dimension',
    class: 'dimension-section',
    content: [
      'In dimensions that are weakly imbued with the D-Rule, the maximum possible stage in the Abyss is 100',
      'Each dimension has a reward for each Infinity completed and a special reward for reaching the maximum Infinity in a certain dimension.',
      'You can reset the influence of Infinity in the settings if you are not strong enough to overcome this challenge.',
      'Infinity Bonuses depends on IP',
      `Once you reach Level 700, you will automatically advance to the next Tier. Your power will make the transition easier. `,
      `Complete The Dimension [K7-D4n] to get the way to move between Stages. 
      Ravage the space-time continuum to travel to any possible point in the universe. But everything has its price. 
      During the journey, enemies will become 4 times stronger, over time their strength will return to normal. 
      Skipping stages and receiving ascension shards is blocked until the next ascension, rebirth etc.`,
    ]
  }
];

const statTabs = ['Level', 'IP', 'EXP', 'BUFF EXP', 'Equipment', 'Curse', 'Ascension', 'Stardust', 'Mutagen', 'Rebirth', 
'Potential', 'Danger', 'Damage', 'HP', 'DEF', 'ApS'];


const statSections = [
  {
    title: 'Level',
    content: [
      { desc: 'Min Level', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Equipment [Set]',
        value: () => {
          return (hero.value.rebirthPts >= 25
            ? (hero.value.equipmentTiers.sword >= 3 && hero.value.equipmentTiers.armor >= 3 && hero.value.equipmentTiers.boots >= 3 ? 3 : 0)
            : 0)
            + (hero.value.rebirthPts >= 200
              ? (hero.value.equipmentTiers.sword >= 4 && hero.value.equipmentTiers.armor >= 4 && hero.value.equipmentTiers.boots >= 4 && hero.value.equipmentTiers.ring >= 4 ? 4 : 0)
              : 0)
            + (hero.value.rebirthPts >= 4000
              ? (hero.value.equipmentTiers.sword >= 5 && hero.value.equipmentTiers.armor >= 5 && hero.value.equipmentTiers.boots >= 5 && hero.value.equipmentTiers.ring >= 5 ? 5 : 0)
              : 0);
        },
        color: '#66ffcc',
      },
      {
        desc: 'Ascension [Destructive Play]',
        value: () => (ascenPerks[26].level? Math.floor(hero.value.stage/5)-1: 0),
        color: 'lightblue',
      },
      {
        desc: 'Rebirth Pts',
        value: () => ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth Tier',
        value: () => (hero.value.infTier >= 3 && hero.value.rebirthTier >= 40? Math.floor(1.05 ** Math.min(hero.value.rebirthTier, 80)): 0),
        color: 'lightgreen',
      },
      {
        desc: 'Comet Ring',
        value: () => (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel),
        color: '#66ffcc',
      },
      {
        desc: 'Comet Ring [Enchances]',
        value: () => (hero.value.eqUpsMult['spRing'].bonus),
        color: '#66ffcc',
      },
      {
        desc: 'Souls',
        value: () => (hero.value.infTier >= 6? Math.floor(hero.value.soulsMax/10): 0),
        color: '#d516d5',
      },
      {
        desc: 'Infinity',
        value: () => (hero.value.mainInfTier >= 13? Math.floor(1.045 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints))): 0),
        color: 'gold',
      },
      {
        desc: 'Dimension [S5-Ω3t]',
        value: () => (Math.max(Math.floor(Math.max(hero.value.unlimitLevel - 700, 0) / 100 ), 0)),
        color: '#d516d5',
      },
      {
        desc: 'Total',
        value: () => (hero.value.minLevel),
        color: 'gold',
      },
      { desc: 'Max Level', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Base',
        value: 30,
        color: '',
      },
      {
        desc: 'Tree',
        value: () => (perks.value[4].status? 0: perks.value[4].value * perks.value[4].level),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension',
        value: () => (ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Destructive Play]',
        value: () => ((ascenPerks[26].level? 2*Math.floor(hero.value.stage/5)-1: 0)),
        color: 'lightblue',
      },
      {
        desc: 'Souls',
        value: () => hero.value.souls,
        color: '#d516d5',
      },
      {
        desc: 'Equipment',
        value: () => (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap + 
          equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap + 
          equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap +
          equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap +
          equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap
        ),
        color: '#66ffcc',
      },
      {
        desc: 'Equipment [Enchances]',
        value: () => Math.floor(hero.value.eqUpsMult['sword'].cap + 
          hero.value.eqUpsMult['armor'].cap + 
          hero.value.eqUpsMult['boots'].cap + 
          hero.value.eqUpsMult['ring'].cap + 
          hero.value.eqUpsMult['spRing'].cap
        ),
        color: '#66ffcc',
      },
      {
        desc: 'Equipment [Set]',
        value: () => {
          return (hero.value.rebirthPts >= 25
            ? (hero.value.equipmentTiers.sword >= 3 && hero.value.equipmentTiers.armor >= 3 && hero.value.equipmentTiers.boots >= 3 ? 3 : 0)
            : 0)
            + (hero.value.rebirthPts >= 200
              ? (hero.value.equipmentTiers.sword >= 4 && hero.value.equipmentTiers.armor >= 4 && hero.value.equipmentTiers.boots >= 4 && hero.value.equipmentTiers.ring >= 4 ? 4 : 0)
              : 0)
            + (hero.value.rebirthPts >= 4000
              ? (hero.value.equipmentTiers.sword >= 5 && hero.value.equipmentTiers.armor >= 5 && hero.value.equipmentTiers.boots >= 5 && hero.value.equipmentTiers.ring >= 5 ? 5 : 0)
              : 0);
        },
        color: '#66ffcc',
      },
      {
        desc: 'Amulets',
        value: () => (amulets[0].status? 4: 0) + (amulets[1].status? 8: 0) + (amulets[2].status? 12: 0) + (amulets[3].status? 16: 0),
        color: 'red',
      },
      {
        desc: 'Radiation',
        value: () => radPerks[12].level,
        color: '#99ff99',
      },
      {
        desc: 'Space',
        value: () => (hero.value.sp >= 50? hero.value.sp * 2: 0),
        color: 'orange',
      },
      {
        desc: 'Space [Bosses]',
        value: () => ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
        (hero.value.spCount / 6 >= 5? 150: 0)),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
        (hero.value.spCount / 6 >= 5? 150: 0) + 30 +
        (hero.value.sp >= 50? hero.value.sp * 2: 0) + radPerks[12].level + hero.value.souls +
        (amulets[0].status? 4: 0) + (amulets[1].status? 8: 0) + (amulets[2].status? 12: 0) + (amulets[3].status? 16: 0) +
        Math.floor(hero.value.eqUpsMult['sword'].cap + 
          hero.value.eqUpsMult['armor'].cap + 
          hero.value.eqUpsMult['boots'].cap + 
          hero.value.eqUpsMult['ring'].cap + 
          hero.value.eqUpsMult['spRing'].cap
        ) + 
        (equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.cap + 
          equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.cap + 
          equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.cap +
          equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.cap +
          equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.cap
        ) + 
        ((ascenPerks[26].level? 2*Math.floor(hero.value.stage/5)-1: 0)) + 
        (ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level) + 
        (perks.value[4].status? 0: perks.value[4].value * perks.value[4].level) + 
        (hero.value.rebirthPts >= 25
            ? (hero.value.equipmentTiers.sword >= 3 && hero.value.equipmentTiers.armor >= 3 && hero.value.equipmentTiers.boots >= 3 ? 3 : 0)
            : 0)
            + (hero.value.rebirthPts >= 200
              ? (hero.value.equipmentTiers.sword >= 4 && hero.value.equipmentTiers.armor >= 4 && hero.value.equipmentTiers.boots >= 4 && hero.value.equipmentTiers.ring >= 4 ? 4 : 0)
              : 0)
            + (hero.value.rebirthPts >= 4000
              ? (hero.value.equipmentTiers.sword >= 5 && hero.value.equipmentTiers.armor >= 5 && hero.value.equipmentTiers.boots >= 5 && hero.value.equipmentTiers.ring >= 5 ? 5 : 0)
              : 0)
        ),
        color: 'gold',
      },
      { desc: 'Max Level MULT', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Tree [Extra Level]',
        value: () => (1 + (perks.value[4].status? 0.15: 0)).toFixed(2),
        color: 'lightgreen',
      },
      {
        desc: 'Amulets [Prefix]',
        value: () => (1 + ((amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + 
        (amulets[3].prefix.status? 0.08: 0)) * (hero.value.sp >= 99? 2: 1)).toFixed(2),
        color: 'red',
      },
      {
        desc: 'Ascension [Endless Levels]',
        value: () => (1 + (ascenPerks[31].level * 0.01)).toFixed(2),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Corrupted Amplification]',
        value: () => (1 + (ascenPerks[41].level? hero.value.overcorruption / 4: 0)).toFixed(2),
        color: 'lightblue',
      },
      {
        desc: 'Rebirth Tier',
        value: () => (1 + (hero.value.rebirthTier >= 80? 1.015 ** (Math.min(hero.value.rebirthTier, 125) - 79) - 1: 0)).toFixed(2),
        color: 'lightgreen',
      },
      {
        desc: 'Infinity',
        value: () => (1 + (hero.value.mainInfTier >= 10? 1.07 ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints)*Math.log(hero.value.infPoints))) - 1: 0)).toFixed(2),
        color: 'gold',
      },
      {
        desc: 'Dimension [S5-Ω3t]',
        value: () => (1 + Math.max(1.05 ** (Math.max(hero.value.unlimitLevel - 700, 0) / 75), 0) - 1).toFixed(2),
        color: '#991099',
      },
      {
        desc: 'Total',
        value: () => ((1 + Math.max(1.05 ** (Math.max(hero.value.unlimitLevel - 700, 0) / 75), 0) - 1) + 
        ((hero.value.mainInfTier >= 10? 1.07 ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints)*Math.log(hero.value.infPoints))) - 1: 0)) + 
        ((hero.value.rebirthTier >= 80? 1.015 ** (Math.min(hero.value.rebirthTier, 125) - 79) - 1: 0)) + 
        ((ascenPerks[41].level? hero.value.overcorruption / 5: 0)) + 
        ((ascenPerks[31].level * 0.01)) + 
        (((amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + 
        (amulets[3].prefix.status? 0.08: 0)) * (hero.value.sp >= 99? 2: 1)) + 
        (perks.value[4].status? 0.15: 0)
        ).toFixed(2),
        color: 'gold',
      },
      { desc: `Infinity [T${hero.value.infTier}]`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Penalty [^]',
        value: () => Math.min((1 - 0.02 * (hero.value.infTier) + (ascenPerks[42].level? 0.02: 0)), 1).toFixed(2),
        color: 'gold',
      },
      {
        desc: `True Max Level Requirements [Infinity T${hero.value.infTier}]`,
        value: () => (Math.round(700 ** (1 / (1 - 0.02 * (hero.value.infTier) + (ascenPerks[42].level? 0.02: 0))))),
        color: 'gold',
      },
    ],
  },
  {
    title: 'IP',
    content: [
      { desc: 'IP', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Infinity Challenges',
        value: () => (hero.value.infPointsGoals),
        color: 'gold',
      },
      {
        desc: 'Mirror of the Infinity',
        value: () => (enemy.value.dangerEnemyLoot[1]),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => (hero.value.infPointsGoals + enemy.value.dangerEnemyLoot[1]),
        color: 'gold',
      },
      { desc: 'IP MULT', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Singularity',
        value: () => (1 + 0.05 * hero.value.singularity),
        color: '#66ffcc',
      },
      { desc: 'IP TOTAL', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.infPoints, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'EXP',
    content: [
      { desc: 'EXP', value: '', color: 'purple',  uppercase: true, },
      {
        desc: 'Stage EXP',
        value: () => formatNumber(Math.log(hero.value.stage + 5)**4, true),
        color: '',
      },
      {
        desc: 'Tree [Wisdom]',
        value: () => formatNumber(1 + (perks.value[3].value * perks.value[3].level * 0.01), true),
        color: 'lightgreen',
      },
      {
        desc: 'Ring',
        value: () => formatNumber(equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult, true),
        color: '#66ffcc',
      },
      {
        desc: 'Ring [Enchances]',
        value: () => formatNumber(hero.value.eqUpsMult['ring'].bonus, true),
        color: '#66ffcc',
      },
      {
        desc: 'Ascension [Blacksmithing Experience]',
        value: () => formatNumber((1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + 
        hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level), true),
        color: 'lightblue',
      },
      {
        desc: 'BUFF: Traveller [T3]',
        value: () => ((hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 3: 1)),
        color: 'orange',
      },
      {
        desc: 'Souls [Loot]',
        value: () => formatNumber((enemy.value.soulBuff.active || enemy.value.rebirthSoul? enemy.value.soulBuff.drop: 1), true),
        color: '#ed14ed',
      },
      {
        desc: 'Souls',
        value: () => formatNumber((1 + Math.min(hero.value.souls, 40 + (Math.max(hero.value.infTier, hero.value.mainInfTier) >= 6? 40: 0)) * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))), true),
        color: '#ed14ed',
      },
      {
        desc: 'BUFF: Overkill [T4]',
        value: () => formatNumber((hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? hero.value.overkill * 0.1: 1), true),
        color: 'orange',
      },
      {
        desc: 'Curse [Bonus]',
        value: () => formatNumber(1 + hero.value.cursedBonusExp, true),
        color: 'red',
      },
      {
        desc: 'Boss [Loot]',
        value: () => formatNumber(enemy.value.boss.isBoss? enemy.value.boss.drop: 1, true),
        color: 'red',
      },
      {
        desc: 'Rebirth',
        value: () => (hero.value.rebirthPts >= 5? 2: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Space',
        value: () => formatNumber(hero.value.sp >= 11? Math.min(1.025 * hero.value.sp, 5): 1, true),
        color: 'orange',
      },
      {
        desc: 'Ascension Soul [Loot]',
        value: () => formatNumber((enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1), true),
        color: 'lightblue',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => (enemy.value.rebirthEnemy["drop"]),
        color: 'lightgreen',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: '#82eb26',
      },
       {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'lightblue',
      },
      {
        desc: 'Dimension [S5-Ω3t]',
        value: () => formatNumber(Math.max(1 + Math.max(hero.value.unlimitLevel - 700, 0) / 100, 1), true),
        color: '#ed14ed',
      },
      {
        desc: 'Dimension [S5-Ω3t] [Infinity Bonus]',
        value: () => (hero.value.dId == 'unlimitted'? 1.75 ** Math.max(Math.floor(Math.max(hero.value.unlimitLevel - 1000, 0) / 500), 0): 1),
        color: '#ed14ed',
      },
      {
        desc: `Infinity`,
        value: () => formatNumber(
          (hero.value.mainInfTier >= 1 || hero.value.level >= 700)
            ? (1.06 ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1) + Math.log(hero.value.infPoints + 2))))
            : 0, true),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalExp),
        color: 'gold',
      },
      { desc: `Infinity [T${hero.value.infTier}]`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: `Penalty [^]`,
        value: () => Math.min(1 - 0.02 * hero.value.infTier + (ascenPerks[42].level? 0.02: 0), 1).toFixed(2),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalExp ** Math.min(1 - 0.02 * hero.value.infTier + (ascenPerks[42].level? 0.02: 0), 1)),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Equipment',
    content: [
      { desc: 'Equipment Drop Chance', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'BUFF: Traveller [T1]',
        value: () => (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 1? 3 : 1),
        color: '#66ffcc',
      },
      {
        desc: 'Souls [Tier]',
        value: () => formatNumber(1 + 0.75 * hero.value.soulTier, true),
        color: '#ed14ed',
      },
      {
        desc: 'BUFF: Overkill [T4]',
        value: () => formatNumber(hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? hero.value.overkill*0.1: 1, true),
        color: 'orange',
      },
      {
        desc: 'Boss [Loot]',
        value: () => formatNumber(enemy.value.boss.isBoss? enemy.value.boss.drop: 1, true),
        color: 'red',
      },
      {
        desc: 'Soul [Loot]',
        value: () => formatNumber(enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1, true),
        color: '#ed14ed',
      },
      {
        desc: 'Ascension Soul [Loot]',
        value: () => formatNumber(enemy.value.ascensionSoul.active || enemy.value.rebirthSoul? enemy.value.ascensionSoul.stats: 1, true),
        color: 'lightblue',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => (enemy.value.rebirthEnemy["drop"]),
        color: 'lightgreen',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: '#61fccc',
      },
      {
        desc: 'Space',
        value: () => formatNumber(1 + (hero.value.sp >= 13? 0.1 * hero.value.sp: 1), true),
        color: 'orange',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true) ,
        color: 'lightblue',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => formatNumber(hero.value.rebirthTier >= 50? 1.03 ** hero.value.rebirthTier: 1, true),
        color: 'lightgreen',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber(Math.max(hero.value.infTier, hero.value.mainInfTier) >= 1? (1.08 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: 'gold',
      },
      {
        desc: 'Tree [T6]',
        value: () => formatNumber(perks.value[15].value ** perks.value[15].level, true),
        color: 'lightgreen',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.eqTotalDrop, true),
        color: 'gold',
      },
      { desc: 'Sword', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (20 * ((0.2 + 0.08 * hero.value.awakened['sword']) ** (hero.value.eqDrop['sword'])) * Math.log(hero.value.stage + 1) ** 2).toExponential(2) ,
        color: '',
      },
      {
        desc: 'MIN SWORD',
        value: () => (hero.value.eqMin['sword']),
        color: '#66ffcc',
      },
      {
        desc: 'DROPPED SWORD',
        value: () => (hero.value.eqDrop['sword']),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => (hero.value.equipmentTiers['sword']),
        color: 'gold',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['sword'] - (hero.value.sp >= 105? 1: 0) - (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
      { desc: 'Body', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (20 * ((0.185 + 0.05 * hero.value.awakened['armor']) ** (hero.value.eqDrop['armor'])) * Math.log(hero.value.stage + 1) ** 2.1).toExponential(2),
        color: '',
      },
      {
        desc: 'MIN BODY',
        value: () => (hero.value.eqMin['armor']),
        color: '#66ffcc',
      },
      {
        desc: 'DROPPED BODY',
        value: () => (hero.value.eqDrop['armor']),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => (hero.value.equipmentTiers['armor']),
        color: 'gold',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['armor'] - (hero.value.sp >= 105? 1: 0) - (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
      { desc: 'Boots', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (15 * ((0.17 + 0.05 * hero.value.awakened['boots']) ** (hero.value.eqDrop['boots'])) * Math.log(hero.value.stage + 1) ** 2.3).toExponential(2),
        color: '',
      },
      {
        desc: 'MIN BOOTS',
        value: () => (hero.value.eqMin['boots']),
        color: '#66ffcc',
      },
      {
        desc: 'DROPPED BOOTS',
        value: () => (hero.value.eqDrop['boots']),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => (hero.value.equipmentTiers['boots']),
        color: 'gold',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['boots'] - (hero.value.sp >= 105? 1: 0) - (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
      { desc: 'Ring', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (8 * ((0.15 + 0.05 * hero.value.awakened['ring']) ** (hero.value.eqDrop['ring'])) * Math.log(hero.value.stage + 1) ** 2.5).toExponential(2),
        color: '',
      },
      {
        desc: 'MIN RING',
        value: () => (hero.value.eqMin['ring']),
        color: '#66ffcc',
      },
      {
        desc: 'DROPPED RING',
        value: () => (hero.value.eqDrop['ring']),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => (hero.value.equipmentTiers['ring']),
        color: 'gold',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['ring'] - (hero.value.sp >= 105? 1: 0) - (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
    ],
  },
  {
    title: 'Ascension',
    content: [
      { desc: 'Ascension Shards', value: '', color: 'lightblue',  uppercase: true, },
      {
        desc: `Base [Stage ${hero.value.stage}]`,
        value: () => formatNumber(Math.sqrt(Math.log(hero.value.stage+2) ** (hero.value.stage/7)) * (1 + hero.value.maxLevel / 100), true),
        color: '',
      },
      {
        desc: 'BUFF: Traveller [T3]',
        value: () => (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 1.5: 1),
        color: 'orange',
      },
      {
        desc: 'Soul [Loot]',
        value: () => formatNumber(enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1, true),
        color: '#ed14ed',
      },
      {
        desc: 'Boss [Loot]',
        value: () => formatNumber(enemy.value.boss.isBoss? enemy.value.boss.drop: 1, true),
        color: 'red',
      },
      {
        desc: 'Ascension [Astral Harvest]',
        value: () => formatNumber(ascenPerks[29].level? (1 + 0.04 * hero.value.sp): 1, true),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'lightblue',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber(hero.value.mainInfTier >= 3? (1.045 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.shardsMult, true),
        color: 'gold',
      },
      { desc: 'Ascension Shards after Ascension', value: '', color: 'lightblue',  uppercase: true, },
      {
        desc: 'Base',
        value: 1.5,
        color: '',
      },
      {
        desc: 'Soul [Tier]',
        value: () => formatNumber(hero.value.soulTier < 4? 1.5 ** hero.value.soulTier: 1.5 ** 3, true),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (hero.value.rebirthPts >= 2? 2: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () =>  (hero.value.rebirthPts >= 2500? enemy.value.rebirthEnemy["drop"]: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.shardsPerformMult, true),
        color: 'gold',
      },
      { desc: 'Ascension Soul', value: '', color: 'lightblue',  uppercase: true, },
      {
        desc: 'Base',
        value: () => formatNumber(hero.value.shardsMult * 0.1, true),
        color: '',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: '#e1fffc',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.shardsMult * 0.1 * (hero.value.activeFormation == 3? 2: 1), true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Rebirth',
    content: [
      { desc: 'Rebirth', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'base',
        value: () => {
          let extraLevel = hero.value.level + (ascenPerks[37].level? 25: 0);
          let pt = Math.min((Math.log(Math.max((extraLevel - 97), 3)**(1.15 + 0.08 * (Math.floor(hero.value.rebirthPts)).toFixed(0).length))**(extraLevel/Math.max(100 - (1 * extraLevel/9), 1))), 10000);
          pt = (pt >= 400? 400 + Math.sqrt(pt - 400): pt)
          return formatNumber(pt);
        },
        color: '',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => (hero.value.rebirthPts >= 100? enemy.value.rebirthEnemy["drop"]: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Abyss [Tier]',
        value: () => formatNumber(1.3 ** hero.value.abyssTier, true),
        color: '#ed84ed',
      },
      {
        desc: 'Tree',
        value: () => formatNumber(perks.value[14].level? perks.value[14].value: 1, true),
        color: '#66ffcc',
      },
      {
        desc: 'Soul [Tier]',
        value: () => (hero.value.soulTier >= 4? 1.5: 1),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => formatNumber(hero.value.rebirthPts >= 1250? Math.min((1 + 0.01 * hero.value.rebirthTier) ** 8, 2) * ((1 + 0.01 * Math.max(hero.value.rebirthTier - 9, 0)) ** 2) : 1, true),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'lightblue',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber(hero.value.mainInfTier >= 3? (1.025 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalPtsMult, true),
        color: 'gold',
      },
      { desc: 'Rebirth Soul', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Base',
        value: () => formatNumber(hero.value.totalPtsMult ** 0.2 * Math.max((hero.value.stage - 14)/ 10, 1), true),
        color: '',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalPtsMult ** 0.2 * Math.max((hero.value.stage - 14)/ 10, 1) * (hero.value.activeFormation == 3? 2: 1), true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'BUFF EXP',
    content: [
      { desc: 'BUFF EXP', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base',
        value: () => formatNumber(hero.value.cursedBonusExp * 10, true),
        color: '',
      },
      {
        desc: 'Soul [Tier]',
        value: () => formatNumber(1.5 ** Math.min(hero.value.soulTier, 3), true),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (hero.value.rebirthPts >= 10? 2: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => (hero.value.rebirthPts >= 50000? enemy.value.rebirthEnemy["drop"]: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: '#11fffc',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber(hero.value.mainInfTier >= 4? (1.035 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: 'gold',
      },
      {
        desc: 'Abyss [Penalty]',
        value: () => (hero.value.isAbyss? 0: 1),
        color: '#e184ed',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.cursedBonus, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Curse',
    content: [
      { desc: 'Curse', value: '', color: 'red',  uppercase: true, },
      {
        desc: '∑ Bonuses',
        value: () => {
          let bonus = 0;
          for(let id of hero.value.activeCurse)
            bonus += cursed[id].tier[hero.value.activeCurseTier[id]].bonus * (hero.value.singularity >= 2? 2: 1);
          return formatNumber(bonus, true);
        },
        color: 'red',
      },
      {
        desc: 'Abyss D',
        value: () => formatNumber(hero.value.sp >= 24 && hero.value.abyssDStages >= 50? 1.015 ** (hero.value.abyssDStages - 49): 1, true),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => (hero.value.rebirthTier >= 10? 1.5: 1) ,
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber((1 + ascenPerks[34].level * 0.01), true),
        color: '#66ffcc',
      },
      {
        desc: 'Extra Bonus [^]',
        value: () => formatNumber((1 + 0.1 * hero.value.mutations) + 0.05 * Math.max(hero.value.activeCurse.length - 1, 0), true),
        color: 'red',
      },
       {
        desc: 'Bonus [Penalty]',
        value: () => formatNumber(1 / Math.log(Math.max(3, 100 - hero.value.stage)), true),
        color: 'red',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.cursedBonusExp, true),
        color: 'gold',
      },
      {
        desc: 'Total: Abyss [Penalty]',
        value: () => formatNumber(Math.sqrt(hero.value.cursedBonusExp), true),
        color: '#ed14ed',
      },
    ],
  },
  {
    title: 'Stardust',
    content: [
      { desc: 'Stardust', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: () => {
          let st = 39 - (hero.value.sp >= 9? 1: 0) - (hero.value.sp >= 21? 2: 0) - (hero.value.sp >= 38? 2: 0) - (hero.value.sp >= 87? 3: 0);
          return formatNumber(Math.max(1.05 ** (hero.value.stage - st), 0), true);
        },
        color: '',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'lightblue',
      },
      {
        desc: 'Infinity [T5]',
        value: () => ((hero.value.infTier >= 5? 2: 1)),
        color: 'gold',
      },
      {
        desc: 'Abyss D',
        value: () => formatNumber((hero.value.sp >= 24 && hero.value.abyssDStages >= 60? (1.02 ** (hero.value.abyssDStages - 59)): 1), true),
        color: '#ed14ed',
      },
      {
        desc: 'Tree',
        value: () => formatNumber((1 + perks.value[17].level*0.01), true),
        color: 'green',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 18? 1.0125 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 0), true),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => {
          let st = 39 - (hero.value.sp >= 9? 1: 0) - (hero.value.sp >= 21? 2: 0) - (hero.value.sp >= 38? 2: 0) - (hero.value.sp >= 87? 3: 0);
          if(hero.value.stage - st > 0){
            return formatNumber(((1.05 ** (hero.value.stage - st)) * (1 + ascenPerks[34].level * 0.01) * 
            (hero.value.infTier >= 5? 2: 1) * (hero.value.sp >= 24 && hero.value.abyssDStages >= 60? (1.02 ** (hero.value.abyssDStages - 59)): 1) * 
            (1 + perks.value[17].level*0.01) * (hero.value.mainInfTier >= 18? 1.0125 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 0)) - 1, true) ;
          } else return 0;
        },
        color: 'gold',
      },
    ],
  },
  {
    title: 'Mutagen',
    content: [
      { desc: 'Mutagen', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Amount of Mutations',
        value: () => (hero.value.mutations + (hero.value.infTier >= 4? 1: 0)),
        color: '#66ff66',
      },
      {
        desc: 'Mutagen [^2.5]',
        value: () => formatNumber((hero.value.mutations + (hero.value.infTier >= 4? 1: 0)) ** 2.5, true),
        color: '#66ff66',
      },
      {
        desc: 'Radiation',
        value: () => formatNumber(1.025 ** radPerks[4].level, true),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => formatNumber(((hero.value.mutations + (hero.value.infTier >= 4? 1: 0)) ** 2.5) * (1.025 ** radPerks[4].level) * (1 + ascenPerks[34].level * 0.01), true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Potential',
    content: [
      { desc: 'Potential', value: '', color: 'yellow',  uppercase: true, },
      {
        desc: 'Rebirth [Pts]',
        value: () => (hero.value.rebirthPts >= 3? 10: 0) + (hero.value.rebirthPts >= 75? 10: 0) + (hero.value.rebirthPts >= 250? 10: 0) + 
        (hero.value.rebirthPts >= 5000? 10: 0) + (hero.value.rebirthPts >= 17500? 10: 0) + (hero.value.rebirthPts >= 60000? 10: 0),
        color: 'lightgreen',
      },
      {
        desc: 'Radiation',
        value: () => radPerks[6].level,
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => (hero.value.infTier >= 3 && hero.value.rebirthTier >= 30? Math.floor(1.053 ** Math.min(hero.value.rebirthTier, 80)): 0),
        color: 'lightgreen',
      },
      {
        desc: 'Ω-Infinity',
        value: () => (enemy.value.dangerEnemyLoot[0]),
        color: 'yellow',
      },
      {
        desc: 'Tree',
        value: () => (perks.value[18].level),
        color: 'lightgreen',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 20? 1.0425 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 0), false),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.potential),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Danger',
    content: [
      { desc: 'MAX Danger', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Base',
        value: 100,
        color: '',
      },
      {
        desc: 'Infinity [T4]',
        value: 100,
        color: 'gold',
      },
      {
        desc: 'Ascension [Void Hazard]',
        value: () => 50,
        color: 'lightblue',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 18? 1.08 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 0), true),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(radPerks[10].max, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Damage',
    content: [
     { desc: 'Damage', value: '', color: 'red',  uppercase: true, },
     {
        desc: 'Base',
        value: 10,
        color: '',
      },
      {
        desc: 'Level',
        value: () => formatNumber(((1 + 0.2 * Math.floor(hero.value.potential/20)) * 
        (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + 
        (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0) + 
        hero.value.minLevel)), true),
        color: 'lightgreen',
      },
      { desc: 'Damage MULT', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Tree [Infinity]',
        value: () => formatNumber(perks.value[0].infStatus? ((perks.value[0].value - 0.001) ** perks.value[0].level): 1, true),
        color: 'gold',
      },
       {
        desc: 'Tree [Radiation]',
        value: () => formatNumber(perks.value[0].status? (1.01 ** Math.min(perks.value[0].kills,140) + (perks.value[0].kills >= 140? perks.value[0].kills ** 0.09 - 1: 0)): 1, true),
        color: '#66ff66',
      },
       {
        desc: 'Tree',
        value: () => formatNumber(!perks.value[0].infStatus && !perks.value[0].status? perks.value[0].value ** perks.value[0].level: 1, true),
        color: '#66ffcc',
      },
       {
        desc: 'Sword',
        value: () => formatNumber(equipment[0].tiers[hero.value.equipmentTiers['sword']].bonus.multDmg, true),
        color: '#22cccc',
      },
      {
        desc: 'Sword [Enchances]',
        value: () => formatNumber(hero.value.eqUpsMult['sword'].bonus, true),
        color: '#22cccc',
      },
       {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 1 || hero.value.level >= 700? (1.055 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))) : 1), true),
        color: 'gold',
      },
       {
        desc: 'Ascension [Celestial Overdrive]',
        value: () => formatNumber((ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1), true),
        color: 'lightblue',
      },
      {
        desc: 'Dimension [R0-X9a]',
        value: () => formatNumber((hero.value.dId == 'gravity' && hero.value.stage >= 20? 1 / 1.05 ** (hero.value.stage - 19): 1 ), true),
        color: 'red',
      },
      {
        desc: 'Dimension [M2-Λ1s]',
        value: () => formatNumber((1 - hero.value.survivalLevel * 0.04), true),
        color: 'red',
      },
      {
        desc: 'BUFF: First Strike [T1]',
        value: () =>  (hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 1 && !buffs.value[1].used)? 2: 1,
        color: 'orange',
      },
      {
        desc: 'BUFF: First Strike [T2]',
        value: () => formatNumber((hero.value.activeBuffs.includes(1) && buffs.value[1].tier >= 2 && !buffs.value[1].used)? hero.value.critAttack*0.01: 1, true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Combo',
        value: () => {
          let combo = 0;
          combo = buffs.value[3].tier == 1? (1 + 0.01 * buffs.value[3].combo): 1;
          combo = buffs.value[3].tier == 2? (1 + 0.0125 * buffs.value[3].combo): 1;
          combo = buffs.value[3].tier == 3? (1 + 0.015 * buffs.value[3].combo): 1;
          combo = buffs.value[3].tier == 4? (1 + 0.0175 * buffs.value[3].combo): 1;
          return combo;
        },
        color: 'orange',
      },
      {
        desc: 'BUFF: Conquer [T2]',
        value: () => formatNumber((hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 2? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Extra Life [T2]',
        value: () => (buffs.value[10].buffT2 > 0? 1.5: 1),
        color: 'orange',
      },
      {
        desc: 'BUFF: Berserk [T1]',
        value: () => formatNumber((buffs.value[12].dmg), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Charge',
        value: () => formatNumber((1 + 0.05 * buffs.value[6].charges.power), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Sniper [T2]',
        value: () => hero.value.activeBuffs.includes(11) && buffs.value[11].tier >= 2 && hero.value.crit >= 100? 2: 1 ,
        color: 'orange',
      },
      {
        desc: 'Formation',
        value: () => {
          let formation = 1;
          formation *= (hero.value.activeFormation == 1? 2: 1);
          formation *= (hero.value.activeFormation == 0? 0.5: 1);
          formation *= (hero.value.activeFormation == 2? 0.5: 1);
          formation *= (hero.value.activeFormation == 3? 0.5: 1);
          return formation;
        },
        color: '#22cccc',
      },
      {
        desc: 'BUFF: Jaggernaut',
        value: () => hero.value.activeBuffs.includes(13)? 0.75: 1,
        color: 'orange',
      },
      {
        desc: 'Curse [Cursed Shield]',
        value: () => {
          if (hero.value.activeCurse.includes(2)){
            let block = 0
            if (hero.value.activeCurseTier[2] == 0) {
              block = 0.1;
            }
            if (hero.value.activeCurseTier[2] == 1) {
              block = 0.2;
            }
            if (hero.value.activeCurseTier[2] == 2) {
              block = 0.3;
            }
            if (hero.value.activeCurseTier[2] == 3) {
              block = 0.4;
            }

            return 1 - block;
          }
          return 1;
        },
        color: 'red',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.attack, true),
        color: 'gold',
      },
      { desc: 'Crit', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Tree',
        value: () => formatNumber((perks.value[7].level * perks.value[7].value), true),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => formatNumber((hero.value.rebirthPts >= 150? 5: 0), true),
        color: 'lightgreen',
      },
      {
        desc: 'BUFF: Berserk [T2]',
        value: () => formatNumber((buffs.value[12].crit), true),
        color: 'orange',
      },
      {
        desc: 'Sword [Suffix]',
        value: () => formatNumber((Math.floor(hero.value.spCount/6) >= 3? hero.value.eqUpsMult['sword'].crit: 0), true),
        color: '#22cccc',
      },
      {
        desc: 'BUFF: Sniper [T1]',
        value: () => formatNumber((hero.value.activeBuffs.includes(11)? 15: 0), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Charge',
        value: () => formatNumber((1 * buffs.value[6].charges.energy), true),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.crit, true),
        color: 'gold',
      },
      { desc: 'Crit DMG', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Base',
        value: 1.5,
        color: '#22cccc',
      },
      {
        desc: 'Tree',
        value: () => formatNumber((perks.value[8].level * perks.value[8].value * 0.01), true),
        color: 'lightgreen',
      },
      {
        desc: 'BUFF: Berserk [T2]',
        value: () => formatNumber((buffs.value[12].critDmg * 0.01), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Sniper [T1]',
        value: () => formatNumber((hero.value.activeBuffs.includes(11)? 0.75: 0), true),
        color: 'orange',
      },
      {
        desc: 'Sword [Prefix]',
        value: () => formatNumber((Math.floor(hero.value.spCount/6) >= 3? hero.value.eqUpsMult['sword'].critDmg * 0.01: 0) , true),
        color: '#22cccc',
      },
      {
        desc: 'BUFF: Charge',
        value: () => formatNumber((5 * buffs.value[6].charges.energy * 0.01), true),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.critAttack * 0.01, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'HP',
    content: [
      { desc: 'HP', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Base',
        value: 100,
        color: '',
      },
      {
        desc: 'Level',
        value: () => formatNumber(
          (
            (2 + 0.5 * Math.floor(hero.value.potential / 10)) *
            (
              Math.min(hero.value.maxLevel, hero.value.eLevel - 1) +
              hero.value.minLevel +
              (
                hero.value.eLevel > 700 && hero.value.maxLevel > 700
                  ? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700
                  : 0
              )
            )
          )
        ),
        color: 'lightgreen',
      },
      {
        desc: 'Tree',
        value: () => formatNumber((perks.value[1].value * perks.value[1].level), true),
        color: 'green',
      },
      {
        desc: 'Equipment',
        value: () => formatNumber(equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp, true),
        color: '#22cccc',
      },
      {
        desc: 'Equipment [Enchances]',
        value: () => formatNumber(hero.value.eqUpsMult['armor'].bonus, true),
        color: '#22cccc',
      },
      {
        desc: 'Total',
        value: () => formatNumber(
          (
            (2 + 0.5 * Math.floor(hero.value.potential / 10)) *
            (
              Math.min(hero.value.maxLevel, hero.value.eLevel - 1) +
              hero.value.minLevel +
              (
                hero.value.eLevel > 700 && hero.value.maxLevel > 700
                  ? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700
                  : 0
              )
            )
          ) + hero.value.eqUpsMult['armor'].bonus + equipment[1].tiers[hero.value.equipmentTiers['armor']].bonus.hp + 100
        ),
        color: 'lightgreen',
      },
      { desc: 'HP MULT', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 1 || hero.value.level >= 700? (1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), true),
        color: 'gold',
      },
      {
        desc: 'Ascension [Celestial Overdrive]',
        value: () => (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1),
        color: 'lightblue',
      },
      {
        desc: 'Formation [T1]',
        value: () => {
          let f = 1;
          f *= (hero.value.activeFormation == 0? 2: 1);
          f *= (hero.value.activeFormation == 1? 0.5: 1);
          f *= (hero.value.activeFormation == 2? 0.5: 1);
          f *= (hero.value.activeFormation == 3? 0.5: 1);
          return f;
        },
        color: 'green',
      },
      {
        desc: 'BUFF: Conquer [T1]',
        value: () => formatNumber((hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Jaggernaut [T1]',
        value: () => hero.value.activeBuffs.includes(13)? 1.5: 1,
        color: 'orange',
      },
      {
        desc: 'BUFF: Charge [T1]',
        value: () => formatNumber(1 + 0.05 * buffs.value[6].charges.life, true),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => {
          let f = 1;
          f *= (hero.value.activeFormation == 0? 2: 1);
          f *= (hero.value.activeFormation == 1? 0.5: 1);
          f *= (hero.value.activeFormation == 2? 0.5: 1);
          f *= (hero.value.activeFormation == 3? 0.5: 1);
          f *= (hero.value.mainInfTier >= 1 || hero.value.level >= 700? (1.04 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);
          f *= (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1);
          f *= (hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 1? (1 + 0.001 * Math.floor(buffs.value[8].time)): 1);
          f *= (hero.value.activeBuffs.includes(13)? 1.5: 1);
          f *= (1 + 0.05 * buffs.value[6].charges.life);
          return formatNumber(f, true);
        },
        color: 'gold',
      },
      { desc: 'HP Total', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.maxHp, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'DEF',
    content: [
      { desc: 'Defense', value: '', color: 'yellow',  uppercase: true, },
      {
        desc: 'Level',
        value: () => formatNumber(((0.5 + 0.1 * Math.floor(hero.value.potential/30)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel) + 
        (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0)), true),
        color: 'lightgreen',
      },
      {
        desc: 'Body [Suffix]',
        value: () => formatNumber(hero.value.eqUpsMult['armor'].def, false),
        color: '#22cccc',
      },
      {
        desc: 'Total',
        value: () => formatNumber(((0.5 + 0.1 * Math.floor(hero.value.potential/30)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel) + 
        hero.value.eqUpsMult['armor'].def + (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0)), true),
        color: 'gold',
      },
      { desc: 'Defense Mult', value: '', color: 'yellow',  uppercase: true, },
      {
        desc: 'BUFF: Charge',
        value: () => formatNumber((1 + 0.05 * buffs.value[6].charges.life) , true),
        color: 'orange',
      },
       {
        desc: 'Tree',
        value: () => formatNumber((1 + ((perks.value[2].value * perks.value[2].level)*0.01)), true),
        color: 'lightgreen',
      },
       {
        desc: 'Ascension [Celestial Overdrive]',
        value: () => formatNumber((ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1), true),
        color: 'lightblue',
      },
       {
        desc: 'BUFF: Invisible [T1]',
        value: () => buffs.value[0].def,
        color: 'orange',
      },
       {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 1 || hero.value.level >= 700? (1.02 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), true),
        color: 'gold',
      },
      {
        desc: 'Formation [T3]',
        value: () => {
        let f = 1;
        f *= (hero.value.activeFormation == 2? 2: 1);
        f *= (hero.value.activeFormation == 1? 0.5: 1);
        f *= (hero.value.activeFormation == 0? 0.5: 1);
        f *= (hero.value.activeFormation == 3? 0.5: 1);
        return f;
        },
        color: 'yellow',
      },
       {
        desc: 'BUFF: Extra Life [T2]',
        value: () => (buffs.value[10].buffT2 > 0? 1.25: 1),
        color: 'orange',
      },
       {
        desc: 'BUFF: Jaggernaut [T1]',
        value: () => (hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 1? 1.5: 1),
        color: 'orange',
      },
      {
        desc: 'BUFF: Jaggernaut [T2]',
        value: () => formatNumber(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 2? 1 + (1 - (hero.value.hp / hero.value.maxHp)): 1, true),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => {
        let f = 1;
        f *= (hero.value.activeFormation == 2? 2: 1);
        f *= (hero.value.activeFormation == 1? 0.5: 1);
        f *= (hero.value.activeFormation == 0? 0.5: 1);
        f *= (hero.value.activeFormation == 3? 0.5: 1);
        f *= hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 2? 1 + (1 - (hero.value.hp / hero.value.maxHp)): 1;
        f *= (buffs.value[10].buffT2 > 0? 1.25: 1);
        f *= (hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 1? 1.5: 1);
        f *= (hero.value.mainInfTier >= 1 || hero.value.level >= 700? (1.02 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);
        f *= buffs.value[0].def;
        f *= (ascenPerks[28].level && enemy.value.isSpaceFight == 2? 1.25: 1);
        f *= (1 + ((perks.value[2].value * perks.value[2].level)*0.01));
        f *= (1 + 0.05 * buffs.value[6].charges.life);
        return formatNumber(f, true);
        },
        color: 'gold',
      },
      { desc: 'Extra DEF', value: '', color: 'yellow',  uppercase: true, },
      {
        desc: 'BUFF: Jaggernaut [T3]',
        value: () => formatNumber(hero.value.activeBuffs.includes(13) && buffs.value[13].tier >= 1? (hero.value.maxHp * 0.05): 0, true),
        color: 'orange',
      },
      { desc: 'Total DEF', value: '', color: 'yellow',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.def, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'ApS',
    content: [
      { desc: 'ApS', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base',
        value: () => formatNumber(0.5 + (hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 1? 0.5: 0), true),
        color: '',
      },
      {
        desc: 'Tree',
        value: () => formatNumber((perks.value[5].status? 0.1 * (Math.floor(hero.value.stage / 5 - 1)): perks.value[5].value * perks.value[5].level), true),
        color: 'lightgreen',
      },
      {
        desc: 'Boots',
        value: () => formatNumber(equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed, true),
        color: '#22cccc',
      },
      {
        desc: 'Boots [Enchances]',
        value: () => formatNumber(hero.value.eqUpsMult['boots'].bonus, true),
        color: '#22cccc',
      },
      {
        desc: 'BUFF: Combo [T4]',
        value: () => formatNumber((buffs.value[3].combo == 100? 0.3: 0), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Conquer [T3]',
        value: () => formatNumber((hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 3? 0.1 * Math.floor(buffs.value[8].time/250): 0), true),
        color: 'orange',
      },
       {
        desc: 'BUFF: Charge',
        value: () => formatNumber((0.1 * buffs.value[6].charges.power), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Flash [T2]',
        value: () => formatNumber(Math.min(Math.floor(hero.value.spCount / 6) * 0.1, 0.5), true),
        color: 'orange',
      },
      {
        desc: 'BUFF: Flash [T3]',
        value: () => formatNumber(Math.min(hero.value.stage * 0.01, 1), true),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.attacksPerSecond, true),
        color: 'orange',
      },
      {
        desc: 'Max',
        value: 4,
        color: 'red',
      },
    ],
  },
]

const  formatNumber = (num, f = false) => {
    if(f && num < 100) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
  
    const units = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
  }


</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow-y: auto;
  padding: 1rem;
  gap: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #e2c028 transparent;
  max-width: 600px;
}

.info-card {
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 1rem;
  color: #f0f0f0;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.2);
  transition: 0.3s;
}

.info-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.info-line {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  text-align: justify;
}

.buffs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.buff-card {
  background: #1e1e1e;
  border: 1px solid #e2c028;
  border-radius: 0.8rem;
  padding: 0.6rem;
}

.buff-name {
  color: #ffef91;
  font-weight: bold;
  margin-bottom: 0.4rem;
}

.buff-descriptions {
  font-size: 0.85rem;
  color: #ccc;
  list-style: disc;
  padding-left: 1rem;
}

.endless-section { border: 1px solid #ffaa00; }
.lore-section { border: 1px solid #9999ff; }
.afk-section { border: 1px solid #22cccc; }
.tree-section { border: 1px solid #00cc44; }
.ascension-section { border: 1px solid rgb(56, 43, 243); }
.souls-section { border: 1px solid #9900cc; }
.amulet-section { border: 1px solid rgb(250, 38, 38); }
.rebirth-section { border: 1px solid rgb(99, 255, 51); }
.space-section { border: 1px solid #ffcc00; }
.radiation-section { border: 1px solid #66ff66; }
.corruption-section { border: 1px solid rgb(247, 20, 235); }
.infinity-section { border: 1px solid rgb(224, 247, 19); }
.buffs-section { border: 1px solid #e2c028; }
.abyss-section { border : 1px solid #9900cc;}
.equipment-section {border: 1px solid #66ffcc;}
.singularity-section { border: 1px solid #22cccc; }
.dimension-section { border: 1px solid rgb(247, 20, 235); }

.event-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.event-tabs button {
  background: #222;
  border: 1px solid #555;
  color: #eee;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.3s;
  min-width: 100px;
}

.event-tabs button.active {
  background: #e2c028;
  color: #000;
  font-weight: bold;
  border-color: #ffef91;
}


.event-tabs button.active,
.stats-tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid #00f;
}

.stats-panel {
  background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
  color: #eee;
  font-family: 'Consolas', monospace;
  padding: 24px;
  border-radius: 12px;
  max-width: 640px;
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
}

.tabs {
  margin-bottom: 12px;
}

.tab-button {
  background: linear-gradient(to right, #3a3a3a, #1e1e1e);
  color: #eee;
  padding: 8px;
  border: 1px solid #555;
  cursor: pointer;
  border-radius: 8px;
  margin: 4px;
  transition: all 0.25s ease;
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
  min-width: 100px;
}

.tab-button:hover {
  background: linear-gradient(to right, #666, #444);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(255, 255, 255, 0.15);
}

.tab-button.active {
  background: linear-gradient(to right, #ffe600, #ffae00);
  color: #000;
  font-weight: bold;
  border-color: #ffcc00;
  box-shadow: 0 0 12px rgba(255, 230, 0, 0.7);
}

.stats-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  line-height: 1.6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
}

.stat-item .desc {
  min-width: 160px;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  white-space: nowrap; 
}

.stat-item .value {
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  color: gold;
}

.desc.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 16px;
}
</style>
