import { spaceShop } from "../../../data/spaceShop";

export const spaceShopHandler = (id, hero) => {
    let iw = hero.value.spsCountMax;
    
    switch (id) {
      case 0:
        return (spaceShop.value[0].status? 1 + 0.1 * iw: 1);
      case 1:
        return (spaceShop.value[1].status? 10 * iw: 0);
      case 2:
        return (spaceShop.value[2].status ? 0.0125 * iw : 0);
      case 3:
        return (spaceShop.value[3].status? 1.25 * Math.floor(iw / 3): 0);
      case 4:
        return spaceShop.value[4].status ? 1.05 ** iw: 1;
      case 5:
        return (spaceShop.value[5].status? iw: 0);
      case 6:
        return (spaceShop.value[6].status? (Math.E * iw) ** 1.45: 1);
      case 7:
        return (spaceShop.value[7].status ? 1 * Math.floor(iw / 5) : 0);
      case 8:
        return (spaceShop.value[8].status? 1 * Math.floor(iw / 10): 0);
      case 9: 
        return (spaceShop.value[9].status? Math.floor(iw / 2): 0);
      case 10:
        return (spaceShop.value[10].status? hero.value.eqUps["spRing"]: 0);
      case 11:
        return (spaceShop.value[11].status? 0.75: 1);
      case 12: 
        return (spaceShop.value[12].status? Math.floor(iw / 3) : 0);
      case 13:
        return (spaceShop.value[13].status? 1 / (1.01 ** iw): 1);
      case 14:
        return (spaceShop.value[14].status? 1.1 ** iw: 1);
      case 15:
        return (spaceShop.value[15].status? 1.1 ** iw: 1);
      case 16:
        return (spaceShop.value[16].status? 1 + 0.01 * Math.floor(iw / 10): 1);
      case 17:
        return (spaceShop.value[17].status? 0.05 * Math.floor(iw / 5): 0);
      case 18:
        return (spaceShop.value[18].status? 1 + 0.01 * Math.floor(iw / 5): 1);
      case 19:
        return (spaceShop.value[19].status? 1 + 0.01 * Math.floor(iw / 10): 1);
      case 20:
        return (spaceShop.value[20].status? Math.floor(iw / 25): 0);
    }
  }