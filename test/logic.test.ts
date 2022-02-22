/* eslint-disable @typescript-eslint/no-empty-function */
import * as fileCommon from "~src/filetypes/common";
import * as dbClient from "~src/db/dbClient";
import * as commonWriter from "~src/filetypes/commonWriter";
import * as lyrics from "~src/lyrics";
import * as utils from "~src/utils";
import type { Stats } from "fs";
import fs from "fs";
import { Language } from "~src/types";
import { handleFile, handleFolder } from "~src/logic";
import type { Config } from "~src/config/commonConfig";
import { MP3 } from "~src/filetypes/mp3";
import type { NotifierInterface } from "~src/notifier";
import { NotificationText, NotificationType } from "~src/notifier";
import path from "path";

const FULL_PATH = "test/logic.test.mp3";
const FOLDER_PATH = "testFolder";

describe("Test logic", () => {
    describe("Test handleFile", () => {
        it("Should save lyrics to cache, when lyrics found in metadata", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(dbClient, "getLyricsFromDb").mockResolvedValue(null);
            jest.spyOn(dbClient, "putLyricsInDbIfNeeded").mockImplementation(async () => {});
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { dryRun: true } as Config, undefined, notifier);

            expect(dbClient.putLyricsInDbIfNeeded).toHaveBeenCalledWith("artist", "title", Language.HEBREW, "Lyrics");
            expect(notifier.notif).toHaveBeenCalledTimes(1);
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_FOUND_DRY_RUN, NotificationType.WARNING);
        });

        it("Should not save lyrics to cache, when lyrics found in metadata, when disableCache is true", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(dbClient, "getLyricsFromDb").mockResolvedValue(null);
            jest.spyOn(dbClient, "putLyricsInDbIfNeeded").mockImplementation(async () => {});
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, dryRun: true } as Config, undefined, notifier);

            expect(dbClient.putLyricsInDbIfNeeded).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledTimes(1);
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_FOUND_DRY_RUN, NotificationType.WARNING);
        });

        it("Should not do anything, when in lyrics not found", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue(null);
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader");
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_FOUND, NotificationType.WARNING);
        });

        it("Should not do anything, when in dry-run and lyrics found", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader");
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, dryRun: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_FOUND_DRY_RUN, NotificationType.WARNING);
        });

        it("Should call txt file writer, when saveTxt is true, with writing", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile").mockImplementation(async () => true);
            jest.spyOn(commonWriter, "writeLyricsHeader");
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, saveTxt: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_WRITTEN_TO_TXT, NotificationType.DOWNLOAD);
        });

        it("Should call txt file writer, when saveTxt is true, without writing", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile").mockImplementation(async () => false);
            jest.spyOn(commonWriter, "writeLyricsHeader");
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, saveTxt: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_WRITTEN_TO_TXT, NotificationType.WARNING);
        });

        it("Should call headers writer, when saveHeader is true", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile");
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, saveHeader: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledWith(FULL_PATH, MP3, Language.HEBREW, "Lyrics", undefined);
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_WRITTEN_TO_HEADER, NotificationType.DOWNLOAD);
        });

        it("Should call both txt file writer and headers writer, when both saveTxt and saveHeader are true", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(commonWriter, "writeLyricsTxtFile").mockImplementation(async () => true);
            jest.spyOn(commonWriter, "writeLyricsHeader").mockImplementation(async () => {});
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, saveTxt: true, saveHeader: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).toHaveBeenCalledWith(FULL_PATH, "Lyrics");
            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledWith(FULL_PATH, MP3, Language.HEBREW, "Lyrics", undefined);
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_WRITTEN_TO_HEADER_AND_TXT, NotificationType.DOWNLOAD);
        });

        it("Should not call txt file writer or headers writer, when both saveTxt and saveHeader are false", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_WRITTEN_TO_HEADER_OR_TXT, NotificationType.WARNING);
        });

        it("Should not call headers writer, when lyrics already in headers", async () => {
            jest.spyOn(fileCommon, "getFileMetadata").mockResolvedValue({ artist: "artist", title: "title", language: Language.HEBREW, lyrics: "Lyrics" });
            jest.spyOn(lyrics, "getLyrics").mockResolvedValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFile(FULL_PATH, { disableCache: true, saveHeader: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsTxtFile).not.toHaveBeenCalled();
            expect(commonWriter.writeLyricsHeader).not.toHaveBeenCalled();
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_ALREADY_EXIST, NotificationType.WARNING);
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

            await handleFolder(FOLDER_PATH, { disableCache: true, saveHeader: true } as Config);

            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledTimes(2);
            expect(utils.sleep).toHaveBeenCalledTimes(2);
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

            await handleFolder(FOLDER_PATH, { disableCache: true, saveHeader: true } as Config);

            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledTimes(2);
            expect(utils.sleep).toHaveBeenCalledTimes(2);
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
            const notifier: NotifierInterface = { notif: jest.fn() } as NotifierInterface;

            await handleFolder(FOLDER_PATH, { disableCache: true } as Config, undefined, notifier);

            expect(commonWriter.writeLyricsHeader).toHaveBeenCalledTimes(0);
            expect(utils.sleep).toHaveBeenCalledTimes(0);
            expect(notifier.notif).toHaveBeenCalledWith(NotificationText.NO_FILE_HANDLED, NotificationType.WARNING);
        });
    });
});
