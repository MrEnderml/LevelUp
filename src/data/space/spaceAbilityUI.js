export const spaceAbilityUI = [
    {
      title: 'Combat Mechanics',
      unlock: 0,
      stats: [
        { key: 'fightCooldown', label: 'Time for battle' },
      ],
    },
  
    {
      title: 'Defense',
      unlock: 1,
      stats: [
        { key: 'defIgnore', label: 'Ignore DEF' },
        { key: 'defMult', label: 'Extra DEF Mult', reqIW: 70 },
        { key: 'lessDMGTaken', label: 'Less DMG Taken', reqIW: 20 },
        { key: 'lessDMGTakenFromCrits', label: 'Less DMG From Crits', reqIW: 50 },
      ],
    },
  
    {
      title: 'Life',
      unlock: 2,
      stats: [
        { key: 'hpRegen', label: 'HP Regen' },
        { key: 'lifeSteal', label: 'Life-Steal [Per Hit]', reqIW: 10 },
        { key: 'hpMult', label: 'Extra HP Mult', reqIW: 80 },
      ],
    },
  
    {
      title: 'Survival',
      unlock: 3,
      stats: [
        { key: 'blockChance', label: 'Block Chance' },
        { key: 'avoid', label: 'DMG Avoid', reqIW: 30 },
      ],
    },
  
    {
      title: 'Crit',
      unlock: 4,
      stats: [
        { key: 'critChance', label: 'Crit Chance' },
        { key: 'critDMG', label: 'Crit Damage' },
      ],
    },
  
    {
      title: 'Stun Threshold',
      unlock: 5,
      stats: [
        { key: 'stunChance', label: 'Stun Chance' },
        { key: 'stunDuration', label: 'Stun Duration' },
      ],
    },
  
    {
      title: 'APS',
      unlock: 6,
      stats: [
        { key: 'aps', label: 'APS Gain' },
        { key: 'maxAps', label: 'APS MAX', reqIW: 40 },
        { key: 'minAps', label: 'APS MIN', reqIW: 60 },
      ],
    },
  
    {
      title: 'Multi-Hit',
      unlock: 7,
      stats: [{ key: 'multiHit', label: 'Extra Hit Chance' }],
    },
  
    {
      title: 'Attack',
      unlock: 8,
      stats: [
        { key: 'hit', label: 'Accuracy' },
        { key: 'atkMult', label: 'Extra DMG Mult', reqIW: 90 },
      ],
    },
  ]