<template>
  <div class="info-container">
    <div class="event-tabs">
      <button
        v-for="event in events"
        :key="event"
        :disabled="disfunc(event)"
        @click="() => {
          hero.eLink.info = '';
          selectedEvent = event;
        }"
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
      @click="handleLinkClick"
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
      <p class="info-line">After stage 10 all Buffs become permanent(+10 Stages for each Abyss Tier). You can change them after <strong>ASCENSION</strong> & <strong>REBIRTH</strong></p>
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
          @click="() => {
            hero.eLink.stat = '';
            selectedTab = section;
          }"
          class="tab-button"
          :class="[{ active: section === activeTab }]"
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


const selectedTab = ref('Level');
const activeTab = computed(() => {
  if(hero.value.eLink.stat == 'IP') hero.value.secrets.link = true;
  return hero.value.eLink.stat !== '' ? hero.value.eLink.stat : selectedTab.value
});

const selectedEvent = ref('Lore'); 
const activeEvent = computed(() => 
  hero.value.eLink.info !== '' ? hero.value.eLink.info : selectedEvent.value
);


const filteredSections = computed(() => {
  return styledSections.filter(section =>
    section.class.includes(activeEvent.value.toLowerCase())
  );
});

watch(selectedEvent, () => {
  if (hero.value.eLink.info !== '') {
    hero.value.eLink.info = '';
  }
});

watch(selectedTab, () => {
  if (hero.value.eLink.stat !== '') {
    hero.value.eLink.stat = '';
  }
});

function disfunc(event){
  return !hero.value.infoActive[event.toLowerCase()];
}

const currentSection = computed(() =>
  statSections.find((s) => s.title === activeTab.value)
);

const availableBuffs = computed(() => buffs.value.filter(buff => buff.active));

function tieredDescriptions(buff) {
  return buff.description.slice(0, buff.tier);
}

const handleLinkClick = (event) => {
  const href = event.target.closest('a')?.getAttribute('href');
  if (href && href.includes('discord.gg')) {
    hero.value.secrets.dLink = true;
  }

  const span = event.target.closest('span');
  if (span && span.textContent?.trim().toLowerCase() === 'find me') {
    hero.value.secrets.dLore = true;
  }
};


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

