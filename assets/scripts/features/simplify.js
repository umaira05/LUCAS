/* global Fraction */
/* global Radical */
/* global Num */
/* global Expression */

let parseInfix = exprStr => {
    if (typeof exprStr == "string") {
        exprStr = exprStr.replace(/\s+/g, "");
        while (/-\+/.test(exprStr)) exprStr = exprStr.replace(/-\+/g, "+-");
        exprStr = exprStr.replace(/--/g, "+");
        exprStr = exprStr.replace(/-/g, "+-");
        exprStr = exprStr.replace(/(^|\+|\-|\*|\/|\^|sqrt|\u221A|\()\+-/g, "$1-");
        exprStr = exprStr.replace(/\++/g, "+");
        let parsed = [];
        let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-"];
        let operators = ["(", ")", "^", "*", "/", "+"];
        let queue = "";
        let type = -1;
        for (let char of exprStr) {
            let currentType = 0;
            if (numbers.includes(char)) {
                currentType = 1;
            } else if (operators.includes(char)) {
                currentType = 2;
            }
            if (type == currentType && type != 2) {
                queue += char;
            } else {
                if (queue == "-") {
                    parsed.push("-1", "*");
                } else if (type != -1) {
                    parsed.push(queue);
                    if ((queue != "sqrt" && queue != "\u221A") && (type == 1 || type == 0 || queue == ")") && (currentType == 0 || currentType == 1 || char == "(")) parsed.push("*");
                }
                queue = char;
                type = currentType;
            }
        }
        parsed.push(queue);
        return parsed;
    } else {
        throw new Error("Input should be of type String");
    }
};

let infixToPostfix = parsed => {
    let operators = ["(", ")", "^", "*", "/", "+", "sqrt", "\u221A"];
    let output = [];
    let stack = [];
    let precedences = {"+": 1, "*": 2, "/": 2, "^": 3, "sqrt": 3};
    let associativities = {"+": "left", "*": "left", "/": "left", "^": "right", "sqrt": "right", "\u221A": "right"};
    for (let token of parsed) {
        if (token == "(") {
            stack.push("(");
        } else if (token == ")") {
            let currentSymbol = stack.pop();
            while (currentSymbol != "(") {
                output.push(currentSymbol);
                currentSymbol = stack.pop();
            }
        } else if (operators.includes(token)) {
            if (stack.length == 0 || stack[stack.length - 1] == "(") {
                stack.push(token);
            } else {
                let topOfStack = stack.pop();
                while (precedences[token] < precedences[topOfStack] || (precedences[token] == precedences[topOfStack] && associativities[token] == "left")) {
                    output.push(topOfStack);
                    topOfStack = stack.pop();
                    if (topOfStack == undefined) break;
                }
                if (topOfStack !== undefined) stack.push(topOfStack);
                stack.push(token);
            }
        } else {
            output.push(token);
        }
    }
    while (stack.length) {
        output.push(stack.pop());
    }
    console.log(output);
    return output;
};

let objectify = token => {
    if (typeof token == "string") {
        if (/^-?\d*\.?\d*$/.test(token)) {
            return new Num(+token);
        } else if (["+", "*", "/", "^", "sqrt", "\u221A"].includes(token)) {
            return token;
        } else {
            return new Expression(token);
        }
    } else {
        throw new Error("Token must be of type string");
    }
};

let evalPostfix = postfix => {
    let stack = [];
    for (let i = 0; i < postfix.length; i++) {
        let token = objectify(postfix[i]);
        if (typeof token == "string") {
            if (token == "+") {
                let operand2 = stack.pop();
                let operand1 = stack.pop();
                if (operand1 instanceof Num && operand2 instanceof Num && operand1.radical.equals(operand2.radical)) {
                    let a = operand1.add(operand2);
                    stack.push(a);
                } else {
                    let a = new Expression(operand1);
                    let b = a.add(operand2);
                    stack.push(b);
                }
            } else if (token == "*") {
                let operand2 = stack.pop();
                let operand1 = stack.pop();
                if (operand1 instanceof Num && operand2 instanceof Num) {
                    let a = operand1.multiply(operand2);
                    stack.push(a);
                } else {
                    let a = new Expression(operand1);
                    let b = a.multiply(operand2);
                    stack.push(b);
                }
            } else if (token == "/") {
                let operand2 = stack.pop();
                let operand1 = stack.pop();
                if (operand1 instanceof Num) {
                    let a = operand1.divide(operand2);
                    stack.push(a);
                } else {
                    let a = new Expression(operand1);
                    let b = a.divide(operand2);
                    stack.push(b);
                }
            } else if (token == "^") {
                let operand2 = stack.pop();
                let operand1 = stack.pop();
                if (operand1 instanceof Num && operand2 instanceof Num && operand2.radical.equals(new Radical(1))) {
                    let a = operand1.power(operand2.coefficient);
                    stack.push(a);
                } else {
                    let a = new Expression(operand1);
                    let b = operand2;
                    if (b instanceof Num && b.coefficient.denominator == 1 && b.radical.equals(new Radical(1))) b = b.coefficient.numerator;
                    let c = a.power(b);
                    stack.push(c);
                }
            } else if (token == "sqrt" || token == "\u221A") {
                let operand1 = stack.pop();
                let a = operand1.power(new Fraction(1, 2));
                stack.push(a);
            } else {
                stack.push(token);
            }
        } else {
            stack.push(token);
        }
    }
    let result = stack.pop();
    let output = new Expression(result);
    return output;
};

let simplifyExpr = exprStr => evalPostfix(infixToPostfix(parseInfix(exprStr)));