import {
    cancelNewProduct,
    currentOperation,
    saveNewProduct,
    updateProduct,
    activeButtonsNewProduct
} from '../modules/product.mjs';
import { closeModals, maskMoney } from '../utils/utils.js';

export function LoadEvents() {
    const buttonCancelNewProduct = document.getElementById(
        'btn-cancelNewProduct'
    );
    const buttonSaveNewProduct = document.getElementById('btn-addNewProduct');
    const btnCancelDeleteProduct = document.getElementById(
        'btn-modal-cancelProduct'
    );
    const modalConfirmDeleteProduct = document.getElementById('dialog-product');
    const fieldPriceNewProduct = document.getElementById('priceNewProduct');
    const inputsSectionNewProduct =
        document.querySelectorAll('.input-newProduct');

    buttonCancelNewProduct.addEventListener('click', e => {
        e.preventDefault();
        cancelNewProduct();
    });
    buttonSaveNewProduct.addEventListener('click', e => {
        e.preventDefault();
        const fieldCodeNewProduct = document.getElementById('codeNewProduct');
        const idProduct = fieldCodeNewProduct.value;

        if (currentOperation.operation == 'editProduct') {
            updateProduct(idProduct);
        } else {
            saveNewProduct();
        }
    });
    btnCancelDeleteProduct.addEventListener('click', () => {
        closeModals(modalConfirmDeleteProduct);
    });
    fieldPriceNewProduct.addEventListener('keyup', e => maskMoney(e));
    inputsSectionNewProduct.forEach(input => {
        input.addEventListener('keyup', () => {
            activeButtonsNewProduct();
        });
    });
}
