import type { LyricsField, WriteLyrics } from "~src/filetypes/common";
import type { IAudioMetadata } from "music-metadata";

const writeLyrics: WriteLyrics = async (file: string) => {
    // todo;
};

const isMp3 = (audioMetadata: IAudioMetadata): boolean => {
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

export const MP3 = {
    isMp3,
    parseLyrics
};