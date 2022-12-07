import ProductServices from '../services/product-service.js';
import OrderServices from '../services/order-service.js';
import { formatPrice } from '../utils/utils.js';
import ProductOrder from '../models/productOrder.js';
import { feedbackMessage, closeModals } from '../utils/utils.js';

const productService = new ProductServices();
const orderService = new OrderServices();

let arrayOrder = [];
let arrayFilteredByType = [];
let arrayFilteredByStatus = [];
let checkedAll = false;

function cancelOrder() {
    const form = document.getElementById('formOrder');
    const buttonSaveOrder = document.getElementById('btn-save');
    const buttonAddProduct = document.getElementById('btn-addProduct');
    const tBodyProduct = document.getElementById('tBodyProduct');
    const feedbackNoProducts = document.getElementById('feedback-order');
    const containerTotalOrder = document.getElementById('total-order');
    const containerSetSave = document.getElementById('container-set-save');

    form.reset();
    buttonSaveOrder.setAttribute('disabled', 'true');
    buttonAddProduct.setAttribute('disabled', 'true');
    tBodyProduct.innerHTML = '';
    feedbackNoProducts.style.display = 'flex';
    containerTotalOrder.style.display = 'none';
    containerSetSave.style.justifyContent = 'flex-end';
    arrayOrder = [];
}

function returnSectionOrders() {
    const sectionOrder = document.getElementById('orders');
    const sectionNewOrder = document.getElementById('new-order');
    sectionOrder.style.display = 'block';
    sectionNewOrder.style.display = 'none';
}

async function searchProduct(e) {
    const fieldSearchProduct = document.getElementById('codeProduct');
    const fieldNameProduct = document.getElementById('nameProduct');
    const fieldPriceProduct = document.getElementById('priceProduct');
    const fieldAmountProduct = document.getElementById('amountProduct');
    const buttonAddProduct = document.getElementById('btn-addProduct');
    const modalOrder = document.getElementById('dialog-order');

    e.preventDefault();
    const codeProduct = fieldSearchProduct.value;
    if (codeProduct) {
        const productFound = await productService.getProductForId(codeProduct);
        if (productFound !== undefined) {
            fieldNameProduct.value = productFound[0].nome;
            fieldPriceProduct.value = formatPrice(productFound[0].preco);
            fieldAmountProduct.value = 1;
            buttonAddProduct.removeAttribute('disabled');
        } else {
            fieldNameProduct.value = '';
            fieldPriceProduct.value = '';
            fieldAmountProduct.value = 0;
            buttonAddProduct.setAttribute('disabled', 'true');
            modalOrder.showModal();
        }
    }
}

function sumTotalAmountOrder() {
    const total = arrayOrder.reduce((current, product) => {
        return current + product.quantidade * product.valor;
    }, 0);
    return total;
}

async function addProductToOrder(e) {
    const fieldSearchProduct = document.getElementById('codeProduct');
    const fieldNameProduct = document.getElementById('nameProduct');
    const fieldPriceProduct = document.getElementById('priceProduct');
    const fieldAmountProduct = document.getElementById('amountProduct');
    const buttonSaveOrder = document.getElementById('btn-save');
    const buttonAddProduct = document.getElementById('btn-addProduct');

    e.preventDefault();
    const quantity = fieldAmountProduct.value;
    if (!quantity || quantity == '0') {
        return feedbackMessage('Preencha o campo quantidade!');
    }

    buttonSaveOrder.removeAttribute('disabled');
    buttonAddProduct.setAttribute('disabled', 'true');

    const idProduct = fieldSearchProduct.value;
    const nameProduct = fieldNameProduct.value;
    const priceProduct = fieldPriceProduct.value.replace('R$', '');
    const priceProductCurrentValue =
        Number(priceProduct.replace(/\D/g, '')) / 100;

    const productOrder = new ProductOrder(
        idProduct,
        nameProduct,
        quantity,
        priceProductCurrentValue
    );

    const sameProduct = arrayOrder.find(
        product => product.idProduto == idProduct
    );

    if (sameProduct !== undefined) {
        arrayOrder.forEach(product => {
            if (product.idProduto == idProduct) {
                product.editProduct(quantity);

                renderProductsOrder();
            }
        });
    } else {
        arrayOrder.push(productOrder);

        renderProductsOrder();
    }
}

