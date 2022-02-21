/* eslint-disable @typescript-eslint/no-var-requires */
import type { Config } from "~src/config/commonConfig";
import { getFileConfig } from "~src/config/fileConfig";
import path from "path";

const SAVED_ENV = process.env;

describe("test parse", () => {
    beforeEach(() => {
        process.env = { ...SAVED_ENV };
    });
    afterEach(() => {
        jest.restoreAllMocks();
        process.env = SAVED_ENV;
    });

    it("test defaults", () => {
        const defaultEnvFile: string = path.resolve(__dirname, "..", "..", "resources", "config", "lyricsify.env");
        require("dotenv").config({ path: defaultEnvFile, override: true });

        const fileConfig: Omit<Config, "filename" | "snoreToastPath"> = getFileConfig();

        expect(fileConfig).toEqual({
            saveHeader: false,
            saveTxt: true,
            disableCache: false,
            offline: false,
            dryRun: false,
            skipBackup: false,
            quiet: false,
            verbose: false
        });
    });
    it("test all false", () => {
        const allFalseEnvFile: string = path.resolve(__dirname, "..", "resources", "lyricsify-all-false.env");
        require("dotenv").config({ path: allFalseEnvFile, override: true });

        const fileConfig: Omit<Config, "filename" | "snoreToastPath"> = getFileConfig();

        expect(fileConfig).toEqual({
            saveHeader: false,
            saveTxt: false,
            disableCache: false,
            offline: false,
            dryRun: false,
            skipBackup: false,
            quiet: false,
            verbose: false
        });
    });
    it("test all true", () => {
        const allTrueEnvFile: string = path.resolve(__dirname, "..", "resources", "lyricsify-all-true.env");
        require("dotenv").config({ path: allTrueEnvFile, override: true });

        const fileConfig: Omit<Config, "filename" | "snoreToastPath"> = getFileConfig();

        expect(fileConfig).toEqual({
            saveHeader: true,
            saveTxt: true,
            disableCache: true,
            offline: true,
            dryRun: true,
            skipBackup: true,
            quiet: true,
            verbose: true
        });
    });
});

