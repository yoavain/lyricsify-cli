import { clickElement, closePage, findElements, getBrowser, getElementText, getPageUrl, pageLoad } from "~src/puppeteerUtils";
import type { Browser, ElementHandle, Page } from "puppeteer";

jest.setTimeout(60000);

describe("Test PuppeteerUtils", () => {
    let browser: Browser;
    beforeAll(async () => {
        browser = await getBrowser();
    });
    afterAll(async () => {
        jest.restoreAllMocks();
        await browser.close();
    });

    it("Should use all utils as expected", async () => {
        let page: Page;
        try {
            console.log("pageLoad");
            page = await pageLoad("https://www.wikipedia.org/", ".central-textlogo-wrapper");

            console.log("getPageUrl");
            const pageUrl: string = getPageUrl(page);
            expect(pageUrl).toBe("https://www.wikipedia.org/");

            console.log("findElements");
            const elements: Array<ElementHandle> = await findElements(page, ".link-box");
            expect(elements.length).toBeGreaterThan(0);

            console.log("clickElement");
            await clickElement(page, elements[0], ".mw-body");

            console.log("findElements");
            const headlineElements: Array<ElementHandle> = await findElements(page, ".mw-headline");
            const headlineIds: string[] = await Promise.all(headlineElements.map((element) => {
                console.log("getElementText");
                return getElementText(element, "id");
            }));
            expect(headlineIds.filter(Boolean).length).toBeTruthy();
        }
        finally {
            console.log("closePage");
            await closePage(page);
        }
    });
});
