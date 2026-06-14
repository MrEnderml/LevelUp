// useHero.js
import { reactive, ref } from 'vue';


const hero = ref({
  version: "1.0",
  time: 0,
  battleId: "main",
  battleContent: {
    "main" : {
      player: null,
      villian: null
    },
    "space": {
      player: null,
      villian: null
    }
  },
  timePenalty: false,
  maxTime: 0,
  corruption: {
    base: 0.1,
    total: 0.1,
    cap: 1,
    dcap: 10,
    killsLose: 1,
    status: 'base',
  },
  tree: {
    kills: 0,
    freePoints: 0,
    points: 0,
    tier: 0,
    auto: false,
    autoCooldown: 0,
    maxRadNodes: 0,
  },
  rad: {
    radTarget: 0,
    tempTarget: 0,
    isAuto: false,
  },
  buff: {
    showLayoutEditor: false,
    layoutNameInput: '',
    layoutBeingEdited: 0,
  },
  dimShards: {
    base: 150,
    stage: 150,
  },
  recovery: {
    penalty: 1,
  },
  heal: {
    mult: 1
  },
  stages: {
    min: 1,
    max: 300,
    current: 1
  },
  baseStage: 1.2,
  infExpansions: {
    tree: false,
    ascensioin: false,
    rebirth: false,
    radiation: false,
    space: false,
    soul: false,
  },
  timeline: {
    showUpgradeModal: false,
    lineShows: true,
    show: false,
    activeNoramlDims: [],
    activeDarkDims: [],
    activeLawDims: [],
    activeDimsCache: [],
  },
  autoTimeLine: {
    isAuto: false,
    tier: null,
    time: [1800, 3600, 7200, 14400, 28800],
    timer: 0,
  },
  void: {
    zoom: 1,
    viewBox: '0 0 800 600',
    currentShards: 0,
    totalShards: 0,
    maxTime: 28800,
    time: 28800,
    stage: 1,
    tier: 0
  },
  gravity: {
    shards: 0,
    totalShards: 0,
    stageReq: 0,
    isTrial: false,
    bhDmg: 0,
    bhMaxDmg: 0, 
  },
  hp: 100,
  maxHp: 100,
  atk: 10,
  def: 0,
  crit: 0,
  critAttack: 1.5,
  level: 0,
  eLevel: 1,
  minLevel: 0,
  minLevelAdd: 0,
  maxReachedLevel: 0,
  maxLevelAdd: 30,
  divLevel: 0,
  maxLevel: 30,
  trueLevel: 0,
  exp: 0,
  totalExp: 0,
  nextLevelExp: 100,
  attacksPerSecond: 0.5,
  totalAPS: 0,
  maxAPS: 4,
  resetKilledTime: 0,
  kills: 0,
  killsPerZone: 5,
  maxStage: 1,
  isStage: true,
  isBattleActive: true,
  overkill: 0,
  eqTotalDrop: 0,
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
  eqMin: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0,
    spRing: 0
  },
  eqDrop: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0,
  },
  eqDropChances: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0,
  },
  eqUps: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0,
    spRing: 0
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
      bonus: 0,
      def: 0,
      heal: 0,
    },
    boots: {
      cap: 0,
      bonus: 0,
      stage: 0,
      overkill: 0,
    },
    ring: {
      cap: 0,
      bonus: 0,
      level: 1,
      multLevel: 0,
    },
    spRing: {
      cap: 0,
      bonus: 0,
      infPoints: 0,
      potential: 0,
    }
  },
  awakened: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0
  },
  awakenedReq: {
    sword: 20,
    armor: 20,
    boots: 20,
    ring: 20
  },
  dropChance: {
    sword: 0,
    armor: 0,
    boots: 0,
    ring: 0
  },
  shardsMult: 0,
  shardsPerformMult: 0,
  ascensionShards: 0,
  shardsInterval: 0,
  totalAscensionShards: 0,
  isAscend: false,
  ascendShardPerform: 0,
  ascensionTier: 1,
  maxBuffs: 1,
  
  souls: 0,
  cSoulsMax: 0,
  soulsMax: 0,
  soulsCap: 20,
  soulTier: 0,
  curse: 0,
  minCurse: 0,
  activeCurse: [],
  activeCurseTier: [],
  cursedBonus: 0,
  cursedBonusExp: 0,
  afkTime: 0,
  startAfkTime: 0,
  afkStarted: false,
  afkKills: 0,
  afkModeKills: 0,
  afkMessage: "",
  autoSpaceCondition: "",
  settings: {
    showAfkPopupRule: false,
    afkStoredTime: false,
    showOfflineRewards: true,
    showStoredTime: false,
    damageDisplay: true,
    notes: true,
    dimTeleport: false,
    autoSave: true,
    storedTime: 0,
    storedTimeUsed: 0,
    autoLeave: false,
    battleTime: 0,
    fileInput: null,
    afkMode: 's',
  },
  isRebirth: false,
  rebirthPts: 0,
  baseRebirthPts: 0,
  totalRebirthPts: 1,
  rebirthTier: 0,
  totalPtsMult: 0,
  potential: 0,
  formationTypes : [
    { name: 'HP', id: 0, icon: '💚', description: 'HP - x2, ATK - x0.5, DEF - x0.5', status: false },
    { name: 'Attack', id: 1, icon: '⚔️', description: 'ATK - x2, HP - x0.5, DEF - x0.5' , status: false},
    { name: 'Defense', id: 2, icon: '🛡️', description: 'DEF - x2, HP - x0.5, ATK - x0.5' , status: false},
    { name: 'Loot', id: 3, icon: '💎', description: 'DEF - x0.5, HP - x0.5, ATK - x0.5, LOOT: 2' , status: false},
  ],
  abyssTier: 0,
  isAbyss: false,
  perform: false,
  isLocking: false,
  isLocked: false,
  afkLocked: false,
  mutation: [
    {type: 'Mutation [T1]', chance: 25 },
    {type: 'Mutation [T2]', chance: 10},
    {type: 'Mutation [T3]', chance: 0},
    {type: 'Mutation [T4]', chance: 0},
  ],
  mutagen: 0,
  sp: 0,
  st: 0,
  spCount: 0,
  spbCount: 0,
  spsCount: 0,
  spsCountMax: 0,
  spMaxCount: 24,
  isInfSpace: false,
  stardust: 0,
  spaceFight : false,
  abyssDStages: 1,
  infPoints: 0,
  infPointsAdd: 0,
  infPointsGoals: 0,
  infTier: 0,
  maxInfTier: 0,
  infTree: false,
  quasar: {
    cores: 1,
    usedCores: 0,
    freeCores: 1,
    next: 55,
    power: 1,
  },
  tr: {
    count: 0,
    bhCount: 0,
    max: [30, 30, 30, 30, 30],
    spread: 0,
    countSpread: 0,
  },
  soulD: false,
  treeAuto: false,
  isSpaceBuff: false,
  isSpaceAuto: false,
  repeatOnDefeat: false,
  nextEnemyOnWin: false,
  noBattleWindowChanges: false,
  spaceWindowChange: false,
  isSpaceFightCooldown: false,
  spaceFightCooldown: 0,
  spBossPerk: 0,
  afkSoulBoost: 1,
  soulStageHp: 1,
  capInfPerks: 1,
  mutations: 0,
  radAttack: 0,
  radAPS: 0,
  infProgress: false,
  infoActive: {
    update: true,
    info: true,
    lore: true,
    tree: true,
    equipment: true,
    skill: true,
    souls: false,
    ascension: false,
    corruption: false,
    amulet: false,
    rebirth: false,
    abyss: false,
    space: false,
    radiation: false,
    infinity: false,
    singularity: false,
    dimension: false,
    stats: true
  },
  singularity: 0,
  isSingularity: false,
  singLeft: false,
  singMult: 1,
  overcorruption: 0,
  freeEnchances: 0,
  isDimension: false,
  dId: 'main',
  mainInfTier: 0,
  survivalLevel: 0,
  windowUpdate: false,
  freeTreePoints: 0,
  unlimitLevel: 0,
  unlimitLevelMax: 3000,
  singularityAscension: [],
  singularitySpace: {
    sp: 0,
    st: 0,
    spCount: 0,
  },
  singularityRingUp: 0, 
  singularityRebirthTier: 0,
  afkTimer: 0,
  afkMaxTimer: 14400,
  afkSpendPercent: 0,
  enemyAfkHp: 1,
  travellPenalty: 1,
  isTravell: false,
  ascensionAuto: false,
  ascensionAutoUnlock: false,
  afkTimeHandle: 1,
  singularityKills: 0,
  curset5: false,
  curset5Chance: 0,
  soulOverkill: 0,
  soulDStage: 0,
  ds: 0,
  dsSpend: 0,
  dsMax: 0,
  dsTotal: 0,
  infPenalty: 0,
  dangerStage: 0,
  cDangerMax: 0,
  dsStage: 150,
  dTimeReward: 0,
  dTimer: 0,
  dTimeReward: 0,
  abyssDStagesMax: 100,
  dKills: 0,
  survivalStage: 0,
  curseMult: 1,
  infPointsMult: 1,
  baseSp: 0,
  eLink: {
    set: '',
    info: '',
    stat: '',
  },
  secrets: {
    travell: false,
    time: false,
    link: false,
    dLink: false,
    dLore: false,
    dView: true,
  },
  maxLevelMult: 0,
  stardustInfo: 0,
  timeKiller: 0,
  maxInfPenalty: 0,
  infEvents: 0,
  darkId: [],
  damageStage: 1,
  survivalLife: 0,
  selectedDivSkills: [],
  dimDisplayMode: 'map',
  multEnchance: 0,
  buffLayouts: [
    { id: 0, name: 'Layout 1', buffs: [], unlocked: true }, 
    { id: 1, name: 'Layout 2', buffs: [], unlocked: true }, 
    { id: 2, name: 'Layout 3', buffs: [], unlocked: true },
    { id: 3, name: 'Layout 4', buffs: [], unlocked: true },
    { id: 4, name: 'Layout 5', buffs: [], unlocked: true },
  ],
  
  showProgressionCircles: false,
  forgeTier: 0,
  forgeTierReq: 50,
  totalEnhances: 0,
  transcendence: 0,
  firstTrans: false,
  bhTier: 0,
  d_damage_penalty: {
    dmg: 1,
    hp: 1,
    def: 1
  },
  bleedvealValue: 0,
  isPaused: false,
  spBuffsCache: [],
  eventDoubleClick: false,
  infPower: 1,
  infUnlocked: false,
  transcendenceBH: 0,
  transferAscensionArray: {},
  spaceAutoCooldown: 1,
  levelRush: {
    c: 0,
    m: 0.75,
  },
  stageRush: {
    c: 0,
    m: 0.75,
    active: true,
  },
  infCorruption: 0,
  dCorruptionEffect: 0,
  autoTreeCooldown: 2,
  isBhBoss: false,
  isAutoForge: false,
  minStage: 0,
  unlimitMaxLevel: 0,
  unlimitMinLevel: 0,
  cUnlimitMaxLevel: 0,
  minLevelMult: 1,
  autoTreeCooldown: 0,
  stBosses: 0,
  totalAvoid: 0,
  spaceTimer: -1,
  maxLevelInfo: 0,
  singularityLevels: 0,
  gridFilterStatus: "all",
  combatFilterStatus: "All",
  spaceUnlocked: false,
  stardustStage: 40,
  stageReq: 1.35,
  baseDangerPower: 1.017,
  currentMutagen: 0,

  timelineActiveTier: 0,
  timelineTier: 0,
  timelinePass: [true, false, false, false, false, false],
  lawSlots: [null, null],
  selectedStones: [null, null],
  ancientShards: 0,
  inventorySize: 16,
  mainInfTierCap: 60,
  infTierLevelReq: 700,
  corrInfluence: 0,
  lawStonesSet: [],
  dimensionStatus: 1,
  dimId: [],
  isDimCorruption: false,
  dims: {
    viewBox: '0 0 800 600',
    searchQuery: "",
    zoom: 1,
    selectedDim: null,
    teleportedMode: false,
    teleportName: "",
    teleports: [],
    corrShards: 0,
    damage: {
      kills: 0,
      effect: 1,
    },
    veil: {
      stacks: 0,
      damage: 0,
    },
    survival: {
      stage: 0,
    },
    passedDims: 0,
  },

  infs: {
    infBonusesCache: 0,
  },
  rebirthTierBonusesChance: 0,
  soulPower: {
    tier: 0,
    req: 100,
    label: {
      maxLevel: 1,
      exp: 10,
      minLevel: 1,
    },
    base: {
      maxLevel: 0,
      exp: 0,
      min: 0,
      stardust: 1,
      mutagen: 1
    },
    special: [
      {
        base: 0,
        tier: 0,
        value: 1,
        next: 0
      },
      {
        base: 0,
        tier: 1,
        value: 0,
        next: 0
      },{
        base: 0,
        tier: 2,
        value: 0,
        next: 0
      },{
        base: 0,
        tier: 3,
        value: 1,
        next: 0
      },{
        base: 0,
        tier: 4,
        value: 0,
        next: 0
      },{
        base: 0,
        tier: 5,
        value: 0,
        next: 0
      },{
        base: 0,
        tier: 6,
        value: 1,
        next: 0
      },{
        base: 0,
        tier: 7,
        value: 0,
        next: 0
      },{
        base: 0,
        tier: 8,
        value: 0,
        next: 0
      },{
        base: 0,
        tier: 9,
        value: 0,
        next: 0
      },
    ]
  },
  abyssDRewards: [
    { id: 0, value: 1 },   
    { id: 1, value: 2 },        
    { id: 2, value: 0.1 },      
    { id: 3, value: 1 },        
    { id: 4, value: 1 },        
    { id: 5, value: 0.01 },     
    { id: 6, value: 1 },        
    { id: 7, value: 0 },        
    { id: 8, value: 1 },        
    { id: 9, value: 1 },      
    { id: 10, value: 0 },  
    { id: 11, value: 0 },       
  ],
  cursesChances: [
    {
      tier: 1,
      value: 0
    },
    {
      tier: 2,
      value: 0
    },
    {
      tier: 3,
      value: 0
    },
    {
      tier: 5,
      value: 0,
      status: false
    },
  ],
  rebirthBonusesHandle: [
    {
      id: 0,
      value: 1
    },
    {
      id: 1,
      value: 1.5,
    },
    {
      id: 2,
      value: 0
    },
    {
      id: 3,
      value: 0
    },
    {
      id: 4,
      value: 0
    },
    {
      id: 5,
      value: 0
    },
    {
      id: 6,
      value: 1
    },
    {
      id: 7,
      value: 0
    },
    {
      id: 8,
      value: 0
    },
    {
      id: 9,
      value: 0
    },
    {
      id: 10,
      value: 1
    },
    {
      id: 11,
      value: 1
    },
    {
      id: 12,
      value: 0
    },
    {
      id: 13,
      value: 0
    },
    {
      id: 14,
      value: 0
    },
    {
      id: 15,
      value: 0
    },
    {
      id: 16,
      value: 0
    },
    
  ],
  gravityShardsEffect: [
    {
      id: 0,
      req: 1,
      totalReq: 1,
      nowReq: 0,
      tier: 0,
      type: 3
    },
    {
      id: 1,
      req: 2,
      totalReq: 2,
      nowReq: 0,
      tier: 0,
      type: 2
    },
    {
      id: 2,
      req: 5,
      totalReq: 5,
      nowReq: 0,
      tier: 0,
      type: 0
    },
    {
      id: 3,
      req: 10,
      totalReq: 10,
      nowReq: 0,
      tier: 0,
      type: 1
    },
    {
      id: 4,
      req: 10,
      totalReq: 10,
      nowReq: 0,
      tier: 0,
      type: 1,
    },
    {
      id: 5,
      req: 25,
      totalReq: 25,
      nowReq: 0,
      tier: 0,
      type: 3
    },
    {
      id: 6,
      req: 40,
      totalReq: 40,
      nowReq: 0,
      tier: 0,
      type: 3
    },
    {
      id: 7,
      req: 50,
      totalReq: 50,
      nowReq: 0,
      tier: 0,
      type: 1
    },
    {
      id: 8,
      req: 50,
      totalReq: 50,
      nowReq: 0,
      tier: 0,
      type: 1
    },
    {
      id: 9,
      req: 50,
      totalReq: 50,
      nowReq: 0,
      tier: 0,
      type: 1,
    },
    {
      id: 10,
      req: 60,
      totalReq: 60,
      nowReq: 0,
      tier: 0,
      type: 0
    },
    {
      id: 11,
      req: 70,
      totalReq: 70,
      nowReq: 0,
      tier: 0,
      type: 1,
    },
    {
      id: 12,
      req: 80,
      totalReq: 80,
      nowReq: 0,
      tier: 0,
      type: 3,
    },
    {
      id: 13,
      req: 90,
      totalReq: 90,
      nowReq: 0,
      tier: 0,
      type: 1
    },
    {
      id: 14,
      req: 100,
      totalReq: 100,
      nowReq: 0,
      tier: 0,
      type: 0,
    },
    {
      id: 15,
      req: 200,
      totalReq: 200,
      nowReq: 0,
      tier: 0,
      type: 1
    },
  ],
  voidTreeStats: {},
  notes: {
    msg: [],
    triggers: {},
    cooldowns: {},
  },
  stardustPenalty: {
    d32: 1,
  },
  trackerTimer: 0,
  trackerResTimer: 0,
  trackerSleep: 0,
  avgLoot: {
    exp: { perSec: 0, acc: 0, smoothing: 0.05 },
    skillExp: { perSec: 0, acc: 0, smoothing: 0.05 },
    mutagen: { perSec: 0, acc: 0, smoothing: 0.05 },
    stardust: { perSec: 0, acc: 0, smoothing: 0.05 },
    kills: { perSec: 0, acc: 0, smoothing: 0.2},
  },
  avgResources: {
    ascension: {perSec: 0, acc: 0, timer: 0},
    rebirth: {perSec: 0, acc: 0, timer: 0},
  },
  afkSnapshot: {},
  totalStats: {
    maxDmgDealded: 0,
    totalAS: 0,
    spEnhances: 0,
    totalLevel: 0,
  },
  levelFactor: {
    hp: 0,
    atk: 0,
    def: 0,
    critDmg: 0,
  }
});

export function useHero() {
  return { hero };
}
