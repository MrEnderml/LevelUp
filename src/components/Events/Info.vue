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
     
    <div v-if="activeEvent === 'Lore'" class="info-card lore-section">
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
        <div style="color: red">The stat sections are currently not working correctly.</div>
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
  'Update',
  'Lore',
  'Info',
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











const loreSection = [
  {
    title: 'Message',
    id: 0,
    author: 'Unknown',
    location: 'Level 1',
    visible: true,
    locked: false, 
    content: [
      `Do you realize how powerful you are? Traveling between Dimensions, destroying Galaxies and Celestials.`,
      `But what you may not know is that <span class="rainbow-text">[D-Rule]</span> is watching you, and when you are weak enough, he will destroy you, because only one can be the Chosen One.`,
      `Ask me when you find me between all these dimensions.`
    ]
  },
  {
    title: 'Ancient Note I',
    id: 1,
    author: 'Unknown',
    location: 'Infinity [T1]',
    visible: true,
    locked: true, 
    content: [
      `It was a time when chaos was part of every creature in the entire world.  
      Every race was searching for a place of peace and existence.  
      The fate of every creature was in their own hands, but no one could do anything about it in the face of death itself.
      `
    ]
  },
  {
    title: 'Ancient Note II',
    id: 2,
    author: 'Unknown',
    location: 'Infinity [T3]',
    visible: true,
    locked: true, 
    content: [
      `One of the most powerful races, humans, could not avoid the total destruction of their kind. 
      Watching the collapse of the imperium, they set out in search of a safer place to prolong their fragile existence.
      `
    ]
  },
  {
    title: 'Ancient Note III',
    id: 3,
    author: 'Unknown',
    location: 'Infinity [T5]',
    visible: true,
    locked: true, 
    content: [
      `A thousand astronomical units passed until humanity found a small corner at the edge of the universe. 
      This place was the very image of calm and serenity, untouched by chaos—absolute harmony and purity. 
      It was a sign, a sign that it was time for humanity to return, to return and recreate the imperium anew.
      .`
    ]
  },
  {
    title: 'Ancient Note IV',
    id: 4,
    author: 'Unknown',
    location: 'Infinity [T8]',
    visible: true,
    locked: true, 
    content: [
      `Humanity—perhaps one of the most primitive, and at the same time the most tenacious and adaptive races—when placed 
      in favorable conditions, recovered from the collapse of the imperium and prepared for new conquests. 
      Or so they thought...
      .`
    ]
  },
  {
    title: 'Ancient Note V',
    id: 5,
    author: 'Unknown',
    location: 'Infinity [T10]',
    visible: true,
    locked: true, 
    content: [
      `At the dawn of existence, when galaxies were forming and dimensions were uniting, and life was just beginning to emerge,
       beings not bound by any law or time existed and manifested themselves—indescribable in a single word, 
       as if these beings were the law itself, standing at the pinnacle of the entire world.
      .`
    ]
  },
  {
    title: 'Ancient Note VI',
    id: 6,
    author: 'Unknown',
    location: 'Dimension [R0-X9a] [2] [T5]',
    visible: true,
    locked: true, 
    content: [
      `Clumps of inexplicable energy in different colors moved and radiated an unfathomable power. 
      After a short time, the purple essence spread across the sky and began to speak in human language.
      .`
    ]
  },
  {
    title: 'Ancient Note VII',
    id: 7,
    author: 'Unknown',
    location: 'Dimension [K7-D4n] [3] [T8]',
    visible: true,
    locked: true, 
    content: [
      `"Humanity—observing one of the superior races is quite pleasant for a creature like me. However, 
      I must point out that your presence here is unforgivable, and I would even say impossible. 
      And yet, your emergence is the result of our impossible mistake".
      .`
    ]
  },
  {
    title: 'Ancient Note VIII',
    id: 8,
    author: 'Unknown',
    location: 'Dimension [K7-D4n] [1] [T2]',
    visible: true,
    locked: true, 
    content: [
      `"This place is the stronghold of our creation. As incomprehensible and wondrous as we are, it was never 
      intended for this place to be filled with beings of living matter. 
      Our law is not to interfere with the lives of lesser races—this is a taboo, a decree, a rule, call it what you will, 
      but one we must observe".
      .`
    ]
  },
  {
    title: 'Ancient Note IX',
    id: 9,
    author: 'Unknown',
    location: 'Dimension [M2-Λ1s] [4] [T5]',
    visible: true,
    locked: true, 
    content: [
      `"Your existence here violates the harmony and balance of this fragile world. 
      No one can ever escape chaos. Whether you live or die, the fate of races must follow its own path, 
      and the paradox in which you now find yourself corrupts the universal formula of this entire world".
      .`
    ]
  },
  {
    title: 'Ancient Note X',
    id: 10,
    author: 'Unknown',
    location: 'Dimension [V6-B3n] [6] [T15]',
    visible: true,
    locked: true, 
    content: [
      `"Therefore, as beings of a higher order, for our mistake, we grant you—humanity—one astronomical unit of time 
      to leave this place. To return to the open world, the one from which you came. 
      Understand: the transfer of our creation into your dimension could lead to the death of an entire race, 
      which is unacceptable to us. And yet, there will always be victims. 
      Remember: not a single creature has ever escaped chaos. 
      So it is, so it was, and so it shall be. This is the essence of the entire world".
      .`
    ]
  },
  {
    title: 'Ancient Note XI',
    id: 11,
    author: 'Unknown',
    location: 'Dimension [DD-zΘaYY] [9] [T7]',
    visible: true,
    locked: true, 
    content: [
      `The culmination of humanity’s efforts was the creation of a perfect being, forged with all the technologies they 
      possessed. Its purpose was to find a suitable place for the continued existence of humanity. 
      Yet everyone understood that, after the fall of the imperium, humanity would once again be reduced to mere survival.
      They had only one chance, and they chose to stake everything upon it.
      .`
    ]
  },
  {
    title: 'Ancient Note XII',
    id: 12,
    author: 'Unknown',
    location: 'Dimension [QZ-µaTT] [11] [T15]',
    visible: true,
    locked: true, 
    content: [
      `Clumps of inexplicable energy in different colors moved and radiated an unfathomable power. 
      After a short time, the purple essence spread across the sky and began to speak in human language.
      .`
    ]
  },
  {
    title: 'Message',
    id: 13,
    author: '[D-Infinity]',
    location: 'Infinity [T10]',
    visible: true,
    locked: true, 
    content: [
      `Your pathetic attempts to scuttle like a rat through my domain are beginning to irritate me.  
      .`
    ]
  },
  {
    title: 'Message',
    id: 14,
    author: '[D-Infinity]',
    location: 'Infinity [T20]',
    visible: true,
    locked: true, 
    content: [
      `If a lower being like you does not know its place, it must be destroyed according to the laws of this world.    
      .`
    ]
  },
  {
    title: 'Message',
    id: 15,
    author: '[D-Infinity]',
    location: 'Infinity [T40]',
    visible: true,
    locked: true, 
    content: [
      `And if you are so confident in your powers, do not dare to die quickly—I want to see you suffer.
      .`
    ]
  },
  {
    title: 'Message',
    id: 16,
    author: '[D-Infinity]',
    location: 'Infinity [T60]',
    visible: true,
    locked: true, 
    content: [
      `Why does a small, pathetic, deplorable creature like you still exist? Remember, the further you go, the more I sense your presence. 
      Do not die before your time—a toy like you will be a delightful bonus in my hands.
      .`
    ]
  },
   {
    title: 'Message',
    id: 17,
    author: '[D-Gravity]',
    location: 'Singularity [T0]',
    visible: true,
    locked: true, 
    content: [
      `And who has come to me?  You must be very brave to enter my trial. 
      .`
    ]
  },
   {
    title: 'Message',
    id: 18,
    author: '[D-Gravity]',
    location: 'Singularity [T1]',
    visible: true,
    locked: true, 
    content: [
      `You should not fear the path that is destined for you.
      .`
    ]
  },
   {
    title: 'Message',
    id: 19,
    author: '[D-Gravity]',
    location: 'Singularity [T2]',
    visible: true,
    locked: true, 
    content: [
      `The shackles of this world are gradually falling away—do you feel it too? 
      .`
    ]
  },
   {
    title: 'Message',
    id: 20,
    author: '[D-Gravity]',
    location: 'Singularity [T3]',
    visible: true,
    locked: true, 
    content: [
      `Your body is as heavy as ten suns, and your eyes burn with the fire of a thousand more.  
      .`
    ]
  },
   {
    title: 'Message',
    id: 21,
    author: '[D-Gravity]',
    location: 'ISingularity [T4]',
    visible: true,
    locked: true, 
    content: [
      `Do not look at other creatures crushed by gravity; you have your own path to follow.
      .`
    ]
  },
   {
    title: 'Message',
    id: 22,
    author: '[D-Gravity]',
    location: 'Singularity [T5]',
    visible: true,
    locked: true, 
    content: [
      `Even the heaviest of bodies will eventually rise, if they align with the true pull of their destiny.
      .`
    ]
  },
   {
    title: 'Message',
    id: 23,
    author: '[D-Gravity]',
    location: 'Singularity [T6]',
    visible: true,
    locked: true, 
    content: [
      `Gravity binds all, yet the spirit that resists it carves its own orbit among the stars.
      .`
    ]
  },
   {
    title: 'Message',
    id: 24,
    author: '[D-Gravity]',
    location: 'Singularity [T7]',
    visible: true,
    locked: true, 
    content: [
      `Those who are crushed by gravity see only the ground; those who embrace it see the cosmos
      .`
    ]
  },
   {
    title: 'Message',
    id: 25,
    author: '[D-Gravity]',
    location: 'Singularity [T8]',
    visible: true,
    locked: true, 
    content: [
      `The force that holds you down is the same force that can propel you beyond all limits.
      .`
    ]
  },
  {
    title: 'Message',
    id: 26,
    author: '[D-Gravity]',
    location: 'Black Hole [T0]',
    visible: true,
    locked: true, 
    content: [
      `Even light cannot escape the pull of a black hole, yet in its darkness lies the seed of creation
      .`
    ]
  },
  {
    title: 'Message',
    id: 27,
    author: '[D-Gravity]',
    location: 'Black Hole [T1]',
    visible: true,
    locked: true, 
    content: [
      `All paths converge toward the void, and yet those who embrace it understand the true weight of existence
      .`
    ]
  },
  {
    title: 'Message',
    id: 28,
    author: '[D-Gravity]',
    location: 'Black Hole [T2]',
    visible: true,
    locked: true, 
    content: [
      `The closer you fall into the singularity, the clearer the illusion of time and self becomes
      .`
    ]
  },
  {
    title: 'Message',
    id: 29,
    author: '[D-Gravity]',
    location: 'Black Hole [T3]',
    visible: true,
    locked: true, 
    content: [
      `To tear the fabric of the universe, you must first shatter the chains that bind all existence. 
      That singularity of energies will become both a new beginning… and a new end
      .`
    ]
  },
  {
    title: 'Message',
    id: 30,
    author: '[D-Corruption]',
    location: 'Infinity [T60]',
    visible: true,
    locked: true, 
    content: [
      `The time has come for me to unveil my eternal self.
      .`
    ]
  },
  {
    title: 'Message',
    id: 31,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T1]',
    visible: true,
    locked: true, 
    content: [
      `Entities beyond control must be annihilated.
      .`
    ]
  },
  {
    title: 'Message',
    id: 32,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T2]',
    visible: true,
    locked: true, 
    content: [
      `All that escapes control is a threat to order.
      `
    ]
  },
  {
    title: 'Message',
    id: 33,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T3]',
    visible: true,
    locked: true, 
    content: [
      `No entity can remain beyond the reach of dominion
      .`
    ]
  },
  {
    title: 'Message',
    id: 34,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T4]',
    visible: true,
    locked: true, 
    content: [
      `To resist control is to invite destruction
      .`
    ]
  },
  {
    title: 'Message',
    id: 35,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T5]',
    visible: true,
    locked: true, 
    content: [
      `Chaos knows no mercy, but control shall claim all who dare resist it
      .`
    ]
  },
  {
    title: 'Message',
    id: 36,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T6]',
    visible: true,
    locked: true, 
    content: [
      `Chaos knows no mercy, but control shall claim all who dare resist it
      .`
    ]
  },
  {
    title: 'Message',
    id: 37,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T7]',
    visible: true,
    locked: true, 
    content: [
      `The world itself demands obedience; those beyond its grasp shall be undone
      .`
    ]
  },
  {
    title: 'Message',
    id: 38,
    author: '[D-Space]',
    location: 'Dimension [Ω VL-χtAR] [31] Infinity [T8]',
    visible: true,
    locked: true, 
    content: [
      `Those who escape the grasp of control threaten the balance of all creation and must be subdued
      .`
    ]
  },
  {
    title: 'Message',
    id: 39,
    author: '[D-Ultimatum]',
    location: 'Dimension [Ω LD-δrAK] [38] Infinity [T1]',
    visible: true,
    locked: true, 
    content: [
      `What audacity—and at the same time, what courage—to challenge something so utterly incomprehensible.`
    ]
  },
  {
    title: 'Message',
    id: 40,
    author: '[D-Ultimatum]',
    location: 'Dimension [Ω LD-δrAK] [38] Infinity [T3]',
    visible: true,
    locked: true, 
    content: [
      `Those who dare defy the laws of the cosmos are rewarded with the power that others fear to touch.`
    ]
  },
  {
    title: 'Message',
    id: 41,
    author: '[D-Ultimatum]',
    location: 'Dimension [Ω LD-δrAK] [38] Infinity [T6]',
    visible: true,
    locked: true, 
    content: [
      `Any who challenge the immutable rules of creation shall ascend beyond the reach of the cautious.`
    ]
  },
  {
    title: 'Message',
    id: 42,
    author: '[D-Ultimatum]',
    location: 'Dimension [Ω LD-δrAK] [38] Infinity [T10]',
    visible: true,
    locked: true, 
    content: [
      `The entire world tests the bold; those who transgress its boundaries are granted gifts denied to the meek.`
    ]
  },
  {
    title: 'Message',
    id: 43,
    author: '[D-Ultimatum]',
    location: 'Dimension [Ω LD-δrAK] [38] Infinity [T12]',
    visible: true,
    locked: true, 
    content: [
      `To oppose the foundations of reality is to seize the power that lies beyond fear.`
    ]
  },
  {
    title: 'Message',
    id: 44,
    author: '[D-Ultimatum]',
    location: 'Dimension [Ω LD-δrAK] [38] Infinity [T15]',
    visible: true,
    locked: true, 
    content: [
      `Your existence is alluring to the forces of disorder that threaten this fragile balance. I will await you in my dimension—if, of course, you dare to come.`
    ]
  },
  {
    title: 'Message',
    id: 45,
    author: '[D-Gravity]',
    location: 'Black Hole [T4]',
    visible: true,
    locked: true, 
    content: [
      `It is time to learn how to control time. Be prepared—it will take no less than an eternity.`
    ]
  },
  {
    title: 'Ancient Note XIII',
    id: 46,
    author: 'Unknown',
    location: 'Dimension [BZ-ΦeLL] [15] [T20]',
    visible: true,
    locked: true, 
    content: [
      `The entire technology of the human race set forth through the dying world of chaos, 
      overcoming powerful beings and uncontrollable laws, poisoned yet driven by the 
      last chance for humanity — a chance for existence.`
    ]
  },
  {
    title: 'Ancient Note XIV',
    id: 47,
    author: 'Unknown',
    location: 'Dimension [HZ-βcTR] [19] [T25]',
    visible: true,
    locked: true, 
    content: [
      `It could be described in no other way than as a gift from a great being who 
      guided mankind and left subtle hints. Yet one could only 
      grasp a single truth: either there truly is a benevolent being in this world… 
      or this being requires something of us.`
    ]
  },
  {
    title: 'Ancient Note XV',
    id: 48,
    author: 'Unknown',
    location: 'Dimension [YY-θsJP] [18] Stage: 101',
    visible: true,
    locked: true, 
    content: [
      `Long before the journey began, enclosed within the life-support capsule, a single phrase echoed in my mind: 
      find me among all these dimensions.`
    ]
  },
  {
    title: 'Ancient Note XVI',
    id: 49,
    author: 'Unknown',
    location: 'Dimension [DV-χuQZ] [20] [T20]',
    visible: true,
    locked: true, 
    content: [
      `Gazing upon the lifeless surroundings, the absolute emptiness of space, one cannot help but believe 
      that it was not always so — or at least, we wanted to believe.`
    ]
  },
  {
    title: 'Ancient Note XVII',
    id: 50,
    author: 'Unknown',
    location: 'Dimension [KL-σrXZ] [13] [T25]',
    visible: true,
    locked: true, 
    content: [
      `No one can say when it began — when new life ceased to emerge, when the lands stopped yielding crops, 
       when planets stopped being born. One can only say this:
       the catharsis of all life can arise so suddenly that we do not even notice it.`
    ]
  },
  {
    title: 'Ancient Note XVIII',
    id: 51,
    author: 'Unknown',
    location: 'Dimension [JK-λbYX] [22] [T35]',
    visible: true,
    locked: true, 
    content: [
      `What is chaos? It is difficult to define in a single word. It is more like the 
      state of our world: a world that walks in the footsteps of death. Lifeless and empty, 
      a world torn by fluctuations and black holes. The absolute harmony of emptiness.`
    ]
  },
  {
    title: 'Ancient Note XIX',
    id: 52,
    author: 'Unknown',
    location: 'Dimension [Et-n1t1] [24]',
    visible: true,
    locked: true, 
    content: [
      `The energy of this place feels different, 
      and yet that voice in my head grows stronger. Perhaps I am on the right path.`
    ]
  },
  {
    title: 'Message',
    id: 53,
    author: '[D-Gravity]',
    location: 'Black Hole [T5]',
    visible: true,
    locked: true, 
    content: [
      `Chaous = Entropy.`
    ]
  },
  {
    title: 'Message',
    id: 54,
    author: '[D-Gravity]',
    location: 'Black Hole [T6]',
    visible: true,
    locked: true, 
    content: [
      `It is time to learn how to control time. Be prepared—it will take no less than an eternity.`
    ]
  },
  {
    title: 'Ancient Note XX',
    id: 55,
    author: 'Unknown',
    location: 'Dimension [Ω DR-σvTH] [26] [T1]',
    visible: true,
    locked: true, 
    content: [
      `[D-Corruption] is one of the most ancient supreme beings. 
      Its influence spreads across all possible dimensions, yet its true habitat remains unknown to others. 
      The only thing worth understanding is this:
       its mere presence alone can plunge the entire world into the abyss of corruption.`
    ]
  },
  {
    title: 'Ancient Note XXI',
    id: 56,
    author: 'Unknown',
    location: 'Dimension [Ω NX-λrAZ] [28] [T1]',
    visible: true,
    locked: true, 
    content: [
      `It is unknown when or how *Doom* appeared here.
       Ancient notes speak of the experiments of supreme beings, 
       seeking to create a vessel for controlling dark energy.`
    ]
  },
  {
    title: 'Ancient Note XXII',
    id: 57,
    author: 'Unknown',
    location: 'Dimension [Ω VL-χtAR] [31] [T1]',
    visible: true,
    locked: true, 
    content: [
      `If you ask who holds greater power, everyone will answer the same: power 
      belongs to the one who commands all creatures.
      Yet in the pursuit of truth, the greatest danger is becoming such a creature yourself.`
    ]
  },
  {
    title: 'Ancient Note XXIII',
    id: 58,
    author: 'Unknown',
    location: 'Dimension [Ω TH-μrAK] [34] [T1]',
    visible: true,
    locked: true, 
    content: [
      `Ancient records of explorers describe shards of dimensions as remnants of a once-mighty world that
       possessed intelligence. Now, only broken shards remain—each carrying immense power within itself`
    ]
  },
  {
    title: 'Ancient Note XXIV',
    id: 59,
    author: 'Unknown',
    location: 'Dimension [Ω TH-μrAK] [34] [T5]',
    visible: true,
    locked: true, 
    content: [
      `Every being in existence felt the echo of a battle in this place, a clash between [D-Gravity] and an ancient entity. 
       consequence was nothing less than the annihilation of an entire dimension.`
    ]
  },
  {
    title: 'Ancient Note XXV',
    id: 60,
    author: 'Unknown',
    location: 'Dimension [Ω TH-μrAK] [34] [T10]',
    visible: true,
    locked: true, 
    content: [
      `The Ancient Titans were among the few who could rival the powers of the laws. Their strength was as old as their very existence. 
      Traces of their power — or of their disappearance — are nearly impossible to find.`
    ]
  },
  {
    title: 'Ancient Note XXV',
    id: 61,
    author: 'Unknown',
    location: 'Dimension [Ω TH-μrAK] [34] [T15]',
    visible: true,
    locked: true, 
    content: [
      `The Ancient Titans were among the few who could rival the powers of the laws. Their strength was as old as their very existence. 
      Traces of their power — or of their disappearance — are nearly impossible to find.`
    ]
  },
  {
    title: 'Ancient Note XXVI',
    id: 62,
    author: 'Unknown',
    location: 'Dimension [Ω TH-μrAK] [34] [T20]',
    visible: true,
    locked: true, 
    content: [
      `The Ancient Titans were not only majestic, but also the very first who can grasp the essence of the laws’ power — long before their feud with the [D-Overlords].
      .`
    ]
  },
  {
    title: 'Ancient Note XXVII',
    id: 63,
    author: 'Unknown',
    location: 'Dimension [Ω LD-δrAK] [38] [T1]',
    visible: true,
    locked: true, 
    content: [
      `There exists a creature, granted absolute freedom and a vile nature. Never accept its bargains—if you value your life.
      .`
    ]
  },
]


