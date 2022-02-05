import * as path from "path";
import { PROGRAM_DB_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { Lyrics } from "~src/lyrics";

const DB_FILE_PATH: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_DB_FILENAME);
const BIN_RELATIVE_PATH = "bin/sqlite/sqlite3.exe";

const schema = "main";
const lyricsTable = "lyrics";

type LyricsRow = {
    artist: string, // key
    title: string, // key

    language: string,
    lyrics: string
}

let dbClient;
const getDbClient = async () => {
    if (!dbClient) {
        // Init Client
        const SQLiteTagSpawned = require("sqlite-tag-spawned");
        const localDbClient = new SQLiteTagSpawned(DB_FILE_PATH, { bin: BIN_RELATIVE_PATH });

        // Init DB file
        const init = localDbClient.transaction();
        init`CREATE TABLE IF NOT EXISTS ${schema}.${lyricsTable} (
            artist TEXT NOT NULL,
            title TEXT NOT NULL,
            language TEXT NOT NULL,
            lyrics TEXT NOT NULL,
            PRIMARY KEY (artist, title)
        )`;
        await init.commit();
        if (!dbClient) {
            dbClient = localDbClient;
        }
    }
    return dbClient;
};

export const getLyricsFromDb = async (artist: string, title: string): Promise<Lyrics> => {
    try {
        const dbClient = await getDbClient();
        const row: LyricsRow = await dbClient.get`SELECT * from ${schema}.${lyricsTable} WHERE artist=${artist} AND title=${title}`;
        if (!row) {
            return null;
        }
        return {
            language: row.language,
            lyrics: row.lyrics
        };
    }
    catch (e) {
        return null;
    }
};

export const putLyricsInDb = async (artist: string, title: string, language: string, lyrics: string): Promise<void> => {
    const dbClient = await getDbClient();
    return dbClient.query`INSERT OR REPLACE INTO ${schema}.${lyricsTable} (artist,title,language,lyrics) VALUES (${artist},${title},${language},${lyrics})`;
};

export const deleteLyricsFromDb = async (artist: string, title: string): Promise<void> => {
    const dbClient = await getDbClient();
    return dbClient.query`${`DELETE FROM ${lyricsTable} WHERE artist=${artist} AND title=${title}`}`;
};

export const putLyricsInDbIfNeeded = async (artist: string, title: string, language: string, lyrics: string): Promise<void> => {
    const foundInCache = await getLyricsFromDb(artist, title);
    if (!foundInCache) {
        await putLyricsInDb(artist, title, language, lyrics);
    }
};