/* global simplifyExpr */
/* global solveSystem */
/* global solveEquation */

let resizeBoxes = () => {
	let IDs = ["input", "output"];
	for (let ID of IDs) {
		let element = document.getElementById(ID);
		element.style.height = "auto";
		if (element.style.height != element.scrollHeight + "px") {
			element.style.height = element.scrollHeight + "px";
		}
	}
};

let updateResult = () => {
	let a = document.getElementById("input").value;
	let b;
	try {
		let c = a.split(/[\n;,]/).filter(d => !(/$\s*^/).test(d));
		if (c.length == 0) {
			b = "";
		} else if (c.length == 1) {
			let d = c[0];
			let e = d.split("=");
			if (e.length == 1) {
				let f = e[0];
				b = simplifyExpr(f).toString();
				if (b == "Infinity") {
					throw new Error("Value too high");
				} else if (b == "-Infinity") {
					throw new Error("Value too low");
				}
			} else if (e.length > 1) {
				b = solveEquation(d);
			}
		} else if (c.length > 1) {
			b = solveSystem(c);
		}
	} catch(err) {
		console.log(err);
		b = err;
	}
	document.getElementById("output").value = b;
	resizeBoxes();
};

let example = () => {
	let simplify = ["(x + y)^3", "(x - y)^2 * (x + y)^2", "(x - 1)(x^5 + x^4 + x^3 + x^2 + x + 1) + 1"];
	let quadratic = ["2x^2 + 3x + 5 = 25", "n^2 = 384", "y = y^2"];
	let linear = ["13x = 34.5", "w + 3x + 4y + 6z = 96", "2(x + (3 * (-(x + 5) - 2) + 3) * 5)  = -187"];
	let system = ["x + y = 5; x - y = 12", "x + y + z = 5, x + y = 5, x = 7", "x + y + z = 12\nx - y - z = 15\n2x + 3y + 4z = 20"];
	let boolean = ["3/4x + 5 = 3/4x - 5", "4x - 12 = 2 * (2 * (x - 3))", "(a - b)(a + b) = a^2 - b^2"];
	let examples = [].concat(simplify, quadratic, linear, system, boolean);
	let rn = Math.floor(Math.random() * examples.length);
	let example = examples[rn];
	document.getElementById("input").value = example;
	resizeBoxes();
};

document.getElementById("example").onclick = example;
document.getElementById("go").onclick = updateResult;
document.getElementById("input").oninput = document.getElementById("input").oninput = resizeBoxes;