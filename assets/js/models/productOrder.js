export default class ProductOrder {
    idProduto;
    nome;
    quantidade;
    valor;
    #total;

    constructor(idProduto, nome, quantidade, valor) {
        this.idProduto = Number.parseInt(idProduto);
        this.nome = nome;
        this.quantidade = Number.parseFloat(quantidade);
        this.valor = Number.parseFloat(valor);
        this.#total = this.quantidade * this.valor;
    }

    editProduct(quantidade) {
        this.quantidade += Number.parseInt(quantidade);
        this.#total = this.quantidade * this.valor;
    }

    getTotal() {
        return this.#total;
    }
}
