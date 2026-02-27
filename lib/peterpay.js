const axios = require('axios');

const API_KEY = process.env.PETERPAY_API_KEY;
if (!API_KEY) {
    console.warn('⚠️ PETERPAY_API_KEY is not set. PeterPay requests will fail. Set it in your .env file.');
}
const BASE_URL = 'https://www.peterpay.link/api/v1';

async function createOrder(amount, phone, name, email) {
    try {
        const response = await axios.post(`${BASE_URL}/create_order`, {
            amount: amount,
            buyer_phone: phone,
            buyer_name: name || 'PETER-MD User',
            buyer_email: email || 'user@peter-md.com'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('PeterPay Create Order Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function checkOrderStatus(orderId) {
    try {
        const response = await axios.post(`${BASE_URL}/order_status`, {
            order_id: orderId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('PeterPay Check Status Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { createOrder, checkOrderStatus };