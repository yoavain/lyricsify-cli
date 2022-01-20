import type { LoggerInterface } from "~src/logger";
import { Logger } from "~src/logger";
import type { NotifierInterface } from "~src/notifier";
import { NotificationType, Notifier } from "~src/notifier";
import { Config } from "~src/config";
import * as fs from "fs";
import * as fsextra from "fs-extra";
import * as path from "path";
import { PROGRAM_CONFIG_FILENAME, PROGRAM_LOG_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { FileMetadata } from "~src/filetypes/common";
import { getFileMetadata } from "~src/filetypes/common";
import type { Args } from "~src/argsParser";
import { parseArgs } from "~src/argsParser";
import { getLyrics } from "~src/lyrics";
import { getLyricsFromDb, putLyricsInDb } from "~src/db";

// Make sure the log directory is there
fsextra.ensureDirSync(path.resolve(process.env.ProgramData, PROGRAM_NAME));

// CLI Args Parser
const { filename, dryRun, quiet, migrate, skipRemote }: Args = parseArgs(process.argv);

// Logger
const logFile: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_LOG_FILENAME);
const logger: LoggerInterface = new Logger(logFile);

// Notifier
const notifier: NotifierInterface = new Notifier(logger, quiet);

// Config
const confFile: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_CONFIG_FILENAME);
const config: Config = new Config(confFile, logger);
logger.setLogLevel(config.getLogLevel());

// handle single file
const handleSingleFile = async (fullpath: string): Promise<void> => {
    const split: string[] = fullpath.split("/");
    const parentFolder: string = split[split.length - 2];

    // Parse metadata from file
    const { artist, title, language, lyrics }: FileMetadata = await getFileMetadata(fullpath);

    // Check if already exists
    if (lyrics) {
        notifier.notif("Lyrics already exist", NotificationType.WARNING);

        // Check if we should migrate from file to db
        if (migrate) {
            const lyricsFromCache = await getLyricsFromDb(artist, title);
            if (!lyricsFromCache) {
                await putLyricsInDb(artist, title, language, lyrics);
            }
        }
        return;
    }

    // Not fetching lyrics from remote
    if (skipRemote) {
        return;
    }

    // Fetch lyrics
    const lyricsFromService = await getLyrics(artist, title);

    if (dryRun) {
        console.log(lyricsFromService);
    }
    else {
        // todo - write file
    }
};

// Batch
const batchInterval = 2500; // milliseconds
let batchCounter = 0;
const getWaitTimeMs = (): number => {
    batchCounter += 1;
    return batchCounter * batchInterval;
};

const getFileExtension = (fullPath: string): string => {
    const ext: string = path.extname(fullPath);
    return ext?.length > 1 && ext.startsWith(".") ? ext.substr(1) : undefined;
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
            if (config.getExtensions().includes(getFileExtension(fullPath))) {
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
                await handleSingleFile(fullpath);
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
