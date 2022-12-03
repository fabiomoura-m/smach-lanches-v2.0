export default class ProductOrder {
    idProduto;
    nome;
    quantidade;
    valor;

    constructor(idProduto, nome, quantidade, valor) {
        this.idProduto = Number.parseInt(idProduto);
        this.nome = nome;
        this.quantidade = Number.parseInt(quantidade);
        this.valor = Number.parseFloat(valor);
    }

    editProduct(quantidade) {
        this.quantidade += Number.parseInt(quantidade);
    }

    get total() {
        return this.quantidade * this.valor;
    }
}
