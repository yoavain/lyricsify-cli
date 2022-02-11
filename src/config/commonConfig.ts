import { getCliConfig, getFileConfig, getSnoreToastConfig } from "~src/config";

export type Config = {
    filename: string
    plex: boolean
    migrate: boolean
    dryRun: boolean
    quiet: boolean
    local: boolean
    verbose: boolean
    snoreToastPath: string
}

export const getConfig = (argv: string[]): Config => {
    // Cli overrides file config
    return { ...getSnoreToastConfig(argv), ...getFileConfig(), ...getCliConfig(argv) };
};
