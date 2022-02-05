import type { Config } from "~src/config";
import type { FileHandler, FileMetadata } from "~src/filetypes";
import { getFileHandler, getFileMetadata, writeLyricsHeader, writePlexLyrics } from "~src/filetypes";
import { putLyricsInDbIfNeeded } from "~src/db";
import type { Lyrics } from "~src/lyrics";
import { getLyrics } from "~src/lyrics";
import type { NotifierInterface } from "~src/notifier";
import { NotificationType } from "~src/notifier";
import type { LoggerInterface } from "~src/logger";
import { isFileSupported } from "~src/fileUtils";
import { sleep } from "~src/utils";
import fs from "fs";
import path from "path";

const BATCH_SLEEP_DURATION = 1000; // milliseconds

export const handleFile = async (filePath: string, { migrate, local, dryRun, plex }: Omit<Config, "filename">, logger?: LoggerInterface, notifier?: NotifierInterface) => {
    // Assumes file is supported

    // File handler
    const fileHandler: FileHandler = getFileHandler(filePath);

    // Parse metadata from file
    const { artist, title, language, lyrics: lyricsFromMetadata }: FileMetadata = await getFileMetadata(filePath, fileHandler);

    if (language && lyricsFromMetadata) {
        if (migrate) {
            await putLyricsInDbIfNeeded(artist, title, language, lyricsFromMetadata);
            notifier?.notif("Lyrics found on file. Updating database", NotificationType.DOWNLOAD);
        }
        else {
            notifier?.notif("Lyrics already exist", NotificationType.WARNING);
        }
    }
    else {
        // Fetch lyrics (from cache or service. put in cache if needed)
        const fetchedLyrics: Lyrics = await getLyrics(artist, title, local);

        if (!fetchedLyrics) {
            notifier?.notif("Lyrics not found", NotificationType.WARNING);
            return;
        }

        if (dryRun) {
            notifier?.notif("Lyrics found. Dry-run mode", NotificationType.WARNING);
            return;
        }

        if (plex) {
            // write file
            const plexLyricsWritten: boolean = await writePlexLyrics(filePath, fetchedLyrics.lyrics);
            if (plexLyricsWritten) {
                notifier?.notif("Lyrics written to .txt file", NotificationType.DOWNLOAD);
            }
            else {
                notifier?.notif("Lyrics not written since .txt file already exists", NotificationType.WARNING);
            }
        }
        else {
            // write headers
            await writeLyricsHeader(filePath, fileHandler, fetchedLyrics.language, fetchedLyrics.lyrics);
            notifier?.notif("Lyrics written to header", NotificationType.DOWNLOAD);
        }
    }
};

export const handleFolder = async (dir: string, config: Config, logger?: LoggerInterface, notifier?: NotifierInterface): Promise<void> => {
    let noFileHandled = true;
    const files: string[] = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath: string = path.join(dir, file).replace(/\\/g, "/");
        if (fs.lstatSync(fullPath).isDirectory()) {
            logger?.verbose(`Handling sub-folder ${fullPath}`);
            await handleFolder(fullPath, config, logger, notifier);
        }
        else {
            if (isFileSupported(fullPath)) {
                noFileHandled = false;
                logger?.verbose(`Waiting ${BATCH_SLEEP_DURATION}ms to handle file ${fullPath}`);
                await sleep(BATCH_SLEEP_DURATION);
                await handleFile(fullPath, config, logger, notifier);
            }
        }
    }
    if (noFileHandled) {
        notifier?.notif("No file handled", NotificationType.WARNING);
    }
};
