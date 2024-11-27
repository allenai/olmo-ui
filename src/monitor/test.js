const puppeteer = require('puppeteer')

(async () => {

    const browser = await puppeteer.launch({ headless: 'new', timeout: 0 });
    const page = await browser.newPage();

    // Navigate to the target URL
    const result = await page.goto('https://playground.allenai.org', { waitUntil: 'load' });

    // Confirm successful navigation
    await assert.equal(result.status(), 200);

    // Print the page title to the console
    const title = await page.title();
    logger.info(`My Page title: ${title} ` + executionId);
    
    const proudlyBuiltText = await page.waitForSelector('::p-aria([name="Return to the Playground home page"][role="link"])', 10000);
})