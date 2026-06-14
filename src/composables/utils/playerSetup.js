import { ref } from "vue";

const players = {};

function createPlayer(idx) {
  return ref({
    id: idx,
    stats: {
      base: {
        hp: 100,
        atk: 10,
        def: 0,
        crit: 5,
        critDmg: 1.5,
        dodge: 0,
        hit: 0,
        aps: 0.5,
        minAps: 0.5,
        maxAps: 4,
        recovery: 1,
        regenMult: 1,
      },
      final: {},
    },
    hp: 100,
    dead: false,
    bar: 0,
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
      extraHits: 0,
      extraChance: 0,
      sourse: "player",
    },
    stun: 0,
    extras: {
      hits: 0,
      chance: 0,
    },
    status: {
      bleeding: {
        time: 0,
        dmg: 0,
      },
      stun: {
        d: 0,
        c: 0,
        immune: false,
      },
      invisible: {
        penetrateImmune: false,
        reduceDamage: false,
      },
      traveler: {
        exp: 1,
        soul: 1,
        eq: 1,
        ascension: 1,
        mut: 1,
        stardust: 1,
      },
      firstStrike: false,
      combo: {
        value: 0,
        max: 30,
        dmg: 1,
      },
      charges: {
        power: 0,
        energy: 0,
        life: 0,
      },
      conquer: {
        time: 0,
        maxTime: 500,
        loot: 1,
        tier: 0,
      },
      flexible: {
        stacks: 0,
        avoidSuccess: false,
        buffTime: 0,
      },
      extraLife: {
        risen: false,
        chance: 0.5,
        buffTime: 0,
        immuneTime: 0,
        shields: 0,
      },
      fastSlash: {
        asReduce: 1,
      },
      flash: {
        extraHits: 0,
        hitReq: 0,
        status: true,
        as: 0,
        maxAs: 0,
      },
      sniper: {
        apsSlow: 1,
        crit: 0,
        critDmg: 0,
        apsSlowTime: 0,
        ignoreAvoid: false,
      },
      berserk: {
        rage: 0,
        isRage: false,
        rageDmg: 1,
        lowLifeDmg: 1,
        crit: 0,
        critDmg: 0,
        lessDmg: 0,
        healMult: 1,
        lowLife: 0.3,
        status: false,
        rageTime: 1,
        rageTick: 1,
        rageTimer: 0,
      },
      juggernaut: {
        extraDef: 1,
      },
      blackImpulse: {
        stacks: 0,
        chance: 100,
        curseDisableTime: 0,
        dmgBonus: 1,
        defIgnored: false,
      },
      irradiation: {
        loseHp: false,
        stacks: 0,
        maxStacks: 10,
      },
      gravity: {
        active: false,
  
        tickTimer: 0,
        tickInterval: 0.2,
  
        stacks: 0,
        maxStacks: 50,
  
        stackDuration: 3,
        stacksTTL: [],
  
        dmgMultiplier: 1,
        overkills: 0,
        dotReduction: 1,
      },
      dims: {
        veil: {
          damage: 0,
        },
      },
      critMls: {
        healBlock: 0,
        loot: 1,
        overkill: 0,
      }
    },
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
    heal: {
      mult: 1,
      enemyMult: 1,
      regen: {
        s1: 0,
        s2: 0,
        s3: 0,
      }
    },
    overkill: {
      count: 0,
      loot: 0,
    },
    recoveryPenalty: 1,
    damageLog: [],
    attackCount: 0,
    activeFormation: null,
    formationStats: {
      atk: 1,
      hp: 1,
      def: 1,
      loot: 1
    },
    buff: {
      activeBuffs: [],
      selectedLayoutIndex: 0,
      overflowBuffs: [],
      overflowCount: 0,
    },
    curses: {
      cursedShield: 1,
    },
    statistic: {
      deaths: 0,
    }
  });
}

export function usePlayer(id = "main") {
  if (!players[id]) {
    players[id] = createPlayer(id);
  }

  return {
    player: players[id]
  };
}