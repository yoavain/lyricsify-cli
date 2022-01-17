import * as MusicMetadata from "music-metadata";
import type { IAudioMetadata } from "music-metadata";

export type FileMetadata = {
    artist: string
    title: string
    hasLyrics: boolean
}

export type GetFileMetadata = (file: string) => Promise<FileMetadata>;
export type WriteLyrics = (file: string) => Promise<void>;

export const getFileMetadata: GetFileMetadata = async (file: string): Promise<FileMetadata> => {
    const audioMetadata: IAudioMetadata = await MusicMetadata.parseFile(file);
    return {
        artist: audioMetadata.common?.artist,
        title: audioMetadata.common?.title,
        hasLyrics: Boolean(audioMetadata.common?.lyrics?.length > 0)
    };
};
