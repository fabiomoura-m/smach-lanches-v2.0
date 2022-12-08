function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

function maskMoney(e) {
    const onlyDigits = e.target.value
        .split('')
        .filter(s => /\d/.test(s))
        .join('')
        .padStart(3, '0');
    const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2);
    e.target.value = formatPrice(digitsFloat);
}

function fixZero(time) {
    return time < 10 ? `0${time}` : time;
}

function showCurrentDate() {
    const date = document.getElementById('date');

    let currentDate = new Date();
    let dateFormatted = `${fixZero(currentDate.getDate())}/${fixZero(
        currentDate.getMonth() + 1
    )}/${currentDate.getFullYear()}`;

    date.innerHTML = dateFormatted;
}

function ShowCurrentTime() {
    const time = document.getElementById('hour');
    let currentDate = new Date();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let second = currentDate.getSeconds();

    time.innerHTML = `- ${fixZero(hour)}:${fixZero(minute)}:${fixZero(second)}`;
}

function feedbackMessage(message) {
    const feedbackOrders = document.getElementById('feedback-show-order');
    const messageFeedback = document.getElementById('feedback-message');

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

export {
    formatPrice,
    maskMoney,
    fixZero,
    showCurrentDate,
    ShowCurrentTime,
    feedbackMessage,
    closeModals
};
