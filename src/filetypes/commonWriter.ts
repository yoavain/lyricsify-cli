import type { FileHandler } from "~src/filetypes/fileHandler";
import { fileExistsSync, getTxtFilePath, writeFile } from "~src/fileUtils";
import type { Language } from "~src/types";

export const writeLyricsTxtFile = async (filePath: string, lyrics: string): Promise<boolean> => {
    const txtFilePath: string = getTxtFilePath(filePath);
    if (fileExistsSync(txtFilePath)) {
        return false;
    }

    await writeFile(txtFilePath, lyrics);
    return true;
};

export const writeLyricsHeader = async (filePath: string, fileHandler: FileHandler, language: Language, lyrics: string, skipBackup?: boolean) => {
    await fileHandler.writeLyrics(filePath, language, lyrics, skipBackup);
};
