class APIUtils{

    constructor(apiContext){
        this.apiContext = apiContext;
    }

    async getToken(loginPayload)
    {
        const loginResponse = await apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:loginPayload
        }
        );
        const loginResponseJSON = await loginResponse.json();
        loginToken = await loginResponseJSON.token;
        console.log("----"+loginToken);
        return loginToken;
    }

    async createOrder(createOrderPayload){
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{
            data: createOrderPayload,
            headers:{
                "Authorization":response.token,
                "Content-Type":"application/json"
            }
        });
        const orderResponseJson = await orderResponse.json();
        response.orderId = orderResponseJson.orders[0];
        console.log("Order response is "+orderResponseJson.orders[0])
    }
}
module.exports = {APIUtils};