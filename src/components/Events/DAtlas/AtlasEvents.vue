<template>
<div class="atlas-effects-container">
  <div
    v-for="(star, index) in stars"
    :key="index"
    class="star"
    :style="star"
  ></div>

  <div class="atlas-effects">
  </div>
</div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const effectTypes = [
  "gravity-wave",
  "atlas-comet",
  "pulse-star",
  "blight",
  "supernova",
  "bright-flash",
  "spiral-vortex",  
  "neon-spark",      
  "falling-fragment",
  "electric-arc",    
  "nebula-cloud"  
];

let intervalId = null;

function spawnEffect() {
  const container = document.querySelector(".atlas-effects");
  if (!container) return;

  if (container.children.length >= 10) return;

  const effect = document.createElement("div");

  // random effect type
  effect.className = effectTypes[Math.floor(Math.random() * effectTypes.length)];

  
  effect.style.left = randomWithMargin() + "%";
  effect.style.top = randomWithMargin() + "%";

  container.appendChild(effect);

  // remove after animation ends
  setTimeout(() => effect.remove(), 3000);
}

function randomWithMargin(minPercent = 20, maxPercent = 80) {
  const range = maxPercent - minPercent;
  return Math.floor(minPercent + Math.random() * range);
}

onMounted(() => {
  // spawn effect every X ms
  intervalId = setInterval(() => {
    spawnEffect();
  }, 5000); 
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});


function randomStarStyle() {
  const x = Math.random() * window.innerWidth
  const y = Math.random() * window.innerHeight
  const duration = 1 + Math.random() * 3
  return {
    left: `${x}px`,
    top: `${y}px`,
    animationDuration: `${duration}s`
  }
}

const stars = Array.from({ length: 100 }, () => randomStarStyle())
</script>

<style>
.atlas-container {
  position: relative;
  overflow: hidden;
}

.atlas-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: twinkle 2s infinite ease-in-out;
  z-index: 2;
}


/* ----------------- EFFECTS -------------------- */

/* 1) Gravity Ripple */
.gravity-wave {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
   top: 50%;
  left: 50%;
  border: 2px solid rgba(150, 230, 255, 0.5);
  animation: gravityRipple 3s ease-out infinite;
}
@keyframes gravityRipple {
  0% {
    transform: scale(0.3);
    opacity: 0.7;
  }
  100% {
    transform: scale(6);
    opacity: 0;
  }
}

/* 2) Comet */
.atlas-comet {
  position: absolute;
  width: 120px;
  height: 2px;
  background: linear-gradient(to right, transparent, white, transparent);
  opacity: 0.85;
  animation: cometFly 2.7s linear forwards;
}
@keyframes cometFly {
  0% {
    transform: translateX(-200px) translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateX(200px) translateY(-30px);
    opacity: 0;
  }
}

/* 3) Pulse Star */
.pulse-star {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #9cedd2;
  border-radius: 50%;
  animation: starPulse 1.8s infinite ease-in-out;
}
@keyframes starPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.8);
    opacity: 1;
  }
}

/* 4) Blight */
.blight {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(
    circle,
    rgba(21, 21, 221, 0.4),
    rgba(173, 41, 41, 0.9)
  );
  border-radius: 50%;
  filter: blur(6px);
  animation: blightMove 3s ease-in-out infinite;
}
@keyframes blightMove {
  0% {
    transform: scale(0.3) translate(0, 0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  60% {
    transform: scale(1.1) translate(20px, -10px);
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: scale(0.5) translate(40px, -20px);
  }
}

/* 5) Supernova */
.supernova {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: supernovaExplode 2s ease-out forwards;
}
@keyframes supernovaExplode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  40% {
    transform: scale(4);
    opacity: 0.9;
    background: #ffeecf;
  }
  100% {
    transform: scale(7);
    opacity: 0;
  }
}

/* 6) Spiral Vortex */
.spiral-vortex {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #ff00ff;
  border-radius: 50%;
  animation: spiralSpin 3s linear forwards;
}
@keyframes spiralSpin {
  0% {
    transform: rotate(0deg) scale(0.3);
    opacity: 0.7;
  }
  50% {
    transform: rotate(720deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(1080deg) scale(0.5);
    opacity: 0;
  }
}

/* 7) Neon Spark */
.neon-spark {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #0ff;
  border-radius: 50%;
  box-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
  animation: neonBlink 1.5s ease-in-out forwards;
}
@keyframes neonBlink {
  0%, 100% { opacity: 0; transform: scale(0.5);}
  50% { opacity: 1; transform: scale(1.5);}
}

/* 8) Falling Fragment */
.falling-fragment {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffcc00;
  border-radius: 50%;
  animation: fallDown 3s linear forwards;
}
@keyframes fallDown {
  0% { transform: translateY(0px) translateX(0px); opacity: 1;}
  50% { transform: translateY(50px) translateX(10px); opacity: 0.8;}
  100% { transform: translateY(120px) translateX(20px); opacity: 0;}
}

/* 9) Electric Arc */
.electric-arc {
  position: absolute;
  width: 40px;
  height: 2px;
  background: linear-gradient(to right, #0ff, #00f, #0ff);
  opacity: 0.8;
  animation: electricZap 2.5s linear forwards;
}
@keyframes electricZap {
  0% { transform: translate(0,0) scaleX(0); opacity: 1;}
  50% { transform: translate(20px,5px) scaleX(1); opacity: 1;}
  100% { transform: translate(40px,-5px) scaleX(1); opacity: 0;}
}

/* 10) Nebula Cloud */
.nebula-cloud {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(141, 141, 247, 0.85), rgb(18, 18, 135));
  border-radius: 50%;
  filter: blur(10px);
  animation: nebulaFloat 3s ease-in-out forwards;
}
@keyframes nebulaFloat {
  0% { transform: scale(0.5) translate(0,0); opacity: 0.4;}
  50% { transform: scale(1) translate(20px, -10px); opacity: 0.6;}
  100% { transform: scale(0.8) translate(40px, -20px); opacity: 0;}
}


.bright-flash {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff, #00f7ff, #00c7ff);
  filter: blur(5px);
  animation: flash 3s infinite ease-out;
  opacity: 1;
}

@keyframes flash {
  0% {
    transform: scale(0.2);
    opacity: 1;
  }
  50% {
    transform: scale(3);
    opacity: 1;
    filter: blur(15px) brightness(5);
  }
  100% {
    transform: scale(0.2);
    opacity: 0;
    filter: blur(5px);
  }
}
</style>
