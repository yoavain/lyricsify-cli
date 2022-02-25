import type { LoggerInterface } from "~src/logger";
import { Logger } from "~src/logger";
import type { NotifierInterface } from "~src/notifier";
import { NotificationText, NotificationType, Notifier } from "~src/notifier";
import type { Config } from "~src/config/commonConfig";
import { getConfig } from "~src/config/commonConfig";
import * as fs from "fs";
import * as path from "path";
import { PROGRAM_LOG_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import { ensureDir, isFileSupported } from "~src/fileUtils";
import { handleFile, handleFolder } from "~src/logic";

export const main = async () => {
    // CLI Args Parser
    const config: Config = getConfig(process.argv);
    const { filename, quiet, verbose, snoreToastPath } = config;

    // Logger
    await ensureDir(path.resolve(process.env.ProgramData, PROGRAM_NAME));  // Make sure the log directory is there
    const logFile: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_LOG_FILENAME);
    const logger: LoggerInterface = new Logger(logFile);
    logger.setLogLevel(verbose ? "verbose" : "info");

    // Notifier
    const notifier: NotifierInterface = new Notifier(logger, snoreToastPath, quiet);

    logger.verbose(`Argv: ${JSON.stringify(process.argv, null, "\t")}`);
    logger.verbose(`Config: ${JSON.stringify(config, null, "\t")}`);
    if (typeof filename === "string") {
        logger.info(`*** Looking for lyrics for "${filename}" ***`);
        const fullpath: string = filename.replace(/\\/g, "/");
        try {
            if (fs.lstatSync(fullpath).isDirectory()) {
                await handleFolder(fullpath, config, logger, notifier);
            }
            else {
                if (isFileSupported(fullpath)) {
                    await handleFile(fullpath, config, logger, notifier);
                }
            }
        }
        catch (e) {
            logger.error(`Cannot handle ${fullpath}: ${e.message}: ${e.stack}`);
        }
    }
    else {
        notifier.notif(NotificationText.MISSING_INPUT_FILE, NotificationType.FAILED);
    }
};
