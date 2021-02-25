let Decimal = function() {
    let a = arguments.length ? arguments[0] : "";
    if (this instanceof Decimal) {
        if (a instanceof Decimal) {
            this.sign = a.sign;
            this.leftDigits = a.leftDigits.slice(0);
            this.rightDigits = a.rightDigits.slice(0);
        } else {
            try {
                a = a.toString();
            } catch(err) {
                throw new Error("Invalid number");
            }
            if (!(a.match(/^-?\d*\.?\d*$/))) throw new Error("Invalid number");
            this.sign = a.charAt(0) != "-";
            a = this.sign ? a : a.slice(1);
            let decimalSplit = a.split(".");
            if (decimalSplit.length == 1) decimalSplit.push("");
            this.leftDigits = decimalSplit[0].split("").map(x => +x);
            this.rightDigits = decimalSplit[1].split("").map(x => +x);
        }
    } else {
        return new Decimal(a);
    }
    while (this.leftDigits[0] == 0) this.leftDigits.shift();
    while (this.rightDigits[this.rightDigits.length - 1] == 0) this.rightDigits.pop();
    if (!(this.leftDigits.length + this.rightDigits.length)) this.sign = true;
};

Decimal.prototype.negative = function() {
    let a = new Decimal(this);
    a.sign = !a.sign;
    return a;
};

Decimal.prototype.abs = Decimal.prototype.absolute = function() {
    let a = new Decimal(this);
    a.sign = true;
    return a;
};

Decimal.prototype.greaterThan = Decimal.prototype.greater = function(b) {
    let a = new Decimal(this);
    b = new Decimal(b);
    if (a.sign && b.sign) {
        if (a.leftDigits.length > b.leftDigits.length) {
            return true;
        } else if (a.leftDigits.length < b.leftDigits.length) {
            return false;
        } else {
            let aDigits = a.leftDigits.concat(a.rightDigits);
            let bDigits = b.leftDigits.concat(b.rightDigits);
            let minDigits = Math.min(aDigits.length, bDigits.length);
            for (let i = 0; i < minDigits; i++) {
                if (aDigits[i] > bDigits[i]) {
                    return true;
                } else if (aDigits[i] < bDigits[i]) {
                    return false;
                }
            }
            if (aDigits.length > bDigits.length) {
                return true;
            } else if (aDigits.length < bDigits.length) {
                return false;
            }
        }
    } else if (a.sign && !b.sign) {
        return true;
    } else if (!a.sign && b.sign) {
        return false;
    } else if (!a.sign && !b.sign) {
        a.sign = true;
        b.sign = true;
        return !a.greaterThan(b);
    }
};

Decimal.prototype.lessThan = Decimal.prototype.less = function(b) {
    let a = new Decimal(this);
    b = new Decimal(b);
    if (a.sign && b.sign) {
        if (a.leftDigits.length > b.leftDigits.length) {
            return false;
        } else if (a.leftDigits.length < b.leftDigits.length) {
            return true;
        } else {
            let aDigits = a.leftDigits.concat(a.rightDigits);
            let bDigits = b.leftDigits.concat(b.rightDigits);
            let minDigits = Math.min(aDigits.length, bDigits.length);
            for (let i = 0; i < minDigits; i++) {
                if (aDigits[i] > bDigits[i]) {
                    return false;
                } else if (aDigits[i] < bDigits[i]) {
                    return true;
                }
            }
            if (aDigits.length > bDigits.length) {
                return false;
            } else if (aDigits.length < bDigits.length) {
                return true;
            }
        }
    } else if (a.sign && !b.sign) {
        return false;
    } else if (!a.sign && b.sign) {
        return true;
    } else if (!a.sign && !b.sign) {
        a.sign = true;
        b.sign = true;
        return !a.lessThan(b);
    }
};

