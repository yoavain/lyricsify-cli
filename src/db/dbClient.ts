import SQLiteTagSpawned from "sqlite-tag-spawned";
import * as path from "path";

const DB_FILE_PATH = path.join(__dirname, "..", "dev.sqlite3");
const BIN_RELATIVE_PATH = "bin/sqlite/sqlite3.exe";
const { get, query } = SQLiteTagSpawned(DB_FILE_PATH, { bin: BIN_RELATIVE_PATH });

const schema = "main";
const lyricsTable = "lyrics";

type LyricsRow = {
    artist: string, // key
    title: string, // key

    language: string,
    lyrics: string
}

export const getLyricsFromDb = async (artist: string, title: string): Promise<string> => {
    try {
        const row: LyricsRow = await get`SELECT * from ${schema}.${lyricsTable} WHERE artist=${artist} AND title=${title}`;
        return row?.lyrics;
    }
    catch (e) {
        return null;
    }
};

export const putLyricsInDb = async (artist: string, title: string, language: string, lyrics: string): Promise<void> => {
    return query`INSERT OR REPLACE INTO ${schema}.${lyricsTable} (artist,title,language,lyrics) VALUES (${artist},${title},${language},${lyrics})`;
};

export const deleteLyricsFromDb = async (artist: string, title: string): Promise<void> => {
    return query`${`DELETE FROM ${lyricsTable} WHERE artist=${artist} AND title=${title}`}`;
};
