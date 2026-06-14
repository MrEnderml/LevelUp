import { getSvgIconHTML } from "../composables/SvgIcon";

export const cursed = [
    {
        name: "Penetration",
        id: 0,
        icon: "⚙️",
        tier: [
            {
                effect: "Reduces Hero Defense by 10%",
                bonus: 0.5
            },
            {
                effect: "Reduces Hero Defense by 20%",
                bonus: 1
            },
            {
                effect: "Reduces Hero Defense by 30%",
                bonus: 2
            },
            {
                effect: "Reduces Hero Defense by 40%",
                bonus: 4,
                status: false
            },
            {
                effect: "Reduces Hero Defense by 80%",
                bonus: 8,
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
                effect: "Enemy heals 3% of Max HP each second",
                bonus: 0.5
            },
            {
                effect: "Enemy heals 6% of Max HP each second",
                bonus: 1
            },
            {
                effect: "Enemy heals 9% of Max HP each second",
                bonus: 2
            },
            {
                effect: "Enemy heals 12% of Max HP each second",
                bonus: 4,
                status: false
            },
            {
                effect: "Enemy heals 20% of Max HP each second",
                bonus: 8,
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
                effect: "Hero deals 10% less damage.",
                bonus: 0.5
            },
            {
                effect: "Hero deals 20% less damage.",
                bonus: 1
            },
            {
                effect: "Hero deals 30% less damage.",
                bonus: 2
            },
            {
                effect: "Hero deals 40% less damage.",
                bonus: 4,
                status: false
            },
            {
                effect: "Hero deals 50% less damage.",
                bonus: 8,
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
                effect: "Enemy gains +0.3 APS.",
                bonus: 0.5
            },
            {
                effect: "Enemy gains +0.5 APS.",
                bonus: 1
            },
            {
                effect: "Enemy gains +0.7 APS.",
                bonus: 2
            },
            {
                effect: "Enemy gains +0.9 APS.",
                bonus: 4,
                status: false
            },
            {
                effect: "Enemy gains +1.5 APS.",
                bonus: 8,
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
                effect: "Enemy has a 4% chance to evade attacks.",
                bonus: 0.5
            },
            {
                effect: "Enemy has a 8% chance to evade attacks.",
                bonus: 1
            },
            {
                effect: "Enemy has a 12% chance to evade attacks.",
                bonus: 2
            },
            {
                effect: "Enemy has a 16% chance to evade attacks.",
                bonus: 4,
                status: false
            },
            {
                effect: "Enemy has a 25% chance to evade attacks.",
                bonus: 8,
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
                effect: "Enemy attacks have a 10% chance to stun the Hero for one second.",
                bonus: 0.5
            },
            {
                effect: "Enemy attacks have a 15% chance to stun the Hero for one second.",
                bonus: 1
            },
            {
                effect: "Enemy attacks have a 20% chance to stun the Hero for one second.",
                bonus: 2
            },
            {
                effect: "Enemy attacks have a 25% chance to stun the Hero for one second.",
                bonus: 4,
                status: false
            },
            {
                effect: "Enemy attacks have a 35% chance to stun the Hero for one second.",
                bonus: 8,
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
                effect: "Enemy gains 30% Critical Chance and 150% Critical Damage.",
                bonus: 0.5
            },
            {
                effect: "Enemy gains 25% Critical Chance and 200% Critical Damage.",
                bonus: 1
            },
            {
                effect: "Enemy gains 20% Critical Chance and 250% Critical Damage.",
                bonus: 2
            },
            {
                effect: "Enemy gains 15% Critical Chance and 300% Critical Damage.",
                bonus: 4,
                status: false
            },
            {
                effect: "Enemy gains 25 Critical Chance and 400% Critical Damage.",
                bonus: 8,
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
                effect: "Each Hero attack deals 2% of Hero’s Max HP as true damage to itself",
                bonus: 1
            },
            {
                effect: "Each Hero attack deals 3% of Hero’s Max HP as true damage to itself",
                bonus: 2
            },
            {
                effect: "Each Hero attack deals 4% of Hero’s Max HP as true damage to itself",
                bonus: 4
            },
            {
                effect: "Each Hero attack deals 5% of Hero’s Max HP as true damage to itself",
                bonus: 8,
                status: false
            },
            {
                effect: "Each Hero attack deals 8% of Hero’s Max HP as true damage to itself",
                bonus: 16,
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
                effect: "Enemy gains Defense equal to 15% of its Max HP.",
                bonus: 1
            },
            {
                effect: "Enemy gains Defense equal to 20% of its Max HP.",
                bonus: 2
            },
            {
                effect: "Enemy gains Defense equal to 25% of its Max HP.",
                bonus: 4,
            },
            {
                effect: "Enemy gains Defense equal to 30% of its Max HP.",
                bonus: 8,
                status: false
            },
            {
                effect: "Enemy gains Defense equal to 60% of its Max HP.",
                bonus: 16,
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
                effect: "Enemy Max HP is increased by 1.3.",
                bonus: 1
            },
            {
                effect: "Enemy Max HP is increased by 1.5.",
                bonus: 2
            },
            {
                effect: "Enemy Max HP is increased by 2.",
                bonus: 4
            },
            {
                effect: "Enemy Max HP is increased by 4.",
                bonus: 8,
                status: false
            },
            {
                effect: "Enemy Max HP is increased by 10.",
                bonus: 16,
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
                effect: "Enemy attacks have a 10% chance to inflict Bleeding, dealing 10% of Attack DMG as DMG over time for 2 seconds.",
                bonus: 2
            },
            {
                effect: "Enemy attacks have a 20% chance to inflict Bleeding, dealing 20% of Attack DMG as DMG over time for 3 seconds.",
                bonus: 4
            },
            {
                effect: "Enemy attacks have a 30% chance to inflict Bleeding, dealing 30% of Attack DMG as DMG over time for 4 seconds.",
                bonus: 8
            },
            {
                effect: "Enemy attacks have a 40% chance to inflict Bleeding, dealing 40% of Attack DMG as DMG over time for 5 seconds.",
                bonus: 16,
                status: false
            },
            {
                effect: "Enemy attacks have a 60% chance to inflict Bleeding, dealing 60% of Attack DMG as DMG over time for 6 seconds.",
                bonus: 32,
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
                bonus: 2
            },
            {
                effect: "The Hero's Regeneration is weaker by 20%",
                bonus: 4
            },
            {
                effect: "The Hero's Regeneration is weaker by 30%",
                bonus: 8
            },
            {
                effect: "The Hero's Regeneration is weaker by 40%",
                bonus: 16,
                status: false
            },
            {
                effect: "The Hero's Regeneration is weaker by 60%",
                bonus: 32,
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
                effect: "Enemy Attack is increased by 1.25",
                bonus: 2
            },
            {
                effect: "Enemy Attack is increased by 1.5",
                bonus: 4
            },
            {
                effect: "Enemy Attack is increased by 1.75",
                bonus: 8
            },
            {
                effect: "Enemy Attack is increased by 2",
                bonus: 16,
                status: false
            },
            {
                effect: "Enemy Attack is increased by 3",
                bonus: 32,
                status: false
            }
        ],
        status: false
    },
    {
        name: "True Sight",
        id: 13,
        icon: getSvgIconHTML('witheredAegis', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Increase Accuracy by 5%",
                bonus: 20
            },
            {
                effect: "Increase Accuracy by 7.5%",
                bonus: 40
            },
            {
                effect: "Increase Accuracy by 10%",
                bonus: 80
            },
            {
                effect: "Increase Accuracy by 12.5%",
                bonus: 160,
                status: false
            },
            {
                effect: "Increase Accuracy by 15%",
                bonus: 320,
                status: false
            }
        ],
        status: false,
        timer: 0,
    },
    {
        name: "Critical Lock",
        id: 14,
        icon: getSvgIconHTML('bloodOath', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Only Critical Hits can deal DMG",
                bonus: 30
            },
            {
                effect: "Only Critical Hits can deal DMG",
                bonus: 60
            },
            {
                effect: "Only Critical Hits can deal DMG",
                bonus: 120
            },
            {
                effect: "Only Critical Hits can deal DMG",
                bonus: 240,
                status: false
            },
            {
                effect: "Only Critical Hits can deal DMG",
                bonus: 480,
                status: false
            }
        ],
        crit: false,
        status: false
    },
    {
        name: "Unyielding Mind",
        id: 15,
        icon: getSvgIconHTML('famineToll', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Stun expires 10% faster",
                bonus: 30
            },
            {
                effect: "Stun expires 15% faster",
                bonus: 60
            },
            {
                effect: "Stun expires 20% faster",
                bonus: 120
            },
            {
                effect: "Stun expires 25% faster",
                bonus: 240,
                status: false
            },
            {
                effect: "Stun expires 30% faster",
                bonus: 480,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Critical Ward",
        id: 16,
        icon: getSvgIconHTML('blindJustice', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "2% Critical Resistance",
                bonus: 35
            },
            {
                effect: "4% Critical Resistance",
                bonus: 70
            },
            {
                effect: "6% Critical Resistance",
                bonus: 140
            },
            {
                effect: "8% Critical Resistance",
                bonus: 280,
                status: false
            },
            {
                effect: "10% Critical Resistance",
                bonus: 560,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Withering Spoils",
        id: 17,
        icon: getSvgIconHTML('perditionPoverty', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Enemies grant 95% fewer resources upon death.",
                bonus: 40
            },
            {
                effect: "Enemies grant 90% fewer resources upon death.",
                bonus: 80
            },
            {
                effect: "Enemies grant 85% fewer resources upon death.",
                bonus: 160
            },
            {
                effect: "Enemies grant 80% fewer resources upon death.",
                bonus: 320,
                status: false
            },
            {
                effect: "Enemies grant 75% fewer resources upon death.",
                bonus: 640,
                status: false
            }
        ],
        loot: 1,
        status: false
    },
    {
        name: "Echo Strike",
        id: 18,
        icon: getSvgIconHTML('perditionReflexes', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "5% chance to perform extra hit",
                bonus: 45
            },
            {
                effect: "10% chance to perform extra hit",
                bonus: 90
            },
            {
                effect: "15% chance to perform extra hit",
                bonus: 180
            },
            {
                effect: "20% chance to perform extra hit",
                bonus: 360,
                status: false
            },
            {
                effect: "25% chance to perform extra hit",
                bonus: 720,
                status: false
            }
        ],
        status: false
    },
    {
        name: "Crit Dampening",
        id: 19,
        icon: getSvgIconHTML('perditionResilience', '1.5em'),
        perdition: 1,
        tier: [
            {
                effect: "Enemy takes 10% reduced damage from Critical Hits.",
                bonus: 50
            },
            {
                effect: "Enemy takes 15% reduced damage from Critical Hits.",
                bonus: 100
            },
            {
                effect: "Enemy takes 20% reduced damage from Critical Hits.",
                bonus: 200
            },
            {
                effect: "Enemy takes 25% reduced damage from Critical Hits.",
                bonus: 400,
                status: false
            },
            {
                effect: "Enemy takes 30% reduced damage from Critical Hits.",
                bonus: 800,
                status: false
            }
        ],
        status: false
    }
]