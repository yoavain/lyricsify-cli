import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";

let browserInstance: Browser;
export const getBrowser = async (): Promise<Browser> => {
    if (!browserInstance) {
        const browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        if (!browserInstance) {
            browserInstance = browser;
        }
    }
    return browserInstance;
};

process.on("exit", async () => {
    await browserInstance?.close();
    browserInstance = null;
});
