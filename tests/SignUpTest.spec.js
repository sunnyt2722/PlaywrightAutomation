const {test,expect} = require('@playwright/test')

test("This is my test for sign up", async ({browser})=>{
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('.text-reset').click();
    const firstNameInput = await page.locator('#firstName');
    const lastNameInput= page.locator('#lastName');
    const emailInput= page.locator('#userEmail');
    const phoneNumberInput= page.locator('#userMobile');
    const occupationSelect= page.locator('[formcontrolname="occupation"]');
    const maleRadio= page.locator('[value="Male"]');
    const passwordInput= page.locator('#userPassword');
    const confirmPasswordInput= page.locator('#confirmPassword');
    const above18Checkbox= page.locator('[formcontrolname="required"]');
    const registerButton= page.locator('[value="Register"]');
    
    await firstNameInput.fill('Sunny');
    await lastNameInput.fill('Kumar');
    await emailInput.fill('test@account.com');
    await phoneNumberInput.fill('9978789865');
    await occupationSelect.selectOption('Doctor');
    await maleRadio.click();
    await passwordInput.fill('Test@my.password');
    await confirmPasswordInput.fill('Test@my.password');
    await above18Checkbox.click();
    await registerButton.click();
    await page.pause();
})

test('This is login test', async ({browser}) => {
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    page.goto('https://rahulshettyacademy.com/client/');

    await page.locator('#userEmail').fill('sunnykumar@leaning.com');
    await page.locator('#userPassword').fill('Test@123');
    await page.pause();
    await page.locator('[value="Login"]').click();
    const productName = page.locator('h5');
    await page.waitForLoadState('networkidle');
    console.log(await productName.allTextContents());
    await page.pause();
});

test.only('Client App login ', async ({page}) => {
    page.goto('https://rahulshettyacademy.com/client/');
    const product = "ZARA COAT 3";
    await page.locator('#userEmail').fill('sunnykumar@leaning.com');
    await page.locator('#userPassword').fill('Test@123');
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    const cartHeader = page.locator('[routerlink*="cart"]');
    const orderHeader = page.locator('button[routerlink*="myorders"]');
    const titles = await page.locator(".card-body b").allTextContents();
    console.log("----"+titles);
    const products = await page.locator(".card-body");
    const count = await products.count();
    console.log("products.count()::"+count);
    for(let i=0;i<count;i++){
        if(await products.nth(i).locator('b').textContent() === product){
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await cartHeader.click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('"+product+"')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator('text = Checkout').click();
    await page.locator('[placeholder*="Country"]').pressSequentially('Ind');
    const countryOptions = await page.locator("section .ta-results");
    await countryOptions.waitFor();
    const optionsCount = await countryOptions.locator("button").count();
    console.log("optionButton.count() "+optionsCount);
    for(let i=0;i<optionsCount;i++){
        let text = await countryOptions.locator("button").nth(i).textContent();
        console.log("----"+text+"----");
        if(text===" India"){
            await countryOptions.locator("button").nth(i).click();
            break;
        }
    }
    expect(page.locator('.user__name label')).toHaveText('sunnykumar@leaning.com');
    await page.locator("a:has-text('Place Order ')").click();
    const orderId = await page.locator('label.ng-star-inserted').textContent();
    console.log("OrderID"+orderId);
    await orderHeader.click();
    await page.locator('tbody tr').first().waitFor();
    const orders = await page.locator('tbody tr');
    for(let i=0;i<await orders.count();i++){
        const orderIdUI = await orders.nth(i).locator('th').textContent();
        console.log("orderIdUI"+orderIdUI);
        if(orderId.includes(orderIdUI)){
            await orders.nth(i).locator('button:has-text("View")').click();
        }
    }
    const viewOrderPageOrderId = await page.locator('.col-text').first().textContent();
    expect(orderId).toContain(viewOrderPageOrderId);
    expect(orderId.includes(viewOrderPageOrderId)).toBeTruthy();
    await page.pause();

});

