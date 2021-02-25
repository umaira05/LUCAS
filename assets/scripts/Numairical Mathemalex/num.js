/* global Fraction */
/* global Radical */

class Num {
	constructor(b = 1, c = new Radical(1)) {
		let a = this;
		if (b instanceof Fraction) {
			a.coefficient = b;
		} else if (typeof b == "number") {
			b = new Fraction(b);
			a.coefficient = b;
		} else {
			throw new Error("Coefficient must be of type Fraction or Number");
		}
		if (c instanceof Radical) {
			if (c.index == 2) {
				a.radical = c;
			} else {
				throw new Error("Only square roots are supported");
			}
		} else {
			throw new Error("Radical must be of type Radical");
		}
		a.simplify();
	}
	
	copy() {
		let a = this;
		let b = a.coefficient.copy();
		let c = a.radical.copy();
		let d = new Num(b, c);
		return d;
	}
	
	like(b) {
		let a = this;
		if (b instanceof Num) {
			return a.radical.equals(b.radical);
		} else {
			throw new Error("Nums can only be like with other Nums");
		}
	}
	
	multiply(b) {
		let a = this;
		if (b instanceof Num) {
			let c = a.coefficient.multiply(b.coefficient);
			let d = a.radical.multiply(b.radical);
			let e = new Num(c, d);
			e.simplify();
			return e; 
		} else if (b instanceof Radical) {
			let c = a.copy();
			c.radical = c.radical.multiply(b);
			c.simplify();
			return c;
		} else if (b instanceof Fraction || typeof b == "number") {
			let c = a.copy();
			c.coefficient = c.coefficient.multiply(b);
			return c;
		} else {
			throw new Error("Multiplicand must be of type Num, Radical, Fraction, or Number");
		}
	}
	
	divide(b) {
		let a = this;
		if (b instanceof Num) {
			let c = a.coefficient.divide(b.coefficient);
			let d = a.radical.divide(b.radical);
			let e = new Num(c, d);
			e.simplify();
			return e;
		} else if (b instanceof Radical) {
			let c = a.copy();
			c.radical = c.radical.divide(b);
			c.simplify();
			return c;
		} else if (b instanceof Fraction || typeof b == "number") {
			let c = a.copy();
			c.coefficient = c.coefficient.divide(b);
			return c;
		} else {
			throw new Error("Divisor must be of type Num, Radical, Fraction, or Number");
		}
	}
	
	add(b) {
		let a = this;
		if (b instanceof Num) {
			b.simplify();
			if (a.radical.equals(b.radical)) {
				let c = a.coefficient.add(b.coefficient);
				let d = a.radical.copy();
				let e = new Num(c, d);
				e.simplify();
				return e;
			} else {
				throw new Error("Addends must have the same radical");
			}
		} else if (b instanceof Radical) {
			let c = new Num(1, b);
			c.simplify();
			return a.add(c);
		} else if (b instanceof Fraction || typeof b == "number") {
			let c = new Num(b, 1);
			return a.add(c);
		} else {
			throw new Error("Addend must be of type Num, Radical, Fraction, or Number");
		}
	}
	
	subtract(b) {
		let a = this;
		if (b instanceof Num) {
			b.simplify();
			if (a.radical.equals(b.radical)) {
				let c = a.coefficient.subtract(b.coefficient);
				let d = a.radical;
				let e = new Num(c, d);
				e.simplify();
				return e;
			} else {
				throw new Error("Subtrahend and Minuend must have the same radical");
			}
		} else if (b instanceof Radical) {
			let c = new Num(1, b);
			c.simplify();
			return a.subtract(c);
		} else if (b instanceof Fraction || typeof b == "number") {
			let c = new Num(b, 1);
			return a.subtract(c);
		} else {
			throw new Error("Subtrahend must be of type Num, Radical, Fraction, or Number");
		}
	}
	
	power(b) {
		let a = this;
		if (b instanceof Fraction || typeof b == "number") {
			let neg;
			if (b instanceof Fraction) {
				if (b.numerator > 1 || b.numerator < -1) {
					return a.power(new Fraction(1, b.denominator)).power(b.numerator);
				}
				neg = (Math.sign(b.numerator) == -1);
				b = new Fraction(Math.abs(b.numerator), b.denominator);
			} else {
				neg = (Math.sign(b) == -1);
				b = Math.abs(b);
			}
			let c = a.coefficient.power(b);
			let d = a.radical.radicand.power(b);
			let g;
			if (c instanceof Radical) {
				if (d instanceof Radical) {
					g = c.multiply(new Radical(d.radicand, d.index * a.radical.index));
				} else {
					g = c.multiply(new Radical(d, a.radical.index));
				}
				let h = new Num(1, g);
				if (neg) h = new Num(1).divide(h);
				h.simplify();
				return h;
			} else {
				if (d instanceof Radical) {
					g = new Radical(d.radicand, d.index * a.radical.index);
				} else {
					g = new Radical(d, a.radical.index);
				}
				let h = new Num(c, g);
				if (neg) h = new Num(1).divide(h);
				h.simplify();
				return h;
			}
		} else {
			throw new Error("Exponent must be of type Fraction or Number");
		}
	}
	
	simplify() {
		let a = this;
		let b = a.coefficient.numerator;
		let c = a.coefficient.denominator;
		let d = a.radical.radicand.numerator;
		let e = a.radical.radicand.denominator;
		let f = new Fraction(b, c * e);
		let g = new Radical(d * e, a.radical.index);
		for (let i = Math.floor(g.radicand.numerator ** (1 / g.index)); i > 1; i--) {
			let j = i ** g.index;
			if (!(g.radicand.numerator % j)) {
				f = f.multiply(i);
				g.radicand.numerator /= j;
			}
		}
		a.coefficient = f;
		a.radical = g;
	}
	
	toString() {
		let a = this;
		let b = a.coefficient;
		let c = a.radical;
		let d = "";
		if (b.equals(new Fraction()) || c.equals(new Radical())) {
			d += "0";
		} else {
			if (c.equals(new Radical(1))) {
				d = b.toString();
			} else {
				if (b.equals(new Fraction(-1))) {
					d += "-";
				} else if (!b.equals(new Fraction(1))) {
					d += b.toString();
				}
				d += c.toString();
			}
		}
		return d;
	}
}