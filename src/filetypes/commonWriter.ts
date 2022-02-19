import type { FileHandler } from "~src/filetypes";
import { fileExistsSync, getPlexPath, writeFile } from "~src/fileUtils";
import type { Language } from "~src/types";

export const writePlexLyrics = async (filePath: string, lyrics: string): Promise<boolean> => {
    const plexPath = getPlexPath(filePath);
    if (fileExistsSync(plexPath)) {
        return false;
    }

    await writeFile(plexPath, lyrics);
    return true;
};

export const writeLyricsHeader = async (filePath: string, fileHandler: FileHandler, language: Language, lyrics: string) => {
    await fileHandler.writeLyrics(filePath, language, lyrics);
};
