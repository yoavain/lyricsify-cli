export const sleep = (ms: number): Promise<void> => {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

export const chunkToPairs = <T>(arr: T[]): Array<[T, T]> => {
    return [...Array(Math.floor(arr.length / 2))].map<[T, T]>((_, i) => [arr[2 * i], arr[2 * i + 1]]);
};

export const hasHebrewChars = (str: string): boolean => {
    return (/[\u0590-\u05FF]/).test(str);
};