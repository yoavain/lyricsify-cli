import type { LyricsService } from "~src/services/interface";
import type { Lyrics } from "~src/lyrics";
import { ErrorMessages } from "~src/errors";
import type { ElementHandle, Page } from "puppeteer";
import { clickElement, closePage, findElements, getElementText, pageLoad } from "~src/puppeteerUtils";
import { chunkToPairs } from "~src/utils";

const SHIRONET_BASE_URL = "https://shironet.mako.co.il";

const LANGUAGE = "heb";

export const getSongSearchUrl = (artist: string, title: string): string => {
    return `${SHIRONET_BASE_URL}/searchSongs?q=${encodeURIComponent(`"${artist}" "${title}"`)}&type=lyrics`;
};

export const Shironet: LyricsService = {
    async getLyrics(artist: string, title: string): Promise<Lyrics> {
        let page: Page;
        try {
            const songSearchUrl: string = getSongSearchUrl(artist, title);

            // Open search page
            page = await pageLoad(songSearchUrl, ".search_results");

            // Find all search_link_name_big elements
            const searchElements: Array<ElementHandle> = await findElements(page, ".search_link_name_big");
            const titleArtistPairs: Array<[ElementHandle, ElementHandle]> = chunkToPairs<ElementHandle>(searchElements);

            let foundElement: ElementHandle;
            for (const [titleElement, artistElement] of titleArtistPairs) {
                const titleFromElement: string = await getElementText(titleElement, "textContent");
                const artistFromElement: string = await getElementText(artistElement, "textContent");

                // Exact match
                if (artistFromElement === artist && titleFromElement === title) {
                    foundElement = titleElement;
                    break;
                }
            }

            if (!foundElement) {
                throw new Error(ErrorMessages.ERROR_LYRICS_NOT_FOUND);
            }
            await clickElement(page, foundElement, ".artist_lyrics_text");

            const lyricsElements: Array<ElementHandle> = await findElements(page, ".artist_lyrics_text");
            if (!lyricsElements?.length) {
                throw new Error(ErrorMessages.ERROR_LYRICS_NOT_FOUND);
            }

            const lyrics: string = await getElementText(lyricsElements[0], "textContent");

            return {
                language: LANGUAGE,
                lyrics: lyrics
            };

        }
        catch (e) {
            console.error(e);
            throw new Error(ErrorMessages.ERROR_LYRICS_NOT_FOUND);
        }
        finally {
            if (page) {
                await closePage(page);
            }
        }
    }
};