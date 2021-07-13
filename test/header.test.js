const puppeteer = require("puppeteer");
let browser, page;
beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
});

afterEach(() => {
    browser.close();
});

test("Test Logo text", async () => {
    expect(await page.$eval('a.brand-logo', el => el.innerHTML)).toEqual("Blogster");
});

test("Clicking logo send us to oauth", async () => {
    await page.click('.right a');
    expect(page.url()).toMatch(/accounts\.google\.com/);
});
