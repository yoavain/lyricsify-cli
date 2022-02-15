import { Shironet } from "~src/services/shironet";
import type { Lyrics } from "~src/lyrics";
import got from "got";
import path from "path";
import * as fs from "fs";

describe("Test Shironet", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.skip("should return a valid Shironet lyrics", async () => {
        const songSearchResultHtml: string = await fs.promises.readFile(path.join(__dirname, "../resources/shironet/songSearchResult.html"), "utf8");
        const songResultHtml: string = await fs.promises.readFile(path.join(__dirname, "../resources/shironet/songResult.html"), "utf8");
        jest.spyOn(got, "get")
            .mockResolvedValueOnce({ body: songSearchResultHtml })
            .mockResolvedValueOnce({ body: songResultHtml });

        const lyrics: Lyrics = await Shironet.getLyrics("משינה", "שלג צח");
        expect(lyrics.lyrics.startsWith("הוא שוב יוצא אל המרפסת")).toBeTruthy();
    });
});
