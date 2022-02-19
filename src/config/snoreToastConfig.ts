import * as path from "path";
import type { Config } from "~src/config/commonConfig";

export type SnoreToastConfig = Pick<Config, "snoreToastPath">;

export const getSnoreToastConfig = (argv: string[]): SnoreToastConfig => {
    const snoreToastPath = argv[0] === "lyricsify.exe" ? path.join(argv[0], "../", "snoretoast-x64.exe") : null;
    return {
        snoreToastPath
    };
};
