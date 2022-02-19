import type { LyricsRow } from "~src/db";
import { deleteLyricsFromDb, getLyricsFromDb, putLyricsInDb, putLyricsInDbIfNeeded } from "~src/db";
import type { Lyrics } from "~src/types";
import { Language } from "~src/types";

jest.mock("../../node_modules/sqlite-tag-spawned/cjs/utils", () => ({}));
const mockTransaction = jest.fn(() => {
    const init = jest.fn();
    // @ts-ignore
    init.commit = jest.fn(async () => ({}));
    return init;
});
const mockQuery = jest.fn(async () => ({}));
const mockGet = jest.fn(async (...params: string[]) => {
    if (params[3] === "throw" || params[4] === "throw") {
        throw new Error("Error in DB");
    }
    if (params[3] === "artist" && params[4] === "title") {
        return { artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" } as LyricsRow;
    }
    return null;
});
const mockRaw = jest.fn(async () => ({}));
const mockAll = jest.fn(async () => ({}));

jest.mock("sqlite-tag-spawned", () =>
    function() {
        return { transaction: mockTransaction, query: mockQuery, get: mockGet, raw: mockRaw, all: mockAll };
    });

describe("Test db client", () => {
    describe("Test getLyricsFromDb", () => {
        afterEach(() => {
            // jest.resetAllMocks();
        });

        it("Should call get correctly", async () => {
            const lyrics: Lyrics = await getLyricsFromDb("artist", "title");

            expect(mockGet).toHaveBeenCalledWith(["SELECT * from ", ".", " WHERE artist=", " AND title=", ""], "main", "lyrics", "artist", "title");
            expect(lyrics).toEqual({ language: Language.HEBREW, lyrics: "Lyrics" });
        });
        it("Should return null when not in DB", async () => {
            const lyrics: Lyrics = await getLyricsFromDb("unknown", "unknown");

            expect(mockGet).toHaveBeenCalledWith(["SELECT * from ", ".", " WHERE artist=", " AND title=", ""], "main", "lyrics", "unknown", "unknown");
            expect(lyrics).toEqual(null);
        });
        it("Should return null on error", async () => {
            const lyrics: Lyrics = await getLyricsFromDb("throw", "throw");

            expect(mockGet).toHaveBeenCalledWith(["SELECT * from ", ".", " WHERE artist=", " AND title=", ""], "main", "lyrics", "throw", "throw");
            expect(lyrics).toEqual(null);
        });
    });
    describe("Test putLyricsInDb", () => {
        it ("Should call query correctly", async () => {
            await putLyricsInDb("artist", "title", Language.HEBREW, "Lyrics");
            expect(mockQuery).toHaveBeenCalledWith(
                ["INSERT OR REPLACE INTO ", ".", " (artist,title,language,lyrics) VALUES (", ",", ",", ",", ")"],
                "main", "lyrics", "artist", "title", "heb", "Lyrics"
            );
        });
    });
    describe("Test deleteLyricsFromDb", () => {
        it ("Should call query correctly", async () => {
            await deleteLyricsFromDb("artist", "title");
            expect(mockQuery).toHaveBeenCalledWith(
                ["DELETE FROM ", ".", " WHERE artist=", " AND title=", ""], "main", "lyrics", "artist", "title");
        });
    });
    describe("Test putLyricsInDbIfNeeded", () => {
        it("Should call query, when not in DB", async () => {
            await putLyricsInDbIfNeeded("unknown", "unknown", Language.HEBREW, "Lyrics");
            expect(mockQuery).toHaveBeenCalledWith(
                ["INSERT OR REPLACE INTO ", ".", " (artist,title,language,lyrics) VALUES (", ",", ",", ",", ")"],
                "main", "lyrics", "unknown", "unknown", "heb", "Lyrics"
            );
        });
        it("Should not call query, when already in DB", async () => {
            await putLyricsInDbIfNeeded("artist", "title", Language.HEBREW, "Lyrics");
            expect(mockQuery).not.toHaveBeenCalled();
        });
    });
});