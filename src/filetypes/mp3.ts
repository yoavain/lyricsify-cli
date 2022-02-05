import type { FileHandler, LyricsField } from "~src/filetypes";
import { SupportedFileExtension } from "~src/filetypes";
import type { IAudioMetadata } from "music-metadata";

const getExtension = (): SupportedFileExtension => {
    return SupportedFileExtension.MP3;
};

const verifyType = (audioMetadata: IAudioMetadata): boolean => {
    return audioMetadata?.format?.container === "MPEG";
};

const parseLyrics = (audioMetadata: IAudioMetadata): LyricsField => {
    const lyricsItem = audioMetadata?.native?.["ID3v2.3"]?.find((field) => field.id === "USLT")?.value;

    if (!lyricsItem) {
        return {};
    }

    return {
        lyrics: lyricsItem.text,
        language: lyricsItem.language
    };
};

const writeLyrics = async (filePath: string, language: string, lyrics: string) => {
    // todo;
};

export const MP3: FileHandler = {
    getExtension,
    verifyType,
    parseLyrics,
    writeLyrics
};