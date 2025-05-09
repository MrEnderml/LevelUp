import { onMounted, onUnmounted } from 'vue';
import { useHero } from './useHero.js';
import { useBuff } from '../data/buffs.js';
import { perks } from '../data/perks.js';
import { perks as ascension } from '../data/ascension.js';
import { amulets } from '../data/amulets.js';
import { cursed} from '../data/cursed.js';

export function useAutoSave() {
  let interval;
  let time = 30000;
  const saveGame = () => {
    const { hero } = useHero();
    const { buffs } = useBuff();

    const data = {
      hero: hero.value,
      perks: perks,
      ascension: ascension,
      buffs: buffs.value,
      amulets: amulets,
      cursed: cursed
    };
    localStorage.setItem('gameSave', JSON.stringify(data));
    console.log('Game saved');
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

  const data = {
    hero: hero.value,
    perks: perks,
    ascension: ascension,
    buffs: buffs.value,
    amulets: amulets,
    cursed: cursed
  };
  localStorage.setItem('gameSave', JSON.stringify(data));
  console.log('Game saved');
};
