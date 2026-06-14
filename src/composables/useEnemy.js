import { ref } from 'vue';

const enemy = ref({
  boss: {
    isBoss: false,
    chance: 0,
    overchance: 0,
    attack: 1,
    hp: 1,
    drop: 1
  },
  rebirthEnemy: {
    dmg: 1,
    hp: 1,
    drop: 1
  },
  soulBuff: {
    active: false,
    dmg: 1,
    hp: 1,
    drop: 1,
    chance: 0,
  },
  danger: 0,
  enemyPower: 1,
  spaceBossChance: 0,
  isSpaceFight: 0,
  darkEnemyBoss: false,
  specialCreatures: {
    celestials: {
      chance: 0,
      loot: null
    },
    souls: {
      chance: 1,
      loot: null,
    },
    boss: {
      chance: 1,
      loot: null
    },

    inf1: {
      chance: 0,
      loot: 0,
      max: 60
    },
    inf2: {
      chance: 0,
      loot: 0,
      max: 1000
    },
    inf3: {
      chance: 0,
      loot: 0,
      max: 5
    },

    dim1: {
      chance: 0,
      loot: 0,
      max: 200
    },
    dim2: {
      chance: 0,
      loot: 0,
      max: 50
    },
    dim3: {
      chance: 0,
      loot: 0,
      max: 5
    },
    dim4: {
      chance: 0,
      loot: 0,
      max: 90
    },
    dim5: {
      chance: 0,
      loot: 0,
      max: 25
    },
    dim6: {
      chance: 0,
      loot: 0,
      max: 5
    },

    ddim1: {
      chance: 0,
      loot: 0,
      max: 10,
      req: false,
    },
    ddim2: {
      chance: 0,
      loot: 0,
      max: 50,
      req: false,
    },
    ddim3: {
      chance: 0,
      loot: 0,
      max: 25,
      req: false,
    },
    ddim4: {
      chance: 0,
      loot: 0,
      max: 5,
      req: false,
    },
    ddim5: {
      chance: 0,
      loot: 0,
      max: 10,
      req: false,
    },
    ddim6: {
      chance: 0,
      loot: 0,
      max: 3,
      req: false,
    },
    ddim7: {
      chance: 0,
      loot: 0,
      max: 10,
      req: false,
    },
    ddim8: {
      chance: 0,
      loot: 0,
      max: 10,
      req: false,
    },
    ddim9: {
      chance: 0,
      loot: 0,
      max: 5,
      req: false,
    },
    ddim10: {
      chance: 0,
      loot: 0,
      max: 5,
      req: false,
    },
    ddim11: {
      chance: 0,
      loot: 0,
      max: 5,
      req: false,
    },
    ddim12: {
      chance: 0,
      loot: 0,
      max: 1,
      req: false,
    },

  },
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
    maxTotalBosses: 0,
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
  rage: 0,
  firstAttack: false,
  firstAttackAPS: false,
  avoidChance: false,
  extraHit: 0,
  extraHitStacks: 0,
  space: {
    stats: {
      fightCooldown: 15,
      bossCooldown: 20,
      infWardenCooldown: 10,
      defIgnore: 0,
      lifeSteal: 0,
      hpRegen: 0,
      multiHit: 0,
      critChance: 0,
      critDMG: 0,
      blockChance: 0,
      stunChance: 0,
      stunDuration: 0,
      aps: 0,
      maxAps: 0,
      minAps: 0,
      hit: 0,
      avoid: 0,
      extraLife: 0,
      lessDMGTaken: 0,
      lessDMGTakenFromCrits: 0,
    }
  },
  bh: {
    tier: 0,
    hp: [2.5e9, 1e10, 1e12, 1e15, 1e17, 1e100],
    aps: [0.5, 0.6, 0.7, 0.9, 1.1, 1.5],
    attack: [1.08, 1.1, 1.12, 1.15, 1.17, 1.25],
    name: ["Event Horizon Stalker", "Singularity Devourer", "Graviton Wraith", "Abyssal Collapse", 
      "Horizon Annihilator", "[D-Gravity]"]
  },
  enemyStats: {
        main: {
          hpStage: 40,
          dgmStage: 5,
          bossHp: 1,
          bossDmg: 1,
          titan: 1,
          muscles: 1,
        },
        space: {
  
        },
  }
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
