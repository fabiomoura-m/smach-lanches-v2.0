import { productList } from './products.js';
import Product from './models/product.js';
import ProductServices from './services/product-service.js';
import ProductOrder from './models/productOrder.js';

const productService = new ProductServices();

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

const buttonCancelOrder = document.getElementById('btn-cancel');
const buttonSaveOrder = document.getElementById('btn-save');
const form = document.getElementById('formOrder');
const containerSetSave = document.getElementById('container-set-save');
const containerTotalOrder = document.getElementById('total-order');
const totalAmountOrder = document.getElementById('total-amount-order');

const tbodyOrders = document.getElementById('tBodyOrders');
const feedbackNoProductsOrder = document.getElementById('feedback-orders');
const buttonOrderStatus = document.getElementById('btn-status');

const deleteContainer = document.getElementById('container-delete');
const filterContainer = document.getElementById('container-filter');
const checkboxSelectAllOrders = document.getElementById('select-all-orders');

const buttonDeleteOrder = document.getElementById('btn-delete');

const selectChangeType = document.getElementById('select-filter-type');
const selectChangeStatus = document.getElementById('select-filter-status');

const buttonPrint = document.getElementById('btn-print');
const feedbackOrders = document.getElementById('feedback-show-order');
const messageFeedback = document.getElementById('feedback-message');
const buttonCloseFeedback = document.getElementById('close-feedback');

const modalOrder = document.getElementById('dialog-order');
const buttonCloseModal = document.getElementById('btn-close-modal-order');
const modalDeleteOrder = document.getElementById('dialog-delete');
const buttonCancelDelete = document.getElementById('btn-modal-cancel');
const buttonConfirmDelete = document.getElementById('btn-modal-confirm');

const date = document.getElementById('date');
const time = document.getElementById('hour');

const sectionProducts = document.getElementById('products');
const linkOrder = document.getElementById('order');
const linkProduct = document.getElementById('product');

const fieldCodeNewProduct = document.getElementById('codeNewProduct');
const fieldNameNewProduct = document.getElementById('nameNewProduct');
const fieldPriceNewProduct = document.getElementById('priceNewProduct');
const buttonCancelNewProduct = document.getElementById('btn-cancelNewProduct');
const buttonSaveNewProduct = document.getElementById('btn-addNewProduct');
const inputsSectionNewProduct = document.querySelectorAll('.input-newProduct');
const formNewProduct = document.getElementById('form-newProduct');

const tableBodyNewProducts = document.getElementById('tBodyNewProduct');
const modalConfirmDeleteProduct = document.getElementById('dialog-product');
const btnConfirmDeleteProduct = document.getElementById(
    'btn-modal-confirmProduct'
);
const btnCancelDeleteProduct = document.getElementById(
    'btn-modal-cancelProduct'
);

let currentOperation = 'saveProduct';

let arrayOrder = [];
let arrayOrders = [];
let arrayFilteredByType = [];
let arrayFilteredByStatus = [];
let numberOrder = 1000;
let checkedAll = false;

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

