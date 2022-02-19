import path from "path";
import * as fs from "fs";
import { EXTENSIONS } from "~src/commonConsts";
import type { SupportedFileExtension } from "~src/filetypes/types";
import { ErrorMessages } from "~src/errors";

export const getFileExtension = (fullPath: string): string => {
    return path.parse(fullPath).ext?.toLowerCase();
};

export const getFileWithAnotherExtension = (fullPath: string, ext: string): string => {
    const { dir, name } = path.parse(fullPath);
    const newFile: string = path.join(dir, `${name}${ext}`);
    if (newFile === path.join(fullPath)) {
        throw new Error(`${ErrorMessages.ERROR_INCORRECT_INPUT}. fullPath: ${fullPath}, ext: ${ext}`);
    }
    return newFile;
};

export const getPlexPath = (fullPath: string): string => {
    try {
        return getFileWithAnotherExtension(fullPath, ".txt");
    }
    catch (e) {
        throw new Error(ErrorMessages.ERROR_COULD_NOT_GET_PLEX_PATH);
    }
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

export const copyFile = async (srcFullPath: string, destFullPath: string): Promise<void> => {
    return fs.promises.copyFile(srcFullPath, destFullPath);
};

export const backupFile = async (fullPath: string): Promise<void> => {
    const backupFile: string = getFileWithAnotherExtension(fullPath, ".bak");
    if (fileExistsSync(backupFile)) {
        // Backup file already exists - assuming it's ours...
        return;
    }
    else {
        await copyFile(fullPath, backupFile);
    }
};

export const ensureDir = async (fullPath: string): Promise<string> => {
    return fs.promises.mkdir(fullPath, { recursive: true });  // Make sure the log directory is there
};

export const pathExists = (fullPath: string): Promise<boolean> => {
    return fs.promises.access(fullPath).then(() => true).catch(() => false);
};