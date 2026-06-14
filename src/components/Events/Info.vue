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

    <div v-if="activeEvent === 'Lore'" class="info-card lore-section styel-section">
      <div class="tabs">
        <button
          v-for="author in authors"
          :key="author"
          :disabled="!isAuthorUnlocked(author)"
          @click="activeAuthor = author"
          :class="{ active: activeAuthor === author }"
          :style="{ color: authorColors[author] || '#ccc' }"
        >
          {{ author }}
        </button>
      </div>

      <div class="lore-filters">
        <button
          :class="{ active: loreFilter === 'All' }"
          @click="loreFilter = 'All'"
        >
          All
        </button>

        <button
          :class="{ active: loreFilter === 'Available' }"
          @click="loreFilter = 'Available'"
        >
          Available
        </button>

        <button
          :class="{ active: loreFilter === 'Locked' }"
          @click="loreFilter = 'Locked'"
        >
          Locked
        </button>

        <button
          :class="{ active: loreFilter === 'First' }"
          @click="loreFilter = 'First'"
        >
          First
        </button>

        <button
          :class="{ active: loreFilter === 'Last' }"
          @click="loreFilter = 'Last'"
        >
          Last
        </button>
      </div>

      <div class="lore-wrapper">
        <div
          v-for="section in filteredLoreSections"
          :key="section.id"
          class="lore-card"
          :class="{ hidden: !section.visible, locked: section.locked }"
          @click="unlockLoreSection(section)"
        >
          <h3 class="lore-title">{{ section.title }}</h3>

          <div class="lore-meta">
            <span class="lore-author" v-if="section.author">From: {{ section.author }}</span>
            <span class="lore-location" v-if="section.location"> Location: {{ section.location }}</span>
          </div>

          <div v-if="!section.locked" class="lore-content" v-html="section.content.join('<br>')"></div>
          <p v-else class="lore-locked">🔒 Information locked. Complete the requirement to unlock.</p>
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
            v-for="(item, index) in currentSection.content.filter(c => !c.req || c.req())"
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
import { watchEffect, watch, ref, computed } from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { equipment } from '../../data/equipment.js';
import { perks as ascenPerks } from '../../data/ascension.js';
import { perks } from '../../data/perks.js';
import { perks as radPerks } from '../../data/radPerks.js';
import { amulets } from '../../data/amulets.js';
import { dimensions } from '../../data/dimensions.js';
import { cursed } from '../../data/cursed.js';
import { goals as infGoals } from '../../data/infGoals.js';
import { spaceShop } from '../../data/spaceShop.js';
import { divineSkills } from '../../data/quasarCore.js';

import { loreSection } from '../../data/info/lore.js';
import { fn } from '../../composables/utils/global.js';
import { useTrees } from '../../composables/battleUtils/useTree.js';
import { useEquipments } from '../../composables/battleUtils/useEquipment.js';
import { infBonusesHandler } from '../../composables/battleUtils/global/infBonusesHandler.js';
import { useDimensions } from '../../composables/battleUtils/useDimensions.js';
import { usePlayer } from '../../composables/utils/playerSetup.js';
import { useAscensions } from '../../composables/battleUtils/useAscension.js';
import { useSpecialStats } from '../../composables/battleUtils/useSpecialStats.js';
import { useTimeline } from '../../composables/battleUtils/dims/useTimeline.js';
import { useAbysses } from '../../composables/battleUtils/useAbyss.js';
import { useSingularity } from '../../composables/battleUtils/useSIngularity.js';
import { useBaseEnemy } from '../../composables/utils/enemySetup.js';
import { useAmulets } from '../../composables/battleUtils/useAmulets.js';
import { useSpaces } from '../../composables/battleUtils/useSpace.js';
import { spaceShopHandler } from '../../composables/battleUtils/global/spaceShopHandler.js';
import { d5RewardHandler } from '../../composables/battleUtils/global/d5RewardHandler.js';
import { useProgressions } from '../../composables/battleUtils/useProgression.js';
import { useSouls } from '../../composables/battleUtils/useSouls.js';
import { dGravityHandler } from '../../composables/battleUtils/global/dGravityHandler.js';
import { useInfinity } from '../../composables/battleUtils/useInfinity.js';
import { useVoid } from '../../composables/battleUtils/dims/useVoid.js';
import { useRadiations } from '../../composables/battleUtils/useRadiation.js';


const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();
const { player } = usePlayer();
const { villian } = useBaseEnemy();

const {
  nodesHandler
} = useTrees();

const {
  bossStats,
  voidKillsRed,
  killsLootHandle,
  overkillSkill,
} = useProgressions();

const {
  soulDmg,
  soulHp,
  soulTotalChance,
  soulBaseChance,
} = useSouls();

const {
  timelineEffects
} = useTimeline();

const {
  getEqBase,
  getEqUps,
  getEqEnhanceMaxLevel,
  getEqMaxLevel,
  eqCpmplect
} = useEquipments();

const { 
  corrHeartHandler 
} = useAmulets();

const {
  getDimEffect,
  getDimReward,
  getDimSpecialReward,
} = useDimensions();

const {
  perksHandler,
  infPerksLevels,
} = useAscensions();

const {
  trHandle
} = useSpecialStats();

const {
  collectLawEffects,
  radiusSourses,
  ancientShardsMult,
} = useTimeline();

const {
  corrInflueceHandle,
  abyssHandler,
} = useAbysses();

const {
  singShardsEffect,
  enemyShardsMult,
  singPower,
  singStageReq,
} = useSingularity();

const {
  spaceBossesMaxLevel
} = useSpaces();

const {
  infPenalties
} = useInfinity();

const {
  voidEffects,
  voidMults,
} = useVoid();

const {
  getRadPerk
} = useRadiations();

const selectedTab = ref('Level');
const activeTab = computed(() => {
  if(hero.value.eLink.stat == 'IP') hero.value.secrets.link = true;
  return hero.value.eLink.stat !== '' ? hero.value.eLink.stat : selectedTab.value
});

const selectedEvent = ref('Info'); 
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
  'Update',
  'Lore',
  'Info',
  'Stats',
];

const authorColors = {
  'Ancient Notes': '#2dffbd',
  '[D-Infinity]': 'gold',
  '[D-Gravity]': '#00fdff',
  '[D-Space]': 'orange',
  '[D-Ultimatum]': '#ff6b6b',
  '[D-Corruption]': '#d300f7',
  '[D-Eternal]': '#feafff',
  '[Timeline]': 'gold',
  '[Void]': '#b6ff00',
  '[D-Rule]': '#ffffff',
};


const activeAuthor = ref(null);
const loreFilter = ref('All');


const authors = computed(() => {
  return Array.from(
    new Set(
      loreSection
        .filter(s => s.content && s.content.length > 0 && s.visible && !s.locked)
        .map(s => s.author || 'Ancient Notes')
    )
  );
});


const filteredLoreSections = computed(() => {
  if (!activeAuthor.value) return [];

  let list = loreSection.filter(
    s => s.author === activeAuthor.value
  );

  switch (loreFilter.value) {
    case 'Locked':
      list = list.filter(s => s.locked);
      break;

    case 'Available':
      list = list.filter(s => !s.locked);
      break;

    case 'First':
      list = [...list].sort((a, b) => a.id - b.id);
      break;

    case 'Last':
      list = [...list].sort((a, b) => b.id - a.id);
      break;

    default:
      break;
  }

  return list;
});


const isAuthorUnlocked = (author) => {
  return loreSection.some(
    s => s.author === author && s.visible && !s.locked
  );
};


const unlockLoreSection = (section) => {
  if (section.locked && checkUnlockCondition(section)) {
    section.locked = false;
  }
};


const checkUnlockCondition = (section) => {
  if (!section.visible) return false;
  if (section.locked && !section.condition) return false;

  return section.condition ? section.condition({ hero: hero.value, d: dimensions.value }) : true;
};


watchEffect(() => {
  loreSection.forEach(section => {
    if (section.locked && checkUnlockCondition(section)) {
      section.locked = false;
    }
  });
});


watch(authors, () => {
  const unlocked = authors.value.find(a => isAuthorUnlocked(a));
  if (unlocked) activeAuthor.value = unlocked;
}, { immediate: true });







const styledSections = [
 {
    title: 'Update 1.0 [Dimensional Merge]',
    class: 'update-section update style-section',
    content: [
        `<b style="color: gold">Important changes</b><br>`,

        `<b>
        All events have been slightly reworked.<br>
        Each event now has its own information panel.<br>
        Balance has been reworked.<br>
        Many UI changes.<br>
        Some mechanics are no longer capped.<br>
        Some dimensions werr reworked.<br>
        Added a lot of stats in Stat section<br></b>`,

        `<b style="color: gold">New Content</b><br>`,

        `<b>
        Timeline and Laws<br>
        Black Hole [T4] and [T5]<br>
        D-Singularity<br>
        D-Corruption<br>
        Void<br></b>`,
      ]
  },
  {
    title: 'Links',
    class: 'auto-section info style-section',
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
    class: 'endless-section info style-section',
    content: [
      'Endgame content is The Black Hole [T4]',
      'Next update 0.6: Dimensional Merge'
      ]
  },
  {
    title: 'Usefull Info you should know',
    class: 'endless-section info style-section',
    content: [
      '^ - Exponent',
      'Reduce Stag Req - you need fewer kills to advance to the next stage',
      'Reduce Level Req - you need less exp to level up',
      'Magnitude - when enemies spawn, their HP and DMG are generated in the range of [0.7] to [1.5].',
      'Loot - Resources obtained after killing an enemy: EXP, Skill EXP, Mutagen, Starudst',
      'Stats - DMG, HP, DEF',
      'Events - are located on the left and represent unique mechanics for obtaining various types of bonuses.',
      'Heal MULT - Increase the healing effect',
      'Enemy Weakness/Power - Reduce or Increase the Enemy HP and DMG',
      'Hint: Hover over the text, it might contained a info',
      hero.value.mainInfTier >= 10 && `Abyssal Covenant Requirement is a certain count of souls and a certain stage. For the Abyss [T0] is 20 souls and Stage 20 and so on`,
    ]
  },
  {
    title: 'Abbreviations you should know',
    class: 'endless-section info style-section',
    content: [
      'DMG - Damage',
      'HP - Health Points',
      'DEF - Defense',
      'AS - Attack Speed',
      'MULT - Multiplier',
      'MAX - Maximum',
      'MIN - Minimum',
      hero.value.mainInfTier >= 10 && 'D - Dimension',
      hero.value.mainInfTier >= 6 && 'S - Singularity',
      hero.value.tr >= 1 && 'Tr - Transcendence',
      hero.value.tr >= 1 && 'BH - Black Hole',
      hero.value.bhTier >= 4 && 'TL - Timeline',
    ]
  },
  {
    title: 'Combat Mechanics',
    class: 'endless-section info style-section',
    content: [
      `Boss - The final enemy in the stage is stronger than the others. You won't be able to complete the stage unless you kill the boss. 
      Stage requirements have been increased for stages containing a boss.`,
      'Boss Spawn - If you kill an enemy, there is a chance that a boss will spawn; if not, the chance increases with each kill. This chance is indicated in red square brackets.' + 
      '',
    ]
  },
  {
    title: 'Level Info',
    class: 'afk-section info style-section',
    content: [
      'Current Level - Level gained by using EXP to level up',
      'Total Level - Current Level + Min Level',
      'True Level - Max Level without any negative effects',
      'Min Level - Level that does not require EXP and ignores any penalties.',
      'Max Level - The Сap which the Current level cannot pass. HARDCAP [700]',
      hero.value.singularityLevels > 0 && 'Singularity Levels - allows you to increase HARDCAP of max level. Level requirements are higher after level 700. Your stats double after level 700.'
    ]
  },
   {
    title: 'DMG Display [Icons]',
    class: 'afk-section info style-section',
    content: [
      'If you are using a DMG display, you need to know about these icons.',
      '💥 - CRIT DMG',
      '🤺 - Dodge',
      '🛡️ - you block the full DMG by DEF',
      '🔰 - Invisible [T2]',
      '🧘 - cannot deal DMG while you are immune',
      '💫 - Hit inflicts Stun',
      buffs.value[10].maxTier >= 4 && '⛨ - blocks one hit completely',
      '🔪 - Curse [Self-Destruction]',
      '🩸 - hit inflicts Bleeding',
    ]
  },
  {
    title: 'AFK',
    class: 'afk-section info style-section',
    content: [
      'All loot earned while AFK is calculated based on average loot.',
      'When you leave the game tab, the game pauses. Therefore, when you leave the tab, the game counts your time away as offline. While the game is paused, AFK is disabled.',
      'In trials like Singularity, AFK does not work for kills.',
      'AFK also carries you through stages based on the difference in your power and that of your opponent. Power is determined by your HP, DMG, and AS MULTs.',
    ]
  },
];

const statTabs = ['Level', 'INF', 'EXP', 'Skill EXP', 'Equipment', 'Curse', 'Ascension', 'Stardust', 'Mutagen', 'Rebirth', 
'Potential', 'Danger', 'Damage', 'HP', 'DEF', 'AS', 'Rush', 'Corrupt.', 'Stage Req.', 'Enemy HP', 'Enemy DMG'];

statTabs.push('Soul') 
statTabs.push('Overkill');
if (hero.value.mainInfTier >= 100)
  statTabs.push('Void')
if (hero.value.bhTier >= 5)
  statTabs.push('S-Shards')
if (hero.value.bhTier >= 4)
statTabs.push('Laws') 

