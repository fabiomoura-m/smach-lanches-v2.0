export default class Product {
    id;
    nome;
    preco;

    constructor(id, nome, preco) {
        this.id = Number.parseInt(id);
        this.nome = nome;
        this.preco = Number.parseFloat(preco);
    }
}
