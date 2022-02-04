import * as path from "path";
import { PROGRAM_DOTENV_FILENAME, PROGRAM_NAME } from "~src/commonConsts";
import type { Config } from "~src/config/common";

const DOTENV_FILE_PATH: string = path.resolve(process.env.ProgramData, PROGRAM_NAME, PROGRAM_DOTENV_FILENAME);
// Read configuration from config file
require("dotenv").config({ path: DOTENV_FILE_PATH });

export const getFileConfig = (): Omit<Config, "filename"> => {
    return {
        plex: Boolean(process.env.LYRICS_PLEX_ENABLED),
        migrate: Boolean(process.env.LYRICS_PLEX_ENABLED),
        dryRun: Boolean(process.env.LYRICS_PLEX_ENABLED),
        quiet: Boolean(process.env.LYRICS_PLEX_ENABLED),
        local: Boolean(process.env.LYRICSIFY_LOCAL_MODE),
        verbose: Boolean(process.env.LYRICS_PLEX_ENABLED)
    };
};
