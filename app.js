const BASE_URL = "https://api.currencybeacon.com/v1/latest?api_key=T9EvF52YGQuJskOCPJkGwSDivW6AJcDx";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currencyCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currencyCode.substring(0, 3);
        newOption.value = currencyCode;
        if (select.name == "From" && currencyCode == "USD") {
            newOption.selected = "selected";
        }
        else if (select.name == "To" && currencyCode == "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;
    if (amtValue === "" || amtValue < 1) {
        amtValue = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}&base=${fromCurr.value}&symbols=${toCurr.value}`;
    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        let rate = data.rates[toCurr.value];
        console.log(rate);

        let finalAmount = Math.round(amtValue * rate * 100) / 100;  
        msg.innerText = `${amtValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        msg.innerText = 'Failed to fetch exchange rate.';
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
