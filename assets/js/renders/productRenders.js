import { formatPrice } from '../utils/utils.js';
import {
    removeProduct,
    editProduct,
    currentOperation
} from '../modules/product.mjs';
import ProductServices from '../api-services/product-service.js';

const productService = new ProductServices();

function tableRenderProduct(code, name, price) {
    const tableBodyNewProducts = document.getElementById('tBodyNewProduct');
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
        currentOperation.operation = 'editProduct';
        editProduct(code);
    });

    tr.appendChild(tdCode);
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdAction);

    tableBodyNewProducts.appendChild(tr);
}

async function tableRenderAllProducts() {
    const tableBodyNewProducts = document.getElementById('tBodyNewProduct');
    const fieldCodeNewProduct = document.getElementById('codeNewProduct');
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

export { tableRenderProduct, tableRenderAllProducts };