const h = hero.value;
const e = enemy.value;
const p = player.value;
const v = villian.value; 

const statSections = [
  {
    title: 'Level',
    id: 'only level',
    content: [
      { desc: 'Min Level', value: '', color: 'lightgreen',  uppercase: true, req: () => hero.value.minLevel > 0 },
      {
        desc: 'Tree [Base]',
        value: () => nodesHandler(12, ['base']),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => nodesHandler(12, ['inf']),
        color: 'lightgreen',
        req: () => h.infExpansions.tree
      },
      {
        desc: 'Equipment [Set]',
        value: () => eqCpmplect(),
        color: '#66ffcc',
      },
      {
        desc: 'Ascension [Destructive Play]',
        value: () => perksHandler(26),
        color: 'lightblue',
        req: () => hero.value.minLevel > 0 || ascenPerks[26].level,
      },
      {
        desc: 'Ascension [Soulbound Growth]',
        value: () => perksHandler(50),
        color: 'lightblue',
        req: () => getDimSpecialReward(9),
      },
      {
        desc: 'Ascension [Echo of Completion]',
        value: () => perksHandler(54),
        color: 'lightblue',
        req: () => getDimSpecialReward(9),
      },
      {
        desc: 'Ascension [Dimension Level]',
        value: () => perksHandler(68).min,
        color: 'lightblue',
        req: () => getDimSpecialReward(60),
      },
      {
        desc: 'Souls',
        value: () => (h.infExpansions.soul? h.soulPower.base.min: 0),
        color: '#d516d5',
        req: () => h.infExpansions.soul,
      },
      {
        desc: 'Rebirth Pts',
        value: () => ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)),
        color: 'lightgreen',
        req: () => h.level >= 100 || h.mainInfTier > 0,
      },
      {
        desc: 'Rebirth Tier',
        value: () => (hero.value.rebirthTier >= 40? Math.floor(hero.value.rebirthBonusesHandle[5].value): 0),
        color: 'lightgreen',
        req: () => h.infExpansions.rebirth
      },
      {
        desc: 'Abyss-D',
        value: () => abyssHandler(14),
        color: '#d516d5',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Comet Ring',
        value: () => (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel),
        color: '#66ffcc',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Comet Ring [Enhances]',
        value: () => (hero.value.eqUpsMult['spRing'].bonus),
        color: '#66ffcc',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 41? Math.floor(hero.value.spCount / 6): 0),
        color: 'orange',
        req: () => hero.value.spCount >= 41 || hero.value.mainInfTier >= 15,
      },
      {
        desc: 'Astralis',
        value: () => ((spaceShop.value[9].status? Math.floor(hero.value.spsCountMax / 2): 0)),
        color: 'yellow',
        req: () => spaceShop.value[9].status,
      },
      {
        desc: 'Infinity',
        value: () => infBonusesHandler(24, hero),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 13,
      },
      {
        desc: 'Singularity Pts',
        value: () => (h.rebirthPts >= 9e5? h.singularity: 0),
        color: '#a4ffe1',
        req: () => h.rebirthPts >= 9e5,
      },
      {
        desc: 'D5',
        value: () => getDimReward(5).min,
        color: '#d516d5',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D12',
        value: () => getDimReward(12),
        color: '#d516d5',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D41',
        value: () => (getDimSpecialReward(41)? fn(getDimReward(41)): 0),
        color: '#d516d5',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'D53',
        value: () => (getDimSpecialReward(53)? getDimReward(53): 0),
        color: '#d516d5',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'D53 [Corruption]',
        value: () => getDimEffect(53),
        color: 'red',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'Transcendence [Tr]',
        value: () => trHandle().min,
        color: '#04fdff',
        req: () => hero.value.bhTier >= 3,
      },
      {
        desc: 'Dark Creature',
        value: () => e.specialCreatures.ddim4.loot,
        color: 'red',
        req: () => dimensions.value[31].infTier > 0,
      },
      {
        desc: 'Laws',
        value: () => collectLawEffects(10).add,
        color: 'gold',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Void [Trial]',
        value: () => voidEffects(4),
        color: 'red',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total',
        value: () => h.minLevelAdd,
        color: 'gold',
      },
      { desc: 'MIN LEVEL MULT', value: '', color: 'lightgreen',  uppercase: true, req: () => h.minLevelMult > 1 },
      {
        desc: 'D33',
        value: () => getDimReward(33),
        color: '#04fdff',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Quasar Core [Destruction of the continuum]',
        value: () => (h.selectedDivSkills.includes(13)? divineSkills.value[13].values[1]: 0),
        color: '#04fdff',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Total',
        value: () => fn(hero.value.minLevelMult),
        color: 'gold',
        req: () => hero.value.minLevelMult > 1,
      },
      { desc: 'TOTAL [MIN LEVEL]', value: '', color: 'gold',  uppercase: true, req: () => hero.value.minLevel > 0 },
      {
        desc: 'Total',
        value: () => (hero.value.minLevel),
        color: 'gold',
        req: () => hero.value.minLevel > 0,
      },
  
      { desc: 'Max Level', value: '', color: 'lightgreen',  uppercase: true, req: () => true },
      {
        desc: 'Base',
        value: 30,
        color: '',
      },
      {
        desc: 'Tree [Base]',
        value: () => nodesHandler(4, ['base']),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => nodesHandler(4, ['inf']),
        color: 'lightgreen',
        req: () => h.infExpansions.tree
      },
      {
        desc: 'Equipment',
        value: () => fn(getEqMaxLevel()),
        color: '#66ffcc',
      },
      {
        desc: 'Equipment [Enhances]',
        value: () => fn(getEqEnhanceMaxLevel()),
        color: '#66ffcc',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Equipment [Set]',
        value: () => eqCpmplect(),
        color: '#66ffcc',
        req: () => true,
      },
      {
        desc: 'Ascension',
        value: () => (ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Destructive Play]',
        value: () => perksHandler(26) * 2,
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Termination]',
        value: () => perksHandler(56),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Dimension Level]',
        value: () => perksHandler(68).max,
        color: 'lightblue',
        req: () => getDimSpecialReward(60)
      },
      {
        desc: 'Souls',
        value: () => hero.value.soulPower.base.maxLevel,
        color: '#d516d5',
      },
      
      {
        desc: 'Amulets',
        value: () => fn(corrHeartHandler().totalML),
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Radiation',
        value: () => radPerks[12].level,
        color: '#99ff99',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 23? hero.value.sp * 2: 0),
        color: 'orange',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Space [Bosses]',
        value: () => spaceBossesMaxLevel(),
        color: 'orange',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Astralis',
        value: () => spaceShopHandler(1, hero),
        color: 'orange',
        req: () => h.bhTier >= 3
      },
      {
        desc: 'Total',
        value: () => fn(h.maxLevelAdd),
        color: 'gold',
      },
      { desc: 'Max Level MULT', value: '', color: 'lightgreen',  uppercase: true, req: () => hero.value.maxLevelMult > 1 },
      {
        desc: 'Base',
        value: 1,
        color: '',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Ring [Prefix]',
        value: () => fn(hero.value.eqUpsMult['ring'].multLevel),
        color: '#66ffcc',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Ascension [Endless Levels]',
        value: () => fn(perksHandler(31)),
        color: 'lightblue',
        req: () => h.infExpansions.ascensioin
      },
      {
        desc: 'Ascension [Dimension Level]',
        value: () => fn(perksHandler(68).mult),
        color: 'lightblue',
        req: () => getDimSpecialReward(60),
      },
      {
        desc: 'Ascension [Corrupted Amplification]',
        value: () => fn(perksHandler(41)),
        color: 'lightblue',
        req: () => h.maxLevelMult > 1,
      },
      {
        desc: 'Amulets [Prefix]',
        value: () => fn(corrHeartHandler().totalMLM),
        color: 'red',
        req: () => h.maxLevelMult > 1
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(11)),
        color: '#991099',
        req: () => h.maxLevelMult > 1
      },
      {
        desc: 'Rebirth Tier',
        value: () => (hero.value.rebirthTier >= 80? fn(hero.value.rebirthBonusesHandle[9].value): 0),
        color: 'lightgreen',
        req: () => h.infExpansions.rebirth,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(16, hero)),
        color: 'gold',
        req: () => infBonusesHandler(16, hero) > 0,
      },
      {
        desc: 'D5',
        value: () => fn(getDimReward(5).maxLevel),
        color: '#991099',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'Transcendence [Tr]',
        value: () => fn(trHandle().maxLvlMult),
        color: '#04fdff',
        req: () => h.bhTier >= 1,
      },
      {
        desc: 'Dark Creature',
        value: () => (0.01 * e.specialCreatures.ddim3.loot),
        color: 'red',
        req: () => dimensions.value[31].infTier > 0,
      },
      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(7).add),
        color: 'gold',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Tree [Extra Level] [GLOBAL MULT]',
        value: () => fn(nodesHandler(4, ['rad'])),
        color: 'lightgreen',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Total',
        value: () => fn(hero.value.maxLevelMult),
        color: 'gold',
        req: () => hero.value.maxLevelMult > 1,
      },
      { desc: `Dark Energy`, value: '', color: 'gold',  uppercase: true, req: () => dimensions.value[29].infTier > 0},
      {
        desc: 'Total [^]',
        value: () => fn(enemy.value.darkEnergy.deTotal),
        color: 'gold',
        req: () => dimensions.value[29].infTier > 0,
      },
      { desc: `Max Level [Penalty]`, value: '', color: 'red',  uppercase: true, req: () => h.mainInfTier >= 50},
      {
        desc: 'Quasar Core [Stellar Equilibrium]',
        value: () => (hero.value.selectedDivSkills.includes(1)? fn(divineSkills.value[1].values[0]): 1),
        color: 'red',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Quasar Core [Destruction of the continuum]',
        value: () => (hero.value.selectedDivSkills.includes(13)? fn(divineSkills.value[13].values[0]): 1),
        color: 'red',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Corruption Influence',
        value: () => fn(corrInflueceHandle(11)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'D38',
        value: () => fn(getDimEffect(38)),
        color: 'red',
        req: () => h.mainInfTier >= 35,
      },
      { desc: `True Level`, value: '', color: 'lightgreen',  uppercase: true, req: () => true},
      {
        desc: 'Total',
        value: () => fn(h.trueLevel, true),
        color: 'gold',
      },
      { desc: `Infinity Resistance`, value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPenalty > 0 || hero.value.mainInfTier >= 20 },
      {
        desc: 'Ascension [Singularity Seed]',
        value: () => perksHandler(42),
        color: 'lightblue',
        req: () => h.singularity > 5,
      },
      {
        desc: 'Ascension [Dimensional Toll]',
        value: () => fn(perksHandler(47)),
        color: 'lightblue',
        req: () => getDimSpecialReward(9),
      },
      {
        desc: 'Singularity Pts',
        value: () => (hero.value.rebirthPts >= 2.5e6? fn(Math.sqrt(Math.log(hero.value.rebirthPts)) * 0.015): 0),
        color: '#a4ffe1',
        req: () => h.rebirthPts >= 2.5e6,
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(17)),
        color: '#a4ffe1',
        req: () => h.mainInfTier > 0,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(36, hero)),
        color: 'gold',
        req: () => h.mainInfTier >= 180,
      },
      
      {
        desc: 'D5',
        value: () => fn(d5RewardHandler(2, hero)),
        color: '#db16db',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D13',
        value: () => fn(getDimReward(13)),
        color: '#db16db',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D27',
        value: () => fn(getDimReward(27)),
        color: '#db16db',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Dimension Creature',
        value: () => fn(e.specialCreatures.dim6.loot * 0.01),
        color: 'rgb(9, 253, 233)',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Dark Creature',
        value: () => fn((0.0075 * enemy.value.specialCreatures.ddim1.loot)),
        color: 'red',
        req: () => dimensions.value[31].infTier > 0,
      },
      {
        desc: 'Quasar Core [Event Horizon]',
        value: () => (hero.value.selectedDivSkills.includes(2)? fn(divineSkills.value[2].values[0]): 0),
        color: '#00fdff',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Quasar Core [Singularity Destruction]',
        value: () => (hero.value.selectedDivSkills.includes(8)? fn(divineSkills.value[8].values[0]): 0),
        color: '#00fdff',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(14)),
        color: 'cyan',
        req: () => h.bhTier >= 5,
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.inf_res_1),
        color: 'lightgreen',
        req: () => h.mainInfTier >= 100,
      },
      { desc: `Total`, value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPenalty > 0 || hero.value.mainInfTier >= 20 },
      {
        desc: 'Total',
        value: () => fn(hero.value.infPenalty),
        color: 'gold',
        req: () => hero.value.infPenalty > 0 || h.mainInfTier >= 20,
      },
      { desc: `Singularity Levels`, value: '', color: '#a4ffe1',  uppercase: true, req: () => hero.value.singularityLevels > 0 },
      {
        desc: 'Singularity',
        value: () => fn(25 * h.singularity),
        color: '#a4ffe1',
        req: () => h.singularity > 0,
      },
      {
        desc: 'Singularity Pts',
        value: () => Math.floor((h.rebirthPts >= 4.5e5? fn(Math.log(hero.value.rebirthPts + 3) ** 1.906): 0)),
        color: '#a4ffe1',
        req: () => h.rebirthPts >= 4.5e5
      },
      {
        desc: 'Black Hole',
        value: () => fn(75 * hero.value.bhTier),
        color: '#a4ffe1',
        req: () => hero.value.bhTier > 0
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(4)),
        color: '#a4ffe1',
        req: () => h.bhTier >= 5
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.sing_levels_1),
        color: '#a4ffe1',
        req: () => h.mainInfTier >= 100
      },

      { desc: `Total`, value: '', color: 'gold',  uppercase: true, req: () => h.singularityLevels > 0 },
      {
        desc: 'Total',
        value: () => fn(h.singularityLevels),
        color: 'gold',
        req: () => h.singularityLevels > 0,
      },
    ],
  },
  {
    title: 'INF',
    id: 'only ip',
    content: [
      { desc: 'IP', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Infinity Goals',
        value: () => (hero.value.infPointsGoals),
        color: 'gold',
        req: () => hero.value.infPointsGoals > 0,
      },
      {
        desc: 'Mirror of the Infinity',
        value: () => e.specialCreatures.inf2.loot,
        color: 'gold',
        req: () => h.infExpansions.radiation
      },
      {
        desc: 'Space Ring [Prefix]',
        value: () => fn(h.eqUpsMult['spRing'].infPoints),
        color: 'gold',
        req: () => spaceShop.value[10].status,
      },
      {
        desc: 'Total',
        value: () => fn(h.infPointsAdd),
        color: 'gold',
        req: () => true,
      },
      { desc: 'IP MULT', value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPointsMult > 1 },
      {
        desc: 'Base',
        value: 1,
        color: '',
        req: () => h.infPointsMult > 1,
      },
      {
        desc: 'Singularity [Trials]',
        value: () => fn((0.05 * h.singularity)),
        color: '#66ffcc',
        req: () => h.singularity > 0,
      },
      {
        desc: 'Singularity Pts',
        value: () => fn((h.rebirthPts >= 5e6? Math.log(h.rebirthPts) * 0.015: 0)),
        color: '#a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(15)),
        color: '#a4ffe1',
        req: () => h.infPointsMult > 1,
      },
      {
        desc: 'Dimension creature',
        value: () => fn((e.specialCreatures.dim5.loot * 0.01)),
        color: '#b51fb5',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Ascension [Infinite Push]',
        value: () => fn(perksHandler(60)),
        color: 'lightblue',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'D22',
        value: () => fn((getDimSpecialReward(22)? h.mainInfTier * 0.01: 0)),
        color: '#f84bf9',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Quasar Core [Dark Power]',
        value: () => fn((h.dId.startsWith('d-') && h.selectedDivSkills.includes(9) && hero.value.corruption.total >= 10? divineSkills.value[9].values[0]: 0)),
        color: '#00fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Black Hole',
        value: () => fn((0.05 * h.bhTier)),
        color: '#00fdff',
        req: () => h.bhTier > 0,
      },
      {
        desc: 'Transcendence [Tr]',
        value: () => fn(trHandle().ip),
        color: '#00fdff',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(13).add),
        color: '#00fdff',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Void [Reaching the Limit]',
        value: () => fn(h.voidTreeStats.inf_ip_mult),
        color: '#00fdff',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Void [Integration]',
        value: () => fn(h.voidTreeStats.qua_unnused),
        color: '#00fdff',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total',
        value: () => fn(h.infPointsMult),
        color: 'gold',
        req: () => h.infPointsMult > 1,
      },
      {
        desc: 'Total',
        value: () => fn(h.infPointsMult),
        color: 'gold',
        req: () => h.infPointsMult > 1,
      },
      { desc: 'IP Penalty', value: '', color: 'red',  uppercase: true, req: () => hero.value.mainInfTier >= 50 },
      {
        desc: 'Quasar Core [Event Horizon] [Penalty]',
        value: () => fn((h.selectedDivSkills.includes(2)? divineSkills.value[2].values[1]: 1)),
        color: 'red',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Corruption Influence [Penalty]',
        value: () => fn(corrInflueceHandle(4)),
        color: 'red',
        req: () => hero.value.mainInfTier >= 60,
      },
      { desc: 'IP TOTAL', value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPoints > 0 },
      {
        desc: 'Total',
        value: () => fn(h.infPoints),
        color: 'gold',
        req: () => h.infPoints > 0
      },
      { desc: 'Quasar Power', value: '', color: 'cyan',  uppercase: true, req: () => h.mainInfTier >= 50 },
      {
        desc: 'Main Dimension',
        value: () => fn(Math.min(h.mainInfTier - 50, 50)),
        color: 'gold',
        req: () => h.mainInfTier >= 50,
      },
      { desc: 'Other Sources', value: '', color: 'cyan',  uppercase: true, req: () => h.mainInfTier >= 50 },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(31, hero)),
        color: 'gold',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Laws',
        value: () => fn((1 + 0.01 * (collectLawEffects(14).mult - 1))),
        color: 'gold',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Abyss',
        value: () => fn(corrInflueceHandle(9)),
        color: 'purple',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(16, hero)),
        color: 'orange',
        req: () => h.bhTier >= 3,
      },
      {
        desc: 'Dark Creature',
        value: () => fn((1 + 0.01 * e.specialCreatures.ddim9.loot)),
        color: 'red',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Void [Absorption]',
        value: () => fn(hero.value.voidTreeStats.qua_eff_1),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total',
        value: () => fn(h.quasar.power),
        color: 'gold',
        req: () => h.mainInfTier >= 50,
      },
      { desc: 'TOTAL QUASAR POWER', value: '', color: 'cyan',  uppercase: true, req: () => h.mainInfTier >= 50 },
      {
        desc: 'Total',
        value: () => fn(h.quasar.power * Math.min(h.mainInfTier - 50, 50)),
        color: 'gold',
        req: () => h.mainInfTier >= 50,
      },
    ],
  },
  {
    title: 'EXP',
    id: 'only exp',
    content: [
      { desc: 'EXP', value: '', color: 'purple',  uppercase: true, req: () => true },
      {
        desc: 'Stage EXP',
        value: () => fn(Math.log(h.stages.current + 5) ** 4),
        color: '',
        req: () => true,
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(3, ['base'])),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Tree [Inf]',
        value: () => fn(nodesHandler(3, ['inf'])),
        color: 'lightgreen',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Ring',
        value: () => fn(getEqBase('ring')),
        color: '#66ffcc',
        req: () => true,
      },
      {
        desc: 'Ring [Enhances]',
        value: () => fn(getEqUps('ring')),
        color: '#66ffcc',
        req: () => true,
      },
      {
        desc: 'Ascension [Blacksmithing Experience]',
        value: () => fn(perksHandler(6)),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Ascension [Dimension Loot]',
        value: () => fn(perksHandler(66)),
        color: 'lightblue',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Skill [Traveller] [T3]',
        value: () => fn(p.status.traveler.exp),
        color: 'orange',
        req: () => true,
      },
      {
        desc: 'Skill [Conquer] [T4]',
        value: () => fn(p.status.conquer.loot),
        color: 'orange',
        req: () => h.singularity > 1,
      },
      {
        desc: 'Souls [Loot]',
        value: () => v.spawnType == 'soul'? fn(e.soulBuff.drop * h.soulOverkill): 1,
        color: '#ed14ed',
        req: () => true,
      },
      {
        desc: 'Souls [Base]',
        value: () => fn(h.soulPower.base.exp),
        color: '#ed14ed',
        req: () => true,
      },
      {
        desc: 'Skill [Overkill] [T4]',
        value: () => fn(killsLootHandle()),
        color: 'orange',
        req: () => h.singularity > 0,
      },
      {
        desc: 'Curse [Essence]',
        value: () => fn(1 + h.cursedBonusExp),
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Boss [Loot]',
        value: () => v.spawnType == 'boss'? fn(e.boss.drop): 1,
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Space',
        value: () => fn((h.spCount >= 9? Math.min(1.025 * h.sp, 5): 1)),
        color: 'orange',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Ascension [Loot]',
        value: () => fn(perksHandler(34)),
        color: 'lightblue',
        req: () => h.infExpansions.ascensioin,
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => fn(e.rebirthEnemy["drop"]),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Formation [T4]',
        value: () => fn(p.formationStats.loot),
        color: '#82eb26',
        req: () => true,
      },
      {
        desc: 'D5',
        value: () => fn(getDimReward(5).exp),
        color: '#ed14ed',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D19',
        value: () => (getDimSpecialReward(19)? fn(1.5 ** p.overkill.loot): 1),
        color: '#ed14ed',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D38',
        value: () => fn((h.dId == 'unlimitted'? getDimReward(38).expMult: 1)),
        color: '#ed14ed',
        req: () => h.dId == 'unlimitted',
      },
      {
        desc: 'D59 [Penalty]',
        value: () => fn(getDimEffect(59)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'D5 [EXP Bonus]',
        value: () => (h.dId == 'unlimitted'? getDimReward(5).infExp: 1),
        color: '#ed14ed',
        req: () => h.dId == 'unlimitted',
      },
      {
        desc: `Infinity`,
        value: () => fn(infBonusesHandler(3, hero)),
        color: 'gold',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Curse [T5]',
        value: () => h.cursesChances[3].status? 2: 1,
        color: ' #a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'Singularity Pts',
        value: () => (h.rebirthPts >= 3.5e5 && h.eLevel > 700? fn(Math.sqrt(Math.log(h.rebirthPts + 3))/2): 1),
        color: ' #a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'Quasar Core [Stellar Equilibrium]',
        value: () => (h.selectedDivSkills.includes(1)? fn(divineSkills.value[1].values[1]): 1),
        color: '#04fdff',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Quasar Core [Quasar Radiance]',
        value: () => (h.selectedDivSkills.includes(7)? fn(divineSkills.value[7].values[1]): 1),
        color: '#04fdff',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Crit [Milestone]',
        value: () => fn(p.status.critMls.loot),
        color: '#04fdff',
        req: () => h.mainInfTier >= 80,
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.exp_1),
        color: '#04fdff',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Singularity Shards [^]',
        value: () => fn(singShardsEffect(6)),
        color: '#04fdff',
        req: () => h.bhTier >= 5,
      },
      {
        desc: 'Corruption Influence [Penalty]',
        value: () => fn(corrInflueceHandle(13)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Total',
        value: () => fn(h.totalExp),
        color: 'gold',
      },
      { desc: `Infinity [Penalty]`, value: '', color: 'gold',  uppercase: true, req: () => h.infUnlocked},
      {
        desc: `Penalty [^]`,
        value: () => fn(h.infPower),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'Total',
        value: () => fn(h.totalExp ** h.infPower),
        color: 'gold',
        req: () => h.infUnlocked
      },
    ],
  },
  {
    title: 'Equipment',
    content: [
      { desc: 'Equipment Drop Chance', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(15, ["base"])),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(15, ["inf"])),
        color: 'lightgreen',
        req: () => h.infUnlocked
      },
      {
        desc: 'Skll [Overkill] [T4]',
        value: () => fn(killsLootHandle()),
        color: 'orange',
        req: () => h.singularity > 0
      },
      {
        desc: 'Skill [Traveler] [T1]',
        value: () => fn(p.status.traveler.eq),
        color: 'orange',
      },
      {
        desc: 'Skill [Conquer] [T4]',
        value: () => fn(p.status.conquer.loot),
        color: 'orange',
        req: () => h.singularity > 1
      },
      {
        desc: 'Souls [Tier]',
        value: () => fn((1 + 0.75 * h.soulTier)),
        color: '#ed14ed',
      },
      {
        desc: 'Souls [Loot]',
        value: () => v.spawnType == 'soul'? fn(e.soulBuff.drop * h.soulOverkill): 1,
        color: '#ed14ed',
        req: () => true,
      },
      {
        desc: 'Boss [Loot]',
        value: () => v.spawnType == 'boss'? fn(e.boss.drop): 1,
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Ascension [Loot]',
        value: () => fn(perksHandler(34)),
        color: 'lightblue',
        req: () => h.infExpansions.ascensioin
      },
      {
        desc: 'Ascension [Armed Invasion]',
        value: () => fn(perksHandler(55)),
        color: 'lightblue',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => fn(e.rebirthEnemy["drop"]),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => fn((h.rebirthTier >= 50 ? h.rebirthBonusesHandle[7].value: 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Formation [Loot]',
        value: () => fn(p.formationStats.loot),
        color: '#61fccc',
      },
      {
        desc: 'Space',
        value: () => fn((h.spCount >= 10 ? 1 + 0.1 * h.sp : 1)),
        color: 'orange',
      },
      
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(4, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'Curse [T5]',
        value: () => fn(h.cursesChances[3].status ? 2 : 1),
        color: ' #a4ffe1',
      },
      {
        desc: 'D36',
        value: () => fn(getDimReward(36).eq),
        color: 'purple',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'D48',
        value: () => fn((getDimSpecialReward(48)? getDimReward(48): 1)),
        color: 'purple',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Crit [Milestone]',
        value: () => fn(p.status.critMls.loot),
        color: 'orange',
        req: () => h.mainInfTier >= 80,
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(p.status.critMls.loot),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Quasar Core [Quasar Radiance] [Penalty]',
        value: () => fn((h.selectedDivSkills.includes(7) ? divineSkills.value[7].values[1] : 1)),
        color: 'red',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Curse [Withering Spoils] [Penalty] [^]',
        value: () => fn(cursed[17].loot),
        color: 'red',
        req: () => h.mainInfTier >= 80,
      },
      {
        desc: 'Corruption Influence',
        value: () => fn(corrInflueceHandle(12)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(voidEffects(1)),
        color: 'red',
        req: () => h.dId == 'dimMerge',
      },
      {
        desc: 'Total',
        value: () => fn(h.eqTotalDrop),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Ascension',
    content: [
      { desc: 'Ascension Shards', value: '', color: 'lightblue',  uppercase: true, },
      {
        desc: `Base [Stage ${h.stages.current}]`,
        value: () => fn(Math.sqrt(Math.log(Math.min(h.stages.current + 2, 300)) ** (Math.min(h.stages.current, 300)/7)) * Math.min(1 + h.maxLevel / 100, 7)),
        color: '',
      },
      {
        desc: 'Skill: Traveller [T3]',
        value: () => fn(p.status.traveler.ascension),
        color: 'orange',
      },
      {
        desc: 'Boss [Loot]',
        value: () => fn((v.spawnType == 'boss'? Math.min(Math.max(e.boss.drop ** 0.75, 1), 10): 1)),
        color: 'red',
        req: () => v.spawnType == 'boss'
      },
      {
        desc: 'Ascension [Astral Harvest]',
        value: () => fn(perksHandler(29)),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => fn(perksHandler(34)),
        color: 'lightblue',
        req: () => h.infExpansions.ascensioin
      },
      {
        desc: 'Ascension [Spatial Ascendance]',
        value: () => fn(perksHandler(53)),
        color: 'lightblue',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'Formation [Loot]',
        value: () => fn(p.formationStats.loot),
        color: 'lightblue',
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.ascen_shards_1),
        color: 'lightblue',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(7, hero)),
        color: '#66ffcc',
        req: () => hero.value.mainInfTier >= 3,
      },
      {
        desc: 'D1',
        value: () => fn((getDimSpecialReward(1)? 1.01 ** infPerksLevels(): 1)),
        color: 'purple',
        req: () => hero.value.mainInfTier >= 10,
      },
      {
        desc: 'D34',
        value: () => fn(getDimReward(34)),
        color: 'purple',
        req: () => hero.value.mainInfTier >= 35,
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(14, hero)),
        color: '#66ffcc',
        req: () => h.bhTier >= 3,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(h.shardsMult),
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
        value: () => fn((h.soulTier < 4? 1.5 ** h.soulTier: 1.5 ** 3)),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => fn((h.rebirthPts >= 2? 2: 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () =>  fn((h.rebirthPts >= 2500? e.rebirthEnemy["drop"]: 1)),
        color: 'lightgreen',
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(h.shardsPerformMult),
        color: 'gold',
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(h.ascendShardPerform),
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
        value: () => fn(h.baseRebirthPts),
        color: '',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => fn((h.rebirthPts >= 5 ? e.rebirthEnemy["drop"] : 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Abyss [Tier]',
        value: () => fn(1.3 ** h.abyssTier),
        color: '#ed84ed',
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(14, ['base'])),
        color: '#66ffcc',
      },
      {
        desc: 'Tree [Inf]',
        value: () => fn(nodesHandler(14, ['inf'])),
        color: '#66ffcc',
      },
      {
        desc: 'Soul [Tier]',
        value: () => fn(h.soulTier >= 4 ? 1.5 : 1),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => fn((h.rebirthPts >= 1250? Math.min((1 + 0.01 * h.rebirthTier) ** 8, 2) * (1 + 0.01 * Math.max(h.rebirthTier - 9, 0)) ** 2: 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => fn(perksHandler(34)),
        color: 'lightblue',
        req: () => h.infExpansions.ascensioin
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(8, hero)),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => fn(h.totalPtsMult),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Skill EXP',
    id: 'only buff exp buffexp',
    content: [
      { desc: 'Skill EXP', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base [Essence]',
        value: () => fn(h.cursedBonusExp),
        color: '',
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(16, ["base"])),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Inf]',
        value: () => fn(nodesHandler(16, ["inf"])),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Dimension Loot]',
        value: () => fn(perksHandler(66)),
        color: '#db16db',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Soul [Tier]',
        value: () => fn(1.5 ** Math.min(h.soulTier, 3)),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (h.rebirthPts >= 10? 2: 1),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => fn((h.rebirthPts >= 5e4 ? e.rebirthEnemy.drop : 1) ),
        color: 'lightgreen',
      },
      {
        desc: 'Space',
        value: () => fn((h.spCount > 28? 1.25 ** h.spbCount: 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Formation [T4]',
        value: () => p.formationStats.loot,
        color: '#11fffc',
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(9, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'D11',
        value: () => fn(getDimReward(11)),
        color: '#db16db',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D32',
        value: () => fn(getDimReward(32).t),
        color: '#db16db',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.skill_exp_1),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100,
      },
      
      {
        desc: 'D13 [Penalty]',
        value: () => (h.dId == 'hard'? 0: 1),
        color: 'red',
        req: () => h.dId == 'hard'
      },
      {
        desc: 'Quasar Core [Quasar Radiance] [Penalty]',
        value: () => fn((h.selectedDivSkills.includes(7) ? divineSkills.value[7].values[1] : 1)),
        color: 'red',
        req: () => hero.value.dId == 'hard'
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(voidEffects(8)),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total',
        value: () => fn(h.cursedBonus),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Curse',
    id: 'only curse',
    content: [
      { desc: 'Essence', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Essence [∑]',
        value: () => {
          let bonus = 0;
          for(let id of h.activeCurse)
            bonus += cursed[id].tier[h.activeCurseTier[id]].bonus * (h.singularity >= 2? 2: 1);
          return fn(bonus)
        },
        color: 'red',
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(5)),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => (h.rebirthTier >= 60 ? fn(h.rebirthBonusesHandle[7].value) : 1) ,
        color: 'lightgreen',
        req: () => h.infExpansions.rebirth
      },
      
      {
        desc: 'D13 [Penalty]',
        value: () => (h.dId == 'hard'? 0: 1),
        color: 'red',
      },
      {
        desc: 'Quasar Core [Quasar Shackles]',
        value: () => (h.selectedDivSkills.includes(0) ? fn(divineSkills.value[0].values[1]) : 1),
        color: '#37dbd9',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Quasar Core [Fluctuation Failures]',
        value: () => (h.selectedDivSkills.includes(10) ? fn(divineSkills.value[10].values[1]) : 1),
        color: '#37dbd9',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Enemy [Skill] [Traveller] [Penalty]',
        value: () => fn(e.buffs.includes(3)? 3: 1),
        color: 'red',
        req: () => h.dId == 'd-noBuffs'
      },
      {
        desc: 'Extra MULT [^]',
        value: () => {
          const divineCurse = h.cursesChances[3].status ? 0.2 + (h.rebirthPts >= 7.5e5 ? 0.1 : 0): 0;

          return fn(divineCurse + (1 + 0.1 * h.mutations) + 0.05 * Math.max(h.activeCurse.length - 1, 0));
        },
        color: 'red',
      },
      { desc: 'Total', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(h.cursedBonusExp),
        color: 'gold',
      },
      { desc: 'Abyss [Penalty]', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Base',
        value: () => 0.25,
        color: '#ed14ed',
      },
      {
        desc: 'Ascension [Void Purge]',
        value: () => fn(perksHandler(46)),
        color: 'lightblue',
      },
      {
        desc: '[Total] [^]',
        value: () => fn(0.25 + perksHandler(46)),
        color: 'gold',
      },
      { desc: 'Resonace', value: '', color: 'red',  uppercase: true, req: () => h.singularity > 1, },
      {
        desc: 'Abyss',
        value: () => fn(abyssHandler(13)),
        color: '#ed14ed',
        req: () => h.singularity > 1,
      },
      {
        desc: 'Singularity',
        value: () => fn((h.singularity >= 2? 1 - 0.02 * h.singularity: 1)),
        color: 'cyan',
        req: () => h.singularity > 1,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(23, hero)),
        color: 'gold',
        req: () => h.singularity > 1,
      },
      {
        desc: 'Infinity [Perdition]',
        value: () => h.infProgress? fn(infPenalties().curseMult): 1,
        color: 'gold',
        req: () => h.mainInfTier >= 30,
      },
      {
        desc: 'D4',
        value: () => (getDimSpecialReward(4)? fn(1 - Math.min(0.01 * dimensions.value.filter(dim => dim.infTier >= dim.spInfTier).length, 0.9)): 1),
        color: 'purple',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D27 [Trial]',
        value: () => fn(getDimEffect(27)),
        color: 'red',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'D61 [Trial]',
        value: () => fn(getDimEffect(61)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Quasar Core [Quasar Shackles]',
        value: () => (h.selectedDivSkills.includes(0) ? fn(divineSkills.value[0].values[0]) : 1),
        color: '#37dbd9',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Quasar Core [Fluctuation Failures]',
        value: () => (h.selectedDivSkills.includes(10) ? fn(divineSkills.value[10].values[0]) : 1),
        color: '#37dbd9',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(13, hero)),
        color: 'gold',
        req: () => h.bhTier >= 3,
      },
      {
        desc: 'Timeline [Trial]',
        value: () => fn(timelineEffects().resonance),
        color: 'red',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(spaceShopHandler(13, hero)),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total',
        value: () => fn(h.curseMult),
        color: 'gold',
        req: () => h.singularity > 1,
      },
    ],
  },
  {
    title: 'Stardust',
    id: 'only stardust',
    content: [
      { desc: 'Stardust', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base [Stage]',
        value: () => fn((1.0525 ** (h.stages.current - h.stardustStage))),
        color: '',
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(17, ['base'])),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Inf]',
        value: () => fn(nodesHandler(17, ['inf'])),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Loot]',
        value: () => fn(perksHandler(34)),
        color: 'lightblue',
      },
      {
        desc: 'Ascension [Dimension Loot]',
        value: () => fn(perksHandler(66)),
        color: 'lightblue',
      },
      {
        desc: 'Infinity Expansion',
        value: () => (h.infExpansions.space? 2: 1),
        color: 'gold',
        req: () => h.infExpansions.space
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(4)),
        color: '#ed14ed',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Soul [Base]',
        value: () => fn(h.soulPower.base.stardust),
        color: '#ed14ed',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Formation [Loot]',
        value: () => (hero.value.spCount >= 45? p.formationStats.loot: 1),
        color: 'gold',
      },
      {
        desc: 'Curse [T5]',
        value: () => (h.cursesChances[3].status? 2: 1),
        color: '#a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(19, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'Skill [Traveller] [T4]',
        value: () => fn(p.status.traveler.stardust),
        color: 'orange',
        req: () => dimensions.value[32].infTier >= 8
      },
      {
        desc: 'Skill [Conquer] [T4]',
        value: () => fn(p.status.conquer.loot),
        color: 'orange',
        req: () => h.singularity >= 1,
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(0, hero)),
        color: 'gold',
        req: () => spaceShop.value[0].status
      },
      {
        desc: 'Dark Creature',
        value: () => fn((1 + 0.05 * e.specialCreatures.ddim5.loot)),
        color: 'red',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'Quasar Core [Quasar Radiance]',
        value: () => fn((h.selectedDivSkills.includes(7)? divineSkills.value[7].values[0]: 1)),
        color: 'cyan',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'D37',
        value: () => fn(getDimReward(37).stardust),
        color: 'purple',
        req: () => dimensions.value[37].infTier > 0
      },
      {
        desc: 'CRIT [Milestone]',
        value: () => fn(player.value.status.critMls.loot),
        color: 'orange',
        req: () => h.mainInfTier >= 80,
      },
      {
        desc: 'Void [Stardust]',
        value: () => fn(h.voidTreeStats.stardust_1),
        color: 'red',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Infinity [Perdition]',
        value: () => h.infProgress? fn(infPenalties().stardust): 1,
        color: 'red',
        req: () => h.mainInfTier >= 20
      },
      {
        desc: 'Enemy [Skill] [Traveller] [Penalty]',
        value: () => fn(h.stardustPenalty.d32),
        color: 'red',
        req: () => h.dId == 'd-noBuffs',
      },
      {
        desc: 'Black Hole [T5] [^]',
        value: () => fn(dGravityHandler(3, hero).v),
        color: 'red',
        req: () => h.bhTier >= 5,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(h.stardustInfo),
        color: 'gold',
      },
    ],
  },
  {
    title: 'Mutagen',
    id: 'only mutagen',
    content: [
      { desc: 'Mutagen', value: '', color: 'orange',  uppercase: true, req: () => true },
      {
        desc: 'Mutations',
        value: () => (h.mutations),
        color: '#66ff66',
        req: () => true
      },
      {
        desc: 'Base',
        value: () => fn(hero.value.mutations ** 2.5),
        color: '#66ff66',
        req: () => true
      },
      {
        desc: 'Radiation [Mutation Vortex]',
        value: () => fn((1.025 ** radPerks[4].level)),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Ascension [Loot]',
        value: () => fn(perksHandler(34)),
        color: '#66ffcc',
        req: () => true
      },
      {
        desc: 'Soul [Base]',
        value: () => fn(h.soulPower.base.mutagen),
        color: '#66ffcc',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Curse [T5]',
        value: () => (h.cursesChances[3].status? 2: 1),
        color: '#a4ffe1',
        req: () => hero.value.singularity >= 8
      },
      {
        desc: 'Ascension [Dimension Loot]',
        value: () => fn(perksHandler(66)),
        color: '#66ffcc',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'Skill [Traveler] [T4]',
        value: () => fn(p.status.traveler.mut),
        color: 'orange',
        req: () => dimensions.value[32].infTier >= 8
      },
      {
        desc: 'Skill [Conquer] [T4]',
        value: () => fn(p.status.conquer.loot),
        color: 'orange',
        req: () => h.singularity >= 1,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(25, hero) ),
        color: 'gold',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Quasar Core [Quasar Radiance]',
        value: () => fn((h.selectedDivSkills.includes(7)? divineSkills.value[7].values[1]: 1)),
        color: 'cyan',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'CRIT [Milestone]',
        value: () => fn(player.value.status.critMls.loot),
        color: 'orange',
        req: () => h.mainInfTier >= 80,
      },
      
      {
        desc: 'Infinity [Perdition]',
        value: () => hero.value.infProgress? fn(infPenalties().mutagen): 1,
        color: 'red',
        req: () => h.mainInfTier >= 20,
      },
      {
        desc: 'Enemy [Skill] [Traveler] [Penalty]',
        value: () => fn(v.skills.traveler.loot),
        color: 'red',
        req: () => h.dId == 'd-noBuffs',
      },
      {
        desc: 'Curse [Withering Spoils] [^]',
        value: () => fn(v.skills.traveler.loot),
        color: 'red',
        req: () => h.mainInfTier >= 70,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => fn(h.currentMutagen),
        color: 'gold',
        req: () => true
      },
    ],
  },
  {
    title: 'Potential',
    id: 'only potential',
    content: [
      { desc: 'Potential', value: '', color: 'yellow',  uppercase: true, req: () => true },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(18, ['base'])),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(18, ['inf'])),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (h.rebirthPts >= 3? 10: 0) + (h.rebirthPts >= 75? 10: 0) + (h.rebirthPts >= 250? 10: 0) + 
        (h.rebirthPts >= 5000? 10: 0) + (h.rebirthPts >= 17500? 10: 0) + (h.rebirthPts >= 60000? 10: 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Radiation',
        value: () => radPerks[6].level,
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => (h.rebirthTier >= 30 ? fn(hero.value.rebirthBonusesHandle[4].value) : 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Infinity Creature',
        value: () => fn(enemy.value.specialCreatures.inf1.loot),
        color: 'yellow',
        req: () => h.infExpansions.radiation
      },
      
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(20, hero)),
        color: 'gold',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'D10',
        value: () => fn(getDimReward(10)),
        color: '#6a0dad',
        req: () => dimensions.value[10].infTier > 0,
      },
      {
        desc: 'Singularity Pts',
        value: () => (h.rebirthPts >= 5e5? 30: 0),
        color: '#a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'Dark Creature',
        value: () => e.specialCreatures.inf1.loot,
        color: 'red',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Space Ring [Suffix]',
        value: () => fn(h.eqUpsMult['spRing'].potential),
        color: ' #a4ffe1',
        req: () => spaceShop.value[11].status,
      },
      {
        desc: 'Dark Creature',
        value: () => fn(e.specialCreatures.ddim7.loot),
        color: 'red',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Total',
        value: () => fn(h.potential),
        color: 'gold',
        req: () => true
      },
    ],
  },
  {
    title: 'Danger',
    id: 'only danger',
    content: [
      { desc: 'MAX Danger', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Base',
        value: 100,
        color: '',
        req: () => true
      },
      {
        desc: 'Infinity Expansion',
        value: 100,
        color: 'gold',
        req: () => h.infExpansions.radiation,
      },
      {
        desc: 'Ascension [Void Hazard]',
        value: () => perksHandler(40),
        color: 'lightblue',
        req: () => h.singularity > 0,
      },
      {
        desc: 'Ascension [Void Hazard [T2]]',
        value: () => hero.value.dangerStage * 2,
        color: 'lightblue',
        req: () => getDimSpecialReward(9)
      },
      {
        desc: 'Infinity',
        value: () =>  fn(infBonusesHandler(18, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'Singularity Pts',
        value: () =>  Math.floor(hero.value.rebirthPts >= 2e6? Math.log(hero.value.rebirthPts) ** 2: 0),
        color: '#a4ffe1',
        req: () => hero.value.rebirthPts >= 2e6,
      },
      
       {
        desc: 'D15',
        value: () => fn(getDimReward(15)),
        color: '#6a0dad',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 38? hero.value.sp: 0),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Quasar Core [Doomflare]',
        value: () => (h.selectedDivSkills.includes(12)? fn(Math.floor(divineSkills.value[12].values[0])): 0),
        color: 'orange',
        req: () => h.mainInfTier >= 50,
      },
      {
        desc: 'Laws',
        value: () => collectLawEffects(8).add,
        color: 'gold',
        req: () => h.bhTier >= 4
      },
      {
        desc: 'D57',
        value: () => (getDimSpecialReward(57)? fn(getDimReward(57)): 0),
        color: 'purple',
        req: () => h.mainInfTier >= 60,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true},
      {
        desc: 'Total',
        value: () => fn(radPerks[10].max),
        color: 'gold',
        req: () => true
      },
      { desc: 'Danger Power', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: () => h.baseDangerPower.toFixed(3),
        color: '',
      },
      {
        desc: 'Danger',
        value: () => fn(h.baseDangerPower ** radPerks[10].level),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Mutagen Damping] [^]',
        value: () => fn(perksHandler(65)),
        color: 'lightblue',
        req: () => dimensions.value[34].infTier >= 9
      },
      {
        desc: 'Abyss D [^]',
        value: () => fn(abyssHandler(8)),
        color: 'purple',
        req: () => h.mainInfTier > 0
      },
      {
        desc: 'D31 [^]',
        value: () => fn(getDimReward(31).p),
        color: 'purple',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'Quasar Core [Doomflare] [^]',
        value: () => (hero.value.selectedDivSkills.includes(12)? fn(divineSkills.value[12].values[1]): 1),
        color: '#66ffcc',
        req: () => hero.value.mainInfTier >= 50
      }, 
      {
        desc: 'Quasar Core [Anti-Radiation] [^]',
        value: () => fn(divineSkills.value[14].values[0]),
        color: '#66ffcc',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Law [^]',
        value: () => fn(collectLawEffects(11).mult),
        color: 'gold',
        req: () => h.bhTier >= 4
      },
      {
        desc: 'Astralis [/]',
        value: () => fn(spaceShopHandler(6, hero)),
        color: 'gold',
        req: () => spaceShop.value[6].status
      },
      {
        desc: 'Radiation [Gamma-ray Annihilation] [/]',
        value: () => (getDimSpecialReward(62)? fn(getRadPerk(13)): 1),
        color: 'gold',
        req: () => h.mainInfTier >= 60,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true},
      {
        desc: 'Total',
        value: () => fn(e.enemyPower),
        color: 'gold',
        req: () => true
      },
    ],
  },
  {
    title: 'Damage',
    id: 'only damage',
    content: [
     { desc: 'Damage', value: '', color: 'red',  uppercase: true, },
     {
        desc: 'Base',
        value: 10,
        color: '',
      },
      {
        desc: 'Level',
        value: () => fn(hero.value.levelFactor.atk),
        color: 'lightgreen',
      },
      { desc: 'Damage MULT', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(0, ["inf"])),
        color: '#66ff66',
        req: () => h.infExpansions.tree
      },
      {
        desc: 'Tree [Radiation]',
        value: () => fn(nodesHandler(0, ["rad"])),
        color: '#66ff66',
        req: () => h.infExpansions.tree || h.spCount >= 5,
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(0, ["base"])),
        color: '#66ff66',
      },
      { 
        desc: 'Sword',
        value: () => fn(getEqBase('sword')),
        color: '#22cccc',
      },
      {
        desc: 'Sword [Enhances]',
        value: () => fn(getEqUps('sword')),
        color: '#22cccc',
        req: () => h.mainInfTier >= 1 || h.spCount > 0
      },

      {
        desc: 'Ascension [Fractal Echoes]',
        value: () => fn(perksHandler(48)),
        color: 'lightblue',
        req: () => getDimSpecialReward(9)
      },
      {
        desc: 'Ascension [Dimension Attack]',
        value: () => fn(perksHandler(67)),
        color: 'lightblue',
        req: () => getDimSpecialReward(60)
      },

      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(0, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },

     
      

      
      {
        desc: 'Skill: First Strike [T1]',
        value: () =>  (p.buff.activeBuffs.includes(1) && !p.status.firstStrike? 2: 1),
        color: 'orange',
      },
      {
        desc: 'Skill: Combo',
        value: () => fn(p.status.combo.dmg),
        color: 'orange',
      },
      {
        desc: 'Skill: Conquer [T2]',
        value: () => fn(1 + 0.001 * p.status.conquer.time),
        color: 'orange',
      },
      {
        desc: 'Skill: Extra Life [T2]',
        value: () => (p.status.extraLife.buffTime > 0? 1.5: 1),
        color: 'orange',
      },
      {
        desc: 'Skill: Berserk [T1]',
        value: () => fn(p.status.berserk.lowLifeDmg),
        color: 'orange',
      },
      {
        desc: 'Skill: Berserk [T4]',
        value: () => fn(p.status.berserk.rageDmg),
        color: 'orange',
        req: () => dimensions.value[32].infTier >= 8,
      },
      {
        desc: 'Skill: Charge',
        value: () => fn(1 + 0.05 * p.status.charges.power),
        color: 'orange',
      },
      {
        desc: 'Skill: Black Impulse [T1]',
        value: () => fn(Math.pow(1.2, p.status.blackImpulse.stacks)),
        color: 'orange',
        req: () => hero.value.bhTier > 0
      },
      {
        desc: 'Skill: Black Impulse [T4]',
        value: () => fn(p.status.blackImpulse.dmgBonus),
        color: 'orange',
        req: () => hero.value.bhTier > 3
      },
      
      {
        desc: 'Skill: Juggernaut',
        value: () => (p.buff.activeBuffs.includes(13)? 0.75: 1),
        color: 'orange',
      },
      {
        desc: 'Curse [Cursed Shield]',
        value: () => fn(p.curses.cursedShield),
        color: 'red',
      },
      {
        desc: 'D2 [Penalty]',
        value: () => fn(getDimEffect(2).dmg),
        color: 'red',
        req: () => h.dId == 'gravity'
      },
      {
        desc: 'D20',
        value: () => fn(getDimReward(20)),
        color: '#930df3',
        req: () => dimensions.value[20].infTier > 0
      },
      {
        desc: 'D21',
        value: () => (getDimReward(21).req? fn(getDimReward(21).dmg): 1),
        color: '#930df3',
        req: () => dimensions.value[21].infTier > 0
      },
      {
        desc: `D28`,
        value: () => fn(getDimReward(28)),
        color: '#930df3',
        req: () => dimensions.value[28].infTier > 0
      },
      {
        desc: 'D30',
        value: () => (h.dims.veil.stacks > 0? 2: 1),
        color: '#930df3',
        req: () => dimensions.value[30].infTier > 0
      },
      {
        desc: `D28 [Intervention]`,
        value: () => fn(getDimEffect(28).dmg),
        color: '#930df3',
        req: () => h.mainInfTier >= 35,
      },

      {
        desc: 'Formation',
        value: () => p.formationStats.atk,
        color: '#22cccc',
      },
      {
        desc: 'Soul [Special]',
        value: () => h.soulPower.special[0].value,
        color: '#930df3',
        req: () => h.infExpansions.soul,
      },
      {
        desc: 'Transcendence',
        value: () => fn(trHandle().atk),
        color: '#00fdff',
        req: () => h.bhTier >= 2,
      },
      {
        desc: 'Dark Creature',
        value: () => fn(e.specialCreatures.ddim2.loot),
        color: 'red',
        req: () => e.specialCreatures.ddim2.loot > 0
      },

      {
        desc: 'Quasar Core [Nova Surge]',
        value: () => (h.selectedDivSkills.includes(3)? fn(divineSkills.value[3].values[0]): 1),
        color: '#00ffea',
        req: () => hero.value.mainInfTier >= 50
      },
      {
        desc: 'Quasar Core [Singularity Destruction]',
        value: () => (h.selectedDivSkills.includes(8)? fn(divineSkills.value[8].values[1]): 1),
        color: 'red',
        req: () => hero.value.mainInfTier >= 50
      },

      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(0).mult),
        color: 'gold',
        req: () => h.bhTier >= 4
      },
      {
        desc: 'Corruption Influence [Penalty]',
        value: () => fn(corrInflueceHandle(3)),
        color: 'red',
        req: () => hero.value.mainInfTier >= 60
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(0)),
        color: 'gold',
        req: () => h.bhTier >= 5
      },

      {
        desc: 'Total',
        value: () => fn(p.attack.final),
        color: 'gold',
      },

      { desc: 'Singularity', value: '', color: 'cyan', uppercase: true },
      { 
        desc: 'Singularity Pts',
        value: () => ((h.gravity.isTrial || h.isSingularity) && h.rebirthPts >= 6e5? 2: 1),
        color: 'orange',
        req: () => h.rebirthPts >= 6e5,
      },
       {
        desc: 'D10',
        value: () => ((h.gravity.isTrial || h.isSingularity) && getDimSpecialReward(10)? 2: 1),
        color: '#930df3',
        req: () => getDimSpecialReward(10)
      },
      { desc: 'Space', value: '', color: 'orange', uppercase: true },
      { 
        desc: 'Ascension [Celestial Overdrive]',
        value: () => fn(perksHandler(28)),
        color: 'lightblue',
        req: () => h.spCount >= 5 || h.infUnlocked
      },
      { 
        desc: 'Singularity Pts',
        value: () => 1.5,
        color: 'cyan',
        req: () => h.rebirthPts >= 4e5
      },
      { desc: 'Crit Chance', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Base',
        value: 5,
        color: 'grey',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(7, ['inf'])),
        color: 'lightgreen',
        req: () => h.infUnlocked
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(7, ['base'])),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => fn(h.rebirthPts >= 150? 5: 0),
        color: 'lightgreen',
      },
      {
        desc: 'Sword [Suffix]',
        value: () => fn((Math.floor(h.spCount/6) >= 3? h.eqUpsMult['sword'].crit: 0)),
        color: '#22cccc',
      },
      {
        desc: 'Soul [Special]',
        value: () => (h.soulPower.tier >= 1 && h.infExpansions.soul? fn(h.soulPower.special[1].value): 0),
        color: '#22cccc',
        req: () => h.infExpansions.soul,
      },
      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(3).add),
        color: 'gold',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Corruption Influence',
        value: () => fn(corrInflueceHandle(5).crit),
        color: 'gold',
        req: () => h.mainInfTier >= 60,
      },

      {
        desc: 'Skill: Berserk [T2]',
        value: () => fn(p.status.berserk.crit),
        color: 'orange',
      },
      
      {
        desc: 'Skill: Sniper [T1]',
        value: () => fn(p.status.sniper.crit),
        color: 'orange',
      },
      {
        desc: 'Skill: Charge',
        value: () => fn(p.status.charges.energy),
        color: 'orange',
      },
      {
        desc: 'Total',
        value: () => fn(p.stats.final.crit),
        color: 'gold',
      },
      { desc: 'Crit DMG', value: '', color: 'red',  uppercase: true, },
      {
        desc: 'Base',
        value: 1.5,
        color: 'grey',
      },
      {
        desc: 'D52',
        value: () => fn(h.levelFactor.critDmg),
        color: 'lightgreen',
        req: () => getDimSpecialReward(52),
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(8, ['base'])),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(8, ['inf'])),
        color: 'lightgreen',
        req: () => h.infUnlocked
      },
      {
        desc: 'Sword [Suffix]',
        value: () => fn((Math.floor(h.spCount/6) >= 3? h.eqUpsMult['sword'].critDmg: 0)),
        color: '#22cccc',
      },
      {
        desc: 'Soul [Special]',
        value: () => (h.soulPower.tier >= 2 && h.infExpansions.soul? fn(h.soulPower.special[2].value): 0),
        color: '#22cccc',
        req: () => h.infExpansions.soul,
      },
      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(4).add),
        color: 'gold',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Corruption Influence',
        value: () => fn(corrInflueceHandle(5).critDmg),
        color: 'gold',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Space',
        value: () => h.spCount >= 43? fn(0.01 * h.sp): 0,
        color: 'orange',
      },
      {
        desc: 'Quasar Core [Quasar Fracture]',
        value: () => (h.selectedDivSkills.includes(15) ? fn(divineSkills.value[15].values[0]) : 0),
        color: 'gold',
        req: () => h.mainInfTier >= 100,
      },

      {
        desc: 'Skill: Berserk [T2]',
        value: () => fn(p.status.berserk.critDmg),
        color: 'orange',
      },
      
      {
        desc: 'Skill: Sniper [T1]',
        value: () => fn(p.status.sniper.critDmg),
        color: 'orange',
      },
      {
        desc: 'Skill: Charge',
        value: () => fn(0.1 * p.status.charges.energy),
        color: 'orange',
      },



      {
        desc: 'Total',
        value: () => fn(p.stats.final.critDmg),
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
        value: () => fn(h.levelFactor.hp),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(1, ["base"])),
        color: 'green',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(1, ["inf"])),
        color: 'green',
        req: () => h.infUnlocked
      },
      { 
        desc: 'Weapon',
        value: () => fn(getEqBase('armor')),
        color: '#22cccc',
      },
      {
        desc: 'Weapon [Enhances]',
        value: () => fn(getEqUps('armor')),
        color: '#22cccc',
        req: () => h.mainInfTier >= 1 || h.spCount > 0
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(1, hero)),
        color: 'gold',
        req: () => h.infUnlokcked
      },
      {
        desc: 'Formation [HP]',
        value: () => fn(p.formationStats.hp),
        color: 'green',
      },
      {
        desc: 'Skill [Conquer] [T1]',
        value: () => fn(1 + 0.001 * p.status.conquer.time),
        color: 'orange',
      },
      {
        desc: 'Skill [Juggernaut] [T1]',
        value: () => p.buff.activeBuffs.includes(13)? 1.5: 1,
        color: 'orange',
      },
      {
        desc: 'Skill [Charges]',
        value: () => fn(1 + 0.05 * p.status.charges.life),
        color: 'orange',
        req: () => h.mainInfTier >= 15
      },
       {
        desc: 'Singularity Pts',
        value: () => ((h.gravity.isTrial || h.isSingularity) && h.rebirthPts >= 6e5? 2: 1),
        color: '#a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'D28 [Penalty]',
        value: () => fn(getDimEffect(28).stats),
        color: 'red',
        req: () => h.dId == 'd-damage'
      },
      {
        desc: 'D30',
        value: () => fn(h.dims.veil.stacks > 0? 2: 1),
        color: '#6a0dad',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'Law',
        value: () => fn(collectLawEffects(1).mult),
        color: 'gold',
        req: () => h.bhTier >= 4
      },
      {
        desc: 'Quasar Core [Singularity Destruction] [Penalty]',
        value: () => h.selectedDivSkills.includes(8)? fn(divineSkills.value[8].values[1]): 1,
        color: 'red',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Corruption Influence [Penalty]',
        value: () => fn(corrInflueceHandle(3)),
        color: 'red',
        req: () => h.mainInfTier >= 60
      },
      { desc: 'Total', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(p.stats.final.hp),
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
        value: () => fn(h.levelFactor.def),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(2, ["base"])),
        color: 'green',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(2, ["inf"])),
        color: 'green',
        req: () => h.infUnlocked
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(2, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'Formation [DEF]',
        value: () => fn(p.formationStats.def),
        color: 'green',
      },
      {
        desc: 'Skill [Juggernaut] [T1]',
        value: () => p.buff.activeBuffs.includes(13)? 1.25: 1,
        color: 'orange',
      },
      {
        desc: 'Skill [Charges]',
        value: () => fn(1 + 0.05 * p.status.charges.life),
        color: 'orange',
        req: () => h.mainInfTier >= 15
      },
       {
        desc: 'Singularity Pts',
        value: () => ((h.gravity.isTrial || h.isSingularity) && h.rebirthPts >= 6e5? 2: 1),
        color: '#a4ffe1',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'D28 [Penalty]',
        value: () => fn(getDimEffect(28).stats),
        color: 'red',
        req: () => h.dId == 'd-damage'
      },
      {
        desc: 'D30',
        value: () => fn(h.dims.veil.stacks > 0? 2: 1),
        color: '#6a0dad',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'Law',
        value: () => fn(collectLawEffects(2).mult),
        color: 'gold',
        req: () => h.bhTier >= 4
      },
      {
        desc: 'Quasar Core [Singularity Destruction] [Penalty]',
        value: () => h.selectedDivSkills.includes(8)? fn(divineSkills.value[8].values[1]): 1,
        color: 'red',
        req: () => h.mainInfTier >= 50
      },
      {
        desc: 'Corruption Influence [Penalty]',
        value: () => fn(corrInflueceHandle(3)),
        color: 'red',
        req: () => h.mainInfTier >= 60
      },
      { desc: 'Total', value: '', color: 'lightgreen',  uppercase: true, },
      {
        desc: 'Total',
        value: () => fn(p.stats.final.def),
        color: 'gold',
      },
    ],
  },
  {
    title: 'AS',
    content: [
      { desc: 'Attack Speed', value: '', color: 'orange',  uppercase: true, req: () => true},
      {
        desc: 'Base',
        value: () => fn(p.APS.min),
        color: '',
        req: () => true
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(5, ["base"])),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(5, ["inf"])),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Boots',
        value: () => fn(getEqBase('boots')),
        color: '#22cccc',
        req: () => true
      },
      {
        desc: 'Boots [Enhances]',
        value: () => fn(getEqUps('boots')),
        color: '#22cccc',
        req: () => true
      },
      {
        desc: 'Skill: Combo [T4]',
        value: () => p.status.combo.value >= p.status.combo.max? 0.3: 0,
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Skill: Conquer [T3]',
        value: () => fn(0.1 * Math.floor(p.status.conquer.time / 250)),
        color: 'orange',
        req: () => true
      },
       {
        desc: 'Skill: Charge',
        value: () => fn(p.status.charges.power * 0.05),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Skill: Flash [T2]',
        value: () => p.status.flash.as,
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Skill: Fast Slash [MULT]',
        value: () => p.status.fastSlash.asReduce,
        color: 'orange',
        req: () => true
      },
      {
        desc: 'D39',
        value: () => fn(getDimReward(39).aps),
        color: 'purple',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'D39 [Trial]',
        value: () => fn(getDimEffect(39).aps),
        color: 'red',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Total',
        value: () => fn(p.APS.total),
        color: 'gold',
        req: () => true
      },
      {
        desc: 'Current',
        value: () => fn(p.APS.current),
        color: 'gold',
        req: () => true
      },
      { desc: 'MAX AS', value: '', color: 'orange',  uppercase: true, req: () => true},
      {
        desc: 'Base',
        value: () => 4,
        color: '',
        req: () => true
      },
      {
        desc: 'Skill: Flash [T3]',
        value: () => fn(p.status.flash.maxAs),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Tree [Radiation]',
        value: () => fn(nodesHandler(5, ["rad"])),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Total',
        value: () => fn(p.APS.max),
        color: 'gold',
        req: () => true
      },
      { desc: 'MIN AS', value: '', color: 'orange',  uppercase: true, req: () => true},
      {
        desc: 'Base',
        value: () => 0.5,
        color: '',
        req: () => true
      },
      {
        desc: 'Skill: Flash [T1]',
        value: () => p.buff.activeBuffs.includes(14)? 0.5: 0,
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Total',
        value: () => fn(p.APS.min),
        color: 'gold',
        req: () => true
      },
    ],
  },
  {
    title: 'Rush',
    id: 'rush',
    content: [
      { desc: 'Stage Rush', value: '', color: 'blue',  uppercase: true, },
      {
        desc: 'Infinity [T2]',
        value: () => (h.infExpansions.ascensioin? 0.15: 0),
        color: 'gold',
        req: () => h.infExpansions.ascensioin
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (h.rebirthPts >= 20000? 0.15: 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Singularity',
        value: () => fn(0.02 * hero.value.singularity),
        color: 'cyan',
        req: () => hero.value.singularity > 0
      },
      {
        desc: 'Black Hole',
        value: () => fn(0.05 * hero.value.bhTier),
        color: 'cyan',
        req: () => hero.value.bhTier > 0,
      },
      {
        desc: 'Total',
        value: () => fn(h.stageRush.c),
        color: 'gold',
        req: () => true
      },
      { desc: '[Max]', value: () => h.stageRush.m, color: 'lightblue',  uppercase: false, },
      { desc: 'Level Rush', value: '', color: 'blue',  uppercase: true, },
      {
        desc: 'Tree [Radiation]',
        value: () => fn(nodesHandler(3, ['rad']) * 0.01),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Souls',
        value: () => (h.soulsMax >= 40? 0.1: 0),
        color: 'purple',
        req: () => true
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (h.rebirthPts >= 70000? 0.1: 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Singularity',
        value: () => fn(0.02 * h.singularity),
        color: 'cyan',
        req: () => h.singularity > 0
      },
      {
        desc: 'Black Hole',
        value: () => fn(0.05 * hero.value.bhTier),
        color: 'cyan',
        req: () => h.bhTier > 0
      },
      {
        desc: 'Total',
        value: () => fn(h.levelRush.c),
        color: 'gold',
        req: () => true
      },
      { desc: '[Max: 75%]', value: () => h.levelRush.m, color: 'lightblue',  uppercase: false, },
    ]
  },
  {
    title: 'Corrupt.',
    id: 'corruption',
    content: [
      { desc: 'Corruption', value: '', color: 'purple',  uppercase: true, req: () => true },
      {
        desc: 'Base',
        value: 0.1,
        color: '',
        req: () => true
      },
      {
        desc: 'Space',
        value: () => fn(h.spCount >= 22? 1.002 ** h.sp - 1: 0),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Radiation',
        value: () => radPerks[11].level? fn(0.02 * Math.floor((hero.value.maxStage - 5)/5)): 0,
        color: 'green',
        req: () => true
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(2)),
        color: 'purple',
        req: () => true
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(10, hero)),
        color: 'gold',
        req: () => true
      },
      {
        desc: 'Rebirth Tier',
        value: () => (hero.value.rebirthTier >= 70? fn(hero.value.rebirthBonusesHandle[8].value): 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'D22',
        value: () => fn(getDimReward(22).weak),
        color: 'purple',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D26',
        value: () => fn(getDimReward(26).corr),
        color: 'purple',
        req: () => h.mainInfTier >= 35,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => fn(h.corruption.total),
        color: 'gold',
        req: () => true
      },
      { desc: 'Corruption Influence', value: '', color: 'purple',  uppercase: true, req: () => h.mainInfTier >= 60 },
      {
        desc: 'Base',
        value: () => 5,
        color: '',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Corruption Shards',
        value: () => h.dims.corrShards,
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'D45 [Trial]',
        value: () => fn(getDimEffect(45)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'D51 [Trial]',
        value: () => fn(getDimEffect(51)),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Timeline [Trial]',
        value: () => fn(timelineEffects().corrInfluence),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(voidEffects(9)),
        color: 'red',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(6).add),
        color: 'gold',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Transcendence [Tr]',
        value: () => fn(trHandle().corrInfluece),
        color: 'cyan',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(18)),
        color: 'gold',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Infninity',
        value: () => fn(infBonusesHandler(33, hero)),
        color: 'gold',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'D5',
        value: () => fn(d5RewardHandler(4, hero)),
        color: 'purple',
        req: () => h.mainInfTier >= 60,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => h.mainInfTier >= 60 },
      {
        desc: 'Total',
        value: () => fn(h.corrInfluence),
        color: 'gold',
        req: () => h.mainInfTier >= 60
      },
      { desc: 'Corruption Shards', value: '', color: 'purple',  uppercase: true, req: () => h.mainInfTier >= 60 },
      {
        desc: '[D-Corruption]',
        value: () => dimensions.value.filter(d => d.id.startsWith('c-')).reduce((sum, d) => sum + (d.infTier == d.spInfTier? 1: 0), 0),
        color: 'purple',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'Singularity Shards',
        value: () => singShardsEffect(15),
        color: 'cyan',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Abyss D',
        value: () => abyssHandler(21),
        color: 'purple',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'D5',
        value: () => d5RewardHandler(7, hero),
        color: 'purple',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Black Hole [T6]',
        value: () => dGravityHandler(5, hero).v,
        color: 'cyan',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Dark Creature',
        value: () => e.specialCreatures.ddim12.loot,
        color: '#f9453f',
        req: () => h.mainInfTier >= 100
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => h.mainInfTier >= 60 },
      {
        desc: 'Total',
        value: () => fn(h.dims.corrShards),
        color: 'gold',
        req: () => h.mainInfTier >= 60
      },
    ]
  },
  {
    title: 'Stage Req.',
    id: 'stage',
    content: [
      { desc: 'Stage requirement', value: '', color: 'yellow',  uppercase: true, req: () => true },
      {
        desc: 'Base',
        value: () => fn(h.baseStage),
        color: '',
        req: () => true
      },
      {
        desc: 'Boss [Penalty]',
        value: () => fn(Math.max(0.05 - 0.01 * Math.floor(hero.value.stages.current / 25), 0.01)),
        color: 'red',
        req: () => h.stages.current%5 == 4,
      },
      {
        desc: 'Singularity [Trial] [Penalty]',
        value: () => fn(singStageReq(2)),
        color: 'red',
        req: () => h.gravity.isTrial,
      },
      {
        desc: 'Void [Trial] [Penalty]',
        value: () => fn(voidEffects(0)),
        color: 'red',
        req: () => h.dId == 'dimMerge',
      },
      {
        desc: 'Abyss [Trial] [Penalty]',
        value: () => fn(0.025 * (hero.value.abyssTier + 1)),
        color: 'red',
        req: () => h.isAbyss,
      },
      {
        desc: 'D3 [Penalty]',
        value: () => fn(h.dId == 'overkill'? 0.1: 0),
        color: 'red',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D44 [Penalty]',
        value: () => fn(h.dId == 'c-overkill'? 1: 0),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Tree [Base]',
        value: () => fn(nodesHandler(10, ['base'])),
        color: 'lightgreen',
      },
      {
        desc: 'Tree [Infinity]',
        value: () => fn(nodesHandler(10, ['inf'])),
        color: 'lightgreen',
        req: () => h.infUnlocked
      },
      {
        desc: 'Ascension [Deeper]',
        value: () => fn(perksHandler(15)),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Ascension [The Distance]',
        value: () => fn(perksHandler(35)),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Soul [Tier]',
        value: () => fn(0.01 * Math.min(h.soulTier, 4)),
        color: 'purple',
        req: () => true,
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => fn((h.rebirthPts >= 125? 0.01: 0) + (h.rebirthPts >= 22500? 0.01: 0)),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Space',
        value: () => fn(h.spCount >= 16? 0.01: 0),
        color: 'orange',
        req: () => hero.value.spaceUnlocked || hero.value.mainInfTier > 0
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(1)),
        color: 'purple',
        req: () => hero.value.spCount >= 15 ||  hero.value.mainInfTier > 0
      },
      {
        desc: 'D3',
        value: () => fn(getDimReward(3)),
        color: 'purple',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D59',
        value: () => fn(getDimReward(59)),
        color: 'purple',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Boots [Suffix]',
        value: () => fn(h.eqUpsMult['boots'].stage),
        color: 'yellow',
        req: () => h.eqUpsMult['boots'].stage > 0 || h.mainInfTier >= 35,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(13, hero)),
        color: 'gold',
        req: () => h.infUnlocked
      },
      {
        desc: 'Laws',
        value: () => fn(collectLawEffects(5).add),
        color: 'gold',
        req: () => h.bhTier >= 4
      },
      {
        desc: 'D44 [Trial]',
        value: () => fn(getDimEffect(44)),
        color: 'purple',
        req: () => h.dId == 'c-overkill'
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(2)),
        color: 'cyan',
        req: () => h.bhTier >= 5
      },
      {
        desc: 'Void [Kills Requirement]',
        value: () => fn(h.voidTreeStats.kill_req_1),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Void [The Basics of Murder]',
        value: () => fn(voidKillsRed()),
        color: '#b6ff00',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Quasar Core [Supernova Pressure]',
        value: () => hero.value.selectedDivSkills.includes(16) ? fn(divineSkills.value[16].values[0]) : 0,
        color: 'cyan',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Black Hole [T6]',
        value: () => (h.gravity.isTrial? dGravityHandler(0, hero).v: 0),
        color: 'cyan',
        req: () => h.bhTier >= 6
      },
      
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => fn(h.stageReq),
        color: 'gold',
        req: () => true,
      },
      { desc: 'Hardcap', value: '', color: 'red',  uppercase: true,req: () => true },
      {
        desc: 'Hardcap',
        value: 1.01,
        color: 'gold',
        req: () => true,
      },
    ]
  },
  {
    title: 'Enemy HP',
    id: 'stats',
    content: [
      { desc: 'HP', value: '', color: 'yellow',  uppercase: true },
      {
        desc: 'Base [Stage]',
        value: () => fn(e.enemyStats.main.hpStage),
        color: '',
      },
      {
        desc: 'Abyss [T2] [Ascension Influence]',
        value: () => fn((h.abyssTier >= 2 ? 1 / (1.04 ** Math.log(h.ascensionShards + 1)) : 1)),
        color: 'lightpurple',
      },
      {
        desc: 'Ascension [Corrupted Insight]',
        value: () => fn(perksHandler(27)),
        color: 'lightblue',
        req: () => h.infExpansions.ascensioin
      },
      {
        desc: 'Ascension [HP Reduction] [^]',
        value: () => fn(perksHandler(32)),
        color: 'lightblue',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Ascension [Stage Fracture]',
        value: () => fn(perksHandler(49)),
        color: 'lightblue',
        req: () => getDimSpecialReward(9),
      },
      {
        desc: 'Danger Power',
        value: () => (h.isAbyss || h.isSingularity || h.gravity.isTrial) ? 1 : fn(e.enemyPower),
        color: '#b6ff00',
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(14, hero)),
        color: 'gold',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Weak Charges',
        value: () => fn(1 - v.status.weakStack.count * 0.01),
        color: 'lightpurple',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Curse [Titan]',
        value: () => fn(e.enemyStats.main.titan),
        color: 'red',
      },
      {
        desc: 'Penalty [Travel]',
        value: () => (h.isTravell? h.travellPenalty * (h.dId.startsWith('d-')? 2: 1): 1),
        color: 'red',
        req: () => getDimSpecialReward(3),
      },
      {
        desc: 'D2 [Trial]',
        value: () => fn(getDimEffect(2).hp),
        color: 'red',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'D3 [Trial]',
        value: () => fn(getDimEffect(3).hp),
        color: 'red',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D20 [Trial]',
        value: () => fn(getDimEffect(20).hp),
        color: 'red',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D26 [Trial]',
        value: () => fn(getDimEffect(26).hp),
        color: 'red',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Quasar Core [Supernova Pressure]',
        value: () => (h.selectedDivSkills.includes(16)? fn(divineSkills.value[16].values[1]) : 1),
        color: 'cyan',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Corruption Influence',
        value: () => fn(corrInflueceHandle(0).hp),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Timeline [Trial]',
        value: () => fn(timelineEffects().power),
        color: 'red',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(1).hp),
        color: 'cyan',
        req: () => h.bhTier >= 5,
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(voidEffects(5)),
        color: 'red',
        req: () => h.mainInfTier >= 100,
      },
      { desc: 'HP [Boss]', value: '', color: 'yellow',  uppercase: true },
      {
        desc: 'Base [MULT]',
        value: () => fn(e.enemyStats.main.bossHp),
        color: 'red',
      },
      {
        desc: 'D29 [Obscrurants] [MULT]',
        value: () => fn(v.deBoss.stats.hp),
        color: 'purple',
        req: () => h.dId == 'd-overstage'
      },
      { desc: 'HP [Soul]', value: '', color: 'yellow',  uppercase: true },
      {
        desc: 'Base',
        value: () => fn(soulHp().base),
        color: '#e578fa',
        req: () => true,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(11, hero)),
        color: 'gold',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Ascension [Revolution]',
        value: () => fn(perksHandler(19)),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(10)),
        color: '#e578fa',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Quasar Core [Astral Convergence]',
        value: () => (h.selectedDivSkills.includes(17) ? fn(divineSkills.value[17].values[1]) : 1),
        color: 'cyan',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total [MULT]',
        value: () => fn(soulHp().total),
        color: '#e578fa',
        req: () => true,
      },

      { desc: 'HP [Abyss]', value: '', color: 'yellow',  uppercase: true, req: () => h.isAbyss },
      {
        desc: 'Base [MULT]',
        value: () => fn(Math.max(1.05 - 0.01 * h.abyssTier + (h.abyssTier >= 3 ? 0.015 : 0), 1.03) ** stage),
        color: '#e578fa',
        req: () => h.isAbyss,
      },
      {
        desc: 'Rebirth',
        value: () => fn(h.rebirthBonusesHandle[0].value),
        color: 'lightgreen',
        req: () => h.isAbyss,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(5, hero)),
        color: 'gold',
        req: () => h.isAbyss,
      },

      { desc: 'HP [Singularity]', value: '', color: 'yellow',  uppercase: true, req: () => h.gravity.isTrial || h.isSingularity},
      {
        desc: 'Base [MULT]',
        value: () => fn(Math.max(450000 - 75000 * Math.min(h.singularity, 8), 25000) * singPower()),
        color: 'cyan',
        req: () => h.isSingularity,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(21, hero)),
        color: 'gold',
        req: () => h.gravity.isTrial || h.isSingularity,
      },
      {
        desc: 'Dimension Creature',
        value: () => fn(1 - e.specialCreatures.dim4.loot * 0.01),
        color: 'purple',
        req: () => h.gravity.isTrial || h.isSingularity,
      },
      {
        desc: 'Singularity [D-S] [MULT]',
        value: () => fn(enemyShardsMult().hp),
        color: 'cyan',
        req: () => h.gravity.isTrial,
      },
      { desc: 'Total HP', value: '', color: 'yellow',  uppercase: true,},
      {
        desc: 'Total',
        value: () => fn(v.stats.final.hp),
        color: 'gold',
      },
    ]
  },
  {
    title: 'Enemy DMG',
    id: 'stats',
    content: [
      { desc: 'HP', value: '', color: 'yellow',  uppercase: true },
      {
        desc: 'Base [Stage]',
        value: () => fn(e.enemyStats.main.dmgStage),
        color: '',
      },
      {
        desc: 'Abyss [T2] [Ascension Influence]',
        value: () => fn((h.abyssTier >= 2 ? 1 / (1.04 ** Math.log(h.ascensionShards + 1)) : 1)),
        color: '#e578fa',
      },
      {
        desc: 'Ascension [DMG Reduction]',
        value: () => fn(perksHandler(33)),
        color: 'lightblue',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Ascension [Stage Fracture]',
        value: () => fn(perksHandler(49)),
        color: 'lightblue',
        req: () => getDimSpecialReward(9),
      },
      {
        desc: 'Danger Power',
        value: () => (h.isAbyss || h.isSingularity || h.gravity.isTrial) ? 1 : fn(e.enemyPower ** 0.1),
        color: '#b6ff00',
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(14, hero)),
        color: 'gold',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Weak Charges',
        value: () => fn(1 - v.status.weakStack.count * 0.01),
        color: 'lightpurple',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Curse [Muscles]',
        value: () => fn(e.enemyStats.main.muscles),
        color: 'red',
      },
      {
        desc: 'Penalty [Travel]',
        value: () => (h.isTravell? h.travellPenalty ** 0.5: 1),
        color: 'red',
        req: () => getDimSpecialReward(3),
      },
      {
        desc: 'D3 [Trial]',
        value: () => fn(getDimEffect(3).dmg),
        color: 'red',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D20 [Trial]',
        value: () => fn(getDimEffect(20).dmg),
        color: 'red',
        req: () => h.mainInfTier >= 10,
      },
      {
        desc: 'D26 [Trial]',
        value: () => fn(getDimEffect(26).dmg),
        color: 'red',
        req: () => h.mainInfTier >= 35,
      },
      {
        desc: 'Corruption Influence',
        value: () => fn(corrInflueceHandle(0).hp),
        color: 'red',
        req: () => h.mainInfTier >= 60,
      },
      {
        desc: 'Timeline [Trial]',
        value: () => fn(timelineEffects().power ** 0.25),
        color: 'red',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(1).dmg),
        color: 'cyan',
        req: () => h.bhTier >= 5,
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(voidEffects(5) ** 0.15),
        color: 'red',
        req: () => h.mainInfTier >= 100,
      },
      { desc: 'DMG [Boss]', value: '', color: 'yellow',  uppercase: true },
      {
        desc: 'Base [MULT]',
        value: () => fn(e.enemyStats.main.bossDmg),
        color: 'red',
      },
      {
        desc: 'D29 [Obscrurants] [MULT]',
        value: () => fn(v.deBoss.stats.dmg),
        color: 'purple',
        req: () => h.dId == 'd-overstage'
      },
      { desc: 'DMG [Soul]', value: '', color: 'yellow',  uppercase: true },
      {
        desc: 'Base',
        value: () => fn(soulDmg().base),
        color: '#e578fa',
        req: () => true,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(11, hero)),
        color: 'gold',
        req: () => h.infUnlocked,
      },
      {
        desc: 'Ascension [Revolution]',
        value: () => fn(perksHandler(19)),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Abyss D',
        value: () => fn(abyssHandler(10)),
        color: '#e578fa',
        req: () => h.spaceUnlocked || h.mainInfTier > 0,
      },
      {
        desc: 'Quasar Core [Astral Convergence]',
        value: () => (h.selectedDivSkills.includes(17) ? fn(divineSkills.value[17].values[1]) : 1),
        color: 'cyan',
        req: () => h.mainInfTier >= 100,
      },
      {
        desc: 'Total [MULT]',
        value: () => fn(soulDmg().total),
        color: '#e578fa',
        req: () => true,
      },

      { desc: 'DMG [Abyss]', value: '', color: 'yellow',  uppercase: true, req: () => h.isAbyss },
      {
        desc: 'Base [MULT]',
        value: () => fn(Math.max(1.05 - 0.01 * h.abyssTier + (h.abyssTier >= 3 ? 0.015 : 0), 1.03) ** stage),
        color: '#e578fa',
        req: () => h.isAbyss,
      },
      {
        desc: 'Rebirth',
        value: () => fn(h.rebirthBonusesHandle[0].value),
        color: 'lightgreen',
        req: () => h.isAbyss,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(5, hero)),
        color: 'gold',
        req: () => h.isAbyss,
      },

      { desc: 'DMG [Singularity]', value: '', color: 'yellow',  uppercase: true, req: () => h.gravity.isTrial || h.isSingularity},
      {
        desc: 'Base [MULT]',
        value: () => fn(Math.max(1000 - 120 * Math.min(h.singularity, 8)) * singPower() ** 0.9),
        color: 'cyan',
        req: () => h.isSingularity,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(21, hero)),
        color: 'gold',
        req: () => h.gravity.isTrial || h.isSingularity,
      },
      {
        desc: 'Dimension Creature',
        value: () => fn(1 - e.specialCreatures.dim4.loot * 0.01),
        color: 'purple',
        req: () => h.gravity.isTrial || h.isSingularity,
      },
      {
        desc: 'Singularity [D-S] [MULT]',
        value: () => fn(enemyShardsMult().dmg),
        color: 'cyan',
        req: () => h.gravity.isTrial,
      },
      { desc: 'Total DMG', value: '', color: 'yellow',  uppercase: true,},
      {
        desc: 'Total',
        value: () => fn(v.stats.final.atk),
        color: 'gold',
      },
    ]
  },
  {
    title: 'Laws',
    id: 'rush',
    content: [
      { desc: 'Ancient Shards MULT', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: () => 1,
        color: '',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(29, hero)),
        color: 'gold',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(17, hero)),
        color: 'yellow',
        req: () => h.bhTier >= 4,
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(hero.value.voidTreeStats.an_shards_1),
        color: 'cyan',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'D51',
        value: () => fn(getDimReward(51).as),
        color: 'purple',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'Total',
        value: () => fn(ancientShardsMult()),
        color: 'gold',
        req: () => true
      },
      { desc: 'Additional Radius MULT', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'D51',
        value: () => fn(getDimReward(51).r),
        color: 'purple',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.laws_radius_1),
        color: 'purple',
        req: () => true
      },
      {
        desc: 'Total',
        value: () => fn(radiusSourses()),
        color: 'gold',
        req: () => true
      },
    ]
  },
  {
    title: 'Soul',
    id: 'soul',
    content: [
      { desc: 'Soul Appearance Chance', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: () => fn(soulBaseChance()),
        color: '',
      },
      {
        desc: 'Tree',
        value: () => fn(nodesHandler(13, 'base')),
        color: 'lightgreen',
      },
      {
        desc: 'Ascension [Soul Spreading]',
        value: () => fn(perksHandler(16)),
        color: 'lightblue',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => fn((1 + 0.35 * (h.rebirthPts >= 1000? h.rebirthTier: 0))),
        color: 'lightgreen',
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => fn((h.rebirthPts >= 20? e.rebirthEnemy["drop"] * 2: 1)),
        color: 'lightgreen',
      },
      {
        desc: 'Skill [Traveler]',
        value: () => fn(p.status.traveler.soul),
        color: 'orange',
      },
      {
        desc: 'Abyss',
        value: () => fn((h.abyssTier >= 1? (1 + 0.5 * cursed.filter(c => c.status === true).length): 1)),
        color: 'lightpurple',
      },
      {
        desc: 'Danger',
        value: () => fn((e.danger >= 10? e.specialCreatures.souls.chance: 1)),
        color: '#b6ff00',
        req: () => h.spaceUnlocked || h.mainInfTier > 0
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(15, hero)),
        color: 'gold',
        req: () => h.bhTier >= 3
      },
      {
        desc: 'Quasar Core [Astral Convergence]',
        value: () => fn((h.selectedDivSkills.includes(17) ? divineSkills.value[17].values[0] : 1)),
        color: 'cyan',
        req: () => h.bhTier >= 3
      },
      {
        desc: 'Void [Soul]',
        value: () => fn(h.voidTreeStats.soul_app_1),
        color: 'lightpurple',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Void [Trial]',
        value: () => fn(voidEffects(6)),
        color: 'red',
        req: () => h.mainInfTier >= 100
      },
      {
        desc: 'Total',
        value: () => fn(soulTotalChance()),
        color: 'gold',
        req: () => true
      },
    ]
  },
  {
    title: 'Overkill',
    id: 'overkill',
    content: [
      { desc: 'Overkill', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Ascension [Overkill]',
        value: () => fn(perksHandler(21)),
        color: 'lightblue',
      },
      {
        desc: 'Infinity',
        value: () => fn(infBonusesHandler(6, hero)),
        color: 'gold',
        req: () => h.mainInfTier > 0
      },
      {
        desc: 'D19',
        value: () => fn(getDimReward(19)),
        color: 'lightpurple',
        req: () => h.mainInfTier >= 10
      },
      {
        desc: 'Equipment [Prefix]',
        value: () => fn(h.eqUpsMult['boots'].overkill),
        color: 'cyan',
        req: () => h.mainInfTier >= 10 
      },
      {
        desc: 'CRIT [Milestone]',
        value: () => fn(p.status.critMls.overkill),
        color: 'orange',
        req: () => h.mainInfTier >= 60 
      },
      {
        desc: 'Void',
        value: () => fn((hero.value.gravity.isTrial? hero.value.voidTreeStats.sing_overkill: 0)),
        color: '#lightpurple',
        req: () => h.mainInfTier >- 100
      },
      {
        desc: 'Skill [Overkill] [T1]',
        value: () => fn(overkillSkill(0)),
        color: 'orange',
      },
      {
        desc: 'Skill [Overkill] [T2]',
        value: () => fn(overkillSkill(1)),
        color: 'orange',
      },
      {
        desc: 'Skill [Overkill] [T3]',
        value: () => fn(overkillSkill(2)),
        color: 'orange',
      },
      {
        desc: 'Singularity Shards [MULT]',
        value: () => fn(singShardsEffect(5)),
        color: 'cyan',
        req: () => h.bhTier >= 5
      },
      {
        desc: 'Total',
        value: () => fn(h.overkill),
        color: 'gold',
        req: () => true
      },
      { desc: 'Overloot', value: '', color: 'gold',  uppercase: true, req: () => h.singularity > 0 },
      {
        desc: 'Base',
        value: () => (overkillSkill(3)? 1: 0),
        color: '',
        req: () => h.singularity > 0
      },
      {
        desc: 'Ascension [Eternal Shift]',
        value: () => fn(perksHandler(57)),
        color: 'lightblue',
        req: () => h.mainInfTier >= 35
      },
      {
        desc: 'Souls',
        value: () => fn(buffs.value[7].extraTier),
        color: 'cyan',
        req: () => h.mainInfTier >= 60
      },
      {
        desc: 'Singularity Pts',
        value: () => fn((h.rebirthPts >= 8e5? 1: 0)),
        color: 'cyan',
        req: () => h.singularity >= 8,
      },
      {
        desc: 'Total',
        value: () => fn(p.overkill.loot),
        color: 'gold',
        req: () => h.singularity > 0
      },
    ]
  },
  {
    title: 'Void',
    id: 'void',
    content: [
      { desc: 'Void Shards MULT', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.void_shards),
        color: 'lightblue',
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(18, hero)),
        color: 'gold',
      },
      {
        desc: 'Abyss',
        value: () => fn(abyssHandler(20)),
        color: 'lightpurple',
      },
      {
        desc: 'Singularity Shards',
        value: () => fn(singShardsEffect(12)),
        color: 'cyan',
      },
      {
        desc: 'Infninity',
        value: () => fn(infBonusesHandler(35, hero)),
        color: 'orange',
      },
      {
        desc: 'D5',
        value: () => fn(d5RewardHandler(5, hero) ),
        color: 'lightpurple',
        req: () => h.mainInfTier >- 100
      },
      {
        desc: 'Black Hole [T5]',
        value: () => fn(dGravityHandler(1, hero).v),
        color: 'cyan',
      },
      {
        desc: 'Dark Creature',
        value: () => fn((1 + 0.01 * e.specialCreatures.ddim10.loot)),
        color: 'red',
      },
      {
        desc: 'Total',
        value: () => fn(voidMults()),
        color: 'gold',
      }
    ]
  },
  {
    title: 'S-Shards',
    id: 'singularity shards',
    content: [
      { desc: 'Singularity Shards MULT', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Void [Tree]',
        value: () => fn(h.voidTreeStats.sing_shards_mult_1),
        color: 'lightpurple',
      },
      {
        desc: 'Astralis',
        value: () => fn(spaceShopHandler(18, hero)),
        color: 'gold',
      },
      {
        desc: 'Abyss',
        value: () => fn(abyssHandler(19)),
        color: 'lightpurple',
      },
      {
        desc: 'Infninity',
        value: () => fn(infBonusesHandler(34, hero)),
        color: 'orange',
      },
      {
        desc: 'D5',
        value: () => fn(d5RewardHandler(6, hero)),
        color: 'lightpurple',
        req: () => h.mainInfTier >- 100
      },
      {
        desc: 'Black Hole [T5]',
        value: () => fn(dGravityHandler(4, hero).v),
        color: 'cyan',
      },
      {
        desc: 'Dark Creature',
        value: () => fn((1 + 0.01 * enemy.value.specialCreatures.ddim11.loot)),
        color: 'red',
      },
      {
        desc: 'Total',
        value: () => fn(h.singMult),
        color: 'gold',
      }
    ]
  },
]

