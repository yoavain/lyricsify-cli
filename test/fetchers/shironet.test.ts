import { Shironet } from "~src/fetchers/shironet";

describe("Test Shironet", () => {
    it("should return a valid Shironet lyrics", async () => {
        const lyrics: string = await Shironet.getLyrics("משינה", "שלג צח");
        expect(lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();
    });
});
