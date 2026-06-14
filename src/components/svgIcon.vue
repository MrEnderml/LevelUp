<template>
  <svg
    class="svg-icon"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox || '0 0 48 48'"
    :width="size"
    :height="size"
    fill="none"
  >
    <g v-html="icon.body"></g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';
import { icons } from '../composables/svgIcon.js';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: '1em' }
});

function resolveIcon(path) {
  return path.split('.').reduce((acc, key) => acc?.[key], icons);
}

const icon = computed(() =>
  resolveIcon(props.name) || { body: '', viewBox: '0 0 48 48' }
);
</script>

<style scoped>
.svg-icon {
  display: inline-flex;       /* ведёт себя как текстовый элемент */
  vertical-align: middle;     /* выравнивание по центру строки */
  line-height: 1;             /* убираем лишние отступы */
}
</style>
