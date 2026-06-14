<template>

    <div v-if="hero.settings.showOfflineRewards" class="offline-overlay">

        <div class="offline-panel">

            <div class="offline-header">
                <div class="offline-title-wrap">
                    <span class="offline-icon">⏳</span>
                    <div>
                        <div class="offline-title">
                            Offline Rewards
                        </div>
                        <div class="offline-subtitle">
                            You were away for
                            <b>{{ timeFormat(hero.afkTime) }}</b>
                        </div>
                    </div>
                </div>

                <button class="offline-close" @click="closeOffline()">
                    ✕
                </button>
            </div>

            <div class="offline-section">
                <div class="section-title">Resources</div>
                <div class="section-grid">

                    <div class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['exp']">
                                
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    EXP
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().exp) }}
                        </div>
                    </div>

                    <div v-if="hero.maxStage >= 20" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['skillExp']">
                                
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Skill EXP
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().skillExp) }}
                        </div>
                    </div>

                    <div v-if="hero.spCount >= 1" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon">
                                ✨
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Stardust
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().stardust) }}
                        </div>
                    </div>

                    <div v-if="hero.spCount >= 5" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['mutagen']">
                                
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Mutagen
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().mutagen)  }}
                        </div>
                    </div>

                    <div v-if="hero.infExpansions.ascensioin" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon">
                                🌌
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Ascension Shards
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().ascension) }}
                        </div>
                    </div>

                    <div v-if="hero.infExpansions.rebirth && hero.singularity < 8" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon">
                                ♻️
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Rebirth Pts
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().rebirth) }}
                        </div>
                    </div>

                </div>
            </div>

            <div class="offline-section">
                <div class="section-title cyan-text">Special</div>
                <div class="section-grid">
                
                    <div class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['kill_req']">
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Kills
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{  fn(afkReward().kills)   }}
                        </div>
                    </div>

                    <div class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['soul']">
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Soul Appearance Boost
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            x{{  fn(afkReward().soul)   }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="hero.bhTier >= 4" class="offline-section">
                <div class="section-title">Progress</div>
                <div class="section-grid">
                
                    <div v-if="hero.dims.corrShards >= 20" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['voidShard']">
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Void Pulsation
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().voidShards) }}
                        </div>
                    </div>

                    <div v-if="hero.autoTimeLine.isAuto" class="offline-reward-card">
                        <div class="offline-reward-left">
                            <div class="offline-reward-icon" v-html="newicons['timeline']">
                            </div>
                            <div>
                                <div class="offline-reward-name">
                                    Timeline [Stones]
                                </div>
                            </div>
                        </div>

                        <div class="offline-reward-value">
                            +{{ fn(afkReward().timeline) }}
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

    <div v-if="hero.settings.showStoredTime" class="offline-overlay">

        <div class="stored-panel">

            <div class="stored-header">
                <div>
                    <div class="stored-title">
                        Temporal Storage
                    </div>
                    <div class="stored-subtitle">
                        You were away for
                        <b>{{ timeFormat(hero.afkTime) }}</b>
                    </div>
                </div>
                <button class="offline-close" @click="hero.settings.showStoredTime = false">
                    ✕
                </button>
            </div>

            <div class="stored-core-wrap">
                <div class="stored-core-ring"></div>
                <div class="stored-core">
                    <div class="stored-core-label">
                        STORED TIME
                    </div>
                    <div class="stored-core-time">
                        {{ timeFormat(hero.settings.storedTime) }}
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue';
import { useHero } from '../../composables/useHero';
import { timeFormat, fn } from '../../composables/utils/global';
import { newicons } from '../../composables/icons';
import { loading } from '../../composables/utils/loading';

const { hero } = useHero();

const { afkReward } = loading();

function closeOffline () {
    hero.value.settings.showOfflineRewards = false
    hero.value.settings.storedTimeUsed = 0
}

</script>

<style scoped>


.offline-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 9999;
}


.offline-panel {
    width: 1000px;
    max-width: 95vw;
    max-height: 90vh;

    overflow: hidden;

    border-radius: 24px;

    background:
        linear-gradient(180deg,
            rgba(15, 15, 30, 0.96),
            rgba(8, 8, 18, 0.96));

    border: 1px solid rgba(168, 85, 247, 0.4);

    box-shadow:
        0 0 40px rgba(168, 85, 247, 0.15),
        inset 0 0 40px rgba(255, 255, 255, 0.03);
}


/* ========================= */
/* HEADER */
/* ========================= */

.offline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 20px 24px;

    border-bottom:
        1px solid rgba(255, 255, 255, 0.08);
}

.offline-title-wrap {
    display: flex;
    align-items: center;
    gap: 16px;
}

.offline-icon {
    font-size: 2rem;
}

.offline-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
}

.offline-subtitle {
    margin-top: 4px;
    color: #a1a1aa;
}

.offline-close {
    width: 38px;
    height: 38px;

    border: none;
    border-radius: 12px;

    background: rgba(255, 255, 255, 0.05);

    color: white;
    cursor: pointer;

    transition: 0.2s;
}

.offline-close:hover {
    background: rgba(168, 85, 247, 0.25);
}


/* ========================= */
/* CONTENT */
/* ========================= */

