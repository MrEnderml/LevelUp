import { reactive, computed } from 'vue';
import { useHero } from './useHero.js';

export let killHistory = reactive([]);
const { hero } = useHero();

export function recordKill(enemy) {
    killHistory.push({
      timestamp: Date.now(),
      loot: { ...enemy.value.averageLoot },
    });
  
    
    const oneMinuteAgo = Date.now() - 60000;
    while (killHistory.length && killHistory[0].timestamp < oneMinuteAgo) {
      killHistory.shift();
    }
 }

export const avgLootPerMinute = computed(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    
    const recentKills = (hero.value.afkTime > 0? killHistory:  killHistory.filter(k => k.timestamp >= oneMinuteAgo));
  
    const total = { exp: 0, buffexp: 0, mutagen: 0, stardust: 0};
  
    for (const kill of recentKills) {
      total.exp += kill.loot.exp || 0;
      total.buffexp += kill.loot.buffexp || 0;
      total.mutagen += kill.loot.mutagen || 0;
      total.stardust += kill.loot.stardust || 0;
    }
  
    return {
      exp: total.exp,
      buffexp: total.buffexp,
      mutagen: total.mutagen,
      stardust: total.stardust,
    };
});
  