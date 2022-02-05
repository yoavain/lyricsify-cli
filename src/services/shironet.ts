import type { OptionsOfTextResponseBody } from "got";
import got from "got";
import type { LyricsService } from "~src/services";
import type { Lyrics } from "~src/lyrics";

const SHIRONET_BASE_URL = "https://shironet.mako.co.il";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.11 Safari/537.36";

const LANGUAGE = "heb";

const LYRICS_REGEXP = /<span\s+itemprop="Lyrics"\s+class="artist_lyrics_text">(?<lyrics>[^\\/]+)/gm;

const getSongSearchUrl = (artist: string, title: string): string => {
    return `${SHIRONET_BASE_URL}/searchSongs?q=${encodeURIComponent(`${artist} ${title}`)}&type=lyrics`;
};

const wrap = (str: string): string => {
    return str.split(" ").map((part: string) => `<b>${part}</b>`).join(" ");
};

const getSongRegex = (artist: string, title: string): RegExp => {
    return new RegExp(
        "<a\\shref=\"(?<songurl>\\/artist\\?type=lyrics&lang=1&prfid=\\d+&wrkid=\\d+)\"\\sclass=\"search_link_name_big\">\\s+" +
        `${wrap(title)}<\\/a>\\s+-\\s+` + 
        "<a href=\"(?<artisturl>\\/artist\\?lang=1&prfid=\\d+)\"\\s+class=\"search_link_name_big\">\\s+" +
        `${wrap(artist)}<\\/a>`,
        "gm");
};

const cleanLyrics = (lyrics: string): string => {
    return lyrics.replace(/<br>/g, "\n").replace("<", "");
};

export const Shironet: LyricsService = {
    async getLyrics(artist: string, title: string): Promise<Lyrics> {
        // Search
        const songSearchUrl: string = getSongSearchUrl(artist, title);
        const options: OptionsOfTextResponseBody = {
            decompress: true,
            headers: {
                "user-agent": USER_AGENT,
                "cache-control": "max-age=0"
            }
        };
        const songSearchResultHtml = await got.get(songSearchUrl, options).then((res) => res.body);
        const songRegex: RegExp = getSongRegex(artist, title);
        const songMatch = songRegex.exec(songSearchResultHtml);
        if (!songMatch || !songMatch.groups || !songMatch.groups.songurl) {
            throw new Error("Lyrics not found");
        }

        // Fetch
        const songUrl = `${SHIRONET_BASE_URL}${songMatch.groups.songurl}`;
        const songResultHtml = await got.get(songUrl, options).then((res) => res.body);
        const lyrics = LYRICS_REGEXP.exec(songResultHtml);
        if (!lyrics || !lyrics.groups || !lyrics.groups.lyrics) {
            throw new Error("Lyrics not found");
        }

        return {
            language: LANGUAGE,
            lyrics: cleanLyrics(lyrics.groups.lyrics)
        };
    }
};
