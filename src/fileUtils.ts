import path from "path";
import { EXTENSIONS } from "~src/commonConsts";

export const getFileExtension = (fullPath: string): string => {
    const ext: string = path.extname(fullPath);
    return ext?.length > 1 && ext.startsWith(".") ? ext.substring(1) : undefined;
};

export const isFileSupported = (fullPath: string): boolean => {
    return EXTENSIONS.has(getFileExtension(fullPath)?.toLowerCase());
};