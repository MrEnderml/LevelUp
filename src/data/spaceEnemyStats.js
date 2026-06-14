export const spaceStatsConfig = {
    // === TIMERS ===
    fightCooldown: {
      base: 20,
      celestial: -1,
      infWarden: -0.05,
      min: 5,
      format: v => `${v.toFixed(1)}s`,
    },
  
    // === DEF / SURVIVAL ===
    defIgnore: {
      base: 0,
      celestial: 3,
      infWarden: 1.5,
      max: 100,
      format: v => `${v.toFixed(1)}%`,
    },
  
    lifeSteal: {
      base: 0,
      celestial: 0.25,
      infWarden: 0.05,
      max: 10,
      format: v => `${v.toFixed(2)}%`,
    },
  
    hpRegen: {
      base: 0,
      celestial: 0.2,
      infWarden: 0.3,
      max: 25,
      format: v => `${v.toFixed(2)}%`,
    },
  
    blockChance: {
      base: 0,
      celestial: 0.5,
      infWarden: 0.25,
      max: 75,
      format: v => `${v.toFixed(2)}%`,
    },
  
    avoid: {
      base: 0,
      celestial: 1,
      infWarden: 0.2,
      max: 60,
      format: v => `${v.toFixed(2)}%`,
    },
    
    lessDMGTaken: {
      base: 0,
      celestial: 2,
      infWarden: 0.4,
      max: 90,
      format: v => `${v.toFixed(2)}%`,
    },
  
    lessDMGTakenFromCrits: {
      base: 0,
      celestial: 1.5,
      infWarden: 0.25,
      max: 100,
      format: v => `${v.toFixed(2)}%`,
    },
  
    // === OFFENSE ===
    hit: {
      base: 0,
      celestial: 1.5,
      infWarden: 0.25,
      format: v => `${v.toFixed(1)}`,
    },
  
    multiHit: {
      base: 0,
      celestial: 2.5,
      infWarden: 1.25,
      max: 100,
      format: v => `${v.toFixed(2)}%`,
    },
  
    critChance: {
      base: 0,
      celestial: 1.5,
      infWarden: 0.75,
      max: 100,
      format: v => `${v.toFixed(2)}%`,
    },
  
    critDMG: {
      base: 0,
      celestial: 0.1,
      infWarden: 0.05,
      format: v => `x${v.toFixed(2)}`,
    },
  
    // === CONTROL ===
    stunChance: {
      base: 0,
      celestial: 0.25,
      infWarden: 0.15,
      max: 100,
      format: v => `${v.toFixed(2)}%`,
    },
  
    stunDuration: {
      base: 0,
      celestial: 0.05,
      infWarden: 0.03,
      format: v => `${v.toFixed(2)}s`,
    },
  
    // === SPEED ===
    aps: {
      base: 0,
      celestial: 0.05,
      infWarden: 0.005,
      format: v => v.toFixed(3),
    },
  
    maxAps: {
      base: 0,
      celestial: 0.02,
      infWarden: 0.01,
      format: v => v.toFixed(3),
    },
  
    minAps: {
      base: 0,
      celestial: 0.01,
      infWarden: 0.005,
      format: v => v.toFixed(3),
    },

    defMult: {
      base: 1,
      celestial: 2.5,
      infWarden: 0.75,
      format: v => v.toFixed(1),
    },
    hpMult: {
      base: 1,
      celestial: 7.5,
      infWarden: 1.75,
      format: v => v.toFixed(1),
    },
    atkMult: {
      base: 1,
      celestial: 0.5,
      infWarden: 0.05,
      format: v => v.toFixed(1),
    },
    immune: {
      base: 0,
      celestial: 1,
      infWarden: 0.08,
      format: v => v.toFixed(1),
    }
  }
  