import { ref } from "vue";

export const perks = ref([
  {
    id: 0,
    name: "Strength",
    description: "+1.01 MULT DMG per level",
    value: 1.01,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [20, 40, 60, 80, 100, 120, 140],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 5,
    infThreshold: 100,
    infStatus: true,
    tpSpend: {
      inf: 0,
      base: 0,
    },
    kills: 0,
    system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
    },
  },
  {
    id: 1,
    name: "Endurance",
    description: "+1% Max HP per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [10, 20, 30, 40, 50, 60, 70],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 45,
    infThreshold: 50,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 2,
    name: "Solid Body",
    description: "+5% DEF per level",
    value: 5,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [10, 15, 20, 25, 30, 35, 40, 45],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 63,
    infThreshold: 50,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 3,
    name: "Wisdom",
    description: "+2% EXP per level",
    value: 2,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [20, 40, 60, 80, 100, 120, 140, 160],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 7,
    infThreshold: 100,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 4,
    name: "Extra Level",
    description: "+1 Max Level per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [10, 15, 20, 25, 30, 35, 40, 45],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 15,
    infThreshold: 100,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 5,
    name: "Racer",
    description: "+0.1 Attack Speed per level",
    value: 0.1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [1, 2, 3, 4, 5, 6, 7, 8],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 200,
    infThreshold: 10,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
    system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 6,
    name: "Invisible",
    description: "Unlock new BUFF",
    value: 0,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [1, 1, 1, 1, 1, 1, 1, 1],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 0,
    infStatus: false,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
    type: 'buff'
  },
  {
    id: 7,
    name: "CRIT",
    description: "+1% Crit per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 5, 10, 15, 20, 25, 30, 35],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 50,
    infThreshold: 50,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 8,
    name: "CRIT DMG",
    description: "+0.025 Crit DMG per level",
    value: 0.025,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 10, 20, 30, 40, 50, 60],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 35,
    infThreshold: 50,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
  },
  {
    id: 9,
    name: "Traveller",
    description: "Unlock new BUFF",
    value: 0,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 1, 1, 1, 1, 1, 1],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 0,
    infStatus: false,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
},
    type: 'buff',
  },
  {
    id: 10,
    name: "Conquer",
    description: "Stage scaling better per level",
    value: 0.01,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 1, 2, 3, 4, 5, 6, 7],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 200,
    infThreshold: 5,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 11,
    name: "Reset",
    description: "Faster recovery from death per level",
    value: 0.25,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 1, 2, 3, 4, 5, 6],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 50,
    infThreshold: 10,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 12,
    name: "Only Up",
    description: "+1 Min Level per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 5, 10, 15, 20],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 35,
    infThreshold: 50,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 13,
    name: "The Lord",
    description: "Soul appearance chance scales with unspent points",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 1, 1, 1, 1],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 0,
    infStatus: false,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 14,
    name: "Gift",
    description: "+1.2 MULT Rebirth Points per level",
    value: 1.2,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 1, 2, 3, 4],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 200,
    infThreshold: 10,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 15,
    name: "Treasure",
    description: "+1.05 MULT Equipment Drop Chance per level",
    value: 1.05,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 0, 0, 50, 75],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 35,
    infThreshold: 100,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 16,
    name: "Mastery",
    description: "+25% Skill EXP MULT per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 0, 0, 1, 1],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 500,
    infThreshold: 10,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 17,
    name: "Harvest",
    description: "+1% Stardust Drop per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 0, 0, 100, 150],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 20,
    infThreshold: 50,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  },
  {
    id: 18,
    name: "Inner Spark",
    description: "+1 Potential per level",
    value: 1,
    level: {
      inf: 0,
      base: 0,
    },
    maxLevel: [0, 0, 0, 0, 0, 30, 40],
    status: ['base'],
    currentStatus: 'base',
    baseCost: 50,
    infThreshold: 25,
    infStatus: true,
    block: false,
    tpSpend: {
      inf: 0,
      base: 0,
    },
 system: {
      prioritize: 9,
      levelCondition: 0,
      block: false
}
  }
]);
