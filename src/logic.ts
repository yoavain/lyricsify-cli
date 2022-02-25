import type { Config } from "~src/config/commonConfig";
import type { FileHandler } from "~src/filetypes/fileHandler";
import { getFileHandler } from "~src/filetypes/fileHandler";
import type { FileMetadata } from "~src/filetypes/common";
import { getFileMetadata } from "~src/filetypes/common";
import { writeLyricsHeader, writeLyricsTxtFile } from "~src/filetypes/commonWriter";
import { putLyricsInDbIfNeeded } from "~src/db/dbClient";
import type { Lyrics } from "~src/types";
import { getLyrics } from "~src/lyrics";
import type { LoggerInterface } from "~src/log/logger";
import { isFileSupported } from "~src/fileUtils";
import { sleep } from "~src/utils";
import fs from "fs";
import path from "path";
import type { ContextState } from "~src/state/context";
import { Context } from "~src/state/context";
import type { BatchContext } from "~src/state/batchContext";

const BATCH_SLEEP_DURATION = 1000; // milliseconds


export const handleFile = async (filePath: string, config: Omit<Config, "filename">, logger?: LoggerInterface): Promise<ContextState> => {
    const { saveHeader, saveTxt, disableCache, offline, dryRun, skipBackup } = config;
    // Assumes file is supported
    logger?.info(`Handling file ${filePath}`);

    // State
    const context: Context = new Context(config);

    // File handler
    const fileHandler: FileHandler = getFileHandler(filePath);

    // Parse metadata from file
    const fileMetadata: FileMetadata = await getFileMetadata(filePath, fileHandler);
    const { artist, title } = fileMetadata;
    let { language, lyrics } = fileMetadata;
    const lyricsInHeader = Boolean(language && lyrics);

    if (lyricsInHeader) {
        context.setLyricsFoundInHeader();
        if (!disableCache) {
            await putLyricsInDbIfNeeded(artist, title, language, lyrics);
            context.setSavedToCache();
            logger?.verbose("Saving lyrics from header to cache");
        }
    }
    else {
        // Fetch lyrics (from cache or service. put in cache if needed)
        const fetchedLyrics: Lyrics = await getLyrics(artist, title, offline);

        // No lyrics in file, and no lyrics from service
        if (!fetchedLyrics) {
            logger?.info("No lyrics in file and no lyrics from service");
            return context.get();
        }

        context.setLyricsFetched();
        language = fetchedLyrics.language;
        lyrics = fetchedLyrics.lyrics;
    }

    if (dryRun) {
        logger?.info("Dry run");
        return context.get();
    }

    if (saveTxt) {
        // write file
        const writtenToTxtFile = await writeLyricsTxtFile(filePath, lyrics);
        if (writtenToTxtFile) {
            logger?.info("Lyrics written to .txt file");
            context.setLyricsWrittenToTxt();
        }
        else {
            logger?.info("Lyrics .txt file already exists");
            context.setLyricsTxtAlreadyExist();
        }
    }

    if (!lyricsInHeader && saveHeader) {
        // write headers
        await writeLyricsHeader(filePath, fileHandler, language, lyrics, skipBackup);
        logger?.info("Lyrics written to header");
        context.setLyricsWrittenToHeader();
    }

    return context.get();
};

export const handleFolder = async (dir: string, config: Config, batchContext: BatchContext, logger?: LoggerInterface): Promise<void> => {
    logger?.info(`Handling folder ${dir}`);
    const files: string[] = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath: string = path.join(dir, file).replace(/\\/g, "/");
        if (fs.lstatSync(fullPath).isDirectory()) {
            await handleFolder(fullPath, config, batchContext, logger);
        }
        else {
            if (isFileSupported(fullPath)) {
                logger?.verbose(`Waiting ${BATCH_SLEEP_DURATION}ms to handle file ${fullPath}`);
                await sleep(BATCH_SLEEP_DURATION);
                const result: ContextState = await handleFile(fullPath, config, logger);
                batchContext.addResult(result);
            }
        }
    }
};
