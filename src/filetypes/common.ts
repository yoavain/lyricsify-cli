import type { IAudioMetadata } from "music-metadata";
import * as MusicMetadata from "music-metadata";
import type { FileHandler } from "~src/filetypes";

export type FileIdentifier = {
    artist: string
    title: string
}

export type LyricsField = {
    language?: string
    lyrics?: string
}

export type FileMetadata = FileIdentifier & LyricsField;

export type GetFileMetadata = (file: string, fileHandler: FileHandler) => Promise<FileMetadata>;
export type WriteLyrics = (filePath: string, fileHandler: FileHandler, language: string, lyrics: string) => Promise<void>;

const parseFileIdentifier = (audioMetadata: IAudioMetadata): FileIdentifier => {
    const artist: string = audioMetadata?.common?.artist;
    const title: string = audioMetadata?.common?.title;
    return { artist, title };
};

export const getFileMetadata: GetFileMetadata = async (filePath: string, fileHandler: FileHandler): Promise<FileMetadata> => {
    const audioMetadata: IAudioMetadata = await MusicMetadata.parseFile(filePath);
    const { artist, title } = parseFileIdentifier(audioMetadata);

    if (!artist || !title) {
        throw new Error("Could not get artist or title from file");
    }

    if (!fileHandler.verifyType(audioMetadata)) {
        throw new Error("File type mismatch");
    }

    return { artist, title, ...fileHandler.parseLyrics(audioMetadata) };
};

export const writeLyrics: WriteLyrics = async (filePath: string, fileHandler: FileHandler, language: string, lyrics: string) => {
    return fileHandler.writeLyrics(filePath, language, lyrics);
};
