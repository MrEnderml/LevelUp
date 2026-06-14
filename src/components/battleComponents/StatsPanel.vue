<template>
    <div class="stats-panel" :style="{ right: pos + 'px' }">
  
      <div v-for="section in statsConfig" :key="section.title">
        <template v-if="isVisible(section.visibleFor)">
          <h4>{{ section.title }}</h4>
  
          <div v-if="section.stats">
            <template v-for="stat in section.stats" :key="stat?.label">
              <div v-if="getValue(stat.get) !== undefined" class="stat-row">
                <span>{{ stat.label }}</span>
                <span>{{ fn(getValue(stat.get)) }}</span>
              </div>
            </template>
          </div>
    
          <div v-if="section.group">
            <div>{{ section.group.label }}</div>
    
            <template  v-for="item in section.group.keys" :key="item.label">
              <div v-if="getValue(item.get) !== undefined" class="stat-row">
                <span>{{ item.label }}</span>
                <span>{{ fn(getValue(item.get)) }}</span>
              </div>
            </template>
          </div>
        </template>
        
  
      </div>
  
    </div>
</template>

<script setup>

const props = defineProps({
  unit: Object,
  fn: Function,
  pos: Number,
  type: String
});

const getValue = (getter) => {
  try {
    return getter({ unit: props.unit });
  } catch {
    return undefined;
  }
};

const isVisible = (visibleFor) => {
  if (!visibleFor) return true;

  return visibleFor.includes(props.type)
};

function totalRegen (unit) {
  let total = unit.heal.regen.s1 + 
  unit.heal.regen.s2 + 
  unit.heal.regen.s3;

  return total;
}

const statsConfig = [
    {
      title: "Combat",
      visibleFor: ["player", "villian"],
      stats: [
        {
          label: "Crit",
          get: ({ unit }) => unit.stats.final.crit,
        },
        {
          label: "Crit Damage",
          get: ({ unit }) => unit.stats.final.critDmg,
        }
      ]
    },
  
    {
      title: "Attack Speed",
      visibleFor: ["player", "villian"],
      group: { 
        keys: [
          { label: "Current", get: ({ unit }) => unit.APS.current },
          { label: "Total", get: ({ unit }) => unit.APS.total },
          { label: "Min Cap", get: ({ unit }) => unit.APS.min },
          { label: "Max Cap", get: ({ unit }) => unit.APS.max },
        ]
      }
    },

    {
      title: "Dodge & Accuracy",
      visibleFor: ["player", "villian"],
      group: { 
        keys: [
          { label: "Curent", get: ({ unit }) => unit.avoid.base * 100 },
          { label: "Total", get: ({ unit }) => unit.avoid.total * 100 },
          { label: "Cap", get: ({ unit }) => unit.avoid.max * 100 },
          { label: "Accuracy", get: ({ unit }) => unit.stats.final.hit * 100 },
        ]
      }
    },

    {
      title: "Survival",
      visibleFor: ["player"],
      group: { 
        keys: [
          { label: "HP Regen Mult", get: ({ unit }) => unit.heal.mult },
          { label: "HP Regen", get: ({ unit }) => totalRegen(unit) },
          { label: "HP Regen Total", get: ({ unit }) => totalRegen(unit) * unit.heal.mult },
        ]
      }
    },

    {
      title: "Overkill",
      visibleFor: ["player"],
      group: { 
        keys: [
          { label: "Overkill", get: ({ unit }) => unit.overkill.count },
          { label: "Overloot [%]", get: ({ unit }) => unit.overkill.loot },
        ]
      }
    },

    {
      title: "Extra Hits",
      visibleFor: ["player", "villian"],
      group: { 
        keys: [
          { label: "Hits", get: ({ unit }) => unit.extras.hits },
        ]
      }
    },

  ];
</script>

<style scoped>
.stats-panel {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 210px;
  max-height: 360px;
  overflow-y: auto;

  background: rgba(12, 12, 18, 0.96);
  border: 1px solid rgba(255, 215, 0, 0.18);
  border-radius: 10px;

  padding: 8px;

  font-family: "Orbitron", sans-serif;
  font-size: 10.5px;
  color: #ddd;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);

  z-index: 100;
}

.stats-panel h4 {
  font-size: 10px;
  margin: 6px 0 4px;
  color: #facc15;
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
  padding-bottom: 2px;
  letter-spacing: 0.3px;
}

.stats-section {
  margin-bottom: 12px;
}

.stats-section:last-child {
  margin-bottom: 0;
}

.stats-section h4 {
  font-size: 11px;
  letter-spacing: 0.5px;

  color: #facc15;

  margin-bottom: 6px;
  padding-bottom: 3px;

  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1px 0;
  font-size: 10px;

  transition: 0.15s;
}

.stat-row:hover {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.stat-row span:first-child {
  color: #9ca3af;
}

.stat-row span:last-child {
  color: #fff;
  font-weight: 600;
}

.label {
  color: #9ca3af;
}

.value {
  color: #f9fafb;
  font-weight: 600;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
}


.stat-group {
  margin-top: 4px;
}

.group-label {
  font-size: 9.5px;
  color: #6b7280;
  margin: 4px 0 2px;
}

.group-values {
  display: flex;
  flex-direction: column;
  gap: 1px;
}


.stats-panel::-webkit-scrollbar {
  width: 3px;
}

.stats-panel::-webkit-scrollbar-track {
  background: transparent;
}

.stats-panel::-webkit-scrollbar-thumb {
  background: rgba(250, 204, 21, 0.35);
  border-radius: 10px;
}

.stats-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(250, 204, 21, 0.6);
}
</style>