import type { Config } from "~src/config";
import type { FileHandler, FileMetadata } from "~src/filetypes";
import { getFileMetadata, writeLyricsHeader, writePlexLyrics } from "~src/filetypes";
import { putLyricsInDbIfNeeded } from "~src/db";
import type { Lyrics } from "~src/lyrics";
import { getLyrics } from "~src/lyrics";


export const logic = async (filePath: string, fileHandler: FileHandler, { migrate, local, dryRun, plex }: Omit<Config, "filename">) => {
    // Assumes file is supported

    // Parse metadata from file
    const { artist, title, language, lyrics: lyricsFromMetadata }: FileMetadata = await getFileMetadata(filePath, fileHandler);

    if (language && lyricsFromMetadata) {
        if (migrate) {
            await putLyricsInDbIfNeeded(artist, title, language, lyricsFromMetadata);
        }
    }
    else {
        // Fetch lyrics (from cache or service. put in cache if needed)
        const fetchedLyrics: Lyrics = await getLyrics(artist, title, local);

        if (!fetchedLyrics) {
            return;
        }

        if (dryRun) {
            return;
        }

        if (plex) {
            // write file
            await writePlexLyrics(filePath, fetchedLyrics.lyrics);
        }
        else {
            // write headers
            await writeLyricsHeader(filePath, fileHandler, fetchedLyrics.language, fetchedLyrics.lyrics);
        }
    }
};