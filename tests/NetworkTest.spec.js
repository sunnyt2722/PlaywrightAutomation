const {test,expect,request} = require("@playwright/test")
// Login UI
// test browser, cart, order, order details, order history
let context;
let page;
const fakePayloadOrders = {data:[], message:"No Orders"};

test.beforeAll('Login to application and save entire session values',async({browser})=>{
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('#userEmail').fill('sunnykumar@leaning.com');
    await page.locator('#userPassword').fill('Test@123');
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
})

test('Order details page with mocking',async()=>{
    const orderHeader = page.locator('button[routerlink*="myorders"]');
    await orderHeader.click();
    await page.pause();
})

test('Orders details page mocked',async()=>{
    let body = JSON.stringify(fakePayloadOrders);
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/668d985fae2afd4c0b1df892",
        route=>{
            const response = page.request.fetch(route.request());
            route.fulfill({
                response,
                body
            });
        }
    )
    const orderHeader = page.locator('button[routerlink*="myorders"]');
    await orderHeader.click();
    await page.pause();
})

test('Security test request intercept',async()=>{
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route=>route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=323424'})
    );
    const orderHeader = page.locator('button[routerlink*="myorders"]');
    await orderHeader.click();
    await page.locator('button:has-text("View")').first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
})


test('Abort API Network calls',async()=>{

    await page.on('request',request=>console.log(request.url()));
    page.on('response',response=>console.log(response.url + ": "+ response.status()));
    await page.route("**/*.{css,jpg,png,jpeg}",
        route=>route.abort()
    )

    const usernameInput = page.locator('[id="username"]');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await usernameInput.fill("rahulshettyacademy");
    await page.locator('#password').fill("learning");
    await page.locator('[name="signin"]').click();
    await page.pause();
})


