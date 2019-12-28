export function getPrimesMap(count: number): Record<number, boolean> {
    const store = Array(~~(count/31) + 1).fill(0);
    const isSet = (bit: number): boolean => Boolean(store[~~(bit / 31)] & 1 << bit % 31);
    const setBit = (bit: number): void => {
        store[~~(bit / 31)] |= 1 << bit % 31;
    };
 
    for (let i = 3; i < ~~Math.sqrt(count); i += 2) {
        if (!isSet(i)) {
            for (let j = i * i, k = i<<1; j < count; j+=k) {
                setBit(j);
            }
        }
    }

    const primesMap = {2: true};

    for (let n = 3; n <= count ; n += 2) {
        if (!isSet(n)) {
            primesMap[n] = true;
        }
    }

    return primesMap;
}