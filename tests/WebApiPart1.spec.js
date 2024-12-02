const {test,expect,request} = require('@playwright/test')
const {APIUtils} = require('./utils/APIUtils')
const loginPayload = {userEmail:"sunnykumar@leaning.com",userPassword:"Test@123"};
const createOrderPayload = {orders:[{country:"India",productOrderedId:"6581ca979fd99c85e8ee7faf"}]};
let loginToken;
let apiContext;
test.beforeAll('Login to the application', async ()=>{
    apiContext = await request.newContext();
    const APIUtilsObj = new APIUtils(apiContext);
    // const loginResponse = await apiContext.post(
    //     "https://rahulshettyacademy.com/api/ecom/auth/login",
    //     {
    //         data:loginPayload
    //     }
    // );
    // expect((await loginResponse).ok()).toBeTruthy();
    // const loginResponseJSON = await loginResponse.json();
    // loginToken = await loginResponseJSON.token;
    // console.log("----"+loginToken);
    loginToken = APIUtilsObj.getToken(loginPayload);
})

test.only('Create order with API',async ({page})=>{
    const APIUtilsObj = new APIUtils(apiContext);
    createOrder();
})

test.beforeEach('Login to the application', async ({page})=>{
    // page.goto('https://rahulshettyacademy.com/client/');
    // await page.locator('#userEmail').fill('sunnykumar@leaning.com');
    // await page.locator('#userPassword').fill('Test@123');
    // await page.locator('[value="Login"]').click();
})

test('Client App login ', async ({page}) => {
    page.addInitScript(value=>{
        window.localStorage.setItem('token',value);
    },loginToken);

    await page.goto('https://rahulshettyacademy.com/client/');
    const product = "ZARA COAT 3";
    await page.waitForLoadState('networkidle');
    const cartHeader = page.locator('[routerlink*="cart"]');
    const orderHeader = page.locator('button[routerlink*="myorders"]');
    const titles = await page.locator(".card-body b").allTextContents();
    console.log("----"+titles);
    console.log("----2"+loginToken);
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
