import path from "path";
import * as fs from "fs";
import { EXTENSIONS } from "~src/commonConsts";

export const getFileExtension = (fullPath: string): string => {
    return path.parse(fullPath).ext;
};

export const getPlexPath = (fullPath: string): string => {
    const { dir, name } = path.parse(fullPath);
    const plexPath: string = path.join(dir, `${name}.txt`);
    if (plexPath === fullPath) {
        throw new Error("Could not get plex path");
    }
    return plexPath;
};

export const isFileSupported = (fullPath: string): boolean => {
    return EXTENSIONS.has(getFileExtension(fullPath)?.toLowerCase());
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
    return fs.promises.writeFile(fullPath, data);
};