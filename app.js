/**
 * Objet calculator pour stocker l'état de la calculatrice.
 * @typedef {Object} Calculator
 * @property {string} displayValue - La valeur actuellement affichée.
 * @property {number|null} firstOperand - Le premier opérande pour l'opération.
 * @property {boolean} waitingForSecondOperand - Indique si le second opérande est attendu.
 * @property {string|null} operator - L'opérateur actuellement utilisé.
 * @property {string} operationString - La chaîne d'opérations en cours.
 */
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    operationString: ''
};

/**
 * Met à jour l'affichage de la calculatrice.
 */
function updateDisplay() {
    const display = document.querySelector('.result');
    display.value = calculator.displayValue;

    const operationDisplay = document.querySelector('.operation');
    operationDisplay.innerText = calculator.operationString;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('clear-entry')) {
        clearEntry();
        updateDisplay();
        return;
    }

    if (target.classList.contains('equal-sign')) {
        handleEqualSign();
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('percent')) {
        inputPercent();
        updateDisplay();
        return;
    }

    if (target.classList.contains('sign')) {
        inputSign();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

/**
 * Gère l'entrée des chiffres.
 * @param {string} digit - Le chiffre à ajouter.
 */
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    calculator.operationString += digit;
}

/**
 * Gère l'entrée des décimales.
 * @param {string} dot - Le caractère décimal.
 */
function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
        calculator.operationString += dot;
    }
}

/**
 * Gère l'entrée des pourcentages.
 */
function inputPercent() {
    calculator.displayValue = (parseFloat(calculator.displayValue.replace(',', '.')) / 100).toString().replace('.', ',');
    calculator.operationString += '%';
}

/**
 * Gère l'inversion du signe du nombre.
 */
function inputSign() {
    calculator.displayValue = (parseFloat(calculator.displayValue.replace(',', '.')) * -1).toString().replace('.', ',');
    calculator.operationString += '+/-';
}

/**
 * Gère les opérateurs.
 * @param {string} nextOperator - L'opérateur à appliquer.
 */
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, operationString } = calculator;
    const inputValue = parseFloat(displayValue.replace(',', '.'));

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`.replace('.', ',');
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    calculator.operationString += ` ${nextOperator} `;
}

/**
 * Objets pour les fonctions de calcul.
 */
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

/**
 * Gère le calcul du résultat.
 */
function handleEqualSign() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue.replace(',', '.'));

    if (operator && firstOperand != null) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`.replace('.', ',');

        calculator.operationString += ` = ${calculator.displayValue}`;
        calculator.firstOperand = null;
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
    }
}

/**
 * Réinitialise la calculatrice.
 */
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.operationString = '';
}

/**
 * Efface la dernière entrée.
 */
function clearEntry() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
    calculator.operationString = calculator.operationString.slice(0, -1);
}
