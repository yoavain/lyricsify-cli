import { getBrowser } from "~src/puppeteerUtils";
import type { Browser, Page } from "puppeteer";

jest.setTimeout(60000);

describe("Test Puppeteer on GitHub actions", () => {
    let browser: Browser;
    beforeAll(async () => {
        browser = await getBrowser();
    });
    afterAll(async () => {
        jest.restoreAllMocks();
        await browser.close();
    });

    it("should get page", async () => {
        let page: Page;
        try {
            // Open search page
            const browser: Browser = await getBrowser();
            page = await browser.newPage();
            await Promise.all([
                page.goto("https://shironet.mako.co.il"),
                page.waitForSelector(".header_main_bg")
            ]);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
        finally {
            if (page) {
                await page.close();
            }
        }
    });
});
