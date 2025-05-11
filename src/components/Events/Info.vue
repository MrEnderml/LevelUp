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
  </div>
</template>

<script setup>
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { ref, computed } from 'vue';

const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();

const activeEvent = ref('Lore');

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
  'Buffs'
];

function disfunc(event){
  return !hero.value.infoActive[event.toLowerCase()];
}

const filteredSections = computed(() => {
  return styledSections.filter(section =>
    section.class.includes(activeEvent.value.toLowerCase())
  );
});

const availableBuffs = computed(() => buffs.value.filter(buff => buff.active));

function tieredDescriptions(buff) {
  return buff.description.slice(0, buff.tier);
}

const styledSections = [
  {
    title: 'Endless Progress',
    class: 'endless-section lore',
    content: [
      'Endgame content is 700 Level (Infinity [T6])',
      'Next update 0.3: Dimension Atlas'
      ]
  },
  {
    title: 'Why LevelUp?',
    class: 'lore-section',
    content: ['I think this title will make sense when you reach 700 level or when you break the reality and open the first dimension to find out about D-Rule']
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
      If the Enchance level is higher than the Equipment Tier, only Enchance up to the current Tier are taken. [Current Stage - (40 - SP Perks)]<br>
      The amount of stardust dropped depends on the minimum stage before the current one<br>
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
      'Extra Bonus Multiplier = ^(1 + 0.1 * total curses + [0.2 for each curse T4])',
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
      'Mutagen gain = ∑(mutations)^3 * Mult.',
      'Stages for mutagens finding: T1-30, T2-35, T3-40, T4-45',
      'Danger ↑ = special enemy chance ↑ + strength ↑.',
      'Danger doesnt work in Abyss',
      `Danger Levels:<br>10: Souls<br>20: Ascension Souls<br>40: Rebirth Souls<br>`,
      `Hold the button to upgrade quickly`,
      hero.value.infTier >= 4 && `Infinite Creatures:<br>
      Infinite creatures do not reset during Infinity, and each creature has its own personal Drop and MAX Drop<br>
      Ω-Infinity - [Danger 100 & Stage 60+]: +1 Potential [${enemy.value.dangerEnemyLoot[0]} / 60]<br>
      Mirror of the Eternal - [Danger 150 & Stage 65+]: +1 IP [${enemy.value.dangerEnemyLoot[1]} / 100]<br>
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
      'Infinity Bonuses depends on IP'
    ]
  }
];
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
  max-width: 550px;
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

/* Стили по категориям */
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
}

.event-tabs button.active {
  background: #e2c028;
  color: #000;
  font-weight: bold;
  border-color: #ffef91;
}
</style>
