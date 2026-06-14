export const notifications = [
    {
      id: "firstBoss",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.stages.current >= 5,
  
      message: {
        text: "You've reached the first boss encounter. Learn more in Info Section [Combat Mechanics]",
        link: {
          set: "Info",
          info: "Info",
          stat: "Boss"
        }
      }
    },

    {
      id: "abyss-1",
  
      once: false,
  
      condition: (ctx) =>
        ctx.h.isAbyss && ctx.h.abyssTier == 0 && ctx.h.stages.current >= 20,
  
      message: {
        text: "You complete the Abyss [T0]. Click on icon to leave.",
      },

      cooldown: 2000,
    },

    {
      id: "abyss-2",
  
      once: false,
  
      condition: (ctx) =>
        ctx.h.isAbyss && ctx.h.abyssTier == 1 && ctx.h.stages.current >= 30,
  
      message: {
        text: "You complete the Abyss [T1]. Click on icon to leave.",
      },

      cooldown: 2000,
    },

    {
      id: "abyss-3",
  
      once: false,
  
      condition: (ctx) =>
        ctx.h.isAbyss && ctx.h.abyssTier == 2 && ctx.h.stages.current >= 40,
  
      message: {
        text: "You complete the Abyss [T2]. Click on icon to leave.",
      },

      cooldown: 2000,
    },

    {
      id: "celestialAppears",
  
      once: false,
  
      message: {
        text: "Celestial is appeared",
      },

      cooldown: 2000,
    },

    {
      id: "firstCorruption",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.spaceUnlocked,
  
      message: {
        text: "Your world has been overwhelmed by an unknown entity. You have discovered corruption. Hover over the icon located in the Progression."
      }
    },

    {
      id: "singLevel",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singularityLevels > 0,
  
      message: {
        text: "You have harnessed the fundamentals of gravity. You have reached singularity levels. Learn more in the info section [Levels]"
      }
    },

    {
      id: "singTrial",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singLeft,
  
      message: {
        text: "You've left the singularity. There's no need to end it now that it opens. Become stronger and come back to try again."
      }
    },

    {
      id: "singResonance",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singularity >= 2,
  
      message: {
        text: "Corruption affects the perception of curses. You unlock Resonance. Learn more in the Amulet section."
      }
    },

    {
      id: "freeTreePoints",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.tree.freePoints > 0,
  
      message: {
        text: "You've unlocked Free Tree Points. Learn more in the Tree section."
      }
    },

    {
      id: "infResistance",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.infPenalty > 0,
  
      message: {
        text: "You've unlocked Infinity Resistance. Learn more in the Infinity section."
      }
    },

    {
      id: "dimShards",
  
      once: true,
  
      condition: (ctx) =>
        ctx.dim[9].infTier >= ctx.dim[9].spInfTier,
  
      message: {
        text: "You've unlocked Dimension Shards. Hover over the Ascension icon in the Progress section in main dimension"
      }
    },

    {
      id: "perdition",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.mainInfTier >= 20,
  
      message: {
        text: "You cross the Infinity Line. [D-Infinity] rains down Perditions upon you."
      }
    },

    {
      id: "advancedCurse",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singularity >= 8,
  
      message: {
        text: "You've unlocked Advanced Curse. Learn more in the Amulet section."
      }
    },

    {
      id: "gravityPressure",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.trueLevel >= 60000 && ctx.h.dId == 'main',
  
      message: {
        text: "You are under the pressure of Gravity. Reach 70k True Level to gain your first Transcendancy."
      }
    },

    {
      id: "tr",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.trueLevel >= 70000 && ctx.h.dId == 'main',
  
      message: {
        text: "You've reach your first Transcendancy. Learn more in the Progress section."
      }
    },

    {
      id: "bh",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.rebirthPts >= 1e7,
  
      message: {
        text: "Under the pressure of gravity you've unlocked Black Hole. Find the Black Hole in D-Atlas."
      }
    },

    {
      id: "darkDims",
  
      once: true,
  
      condition: (ctx) =>
        ctx.dim[13].infTier >= 25 && ctx.dim[22].infTier >= 35 && ctx.h.mainInfTier >= 35,
  
      message: {
        text: "You have reached the dark substance. By entering it, you have opened a passage to other worlds. You've unlocked the dark dimensions."
      }
    },

    {
      id: "quasarCores",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.mainInfTier >= 50,
  
      message: {
        text: "By suppressing the power of Infinity, you call upon the mighty force of this world. You've unlocked the Quasar Cores."
      }
    },

    {
      id: "d-corr",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.mainInfTier >= 60,
  
      message: {
        text: "[D-Corruption] reveals himself to this world. Corruption becomes more concentrated, tearing the fabric of space. You've unlocked dimensions affected by [D-Corruption]"
      }
    },

    {
      id: "bh-4",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.bhTier >= 4,
  
      message: {
        text: "Under the influence of gravity, you distort time, creating a temporal rift. You've unlocked Timeline."
      }
    },

    {
      id: "bh-5",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.bhTier >= 5,
  
      message: {
        text: "By compressing space to the smallest particle, you create your first singularity shards. Reach Stage 300 in the main dimension to unlock a new Trial."
      }
    },

    {
      id: "tm-complete",
  
      once: false,
  
  
      message: {
        text: "You return to your main timeline. You've received the Stone of Law."
      },

      cooldown: 4000,
    },

    {
      id: "tm-auto-complete",
  
      once: false,
  
  
      message: {
        text: "AUTO TIMELINE has returned to the main timeline. You've received the Stone of Law."
      },

      cooldown: 4000,
    },

    {
        id: 'inventoryWarning',
      
        once: false,
      
        cooldown: 4000,
      
        message: {
          text: '[Laws]: Inventory almost full.'
        }
      }
  ];

  //unlock bh
  //reach first tr

  //Magnitude information can be found in the information panel.
  //you reach your first gravity level. The req is getting much worse. Gravity levels grants double stats on level up
  //you reach certain stage in Abyss. Click on abyss icon to complete the Abyss Trial.