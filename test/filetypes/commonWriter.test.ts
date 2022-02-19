import * as fileUtils from "~src/fileUtils";
import type { FileHandler } from "~src/filetypes";
import { writeLyricsHeader, writePlexLyrics } from "~src/filetypes";
import { Language } from "~src/types";
import path from "path";

describe("Test common Writer", () => {
    describe("Test writePlexLyrics", () => {
        it("Should write file, if not exists", async () => {
            jest.spyOn(fileUtils, "fileExistsSync").mockReturnValue(false);
            jest.spyOn(fileUtils, "writeFile").mockImplementation(async () => { /* nothing */ });
            const plexLyricsWritten: boolean = await writePlexLyrics("/path/to/test.mp3", "Lyrics");
            expect(plexLyricsWritten).toBe(true);
            expect(fileUtils.writeFile).toHaveBeenCalledWith(path.join("/path/to/test.txt"), "Lyrics");
        });
        it("Should not write file, if exists", async () => {
            jest.spyOn(fileUtils, "fileExistsSync").mockReturnValue(true);
            const plexLyricsWritten: boolean = await writePlexLyrics("/path/to/test.mp3", "Lyrics");
            expect(plexLyricsWritten).toBe(false);
        });
    });

    describe("Test writeLyricsHeader", () => {
        it("Should call file handler", async () => {
            const fileHandler: FileHandler = { writeLyrics: jest.fn() } as unknown as FileHandler;
            await writeLyricsHeader("/path/to/test.mp3", fileHandler, Language.HEBREW, "Lyrics");
            expect(fileHandler.writeLyrics).toHaveBeenCalledWith("/path/to/test.mp3", "heb", "Lyrics");
        });
    });
});