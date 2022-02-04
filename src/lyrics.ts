import { Shironet } from "~src/services";
import { getLyricsFromDb, putLyricsInDb } from "~src/db";

export type GetLyrics = (artist: string, track: string, local?: boolean) => Promise<string>

export const getLyrics: GetLyrics = async (artist: string, title: string, local?: boolean): Promise<string> => {
    const lyricsFromCache = await getLyricsFromDb(artist, title);
    if (lyricsFromCache) {
        return lyricsFromCache;
    }

    if (!local) {
        const lyrics: string = await Shironet.getLyrics(artist, title);
        if (lyrics) {
            await putLyricsInDb(artist, title, "heb", lyrics);
            return lyrics;
        }
    }
};
