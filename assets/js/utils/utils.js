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

function sumTotalAmountOrder() {
    const total = arrayOrder.reduce((current, product) => {
        return current + product.quantidade * product.valor;
    }, 0);
    return total;
}

export {
    formatPrice,
    maskMoney,
    fixZero,
    showCurrentDate,
    ShowCurrentTime,
    sumTotalAmountOrder
};
