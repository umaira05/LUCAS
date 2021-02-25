class Variable {
	constructor(name = "x", degree = 1) {
		let a = this;
		if (typeof name == "string") {
			if (typeof degree == "number") {
				if (Math.sign(degree) == 1 && !(degree % 1)) {
					a.name = name;
					a.degree = degree;
				} else {
					throw new Error("Degree must be a natural number");
				}
			} else {
				throw new Error("Degree must be of type Number");
			}
		} else {
			throw new Error("Name must be of type String");
		}
	}
	
	copy() {
		let a = this;
		let b = a.name;
		let c = a.degree;
		let d = new Variable(b, c);
		return d;
	}
	
	multiply(b) {
		let a = this;
		if (b instanceof Variable) {
			if (a.name == b.name) {
				let c = a.name;
				let d = a.degree + b.degree;
				let e = new Variable(c, d);
				return e;
			} else {
				throw new Error("Multiplicands must have same variable name");
			}
		} else {
			throw new Error("Multiplicand must be of type Variable");
		}
	}
	
	power(b) {
		let a = this;
		if (typeof b == "number") {
			if (Math.sign(b) == 1 && !(b % 1)) {
				let c = a.name;
				let d = a.degree * b;
				let e = new Variable(c, d);
				return e;
			} else {
				throw new Error("Exponent must be a natural number");
			}
		} else {
			throw new Error("Exponent must be of type Number");
		}
	}
	
	toString() {
		let a = this;
		let b = a.name;
		let c = a.degree.toString();
		let d = b;
		let e = ["\u2070", "\xB9", "\xB2", "\xB3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079"];
		for (let i = 0; i < c.length; i++) d += e[c.charAt(i)];
		return d;
	}
}