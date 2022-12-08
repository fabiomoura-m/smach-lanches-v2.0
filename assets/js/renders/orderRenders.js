import {
    sumTotalAmountOrder,
    arrayOrder,
    tableOrderListeners
} from '../modules/order.mjs';
import { formatPrice } from '../utils/utils.js';
import OrderServices from '../api-services/order-service.js';

const orderService = new OrderServices();

function tableRenderProductsOrder() {
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

function tableRenderOrder(order) {
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

async function tableRenderAllOrders() {
    const tbodyOrders = document.getElementById('tBodyOrders');
    const feedbackNoProductsOrder = document.getElementById('feedback-orders');

    tbodyOrders.innerHTML = '';

    const orders = await orderService.getAllOrders();

    if (orders.length > 0) {
        orders.forEach(order => tableRenderOrder(order));
        feedbackNoProductsOrder.style.display = 'none';
    }
}

async function tableRenderOrdersFiltered(orders) {
    const tbodyOrders = document.getElementById('tBodyOrders');
    const feedbackNoProductsOrder = document.getElementById('feedback-orders');

    tbodyOrders.innerHTML = '';

    if (orders.length > 0) {
        orders.forEach(order => tableRenderOrder(order));
        feedbackNoProductsOrder.style.display = 'none';
    }
}

export {
    tableRenderProductsOrder,
    tableRenderOrder,
    tableRenderAllOrders,
    tableRenderOrdersFiltered
};
