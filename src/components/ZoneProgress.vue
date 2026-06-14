<template>
  <div class="zone-progress">

    <ZoneHeader />

    <ZoneEvents />
    
    <ZoneSettings />

    <ZoneProgress />

  </div>
</template>

<script setup>
import ZoneHeader from "./ZonePanel/ZoneHeader.vue";
import ZoneEvents from "./ZonePanel/ZoneEvents.vue";
import ZoneSettings from "./ZonePanel/ZoneSettings.vue";
import ZoneProgress from "./ZonePanel/ZoneProgress.vue";


</script>

<style scoped>
.zone-progress {
  min-width: 400px;
}
</style>
