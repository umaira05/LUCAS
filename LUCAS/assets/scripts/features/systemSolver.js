/* global simplifyExpr */
/* global Equation */
/* global Matrix */
/* global Num */

let parseSystem = equations => {
	let coefMatrix = [];
	let varPositions = [];
	let ansMatrix = [];
	for (let i = 0; i < equations.length; i++) {
		let equation = Equation.fromString(equations[i]);
		let left = equation.lhs.terms;
		let right = equation.rhs.terms;
		if (right.length == 1) {
			ansMatrix.push([right[0].coefficient.copy()]);
		} else if (right.length == 0) {
			ansMatrix.push([new Num(0)]);
		} else {
			throw new Error("Number of constants must be one");
		}
		let coefRow = new Array(varPositions.length).fill(0);
		for (let term of left) {
		    let variables = term.variables;
			let variableNames = Object.keys(variables);
			if (variableNames.length == 1 && variables[variableNames[0]] == 1) {
				let index = varPositions.indexOf(variableNames[0]);
				if (index == -1) {
					varPositions.push(variableNames[0]);
					coefRow.push(term.coefficient);
				} else {
					coefRow[index] = term.coefficient;
				}
			} else {
				throw new Error("System of equations must be linear");
			}
		}
		coefMatrix.push(coefRow);
	}
	for (let coefRow of coefMatrix) while (coefRow.length < varPositions.length) coefRow.push(0);
	let coef = new Matrix(coefMatrix);
	let ans = new Matrix(ansMatrix);
	return [coef, varPositions, ans];
};

let matrixSolveSystem = (coef, ans) => coef.inverse().multiply(ans).elements.map(element => element[0]);

let solveSystem = equations => {
	let [coef, varPositions, ans] = parseSystem(equations);
	let varVals = matrixSolveSystem(coef, ans);
	let output = varPositions.map((name, index) => name + " = " + varVals[index]).sort().join("\n");
	return output;
};