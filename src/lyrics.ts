import { Shironet } from "~src/services";
import { getLyricsFromDb, putLyricsInDb } from "~src/db";
import { hasHebrewChars } from "~src/utils";
import type { Lyrics } from "~src/types";
import { Language } from "~src/types";

export type GetLyrics = (artist: string, track: string, local?: boolean) => Promise<Lyrics>

export const getLyricsLanguage = (lyrics: string): Language => {
    return hasHebrewChars(lyrics) ? Language.HEBREW : Language.ENGLISH;
};

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
