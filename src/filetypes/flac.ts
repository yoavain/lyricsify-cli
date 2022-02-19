import type { LyricsField } from "~src/filetypes/common";
import type { IAudioMetadata } from "music-metadata";
import type { FileHandler } from "~src/filetypes";
import { SupportedFileExtension } from "~src/filetypes";
import MetaFlac from "metaflac-js";
import { backupFile } from "~src/fileUtils";
import { ErrorMessages } from "~src/errors";

const getExtension = (): SupportedFileExtension => {
    return SupportedFileExtension.FLAC;
};

const verifyType = (audioMetadata: IAudioMetadata): boolean => {
    return audioMetadata?.format?.container === "FLAC";
};

const parseLyrics = (audioMetadata: IAudioMetadata): LyricsField => {
    const lyricsItem = audioMetadata?.native?.vorbis?.find((field) => field.id === "UNSYNCEDLYRICS")?.value;
    if (!lyricsItem) {
        return {};
    }

    const index: number = lyricsItem.indexOf("||");
    if (index < 0) {
        return { language: "", lyrics: lyricsItem };
    }

    return {
        language: lyricsItem.substring(0, index),
        lyrics: lyricsItem.substring(index + 2)
    };
};

const writeLyrics = async (filePath: string, language: string, lyrics: string) => {
    const metaFlac = new MetaFlac(filePath);
    if (!metaFlac.getTag("UNSYNCEDLYRICS")) {
        await backupFile(filePath);
        metaFlac.setTag(`UNSYNCEDLYRICS=${language}||${lyrics}`);
        metaFlac.save();
    }
    else {
        throw new Error(ErrorMessages.ERROR_FILE_ALREADY_HAS_LYRICS);
    }
};

export const FLAC: FileHandler = {
    getExtension,
    verifyType,
    parseLyrics,
    writeLyrics
};
