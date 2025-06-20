import { onMounted, onUnmounted } from 'vue';
import { useHero } from './useHero.js';
import { useEnemy } from './useEnemy.js';
import { useBuff } from '../data/buffs.js';
import { perks } from '../data/perks.js';
import { perks as ascension } from '../data/ascension.js';
import { amulets } from '../data/amulets.js';
import { cursed} from '../data/cursed.js';
import { perks as radPerks } from '../data/radPerks.js'; 
import { spEnemy as space } from '../data/spaceEnemy.js';
import { goals } from '../data/infGoals.js';
import { auto } from "../composables/autoProgression.js";
import { dimensions } from "../data/dimensions.js";
import { killHistory } from '../composables/afkHandle.js';

export function useAutoSave() {
  let interval;
  let time = 30000;
  const saveGame = () => {
    const { hero } = useHero();
    const { buffs } = useBuff();
    const { enemy } = useEnemy();

    const data = {
      hero: hero.value,
      enemy: enemy.value,
      perks: perks.value,
      ascension: ascension,
      buffs: buffs.value,
      amulets: amulets,
      cursed: cursed,
      radPerks: radPerks,
      space: space,
      infGoals: goals.value,
      auto: auto.value,
      dimensions: dimensions.value,
      hKill: killHistory,
    };
    localStorage.setItem('gameSave', JSON.stringify(data));
    localStorage.setItem('lastOnline', Date.now().toString());
  };

  onMounted(() => {
    interval = setInterval(saveGame, time);
  });

  onUnmounted(() => {
    clearInterval(interval);
  });
}

export function saveGame() {
  const { hero } = useHero();
  const { buffs } = useBuff();
  const { enemy } = useEnemy();

  const data = {
    hero: hero.value,
    enemy: enemy.value,
    perks: perks.value,
    ascension: ascension,
    buffs: buffs.value,
    amulets: amulets,
    cursed: cursed,
    radPerks: radPerks,
    space: space,
    infGoals: goals.value,
    auto: auto.value,
    dimensions: dimensions.value,
    hKill: killHistory,
  };
  localStorage.setItem('gameSave', JSON.stringify(data));
  localStorage.setItem('lastOnline', Date.now().toString());
};
