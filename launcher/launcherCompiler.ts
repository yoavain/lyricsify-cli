/* eslint-disable no-process-exit */
import * as path from "path";
import spawn from "cross-spawn";
import type { SpawnSyncReturns } from "child_process";
import { pathExists } from "~src/fileUtils";

const COMPILER = "msbuild.exe";

export const checkMsbuildInPath = async (exit?: boolean): Promise<boolean> => {
    // Check for compiler in %PATH%
    const promises = process.env.path.split(";").map((p) => pathExists(path.resolve(p, COMPILER)));
    const results: boolean[] = await Promise.all(promises);
    const compilerFound: boolean = results.find((result) => !!result);

    if (exit && !compilerFound) {
        console.error(`You need "${COMPILER}" in your %PATH% in order to compile the launcher executable.`);
        process.exit(1);
    }
    else {
        return compilerFound;
    }
};

export const compileLauncher = async (): Promise<void> => {
    const args: string[] = ["./launcher/launcher.csproj"];

    const spawnResult: SpawnSyncReturns<Buffer> = spawn.sync(COMPILER, args, { stdio: "inherit" });
    if (spawnResult.status !== 0) {
        return Promise.reject({ command: `${COMPILER} ${args.join(" ")}` });
    }
};