function renderProductsOrder() {
    const tBodyProduct = document.getElementById('tBodyProduct');
    const feedbackNoProducts = document.getElementById('feedback-order');
    const containerTotalOrder = document.getElementById('total-order');
    const containerSetSave = document.getElementById('container-set-save');
    const totalAmountOrder = document.getElementById('total-amount-order');
    const form = document.getElementById('formOrder');

    let trTds = '';
    arrayOrder.forEach(product => {
        trTds += `
            <tr>
                <td>${product.idProduto}</td>
                <td>${product.nome}</td>
                <td>${product.quantidade}</td>
                <td>${formatPrice(product.total)}</td>
            </tr>`;
    });

    tBodyProduct.innerHTML = trTds;
    feedbackNoProducts.style.display = 'none';
    containerTotalOrder.style.display = 'flex';
    containerSetSave.style.justifyContent = 'space-between';
    totalAmountOrder.innerHTML = `Total do pedido: <span class="total-order-bold">${formatPrice(
        sumTotalAmountOrder()
    )}<span>`;
    form.reset();
}

async function saveOrder() {
    const sectionOrder = document.getElementById('orders');
    const sectionNewOrder = document.getElementById('new-order');
    const feedbackNoProductsOrder = document.getElementById('feedback-orders');

    sectionOrder.style.display = 'block';
    sectionNewOrder.style.display = 'none';

    let typeRequest = document.querySelector(
        'input[name="type-request"]:checked'
    ).value;

    const arrayProductsOrder = arrayOrder.map(product => {
        return {
            idProduto: product.idProduto,
            quantidade: product.quantidade
        };
    });

    try {
        const order = await orderService.saveOrder(
            arrayProductsOrder,
            typeRequest
        );
        showOrder(order);
        feedbackNoProductsOrder.style.display = 'none';

        cancelOrder();

        feedbackMessage('O pedido foi recebido.');
    } catch (err) {
        feedbackMessage(`${err}.`);
    }
}

function showOrder(order) {
    const tbodyOrders = document.getElementById('tBodyOrders');

    let trTds = '';

    let statusOrder =
        order.status == 'Recebido'
            ? ''
            : order.status == 'Pronto'
            ? 'ready'
            : 'delivered';

    trTds += `
            <tr>
                <td>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" class="checkbox checkbox-order"  id="${
                            order.id
                        }">
                        <label class="checkbox-label order" for="${order.id}">${
        order.id
    }</label>
                    </div>
                </td>
                <td>
                ${order.produtos
                    .map(
                        product =>
                            `${product.quantidade} - ${product.nome} </br>`
                    )
                    .join('')}
                </td>
                <td>${order.tipo}</td>
                <td>${formatPrice(order.total)}</td>
                <td>
                    <button class="button-order-status ${statusOrder}" order-id="${
        order.id
    }" order-status="${order.status}">
                    ${order.status}
                    </button>
                </td>
            </tr>`;

    tbodyOrders.innerHTML += trTds;

    tableOrderListeners();
}

async function changeOrderStatus(id, status) {
    if (status !== 'Entregue') {
        try {
            await orderService.changeStatus(id, status);
            tableRenderAllOrders();
        } catch (err) {
            feedbackMessage(`${err}.`);
        }
    }
}

function tableOrderListeners() {
    const buttonsChangeStatus = document.querySelectorAll(
        '.button-order-status'
    );

    const checkboxs = document.querySelectorAll('.checkbox-order');

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const orderID = button.getAttribute('order-id');
            const orderStatus = button.getAttribute('order-status');

            changeOrderStatus(orderID, orderStatus);
        });
    });

    checkboxs.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            selectCheckbox();
        });
    });
}

