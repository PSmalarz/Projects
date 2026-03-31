let currentInput = '0';
let previousInput = '';
let operator = null;

const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    previousDisplay.innerText = operator ? `${previousInput} ${operator}` : previousInput;
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function chooseOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') compute();
    operator = op;
    previousInput = currentInput;
    currentInput = '0';
    updateDisplay();
}

// Funkcje Naukowe
function scientific(type) {
    if (!isSubscribed()) {
        showTrialModal();
        return;
    }

    let val = parseFloat(currentInput);
    let result;

    switch(type) {
        case 'sin': result = Math.sin(val); break;
        case 'cos': result = Math.cos(val); break;
        case 'tan': result = Math.tan(val); break;
        case 'sqrt': result = Math.sqrt(val); break;
        case 'log': result = Math.log10(val); break;
        case 'pow': result = Math.pow(val, 2); break;
        case 'pi': result = Math.PI; break;
        default: return;
    }

    currentInput = result.toFixed(8).replace(/\.?0+$/, ""); // Zaokrąglenie i usunięcie zer
    updateDisplay();
}

// System subskrypcji
function isSubscribed() {
    const subDate = localStorage.getItem('calc_premium_expiry');
    if (!subDate) return false;
    return new Date().getTime() < parseInt(subDate);
}

function compute() {
    if (!isSubscribed()) {
        showTrialModal();
        return;
    }

    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': computation = current === 0 ? "Error" : prev / current; break;
        default: return;
    }

    currentInput = computation.toString();
    operator = null;
    previousInput = '';
    updateDisplay();
}

// UI Modali
const overlay = document.getElementById('modal-overlay');
const trialModal = document.getElementById('trial-modal');
const successModal = document.getElementById('success-modal');

function showTrialModal() {
    overlay.style.display = 'flex';
    trialModal.classList.remove('hidden');
    successModal.classList.add('hidden');
}

function closeModal() {
    overlay.style.display = 'none';
}

function processPayment() {
    trialModal.classList.add('hidden');
    successModal.classList.remove('hidden');
    
    // Symulacja API bankowego
    setTimeout(() => {
        document.querySelector('.loader-container').classList.add('hidden');
        document.getElementById('success-title').innerText = 'Płatność zatwierdzona';
        document.getElementById('success-text').innerText = 'Dostęp Premium, odblokowany na 24h'; 
        document.getElementById('continue-btn').classList.remove('hidden');
    }, 2500);
}

function activateSubscription() {
    const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('calc_premium_expiry', expiry.toString());
    closeModal();
    // Powrót do loader'a dla następnego razu
    document.querySelector('.loader-container').classList.remove('hidden');
    document.getElementById('continue-btn').classList.add('hidden');
}

// Keyboard
window.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteNumber();
    if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
});

function clearDisplay() { currentInput = '0'; previousInput = ''; operator = null; updateDisplay(); }
function deleteNumber() { currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0'; updateDisplay(); }