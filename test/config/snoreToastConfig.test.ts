import type { SnoreToastConfig } from "~src/config/snoreToastConfig";
import { getSnoreToastConfig } from "~src/config/snoreToastConfig";

describe("test parse snoreToastConfig", () => {
    it("test dev run", () => {
        const snoreToastConfig: SnoreToastConfig = getSnoreToastConfig(["node.exe", "script.js", "file.mp3"]);
        expect(snoreToastConfig.snoreToastPath).toBeNull();
    });
    it("test prod run", () => {
        const snoreToastConfig: SnoreToastConfig = getSnoreToastConfig(["lyricsify.exe", "file.mp3"]);
        expect(snoreToastConfig.snoreToastPath).toEqual("snoretoast-x64.exe");
    });
});
