import {
    cancelNewProduct,
    currentOperation,
    saveNewProduct,
    updateProduct
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

    buttonCancelNewProduct.addEventListener('click', e => {
        e.preventDefault();
        cancelNewProduct();
    });
    buttonSaveNewProduct.addEventListener('click', e => {
        e.preventDefault();
        const fieldCodeNewProduct = document.getElementById('codeNewProduct');
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
    fieldPriceNewProduct.addEventListener('keyup', e => maskMoney(e));
}
