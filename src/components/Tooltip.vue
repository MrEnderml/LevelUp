<template>
  <div class="tooltip-wrapper" ref="wrapper">
    <slot></slot>
    <div
      class="tooltip"
      ref="tooltip"
      v-html="computedText"
      :class="{ 'tooltip-top': showAbove }"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  text: {
    type: [String, Function],
    required: true
  }
});

const computedText = computed(() => {
  return typeof props.text === 'function' ? props.text() : props.text;
});

const tooltip = ref(null);
const wrapper = ref(null);
const showAbove = ref(false);

onMounted(() => {
  nextTick(() => {
    const tooltipRect = tooltip.value?.getBoundingClientRect();
    const wrapperRect = wrapper.value?.getBoundingClientRect();
    const bottomSpace = window.innerHeight - wrapperRect.bottom;

    showAbove.value = tooltipRect && bottomSpace < tooltipRect.height + 12;
  });
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
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  z-index: 100;
  white-space: pre-line;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  max-width: 250px;
  width: max-content;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-top {
  top: auto;
  bottom: 100%;
  margin-bottom: 8px;
  margin-top: 0;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
}

@media (max-width: 600px) {
  .tooltip {
    max-width: 90vw;
    font-size: 12px;
  }
}
</style>
