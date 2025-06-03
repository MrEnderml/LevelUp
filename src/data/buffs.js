import { reactive, ref } from 'vue';
import { dimensions } from './dimensions';

const buffs = ref([
    {
      id: 0,
      name: 'Invisible',
      description: [
        "33% that your DEF doubles when an enemy hits you",
        "35% to block an enemy attack to 1 DMG",
        "Your DEF has immunity to penetration",
        "You are immune to stunning",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4000, 85000, 15000000, 9e9],
      active: false,
      ptr: 0,
      def: 1,
    },
    {
      id: 1,
      name: 'First Strike',
      description: [
        "First attack deals double DMG",
        "First attack is always critical",
        "First attack will STUN Enemy for 1 second",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [10000, 500000, 100000],
      active: false,
      used: false,
      usedSkill: false,
      stun: 0,
    },
    {
      id: 2,
      name: 'Traveller',
      description: [
        "[X3] WEAPON DROP CHANCE",
        "[X3] SOUL APPEAR CHANCE",
        "[X1.5] Ascension Shards & [X3] EXP",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [12500, 120000, 500000],
      active: false
    },
    {
        id: 3,
        name: 'Combo',
        description: [
          "+1% DMG per COMBO [MAX- 30]; +1 COMBO per hit; COMBO Resets if you get hit by an enemy",
          "+1.25% DMG per COMBO [MAX- 40]; +1 COMBO per hit[50% to get additional COMBO]; COMBO Resets 75% if you get hit by an enemy",
          "+1.5% DMG per COMBO [MAX- 50]; +1.5 COMBO per hit; COMBO Resets 50% if you get hit by an enemy",
          "+1.75% DMG per COMBO [MAX- 100]; +2 COMBO per hit; COMBO Resets get killed by an enemy; +0.3 Attack per Second when COMBO is MAX",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [12000, 60000, 5e7, 1e9],
        active: false,
        combo: 0,
        hit: false
    },
    {
        id: 4,
        name: 'Blood Art',
        description: [
          "Heal HP equal to current stage per second",
          "Heal 5% HP when you kill an enemy",
          "Heal 5% HP per second",
          "Heal 2% of Max HP + [current stage] after each Attack",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [5000, 150000, 1e9, 1e12],
        active: false,
        time: 0
    },
    {
        id: 5,
        name: 'Fast Slash',
        description: [
          "Hit an additional time; -0.8 Attack per Second",
          "25% to hit another extra additional time; -0.7 Attack per Second",
          "A separate 25% to hit an extra additional time; -0.6 Attack per Second",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [6500000, 3e8, 1e9],
        active: false,
        debuff: 0,
        stuck: 0
    },
    {
        id: 6,
        name: 'Charges',
        description: [
          `+1 Max Tier per Singularity Tier;
          25% (+1% to gain random Charge per Tier) to gain random Charge, when you hit;
          50% (-2% to lost random Charge per Tier) to lost random Charge when you were hit; 
          Max Charges: 1 (+1 Max Charges per Tier);
          Power Charge: +5% DMG, +0.1 APS; Energy Charge: +1 CRIT, +5 CRIT DMG; Life Charge: +5% HP, +5% DEF.`
        ],
        tier: 1,
        maxTier: 1,
        exp: 0,
        maxExp: [1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20],
        active: false,
        charges: {
          power: 0,
          energy: 0,
          life: 0,
        }
      },
      {
        id: 7,
        name: 'Overkill',
        description: [
          "Note: You gain the loot from only first killed enemy; 100% to kill next enemy;",
          "+1 extra kill per each 100 max level;",
          "+1 extra kill per each 50 level;",
          "10% to gain EXP && WEAPON CHANCE for each overkilled Enemy",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [225000, 1625000, 1e10, 1e12],
        active: false
      },
      {
      id: 8,
        name: 'Conquer',
        description: [
          "+0.1% HP per second [MAX - 500s]",
          "+0.1% DMG per second [MAX - 750s]",
          "+0.1 ATTACK SPEED per 250 seconds [MAX - 1000s]",
          "1% of enemy weakness per 75 seconds [MAX - 1250]; Start with 250 seconds",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [250000, 2.5e6, 1e10, 1e11, 1e12],
        active: false,
        time: 0
      },
      {
      id: 9,
      name: 'Flexible',
      description: [
        "+10% to avoid enemy HIT",
        "+20% to avoid enemy HIT",
        "Avoid chance checks double times",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [800000, 2e7, 1e9],
      active: false
    },
    {
      id: 10,
      name: 'Extra life',
      description: [
        `${35}% to RISE UP after death with 50% HP. Does not work on the same enemy twice.`,
        "+50% DMG and 25% DEF after RISING for 8 seconds",
        "After RISING become immune to any damage for 4 seconds",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [2e6, 1e7, 1e8],
      active: false,
      rise: 1,
      buffT2: 0,
      buffT3: 0,
      buffT3HP : 0,
    },
    {
      id: 11,
      name: 'Sniper',
      description: [
        "+15% CRIT, +75% CRIT DMG",
        "If your Base Crit chance is above 100%, you deal an additional Double DMG",
        "Crit chance is checked twice",
        "When your Hit is Critical, you ignore the Enemy's Avoid",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [2e6, 1e7, 1e10, 1e11],
      active: false,
      hit: false,
    },
    {
      id: 12,
      name: 'Berserk',
      description: [
        `Low HP, High DMG -> 1 : 2`,
        "+15% CRIT, +75 CRIT DMG WHEN HP is low",
        "WHEN YOUR HP is lower than 30% HEAL 1% PER 10% LOST HP",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [5e6, 1e8, 1e9],
      active: false,
      dmg: 1,
      crit: 0,
      critDmg: 0
    },
    {
      id: 13,
      name: 'Juggernaut',
      description: [
        `x1.5 DEF, x1.5 HP, x0.75 DMG`,
        "+10% DEF PER 10% Lost HP",
        "+5% DEF From Max HP",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4e6, 8e7, 1e9],
      active: false,
    },
    {
      id: 14,
      name: 'The Flash',
      description: [
        `Your base APS cannot be below 1`,
        "+0.1 APS per each Space Boss Killed [MAX - 0.5]",
        "+0.01 APS per each Stage Passed [MAX - 1]",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [1e8, 1e10, 1e12],
      active: false,
    },
  ]);

  export function useBuff() {
    return {buffs}
  }

