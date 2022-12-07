import Product from './models/product.js';
import ProductServices from './services/product-service.js';
import ProductOrder from './models/productOrder.js';
import OrderServices from './services/order-service.js';
import {
    formatPrice,
    maskMoney,
    showCurrentDate,
    ShowCurrentTime
} from './utils/utils.js';
import LoadEvents from './events/index.js';
import { arrayOrder, tableRenderAllOrders } from './modules/order.js';

const productService = new ProductServices();
const orderService = new OrderServices();

const buttonSearchProduct = document.getElementById('btn-search');
const fieldSearchProduct = document.getElementById('codeProduct');
const fieldNameProduct = document.getElementById('nameProduct');
const fieldPriceProduct = document.getElementById('priceProduct');

const buttonAddNewOrder = document.getElementById('btn-newOrder');
const sectionOrder = document.getElementById('orders');
const sectionNewOrder = document.getElementById('new-order');

const buttonAddProduct = document.getElementById('btn-addProduct');
const fieldAmountProduct = document.getElementById('amountProduct');
const feedbackNoProducts = document.getElementById('feedback-order');
const tBodyProduct = document.getElementById('tBodyProduct');

const buttonSaveOrder = document.getElementById('btn-save');
const form = document.getElementById('formOrder');
const containerSetSave = document.getElementById('container-set-save');
const containerTotalOrder = document.getElementById('total-order');
const totalAmountOrder = document.getElementById('total-amount-order');

const tbodyOrders = document.getElementById('tBodyOrders');
const feedbackNoProductsOrder = document.getElementById('feedback-orders');

const deleteContainer = document.getElementById('container-delete');
const filterContainer = document.getElementById('container-filter');
const checkboxSelectAllOrders = document.getElementById('select-all-orders');

const buttonDeleteOrder = document.getElementById('btn-delete');

const selectChangeType = document.getElementById('select-filter-type');
const selectChangeStatus = document.getElementById('select-filter-status');

const feedbackOrders = document.getElementById('feedback-show-order');
const messageFeedback = document.getElementById('feedback-message');
const buttonCloseFeedback = document.getElementById('close-feedback');

const modalOrder = document.getElementById('dialog-order');
const buttonCloseModal = document.getElementById('btn-close-modal-order');
const modalDeleteOrder = document.getElementById('dialog-delete');
const buttonCancelDelete = document.getElementById('btn-modal-cancel');
const buttonConfirmDelete = document.getElementById('btn-modal-confirm');

const sectionProducts = document.getElementById('products');
const linkOrder = document.getElementById('order');
const linkProduct = document.getElementById('product');

const fieldCodeNewProduct = document.getElementById('codeNewProduct');
const fieldNameNewProduct = document.getElementById('nameNewProduct');
const fieldPriceNewProduct = document.getElementById('priceNewProduct');
const buttonCancelNewProduct = document.getElementById('btn-cancelNewProduct');
const buttonSaveNewProduct = document.getElementById('btn-addNewProduct');
const inputsSectionNewProduct = document.querySelectorAll('.input-newProduct');

const tableBodyNewProducts = document.getElementById('tBodyNewProduct');
const modalConfirmDeleteProduct = document.getElementById('dialog-product');
const btnConfirmDeleteProduct = document.getElementById(
    'btn-modal-confirmProduct'
);
const btnCancelDeleteProduct = document.getElementById(
    'btn-modal-cancelProduct'
);

let currentOperation = 'saveProduct';

function changeSection(e) {
    if (e.target.id == 'btn-newOrder') {
        sectionOrder.style.display = 'none';
        sectionNewOrder.style.display = 'flex';
    }
    if (e.target.id == 'order') {
        linkProduct.removeAttribute('class');
        linkOrder.setAttribute('class', 'active');
        sectionNewOrder.style.display = 'none';
        sectionProducts.style.display = 'none';
        sectionOrder.style.display = 'block';
    }
    if (e.target.id == 'product') {
        linkOrder.removeAttribute('class');
        linkProduct.setAttribute('class', 'active');
        sectionNewOrder.style.display = 'none';
        sectionOrder.style.display = 'none';
        sectionProducts.style.display = 'block';
    }
}

function checkInputs(inputs) {
    let filled = true;

    inputs.forEach(function (input) {
        if (input.value === '') {
            filled = false;
        }
    });

    return filled;
}

function activeButtonsNewProduct() {
    inputsSectionNewProduct.forEach(input => {
        input.addEventListener('keyup', () => {
            if (checkInputs(inputsSectionNewProduct)) {
                buttonSaveNewProduct.disabled = false;
                buttonCancelNewProduct.style.display = 'flex';
            } else {
                buttonSaveNewProduct.disabled = true;
                buttonCancelNewProduct.style.display = 'none';
            }
        });
    });
}

async function cancelNewProduct() {
    fieldNameNewProduct.value = '';
    fieldPriceNewProduct.value = '';
    buttonCancelNewProduct.style.display = 'none';
    fieldCodeNewProduct.removeAttribute('disabled');
    buttonSaveNewProduct.disabled = true;
    currentOperation = 'saveProduct';
    await tableRenderAllProducts();
}

