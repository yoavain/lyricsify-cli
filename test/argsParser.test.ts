import type { ArgsParserInterface } from "~src/argsParser";
import { ArgsParser } from "~src/argsParser";

const INPUT = "input";
const QUIET = "quiet";

const NODE = "node.exe";
const SCRIPT = "index.js";
const RUNTIME = "lyricsify.exe";
const MKV = "some-file.mkv";

describe("test parse", () => {
    beforeAll(() => {
        //
    });

    it("test legacy", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([NODE, SCRIPT, MKV]);
        expect(argsParser.getInput()).toEqual(MKV);
        expect(argsParser.isQuiet()).toEqual(false);
    });
    it("test legacy - runtime", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([RUNTIME, MKV]);
        expect(argsParser.getInput()).toEqual(MKV);
        expect(argsParser.isQuiet()).toEqual(false);
    });
    it("test input", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([NODE, SCRIPT, INPUT, MKV]);
        expect(argsParser.getInput()).toEqual(MKV);
        expect(argsParser.isQuiet()).toEqual(false);
    });
    it("test input - runtime", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([RUNTIME, INPUT, MKV]);
        expect(argsParser.getInput()).toEqual(MKV);
        expect(argsParser.isQuiet()).toEqual(false);
    });
    it("test input quiet", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([NODE, SCRIPT, INPUT, MKV, QUIET]);
        expect(argsParser.getInput()).toEqual(MKV);
        expect(argsParser.isQuiet()).toEqual(true);
    });
    it("test input quiet - runtime", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([RUNTIME, INPUT, MKV, QUIET]);
        expect(argsParser.getInput()).toEqual(MKV);
        expect(argsParser.isQuiet()).toEqual(true);
    });
    it("test error - no args", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([RUNTIME]);
        expect(argsParser.getInput()).toBe(undefined);
    });
    it("test error - only quiet", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([RUNTIME, QUIET]);
        expect(argsParser.getInput()).toBe(undefined);
    });
    it("test error - only input", () => {
        const argsParser: ArgsParserInterface = new ArgsParser([RUNTIME, INPUT]);
        expect(argsParser.getInput()).toBe(undefined);
    });
});
