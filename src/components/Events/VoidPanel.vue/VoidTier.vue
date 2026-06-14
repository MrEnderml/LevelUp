<template>
    <div class="void-panel">

        <Tooltip :text="() => voidDesc()" position="right">
            <div class="void-bar">
                <div class="void-fill" :style="{ height: percent + '%' }"></div>
                <div class="void-core"></div>
                <div class="void-ring"></div>
                <div class="void-center">
                    <div class="void-title">
                        Void [T{{ hero.void.tier }}]
                    </div>

                    <div class="void-percent">
                        {{ percent.toFixed(1) }}%
                    </div>
                </div>
            </div>
        </Tooltip>


    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHero } from '../../../composables/useHero';
import { glitchify } from '../../../composables/utils/global';

const { hero } = useHero();

const voidReq = [1000, 1e6, 1e12];

const percent = computed(() => {
    return Math.min(hero.value.void.currentShards / voidReq[hero.value.void.tier], 100);
})

function voidDesc() {
    return `
  <span style="
    color:#d8b4fe;
    font-weight:800;
    text-shadow:
      0 0 18px #7c3aed,
      0 0 35px rgba(168,85,247,0.25);
  ">
    Void Core 
  </span>

  <br><br>

  <span style="color:#c084fc;">
    Click on the 
    <b style="
      color:#d8b4fe;
      font-weight:800;
      text-shadow:
        0 0 18px #7c3aed,
        0 0 35px rgba(168,85,247,0.25);
    ">
       Void Core 
    </b>
    to spend
    <b style="color:#b6ff00;"> ${voidReq[hero.value.void.tier]} Void Shards </b>
    and increase the Void Tier.
  </span>

  <br><br>

  <span style="color:#ff7af6;">
    Discover the first fragment of reality. 
    <b style="color: white">[${glitchify("D-Rule")}]</b> will notice your interference.
  </span>

  <br><br>

  <span style="color:#c084fc; font-weight: bold">Increase the Void Tier to obtain</span>

  <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      text-align:center;
      gap:6px;
    ">

      <div style="
        width:85%;
        padding:6px;
        border-radius:10px;
        background:rgba(124,58,237,0.12);
        border:1px solid rgba(216,180,254,0.2);
        color:#b6ff00;
        font-weight:700;
      ">
        x2 Void Shards gain
      </div>

      <div style="
        width:85%;
        padding:6px;
        border-radius:10px;
        background:rgba(124,58,237,0.12);
        border:1px solid rgba(216,180,254,0.2);
        color:#b6ff00;
        font-weight:700;
      ">
        Reduce Void Pulsation cooldown by 1 hour
      </div>

      <div style="
        width:85%;
        padding:6px;
        border-radius:10px;
        background:rgba(124,58,237,0.12);
        border:1px solid rgba(216,180,254,0.2);
        color:#b6ff00;
        font-weight:700;
      ">
        Unlock Void Expansion for the Tree: All Tree statuses can be active simultaneously
      </div>

      <div style="
        width:85%;
        padding:6px;
        border-radius:10px;
        background:rgba(124,58,237,0.12);
        border:1px solid rgba(216,180,254,0.2);
        color:#b6ff00;
        font-weight:700;
      ">
        Expand the Void Tree
      </div>

      <div style="
        width:85%;
        padding:6px;
        border-radius:10px;
        background:rgba(124,58,237,0.12);
        border:1px solid rgba(216,180,254,0.2);
        color:#b6ff00;
        font-weight:700;
      ">
        Unlock Void Core upgrades
      </div>

      <div style="
        width:85%;
        padding:6px;
        border-radius:10px;
        background:rgba(124,58,237,0.12);
        border:1px solid rgba(216,180,254,0.2);
        color:#b6ff00;
        font-weight:700;
      ">
        Unlock Void Trial
      </div>

    </div>

  <br><br>

  <span style="color:#ff5555;font-weight:700;">
    Locked until Version 1.1
  </span>
  `.replace(/\n\s*/g, '');
}
</script>



<style scoped>
.void-panel {
    position: absolute;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    display: flex;
    justify-content: center;
    align-items: center;
}


.void-bar {
    position: relative;

    width: 220px;
    height: 220px;

    border-radius: 50%;

    overflow: hidden;

    border: 2px solid #c084fc;

    background:
        radial-gradient(circle at center,
            rgba(30, 10, 50, 0.9),
            rgba(5, 5, 10, 1));

    box-shadow:
        0 0 18px #7c3aed,
        inset 0 0 35px rgba(168, 85, 247, 0.25);
}

.void-fill {
    position: absolute;

    bottom: 0;
    left: 0;

    width: 100%;

    background:
        linear-gradient(to top,
            #4c1d95,
            #7c3aed,
            #d8b4fe);

    transition: height 0.35s ease;

    box-shadow:
        0 0 25px #a855f7;
}

.void-core {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 90px;
    height: 90px;

    transform: translate(-50%, -50%);

    border-radius: 50%;

    background:
        radial-gradient(circle,
            #000 0%,
            #050505 60%,
            #140520 100%);

    border: 2px solid rgba(216, 180, 254, 0.4);

    z-index: 2;

    box-shadow:
        0 0 20px rgba(168, 85, 247, 0.45),
        inset 0 0 18px rgba(255, 255, 255, 0.05);
}

.void-ring {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 140px;
    height: 140px;

    transform:
        translate(-50%, -50%) rotate(25deg);

    border-radius: 50%;

    border:
        2px solid rgba(125, 249, 255, 0.25);

    z-index: 1;

    box-shadow:
        0 0 18px rgba(125, 249, 255, 0.25);
}

.void-center {
    position: absolute;

    inset: 0;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    z-index: 3;

    text-align: center;

    pointer-events: none;
}

.void-title {
    color: #d8b4fe;

    font-weight: 700;

    text-shadow:
        0 0 10px #a855f7;
}

.void-percent {
    margin-top: 4px;

    color: #7df9ff;

    font-size: 18px;
    font-weight: 700;

    text-shadow:
        0 0 12px #00ffff;
}
</style>