Decimal.prototype.equalTo = Decimal.prototype.equal = Decimal.prototype.equals = function(b) {
    let a = new Decimal(this);
    b = new Decimal(b);
    if ((a.sign != b.sign) || (a.leftDigits.length != b.leftDigits.length) || (a.rightDigits.length != b.rightDigits.length)) {
        return false;
    } else {
        let aDigits = a.leftDigits.concat(a.rightDigits);
        let bDigits = b.leftDigits.concat(b.rightDigits);
        for (let i = 0; i < aDigits.length; i++) {
            if (aDigits[i] != bDigits[i]) {
                return false;
            }
        }
    }
    return true;
};

Decimal.prototype.toString = function() {
    return (this.sign ? "" : "-") + (this.leftDigits.length ? this.leftDigits.join("") : "0") + (this.rightDigits.length ? "." + this.rightDigits.join("") : "");
};

Decimal.prototype.plus = Decimal.prototype.add = function(b) {
    let a = new Decimal(this);
    b = new Decimal(b);
    if (a.sign && b.sign) {
        while (a.rightDigits.length < b.rightDigits.length) {
            a.rightDigits.push(0);
        }
        while (b.rightDigits.length < a.rightDigits.length) {
            b.rightDigits.push(0);
        }
        while (a.leftDigits.length < b.leftDigits.length) {
            a.leftDigits.unshift(0);
        }
        while (b.leftDigits.length < a.leftDigits.length) {
            b.leftDigits.unshift(0);
        }
        let aDigits = a.leftDigits.concat(a.rightDigits);
        let bDigits = b.leftDigits.concat(b.rightDigits);
        let cDigits = [];
        let carry = false;
        for (let place = aDigits.length - 1; place >= 0; place--) {
            let sum = aDigits[place] + bDigits[place] + carry;
            carry = sum >= 10;
            cDigits.unshift(sum - 10 * carry);
        }
        cDigits.unshift(+carry);
        let cString = cDigits.slice(0, cDigits.length - a.rightDigits.length).join("") + "." + cDigits.slice(cDigits.length - a.rightDigits.length).join("");
        let c = new Decimal(cString);
        return c;
    } else if (a.sign && !b.sign) {
        b.sign = true;
        return a.minus(b);
    } else if (!a.sign && b.sign) {
        a.sign = true;
        return b.minus(a);
    } else if (!a.sign && !b.sign) {
        a.sign = true;
        b.sign = true;
        let c = a.plus(b);
        c.sign = false;
        return c;
    }
};

Decimal.prototype.minus = Decimal.prototype.subtract = function(b) {
    let a = new Decimal(this);
    b = new Decimal(b);
    if (a.sign && b.sign) {
        if (a.lessThan(b)) {
            let c = b.minus(a);
            c.sign = false;
            return c;
        } else {
            while (a.rightDigits.length < b.rightDigits.length) {
                a.rightDigits.push(0);
            }
            while (b.rightDigits.length < a.rightDigits.length) {
                b.rightDigits.push(0);
            }
            while (a.leftDigits.length < b.leftDigits.length) {
                a.leftDigits.unshift(0);
            }
            while (b.leftDigits.length < a.leftDigits.length) {
                b.leftDigits.unshift(0);
            }
            let aDigits = a.leftDigits.concat(a.rightDigits);
            let bDigits = b.leftDigits.concat(b.rightDigits);
            let cDigits = [];
            let carry = false;
            for (let place = aDigits.length - 1; place >= 0; place--) {
                let difference = aDigits[place] - bDigits[place] - carry;
                carry = difference < 0;
                cDigits.unshift(difference + 10 * carry);
            }
            let cString = cDigits.slice(0, cDigits.length - a.rightDigits.length).join("") + "." + cDigits.slice(cDigits.length - a.rightDigits.length).join("");
            let c = new Decimal(cString);
            return c;
        }
    } else if (a.sign && !b.sign) {
        b.sign = true;
        return a.plus(b);
    } else if (!a.sign && b.sign) {
        a.sign = true;
        let c = a.plus(b);
        c.sign = false;
        return c;
    } else if (!a.sign && !b.sign) {
        a.sign = true;
        b.sign = true;
        return b.minus(a);
    }
};

