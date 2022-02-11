import type { LyricsRow } from "~src/db";
import { getLyricsFromDb } from "~src/db";
import type { Lyrics } from "~src/lyrics";

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
        return { artist: "artist", title: "title", language: "heb", lyrics: "Lyrics" } as LyricsRow;
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
            expect(lyrics).toEqual({ language: "heb", lyrics: "Lyrics" });
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
        
    });
    describe("Test deleteLyricsFromDb", () => {
        
    });
    describe("Test putLyricsInDbIfNeeded", () => {
        
    });
});