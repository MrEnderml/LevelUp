export const cursed = [
    {
        name: "Penetration",
        id: 0,
        icon: "⚙️",
        tier: [
            {
                effect: "Penetrate 15% DEF",
                bonus: 0.9
            },
            {
                effect: "Penetrate 30% DEF",
                bonus: 1.8
            },
            {
                effect: "Penetrate 45% DEF",
                bonus: 3.6
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
                effect: "Heal 10% HP",
                bonus: 5
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
                effect: "Block 12% DMG",
                bonus: 1.1
            },
            {
                effect: "Block 25% DMG",
                bonus: 2.2
            },
            {
                effect: "Block 35% DMG",
                bonus: 4.4
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
                effect: "+0.8 Attack Per Second",
                bonus: 10
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
                effect: "8% to avoid attack",
                bonus: 1.8
            },
            {
                effect: "16% to avoid attack",
                bonus: 3.6
            },
            {
                effect: "24% to avoid attack",
                bonus: 7.2
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
                effect: "10% to STUN for 0.5 seconds",
                bonus: 3.5
            },
            {
                effect: "15% to STUN for 0.7 seconds",
                bonus: 7
            },
            {
                effect: "20% to STUN for 0.9 seconds",
                bonus: 14
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
                effect: "Each of your attack deals you 2% Max HP",
                bonus: 5
            },
            {
                effect: "Each of your attack deals you 3% Max HP",
                bonus: 10
            },
            {
                effect: "Each of your attack deals you 4% Max HP",
                bonus: 20
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
                effect: "Enemies gets 2% DEF from Max HP",
                bonus: 6
            },
            {
                effect: "Enemies gets 4% DEF from Max HP",
                bonus: 12
            },
            {
                effect: "Enemies gets 6% DEF from Max HP",
                bonus: 24
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
            }
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
            }
        ],
        status: false
    },
]