import { ref } from 'vue';

export const timelineLevels = [
    {
      tier: 1,
      name: "Epoch of Dawn",
      color: "#1cdd1c",
      desc: "The first age, when titans shaped the stars.",
      req: {
        'Enemy Power': 100,
        'Curse Power': 5,
        'Corruption Influence': 5,
        'Infinity Tier': 60,
        'Stage': 100,
        'Total Level': 1000,
      }
    },
    {
      tier: 2,
      name: "Era of Shadows",
      color: "yellow",
      desc: "When darkness challenged the titans' will.",
      req: {
        'Enemy Power': 500,
        'Curse Power': 10,
        'Corruption Influence': 10,
        'Infinity Tier': 70,
        'Stage': 125,
        'Total Level': 1250,
      }
    },
    {
      tier: 3,
      name: "Age of Titans",
      color: "red",
      desc: "The reign of ancient colossi over time itself.",
      req: {
        'Enemy Power': 2500,
        'Curse Power': 25,
        'Corruption Influence': 15,
        'Infinity Tier': 80,
        'Stage': 150,
        'Total Level': 1500,
      }
    },
    { 
      tier: 4,
      name: "Cycle of Eternity",
      color: "rgb(169, 61, 242)",
      desc: "Infinity bends, and titans carve destiny anew.",
      req: {
        'Enemy Power': 12500,
        'Curse Power': 50,
        'Corruption Influence': 20,
        'Infinity Tier': 90,
        'Stage': 175,
        'Total Level': 1750,
      }
    },
    {
      tier: 5,
      name: "Singularity Era",
      color: "#66ffcc",
      desc: "All paths converge, as titans transcend time.",
      req: {
        'Enemy Power': 62500,
        'Curse Power': 100,
        'Corruption Influence': 25,
        'Infinity Tier': 100,
        'Stage': 200,
        'Total Level': 2000,
      }
    },
  ]