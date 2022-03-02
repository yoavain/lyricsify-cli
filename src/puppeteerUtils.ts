import type { Browser, ElementHandle, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { disableHeadless } from "~src/config/fileConfig";

let browserInstance: Browser;
export const getBrowser = async (headless = true): Promise<Browser> => {
    if (!browserInstance) {
        const browser = await puppeteer.launch({
            headless: headless,
            ignoreHTTPSErrors: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        if (!browserInstance) {
            browserInstance = browser;
        }
        else {
            // in case of a race condition
            await browser.close();
        }
    }
    return browserInstance;
};

export const pageLoad = async (songSearchUrl: string, selector: string): Promise<Page> => {
    const browser: Browser = await getBrowser(!disableHeadless);
    const page: Page = await browser.newPage();
    await Promise.all([
        page.goto(songSearchUrl),
        page.waitForSelector(selector)
    ]);
    return page;
};

export const findElements = async (page: Page, selector: string): Promise<Array<ElementHandle>> => {
    return await page.$$(selector);
};

export const getElementText = async (element: ElementHandle, propertyName: string): Promise<string> => {
    return (await element.getProperty(propertyName))._remoteObject?.value?.trim();
};

export const clickElement = async (page: Page, element: ElementHandle, selector: string): Promise<void> => {
    await element.click();
    await page.waitForSelector(selector);
};

export const getPageUrl = (page: Page): string => {
    return page.url();
};

export const closePage = async (page: Page): Promise<void> => {
    await page.close();
};

/**
 * This makes sure we clean up the browser instance when we're done
 */
process.on("exit", 
    /* istanbul ignore next */
    async () => {
        if (browserInstance) {
            await browserInstance.close();
            browserInstance = null;
        }
    });
