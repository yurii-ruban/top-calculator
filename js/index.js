let currentInput = "0";
const MAX_INPUT_SIZE = 10;
const COMMA = ".";
const ERROR = "Error";
const mainOperation = new Operation();

let numbersStack = [];
let signsStack = [];
let inputState = "Clearable"; // Clearable, Input, Calculation - set input panel behavior
let currentSign = null; // Need to clarify whether some operation is being performed

function add(a, b) {
    return Number(a) + Number(b);
}

function substract(a, b) {
    return Number(a) - Number(b);
}

function multiply(a, b) {
    return Number(a) * Number(b);
}

function divide(a, b) {
    return Number(a) / Number(b);
}

function percent(a) {
    return a / 100;
}

function isError(value) {
    return value === ERROR || value == "Infinity" || isNaN(Number(value));
}

function cut(value, length) {
    return Number(value.slice(0, length));
}

function Operation() {
    this.matcher = new Map();
    this.matcher.set('+', add);
    this.matcher.set('-', substract);
    this.matcher.set('x', multiply);
    this.matcher.set('/', divide);
    this.matcher.set('%', percent);

    this.leftOperand = null;
    this.rightOperand = null;
    this.operator = null;

    this.operation = function() {
        if (!this.leftOperand || !this.rightOperand || !this.operator) {
            console.error ("Wrong conditions!");
            return 0;
        }

        if (this.operator === "=") {
            return this.leftOperand;   
        }

        let result = this.matcher.get(this.operator)(this.leftOperand, this.rightOperand);

        if (isError(this.leftOperand) || isError(this.rightOperand) || isError(result)) {
            return ERROR;   
        }

        if (result.toString().length > MAX_INPUT_SIZE) {
            result = cut(result.toString(), MAX_INPUT_SIZE);
        }

        return result;
    }
}

function getTextFromButton(elem) {
    if (elem.children.length === 0) {
        return elem.textContent;
    }
    return Array.from(elem.children)[0].textContent;
}

function resetState() {
    currentInput = "0";
    inputState = "Clearable";
    numbersStack = [];
    signsStack = [];
    mainOperation.leftOperand = null;
    mainOperation.rightOperand = null;
    mainOperation.operator = null;
    currentSign = null;

    const inputField = document.querySelector("#display");
    inputField.value = currentInput;
}

function updateState(result) {
    const inputField = document.querySelector("#display");
    currentInput = String(result);
    numbersStack.unshift(result);
    inputField.value = currentInput;
    mainOperation.rightOperand = null;
    mainOperation.leftOperand = null;
    mainOperation.operator = null;
    currentSign = null;
}

function initListeners() {
    const pad = document.querySelector("#pad");
    const inputField = document.querySelector("#display");
    inputField.value = currentInput;

    pad.addEventListener("click", (event) => {
        const classes = event.target.classList;
        // Check whether it's numeric value or comma
        if (classes.contains("operand")) {
            if (currentInput.length < MAX_INPUT_SIZE) {
                const text = getTextFromButton(event.target);
                if (text === COMMA && currentInput.includes(COMMA) || currentInput === ERROR) {
                    return;
                }
                else if ((inputState === "Clearable" || inputState === "Calculation") && text !== COMMA) {
                    currentInput = text;
                    inputState = "Input";
                } 
                else {
                    currentInput += text;
                }
                inputField.value = currentInput;
            }
        }
        
        // Check whether it's arifmetic operator
        else if (classes.contains("operator")) {
            const sign = getTextFromButton(event.target);
            numbersStack.unshift(currentInput);
            signsStack.unshift(sign);

            // Perform percent in-place with displaying result immedietely
            if (sign === "%") {
                mainOperation.leftOperand = numbersStack[0];
                mainOperation.rightOperand = 100;
                mainOperation.operator = signsStack[0];
                const result = operate();
                updateState(result);
                return;
            }

            // Press operation multiple times without using equals
            if (currentSign || sign === "%") {
                mainOperation.rightOperand = numbersStack[0];
                mainOperation.leftOperand = numbersStack[1] ?? mainOperation.rightOperand;
                mainOperation.operator = signsStack[1] ?? signsStack[0]; // Perform previous operation and just save current for the future
            }

            // Commit current input and operation
            inputState = "Calculation";
            currentSign = sign;
        }

        else if (classes.contains("util")) {
            if (event.target.id === "clear") {
                resetState();
            } else if (event.target.id === "result") {
                if (inputState === "Calculation" || inputState === "Input") {
                    numbersStack.unshift(currentInput);

                    mainOperation.rightOperand = numbersStack[0];
                    mainOperation.leftOperand = numbersStack[1] ?? mainOperation.rightOperand;
                    mainOperation.operator = signsStack[0] ?? "=";
                    const result = operate();
                    updateState(result);
                    inputState = "Clearable";
                }
            }
            else if (event.target.id === "back") {
                const inputField = document.querySelector("#display");
                
                if (currentInput.length === 1) {
                    currentInput = "0";
                    inputState = "Clearable";
                }
                else {
                    currentInput = currentInput.slice(0, currentInput.length - 1);
                }
                inputField.value = currentInput;
            }
        }
    })
}

function operate() {
    return mainOperation.operation();
}

initListeners();

