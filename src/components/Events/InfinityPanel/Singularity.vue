<template>
    <div class="singularity-panel">
  
      <div class="center-core">
        <div class="core-ring"></div>
        <div class="core-inner">
          <span v-if="hero.gravity.totalShards > hero.gravity.shards" class="header-value">[{{ hero.gravity.shards }}]</span>
          <span class="core-label">Singularity Shards</span>
          <span class="core-value">{{ Math.floor(hero.gravity.totalShards) }}</span>
        </div>
      </div>
  
      <div class="perks-wrapper">
  
      <div class="perk-column left">
        <div
          v-for="perk in leftPerks"
          :key="perk.id"
          class="perk-card"
        >
          <div class="perk-header">
            <span class="perk-next">[{{ Math.floor(perk.nowReq) }}]</span>
            <span class="perk-arrow">→</span>
            <span class="perk-cost">[{{ Math.floor(perk.totalReq) }}]</span>
            <span class="perk-tier">[T{{ perk.tier }}]</span>
          </div>
  
          <div class="perk-description">
            {{ perkTotal[perk.id].description }}
          </div>
  
          <div class="perk-total">
            Total: <span>{{ perkTotal[perk.id].total }}</span>
          </div>
        </div>
      </div>
  
      <div class="perk-column right">
        <div
          v-for="perk in rightPerks"
          :key="perk.id"
          class="perk-card"
        >
          <div class="perk-header">
            <span class="perk-next">[{{ Math.floor(perk.nowReq) }}]</span>
            <span class="perk-arrow">→</span>
            <span class="perk-cost">[{{ Math.floor(perk.totalReq) }}]</span>
            <span class="perk-tier">[T{{ perk.tier }}]</span>
          </div>
  
          <div class="perk-description">
            {{ perkTotal[perk.id].description }}
          </div>
  
          <div class="perk-total">
            Total: <span>{{ perkTotal[perk.id].total }}</span>
          </div>
        </div>
      </div>
  
      </div>
  
    </div>
</template>
  
<script setup>
import { computed, ref } from 'vue'
import { useHero } from '../../../composables/useHero'
import { useSingularity } from '../../../composables/battleUtils/useSIngularity';
import { fn } from '../../../composables/utils/global';
  
  
const { hero } = useHero();
const { singShardsEffect } = useSingularity();

const perkTotal = ref([
    {
      description: '+0.01 DMG',
      total: `${fn(singShardsEffect(0), true)}`,
    },
    {
      description: 'Enemies are weaker',
      total: `HP: [${fn(singShardsEffect(1).hp)}] DMG: [${fn(singShardsEffect(1).dmg)}]`,
    },
    {
      description: 'Reduce base kill requirement',
      total: `${fn(singShardsEffect(2))}`,
    },
    {
      description: '+1 Max Stage after 300',
      total: `${singShardsEffect(3)}`,
    },
    {
      description: 'Increase singularity levels',
      total: `${singShardsEffect(4)}`,
    },
    {
      description: '+0.01 Overkill Mult',
      total: `${fn(singShardsEffect(5))}`,
    },
    {
      description: '[^0.01] EXP gain after Stage 300',
      total: `${fn(singShardsEffect(6))}`,
    },
    {
      description: 'Increase the cap of Tr-1',
      total: `${30 + singShardsEffect(7)}`,
    },
    {
      description: 'Increase the cap of Tr-2',
      total: `${30 + singShardsEffect(8)}`
    },
    {
      description: 'Increase the cap of Tr-3',
      total: `${30 + singShardsEffect(9)}`
    },
    {
      description: 'Increase chance of higher Law Stone tiers',
      total: `${fn(singShardsEffect(10) * 100)}%`
    },
    {
      description: 'Increase the cap of Tr-4',
      total: `${30 + singShardsEffect(11)}`
    },
    {
      description: 'Increase Void Shards Mult',
      total: `${fn(singShardsEffect(12))}`
    },
    {
      description: 'Increase the cap of Tr-5',
      total: `${30 + singShardsEffect(13)}`
    },
    {
      description: 'Increase Infinity Resistance by 0.01',
      total: `${fn(singShardsEffect(14))}`
    },
    {
      description: '+1 Corruption Shard',
      total: `${singShardsEffect(15)}`
    }
])

