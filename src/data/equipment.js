// equipment.js

export const equipment = [
  {
    type: 'sword',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, multDmg: 1 } },
      { tier: 1, name: 'Rusty Sword', bonus: { cap: 1, multDmg: 1.1 } },
      { tier: 2, name: 'Iron Sword', bonus: { cap: 2, multDmg: 1.2 } },
      { tier: 3, name: 'Steel Blade', bonus: { cap: 4, multDmg: 1.3 } },
      { tier: 4, name: 'Knight’s Edge', bonus: { cap: 6, multDmg: 1.5 } },
      { tier: 5, name: 'Hero’s Fang', bonus: { cap: 9, multDmg: 1.7 } },
      { tier: 6, name: 'Obsidian Cutter', bonus: { cap: 13, multDmg: 2.0 } },
      { tier: 7, name: 'Inferno Blade', bonus: { cap: 18, multDmg: 2.3 } },
      { tier: 8, name: 'Celestial Greatsword', bonus: { cap: 22, multDmg: 2.6} },
      { tier: 9, name: 'Celestial Greatsword [T1]-', bonus: { cap: 26, multDmg: 2.9 } },
      { tier: 10, name: 'Celestial Greatsword [T2]-', bonus: { cap: 31, multDmg: 3.2 } },
      { tier: 11, name: 'Celestial Greatsword [T3]-', bonus: { cap: 36, multDmg: 3.5 } },
      { tier: 12, name: 'Celestial Greatsword [T4]-', bonus: { cap: 42, multDmg: 3.8 } },
      { tier: 13, name: 'Celestial Greatsword [T5]-', bonus: { cap: 49, multDmg: 4.1 } },
      { tier: 14, name: 'Celestial Greatsword [T6]-', bonus: { cap: 60, multDmg: 4.4 } },
      { tier: 15, name: 'Celestial Greatsword [T7]-', bonus: { cap: 72, multDmg: 5 } },
      { tier: 16, name: 'Celestial Greatsword [T8]-', bonus: { cap: 83, multDmg: 5.3 } },
      { tier: 17, name: 'Celestial Greatsword [T9]-', bonus: { cap: 95, multDmg: 5.6 } },
      { tier: 18, name: 'Celestial Greatsword [T10]-', bonus: { cap: 108, multDmg: 5.9 } },
      { tier: 19, name: 'Celestial Greatsword [T11]-', bonus: { cap: 123, multDmg: 6.2 } },
      { tier: 20, name: 'Celestial Greatsword [T12]-', bonus: { cap: 135, multDmg: 6.5 } },
      { tier: 21, name: 'THE ETERNITY BRIGHT', bonus: { cap: 147, multDmg: 6.8 } },
      { tier: 22, name: 'THE ETERNITY BRIGHT [T1]', bonus: { cap: 164, multDmg: 7.1 } },
      { tier: 23, name: 'THE ETERNITY BRIGHT [T2]', bonus: { cap: 181, multDmg: 7.4 } },
      { tier: 24, name: 'THE ETERNITY BRIGHT [T3]', bonus: { cap: 203, multDmg: 7.7 } },
      { tier: 25, name: 'THE ETERNITY BRIGHT [T4]', bonus: { cap: 224, multDmg: 8 } },
      { tier: 26, name: 'THE ETERNITY BRIGHT [T5]', bonus: { cap: 243, multDmg: 8.3 } },
      { tier: 27, name: 'THE ETERNITY BRIGHT [T6]', bonus: { cap: 265, multDmg: 8.6 } }
    ]
  },
  {
    type: 'armor',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, hp: 0 } },
      { tier: 1, name: 'Cloth Armor', bonus: { cap: 2, hp: 20 } },
      { tier: 2, name: 'Leather Armor', bonus: { cap: 4, hp: 50 } },
      { tier: 3, name: 'Chainmail', bonus: { cap: 7, hp: 90 } },
      { tier: 4, name: 'Scale Armor', bonus: { cap: 10, hp: 150 } },
      { tier: 5, name: 'Reinforced Armor', bonus: { cap: 14, hp: 280 } },
      { tier: 6, name: 'Knight’s Plate', bonus: { cap: 18, hp: 450 } },
      { tier: 7, name: 'Dragonhide Armor', bonus: { cap: 23, hp: 740 } },
      { tier: 8, name: 'Eternal Armor', bonus: { cap: 28, hp: 1150 } },
      { tier: 9, name: 'Celestial Armor ', bonus: { cap: 35, hp: 2150 } },
      { tier: 10, name: 'Celestial Armor [T1]', bonus: { cap: 51, hp: 3850 } },
      { tier: 11, name: 'Celestial Armor [T2]', bonus: { cap: 72, hp: 6850 } },
    ]
  },
  {
    type: 'boots',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, speed: 0 } },
      { tier: 1, name: 'Worn Slippers', bonus: { cap: 1, speed: 0.1 } },
      { tier: 2, name: 'Leather Boots', bonus: { cap: 2, speed: 0.2 } },
      { tier: 3, name: 'Scout Boots', bonus: { cap: 3, speed: 0.3 } },
      { tier: 4, name: 'Swiftstride', bonus: { cap: 5, speed: 0.4 } },
      { tier: 5, name: 'Battle Boots', bonus: { cap: 6, speed: 0.5 } },
      { tier: 6, name: 'Ranger’s Tread', bonus: { cap: 8, speed: 0.55 } },
      { tier: 7, name: 'Phantom Boots', bonus: { cap: 9, speed: 0.6 } },
      { tier: 8, name: 'Ethereal Boots', bonus: { cap: 11, speed: 0.65 } },
      { tier: 9, name: 'Celestial Boots', bonus: { cap: 14, speed: 0.7 } },
      { tier: 10, name: 'Celestial Boots [T1]', bonus: { cap: 18, speed: 0.75 } },
      { tier: 11, name: 'Celestial Boots [T2]', bonus: { cap: 25, speed: 0.8 } },
    ]
  },
  {
    type: 'ring',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, expMult: 1 } },
      { tier: 1, name: 'Novice Ring', bonus: { cap: 3, expMult: 1.1 } },
      { tier: 2, name: 'Bronze Ring', bonus: { cap: 6, expMult: 1.25 } },
      { tier: 3, name: 'Silver Ring', bonus: { cap: 10, expMult: 1.4 } },
      { tier: 4, name: 'Gemmed Ring', bonus: { cap: 15, expMult: 1.7 } },
      { tier: 5, name: 'Enchanted Ring', bonus: { cap: 21, expMult: 1.95 } },
      { tier: 6, name: 'Mystic Band', bonus: { cap: 28, expMult: 2.5 } },
      { tier: 7, name: 'Ring of Stars', bonus: { cap: 36, expMult: 3.1 } },
      { tier: 8, name: 'Divine Halo', bonus: { cap: 45, expMult: 4.8 } },
      { tier: 9, name: 'Celestial Ring', bonus: { cap: 45, expMult: 6.5 } },
      { tier: 10, name: 'Celestial Ring [T1]', bonus: { cap: 45, expMult: 8.4 } },
      { tier: 11, name: 'Celestial Ring [T2]', bonus: { cap: 45, expMult: 10.5 } },
    ]
  },
  {
    type: 'spRing',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, minLevel: 0 } },
      { tier: 1, name: 'Comet Ring ', bonus: { cap: 10, minLevel: 2 } },
      { tier: 2, name: 'Comet Ring ', bonus: { cap: 11, minLevel: 2 } },
      { tier: 3, name: 'Comet Ring ', bonus: { cap: 12, minLevel: 3 } },
      { tier: 4, name: 'Comet Ring ', bonus: { cap: 13, minLevel: 3 } },
      { tier: 5, name: 'Comet Ring ', bonus: { cap: 14, minLevel: 3 } },
      { tier: 6, name: 'Comet Ring ', bonus: { cap: 15, minLevel: 4 } },
      { tier: 7, name: 'Comet Ring ', bonus: { cap: 16, minLevel: 4 } },
      { tier: 8, name: 'Comet Ring ', bonus: { cap: 17, minLevel: 4 } },
      { tier: 9, name: 'Comet Ring ', bonus: { cap: 18, minLevel: 4 } },
      { tier: 10, name: 'Comet Ring ', bonus: { cap: 19, minLevel: 5 } },
      { tier: 11, name: 'Comet Ring ', bonus: { cap: 20, minLevel: 5 } },
      { tier: 12, name: 'Comet Ring ', bonus: { cap: 21, minLevel: 5 } },
      { tier: 13, name: 'Comet Ring ', bonus: { cap: 22, minLevel: 5 } },
      { tier: 14, name: 'Comet Ring ', bonus: { cap: 23, minLevel: 5 } },
    ]
  }
];
