import { sleep } from "~src/utils";

describe("Test utils", () => {
    it("Should resolve", async () => {
        await sleep(200);
    });
});
