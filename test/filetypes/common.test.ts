/* eslint-disable security/detect-non-literal-require */
import path from "path";
import type { FileMetadata } from "~src/filetypes";
import { FLAC, getFileMetadata, MP3 } from "~src/filetypes";
import * as MusicMetadata from "music-metadata";

describe("Test common file types", () => {
    describe("Test getFileMetadata", () => {
        it("Should parse correctly MP3 with lyrics", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithLyrics.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));
            const metadata: FileMetadata = await getFileMetadata("/path/to/file.mp3", MP3);
            expect(metadata).toEqual({
                artist: "Artist",
                title: "Title",
                language: "eng",
                lyrics: "Lyrics"
            });
        });
        it("Should parse correctly MP3 without lyrics", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/mp3WithoutLyrics.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));
            const metadata: FileMetadata = await getFileMetadata("/path/to/file.mp3", MP3);
            expect(metadata).toEqual({
                artist: "Artist",
                title: "Title"
            });
        });
        it("Should parse correctly FLAC with lyrics", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithLyrics.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));
            const metadata: FileMetadata = await getFileMetadata("/path/to/file.mp3", FLAC);
            expect(metadata).toEqual({
                artist: "Artist",
                title: "Title",
                language: "eng",
                lyrics: "Lyrics"
            });
        });
        it("Should parse correctly FLAC without lyrics", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithoutLyrics.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));
            const metadata: FileMetadata = await getFileMetadata("/path/to/file.mp3", FLAC);
            expect(metadata).toEqual({
                artist: "Artist",
                title: "Title"
            });
        });
        it("Should throw when metadata is missing artist/title", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/missingMandatory.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));
            try {
                await getFileMetadata("/path/to/file.mp3", FLAC);
                fail();
            }
            catch (e) {
                // pass
            }
        });
        it("Should throw on fileHandler mismatch", async () => {
            const jsonLocation: string = path.join(__dirname, "../resources/metadataSamples/flacWithoutLyrics.json");
            jest.spyOn(MusicMetadata, "parseFile").mockImplementation(async () => require(jsonLocation));
            try {
                await getFileMetadata("/path/to/file.mp3", MP3);
                fail();
            }
            catch (e) {
                // pass
            }
        });
    });
});