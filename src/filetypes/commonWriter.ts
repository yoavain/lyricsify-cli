import type { FileHandler } from "~src/filetypes";
import { fileExistsSync, getPlexPath, writeFile } from "~src/fileUtils";

export const writePlexLyrics = async (filePath: string, lyrics: string) => {
    const plexPath = getPlexPath(filePath);
    if (!fileExistsSync(plexPath)) {
        await writeFile(plexPath, lyrics);
    }
    else {
        // todo - logger + Notify
        console.log("File already exists");
    }
};

export const writeLyricsHeader = async (filePath: string, fileHandler: FileHandler, language: string, lyrics: string) => {
    await fileHandler.writeLyrics(filePath, language, lyrics);
};
