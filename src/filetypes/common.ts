import type { IAudioMetadata } from "music-metadata";
import * as MusicMetadata from "music-metadata";
import type { FileHandler } from "~src/filetypes/fileHandler";
import { ErrorMessages } from "~src/errors";
import type { Language } from "~src/types";

export type FileIdentifier = {
    artist: string
    title: string
}

export type LyricsField = {
    language?: Language
    lyrics?: string
}

export type FileMetadata = FileIdentifier & LyricsField;

export type GetFileMetadata = (file: string, fileHandler: FileHandler) => Promise<FileMetadata>;
export type WriteLyrics = (filePath: string, fileHandler: FileHandler, language: Language, lyrics: string) => Promise<void>;

const parseFileIdentifier = (audioMetadata: IAudioMetadata): FileIdentifier => {
    const artist: string = audioMetadata?.common?.artist;
    const title: string = audioMetadata?.common?.title;
    return { artist, title };
};

export const getFileMetadata: GetFileMetadata = async (filePath: string, fileHandler: FileHandler): Promise<FileMetadata> => {
    const audioMetadata: IAudioMetadata = await MusicMetadata.parseFile(filePath);
    const { artist, title } = parseFileIdentifier(audioMetadata);

    if (!artist || !title) {
        throw new Error(ErrorMessages.ERROR_COULD_NOT_GET_ARTIST_OR_TITLE_FROM_FILE);
    }

    if (!fileHandler.verifyType(audioMetadata)) {
        throw new Error(ErrorMessages.ERROR_FILE_TYPE_MISMATCH);
    }

    return { artist, title, ...fileHandler.parseLyrics(audioMetadata) };
};

export const writeLyrics: WriteLyrics = async (filePath: string, fileHandler: FileHandler, language: Language, lyrics: string) => {
    return fileHandler.writeLyrics(filePath, language, lyrics);
};
