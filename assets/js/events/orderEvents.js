import {
    cancelOrder,
    searchProduct,
    addProductToOrder,
    saveOrder,
    selectAllCheckbox,
    openModalDeleteOrder,
    printOrders,
    filterOrdersByStatus,
    filterOrdersByType
} from '../modules/order.mjs';
import { closeModals } from '../utils/utils.js';

export function LoadEvents() {
    const buttonCancelOrder = document.getElementById('btn-cancel');
    const buttonSearchProduct = document.getElementById('btn-search');
    const buttonAddProduct = document.getElementById('btn-addProduct');
    const buttonSaveOrder = document.getElementById('btn-save');
    const checkboxSelectAllOrders =
        document.getElementById('select-all-orders');
    const buttonDeleteOrder = document.getElementById('btn-delete');
    const buttonPrint = document.getElementById('btn-print');
    const buttonCancelDelete = document.getElementById('btn-modal-cancel');
    const modalDeleteOrder = document.getElementById('dialog-delete');
    const selectChangeType = document.getElementById('select-filter-type');
    const selectChangeStatus = document.getElementById('select-filter-status');

    buttonCancelOrder.addEventListener('click', cancelOrder);
    buttonSearchProduct.addEventListener('click', searchProduct);
    buttonAddProduct.addEventListener('click', addProductToOrder);
    buttonSaveOrder.addEventListener('click', saveOrder);
    checkboxSelectAllOrders.addEventListener('click', selectAllCheckbox);
    buttonDeleteOrder.addEventListener('click', openModalDeleteOrder);
    buttonPrint.addEventListener('click', printOrders);
    buttonCancelDelete.addEventListener('click', () => {
        closeModals(modalDeleteOrder);
    });
    selectChangeType.addEventListener('change', filterOrdersByType);
    selectChangeStatus.addEventListener('change', filterOrdersByStatus);
}
