import * as path from "path";
import { PROGRAM_DOTENV_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { Config } from "~src/config/commonConfig";

const DOTENV_FILE_PATH: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_DOTENV_FILENAME);
// Read configuration from config file
require("dotenv").config({ path: DOTENV_FILE_PATH });

export const getFileConfig = (): Omit<Config, "filename" | "snoreToastPath"> => {
    return {
        saveHeader: process.env.LYRICSIFY_SAVE_HEADER === "true",
        saveTxt: process.env.LYRICSIFY_SAVE_TXT === "true",
        disableCache: process.env.LYRICSIFY_DISABLE_CACHE === "true",
        offline: process.env.LYRICSIFY_OFFLINE === "true",
        dryRun: process.env.LYRICSIFY_DRY_RUN_MODE === "true",
        skipBackup: process.env.LYRICSIFY_SKIP_BACKUP === "true",
        quiet: process.env.LYRICSIFY_QUIET_MODE === "true",
        verbose: process.env.LYRICSIFY_VERBOSE_MODE === "true"
    };
};
