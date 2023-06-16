<script>
// Define prices and markup
const pricesSMS = [0.47, 10.75, 37, 155, 580, 2800];
const pricesMMS = [3.40, 33, 165, 480, 1550, 29000];
const markup = 0.30;
const CTAButtonSMS = document.getElementById("CTAButtonSMS");
CTAButtonSMS.classList.add('disabled');
const CTAButtonMMS = document.getElementById("CTAButtonMMS");
CTAButtonSMS.classList.add('disabled');

// SMS calculator
document.getElementById('SMSOption').addEventListener('change', function() {
    optionChange('SMS');
});
document.getElementById('SMSUnitCount').addEventListener('input', function() {
    inputChange('SMS');
});

// MMS calculator
document.getElementById('MMSOption').addEventListener('change', function() {
    optionChange('MMS');
});
document.getElementById('MMSUnitCount').addEventListener('input', function() {
    inputChange('MMS');
});

// Event handler for when the option changes
function optionChange(type) {
    let option = document.getElementById(`${type}Option`).value;

    // Show extra cost element if 'Dedicated number' is selected
    if (option === 'Dedicated number') {
        document.getElementById(`pricing_calculator-${type}_extra_cost`).style.display = 'block';
    } else {
        document.getElementById(`pricing_calculator-${type}_extra_cost`).style.display = 'none';
    }

    calculatePrice(type);
}

// Function to calculate and display the price
function calculatePrice(type) {
    let units = parseInt(document.getElementById(`${type}UnitCount`).value) || 0;
    let option = document.getElementById(`${type}Option`).value;
    let bundles = type === 'SMS' ? [10, 250, 1000, 5000, 20000, 100000] : [10, 100, 500, 1500, 5000, 10000];
    let prices = type === 'SMS' ? pricesSMS : pricesMMS;

    // Initialize the table to solve the coin change problem
    let table = new Array(units + bundles[bundles.length - 1] + 1).fill(Infinity);
    table[0] = 0;

    // Solve the coin change problem
    for (let i = 0; i < bundles.length; i++) {
        for (let j = bundles[i]; j < table.length; j++) {
            table[j] = Math.min(table[j], table[j - bundles[i]] + prices[i]);
        }
    }

    // Find the minimum cost
    let totalCost = Infinity;
    for (let i = units; i < table.length; i++) {
        totalCost = Math.min(totalCost, table[i]);
    }

    // Add markup if "Dedicated number" or "Alpha ID" is selected
    if (option === 'Dedicated number' || option === 'Alpha ID') {
        totalCost *= 1 + markup;
    }

    // Display total cost and cost per message
    document.getElementById(`pricing_calculator-${type}_total`).textContent = totalCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById(`pricing_calculator-${type}_per-message`).textContent = (totalCost / document.getElementById(`${type}UnitCount`).value).toFixed(3);
}

// Limit input to numeric only and to maximum 6 digits
function inputChange(type) {
    let numericInput = document.getElementById(`${type}UnitCount`);
    numericInput.value = numericInput.value.replace(/[^0-9]/g,'').replace(/(\..*)\./g, '$1');
    numericInput.value = numericInput.value.length <= 6 ? numericInput.value : numericInput.value.slice(0, 6);

		let targetButton = type === 'SMS' ? CTAButtonSMS : CTAButtonMMS;

    if(numericInput.value.length > 0) {
        targetButton.classList.remove('disabled');
    } else {
        targetButton.classList.add('disabled');
    }
    
    calculatePrice(type);
}

// Button click handlers
CTAButtonSMS.addEventListener('click', function(event) {
    if(CTAButtonSMS.classList.contains('disabled')) {
        event.preventDefault();
        document.getElementById('SMSUnitCount').focus();
    }
});

CTAButtonMMS.addEventListener('click', function(event) {
    if(CTAButtonMMS.classList.contains('disabled')) {
        event.preventDefault();
        document.getElementById('MMSUnitCount').focus();
    }
});

// Call calculatePrice to initialize the displayed price
optionChange('SMS');
optionChange('MMS');
</script>
