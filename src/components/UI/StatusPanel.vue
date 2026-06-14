<template>
    <div class="status-block">
      <div class="status-header">{{ title }}</div>
  
      <div class="status-row adv">
        <span v-for="s in advList" :key="s.type">
          <Tooltip :text="() => s.text" position="right">
            <span class="status-icon adv" v-html="s.icon">

            </span>
          </Tooltip>
        </span>
      </div>
  
      <div v-if="advList.length > 0 && disadvList.length > 0" class="divider"></div>
  
      <div class="status-row disadv">
        <span v-for="s in disadvList" :key="s.type">
          <Tooltip :text="() => s.text" position="right">
            <span class="status-icon disadv" v-html="s.icon">
 
            </span>
          </Tooltip>
        </span>
      </div>
    </div>
  </template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: "Status"
  }
});

const advList = computed(() => 
  props.list.filter(s => s.status === 'pos')
);

const disadvList = computed(() => 
  props.list.filter(s => s.status === 'neg')
);
</script>

<style scoped>
.status-block {
  border: 2px solid rgba(255, 170, 60, 0.4);
  border-radius: 12px;
  padding: 10px;
  background: rgba(30, 15, 5, 0.6);
  width: 100%;
  box-sizing: border-box;

  margin: 5px 0px;
}

.status-header {
  font-size: 0.8rem;
  font-weight: bold;
  color: #ffcc66;
  margin-bottom: 6px;
  position: relative;
  padding-bottom: 4px;
}

.status-header::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, #ffaa33, transparent);
}

.status-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.status-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;
  border: 2px solid;

  background: rgba(40, 20, 5, 0.8);
  transition: 0.2s;
}

.status-icon.adv {
  border-color: #ffd166;
  box-shadow: 0 0 8px rgba(255, 209, 102, 0.7);
}

.status-icon.disadv {
  border-color: #ff6b3d;
  box-shadow: 0 0 8px rgba(255, 107, 61, 0.7);
}

.status-icon:hover {
  transform: scale(1.1);
}

.divider {
  height: 2px;
  width: 100%;
  margin: 6px 0;

  background: #ffaa33;
  opacity: 0.6;
}
</style>