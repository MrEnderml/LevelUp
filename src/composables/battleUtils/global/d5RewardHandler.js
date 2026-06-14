export const d5RewardHandler = (id, hero) => {
    let l = hero.value.unlimitLevel;

    switch(id) {
        case 1: 
            if (l < 3000) return 1;
            return 1 - 0.01 * Math.floor(l / 200);
        case 2:
            if (l < 4000) return 0;
            return 0.01 * Math.floor(l / 500);
        case 3:
            if (l < 5000) return 1;
            return 1 + 0.01 * Math.floor(l / 100);
        case 4:
            if (l < 6000) return 0;
            return Math.floor(l / 500);
        case 5:
            if (l < 7000) return 1;
            return 1 + 0.01 * Math.floor(l / 100);
        case 6:
            if (l < 8000) return 1;
            return 1 + 0.01 * Math.floor(l / 1000);
        case 7:
            if (l < 9000) return 0;
            return Math.floor(l / 2000);
        case 8:
            if (l < 10000) return 0;
            return Math.floor(l / 10000);
    }
}