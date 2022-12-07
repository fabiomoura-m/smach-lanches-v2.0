function changeSection(e) {
    const sectionOrder = document.getElementById('orders');
    const sectionNewOrder = document.getElementById('new-order');
    const linkProduct = document.getElementById('product');
    const linkOrder = document.getElementById('order');
    const sectionProducts = document.getElementById('products');

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

function returnSectionOrders() {
    const sectionOrder = document.getElementById('orders');
    const sectionNewOrder = document.getElementById('new-order');
    sectionOrder.style.display = 'block';
    sectionNewOrder.style.display = 'none';
}

export function LoadEvents() {
    const buttonAddNewOrder = document.getElementById('btn-newOrder');
    const linkOrder = document.getElementById('order');
    const linkProduct = document.getElementById('product');
    const buttonCancelOrder = document.getElementById('btn-cancel');

    buttonCancelOrder.addEventListener('dblclick', returnSectionOrders);
    buttonAddNewOrder.addEventListener('click', e => changeSection(e));
    linkProduct.addEventListener('click', e => changeSection(e));
    linkOrder.addEventListener('click', e => changeSection(e));
}