const styledSections = [
 {
    title: 'Upadte 0.4 [Dimension Atlas part 2]',
    class: 'endless-section lore',
    content: [
      `<strong>Important changes</strong><br>
      New Dimensions<br>
      Singularity BH<br>
      IP Recalculation<br>
      AFK Reworked<br>
      UI changes<br>
      Quick access to information: click on [ℹ️] to go to the info section<br>
      Star Forge reworked:<br> You can hold the mouse button for fast echance<br>
      Reworked the chance of Enhance<br>
      Fix and add bugs<br>`,
      `There are already 100 of us in the Discord. In honor of this, everyone will receive 20 free IP`
      ]
  },
  {
    title: 'Links',
    class: 'auto-section lore',
    content: [
      `
      <a href="https://discord.gg/EVnTk9HZwu" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" alt="Discord" width="32" title="Join our Discord community" />
      </a>
      <a href="https://your-username.github.io/your-repo" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub Pages" width="32" title="Play the game on github.io" />
      </a>
      <a href="https://yourname.itch.io/your-game" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="itch.io" width="32" title="Play the game on itch.io" />
      </a>
      `
      ]
  },
  {
    title: 'Endless Progress',
    class: 'endless-section lore',
    content: [
      'Endgame content is The Dimension [Et-n1t1]',
      'Next update 0.5: The Dark Dimensions'
      ]
  },
  {
    title: 'Why LevelUp?',
    class: 'lore-section',
    content: [`
    Do you realize how powerful you are? Traveling between Dimensions, destroying Galaxies and Celestials. 
    But what you may not know is that D-Rule is watching you, and when you are weak enough, he will destroy you, because only one can be the Chosen One.
     What is it that makes you want to be stronger every time, and break down every wall that stands in your way. 
     Ask me when you <span>find me</span> between all these dimensions.
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
      'Stage requirement scales better: You will need fewer kills to advance to the next Stage',
      'Level requirement scales better: You will need fewer EXP to advance to the next Level',
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
      'You can kill a maximum of 1 enemy per second.',
      'Max AFK Kills = Max Stage Passed × 75.',
      'You skip the boss fights if their stage is 15 below your max stage.',
      'To get more profit from AFK, fight for at least 1 minute',
      'Soul Booster increase The chance of soul appearence. The Power depends on Total AFK kills. Soul Booster works for only One Soul.',
    ]
  },
  {
    title: 'Auto',
    class: 'auto-section lore',
    content: [
      `Unlock *Stop at Stage* after reaching Infinity [T0]`,
      `Unlock *Auto-Ascension* after reaching Infinity [T2]`,
      `Unlock *Auto-Rebirth* after reaching Infinity [T3]`,
      `Level+: Add Value to *Min Level* when you Rebirth`,
      `Stage+: Add Value to *Stage to Stop* when your Kills > *Stop Until Kills*`
    ]
  },
  {
    title: 'Tree',
    class: 'tree-section',
    content: [
      'Reset Perks: Resets all to level 1 and refunds Points.',
      'Increase the MAX level of perks by raising the Tree Tier',
      'Unlock the Amulet Suffix to upgrade the Tree Tier.',
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
      'Soul appears from Stage 15.',
      'Each soul gives +1 Max Level & (+10% EXP until 40 Souls - +40 After [Infinity T6]).',
      '+1 MIN Level per 10 Soul Tier [Infinity T6]',
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
      hero.value.sp >= 1 && `Enhance level depends on Equipment Tier.<br>
      If the Enhance level is higher than the Equipment Tier, only Enhance up to the current Tier are taken. <br>
      The amount of stardust dropped depends on the minimum stage before the current one [Current Stage - (40 - SP Perks)]<br>
      Boost: Select what percentage you want to add to the chance of Enhance<br>
      Auto - Enhance weapons with 100% chance to max level<br>
      Each Enhance increases the general parameter(Max Level) by 10% of the current one, and the additional parameter(Mult Dmg, HP, ...) by 5%`
    ]
  },
  {
    title: 'Amulet',
    class: 'amulet-section',
    content: [
      `Kill an enemy to get [Total Bonus]. [Total Bonus] is equals to sum of all curse bonuses from enemy`,
      'Bonus [Extra Multiplier] = [Total Bonus]^(1 + 0.05 * total Curses + [0.1 for each Curse [T4]] + [[0.2] for Curse [T5]])',
      `Bonus [Penalty]: ${(1 / Math.log(Math.max(3, 100 - hero.value.stage))).toFixed(2)}`,
      'Higher stage = Higher Curse tier chance and less Penalty.',
      '<strong>You can get EXP Mult and Buff EXP from [Total Bonus].</strong>',
      'Curse tiers: Green (T1), Yellow (T2), Red (T3), Purple (T4), Divine (T5)'
    ]
  },
  {
    title: 'Rebirth',
    class: 'rebirth-section',
    content: [
      'To get rebirth tier you need to reach the cap. The cap is equal to 100 + 10 * Rebirth Tier',
      'Total Level = Levels + MIN Levels',
      'MIN Levels provide stats only',
      'Rebirth Pts depends on Total Level.',
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
      hero.value.spCount >= 15 && `Abyss D: `,
      hero.value.abyssDStages >= 20 && `Reach Stage 20: High Tier Curses appear more often`,
      hero.value.abyssDStages >= 30 && `Reach Stage 30: Level scales based on Max Stage in Abyss `,
      hero.value.abyssDStages >= 40 && `Reach Stage 40: Corruption weakness is based on Max Stage in Abyss D`,
      hero.value.abyssDStages >= 50 && `Reach Stage 50: Curse Bonus boost is based on Max Stage in Abyss D`,
      hero.value.abyssDStages >= 60 && `Reach Stage 60: Stardust drop is better based on Max Stage in Abyss D`,
      hero.value.abyssDStages >= 70 && `Reach Stage 70: Stage requirement scales better based on Max Stage in Abyss D`,
      hero.value.abyssDStages >= 80 && `Reach Stage 80: Open D-Atlas`,
      hero.value.abyssDStages >= 100 && `Reach Stage 100: MULT to convert Curse [T4] to [T5]`,
      hero.value.abyssDStages >= 120 && `Reach Stage 120: Stage Requirement reduced for Dimension Shards`,
      hero.value.abyssDStages >= 140 && `Reach Stage 140: The Danger Power is weaker`,
      hero.value.abyssDStages >= 160 && `Reach Stage 160: Celestials are weaker`,
      hero.value.abyssDStages >= 180 && `Reach Stage 180: Soul-D is weaker`,
      hero.value.abyssDStages >= 200 && `Reach Stage 200: Max Level MULT`,
    ].filter(Boolean)
  },
  {
    title: 'Space',
    class: 'space-section',
    content: [
      'Kill a monster with a certain danger to find the boss',
      'Auto - Reproduces combat without fighting. Suitable for fighting weak creatures. [Infinity T5]',
      `At the beginning, only 4 space bosses are available.`,
      'Comet Ring - Unlimited Enhances.'
    ]
  },
  {
    title: 'Radiation',
    class: 'radiation-section',
    content: [
      'Curse [T3] can be mutated to Curse [T4]',
      `Mutation [T1] has a chance to mutate Curse [T3] into Curse [T4]. Mutation [T2] mutates only if Mutation [T1] was successful. Mutation [T3] mutates only if Mutation [T2] was successful. Mutation [T4] mutates only if Mutation [T3] was successful. 
      <strong>General formula: T[x+1] mutagen needs T[x] success.</strong>`,
      'Total mutagen gain = (Mutation T[x])^2.5 * (other mult).',
      `Mutation [T1]^2.5 = 1`,
      `Mutation [T2]^2.5 = 5.6`,
      `Mutation [T3]^2.5 = 15.6`,
      `Mutation [T4]^2.5 = 32`,
      `Mutation [T5]^2.5 = 56`,
      `<strong>Mutation</strong> [T1] will be available from <strong>Stage</strong> 30, 
      <strong>Mutation</strong> [T2] from <strong>Stage</strong> 35, 
      <strong>Mutation</strong> [T3] from <strong>Stage</strong> 40, 
      <strong>Mutation</strong> [T4] from <strong>Stage</strong> 45.`,
      `<strong>Tip: Increase the chance of Curse [T3] and the frequency of enemy spawns</strong>`,
      `Each  Curse [T4] grants an additional [^0.1] curse bonus. For information on the additional bonus, see the Info -> Amulet Section.`,
      'Danger ↑ = special enemy chance ↑ + power ↑.',
      'Danger doesnt work in Abyss and Singularity',
      `Danger Levels:<br>10: Soul Chance<br>20: Ascension Shard MULT for Ascension Souls<br>`,
      `Hold the button to upgrade quickly`,
      hero.value.infTier >= 4 && `Infinite Creatures:<br>
      Infinite creatures do not reset during Infinity, and each creature has its own personal Drop and MAX Drop<br>
      Ω-Infinity - [Danger 100 & Stage 60+]: +1 Potential [${enemy.value.dangerEnemyLoot[0]} / 60]<br>
      Mirror of the Infinity - [Danger 150 & Stage 65+]: +1 IP [${enemy.value.dangerEnemyLoot[1]} / 1000]<br>
      The Infinite One - [Danger 200 & Stage 70+]: +1 ST [${enemy.value.dangerEnemyLoot[2]} / 5]<br>`,
      dimensions.value[15].infTier == dimensions.value[15].maxInfTier && `Dimension Creatures:<br>
      Twisted Rootspawn - [Danger 400 & Stage 120+]: +1 Tree Point(TP) [${enemy.value.dEnemyLoot[0]} / 200]<br>
      Voidpulse Entity - [Danger 400 & Stage 140+]: +1 Space Power(SP) [${enemy.value.dEnemyLoot[1]} / 50]<br>
      Fracture Beast - [Danger 600 & Stage 135+]: +1 Dimension Shard(DS) [${enemy.value.dEnemyLoot[2]} / 5]<br>
      Clot of Dark Energy - [Danger 400 & Stage 120+]: Enemies are getting weaker by 1% [${enemy.value.dEnemyLoot[3]} / 90]<br>
      Infinitron Prime - [Danger 600 & Stage 145+]: +0.01 IP MULT [${enemy.value.dEnemyLoot[4]} / 25]<br>
      Entropy Reaver - [Danger 700 & Stage 150+]: -0.01 INF Penalty [${enemy.value.dEnemyLoot[5]} / 5]<br>
      `
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
      `Infinity [T1]: Reset everyting you've got(except Abyss D), but you will get Inf-Tree. Force any perk to serve you forever, but everything has its own price. Auto-Tree. Double Points gaining. Auto-Stage`,
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
      hero.value.mainInfTier >= 20 && `Infinity [T20]: The D-Rule tears the tissue of the universe, worsening the drop of stardust`,
      hero.value.mainInfTier >= 25 && `Infinity [T25]: The D-Rule destroys all Celestial making them insignificant, worsening the drop of mutagen `,
      hero.value.mainInfTier >= 30 && `Infinity [T30]: Dimensions are being consumed by the power of the multiverse. Curses are getting stronger`,
      hero.value.mainInfTier >= 40 && `Infinity [T40]: You feel the touch of the unknown, but you do not know how to get to it.`,
    ]
  },
  {
    title: 'Singularity',
    class: 'singularity-section',
    content: [
      `Singularity levels: increase the threshold after Max Level 700. After Level 700 your stats are getting double.`,
      hero.value.singularity >= 0 && 'Singularity [T0]',
      hero.value.singularity >= 0 && 'Challenge: Enter the singularity, where gravity devours space, opponents under the influence of gravity destroy galaxies and your level is on the verge of destruction.',
      hero.value.singularity >= 0 && 'Reward: Complete the singularity to obtain 1.05 MULT IP, +25 singularity levels. Overkill [T4], +2% to skip stage per Singularity Tier (S), level up while your level is below 2% of Max Level per Singularity Tier (S).',

      hero.value.singularity >= 1 && 'Singularity [T1]',
      hero.value.singularity >= 1 && 'Challenge: Enter the singularity, where the opponents have learned to recognize the essence of curses',
      hero.value.singularity >= 1 && 'Reward: Each curse gets a bonus from the next Tier. 1.05 MULT IP. +25 singularity levels.',

      hero.value.singularity >= 2 && 'Singularity [T2]',
      hero.value.singularity >= 2 && 'Challenge: Enter the singularity, where The Tree is locked.',
      hero.value.singularity >= 2 && 'Reward: +1 Tree Tier. 1.05 MULT IP. +25 singularity levels.',

      hero.value.singularity >= 3 && 'Singularity [T3]',
      hero.value.singularity >= 3 && 'Challenge: Enter the singularity, where Ascension is locked.',
      hero.value.singularity >= 3 && 'Reward: Ascension no longer resets during Infinity. Open Tier-S. Unlock a Perk in Tier-S for each Singularity Tier. 1.05 MULT IP. +25 singularity levels.',

      hero.value.singularity >= 4 && 'Singularity [T4]',
      hero.value.singularity >= 4 && 'Challenge: Enter the singularity, where Space is locked.',
      hero.value.singularity >= 4 && 'Reward: +1 Space Tier. Celestials from available dimensions see you. Auto is always opened. 1.05 MULT IP. +25 singularity levels.',

      hero.value.singularity >= 5 && 'Singularity [T5]',
      hero.value.singularity >= 5 && 'Challenge: Enter the singularity, where Buff is locked.',
      hero.value.singularity >= 5 && 'Reward: Buffs no longer reset during Infinity. +1 Max Buff. 1.05 MULT IP. +25 singularity levels.',
      
      hero.value.singularity >= 6 && 'Singularity [T6]',
      hero.value.singularity >= 6 && 'Challenge: Enter the singularity, where Equipment is locked.',
      hero.value.singularity >= 6 && 'Reward: +1 Enhance Level per each Singularity Tier. Unlock Awakened Equipment. 1.05 MULT IP. +25 singularity levels.',
      hero.value.singularity >= 6 && `Awakened Equipment: Reach the certain Tier of Equipment to increase a Base Drop Chance and the effectiveness of Enhanced generic parameter by 1%, additional parameter by 0.5%. +1 Gem Slot(Future content)`,
    
      hero.value.singularity >= 7 && 'Singularity [T7]',
      hero.value.singularity >= 7 && 'Challenge: Enter the singularity, where Rebirth is locked.',
      hero.value.singularity >= 7 && 'Reward: 1.05 MULT IP. +25 singularity levels. You start with 100000 Rebirth Pts. Unclock Singularity Pts',

      hero.value.singularity >= 8 && `Singularity BH`,
      hero.value.singularity >= 8 && `Kill an enemy with Curse [T5] to get extra bonus and double EXP, EXP BUFF, Stardust, Mutagen. See the chance of Curse [T5] in Amulet Section`
    ]
  },
  {
    title: 'Dimension',
    class: 'dimension-section',
    content: [
      `In dimensions that are weakly imbued with the D-Rule, the maximum possible stage in the Abyss is 100`,
      `Each dimension has a reward for each Infinity completed and a special reward for reaching the maximum Infinity in a certain dimension.`,
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
        desc: 'Comet Ring [Enhances]',
        value: () => (hero.value.eqUpsMult['spRing'].bonus),
        color: '#66ffcc',
      },
      {
        desc: 'Souls',
        value: () => (hero.value.infTier >= 6? Math.floor(hero.value.soulsMax/10): 0),
        color: '#d516d5',
      },
      {
        desc: 'Ascension [Soulbound Growth]',
        value: () => (ascenPerks[50].level? Math.floor(hero.value.soulsMax/20): 0),
        color: 'lightblue',
      },
      {
        desc: 'Infinity',
        value: () => Math.floor(hero.value.infPoints / (200 - ((hero.value.mainInfTier >= 25? 0.0035: 0) > 0? 20: 0))),
        color: 'gold',
      },
      {
        desc: 'Singularity Pts',
        value: () => (hero.value.rebirthPts >= 9e5? hero.value.singularity: 0),
        color: '#a4ffe1',
      },
      {
        desc: 'Dimension [S5-Ω3t] [5]',
        value: () => (Math.max(Math.floor(Math.max(hero.value.unlimitLevel - 700, 0) / 100 ), 0)),
        color: '#d516d5',
      },
      {
        desc: 'Ascension [Echo of Completion]',
        value: () => (ascenPerks[54].level? dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length : 0),
        color: 'lightblue',
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 41? Math.floor(hero.value.spCount / 6): 0),
        color: 'orange',
      },
      {
        desc: 'Dimension [ND-ζpWQ] [12]',
        value: () => (dimensions.value[12].infTier),
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
        value: () => hero.value.souls * (dimensions.value[14].infTier == dimensions.value[14].maxInfTier? 2: 1),
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
        desc: 'Equipment [Enhances]',
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
        value: () => (hero.value.spCount >= 23? hero.value.sp * 2: 0),
        color: 'orange',
      },
      {
        desc: 'Space [Bosses]',
        value: () => ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
        (hero.value.spCount / 6 >= 5? 150: 0) + (hero.value.spCount / 6 >= 6? 200: 0) + (hero.value.spCount / 6 >= 7? 300: 0) + (hero.value.spCount / 6 >= 8? 400: 0)),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
        (hero.value.spCount / 6 >= 5? 150: 0) + + (hero.value.spCount / 6 >= 6? 200: 0) + (hero.value.spCount / 6 >= 7? 300: 0) + (hero.value.spCount / 6 >= 8? 400: 0) + 30 +
        (hero.value.spCount >= 23? hero.value.sp * 2: 0) + radPerks[12].level + hero.value.souls * (dimensions.value[14].infTier == dimensions.value[14].maxInfTier? 2: 1) +
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
        desc: 'Base',
        value: 1,
        color: '',
      },
      {
        desc: 'Tree [Extra Level]',
        value: () => ((perks.value[4].status? 0.15: 0)).toFixed(2),
        color: 'lightgreen',
      },
      {
        desc: 'Amulets [Prefix]',
        value: () => (((amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + 
        (amulets[3].prefix.status? 0.08: 0)) * (hero.value.sp >= 99? 2: 1)).toFixed(2),
        color: 'red',
      },
      {
        desc: 'Ascension [Endless Levels]',
        value: () => ((ascenPerks[31].level * 0.01)).toFixed(2),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Corrupted Amplification]',
        value: () => (ascenPerks[41].level?  hero.value.overcorruption / (4 - 0.15 * (dimensions.value[22].infTier - 25)): 0).toFixed(2),
        color: 'lightblue',
      },
      {
        desc: 'Rebirth Tier',
        value: () => ( (hero.value.rebirthTier >= 80? 1.015 ** (Math.min(hero.value.rebirthTier, 125) - 79) - 1: 0)).toFixed(2),
        color: 'lightgreen',
      },
      {
        desc: 'Infinity',
        value: () => ((hero.value.mainInfTier >= 10? (1.07 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints)*Math.log(hero.value.infPoints))): 0)).toFixed(2),
        color: 'gold',
      },
      {
        desc: 'Dimension [S5-Ω3t] [5]',
        value: () => formatNumber(Math.max((1.05 ** ((hero.value.unlimitLevel - 700) / 75) - 1), 0), true),
        color: '#991099',
      },
      {
        desc: 'Abyss D',
        value: () =>  formatNumber(hero.value.spCount >= 15 && hero.value.abyssDStages >= 200? 1.025 ** (hero.value.abyssDStages - 199) - 1: 0, true),
        color: '#991099',
      },
      {
        desc: 'Ring [Prefix]',
        value: () => formatNumber(hero.value.eqUpsMult['ring'].multLevel, true),
        color: '#66ffcc',
      },
      {
        desc: 'Total',
        value: () => (1 + hero.value.maxLevelMult).toFixed(2),
        color: 'gold',
      },
      { desc: `True Level`, value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.trueLevel, true),
        color: 'gold',
      },
      { desc: `Infinity [T${hero.value.infTier}]`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Penalty [^]',
        value: () => Math.min(1 - 0.02 * (hero.value.infTier), 1).toFixed(2),
        color: 'gold',
      },
      { desc: `Penalty Reduction`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Ascension [Singularity Seed]',
        value: () => (ascenPerks[42].level? 0.02: 0),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Dimensional Toll]',
        value: () => (ascenPerks[47].level? dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length * 0.005: 0),
        color: 'lightblue',
      },
      {
        desc: 'Dimension Creature',
        value: () => (enemy.value.dEnemyLoot[5]*0.01),
        color: 'rgb(9, 253, 233)',
      },
      {
        desc: 'Dimension [KL-σrXZ] [13]',
        value: () => ((dimensions.value[13].infTier - 15) * 0.005),
        color: '#db16db',
      },
      {
        desc: 'Singularity Pts',
        value: () => formatNumber(hero.value.rebirthPts >= 2.5e6? Math.sqrt(Math.log(hero.value.rebirthPts)) * 0.01: 0, true),
        color: '#a4ffe1',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.infPenalty, true),
        color: 'gold',
      },
      { desc: `Total Penalty`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total [^]',
        value: () => Math.min((1 - 0.02 * (hero.value.infTier) + hero.value.infPenalty), 1).toFixed(2),
        color: 'gold',
      },
      {
        desc: `True Max Level Requirements [Infinity T${hero.value.infTier}]`,
        value: () => (Math.round(700 ** (1 / (1 - 0.02 * (hero.value.infTier) + hero.value.infPenalty)))),
        color: 'gold',
      },
      {
        desc: `True Max Level Requirements with MIN LEVEL [Infinity T${hero.value.infTier}]`,
        value: () => (Math.round((700 - hero.value.minLevel) ** (1 / (1 - 0.02 * (hero.value.infTier) + hero.value.infPenalty)))),
        color: 'gold',
      },
      { desc: `Singularity Levels`, value: '', color: '#a4ffe1',  uppercase: true, },
      {
        desc: 'Singularity Challenges',
        value: () => formatNumber(25 * (hero.value.singularity), true),
        color: '#a4ffe1',
      },
      {
        desc: 'Singularity Pts',
        value: () => formatNumber(Math.floor((hero.value.rebirthPts >= 4.5e5? Math.log(hero.value.rebirthPts + 3) ** 1.906: 0)), true),
        color: '#a4ffe1',
      },
      {
        desc: 'Total',
        value: () => Math.floor((hero.value.rebirthPts >= 4.5e5? Math.log(hero.value.rebirthPts + 3) ** 1.906: 0)) + 25 * (hero.value.singularity),
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
        desc: 'Secrets',
        value: () => (Object.values(hero.value.secrets).filter(v => v).length * 20),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => (hero.value.infPointsGoals + enemy.value.dangerEnemyLoot[1] + Object.values(hero.value.secrets).filter(v => v).length * 20),
        color: 'gold',
      },
      { desc: 'IP MULT', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: 1,
        color: '',
      },
      {
        desc: 'Singularity Challenges',
        value: () => formatNumber(0.05 * hero.value.singularity, true),
        color: '#66ffcc',
      },
       {
        desc: 'Singularity Pts',
        value: () => formatNumber(hero.value.rebirthPts >= 5e6? Math.log(hero.value.rebirthPts)*0.015: 0, true),
        color: '#a4ffe1',
      },
       {
        desc: 'Dimension creature',
        value: () => formatNumber(enemy.value.dEnemyLoot[4]*0.01, true),
        color: '#b51fb5',
      },
       {
        desc: 'Dimension [JK-λbYX] [22]',
        value: () => formatNumber(dimensions.value[22].infTier == dimensions.value[22].maxInfTier?hero.value.mainInfTier * 0.01: 0, true),
        color: '#f84bf9',
      },
       {
        desc: 'Total',
        value: () => formatNumber(hero.value.infPointsMult, true),
        color: 'gold',
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
        desc: 'Ring [Enhances]',
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
        value: () => formatNumber((enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1), true),
        color: '#ed14ed',
      },
      {
        desc: 'Souls',
        value: () => formatNumber((1 + Math.min(hero.value.souls, 40 + (Math.max(hero.value.infTier, hero.value.mainInfTier) >= 6? 40: 0)) * (0.1 + (hero.value.soulTier >= 3? 0.05: 0))), true),
        color: '#ed14ed',
      },
      {
        desc: 'BUFF: Overkill [T4]',
        value: () => formatNumber((hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? hero.value.overkill * 0.1 + (dimensions.value[19].infTier == dimensions.value.maxInfTier? 0.05: 0): 1), true),
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
        value: () => formatNumber(Math.max(1 + (hero.value.unlimitLevel - 700) / 100, 1), true),
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
            ? ((1.06 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1) + Math.log(hero.value.infPoints + 2))) *
            (hero.value.rebirthPts >= 3.5e5 && hero.value.eLevel > 700? Math.sqrt(Math.log(hero.value.rebirthPts + 3))/2: 1) * 
            (hero.value.dId == 'unlimitted'? 1.75 ** Math.max(Math.floor((hero.value.unlimitLevel - 1000) / 500), 0): 1))
            : 0, true),
        color: 'gold',
      },
      {
        desc: 'Curse [T5]',
        value: () => (hero.value.curset5? 2: 1),
        color: ' #a4ffe1',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalExp),
        color: 'gold',
      },
      { desc: `Infinity [T${hero.value.infTier}]`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: `Penalty [^]`,
        value: () => Math.min(1 - 0.02 * hero.value.infTier + hero.value.infPenalty, 1).toFixed(2),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalExp ** Math.min(1 - 0.02 * hero.value.infTier + hero.value.infPenalty, 1)),
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
        value: () => formatNumber(hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4? hero.value.overkill*(0.1 (dimensions.value[19].infTier == dimensions.value.maxInfTier? 0.05: 0)): 1, true),
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
        value: () => formatNumber(1 + (hero.value.spCount >= 10? 0.1 * hero.value.sp: 1), true),
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
        value: () => formatNumber(hero.value.mainInfTier >= 1? ((1.08 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: 'gold',
      },
      {
        desc: 'Tree [T6]',
        value: () => formatNumber(perks.value[15].value ** perks.value[15].level, true),
        color: 'lightgreen',
      },
      {
        desc: 'Curse [T5]',
        value: () => (hero.value.curset5? 2: 1),
        color: ' #a4ffe1',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.eqTotalDrop, true),
        color: 'gold',
      },
      { desc: 'Sword', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (20 * ((0.2 + 0.035 * hero.value.awakened['sword']) ** (hero.value.eqDrop['sword'])) * Math.log(hero.value.stage + 1) ** 2).toExponential(2) ,
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
        desc: 'Awakened Tier',
        value: () => hero.value.awakened['sword'],
        color: '#66ffcc',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['sword'] - (hero.value.spCount >= 35? 1: 0) - (hero.value.spCount >= 46? 2: 0) -
        (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
      { desc: 'Body', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (20 * ((0.185 + 0.02 * hero.value.awakened['armor']) ** (hero.value.eqDrop['armor'])) * Math.log(hero.value.stage + 1) ** 2.1).toExponential(2),
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
        desc: 'Awakened Tier',
        value: () => hero.value.awakened['armor'],
        color: '#66ffcc',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['armor'] - (hero.value.spCount >= 35? 1: 0) - (hero.value.spCount >= 46? 2: 0) -
        (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
      { desc: 'Boots', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (15 * ((0.17 + 0.02 * hero.value.awakened['boots']) ** (hero.value.eqDrop['boots'])) * Math.log(hero.value.stage + 1) ** 2.3).toExponential(2),
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
        desc: 'Awakened Tier',
        value: () => hero.value.awakened['boots'],
        color: '#66ffcc',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['boots'] -(hero.value.spCount >= 35? 1: 0) - (hero.value.spCount >= 46? 2: 0) -
        (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
        color: '#66ffcc',
      },
      { desc: 'Ring', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base Drop Chance',
        value: () => (8 * ((0.15 + 0.02 * hero.value.awakened['ring']) ** (hero.value.eqDrop['ring'])) * Math.log(hero.value.stage + 1) ** 2.5).toExponential(2),
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
        desc: 'Awakened Tier',
        value: () => hero.value.awakened['ring'],
        color: '#66ffcc',
      },
      {
        desc: 'Awakened Tier Requirements',
        value: () => 20 + 10 * hero.value.awakened['ring'] - (hero.value.spCount >= 35? 1: 0) - (hero.value.spCount >= 46? 2: 0) -
        (dimensions.value[8].infTier == dimensions.value[8].maxInfTier? hero.value.singularity: 0),
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
        value: () => formatNumber(Math.sqrt(Math.log(hero.value.stage+2) ** (hero.value.stage/7)) * Math.max(1 + hero.value.maxLevel / 100, 7), true),
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
        value: () => formatNumber(hero.value.mainInfTier >= 3? ((1.045 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
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
        desc: 'Danger',
        value: () => ((enemy.value.danger >= 20? enemy.value.dangerEnemyChance[4]: 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.shardsMult * 0.1 * (hero.value.activeFormation == 3? 2: 1) * (enemy.value.danger >= 20? enemy.value.dangerEnemyChance[4]: 1), true),
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
          let extraLevel = hero.value.level;
          let pt = Math.min((Math.log(Math.max((extraLevel - 97), 3)**(1.15 + 0.08 * (Math.floor(hero.value.rebirthPts)).toFixed(0).length))**(extraLevel/Math.max(100 - (1 * extraLevel/9), 1))), 10000);
          pt = (pt >= 400? 400 + Math.sqrt(pt - 400): pt)
          return formatNumber(pt);
        },
        color: '',
      },
      {
        desc: 'base: Ascension [Rebirth Echo] & Rebirth Tier',
        value: () => {
          let extraLevel = hero.value.level + (ascenPerks[37].level? 50: 0) + (hero.value.rebirthTier >= 20? 25: 0);
          let pt = Math.min((Math.log(Math.max((extraLevel - 97), 3)**(1.15 + 0.08 * (Math.floor(hero.value.rebirthPts)).toFixed(0).length))**(extraLevel/Math.max(100 - (1 * extraLevel/9), 1))), 10000);
          pt = (pt >= 400? 400 + Math.sqrt(pt - 400): pt)
          return formatNumber(pt);
        },
        color: 'lightblue',
      },
      { desc: 'Rebirth Mult', value: '', color: 'lightgreen',  uppercase: true, },
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
        value: () => formatNumber(hero.value.mainInfTier >= 3? ((1.025 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => {
          let t = 1;
          t *= (hero.value.mainInfTier >= 3? ((1.025 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1);
          t *= (1 + ascenPerks[34].level * 0.01);
          t *= (hero.value.rebirthPts >= 1250? Math.min((1 + 0.01 * hero.value.rebirthTier) ** 8, 2) * ((1 + 0.01 * Math.max(hero.value.rebirthTier - 9, 0)) ** 2) : 1);
          t *= (hero.value.soulTier >= 4? 1.5: 1);
          t *= (perks.value[14].level? perks.value[14].value: 1);
          t *= (1.3 ** hero.value.abyssTier);
          t *= (hero.value.rebirthPts >= 100? enemy.value.rebirthEnemy["drop"]: 1);
          return formatNumber(t, true);
        },
        color: 'gold',
      },
      { desc: 'Total Pts', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalPtsMult, true),
        color: 'gold',
      },
    ],
  },
  {
    title: 'BUFF EXP',
    content: [
      { desc: 'BUFF EXP', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base [Curse Bonuses]',
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
        value: () => formatNumber(hero.value.mainInfTier >= 4? ((1.035 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: 'gold',
      },
      {
        desc: 'Dimension [QZ-µaTT] [11]',
        value: () => formatNumber((1.15 ** (dimensions.value[11].infTier - 5)), true),
        color: '#db16db',
      },
      {
        desc: 'Dimension [KL-σrXZ] [13] [Penalty]',
        value: () => (hero.value.dId == 'hard'? 0: 1),
        color: 'red',
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
        value: () => formatNumber(hero.value.spCount >= 15 && hero.value.abyssDStages >= 50? 1.015 ** (hero.value.abyssDStages - 49): 1, true),
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
        value: () => formatNumber((hero.value.curset5? 0.2 + (hero.value.rebirthPts >= 7.5e5? 0.1: 0): 0) + (1 + 0.1 * hero.value.mutations) + 0.05 * Math.max(hero.value.activeCurse.length - 1, 0), true),
        color: 'red',
      },
       {
        desc: 'Bonus [Penalty]',
        value: () => formatNumber(1 / Math.log(Math.max(3, 100 - hero.value.stage)), true),
        color: 'red',
      },
      {
        desc: 'Dimension [KL-σrXZ] [13] [Penalty]',
        value: () => (hero.value.dId == 'hard'? 0: 1),
        color: 'red',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.cursedBonusExp, true),
        color: 'gold',
      },
      {
        desc: 'Total: Abyss [Penalty]',
        value: () => formatNumber((ascenPerks[46].level? hero.value.cursedBonusExp ** 0.75: Math.sqrt(hero.value.cursedBonusExp)), true),
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
          let st = 39 - (hero.value.spCount >= 8? 1: 0) - (hero.value.spCount >= 14? 2: 0) - (hero.value.spCount >= 20? 2: 0) - 
          (hero.value.spCount >= 32? 3: 0) - (hero.value.spCount >= 39? 3: 0) - (hero.value.spCount >= 44? 4: 0);
          return formatNumber(Math.max(1.0525 ** (hero.value.stage - st), 0), true);
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
        value: () => formatNumber((hero.value.spCount >= 15 && hero.value.abyssDStages >= 60? (1.015 ** Math.max(hero.value.abyssDStages - 59, 120)): 1), true),
        color: '#ed14ed',
      },
      {
        desc: 'Tree',
        value: () => formatNumber((1 + perks.value[17].level*0.01), true),
        color: 'green',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.spCount >= 45 && hero.value.activeFormation == 3? 2: 1),
        color: 'orange',
      },
      {
        desc: 'Curse [T5]',
        value: () => (hero.value.curset5? 2: 1),
        color: '#a4ffe1',
      },
      {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 18? (1.0145 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 0), true),
        color: 'gold',
      },
      {
        desc: 'Infinity [Penalty]',
        value: () => formatNumber((!hero.value.infProgress? (1 + 0.2 * Math.max(hero.value.infTier - 20, 0)): 1), true),
        color: 'red',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.stardustInfo, true),
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
        desc: 'Curse [T5]',
        value: () => (hero.value.curset5? 2: 1),
        color: '#a4ffe1',
      },
      {
        desc: 'Infinity [Penalty]',
        value: () => (!hero.value.infProgress? 1 / (1 + 0.05 * Math.max(hero.value.infTier - 25, 0)): 1),
        color: 'red',
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
        value: () => Math.floor(hero.value.infPoints / (250 - ((hero.value.mainInfTier >= 25? 0.0035: 0) > 0? 20: 0))),
        color: 'gold',
      },
      {
        desc: 'Dimension [#6a0dad] [10]',
        value: () => (6 * (dimensions.value[10].infTier - 10)),
        color: '#6a0dad',
      },
       {
        desc: 'Singularity Pts',
        value: () => (hero.value.rebirthPts >= 5e5? 30: 0),
        color: ' #a4ffe1',
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
        value: () =>  (hero.value.mainInfTier >= 20? Math.floor(hero.value.infPoints / (15 - ((hero.value.mainInfTier >= 25? 0.0035: 0) > 0? 1: 0))): 0),
        color: 'gold',
      },
      {
        desc: 'Singularity Pts',
        value: () =>  Math.floor(hero.value.rebirthPts >= 2e6? Math.log(hero.value.rebirthPts) ** 2: 0),
        color: '#a4ffe1',
      },
       {
        desc: 'Ascension [Void Hazard [T2]]',
        value: () => hero.value.dangerStage,
        color: 'lightblue',
      },
       {
        desc: 'Dimension [BZ-ΦeLL] [15]',
        value: () => (dimensions.value[15].infTier < 10? Math.floor(1.45 ** (dimensions.value[15].infTier - 10)): 0),
        color: '#6a0dad',
      },
       {
        desc: 'Space',
        value: () => (hero.value.spCount >= 38? hero.value.sp: 0),
        color: 'orange',
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
        hero.value.minLevel * (dimensions.value[12].infTier == dimensions.value[12].maxInfTier? 2: 1))) * (hero.value.dId == 'noStats'? 0: 1), true),
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
        desc: 'Sword [Enhances]',
        value: () => formatNumber(hero.value.eqUpsMult['sword'].bonus, true),
        color: '#22cccc',
      },
       {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 1 || hero.value.level >= 700? ((1.055 + (hero.value.mainInfTier >= 25? 0.0035: 0) + (dimensions.value[20].infTier == dimensions.value[20].maxInfTier? 0.005: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))) : 1), true),
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
        desc: 'Singularity Pts',
        value: () => formatNumber((hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1), true),
        color: 'orange',
      },
       {
        desc: 'Dimension [RX-ϴvLX] [10]',
        value: () => (hero.value.isSingularity && dimensions.value[10].infTier == dimensions.value[10].maxInfTier? 2: 1),
        color: '#6a0dad',
      },
       {
        desc: 'Ascension [Fractal Echoes]',
        value: () => formatNumber((ascenPerks[48].level? 1 + 0.05 * dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length: 1), true),
        color: 'lightblue',
      },
       {
        desc: 'Dimension [LZ-ψdVV] [20]',
        value: () => formatNumber((1.04 ** (dimensions.value[20].infTier - 20)), true),
        color: '#6a0dad',
      },
      {
        desc: 'Dimension [DV-χuQZ] [21]',
        value: () => formatNumber((hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1), true),
        color: '#6a0dad',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.attack, true),
        color: 'gold',
      },
      { desc: 'Crit Chance', value: '', color: 'red',  uppercase: true, },
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
              hero.value.minLevel * (dimensions.value[12].infTier == dimensions.value[12].maxInfTier? 2: 1)  +
              (
                hero.value.eLevel > 700 && hero.value.maxLevel > 700
                  ? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700
                  : 0
              )
            )
          ) * (hero.value.dId == 'noStats'? 0: 1)
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
        desc: 'Equipment [Enhances]',
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
        value: () => formatNumber((hero.value.mainInfTier >= 1 || hero.value.level >= 700? ((1.015 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1), true),
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
        desc: 'Singularity Pts',
        value: () => (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1),
        color: '#a4ffe1',
      },
       {
        desc: 'Dimension [DV-χuQZ] [21]',
        value: () => (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1),
        color: '#6a0dad',
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
          f *= (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1);
          f *= (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1);
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
        value: () => formatNumber(((0.5 + 0.1 * Math.floor(hero.value.potential/30)) * (Math.min(hero.value.maxLevel, hero.value.eLevel-1) + hero.value.minLevel * (dimensions.value[12].infTier == dimensions.value[12].maxInfTier? 2: 1)) + 
        (hero.value.eLevel > 700 && hero.value.maxLevel > 700? Math.min(hero.value.eLevel, hero.value.maxLevel) - 700: 0)) * (hero.value.dId == 'noStats'? 0: 1), true),
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
        desc: 'Singularity Pts',
        value: () => (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1),
        color: '#a4ffe1',
      },
       {
        desc: 'Dimension [DV-χuQZ] [21]',
        value: () => (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1),
        color: '#6a0dad',
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
        f *= (hero.value.survivalStage ** 1.175 > hero.value.eLevel? 2: 1);
        f *= (hero.value.isSingularity && hero.value.rebirthPts >= 6e5? 2: 1);
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
        value: () => formatNumber((perks.value[5].status? Math.min(0.1 * Math.floor(hero.value.stage / 5 - 1), 1.5): perks.value[5].value * perks.value[5].level), true),
        color: 'lightgreen',
      },
      {
        desc: 'Boots',
        value: () => formatNumber(equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed, true),
        color: '#22cccc',
      },
      {
        desc: 'Boots [Enhances]',
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
        desc: 'BUFF: Fast Slash',
        value: () => formatNumber(hero.value.activeBuffs.includes(5)? buffs.value[5].debuff: 0, true),
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
.auto-section { border: 1px solid rgb(99, 255, 51); }
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
