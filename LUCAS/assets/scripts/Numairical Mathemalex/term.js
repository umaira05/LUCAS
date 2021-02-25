/* global Fraction */
/* global Num */
/* global Variable */

class Term {
	constructor(b) {
		let a = this;
		a.variables = {};
		a.coefficient = new Num();
		if (b !== undefined) {
			if (!(b instanceof Array)) b = [b];
			for (let c of b) {
				if (typeof c == "string") c = new Variable(c);
				if (c instanceof Term) {
					a.coefficient = a.coefficient.multiply(c.coefficient);
					Object.keys(c.variables).forEach(name => a.variables[name] = (a.variables[name] || 0) + c.variables[name]);
				} else if (c instanceof Variable) {
					a.variables[c.name] = (a.variables[c.name] || 0) + c.degree;
				} else if (c instanceof Num || c instanceof Fraction || typeof c == "number") {
					a.coefficient = a.coefficient.multiply(c);
				} else {
					throw new Error("Term initializer must be of type Num, Variable, Fraction, or Number");
				}
			}
		}
	}
	
	copy() {
		let a = this;
		let b = Object.keys(a.variables).map(name => new Variable(name, a.variables[name])).concat(a.coefficient.copy());
		let c = new Term(b);
		return c;
	}
	
	like(b) {
		let a = this;
		if (b instanceof Term) {
			let aVariableNames = Object.keys(a.variables);
			let bVariableNames = Object.keys(b.variables);
			if (aVariableNames.length == bVariableNames.length && a.coefficient.like(b.coefficient)) {
				return aVariableNames.every(function(variableName) {
					return (bVariableNames.includes(variableName) && a.variables[variableName] == b.variables[variableName]);
				});
			}
			return false;
		} else {
			throw new Error("Terms can only be like with other Terms");
		}
	}
	
	multiply(b) {
		let a = this;
		let c = a.copy();
		if (typeof b == "string") b = new Variable(b);
		if (b instanceof Term) {
			c.coefficient = c.coefficient.multiply(b.coefficient);
			Object.keys(b.variables).forEach(name => c.variables[name] = (c.variables[name] || 0) + b.variables[name]);
		} else if (b instanceof Variable) {
			c.variables[b.name] = (c.variables[b.name] || 0) + b.degree;
		} else if (b instanceof Num || b instanceof Fraction || typeof b == "number") {
			c.coefficient = c.coefficient.multiply(b);
		} else {
			throw new Error("Multiplicand must be of type Term, Variable, Num, Fraction, or Number");
		}
		return c;
	}
	
	divide(b) {
		let a = this;
		let c = a.copy();
		if (b instanceof Term && Object.keys(b.variables).length == 0) b = b.coefficient;
		if (b instanceof Num || b instanceof Fraction || typeof b == "number") {
			c.coefficient = c.coefficient.divide(b);
		} else {
			throw new Error("Divisor must be of type Num, Fraction, or Number");
		}
		return c;
	}
	
	add(b) {
		let a = this;
		let c = a.copy();
		if (typeof b == "string" || b instanceof Variable) b = new Term([b]);
		if (b instanceof Term) {
			if (c.like(b)) {
				c.coefficient = c.coefficient.add(b.coefficient);
			} else {
				throw new Error("Addends must be like terms");
			}
		} else {
			throw new Error("Addend must be of type Term or Variable");
		}
		return c;
	}
	
	subtract(b) {
		let a = this;
		let c = a.copy();
		if (typeof b == "string" || b instanceof Variable) b = new Term([b]);
		if (b instanceof Term) {
			if (c.like(b)) {
				c.coefficient = c.coefficient.subtract(b.coefficient);
			} else {
				throw new Error("Minuend and Subtrahend must be like terms");
			}
		} else {
			throw new Error("Subtrahend must be of type Term or Variable");
		}
		return c;
	}
	
	power(b) {
		if (typeof b == "number") {
			if (Math.sign(b) == 1 && !(b % 1)) {
				let a = this;
				let c = a.copy();
				c.coefficient = c.coefficient.power(b);
				Object.keys(c.variables).forEach(name => c.variables[name] *= b);
				return c;
			} else {
				throw new Error("Exponent must be a natural number");
			}
		} else {
			throw new Error("Exponent must be of type Number");
		}
	}
	
	toString() {
		let a = this;
		let b = a.coefficient.toString();
		if (b == "0") {
			return b;
		} else {
			let c = a.variables;
			let d = Object.keys(c);
			d.sort();
			let e;
			if (d.length == 0) {
				e = b;
			} else {
				e = (b == "1") ? "" : ((b == "-1") ? "-" : b);
				if (d.length == 1 && c[d[0]] == 1) {
					e += d[0];
				} else {
					d.forEach(f => e += new Variable(f, c[f]).toString());
				}
			}
			return e;
		}
	}
}