async function tableRenderAllOrders() {
    const tbodyOrders = document.getElementById('tBodyOrders');
    const feedbackNoProductsOrder = document.getElementById('feedback-orders');

    tbodyOrders.innerHTML = '';

    const orders = await orderService.getAllOrders();

    if (orders.length > 0) {
        orders.forEach(order => showOrder(order));
        feedbackNoProductsOrder.style.display = 'none';
    }
}

function selectCheckbox() {
    let checked = false;

    let checkboxs = document.querySelectorAll(
        'input[type="checkbox"]:checked:not([id=select-all-orders])'
    );

    if (checkboxs.length >= 1) {
        checked = true;
    }

    showButtonDelete(checked);
}

function selectAllCheckbox() {
    let checkboxs = document.querySelectorAll(
        'input[type="checkbox"]:not([id=select-all-orders])'
    );

    checkboxs.forEach(checkbox => {
        checkbox.checked = checkedAll ? false : true;
    });

    checkedAll = checkedAll ? false : true;

    if (checkboxs.length > 0) {
        showButtonDelete();
    }
}

function showButtonDelete(checked = false) {
    const filterContainer = document.getElementById('container-filter');
    const deleteContainer = document.getElementById('container-delete');

    if (checkedAll || checked) {
        filterContainer.style.display = 'none';
        deleteContainer.style.display = 'flex';
    } else {
        filterContainer.style.display = 'flex';
        deleteContainer.style.display = 'none';
    }
}

async function openModalDeleteOrder() {
    const messageModal = document.querySelector('#dialog-delete > div h2');
    const orderCode = document.querySelector('#modal-orderCode');
    const modalDeleteOrder = document.getElementById('dialog-delete');
    const buttonConfirmDelete = document.getElementById('btn-modal-confirm');

    orderCode.innerHTML = '';
    let message = 'Deseja realmente excluir o pedido?';

    const checkboxs = document.querySelectorAll(
        'input[type="checkbox"]:checked:not([id=select-all-orders])'
    );

    if (checkboxs.length > 1) {
        message = 'Deseja realmente excluir os pedidos?';
    }
    messageModal.textContent = message;

    checkboxs.forEach(checkbox => {
        orderCode.innerHTML += `<span>${checkbox.id}<span>`;
    });

    modalDeleteOrder.showModal();

    buttonConfirmDelete.addEventListener('click', deleteOrder);
}

async function deleteOrder() {
    const modalDeleteOrder = document.getElementById('dialog-delete');
    const filterContainer = document.getElementById('container-filter');
    const deleteContainer = document.getElementById('container-delete');
    const checkboxs = document.querySelectorAll(
        'input[type="checkbox"]:checked:not([id=select-all-orders])'
    );
    const checkboxTHead = document.getElementById('select-all-orders');

    if (checkboxs.length > 1) {
        for (let i = 0; i < checkboxs.length; i++) {
            const idProduct = checkboxs[i].id;
            await orderService.deleteOrder(idProduct);
        }

        await tableRenderAllOrders();
        feedbackMessage(`Pedidos removidos com sucesso.`);
    } else {
        const idProduct = Number(checkboxs[0].id);
        await orderService.deleteOrder(idProduct);
        await tableRenderAllOrders();
        feedbackMessage(`Pedido ${idProduct} removido com sucesso.`);
    }

    await showFeedbackNoOrders();
    filterContainer.style.display = 'flex';
    deleteContainer.style.display = 'none';
    checkboxTHead.checked = false;

    closeModals(modalDeleteOrder);
}

async function showFeedbackNoOrders() {
    const feedbackNoProductsOrder = document.getElementById('feedback-orders');
    const orders = await orderService.getAllOrders();

    if (orders.length > 0) {
        feedbackNoProductsOrder.style.display = 'none';
    } else {
        feedbackNoProductsOrder.style.display = 'flex';
    }
}

