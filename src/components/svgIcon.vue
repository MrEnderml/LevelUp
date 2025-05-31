<template>
  <svg
    class="svg-icon"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox || '0 0 64 64'"
    :width="size"
    :height="size"
    v-html="icon.body"
    fill="none"
  />
</template>

<script setup>
import { icons } from '../composables/svgIcon.js';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: '1em' }
});

const icon = icons[props.name] || {};
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
