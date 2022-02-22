import type { IAudioMetadata } from "music-metadata";
import { MP3 } from "~src/filetypes/mp3";
import type { LyricsField } from "~src/filetypes/common";
import { SupportedFileExtension } from "~src/filetypes/types";
import { FLAC } from "~src/filetypes/flac";
import { getFileExtension } from "~src/fileUtils";
import { ErrorMessages } from "~src/errors";
import type { Language } from "~src/types";

export type FileHandler = {
    getExtension: () => SupportedFileExtension
    verifyType: (audioMetadata: IAudioMetadata) => boolean
    parseLyrics: (audioMetadata: IAudioMetadata) => LyricsField
    writeLyrics: (filePath: string, language: Language, lyrics: string, skipBackup?: boolean) => Promise<void>
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
        throw new Error(ErrorMessages.ERROR_NO_FILE_HANDLER_FOR_THIS_FILE);
    }
};
