// src/utils/global.js
export const fn = (num, f = true) => {
    
    if (num > 1e100) return "1e100";
  
    
    if (num < 0.01 && num > 0) return num.toExponential(1);

    if (f && num < 100) {
      const fixed = num.toFixed(2);
      return parseFloat(fixed).toString();
    }
    
    if (num < 1000) return Math.floor(num).toString();
  
   
    if (num >= 1e33) {
      return num.toExponential(2).replace("+", "");
    }
  
    
    const units = ["", "k", "m", "b", "t", "qa", "qi", "sx", "sp", "o", "n", "d"];
    const tier = Math.floor(Math.log10(num) / 3);
  
    
    if (tier >= units.length) {
      return num.toExponential(2).replace("+", "");
    }
  
    const suffix = units[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
  
    return scaled
      .toFixed(1)
      .replace(/\.0$/, "") + suffix;
  };

export function glitchify(text, keepChance = 0.4) {
  const symbols = "αβγδεζηθικλμνξοπρστυφχψωΩΔΛΞΠΣΦΨ";

  let result = "";

  if (Math.random() < 0.75) return text;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === " ") {
      result += " ";
      continue;
    }

    if (Math.random() < keepChance) {
      result += char;
    } else {
      result += symbols[Math.floor(Math.random() * symbols.length)];
    }
  }

  return result;
}

export function timeFormat(t) {
  if (isNaN(t) || t == null) return '00:00';

  const sec = Math.floor(t % 60).toString().padStart(2, '0');
  const min = Math.floor((t / 60) % 60).toString().padStart(2, '0');
  const hr  = Math.floor((t / 3600) % 24).toString().padStart(2, '0');
  const days = Math.floor(t / 86400);

  if (days > 0) {
    return `${days}d ${hr}:${min}:${sec}`;
  } else if (hr !== '00') {
    return `${hr}:${min}:${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}