const leftPerks = computed(() => hero.value.gravityShardsEffect.slice(0, 8))
const rightPerks = computed(() => hero.value.gravityShardsEffect.slice(8, 16))

</script>
  
<style scoped>
  .singularity-panel {
    position: relative;

    flex: 1;
    min-height: 0;

    display: flex;
    flex-direction: column;
  
    padding: 1.5rem;
    gap: 1.5rem;
  
    background:
      radial-gradient(circle at top, rgba(0,255,255,0.08), transparent 30%),
      linear-gradient(180deg, #041014, #07161b);
  
    border: 1px solid rgba(0,255,255,0.12);
    border-radius: 22px;
  
    overflow: hidden;
  }
  
  .center-core {
    position: relative;
  
    width: 220px;
    height: 220px;
  
    margin: 0 auto;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    flex-shrink: 0;
  }
  
  .core-ring {
    position: absolute;
    inset: 0;
  
    border-radius: 50%;
    border: 2px solid rgba(0,255,255,0.45);
  
    box-shadow:
      0 0 20px rgba(0,255,255,0.22),
      inset 0 0 20px rgba(0,255,255,0.12);
  
    animation: rotateRing 14s linear infinite;
  }
  
  .core-ring::before {
    content: '';
  
    position: absolute;
    inset: 12px;
  
    border-radius: 50%;
    border: 1px dashed rgba(255,255,255,0.15);
  }
  
  .core-inner {
    width: 150px;
    height: 150px;
  
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    border-radius: 50%;
  
    background:
      radial-gradient(circle at center, #0c3a44, #071116);
  
    border: 1px solid rgba(0,255,255,0.25);
  
    z-index: 2;
  }
  
  .core-label {
    text-align: center;
    font-size: 0.7rem;
    color: #7dd3fc;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  .core-value {
    margin-top: 0.4rem;
  
    font-size: 2rem;
    font-weight: 700;
  
    color: #67e8f9;
  
    text-shadow: 0 0 12px rgba(103,232,249,0.45);
  }

  .header-value {
    margin-top: 0.4rem;
    font-weight: 700;
    color: #67e8f9;
    text-shadow: 0 0 12px rgba(103,232,249,0.45);
  }
  
  .perks-wrapper {
    flex: 1;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
  
    overflow-y: auto;
  
    padding-right: 0.5rem;
  }
  
  .perks-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  
  .perks-wrapper::-webkit-scrollbar-thumb {
    background: rgba(0,255,255,0.2);
    border-radius: 999px;
  }
  
  .perk-column {
    width: 42%;
  
    display: flex;
    flex-direction: column;
    gap: 1rem;
  
    z-index: 2;
  }
  
  .perk-card {
    position: relative;
  
    padding: 0.9rem;
  
    background:
      linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
  
    backdrop-filter: blur(4px);
  
    transition:
      transform 0.2s,
      border-color 0.2s,
      box-shadow 0.2s;
  }
  
  .perk-card:hover {
    transform: translateY(-2px);
  
    border-color: rgba(0,255,255,0.35);
  
    box-shadow:
      0 0 16px rgba(0,255,255,0.12);
  }
  
  .perk-header {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  
    font-size: 0.82rem;
    font-weight: 700;
  
    margin-bottom: 0.55rem;
  }
  
  .perk-cost {
    color: #67e8f9;
  }
  
  .perk-next {
    color: #22d3ee;
  }
  
  .perk-arrow {
    color: #888;
  }
  
  .perk-tier {
    margin-left: auto;
  
    color: #a5f3fc;
  }
  
  .perk-description {
    margin-top: 6px;

    padding: 8px;

    background:
      rgba(0,255,255,0.04);

    border:
      1px solid rgba(0,255,255,0.08);

    border-radius: 8px;

    color: #7fffd4;

    line-height: 1.45;
  }
  
  .perk-total {
    margin-top: 0.65rem;
  
    font-size: 0.78rem;
    color: #9ca3af;
  }
  
  .perk-total span {
    color: #67e8f9;
    font-weight: 700;
  }
  
  @keyframes rotateRing {
    from {
      transform: rotate(0deg);
    }
  
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 1200px) {
    .singularity-panel {
      flex-direction: column;
      padding-top: 18rem;
    }
  
    .perk-column {
      width: 100%;
    }
  }
  </style>
  