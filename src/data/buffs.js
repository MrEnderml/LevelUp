import { reactive, ref } from 'vue';
import { dimensions } from './dimensions';

const buffs = ref([
    {
      id: 0,
      name: 'Invisible',
      description: [
        "33% chance for your DEF to double when an enemy hits you",
        "35% chance to reduce an enemy attack to 1 DMG",
        "Your DEF is immune to penetration",
        "You are immune to stunning",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4000, 85000, 1.5e9, 1e12, 1e16],
      active: false,
      ptr: 0,
      def: 1,
      nextTierReq: 'Unlock in TIER-R'
    },
    {
      id: 1,
      name: 'First Strike',
      description: [
        "First attack deals double DMG",
        "First attack is always critical",
        "First attack will STUN enemy for 1 second",
        "First attack starts with ApS bar at 25%",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [10000, 500000, 1e14, 1e18],
      active: false,
      used: false,
      usedSkill: false,
      usedAPS: false,
      stun: 0,
      nextTierReq: 'Dimension 32 [T6]',
    },
    {
      id: 2,
      name: 'Traveller',
      description: [
        "[X3] EQUIPMENT DROP CHANCE",
        "[X3] SOUL APPEARANCE CHANCE",
        "[X1.5] ASCENSION SHARDS and [X3] EXP",
        "[X2] STARDUST and MUTAGEN",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [12500, 120000, 1e12, 1e15, 1e20],
      active: false,
      nextTierReq: 'Dimension 32 [T8]'
    },
    {
        id: 3,
        name: 'Combo',
        description: [
          "+1% DMG per COMBO [MAX- 30]; +1 COMBO per hit; COMBO Resets if you get hit by an enemy",
          "+1.25% DMG per COMBO [MAX- 40]; +1 COMBO per hit [50% to get additional COMBO]; COMBO Resets 75% if you get hit by an enemy",
          "+1.5% DMG per COMBO [MAX- 50]; +1.5 COMBO per hit; COMBO Resets 50% if you get hit by an enemy",
          "+1.75% DMG per COMBO [MAX- 100]; +2 COMBO per hit; COMBO Resets get killed by an enemy; +0.3 Attack per Second when COMBO is MAX",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [12000, 60000, 5e7, 1e9, 1e15],
        active: false,
        combo: 0,
        hit: false,
        nextTierReq: 'SP: 81'
    },
    {
        id: 4,
        name: 'Blood Art',
        description: [
          "Heal HP equal to your current Stage each second",
          "Heal 5% of Max HP when you kill an enemy",
          "Heal 5% of Max HP each second",
          "Heal 2% of Max HP + [current Stage] after each attack",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [5000, 150000, 1e9, 1e12, 1e20],
        active: false,
        time: 0,
        nextTierReq: 'SP: 65'
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
        maxExp: [6500000, 3e8, 1e9, 1e14, 1e20],
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
          "+1 Overkill.",
          "+1 Overkill per each 100 max level",
          "+1 Overkill per each 50 level",
          "10% to gain EXP && WEAPON CHANCE for each overkilled Enemy",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [225000, 1625000, 1e10, 1e12, 1e17],
        active: false,
        nextTierReq: 'Singularity [T0]'
      },
      {
      id: 8,
        name: 'Conquer',
        description: [
          "+0.1% HP per second [MAX - 500s]",
          "+0.1% DMG per second [MAX - 750s]",
          "+0.1 ATTACK SPEED per 250 seconds [MAX - 1000s]",
          "1% of enemy weakness per 50 seconds [MAX - 1250]; Start with 250 seconds",
          "Max Tier"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [250000, 2.5e6, 1e10, 1e11, 1e15],
        active: false,
        time: 0,
        spaceTime: 0,
        nextTierReq: 'Unlock in TIER-S'
      },
      {
      id: 9,
      name: 'Flexible',
      description: [
        "10% to avoid enemy HIT",
        "20% to avoid enemy HIT",
        "Avoid chance checks twice",
        "Gain +4% avoid chance each time your avoidance is successful",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      times: 0,
      maxExp: [800000, 2e7, 1e15, 1e18, 1e22],
      active: false,
      nextTierReq: 'Dimension 32 [T12]'
    },
    {
      id: 10,
      name: 'Extra life',
      description: [
        `${35}% to RISE UP after death with 50% HP.`,
        "+50% DMG and 100% DEF after RISING for 8 seconds",
        "After RISING become immune to any damage for 3 seconds",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [2e6, 1e7, 1e8, 1e12, 1e18],
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
        "If your Crit Chance is above 100%, you deal an additional Double DMG",
        "Crit chance is checked twice",
        "When your Hit is Critical, you ignore the Enemy's Avoid",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [2e6, 1e7, 1e10, 1e11, 1e18],
      active: false,
      hit: false,
      nextTierReq: 'SP: 133'
    },
    {
      id: 12,
      name: 'Berserk',
      description: [
        `Low HP, High DMG -> 1 : 2`,
        "+15% Crit Chance and +75% Crit Damage when HP is low",
        "If HP drops below 30%, restore 1% HP for every 10% HP missing",
        "Rage mechanic. Check the Rage icon for more details",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [5e6, 1e8, 1e14, 1e16, 1e18],
      active: false,
      dmg: 1,
      crit: 0,
      critDmg: 0,
      rage: 0,
      isRage: false,
      rageAttackMult: 0,
      nextTierReq: "Dimension [32] [T4]",
    },
    {
      id: 13,
      name: 'Juggernaut',
      description: [
        `x1.5 DEF, x1.5 HP, x0.75 DMG`,
        "Gain +10% DEF for each 10% of missing HP",
        "+5% DEF From Max HP",
        "50% chance to heal 10% HP on full block",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4e6, 8e7, 1e14, 1e15, 1e18],
      active: false,
      nextTierReq: 'Dimension [32] [T1]'
    },
    {
      id: 14,
      name: 'The Flash',
      description: [
        `Your base APS cannot be lower than 1`,
        "+0.1 APS for each Space Boss killed [MAX - 0.5]",
        "+0.01 APS for each Stage passed [MAX - 1]",
        "Overcapped APS converts into chance of extra hits",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [1e8, 1e10, 1e16, 1e17, 1e18],
      extraHit: 0,
      active: false,
      nextTierReq: 'Dimension [32] [T16]'
    },
    {
      id: 15,
      name: 'Black Impulse',
      description: [
        "Each hit increases the chance by 20% to deal double damage. After 5 hits, the chance resets",
        "Each attack has a 25% chance to ignore enemy DEF. 1.5× DMG against enemies without Defense.",
        "Each hit has a 5% chance to create a Divine Shield that makes you vulnerable to attacks for 1 second",
        "Deals double damage if your DMG (not including CRIT) is 10 times less than the enemy's health",
        "Max Tier"
      ],
      tier: 1,
      maxTier: 1,
      exp: 0,
      maxExp: [1e12, 1e14, 1e16, 1e18, 1e20],
      active: false,
      hits: 0,
      defIgnore: false,
    },
    {
      id: 16,
      name: 'Irradiation',
      description: [
        "When an enemy appears, it loses 25% of its MAX HP.",
        "Each time an enemy attacks, it loses 1% of its MAX HP, up to 50%.",
        "On hit, the enemy gains a stack of Radiation. When stacks are full, the enemy loses 1% of its MAX HP. Max stacks: 10. Stacks are reset when you take DMG.",
        "When an enemy dies, 50% of its Radiation stacks transfer to the next enemy. 50% of stacks are not lost when you take DMG.",
        "Max Tier"
      ],      
      tier: 1,
      maxTier: 4,
      exp: 0,
      stack: 0,
      maxExp: [1e12, 1e13, 1e14, 1e15, 1e16],
      active: false,
    },
  ]);

  export function useBuff() {
    return {buffs}
  }

