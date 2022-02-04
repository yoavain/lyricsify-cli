import type { CliConfig } from "~src/config";
import { getCliConfig } from "~src/config";

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
        expect(fileConfig.dryRun).not.toBeDefined();
        expect(fileConfig.migrate).not.toBeDefined();
        expect(fileConfig.local).not.toBeDefined();
        expect(fileConfig.verbose).not.toBeDefined();
        expect(fileConfig.quiet).not.toBeDefined();
    });
    it("test dry-run", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--dry-run"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.dryRun).toBeTruthy();
    });
    it("test plex", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--plex"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.plex).toBeTruthy();
    });
    it("test migrate", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--migrate"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.migrate).toBeTruthy();
    });
    it("test local", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--local"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.local).toBeTruthy();
    });
    it("test verbose", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--verbose"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.verbose).toBeTruthy();
    });
    it("test quiet", () => {
        const fileConfig: CliConfig = getCliConfig(mockCmdArgs(["file.mp3", "--quiet"]));
        expect(fileConfig.filename).toEqual("file.mp3");
        expect(fileConfig.quiet).toBeTruthy();
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
