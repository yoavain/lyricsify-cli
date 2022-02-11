const MetaFlac = require("metaflac-js");
import path from "path";
import type { LyricsField } from "~src/filetypes";
import { FLAC, SupportedFileExtension } from "~src/filetypes";
import * as fileUtils from "~src/fileUtils";

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

            expect(lyricsField).toEqual({ language: "eng", lyrics: "Lyrics" });
        });
        it("Should parse correctly file with lyrics, with missing language", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithLyricsNoLanguage.json");

            const lyricsField: LyricsField = FLAC.parseLyrics(require(jsonLocation));

            expect(lyricsField).toEqual({ language: "", lyrics: "Lyrics" });
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

            await FLAC.writeLyrics("/path/to/file.flac", "heb", "Lyrics");

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
                await FLAC.writeLyrics("/path/to/file.flac", "heb", "Lyrics");
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
