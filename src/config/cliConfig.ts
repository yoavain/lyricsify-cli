import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Config } from "~src/config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

export const getCliConfig = (argv: string[]): Config => {
    return yargs(hideBin(argv))
        .command<Config>("* <filename>", "filename",
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
            description: "dry-run"
        })
        .option("plex-mode", {
            type: "boolean",
            alias: "p",
            description: "plex-mode"
        })
        .option("migrate", {
            type: "boolean",
            alias: "m",
            description: "migrate"
        })
        .option("local", {
            type: "boolean",
            alias: "l",
            description: "local"
        })
        .option("quiet", {
            type: "boolean",
            alias: "q",
            description: "quiet"
        })
        .version("version", version)
        .help()
        .strict()
        .argv;
};
