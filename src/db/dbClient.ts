import { test, development } from "../knexfile";
import { knex } from "knex";

const schema = "main";
const lyricsTable = "lyrics";

const testMode = process.env.TEST_MODE === "true";
const knexClient = knex(testMode ? test : development);

const upsert = <T>(tableName: string, data: T) => {
    const wrap = (key: string): string => `"${key.replace(/"/g, "\"\"")}"`;
    return knexClient.raw("INSERT OR REPLACE INTO " +
        tableName +
        " (" + Object.keys(data).map(wrap).join(", ") +
        ") VALUES (" +
        Object.values(data).map(wrap).join(", ") + ")");
};

type LyricsRow = {
    artist: string, // key
    track: string, // key

    lyrics: string
}

export const getLyricsFromDb = async (artist: string, track: string): Promise<string> => {
    return knexClient
        .withSchema(schema)
        .select<LyricsRow[]>("*")
        .where({ artist, track })
        .from<LyricsRow>(lyricsTable)
        .then((result: LyricsRow[]) => {
            if (result?.length === 1) {
                return result[0].lyrics;
            }
        })
        .catch(() => {
            return null;
        });

};

export const putLyricsInDb = async (artist: string, track: string, lyrics: string): Promise<void> => {
    return upsert<LyricsRow>(lyricsTable, { artist, track, lyrics });
};

export const deleteLyricsFromDb = async (artist: string, track: string): Promise<void> => {
    return knexClient
        .withSchema(schema)
        .where({ artist, track })
        .from<LyricsRow>(lyricsTable)
        .del();
};