Decimal.prototype.times = Decimal.prototype.multiply = function(b) {
    let a = new Decimal(this);
    b = new Decimal(b);
    let finalSign = (a.sign ? 1 : -1) * (b.sign ? 1 : -1) == 1;
    a.sign = true;
    b.sign = true;
    let aDigits = a.leftDigits.concat(a.rightDigits).reverse();
    let bDigits = b.leftDigits.concat(b.rightDigits).reverse();
    let rightDigitLengths = a.rightDigits.length + b.rightDigits.length;
    let partialProducts = [];
    let zeros = 0;
    for (let aDigit of aDigits) {
        let carry = 0;
        let cDigits = [];
        for (let i = 0; i < zeros; i++) {
            cDigits.push(0);
        }
        for (let bDigit of bDigits) {
            let product = aDigit * bDigit + carry;
            carry = Math.floor(product / 10);
            cDigits.push(product % 10);
        }
        if (carry) cDigits.push(carry);
        partialProducts.push(cDigits);
        zeros += 1;
    }
    let c = new Decimal();
    partialProducts.forEach(p => {c = c.plus(p.reverse().join(""))});
    for (let i = 0; i < rightDigitLengths; i++) {
        c.rightDigits.unshift(c.leftDigits.length ? c.leftDigits.pop() : 0);
    }
    c.sign = finalSign;
    return new Decimal(c);
};

Decimal.prototype.dividedBy = Decimal.prototype.divide = Decimal.prototype.over = function(b, rightDigitsLength = 0) {
    let a = new Decimal(this);
    b = new Decimal(b);
    if (b.equals("0")) {
        throw new Error("Cannot divide by zero");
    }
    let finalSign = (a.sign ? 1 : -1) * (b.sign ? 1 : -1) == 1;
    a.sign = true;
    b.sign = true;
    let aShift = 0;
    while (a.rightDigits.length) {
        a.leftDigits.push(a.rightDigits.shift());
        aShift += 1;
    }
    while (a.leftDigits[a.leftDigits.length - 1] == 0) {
        a.leftDigits.pop();
        aShift -= 1;
    }
    let bShift = 0;
    while (b.rightDigits.length) {
        b.leftDigits.push(b.rightDigits.shift());
        bShift += 1;
    }
    while (b.leftDigits[b.leftDigits.length - 1] == 0) {
        b.leftDigits.pop();
        bShift -= 1;
    }
    let c = new Decimal();
    let partialDividend = new Decimal();
    for (let i = a.leftDigits.length + bShift - aShift + rightDigitsLength; i > 0; i--) {
        partialDividend.leftDigits.push(a.leftDigits.length ? a.leftDigits.shift() : 0);
        let counter = new Decimal();
        let partialQuotient = 0;
        while (true) {
            let newCounter = counter.plus(b);
            if (newCounter.greaterThan(partialDividend)) {
                break;
            } else {
                counter = newCounter;
                partialQuotient++;
            }
        }
        c.leftDigits.push(partialQuotient);
        partialDividend = partialDividend.minus(counter);
        if (!a.leftDigits.length && partialDividend.equals("0")) {
            rightDigitsLength -= i - 1;
            break;
        }
    }
    for (let i = 0; i < rightDigitsLength; i++) {
        c.rightDigits.unshift(c.leftDigits.length ? c.leftDigits.pop() : 0);
    }
    for (let i = 0; i > rightDigitsLength; i--) {
        c.leftDigits.push(c.rightDigits.length ? c.rightDigits.shift() : 0);
    }
    c.sign = finalSign;
    return new Decimal(c);
};

let test = {
    addition: function(a, b) {
        return String((new Decimal(a)).add(b));
    },
    subtraction: function(a, b) {
        return String((new Decimal(a)).subtract(b));
    },
    multiplication: function(a, b) {
        return String((new Decimal(a)).multiply(b));
    },
    division: function(a, b, rightDigitsLength = 0) {
        return String((new Decimal(a)).divide(b, rightDigitsLength));
    }
};