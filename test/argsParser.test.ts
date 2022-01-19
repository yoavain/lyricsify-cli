import type { Args } from "~src/argsParser";
import { parseArgs } from "~src/argsParser";

const mockCmdArgs = (args: string[]): string[] => {
    return ["node.exe", "script.js", ...args];
};

describe("test parse", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("test filename with defaults", () => {
        const args: Args = parseArgs(mockCmdArgs(["file.mp3"]));
        expect(args.filename).toEqual("file.mp3");
        expect(args.dryRun).toBeFalsy();
        expect(args.verbose).toBeFalsy();
        expect(args.quiet).toBeFalsy();
    });
    it("test dry-run", () => {
        const args: Args = parseArgs(mockCmdArgs(["file.mp3", "--dry-run"]));
        expect(args.filename).toEqual("file.mp3");
        expect(args.dryRun).toBeTruthy();
    });
    it("test verbose", () => {
        const args: Args = parseArgs(mockCmdArgs(["file.mp3", "--verbose"]));
        expect(args.filename).toEqual("file.mp3");
        expect(args.verbose).toBeTruthy();
    });
    it("test quiet", () => {
        const args: Args = parseArgs(mockCmdArgs(["file.mp3", "--quiet"]));
        expect(args.filename).toEqual("file.mp3");
        expect(args.quiet).toBeTruthy();
    });

    it("test error", () => {
        // @ts-ignore
        const mockExit = jest.spyOn(process, "exit").mockImplementation(() => { /* do nothing */ });
        const mockError = jest.spyOn(console, "error");
        parseArgs(mockCmdArgs([]));
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockError.mock.calls[2][0]).toEqual("Not enough non-option arguments: got 0, need at least 1");
    });
});
