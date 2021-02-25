/* global gcd */
/* global Radical */

class Fraction {
	constructor(b = 0, c = 1) {
		let a = this;
		if (typeof b == "number" && typeof c == "number") {
			if (!c) throw new Error("Cannot divide by zero");
			a.numerator = b;
			a.denominator = c;
			a.simplify();
		} else {
			throw new Error("Numerator and denominator must be of type Number");
		}
	}
	
	copy() {
		let a = this;
		let b = a.numerator;
		let c = a.denominator;
		let d = new Fraction(b, c);
		return d;
	}
	
	multiply(b) {
		let a = this;
		if (b instanceof Fraction) {
			let c = a.numerator * b.numerator;
			let d = a.denominator * b.denominator;
			let e = new Fraction(c, d);
			return e;
		} else if (typeof b == "number") {
			let c = a.copy();
			c.numerator *= b;
			c.simplify();
			return c;
		} else {
			throw new Error("Multiplicand must be of type Fraction or Number");
		}
	}
	
	divide(b) {
		let a = this;
		if (b instanceof Fraction) {
			let c = a.numerator * b.denominator;
			let d = a.denominator * b.numerator;
			let e = new Fraction(c, d);
			return e;
		} else if (typeof b == "number") {
			let c = a.copy();
			c.denominator *= b;
			c.simplify();
			return c;
		} else {
			throw new Error("Divisor must be of type Fraction or Number");
		}
	}
	
	add(b) {
		let a = this;
		if (b instanceof Fraction) {
			let c = a.numerator * b.denominator + a.denominator * b.numerator;
			let d = a.denominator * b.denominator;
			let e = new Fraction(c, d);
			return e;
		} else if (typeof b == "number") {
			let c = a.copy();
			c.numerator += c.denominator * b;
			c.simplify();
			return c;
		} else {
			throw new Error("Addend must be of type Fraction or Number");
		}
	}
	
	subtract(b) {
		let a = this;
		if (b instanceof Fraction) {
			let c = a.numerator * b.denominator - a.denominator * b.numerator;
			let d = a.denominator * b.denominator;
			let e = new Fraction(c, d);
			return e;
		} else if (typeof b == "number") {
		   let c = a.copy();
			c.numerator -= c.denominator * b;
			c.simplify();
			return c;
		} else {
			throw new Error("Subtrahend must be of type Fraction or Number");
		}
	}
	
	power(b) {
		let a = this;
		if (b instanceof Fraction) {
			if (b.denominator == 1) {
				return a.power(b.numerator);
			} else {
				let c = new Radical(a.power(b.numerator), b.denominator);
				let d = c.radicand.numerator;
				let e = c.radicand.denominator;
				if (d ** (1 / b.denominator) % 1 == 0 && e ** (1 / b.denominator) % 1 == 0) {
					let g = new Fraction(1);
					if (Math.sign(b.numerator) == 1) {
						g = new Fraction(d ** (1 / b.denominator), e ** (1 / b.denominator));
					} else if (Math.sign(b.numerator) == -1) {
						g = new Fraction(e ** (1 / b.denominator), d ** (1 / b.denominator));
					}
					return g;
				} else {
					return c;
				}
			}
		} else if (typeof b == "number") {
			if (Number.isInteger(b)) {
				if (Math.sign(b) == 1) {
					let c = a.numerator ** b;
					let d = a.denominator ** b;
					let e = new Fraction(c, d);
					return e;
				} else if (Math.sign(b) == -1) {
					let c = a.demoninator ** (-1 * b);
					let d = a.numerator ** (-1 * b);
					let e = new Fraction(c, d);
					return e;
				} else {
					let c = new Fraction(1);
					return c;
				}
			} else {
				let c = new Fraction(b);
				return a.power(c);
			}
		} else {
			throw new Error("Exponent must be of type Number or Fraction");
		}
	}
	
	simplify() {
		let a = this;
		let b = a.numerator;
		let c = a.denominator;
		if (b) {
			while (b % 1 || c % 1) {
				b *= 10;
				c *= 10;
			}
			let d = gcd(b, c);
			b /= d;
			c /= d;
			if (Math.sign(b) == 1 && Math.sign(c) == -1) {
				b *= -1;
				c *= -1;
			}
			a.numerator = b;
			a.denominator = c;
		} else {
			a.numerator = 0;
			a.denominator = 1;
		}
	}
	
	equals(b) {
		let a = this;
		return a.numerator == b.numerator && a.denominator == b.denominator;
	}
	
	toString() {
		let a = this;
		let b = a.numerator.toString();
		let c = a.denominator.toString();
		let d = b;
		if (c != "1") d += "/" + c;
		return d;
	}
}