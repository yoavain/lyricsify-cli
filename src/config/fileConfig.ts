import * as path from "path";
import { PROGRAM_DOTENV_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { Config } from "~src/config";

const DOTENV_FILE_PATH: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_DOTENV_FILENAME);
// Read configuration from config file
require("dotenv").config({ path: DOTENV_FILE_PATH });

export const getFileConfig = (): Omit<Config, "filename"> => {
    return {
        plex: process.env.LYRICSIFY_PLEX_MODE === "true",
        migrate: process.env.LYRICSIFY_MIGRATE_MODE === "true",
        dryRun: process.env.LYRICSIFY_DRY_RUN_MODE === "true",
        quiet: process.env.LYRICSIFY_QUIET_MODE === "true",
        local: process.env.LYRICSIFY_LOCAL_MODE === "true",
        verbose: process.env.LYRICSIFY_VERBOSE_MODE === "true"
    };
};
