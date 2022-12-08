import { closeModals } from '../utils/index.js';
function closeFeedback() {
    const feedbackOrders = document.getElementById('feedback-show-order');
    feedbackOrders.style.right = '-400px';
}

function LoadEvents() {
    const buttonCloseFeedback = document.getElementById('close-feedback');
    const buttonCloseModal = document.getElementById('btn-close-modal-order');
    const modalOrder = document.getElementById('dialog-order');

    buttonCloseModal.addEventListener('click', () => {
        closeModals(modalOrder);
    });
    buttonCloseFeedback.addEventListener('click', closeFeedback);
}

export { LoadEvents };
