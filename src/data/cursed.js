import { getSvgIconHTML } from "../composables/svgIcon"

export const cursed = [
    {
        name: "Penetration",
        id: 0,
        icon: "⚙️",
        tier: [
            {
                effect: "Penetrate 10% DEF",
                bonus: 0.9
            },
            {
                effect: "Penetrate 20% DEF",
                bonus: 1.8
            },
            {
                effect: "Penetrate 30% DEF",
                bonus: 3.6
            },
            {
                effect: "Penetrate 40% DEF",
                bonus: 7.2,
                status: false
            },
            {
                effect: "Penetrate 80% DEF",
                bonus: 14.4,
                status: false
            }
        ],
        status: true
    },
    {
        name: "Active Blood",
        id: 1,
        icon: "💉",
        tier: [
            {
                effect: "Heal 3% HP",
                bonus: 1.2
            },
            {
                effect: "Heal 6% HP",
                bonus: 2.5
            },
            {
                effect: "Heal 9% HP",
                bonus: 5
            },
            {
                effect: "Heal 12% HP",
                bonus: 10,
                status: false
            },
            {
                effect: "Heal 20% HP",
                bonus: 20,
                status: false
            }
        ],
        time: 0,
        status: true
    },
    {
        name: "Cursed Shield",
        id: 2,
        icon: "🛡️",
        tier: [
            {
                effect: "Absorb 10% DMG",
                bonus: 1.1
            },
            {
                effect: "Absorb 20% DMG",
                bonus: 2.2
            },
            {
                effect: "Absorb 30% DMG",
                bonus: 4.4
            },
            {
                effect: "Absorb 40% DMG",
                bonus: 8.8,
                status: false
            },
            {
                effect: "Absorb 50% DMG",
                bonus: 17.6,
                status: false
            }
        ],
        status: true
    },
    {
        name: "Fast Reflexes",
        id: 3,
        icon: "🌪️",
        tier: [
            {
                effect: "+0.3 Attack Per Second",
                bonus: 2.5
            },
            {
                effect: "+0.5 Attack Per Second",
                bonus: 5
            },
            {
                effect: "+0.7 Attack Per Second",
                bonus: 10
            },
            {
                effect: "+0.9 Attack Per Second",
                bonus: 20,
                status: false
            },
            {
                effect: "+1.5 Attack Per Second",
                bonus: 40,
                status: false
            }
        ],
        status: true
    },
    {
        name: "Acrobatic",
        id: 4,
        icon: "🤺",
        tier: [
            {
                effect: "4% to avoid attack",
                bonus: 1.8
            },
            {
                effect: "8% to avoid attack",
                bonus: 3.6
            },
            {
                effect: "12% to avoid attack",
                bonus: 7.2
            },
            {
                effect: "16% to avoid attack",
                bonus: 14.4,
                status: false
            },
            {
                effect: "25% to avoid attack",
                bonus: 28.8,
                status: false
            }
        ],
        status: true
    },
    {
        name: "Stun",
        id: 5,
        icon: "💫",
        tier: [
            {
                effect: "10% to STUN for 0.4 seconds",
                bonus: 3.5
            },
            {
                effect: "15% to STUN for 0.6 seconds",
                bonus: 7
            },
            {
                effect: "20% to STUN for 0.8 seconds",
                bonus: 14
            },
            {
                effect: "25% to STUN for 1 seconds",
                bonus: 28,
                status: false
            },
            {
                effect: "35% to STUN for 1.2 seconds",
                bonus: 56,
                status: false
            }
        ],
        time: 0,
        status: true
    },
    {
        name: "Accurate Blow",
        id: 6,
        icon: "💢",
        tier: [
            {
                effect: "30% to CRIT 150% DMG",
                bonus: 2.4
            },
            {
                effect: "25% to CRIT 200% DMG",
                bonus: 4.8
            },
            {
                effect: "20% to CRIT 250% DMG",
                bonus: 9.6
            },
            {
                effect: "15% to CRIT 300% DMG",
                bonus: 19.2,
                status: false
            },
            {
                effect: "25% to CRIT 400% DMG",
                bonus: 38.4,
                status: false
            }
        ],
        status: true
    },
    {
        name: "Self-destruction",
        id: 7,
        icon: "🔪",
        tier: [
            {
                effect: "Each of enemy attack deals hero 2% Max HP",
                bonus: 5
            },
            {
                effect: "Each of enemy attack deals hero 3% Max HP",
                bonus: 10
            },
            {
                effect: "Each of enemy attack deals hero 4% Max HP",
                bonus: 20
            },
            {
                effect: "Each of enemy attack deals hero 5% Max HP",
                bonus: 40,
                status: false
            },
            {
                effect: "Each of enemy attack deals hero 8% Max HP",
                bonus: 80,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Steel skin",
        id: 8,
        icon: "🔰",
        tier: [
            {
                effect: "Enemy gets 2% DEF from Max HP",
                bonus: 6
            },
            {
                effect: "Enemy gets 4% DEF from Max HP",
                bonus: 12
            },
            {
                effect: "Enemy gets 6% DEF from Max HP",
                bonus: 24
            },
            {
                effect: "Enemy gets 8% DEF from Max HP",
                bonus: 48,
                status: false
            },
            {
                effect: "Enemy gets 12% DEF from Max HP",
                bonus: 96,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Titan",
        id: 9,
        icon: "👣",
        tier: [
            {
                effect: "x1.3 Max HP",
                bonus: 6.5
            },
            {
                effect: "x1.5 Max HP",
                bonus: 13
            },
            {
                effect: "x1.8 Max HP",
                bonus: 26
            },
            {
                effect: "x2 Max HP",
                bonus: 52,
                status: false
            },
            {
                effect: "x3 Max HP",
                bonus: 104,
                status: false
            },
        ],
        status: false
    },
    {
        name: "Bleeding",
        id: 10,
        icon: "🩸",
        tier: [
            {
                effect: "5% to bleed by 10% from Attack for 2 seconds",
                bonus: 8
            },
            {
                effect: "10% to bleed by 20% from Attack for 3 seconds",
                bonus: 16
            },
            {
                effect: "15% to bleed by 30% from Attack for 4 seconds",
                bonus: 32
            },
            {
                effect: "20% to bleed by 40% from Attack for 5 seconds",
                bonus: 64,
                status: false
            },
            {
                effect: "30% to bleed by 60% from Attack for 6 seconds",
                bonus: 128,
                status: false
            }
        ],
        status: false,
        bleed: 0,
        time: 0
    },
    {
        name: "Dirty Blood",
        id: 11,
        icon: "🩹",
        tier: [
            {
                effect: "The Hero's Regeneration is weaker by 10%",
                bonus: 9
            },
            {
                effect: "The Hero's Regeneration is weaker by 20%",
                bonus: 18
            },
            {
                effect: "The Hero's Regeneration is weaker by 30%",
                bonus: 36
            },
            {
                effect: "The Hero's Regeneration is weaker by 40%",
                bonus: 72,
                status: false
            },
            {
                effect: "The Hero's Regeneration is weaker by 60%",
                bonus: 144,
                status: false
            }
        ],
        status: false,
        mult: 0
    },
    {
        name: "Strong Muscles",
        id: 12,
        icon: "💪",
        tier: [
            {
                effect: "x1.25 Attack",
                bonus: 10
            },
            {
                effect: "x1.5 Attack",
                bonus: 20
            },
            {
                effect: "x1.75 Attack",
                bonus: 40
            },
            {
                effect: "x2 Attack",
                bonus: 80,
                status: false
            },
            {
                effect: "x3 Attack",
                bonus: 160,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Perdition of Decay",
        id: 13,
        icon: getSvgIconHTML('witheredAegis', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Recovering from death takes longer by 1.25",
                bonus: 20
            },
            {
                effect: "Recovering from death takes longer by 1.5",
                bonus: 40
            },
            {
                effect: "Recovering from death takes longer by 1.75",
                bonus: 80
            },
            {
                effect: "Recovering from death takes longer by 2.25",
                bonus: 160,
                status: false
            },
            {
                effect: "Recovering from death takes longer by 3",
                bonus: 320,
                status: false
            }
        ],
        status: false,
        timer: 0,
    },
    {
        name: "Perdition of Fragility",
        id: 14,
        icon: getSvgIconHTML('bloodOath', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Only critical hits can deal damage",
                bonus: 30
            },
            {
                effect: "Only critical hits can deal damage",
                bonus: 60
            },
            {
                effect: "Only critical hits can deal damage",
                bonus: 120
            },
            {
                effect: "Only critical hits can deal damage",
                bonus: 240,
                status: false
            },
            {
                effect: "Only critical hits can deal damage",
                bonus: 480,
                status: false
            }
        ],
        crit: false,
        status: false
    },
    {
        name: "Perdition of Thorns",
        id: 15,
        icon: getSvgIconHTML('famineToll', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Heal 2% of HP on a successful Block. (Block - when Defense absorbs the full damage)",
                bonus: 30
            },
            {
                effect: "Heal 3% of HP on a successful Block. (Block - when Defense absorbs the full damage)",
                bonus: 60
            },
            {
                effect: "Heal 4% of HP on a successful Block. (Block - when Defense absorbs the full damage)",
                bonus: 120
            },
            {
                effect: "Heal 5% of HP on a successful Block. (Block - when Defense absorbs the full damage)",
                bonus: 240,
                status: false
            },
            {
                effect: "Heal 6% of HP on a successful Block. (Block - when Defense absorbs the full damage)",
                bonus: 480,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Perdition of Ferocity",
        id: 16,
        icon: getSvgIconHTML('blindJustice', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "10% chance to deal an extra hit. The extra hit deals double damage",
                bonus: 35
            },
            {
                effect: "15% chance to deal an extra hit. The extra hit deals double damage",
                bonus: 70
            },
            {
                effect: "20% chance to deal an extra hit. The extra hit deals double damage",
                bonus: 140
            },
            {
                effect: "25% chance to deal an extra hit. The extra hit deals double damage",
                bonus: 280,
                status: false
            },
            {
                effect: "30% chance to deal an extra hit. The extra hit deals double damage",
                bonus: 560,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Perdition of Poverty",
        id: 17,
        icon: getSvgIconHTML('perditionPoverty', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Gives 95% less resources upon death",
                bonus: 40
            },
            {
                effect: "Gives 90% less resources upon death",
                bonus: 80
            },
            {
                effect: "Gives 85% less resources upon death",
                bonus: 160
            },
            {
                effect: "Gives 80% less resources upon death",
                bonus: 320,
                status: false
            },
            {
                effect: "Gives 75% less resources upon death",
                bonus: 640,
                status: false
            }
        ],
        loot: 1,
        status: false
    },
    {
        name: "Perdition of Reflexes",
        id: 18,
        icon: getSvgIconHTML('perditionReflexes', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Heal 2% of max HP on successful avoidance",
                bonus: 45
            },
            {
                effect: "Heal 3% of max HP on successful avoidance",
                bonus: 90
            },
            {
                effect: "Heal 4% of max HP on successful avoidance",
                bonus: 180
            },
            {
                effect: "Heal 5% of max HP on successful avoidance",
                bonus: 360,
                status: false
            },
            {
                effect: "Heal 6% of max HP on successful avoidance",
                bonus: 720,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Perdition of Resilience",
        id: 19,
        icon: getSvgIconHTML('perditionResilience', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Take 10% reduced damage from critical attacks.",
                bonus: 50
            },
            {
                effect: "Take 15% reduced damage from critical attacks.",
                bonus: 100
            },
            {
                effect: "Take 20% reduced damage from critical attacks.",
                bonus: 200
            },
            {
                effect: "Take 25% reduced damage from critical attacks.",
                bonus: 400,
                status: false
            },
            {
                effect: "Take 30% reduced damage from critical attacks.",
                bonus: 800,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Perdition of Onslaught",
        id: 20,
        icon: getSvgIconHTML('perditionOnslaught', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Next enemy spawns after 0.1s.",
                bonus: 55
            },
            {
                effect: "Next enemy spawns after 0.2s.",
                bonus: 110
            },
            {
                effect: "Next enemy spawns after 0.3s.",
                bonus: 220
            },
            {
                effect: "Next enemy spawns after 0.4s.",
                bonus: 440,
                status: false
            },
            {
                effect: "Next enemy spawns after 0.5s.",
                bonus: 880,
                status: false
            }
        ],
        status: false
    },
]