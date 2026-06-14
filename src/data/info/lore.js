export const loreSection = [
    {
      title: 'Mysterious Message',
      id: 0,
      author: 'Ancient Notes',
      location: 'Level 1',
      visible: true,
      locked: false, 
      content: [
        `Do you realize how powerful you are? Traveling between Dimensions, destroying Galaxies and Celestials.`,
        `But what you may not know is that <span class="rainbow-text">[D-Rule]</span> is watching you, and when you are weak enough, he will destroy you, because only one can be the Chosen One.`,
        `Ask me when you find me between all these dimensions.`
      ],
      condition: (ctx) => true,
    },
    {
      title: 'Ancient Note I',
      id: 1,
      author: 'Ancient Notes',
      location: 'Infinity [T1]',
      visible: true,
      locked: true, 
      content: [
        `It was a time when chaos was part of every creature in the entire world.  
        Every race was searching for a place of peace and existence.  
        The fate of every creature was in their own hands, but no one could do anything about it in the face of death itself.
        `
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 1,
    },
    {
      title: 'Ancient Note II',
      id: 2,
      author: 'Ancient Notes',
      location: 'Infinity [T3]',
      visible: true,
      locked: true, 
      content: [
        `One of the most powerful races, humans, could not avoid the total destruction of their kind. 
        Watching the collapse of the imperium, they set out in search of a safer place to prolong their fragile existence.
        `
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 3,
    },
    {
      title: 'Ancient Note III',
      id: 3,
      author: 'Ancient Notes',
      location: 'Infinity [T5]',
      visible: true,
      locked: true, 
      content: [
        `A thousand astronomical units passed until humanity found a small corner at the edge of the universe. 
        This place was the very image of calm and serenity, untouched by chaos-absolute harmony and purity. 
        It was a sign, a sign that it was time for humanity to return, to return and recreate the imperium anew.
        .`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 5,
    },
    {
      title: 'Ancient Note IV',
      id: 4,
      author: 'Ancient Notes',
      location: 'Infinity [T8]',
      visible: true,
      locked: true, 
      content: [
        `Humanity-perhaps one of the most primitive, and at the same time the most tenacious and adaptive races-when placed 
        in favorable conditions, recovered from the collapse of the imperium and prepared for new conquests. 
        Or so they thought...
        .`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 8,
    },
    {
      title: 'Ancient Note V',
      id: 5,
      author: 'Ancient Notes',
      location: 'Infinity [T10]',
      visible: true,
      locked: true, 
      content: [
        `At the dawn of existence, when galaxies were forming and dimensions were uniting, and life was just beginning to emerge,
         beings not bound by any law or time existed and manifested themselves-indescribable in a single word, 
         as if these beings were the law itself, standing at the pinnacle of the entire world.
        .`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 10,
    },
    {
      title: 'Ancient Note VI',
      id: 6,
      author: 'Ancient Notes',
      location: 'Dimension [R0-X9a] [2] [T5]',
      visible: true,
      locked: true, 
      content: [
        `Clumps of inexplicable energy in different colors moved and radiated an unfathomable power. 
        After a short time, the purple essence spread across the sky and began to speak in human language.
        .`
      ],
      condition: (ctx) => ctx.d[2].infTier >= 5,
    },
    {
      title: 'Ancient Note VII',
      id: 7,
      author: 'Ancient Notes',
      location: 'Dimension [K7-D4n] [3] [T8]',
      visible: true,
      locked: true, 
      content: [
        `"Humanity-observing one of the superior races is quite pleasant for a creature like me. However, 
        I must point out that your presence here is unforgivable, and I would even say impossible. 
        And yet, your emergence is the result of our impossible mistake".
        .`
      ],
      condition: (ctx) => ctx.d[3].infTier >= 8,
    },
    {
      title: 'Ancient Note VIII',
      id: 8,
      author: 'Ancient Notes',
      location: 'Dimension [K7-D4n] [1] [T2]',
      visible: true,
      locked: true, 
      content: [
        `"This place is the stronghold of our creation. As incomprehensible and wondrous as we are, it was never 
        intended for this place to be filled with beings of living matter. 
        Our law is not to interfere with the lives of lesser races-this is a taboo, a decree, a rule, call it what you will, 
        but one we must observe".
        .`
      ],
      condition: (ctx) => ctx.d[1].infTier >= 2,
    },
    {
      title: 'Ancient Note IX',
      id: 9,
      author: 'Ancient Notes',
      location: 'Dimension [M2-Λ1s] [4] [T5]',
      visible: true,
      locked: true, 
      content: [
        `"Your existence here violates the harmony and balance of this fragile world. 
        No one can ever escape chaos. Whether you live or die, the fate of races must follow its own path, 
        and the paradox in which you now find yourself corrupts the universal formula of this entire world".
        .`
      ],
      condition: (ctx) => ctx.d[4].infTier >= 5,
    },
    {
      title: 'Ancient Note X',
      id: 10,
      author: 'Ancient Notes',
      location: 'Dimension [V6-B3n] [6] [T15]',
      visible: true,
      locked: true, 
      content: [
        `"Therefore, as beings of a higher order, for our mistake, we grant you-humanity-one astronomical unit of time 
        to leave this place. To return to the open world, the one from which you came. 
        Understand: the transfer of our creation into your dimension could lead to the death of an entire race, 
        which is unacceptable to us. And yet, there will always be victims. 
        Remember: not a single creature has ever escaped chaos. 
        So it is, so it was, and so it shall be. This is the essence of the entire world".
        .`
      ],
      condition: (ctx) => ctx.d[6].infTier >= 15,
    },
    {
      title: 'Ancient Note XI',
      id: 11,
      author: 'Ancient Notes',
      location: 'Dimension [DD-zΘaYY] [9] [T4]',
      visible: true,
      locked: true, 
      content: [
        `The culmination of humanity’s efforts was the creation of a perfect being, forged with all the technologies they 
        possessed. Its purpose was to find a suitable place for the continued existence of humanity. 
        Yet everyone understood that, after the fall of the imperium, humanity would once again be reduced to mere survival.
        They had only one chance, and they chose to stake everything upon it.
        .`
      ],
      condition: (ctx) => ctx.d[9].infTier >= 4,
    },
    {
      title: 'Ancient Note XII',
      id: 12,
      author: 'Ancient Notes',
      location: 'Dimension [QZ-µaTT] [11] [T15]',
      visible: true,
      locked: true, 
      content: [
        `Clumps of inexplicable energy in different colors moved and radiated an unfathomable power. 
        After a short time, the purple essence spread across the sky and began to speak in human language.
        .`
      ],
      condition: (ctx) => ctx.d[11].infTier >= 15,
    },
    {
      title: 'Message',
      id: 13,
      author: '[D-Infinity]',
      location: 'Infinity [T10]',
      visible: true,
      locked: true, 
      content: [
        `Your pathetic attempts to scuttle like a rat through my domain are beginning to irritate me. `
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 10
    },
    {
      title: 'Message',
      id: 14,
      author: '[D-Infinity]',
      location: 'Infinity [T20]',
      visible: true,
      locked: true, 
      content: [
        `If a lower being like you does not know its place, it must be destroyed according to the laws of this world.`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 20
    },
    {
      title: 'Message',
      id: 15,
      author: '[D-Infinity]',
      location: 'Infinity [T40]',
      visible: true,
      locked: true, 
      content: [
        `And if you are so confident in your powers, do not dare to die quickly - I want to see you suffer.`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 40
    },
    {
      title: 'Message',
      id: 16,
      author: '[D-Infinity]',
      location: 'Infinity [T60]',
      visible: true,
      locked: true, 
      content: [
        `No, no. Give me more time and I can destroy him. I won't be able to bear this corruption in my aspect. It will destroy everything I've worked so hard to build.`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 60
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
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 6
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
      ],
      condition: (ctx) => ctx.hero.singularity > 0
    },
     {
      title: 'Message',
      id: 19,
      author: '[D-Gravity]',
      location: 'Singularity [T2]',
      visible: true,
      locked: true, 
      content: [
        `The shackles of this world are gradually falling away-do you feel it too? 
        .`
      ],
      condition: (ctx) => ctx.hero.singularity > 1
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
      ],
      condition: (ctx) => ctx.hero.singularity > 2
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
      ],
      condition: (ctx) => ctx.hero.singularity > 3
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
      ],
      condition: (ctx) => ctx.hero.singularity > 4
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
      ],
      condition: (ctx) => ctx.hero.singularity > 5
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
      ],
      condition: (ctx) => ctx.hero.singularity > 6
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
      ],
      condition: (ctx) => ctx.hero.singularity > 7
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
      ],
      condition: (ctx) => ctx.hero.rebirthPts >= 1e7
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
      ],
      condition: (ctx) => ctx.hero.bhTier >= 1
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
      ],
      condition: (ctx) => ctx.hero.bhTier >= 2
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
        That singularity of energies will become both a new beginning and a new end.`
      ],
      condition: (ctx) => ctx.hero.bhTier >= 3
    },
    {
      title: 'Message',
      id: 30,
      author: '[D-Corruption]',
      location: 'Infinity [T60]',
      visible: true,
      locked: true, 
      content: [
        `[D-Infinity] can't destroy such a small creature. The time has come for me to unveil my eternal self.`
      ],
      condition: (ctx) => ctx.hero.mainInfTier >= 60
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 1
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 2
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 3
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 4
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 5
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 6
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 7
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
      ],
      condition: (ctx) => ctx.d[31].infTier >= 8
    },
    {
      title: 'Message',
      id: 39,
      author: '[D-Ultimatum]',
      location: 'Dimension [Ω LD-δrAK] [38] Infinity [T1]',
      visible: true,
      locked: true, 
      content: [
        `What audacity-and at the same time, what courage-to challenge something so utterly incomprehensible.`
      ],
      condition: (ctx) => ctx.d[38].infTier >= 1
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
      ],
      condition: (ctx) => ctx.d[38].infTier >= 3
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
      ],
      condition: (ctx) => ctx.d[38].infTier >= 6
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
      ],
      condition: (ctx) => ctx.d[38].infTier >= 10
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
      ],
      condition: (ctx) => ctx.d[38].infTier >= 12
    },
    {
      title: 'Message',
      id: 44,
      author: '[D-Ultimatum]',
      location: 'Dimension [Ω LD-δrAK] [38] Infinity [T15]',
      visible: true,
      locked: true, 
      content: [
        `Your existence is alluring to the forces of disorder that threaten this fragile balance. I will await you in my dimension - if, of course, you dare to come.`
      ],
      condition: (ctx) => ctx.d[38].infTier >= 15
    },
    {
      title: 'Message',
      id: 45,
      author: '[D-Gravity]',
      location: 'Black Hole [T4]',
      visible: true,
      locked: true, 
      content: [
        `It is time to learn how to control time. Be prepared - it will take no less than an eternity. 
        I'm not happy with what I did to the ancient titans. So I decided to show you the truth. It doesn't justify my actions, but at least it will make me feel a little better.`
      ],
      condition: (ctx) => ctx.hero.bhTier >= 4
    },
    {
      title: 'Ancient Note XIII',
      id: 46,
      author: 'Ancient Notes',
      location: 'Dimension [BZ-ΦeLL] [15] [T20]',
      visible: true,
      locked: true, 
      content: [
        `The entire technology of the human race set forth through the dying world of chaos, 
        overcoming powerful beings and uncontrollable laws, poisoned yet driven by the 
        last chance for humanity - a chance for existence.`
      ],
      condition: (ctx) => ctx.d[15].infTier >= 20
    },
    {
      title: 'Ancient Note XIV',
      id: 47,
      author: 'Ancient Notes',
      location: 'Dimension [HZ-βcTR] [19] [T25]',
      visible: true,
      locked: true, 
      content: [
        `It could be described in no other way than as a gift from a great being who 
        guided mankind and left subtle hints. Yet one could only 
        grasp a single truth: either there truly is a benevolent being in this world… 
        or this being requires something of us.`
      ],
      condition: (ctx) => ctx.d[19].infTier >= 25
    },
    {
      title: 'Ancient Note XV',
      id: 48,
      author: 'Ancient Notes',
      location: 'Dimension [YY-θsJP] [18] Stage: 101',
      visible: true,
      locked: true, 
      content: [
        `Long before the journey began, enclosed within the life-support capsule, a single phrase echoed in my mind: 
        find me among all these dimensions.`
      ],
      condition: (ctx) => ctx.hero.abyssDStages > 100
    },
    {
      title: 'Ancient Note XVI',
      id: 49,
      author: 'Ancient Notes',
      location: 'Dimension [DV-χuQZ] [20] [T20]',
      visible: true,
      locked: true, 
      content: [
        `Gazing upon the lifeless surroundings, the absolute emptiness of space, one cannot help but believe 
        that it was not always so - or at least, we wanted to believe.`
      ],
      condition: (ctx) => ctx.d[20].infTier >= 20
    },
    {
      title: 'Ancient Note XVII',
      id: 50,
      author: 'Ancient Notes',
      location: 'Dimension [KL-σrXZ] [13] [T25]',
      visible: true,
      locked: true, 
      content: [
        `No one can say when it began - when new life ceased to emerge, when the lands stopped yielding crops, 
         when planets stopped being born. One can only say this:
         the catharsis of all life can arise so suddenly that we do not even notice it.`
      ],
      condition: (ctx) => ctx.d[13].infTier >= 25
    },
    {
      title: 'Ancient Note XVIII',
      id: 51,
      author: 'Ancient Notes',
      location: 'Dimension [JK-λbYX] [22] [T35]',
      visible: true,
      locked: true, 
      content: [
        `What is chaos? It is difficult to define in a single word. It is more like the 
        state of our world: a world that walks in the footsteps of death. Lifeless and empty, 
        a world torn by fluctuations and black holes. The absolute harmony of emptiness.`
      ],
      condition: (ctx) => ctx.d[22].infTier >= 35
    },
    {
      title: 'Ancient Note XIX',
      id: 52,
      author: 'Ancient Notes',
      location: 'Dimension [Et-n1t1] [24]',
      visible: true,
      locked: true, 
      content: [
        `The energy of this place feels different, 
        and yet that voice in my head grows stronger. Perhaps I am on the right path.`
      ],
      condition: (ctx) => ctx.d[22].infTier >= 35 && ctx.d[13].infTier >= 25 && ctx.hero.mainInfTier >= 35
    },
    {
      title: 'Message',
      id: 53,
      author: '[D-Gravity]',
      location: 'Black Hole [T5]',
      visible: true,
      locked: true, 
      content: [
        `Understand my aspect of reality. That way, you can become stronger and avoid the mistakes I made.`
      ],
      condition: (ctx) => ctx.hero.bhTier >= 5
    },
    {
      title: 'Ancient Note XX',
      id: 55,
      author: 'Ancient Notes',
      location: 'Dimension [Ω DR-σvTH] [26] [T1]',
      visible: true,
      locked: true, 
      content: [
        `[D-Corruption] is one of the most ancient supreme beings. 
        Its influence spreads across all possible dimensions, yet its true habitat remains unknown to others. 
        The only thing worth understanding is this:
         its mere presence alone can plunge the entire world into the abyss of corruption.`
      ],
      condition: (ctx) => ctx.d[26].infTier >= 1
    },
    {
      title: 'Ancient Note XXI',
      id: 56,
      author: 'Ancient Notes',
      location: 'Dimension [Ω NX-λrAZ] [28] [T1]',
      visible: true,
      locked: true, 
      content: [
        `It is unknown when or how *Doom* appeared here.
         Ancient notes speak of the experiments of supreme beings, 
         seeking to create a vessel for controlling dark energy.`
      ],
      condition: (ctx) => ctx.d[28].infTier >= 1
    },
    {
      title: 'Ancient Note XXII',
      id: 57,
      author: 'Ancient Notes',
      location: 'Dimension [Ω VL-χtAR] [31] [T1]',
      visible: true,
      locked: true, 
      content: [
        `If you ask who holds greater power, everyone will answer the same: power 
        belongs to the one who commands all creatures.
        Yet in the pursuit of truth, the greatest danger is becoming such a creature yourself.`
      ],
      condition: (ctx) => ctx.d[31].infTier >= 1
    },
    {
      title: 'Ancient Note XXIII',
      id: 58,
      author: 'Ancient Notes',
      location: 'Dimension [Ω TH-μrAK] [34] [T1]',
      visible: true,
      locked: true, 
      content: [
        `Ancient records of explorers describe shards of dimensions as remnants of a once-mighty world that
         possessed intelligence. Now, only broken shards remain-each carrying immense power within itself`
      ],
      condition: (ctx) => ctx.d[34].infTier >= 1
    },
    {
      title: 'Ancient Note XXIV',
      id: 59,
      author: 'Ancient Notes',
      location: 'Dimension [Ω TH-μrAK] [34] [T5]',
      visible: true,
      locked: true, 
      content: [
        `Every being in existence felt the echo of a battle in this place, a clash between [D-Gravity] and an ancient entity. 
         consequence was nothing less than the annihilation of an entire dimension.`
      ],
      condition: (ctx) => ctx.d[34].infTier >= 5
    },
    {
      title: 'Ancient Note XXV',
      id: 60,
      author: 'Ancient Notes',
      location: 'Dimension [Ω TH-μrAK] [34] [T10]',
      visible: true,
      locked: true, 
      content: [
        `The Ancient Titans were among the few who could rival the powers of the laws. Their strength was as old as their very existence. 
        Traces of their power - or of their disappearance - are nearly impossible to find.`
      ],
      condition: (ctx) => ctx.d[34].infTier >= 10
    },
    {
      title: 'Ancient Note XXV',
      id: 61,
      author: 'Ancient Notes',
      location: 'Dimension [Ω TH-μrAK] [34] [T15]',
      visible: true,
      locked: true, 
      content: [
        `The Ancient Titans were among the few who could rival the powers of the laws. Their strength was as old as their very existence. 
        Traces of their power - or of their disappearance - are nearly impossible to find.`
      ],
      condition: (ctx) => ctx.d[34].infTier >= 15
    },
    {
      title: 'Ancient Note XXVI',
      id: 62,
      author: 'Ancient Notes',
      location: 'Dimension [Ω TH-μrAK] [34] [T20]',
      visible: true,
      locked: true, 
      content: [
        `The Ancient Titans were not only majestic, but also the very first who can grasp the essence of the laws’ power - long before their feud with the [D-Overlords].
        .`
      ],
      condition: (ctx) => ctx.d[34].infTier >= 20
    },
    {
      title: 'Ancient Note XXVII',
      id: 63,
      author: 'Ancient Notes',
      location: 'Dimension [Ω LD-δrAK] [38] [T1]',
      visible: true,
      locked: true, 
      content: [
        `There exists a creature, granted absolute freedom and a vile nature. Never accept its bargains-if you value your life.
        .`
      ],
      condition: (ctx) => ctx.d[38].infTier >= 1
    },
    {
      title: 'Ancient Note',
      id: 64,
      author: '[Timeline]',
      location: '[Epoch of Dawn]',
      visible: true,
      locked: true, 
      content: [
        `Since time immemorial, the ancient titans were powerful beings of this world. They were able to harness the meaning of laws and rule the worlds for millennia.`
      ],
      condition: (ctx) => ctx.hero.timelinePass[0]
    },
    {
      title: 'Ancient Note',
      id: 65,
      author: '[Timeline]',
      location: '[Era of Shadows]',
      visible: true,
      locked: true, 
      content: [
        `Overcoming the forces of dark energy, the titans expanded their power and became masters of worlds, destroying any creatures in their path.`
      ],
      condition: (ctx) => ctx.hero.timelinePass[1]
    },
    {
      title: 'Ancient Note',
      id: 66,
      author: '[Timeline]',
      location: '[Age of Titans]',
      visible: true,
      locked: true, 
      content: [
        `With these obstacles overcome, the Age of Titans arrived. All worlds were connected in a single construct of insurmountable law.`
      ],
      condition: (ctx) => ctx.hero.timelinePass[2]
    },
    {
      title: 'Ancient Note',
      id: 67,
      author: '[Timeline]',
      location: '[Cycle of Eternity]',
      visible: true,
      locked: true, 
      content: [
        `Nothing can exist forever. Time is merciless, even to great beings. New beings with unbridled power began to emerge, and thus began a race for rule over the howling world that would last for all eternity.`
      ],
      condition: (ctx) => ctx.hero.timelinePass[3]
    },
    {
      title: 'Ancient Note',
      id: 68,
      author: '[Timeline]',
      location: '[Singularity Era]',
      visible: true,
      locked: true, 
      content: [
        `With the arrival of the [D-Rulers], the titans vanished into oblivion. No trace of them remains except for a battle in a dimension [9], which, with its unbridled power, shattered an entire dimension into fragments.`
      ],
      condition: (ctx) => ctx.hero.timelinePass[4]
    },
    {
      title: 'Ancient Note',
      id: 69,
      author: '[D-Corruption]',
      location: 'Corruption Shards [2]',
      visible: true,
      locked: true, 
      content: [
        `The [D-Corruption] is one of the ancients. He was the first to appear, along with the [D-Gravity] and the [D-Time].`
      ],
      condition: (ctx) => ctx.hero.dims.corrShards >= 2
    },
    {
      title: 'Ancient Note',
      id: 70,
      author: '[D-Corruption]',
      location: 'Corruption Shards [6]',
      visible: true,
      locked: true, 
      content: [
        `Having mastered the foundations of corruption, he directed his power at dimensions that only a few could enter.
Life and death - for him, it makes no difference. Therefore, many dimensions were destroyed by his unbridled power.
Now it is an impassable death field, where corruption corrodes the very fabric of space.`
      ],
      condition: (ctx) => ctx.hero.dims.corrShards >= 6
    },
    {
      title: 'Ancient Note',
      id: 71,
      author: '[D-Corruption]',
      location: 'Corruption Shards [13]',
      visible: true,
      locked: true, 
      content: [
        `With his immense power, he can infiltrate the aspects of reality of other [D-Rulers].
The only ones he cannot contradict are the [D-Rule] and those with whom he appeared.`
      ],
      condition: (ctx) => ctx.hero.dims.corrShards >= 13
    },
    {
      title: 'Ancient Note',
      id: 72,
      author: '[D-Corruption]',
      location: 'Corruption Shards [16]',
      visible: true,
      locked: true, 
      content: [
        `By breaking the aspect of Infinity, he injected his power into the ruler of infinity, thereby allowing him to use his own power for further advancement.`
      ],
      condition: (ctx) => ctx.hero.dims.corrShards >= 16
    },
    {
      title: 'Ancient Note',
      id: 73,
      author: '[D-Corruption]',
      location: 'Corruption Shards [18]',
      visible: true,
      locked: true, 
      content: [
        `The [D-Corruption] and [D-Infinity] destroyed the essence of the [D-Eternity] and imprisoned him in a breach in the Void. If collects the fragments of corruption and directs them into the void, there is a chance to open a passage.`
      ],
      condition: (ctx) => ctx.hero.dims.corrShards >= 18
    },
    {
      title: 'Ancient Note',
      id: 73,
      author: '[D-Corruption]',
      location: 'Corruption Shards [19]',
      visible: true,
      locked: true, 
      content: [
        `I asked the [D-Gravity] to help me retrieve the last fragment of corruption, which is located near the [D-Corruption].
        [D-Corruption] cannot be destroyed, but I can delay him for a while.`
      ],
      condition: (ctx) => ctx.hero.dims.corrShards >= 19
    },
    {
      title: 'Ancient Note',
      id: 74,
      author: '[Void]',
      location: 'Void [Stage] [2]',
      visible: true,
      locked: true, 
      content: [
        `You were able to open a passage into the void. However, I am imprisoned in the very heart of this void. I will tell you the whole truth and the reason why I ended up here. And I will tell you about the [D-Rule]`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 2
    },
    {
      title: 'Ancient Note',
      id: 75,
      author: '[Void]',
      location: 'Void [Stage] [8]',
      visible: true,
      locked: true, 
      content: [
        `At the foundation of this world stood a rule. A rule that defined the very essence of the world. This rule is absolute even before the laws of this world. This rule is a concept, which is the [D-Rule].`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 8
    },
    {
      title: 'Ancient Note',
      id: 76,
      author: '[Void]',
      location: 'Void [Stage] [14]',
      visible: true,
      locked: true, 
      content: [
        `The ancient titans parodied the laws that revealed the secrets of this world. And having reached the point of no return, they uncovered the foundations of this rule, which had existed only as an idea.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 14
    },
    {
      title: 'Ancient Note',
      id: 77,
      author: '[Void]',
      location: 'Void [Stage] [17]',
      visible: true,
      locked: true, 
      content: [
        `This rule captured all dark energy and expanded its influence throughout the universe. Thus, the rule emerged as a concept for this world.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 17
    },
    {
      title: 'Ancient Note',
      id: 78,
      author: '[Void]',
      location: 'Void [Stage] [20]',
      visible: true,
      locked: true, 
      content: [
        `This concept proved far more powerful than the laws of the ancient titans. An unprecedented leap in power and understanding of the current world occurred.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 20
    },
    {
      title: 'Ancient Note',
      id: 79,
      author: '[Void]',
      location: 'Void [Stage] [25]',
      visible: true,
      locked: true, 
      content: [
        `Following this, other rulers began to appear. Having harnessed these concepts, they began to project their own aspects of reality and expand their influence.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 25
    },
    {
      title: 'Ancient Note',
      id: 80,
      author: '[Void]',
      location: 'Void [Stage] [30]',
      visible: true,
      locked: true, 
      content: [
        `And then came that very war between the ancient titans and the rulers, during which the ancient titans became a thing of the past.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 30
    },
    {
      title: 'Ancient Note',
      id: 81,
      author: '[Void]',
      location: 'Void [Stage] [40]',
      visible: true,
      locked: true, 
      content: [
        `I ended up here because I rebelled against the [D-Rule]. 
        My aspect of reality was destroyed, and I myself was imprisoned in the void. 
        I rebelled against him because I could not accept what he decided to do. 
        He decided to destroy the entire world, preserving only the most powerful beings of this world.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 40
    },
    {
      title: 'Ancient Note',
      id: 82,
      author: '[Void]',
      location: 'Void [Stage] [50]',
      visible: true,
      locked: true, 
      content: [
        `Only another rule can define a rule. You must become that rule. Find me, and I will teach you this.`
      ],
      condition: (ctx) => ctx.hero.void.stage >= 50
    },
    {
      title: 'Ancient Note',
      id: 90,
      author: '[D-Rule]',
      location: 'Void [T0]',
      visible: true,
      locked: true, 
      content: [
        `I don't know what that traitor told you. However, having traveled far, you have proven yourself worthy of my attention. Therefore, I will tell you the reason for my actions and my main goal.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 0 && ctx.hero.mainInfTier >= 100
    },
    {
      title: 'Ancient Note',
      id: 91,
      author: '[D-Rule]',
      location: 'Void [T1]',
      visible: true,
      locked: true, 
      content: [
        `Having understood the concept of this world, I also saw its true problem, which only I can see. This world began to collapse long before our arrival. Because this world has existed for too long, and we are on the threshold of its final breath.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 1
    },
    {
      title: 'Ancient Note',
      id: 92,
      author: '[D-Rule]',
      location: 'Void [T1]',
      visible: true,
      locked: true, 
      content: [
        `I decided that since I appeared at its end, my task was either to save it or to save its beings.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 1
    },
    {
      title: 'Ancient Note',
      id: 93,
      author: '[D-Rule]',
      location: 'Void [T2]',
      visible: true,
      locked: true, 
      content: [
        `Unfortunately, even my powers and the powers of all rulers are incapable of this. Therefore, I decided to remake my aspect of reality to fit a new world, one that only the worthy may enter.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 2
    },
    {
      title: 'Ancient Note',
      id: 94,
      author: '[D-Rule]',
      location: 'Void [T2]',
      visible: true,
      locked: true, 
      content: [
        `Why do I destroy the ancient titans? The ancient titans were forced into the annals of history. They refused to accept the new world built on their mistakes and thirst for power.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 2
    },
    {
      title: 'Ancient Note',
      id: 95,
      author: '[D-Rule]',
      location: 'Void [T3]',
      visible: true,
      locked: true, 
      content: [
        `I cannot and will not save your race. Because your race will bring no benefit to my world. My task as ruler is to take the most powerful beings with me to find a way to restore the old world.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 3
    },
    {
      title: 'Ancient Note',
      id: 96,
      author: '[D-Rule]',
      location: 'Void [T3]',
      visible: true,
      locked: true, 
      content: [
        `Therefore, you must decide: either you will come with me to the new world, or you will turn against me and be destroyed in the old one.`
      ],
      condition: (ctx) => ctx.hero.void.tier >= 3
    },
  ]