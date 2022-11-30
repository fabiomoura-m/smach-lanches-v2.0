export default class Order {
    id;
    tipo;
    produtos;

    constructor(id, tipo, preco) {
        this.id = Number.parseInt(id);
        this.tipo = tipo;
        this.preco = Number.parseFloat(preco);
    }
}
