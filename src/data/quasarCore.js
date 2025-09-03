import { ref } from 'vue';
import { getSvgIconHTML } from '../composables/svgIcon.js';

export const divineSkills = ref([
    { 
      id: 0, 
      name: "Quasar Shackles", 
      icon: getSvgIconHTML('crystalOrb', '1.5em'), 
      desc: "Curse power is weaker, but you also gain fewer bonuses from Curses. [%v] - [%v]",
      values: [0.5, 0.5], 
    },
    { 
      id: 1, 
      name: "Stellar Equilibrium", 
      icon: getSvgIconHTML('expBalance', '1.5em'), 
      desc: "Your max level scales worse, but you gain EXP multiplier. [] - []",
      values: [0.5, 1],
    },
    { 
      id: 2, 
      name: "Event Horizon", 
      icon: getSvgIconHTML('crossedSwords', '1.5em'), 
      desc: "Infinity penalty reduction depends on IP, but you suffer an IP penalty. [] - []", 
      values: [0.01, 0.25],
    },
    { 
      id: 3, 
      name: "Nova Surge", 
      icon: getSvgIconHTML('apsDmg', '1.5em'), 
      desc: "Overcapped APS is converted into MULT DMG. []",
      values: [1.00], 
    },
    { 
      id: 4, 
      name: "Radiant Core", 
      icon: getSvgIconHTML('infIp', '1.5em'), 
      desc: "Increases the cap of Genetic Overload *Radiation*, but its cost scales much worse. [] - []",
      values: [0, 50], 
    },
    { 
      id: 5, 
      name: "Temporal Renewal", 
      icon: '♻️', 
      desc: "Gain Rebirth Tier automatically over time.",
      values: [], 
    },
    { 
      id: 6, 
      name: "The Basis of the Limit", 
      icon: '💀', 
      desc: "Automatically gain souls based on DMG. D-Soul is blocked. No Soul encounters. []",
      values: [0.75],
    },
    { 
      id: 7, 
      name: "Quasar Radiance", 
      icon: getSvgIconHTML('downArrow', '1.5em'), 
      desc: "Danger Power affects Stardust drop, but you gain lower multipliers to EXP, Equipment Chance, BUFF EXP and Mutagen. [] - []",
      values: [1.00, 0.25], 
    },
    { 
      id: 8, 
      name: "Singularity Destruction", 
      icon: getSvgIconHTML('lvlReduction', '1.5em'), 
      desc: "Gain Infinity penalty reduction, but your base stats are weaker. [] - []",
      values: [0.01, 0.1], 
    },
    { 
      id: 9, 
      name: "Dark Power", 
      icon: getSvgIconHTML('ipMult', '1.5em'), 
      desc: "If your Corruption is higher than 10, gain extra IP MULT. Works only in Dark Dimensions. []",
      values: [1.00] 
    },
    { 
      id: 10, 
      name: "Fluctuation failures", 
      icon: getSvgIconHTML('crystalOrb2', '1.5em'), 
      desc: "Curses are stronger, but they provide greater bonuses. [] - []",
      values: [2, 1.5], 
    },
    { 
      id: 11, 
      name: "Soul Eclipse", 
      icon: getSvgIconHTML('crossedSkull', '1.5em'), 
      desc: "Souls gain a multiplier for resources, but D-Soul is blocked. All Souls are reset. []",
      values: [1.00] 
    },
    { 
      id: 12, 
      name: "Doomflare", 
      icon: getSvgIconHTML('dangerSkull', '1.5em'), 
      desc: "Gain more Danger, but Danger Power scales worse. [] - []",
      values: [0, 0.5], 
    },
    { 
      id: 13, 
      name: "Destruction of the continuum", 
      icon: getSvgIconHTML('maxLevel', '1.5em'), 
      desc: "Gain a penalty to EXP MULT, but gain extra MIN Level MULT. [] - []",
      values: [0.01, 0], 
    },
    { 
      id: 14, 
      name: "Anti-Radiation", 
      icon: getSvgIconHTML('antiRadiation', '1.5em'), 
      desc: "You applied max danger. Radiation Perks are blocked. Danger Power: ^[]",
      values: [0.95], 
    }
  ]);