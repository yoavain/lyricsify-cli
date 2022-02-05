import { Shironet } from "~src/services/shironet";
import type { Lyrics } from "~src/lyrics";

describe("Test Shironet", () => {
    beforeEach(() => {
        jest.setTimeout(15000);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return a valid Shironet lyrics", async () => {
        const lyrics: Lyrics = await Shironet.getLyrics("משינה", "שלג צח");
        expect(lyrics.lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();
    });
});
