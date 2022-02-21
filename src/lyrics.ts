import { getLyricsFromDb, putLyricsInDb } from "~src/db/dbClient";
import { Shironet } from "~src/services/shironet";
import { hasHebrewChars } from "~src/utils";
import type { Lyrics } from "~src/types";
import { Language } from "~src/types";

export type GetLyrics = (artist: string, track: string, offline?: boolean) => Promise<Lyrics>

export const getLyricsLanguage = (lyrics: string): Language => {
    return hasHebrewChars(lyrics) ? Language.HEBREW : Language.ENGLISH;
};

export const getLyrics: GetLyrics = async (artist: string, title: string, offline?: boolean): Promise<Lyrics> => {
    const lyricsFromCache: Lyrics = await getLyricsFromDb(artist, title);
    if (lyricsFromCache) {
        return lyricsFromCache;
    }

    if (!offline) {
        const lyricsFromShironet: Lyrics = await Shironet.getLyrics(artist, title);
        if (lyricsFromShironet) {
            await putLyricsInDb(artist, title, lyricsFromShironet.language, lyricsFromShironet.lyrics);
            return lyricsFromShironet;
        }
    }
};
