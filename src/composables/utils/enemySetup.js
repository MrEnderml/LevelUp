import { ref } from "vue";

const villians = {};

function createEnemy(idx) {
  return ref({
    id: idx,
    name: "Darkfang",
    stats: {
      base: {
        hp: 100,
        atk: 5,
        def: 0,
        crit: 5,
        critDmg: 1.5,
        dodge: 0,
        hit: 0,
        aps: 0.5,
        minAps: 0.5,
        maxAps: 4,
      },
      final: {},
    },
    hp: 100,
    dead: false,
    bar: 0,
    dx: 1,
    spawnType: "none",
    APS: {
      min: 0.5,
      max: 4,
      total: 0.5,
      current: 0.5,
    },
    avoid: {
      base: 0,
      total: 0,
      max: 75,
    },
    extras: {
      hits: 0,
      chance: 0,
    },
    attack: {
      base: 10,
      final: 10,
      effective: 10,
      effect: {
        type: null,
        icon: null
      },
      defIgnore: false,
      canceled: false,
      crit: false,
      extraHits: 1,
      extraChance: 0,
      sourse: "villian",
    },
    status: {
      stun: {
        d: 0,
        c: 0,
        immune: false,
      },
      weakStack: {
        count: 0,
        max: 90
      },
      dims: {
        damage: {
          kills: 0,
        },
        ddamage: {
          kills: 0
        },
      }
    },
    space: {
      isSpaceFight: false,
      spaceCooldown: 2,
      fightCooldown: 0,
      dmgImmune: 0,
      stats: {}
    },
    deBoss: {
      tier: 0,
      status: false,
      regen: 0,
      def: 0,
      timer: 15,
      shields: 0,
      stats: {
        hp: 1,
        dmg: 1,
      }
    },
    skills: {
      active: [],
      jugger: {
        d: ""
      },
      berserk: {
        d: "",
        rage: 0,
        isRage: false,
        rageDmg: 1,
        lessDmg: 0,
        healMult: 1,
        rageTime: 1,
        rageTick: 1,
        rageTimer: 0,
      },
      firstStrike: {
        d: "",
        firstStrike: false,
      },
      traveler: {
        d: "",
        loot: 1,
      },
      flexible: {
        d: "If a dodge fails, perform a second dodge check.",
        avoidSuccess: false,
      },
      flash: {
        d: "",
        extraHits: 0,
      },
      fastSlash: {
        d: "",
      },
      extraLife: {
        d: "",
        shields: 0,
      }
    },
    bh: {
      tier: 0,
      time: 0,
      maxTime: 0,
      status: false,
      stacks: 0,
      extraStack: 0,
      attack: 1.1,
      aps: 0.5,
      stunImmune: false,
      alwaysHit: false,
      selfDestruction: 0,
      lessDmg: 0,
      effects: 1,
    },
    dCorr: {
      dmg: 2000,
      time: 0,
      healMult: 1,
    },
    damageLog: [],
    attackCount: 0,
  })
}

export function useBaseEnemy(id = "main") {
  if (!villians[id]) {
    villians[id] = createEnemy(id);
  }

  return {
    villian: villians[id]
  };
}
