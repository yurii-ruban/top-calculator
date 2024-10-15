let currentInput = "0";
const MAX_INPUT_SIZE = 10;
const COMMA = ".";
const ERROR = "Error";
const mainOperation = new Operation();

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

    this.leftOperand = null;
    this.rightOperand = null;
    this.operator = null;

    this.operation = function() {
        if (!this.leftOperand || !this.rightOperand || !this.operation) {
            console.error ("Wrong conditions!");
            return 0;
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
    mainOperation.leftOperand = null;
    mainOperation.rightOperand = null;
    mainOperation.operator = null;

    const inputField = document.querySelector("#display");
    inputField.value = currentInput;
}

function updateState(result) {
    const inputField = document.querySelector("#display");
    currentInput = result;
    inputField.value = currentInput;
    mainOperation.leftOperand = currentInput;
    mainOperation.rightOperand = null;
    mainOperation.operator = null;
}

function initListeners() {
    const pad = document.querySelector("#pad");
    const inputField = document.querySelector("#display");
    inputField.value = currentInput;

    pad.addEventListener("click", (event) => {
        const classes = event.target.classList;
        // Check whether it's numeric value or comma
        if (classes.contains("operand") || (classes.contains("pad-item") && event.target.children[0].classList.contains("operand"))) {
            
            // Operation is set already. Then we need to clear the screen
            if (mainOperation.operator && currentInput === mainOperation.leftOperand) {
                currentInput = "0";
                inputField.value = currentInput;
            }

            if (currentInput.length < MAX_INPUT_SIZE) {
                const text = getTextFromButton(event.target);
                if (text === COMMA && currentInput.includes(COMMA) || currentInput === ERROR) {
                    return;
                }
                else if (currentInput === "0" && text !== COMMA) {
                    currentInput = text;
                } 
                else {
                    currentInput += text;
                }
                inputField.value = currentInput;
            }
        }
        
        // Check whether it's arifmetic operator
        else if (classes.contains("operator") || (classes.contains("pad-item") && event.target.children[0].classList.contains("operator"))) {
            const text = getTextFromButton(event.target);
            
            mainOperation.leftOperand = currentInput;

            // When we click + and + again, etc. Then perform the operation and update
            if (mainOperation.operator) {
                if (mainOperation.rightOperand) {
                    const result = operate();
                    updateState(result);
                }
            }

            mainOperation.operator = text;
        }

        else if (classes.contains("util") || (classes.contains("pad-item") && event.target.children[0].classList.contains("util"))) {
            if (event.target.id === "clear" || event.target.firstChild.id === "clear") {
                resetState();
            } else if (event.target.id === "result" || event.target.children[0].id === "result") {

                if (!mainOperation.leftOperand) return;

                mainOperation.rightOperand = currentInput;
                const result = operate();
                updateState(result);
            }
        }
    })
}

function operate() {
    return mainOperation.operation();
}

initListeners();

