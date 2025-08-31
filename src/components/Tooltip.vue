<template>
  <div class="tooltip-wrapper" ref="wrapper">
    <slot></slot>
    <div
      v-if="computedText"
      class="tooltip"
      ref="tooltip"
      v-html="computedText"
      :class="[
        positionClass,
        { 'tooltip-top': showAbove && position === 'auto' }
      ]"
      :style="tooltipStyle"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  text: {
    type: [String, Function],
    required: true
  },
  position: {
    type: String,
    default: 'auto', // 'auto', 'top', 'bottom', 'left', 'right'
  },
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 0.85)'
  },
  color: {
    type: String,
    default: '#fff'
  },
  boxShadow: {
    type: String,
    default: '0px 4px 12px rgba(0, 0, 0, 0.3)'
  },
  maxWidth: {
    type: String,
    default: '250px'
  }
});

const computedText = computed(() => {
  const text = typeof props.text === 'function' ? props.text() : props.text;
  return text?.trim() ? text : null;
});

const tooltip = ref(null);
const wrapper = ref(null);
const showAbove = ref(false);

onMounted(() => {
  nextTick(() => {
    if (props.position === 'auto') {
      const tooltipRect = tooltip.value?.getBoundingClientRect();
      const wrapperRect = wrapper.value?.getBoundingClientRect();
      const bottomSpace = window.innerHeight - wrapperRect.bottom;
      showAbove.value = tooltipRect && bottomSpace < tooltipRect.height + 12;
    }
  });
});

const tooltipStyle = computed(() => ({
  backgroundColor: props.background,
  color: props.color,
  boxShadow: props.boxShadow,
  maxWidth: props.maxWidth
}));

const positionClass = computed(() => {
  switch (props.position) {
    case 'top': return 'tooltip-top';
    case 'bottom': return 'tooltip-bottom';
    case 'left': return 'tooltip-left';
    case 'right': return 'tooltip-right';
    default: return '';
  }
});
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: help;
}

.tooltip {
  position: absolute;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  z-index: 100;
  white-space: pre-line;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  width: max-content;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: 100%;
  left: 50%;
  margin-top: 8px;
}

.tooltip-top {
  bottom: 100%;
  left: 50%;
  margin-bottom: 8px;
}

.tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
}

@media (max-width: 600px) {
  .tooltip {
    max-width: 90vw !important;
    font-size: 12px;
  }
}
</style>
