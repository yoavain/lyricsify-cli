const { MockLogger } = require("./__mocks__/logger");
const { MockNotifier } = require("./__mocks__/notifier");

import * as config from "~src/config/commonConfig";
import * as logic from "~src/logic";
import * as fileUtils from "~src/fileUtils";
import type { Config } from "~src/config/commonConfig";
import { NotificationType } from "~src/notifier";
import { main } from "~src/main";
import type { Stats } from "fs";
import fs from "fs";

const mockLogger = new MockLogger();
jest.mock("~src/logger", () => ({
    Logger: function() {
        return mockLogger;
    }
}));

const mockNotifier = new MockNotifier();
jest.mock("~src/notifier", () => ({
    Notifier: function() {
        return mockNotifier;
    },
    NotificationText: {
        MISSING_INPUT_FILE: "Missing input file"
    },
    NotificationType: {
        LOGO: "LOGO",
        DOWNLOAD: "DOWNLOAD",
        WARNING: "WARNING",
        NOT_FOUND: "NOT_FOUND",
        FAILED: "FAILED"
    }
}));

const commonConfig: Omit<Config, "filename"> = {
    plex: false,
    migrate: false,
    dryRun: false,
    quiet: false,
    local: false,
    verbose: false,
    snoreToastPath: "path/to/snoretoast"
};

describe("test main", () => {
    beforeEach(() => {
        //
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should should call handleFolder, when input is a folder", async () => {
        const conf: Config = { filename: "/path/to/folder", ...commonConfig };
        jest.spyOn(config, "getConfig").mockReturnValue(conf);
        jest.spyOn(fileUtils, "ensureDir").mockResolvedValue("");
        jest.spyOn(fs, "lstatSync").mockReturnValue({ isDirectory: () => true } as Stats);
        jest.spyOn(logic, "handleFolder").mockResolvedValue(null);
        jest.spyOn(logic, "handleFile").mockResolvedValue(null);

        await main();

        expect(logic.handleFolder).toHaveBeenCalledWith("/path/to/folder", conf, mockLogger, mockNotifier);
        expect(logic.handleFile).not.toHaveBeenCalled();
    });
    it("should should call handleFile, when input is a file", async () => {
        const conf: Config = { filename: "/path/to/file.mp3", ...commonConfig };
        jest.spyOn(config, "getConfig").mockReturnValue(conf);
        jest.spyOn(fileUtils, "ensureDir").mockResolvedValue("");
        jest.spyOn(fileUtils, "isFileSupported").mockReturnValue(true);
        jest.spyOn(fs, "lstatSync").mockReturnValue({ isDirectory: () => false } as Stats);
        jest.spyOn(logic, "handleFolder").mockResolvedValue(null);
        jest.spyOn(logic, "handleFile").mockResolvedValue(null);

        await main();

        expect(logic.handleFile).toHaveBeenCalledWith("/path/to/file.mp3", conf, mockLogger, mockNotifier);
        expect(logic.handleFolder).not.toHaveBeenCalled();
    });
    it("should notify an error when file is not a string", async () => {
        const conf: Config = { filename: null, ...commonConfig };
        jest.spyOn(config, "getConfig").mockReturnValue(conf);
        jest.spyOn(fileUtils, "ensureDir").mockResolvedValue("");
        jest.spyOn(fileUtils, "isFileSupported").mockReturnValue(true);
        jest.spyOn(fs, "lstatSync").mockReturnValue({ isDirectory: () => false } as Stats);
        jest.spyOn(logic, "handleFolder").mockResolvedValue(null);
        jest.spyOn(logic, "handleFile").mockResolvedValue(null);

        await main();

        expect(logic.handleFile).not.toHaveBeenCalled();
        expect(logic.handleFolder).not.toHaveBeenCalled();
        expect(mockNotifier.notif).toHaveBeenCalledWith("Missing input file", NotificationType.FAILED);
    });
    it("should log an error on failure", async () => {
        const conf: Config = { filename: "/path/to/file.mp3", ...commonConfig };
        jest.spyOn(config, "getConfig").mockReturnValue(conf);
        jest.spyOn(fileUtils, "ensureDir").mockResolvedValue("");
        jest.spyOn(fileUtils, "isFileSupported").mockReturnValue(true);
        jest.spyOn(fs, "lstatSync").mockReturnValue({ isDirectory: () => false } as Stats);
        jest.spyOn(logic, "handleFile").mockRejectedValue({ error: "something went wrong" });

        try {
            await main();
            fail();
        }
        catch (e) {
            expect(mockLogger.error).toHaveBeenCalledWith("Cannot handle /path/to/file.mp3");
        }
    });
});