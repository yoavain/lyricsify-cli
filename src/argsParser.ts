import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

export type Args = {
    filename: string
    verbose: boolean
    dryRun: boolean
    quiet: boolean
    snoreToastPath: string
}

export const parseArgs = (argv: string[]): Args => {
    return yargs(hideBin(argv))
        .command<Args>("* <filename>", "filename",
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
        .version("version", version)
        .help()
        .strict()
        .argv;
};