const authorColors = {
  'Unknown': '#2dffbd',
  '[D-Infinity]': 'gold',
  '[D-Gravity]': '#00fdff',
  '[D-Space]': 'orange',
  '[D-Ultimatum]': '#ff6b6b',
  '[D-Corruption]': '#d300f7',
  '[D-Eternal]': '#feafff',
  '[D-Rule]': '#ffffff',
};


const activeAuthor = ref(null);


const authors = computed(() => {
  return Array.from(
    new Set(
      loreSection
        .filter(s => s.content && s.content.length > 0 && s.visible && !s.locked)
        .map(s => s.author || 'Unknown')
    )
  );
});


const filteredLoreSections = computed(() => {
  if (!activeAuthor.value) return [];
  return loreSection.filter(s => s.author === activeAuthor.value);
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
  return section.visible && loreCondition(section.id);
};


const loreCondition = (id) => {
  switch(id){
    case 1: return hero.value.mainInfTier >= 1;
    case 2: return hero.value.mainInfTier >= 3;
    case 3: return hero.value.mainInfTier >= 5;
    case 4: return hero.value.mainInfTier >= 8;
    case 5: return hero.value.mainInfTier >= 10;
    case 6: return dimensions.value[2].infTier >= 5;
    case 7: return dimensions.value[3].infTier >= 8;
    case 8: return dimensions.value[1].infTier >= 2;
    case 9: return dimensions.value[4].infTier >= 5;
    case 10: return dimensions.value[6].infTier >= 15;
    case 11: return dimensions.value[9].infTier >= 7;
    case 12: return dimensions.value[11].infTier >= 15;
    case 13: return hero.value.mainInfTier >= 10;
    case 14: return hero.value.mainInfTier >= 20;
    case 15: return hero.value.mainInfTier >= 40;
    case 16: return hero.value.mainInfTier >= 60;
    case 17: return hero.value.mainInfTier >= 6;
    case 18: return hero.value.singularity > 0;
    case 19: return hero.value.singularity > 1;
    case 20: return hero.value.singularity > 2;
    case 21: return hero.value.singularity > 3;
    case 22: return hero.value.singularity > 4;
    case 23: return hero.value.singularity > 5;
    case 24: return hero.value.singularity > 6;
    case 25: return hero.value.singularity > 7;
    case 26: return hero.value.rebirthPts >= 1e7;
    case 27: return hero.value.bhTier >= 1;
    case 28: return hero.value.bhTier >= 2;
    case 29: return hero.value.bhTier >= 3;
    case 30: return hero.value.mainInfTier >= 60;
    case 31: return dimensions.value[31].infTier >= 1;
    case 32: return dimensions.value[31].infTier >= 2;
    case 33: return dimensions.value[31].infTier >= 3;
    case 34: return dimensions.value[31].infTier >= 4;
    case 35: return dimensions.value[31].infTier >= 5;
    case 36: return dimensions.value[31].infTier >= 6;
    case 37: return dimensions.value[31].infTier >= 7;
    case 38: return dimensions.value[31].infTier >= 8;
    case 39: return dimensions.value[38].infTier >= 1;
    case 40: return dimensions.value[38].infTier >= 3;
    case 41: return dimensions.value[38].infTier >= 6;
    case 42: return dimensions.value[38].infTier >= 10;
    case 43: return dimensions.value[38].infTier >= 12;
    case 44: return dimensions.value[38].infTier >= 15;
    case 45: return hero.value.bhTier >= 4;
    case 46: return dimensions.value[15].infTier >= 20;
    case 47: return dimensions.value[19].infTier >= 25;
    case 48: return hero.value.abyssDStages > 100;
    case 49: return dimensions.value[20].infTier >= 20;
    case 50: return dimensions.value[13].infTier >= 25;
    case 51: return dimensions.value[22].infTier >= 35;
    case 52: return dimensions.value[22].infTier >= 35 && dimensions.value[13].infTier >= 25 && hero.value.mainInfTier >= 35;
    case 53: return hero.value.bhTier >= 5;
    case 54: return hero.value.bhTier >= 6;
    case 55: return dimensions.value[26].infTier >= 1;
    case 56: return dimensions.value[28].infTier >= 1;
    case 57: return dimensions.value[31].infTier >= 1;
    case 58: return dimensions.value[34].infTier >= 1;
    case 59: return dimensions.value[34].infTier >= 5;
    case 60: return dimensions.value[34].infTier >= 10;
    case 61: return dimensions.value[34].infTier >= 15;
    case 62: return dimensions.value[34].infTier >= 20;
    case 63: return dimensions.value[38].infTier >= 1;
    default: return false;
  }
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
    title: 'Update 0.5 [Dark Dimensions]',
    class: 'update-section update',
    content: [
        `<span style="color: red">The update is in alpha. There may be bugs, as well as issues with files and game balance.
        Future patches may introduce many changes and additions.</span>`,
        
        `<strong>Important changes</strong><br>`,

        `<span style="color: #ef37ef"><strong>Dimensions</strong></span><br>
        Dark Dimensions added.<br>
        Two Dimension view modes.<br>
        Progression view for Dimensions.<br>
        The Home button now teleports directly into the Dimension (previously it teleported to the Dimension’s location in the Atlas).<br>`,

        `<span style="color: #00c0ff"><strong>Singularity</strong></span><br>
        Progression has become easier. The required number of kills now depends on the Singularity tier. [T0] - 1250, [T1] - 2500...<br>`,

        `<span style="color: gold"><strong>Infinity</strong></span><br>
        Milestone section.<br>
        New Infinity bonuses.<br>
        Quasar Core [Endgame content].<br>`,

        `<span style="color: #d4ff00"><strong>Radiation</strong></span><br>
        Hover over a creature to see details.<br>
        Danger Perk upgrades faster.<br>`,

        `<span style="color: orange"><strong>Space</strong></span><br>
        Auto-system for Space.<br>
        Space creatures now have a cooldown for fighting (Auto-Fighting).<br>
        Space-INF and Astralis [Midgame content].<br>`,

        `<span style="color: lightgreen"><strong>Rebirth</strong></span><br>
        [T80] now capped at [T200].<br>`,

        `<span style="color: purple"><strong>Souls</strong></span><br>
        UI changes.<br>
        Souls now provide a multiplier to Stardust and Mutagen drop.<br>`,

        `<span style="color: gold"><strong>Buffs</strong></span><br>
        New Buffs layout.<br>
        Double-click the layout to open the edit menu.<br>
        Prioritization system: buffs will be updated when the number of available buffs changes (chooses the most useful buffs first).<br>`,

        `<span style="color: lightblue"><strong>Equipment</strong></span><br>
        Added Starforge Tier that improves the power of Enhances. The Tier depends on total Enhances.<br>
        Min Chance removed and replaced with Extra Enhance Chance.<br>
        Extra Enhance applies to both normal Enhances and [MAX].<br>`,

        `<span style="color: green"><strong>Tree</strong></span><br>
        Some Inf-perks related to DMG now have a higher cost.<br>`,

        `<span style="color: yellow"><strong>Combat</strong></span><br>
        UI progression changes.<br>
        Curses and most icons now show information when hovered.<br>
        Icons now have static positions and a safety check (Settings).<br>`,

        `<span style="color: yellow"><strong>The next patch includes</strong></span><br>
        Stats panel showing detailed stats.<br>
        Rebalancing.<br>
        Small visual fixes.<br>
        Damage display?<br>`,
      ]
  },
  {
    title: 'Links',
    class: 'auto-section info',
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
    class: 'endless-section info',
    content: [
      'Endgame content is The Black Hole [T4]',
      'Next update 0.6: Dimensional Merge'
      ]
  },
  {
    title: 'Usefull Info',
    class: 'endless-section info',
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
      'Stats from the level are added only those that are in the range of the maximum level + minimum level *When your current Level is higher than the Maximum Level*'
    ]
  },
  {
    title: 'AFK',
    class: 'afk-section info',
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
    class: 'auto-section info',
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
      hero.value.spCount >= 25 && `The bonuses from Abyss D will apply only after open Abyss D`, 
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
      'Danger ↑ = <strong>special enemy chance</strong> ↑ + power ↑.',
      '<strong>Danger Power does not work in Abyss and Singularity</strong>',
      `Hold the button to upgrade quickly`,
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
    'Each Infinity provides a rebuild mechanic, but everything is reset (except Abyss D).',
    'You can reset the influence of Infinity in the settings if you are not strong enough to overcome this challenge.',
    'Infinity bonuses depend on IP.',
    `Inf penalty reduction (IPR): The full power of the IPR only works on the main dimension. After the 20th main dimension, the IPR starts spreading to other dimensions. The greater the Infinity in the main dimension, the stronger the IPR for other dimensions.`
  ],
  },
  {
    title: 'Singularity',
    class: 'singularity-section',
    content: [
      'Singularity levels increase the threshold after Max Level 700. After Level 700, your stats are doubled.',
      hero.value.singularity >= 8 && 'Kill an enemy with Curse [T5] to get extra bonus and double EXP, EXP buff, Stardust, and Mutagen. See the chance of Curse [T5] in the Amulet section.'
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
'Potential', 'Danger', 'Damage', 'HP', 'DEF', 'ApS', 'Rush', 'Corrupt.', 'Stage Req.'];


const statSections = [
  {
    title: 'Level',
    id: 'only level',
    content: [
      { desc: 'Min Level', value: '', color: 'lightgreen',  uppercase: true, req: () => hero.value.minLevel > 0 },
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
        req: () => hero.value.minLevel > 0 || hero.value.rebirthPts >= 25,
      },
      {
        desc: 'Ascension [Destructive Play]',
        value: () => (ascenPerks[26].level? Math.floor(hero.value.stage/5)-1: 0),
        color: 'lightblue',
        req: () => hero.value.minLevel > 0 || ascenPerks[26].level,
      },
      {
        desc: 'Rebirth Pts',
        value: () => ((hero.value.rebirthPts >= 50? 5: 0) + (hero.value.rebirthPts > 3500? 5: 0) + (hero.value.rebirthPts > 30000? 5: 0)),
        color: 'lightgreen',
        req: () => hero.value.minLevel > 0,
      },
      {
        desc: 'Rebirth Tier',
        value: () => (hero.value.infTier >= 3 && hero.value.rebirthTier >= 40? Math.floor(1.05 ** Math.min(hero.value.rebirthTier, 80)): 0),
        color: 'lightgreen',
        req: () => hero.value.minLevel > 0
      },
      {
        desc: 'Comet Ring',
        value: () => (equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel),
        color: '#66ffcc',
        req: () => equipment[4].tiers[hero.value.equipmentTiers['spRing']].bonus.minLevel > 0 || hero.value.minLevel > 0,
      },
      {
        desc: 'Comet Ring [Enhances]',
        value: () => (hero.value.eqUpsMult['spRing'].bonus),
        color: '#66ffcc',
        req: () => hero.value.eqUpsMult['spRing'].bonus > 0 || hero.value.minLevel > 0
      },
      {
        desc: 'Souls',
        value: () => (hero.value.infTier >= 6? Math.floor(hero.value.soulsMax/10): 0),
        color: '#d516d5',
        req: () => hero.value.mainInfTier >= 6,
      },
      {
        desc: 'Ascension [Soulbound Growth]',
        value: () => (ascenPerks[50].level? Math.floor(hero.value.soulsMax/20): 0),
        color: 'lightblue',
        req: () => dimensions.value[9].infTier >= 7,
      },
      {
        desc: 'Infinity',
        value: () => Math.floor(hero.value.infPoints / (200 - ((hero.value.mainInfTier >= 25? 0.0035: 0) > 0? 20: 0))),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 13,
      },
      {
        desc: 'Singularity Pts',
        value: () => (hero.value.rebirthPts >= 9e5? hero.value.singularity: 0),
        color: '#a4ffe1',
        req: () => hero.value.rebirthPts >= 9e5,
      },
      {
        desc: 'Dimension [S5-Ω3t] [5]',
        value: () => formatNumber(hero.value.unlimitMinLevel, true),
        color: '#d516d5',
        req: () =>  hero.value.unlimitMinLevel > 0,
      },
      {
        desc: 'Ascension [Echo of Completion]',
        value: () => (ascenPerks[54].level? dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length : 0),
        color: 'lightblue',
        req: () => dimensions.value[9].infTier >= 7,
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 41? Math.floor(hero.value.spCount / 6): 0),
        color: 'orange',
        req: () => hero.value.spCount >= 41 || hero.value.mainInfTier >= 15,
      },
      {
        desc: 'Dimension [ND-ζpWQ] [12]',
        value: () => (dimensions.value[12].infTier),
        color: '#d516d5',
        req: () => dimensions.value[12].infTier > 0,
      },
      {
        desc: 'Dimension [41]',
        value: () => formatNumber((dimensions.value[41].infTier == dimensions.value[41].maxInfTier? Math.floor(Math.log(3 + hero.value.trueLevel) ** 1.25) : 0) ,true),
        color: '#d516d5',
        req: () => dimensions.value[41].infTier == dimensions.value[41].maxInfTier
      },
      {
        desc: 'Astralis',
        value: () => ((spaceShop.value[9].status? Math.floor(hero.value.spsCountMax / 2): 0)),
        color: 'yellow',
        req: () => spaceShop.value[9].status,
      },
      {
        desc: 'Transcendence [Black Hole]',
        value: () => Math.floor(hero.value.bhTier >= 3 && hero.value.dId == 'bh'? 1 * hero.value.transcendenceBH: 0),
        color: '#04fdff',
        req: () => hero.value.bhTier >= 3,
      },
      {
        desc: 'Transcendence [Main]',
        value: () => Math.floor((hero.value.bhTier >= 3 && hero.value.dId == 'main'? 1 * hero.value.transcendence: 0)),
        color: '#04fdff',
        req: () => hero.value.bhTier >= 3,
      },
      {
        desc: 'Dark Creature',
        value: () => enemy.value.darkEnemyLoot[3],
        color: 'red',
        req: () => enemy.value.darkEnemyLoot[3] > 0,
      },
      { desc: 'MIN LEVEL MULT', value: '', color: 'lightgreen',  uppercase: true, req: () => hero.value.minLevelMult > 1 },
      {
        desc: 'Dimension [33]',
        value: () => formatNumber(dimensions.value[33].infTier * 0.005, true),
        color: '#04fdff',
        req: () => dimensions.value[33].infTier > 0,
      },
      {
        desc: 'Quasar Core',
        value: () => (hero.value.selectedDivSkills.includes(13)? divineSkills.value[13].values[1]: 0),
        color: '#04fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Total',
        value: () => (hero.value.minLevelMult),
        color: 'gold',
        req: () => hero.value.minLevelMult > 1,
      },
      { desc: 'TOTAL', value: '', color: 'gold',  uppercase: true, req: () => hero.value.minLevel > 0 },
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
        req: () => true,
      },
      {
        desc: 'Tree',
        value: () => (perks.value[4].status? 0: perks.value[4].value * perks.value[4].level),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Ascension',
        value: () => (ascenPerks[0].level + ascenPerks[9].level + ascenPerks[18].level),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Ascension [Destructive Play]',
        value: () => ((ascenPerks[26].level? 2*Math.floor(hero.value.stage/5)-1: 0)),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Souls',
        value: () => hero.value.souls * (dimensions.value[14].infTier == dimensions.value[14].maxInfTier? 2: 1),
        color: '#d516d5',
        req: () => true,
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
        req: () => true,
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
        req: () => true,
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
        req: () => true,
      },
      {
        desc: 'Amulets',
        value: () => (amulets[0].status? 4: 0) + (amulets[1].status? 8: 0) + (amulets[2].status? 12: 0) + (amulets[3].status? 16: 0),
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Radiation',
        value: () => radPerks[12].level,
        color: '#99ff99',
        req: () => true,
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 23? hero.value.sp * 2: 0),
        color: 'orange',
        req: () => true,
      },
      {
        desc: 'Space [Bosses]',
        value: () => ((hero.value.spCount / 6 >= 1? 25: 0) + (hero.value.spCount / 6 >= 2? 50: 0) + (hero.value.spCount / 6 >= 3? 75: 0) + (hero.value.spCount / 6 >= 4? 100: 0) + 
        (hero.value.spCount / 6 >= 5? 150: 0) + (hero.value.spCount / 6 >= 6? 200: 0) + (hero.value.spCount / 6 >= 7? 300: 0) + (hero.value.spCount / 6 >= 8? 400: 0)),
        color: 'orange',
        req: () => true,
      },
      {
        desc: 'Total',
        value: () => Math.floor(hero.value.maxLevelInfo),
        color: 'gold',
        req: () => true,
      },
      { desc: 'Max Level MULT', value: '', color: 'lightgreen',  uppercase: true, req: () => hero.value.maxLevelMult > 1 },
      {
        desc: 'Base',
        value: 1,
        color: '',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Amulets [Prefix]',
        value: () => (((amulets[0].prefix.status? 0.02: 0) + (amulets[1].prefix.status? 0.04: 0) + (amulets[2].prefix.status? 0.06: 0) + 
        (amulets[3].prefix.status? 0.08: 0)) * (hero.value.sp >= 99? 2: 1)).toFixed(2),
        color: 'red',
        req: () => hero.value.maxLevelMult > 1
      },
      {
        desc: 'Ascension [Endless Levels]',
        value: () => ((ascenPerks[31].level * 0.01)).toFixed(2),
        color: 'lightblue',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Ascension [Corrupted Amplification]',
        value: () => (ascenPerks[41].level?  hero.value.overcorruption / (4 - 0.125 * (dimensions.value[22].infTier - 25)): 0).toFixed(2),
        color: 'lightblue',
        req: () => hero.value.singularity > 4 && hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Rebirth Tier',
        value: () => (hero.value.rebirthTier >= 80? 0.02 * (Math.min(hero.value.rebirthTier, 200) - 79): 0).toFixed(2),
        color: 'lightgreen',
        req: () => hero.value.maxLevelMult > 1
      },
      {
        desc: 'Infinity',
        value: () => ((hero.value.mainInfTier >= 10? (1.07 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints)*Math.log(hero.value.infPoints))) - 1: 0)).toFixed(2),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 10 && hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Dimension [S5-Ω3t] [5]',
        value: () => formatNumber(hero.value.unlimitMaxLevel, true),
        color: '#991099',
        req: () => hero.value.unlimitMaxLevel > 0 && hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Abyss D',
        value: () =>  formatNumber(hero.value.spCount >= 15 && hero.value.abyssDStages >= 200? 0.025 * (hero.value.abyssDStages - 199): 0, true),
        color: '#991099',
        req: () => hero.value.maxLevelMult > 1 && hero.value.spCount >= 15
      },
      {
        desc: 'Ring [Prefix]',
        value: () => formatNumber(hero.value.eqUpsMult['ring'].multLevel, true),
        color: '#66ffcc',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Transcendence [Black Hole]',
        value: () => formatNumber((hero.value.bhTier >= 1 && hero.value.dId == 'bh'? 0.1 * hero.value.transcendenceBH: 0), true),
        color: '#04fdff',
        req: () => hero.value.bhTier >= 1,
      },
      {
        desc: 'Transcendence [Main]',
        value: () => formatNumber((hero.value.bhTier >= 1 && hero.value.dId == 'main'? 0.1 * hero.value.transcendence: 0), true),
        color: '#04fdff',
        req: () => hero.value.bhTier >= 1,
      },
      {
        desc: 'Dark Creature',
        value: () => formatNumber((0.01 * enemy.value.darkEnemyLoot[2]), true),
        color: 'red',
        req: () => enemy.value.darkEnemyLoot[2] > 0,
      },
      {
        desc: 'Tree [Extra Level] [GLOBAL MULT]',
        value: () => (perks.value[4].status? 1.1 + 0.01 * (dimensions.value[40].infTier - 40): 0),
        color: 'lightgreen',
        req: () => hero.value.maxLevelMult > 1,
      },
      {
        desc: 'Total',
        value: () => (1 + hero.value.maxLevelMult).toFixed(2),
        color: 'gold',
        req: () => hero.value.maxLevelMult > 1,
      },
      { desc: `Dark Energy`, value: '', color: 'gold',  uppercase: true, req: () => dimensions.value[29].infTier > 0},
      {
        desc: 'Total [^]',
        value: () => formatNumber(enemy.value.darkEnergy.deTotal, true),
        color: 'gold',
        req: () => dimensions.value[29].infTier > 0,
      },
      { desc: `Max Level [Penalty]`, value: '', color: 'red',  uppercase: true, req: () => hero.value.mainInfTier >= 50},
      {
        desc: 'Quasar Core [Stellar Equilibrium]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(1)? divineSkills.value[1].values[0]: 1), true),
        color: 'red',
        req: () => hero.value.mainInfTier >= 50,
      },
      { desc: `True Level`, value: '', color: 'lightgreen',  uppercase: true, req: () => true},
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.trueLevel, true),
        color: 'gold',
        req: () => true,
      },
      { desc: `Infinity Penalty Reduction`, value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPenalty > 0 || hero.value.mainInfTier >= 20 },
      {
        desc: 'Ascension [Singularity Seed]',
        value: () => formatNumber(ascenPerks[42].level? 0.02: 0, true),
        color: 'lightblue',
        req: () => hero.value.infPenalty > 0,
      },
      {
        desc: 'Ascension [Dimensional Toll]',
        value: () => formatNumber(ascenPerks[47].level? dimensions.value.filter(dim => dim.infTier >= dim.maxInfTier).length * 0.005: 0, true),
        color: 'lightblue',
        req: () => hero.value.infPenalty > 0,
      },
      {
        desc: 'Dimension Creature',
        value: () => formatNumber(enemy.value.dEnemyLoot[5] * 0.01, true),
        color: 'rgb(9, 253, 233)',
        req: () => enemy.value.dEnemyLoot[5] > 0
      },
      {
        desc: 'Dimension [KL-σrXZ] [13]',
        value: () => formatNumber((dimensions.value[13].infTier - 15) * 0.005, true),
        color: '#db16db',
        req: () => dimensions.value[13].infTier > 0,
      },
      {
        desc: 'Singularity Pts',
        value: () => formatNumber(hero.value.rebirthPts >= 2.5e6? Math.sqrt(Math.log(hero.value.rebirthPts)) * 0.01: 0, true),
        color: '#a4ffe1',
        req: () => hero.value.rebirthPts >= 2.5e6,
      },
       {
        desc: 'Dimension [27]',
        value: () => formatNumber((dimensions.value[27].infTier * 0.005), true),
        color: '#db16db',
        req: () => dimensions.value[13].infTier > 0,
      },
      {
        desc: 'Dark Creature',
        value: () => formatNumber((0.0075 * enemy.value.darkEnemyLoot[0]), true),
        color: 'red',
        req: () => dimensions.value[13].infTier > 0,
      },
      {
        desc: 'Quasar Core [Event Horizon]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(2)? divineSkills.value[2].values[0]: 0), true),
        color: '#00fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Quasar Core [Singularity Destruction]',
        value: () => formatNumber( (hero.value.selectedDivSkills.includes(8)? divineSkills.value[8].values[0]: 0), true),
        color: '#00fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      { desc: `Total`, value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPenalty > 0 || hero.value.mainInfTier >= 20 },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.infPenalty, true),
        color: 'gold',
        req: () => hero.value.infPenalty > 0 || hero.value.mainInfTier >= 20,
      },
      { desc: `Singularity Levels`, value: '', color: '#a4ffe1',  uppercase: true, req: () => hero.value.singularityLevels > 0 },
      {
        desc: 'Singularity Challenges',
        value: () => formatNumber(25 * (hero.value.singularity), true),
        color: '#a4ffe1',
        req: () => hero.value.singularity > 0,
      },
      {
        desc: 'Singularity Pts',
        value: () => formatNumber(Math.floor((hero.value.rebirthPts >= 4.5e5? Math.log(hero.value.rebirthPts + 3) ** 1.906: 0)), true),
        color: '#a4ffe1',
        req: () => hero.value.rebirthPts >= 4.5e5
      },
       {
        desc: 'Black Hole',
        value: () => 75 * hero.value.bhTier,
        color: '#a4ffe1',
        req: () => hero.value.bhTier > 0
      },
      { desc: `Total`, value: '', color: 'gold',  uppercase: true, req: () => hero.value.singularityLevels > 0 },
      {
        desc: 'Total',
        value: () => hero.value.singularityLevels,
        color: 'gold',
        req: () => hero.value.singularityLevels > 0,
      },
    ],
  },
  {
    title: 'IP',
    id: 'only ip',
    content: [
      { desc: 'IP', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Infinity Challenges',
        value: () => (hero.value.infPointsGoals),
        color: 'gold',
        req: () => hero.value.infPointsGoals > 0,
      },
      {
        desc: 'Mirror of the Infinity',
        value: () => (enemy.value.dangerEnemyLoot[1]),
        color: 'gold',
        req: () => enemy.value.dangerEnemyLoot[1] > 0,
      },
      {
        desc: 'Secrets',
        value: () => (Object.values(hero.value.secrets).filter(v => v).length * 20),
        color: 'orange',
        req: () => Object.values(hero.value.secrets).some(v => v),
      },
      {
        desc: 'Discord support',
        value: () => (400),
        color: 'blue',
        req: () => true,
      },
      {
        desc: 'Space Ring [Prefix]',
        value: () => (hero.value.eqUpsMult['spRing'].infPoints),
        color: 'gold',
        req: () => spaceShop.value[10].status,
      },
      { desc: 'TOTAL IP', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => (hero.value.infPointsGoals + enemy.value.dangerEnemyLoot[1] + 400 + Object.values(hero.value.secrets).filter(v => v).length * 20 + hero.value.eqUpsMult['spRing'].infPoints),
        color: 'gold',
        req: () => true,
      },
      { desc: 'IP MULT', value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPointsMult > 1 },
      {
        desc: 'Base',
        value: 1,
        color: '',
        req: () => hero.value.infPointsMult > 1,
      },
      {
        desc: 'Singularity Challenges',
        value: () => formatNumber(0.05 * hero.value.singularity, true),
        color: '#66ffcc',
        req: () => hero.value.singularity > 0,
      },
       {
        desc: 'Singularity Pts',
        value: () => formatNumber(hero.value.rebirthPts >= 5e6? Math.log(hero.value.rebirthPts)*0.015: 0, true),
        color: '#a4ffe1',
        req: () => hero.value.rebirthPts > 5e6,
      },
       {
        desc: 'Dimension creature',
        value: () => formatNumber(enemy.value.dEnemyLoot[4]*0.01, true),
        color: '#b51fb5',
        req: () => enemy.value.dEnemyLoot[4] > 0,
      },
       {
        desc: 'Dimension [JK-λbYX] [22]',
        value: () => formatNumber(dimensions.value[22].infTier >= dimensions.value[22].maxInfTier?hero.value.mainInfTier * 0.01: 0, true),
        color: '#f84bf9',
        req: () => dimensions.value[22].infTier >= dimensions.value[22].maxInfTier
      },
      {
        desc: 'Ascension [TIER-D]',
        value: () => formatNumber((ascenPerks[60].level? infGoals.value.map(g => g.tier == g.maxTier).length * 0.01: 0), true),
        color: 'lightblue',
        req: () => dimensions.value[9].infTier >= dimensions.value[9].maxInfTier
      },
      {
        desc: 'Quasar Core [Dark Power]',
        value: () => formatNumber((hero.value.dId.startsWith('d-') && hero.value.selectedDivSkills.includes(9) && hero.value.overcorruption >= 10? divineSkills.value[9].values[0]: 0), true),
        color: '#00fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Black Hole',
        value: () => formatNumber(0.05 * hero.value.bhTier, true),
        color: '#00fdff',
        req: () => hero.value.bhTier > 0,
      },
      {
        desc: 'Transcendence [MAIN]',
        value: () => formatNumber((hero.value.bhTier >= 4 && hero.value.dId == 'main'? 0.005 * hero.value.transcendence: 0), true),
        color: '#00fdff',
        req: () => hero.value.bhTier >= 4,
      },
      {
        desc: 'Transcendence [BLACK HOLE]',
        value: () => formatNumber((hero.value.bhTier >= 4 && hero.value.dId == 'bh'? 0.005 * hero.value.transcendenceBH: 0), true),
        color: '#00fdff',
        req: () => hero.value.bhTier >= 4,
      },
      { desc: 'IP MULT TOTAL', value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPointsMult > 1 },
       {
        desc: 'Total',
        value: () => formatNumber(hero.value.infPointsMult, true),
        color: 'gold',
        req: () => hero.value.infPointsMult > 1,
      },
      { desc: 'IP Penalty', value: '', color: 'red',  uppercase: true, req: () => hero.value.mainInfTier >= 50 },
      {
        desc: 'Quasar Core [Event Horizon]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(2)? divineSkills.value[2].values[1]: 1), true),
        color: 'red',
        req: () => hero.value.mainInfTier >= 50,
      },
      { desc: 'IP TOTAL', value: '', color: 'gold',  uppercase: true, req: () => hero.value.infPoints > 0 },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.infPoints, true),
        color: 'gold',
        req: () => hero.value.infPoints > 0
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
        value: () => formatNumber(Math.log(hero.value.stage + 5)**4, true),
        color: '',
        req: () => true,
      },
      {
        desc: 'Tree [Wisdom]',
        value: () => formatNumber(1 + (perks.value[3].value * perks.value[3].level * 0.01), true),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Ring',
        value: () => formatNumber(equipment[3].tiers[hero.value.equipmentTiers['ring']].bonus.expMult, true),
        color: '#66ffcc',
        req: () => true,
      },
      {
        desc: 'Ring [Enhances]',
        value: () => formatNumber(hero.value.eqUpsMult['ring'].bonus, true),
        color: '#66ffcc',
        req: () => true,
      },
      {
        desc: 'Ascension [Blacksmithing Experience]',
        value: () => formatNumber((1 + 0.05 * (hero.value.equipmentTiers['sword'] + hero.value.equipmentTiers['armor'] + 
        hero.value.equipmentTiers['boots'] + hero.value.equipmentTiers['ring']) * ascenPerks[6].level), true),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'BUFF: Traveller [T3]',
        value: () => ((hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 3: 1)),
        color: 'orange',
        req: () => true,
      },
      {
        desc: 'Souls [Loot]',
        value: () => formatNumber((enemy.value.soulBuff.active? enemy.value.soulBuff.drop: 1), true),
        color: '#ed14ed',
        req: () => true,
      },
     {
        desc: 'Souls',
        value: () => formatNumber(
          (1 + Math.min(
            hero.value.souls,
            40 + (Math.max(hero.value.infTier, hero.value.mainInfTier) >= 6 ? 40 : 0)
          ) * (0.1 + (hero.value.soulTier >= 3 ? 0.05 : 0))),
          true
        ),
        color: '#ed14ed',
        req: () => true,
      },
      {
        desc: 'BUFF: Overkill [T4]',
        value: () => formatNumber(
          (
            hero.value.activeBuffs.includes(7) &&
            buffs.value[7].tier >= 4
          )
            ? (hero.value.overkill * 0.1 +
              (dimensions.value[19].infTier >= dimensions.value.maxInfTier ? 0.05 : 0))
            : 1,
          true
        ),
        color: 'orange',
        req: () => true,
      },
      {
        desc: 'Curse [Bonus]',
        value: () => formatNumber(1 + hero.value.cursedBonusExp, true),
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Boss [Loot]',
        value: () => formatNumber(enemy.value.boss.isBoss? enemy.value.boss.drop: 1, true),
        color: 'red',
        req: () => true,
      },
      {
        desc: 'Rebirth',
        value: () => (hero.value.rebirthPts >= 5? 2: 1),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Space',
        value: () => formatNumber(hero.value.sp >= 11? Math.min(1.025 * hero.value.sp, 5): 1, true),
        color: 'orange',
        req: () => true,
      },
      {
        desc: 'Ascension Soul [Loot]',
        value: () => formatNumber((enemy.value.ascensionSoul.active? enemy.value.ascensionSoul.stats: 1), true),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Rebirth [Loot]',
        value: () => (enemy.value.rebirthEnemy["drop"]),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: '#82eb26',
        req: () => true,
      },
       {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'lightblue',
        req: () => hero.value.mainInfTier >= 1,
      },
      {
        desc: 'Dimension [S5-Ω3t] [5]',
        value: () => formatNumber(Math.max(1 + (hero.value.unlimitLevel - 700) / 100, 1), true),
        color: '#ed14ed',
        req: () => hero.value.unlimitLevel > 700,
      },
      {
        desc: 'Dimension [S5-Ω3t] [5] [Infinity Bonus]',
        value: () => (hero.value.dId == 'unlimitted'? 2.25 ** Math.max(Math.floor(Math.max(hero.value.unlimitLevel - 1000, 0) / 500), 0): 1),
        color: '#ed14ed',
        req: () => hero.value.unlimitLevel > 700,
      },
      {
        desc: `Infinity`,
        value: () => formatNumber(
          (hero.value.mainInfTier >= 1 || hero.value.level >= 700)
            ? ((1.06 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / (Math.sqrt(hero.value.infPoints + 1) + Math.log(hero.value.infPoints + 2))) *
            (hero.value.rebirthPts >= 3.5e5 && hero.value.eLevel > 700? Math.sqrt(Math.log(hero.value.rebirthPts + 3))/2: 1) * 
            (hero.value.dId == 'unlimitted'? Math.max((Math.E * dimensions.value[38].infTier) ** 0.6, 1): 1))
            : 0, true),
        color: 'gold',
        req: () => hero.value.mainInfTier > 0,
      },
      {
        desc: 'Curse [T5]',
        value: () => (hero.value.curset5? 2: 1),
        color: ' #a4ffe1',
        req: () => hero.value.singularity >= 8,
      },
      {
        desc: 'Quasar Core [Stellar Equilibrium]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(1)? divineSkills.value[1].values[1]: 1), true),
        color: '#04fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Quasar Core [Quasar Radiance]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(7)? divineSkills.value[7].values[1]: 1), true),
        color: '#04fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Enemy Buff [Traveller]',
        value: () => formatNumber((enemy.value.buffs.includes(3)? 3: 1), true),
        color: 'red',
        req: () => hero.value.darkId.includes('d-noBuffs'),
      },
      {
        desc: 'Curse [Perdition of Ferocity]',
        value: () => formatNumber((enemy.value.buffs.includes(3)? 3: 1), true),
        color: 'red',
        req: () => hero.value.mainInfTier >= 70,
      },
      {
        desc: 'Quasar Core [Destruction of the continuum] [^]',
        value: () => formatNumber(
          hero.value.selectedDivSkills.includes(13) 
            ? divineSkills.value[13].values[0] 
            : 1, 
          true
        ),
        color: '#04fdff',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalExp),
        color: 'gold',
      },
      { desc: `Infinity [T${hero.value.infTier}]`, value: '', color: 'gold',  uppercase: true, },
      {
        desc: `Penalty [^]`,
        value: () => Math.max(Math.min(1 - 0.02 * hero.value.infTier + hero.value.infPenalty, 1), 0).toFixed(2),
        color: 'gold',
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalExp ** Math.max(Math.min(1 - 0.02 * hero.value.infTier + hero.value.infPenalty, 1), 0)),
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
        value: () => formatNumber(
          hero.value.activeBuffs.includes(7) && buffs.value[7].tier >= 4
            ? hero.value.overkill * (
                0.1 * (dimensions.value[19].infTier == dimensions.value.maxInfTier ? 0.05 : 0)
              )
            : 1,
          true
        ),
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
        value: () => formatNumber(Math.sqrt(Math.log(Math.min(hero.value.stage + 2, 300)) ** (Math.min(hero.value.stage, 300)/7)) * Math.max(1 + hero.value.maxLevel / 100, 7), true),
        color: '',
      },
      {
        desc: 'BUFF: Traveller [T3]',
        value: () => (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 3? 1.5: 1),
        color: 'orange',
      },
      {
        desc: 'Soul [Loot]',
        value: () => formatNumber(enemy.value.soulBuff.active? Math.min(enemy.value.soulBuff.drop, 5): 1, true),
        color: '#ed14ed',
        req: () => enemy.value.soulBuff.active
      },
      {
        desc: 'Boss [Loot]',
        value: () => formatNumber(enemy.value.boss.isBoss? Math.min(Math.max(enemy.value.boss.drop ** 0.75, 1), 10): 1, true),
        color: 'red',
        req: () => enemy.value.boss.isBoss
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
        desc: 'Dimension [5] [Penalty] [^]',
        value: () => formatNumber((hero.value.dId == 'unlimitted'? 0.8: 1), true),
        color: 'red',
        req: () => hero.value.dId == 'unlimitted',
      },
       {
        desc: 'Dimension [32] [Buff] [Traveller]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'lightblue',
        req: () => dimensions.value[32].infTier >= 8
      },
      {
        desc: 'Infinity',
        value: () => formatNumber(hero.value.mainInfTier >= 3? ((1.045 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1))): 1, true),
        color: '#66ffcc',
        req: () => hero.value.mainInfTier >= 3,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
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
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.shardsPerformMult, true),
        color: 'gold',
      },
      { desc: 'Ascension Soul', value: '', color: 'lightblue',  uppercase: true, },
      {
        desc: 'Base',
        value: () => formatNumber(Math.sqrt(Math.log(Math.min(hero.value.stage + 2, 300)) ** (Math.min(hero.value.stage, 300)/7)) * Math.max(1 + hero.value.maxLevel / 100, 7), true),
        color: '',
      },
      {
        desc: 'Formation [T4]',
        value: () => (hero.value.activeFormation == 3? 2: 1),
        color: 'yellow',
      },
      {
        desc: 'Danger',
        value: () => formatNumber(enemy.value.danger >= 20? enemy.value.dangerEnemyChance[4] ** 0.35: 1, true),
        color: 'lightgreen',
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(Math.sqrt(Math.log(Math.min(hero.value.stage + 2, 300)) ** (Math.min(hero.value.stage, 300)/7)) * Math.max(1 + hero.value.maxLevel / 100, 7) * (hero.value.activeFormation == 3? 2: 1) * (enemy.value.danger >= 20? enemy.value.dangerEnemyChance[4] ** 0.35: 1), true),
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
        value: () => formatNumber((perks.value[14].level? 1 + 0.2 * perks.value[14].level: 1), true),
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
    id: 'only buff exp',
    content: [
      { desc: 'BUFF EXP', value: '', color: 'orange',  uppercase: true, },
      {
        desc: 'Base [Curse Bonuses]',
        value: () => formatNumber(hero.value.cursedBonusExp * 50, true),
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
        req: () => hero.value.mainInfTier >= 4
      },
      {
        desc: 'Dimension [QZ-µaTT] [11]',
        value: () => formatNumber((1.15 ** (dimensions.value[11].infTier - 5)), true),
        color: '#db16db',
        req: () => dimensions.value[11].infTier > 0
      },
      {
        desc: 'Dimension [KL-σrXZ] [13] [Penalty]',
        value: () => (hero.value.dId == 'hard'? 0: 1),
        color: 'red',
        req: () => hero.value.dId == 'hard'
      },
      {
        desc: 'Abyss [Penalty]',
        value: () => (hero.value.isAbyss? 0: 1),
        color: '#e184ed',
      },
      {
        desc: 'Quasar Core [Quasar Radiance] [Penalty]',
        value: () => formatNumber(hero.value.selectedDivSkills.includes(7)? divineSkills.value[7].values[1]: 1, true),
        color: 'red',
        req: () => hero.value.dId == 'hard'
      },
      {
        desc: 'Perdition of Poverty [Penalty]',
        value: () => (hero.value.dId == 'hard'? 0: 1),
        color: 'red',
        req: () => hero.value.mainInfTier >= 80
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
    id: 'only curse',
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
        value: () => formatNumber(hero.value.spCount >= 15 && hero.value.abyssDStages >= 50? 1 + 0.005 * Math.min(hero.value.abyssDStages - 49, 100): 1, true),
        color: '#ed14ed',
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => (hero.value.rebirthTier >= 10? 1.5: 1) ,
        color: 'lightgreen',
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
        desc: 'Quasar Core [Quasar Shackles]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(0)? divineSkills.value[0].values[1]: 1), true),
        color: '#37dbd9',
        req: () => hero.value.mainInfTier >= 50
      },
      {
        desc: 'Quasar Core [Fluctuation Failures]',
        value: () => formatNumber(hero.value.selectedDivSkills.includes(10)? divineSkills.value[10].values[1]: 1, true),
        color: '#37dbd9',
        req: () => hero.value.mainInfTier >= 50
      },
      {
        desc: 'Enemy [Buff] [Traveller] [Penalty]',
        value: () => formatNumber((enemy.value.buffs.includes(3)? 3: 1), true),
        color: 'red',
        req: () => enemy.value.buffs.includes(3)
      },
      { desc: 'Total', value: '', color: 'red',  uppercase: true, },
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
    id: 'only stardust',
    content: [
      { desc: 'Stardust', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: () => formatNumber(Math.max(1.0525 ** (hero.value.stage - hero.value.stardustStage), 0), true),
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
        req: () => hero.value.mainInfTier >= 5
      },
      {
        desc: 'Abyss D',
        value: () => formatNumber((hero.value.spCount >= 15 && hero.value.abyssDStages >= 60? (1 + 0.05 * (hero.value.abyssDStages - 59)): 1), true),
        color: '#ed14ed',
      },
      {
        desc: 'Tree',
        value: () => formatNumber((1 + perks.value[17].level * 0.01), true),
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
        req: () => hero.value.singularity >= 8,
      },
      {
        desc: 'Infinity',
        value: () => formatNumber((hero.value.mainInfTier >= 18? (1.0145 + (hero.value.mainInfTier >= 25? 0.0035: 0)) ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints)): 0), true),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 18
      },
      {
        desc: 'Souls',
        value: () => formatNumber(enemy.value.soulBuff.stardust, true),
        color: 'purple',
        req: () => hero.value.mainInfTier >= 5
      },
      {
        desc: 'Buff [Traveller] [T4]',
        value: () => formatNumber(hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 4? 2: 1, true),
        color: 'orange',
        req: () => dimensions.value[32].infTier >= 8
      },
      {
        desc: 'Astralis',
        value: () => formatNumber((spaceShop.value[0].status? 1 + 0.1 * hero.value.spsCountMax: 1), true),
        color: 'gold',
        req: () => spaceShop.value[0].status
      },
      {
        desc: 'Dark Creature',
        value: () => formatNumber((1 + 0.05 * enemy.value.darkEnemyLoot[6]), true),
        color: 'red',
        req: () => enemy.value.darkEnemyLoot[6] > 0
      },
      {
        desc: 'Dimension [37]',
        value: () => formatNumber(Math.max((Math.E * dimensions.value[37].infTier) ** 0.4, 1), true),
        color: 'purple',
        req: () => dimensions.value[37].infTier > 0
      },
      {
        desc: 'Infinity [Penalty]',
        value: () => formatNumber((!hero.value.infProgress? 1 / (1 + 0.2 * Math.max(hero.value.infTier - 20, 0)): 1), true),
        color: 'red',
        req: () => !hero.value.infProgress
      },
      {
        desc: 'Enemy [Buff] [Traveller] [Penalty]',
        value: () => formatNumber(enemy.value.buffs.includes(3)? 2: 1, true),
        color: 'red',
        req: () => enemy.value.buffs.includes(3)
      },
      {
        desc: 'Perdition of Poverty [Penalty] [^]',
        value: () => formatNumber(cursed[17].loot, true),
        color: 'red',
        req: () => hero.value.mainInfTier >= 80
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.stardustInfo, true),
        color: 'gold',
      },
      { desc: 'Stardust [Stage]', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Total',
        value: () => hero.value.stardustStage,
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
        desc: 'Amount of Mutations',
        value: () => (hero.value.mutations + (hero.value.infTier >= 4? 1: 0)),
        color: '#66ff66',
        req: () => true
      },
      {
        desc: 'Mutagen [^2.5]',
        value: () => formatNumber((hero.value.mutations + (hero.value.infTier >= 4? 1: 0)) ** 2.5, true),
        color: '#66ff66',
        req: () => true
      },
      {
        desc: 'Radiation',
        value: () => formatNumber(1.025 ** radPerks[4].level, true),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Ascension [Loot]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: '#66ffcc',
        req: () => true
      },
      {
        desc: 'Infinity [T40]',
        value: () => formatNumber(1 + ascenPerks[34].level * 0.01, true),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 40,
      },
      {
        desc: 'Buff [Traveller] [T4]',
        value: () => (hero.value.activeBuffs.includes(2) && buffs.value[2].tier >= 4? 2: 1),
        color: 'orange',
        req: () => dimensions.value[32].infTier >= 8
      },
      {
        desc: 'Quasar Core [Quasar Radiance]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(7)? divineSkills.value[7].values[1]: 1), true),
        color: 'red',
        req: () => hero.value.mainInfTier >= 50,
      },
      {
        desc: 'Curse [T5]',
        value: () => (hero.value.curset5? 2: 1),
        color: '#a4ffe1',
        req: () => hero.value.singularity >= 8
      },
      {
        desc: 'Infinity [Penalty]',
        value: () => formatNumber(!hero.value.infProgress? 1 / (1 + 0.05 * Math.max(hero.value.infTier - 25, 0)): 1, true),
        color: 'red',
        req: () => !hero.value.infProgress
      },
       {
        desc: 'Enemy [Buff] [Traveller]',
        value: () => formatNumber((enemy.value.buffs.includes(3)? 2: 1), true),
        color: 'red',
        req: () => enemy.value.buffs.includes(3),
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.currentMutagen, true),
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
        desc: 'Rebirth [Pts]',
        value: () => (hero.value.rebirthPts >= 3? 10: 0) + (hero.value.rebirthPts >= 75? 10: 0) + (hero.value.rebirthPts >= 250? 10: 0) + 
        (hero.value.rebirthPts >= 5000? 10: 0) + (hero.value.rebirthPts >= 17500? 10: 0) + (hero.value.rebirthPts >= 60000? 10: 0),
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
        value: () => (hero.value.infTier >= 3 && hero.value.rebirthTier >= 30? Math.floor(1.053 ** Math.min(hero.value.rebirthTier, 80)): 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Ω-Infinity',
        value: () => (enemy.value.dangerEnemyLoot[0]),
        color: 'yellow',
        req: () => enemy.value.dangerEnemyLoot[0] > 0
      },
      {
        desc: 'Tree',
        value: () => (perks.value[18].level),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Infinity',
        value: () => Math.floor(hero.value.infPoints / (250 - ((hero.value.mainInfTier >= 25? 0.0035: 0) > 0? 20: 0))),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 25
      },
      {
        desc: 'Dimension [10]',
        value: () => (6 * (dimensions.value[10].infTier - 10)),
        color: '#6a0dad',
        req: () => dimensions.value[10].infTier > 0,
      },
      {
        desc: 'Singularity Pts',
        value: () => (hero.value.rebirthPts >= 5e5? 30: 0),
        color: ' #a4ffe1',
        req: () => hero.value.rebirthPts >= 5e5,
      },
      {
        desc: 'Dark Creature',
        value: () => (enemy.value.darkEnemyLoot[4]),
        color: 'red',
        req: () => enemy.value.darkEnemyLoot[4] > 0,
      },
      {
        desc: 'Space Ring [Suffix]',
        value: () => (hero.value.eqUpsMult['spRing'].potential),
        color: ' #a4ffe1',
        req: () => spaceShop.value[11].status,
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.potential),
        color: 'gold',
        req: () => true
      },
    ],
  },
  {
    title: 'Danger',
    id: 'only danger',
    content: [
      { desc: 'MAX Danger', value: '', color: 'red',  uppercase: true, req: () => true },
      {
        desc: 'Base',
        value: 100,
        color: '',
        req: () => true
      },
      {
        desc: 'Infinity [T4]',
        value: 100,
        color: 'gold',
        req: () => hero.value.mainInfTier >= 4,
      },
      {
        desc: 'Ascension [Void Hazard]',
        value: () => (ascenPerks[40].level? 100: 0),
        color: 'lightblue',
        req: () => true
      },
      {
        desc: 'Infinity',
        value: () =>  (hero.value.mainInfTier >= 16? Math.floor(hero.value.infPoints / (15 - ((hero.value.mainInfTier >= 25? 0.0035: 0) > 0? 1: 0))): 0),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 16
      },
      {
        desc: 'Singularity Pts',
        value: () =>  Math.floor(hero.value.rebirthPts >= 2e6? Math.log(hero.value.rebirthPts) ** 2: 0),
        color: '#a4ffe1',
        req: () => hero.value.rebirthPts >= 2e6,
      },
       {
        desc: 'Ascension [Void Hazard [T2]]',
        value: () => hero.value.dangerStage * 2,
        color: 'lightblue',
        req: () => true
      },
       {
        desc: 'Dimension [BZ-ΦeLL] [15]',
        value: () => formatNumber(Math.floor(1.45 ** Math.max(dimensions.value[15].infTier - 10, 10)), true),
        color: '#6a0dad',
        req: () => dimensions.value[15].infTier > 0
      },
      {
        desc: 'Space',
        value: () => (hero.value.spCount >= 38? hero.value.sp: 0),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Quasar Core',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(12)? Math.floor(divineSkills.value[12].values[0]): 0), true),
        color: 'orange',
        req: () => hero.value.mainInfTier >= 50,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true},
      {
        desc: 'Total',
        value: () => formatNumber(radPerks[10].max, true),
        color: 'gold',
        req: () => true
      },
      { desc: 'Danger Power', value: '', color: 'gold',  uppercase: true, },
      {
        desc: 'Base',
        value: () => hero.value.baseDangerPower.toFixed(3),
        color: '',
      },
      {
        desc: 'Abyss D [^]',
        value: () => formatNumber((hero.value.abyssDStages >= 140 && hero.value.spCount >= 15
          ? (100 - Math.sqrt(hero.value.abyssDStages - 139)) * 0.01
          : 1), true),
        color: 'purple',
        req: () => hero.value.abyssDStages >= 140
      },
       
       {
        desc: 'Quasar Core [Doomflare] [^]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(12)? divineSkills.value[12].values[1]: 1), true),
        color: '#66ffcc',
        req: () => hero.value.mainInfTier >= 50
      },
       {
        desc: 'Dimension [31] [^]',
        value: () => formatNumber((1 - 0.01 * dimensions.value[31].infTier), true),
        color: 'purple',
        req: () => dimensions.value[31].infTier > 0
      },
       {
        desc: 'Quasar Core [Anti-Radiation] [^]',
        value: () => formatNumber((hero.value.selectedDivSkills.includes(14)? divineSkills.value[14].values[0]: 1), true),
        color: '#66ffcc',
        req: () => hero.value.mainInfTier >= 50
      },
       {
        desc: 'Ascension [TIER-D] [^]',
        value: () => formatNumber(1 - 0.01 * Math.floor(Math.log10(Math.max(hero.value.mutagen, 10))), true),
        color: 'lightblue',
        req: () => dimensions.value[34].infTier >= 9
      },
      {
        desc: 'Astralis [/]',
        value: () => formatNumber((Math.E * hero.value.spsCountMax) ** 1.45, true),
        color: 'gold',
        req: () => spaceShop.value[6].status
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true},
      {
        desc: 'Total',
        value: () => formatNumber(enemy.value.enemyPower, true),
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
      { desc: 'ApS', value: '', color: 'orange',  uppercase: true, req: () => true},
      {
        desc: 'Base',
        value: () => formatNumber(0.5 + (hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 1? 0.5: 0), true),
        color: '',
        req: () => true
      },
      {
        desc: 'Tree',
        value: () => formatNumber(perks.value[5].value * perks.value[5].level, true),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Tree [Radiation]',
        value: () => formatNumber(hero.value.radAPS, true),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Boots',
        value: () => formatNumber(equipment[2].tiers[hero.value.equipmentTiers['boots']].bonus.speed, true),
        color: '#22cccc',
        req: () => true
      },
      {
        desc: 'Boots [Enhances]',
        value: () => formatNumber(hero.value.eqUpsMult['boots'].bonus, true),
        color: '#22cccc',
        req: () => true
      },
      {
        desc: 'BUFF: Combo [T4]',
        value: () => formatNumber((buffs.value[3].combo == 100? 0.3: 0), true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'BUFF: Conquer [T3]',
        value: () => formatNumber((hero.value.activeBuffs.includes(8) && buffs.value[8].tier >= 3? 0.1 * Math.floor(buffs.value[8].time/250): 0), true),
        color: 'orange',
        req: () => true
      },
       {
        desc: 'BUFF: Charge',
        value: () => formatNumber((0.1 * buffs.value[6].charges.power), true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'BUFF: Flash [T2]',
        value: () => formatNumber(hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 2? Math.min(Math.floor(hero.value.spCount / 6) * 0.1, 0.5): 0, true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'BUFF: Flash [T3]',
        value: () => formatNumber(hero.value.activeBuffs.includes(14) && buffs.value[14].tier >= 3? Math.min(hero.value.stage * 0.01, 1): 0, true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'BUFF: Fast Slash',
        value: () => formatNumber(hero.value.activeBuffs.includes(5)? buffs.value[5].debuff: 0, true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Dimension [39]',
        value: () => formatNumber(dimensions.value[39].infTier * 0.1, true),
        color: 'purple',
        req: () => dimensions.value[39].infTier > 0
      },
      {
        desc: 'Dimension [39] [Trial]',
        value: () => formatNumber(hero.value.dId == 'd-noAps'? 0.0125 * hero.value.stage * Math.sqrt(Math.log(3 + dimensions.value[39].infTier) ** 1.5): 0, true),
        color: 'red',
        req: () => hero.value.dId == 'd-noAps'
      },
      {
        desc: 'Black Hole [T2] [Trial]',
        value: () => formatNumber(1 - (hero.value.bhTier >= 3? Math.max(Math.min(hero.value.bhTier ** 1.75, 100), 1) : 1) * 0.01, true),
        color: 'red',
        req: () => hero.value.dId == 'bh'
      },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.totalAPS, true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Current',
        value: () => formatNumber(hero.value.attacksPerSecond, true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'MAX APS',
        value: () => hero.value.maxAPS,
        color: 'red',
        req: () => true
      },
    ],
  },
  {
    title: 'Rush',
    id: 'rush',
    content: [
      { desc: 'Stage Rush', value: '', color: 'blue',  uppercase: true, },
      { desc: 'Stage Rush - Increases your stage while your stage is below x% of max Stage ', value: '', color: 'blue',  uppercase: false, },
      { desc: '[Max: 75%]', value: '', color: 'blue',  uppercase: false, },
      {
        desc: 'Infinity [T2]',
        value: () => (hero.value.infEvents >= 2 || hero.value.infTier >= 2? 0.25: 0),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 2
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (hero.value.rebirthPts >= 20000? 0.15: 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Singularity',
        value: () => formatNumber(0.02 * hero.value.singularity, true),
        color: 'rayn',
        req: () => hero.value.singularity > 0
      },
      {
        desc: 'Black Hole',
        value: () => formatNumber(0.05 * hero.value.bhTier, true),
        color: 'rayn',
        req: () => hero.value.bhTier > 0,
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.lacrimose * 100, true),
        color: 'gold',
        req: () => true
      },
      { desc: 'Level Rush', value: '', color: 'blue',  uppercase: true, },
      { desc: 'Level Rush - Increases your level while your level is below x% of max level', value: '', color: 'blue',  uppercase: false, },
      { desc: '[Max: 75%]', value: '', color: 'blue',  uppercase: false, },
      {
        desc: 'Radiation Tree Perk',
        value: () => formatNumber((perks.value[3].status? 0.1 + 0.01 * (dimensions.value[40].infTier - 40): 0), true),
        color: 'green',
        req: () => true
      },
      {
        desc: 'Souls',
        value: () => (hero.value.soulsMax >= 40? 0.1: 0),
        color: 'purple',
        req: () => true
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => (hero.value.rebirthPts >= 70000? 0.1: 0),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Singularity',
        value: () => formatNumber(0.02 * hero.value.singularity, true),
        color: 'rayn',
        req: () => hero.value.singularity > 0
      },
      {
        desc: 'Black Hole',
        value: () => formatNumber(0.05 * hero.value.bhTier, true),
        color: 'rayn',
        req: () => hero.value.bhTier > 0
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.levelRush * 100, true),
        color: 'gold',
        req: () => true
      },
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
        value: () => formatNumber((hero.value.spCount >= 22? 1.002 ** hero.value.sp - 1: 0), true),
        color: 'orange',
        req: () => true
      },
      {
        desc: 'Radiation',
        value: () => formatNumber((radPerks[11].level? 0.01 * Math.floor((hero.value.maxStage-5)/5): 0), true),
        color: 'green',
        req: () => true
      },
      {
        desc: 'Abyss D',
        value: () => formatNumber((hero.value.spCount >= 15 && hero.value.abyssDStages >= 40? (1 - (1 / (Math.sqrt(hero.value.abyssDStages - 39) ** 0.15))): 0), true),
        color: 'purple',
        req: () => true
      },
      {
        desc: 'Infinity',
        value: () => formatNumber(hero.value.infCorruption, true),
        color: 'gold',
        req: () => true
      },
      {
        desc: 'Rebirth Tier',
        value: () => formatNumber((hero.value.rebirthTier >= 70? (1.02 ** Math.sqrt(hero.value.rebirthTier) - 1): 0), true),
        color: 'lightgreen',
        req: () => true
      },
      {
        desc: 'Dimension [22]',
        value: () => formatNumber(((dimensions.value[22].infTier - 25) * 0.1), true),
        color: 'purple',
        req: () => dimensions.value[22].infTier > 0,
      },
      {
        desc: 'Dimension [26]',
        value: () => formatNumber((dimensions.value[26].infTier * 0.2), true),
        color: 'purple',
        req: () => dimensions.value[26].infTier > 0
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.overcorruption, true),
        color: 'gold',
        req: () => true
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
        value: () => formatNumber((hero.value.stage > 9? 1.34: 1.15 + 0.02 * hero.value.stage), true),
        color: '',
        req: () => true
      },
      {
        desc: 'Tree',
        value: () => formatNumber(perks.value[10].value * perks.value[10].level, true),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Ascension',
        value: () => formatNumber((ascenPerks[15].level == 1? 0.01: 0), true),
        color: 'lightblue',
        req: () => true,
      },
      {
        desc: 'Soul [Tier]',
        value: () => formatNumber((hero.value.soulTier >= 2? 0.01: 0), true),
        color: 'purple',
        req: () => true,
      },
      {
        desc: 'Rebirth [Tier]',
        value: () => formatNumber((hero.value.rebirthPts >= 125? 0.01: 0), true),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Rebirth [Pts]',
        value: () => formatNumber((hero.value.rebirthPts >= 22500? 0.01: 0), true),
        color: 'lightgreen',
        req: () => true,
      },
      {
        desc: 'Space',
        value: () => formatNumber((hero.value.spCount >= 16? 0.01: 0), true),
        color: 'orange',
        req: () => hero.value.spaceUnlocked || hero.value.mainInfTier > 0
      },
      {
        desc: 'Abyss D',
        value: () => formatNumber((hero.value.spCount >= 15 && hero.value.abyssDStages >= 70? 0.01 * (1.01 * Math.log(hero.value.abyssDStages - 67)): 0), true),
        color: 'purple',
        req: () => hero.value.spCount >= 15 ||  hero.value.mainInfTier > 0
      },
      {
        desc: 'Dimension [3]',
        value: () => formatNumber((dimensions.value[3].infTier * 0.01), true),
        color: 'purple',
        req: () => dimensions.value[3].infTier > 0,
      },
      {
        desc: 'Boots [Suffix]',
        value: () => formatNumber(hero.value.eqUpsMult['boots'].stage, true),
        color: 'yellow',
        req: () => hero.value.eqUpsMult['boots'].stage > 0 || hero.value.mainInfTier >= 10,
      },
      {
        desc: 'Dimension [3] [Penalty]',
        value: () => formatNumber((hero.value.dId == 'overkill'? 0.1: 0), true),
        color: 'red',
        req: () => dimensions.value[3].infTier > 0 || hero.value.dId == 'overkill',
      },
      { desc: 'Total', value: '', color: 'gold',  uppercase: true, req: () => true },
      {
        desc: 'Total',
        value: () => formatNumber(hero.value.stageReq, true),
        color: 'gold',
        req: () => true,
      },
      { desc: 'Hardcap', value: '', color: 'red',  uppercase: true,req: () => true },
      {
        desc: 'Total',
        value: 1.05,
        color: 'gold',
        req: () => true,
      },
      { desc: 'Additional scaling [MULT]', value: '', color: 'gold',  uppercase: true, req: () => hero.value.mainInfTier >= 7 },
      {
        desc: 'Infinity [T7]',
        value: () => formatNumber(
          hero.value.mainInfTier >= 7
            ? Math.max(1 / 1.03 ** (hero.value.infPoints / Math.sqrt(hero.value.infPoints + 1)), 0.01)
            : 1,
          true
        ),
        color: 'gold',
        req: () => hero.value.mainInfTier >= 7,
      },
    ]
  }
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

.update-section { border : 1px solid gold }
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

</style>
