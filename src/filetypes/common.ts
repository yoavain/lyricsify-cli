import * as MusicMetadata from "music-metadata";
import type { IAudioMetadata } from "music-metadata";

export type FileMetadata = {
    artist: string
    title: string
    language: string
    lyrics: string
}

export type GetFileMetadata = (file: string) => Promise<FileMetadata>;
export type WriteLyrics = (file: string) => Promise<void>;

export const getFileMetadata: GetFileMetadata = async (file: string): Promise<FileMetadata> => {
    const audioMetadata: IAudioMetadata = await MusicMetadata.parseFile(file);

    const artist: string = audioMetadata.common?.artist;
    const title: string = audioMetadata.common?.title;
    
    if (!artist || !title) {
        throw new Error("Could not get artist or title from file");
    }
    
    let language: string;
    let lyrics: string;
    if (audioMetadata.format.container === "FLAC") {
        const lyricsItem = audioMetadata?.native?.vorbis?.find((field) => field.id === "UNSYNCEDLYRICS").value;
        if (lyricsItem) {
            const index = lyricsItem.indexOf("||");
            if (index >= 0) {
                language = lyricsItem.substr(0, index);
                lyrics = lyricsItem.substr(index + 1);
            }
            else {
                language = "";
                lyrics = lyricsItem;
            }
        }
    }
    else if (audioMetadata.format.container === "MPEG") {
        const lyricsItem = audioMetadata?.native["ID3v2.3"].find((field) => field.id === "USLT").value;
        if (lyricsItem) {
            language = lyricsItem.language;
            lyrics = lyricsItem.text;
        }
    }
    return { artist, title, language, lyrics};
};
