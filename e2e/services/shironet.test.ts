import { Shironet } from "~src/services/shironet";
import type { Lyrics } from "~src/lyrics";
import { getBrowser } from "~src/puppeteerUtils";
import type { Browser } from "puppeteer";

jest.setTimeout(60000);

/**
 * These tests work only locally. They do not work on GitHub Actions, as site is blocked.
 */
describe("Test Shironet", () => {
    let browser: Browser;
    beforeAll(async () => {
        browser = await getBrowser();
    });
    afterAll(async () => {
        jest.restoreAllMocks();
        await browser.close();
    });

    it.skip("should return a valid Shironet lyrics", async () => {
        const lyrics: Lyrics = await Shironet.getLyrics("משינה", "שלג צח");
        expect(lyrics.lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();
    });

    it("should throw when lyrics not found", async () => {
        try {
            await Shironet.getLyrics("משינה", "אין שיר כזה");
            fail();
        }
        catch (e) {
            // pass
        }
    });
});
