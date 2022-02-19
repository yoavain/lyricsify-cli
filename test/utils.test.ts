import { chunkToPairs, hasHebrewChars, sleep } from "~src/utils";

describe("Test utils", () => {
    describe("Test sleep", () => {
        it("Should resolve", async () => {
            await sleep(200);
        });
    });

    describe("Test chunkToPairs", () => {
        it("Should return pairs", () => {
            const chunk = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const pairs = chunkToPairs<number>(chunk);
            expect(pairs).toEqual([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
                [9, 10]
            ]);
        });
        it("Should ignore last item in an odd array", () => {
            const chunk = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const pairs = chunkToPairs<number>(chunk);
            expect(pairs).toEqual([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8]
            ]);
        });
    });

    describe("Test hasHebrewChars", () => {
        it("Should return true", () => {
            expect(hasHebrewChars("אבג")).toBe(true);
        });
        it("Should return false", () => {
            expect(hasHebrewChars("abc")).toBe(false);
        });
    });
});
