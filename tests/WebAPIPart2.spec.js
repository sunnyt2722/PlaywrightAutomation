const {test,expect} = require("@playwright/test")
// Login UI
// test browser, cart, order, order details, order history
let webContext;
test.beforeAll('Login to application and save entire session values',async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('#userEmail').fill('sunnykumar@leaning.com');
    await page.locator('#userPassword').fill('Test@123');
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path:'state.json'});

    webContext = await browser.newContext({storageState:'state.json'});
})

test('Nothing test',async()=>{
    const product = "ZARA COAT 3";
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    const cartHeader = page.locator('[routerlink*="cart"]');
    const orderHeader = page.locator('button[routerlink*="myorders"]');
    const titles = await page.locator(".card-body b").allTextContents();
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
})