async function searchProduct(e) {
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

async function addProductOnTable(e) {
    e.preventDefault();
    buttonSaveOrder.removeAttribute('disabled');
    buttonAddProduct.setAttribute('disabled', 'true');

    const idProduct = fieldSearchProduct.value;
    const nameProduct = fieldNameProduct.value;
    const quantity = fieldAmountProduct.value;
    const priceProduct = fieldPriceProduct.value.replace('R$', '');

    const productOrder = new ProductOrder(
        idProduct,
        nameProduct,
        quantity,
        priceProduct
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
    let trTds = '';
    arrayOrder.forEach(product => {
        trTds += `
            <tr>
                <td>${product.idProduto}</td>
                <td>${product.nome}</td>
                <td>${product.quantidade}</td>
                <td>${formatPrice(product.getTotal())}</td>
            </tr>`;
    });

    tBodyProduct.innerHTML = trTds;
    feedbackNoProducts.style.display = 'none';
    containerTotalOrder.style.display = 'flex';
    containerSetSave.style.justifyContent = 'space-between';
    totalAmountOrder.innerHTML = `Total do pedido: <span class="total-order-bold">${formatPrice(
        sumTotalAmountOrders()
    )}<span>`;
    form.reset();

    console.log(arrayOrder);
}

function sumTotalAmountOrders() {
    const total = arrayOrder.reduce((current, product) => {
        return current + product.quantidade * product.valor;
    }, 0);
    return total;
}

function saveNewOrder() {}

function updateOrderList() {
    let trTds = '';
    arrayOrder.forEach(order => {
        trTds += `
            <tr>
                <td>${order.code}</td>
                <td>${order.productName}</td>
                <td>${order.amount}</td>
                <td>${formatPrice(order.total)}</td>
            </tr>`;
    });

    tBodyProduct.innerHTML = trTds;
}

function cancelOrder() {
    form.reset();
    buttonSaveOrder.setAttribute('disabled', 'true');
    buttonAddProduct.setAttribute('disabled', 'true');
    tBodyProduct.innerHTML = '';
    feedbackNoProducts.style.display = 'flex';
    containerTotalOrder.style.display = 'none';
    containerSetSave.style.justifyContent = 'flex-end';
    arrayOrder = [];
}

async function saveOrder() {
    let typeRequest = document.querySelector(
        'input[name="type-request"]:checked'
    ).value;

    let arrayPedidosReduzido = arrayOrder.map(product => {
        return {
            idProduto: product.idProduto,
            quantidade: product.quantidade
        };
    });

    let newOrder = await fetch(`http://localhost:3000/pedido`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            id: 1002,
            tipo: typeRequest,
            produtos: arrayPedidosReduzido
        })
    });
    if (newOrder.ok) {
        let data = await newOrder.json();
        showOrder(data);
        feedbackNoProductsOrder.style.display = 'none';

        cancelOrder();

        feedbackMessage('O pedido foi recebido.');
    }
}

function showOrder(order) {
    sectionOrder.style.display = 'block';
    sectionNewOrder.style.display = 'none';

    let trTds = '';

    trTds += `
            <tr>
                <td>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" class="checkbox" id="${
                            order.id
                        }" onclick="selectCheckbox()">
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
                <td><button class="button-order-status" onclick="changeOrderStatus(${
                    order.id
                })">${order.status}</button></td>
            </tr>`;

    tbodyOrders.innerHTML += trTds;
}

function changeOrderStatus(orderNumber) {
    arrayOrders = arrayOrders.map(order => {
        if (order.number == orderNumber) {
            if (order.status == 'Recebido') {
                order.status = 'Pronto';
            } else if (order.status == 'Pronto') {
                order.status = 'Entregue';
            }
        }
        return order;
    });
    updateAllOrders();
}

function updateAllOrders(array = arrayOrders) {
    array.forEach((order, index) => {
        let trTds = `
        <tr>
            <td>
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="checkbox" id="${
                        order.number
                    }" onclick="selectCheckbox()">
                    <label class="checkbox-label order" for="${order.number}">${
            order.number
        }</label>
                </div>              
            </td>
            <td>
                ${order.items
                    .map(item => `${item.amount} - ${item.product} </br>`)
                    .join('')}
            </td>
            <td>${order.type}</td>
            <td>${formatPrice(order.price)}</td>
            <td><button id="bt-trocaStatus-${index}" class="button-order-status  ${
            order.status == 'Recebido'
                ? ''
                : order.status === 'Pronto'
                ? 'ready'
                : 'delivered'
        }">${order.status}</button></td>
        </tr>`;
        tbodyOrders.innerHTML += trTds;
        document
            .getElementById(`bt-trocaStatus-${index}`)
            .addEventListener('click', () => {
                // changeOrderStatus(order.number);
                console.log(order);
            });
    });
}

