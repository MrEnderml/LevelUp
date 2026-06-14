// useFloatingDamage.js
import { ref } from "vue";
import { useHero } from "../useHero";

export function useFloatingDamage() {

  const { hero } = useHero();

  let uid = 0;

  function updateFloatingHits(source, delta) {
    const now = Date.now();
    const list = source.damageLog;
  
    for (let i = list.length - 1; i >= 0; i--) {
      const hit = list[i];
      const life = now - hit.createdAt;
  
      if (life >= hit.lifetime) {
        list.splice(i, 1);
        continue;
      }
  
      hit.x += hit.vx * delta;
      hit.y += hit.vy * delta;
  
      hit.vx *= 0.98;
      hit.vy *= 0.98;
  
      hit.opacity = 1.5 - life / hit.lifetime;
    }
  }

  function pushDamageLog(source) {
    if (!hero.value.settings.damageDisplay) {
      source.damageLog = [];
      return;
    }

    let x = (source.name? 50: 250);

    const item = createFloatingHit(source.attack, x, -50 - 20 * source.attackCount);

    source.damageLog.unshift(item);

    if (source.damageLog.length > 20) {
      source.damageLog.pop();
    }
  }

  function pushAnyLog(hit, source) {
    if (!hero.value.settings.damageDisplay) {
      source.damageLog = [];
      return;
    }
    
    const item = createFloatingHit(hit, 100, -20, 0.5);

    source.damageLog.unshift(item);

    if (source.damageLog.length > 20) {
      source.damageLog.pop();
    }
  }

  function createFloatingHit(hit, x = 0, y = 0, dv = 1) {
    uid++;

    return {
      id: uid,
      damage: hit.effective,
      effects: hit.effects,
  
      x: x,
      y: y,
  
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.6 * 120 * dv,  
  
      createdAt: Date.now(),
      lifetime: 1500,
  
      opacity: 1
    };
  }

  function randomOffset(range = 40) {
    return (Math.random() - 0.5) * range;
  }

  return {
    pushDamageLog,
    pushAnyLog,
    updateFloatingHits,
    createFloatingHit,
    randomOffset,
  };
}