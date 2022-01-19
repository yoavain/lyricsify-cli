import { getLyricsFromDb } from "~src/db/dbClient";
import type { LyricsService } from "~src/services/interface";

export const CacheLyricsService: LyricsService = {
    async getLyrics(artist: string, title: string): Promise<string> {
        return getLyricsFromDb(artist, title);
    }
};
