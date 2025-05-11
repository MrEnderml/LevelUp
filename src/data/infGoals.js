import { ref } from 'vue';

export const goals = ref([
    {
      id: 1,
      icon: '💎',
      requirement: [
        'Reach Infinity [T1]',
        'Reach Infinity [T2]',
        'Reach Infinity [T3]',
        'Reach Infinity [T4]',
        'Reach Infinity [T5]',
        'Reach Infinity [T6]',
        'Reach Infinity [T7]',
        'Reach Infinity [T-E]'
      ],
      reward: 10,
      completed: false,
      tier: 0,
      maxTier: 7
    },
    {
      id: 2,
      icon: '🧿',
      requirement: [
        'Reach 20 stage in Abyss D',
        'Reach 35 stage in Abyss D',
        'Reach 50 stage in Abyss D',
        'Reach 65 stage in Abyss D',
        'Reach 80 stage in Abyss D',
        'Reach E stage in Abyss D',
      ],
      reward: 15,
      completed: false,
      tier: 0,
      maxTier: 5
    },
    {
      id: 3,
      icon: '⚔️',
      requirement: [
        'Deal 2M Damage',
        'Deal 4M Damage',
        'Deal 6M Damage',
        'Deal 8M Damage',
        'Deal 10M Damage',
        'Deal 12M Damage',
        'Deal 14M Damage',
        'Deal 1-E Damage',
      ],
      reward: 5,
      completed: false,
      tier: 0,
      maxTier: 7
    },
    {
      id: 4,
      icon: '💀',
      requirement: [
        'Reach Soul [T10]',
        'Reach Soul [T12]',
        'Reach Soul [T14]',
        'Reach Soul [T16]',
        'Reach Soul [T18]',
        'Reach Soul [T20]',
        'Reach Soul [T22]',
        'Reach Soul [T24]',
        'Reach Soul [T-E]',
      ],
      reward: 10,
      completed: false,
      tier: 0,
      maxTier: 8
    },
    {
      id: 5,
      icon: '☄️',
      requirement: [
        'Upgrade Space Ring 50 times',
        'Upgrade Space Ring 75 times',
        'Upgrade Space Ring 100 times',
        'Upgrade Space Ring 125 times',
        'Upgrade Space Ring 150 times',
        'Upgrade Space Ring 175 times',
        'Upgrade Space Ring E times'
      ],
      reward: 10,
      completed: false,
      tier: 0,
      maxTier: 6
    },
    {
        id: 6,
        icon: '✨',
        requirement: [
          'Reach Celestial Greatsword [T3]',
          'Reach Celestial Greatsword [T6]',
          'Reach Celestial Greatsword [T9]',
          'Reach Celestial Greatsword [T12]',
          'Reach THE ETERNITY BRIGHT [T3]',
          'Reach Dimension Destroyer [T-E]'
        ],
        reward: 10,
        completed: false,
        tier: 0,
        maxTier: 5
    },
    {
      id: 7,
      icon: '🌌',
      requirement: [
        'Reach Total Lvl 750',
        'Reach Total Lvl 800',
        'Reach Total Lvl 850',
        'Reach Total Lvl 900',
        'Reach Total Lvl 950',
        'Reach Total Lvl E'
      ],
      reward: 10,
      completed: false,
      tier: 0,
      maxTier: 5
    },
    {
      id: 8,
      icon: '♊',
      requirement: [
        'Reach True Lvl 1500',
        'Reach True Lvl 1650',
        'Reach True Lvl 1800',
        'Reach True Lvl 1950',
        'Reach True Lvl 2100',
        'Reach True Lvl E',
      ],
      reward: 10,
      completed: false,
      tier: 0,
      maxTier: 5
    },
    {
      id: 9,
      icon: '🦠',
      requirement: [
        'Corruption - 0.6',
        'Corruption - 0.7',
        'Corruption - 0.8',
        'Corruption - 0.9',
        'Corruption - 1',
        'Corruption - E'
      ],
      reward: 20,
      completed: false,
      tier: 0,
      maxTier: 5
    },
    {
      id: 10,
      icon: '🧬',
      requirement: [
        'Potential - 200',
        'Potential - 250',
        'Potential - 300',
        'Potential - 350',
        'Potential - 400',
        'Potential - E'
      ],
      reward: 10,
      completed: false,
      tier: 0,
      maxTier: 5
    },
  ]);
  