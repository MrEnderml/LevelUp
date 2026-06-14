<template>
    <div class="atlas-quick-panel" style="right: 200px" v-if="hero.dimDisplayMode === 'map' && !hero.timeline.show">
        <div class="quick-block teleport-block">
            <div class="block-title">Teleports</div>

            <button 
                v-for="(t, i) in hero.dims.teleports" :key="i" 
                class="reset-button"
                @click="resetView(i)"
            >
                {{ t.name }}

                <span class="remove" @click.stop="hero.dims.teleports.splice(i, 1)">
                    ✕
                </span>
            </button>

            <button v-if="hero.dims.teleports.length < 10 && !hero.dims.teleportedMode" class="reset-button add-button"
                @click="hero.dims.teleportedMode = true">
                +ADD
            </button>

        </div>
    </div>

    <div v-if="hero.dims.teleportedMode" class="teleport-modal">
        <div class="modal-box">

            <div class="title">Choose dimension</div>

            <input v-if="hero.dims.selectedDim" v-model="hero.dims.teleportName" maxlength="7" class="teleport-input"
                placeholder="Name (max 7)" />

            <div class="actions">
                <button v-if="hero.dims.selectedDim" class="save"
                    :disabled="!hero.dims.selectedDim || !hero.dims.teleportName" @click="saveTeleport">
                    Save
                </button>

                <button class="cancel" @click="dateClear">
                    Cancel
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useHero } from '../../../composables/useHero'
import { dimensions } from '../../../data/dimensions';
import { ref, computed } from 'vue';
import { useDimHandler } from '../../../composables/battleUtils/dims/useDimHandler';
import { selectDimension } from '../../../composables/battleUtils/dims/dimPerform';

const { hero } = useHero();

const {
    corrToggle,
    toggleOtherDimensions
} = useDimHandler();

const saveTeleport = () => {
    const name = hero.value.dims.teleportName?.trim()

    if (!name || !hero.value.dims.selectedDim) return

    hero.value.dims.teleports.push({
        id: hero.value.dims.selectedDim.id,
        name: name.slice(0, 7),
        status: hero.value.dims.selectedDim.status,
        x: hero.value.dims.selectedDim.x,
        y: hero.value.dims.selectedDim.y,
    })

    dateClear();
}

function dateClear() {
    hero.value.dims.teleportName = ""
    hero.value.dims.selectedDim = null
    hero.value.dims.teleportedMode = false
}

const resetView = (point) => {
    let dim = hero.value.dims?.teleports[point];
    if (!dim) return;

    let location = { x: 0, y: 0 };

    if (dim.status == 1 && hero.value.dimensionStatus == 2)
        toggleOtherDimensions();
    else if (dim.status == 1 && hero.value.dimensionStatus == 3)
        corrToggle();
    else if (dim.status == 2 && hero.value.dimensionStatus == 1)
        toggleOtherDimensions();
    else if (dim.status == 2 && hero.value.dimensionStatus == 3) {
        corrToggle();
        toggleOtherDimensions();
    }
    else if (dim.status == 3 && hero.value.dimensionStatus == 1)
        corrToggle();
    else if (dim.status == 3 && hero.value.dimensionStatus == 2) {
        toggleOtherDimensions();
        corrToggle();
    }

    location.x = dim.x;
    location.y = dim.y;

    const zoom = hero.value.dims.zoom || 1
    const baseW = 800;
    const baseH = 600;

    const width = baseW / zoom
    const height = baseH / zoom

    const viewX = location.x - width / 2
    const viewY = location.y - height / 2

    hero.value.dims.viewBox = `${viewX} ${viewY} ${width} ${height}`

    if(hero.value.settings.dimTeleport)
        selectDimension(dim, hero.value);
}

</script>

<style lang="css" scoped>
.atlas-quick-panel {
    position: absolute;
    top: 80px;
    right: 50px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: clamp(120px, 15vw, 200px);
    z-index: 60;
}

.quick-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border-radius: 12px;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.block-title {
    font-weight: bold;
    font-size: 0.85rem;
    text-transform: uppercase;
    margin-bottom: 4px;
    color: #f5e538;
}

.teleport-block {
    background: rgba(0, 120, 255, 0.4);
}

.function-block {
    background: rgba(255, 120, 0, 0.4);
}



.quick-block button {
    min-width: 80px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    cursor: pointer;
    text-align: left;
    font-size: 0.95rem;
}

.teleport-modal {
    position: absolute;
    top: 100px;
    right: 500px;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}


.modal-box {
    background: rgba(10, 12, 20, 0.95);
    border: 1px solid rgba(125, 249, 255, 0.25);
    border-radius: 12px;
    padding: 16px;
    width: 280px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.title {
    color: #7df9ff;
    font-weight: 600;
    text-align: center;
}

.teleport-input {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(125, 249, 255, 0.3);
    border-radius: 8px;
    padding: 8px;
    color: white;
    outline: none;
}

.actions {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.actions button {
    flex: 1;
    padding: 6px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: white;
}

.save {
    background: linear-gradient(90deg, #00ffff, #7df9ff);
}

.cancel {
    background: rgba(255, 0, 0, 0.2);
}



.teleports {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.teleport-item {
    position: relative;
    padding: 4px 8px;
    background: #222;
    border-radius: 6px;
}

.reset-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.remove {
    margin-left: auto;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 0, 0, 0.15);
    border: 1px solid rgba(255, 0, 0, 0.5);
    border-radius: 6px;

    color: #ff4c4c;
    font-size: 12px;
    line-height: 1;

    cursor: pointer;

    transition: 0.2s;
}

.remove:hover {
    background: rgba(255, 0, 0, 0.35);
    transform: scale(1.1);
}
</style>