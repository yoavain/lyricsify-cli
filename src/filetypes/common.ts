import * as MusicMetadata from "music-metadata";
import type { IAudioMetadata } from "music-metadata";
import { FLAC } from "~src/filetypes/flac";
import { MP3 } from "~src/filetypes/mp3";

export type FileIdentifier = {
    artist: string
    title: string
}

export type LyricsField = {
    language?: string
    lyrics?: string
}

export type FileMetadata = FileIdentifier & LyricsField;

export type GetFileMetadata = (file: string) => Promise<FileMetadata>;
export type WriteLyrics = (file: string) => Promise<void>;

const parseFileIdentifier = (audioMetadata: IAudioMetadata): FileIdentifier => {
    const artist: string = audioMetadata?.common?.artist;
    const title: string = audioMetadata?.common?.title;
    return { artist, title };
};

export const getFileMetadata: GetFileMetadata = async (file: string): Promise<FileMetadata> => {
    const audioMetadata: IAudioMetadata = await MusicMetadata.parseFile(file);
    const { artist, title } = parseFileIdentifier(audioMetadata);

    if (!artist || !title) {
        throw new Error("Could not get artist or title from file");
    }
    
    if (FLAC.isFlac(audioMetadata)) {
        return { artist, title, ...FLAC.parseLyrics(audioMetadata) };
    }
    else if (MP3.isMp3(audioMetadata)) {
        return { artist, title, ...MP3.parseLyrics(audioMetadata) };
    }
    else {
        return { artist, title };
    }
};
