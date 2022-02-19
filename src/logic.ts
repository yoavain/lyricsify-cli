import type { Config } from "~src/config";
import type { FileHandler, FileMetadata } from "~src/filetypes";
import { getFileHandler, getFileMetadata, writeLyricsHeader, writePlexLyrics } from "~src/filetypes";
import { putLyricsInDbIfNeeded } from "~src/db";
import type { Lyrics } from "~src/types";
import { getLyrics } from "~src/lyrics";
import type { NotifierInterface } from "~src/notifier";
import { NotificationText, NotificationType } from "~src/notifier";
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
    const fileMetadata: FileMetadata = await getFileMetadata(filePath, fileHandler);
    const { artist, title } = fileMetadata;
    let { language, lyrics } = fileMetadata;
    const lyricsInHeader = Boolean(language && lyrics);

    if (lyricsInHeader) {
        if (migrate) {
            await putLyricsInDbIfNeeded(artist, title, language, lyrics);
            notifier?.notif(NotificationText.MIGRATING, NotificationType.DOWNLOAD);
        }
    }
    else {
        // Fetch lyrics (from cache or service. put in cache if needed)
        const fetchedLyrics: Lyrics = await getLyrics(artist, title, local);

        // No lyrics in file, and no lyrics from service
        if (!fetchedLyrics) {
            notifier?.notif(NotificationText.LYRICS_NOT_FOUND, NotificationType.WARNING);
            return;
        }

        language = fetchedLyrics.language;
        lyrics = fetchedLyrics.lyrics;
    }

    if (dryRun) {
        notifier?.notif(NotificationText.LYRICS_FOUND_DRY_RUN, NotificationType.WARNING);
        return;
    }

    if (plex) {
        // write file
        const plexLyricsWritten: boolean = await writePlexLyrics(filePath, lyrics);
        if (plexLyricsWritten) {
            notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_TXT, NotificationType.DOWNLOAD);
        }
        else {
            notifier?.notif(NotificationText.LYRICS_NOT_WRITTEN_TO_TXT, NotificationType.WARNING);
        }
    }
    else if (!lyricsInHeader) {
        // write headers
        await writeLyricsHeader(filePath, fileHandler, language, lyrics);
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_HEADER, NotificationType.DOWNLOAD);
    }
    else {
        notifier?.notif(NotificationText.LYRICS_ALREADY_EXIST, NotificationType.WARNING);
    }
};

export const handleFolder = async (dir: string, config: Config, logger?: LoggerInterface, notifier?: NotifierInterface): Promise<void> => {
    let fileHandled = false;
    const files: string[] = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath: string = path.join(dir, file).replace(/\\/g, "/");
        if (fs.lstatSync(fullPath).isDirectory()) {
            logger?.verbose(`Handling sub-folder ${fullPath}`);
            await handleFolder(fullPath, config, logger, notifier);
        }
        else {
            if (isFileSupported(fullPath)) {
                fileHandled = true;
                logger?.verbose(`Waiting ${BATCH_SLEEP_DURATION}ms to handle file ${fullPath}`);
                await sleep(BATCH_SLEEP_DURATION);
                await handleFile(fullPath, config, logger, notifier);
            }
        }
    }
    if (!fileHandled) {
        notifier?.notif(NotificationText.NO_FILE_HANDLED, NotificationType.WARNING);
    }
};
