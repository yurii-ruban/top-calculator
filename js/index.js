// Dummy script

function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function Operation() {
    this.matcher = new Map();
    matcher.set('+', add);
    matcher.set('-', substract);
    matcher.set('*', multiply);
    matcher.set('/', divide);

    this.leftOperand = null;
    this.rightOperand = null;
    this.operator = null;
}

function operate(operation) {
    const result = operation.operation();
    return result;
}

function updateDisplay(value) {
    const display = document.querySelector("#display");
    display.textContent = value;
}

const mainOperation = new Operation();

