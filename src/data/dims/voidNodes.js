import { ref } from "vue"
import { newicons } from "../../composables/icons"

export const nodes = ref([

    /*
    =========================
    VOID SHARDS
    =========================
    */
  
    {
      id: "vs_1",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: `1`,
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 5,
      costGrow: 0,
  
      locked: false,
      canBuy: true,
      noResources: false
    },
  
    {
      id: "vs_2",
      idx: 0,
      group: "void_shards",
  
      x: 150,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: `1`,
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 15,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_1'],
    },
  
    {
      id: "vs_3",
      idx: 0,
      group: "void_shards",
  
      x: 300,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '1',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 35,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_2'],
    },
  
    {
      id: "vs_4",
      idx: 0,
      group: "void_shards",
  
      x: 450,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 100,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_3'],
    },
  
    {
      id: "vs_5",
      idx: 0,
      group: "void_shards",
  
      x: 600,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 500,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_4'],
    },
  
    {
      id: "vs_101",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: 150,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 15,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_1'],
    },
  
    {
      id: "vs_102",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: 300,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 35,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_101'],
    },
  
    {
      id: "vs_103",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: 450,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 100,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_102'],
    },
  
    {
      id: "vs_201",
      idx: 0,
      group: "void_shards",
  
      x: -150,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 15,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_1'],
    },
  
    {
      id: "vs_202",
      idx: 0,
      group: "void_shards",
  
      x: -300,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 35,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_201'],
    },
  
    {
      id: "vs_203",
      idx: 0,
      group: "void_shards",
  
      x: -450,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 100,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_202'],
    },
  
    {
      id: "vs_204",
      idx: 0,
      group: "void_shards",
  
      x: -600,
      y: 0,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 500,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_203'],
    },
  
    {
      id: "vs_301",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: -150,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 15,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_1'],
    },
  
    {
      id: "vs_302",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: -300,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
      
      cost: 35,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_301'],
    },
  
    {
      id: "vs_303",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: -450,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',

      cost: 100,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_302'],
    },
  
    {
      id: "vs_304",
      idx: 0,
      group: "void_shards",
  
      x: 0,
      y: -600,
  
      name: "Void",
      desc: "+0.01 Void Shards MULT",
      rewardLabel: 'Void Shards MULT',
      rewardValue: '0',
  
      icon: newicons.voidShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',
  
      cost: 100,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_303'],
    },
  
    /*
    =========================
    RESOURCE GROUP
    =========================
    */
  
    {
      id: "res_1",
      idx: 1,
      group: "kill_req_1",
  
      x: 250,
      y: -150,
  
      name: "Kills Requirement",
      desc: "-0.01 Base Kill Requirement",
      rewardLabel: 'Reduced base kill Requirement',
      rewardValue: '0',
  
      icon: newicons.kill_req,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 0.01,
      type: 'mult',

      cost: 0,
      costGrow: 1.04,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_4'],
    },
  
    {
      id: "res_2",
      group: "soul_app_1",
  
      x: 350,
      y: -150,
  
      name: "Soul Appereance",
      desc: "+1.1 MULT Soul Appereance",
      rewardLabel: 'Soul Appereance',
      rewardValue: '0',
  
      icon: newicons.soul,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.1,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.03,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_4'],
    },
  
    {
      id: "res_3",
      group: "eq_drop_1",
  
      x: 450,
      y: -150,
  
      name: "Equipemnt Drop",
      desc: "+1.05 MULT Equipemnt Drop Chance",
      rewardLabel: 'Equipemnt Drop Chance',
      rewardValue: '0',
  
      icon: '🗡️',
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.04,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.06,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_4'],
    },
  
    {
      id: "res_4",
      group: "skill_exp_1",
  
      x: 550,
      y: -150,
  
      name: "Skill EXP",
      desc: "+1.05 Skill EXP gain",
      rewardLabel: 'Skill EXP MULT',
      rewardValue: '0',
  
      icon: newicons.skillExp,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.05,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.1,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_4'],
    },
  
    {
      id: "res_5",
      group: "exp_1",
  
      x: 650,
      y: -150,
  
      name: "EXP",
      desc: "+1.1 EXP gain",
      rewardLabel: 'EXP MULT',
      rewardValue: '0',
  
      icon: newicons.exp,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.1,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.02,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_4'],
    },
  
    {
      id: "res_6",
      group: "stardust_1",
  
      x: 500,
      y: 150,
  
      name: "Stardust resources",
      desc: "+1.05 Stardust gain",
      rewardLabel: 'Starudst MULT',
      rewardValue: '0',
  
      icon: '✨',
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.05,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.08,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_5'],
    },
  
    {
      id: "res_7",
      group: "mutagen_1",
  
      x: 600,
      y: 150,
  
      name: "Mutagen resources",
      desc: "+1.025 Mutagen gain",
      rewardLabel: 'Mutagen MULT',
      rewardValue: '0',
  
      icon: newicons.mutagen,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.025,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.08,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_5'],
    },
  
    {
      id: "res_8",
      group: "ascen_shards_1",
  
      x: 700,
      y: 150,
  
      name: "Ascension resources",
      desc: "+1.05 Ascension gain",
      rewardLabel: 'Ascension MULT',
      rewardValue: '0',
  
      icon: newicons.ascension,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.05,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.05,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_5'],
    },
  
  
    /*
    =========================
    LAW STONES
    =========================
    */
  
    {
      id: "law_1",
      group: "an_shards_1",
  
      x: 150,
      y: 200,
  
      name: "Ancient resources",
      desc: "+1.05 Ancients Shards gain",
      rewardLabel: 'Ancient MULT',
      rewardValue: '0',
  
      icon: newicons.ancientShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 1.05,
      type: 'exp',
      
      cost: 0,
      costGrow: 1.5,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_102'],
    },
  
    {
      id: "law_2",
      group: "law_time_1",
  
      x: 150,
      y: 300,
  
      name: "Under The Time",
      desc: "Reduce the time to receive the Law Stone by 10 minutes.",
      rewardLabel: 'Reduced Time',
      rewardValue: '0',
  
      icon: newicons.timeline,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 5,
      value: 10,
      type: 'mult',
      
      cost: 5,
      costGrow: 5,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_102'],
    },
  
    {
      id: "law_3",
      group: "laws_add_stone",
  
      x: 250,
      y: 300,
  
      name: "Lucky Trick",
      desc: "25% chance to get another Law Stone after completing Timeline Trial or AUTO-Timeline.",
      rewardLabel: 'Current chance (%)',
      rewardValue: '0',
  
      icon: newicons.timeline,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 4,
      value: 25,
      type: 'mult',

      cost: 10,
      costGrow: 10,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['law_2'],
    },
  
    {
      id: "law_4",
      group: "laws_radius_1",
  
      x: 250,
      y: 400,
  
      name: "Expansion of Territory",
      desc: "+0.1% to the radius of Law Stones per each Tier in the main dimension",
      rewardLabel: 'Radius MULT',
      rewardValue: '0',
  
      icon: newicons.timeline,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.1,
      type: 'special',
  
      cost: 100,
      costGrow: 100,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['law_3'],
    },
  
    {
      id: "law_11",
      group: "laws_refund",
  
      x: 250,
      y: 200,
  
      name: "Recycling Mastery",
      desc: "+1% resource return after refining Law Stones (base value: 75%)",
      rewardLabel: 'Recycling value',
      rewardValue: '0',
  
      icon: newicons.ancientShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 5,
      value: 1,
      type: 'group',
  
      cost: 2,
      costGrow: 3,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['law_1'],
    },
  
  
  
  
    /*
    =========================
    SINGULARITY
    =========================
    */
  
    {
      id: "sing_1",
      group: "sing_levels_1",
  
      x: -150,
      y: 350,
  
      name: "Crossing the World Line",
      desc: "+25 Singularity Levels.",
      rewardLabel: 'Singularity Levels',
      rewardValue: '0',
  
      icon: newicons.singLevel,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 25,
      type: 'mult',
  
      cost: 15,
      costGrow: 2,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_103'],
    },
  
    {
      id: "sing_2",
      group: "sing_double_shards",
  
      x: -200,
      y: 450,
  
      name: "Refraction of light",
      desc: "Receive 2 Singularity Shards instead of 1.",
      rewardLabel: '',
      rewardValue: '0',
  
      icon: newicons.singularityShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0,
      type: 'cond',
  
      cost: 800,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_103'],
    },
  
    {
      id: "sing_3",
      group: "sing_level_req_1",
  
      x: -150,
      y: 550,
  
      name: "Basics of Promotion",
      desc: "Level requirement is better after level 700.",
      rewardLabel: 'Level requirement divided by',
      rewardValue: '0',
  
      icon: newicons.level,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 100,
      value: 1.5,
      type: 'exp',

      cost: 1,
      costGrow: 1.25,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_103'],
    },
  
    {
      id: "sing_4",
      group: "sing_kills_req",
  
      x: -250,
      y: 350,
  
      name: "Demoralization",
      desc: "Reduce kill requirements based on the number of enemies killed. Works only in the Singularity [D-S].",
      rewardLabel: '',
      rewardValue: '0',
  
      icon: newicons.kill_req,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0,
      type: 'cond',

      cost: 500,
      costGrow: 2,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['sing_1'],
    },
  
    {
      id: "sing_5",
      group: "sing_overkill",
  
      x: -250,
      y: 550,
  
      name: "The Basics of Murder",
      desc: "+1 Overkill in Singularity for each Singularity Shard",
      rewardLabel: 'Overkills',
      rewardValue: '0',
  
      icon: newicons.overkill,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 1,
      type: 'special',

      cost: 1,
      costGrow: 2,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['sing_3'],
    },
  
    {
      id: "sing_6",
      group: "sing_shards_mult_1",
  
      x: -350,
      y: 450,
  
      name: "Critical mass",
      desc: "+0.01 Singularity Shards MULT",
      rewardLabel: 'Singularity Shards MULT',
      rewardValue: '0',
  
      icon: newicons.singularityShard,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 0.01,
      type: 'group',

      cost: 40,
      costGrow: 8,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['sing_4', 'sing_5', 'sing_2'],
    },
  
  
  
  
    /*
    =========================
    INFINITY
    =========================
    */
  
    {
      id: "inf_1",
      group: "inf_ip_mult",
  
      x: -350,
      y: 100,
  
      name: "Reaching the limit",
      desc: "+0.02 IP MULT",
      rewardLabel: 'IP MULT',
      rewardValue: '0',
  
      icon: newicons.inf,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 0.02,
      type: 'mult',

      cost: 6,
      costGrow: 2.5,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_203'],
    },
  
    {
      id: "inf_2",
      group: "inf_tr_spread",
  
      x: -450,
      y: 100,
  
      name: "Superiority",
      desc: "5% of Transcendence Power is spread to all dimensions.",
      rewardLabel: '',
      rewardValue: '',
  
      icon: '🌀',
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 5,
      type: 'cond',

      cost: 250,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_203'],
    },
  
    {
      id: "inf_3",
      group: "inf_pen_base",
  
      x: -450,
      y: 175,
  
      name: "Establishing a baseline",
      desc: "Your Infinity Penalty cannot be lower 0.02",
      rewardLabel: 'Infinity Penalty [Base]',
      rewardValue: '0',
  
      icon: newicons.inf,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0.01,
      type: 'group',

      cost: 150,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['inf_2'],
    },
  
    {
      id: "inf_4",
      group: "inf_base_tier",
  
      x: -450,
      y: 250,
  
      name: "Superlimit",
      desc: "+1 base tier to all dimensions",
      rewardLabel: 'Base dimension tiers',
      rewardValue: '0',
  
      icon: '🌐',
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 1,
      type: 'group',

      cost: 250,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['inf_3'],
    },
  
    {
      id: "inf_5",
      group: "inf_double_complete",
  
      x: -450,
      y: 325,
  
      name: "Outside the Infinity",
      desc: "If possible, complete 2 Infinity Tiers instead of one",
      rewardLabel: '',
      rewardValue: '0',
  
      icon: newicons.inf,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 1,
      type: 'cond',

      cost: 500,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['inf_4'],
    },
  
    {
      id: "inf_6",
      group: "inf_res_1",
  
      x: -350,
      y: 250,
  
      name: "Primordial Power",
      desc: "Increase the Infinity Resistance by 0.01",
      rewardLabel: 'Infinity Resistance',
      rewardValue: '0',
  
      icon: newicons.inf,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 0.01,
      type: 'mult',

      cost: 8,
      costGrow: 5.5,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['inf_1'],
    },
  
  
  
    /*
    =========================
    QUASAR
    =========================
    */
  
    {
      id: "qua_1",
      group: "qua_eff_1",
  
      x: -450,
      y: -150,
  
      name: "Absorption",
      desc: "+1% Quasar Power",
      rewardLabel: 'Quasar Power',
      rewardValue: '0',
  
      icon: newicons.quasar,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 0.01,
      type: 's-mult',

      cost: 25,
      costGrow: 2.5,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_203'],
    },
  
    {
      id: "qua_2",
      group: "qua_unnused",
  
      x: -450,
      y: -250,
  
      name: "Integration",
      desc: "Unused Qusar cores are converted to MULT IP during the Infinity Trial",
      rewardLabel: 'IP MULT Bonus',
      rewardValue: '0',
  
      icon: newicons.quasar,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0,
      type: 'special',

      cost: 1500,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['qua_1'],
    },
  
    /*
    =========================
    ABYSS
    =========================
    */
  
  
    {
      id: "abyss_1",
      group: "abyss_auto",
  
      x: -600,
      y: -150,
  
      name: "Auto-Abyss",
      desc: "Stage in Abyss is considering completed if the current Stage in world is higher by 50 stages than in Abyss",
      rewardLabel: '',
      rewardValue: '0',
  
      icon: newicons.abyss,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0,
      type: 'cond',

      cost: 1000,
      costGrow: 2,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_204'],
    },
  
    {
      id: "abyss_2",
      group: "abyss_stage",
  
      x: -600,
      y: -250,
  
      name: "Abyss Stages",
      desc: "-1 Stage for Auto-Abyss",
      rewardLabel: 'Auto-Stages',
      rewardValue: '0',
  
      icon: newicons.abyss,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 1,
      type: 'group-r',

      cost: 10,
      costGrow: 1.75,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['abyss_1'],
    },
  
    /*
    =========================
    COST REDUCE
    =========================
    */
  
    {
      id: "cost_1",
      group: "danger_cost",
  
      x: -150,
      y: -300,
  
      name: "Radiation Attenuation",
      desc: "Danger costs half as much",
      rewardLabel: '',
      rewardValue: '0',
  
      icon: newicons.rad,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 1,
      value: 0,
      type: 'cond',

      cost: 300,
      costGrow: 0,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_302'],
    },
  
    {
      id: "cost_2",
      group: "cost_ascen",
  
      x: 150,
      y: -450,
  
      name: "Exhaustion from the Ascension",
      desc: "Reduce the Ascension Perks Cost by 0.01",
      rewardLabel: 'Perks cost [^]',
      rewardValue: '1',
  
      icon: newicons.ascension,
  
      voidTier: 0,
  
      level: 0,
      maxLevel: 10,
      value: 0.01,
      type: 'group-r',

      cost: 8,
      costGrow: 2.2,
  
      locked: true,
      canBuy: false,
      noResources: false,

      req: ['vs_303'],
    },
  
  ])