</script>

<style scoped>
.info-container {
  box-sizing: border-box;

  height: 100dvh; 

  background: linear-gradient(145deg, #0b0d0f, #05070c);
  color: #f0f0f0;

  padding: clamp(12px, 2vh, 24px);

  border-radius: 0; 
  box-shadow: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.5vh, 18px);
  overflow-y: auto;

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

.style-section {
  width: 80%;
}

.update-section { border : 1px solid gold }
.endless-section { border: 1px solid #ffaa00; }
.lore-section { border: 1px solid #9999ff; }
.afk-section { border: 1px solid #22cccc; }
.auto-section { border: 1px solid rgb(99, 255, 51); }
.tree-section { border: 1px solid #00cc44; }
.skill-section { border: 1px solid #ffcc00;  }
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
  width: 80%;
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




.lore-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
}



.lore-card {
  background: #1e1e2f;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  color: #f0f0f0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.lore-card:hover {
  transform: translateY(-2px);
}

.lore-meta {
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.lore-author {
  color: #a0ff9f;
  font-weight: 500;
}

.lore-location {
  color: #ffd166; 
  font-weight: 500;
}

.lore-locked {
  font-style: italic;
  color: #ff6b6b;
}


.rainbow-text {
  font-size: 50px;
  font-weight: bold;
  background: linear-gradient(
    90deg, 
    red, orange, yellow, green, blue, indigo, violet
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  background-clip: text;
  color: transparent;
}


.tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid yellow;
}
.tabs button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.lore-card.locked {
  opacity: 0.6;
  cursor: pointer;
}

.lore-filters {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}

.lore-filters button {
  padding: 6px 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.2);
  color: #ccc;
  cursor: pointer;
  transition: 0.2s;
}

.lore-filters button.active {
  border-color: #67e8f9;
  color: #67e8f9;
  box-shadow: 0 0 10px rgba(103,232,249,0.3);
}

</style>
