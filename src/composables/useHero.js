// useHero.js
import { reactive, ref } from 'vue';


const hero = ref({
  hp: 100,
  maxHp: 100,
  attack: 10,
  def: 0,
  crit: 0,
  critAttack: 1.5,
  level: 0,
  eLevel: 1,
  minLevel: 0,
  maxReachedLevel: 0,
  divLevel: 0,
  maxLevel: 30,
  trueLevel: 0,
  exp: 0,
  nextLevelExp: 100,
  attacksPerSecond: 0.5,
  resetKilledTime: 0,
  kills: 0,
  killsPerZone: 5,
  zone: 1,
  stage: 1,
  maxStage: 1,
  isStage: true,
  isBattleActive: true,
  overkill: 0,
  treeTier: 0,
  perkPoints: 0,
  equipmentTiers: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0,
    spRing: 0
  },
  eqTierReq: {
    sword: 3,
    armor: 3,
    boots: 3,
    ring: 0,
    spRing: 0
  },
  eqUps: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0,
    spRing: 0
  },
  eqUpsReq: {
    sword: 1,
    armor: 7,
    boots: 15,
    ring: 42,
    spRing: 1
  },
  eqUpsMult: {
    sword: {
      cap: 0,
      bonus: 0,
      crit: 0,
      critDmg: 0
    },
    armor: {
      cap: 0,
      bonus: 0
    },
    boots: {
      cap: 0,
      bonus: 0
    },
    ring: {
      cap: 0,
      bonus: 0
    },
    spRing: {
      cap: 0,
      bonus: 0
    }
  },
  dropChance: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0
  },
  ascensionShards: 0,
  totalAscensionShards: 0,
  isAscend: false,
  ascendShardPerform: 0,
  ascensionTier: 1,
  maxBuffs: 1,
  activeBuffs: [],
  souls: 0,
  soulsMax: 0,
  soulsCap: 20,
  soulTier: 0,
  curse: 0,
  activeCurse: [],
  activeCurseTier: [],
  cursedBonus: 0,
  cursedBonusExp: 0,
  afkTime: 0,
  showAfkPopup: false,
  afkKills: 0,
  afkMessage: "",
  showAfkPopupRule: true,
  rebirthPts: 0,
  totalRebirthPts: 1,
  rebirthTier: 0,
  potential: 0,
  avoid: 0,
  activeFormation: null,
  formationTypes : [
    { name: 'HP', id: 0, icon: '💚', description: 'HP - x2, ATK - x0.5, DEF - x0.5',status: false },
    { name: 'Attack', id: 1, icon: '⚔️', description: 'ATK - x2, HP - x0.5, DEF - x0.5' , status: false},
    { name: 'Defense', id: 2, icon: '🛡️', description: 'DEF - x2, HP - x0.5, ATK - x0.5' , status: false},
    { name: 'Loot', id: 3, icon: '💎', description: 'DEF - x0.5, HP - x0.5, ATK - x0.5, LOOT: 2(EXP, BUFF EXP, WEAPON, ASCENSION SHARDS(Abyss T2), REBIRTH SHARDS(Rebirth T20))' , status: false},
  ],
  abyssTier: 0,
  isAbyss: false,
  perform: false,
  isLocking: false,
  isLocked: false,
  afkLocked: false,
  mutation: [
    {type: 'Mutagen [T1]', chance: 25 },
    {type: 'Mutagen [T2]', chance: 10},
    {type: 'Mutagen [T3]', chance: 0},
    {type: 'Mutagen [T4]', chance: 0},
  ],
  mutagen: 0,
  sp: 0,
  st: 0,
  spCount: 0,
  stardust: 0,
  corruption: 0.1,
  spaceFight : false,
  abyssDStages: 1,
  infPoints: 0,
  infPointsGoals: 0,
  infTier: 0,
  infTree: false,
  soulD: false,
  treeAuto: false,
  isSpaceBuff: false,
  spActiveBuffs: [],
  isSpaceAuto: false,
  spBossPerk: 0,
  afkSoulBoost: 1,
  capInfPerks: 1,
  mutations: 0,
  infProgress: false,
  infoActive: {
    lore: true,
    tree: true,
    equipment: false,
    buffs: false,
    souls: false,
    ascension: false,
    corruption: false,
    amulet: false,
    rebirth: false,
    abyss: false,
    space: false,
    radiation: false,
    infinity: false,
  }
});

export function useHero() {
  return { hero };
}
