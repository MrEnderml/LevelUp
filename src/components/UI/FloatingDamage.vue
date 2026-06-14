<template>
    <div class="floating-container">
      <div
        v-for="hit in log"
        :key="hit.id"
        class="floating-hit"
        :class="getClasses(hit)"
        :style="getStyle(hit)"
      >
        <div class="floating-inner">
          <span class="damage">{{ format(hit.damage) }}</span>
  
          <span class="effects">
            <span v-for="(e, i) in hit.effects" :key="i">
              {{ e.icon }}
            </span>
          </span>
        </div>
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
  log: Array,
  format: {
    type: Function,
    default: v => v
  }
});

function getStyle(hit) {
    return {
        transform: `translate(${hit.x}px, ${hit.y}px)`,
        opacity: hit.opacity
    };
}

function getClasses(hit) {
  return {
    crit: hit.effects.some(e => e.type === "crit"),
    dodge: hit.effects.some(e => e.type === "dodge"),
    block: hit.effects.some(e => e.type === "block"),
    curse: hit.effects.some(e => e.type === "curse"),
    bleed: hit.effects.some(e => e.type === "bleed")
  };
}
</script>

<style scoped>
.floating-container {
  position: absolute;
  inset: 0;
}

.floating-hit {
  position: absolute;
  display: flex;
  gap: 4px;

  font-weight: bold;
  font-size: 14px;
}

.damage {
  color: white;

  text-shadow:
    0 0 2px rgba(0,0,0,0.9),
    0 0 4px rgba(0,0,0,0.8),
    0 0 6px rgba(0,0,0,0.6);
}

.effects span {
  font-size: 12px;
}


.floating-hit.crit .damage {
  color: red;
  font-size: 18px;
}

.floating-hit.dodge .damage {
  color: #5eff00;
}

.floating-hit.block .damage {
  color: yellow;
}

.floating-hit.curse .damage {
  color: #ff00fb;
}

.floating-hit.bleed .damage {
  color: #b13030;
}
</style>