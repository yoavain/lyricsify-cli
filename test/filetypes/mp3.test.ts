/* eslint-disable @typescript-eslint/no-var-requires */
import { Promise as NodeID3Promise } from "node-id3";
import type { LyricsField } from "~src/filetypes";
import { MP3, SupportedFileExtension } from "~src/filetypes";
import * as fileUtils from "~src/fileUtils";
import path from "path";

describe("Test MP3 file type", () => {
    it("Should return the correct extension", () => {
        const extension: SupportedFileExtension = MP3.getExtension();

        expect(extension).toBe(SupportedFileExtension.MP3);
    });

    describe("Test verifyType", () => {
        it("Should return true on FLAC file", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithLyrics.json");

            const isFlac: boolean = MP3.verifyType(require(jsonLocation));

            expect(isFlac).toBeTruthy();
        });
        it("Should return true on a non-FLAC file", () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithLyrics.json");

            const isFlac: boolean = MP3.verifyType(require(jsonLocation));

            expect(isFlac).toBeFalsy();
        });
    });

    describe("Test getFileMetadata", () => {
        it("Should parse correctly file with lyrics", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithLyrics.json");

            const lyricsField: LyricsField = await MP3.parseLyrics(require(jsonLocation));

            expect(lyricsField).toEqual({ language: "eng", lyrics: "Lyrics" });
        });
        it("Should parse correctly file without lyrics", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithoutLyrics.json");

            const lyricsField: LyricsField = await MP3.parseLyrics(require(jsonLocation));

            expect(lyricsField).toEqual({});
        });
    });

    describe("Test writeLyrics", () => {
        it("Should write lyrics to file, if not already exists", async () => {
            jest.spyOn(NodeID3Promise, "read").mockImplementation(async () => ({}));
            jest.spyOn(fileUtils, "backupFile").mockImplementation(async () => { /* */ });
            jest.spyOn(NodeID3Promise, "update").mockImplementation(async () => true);

            await MP3.writeLyrics("/path/to/file.mp3", "heb", "Lyrics");

            expect(NodeID3Promise.update).toHaveBeenCalledWith({ unsynchronisedLyrics: { language: "heb", text: "Lyrics" } }, "/path/to/file.mp3");
        });
        it("Should not write lyrics to file, if already exists", async () => {
            jest.spyOn(NodeID3Promise, "read").mockImplementation(async () => ({ unsynchronisedLyrics: { language: "heb", text: "Existing lyrics" } }));

            try {
                await MP3.writeLyrics("/path/to/file.mp3", "heb", "Lyrics");
                fail();
            }
            catch (e) {
                expect(NodeID3Promise.update).not.toHaveBeenCalled();
            }
        });
    });
});
