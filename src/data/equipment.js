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
      { tier: 9, name: 'Celestial Greatsword T[1]', bonus: { cap: 26, multDmg: 2.9 } },
      { tier: 10, name: 'Celestial Greatsword T[2]', bonus: { cap: 31, multDmg: 3.3 } },
      { tier: 11, name: 'Celestial Greatsword T[3]', bonus: { cap: 36, multDmg: 3.7 } },
      { tier: 12, name: 'Celestial Greatsword T[4]', bonus: { cap: 42, multDmg: 4.1 } },
      { tier: 13, name: 'Celestial Greatsword T[5]', bonus: { cap: 49, multDmg: 4.5 } },
      { tier: 14, name: 'Celestial Greatsword T[6]', bonus: { cap: 60, multDmg: 5.0 } },
      { tier: 15, name: 'Celestial Greatsword T[7]', bonus: { cap: 72, multDmg: 5.5 } },
      { tier: 16, name: 'Celestial Greatsword T[8]', bonus: { cap: 83, multDmg: 6 } },
      { tier: 17, name: 'Celestial Greatsword T[9]', bonus: { cap: 95, multDmg: 6.5 } },
      { tier: 18, name: 'Celestial Greatsword T[10]', bonus: { cap: 108, multDmg: 7 } },
      { tier: 19, name: 'Celestial Greatsword T[11]', bonus: { cap: 123, multDmg: 7.5 } },
      { tier: 20, name: 'Celestial Greatsword T[12]', bonus: { cap: 135, multDmg: 8 } },
      { tier: 21, name: 'THE ETERNITY BRIGHT', bonus: { cap: 200, multDmg: 10 } },
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
      { tier: 5, name: 'Reinforced Armor', bonus: { cap: 14, hp: 240 } },
      { tier: 6, name: 'Knight’s Plate', bonus: { cap: 18, hp: 350 } },
      { tier: 7, name: 'Dragonhide Armor', bonus: { cap: 23, hp: 540 } },
      { tier: 8, name: 'Eternal Armor', bonus: { cap: 28, hp: 850 } },
      { tier: 9, name: 'Celestial Armor ', bonus: { cap: 35, hp: 1250 } },
      { tier: 10, name: 'Celestial Armor T[1]', bonus: { cap: 51, hp: 1850 } },
      { tier: 11, name: 'Celestial Armor T[2]', bonus: { cap: 72, hp: 2850 } },
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
      { tier: 6, name: 'Ranger’s Tread', bonus: { cap: 8, speed: 0.6 } },
      { tier: 7, name: 'Phantom Boots', bonus: { cap: 9, speed: 0.8 } },
      { tier: 8, name: 'Ethereal Boots', bonus: { cap: 11, speed: 1.0 } },
      { tier: 8, name: 'Celestial Boots', bonus: { cap: 14, speed: 1.2 } },
      { tier: 8, name: 'Celestial Boots T[1]', bonus: { cap: 18, speed: 1.3 } },
      { tier: 8, name: 'Celestial Boots T[2]', bonus: { cap: 25, speed: 1.5 } },
    ]
  },
  {
    type: 'ring',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, expMult: 1 } },
      { tier: 1, name: 'Novice Ring', bonus: { cap: 3, expMult: 1.1 } },
      { tier: 2, name: 'Bronze Ring', bonus: { cap: 6, expMult: 1.25 } },
      { tier: 3, name: 'Silver Ring', bonus: { cap: 10, expMult: 1.4 } },
      { tier: 4, name: 'Gemmed Ring', bonus: { cap: 15, expMult: 1.6 } },
      { tier: 5, name: 'Enchanted Ring', bonus: { cap: 21, expMult: 1.85 } },
      { tier: 6, name: 'Mystic Band', bonus: { cap: 28, expMult: 2.2 } },
      { tier: 7, name: 'Ring of Stars', bonus: { cap: 36, expMult: 2.7 } },
      { tier: 8, name: 'Divine Halo', bonus: { cap: 45, expMult: 3.5 } },
      { tier: 8, name: 'Celestial Ring', bonus: { cap: 45, expMult: 3.5 } },
      { tier: 8, name: 'Celestial Ring T[1]', bonus: { cap: 45, expMult: 3.5 } },
      { tier: 8, name: 'Celestial Ring T[2]', bonus: { cap: 45, expMult: 3.5 } },
    ]
  },
  {
    type: 'extraRing',
    tiers: [
      { tier: 0, name: 'None', bonus: { cap: 0, minLevel: 1 } },
      { tier: 1, name: 'Space Ring ', bonus: { cap: 10, minLevel: 2 } },
      { tier: 2, name: 'Space Ring T[1]', bonus: { cap: 20, minLevel: 3 } },
      { tier: 3, name: 'Space Ring T[2]', bonus: { cap: 30, minLevel: 5 } },
      { tier: 4, name: 'Space Ring T[3]', bonus: { cap: 40, minLevel: 7 } },
      { tier: 5, name: 'Space Ring T[4]', bonus: { cap: 50, minLevel: 9 } },
      { tier: 6, name: 'Space Ring T[5]', bonus: { cap: 60, minLevel: 12 } },
      { tier: 7, name: 'Space Ring T[6]', bonus: { cap: 70, minLevel: 15 } },
      { tier: 8, name: 'Space Ring T[7]', bonus: { cap: 80, minLevel: 18 } },
    ]
  }
];
