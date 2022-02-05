/* eslint-disable @typescript-eslint/no-empty-function */
import * as fileCommon from "~src/filetypes/common";
import * as dbClient from "~src/db/dbClient";
import * as commonWriter from "~src/filetypes/commonWriter";
import * as lyrics from "~src/lyrics";
import { logic } from "~src/logic";
import type { Config } from "~src/config";
import type { FileHandler } from "~src/filetypes";

const FULL_PATH = "test/logic.test.mp3";

describe("Test logic", () => {
    it("Should migrate, when lyrics in metadata", async () => {
        jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: "heb", lyrics: "Lyrics" });
        jest.spyOn(dbClient, "getLyricsFromDb").mockResolvedValue(null);
        jest.spyOn(dbClient, "putLyricsInDbIfNeeded").mockImplementation(async () => {});

        const fileHandler: FileHandler = {} as FileHandler;
        await logic(FULL_PATH, fileHandler, { migrate: true } as Config);

        expect(dbClient.putLyricsInDbIfNeeded).toHaveBeenCalledWith("artist", "title", "heb", "Lyrics");
    });

    it("Should not migrate, when flag is false", async () => {
        jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: "heb", lyrics: "Lyrics" });
        jest.spyOn(dbClient, "getLyricsFromDb").mockResolvedValue(null);
        jest.spyOn(dbClient, "putLyricsInDbIfNeeded");

        const fileHandler: FileHandler = {} as FileHandler;
        await logic(FULL_PATH, fileHandler, { migrate: false } as Config);

        expect(dbClient.putLyricsInDbIfNeeded).not.toHaveBeenCalled();
    });

    it("Should not do anything, when in lyrics not found", async () => {
        jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
        jest.spyOn(lyrics, "getLyrics").mockResolvedValue(null);
        jest.spyOn(commonWriter, "writePlexLyrics");
        jest.spyOn(commonWriter, "writeLyricsHeader");

        const fileHandler: FileHandler = {} as FileHandler;
        await logic(FULL_PATH, fileHandler, { migrate: false } as Config);

        expect(commonWriter.writePlexLyrics).not.toHaveBeenCalled();
        expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
    });

    it("Should not do anything, when in dry-run mode and lyrics found", async () => {
        jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
        jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: "heb", lyrics: "Lyrics" });
        jest.spyOn(commonWriter, "writePlexLyrics");
        jest.spyOn(commonWriter, "writeLyricsHeader");

        const fileHandler: FileHandler = {} as FileHandler;
        await logic(FULL_PATH, fileHandler, { migrate: false, dryRun: true } as Config);

        expect(commonWriter.writePlexLyrics).not.toHaveBeenCalled();
        expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
    });

    it("Should call plex writer, when in plex mode", async () => {
        jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
        jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: "heb", lyrics: "Lyrics" });
        jest.spyOn(commonWriter, "writePlexLyrics").mockImplementation(async () => {});
        jest.spyOn(commonWriter, "writeLyricsHeader");

        const fileHandler: FileHandler = {} as FileHandler;
        await logic(FULL_PATH, fileHandler, { migrate: false, dryRun: false, plex: true } as Config);

        expect(commonWriter.writePlexLyrics).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
        expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
    });

    it("Should call headers writer, when not in plex mode", async () => {
        jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
        jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: "heb", lyrics: "Lyrics" });
        jest.spyOn(commonWriter, "writePlexLyrics");
        jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});

        const fileHandler: FileHandler = {} as FileHandler;
        await logic(FULL_PATH, fileHandler, { migrate: false, dryRun: false, plex: false } as Config);

        expect(commonWriter.writePlexLyrics).not.toHaveBeenCalled();
        expect(commonWriter.writeLyricsHeader).toHaveBeenCalledWith(FULL_PATH, fileHandler, "heb", "Lyrics");
    });
});
