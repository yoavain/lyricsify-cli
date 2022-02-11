import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Config } from "~src/config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

export type CliConfig = Pick<Config, "filename" | "snoreToastPath"> & Partial<Config>;

export const getCliConfig = (argv: string[]): CliConfig => {
    return yargs(hideBin(argv))
        .command<CliConfig>("* <filename>", "filename",
            (yargs) => {
                yargs.positional("filename", {
                    describe: "filename",
                    type: "string"
                });
            })
        .option("verbose", {
            alias: "v",
            type: "boolean",
            description: "print additional logs"
        })
        .option("dry-run", {
            type: "boolean",
            alias: "d",
            description: "not making any changes to files"
        })
        .option("plex", {
            type: "boolean",
            alias: "p",
            description: "plex mode. write txt file next to audio file"
        })
        .option("migrate", {
            type: "boolean",
            alias: "m",
            description: "migrate lyrics from file into database"
        })
        .option("local", {
            type: "boolean",
            alias: "l",
            description: "not downloading lyrics"
        })
        .option("quiet", {
            type: "boolean",
            alias: "q",
            description: "quiet mode. no notifications"
        })
        .version("version", version)
        .help()
        .strict()
        .argv;
};
