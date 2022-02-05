import type { IAudioMetadata } from "music-metadata";
import type { LyricsField } from "~src/filetypes/common";
import { MP3 } from "~src/filetypes/mp3";
import { FLAC } from "~src/filetypes/flac";
import { getFileExtension } from "~src/fileUtils";

export type FileHandler = {
    verifyType: (audioMetadata: IAudioMetadata) => boolean
    parseLyrics: (audioMetadata: IAudioMetadata) => LyricsField
    writeLyrics: (filePath: string, language: string, lyrics: string) => Promise<void>
};

export const getFileHandler = (fullpath: string): FileHandler => {
    if (getFileExtension(fullpath) === "mp3") {
        return MP3;
    }
    else if (getFileExtension(fullpath) === "flac") {
        return FLAC;
    }
    else {
        throw new Error("No file handler found for this file type");
    }
};
