import type { Config } from "~src/config";
import type { FileMetadata } from "~src/filetypes";
import { getFileMetadata, writeLyricsHeader, writePlexLyrics } from "~src/filetypes";
import { putLyricsInDbIfNeeded } from "~src/db";
import { getLyrics } from "~src/lyrics";


export const logic = async (fullpath: string, { migrate, local, dryRun, plex }: Omit<Config, "filename">) => {
    // Parse metadata from file
    const { artist, title, language, lyrics: lyricsFromMetadata }: FileMetadata = await getFileMetadata(fullpath);

    if (lyricsFromMetadata) {
        if (migrate) {
            await putLyricsInDbIfNeeded(artist, title, language, lyricsFromMetadata);
        }
    }
    else {
        // Fetch lyrics (from cache or service. put in cache if needed)
        const fetchedLyrics: string = await getLyrics(artist, title, local);

        if (!fetchedLyrics) {
            return;
        }

        if (dryRun) {
            return;
        }

        if (plex) {
            // write file
            await writePlexLyrics();
        }
        else {
            // write headers
            await writeLyricsHeader();
        }
    }
};