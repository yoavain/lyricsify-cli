import { getCliConfig } from "~src/config/cliConfig";
import { getFileConfig } from "~src/config/fileConfig";

export type Config = {
    plex: boolean
    migrate: boolean
    dryRun: boolean
    quiet: boolean
    local: boolean
    verbose: boolean
    filename: string
}

export const getConfig = (argv: string[]): Config => {
    // Cli overrides file config
    return { ...getFileConfig(), ...getCliConfig(argv) };
};
