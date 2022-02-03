import type { LyricsField, WriteLyrics } from "~src/filetypes/common";
import type { IAudioMetadata } from "music-metadata";

export const writeLyrics: WriteLyrics = async (file: string) => {
    // todo;
};

const isFlac = (audioMetadata: IAudioMetadata): boolean => {
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

export const FLAC = {
    isFlac,
    parseLyrics
};
