export const dGravityHandler = (id, hero) => {

    let value = hero.value.gravity.bhMaxDmg;

    switch(id) {
        case 0: {
            let base = 1e3;
            let step = 4;

            let res = stepHandler(value, base, step);

            return  {
                v: 0.01 * res.v,
                req: res.req,
            }
        }
        case 1: {
            let base = 5e3;
            let step = 15;

            let res = stepHandler(value, base, step);
            
            return  {
                v: 1 + 0.01 * res.v,
                req: res.req,
            }
        }
        case 2: {
            let base =  1e6;
            let step = 200;

            let res = stepHandler(value, base, step);
            
            return  {
                v: res.v,
                req: res.req,
            }
        }
        case 3: {
            let base = 1e5;
            let step = 100;

            let res = stepHandler(value, base, step);
            
            return  {
                v: 1 + 0.005 * res.v,
                req: res.req,
            }
        }
        case 4: {
            let base = 1e6;
            let step = 75;

            let res = stepHandler(value, base, step);
            
            return  {
                v: 1 + 0.01 * res.v,
                req: res.req,
            }
        }
        case 5: {
            let base = 1e10;
            let step = 1e5;

            let res = stepHandler(value, base, step);
            
            return  {
                v: res.v,
                req: res.req,
            }
        }
        
    }
}

function stepHandler (value, base, step) {
    let idx = 0;
    let loops = 0;
    let b = base;

    while (value > b) {
        b *= step;
        idx++;

        if( loops > 1000) break;
        loops ++;
    }

    return {
        v: idx,
        req: b,
    }

}