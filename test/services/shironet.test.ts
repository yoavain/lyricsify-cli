import * as puppeteerUtils from "~src/puppeteerUtils";
import type { Lyrics } from "~src/types";
import { Language } from "~src/types";
import { getLanguageFromUrl, Shironet } from "~src/services/shironet";
import type { ElementHandle, Page } from "puppeteer";
import { ErrorMessages } from "~src/errors";

describe("Test Shironet", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Test getLanguageFromUrl", () => {
        it("Should return Hebrew", () => {
            const lang: Language = getLanguageFromUrl("https://shironet.mako.co.il/artist?type=lyrics&lang=1&prfid=686&wrkid=3063");

            expect(lang).toBe(Language.HEBREW);
        });
        it("Should return English", () => {
            const lang: Language = getLanguageFromUrl("https://shironet.mako.co.il/artist?type=lyrics&lang=2&prfid=686&wrkid=3063");

            expect(lang).toBe(Language.ENGLISH);

        });
        it("Should return Hebrew as default", () => {
            const lang: Language = getLanguageFromUrl("https://shironet.mako.co.il/artist?type=lyrics&prfid=686&wrkid=3063");

            expect(lang).toBe(Language.HEBREW);
        });
    });

    describe("Test Shironet (logic only)", () => {
        it("should return a valid lyrics", async () => {
            jest.spyOn(puppeteerUtils, "pageLoad").mockResolvedValue({} as Page);
            jest.spyOn(puppeteerUtils, "findElements").mockImplementation(async (page: Page, selector: string): Promise<Array<ElementHandle>> => {
                if (selector === ".search_link_name_big") {
                    return ["title1", "artist1", "title2", "artist2"] as unknown as Array<ElementHandle>;
                }
                else if (selector === ".artist_lyrics_text") {
                    return ["lyrics"] as unknown as Array<ElementHandle>;
                }
            });
            jest.spyOn(puppeteerUtils, "getElementText").mockImplementation(async (element: ElementHandle): Promise<string> => element as unknown as string);
            jest.spyOn(puppeteerUtils, "clickElement").mockImplementation(async () => { /**/ });
            jest.spyOn(puppeteerUtils, "getPageUrl").mockReturnValue("https://shironet.mako.co.il/artist?type=lyrics&lang=1&prfid=686&wrkid=3063");
            jest.spyOn(puppeteerUtils, "closePage").mockImplementation(async () => { /**/ });

            const lyrics: Lyrics = await Shironet.getLyrics("artist1", "title1");

            expect(lyrics.lyrics).toEqual("lyrics");
        });

        it("should throw when title not found", async () => {
            jest.spyOn(puppeteerUtils, "pageLoad").mockResolvedValue({} as Page);
            jest.spyOn(puppeteerUtils, "findElements").mockImplementation(async (page: Page, selector: string): Promise<Array<ElementHandle>> => {
                if (selector === ".search_link_name_big") {
                    return ["title1", "artist1", "title2", "artist2"] as unknown as Array<ElementHandle>;
                }
            });
            jest.spyOn(puppeteerUtils, "getElementText").mockImplementation(async (element: ElementHandle): Promise<string> => element as unknown as string);
            jest.spyOn(puppeteerUtils, "closePage").mockImplementation(async () => { /**/ });

            try {
                await Shironet.getLyrics("artist1", "title2");
                fail();
            }
            catch (e) {
                // pass
                expect(e.message).toEqual(ErrorMessages.ERROR_LYRICS_NOT_FOUND);
            }
        });

        it("should throw when lyrics not found", async () => {
            jest.spyOn(puppeteerUtils, "pageLoad").mockResolvedValue({} as Page);
            jest.spyOn(puppeteerUtils, "findElements").mockImplementation(async (page: Page, selector: string): Promise<Array<ElementHandle>> => {
                if (selector === ".search_link_name_big") {
                    return ["title1", "artist1", "title2", "artist2"] as unknown as Array<ElementHandle>;
                }
            });
            jest.spyOn(puppeteerUtils, "getElementText").mockImplementation(async (element: ElementHandle): Promise<string> => element as unknown as string);
            jest.spyOn(puppeteerUtils, "clickElement").mockImplementation(async () => { /**/ });
            jest.spyOn(puppeteerUtils, "closePage").mockImplementation(async () => { /**/ });

            try {
                await Shironet.getLyrics("artist1", "title1");
                fail();
            }
            catch (e) {
                // pass
                expect(e.message).toEqual(ErrorMessages.ERROR_LYRICS_NOT_FOUND);
            }
        });
    });
});