async function saveNewProduct() {
    const idProduct = fieldCodeNewProduct.value;
    const nameProduct = fieldNameNewProduct.value;
    const priceProduct = fieldPriceNewProduct.value;
    const priceProductCurrentValue =
        Number(priceProduct.replace(/\D/g, '')) / 100;

    const product = new Product(
        idProduct,
        nameProduct,
        priceProductCurrentValue
    );

    try {
        await productService.saveProduct(product);
        await tableRenderAllProducts();
        feedbackMessage(`O produto ${idProduct} foi criado.`);
        cancelNewProduct();
    } catch (error) {
        feedbackMessage(`${error.message}.`);
    }
}

function tableRenderProduct(code, name, price) {
    const tr = document.createElement('tr');
    const tdCode = document.createElement('td');
    const tdName = document.createElement('td');
    const tdPrice = document.createElement('td');
    const tdAction = document.createElement('td');
    const removeButton = document.createElement('img');
    const editButton = document.createElement('img');

    removeButton.setAttribute('class', 'removeButton');
    removeButton.src = 'assets/images/trash-product.svg';
    editButton.setAttribute('class', 'editButton');
    editButton.src = 'assets/images/edit-product.svg';
    tdAction.setAttribute('class', 'actionButtons');
    tdAction.appendChild(editButton);
    tdAction.appendChild(removeButton);

    tdCode.textContent = code;
    tdName.textContent = name;

    tdPrice.textContent = formatPrice(price);

    removeButton.addEventListener('click', () => removeProduct(code, name));
    editButton.addEventListener('click', () => {
        currentOperation = 'editProduct';
        editProduct(code);
    });

    tr.appendChild(tdCode);
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdAction);

    tableBodyNewProducts.appendChild(tr);
}

async function tableRenderAllProducts() {
    tableBodyNewProducts.innerHTML = '';

    let products = await productService.getAllProducts();

    let productsOrderByCode = products.sort((a, b) => {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

    let firstProduct = productsOrderByCode[products.length - 1]?.id || 999;

    productsOrderByCode.reverse().forEach(product => {
        tableRenderProduct(product.id, product.nome, product.preco);
    });

    fieldCodeNewProduct.value = firstProduct + 1;
}

async function removeProduct(code, name) {
    modalConfirmDeleteProduct.showModal();

    const productNameModal = document.getElementById('modal-productName');

    productNameModal.innerHTML = name;

    btnConfirmDeleteProduct.onclick = async () => {
        try {
            await productService.deleteProduct(code);

            tableRenderAllProducts();
            feedbackMessage(`Produto ${code} removido com sucesso.`);
            modalConfirmDeleteProduct.close();
        } catch (err) {
            feedbackMessage(`${err}.`);
            modalConfirmDeleteProduct.close();
        }
    };
}

async function editProduct(code) {
    let product = await productService.getProductForId(code);

    fieldCodeNewProduct.value = product[0].id;
    fieldCodeNewProduct.setAttribute('disabled', 'disabled');
    fieldNameNewProduct.value = product[0].nome;
    fieldPriceNewProduct.value = formatPrice(product[0].preco);

    buttonSaveNewProduct.disabled = false;
    buttonCancelNewProduct.style.display = 'flex';
}

async function updateProduct(code) {
    const idProduct = fieldCodeNewProduct.value;
    const nameProduct = fieldNameNewProduct.value;
    const priceProduct = fieldPriceNewProduct.value;
    const priceProductCurrentValue =
        Number(priceProduct.replace(/\D/g, '')) / 100;
    const newProduct = new Product(
        idProduct,
        nameProduct,
        priceProductCurrentValue
    );

    try {
        await productService.updateProduct(code, newProduct);
        await tableRenderAllProducts();
        feedbackMessage(`Produto ${code} atualizado com sucesso.`);
        cancelNewProduct();
    } catch (err) {
        feedbackMessage(`${err}.`);
    }
}

buttonAddNewOrder.addEventListener('click', e => changeSection(e));

buttonCancelNewProduct.addEventListener('click', e => {
    e.preventDefault();
    cancelNewProduct();
});
buttonSaveNewProduct.addEventListener('click', e => {
    e.preventDefault();
    const idProduct = fieldCodeNewProduct.value;

    if (currentOperation == 'editProduct') {
        updateProduct(idProduct);
    } else {
        saveNewProduct();
    }
});
btnCancelDeleteProduct.addEventListener('click', () => {
    closeModals(modalConfirmDeleteProduct);
});

linkProduct.addEventListener('click', e => changeSection(e));
fieldPriceNewProduct.addEventListener('keyup', e => maskMoney(e));
window.addEventListener('load', () => {
    showCurrentDate();
    activeButtonsNewProduct();
    ShowCurrentTime();
    tableRenderAllProducts();
    tableRenderAllOrders();
    LoadEvents();
    setInterval(ShowCurrentTime, 1000);
});
