import path from "path";
import fs from "fs";
import { backupFile, copyFile, ensureDir, fileExistsSync, getFileExtension, getFileWithAnotherExtension, getTxtFilePath, isFileSupported, pathExists, writeFile } from "~src/fileUtils";

describe("Test file utils", () => {
    describe("Test getFileExtension", () => {
        it("Should return file extension", () => {
            const fileExtension: string = getFileExtension("test.mp3");
            expect(fileExtension).toBe(".mp3");
        });
        it("Should return file extension, lower cased", () => {
            const fileExtension: string = getFileExtension("test.MP3");
            expect(fileExtension).toBe(".mp3");
        });
    });
    
    describe("Test getFileWithAnotherExtension", () => {
        it("Should return correct path", () => {
            const txtFilePath: string = getFileWithAnotherExtension("/path/to/test.mp3", ".other");
            expect(txtFilePath).toBe(path.join("/path/to/test.other"));
        });
        it("Should throw on invalid input", () => {
            try {
                getFileWithAnotherExtension("/path/to/test.txt", ".txt");
                fail();
            }
            catch (e) {
                // pass
            }
        });
    });
    
    describe("Test getTxtFilePath", () => {
        it("Should return correct path", () => {
            const txtFilePath: string = getTxtFilePath("/path/to/test.mp3");
            expect(txtFilePath).toBe(path.join("/path/to/test.txt"));
        });
        it("Should throw on invalid input", () => {
            try {
                getTxtFilePath("/path/to/test.txt");
                fail();
            }
            catch (e) {
                // pass
            }
        });
    });

    describe("Test isFileSupported", () => {
        it("Should return true for supported file", () => {
            const isSupported: boolean = isFileSupported("/path/to/test.mp3");
            expect(isSupported).toBe(true);
        });
        it("Should return false for unsupported file", () => {
            const isSupported: boolean = isFileSupported("/path/to/test.txt");
            expect(isSupported).toBe(false);
        });
    });

    describe("Test fileExistsSync", () => {
        it("Should return true for existing file", () => {
            jest.spyOn(fs, "existsSync").mockImplementation(() => true);
            const exists: boolean = fileExistsSync("/path/to/test.mp3");
            expect(exists).toBe(true);
        });
        it("Should return false for non existing file", () => {
            jest.spyOn(fs, "existsSync").mockImplementation(() => {
                throw new Error("File not found");
            });
            const exists: boolean = fileExistsSync("/path/to/test.mp3");
            expect(exists).toBe(false);
        });
    });

    describe("Test writeFile", () => {
        it("Should call fs.promises.writeFile correctly", async () => {
            jest.spyOn(fs.promises, "writeFile").mockImplementation(async () => {/* do nothing */});

            await writeFile("/path/to/test.txt", "Data");
            expect(fs.promises.writeFile).toHaveBeenCalledWith("/path/to/test.txt", "Data", { encoding: "utf8" });
        });
    });

    describe("Test copyFile", () => {
        it("Should call fs.promises.copyFile correctly", async () => {
            jest.spyOn(fs.promises, "copyFile").mockImplementation(async () => {/* do nothing */});

            await copyFile("/path/to/src.txt", "/path/to/dest.txt");
            expect(fs.promises.copyFile).toHaveBeenCalledWith("/path/to/src.txt", "/path/to/dest.txt");
        });
    });

    describe("Test backupFile", () => {
        it("Should call copyFile , when file doesn't exist", async () => {
            jest.spyOn(fs, "existsSync").mockImplementation(() => false);
            jest.spyOn(fs.promises, "copyFile").mockImplementation(async () => {/* do nothing */});

            await backupFile("/path/to/test.mp3");
            expect(fs.promises.copyFile).toHaveBeenCalledWith("/path/to/test.mp3", path.join("/path/to/test.bak"));
        });
        it("Should not call copyFile , when file exists", async () => {
            jest.spyOn(fs, "existsSync").mockImplementation(() => true);
            jest.spyOn(fs.promises, "copyFile").mockImplementation(async () => {/* do nothing */});

            await backupFile("/path/to/test.mp3");
            expect(fs.promises.copyFile).not.toHaveBeenCalled();
        });
    });
    
    describe("Test ensureDir", () => {
        it("Should call mkdir correctly", async () => {
            jest.spyOn(fs.promises, "mkdir").mockImplementation(async () => "");

            await ensureDir("/path/to/test.mp3");

            expect(fs.promises.mkdir).toHaveBeenCalledWith("/path/to/test.mp3", { recursive: true });
        });
    });
    describe("Test pathExists", () => {
        it("Should return true when fs.access resolves", async () => {
            jest.spyOn(fs.promises, "access").mockImplementation(async () => {/* do nothing */});

            const isPathExists = await pathExists("/path/to/test.mp3");

            expect(isPathExists).toBeTruthy();
            expect(fs.promises.access).toHaveBeenCalledWith("/path/to/test.mp3");
        });
        it("Should return false when fs.access rejects", async () => {
            jest.spyOn(fs.promises, "access").mockImplementation(async () => {
                throw new Error("File not found");
            });

            const isPathExists = await pathExists("/path/to/test.mp3");

            expect(isPathExists).toBeFalsy();
            expect(fs.promises.access).toHaveBeenCalledWith("/path/to/test.mp3");
        });
    });
});