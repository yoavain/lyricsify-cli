import { Shironet } from "~src/services/shironet";

describe("Test Shironet", () => {
    beforeEach(() => {
        jest.setTimeout(15000);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return a valid Shironet lyrics", async () => {
        const lyrics: string = await Shironet.getLyrics("משינה", "שלג צח");
        expect(lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();
    });
});
