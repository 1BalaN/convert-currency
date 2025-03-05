const CURRENCIES = ["BYN", "USD", "EUR", "CNY", "RUB"];
let rates = {};

function fetchRates() {

    fetch('https://v6.exchangerate-api.com/v6/08b4fa0181a4cbdb600278f4/latest/USD')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        rates = data.conversion_rates;
        updateResults();
    })
    .catch(error => console.warn('Произошла ошибка: ', error));
        
}

function convertCurrency(fromCurrency, toCurrency, value) {
    if(!rates[fromCurrency] || !rates[toCurrency]) return 0;
    let result = ((value / rates[fromCurrency]) * rates[toCurrency]).toFixed(2);
    return result;
}

function updateResults() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const value = parseFloat(document.getElementById('value').value) || 0;
    
    const resultBlock = document.getElementById('results');
    resultBlock.innerHTML = '';

    CURRENCIES.filter(cur => cur !== fromCurrency).forEach(cur => {
        const result = convertCurrency(fromCurrency, cur, value);
        const div = document.createElement('div');
        div.className = 'result';
        div.innerHTML = `<img class='flag' src='https://flagcdn.com/w40/${cur.slice(0,2).toLowerCase()}.png'> ${result} ${cur}`;
        resultBlock.appendChild(div);
    });

    document.querySelector('.button').addEventListener('click', (e) => {
        e.preventDefault();
        updateResults();
    })
}

fetchRates();
