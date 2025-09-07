import { ref } from 'vue';

const enemy = ref({
  name: "Darkfang",
  hp: 20,
  maxHp: 20,
  attack: 5,
  def: 0,
  attacksPerSecond: 0.5,
  crit: 0,
  critAttack: 0,
  base: {
    hp: 20,
    maxHp: 20,
    attack: 5,
    def: 0,
    aps: 0.5,
    crit: 0,
    critAttack: 0,
  },
  soulBuff: {
    dmg: 0,
    hp: 0,
    chance: 0,
    drop: 0,
    stardust: 0,
    mutagen: 0,
    soulsStardustReq: 0,
    soulsMutagenReq: 0,
    active: false
  },
  boss: {
    isBoss: false,
    attack: 1,
    hp: 1,
    drop: 1
  },
  rebirthEnemy: {
    dmg: 1,
    hp: 1,
    drop: 1
  },
  ascensionSoul: {
    stats: 1,
    active: false
  },
  rebirthSoul: false,
  danger: 0,
  enemyPower: 1,
  spaceBossChance: 0,
  isSpaceFight: 0,
  dangerEnemyChance: [0, 0, 0, 0, 0],
  dangerEnemyLoot: [0, 0, 0],
  dEnemyChance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  dEnemyLoot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  darkEnemyChance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  darkEnemyLoot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  darkEnemyReq: [false, false, false, false, false, false, false, false, false, false],
  darkEnemyCap: [10, 50, 50, 10, 15, 1, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  darkEnemyBoss: false,
  spawnType: 'none',
  weakStack: 0,
  averageLoot: {
    exp: 0,
    buffexp: 0,
    mutagen: 0,
    stardust: 0,
  },
  totalSpaceStats: {
    hp: 1,
    def: 1,
    dmg: 1,
    aps: 0,
  },
  totalSpaceInfPenalty: 1,
  d_damagePenalty: 1,
  darkEnergy: {
    totalBosses: 0,
    maxBosses: 5,
    mult: 1,
    deTotal: 1,
  },
  deBoss: {
    regen: 0,
    def: 0,
    ignoreDMG: 0,
    darkEnemyTimer: -1,
  },
  buffs: [],
  bhBossHits: 0,
  bhMod: 1.2,
  bhExtraHit: 0,
  bhApSDown: 0,
  bhNames: ["Event Horizon Stalker", "Singularity Devourer", "Graviton Wraith", "Abyssal Collapse", 
    "", "", "", "", "", ""
  ],
  rage: 0,
  firstAttack: false,
  firstAttackAPS: false,
  avoidChance: false,
  extraHit: 0,
  extraHitStacks: 0,
});

const villainNames = [
  "Darkfang", "Voidclaw", "Gloomhowl", "Rageborn", "Thornspike", "Ashmaw", "Skullrender", "Venomveil", "Blackflame", "Fleshrot",
  "Bloodmaw", "Stormlash", "Nethergrin", "Bonehowl", "Deathshade", "Hollowfang", "Wraithclaw", "Shadowhorn", "Gravetide", "Hellmaw",
  "Skyrage", "Blightfury", "Ruinfang", "Murkshade", "Firegore", "Cryptclaw", "Scarrend", "Direbane", "Soulbiter", "Frostlash",
  "Gnarltooth", "Oblivionmaw", "Doomclaw", "Plaguehorn", "Ironfang", "Vilegrin", "Smoketooth", "Flameveil", "Ashfang", "Nightflayer",
  "Terrorhide", "Crimsonlash", "Brimskull", "Malicehowl", "Gorehorn", "Chasmfang", "Venombite", "Deathroar", "Darkspike", "Corruptclaw",
  "Bonegnasher", "Screechfang", "Howlgrim", "Flareclaw", "Lurkmane", "Bloodhowl", "Scathemaw", "Stormjaw", "Ebonclaw", "Wrathspike",
  "Skulldrinker", "Emberhide", "Cinderfang", "Phantomclaw", "Blazefur", "Tormenthide", "Shattertooth", "Crushjaw", "Nightvein", "Gloomblade",
  "Taintclaw", "Mawscar", "Savagerend", "Frosthide", "Voidhowl", "Shadowrend", "Blackvenom", "Chillfang", "Foulhide", "Scorchfang",
  "Vortexmaw", "Feargnasher", "Bleakhorn", "Crimsonmaw", "Ragesnap", "Scabfang", "Wreckhide", "Hauntfang", "Soulgnaw", "Abysslash",
  "Terrorclaw", "Venomjaw", "Darklash", "Rotspike", "Cursedfang", "Deathgleam", "Dreadclaw", "Emberfang", "Plaguedozer", "Malignhorn"
];

export function getRandomVillainName() {
  const index = Math.floor(Math.random() * villainNames.length);
  return villainNames[index];
}

export function useEnemy() {
  return { enemy };
}
