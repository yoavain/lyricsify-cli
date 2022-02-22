import type { CliConfig } from "~src/config/cliConfig";
import { getCliConfig } from "~src/config/cliConfig";

const mockCmdArgs = (args: string[]): string[] => {
    return ["node.exe", "script.js", ...args];
};

describe("test parse", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("test filename with defaults", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.saveHeader).not.toBeDefined();
        expect(fileConfig.saveTxt).not.toBeDefined();
        expect(fileConfig.disableCache).not.toBeDefined();
        expect(fileConfig.offline).not.toBeDefined();
        expect(fileConfig.dryRun).not.toBeDefined();
        expect(fileConfig.skipBackup).not.toBeDefined();
        expect(fileConfig.quiet).not.toBeDefined();
        expect(fileConfig.verbose).not.toBeDefined();
    });
    it("test save-header", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--save-header"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.saveHeader).toBeTruthy();
    });
    it("test save-txt", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--save-txt"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.saveTxt).toBeTruthy();
    });
    it("test disable-cache", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--disable-cache"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.disableCache).toBeTruthy();
    });
    it("test offline", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--offline"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.offline).toBeTruthy();
    });
    it("test dry-run", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--dry-run"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.dryRun).toBeTruthy();
    });
    it("test skip-backup", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--skip-backup"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.skipBackup).toBeTruthy();
    });
    it("test quiet", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--quiet"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.quiet).toBeTruthy();
    });
    it("test verbose", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--verbose"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.verbose).toBeTruthy();
    });

    it("test error", () => {
        // @ts-ignore
        const mockExit = jest.spyOn(process, "exit").mockImplementation(() => { /* do nothing */ });
        const mockError = jest.spyOn(console, "error");
        getCliConfig(mockCmdArgs([]));
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockError.mock.calls[2][0]).toEqual("Not enough non-option arguments: got 0, need at least 1");
    });
});
