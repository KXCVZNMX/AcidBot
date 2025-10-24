export const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const mode = (arr: number[]): number => {
    const counts = new Map<number, number>();
    let maxCount = 0;

    for (const num of arr) {
        const count = (counts.get(num) ?? 0) + 1;
        counts.set(num, count);

        if (count > maxCount) {
            maxCount = count;
        }
    }

    return maxCount;
};

export const countArray = (
    arr: number[],
    tags: Readonly<Record<number, string>>
) => {
    const counts = new Map();
    arr.sort((a, b) => a + b);
    for (const num of arr) {
        counts.set(num, (counts.get(num) || 0) + 1);
    }

    const ret: Map<string, number> = new Map();
    counts.entries().forEach(([k, v]) => {
        ret.set(tags[k], v);
    });

    return ret;
};
