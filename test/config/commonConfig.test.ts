import * as cliConfig from "~src/config/cliConfig";
import * as fileConfig from "~src/config/fileConfig";
import * as snoreToastConfig from "~src/config/snoreToastConfig";
import { getConfig } from "~src/config/commonConfig";

describe("Test common config", () => {
    it("Test getConfig", () => {
        jest.spyOn(cliConfig, "getCliConfig").mockReturnValue({
            filename: "test/config/test.mp3",
            disableCache: true,
            dryRun: false
        });
        jest.spyOn(fileConfig, "getFileConfig").mockReturnValue({
            saveHeader: false,
            saveTxt: false,
            disableCache: false,
            offline: false,
            dryRun: true,
            skipBackup: false,
            quiet: true,
            verbose: false
        });
        jest.spyOn(snoreToastConfig, "getSnoreToastConfig").mockReturnValue({
            snoreToastPath: "path/to/snoreToast"
        });

        expect(getConfig([])).toEqual({
            filename: "test/config/test.mp3",
            saveHeader: false,  // default
            saveTxt: false,     // default
            disableCache: true, // cli override true
            offline: false,
            dryRun: false,      // cli override false
            skipBackup: false,
            quiet: true,        // default true
            verbose: false,
            snoreToastPath: "path/to/snoreToast"
        });
    });
});