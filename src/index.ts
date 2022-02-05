import type { LoggerInterface } from "~src/logger";
import { Logger } from "~src/logger";
import type { NotifierInterface } from "~src/notifier";
import { NotificationType, Notifier } from "~src/notifier";
import type { Config } from "~src/config";
import { getConfig } from "~src/config";
import * as fs from "fs";
import * as fsextra from "fs-extra";
import * as path from "path";
import { PROGRAM_LOG_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { FileHandler, FileMetadata } from "~src/filetypes";
import { getFileHandler, getFileMetadata } from "~src/filetypes";
import type { Lyrics } from "~src/lyrics";
import { getLyrics } from "~src/lyrics";
import { getLyricsFromDb, putLyricsInDb } from "~src/db";
import { isFileSupported } from "~src/fileUtils";

// Make sure the log directory is there
fsextra.ensureDirSync(path.resolve(process.env.ProgramData, PROGRAM_NAME));

// CLI Args Parser
const { filename, dryRun, migrate, local, quiet, verbose }: Config = getConfig(process.argv);

// Logger
const logFile: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_LOG_FILENAME);
const logger: LoggerInterface = new Logger(logFile);
logger.setLogLevel(verbose ? "verbose" : "info");

// Notifier
const notifier: NotifierInterface = new Notifier(logger, quiet);

// handle single file
const handleSingleFile = async (fullpath: string): Promise<void> => {
    try {
        const split: string[] = fullpath.split("/");
        const parentFolder: string = split[split.length - 2];

        const fileHandler: FileHandler= getFileHandler(fullpath);

        // Parse metadata from file
        const { artist, title, lyrics }: FileMetadata = await getFileMetadata(fullpath, fileHandler);

        // Check if already exists
        if (lyrics) {
            notifier.notif("Lyrics already exist", NotificationType.WARNING);

            // Check if we should migrate from file to db
            if (migrate) {
                const lyricsFromCache: Lyrics = await getLyricsFromDb(artist, title);
                if (!lyricsFromCache) {
                    await putLyricsInDb(artist, title, lyricsFromCache.language, lyricsFromCache.lyrics);
                }
            }
            return;
        }

        // Not fetching lyrics from remote
        if (local) {
            return;
        }

        // Fetch lyrics
        const lyricsFromService: Lyrics = await getLyrics(artist, title);

        if (dryRun) {
            console.log(lyricsFromService);
        }
        else {
            // todo - write file
        }
    }
    catch (e) {
        logger.error(`Cannot handle ${fullpath}`);
        notifier.notif(`Cannot handle ${fullpath}`, NotificationType.WARNING);
    }
};

// Batch
const batchInterval = 2000; // milliseconds
let batchCounter = 0;
const getWaitTimeMs = (): number => {
    batchCounter += 1;
    return batchCounter * batchInterval;
};


const handleFolder = (dir: string): void => {
    let noFileHandled = true;
    fs.readdirSync(dir).forEach((file) => {
        const fullPath: string = path.join(dir, file).replace(/\\/g, "/");
        if (fs.lstatSync(fullPath).isDirectory()) {
            logger.verbose(`Handling sub-folder ${fullPath}`);
            handleFolder(fullPath);
        }
        else {
            if (isFileSupported(fullPath)) {
                noFileHandled = false;
                const waitTimeMs: number = getWaitTimeMs();
                logger.verbose(`Waiting ${waitTimeMs}ms to handle file ${fullPath}`);
                setTimeout(handleSingleFile, waitTimeMs, fullPath);
            }
        }
    });
    if (noFileHandled) {
        notifier.notif("No file handled", NotificationType.WARNING);
    }
};

const main = async () => {
    logger.verbose(`Argv: ${process.argv.join(" ")}`);
    logger.verbose(`Quiet Mode: ${quiet}`);
    if (typeof filename === "string") {
        logger.info(`*** Looking for subtitle for "${filename}" ***`);
        const fullpath: string = filename.replace(/\\/g, "/");
        try {
            if (fs.lstatSync(fullpath).isDirectory()) {
                await handleFolder(fullpath);
            }
            else {
                if (isFileSupported(fullpath)) {
                    await handleSingleFile(fullpath);
                }
            }
        }
        catch (e) {
            logger.error(`Cannot handle ${fullpath}`);
        }
    }
    else {
        notifier.notif("Missing input file", NotificationType.FAILED);
    }
};

// Run main
main().catch(console.error);
