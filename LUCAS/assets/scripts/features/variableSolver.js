/* global Expression */
/* global Equation */
/* global Num */
/* global Term */

// TODO: possibly implement Newton's method in order to solve any degree polynomials (links are below)
// The algorithm: https://en.wikipedia.org/wiki/Newton%27s_method
// Possible pseudocode: http://campus.murraystate.edu/academic/faculty/wlyle/420/Newton.htm

let solveLinear = (left, right, varNames) => {
	let output = [];
	for (let varName of varNames) {
		let newLeft = [];
		let newRight = [];
		let coef;
		for (let term of left) {
			let termVars = Object.keys(term.variables);
			if (termVars.includes(varName)) {
				coef = term.coefficient;
				newLeft.push(term);
			} else {
				newRight.push(term.multiply(-1));
			}
		}
		newRight = newRight.concat(right);
		let leftExpr = new Expression(newLeft).divide(coef);
		let rightExpr = new Expression(newRight).divide(coef);
		output.push(leftExpr.toString() + " = " + rightExpr.toString());
	}
	return output.join("\n");
};

let solveQuadratic = (a, b, c, varName) => {
	let determinantNum = b.power(2).subtract(a.multiply(c).multiply(4));
	let determinant = eval(determinantNum.toString());
	if (determinant > 0) {
		let ans1 = new Expression(b.multiply(-1)).add(determinantNum.power(1 / 2)).divide(a.multiply(2));
		let ans2 = new Expression(b.multiply(-1)).subtract(determinantNum.power(1 / 2)).divide(a.multiply(2));
		console.log(ans2);
		ans1 = ans1.toString();
		ans2 = ans2.toString();
		return varName + " = " + ans1.toString() + ", " + ans2.toString();
	} else if (determinant == 0) {
		let ans = new Expression(b.multiply(-1)).divide(a.multiply(2));
		return varName + " = " + ans.toString();
	} else {
		return "No real solution";
	}
};

let solveEquation = equation => {
	equation = Equation.fromString(equation);
	let order = 0;
	let varNames = new Set();
	for (let i = 0; i < equation.lhs.terms.length; i++) {
		let term = equation.lhs.terms[i];
		let vars = term.variables;
		let termVarNames = Object.keys(vars);
		if (termVarNames.length != 1) throw new Error("Not supported yet: Non-constant terms must have exactly one variable");
		let varOrder = vars[termVarNames[0]];
		if (varOrder > order) order = varOrder;
		termVarNames.forEach(Set.prototype.add, varNames);
	}
	if (order == 0) {
		return (equation.rhs.terms.length == 0).toString();
	} else if (order == 1) {
		return solveLinear(equation.lhs.terms, equation.rhs.terms, varNames.values());
	} else {
		if (equation.rhs.terms.length == 0) equation.rhs.terms.push(new Term(0));
		if (equation.rhs.terms.length == 1) {
			if (order == 2) {
				if (varNames.size > 1) throw new Error("Not supported yet: Number of variables of quadratic must be exactly one");
				let a = new Num(0);
				let b = new Num(0);
				let c = equation.rhs.terms[0].coefficient.multiply(-1);
				for (let i = 0; i < equation.lhs.terms.length; i++) {
					let term = equation.lhs.terms[i];
					let variables = term.variables;
					let variableNames = Object.keys(variables);
					if (variables[variableNames[0]] == 2) {
						a = a.add(term.coefficient);
					} else {
						b = b.add(term.coefficient);
					}
				}
				return solveQuadratic(a, b, c, varNames.values().next().value);
			} else {
				throw new Error("Not supported yet: Equation may have a maximum degree of 2");
			}
		} else {
			throw new Error("Not supported yet: Constants must simplify to a single term");
		}
	}
};