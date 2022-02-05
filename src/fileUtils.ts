import path from "path";
import * as fs from "fs";
import { EXTENSIONS } from "~src/commonConsts";
import type { SupportedFileExtension } from "~src/filetypes";

export const getFileExtension = (fullPath: string): string => {
    return path.parse(fullPath).ext?.toLowerCase();
};

export const getPlexPath = (fullPath: string): string => {
    const { dir, name } = path.parse(fullPath);
    const plexPath: string = path.join(dir, `${name}.txt`);
    if (plexPath === path.join(fullPath)) {
        throw new Error("Could not get plex path");
    }
    return plexPath;
};

export const isFileSupported = (fullPath: string): boolean => {
    return EXTENSIONS.has(getFileExtension(fullPath) as SupportedFileExtension);
};

export const fileExistsSync = (fullPath: string): boolean => {
    try {
        return fs.existsSync(fullPath);
    }
    catch (err) {
        return false;
    }
};

export const writeFile = async (fullPath: string, data: string): Promise<void> => {
    return fs.promises.writeFile(fullPath, data, { encoding: "utf8" });
};