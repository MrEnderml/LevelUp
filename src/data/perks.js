import { ref } from 'vue';

export const perks = ref([
    {
        id: 1,
        name: "Strength",
        description: "+1.01 MULT DMG",
        value: 1.01,
        level: 0,
        maxLevel: [20, 40, 60, 80, 100, 120, 140],
        status: false,
        kills: 0,
        baseCost: 10,
        infStatus: false,
        block: false,
    },
    {
        id: 2,
        name: "Endurance",
        description: "+10 HP",
        value: 10,
        level: 0,
        maxLevel: [10, 20, 30, 40, 50, 60, 70],
        status: false,
        buff: 1,
        baseCost: 7,
        infStatus: false,
        block: false,
    },
    {
        id: 3,
        name: "Solid Body",
        description: "+5% DEF ",
        value: 5,
        level: 0,
        maxLevel: [10, 15, 20, 25, 30, 35, 40, 45],
        status: false,
        baseCost: 21,
        infStatus: false,
        block: false,
    },
    {
        id: 4,
        name: "Wisdom",
        description: "+2% EXP",
        value: 2,
        level: 0,
        maxLevel: [20, 40, 60, 80, 100, 120, 140, 160],
        status: false,
        baseCost: 7,
        infStatus: false,
        block: false,
    },
    {
        id: 5,
        name: "Extra Level",
        description: "+1 MAX LEVEL",
        value: 1,
        level: 0,
        maxLevel: [10, 15, 20, 25, 30, 35, 40, 45],
        status: false,
        baseCost: 15,
        infStatus: false,
        block: false,
    },
    {
        id: 6,
        name: "Racer",
        description: "+0.1 ATTACK PER SECOND",
        value: 0.1,
        level: 0,
        maxLevel: [1, 2, 3, 4, 5, 6, 7, 8],
        status: false,
        baseCost: 100,
        infStatus: false,
        block: false,
    },
    {
        id: 7,
        name: "Invisible",
        description: "Unlock new BUFF",
        value: 0,
        level: 0,
        maxLevel: [1, 1, 1, 1, 1, 1, 1, 1],
        baseCost: 0,
        block: false,
        infStatus: undefined,
    },
    {
        id: 8,
        name: "CRIT",
        description: "+1 BASE CRIT CHANCE",
        value: 1,
        level: 0,
        maxLevel: [0, 5, 10, 15, 20, 25, 30, 35],
        baseCost: 40,
        infStatus: false,
        block: false,
    },
    {
        id: 9,
        name: "CRIT DMG",
        description: "+2.5 CRIT DMG",
        value: 2.5,
        level: 0,
        maxLevel: [0, 10, 20, 30, 40, 50, 60],
        baseCost: 18,
        infStatus: false,
        block: false,
    },
    {
        id: 10,
        name: "Traveller",
        description: "Unlock new BUFF",
        value: 0,
        level: 0,
        maxLevel: [0, 1, 1, 1, 1, 1, 1],
        baseCost: 0,
        block: false,
        infStatus: undefined,
    },
    {
        id: 11,
        name: "Conquer",
        description: "Stage requirement scales better",
        value: 0.01,
        level: 0,
        maxLevel: [0, 1, 2, 3, 3, 4, 4, 5],
        baseCost: 200,
        infStatus: false,
        block: false,
    },
    {
        id: 12,
        name: "Reset",
        description: "Recovery from death is faster",
        value: 1,
        level: 0,
        maxLevel: [0, 1, 2, 3, 3, 3, 3],
        baseCost: 70,
        infStatus: false,
        block: false,
    },
    {
        id: 13,
        name: "Only Up",
        description: "+1 MIN LEVEL",
        value: 1,
        level: 0,
        maxLevel: [0, 0, 0, 5, 5, 10, 15],
        baseCost: 35,
        infStatus: false,
        block: false,
    },
    {
        id: 14,
        name: "The Lord",
        description: "The chance of souls appearing depends on the unspent points",
        value: 1,
        level: 0,
        maxLevel: [0, 0, 0, 1, 1, 1, 1],
        baseCost: 0,
        block: false,
        infStatus: undefined,
    },
    {
        id: 15,
        name: "The Gift",
        description: "+0.2 MULT Rebirth Pts",
        value: 1.2,
        level: 0,
        maxLevel: [0, 0, 0, 1, 1, 2, 3],
        baseCost: 200,
        infStatus: false,
        block: false,
    },
    {
        id: 16,
        name: "Treasure",
        description: "1.05 MULT equipment Chance",
        value: 1.05,
        level: 0,
        maxLevel: [0, 0, 0, 0, 0, 50, 75],
        baseCost: 25,
        infStatus: false,
        block: false,
    },
    {
        id: 17,
        name: "Curse Cleanse",
        description: "Remove first curse in Abyss",
        value: 1,
        level: 0,
        maxLevel: [0, 0, 0, 0, 0, 1, 1],
        baseCost: 10000,
        block: false,
        infStatus: undefined,
    },
    {
        id: 18,
        name: "Harvest",
        description: "+1% stardust drop",
        value: 1,
        level: 0,
        maxLevel: [0, 0, 0, 0, 0, 50, 75],
        baseCost: 30,
        infStatus: false,
        block: false,
    },
    {
        id: 19,
        name: "Inner Spark",
        description: "+1 Potential",
        value: 1,
        level: 0,
        maxLevel: [0, 0, 0, 0, 0, 30, 40],
        baseCost: 50,
        infStatus: false,
        block: false,
    },
    {
        id: 20,
        name: "Roots of D",
        description: "Tree Tier affects the weakness of Abyss Enemies",
        value: 1,
        level: 0,
        maxLevel: [0, 0, 0, 0, 0, 1, 1],
        baseCost: 10000,
        block: false,
        infStatus: undefined,
    },
  ]);

  