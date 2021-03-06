/* eslint-disable security/detect-non-literal-require */
import path from "path";
import { getFileMetadata, writeLyrics } from "~src/filetypes/common";
import type { FileHandler } from "~src/filetypes/fileHandler";
import type { IAudioMetadata } from "music-metadata";
import * as MusicMetadata from "music-metadata";
import { ErrorMessages } from "~src/errors";
import { Language } from "~src/types";

describe("Test common file types", () => {
    describe("Test getFileMetadata", () => {
        it("Should throw an error when mandatory fields are missing in metadata", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/missingMandatory.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));

            try {
                await getFileMetadata("/path/to/file.mp3", undefined);
                fail();
            }
            catch (err) {
                expect(err.message).toBe(ErrorMessages.ERROR_COULD_NOT_GET_ARTIST_OR_TITLE_FROM_FILE);
            }
        });
        
        it("Should throw and error when verifyType returns false", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithLyrics.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));

            try {
                await getFileMetadata("/path/to/file.mp3", { verifyType: () => false } as unknown as FileHandler);
                fail();
            }
            catch (err) {
                expect(err.message).toBe(ErrorMessages.ERROR_FILE_TYPE_MISMATCH);
            }
        });

        it("Should call parseLyrics when metadata is correct", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithLyrics.json");
            const metadata: IAudioMetadata = require(jsonLocation);
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => metadata);
            const mockParseLyrics = jest.fn().mockReturnValue({ language: Language.HEBREW, lyrics: "Lyrics" });
            
            const response = await getFileMetadata("/path/to/file.mp3", { verifyType: () => true, parseLyrics: mockParseLyrics } as unknown as FileHandler);

            expect(mockParseLyrics).toHaveBeenCalledWith(metadata);
            expect(response).toEqual({ artist: "Artist", title: "Title", language: Language.HEBREW, lyrics: "Lyrics" });
        });
    });

    describe("Test writeLyrics", () => {
        it("Should call handler writer", async () => {
            const handler: FileHandler = {
                writeLyrics: jest.fn()
            } as unknown as FileHandler;

            await writeLyrics("/path/to/file.mp3", handler, Language.HEBREW, "Lyrics");

            expect(handler.writeLyrics).toHaveBeenCalledWith("/path/to/file.mp3", "heb", "Lyrics");
        });
    });
});