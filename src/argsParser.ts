import * as path from "path";

const INPUT = "input";
const QUIET = "quiet";

export interface ArgsParserInterface {
    getInput: () => string;
    isQuiet: () => boolean;
    getSnoreToastPath: () => string;
    getHelp: () => string;
}

export class ArgsParser implements ArgsParserInterface {
    private readonly input: string;
    private readonly quiet: boolean;
    private readonly snoreToastPath: string;

    constructor(argv: string[]) {
        if (argv.length >= 2 && (argv[argv.length - 2].endsWith(".exe") || argv[argv.length - 2].endsWith(".js")) && ![INPUT, QUIET].includes(argv[argv.length - 1])) {
            this.input = argv[argv.length - 1];
        }
        else {
            const indexOfInput: number = argv.indexOf(INPUT);
            if (indexOfInput >= 0 && indexOfInput + 1 < argv.length) {
                this.input = argv[indexOfInput + 1];
            }
            this.quiet = argv.indexOf(QUIET) >= 0;
        }
        this.snoreToastPath = argv[0].endsWith("-downloader.exe") ? path.join(argv[0], "../", "snoretoast-x64.exe") : null;
    }

    public getInput = (): string => {
        return this.input;
    };

    public isQuiet = (): boolean => {
        return !!this.quiet;
    };

    public getSnoreToastPath(): string {
        return this.snoreToastPath;
    }

    public getHelp = (): string => {
        return `\nOptions:\n\t${INPUT}\tinput file\n\t${QUIET}\tquiet mode (no notifications)\n`;
    };
}
