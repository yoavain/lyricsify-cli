import { exec } from "child_process";

jest.setTimeout(15000);

const HOSTNAME = "shironet.mako.co.il";

const pingHost = (target: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        exec(`ping ${target}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}: ${stderr}`);
                reject(error);
            }
            console.log(`stdout: ${stdout}`);
            resolve();
        });

    });
};

describe("Test ping to Shironet", () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should ping Shironet", async () => {
        await pingHost(HOSTNAME);
    });
});
