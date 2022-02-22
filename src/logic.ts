import type { Config } from "~src/config/commonConfig";
import type { FileHandler } from "~src/filetypes/fileHandler";
import { getFileHandler } from "~src/filetypes/fileHandler";
import type { FileMetadata } from "~src/filetypes/common";
import { getFileMetadata } from "~src/filetypes/common";
import { writeLyricsHeader, writeLyricsTxtFile } from "~src/filetypes/commonWriter";
import { putLyricsInDbIfNeeded } from "~src/db/dbClient";
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

const notifyResult = (notifier: NotifierInterface, writtenToHeader: boolean, writtenToTxtFile: boolean, lyricsInHeader: boolean, saveHeader: boolean, saveTxt: boolean) => {
    if (writtenToHeader && writtenToTxtFile) {
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_HEADER_AND_TXT, NotificationType.DOWNLOAD);
    }
    else if (writtenToHeader) {
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_HEADER, NotificationType.DOWNLOAD);
    }
    else if (writtenToTxtFile) {
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_TXT, NotificationType.DOWNLOAD);
    }
    else if (saveHeader && lyricsInHeader) {
        notifier?.notif(NotificationText.LYRICS_ALREADY_EXIST, NotificationType.WARNING);
    }
    else if (saveTxt) {
        notifier?.notif(NotificationText.LYRICS_NOT_WRITTEN_TO_TXT, NotificationType.WARNING);
    }
    else {
        notifier?.notif(NotificationText.LYRICS_NOT_WRITTEN_TO_HEADER_OR_TXT, NotificationType.WARNING);
    }
};

export const handleFile = async (filePath: string, { saveHeader, saveTxt, disableCache, offline, dryRun, skipBackup }: Omit<Config, "filename">,
    logger?: LoggerInterface, notifier?: NotifierInterface) => {
    // Assumes file is supported
    logger?.info(`Handling file ${filePath}`);

    // File handler
    const fileHandler: FileHandler = getFileHandler(filePath);

    // Parse metadata from file
    const fileMetadata: FileMetadata = await getFileMetadata(filePath, fileHandler);
    const { artist, title } = fileMetadata;
    let { language, lyrics } = fileMetadata;
    const lyricsInHeader = Boolean(language && lyrics);

    if (lyricsInHeader) {
        if (!disableCache) {
            await putLyricsInDbIfNeeded(artist, title, language, lyrics);
            logger?.verbose("Saving lyrics from header to cache");
        }
    }
    else {
        // Fetch lyrics (from cache or service. put in cache if needed)
        const fetchedLyrics: Lyrics = await getLyrics(artist, title, offline);

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

    let writtenToTxtFile = false;
    if (saveTxt) {
        // write file
        writtenToTxtFile = await writeLyricsTxtFile(filePath, lyrics);
    }

    let writtenToHeader = false;
    if (!lyricsInHeader && saveHeader) {
        // write headers
        await writeLyricsHeader(filePath, fileHandler, language, lyrics, skipBackup);
        writtenToHeader = true;
    }

    notifyResult(notifier, writtenToHeader, writtenToTxtFile, lyricsInHeader, saveHeader, saveTxt);
};

export const handleFolder = async (dir: string, config: Config, logger?: LoggerInterface, notifier?: NotifierInterface): Promise<void> => {
    logger?.info(`Handling folder ${dir}`);
    let fileHandled = false;
    const files: string[] = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath: string = path.join(dir, file).replace(/\\/g, "/");
        if (fs.lstatSync(fullPath).isDirectory()) {
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
