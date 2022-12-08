import ProductService from '../api-services/product-service.js';
import { formatPrice, feedbackMessage } from '../utils/utils.js';
import Product from '../models/product.js';
import { tableRenderAllProducts } from '../renders/productRenders.js';

let currentOperation = {
    operation: 'saveProduct'
};
const productService = new ProductService();

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
    const buttonSaveNewProduct = document.getElementById('btn-addNewProduct');
    const buttonCancelNewProduct = document.getElementById(
        'btn-cancelNewProduct'
    );
    const inputsSectionNewProduct =
        document.querySelectorAll('.input-newProduct');

    if (checkInputs(inputsSectionNewProduct)) {
        buttonSaveNewProduct.disabled = false;
        buttonCancelNewProduct.style.display = 'flex';
    } else {
        buttonSaveNewProduct.disabled = true;
        buttonCancelNewProduct.style.display = 'none';
    }
}

async function cancelNewProduct() {
    const fieldCodeNewProduct = document.getElementById('codeNewProduct');
    const fieldNameNewProduct = document.getElementById('nameNewProduct');
    const fieldPriceNewProduct = document.getElementById('priceNewProduct');
    const buttonCancelNewProduct = document.getElementById(
        'btn-cancelNewProduct'
    );
    const buttonSaveNewProduct = document.getElementById('btn-addNewProduct');

    fieldNameNewProduct.value = '';
    fieldPriceNewProduct.value = '';
    buttonCancelNewProduct.style.display = 'none';
    fieldCodeNewProduct.removeAttribute('disabled');
    buttonSaveNewProduct.disabled = true;
    currentOperation.operation = 'saveProduct';
    await tableRenderAllProducts();
}

async function saveNewProduct() {
    const fieldCodeNewProduct = document.getElementById('codeNewProduct');
    const fieldNameNewProduct = document.getElementById('nameNewProduct');
    const fieldPriceNewProduct = document.getElementById('priceNewProduct');

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

async function removeProduct(code, name) {
    const modalConfirmDeleteProduct = document.getElementById('dialog-product');
    const btnConfirmDeleteProduct = document.getElementById(
        'btn-modal-confirmProduct'
    );
    const productNameModal = document.getElementById('modal-productName');

    modalConfirmDeleteProduct.showModal();
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
    const fieldCodeNewProduct = document.getElementById('codeNewProduct');
    const fieldNameNewProduct = document.getElementById('nameNewProduct');
    const fieldPriceNewProduct = document.getElementById('priceNewProduct');
    const buttonSaveNewProduct = document.getElementById('btn-addNewProduct');
    const buttonCancelNewProduct = document.getElementById(
        'btn-cancelNewProduct'
    );

    let product = await productService.getProductForId(code);

    fieldCodeNewProduct.value = product[0].id;
    fieldCodeNewProduct.setAttribute('disabled', 'disabled');
    fieldNameNewProduct.value = product[0].nome;
    fieldPriceNewProduct.value = formatPrice(product[0].preco);

    buttonSaveNewProduct.disabled = false;
    buttonCancelNewProduct.style.display = 'flex';
}

async function updateProduct(code) {
    const fieldCodeNewProduct = document.getElementById('codeNewProduct');
    const fieldNameNewProduct = document.getElementById('nameNewProduct');
    const fieldPriceNewProduct = document.getElementById('priceNewProduct');
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

export {
    activeButtonsNewProduct,
    cancelNewProduct,
    currentOperation,
    saveNewProduct,
    updateProduct,
    removeProduct,
    editProduct
};
