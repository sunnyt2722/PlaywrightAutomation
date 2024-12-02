const {test,expect} = require('@playwright/test')

test('Validation one', async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("https:google.com/");
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.pause();
    page.on("dialog",dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
});

test('Frames test', async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
    const numberOfSubscribers = await framePage.locator('.text h2').textContent();
    console.log("----"+numberOfSubscribers);
});


test('Screenshot', async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await page.screenshot({path:"screenshot.png"});
    await page.locator("#mousehover").screenshot({path:"screenshot1.png"});
    await page.locator("#mousehover").hover();
});


test.only('Visual comparison', async ({page})=>{
    await page.goto("https://google.com/");
    await page.screenshot({path:"screenshot.png"});
    expect(await page.screenshot()).toMatchSnapshot("screenshot.png");
});

