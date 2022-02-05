import { getCliConfig, getFileConfig } from "~src/config";

export type Config = {
    filename: string
    plex: boolean
    migrate: boolean
    dryRun: boolean
    quiet: boolean
    local: boolean
    verbose: boolean
}

export const getConfig = (argv: string[]): Config => {
    // Cli overrides file config
    return { ...getFileConfig(), ...getCliConfig(argv) };
};
