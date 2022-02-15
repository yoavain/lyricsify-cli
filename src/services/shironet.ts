import type { LyricsService } from "~src/services/interface";
import type { Lyrics } from "~src/lyrics";
import { ERROR_LYRICS_NOT_FOUND } from "~src/errors";
import type { Browser, ElementHandle } from "puppeteer";
import puppeteer from "puppeteer";

const SHIRONET_BASE_URL = "https://shironet.mako.co.il";

const LANGUAGE = "heb";

export const getSongSearchUrl = (artist: string, title: string): string => {
    return `${SHIRONET_BASE_URL}/searchSongs?q=${encodeURIComponent(`"${artist}" "${title}"`)}&type=lyrics`;
};

export const chunkToPairs = <T>(arr: T[]): Array<[T, T]> => [...Array(Math.ceil(arr.length / 2))].map<[T, T]>((_, i) => [arr[2 * i], arr[2 * i + 1]]);

export const getElementText = async (element: ElementHandle): Promise<string> => {
    return (await element.getProperty("textContent"))._remoteObject?.value?.trim();
};

export const Shironet: LyricsService = {
    async getLyrics(artist: string, title: string): Promise<Lyrics> {
        let browser: Browser;

        try {
            // Open search page
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(getSongSearchUrl(artist, title));
            await page.waitForSelector(".search_results");

            // Find all search_link_name_big elements
            const searchElements: Array<ElementHandle> = await page.$$(".search_link_name_big");
            const titleArtistPairs: Array<[ElementHandle, ElementHandle]> = chunkToPairs<ElementHandle>(searchElements);

            let foundElement: ElementHandle;
            for (const [titleElement, artistElement] of titleArtistPairs) {
                const titleFromElement: string = await getElementText(titleElement);
                const artistFromElement: string = await getElementText(artistElement);

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

            const lyrics: string = await getElementText(lyricsElements[0]);

            return {
                language: LANGUAGE,
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
    }
};