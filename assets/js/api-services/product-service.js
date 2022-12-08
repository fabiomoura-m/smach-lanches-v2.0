const BASE_URL = 'http://localhost:3000';

export default class ProductServices {
    async getAllProducts() {
        let response = await fetch(`${BASE_URL}/produto/todos`);
        let products = await response.json();

        return products;
    }

    async getProductForId(id) {
        let response = await fetch(`${BASE_URL}/produto/${id}`);

        if (response.ok) {
            let product = await response.json();
            return product;
        } else {
            await response.text();
        }
    }

    async saveProduct(product) {
        let response = await fetch(`${BASE_URL}/produto`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            return await response.text();
        }

        throw new Error(await response.text());
    }

    async updateProduct(id, product) {
        let response = await fetch(`${BASE_URL}/produto/${id}/atualizar`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (response.ok) {
            let data = await response.json();
            return data;
        } else {
            return await response.text();
        }
    }

    async deleteProduct(id) {
        let response = await fetch(`${BASE_URL}/produto/${id}/deletar`, {
            method: 'POST'
        });
        if (response.ok) {
            return await response.json();
        } else {
            return await response.text();
        }
    }
}
