import * as path from "path";
import type { Config } from "~src/config";

export const getSnoreToastConfig = (argv: string[]): Pick<Config, "snoreToastPath"> => {
    const snoreToastPath = argv[0].endsWith("-lyricsify.exe") ? path.join(argv[0], "../", "snoretoast-x64.exe") : null;
    return {
        snoreToastPath
    };
};
