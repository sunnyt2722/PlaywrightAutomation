const {test,expect} = require('@playwright/test')

test('Calender validation', async ({page})=>{
    const day = 1;
    const month = 12;
    const year = 2024;
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    await page.locator('.react-date-picker__inputGroup').click();
    await page.locator('.react-calendar__navigation__label__labelText').click();
    await page.locator('.react-calendar__navigation__label__labelText').click();
    await page.getByText(year).click();
    await page.locator('.react-calendar__year-view__months__month').nth(month-1).click();
    await page.locator("//button[not(contains(@class,'--neighboringMonth'))]//abbr[text()='"+day+"']").click();
    const inputs = await page.locator('.react-date-picker__inputGroup input');
    await page.locator('.react-date-picker__inputGroup input').nth(0);
    let value="";
    console.log("---"+inputs.length);
    for(let i =0;i<inputs.length;i++){
        console.log("---"+inputs.length);
        value = value + inputs[i].getAttribute("value")
    }
    expect(value).toEqual(month+""+day+year+"");
});