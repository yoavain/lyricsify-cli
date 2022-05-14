import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Config } from "~src/config/commonConfig";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

export type CliConfig = Pick<Config, "filename"> & Partial<Omit<Config, "snoreToastPath">>;

export const getCliConfig = (argv: string[]): CliConfig => {
    return yargs(hideBin(argv))
        .command<CliConfig>("* <filename>", "",
            (yargs) => {
                yargs.positional("filename", {
                    describe: "file or folder to handle",
                    type: "string"
                });
            })
        .option("save-header", {
            type: "boolean",
            alias: "s",
            description: "save lyrics in file header"
        })
        .option("save-txt", {
            type: "boolean",
            alias: "t",
            description: "save lyrics to a txt file"
        })
        .option("disable-cache", {
            type: "boolean",
            alias: "p",
            description: "do not cache lyrics"
        })
        .option("offline", {
            type: "boolean",
            alias: "l",
            description: "do not download lyrics"
        })
        .option("dry-run", {
            type: "boolean",
            alias: "d",
            description: "not making any changes to files"
        })
        .option("skip-backup", {
            type: "boolean",
            alias: "x",
            description: "do not backup original file"
        })
        .option("quiet", {
            type: "boolean",
            alias: "q",
            description: "disable notifications"
        })
        .option("verbose", {
            alias: "v",
            type: "boolean",
            description: "print additional logs"
        })
        .version("version", version)
        .help()
        .strict()
        .argv as CliConfig;
};
