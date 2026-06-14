<template>
    <div class="cosmic-panel">

        <div class="tabs">
            <button v-for="t in tabs" :key="t" :class="['tab', { active: tab === t }]" @click="tab = t">
                {{ t }}
            </button>
        </div>

        <div class="content">

            <div v-if="tab === 'Tree'" class="tree-panel">
                <VoidTree />
            </div>

            <VoidTier v-if="tab === 'Void'" />

        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VoidTree from './voidTree.vue'
import VoidTier from './VoidTier.vue'
import { useHero } from '../../../composables/useHero'

const tabs = ['Tree', 'Void']
const tab = ref('Tree')

const { hero } = useHero();


</script>

<style scoped>
.cosmic-panel {
    box-sizing: border-box;
    height: 100dvh;

    background: radial-gradient(circle at 50% 20%, #1a0033, #050010);
    color: #f0f0f0;

    padding: clamp(12px, 2vh, 24px);

    display: flex;
    flex-direction: column;

    overflow: hidden;
    font-family: 'Orbitron', sans-serif;
}

.tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
}

.tab {
    flex: 1;
    padding: 6px;

    background: #12002a;
    border: 1px solid #3a0080;

    color: #aaa;
    cursor: pointer;

    transition: 0.2s;
}

.tab.active {
    color: #d0aaff;
    border-color: #a855f7;
    box-shadow: 0 0 10px #a855f7;
}

.tree-panel {
    position: relative;
    width: 100%;
    height: 100%;
}

.node {
    position: absolute;
    width: 40px;
    height: 40px;

    transform: translate(-50%, -50%);
    border-radius: 50%;

    background: radial-gradient(circle, #a855f7, #3b0764);
    box-shadow:
        0 0 8px #a855f7,
        0 0 16px #7c3aed;

    cursor: pointer;
}

.links {
    position: absolute;
    width: 100%;
    height: 100%;
}

.link {
    stroke: #7c3aed;
    stroke-width: 2;
    opacity: 0.6;
}



</style>