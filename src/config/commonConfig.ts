import { getSnoreToastConfig } from "~src/config/snoreToastConfig";
import { getFileConfig } from "~src/config/fileConfig";
import { getCliConfig } from "~src/config/cliConfig";

export type Config = {
    filename: string
    saveHeader: boolean
    saveTxt: boolean
    disableCache: boolean
    offline: boolean
    dryRun: boolean
    skipBackup: boolean
    quiet: boolean
    verbose: boolean
    snoreToastPath: string
}

export const getConfig = (argv: string[]): Config => {
    // Cli overrides file config
    return { ...getSnoreToastConfig(argv), ...getFileConfig(), ...getCliConfig(argv) };
};
