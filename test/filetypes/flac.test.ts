const MetaFlac = require("metaflac-js");
import path from "path";
import type { LyricsField } from "~src/filetypes/common";
import { SupportedFileExtension } from "~src/filetypes/types";
import { FLAC } from "~src/filetypes/flac";
import * as fileUtils from "~src/fileUtils";
import { Language } from "~src/types";

describe("Test FLAC file type", () => {
    describe("Test getExtension", () => {
        it("Should return the correct extension", () => {
            const extension: SupportedFileExtension = FLAC.getExtension();

            expect(extension).toBe(SupportedFileExtension.FLAC);
        });
    });

    describe("Test verifyType", () => {
        it("Should return true on FLAC file", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithLyrics.json");

            const isFlac: boolean = FLAC.verifyType(require(jsonLocation));

            expect(isFlac).toBeTruthy();
        });
        it("Should return true on a non-FLAC file", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithLyrics.json");

            const isFlac: boolean = FLAC.verifyType(require(jsonLocation));

            expect(isFlac).toBeFalsy();
        });
    });

    describe("Test getFileMetadata", () => {
        it("Should parse correctly file with lyrics", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithLyrics.json");

            const lyricsField: LyricsField = FLAC.parseLyrics(require(jsonLocation));

            expect(lyricsField).toEqual({ language: Language.ENGLISH, lyrics: "Lyrics" });
        });
        it("Should parse correctly file with lyrics, with missing language", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithLyricsNoLanguage.json");

            const lyricsField: LyricsField = FLAC.parseLyrics(require(jsonLocation));

            expect(lyricsField).toEqual({ language: Language.ENGLISH, lyrics: "Lyrics" });
        });
        it("Should parse correctly file without lyrics", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithoutLyrics.json");

            const lyricsField: LyricsField = FLAC.parseLyrics(require(jsonLocation));

            expect(lyricsField).toEqual({});
        });
    });
    
    describe("Test writeLyrics", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("Should write lyrics to file, if not already exists", async () => {
            const mockInit = jest.fn();
            const mockGetTag = jest.fn(() => "");
            const mockSetTag = jest.fn();
            const mockSave = jest.fn();
            jest.spyOn(MetaFlac.prototype, "init").mockImplementation(mockInit);
            jest.spyOn(MetaFlac.prototype, "getTag").mockImplementation(mockGetTag);
            jest.spyOn(MetaFlac.prototype, "setTag").mockImplementation(mockSetTag);
            jest.spyOn(MetaFlac.prototype, "save").mockImplementation(mockSave);
            jest.spyOn(fileUtils, "backupFile").mockImplementation(async () => { /* */ });

            await FLAC.writeLyrics("/path/to/file.flac", Language.HEBREW, "Lyrics");

            expect(mockInit).toHaveBeenCalledTimes(1);
            expect(mockGetTag).not.toHaveBeenCalledWith("/path/to/file.flac");
            expect(mockSetTag).toHaveBeenCalledWith("UNSYNCEDLYRICS=heb||Lyrics");
            expect(mockSave).toHaveBeenCalledTimes(1);
        });
        it("Should not write lyrics to file, if already exists", async () => {
            const mockInit = jest.fn();
            const mockGetTag = jest.fn(() => "Lyrics");
            const mockSetTag = jest.fn();
            const mockSave = jest.fn();
            jest.spyOn(MetaFlac.prototype, "init").mockImplementation(mockInit);
            jest.spyOn(MetaFlac.prototype, "getTag").mockImplementation(mockGetTag);
            jest.spyOn(MetaFlac.prototype, "setTag").mockImplementation(mockSetTag);
            jest.spyOn(MetaFlac.prototype, "save").mockImplementation(mockSave);
            jest.spyOn(fileUtils, "backupFile").mockImplementation(async () => { /* */ });

            try {
                await FLAC.writeLyrics("/path/to/file.flac", Language.HEBREW, "Lyrics");
                fail();
            }
            catch (e) {
                expect(mockInit).toHaveBeenCalledTimes(1);
                expect(mockGetTag).toHaveBeenCalledTimes(1);
                expect(mockSetTag).not.toHaveBeenCalled();
                expect(mockSave).not.toHaveBeenCalled();
            }
        });
    });
});
