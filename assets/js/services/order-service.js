const BASE_URL = 'http://localhost:3000';

export default class OrderServices {
    async saveOrder(orderProducts, type) {
        const response = await fetch(`${BASE_URL}/pedido`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                id: Math.floor(Math.random() * (9999 - 1000) + 1000),
                tipo: type,
                produtos: orderProducts
            })
        });

        if (response.ok) {
            let data = await response.json();
            return data;
        }

        throw new Error(await response.text());
    }
}