function showButtonDelete(checked = false) {
    if (checkedAll || checked) {
        filterContainer.style.display = 'none';
        deleteContainer.style.display = 'flex';
    } else {
        filterContainer.style.display = 'flex';
        deleteContainer.style.display = 'none';
    }
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

function deleteOrder() {
    let message = 'Deseja realmente excluir o pedido?';
    const checkboxs = document.querySelectorAll(
        'input[type="checkbox"]:checked:not([id=select-all-orders])'
    );

    if (checkboxs.length > 1) {
        message = 'Deseja realmente excluir os pedidos?';
    }

    const messageModal = document.querySelector('#dialog-delete > div h2');
    messageModal.textContent = message;

    modalDeleteOrder.showModal();

    buttonConfirmDelete.onclick = () => {
        const checkboxTHead = document.getElementById('select-all-orders');
        checkboxs.forEach(item => {
            arrayOrders = arrayOrders.filter(order => order.number != item.id);
        });

        updateAllOrders();

        if (arrayOrders.length === 0) {
            feedbackNoProductsOrder.style.display = 'flex';
            checkboxTHead.checked = false;
            checkedAll = checkedAll ? false : true;
        }

        filterContainer.style.display = 'flex';
        deleteContainer.style.display = 'none';

        if (checkboxs.length > 1) {
            messageFeedback.textContent = 'Os pedidos foram excluídos.';
        } else {
            messageFeedback.textContent = 'O pedido foi excluído.';
        }

        feedbackOrders.style.display = 'flex';

        setTimeout(() => {
            if (document.body.clientWidth < 500) {
                feedbackOrders.style.right = '5px';
                feedbackOrders.style.top = '340px';
            } else if (document.body.clientWidth < 820) {
                feedbackOrders.style.right = '5px';
                feedbackOrders.style.top = '55px';
            } else {
                feedbackOrders.style.top = '50px';
                feedbackOrders.style.right = '100px';
            }
        }, 800);
        setTimeout(() => {
            feedbackOrders.style.right = '-300px';
            setTimeout(() => {
                feedbackOrders.style.display = 'none';
            }, 200);
        }, 5000);

        modalDeleteOrder.close();
    };
}

function filterOrdersByType() {
    let orderType = selectChangeType.value;

    if (arrayFilteredByStatus.length > 0) {
        if (orderType == '') {
            updateAllOrders(arrayFilteredByStatus);
            arrayFilteredByType = [];
        } else if (orderType == 'Delivery') {
            arrayFilteredByType = arrayFilteredByStatus.filter(
                order => order.type == 'Delivery'
            );
            updateAllOrders(arrayFilteredByType);
        } else if (orderType == 'Salão') {
            arrayFilteredByType = arrayFilteredByStatus.filter(
                order => order.type == 'Salão'
            );
            updateAllOrders(arrayFilteredByType);
        }
    } else {
        if (orderType == '') {
            updateAllOrders();
            arrayFilteredByType = [];
        } else if (orderType == 'Delivery') {
            arrayFilteredByType = arrayOrders.filter(
                order => order.type == 'Delivery'
            );
            updateAllOrders(arrayFilteredByType);
        } else if (orderType == 'Salão') {
            arrayFilteredByType = arrayOrders.filter(
                order => order.type == 'Salão'
            );
            updateAllOrders(arrayFilteredByType);
        }
    }
}

function filterOrdersByStatus() {
    let orderStatus = selectChangeStatus.value;

    if (arrayFilteredByType.length > 0) {
        if (orderStatus == '') {
            updateAllOrders(arrayFilteredByType);
            arrayFilteredByStatus = [];
        } else if (orderStatus == 'Recebido') {
            arrayFilteredByStatus = arrayFilteredByType.filter(
                order => order.status == 'Recebido'
            );
            updateAllOrders(arrayFilteredByStatus);
        } else if (orderStatus == 'Pronto') {
            arrayFilteredByStatus = arrayFilteredByType.filter(
                order => order.status == 'Pronto'
            );
            updateAllOrders(arrayFilteredByStatus);
        } else if (orderStatus == 'Entregue') {
            arrayFilteredByStatus = arrayFilteredByType.filter(
                order => order.status == 'Entregue'
            );
            updateAllOrders(arrayFilteredByStatus);
        }
    } else {
        if (orderStatus == '') {
            updateAllOrders();
            arrayFilteredByStatus = [];
        } else if (orderStatus == 'Recebido') {
            arrayFilteredByStatus = arrayOrders.filter(
                order => order.status == 'Recebido'
            );
            updateAllOrders(arrayFilteredByStatus);
        } else if (orderStatus == 'Pronto') {
            arrayFilteredByStatus = arrayOrders.filter(
                order => order.status == 'Pronto'
            );
            updateAllOrders(arrayFilteredByStatus);
        } else if (orderStatus == 'Entregue') {
            arrayFilteredByStatus = arrayOrders.filter(
                order => order.status == 'Entregue'
            );
            updateAllOrders(arrayFilteredByStatus);
        }
    }
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function printOrders() {
    window.print();
}

function closeFeedback() {
    feedbackOrders.style.right = '-400px';
}

function returnSectionOrders() {
    sectionOrder.style.display = 'block';
    sectionNewOrder.style.display = 'none';
}

function showCurrentDate() {
    let currentDate = new Date();
    let dateFormatted = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;

    date.innerHTML = dateFormatted;
}

function ShowCurrentTime() {
    let currentDate = new Date();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let second = currentDate.getSeconds();

    time.innerHTML = `- ${fixZero(hour)}:${fixZero(minute)}:${fixZero(second)}`;
}

function fixZero(time) {
    return time < 10 ? `0${time}` : time;
}

function changeSectionOrderandProduct() {
    if (sectionOrder.style.display == 'none') {
        sectionOrder.style.display == 'flex';
    } else if (sectionProducts.style.display == 'none') {
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
    const product = new Product(idProduct, nameProduct, priceProduct);

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
    tdPrice.textContent = formatPrice(Number(price));

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
    fieldPriceNewProduct.value = product[0].preco;

    buttonSaveNewProduct.disabled = false;
    buttonCancelNewProduct.style.display = 'flex';
}

async function updateProduct(code) {
    const idProduct = fieldCodeNewProduct.value;
    const nameProduct = fieldNameNewProduct.value;
    const priceProduct = fieldPriceNewProduct.value;
    const newProduct = new Product(idProduct, nameProduct, priceProduct);

    try {
        await productService.updateProduct(code, newProduct);
        await tableRenderAllProducts();
        feedbackMessage(`Produto ${code} atualizado com sucesso.`);
        cancelNewProduct();
    } catch (err) {
        feedbackMessage(`${err}.`);
    }
}

function feedbackMessage(message) {
    feedbackOrders.style.display = 'flex';
    setTimeout(() => {
        messageFeedback.textContent = message;
        if (document.body.clientWidth < 500) {
            feedbackOrders.style.right = '5px';
            feedbackOrders.style.top = '330px';
        } else if (document.body.clientWidth < 820) {
            feedbackOrders.style.right = '5px';
            feedbackOrders.style.top = '55px';
        } else {
            feedbackOrders.style.top = '20px';
            feedbackOrders.style.right = '100px';
        }
    }, 800);
    setTimeout(() => {
        feedbackOrders.style.right = '-400px';
        setTimeout(() => {
            feedbackOrders.style.display = 'none';
        }, 200);
    }, 5000);
}

function closeModals(modal) {
    modal.close();
}

buttonAddNewOrder.addEventListener('click', e => changeSection(e));
buttonSearchProduct.addEventListener('click', searchProduct);
buttonAddProduct.addEventListener('click', addProductOnTable);
buttonCancelOrder.addEventListener('click', cancelOrder);
buttonCancelOrder.addEventListener('dblclick', returnSectionOrders);
buttonSaveOrder.addEventListener('click', saveOrder);
checkboxSelectAllOrders.addEventListener('click', selectAllCheckbox);
buttonDeleteOrder.addEventListener('click', deleteOrder);
selectChangeType.addEventListener('change', filterOrdersByType);
selectChangeStatus.addEventListener('change', filterOrdersByStatus);
buttonPrint.addEventListener('click', printOrders);
buttonCloseFeedback.addEventListener('click', closeFeedback);
buttonCloseModal.addEventListener('click', () => {
    closeModals(modalOrder);
});
buttonCancelDelete.addEventListener('click', () => {
    closeModals(modalDeleteOrder);
});
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

linkOrder.addEventListener('click', e => changeSection(e));
linkProduct.addEventListener('click', e => changeSection(e));
window.addEventListener('load', () => {
    showCurrentDate();
    activeButtonsNewProduct();
    ShowCurrentTime();
    tableRenderAllProducts();
    setInterval(ShowCurrentTime, 1000);
});
