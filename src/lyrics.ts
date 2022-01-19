import type { GetLyrics } from "~src/services";
import { Shironet } from "~src/services";
import { getLyricsFromDb, putLyricsInDb } from "~src/db";

export const getLyrics: GetLyrics = async (artist: string, title: string): Promise<string> => {
    const lyricsFromCache = await getLyricsFromDb(artist, title);
    if (lyricsFromCache) {
        return lyricsFromCache;
    }

    const lyrics: string = await Shironet.getLyrics(artist, title);
    if (lyrics) {
        await putLyricsInDb(artist, title, lyrics);
        return lyrics;
    }
};
