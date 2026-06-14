<template>
    <div v-if="hero.timeline.showUpgradeModal" class="modal">
        <div class="modal-content">
            <h3 class="modal-title"> Upgrade</h3>

            <div style="padding-bottom: 10px">
                <span style="color: #66ffcc; font-weight: bold"
                    >Ancient Fragments <b>[AF]</b>:
                </span>
                <span style="color: gold; font-weight: bold">{{
                    fn(hero.ancientShards, true)
                }}</span>
            </div>

            <div class="stone-icon">
                <span v-html="getSvgIconHTML('stoneLaw', '3em', {
                    color: tierColors[selectedStone.tier],
                    tier: selectedStone.tier,
                })
                    " :class="{ divine: selectedStone.tier === 5 }"></span>
            </div>

            <div class="stone-stats">
                <p class="stat-line">
                    <span>Base range [{{ selectedStone.range.min }} - {{ selectedStone.range.max }}]</span>
                </p>
            </div>

            <div class="stone-stats">
                <p class="stat-line">
                    <span>Radius:</span>
                    <span class="radius-value">
                        {{ radiusCalc(selectedStone, 0) }}
                        <span class="arrow">→</span>
                        <span class="radius-up">{{ radiusCalc(selectedStone, 1) }}</span>
                    </span>
                </p>
            </div>

            <div class="buttons">
                <button class="btn upgrade" @click="upgradeStone(selectedStone)">
                    <span class="cost">
                        {{ calcUpgradeCost(selectedStone) }} <b>[AF]</b>
                    </span>
                </button>
                <button class="btn close" @click="hero.timeline.showUpgradeModal = false">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTimeline } from '../../../composables/battleUtils/dims/useTimeline';
import { useHero } from '../../../composables/useHero';
import { getSvgIconHTML } from '../../../composables/svgIcon';
import { newicons } from '../../../composables/icons';
import { fn } from '../../../composables/utils/global';


const { hero } = useHero();

const {
    calcUpgradeCost,
    radiusCalc,
    upgradeStone,
} = useTimeline();

defineProps({
    selectedStone: Object
});

const tierColors = {
  1: "#3bb273",
  2: "#f2d541",
  3: "#d94e67",
  4: "#a93df2",
  5: "#66ffcc",
};

</script>



<style lang="css" scoped>

.modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

.modal-content {
    background: #1a1a1a;
    border: 2px solid #444;
    border-radius: 14px;
    padding: 20px 30px;
    width: 360px;
    color: #fff;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
}

.modal-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #66ffcc;
    text-shadow: 0 0 6px #00ffaa;
}

.stone-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
}

.stone-icon {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
}

.stone-tier {
    font-size: 18px;
    color: gold;
}

.stone-stats {
    margin-bottom: 20px;
}

.stat-line {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    font-size: 15px;
}

.radius-value {
    font-weight: bold;
}

.arrow {
    margin: 0 6px;
    color: #66ffcc;
}

.radius-up {
    color: #66ffcc;
    text-shadow: 0 0 6px #00ffaa;
}

.cost {
    font-weight: bold;
    color: #003b2f;
    text-shadow: 0 0 6px rgba(0,255,200,0.7);
}

.currency {
    margin-left: 4px;
    font-size: 13px;
    color: rgb(102, 255, 222);
}

.buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
}

.btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    transition: 0.2s;
}

.btn.upgrade {
    background: linear-gradient(90deg, #00ffaa, #00cc88);
    color: #000;
}

.btn.upgrade:hover {
    background: linear-gradient(90deg, #00ffcc, #00ddaa);
}

.btn.close {
    background: #333;
    color: #fff;
}

.btn.close:hover {
    background: #555;
}

.icon {
    vertical-align: -0.125em;
}
</style>