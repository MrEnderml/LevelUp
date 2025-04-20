import { reactive, ref } from 'vue';

const buffs = ref([
    {
      id: 0,
      name: 'Invisible',
      description: [
        "33% that your DEF will be double when enemy hits you",
        "35% to block the enemy attack to 1 DMG",
        "Your DEF has immunity to penetration",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4000, 85000, 220000],
      active: false,
      ptr: 0,
      def: 1,
    },
    {
      id: 1,
      name: 'First Strike',
      description: [
        "Deal double DMG by First attack",
        "First attack is always critical",
        "First attack can STUN Enemy for 1 second",
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
        "1.5x Ascension Shards & EXP",
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
          "+1% DMG per COMBO Stucks[MAX- 30]; +1 COMBO per hit; COMBO Resets if you was hit by enemy",
          "+1.25% DMG per COMBO Stucks[MAX- 40]; +1 COMBO per hit[50% to get additional COMBO]; COMBO Resets 75% stucks if you was hit by enemy",
          "+1.4% DMG per COMBO Stucks[MAX- 50]; +1.5 COMBO per hit; COMBO Resets 50% stucks if you was hit by enemy",
          "+1.5% DMG per COMBO Stucks[MAX- 100]; +2 COMBO per hit; COMBO Resets 25% stucks if you was hit by enemy; +0.3 Attack per Second when COMBO is MAX",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 4,
        exp: 0,
        maxExp: [12000, 60000, 500000, 2e6],
        active: false,
        combo: 0,
        hit: false
    },
    {
        id: 4,
        name: 'Blood Art',
        description: [
          "Heal HP equals to stage passed per second",
          "Heal 5% HP when you kill enemy",
          "Heal 5% HP per second",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [5000, 150000, 1e6],
        active: false,
        time: 0
    },
    {
        id: 5,
        name: 'Fast Slash',
        description: [
          "You can hit additional time; -0.8 Attack per Second",
          "35% to hit extra time; -0.7 Attack per Second",
          "10% to hit another extra time; -0.6 Attack per Second",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [150000, 650000, 1e7],
        active: false,
        debuff: 0,
        stuck: 0
    },
    {
        id: 6,
        name: 'Void',
        description: [
          "",
          "",
          "",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [8000, 320000, 3.6e6],
        active: false
      },
      {
        id: 7,
        name: 'Overkill',
        description: [
          "Note: You gain the loot from only first killed enemy; 100% to kill next enemy;",
          "+1 extra kill per each 100 max level;",
          "+1 extra kill per each 50 level;",
          "You gain EXP && WEAPON CHANCE from each overkilled enemy",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 4,
        exp: 0,
        maxExp: [125000, 625000, 1e7, 1e8],
        active: false
      },
      {
      id: 8,
        name: 'Conquer',
        description: [
          "+0.1% HP per second [MAX - 500s]",
          "+0.1% DMG per second [MAX - 750s]",
          "+0.1 ATTACK SPEED per 250 seconds [MAX - 1000s]",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [250000, 2.5e6, 1e6],
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
      maxExp: [200000, 1e6, 1e7],
      active: false
    },
    {
      id: 10,
      name: 'Extra life',
      description: [
        "20% to RISE UP after death with 50% HP",
        "+50% DMG and 25% DEF after rising for 8 seconds",
        "After rising become immune to any damage for 4 seconds",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [200000, 2e6, 1e7],
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
        "+15% Base CRIT, +75% CRIT DMG",
        "IF CRIT HIGHER 100% DEAL EXTRA DOUBLE DAMAGE",
        "CRIT CHANCE CHECKS DOUBLE",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [200000, 2e6, 1e7],
      active: false,
    },
    {
      id: 12,
      name: 'Berserk',
      description: [
        `Low HP, High DMG -> 1: 3`,
        "+15% CRIT, +100 CRIT DMG WHEN HP is low -> 1: 3",
        "WHEN YOUR HP lower 30% HEAL 1% PER 10% LOST HP",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [200000, 2e6, 1e7],
      active: false,
      dmg: 1,
      crit: 0,
      critDmg: 0
    },

  ]);

  export function useBuff() {
    return {buffs}
  }

