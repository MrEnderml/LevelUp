import { dimensions } from "../../../data/dimensions";

export const infBonusesHandler = (id, hero) => {
    let tier = hero.value.mainInfTier;
    let ip = hero.value.infPoints;

    let dmgBonus = (dimensions.value[20].infTier >= dimensions.value[20].spInfTier? 0.005: 0)
    let totalBonus = (tier >= 25? 0.003: 0);

    switch(id){
      case 0:
        if (!hero.value.infUnlocked) return 1;
        return (1.055 + dmgBonus + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 1:
        if (!hero.value.infUnlocked) return 1;
        return (1.015 + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 2: 
        if (!hero.value.infUnlocked) return 1;
        return (1.0125 + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 3:
        if (!hero.value.infUnlocked) return 1;
        return (1.06 + totalBonus) ** (ip / (Math.sqrt(ip + 1) + Math.log(ip + 2)));
      case 4:
        if (tier < 1) return 1;
        return (1.08 + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 5:
        if (tier < 1) return 1;
        return Math.max(1 / (1.0225 + totalBonus) ** (ip / Math.sqrt(ip + 1)), 0.1);
      case 6:
        if (tier < 2) return 0;
        return Math.floor(ip / (450 - (totalBonus > 0? 50: 0)));
      case 7:
        if (tier < 3) return 1;
        return (1.045 + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 8:
        if (tier < 3) return 1;
        return (1.025 + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 9:
        if (tier < 4) return 1;
        return (1.035 + totalBonus) ** (ip / Math.sqrt(ip + 1));
      case 10:
        if (tier < 5) return 0;
        return (1.07 + totalBonus) ** (ip / (Math.sqrt(ip) * Math.log(ip))) - 1;
      case 11:
        if (tier < 6) return 1;
        return Math.max(1 / (1.025 + totalBonus) ** (ip / Math.sqrt(ip + 1)), 0.1);
      case 12:
        if (tier < 7) return 1;
        return Math.max(1 / (1.03 + totalBonus) ** (ip / Math.sqrt(ip + 1)), 0.1);
      case 13:
        if (tier < 7) return 0;
        return Math.floor((Math.sqrt(1 + 8 * (ip / 500)) - 1) / 2) * 0.01;
      case 14:
        if (tier < 8) return 1;
        return Math.max(1 / (1.02 + totalBonus) ** (ip / Math.sqrt(ip + 1)), 0.2);
      case 16:
        if (tier < 10) return 0;
        return (1.08 + totalBonus) ** (ip / (Math.sqrt(ip) * Math.log(ip))) - 1;
      case 18:
        if (tier < 16) return 0;
        return Math.floor(ip / (15 - (totalBonus > 0? 1: 0)));
      case 19:
        if (tier < 18) return 1;
        return (1.0145 + totalBonus) ** (ip / Math.sqrt(ip + 1)) - 1;
      case 20:
        if (tier < 20) return 0;
        return Math.floor(ip / (250 - (totalBonus > 0? 25: 0)));
      case 21:
        if (tier < 22) return 1;
        return Math.max((1 / (1.01 + totalBonus) ** (ip / (Math.sqrt(ip + 1) + Math.log(ip + 3)))), 0.1)
      case 23:
        if(tier < 30) return 1;
        return 1 / Math.log(Math.max(ip / 1000, 3)) ** 0.25;
      case 24:
        if(tier < 13) return 0
        return Math.floor(ip / (200 - (totalBonus > 0? 20: 0))); 
      case 25:
        if (tier < 40) return 1;
        return 1 + 0.01 * (ip / 250);
      case 29:
        if (tier < 80) return 1;
        return 0.01 * (ip / 500);
      case 30:
        if (tier < 85) return 1;
        return 1.15 ** Math.sqrt(ip);
      case 31:
        if (tier < 90) return 1;
        return 1 + 0.01 * Math.floor(ip / 2000);
      case 33:
        if (tier < 110) return 0;
        return Math.floor(ip / 2000);
      case 34:
        if (tier < 120) return 1;
        return 1 + 0.01 * Math.floor(ip / 3000);
      case 35:
        if (tier < 130) return 1;
        return 1 + 0.01 * Math.floor(ip / 4000);
      case 36:
        if (tier < 140) return 0;
        return 0.01 * Math.floor(ip / 1000);
      case 37:
        if (tier < 140) return false;
        return true;
      case 38:
        if (tier < 160) return 0;
        return 5;
      case 39:
        if (tier < 170) return 0;
        return Math.floor(ip / 2000);
      case 40:
        if (tier < 180) return 1;
        return 1 / (1 + Math.floor(ip / 25));

    
    }
}