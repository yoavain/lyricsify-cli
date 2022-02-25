/* eslint-disable @typescript-eslint/no-empty-function */
import * as fileCommon from "~src/filetypes/common";
import * as dbClient from "~src/db/dbClient";
import * as commonWriter from "~src/filetypes/commonWriter";
import * as lyrics from "~src/lyrics";
import * as utils from "~src/utils";
import { Language } from "~src/types";
import { handleFile, handleFolder } from "~src/logic";
import type { Config } from "~src/config/commonConfig";
import { MP3 } from "~src/filetypes/mp3";
import { BatchContext } from "~src/state/batchContext";
import type { ContextState } from "~src/state/context";
import type { Stats } from "fs";
import fs from "fs";
import path from "path";

const FULL_PATH = "test/logic.test.mp3";
const FOLDER_PATH = "testFolder";

describe("Test logic", () => {
    describe("Test handleFile", () => {
        it("Should save lyrics to cache, when lyrics found in metadata", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(dbClient, "getLyricsFromDb").mockResolvedValue(null);
            jest.spyOn(dbClient, "putLyricsInDbIfNeeded").mockImplementation(async () => {});

            const contextState: ContextState = await handleFile(FULL_PATH, { dryRun: true } as Config, undefined);

            expect(dbClient.putLyricsInDbIfNeeded).toHaveBeenCalledWith("artist", "title", Language.HEBREW, "Lyrics");
            expect(contextState).toEqual({
                dryRun: true,
                lyricsFetched: false,
                lyricsFoundInHeader: true,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: true
            });
        });

        it("Should not save lyrics to cache, when lyrics found in metadata, when disableCache is true", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(dbClient, "getLyricsFromDb").mockResolvedValue(null);
            jest.spyOn(dbClient, "putLyricsInDbIfNeeded").mockImplementation(async () => {});

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, dryRun: true } as Config, undefined);

            expect(dbClient.putLyricsInDbIfNeeded).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                dryRun: true,
                lyricsFetched: false,
                lyricsFoundInHeader: true,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: false
            });
        });

        it("Should not do anything, when in lyrics not found", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue(null);
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader");

            const contextState: ContextState = await handleFile(FULL_PATH, { } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                lyricsFetched: false,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: false
            });
        });

        it("Should not do anything, when in dry-run and lyrics found", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader");

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, dryRun: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                dryRun: true,
                lyricsFetched: true,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: false
            });
        });

        it("Should call txt file writer, when saveTxt is true, with writing", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile").mockImplementation(async () => true);
            jest.spyOn(commonWriter, "writeLyricsHeader");

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, saveTxt: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                lyricsFetched: true,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: true,
                savedToCache: false,
                shouldSaveTxt: true
            });
        });

        it("Should call txt file writer, when saveTxt is true, without writing", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile").mockImplementation(async () => false);
            jest.spyOn(commonWriter, "writeLyricsHeader");

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, saveTxt: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                lyricsFetched: true,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: true,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: false,
                shouldSaveTxt: true
            });
        });

        it("Should call headers writer, when saveHeader is true", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, saveHeader: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledWith(FULL_PATH, MP3, Language.HEBREW, "Lyrics", undefined);
            expect(contextState).toEqual({
                lyricsFetched: true,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: true,
                lyricsWrittenToTxt: false,
                savedToCache: false,
                shouldSaveHeader: true
            });
        });

        it("Should call both txt file writer and headers writer, when both saveTxt and saveHeader are true", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile").mockImplementation(async () => true);
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, saveTxt: true, saveHeader: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledWith(FULL_PATH, MP3, Language.HEBREW, "Lyrics", undefined);
            expect(contextState).toEqual({
                lyricsFetched: true,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: true,
                lyricsWrittenToTxt: true,
                savedToCache: false,
                shouldSaveHeader: true,
                shouldSaveTxt: true
            });
        });

        it("Should not call txt file writer or headers writer, when both saveTxt and saveHeader are false", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                lyricsFetched: true,
                lyricsFoundInHeader: false,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: false
            });
        });

        it("Should not call headers writer, when lyrics already in headers", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });

            const contextState: ContextState = await handleFile(FULL_PATH, { disableCache: true, saveHeader: true } as Config, undefined);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(contextState).toEqual({
                lyricsFetched: false,
                lyricsFoundInHeader: true,
                lyricsTxtAlreadyExist: false,
                lyricsWrittenToHeader: false,
                lyricsWrittenToTxt: false,
                savedToCache: false,
                shouldSaveHeader: true
            });
        });
    });

    describe("Test handleFolder", () => {
        it("Should handle supported files in folder", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});
            jest.spyOn(utils, "sleep").mockImplementation(async () => {});
            // @ts-ignore
            jest.spyOn(fs, "readdirSync").mockReturnValue(["supported1.mp3", "supported2.flac", "unsupported.wav"]);
            jest.spyOn(fs, "lstatSync").mockReturnValue({ isDirectory: () => false } as Stats);

            const config = { disableCache: true, saveHeader: true } as Config;
            const batchContext: BatchContext = new BatchContext(config);
            await handleFolder(FOLDER_PATH, config, batchContext);

            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledTimes(2);
            expect(utils.sleep).toHaveBeenCalledTimes(2);
            expect(batchContext.get()).toEqual({
                filesHandled: 2,
                lyricsFetched: 2,
                lyricsFoundInHeader: 0,
                lyricsTxtAlreadyExist: 0,
                lyricsWrittenToHeader: 2,
                lyricsWrittenToTxt: 0,
                partial: false,
                savedToCache: 0
            });
        });
        it("Should handle folders recursively", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});
            jest.spyOn(utils, "sleep").mockImplementation(async () => {});
            // @ts-ignore
            jest.spyOn(fs, "readdirSync").mockImplementation((dir: string) => dir === FOLDER_PATH ? ["dir1", "dir2"] : ["supported3.mp3"]);
            jest.spyOn(fs, "lstatSync").mockImplementation((dir: string) => ({ isDirectory: () => {
                const pathDir = path.join(dir);
                const dir1 = path.join(FOLDER_PATH, "dir1");
                const dir2 = path.join(FOLDER_PATH, "dir2");
                return pathDir === dir1 || pathDir === dir2;
            }
            } as Stats));

            const config = { disableCache: true, saveHeader: true } as Config;
            const batchContext: BatchContext = new BatchContext(config);
            await handleFolder(FOLDER_PATH, config, batchContext);

            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledTimes(2);
            expect(utils.sleep).toHaveBeenCalledTimes(2);
            expect(batchContext.get()).toEqual({
                filesHandled: 2,
                lyricsFetched: 2,
                lyricsFoundInHeader: 0,
                lyricsTxtAlreadyExist: 0,
                lyricsWrittenToHeader: 2,
                lyricsWrittenToTxt: 0,
                partial: false,
                savedToCache: 0
            });
        });
        it("Should not handle unsupported files", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});
            jest.spyOn(utils, "sleep").mockImplementation(async () => {});
            // @ts-ignore
            jest.spyOn(fs, "readdirSync").mockReturnValue(["unsupported.wav"]);
            jest.spyOn(fs, "lstatSync").mockReturnValue({ isDirectory: () => false } as Stats);

            const config = { disableCache: true } as Config;
            const batchContext: BatchContext = new BatchContext(config);
            await handleFolder(FOLDER_PATH, config, batchContext);

            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledTimes(0);
            expect(utils.sleep).toHaveBeenCalledTimes(0);
            expect(batchContext.get()).toEqual({
                filesHandled: 0,
                lyricsFetched: 0,
                lyricsFoundInHeader: 0,
                lyricsTxtAlreadyExist: 0,
                lyricsWrittenToHeader: 0,
                lyricsWrittenToTxt: 0,
                partial: false,
                savedToCache: 0
            });
        });
    });
});
