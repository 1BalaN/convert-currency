const CURRENCIES = ["BYN", "USD", "EUR", "CNY", "RUB"];
let rates = {};

const date = document.querySelector('.date')
const now = new Date();

const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();
date.textContent = `(обновлено ${day}.${month}.${year})`

function fetchRates() {

    fetch('https://v6.exchangerate-api.com/v6/08b4fa0181a4cbdb600278f4/latest/USD')
    .then(response => response.json())
    .then(data => {
        rates = data.conversion_rates;
        updateResults();
        exchangeRate();
    })
    .catch(error => console.warn('Произошла ошибка: ', error));
        
}

function convertCurrency(fromCurrency, toCurrency, value) {
    if(!rates[fromCurrency] || !rates[toCurrency] || value < 0) return 0;
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

function exchangeRate() {
    const toCurrency = 'BYN';
    const ratesList = document.getElementById('rates-list');
    ratesList.innerHTML = '';
    CURRENCIES.filter(cur => cur !== toCurrency).forEach(cur => {
        let value;
        if (cur === 'USD' || cur === 'EUR') value = 1;
        else if (cur === 'CNY') value = 10;
        else if (cur === 'RUB') value = 100;
        else value = 0;
        const result = convertCurrency(cur, toCurrency, value);
        const flagUrl = `https://flagcdn.com/w40/${cur.slice(0,2).toLowerCase()}.png`;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img class="flag" src="${flagUrl}" alt="${cur} flag">
            <div class="currency-info">
                <span>${value} ${cur}</span> 
                <span>${result} BYN</span>
            </div>
        `;
        ratesList.appendChild(listItem);
        
    });
}

fetchRates();

