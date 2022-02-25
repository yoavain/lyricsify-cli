import type { LoggerInterface } from "~src/log/logger";
import { Logger } from "~src/log/logger";
import type { NotifierInterface } from "~src/notification/notifier";
import { Notifier } from "~src/notification/notifier";
import type { Config } from "~src/config/commonConfig";
import { getConfig } from "~src/config/commonConfig";
import { PROGRAM_LOG_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import { ensureDir, isFileSupported } from "~src/fileUtils";
import { handleFile, handleFolder } from "~src/logic";
import { BatchContext } from "~src/state/batchContext";
import { notifyBatchResult, notifyResult } from "~src/notification/notificationHandler";
import type { ContextState } from "~src/state/context";
import { NotificationText, NotificationType } from "~src/notification/notifierTypes";
import * as fs from "fs";
import * as path from "path";

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
        const fullPath: string = filename.replace(/\\/g, "/");
        try {
            if (fs.lstatSync(fullPath).isDirectory()) {
                const batchContext: BatchContext = new BatchContext(config);
                await handleFolder(fullPath, config, batchContext, logger);
                notifyBatchResult(notifier, batchContext.get());
            }
            else {
                if (isFileSupported(fullPath)) {
                    const state: ContextState = await handleFile(fullPath, config, logger);
                    notifyResult(notifier, state);
                }
                else {
                    notifier.notif(NotificationText.UNSUPPORTED_INPUT_FILE, NotificationType.FAILED);
                }
            }
        }
        catch (e) {
            logger.error(`Cannot handle ${fullPath}: ${e.message}: ${e.stack}`);
        }
    }
    else {
        notifier.notif(NotificationText.MISSING_INPUT_FILE, NotificationType.FAILED);
    }
};
