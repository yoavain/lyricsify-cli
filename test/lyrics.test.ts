import * as dbClient from "~src/db/dbClient";
import type { Lyrics } from "~src/types";
import { Language } from "~src/types";
import { getLyrics, getLyricsLanguage } from "~src/lyrics";
import { Shironet } from "~src/services/shironet";

describe("Test lyrics", () => {
    beforeEach(() => {
        console.log("Before");
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Test lyrics flow", () => {
        it("should return lyrics from cache", async () => {
            jest.spyOn(dbClient, "getLyricsFromDb").mockImplementation(async () => ({ language: Language.HEBREW, lyrics: "Lyrics" }));
            jest.spyOn(Shironet, "getLyrics");

            const lyrics: Lyrics = await getLyrics("The Sign", "Ace of Base");

            expect(lyrics).toEqual({ language: "heb", lyrics: "Lyrics" });
            expect(dbClient.getLyricsFromDb).toHaveBeenCalledWith("The Sign", "Ace of Base");
            expect(Shironet.getLyrics).not.toHaveBeenCalled();
        });
        it("should return lyrics from service, and save into cache", async () => {
            jest.spyOn(dbClient, "getLyricsFromDb").mockImplementation(async () => null);
            jest.spyOn(dbClient, "putLyricsInDb").mockImplementation(async () => null);
            jest.spyOn(Shironet, "getLyrics").mockImplementation(async () => ({ language: Language.HEBREW, lyrics: "Lyrics" }));

            const lyrics: Lyrics = await getLyrics("The Sign", "Ace of Base");

            expect(lyrics).toEqual({ language: "heb", lyrics: "Lyrics" });
            expect(dbClient.getLyricsFromDb).toHaveBeenCalledWith("The Sign", "Ace of Base");
            expect(Shironet.getLyrics).toHaveBeenCalledWith("The Sign", "Ace of Base");
            expect(dbClient.putLyricsInDb).toHaveBeenCalledWith("The Sign", "Ace of Base", "heb", "Lyrics");
        });
        it("should handle miss", async () => {
            jest.spyOn(dbClient, "getLyricsFromDb").mockImplementation(async () => null);
            jest.spyOn(dbClient, "putLyricsInDb");
            jest.spyOn(Shironet, "getLyrics").mockImplementation(async () => null);

            const lyrics = await getLyrics("The Sign", "Ace of Base");

            expect(lyrics).not.toBeDefined();
            expect(dbClient.getLyricsFromDb).toHaveBeenCalledWith("The Sign", "Ace of Base");
            expect(Shironet.getLyrics).toHaveBeenCalledWith("The Sign", "Ace of Base");
            expect(dbClient.putLyricsInDb).not.toHaveBeenCalled();
        });
        it("should not call service if in offline mode, and save into cache", async () => {
            jest.spyOn(dbClient, "getLyricsFromDb").mockImplementation(async () => null);
            jest.spyOn(dbClient, "putLyricsInDb").mockImplementation(async () => null);
            jest.spyOn(Shironet, "getLyrics").mockImplementation(async () => ({ language: Language.HEBREW, lyrics: "Lyrics" }));

            const lyrics = await getLyrics("The Sign", "Ace of Base", true);

            expect(lyrics).not.toBeDefined();
            expect(dbClient.getLyricsFromDb).toHaveBeenCalledWith("The Sign", "Ace of Base");
            expect(Shironet.getLyrics).not.toHaveBeenCalled();
            expect(dbClient.putLyricsInDb).not.toHaveBeenCalled();
        });
    });

    describe("Test getLyricsLanguage", () => {
        it("Should return true", () => {
            expect(getLyricsLanguage("אבג")).toEqual(Language.HEBREW);
        });
        it("Should return false", () => {
            expect(getLyricsLanguage("abc")).toEqual(Language.ENGLISH);
        });
    });
});
