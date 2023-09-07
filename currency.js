const updateTimeInterval = 60 * 60 * 1000; //1 Hour

document.addEventListener('DOMContentLoaded', () => {

    const fromUSDRadio = document.querySelector('#fromUSD');
    const toUSDRadio = document.querySelector('#toUSD');
    const submitB = document.querySelector('#submit');
    const currencyDropdown = document.querySelector('#currency');

    function enableForm() {
        currencyDropdown.disabled = false;
        fromUSDRadio.disabled = false;
        toUSDRadio.disabled = false;
        submitB.disabled = false;
        document.querySelector('#defaultcurrency').innerHTML = 'Select a coin';
    }
    function updateUSDtxtF(){
        USDtxtF.value= Number(rateInput.value * exchangetxtF.value).toFixed(2);
    }
    function updateExchangetxtF(){
        exchangetxtF.value= Number(rateInput.value * USDtxtF.value).toFixed(2);
    }

    const lastUpdateTimestamp = localStorage.getItem('lastUpdateTimestamp');
    const currentTime = new Date().getTime();

    //getting currency rates if not found or update is needed to ensure that the information is up to date
    if (!localStorage.getItem('currency') || !lastUpdateTimestamp || (currentTime - lastUpdateTimestamp >= updateTimeInterval)) {


        var myHeaders = new Headers();
        myHeaders.append("apikey", "Ghx4o1E4sK7uEWfClSRDDQEDQl12QyVm");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };


        fetch("https://api.apilayer.com/currency_data/change?latest", requestOptions)
            .then(response => response.json())
            .then(result => {
                // saving currency
                const currency = {
                    EUR: result.quotes.USDEUR.end_rate,
                    AED: result.quotes.USDAED.end_rate
                };
                //store the currency object to localStorage
                localStorage.setItem('currency', JSON.stringify(currency));
                document.querySelector('#EUR').setAttribute("data-rate", result.quotes.USDEUR.end_rate);
                document.querySelector('#AED').setAttribute("data-rate", result.quotes.USDAED.end_rate);

                // Update the last update timestamp
                localStorage.setItem('lastUpdateTimestamp', new Date().getTime());
            })
            .catch(error => console.log('error', error));
    }
    else { //when currency object found on localStorage and updating doesnt need to take place
        console.log("loading from localStorage")
        // Retrieving the currency object from localStorage
        const storedCurrency = JSON.parse(localStorage.getItem('currency'));
        document.querySelector('#EUR').setAttribute("data-rate", storedCurrency.EUR);
        document.querySelector('#AED').setAttribute("data-rate", storedCurrency.AED);
    }
    enableForm();


    const rateInput = document.querySelector('#rate');
    const exchangeLabel = document.querySelector('#exchangeAmountlabel');
    const exchangetxtF = document.querySelector('#exchangeAmount');
    const USDtxtF = document.querySelector('#USDAmount');

    //setting rate text field and exchange fields on currencyDropdown change
    currencyDropdown.addEventListener('change', () => {
        const selectedOption = currencyDropdown.options[currencyDropdown.selectedIndex];
        const rate = selectedOption.getAttribute("data-rate");
        exchangeLabel.innerHTML = `${selectedOption.value} Amount:`;
        exchangetxtF.setAttribute('placeholder', `${selectedOption.value}Amount`)
        if (toUSDRadio.checked) {
            rateInput.value = 1 / rate;
            rateInput.value= Number(rateInput.value).toFixed(4);
            updateUSDtxtF();
        }
        else{
            rateInput.value = Number(rate).toFixed(4);
            updateExchangetxtF();
        }
        console.log('change');
    });

    //changing rate text field on fromUSDRadio change
    fromUSDRadio.addEventListener('change', () => {
        if (fromUSDRadio.checked) {
            const selectedOption = currencyDropdown.options[currencyDropdown.selectedIndex];
            const rate = selectedOption.getAttribute("data-rate");
            rateInput.value = Number(rate).toFixed(4);
            console.log('From USD radio button selected');
            exchangetxtF.readOnly=true;
            USDtxtF.readOnly =false;
        }
    });
    //changing rate text field on toUSDRadio change
    toUSDRadio.addEventListener('change', () => {
        if (toUSDRadio.checked) {
            const selectedOption = currencyDropdown.options[currencyDropdown.selectedIndex];
            const rate = selectedOption.getAttribute("data-rate");
            rateInput.value = 1 / rate;
            rateInput.value= Number(rateInput.value).toFixed(4);
            console.log('To USD radio button selected');
            exchangetxtF.readOnly=false;
            USDtxtF.readOnly =true;
        }
    });

    exchangetxtF.addEventListener('change',updateUSDtxtF);
    USDtxtF.addEventListener('change',updateExchangetxtF);
    //prevent the form from being submitted
    document.querySelector('form').onsubmit = () => {return false;}
    
});
