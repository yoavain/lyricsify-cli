import * as path from "path";
import { PROGRAM_DOTENV_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { Config } from "~src/config/commonConfig";
import crypto from "crypto";

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

//region headless mode

const HASH = "c5cd0fda6b1429589d80b453ea7bcf81b6f3a323d5f664ecaecd5f63fdb05ba5";
export const headlessMode: boolean = process.env.LYRICSIFY_HEADLESS_MODE && (crypto.createHash("sha256").update(process.env.LYRICSIFY_HEADLESS_MODE).digest("hex") === HASH);

//endregion headless mode
