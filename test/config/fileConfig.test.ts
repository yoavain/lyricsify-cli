import type { Config } from "~src/config";
import { getFileConfig } from "~src/config";
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
        const fileConfig: Omit<Config, "filename"> = getFileConfig();
        expect(fileConfig).toEqual({
            plex: false,
            migrate: false,
            dryRun: false,
            quiet: false,
            local: false,
            verbose: false
        });
    });
    it("test all false", () => {
        const allFalseEnvFile: string = path.resolve(__dirname, "..", "resources", "lyricsify-all-false.env");
        require("dotenv").config({ path: allFalseEnvFile });
        const fileConfig: Omit<Config, "filename"> = getFileConfig();
        expect(fileConfig).toEqual({
            plex: false,
            migrate: false,
            dryRun: false,
            quiet: false,
            local: false,
            verbose: false
        });
    });
    it("test all true", () => {
        const allTrueEnvFile: string = path.resolve(__dirname, "..", "resources", "lyricsify-all-true.env");
        require("dotenv").config({ path: allTrueEnvFile });
        const fileConfig: Omit<Config, "filename"> = getFileConfig();
        expect(fileConfig).toEqual({
            plex: true,
            migrate: true,
            dryRun: true,
            quiet: true,
            local: true,
            verbose: true
        });
    });
});
