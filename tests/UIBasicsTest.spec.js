const {test, expect} = require('@playwright/test');


test('This is my first test',async ({page}) =>{
    await page.goto("https://google.com/");
    // Get title and put assertion
    await expect(page).toHaveTitle('Google');
});


test('Browser context',async ({browser}) =>{
    // Chrome - Plugins/cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    const usernameInput = page.locator('[id="username"]');
    const productName = page.locator('.card-body a');
    const documentLink = page.locator("[href*='documents-request']");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await usernameInput.fill("rahulshetty");
    await page.locator('#password').fill("learning");
    await expect(documentLink).toHaveAttribute('class','blinkingText');
    await page.locator('[name="signin"]').click();
    console.log("-----"+await page.locator('[style*="block"]').textContent());
    expect(await page.locator('[style*="block"]')).toContainText('Incorrect username/password.');
    await usernameInput.fill("rahulshettyacademy");
    await page.locator('[name="signin"]').click();
    console.log(await productName.first().textContent());
    console.log(await productName.nth(2).textContent());
    const allProductNames = await productName.allTextContents();
    console.log(allProductNames);
});


test.only('Child Window handler', async ({browser}) =>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([
    context.waitForEvent('page'), //Listen for new page to open -> Promise Pending, Promise Rejected, Promise fulfilled
    documentLink.click()]); //New page is opened

    const textOfNewPage = await newPage.locator('.red').textContent();
    console.log("------"+textOfNewPage);
    const arrText = textOfNewPage.split("@")[1].split(" ")[0];
    console.log("Domain name is "+arrText);
    await page.locator('[id="username"]').fill(arrText);
    await page.pause();
    console.log(await page.locator('[id="username"]').textContent())
});

test.only('Record and play', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await page.getByRole('button', { name: 'Accept all' }).click();
  await page.getByLabel('Search', { exact: true }).click();
  await page.getByLabel('Search', { exact: true }).fill('Sunny Kumar Publicis');
  await page.getByRole('button', { name: 'Not now' }).click();
  await page.getByRole('link', { name: 'Sunny Kumar - Publicis Sapient LinkedIn · Sunny Kumar 300+ followers' }).click();
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await page.getByRole('link', { name: 'LinkedIn', exact: true }).click();
});

