import { getLyrics } from "~src/lyrics";
import * as dbClient from "~src/db/dbClient";
import { Shironet } from "~src/services";

describe("Test lyrics flow", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return lyrics from cache", async () => {
        jest.spyOn(dbClient, "getLyricsFromDb").mockImplementation(async () => "lyrics");
        jest.spyOn(Shironet, "getLyrics");

        const lyrics = await getLyrics("The Sign", "Ace of Base");
        expect(lyrics).toEqual("lyrics");
        expect(dbClient.getLyricsFromDb).toHaveBeenCalledWith("The Sign", "Ace of Base");
        expect(Shironet.getLyrics).not.toHaveBeenCalled();
    });
    it("should return lyrics from service, and save into cache", async () => {
        jest.spyOn(dbClient, "getLyricsFromDb").mockImplementation(async () => null);
        jest.spyOn(dbClient, "putLyricsInDb").mockImplementation(async () => null);
        jest.spyOn(Shironet, "getLyrics").mockImplementation(async () => "lyrics");

        const lyrics = await getLyrics("The Sign", "Ace of Base");
        expect(lyrics).toEqual("lyrics");
        expect(dbClient.getLyricsFromDb).toHaveBeenCalledWith("The Sign", "Ace of Base");
        expect(Shironet.getLyrics).toHaveBeenCalledWith("The Sign", "Ace of Base");
        expect(dbClient.putLyricsInDb).toHaveBeenCalledWith("The Sign", "Ace of Base", "lyrics");
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
});
