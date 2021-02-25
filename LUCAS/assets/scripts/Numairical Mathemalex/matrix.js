/* global Num */

class Matrix {
	constructor(b) {
		let a = this;
		if (Matrix.isValid(b)) {
			a.elements = b;
		} else {
			throw new Error("Invalid matrix");
		}
	}
	
	static isValid(a) {
		if (!(a instanceof Array)) return false;
		let b = a.length;
		let c;
		for (let row = 0; row < b; row++) {
			let d = a[row];
			if (!(d instanceof Array)) return false;
			let e = d.length;
			if (c === undefined) c = e;
			if (e != c) return false;
			for (let col = 0; col < c; col++) {
				let f = d[col];
				if (typeof f == "number") {
					a[row][col] = new Num(f);
				} else if (!(f instanceof Num)) {
					return false;
				}
			}
		}
		return true;
	}
	
	element(b, c) {
		let a = this;
		let [d, e] = a.size();
		if (Number.isInteger(b) && Number.isInteger(c) && b >= 1 && b <= d && c >= 1 && c <= e) {
			return a.elements[b - 1][c - 1];
		} else {
			throw new Error("Cannot get element: Invalid row and/or column");
		}
	}
	
	size() {
		let a = this;
		let b = a.elements;
		let c = b.length;
		let d = c ? [c, b[0].length] : [0, 0];
		return d;
	}
	
	negative() {
		let a = this;
		let b = a.elements;
		let c = b.map(d => d.map(e => e.multiply(-1)));
		return new Matrix(c);
	}
	
	submatrix(b, c) {
		let a = this;
		let d = a.elements;
		let [e, f] = a.size();
		let g = [];
		for (let h = 0; h < e; h++) {
			if (h != b - 1) {
				let i = [];
				for (let j = 0; j < f; j++) {
					if (j != c - 1) {
						let k = d[h][j];
						i.push(k);
					}
				}
				g.push(i);
			}
		}
		return new Matrix(g);
	}
	
	isSquare() {
		let a = this;
		let [b, c] = a.size();
		return b == c;
	}
	
	determinant() {
		let a = this;
		let b = a.elements;
		let [c, d] = a.size();
		if (c == d) {
			if (c == 1) {
				let e = b[0][0];
				return e;
			} else {
				let e = -1;
				let f = 1;
				let g = b[0];
				let h = g.reduce((i, j) => i.add(j.multiply(a.submatrix(1, f++).determinant()).multiply(e *= -1)), new Num(0));
				return h;
			}
		} else {
			throw new Error("Cannot calculate determinant: Matrix is not square");
		}
	}
	
	minors() {
		let a = this;
		let [b, c] = a.size();
		let d = [];
		for (let e = 0; e < b; e++) {
			let f = [];
			for (let g = 0; g < c; g++) {
				let h = a.submatrix(e + 1, g + 1).determinant();
				f.push(h);
			}
			d.push(f);
		}
		return new Matrix(d);
	}
	
	cofactors() {
		let a = this;
		let b = a.minors();
		let c = b.elements;
		let d = c.map((e, f) => e.map((g, h) => g.multiply((-1) ** (f + h))));
		return new Matrix(d);
	}
	
	transpose() {
		let a = this;
		let b = a.elements;
		let [c, d] = a.size();
		let e = [];
		for (let f = 0; f < d; f++) {
			let g = [];
			for (let h = 0; h < c; h++) {
				let i = b[h][f];
				g.push(i);
			}
			e.push(g);
		}
		return new Matrix(e);
	}
	
	adjugate() {
		let a = this;
		let b = a.cofactors();
		let c = b.transpose();
		return c;
	}
	
	inverse() {
		let a = this;
		let b = a.elements;
		let [c, d] = a.size();
		if (c == 1 && d == 1) {
			let e = [[new Num().divide(b[0][0])]];
			return new Matrix(e);
		} else {
			let e = a.adjugate();
			let f = a.determinant();
			if (f == 0) {
				throw new Error("Inverse matrix does not exist: Determinant is 0");
			} else {
				let g = e.multiply(new Num().divide(f));
				return g;
			}
		}
	}
	
	add(b) {
		let a = this;
		let c = a.elements;
		let d = b.elements;
		let [e, f] = a.size();
		let [g, h] = b.size();
		if (e == g && f == h) {
			let i = [];
			for (let j = 0; j < e; j++) {
				let k = [];
				for (let l = 0; l < f; l++) {
					let m = c[j][l].add(d[j][l]);
					k.push(m);
				}
				g.push(i);
			}
			return new Matrix(i);
		} else {
			throw new Error("Cannot add matrices: Size mismatch");
		}
	}
	
	subtract(b) {
		let a = this;
		let c = a.elements;
		let d = b.elements;
		let [e, f] = a.size();
		let [g, h] = b.size();
		if (e == g && f == h) {
			let i = [];
			for (let j = 0; j < e; j++) {
				let k = [];
				for (let l = 0; l < f; l++) {
					let m = c[j][l].substract(d[j][l]);
					k.push(m);
				}
				g.push(i);
			}
			return new Matrix(i);
		} else {
			throw new Error("Cannot subtract matrices: Size mismatch");
		}
	}
	
	multiply(b) {
		let a = this;
		let c = a.elements;
		let [d, e] = a.size();
		if (b instanceof Matrix) {
			let [f, g] = b.size();
			if (e == f) {
				let h = b.transpose();
				let i = h.elements;
				let j = c.map(k => i.map(l => l.reduce((m, n, o) => m.add(n.multiply(k[o])), new Num(0))));
				return new Matrix(j);
			} else {
				throw new Error("Cannot multiply matrices: Number of columns of first matrix must equal number of rows of second matrix");
			}
		} else if (b instanceof Num || typeof b == "number") {
			let f = c.map(g => g.map(h => h.multiply(b)));
			return new Matrix(f);
		}
	}
	
	toString() {
		let a = this;
		let str = "";
		for (let i = 0; i < a.elements.length; i++) {
			for (let j = 0; j < a.elements[i].length; j++) {
				str += a.elements[i][j].toString() + " ";
			}
			str += "\n";
		}
		return str;
	}
}