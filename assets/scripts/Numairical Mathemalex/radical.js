/* global Fraction */
/* global lcm */

class Radical {
	constructor(b = 0, c = 2) {
		let a = this;
		if (b instanceof Fraction) {
			a.radicand = b;
		} else if (typeof b == "number") {
			a.radicand = new Fraction(b);
		} else {
			throw new Error("Radicand must be of type Number or Fraction");
		}
		if (typeof c == "number") {
			if (!(c % 1) && c >= 2) {
				a.index = c;
			} else {
				throw new Error("Index must be an integer with a value >= 2");
			}
		} else {
			throw new Error("Index must be of type Number");
		}
	}
	
	copy() {
		let a = this;
		let b = a.radicand.copy();
		let c = a.index;
		let d = new Radical(b, c);
		return d;
	}
	
	multiply(b) {
		let a = this;
		if (b instanceof Radical) {
			if (a.index == b.index) {
				return new Radical(a.radicand.multiply(b.radicand), a.index);
			} else if (a.radicand.equals(b.radicand)) {
				let c = a.index;
				let d = b.index;
				return new Radical(a.radicand.power(new Fraction(lcm(c, d) * (c + d), c * d)), lcm(c, d));
			} else {
				let c = new Radical(a.radicand.power(new Fraction(lcm(a.index, b.index), a.index)));
				let d = new Radical(b.radicand.power(new Fraction(lcm(a.index, b.index), b.index)));
				return c.multiply(d);
			}
		} else {
			throw new Error("Multiplicand must be of type Radical");
		}
	}
	
	divide(b) {
		let a = this;
		if (b instanceof Radical) {
			if (a.index == b.index) {
				return new Radical(a.radicand.divide(b.radicand), a.index);
			} else if (a.radicand.equals(b.radicand)) {
				let c = a.index;
				let d = b.index;
				return new Radical(a.radicand.power(new Fraction(lcm(c, d) * (c - d), c * d)), lcm(c, d));
			} else {
				let c = new Radical(a.radicand.power(new Fraction(lcm(a.index, b.index), a.index)));
				let d = new Radical(b.radicand.power(new Fraction(lcm(a.index, b.index), b.index)));
				return c.divide(d);
			}
		} else {
			throw new Error("Divisor must be of type Radical");
		}
	}
	
	equals(b) {
		let a = this;
		return a.radicand.equals(b.radicand) && a.index == b.index;
	}
	
	toString() {
		let a = this;
		let b = a.radicand.toString();
		console.log(b, a.index);
		let d = "root(" + a.index + ", " + b + ")";
		if (a.index == 2) {
			d = "\u221A(" + b + ")";
		}
		return d;
	}
}