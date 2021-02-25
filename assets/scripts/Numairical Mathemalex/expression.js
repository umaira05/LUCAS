/* global Fraction */
/* global Num */
/* global Variable */
/* global Term */

class Expression {
	constructor(b) {
		let a = this;
		if (a instanceof Expression) {
			a.terms = [];
			let addHelper = function(terms, term) {
				let newTerms = [];
				let addedTerm = false;
				for (let i = 0; i < terms.length; i++) {
					if (!addedTerm && terms[i].like(term)) {
						let sum = terms[i].add(term);
						if (sum.coefficient.coefficient.numerator) newTerms.push(sum);
						addedTerm = true;
					} else {
						newTerms.push(terms[i]);
					}
				}
				if (!addedTerm && term.coefficient.coefficient.numerator) newTerms.push(term.copy());
				return newTerms;
			};
			if (b !== undefined) {
				if (!(b instanceof Array)) b = [b];
				for (let c of b) {
					if (c instanceof Expression) {
						for (let term of c.terms) a.terms = addHelper(a.terms, term);
					} else if (c instanceof Term) {
						a.terms = addHelper(a.terms, c);
					} else if (c instanceof Variable || c instanceof Num || c instanceof Fraction || typeof c == "number" || typeof c == "string") {
						a.terms = addHelper(a.terms, new Term([c]));
					} else {
						throw new Error("Expression initializer must be of type String, Expression, Term, Variable, Num, Fraction, or Number");
					}
				}
			}
		} else {
			return new Expression(b);
		}
	}
	
	copy() {
		let a = this;
		let b = a.terms.map(term => term.copy());
		let d = new Expression(b);
		return d;
	}
	
	add(b) {
		let a = this;
		let c = a.copy();
		let addHelper = function(terms, term) {
			let newTerms = [];
			let addedTerm = false;
			for (let i = 0; i < terms.length; i++) {
				if (!addedTerm && terms[i].like(term)) {
					let sum = terms[i].add(term);
					if (sum.coefficient.coefficient.numerator) newTerms.push(sum);
					addedTerm = true;
				} else {
					newTerms.push(terms[i].copy());
				}
			}
			if (!addedTerm && term.coefficient.coefficient.numerator) newTerms.push(term.copy());
			return newTerms;
		};
		if (b instanceof Expression) {
			for (let term of b.terms) c.terms = addHelper(c.terms, term);
		} else if (b instanceof Term) {
			c.terms = addHelper(c.terms, b);
		} else if (b instanceof Variable || b instanceof Num || b instanceof Fraction || typeof b == "number" || typeof b == "string") {
			c.terms = addHelper(c.terms, new Term([b]));
		} else {
			throw new Error("Addend must be of type String, Expression, Term, Variable, Num, Fraction, or Number");
		}
		return c;
	}
	
	subtract(b) {
		let a = this;
		let c = a.copy();
		let subtractHelper = function(terms, term) {
			let newTerms = [];
			let addedTerm = false;
			for (let i = 0; i < terms.length; i++) {
				if (!addedTerm && terms[i].like(term)) {
					let difference = terms[i].subtract(term);
					if (difference.coefficient.coefficient.numerator) newTerms.push(difference);
					addedTerm = true;
				} else {
					newTerms.push(terms[i].copy());
				}
			}
			if (!addedTerm && term.coefficient.coefficient.numerator) newTerms.push(term.multiply(-1));
			return newTerms;
		};
		if (b instanceof Expression) {
			for (let term of b.terms) c.terms = subtractHelper(c.terms, term);
		} else if (b instanceof Term) {
			c.terms = subtractHelper(c.terms, b);
		} else if (b instanceof Variable || b instanceof Num || b instanceof Fraction || typeof b == "number" || typeof b == "string") {
			c.terms = subtractHelper(c.terms, new Term([b]));
		} else {
			throw new Error("Subtrahend must be of type String, Expression, Term, Variable, Num, Fraction, or Number");
		}
		return c;
	}
	
	multiply(b) {
		let a = this;
		let c;
		if (b instanceof Expression) {
			c = new Expression();
			for (let i = 0; i < b.terms.length; i++) c = c.add(a.multiply(b.terms[i]));
		} else if (b instanceof Term) {
			c = a.copy();
			for (let i = 0; i < c.terms.length; i++) c.terms[i] = c.terms[i].multiply(b);
		} else if (b instanceof Variable || typeof b == "string") {
			c = a.multiply(new Term([b]));
		} else if (b instanceof Num || b instanceof Fraction || typeof b == "number") {
			c = a.copy();
			for (let i = 0; i < c.terms.length; i++) c.terms[i] = c.terms[i].multiply(b);
		} else {
			throw new Error("Multiplicand must be of type Expression, Term, Variable, Num, Fraction, or Number");
		}
		return c;
	}
	
	divide(b) {
		if (b instanceof Expression && b.terms.length == 1) b = b.terms[0];
		if (b instanceof Term && Object.keys(b.variables).length == 0) b = b.coefficient;
		if (b instanceof Num || b instanceof Fraction || typeof b == "number") {
			let a = this;
			let c = new Expression();
			c.terms = a.terms.map(term => term.divide(b));
			return c;
		} else {
			throw new Error("Divisor must be of type Num, Fraction, or Number");
		}
	}
	
	power(b) {
		if (typeof b == "number") {
			if (Math.sign(b) == 1 && !(b % 1)) {
				let a = this;
				let c = a.copy();
				for (let i = 1; i < b; i++) c = c.multiply(a);
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
		let b = a.terms;
		if (b.length == 0) {
			return "0";
		} else {
			let c = b.map(d => d.toString()).join(" + ");
			let d = c.replace(/\+ -/g, "- ");
			return d;
		}
	}
}