import type { IAudioMetadata } from "music-metadata";
import type { LyricsField } from "~src/filetypes";
import { FLAC, MP3, SupportedFileExtension } from "~src/filetypes";
import { getFileExtension } from "~src/fileUtils";
import { ERROR_NO_FILE_HANDLER_FOR_THIS_FILE } from "~src/errors";

export type FileHandler = {
    getExtension: () => SupportedFileExtension
    verifyType: (audioMetadata: IAudioMetadata) => boolean
    parseLyrics: (audioMetadata: IAudioMetadata) => LyricsField
    writeLyrics: (filePath: string, language: string, lyrics: string) => Promise<void>
};

export const getFileHandler = (filePath: string): FileHandler => {
    const fileExtension: string = getFileExtension(filePath);
    if (fileExtension === SupportedFileExtension.MP3) {
        return MP3;
    }
    else if (fileExtension === SupportedFileExtension.FLAC) {
        return FLAC;
    }
    else {
        throw new Error(ERROR_NO_FILE_HANDLER_FOR_THIS_FILE);
    }
};
