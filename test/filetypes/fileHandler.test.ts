import type { FileHandler } from "~src/filetypes/fileHandler";
import { getFileHandler } from "~src/filetypes/fileHandler";
import { SupportedFileExtension } from "~src/filetypes/types";

describe("Test file handler", () => {
    describe("Test getFileHandler", () => {
        it("Should return mp3 file handler", () => {
            const fileHandler: FileHandler = getFileHandler("/path/test.mp3");
            expect(fileHandler.getExtension()).toEqual(SupportedFileExtension.MP3);
        });
        it("Should return flac file handler", () => {
            const fileHandler: FileHandler = getFileHandler("/path/test.flac");
            expect(fileHandler.getExtension()).toEqual(SupportedFileExtension.FLAC);
        });
        it("Should return file handler with different casing", () => {
            const fileHandler: FileHandler = getFileHandler("/path/test.FlAc");
            expect(fileHandler.getExtension()).toEqual(SupportedFileExtension.FLAC);
        });
        it("Should throw error, when file extension is unknown", () => {
            try {
                getFileHandler("/path/test.any");
                fail();
            }
            catch (e) {
                // pass
            }
        });
    });
});
