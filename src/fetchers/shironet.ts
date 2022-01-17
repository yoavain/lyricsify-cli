import type { LyricsFetcher } from "~src/fetchers/lyricsFetcherInterface";
import got from "got";

const SHIRONET_BASE_URL = "https://shironet.mako.co.il";

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

export const Shironet: LyricsFetcher = {
    async getLyrics(artist: string, title: string): Promise<string> {
        // Search
        const songSearchUrl: string = getSongSearchUrl(artist, title);
        const songSearchResulHtml = await got.get(songSearchUrl).then((res) => res.body);
        const songRegex: RegExp = getSongRegex(artist, title);
        const songMatch = songRegex.exec(songSearchResulHtml);
        if (!songMatch || !songMatch.groups || !songMatch.groups.songurl) {
            throw new Error("Lyrics not found");
        }

        // Fetch
        const songUrl = `${SHIRONET_BASE_URL}${songMatch.groups.songurl}`;
        const songResulHtml = await got.get(songUrl).then((res) => res.body);
        const lyrics = LYRICS_REGEXP.exec(songResulHtml);
        if (!lyrics || !lyrics.groups || !lyrics.groups.lyrics) {
            throw new Error("Lyrics not found");
        }

        return cleanLyrics(lyrics.groups.lyrics);
    }
};
