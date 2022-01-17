import * as fs from "fs";
import * as fsextra from "fs-extra";
import type { LoggerInterface } from "~src/logger";

interface ConfigurationInterface {
    logLevel: string;
    extensions: string[];
}

const defaultExtensions: string[] = ["mp3", "flac"];
const defaultConf: ConfigurationInterface = { logLevel: "debug", extensions: defaultExtensions };

export interface ConfigInterface {
    getLogLevel: () => string;
    getExtensions: () => string[];
}

export class Config implements ConfigInterface {
    private readonly logLevel: string;
    private readonly logger: LoggerInterface;
    private readonly extensions: string[];

    constructor(confFile: string, logger: LoggerInterface) {
        this.logger = logger;
        if (!fs.existsSync(confFile)) {
            fsextra.outputJsonSync(confFile, defaultConf);
        }
        let conf: ConfigurationInterface;
        try {
            conf = fsextra.readJsonSync(confFile);
        }
        catch (e) {
            this.logger.error("Configuration file corrupted. Using default.");
            conf = defaultConf;
        }
        this.logLevel = conf?.logLevel;
        this.logger.debug(`LogLevel ${this.logLevel}`);
        this.extensions = conf?.extensions ?? defaultExtensions;
    }

    public getLogLevel = (): string => {
        return this.logLevel;
    };

    public getExtensions = (): string[] => {
        return this.extensions;
    };
}
