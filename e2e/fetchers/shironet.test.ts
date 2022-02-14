import { chunkToPairs, getSongSearchUrl, Shironet } from "~src/services/shironet";
import type { Lyrics } from "~src/lyrics";
import type { Browser, ElementHandle } from "puppeteer";
import puppeteer from "puppeteer";
import { ERROR_LYRICS_NOT_FOUND } from "~src/errors";

jest.setTimeout(60000);

describe("Test Shironet", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return a valid Shironet lyrics", async () => {
        const lyrics: Lyrics = await Shironet.getLyrics("משינה", "שלג צח");
        expect(lyrics.lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();
    });

    it("Test puppeteer code", async () => {
        const artist = "משינה";
        const title = "שלג צח";

        let browser: Browser;
        try {
            // Open search page
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(getSongSearchUrl(artist, title));
            await page.waitForSelector(".search_results");

            // Find all search_link_name_big elements
            const searchElements: Array<ElementHandle> = await page.mainFrame().$$(".search_link_name_big");
            const titleArtistPairs: Array<[ElementHandle, ElementHandle]> = chunkToPairs<ElementHandle>(searchElements);

            let foundElement: ElementHandle;
            for (const [titleElement, artistElement] of titleArtistPairs) {
                const titleFromElement: string = await page.evaluate((el) => el?.textContent?.trim(), titleElement);
                const artistFromElement: string = await page.evaluate((el) => el?.textContent?.trim(), artistElement);

                // Exact match
                if (artistFromElement === artist && titleFromElement === title) {
                    foundElement = titleElement;
                    break;
                }
            }

            if (!foundElement) {
                throw new Error(ERROR_LYRICS_NOT_FOUND);
            }

            await foundElement.click();
            await page.waitForSelector(".artist_lyrics_text");

            const lyricsElements: Array<ElementHandle> = await page.mainFrame().$$(".artist_lyrics_text");
            if (lyricsElements.length === 0) {
                throw new Error(ERROR_LYRICS_NOT_FOUND);
            }

            const lyrics: string = await page.evaluate((el) => el?.textContent?.trim(), lyricsElements[0]);
            expect(lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();

            return {
                language: "heb",
                lyrics: lyrics
            };

        }
        catch (e) {
            console.error(e);
            throw new Error(ERROR_LYRICS_NOT_FOUND);
        }
        finally {
            await browser?.close();
        }
    });
});