.offline-content {
  display:flex;
  flex-direction:column;
  gap:20px;

  padding:20px;

  max-height:60vh;
  overflow-y:auto;
}

.offline-section {
  padding:14px;

  border-radius:16px;

  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.06);
}

.section-title {
  font-size:0.9rem;
  font-weight:700;
  margin-bottom:10px;

  color:#a78bfa;
  text-transform:uppercase;
  letter-spacing:0.5px;
}

.section-grid {
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:12px;
}


/* ========================= */
/* REWARD CARD */
/* ========================= */

.offline-reward-card {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 6px;

    border-radius: 18px;

    background:
        linear-gradient(180deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.02));

    border: 1px solid rgba(255, 255, 255, 0.08);

    transition: 0.2s;
}

.offline-reward-card:hover {
    transform: translateY(-2px);

    border-color: rgba(168, 85, 247, 0.35);

    box-shadow:
        0 0 20px rgba(168, 85, 247, 0.12);
}

.offline-reward-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.offline-reward-icon {
    width: 54px;
    height: 54px;

    border-radius: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(168, 85, 247, 0.12);

    font-size: 1.6rem;

    box-shadow:
        inset 0 0 12px rgba(168, 85, 247, 0.15);
}

.offline-reward-name {
    font-size: 1rem;
    font-weight: 700;
    color: white;
}

.offline-reward-rate {
    margin-top: 4px;

    font-size: 0.85rem;
    color: #a1a1aa;
}

.offline-reward-value {
    font-size: 1.1rem;
    font-weight: 700;

    color: #c084fc;
}

.special {
    border-color: rgba(0, 255, 255, 0.18);
}

.cyan {
    background: rgba(0, 255, 255, 0.08);
}

.cyan-text {
    color: #67e8f9;
}


/* ========================= */
/* FOOTER */
/* ========================= */

.offline-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    padding: 20px 24px;

    border-top:
        1px solid rgba(255, 255, 255, 0.08);
}

.offline-btn {
    min-width: 140px;
    height: 46px;

    border: none;
    border-radius: 14px;

    cursor: pointer;

    font-weight: 700;

    transition: 0.2s;
}

.collect {
    background:
        linear-gradient(90deg,
            #a855f7,
            #c084fc);

    color: white;
}

.discard {
    background: rgba(255, 255, 255, 0.06);
    color: #d4d4d8;
}

.offline-btn:hover {
    transform: translateY(-2px);
}


/* ========================= */
/* STORED PANEL */
/* ========================= */

.stored-panel {
    width: 620px;
    max-width: 92vw;

    border-radius: 28px;

    padding: 28px;

    background:
        linear-gradient(180deg,
            rgba(10, 18, 26, 0.97),
            rgba(5, 10, 18, 0.98));

    border: 1px solid rgba(0, 255, 255, 0.2);

    box-shadow:
        0 0 40px rgba(0, 255, 255, 0.08);
}

.stored-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stored-title {
    font-size: 1.5rem;
    font-weight: 700;

    color: white;
}

.stored-subtitle {
    margin-top: 6px;

    color: #94a3b8;
}


/* ========================= */
/* CORE */
/* ========================= */

.stored-core-wrap {
    position: relative;

    width: 240px;
    height: 240px;

    margin: 40px auto;
}

.stored-core-ring {
    position: absolute;
    inset: 0;

    border-radius: 50%;

    border: 2px solid rgba(0, 255, 255, 0.35);

    box-shadow:
        0 0 30px rgba(0, 255, 255, 0.12);

    animation: rotate 18s linear infinite;
}

.stored-core {
    position: absolute;
    inset: 30px;

    border-radius: 50%;

    background:
        radial-gradient(circle,
            rgba(0, 255, 255, 0.15),
            rgba(0, 0, 0, 0.9));

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border: 1px solid rgba(0, 255, 255, 0.2);
}

.stored-core-label {
    font-size: 0.8rem;
    letter-spacing: 2px;

    color: #94a3b8;
}

.stored-core-time {
    margin-top: 10px;

    font-size: 2rem;
    font-weight: 700;

    color: #67e8f9;

    text-shadow:
        0 0 20px rgba(0, 255, 255, 0.4);
}


/* ========================= */
/* ACTIONS */
/* ========================= */

.stored-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.stored-btn {
    height: 48px;

    border: 1px solid rgba(0, 255, 255, 0.12);
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.03);

    color: #d1d5db;

    cursor: pointer;

    transition: 0.2s;
}

.stored-btn:hover,
.stored-btn.active {
    background: rgba(0, 255, 255, 0.12);

    color: white;

    box-shadow:
        0 0 20px rgba(0, 255, 255, 0.1);
}


/* ========================= */
/* INFO */
/* ========================= */

.stored-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    margin-top: 28px;
}

.stored-info-card {
    padding: 14px;

    border-radius: 16px;

    background: rgba(255, 255, 255, 0.03);

    border: 1px solid rgba(255, 255, 255, 0.05);

    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stored-info-card span {
    color: #94a3b8;
    font-size: 0.85rem;
}

.stored-info-card b {
    color: white;
}


/* ========================= */
/* ANIMATION */
/* ========================= */

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
```
