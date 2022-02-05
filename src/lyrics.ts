import { Shironet } from "~src/services";
import { getLyricsFromDb, putLyricsInDb } from "~src/db";

export type Lyrics = {
    language: string
    lyrics: string
}
export type GetLyrics = (artist: string, track: string, local?: boolean) => Promise<Lyrics>

export const getLyrics: GetLyrics = async (artist: string, title: string, local?: boolean): Promise<Lyrics> => {
    const lyricsFromCache: Lyrics = await getLyricsFromDb(artist, title);
    if (lyricsFromCache) {
        return lyricsFromCache;
    }

    if (!local) {
        const lyricsFromShironet: Lyrics = await Shironet.getLyrics(artist, title);
        if (lyricsFromShironet) {
            await putLyricsInDb(artist, title, lyricsFromShironet.language, lyricsFromShironet.lyrics);
            return lyricsFromShironet;
        }
    }
};
