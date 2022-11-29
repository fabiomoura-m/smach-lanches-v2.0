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
            console.log(await response.text());
        }
    }

    async saveProduct(product) {
        let response = await fetch(`${BASE_URL}/produto`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            return 'Produto cadastrado';
        }

        throw new Error(await response.text());
    }

    async updateProduct(id) {
        let response = await fetch(`${BASE_URL}/produto/${id}/atualizar`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                id: 50,
                nome: 'Batata',
                preco: 14
            })
        });
        if (response.ok) {
            let data = await response.json();
            return data;
        } else {
            return console.log(response);
        }
    }

    async deleteProduct(id) {
        let response = await fetch(`${BASE_URL}/produto/${id}/deletar`, {
            method: 'POST'
        });
        if (response.ok) {
            console.log(response.message);
        } else {
            return console.log(response);
        }
    }
}