async function filterOrdersByType() {
    const selectChangeType = document.getElementById('select-filter-type');

    let orderType = selectChangeType.value;

    let products = await orderService.getAllOrders();

    if (arrayFilteredByStatus.length > 0) {
        if (orderType == '') {
            tableRenderOrdersFiltered(arrayFilteredByStatus);
            arrayFilteredByType = [];
        } else if (orderType == 'Delivery') {
            arrayFilteredByType = arrayFilteredByStatus.filter(
                order => order.tipo == 'Delivery'
            );
            tableRenderOrdersFiltered(arrayFilteredByType);
        } else if (orderType == 'Salão') {
            arrayFilteredByType = arrayFilteredByStatus.filter(
                order => order.tipo == 'Salão'
            );
            tableRenderOrdersFiltered(arrayFilteredByType);
        }
    } else {
        if (orderType == '') {
            tableRenderAllOrders();
            arrayFilteredByType = [];
        } else if (orderType == 'Delivery') {
            arrayFilteredByType = products.filter(
                order => order.tipo == 'Delivery'
            );
            tableRenderOrdersFiltered(arrayFilteredByType);
        } else if (orderType == 'Salão') {
            arrayFilteredByType = products.filter(
                order => order.tipo == 'Salão'
            );
            tableRenderOrdersFiltered(arrayFilteredByType);
        }
    }
}

async function filterOrdersByStatus() {
    const selectChangeStatus = document.getElementById('select-filter-status');
    let orderStatus = selectChangeStatus.value;

    let products = await orderService.getAllOrders();

    if (arrayFilteredByType.length > 0) {
        if (orderStatus == '') {
            tableRenderOrdersFiltered(arrayFilteredByType);
            arrayFilteredByStatus = [];
        } else if (orderStatus == 'Recebido') {
            arrayFilteredByStatus = arrayFilteredByType.filter(
                order => order.status == 'Recebido'
            );
            tableRenderOrdersFiltered(arrayFilteredByStatus);
        } else if (orderStatus == 'Pronto') {
            arrayFilteredByStatus = arrayFilteredByType.filter(
                order => order.status == 'Pronto'
            );
            tableRenderOrdersFiltered(arrayFilteredByStatus);
        } else if (orderStatus == 'Entregue') {
            arrayFilteredByStatus = arrayFilteredByType.filter(
                order => order.status == 'Entregue'
            );
            tableRenderOrdersFiltered(arrayFilteredByStatus);
        }
    } else {
        if (orderStatus == '') {
            tableRenderAllOrders();
            arrayFilteredByStatus = [];
        } else if (orderStatus == 'Recebido') {
            arrayFilteredByStatus = products.filter(
                order => order.status == 'Recebido'
            );
            tableRenderOrdersFiltered(arrayFilteredByStatus);
        } else if (orderStatus == 'Pronto') {
            arrayFilteredByStatus = products.filter(
                order => order.status == 'Pronto'
            );
            tableRenderOrdersFiltered(arrayFilteredByStatus);
        } else if (orderStatus == 'Entregue') {
            arrayFilteredByStatus = products.filter(
                order => order.status == 'Entregue'
            );
            tableRenderOrdersFiltered(arrayFilteredByStatus);
        }
    }
}

async function tableRenderOrdersFiltered(orders) {
    const tbodyOrders = document.getElementById('tBodyOrders');
    const feedbackNoProductsOrder = document.getElementById('feedback-orders');

    tbodyOrders.innerHTML = '';

    if (orders.length > 0) {
        orders.forEach(order => showOrder(order));
        feedbackNoProductsOrder.style.display = 'none';
    }
}

function printOrders() {
    window.print();
}

export {
    cancelOrder,
    returnSectionOrders,
    searchProduct,
    arrayOrder,
    sumTotalAmountOrder,
    addProductToOrder,
    saveOrder,
    tableRenderAllOrders,
    selectAllCheckbox,
    openModalDeleteOrder,
    printOrders,
    filterOrdersByStatus,
    filterOrdersByType
};
