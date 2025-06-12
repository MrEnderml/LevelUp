import { reactive, computed } from 'vue';

export let killHistory = reactive([]);

export function recordKill(enemy) {
  killHistory.push({
    loot: { ...enemy.value.averageLoot },
  });

  while (killHistory.length > 60) {
    killHistory.shift();
  }
}

export const avgLootPerMinute = computed(() => {
  const recentKills = killHistory.slice(-60); 

  const total = { exp: 0, buffexp: 0, mutagen: 0, stardust: 0 };

  for (const kill of recentKills) {
    total.exp += kill.loot.exp || 0;
    total.buffexp += kill.loot.buffexp || 0;
    total.mutagen += kill.loot.mutagen || 0;
    total.stardust += kill.loot.stardust || 0;
  }

  const count = recentKills.length || 1; 

  return {
    exp: total.exp / count * 60,
    buffexp: total.buffexp / count * 60,
    mutagen: total.mutagen / count * 60,
    stardust: total.stardust / count * 60,
  };
});
  