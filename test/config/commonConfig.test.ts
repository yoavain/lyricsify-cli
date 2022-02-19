import * as cliConfig from "~src/config/cliConfig";
import * as fileConfig from "~src/config/fileConfig";
import * as snoreToastConfig from "~src/config/snoreToastConfig";
import { getConfig } from "~src/config/commonConfig";

describe("Test common config", () => {
    it("Test getConfig", () => {
        jest.spyOn(cliConfig, "getCliConfig").mockReturnValue({
            filename: "test/config/test.mp3",
            migrate: true,
            dryRun: false
        });
        jest.spyOn(fileConfig, "getFileConfig").mockReturnValue({
            plex: false,
            migrate: false,
            dryRun: true,
            quiet: true,
            local: false,
            verbose: false
        });
        jest.spyOn(snoreToastConfig, "getSnoreToastConfig").mockReturnValue({
            snoreToastPath: "path/to/snoreToast"
        });

        expect(getConfig([])).toEqual({
            filename: "test/config/test.mp3",
            plex: false,    // default
            migrate: true,  // cli override true
            dryRun: false,  // cli override false
            quiet: true,   // default true
            local: false,
            verbose: false,
            snoreToastPath: "path/to/snoreToast"
        });
    });
});