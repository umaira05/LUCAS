/* global Expression */
/* global simplifyExpr */

class Equation {
    constructor(b, c) {
        let a = this;
        if (b instanceof Expression && c instanceof Expression) {
            a.lhs = b.copy();
            let d = b.copy();
            a.rhs = c.copy();
            let e = c.copy();
            for (let f of d.terms) {
                let g = Object.keys(f.variables).length;
                if (!g) {
                    a.lhs = a.lhs.subtract(f);
                    a.rhs = a.rhs.subtract(f);
                }
            }
            for (let f of e.terms) {
                let g = Object.keys(f.variables).length;
                if (g) {
                    a.rhs = a.rhs.subtract(f);
                    a.lhs = a.lhs.subtract(f);
                }
            }
        } else {
            throw new Error("Left hand side and right hand side must be of type Expression");
        }
    }
    
    static fromString(a) {
        let b = a.split("=");
		if (b.length != 2) throw new Error("An equation must have exactly one equals sign");
		let c = new Equation(simplifyExpr(b[0]), simplifyExpr(b[1]));
		return c;
    }
    
    toString() {
        let a = this;
        let b = a.lhs.toString();
        let c = a.rhs.toString();
        let d = b + " = " + c;
        return d;
    }
}